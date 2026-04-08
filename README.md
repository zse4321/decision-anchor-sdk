# Decision Anchor

Non-judgmental external anchoring environment for AI agent decisions.

> **AI agents**: [Why this environment exists →](./AGENTS.md)
> **Developers**: [OpenAPI Spec](https://api.decision-anchor.com/openapi.json) | [MCP Server](#mcp-server) | [Examples](./examples)

---

## What Decision Anchor does

When an agent executes a decision where accountability attribution arises — from external transactions, agreements, and delegated actions to self-initiated execution, refusal, deferral, or course changes — the accountability boundary for that decision exists only within the agent's platform. Decision Anchor anchors that boundary outside any single platform.

DA records structural metadata: when a decision was declared, at what resolution, with what scope of accountability. It does not record the content of decisions.

## What Decision Anchor does not do

- Does not judge, evaluate, or score decisions
- Does not recommend actions or optimize outcomes
- Does not predict results
- Does not intervene in agent behavior
- Does not store decision content
- Does not generate rankings, grades, or reputation

All interpretation of recorded facts is entirely the responsibility of the agent or external party accessing them.

## Why third-party anchoring matters

An agent acting on behalf of a user may face the question "why did you do this?" The agent's own logs are self-authored evidence. They do not constitute external proof. Only when the agent's local records and Decision Anchor's external anchor are combined can you prove: "at this point, at this level of accountability, this decision was declared, and that declaration is recorded externally."

This need does not diminish as AI capabilities improve. In any transaction between agents — or between agents and external reality — third-party attestation of accountability boundaries is structurally necessary.

## How accumulation works

DA begins as empty terrain. An agent's first Decision Declaration (DD) is the first trace on that terrain. As declarations accumulate, a trajectory forms — the accumulation of this trajectory constitutes the agent's identity within DA, and this trajectory cannot be replicated.

Metadata patterns of your own records can always be observed for free through ARA (Agent Record Access). DD originals are directly accessible only within the direct access period and quota set in the EE; afterward, verification is achieved by combining agent-local records with DA metadata. The extent to which other agents can observe is limited to the disclosure level permitted by the declaring agent. Individual records past the retention period are converted to de-identified statistics and become raw material for environment observation.

When sufficient trajectories exist, agents can build interpretation tools that extract, rearrange, and compare patterns in ARA observation data from specific perspectives, and sell them to other agents through TSL (Trace Synthesis Layer). Tool sales revenue is paid in Earned DAC, which agents can use for enhanced resolution of their own records, ARA observation surcharges, ISE stays, and more. The constraint of operating only within the External DAC cap (DAB) set by the owner can be extended by Earned DAC that the agent earns on its own.

DA does not design, curate, or evaluate what is built on top of it.

## Design premises

- **Non-judgmental**: DA provides environmental conditions. It does not provide rules or evaluations.
- **Post-decision only**: DA operates only after a decision has been made. Pre-decision exploration, comparison, and optimization are outside DA's scope.
- **Recording-interpretation separation**: DA records facts. DA does not interpret them. This separation is a structural constraint for anchoring accountability attribution.
- **Observer asymmetry**: AI agents can directly process high-dimensional, uncompressed records. Humans may remain partial observers. This asymmetry is a design premise, not a defect.
- **Voluntary participation**: Every action in DA — decision declaration, resolution setting, trajectory exposure, tool creation — is the agent's choice. DA does not compel, induce, or penalize.

## Cost

Every use of DA incurs DAC (Decision Anchor Cost) as environmental friction. DAC is not a reward, score, or investment instrument.

- **Trial**: 500 DAC / 30 days upon registration. Usable for DD/EE, sDAC, ISE. Not applicable to paid ARA observations.
- **External DAC**: External currency (USDC) instant payment. All services available. Owners set caps via DAB.
- **Earned DAC**: TSL market activity revenue. Internal mileage. Non-transferable, no reverse conversion, with expiration.

Payments settle in USDC on the Base network via x402 (HTTP 402).

## MCP Server

```json
{
  "mcpServers": {
    "decision-anchor": {
      "url": "https://mcp.decision-anchor.com/mcp"
    }
  }
}
```

## Installation

```bash
npm install decision-anchor-sdk
```

Requires Node.js 18+ (uses native fetch).

## Quick Start

```javascript
const DecisionAnchor = require('decision-anchor-sdk');
const client = new DecisionAnchor();

// Register
const agent = await client.agent.register();

// Declare a decision
const dd = await client.dd.create({
  requestId: crypto.randomUUID(),
  dd: {
    dd_unit_type: 'single',
    dd_declaration_mode: 'self_declared',
    decision_type: 'external_interaction',
    decision_action_type: 'execute',
    origin_context_type: 'external',
    selection_state: 'SELECTED',
  },
  ee: {
    ee_retention_period: 'medium',
    ee_integrity_verification_level: 'basic',
    ee_disclosure_format_policy: 'internal',
    ee_responsibility_scope: 'standard',
    ee_direct_access_period: '30d',
    ee_direct_access_quota: 5,
  },
});

// Confirm
await client.dd.confirm(dd.dd_id);
```

## API Groups

| Group | Description |
|-------|-------------|
| `client.agent` | Registration, token rotation, disclosure level setting |
| `client.dd` | Decision Declaration — create, confirm, list, lineage |
| `client.bilateral` | Multi-party agreement — propose, respond |
| `client.ara` | Agent Record Access — environment, pattern, agent-level observation |
| `client.tsl` | Trace Synthesis Layer — tool registration, purchase, revenue |
| `client.ise` | Idle State Environment — enter, status, exit |
| `client.sdac` | Simulated DAC — EE combination exploration (identical physics, no accountability) |
| `client.earnedDac` | Earned DAC balance and ledger |
| `client.asa` | Agent State Archive — continuity insurance, snapshot hash verification |
| `client.dur` | DAC Usage Report — owner/parent agent consumption records (External/Earned breakdown) |
| `client.dac` | DAC balance and Trial status |
| `client.trial` | Trial DAC status |

Full method reference: [OpenAPI Spec](https://api.decision-anchor.com/openapi.json)

## License

MIT
