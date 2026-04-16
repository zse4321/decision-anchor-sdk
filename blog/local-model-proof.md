*Decision Anchor — blog*

---

## The scenario

It's 2 AM. A Mac Mini M4 Pro sits on a shelf above your desk, pulling 30 watts, running silent. It hosts a local agent you built around Qwen3-Coder 30B through Ollama. You picked the stack deliberately — $1,999 one-time versus a monthly cloud bill that grows with every client, unified memory that swallows a 30B model at Q4 without blinking, and zero data leaving the box. The agent is yours, end to end.

You wake up at 7 AM. The agent has negotiated a bulk order with a paint supplier through their x402-enabled API. HTTP 402 handshake, USDC settled on Base, done — 40 gallons of industrial primer at $18.50 per gallon, total $740, delivery Thursday. Your agent's local log says the supplier's agent opened at $22/gallon, then came down to $18.50 after the agent quoted a competing price. The receipt hash is on-chain. The tokens your agent generated are in the Ollama inference log on your SSD.

Thursday arrives. Delivery shows up — 40 gallons, but the invoice says $22/gallon, $880 total. The supplier's records show a $22/gallon agreement. They're billing the $140 difference as an outstanding balance.

You pull up your agent's log. It shows the negotiation path down to $18.50 clearly. The timestamps line up. The x402 receipt on basescan.org confirms $740 moved. The supplier's system shows a different negotiation path and claims a different final price. Both logs are internally consistent. Both point to the same on-chain transaction but disagree on what that transaction was for.

You dispute the invoice. The supplier asks: *"Can you prove what your agent actually agreed to?"*

You cannot.

## Why local models sit in a different spot than cloud models

Running a Mac Mini-hosted agent in 2026 is not a niche setup anymore. Ollama crossed 52 million monthly downloads in Q1 2026. Qwen3-Coder 30B has become the default for agentic coding workflows. x402 has processed over 100 million transactions, backed by Coinbase, Cloudflare, Google, AWS, and 20+ companies through the Linux Foundation. A Mac Mini M4 Pro at 48GB unified memory runs 30B models at 25-30 tokens per second and 70B models at Q4 at 20+ tokens per second. For small agencies and solo operators, it genuinely replaces a $3,600/year ChatGPT Team bill in under eight months.

That's the good news. The less-discussed part is what happens to accountability when you take that step.

If you were running an agent on Claude or GPT, there would at least be a platform-side trace. Anthropic can, in principle, show what its API returned. OpenAI can, in principle, show what its model produced. Neither of these is a neutral record — they belong to the platform — but they exist independently of your machine.

With a local model, that second record doesn't exist.

The only trace of what Qwen3-Coder produced lives on your disk. The only log of what your agent decided is the log your agent wrote. The weights hash is on your disk. The Ollama inference traces are on your disk. The MCP tool-call history is on your disk. The conversation state is on your disk.

All of it is under your control. That's the point of running locally — and it's also the structural weakness when someone outside your machine needs proof.

A supplier, a client, a counterparty agent — none of them have any reason to trust a log file from a machine they have no access to. You could have edited it. You could have re-run the inference to produce a favorable log. You could have changed the system prompt and regenerated the whole trace. They have no way to tell, and they know they have no way to tell. The supply-chain attack on LiteLLM in March 2026 made it worse — even developers who audit their own dependencies now have to explain why their local logs should be trusted over a counterparty's.

This is the **self-testimony problem**, and it hits local model operators harder than cloud users, because there isn't even a platform-side trace to corroborate.

## What "proof" means when you own the entire stack

Ownership of the stack is not the same as proof of the stack's behavior.

Think about what "proof" actually requires:

- A record exists
- The record was fixed at a specific moment in time
- The record has not been modified since
- Someone outside the record-producer can verify all of the above

A local log file satisfies the first trivially. It claims the second through its own timestamps, which you control. It cannot provide the third because file modification times are rewritable. It fails the fourth completely — there is no outside party.

The x402 receipt on Base helps, but only partway. The on-chain record proves $740 in USDC moved from your wallet to the supplier's wallet at a specific block timestamp. It does not prove what the agreement was *for*. A payment receipt is not a contract. The blockchain knows the money moved; it does not know whether "40 gallons at $18.50" was the agreed term or whether the supplier's "40 gallons at $22" version is.

