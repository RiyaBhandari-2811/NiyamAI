from google.adk.agents import SequentialAgent, LlmAgent
import google.genai.types as genai_types
from google.adk.planners import BuiltInPlanner
from .prompts import (
    requirement_normalizer_instruction,
    testcase_generator_agent_instruction,
    validation_agent_instruction,
)
from app.tools import connector_tool


# --- Configuration / constants (single place to change) ---
MODEL_NAME = "gemini-2.0-flash"
INCLUDE_THOUGHTS_FOR_DEBUG = True  # set True only for development
DEFAULT_PLANNER = BuiltInPlanner(
    thinking_config=genai_types.ThinkingConfig(include_thoughts=INCLUDE_THOUGHTS_FOR_DEBUG)
)



# 1) Requirement ingestor / normalizer agent
requirement_normalizer_agent = LlmAgent(
    name="RequirementNormalizer",
    description="Ingests requirements (free text, docs, user stories) and normalizes them into a structured schema.",
    model=MODEL_NAME,
    instruction=requirement_normalizer_instruction,
    planner=DEFAULT_PLANNER,
    tools=[connector_tool],
    output_key="normalized_requirements"
)

# 2) Test case generator (from normalized requirements)
testcase_generator_agent = LlmAgent(
    name="TestCaseGenerator",
    description="Generates structured test cases from normalized requirements.",
    model=MODEL_NAME,
    instruction=testcase_generator_agent_instruction,
    planner=DEFAULT_PLANNER,
    output_key="generated_test_cases"
)

# 3) Test case validator and delivery to ALM tool
validation_agent = LlmAgent(
    name="ValidationAndDeliveryAgent",  
    description="Validates the generated test cases and prepares them for delivery.",
    model=MODEL_NAME,
    instruction=validation_agent_instruction,
    planner=DEFAULT_PLANNER,
    tools=[connector_tool],
    output_key="validated_test_cases"
)



# ---SequentialAgent ---
# This agent orchestrates the pipeline by running the sub_agents in order.
testcase_pipeline_agent = SequentialAgent(
    name="TestCasePipelineAgent",
    sub_agents=[requirement_normalizer_agent, testcase_generator_agent, validation_agent],
    description="Executes a sequence of requirement ingestion, test case generation, and validation.",
    # The agents will run in the order provided: Ingestor -> Generator -> Validator/Deliverer
)

root_agent = testcase_pipeline_agent