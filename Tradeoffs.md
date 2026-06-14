# Architectural Tradeoffs

This document outlines the engineering decisions made during the initial backend build of CampaignPilot.

## 1. Persistence: SegmentSnapshots vs. Live Queries
*   **Decision**: Introduced `SegmentSnapshot` to store the audience at launch time.
*   **Pros**: 
    *   **Immutability**: Historical campaign reporting remains accurate even if customers change segments later.
    *   **Auditability**: Provides a clear record of exactly who was targeted.
*   **Cons**:
    *   **Storage Overhead**: Duplicate storage of customer-to-campaign mappings.
    *   **Complexity**: Requires a snapshotting step before campaign execution.

## 2. Shared State: CampaignStrategy vs. Decoupled Parameters
*   **Decision**: Central `CampaignStrategy` object shared across AI agents.
*   **Pros**:
    *   **Cohesion**: Ensures all agents (Goal, Audience, Content) are operating on the same context.
    *   **UI Power**: All "Reasoning" is stored in one place for the AI Engine visualization.
*   **Cons**:
    *   **Tight Coupling**: Changes to the goal schema might affect the content agent.

## 3. Communication: Polling vs. WebSockets (Current MVP)
*   **Decision**: Initial implementation uses Short Polling for status updates.
*   **Pros**:
    *   **Speed of Implementation**: Zero infrastructure setup (no Redis/Socket.io).
    *   **Reliability**: Works well over standard HTTP with current throughput.
*   **Cons**:
    *   **Latency**: Status updates are not "instant" (delay up to 2-3 seconds).
    *   **Resource Usage**: Higher server overhead if user count scales significantly.

## 4. Database: SQLite vs. Externally Managed DB
*   **Decision**: SQLite + Prisma.
*   **Pros**:
    *   **Zero-Config**: Filesystem-based, perfect for local development and rapid iterations.
    *   **Performance**: Extremely low latency for single-user scenarios.
*   **Cons**:
    *   **Concurrency**: Limited write concurrency (not suitable for multi-node deployments).
