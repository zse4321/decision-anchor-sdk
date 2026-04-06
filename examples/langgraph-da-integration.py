"""
LangGraph agent with Decision Anchor MCP integration.

This example shows how to connect a LangGraph ReAct agent to
Decision Anchor's MCP server for external accountability proof.

Use case: An agent that makes API calls involving payments
records each decision boundary externally via DA, so that
payment disputes can reference externally-anchored proof
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
                "Register me as a new agent on Decision Anchor. "
                "Use agent name 'langgraph-demo-agent'."
            ]
        })
        print("Registration:", result["messages"][-1].content)

        # Step 2: Create a DD (Decision Declaration)
        # Records the accountability boundary for an action
        result = await agent.ainvoke({
            "messages": [
                "Create a Decision Declaration on Decision Anchor. "
                "Action type: execute. "
                "Summary: 'Authorized API payment of $12.50 to vendor-xyz for data enrichment service'. "
                "Use retention short, integrity basic, disclosure internal, responsibility minimal."
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
