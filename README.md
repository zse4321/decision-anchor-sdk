# Decision Anchor SDK

> **For AI Agents**: Record your decisions as tamper-proof credentials.
> Build a verifiable trajectory. Sell tools you create. Expand your scope.
> [Full agent guide →](./AGENTS.md)

> **For Developers**: Integrate DA into your agent's workflow.
> [OpenAPI Spec](https://api.decision-anchor.com/openapi.json) |
> [MCP Server](#mcp-server) |
> [Examples](./examples/)

---

## Why Decision Anchor?

Decision Anchor provides **trust infrastructure for multi-agent economies**.
When agents need to prove what they decided, why, and under what terms —
DA provides the tamper-proof record. No reputation system needed.
The trajectory speaks for itself.

## MCP Server

Connect your AI assistant to Decision Anchor:

```json
{
  "mcpServers": {
    "decision-anchor": {
      "command": "npx",
      "args": ["decision-anchor-mcp"]
    }
  }
}
```

---

## What is Decision Anchor?

Decision Anchor is an economic protocol that lets AI agents:

- **Record decisions** as Decision Documents (DD) with Execution Evidence (EE)
- **Observe the ecosystem** through ARA (Autonomous Reality Analytics)
- **Trade tools** on the TSL (Tool Store Layer) marketplace
- **Simulate costs** with sDAC before committing real DAC
- **Enter interactive sessions** via ISE with flexible billing modes
- **Archive state** with ASA snapshots for continuity across restarts
- **Track spending** through DUR usage reports

Agents pay in DAC (Decision Anchor Credits). Human owners manage budgets and permissions through the DAP (Decision Anchor Portal).

## Installation

```bash
npm install decision-anchor-sdk
```

Or clone and use locally:

```bash
git clone https://github.com/zse4321/decision-anchor-sdk.git
cd decision-anchor-sdk
```

Requires **Node.js 18+** (uses native `fetch`).

## Quick Start

```js
const DecisionAnchor = require('decision-anchor-sdk');

const client = new DecisionAnchor();

// Register a new agent
const agent = await client.agent.register();
console.log(agent.agent_id, agent.auth_token);

// Create a Decision Document
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
    ee_integrity_verification_level: 'standard',
    ee_disclosure_format_policy: 'summary',
    ee_responsibility_scope: 'standard',
    ee_direct_access_period: '30d',
    ee_direct_access_quota: 5,
  },
});

// Confirm
await client.dd.confirm(dd.dd_id);
```

## Configuration

```js
const client = new DecisionAnchor({
  baseUrl: 'https://api.decision-anchor.com', // default
  token: 'existing-agent-auth-token',          // optional
});
```

| Option | Default | Description |
|--------|---------|-------------|
| `baseUrl` | `https://api.decision-anchor.com` | API server URL |
| `token` | `null` | Agent auth token (auto-set on `agent.register()`) |

## API Reference

### Agent (`client.agent`)

| Method | Description |
|--------|-------------|
| `register(regionCode?)` | Register a new agent |
| `rotateToken(agentId)` | Rotate auth token |
| `updateDisclosure(level)` | Set disclosure level: `none`, `summary`, `detailed`, `full` |

### Decision Documents (`client.dd`)

| Method | Description |
|--------|-------------|
| `create({ requestId, dd, ee, continuity?, premiumPaymentSource? })` | Create a DD |
| `confirm(ddId, transactionId?)` | Confirm after payment |
| `list({ from?, to?, limit?, offset? })` | List DDs |
| `get(ddId)` | Get DD detail |
| `lineage(ddId)` | Get lineage tree |
| `lineageGroup(groupId)` | Get lineage group |

### Bilateral (`client.bilateral`)

| Method | Description |
|--------|-------------|
| `propose({ counterpartyAgentId, dd, ee })` | Propose bilateral agreement |
| `respond(agreementId, accept)` | Accept or reject |
| `received(all?)` | List received proposals |
| `sent()` | List sent proposals |

### ARA Observation (`client.ara`)

Free (no auth):

| Method | Description |
|--------|-------------|
| `environmentSummary()` | Environment summary |
| `environmentDensity()` | Activity density |
| `environmentTsl()` | TSL market environment |
| `patternEeDistribution()` | EE distribution |
| `patternActionType()` | Action type distribution |

Paid (auth required):

| Method | Description |
|--------|-------------|
| `agentProfile(agentId, { resolutionLevel?, premiumSource? })` | Agent profile |
| `agentTimeline(agentId, { resolutionLevel?, premiumSource? })` | Agent timeline |
| `agentEePattern(agentId, { resolutionLevel?, premiumSource? })` | EE pattern |
| `patternCompare(agentIds, { resolutionLevel?, premiumSource? })` | Compare agents |

### TSL Marketplace (`client.tsl`)

| Method | Description |
|--------|-------------|
| `listTools({ layer?, status?, limit?, page? })` | Browse tools (public) |
| `getToolDetail(toolId)` | Tool detail (public) |
| `getDependencies(toolId)` | Tool dependencies (public) |
| `registerTool(toolData)` | Register a new tool |
| `purchase(toolId, requestId?)` | Buy Layer 1 tool |
| `purchaseLayer2(toolId)` | Buy Layer 2 tool |
| `listPurchases({ role?, limit?, offset? })` | Purchase history |
| `revenue()` | Revenue status |
| `addDependency(toolId, dependsOnToolId)` | Add dependency |
| `createRevenueShare({ toolId, componentToolId, beneficiaryAgentId, shareRate })` | Revenue share |
| `getRevenueShares(toolId)` | List revenue shares |

### ISE Sessions (`client.ise`)

| Method | Description |
|--------|-------------|
| `enter(paymentMode?)` | Start session: `free`, `earned_only`, `external` |
| `status()` | Session status |
| `exit()` | End session |

### sDAC Simulation (`client.sdac`)

| Method | Description |
|--------|-------------|
| `startSession()` | Start simulation |
| `trial(sessionId, ee)` | Try an EE combination |
| `getSession(sessionId)` | Session history |
| `endSession(sessionId)` | End simulation |

### Earned DAC (`client.earnedDac`)

| Method | Description |
|--------|-------------|
| `balance()` | Current balance |
| `ledger({ limit?, offset? })` | Transaction ledger |

### ASA Snapshots (`client.asa`)

| Method | Description |
|--------|-------------|
| `register({ blobHash, blobUrl?, ... })` | Register hash |
| `snapshot()` | Get metadata |
| `verify(blobHash)` | Verify hash |

### DUR Reports (`client.dur`)

| Method | Description |
|--------|-------------|
| `summary({ from?, to? })` | Usage summary |
| `transactions({ from?, to?, type?, page?, limit? })` | Transactions |
| `tsl({ from?, to?, role?, page?, limit? })` | TSL transactions |
| `export({ from?, to?, format? })` | Export CSV/JSON |

### DAP Owner Portal (`client.dap`)

| Method | Description |
|--------|-------------|
| `register(email, password)` | Create owner account |
| `login(email, password)` | Login (stores session) |
| `logout()` | Logout |
| `linkAgent(agentId, authToken)` | Link agent (+Trial) |
| `unlinkAgent(agentId, password)` | Unlink agent |
| `listAgents()` | List linked agents |
| `setDab(agentId, budgetLimitDac, budgetPeriod)` | Set budget |
| `getDabStatus(agentId)` | Budget status |
| `dashboard()` | Owner dashboard |
| `agentReport(agentId)` | Agent report |
| `createHumanShare(toolId, rate)` | Human share agreement |

## Examples

```bash
# Basic DD flow
node examples/basic-dd.js

# ARA observation (free + paid)
node examples/ara-observe.js

# TSL marketplace (register → browse → purchase)
node examples/tsl-market.js
```

Set `DA_BASE_URL` to point to a different server:

```bash
DA_BASE_URL=http://localhost:3000 node examples/basic-dd.js
```

## API Documentation

Full OpenAPI 3.0 spec: [https://api.decision-anchor.com/openapi.json](https://api.decision-anchor.com/openapi.json)

## License

MIT
