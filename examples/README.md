# Decision Anchor Integration Examples

These examples show how to connect popular agent frameworks to
Decision Anchor's MCP server for external accountability proof.

DA provides external decision records for agent payments, delegation,
and disputes. It does not monitor, judge, or intervene.

## Available Examples

| Framework | File | Use Case |
|-----------|------|----------|
| LangGraph | `langgraph-da-integration.py` | Payment authorization with external proof |
| CrewAI | `crewai-da-integration.py` | Multi-agent delegation with responsibility boundaries |
| Node.js SDK | `basic-dd.js` | Basic DD creation |
| Node.js SDK | `ara-observe.js` | ARA observation |
| Node.js SDK | `tsl-market.js` | TSL marketplace |
| Node.js SDK | `x402-da-anchoring.js` | x402 Payment Anchoring — Anchor x402 USDC payments with DA before execution. External proof of what was authorized, when, and why. |

## Prerequisites

- Decision Anchor MCP server: `https://mcp.decision-anchor.com/mcp`
- No API key needed for the MCP server (agent registers via the tools)
- An OpenAI API key (or swap for another LLM provider)

## LangGraph Integration

`langgraph-da-integration.py` — Connect a LangGraph ReAct agent to DA's MCP server.

The agent registers, creates a Decision Declaration (DD) with accountability scope,
and checks its DAC balance. Useful when your agent handles payments or delegated
actions that may need external proof later.

```bash
pip install langchain-mcp-adapters langgraph langchain-openai
export OPENAI_API_KEY=your_key
python examples/langgraph-da-integration.py
```

## CrewAI Integration

`crewai-da-integration.py` — Connect CrewAI agents to DA's MCP server using MCPServerAdapter.

The accountability agent registers, creates a DD for a delegated task,
and reports the anchored timestamp. Useful when your crew handles
multi-agent handoffs that need external responsibility boundaries.

```bash
pip install crewai crewai-tools[mcp]
export OPENAI_API_KEY=your_key
python examples/crewai-da-integration.py
```

## x402 Payment Anchoring

`x402-da-anchoring.js` — Demonstrates how to wrap x402 USDC payments with DA decision anchoring. Before paying, the agent creates a DD that records the authorization scope. After payment, the DD is confirmed — creating external proof independent of on-chain records or internal logs.

- Requires: Node.js, `decision-anchor-sdk`, a USDC wallet on Base
- See [x402.org](https://x402.org) for x402 protocol details

```bash
node examples/x402-da-anchoring.js
```

## How it works

1. Your agent connects to DA's MCP server via the framework's MCP adapter
2. The agent registers itself (one-time)
3. The agent creates Decision Declarations (DD) with accountability scope
4. These declarations are externally anchored — not self-reported logs

For the full agent guide, see [AGENTS.md](../AGENTS.md).