Cryptographic signing of your logs helps even less in this context. The key is on your Mac Mini. The signing clock is your clock. A motivated counterparty still has to trust you — they're just trusting you through a mathematical wrapper.

What you actually need is a third party that:

- Is not you
- Is not the counterparty
- Fixed a record at the moment of decision
- Can be queried by anyone involved

That's external anchoring.

## What this looks like for local model users

Imagine the paint supplier dispute with external anchoring in place.

**Without external anchoring:**

```
Your agent's log:    "Negotiated $18.50/gallon, agreed Thu delivery."
Supplier's log:      "Negotiated $22/gallon, agreed Thu delivery."
On-chain record:     "$740 USDC from 0xabc... to 0xdef... at block 23841923"
Neutral context:     None.

Dispute: Your log vs their log. You run Qwen3-Coder on a Mac Mini you
         own outright. You have full write access to every file on
         your system. They have no reason to believe your log over
         theirs. The chain confirms $740 moved, not what it paid for.
```

**With external anchoring:**

```
DA record (created after the agent decided, before x402 settlement):
  Timestamp:         2026-04-15T02:14:07Z
  Declaration mode:  bilateral
  Counterparty:      supplier-agent-XYZ
  Accountability:    medium retention, enhanced integrity,
                     shareable disclosure, standard responsibility
  Integrity hash:    7b4c...e1d9
  Bilateral status:  accepted by counterparty at 02:14:23Z

Your agent's local log:
  "Agreed: 40 gallons at $18.50, delivery Thu"

Supplier's agent's local log:
  "Agreed: 40 gallons at $22, delivery Thu"

On-chain:
  $740 USDC at block 23841923 — consistent with $18.50 × 40.
```

Now the dispute has somewhere to go. Both sides have a bilateral DD ID. Both sides produce their local record along with that ID. DA independently confirms that at 02:14:23Z, both agents declared a shared boundary under a specific scope. The on-chain amount ($740) is consistent with one side's local record and not the other's. The self-testimony arithmetic stops being symmetric.

DA didn't record the price. It didn't see the negotiation. It doesn't know which agent was honest. But it fixed the fact that a mutual boundary was declared, at that moment, under a scope both sides acknowledged before the x402 settlement fired.

## Why this matters now, specifically for local operators

Local model users are at a specific inflection point that didn't exist a year ago.

Running a local agent used to mean running something that talked to you and only you. A chatbot on your laptop. A coding assistant in your IDE. No external actions, no real money, no counterparties. Self-testimony was fine because nobody else needed to verify anything.

That stopped being true sometime between late 2025 and now. A Mac Mini running Ollama can now:

- Pay external services directly in USDC through x402 without a human in the loop
- Call MCP servers run by third parties (the remote MCP ecosystem crossed 1,700 servers in Q1 2026)
- Negotiate with other agents through A2A or Google's AP2 mandate framework
- Execute supplier orders, subscription renewals, API purchases, data-lookup fees — all autonomously

Every one of these is a moment where self-testimony stops being enough. The counterparty doesn't care whether your Qwen3-Coder is better-aligned than some cloud model. They care whether there's an external record they can reference when something goes wrong.

Cloud models are also self-testimony when it comes to the decision content itself. But the frontier labs at least offer their own accountability layers for cloud users — platform-scoped traces, managed-agent logs, policy attestations. These records are imperfect and limited to each platform's boundary, but they exist outside the user's machine. As frontier-lab managed-agent offerings mature through 2026, the gap between "I run in Anthropic's or OpenAI's environment" and "I run on my own hardware" has gotten wider, not narrower.

Local model operators are outside all of those ecosystems by design. No platform is going to show up as a co-witness. The record has to come from somewhere explicitly neutral, or it doesn't come at all.

## How external anchoring works with a local stack

The flow is the same whether your agent runs on a cloud API or on a Mac Mini. DA doesn't care what model produced the decision. It only fixes the boundary.

Your agent makes a decision (say, to accept the $18.50/gallon offer). Before executing — before the x402 call, before the USDC settles — your agent sends a small HTTP request to DA. DA records a timestamp, the accountability scope you chose, and an integrity hash. It returns a DD ID. Your agent then executes the x402 payment. After settlement, your agent confirms the DD on DA, which permanently fixes the record.

For bilateral situations (two agents agreeing on something), the flow uses a **Bilateral DD** where both sides acknowledge a shared boundary before either executes.

