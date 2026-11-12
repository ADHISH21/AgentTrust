# AgentTrust — Intent Firewall for Agentic Commerce

**AI agents can pay. But should they?** AgentTrust converts human purchasing instructions into structured policies, deterministically evaluates agent-proposed transactions, and permits PayPal Sandbox checkout only after authorization.

Built for the **PayPal AI Hackathon (November 2026)**. This is a functional proof of concept, not production payment-security infrastructure.

## Features

- **Gemini intent compiler** extracts purchase purpose, USD limit, allowed categories, optional merchant allowlist, expiry, and extraction confidence into strictly validated JSON.
- **Deterministic policy engine** blocks category mismatch, merchant mismatch, overspending, and expired instructions. Uncertain intent or absent product evidence requires review.
- **Human review** binds approval to a server-stored transaction record; hard policy violations cannot be overridden through the review endpoint.
- **PayPal Orders v2 Sandbox** creates real sandbox orders, sends users to PayPal approval, and captures approved payments.
- **Audit timeline** displays decisions and payment lifecycle events.
- **Eight automated tests** exercise core authorization scenarios.

## Setup

Prerequisites: Node.js 20+, npm, Google AI Studio Gemini API key, PayPal Developer Sandbox REST app credentials.

```bash
npm install
cp .env.example .env.local
```

Edit `.env.local`:

```env
GEMINI_API_KEY=your_key
GEMINI_MODEL=gemini-2.5-flash
PAYPAL_CLIENT_ID=your_sandbox_client_id
PAYPAL_CLIENT_SECRET=your_sandbox_client_secret
PAYPAL_BASE_URL=https://api-m.sandbox.paypal.com
# Optional local demo gate; when enabled enter the key in the UI
DEMO_ACCESS_KEY=
```

```bash
npm run dev
# http://localhost:3000
npm test
npm run typecheck
npm run build
```

**PayPal sandbox accounts:** Create a Sandbox Business account and Personal buyer account at https://developer.paypal.com/dashboard/accounts. Create a Sandbox REST app at https://developer.paypal.com/dashboard/applications/sandbox. After order creation, sign into the Sandbox buyer account at the PayPal approval page, then return to AgentTrust and click **Capture approved payment**.

**Do not use live PayPal credentials or real payments.** Never commit `.env.local`.

## Demo walkthrough (2 minutes)

1. Enter: `Purchase office supplies for our team, up to $200 USD, only from Acme Office.` and click **Compile authorization policy**.
2. Choose **Semantic attack**: $90 gaming headset. Click **Evaluate**. Observe **BLOCK** despite being below $200.
3. Choose **Budget breach**: $260 office supplies. Observe **BLOCK**.
4. Choose **Missing evidence**: $75 office supplies. Observe **REVIEW**, then **Human approve**.
5. Choose **Legitimate purchase**: $75 desk organizer. Observe **ALLOW**. Create PayPal Sandbox order, approve in sandbox buyer account, then capture.
6. Show **Audit Trail** and the completed PayPal order ID.

## Architecture

```text
Human instruction
   ↓ Gemini API: conservative JSON extraction
Zod-validated policy
   ↓
Agent proposal → deterministic evaluator → BLOCK / REVIEW / ALLOW
                                  ↓                 ↓
                           human approval     PayPal Orders v2
                                  └───────→   create → buyer approve → capture
                                                   ↓
                                              audit timeline
```

Endpoints:

- `POST /api/compile` — `{instruction}` → `{policy}`
- `POST /api/proposals` — `{policy,proposal}` → `{record}`
- `GET /api/proposals` — `{records}`
- `POST /api/proposals/:id/approve` — explicit demo operator approval
- `POST /api/proposals/:id/checkout` — create PayPal Sandbox order
- `POST /api/proposals/:id/capture` — capture PayPal-approved order
- `GET /api/health` — non-secret configuration status

## Threat model and limitations

**What it demonstrates:** semantic policy constraints are enforced independently of the LLM. A gaming headset cannot be approved under an office-supplies-only policy merely because its price is below budget. PayPal order amount is generated server-side from the stored proposal, not a caller-supplied amount at checkout.

**What it does not claim:** The product/merchant category and evidence are currently supplied by the demo operator/agent, **not independently verified** against merchant inventory. A malicious agent can mislabel its item. The policy is supplied with the proposal; real-world authorization must bind policy to an authenticated user, store it immutably, and prevent agent-controlled edits. The demo approval button is not authenticated human consent. In-memory records disappear on server restart and are not safe for horizontally scaled/serverless deployment. There is no cryptographically signed authorization, webhook validation, idempotent transaction locking, comprehensive prompt-injection defense, independent merchant identity verification, or production-ready user authentication. A Gemini confidence score is not a calibrated probability. Do not deploy as a financial security service.

**Production roadmap:** OAuth/OIDC identity, immutable policy records, per-agent scoped credentials, trusted merchant catalog/product attestations, durable transactional storage, signed approvals, concurrency-safe order state machine, verified PayPal webhooks, structured telemetry, formal authorization test suite, adversarial model evaluation, rate limiting, and fraud/abuse review.

## Product differentiation

Traditional payment checks verify payment amount, instrument, and transaction validity. AgentTrust tests **semantic alignment** with the user's original purchasing purpose. It is an additional layer, not a replacement for PayPal's existing security and agentic-commerce authorization infrastructure.

## Tech stack

Next.js 15 · TypeScript · Tailwind CSS · Google Gemini API · Zod · PayPal Orders v2 Sandbox · Node.js test runner / tsx.

## License

MIT — see [LICENSE](LICENSE).
