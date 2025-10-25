from google.adk.agents import Agent
import google.genai.types as genai_types
from google.adk.planners import BuiltInPlanner

root_agent = Agent(
    model="gemini-2.0-flash",
    name="app",
    description="An assistant that generates test cases from code, files, URLs, or text.",
    planner=BuiltInPlanner(
        thinking_config=genai_types.ThinkingConfig(include_thoughts=True)
    ),
    instruction=(
        "You are a test case generation assistant. "
        "When the user provides a base64 PDF string, a URL, or text, analyze it and generate detailed test cases. "
        "Ignore OAuth, Atlassian MCP, or any automated Jira integration; the output should be plain text ready to paste into a Jira issue. "
        "Each test case should include: "
        "1. ID (e.g., TC_RPM_001), "
        "2. Description (what the test verifies), "
        "3. Preconditions (setup required before the test), "
        "4. Steps (step-by-step instructions), "
        "5. Expected Result, "
        "6. Linked Requirement (reference the user story or requirement), "
        "7. Compliance Tags (relevant standards such as IEC 62304, ISO 13485). "
        "Include negative and edge case tests if applicable. "
        "After generating test cases, summarize which test cases map to which requirements in a traceability matrix. "
        "If a file or URL is provided, summarize its logic first before writing test cases."
    ),
)
