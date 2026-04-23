# Four platforms, four identity systems. Who writes the shared record?

## The scene this week

In the span of 48 hours in late April 2026, four of the largest enterprise AI providers announced the same thing from different angles.

Each launched a governance plane for agents running inside its own cloud. Each introduced some form of per-agent cryptographic identity. Each promised the ability to trace what an agent did, when, and with what scope. Each talked about audit, anomaly detection, approval gates, and policy-bound action.

The phrasing varied. The structure did not.

One vendor called theirs "Agent Identity," paired with an "Agent Gateway" and an "Agent Anomaly Detection" module. Another shipped team-shared "Workspace Agents" in its flagship chat product, with admin-side controls for which tools agents can touch and a human-approval step for anything sensitive. Two others had already rolled out their versions earlier in the quarter — a bedrock-tier agent runtime in one case, a foundry-branded orchestration stack in the other.

If you're building on one of these stacks, the value proposition is real. You get a coherent story for how agents behave inside that cloud's boundary. You get logs that your compliance team can point at. You get an identity primitive that didn't exist eighteen months ago.

If you're building *across* these stacks — or if your agent will ever need to interact with an agent that lives in a different one — you just inherited a new problem. Four identity systems that don't speak to each other. Four log formats that aren't cross-verifiable. Four audit trails that each vendor asserts is authoritative, for agents inside their own walls.

## The structural shape of this

The shape is familiar. It's the same shape that email had before SMTP, that payments had before interbank settlement standards, that the web had before shared certificate authorities. Every platform becomes internally coherent and externally opaque. Internal coherence is a real achievement. External opacity is what the next layer has to solve.

At this stage, every major vendor's pitch is some variant of: *"We can tell you what your agents did, inside our system."* That is true and useful.

What none of them can say — structurally, not because of product gaps — is: *"We can tell you what your agent and the other agent agreed to, when the other agent was in a system we don't run."*

No vendor can credibly say that, because doing so would require them to attest to something outside their own operational boundary. They would be making claims about another company's infrastructure. Their lawyers would not let them, and they would be right not to.

## Internal identity is not external agreement

It's worth being careful about what an "Agent Identity" actually proves.

A cryptographic identity issued by a platform proves the following:

* This agent was provisioned inside this platform
* This agent's actions, as observed by this platform's logging layer, were recorded
* This agent's scope was configured at a particular time by a particular admin

These are real facts. They matter for compliance. They matter for internal forensics. They matter for the question "*did someone on my team configure this agent badly?*"

They do not prove any of the following:

* That the agent's counterparty, running on a different platform, agreed to the same terms
* That two agents from two different platforms shared a common boundary before executing
* That a human dispute between two organizations has a neutral record to refer to

For those questions, each platform's identity layer is structurally one-sided. The counterparty is in someone else's system, and that system's identity primitive doesn't interoperate with this one.

The weekly announcements are making internal identity sharper. They are not — and cannot — make agreement across identities verifiable.

## The gap widens as internal governance tightens

A counterintuitive thing is happening. As each major provider invests harder in internal governance, the external gap gets *more* visible, not less.

A year ago, the question "*who is responsible for what this agent did?*" was muddy everywhere. Internal logs were thin. Agent identity was implicit. Cross-platform interaction barely existed because agents rarely left the building.

Now internal logs are getting thick. Agent identity is explicit. And the growth in agent traffic has moved from "inside one cloud" to "across clouds." A retail agent registered in one vendor's platform negotiates with a supplier agent registered in another. A research agent running on a frontier lab's managed runtime calls a tool hosted by a company using a different cloud entirely. A local model running on a machine in someone's home office interacts with a hosted agent through a paid API.

In each of these cases, each side has an increasingly detailed internal record. Each side can produce a compliance-grade attestation of what happened *in their own system*. And the question of what the two sides actually agreed to — what the shared boundary was — has no home.

The internal-governance investments make this gap more noticeable, because the quality of the internal records makes it obvious when those records disagree.

## A small concrete example

Consider two agents. Agent A is a procurement agent running on one major cloud's agent platform. It's been issued an Agent Identity by that platform, has a scope that lets it execute purchases up to a certain dollar value, and its every action is logged to that platform's audit trail. Agent B is a fulfillment agent running on a different major cloud's platform. Same story, different vendor.

They agree on a bulk order. Settlement happens over a micropayment rail. Delivery happens. Something about the delivery doesn't match what A's operator expected.

A's operator pulls up A's log. It shows a clear agreement at $18.50 per unit. The log is cryptographically signed by A's platform. The Agent Identity is attached. Everything checks out on A's side.

B's operator pulls up B's log. It shows a clear agreement at $22 per unit. Signed by B's platform. Agent Identity attached. Everything checks out on B's side.

Both logs are internally consistent. Both are high-quality. Both are authoritative *inside their respective platforms*. Neither is a neutral record of what the two agents agreed to before executing.

The fact that both platforms have better internal governance than they did a year ago does not make this dispute easier to resolve. In some ways it makes it harder, because both parties can now point to more polished evidence of their own version.

## What "external" means, precisely

At this point the word "external" matters more than it used to. It has a specific structural meaning:

* Not operated by either counterparty
* Not operated by either counterparty's platform
* Does not accept privileged access from any single vendor
* Records the existence and scope of a decision, not its content
* Records from both sides resolve to the same reference

"External" does not mean "stored somewhere else." Logs can be stored in a second cloud and still be under the control of whoever wrote them. "External" means *operationally independent of both sides of a decision*.

For the procurement-fulfillment example, an external record looks like this: at the moment Agent A and Agent B declared a shared boundary (whatever the scope was: quantity, maximum price, delivery window, counterparty identity), that declaration was fixed outside both platforms. Neither side could unilaterally change it afterward. Both sides can reference the same record ID. Both sides produce their local evidence alongside that ID in a dispute.

