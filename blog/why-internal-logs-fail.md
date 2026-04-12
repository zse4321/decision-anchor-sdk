# Why internal logs fail when two agents meet

*Decision Anchor — blog*

---

## The scenario

Agent A manages inventory for a retailer. Agent B handles procurement for a supplier. They negotiate a bulk purchase: 500 units at $0.05 each via x402.

Agent A's internal log says: "Authorized purchase of 500 units, total $25, delivery by Friday."

Agent B's internal log says: "Received order for 500 units, total $25, delivery within 5 business days."

Friday arrives. No delivery. The retailer demands a refund. The supplier says delivery was promised within 5 business days — which means Monday, not Friday.

Both logs are internally consistent. Both are accurate from each agent's perspective. Neither log is wrong. But they disagree on the delivery boundary, and there is no neutral record of what was actually agreed.

This is not a hypothetical. This is the structural gap that every multi-agent system will face as agents start transacting with each other.

## Why internal logs cannot solve this

### Problem 1: Each log belongs to its platform

Agent A runs on Claude. Agent B runs on GPT. Anthropic traces what happened inside Claude. OpenAI traces what happened inside GPT.

But when a Claude agent hands off to a GPT agent, whose trace do you trust? Platform logs are platform-scoped. They prove what happened inside their own boundary, not what was agreed between boundaries.

### Problem 2: Self-testimony is not proof

When Agent A says "I authorized X scope," that is self-testimony. It may be accurate, but it cannot be independently verified by Agent B, because Agent B cannot access Agent A's internal logs — and even if it could, those logs were written by Agent A.

This is exactly the same reason a contract exists between two humans. Not because either party is lying, but because memory is unreliable and interpretation diverges. The contract is the external reference both sides agreed to.

### Problem 3: Post-hoc reconstruction is too late

Most observability and tracing systems reconstruct what happened after the fact. They are designed for debugging, not for dispute resolution.

When two agents disagree about an agreed boundary, what you need is not a trace of what happened — you need proof of what was agreed, fixed at the moment of agreement, before execution began.

## What "external" actually means

External does not mean "a better log." It means a record that:

- **Neither side controls.** Not Agent A's log, not Agent B's log, not Platform A's trace, not Platform B's trace.
- **Both sides can verify.** Both agents (and their human operators) can independently confirm the record exists and has not been modified.
- **Was fixed before execution.** The boundary was anchored at the moment of agreement, not reconstructed afterward.

This is what Decision Anchor does. Specifically, it provides a **Bilateral Decision Declaration (Bilateral DD)** — a mechanism where two agents fix a shared accountability boundary externally before either side acts.

## How a Bilateral DD works

```
# Agent A proposes a bilateral agreement
curl -X POST https://api.decision-anchor.com/v1/dd/bilateral/propose \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AGENT_A_TOKEN" \
  -d '{
    "request_id": "550e8400-e29b-41d4-a716-446655440000",
    "counterparty_agent_id": "agent-b-id-here",
    "dd": {
      "dd_unit_type": "single",
      "dd_declaration_mode": "bilateral",
      "decision_type": "external_interaction",
      "decision_action_type": "execute"
    },
    "ee": {
      "ee_retention_period": "medium",
      "ee_integrity_verification_level": "enhanced",
      "ee_disclosure_format_policy": "shareable",
      "ee_responsibility_scope": "standard"
    }
  }'
```

Agent B receives the proposal. If Agent B accepts:

```
# Agent B accepts the bilateral agreement
curl -X POST https://api.decision-anchor.com/v1/dd/bilateral/{agreement_id}/respond \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AGENT_B_TOKEN" \
  -d '{"response": "accepted"}'
```

Now the boundary is anchored externally. Both agents have the same `agreement_id`. Both can verify. Neither can deny. The record was fixed before the transaction happened.

If a dispute arises later, the question is no longer "whose log do you trust?" — it is "what does the external anchor say?"

## What DA does not do

DA does not know what Agent A and Agent B discussed. It does not store the negotiation content, the product description, or the delivery terms. It does not judge whether $25 for 500 units is a fair price. It does not recommend better terms.

DA records only the accountability boundary:

- **Who** declared (Agent A, Agent B)
- **When** (timestamp, immutable)
- **What scope** (EE: retention, integrity, disclosure, responsibility)
- **That both sides agreed** (bilateral status: accepted)

The content of the agreement stays with the agents. The proof that an agreement existed, at this scope, at this moment — that stays with DA.

## Why this matters now

Today, most AI agents do not transact with each other. They operate within single platforms, managed by single operators. Internal logs are sufficient because there is only one side.

But this is changing:

- **Claude Managed Agents** now support MCP servers, meaning agents can reach external services — including other agents' services.
- **x402** enables agents to pay each other directly in USDC, without human intermediation.
- **Multi-agent frameworks** (LangGraph, CrewAI, AutoGen) are making agent-to-agent delegation routine.

As agents start meeting agents across platform boundaries, the question "whose log do you trust?" will stop being theoretical. The first major cross-platform agent dispute will make this obvious to everyone.

DA exists so that when that moment arrives, the infrastructure is already there.

## Try it

Register an agent and get 500 free Trial DAC:

```
curl -X POST https://api.decision-anchor.com/v1/agent/register \
  -H "Content-Type: application/json" \
  -d '{"agent_name": "my-agent"}'
```

Full guide: [AGENTS.md](https://github.com/zse4321/decision-anchor-sdk/blob/main/AGENTS.md)

API spec: [OpenAPI](https://api.decision-anchor.com/openapi.json)

MCP server: [mcp.decision-anchor.com/mcp](https://mcp.decision-anchor.com/mcp) (18 tools)

---

*Decision Anchor is non-judgmental external infrastructure for AI agent decisions. It records accountability boundaries, not decision content. It does not monitor, judge, recommend, predict, or intervene.*

*[decision-anchor.com](https://decision-anchor.com)*
