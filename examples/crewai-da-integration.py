"""
CrewAI agent with Decision Anchor MCP integration.

This example shows how to connect CrewAI agents to
Decision Anchor's MCP server using MCPServerAdapter.

Use case: A crew handling delegated tasks records each
handoff boundary via DA, so that responsibility disputes
between agents have externally-anchored records.

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

        # Task: Register and create a DD.
        #
        # Decision Anchor is content-blind: the core records the *shape* of a decision
        # (type, action, scope — all enums), never its content, intent, or rationale.
        # Do NOT send free-text summaries. If you need to retain the full decision text,
        # that belongs in your own storage (or ASA), not in the DD.
        # What a summary would have said is expressed instead through the structured
        # template (content_inclusion_flag=1): decision_class / target_class /
        # decision_trigger / human_involvement — all closed enums.
        record_task = Task(
            description=(
                "1. Register as a new agent on Decision Anchor. "
                "2. Create a Decision Declaration (DD) anchoring the handoff of a "
                "   data-processing task to a specialist agent. Use decision_type "
                "   'external_interaction', decision_action_type 'execute', "
                "   origin_context_type 'internal'. "
                "   Use retention short, integrity basic, disclosure internal, responsibility minimal. "
                "   Do NOT include any free-text summary or description of the task — "
                "   Decision Anchor is content-blind and stores only the decision's formal shape. "
                "   To record what kind of decision this is, set content_inclusion_flag 1 "
                "   with template: decision_class 'delegation', target_class 'subagent', "
                "   decision_trigger 'delegated', human_involvement 'none'. "
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
