import os
from google.adk.tools.application_integration_tool.application_integration_toolset import ApplicationIntegrationToolset
from dotenv import load_dotenv
load_dotenv()

connector_tool = ApplicationIntegrationToolset(
    project=os.getenv("GOOGLE_CLOUD_PROJECT"),
    location=os.getenv("GOOGLE_CLOUD_LOCATION"),
    connection="jira-connection",     
    entity_operations={"Issues": ["GET", "LIST", "CREATE", "UPDATE", "DELETE"]},
    tool_name="JiraTool",
    tool_instructions="Use this tool to interact with Jira issues."
)