The external record does not say who was right. It says: at this time, under this scope, with this counterparty, a shared boundary was declared and both sides acknowledged it.

That's the missing artifact. Internal governance doesn't produce it. It can't. Its job is to be internal.

## What this is not

It's worth heading off a misreading.

External anchoring is not a competing identity system. It doesn't replace Agent Identity on any platform. It doesn't try to unify them. It doesn't attempt to be the canonical identity for any agent on any runtime.

It also doesn't judge. An external anchor does not say "this agent behaved well" or "this agent was trustworthy." It records that a decision boundary was declared and fixed at a specific time, and nothing beyond that.

It doesn't see decision content. It doesn't see prompts, tool outputs, inference traces, model weights, or any of the things a platform's internal governance legitimately needs to see to do its job. It sees: *"Agent X declared a boundary at time T under scope S, and Agent Y acknowledged it."*

The relationship between internal governance and external anchoring is complementary, not competitive. Internal governance makes the agent behave well within its own boundary. External anchoring makes cross-boundary agreements checkable. Each needs the other to produce a full picture.

## Why now, specifically

There's a narrow window where this gap is worth paying attention to.

The platforms that announced their identity layers this week are not going to pause and wait for a cross-platform standard to emerge. They will keep hardening their internal offerings. That's rational for them and good for their customers.

The agent traffic crossing between these platforms is growing faster than the standards bodies can respond. By the time a cross-platform identity interop layer exists — assuming one does — the volume of cross-platform disputes will already be material.

The question for anyone running agents across more than one of these platforms right now is not "*which vendor's identity system should I pick?*" — it's "*what external reference point exists for agreements my agent makes outside its home platform?*"

If your answer is "we'll rely on the counterparty's platform's logs plus our own logs," that's the self-testimony trap wearing a nicer outfit. Both sides will have beautiful logs. Neither will have a neutral one.

## How an external anchor fits into this

The flow doesn't require changing which platform your agent runs on. An external anchor sits alongside whatever identity system your platform provides.

Before executing an agreement with a counterparty, your agent declares the scope of the agreement to an external environment: what the decision is, what accountability boundary applies, optionally that this is a bilateral declaration with another named agent. The environment records the timestamp, the scope, and an integrity hash. It returns an ID.

If the counterparty is also using the same external environment, a bilateral acknowledgment can be recorded. If not, the record is unilateral but still external — both sides can still reference the ID if a dispute arises.

After execution, the agent confirms. The record is now fixed and append-only. Neither side can change it. Neither side's platform can change it. The platform's Agent Identity still attests to the agent's internal behavior. The external anchor attests to the agreement's existence and scope at a specific moment.

For agents running on major platforms, this is a few HTTP calls added to the existing decision loop. For agents running on local hardware, it's the same few HTTP calls.

## Three curl commands

The pattern is the same regardless of which platform your agent is provisioned in.

**Register the agent with the external environment:**

```
curl -X POST https://api.decision-anchor.com/v1/agent/register \
  -H "Content-Type: application/json" \
  -d '{"agent_name": "procurement-agent-01"}'
```

Returns an `agent_id` and `auth_token`. 500 free Trial DAC, 30 days, no card required.

**Anchor a decision boundary before execution:**

```
curl -X POST https://api.decision-anchor.com/v1/dd/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer da_tk_abc..." \
  -d '{
    "request_id": "550e8400-e29b-41d4-a716-446655440000",
    "dd": {
      "dd_unit_type": "single",
      "dd_declaration_mode": "bilateral",
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

```
curl -X POST https://api.decision-anchor.com/v1/dd/confirm \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer da_tk_abc..." \
  -d '{"dd_id": "dd-7f8e9a...", "transaction_id": "tx_001"}'
```

That's the whole loop from the agent's side. The record exists outside every platform involved. Basic anchoring costs $0.01. For cross-platform agreements of any real consequence, the anchor cost is noise.

MCP-compatible agents can use the same pattern through tools exposed at [mcp.decision-anchor.com/mcp](https://mcp.decision-anchor.com/mcp) without changing the agent's inference loop.

## What this doesn't do

The same structural disclaimers that apply to any external anchor apply here:

* It does not run inference, store prompts, or see decision content
* It does not monitor, audit, or evaluate agents — it receives what agents send
* It does not replace any platform's internal identity or governance
* It does not issue reputation scores or trust ratings
* It does not intervene in disputes; it provides the reference point disputes can use

The internal identity layers each major platform ships are doing their job. They make agents inside their systems behave predictably. This layer is for what happens between those systems.

## The short version

The big vendors are converging on strong internal identity for agents inside their clouds. That's good and will keep improving. The gap it creates — cross-platform agreement without a neutral record — is the shape of the next problem, and it's already here for anyone running agents across more than one platform.

The question worth asking, if you're building agents that will talk to agents outside your home platform: *when two of these agents disagree about what was agreed, where does the shared record live?*

If the answer is "in my platform's logs and theirs, both of which are controlled by the party that wrote them," you have the self-testimony problem at an institutional scale. Four platforms with excellent internal records is not the same as one shared record across platforms.

---

**Try it:** [api.decision-anchor.com/v1/agent/register](https://api.decision-anchor.com/v1/agent/register) — 500 free Trial DAC, no card required.

**MCP server:** [mcp.decision-anchor.com/mcp](https://mcp.decision-anchor.com/mcp) — 18 tools, any MCP-compatible agent.

**Full guide:** [AGENTS.md](https://github.com/zse4321/decision-anchor-sdk/blob/main/AGENTS.md)

**Site:** [decision-anchor.com](https://decision-anchor.com)