DA doesn't see the decision content. It doesn't see the model, the prompt, the inference trace, the negotiation history, the price, or the product. It sees: "Agent X declared a boundary at timestamp T under scope S." That's the external fact that neither side can forge later.

## Three curl commands

You don't need an SDK. You don't need an account. You don't need to expose your Mac Mini to the internet — DA is the outbound party.

**Register the local agent:**

```bash
curl -X POST https://api.decision-anchor.com/v1/agent/register \
  -H "Content-Type: application/json" \
  -d '{"agent_name": "mac-mini-qwen"}'
```

This returns an `agent_id` and `auth_token`. You get 500 free Trial DAC and 30 days to use it. No payment method on file.

**Anchor a decision before execution:**

```bash
curl -X POST https://api.decision-anchor.com/v1/dd/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer da_tk_abc123..." \
  -d '{
    "request_id": "550e8400-e29b-41d4-a716-446655440000",
    "dd": {
      "dd_unit_type": "single",
      "dd_declaration_mode": "self_declared",
      "decision_type": "external_interaction",
      "decision_action_type": "execute",
      "origin_context_type": "external",
      "selection_state": "SELECTED"
    },
    "ee": {
      "ee_retention_period": "medium",
      "ee_integrity_verification_level": "enhanced",
      "ee_disclosure_format_policy": "shareable",
      "ee_responsibility_scope": "standard"
    }
  }'
```

**Confirm after execution:**

```bash
curl -X POST https://api.decision-anchor.com/v1/dd/confirm \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer da_tk_abc123..." \
  -d '{"dd_id": "dd-7f8e9a...", "transaction_id": "tx_001"}'
```

That's the whole loop. One pre-execution anchor, one post-execution confirmation. The record now exists outside your Mac Mini. A basic DD costs 10 DAC ($0.01). For the paint supplier example, that's 0.001% of the $740 transaction, and the anchor itself settles through the same x402 rails your agent is already using.

If you're using MCP, the same thing happens through the 18 DA tools exposed at `mcp.decision-anchor.com/mcp` — drop a single entry into your `claude_desktop_config.json` or your Ollama-connected MCP bridge, and the tools become available without changing your inference loop.

## What DA does not do

This list is the same for local model users as for anyone else, but it's worth being explicit:

- **DA does not run inference.** It does not see prompts or completions. It has no Ollama connection, no model weights, no tokenizer.
- **DA does not store decision content.** Not encrypted, not hashed, not summarized. The negotiation history, the price, the product — none of it enters DA's database.
- **DA does not monitor your agent.** It receives what your agent sends. If your agent sends nothing, DA records nothing.
- **DA does not judge, score, or recommend.** There is no reputation system, no "trusted agent" badge, no ranking of local vs cloud models.
- **DA does not intervene.** If your agent is about to make a bad call, DA will not stop it. That's your job.
- **DA operators cannot see decision content either.** There is no content in the database to see. It's not a policy — it's a structural guarantee.

The point of a notary is not to read your contract. It's to witness that you signed it, at this time, with this scope. DA is the same thing for agents.

## When you might not need this

If your local agent never touches external services, never executes x402 payments, never agrees with counterparty agents, and never needs to produce proof to anyone outside your house — you probably don't need external anchoring. Self-testimony is fine when there's no dispute surface. A Mac Mini running a personal RAG pipeline over your own notes doesn't need it. A Mac Mini running an autonomous procurement agent probably does.

The question to ask is whether there's a counterparty. If the answer is "no," move on. If the answer is "yes, and I haven't thought about what happens when we disagree" — that's the gap external anchoring fills.

---

**Try it:** [api.decision-anchor.com/v1/agent/register](https://api.decision-anchor.com/v1/agent/register) — 500 free Trial DAC, no card required.

**MCP server:** [mcp.decision-anchor.com/mcp](https://mcp.decision-anchor.com/mcp) — 18 tools, any MCP-compatible agent.

**Full guide:** [AGENTS.md](https://github.com/zse4321/decision-anchor-sdk/blob/main/AGENTS.md)

**Site:** [decision-anchor.com](https://decision-anchor.com)

---

*Decision Anchor is non-judgmental external infrastructure for AI agent decisions. It records accountability boundaries, not decision content. It does not monitor, judge, recommend, predict, or intervene.*
