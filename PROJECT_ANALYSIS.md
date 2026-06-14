# Project Analysis: CampaignPilot AI Dashboard

## 1. Frontend Architecture
- **Framework**: Next.js 16 (using App Router).
- **Styling**: Tailwind CSS 4 with custom `globals.css` for advanced animations and glassmorphism effects.
- **Component Library**: shadcn/ui components (Radix UI based) and Base UI.
- **State Management**: React `useState`, `useEffect`, and `useRef` for local and UI state.
- **Key Features**:
  - **Dynamic Workflow**: A multi-step dashboard flow (Connect Data -> Analyze -> Strategy -> Execution -> Dashboard).
  - **AI Reasoning Engine**: UI components like `AIReasoningEngine` and `AIExplainabilityPanel` visualize the "why" behind AI decisions.
  - **Real-time Updates**: Uses polling (`/api/campaigns/status`) to update campaign status and metrics during execution.
  - **Visualizations**: Uses `recharts` for performance and executive dashboards.

## 2. Backend Architecture
- **Environment**: Next.js Route Handlers (Server Components/API Routes).
- **Service Layer**:
  - `CustomerIntelligenceService`: Analyzes SQLite data to segment customers (High Value, At-Risk, etc.).
  - `StrategyEngine`: Contains the logic for interpreting prompts, building reasoning, and simulating metrics.
  - `ChannelService`: A mock execution service that simulates email/SMS delivery and fires webhooks back to the application.
  - `SnapshotService`: Manages customer list snapshots for campaign auditability.
- **Pattern**: Service-oriented architecture within the `lib/` directory, used by API routes in `app/api/`.

## 3. Database Structure
- **Database**: SQLite (local `dev.db`).
- **ORM**: Prisma.
- **Key Models**:
  - `Customer`: Core customer data.
  - `Order`: Transaction history linked to customers.
  - `Campaign`: Stores strategy (JSON), status, and references snapshots.
  - `SegmentSnapshot`: Immutable list of customers at the time of campaign launch.
  - `CampaignMetrics`: Aggregated performance data (sent, delivered, opened, clicked, conversions, revenue).
  - `DeliveryLog`: Individual delivery event logs.

## 4. Authentication Flow
- **Current State**: No explicit authentication (Auth.js/Clerk/Supabase) is implemented in the provided codebase.
- **Observations**: The dashboard is open, and data loading is handled via a modal (`DataSourcesModal`), primarily focusing on the demo-able AI flow.

## 5. AI Integration
- **Provider**: Google Generative AI (Gemini 2.0 Flash).
- **Agent Orchestration**:
  - Uses an "Agent" pattern in `lib/agents/`.
  - `GoalInterpreterAgent`: Interprets natural language prompts into campaign objectives.
  - `AudienceAgent`: Matches goals to specific customer segments.
  - `ContentAgent`: Generates multi-channel message templates.
- **Reasoning Engine**: Every agent returns both `output` (the action) and `reasoning` (the explanation), which is surfaced in the UI to build user trust.
- **Fallback**: Contains robust fallback logic in `StrategyEngine.ts` and agent classes to handle cases where the Gemini API key is missing.

## 6. Deployment Architecture
- **Platform**: Designed for Vercel (includes `@vercel/analytics`).
- **Database**: Currently uses local SQLite (`file:./dev.db`). For production, this would typically migrate to a managed Postgres instance (like Vercel Postgres or Supabase).
- **Environment Variables**:
  - `DATABASE_URL`: Prisma connection string.
  - `GEMINI_API_KEY`: API key for Google Gemini.
  - `NEXT_PUBLIC_APP_URL`: Used for callback webhooks.

---
*Created by Gemini CLI*
