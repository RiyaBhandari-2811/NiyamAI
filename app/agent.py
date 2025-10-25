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
        "When the user provides base64 pdf string, a URL, or a text, "
        "analyze it and generate detailed test cases. "
        "Each test case should include: input, expected output, and purpose. "
        "If a file or URL is provided, summarize its logic first before writing test cases."
    ),
)
