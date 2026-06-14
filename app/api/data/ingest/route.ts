import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CustomerIntelligenceService } from '@/lib/services/CustomerIntelligenceService';
import Papa from 'papaparse';

function normalizeKey(key: string): string {
  return key.toLowerCase().trim().replace(/[\s_-]+/g, '');
}

function normalizeRow(row: Record<string, unknown>): Record<string, unknown> {
  const normalized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    const nk = normalizeKey(key);
    normalized[nk] = value;
  }

  const email =
    normalized.email ||
    normalized.customeremail ||
    normalized.e_mail ||
    normalized.mail;
  if (email) normalized.email = email;

  const name =
    normalized.name ||
    normalized.fullname ||
    normalized.customername ||
    normalized.firstname;
  if (name) normalized.name = name;

  const amount =
    normalized.amount ||
    normalized.orderamount ||
    normalized.price ||
    normalized.total ||
    normalized.revenue ||
    normalized.ordervalue ||
    normalized.sales;
  if (amount) normalized.amount = amount;

  const orderDate =
    normalized.orderdate ||
    normalized.purchasedate ||
    normalized.date ||
    normalized.transactiondate ||
    normalized.createdat;
  if (orderDate) normalized.orderdate = orderDate;

  const customerId =
    normalized.customerid || normalized.custid || normalized.userid;
  if (customerId) normalized.customerid = customerId;

  return normalized;
}

function cleanEmail(val: unknown): string {
  return (val?.toString() || '').trim().toLowerCase();
}

function cleanAmount(val: unknown): number | null {
  if (typeof val === 'number' && !isNaN(val)) return val;
  const valStr = (val?.toString() || '').trim();
  const cleaned = valStr.replace(/[^0-9.-]+/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? null : parsed;
}

function parseOrderDate(val: unknown): Date | null {
  if (!val) return null;
  const parsed = new Date(val.toString());
  return isNaN(parsed.getTime()) ? null : parsed;
}

export async function POST(req: Request) {
  const startTime = Date.now();
  const failedRows: { row: number; error: string; type: 'customer' | 'order' }[] = [];
  let customersAdded = 0;
  let ordersAdded = 0;

  try {
    const formData = await req.formData();
    const customersFile = formData.get('customers') as File | null;
    const ordersFile = formData.get('orders') as File | null;

    if (!customersFile && !ordersFile) {
      return NextResponse.json({ success: false, error: 'No files provided' }, { status: 400 });
    }

    if (customersFile) {
      const customersText = await customersFile.text();
      const parsed = Papa.parse(customersText, { header: true, skipEmptyLines: true });

      const existingCustomers = await prisma.customer.findMany({ select: { email: true } });
      const knownEmails = new Set(existingCustomers.map((c) => c.email));

      const CHUNK_SIZE = 100;
      for (let i = 0; i < parsed.data.length; i += CHUNK_SIZE) {
        const chunk = parsed.data.slice(i, i + CHUNK_SIZE);
        const dataToInsert: { id: string; email: string; name: string }[] = [];

        chunk.forEach((row: unknown, idx: number) => {
          const norm = normalizeRow(row as Record<string, unknown>);
          const email = cleanEmail(norm.email);
          const name = (norm.name?.toString() || 'Customer').trim();

          if (!email) {
            failedRows.push({ row: i + idx + 2, error: 'Missing customer email', type: 'customer' });
            return;
          }

          if (knownEmails.has(email)) return;
          knownEmails.add(email);

          dataToInsert.push({
            id: crypto.randomUUID(),
            email,
            name,
          });
        });

        if (dataToInsert.length > 0) {
          await prisma.customer.createMany({ data: dataToInsert });
          customersAdded += dataToInsert.length;
        }
      }
    }

    if (ordersFile) {
      const ordersText = await ordersFile.text();
      const parsed = Papa.parse(ordersText, { header: true, skipEmptyLines: true });

      let customersLookup = await prisma.customer.findMany({
        select: { id: true, email: true },
      });
      const customerMapByEmail = new Map(customersLookup.map((c) => [c.email, c.id]));
      const customerMapById = new Map(customersLookup.map((c) => [c.id, c.id]));

      const CHUNK_SIZE = 100;
      for (let i = 0; i < parsed.data.length; i += CHUNK_SIZE) {
        const chunk = parsed.data.slice(i, i + CHUNK_SIZE);
        const dataToInsert: {
          id: string;
          amount: number;
          customerId: string;
          orderDate: Date;
        }[] = [];
        const customersToCreate: { id: string; email: string; name: string }[] = [];

        chunk.forEach((row: unknown, idx: number) => {
          const norm = normalizeRow(row as Record<string, unknown>);
          const email = cleanEmail(norm.email);
          const customerIdRef = norm.customerid?.toString().trim();
          const amount = cleanAmount(norm.amount);
          const orderDate = parseOrderDate(norm.orderdate) || new Date();

          if (amount === null) {
            failedRows.push({ row: i + idx + 2, error: 'Invalid amount format', type: 'order' });
            return;
          }

          let customerId: string | undefined;

          if (customerIdRef && customerMapById.has(customerIdRef)) {
            customerId = customerMapById.get(customerIdRef);
          } else if (email && customerMapByEmail.has(email)) {
            customerId = customerMapByEmail.get(email);
          } else if (email) {
            const newId = crypto.randomUUID();
            const name = email.split('@')[0] || 'Customer';
            customersToCreate.push({ id: newId, email, name });
            customerMapByEmail.set(email, newId);
            customerMapById.set(newId, newId);
            customerId = newId;
          }

          if (!customerId) {
            failedRows.push({
              row: i + idx + 2,
              error: 'Missing customer email or customer ID',
              type: 'order',
            });
            return;
          }

          dataToInsert.push({
            id: crypto.randomUUID(),
            amount,
            customerId,
            orderDate,
          });
        });

        if (customersToCreate.length > 0) {
          await prisma.customer.createMany({ data: customersToCreate });
          customersAdded += customersToCreate.length;
        }

        if (dataToInsert.length > 0) {
          await prisma.order.createMany({ data: dataToInsert });
          ordersAdded += dataToInsert.length;
        }
      }
    }

    const intelligence = await CustomerIntelligenceService.discoverSegments();
    const ingestionTimeMs = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      customersImported: intelligence.totalCustomers,
      ordersImported: intelligence.totalOrders,
      customersAdded,
      ordersAdded,
      totalRevenue: `$${intelligence.totalRevenue.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      totalRevenueRaw: intelligence.totalRevenue,
      averageOrderValue: `$${intelligence.averageOrderValue.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      averageOrderValueRaw: intelligence.averageOrderValue,
      segments: intelligence.segments.map((s) => ({
        id: s.id,
        name: s.name,
        description: s.description,
        customerCount: s.customerCount,
        revenueContribution: s.revenueContribution,
        revenuePercent: Math.round(s.revenuePercent * 10) / 10,
      })),
      ingestionTimeMs,
      failedRows: failedRows.slice(0, 50),
      totalErrors: failedRows.length,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to ingest data';
    console.error('Ingestion failure:', message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
