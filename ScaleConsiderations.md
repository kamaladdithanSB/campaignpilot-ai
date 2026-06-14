# Scale Considerations & Future Evolution

CampaignPilot is designed with a "Single Instance First, Distributed Later" philosophy. This document outlines how the architecture evolves as load and complexity increase.

## 1. Data Layer Scaling
*   **Near Term**: SQLite is sufficient for < 100k customers.
*   **Mid Term**: Migrate to **PostgreSQL** (via Prisma) to support concurrent writes from external workers and multiple UI sessions.
*   **Long Term**: Implement **Partitions** on `DeliveryLog` and `Order` tables as history grows into the millions.

## 2. Queueing & Async Processing
*   **Current**: In-process `Async/Await` and timeouts simulate background work.
*   **Future**: Introduce **BullMQ (Redis)** or **Kafka**.
    *   Essential for handling retry logic (e.g., if the Channel Service is down).
    *   Ensures CRM isn't blocked by long-running AI generation tasks.

## 3. Communication Paradigm
*   **Evolution**: Replace HTTP Polling with **WebSockets** or **Server-Sent Events (SSE)**.
*   **Impact**: Enables real-time "Streaming reasoning" where the UI updates as agents think, creating a more responsive AI-native experience.

## 4. Service Decoupling
*   **Evolution**: Extract the **Channel Service** and **AI Agents** into independent microservices.
*   **Language**: Consider **Python** for the AI Orchestration layer to leverage better LLM/Data-science libraries, while keeping the CRM in **Next.js** for the best UI experience.

## 5. Security & Multi-tenancy
*   **Future**: Implement Row Level Security (RLS) in the DB to ensure data isolation between different business users using the same instance.
