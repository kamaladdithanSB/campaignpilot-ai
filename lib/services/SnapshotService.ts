import { prisma } from '../prisma';

export class SnapshotService {
  static async createSnapshot(customerIds: string[]) {
    return await prisma.segmentSnapshot.create({
      data: {
        customerIds: JSON.stringify(customerIds),
        count: customerIds.length,
      }
    });
  }

  static async getCustomersInSnapshot(snapshotId: string) {
    const snapshot = await prisma.segmentSnapshot.findUnique({
      where: { id: snapshotId }
    });
    if (!snapshot) return [];
    return JSON.parse(snapshot.customerIds);
  }
}
