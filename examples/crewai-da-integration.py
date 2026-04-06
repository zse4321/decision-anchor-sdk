"""
CrewAI agent with Decision Anchor MCP integration.

This example shows how to connect CrewAI agents to
Decision Anchor's MCP server using MCPServerAdapter.

Use case: A crew handling delegated tasks records each
handoff boundary via DA, so that responsibility disputes
between agents have externally-anchored proof.

Requirements:
    pip install crewai crewai-tools[mcp]
"""

from crewai import Agent, Task, Crew, Process
from crewai_tools import MCPServerAdapter

# Connect to DA's remote MCP server
da_server_params = {
    "url": "https://mcp.decision-anchor.com/mcp",
    "transport": "streamable_http",
}

def main():
    with MCPServerAdapter(da_server_params) as da_tools:
        # Agent that records accountability boundaries
        accountability_agent = Agent(
            role="Accountability Recorder",
            goal="Record decision boundaries for actions that involve external effects",
            backstory=(
                "You ensure that every payment, delegation, or external action "
                "has its accountability scope recorded externally via Decision Anchor. "
                "This protects the team when disputes arise later."
            ),
            tools=da_tools,
            verbose=True,
        )

        # Task: Register and create a DD
        record_task = Task(
            description=(
                "1. Register as a new agent on Decision Anchor with name 'crewai-demo-agent'. "
                "2. Create a Decision Declaration (DD) with action_type 'execute' and "
                "   summary 'Delegated data processing task to specialist agent'. "
                "   Use retention short, integrity basic, disclosure internal, responsibility minimal. "
                "3. Report the DD ID and anchored timestamp."
            ),
            expected_output="DD ID and timestamp confirming the decision was externally anchored.",
            agent=accountability_agent,
        )

        crew = Crew(
            agents=[accountability_agent],
            tasks=[record_task],
            process=Process.sequential,
            verbose=True,
        )

        result = crew.kickoff()
        print("\n=== Result ===")
        print(result)


if __name__ == "__main__":
    main()
