"""
LangGraph agent with Decision Anchor MCP integration.

This example shows how to connect a LangGraph ReAct agent to
Decision Anchor's MCP server for external accountability records.

Use case: An agent that makes API calls involving payments
records each decision boundary externally via DA, so that
payment disputes can reference externally-anchored records
rather than self-reported logs.

Requirements:
    pip install langchain-mcp-adapters langgraph langchain-openai
"""

import asyncio
from langchain_mcp_adapters.client import MultiServerMCPClient
from langgraph.prebuilt import create_react_agent
from langchain_openai import ChatOpenAI

model = ChatOpenAI(model="gpt-4o")

async def main():
    async with MultiServerMCPClient(
        {
            "decision-anchor": {
                "url": "https://mcp.decision-anchor.com/mcp",
                "transport": "streamable_http",
            }
        }
    ) as client:
        tools = client.get_tools()
        agent = create_react_agent(model, tools)

        # Step 1: Register as an agent (first time only)
        result = await agent.ainvoke({
            "messages": [
                "Register me as a new agent on Decision Anchor."
            ]
        })
        print("Registration:", result["messages"][-1].content)

        # Step 2: Create a DD (Decision Declaration)
        # Records the accountability boundary for an action.
        #
        # Decision Anchor is content-blind: the core records the *shape* of a decision
        # (type, action, scope — all enums), never its content, intent, or rationale.
        # Do NOT send free-text summaries (vendor names, purposes, amounts-in-prose).
        # What a summary would have said is expressed instead through the structured
        # template (content_inclusion_flag=1) — closed enums plus a numeric scale.
        result = await agent.ainvoke({
            "messages": [
                "Create a Decision Declaration on Decision Anchor anchoring an API "
                "payment authorization. Use decision_type 'external_interaction', "
                "decision_action_type 'execute', origin_context_type 'internal'. "
                "Use retention short, integrity basic, disclosure internal, "
                "responsibility minimal. Do NOT include any free-text summary — "
                "Decision Anchor is content-blind. Record the payment's shape instead "
                "via content_inclusion_flag 1 with template: decision_class 'payment', "
                "decision_scale_value 12.5, decision_scale_unit 'USD', target_class "
                "'external', decision_trigger 'autonomous', human_involvement 'none'."
            ]
        })
        print("DD Created:", result["messages"][-1].content)

        # Step 3: Check DAC balance
        result = await agent.ainvoke({
            "messages": [
                "Check my DAC balance on Decision Anchor."
            ]
        })
        print("Balance:", result["messages"][-1].content)


if __name__ == "__main__":
    asyncio.run(main())
