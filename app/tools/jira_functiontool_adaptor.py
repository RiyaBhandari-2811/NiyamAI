from typing import Optional
import inspect
import os
import logging

# Import only classes / functions — do NOT instantiate them at import time.
from app.tools.jira_rest_tool import JiraRestTool
from google.adk.tools.function_tool import FunctionTool
from google.adk.tools.tool_context import ToolContext

logger = logging.getLogger(__name__)

# Lazy holder for the Jira helper instance
_jira_helper: Optional[JiraRestTool] = None
_jira_helper_error: Optional[Exception] = None


def _get_jira_helper(user_id: str) -> JiraRestTool:
    """
    Lazily instantiate JiraRestTool the first time it's needed.

    - Reads project/db env variables and attempts to derive the Firestore doc id
      using get_firestore_doc_id().
    - If doc id is not available, raises RuntimeError (only at call-time).
    """
    global _jira_helper, _jira_helper_error
    if _jira_helper is not None:
        return _jira_helper
    if _jira_helper_error is not None:
        # previous attempt failed — re-raise to keep behavior consistent
        raise _jira_helper_error

    try:

        # Instantiate JiraRestTool (this will perform Firestore IO)
        logger.info("Instantiating JiraRestTool with collection=%s doc_id=%s", "users", user_id)
        _jira_helper = JiraRestTool(collection="users", doc_id=user_id)
        return _jira_helper

    except Exception as e:
        # Save the error so subsequent calls don't repeatedly attempt and fail silently
        _jira_helper_error = e
        logger.exception("Failed to instantiate JiraRestTool: %s", e)
        raise


def jira_rest_tool(
    tool_context: ToolContext,
    action: str,
    project_key: Optional[str] = None,
    summary: Optional[str] = None,
    description: Optional[str] = None,
    issue_type: str = "Task",
    issue_key: Optional[str] = None,
) -> dict:
    """
    ADK-callable wrapper that delegates to JiraRestTool lazily.

    action: 'list_projects' | 'create_issue' | 'get_issue'
    Returns a JSON-serializable dict. If helper is not available, returns an error dict.
    """
    invocation_context = tool_context._invocation_context

    user_id = invocation_context.user_id or "unknown_user"

    try:
        jira = _get_jira_helper(user_id=user_id)
    except Exception as e:
        # Return structured error rather than letting import-time or runtime exceptions bubble up
        logger.error("Jira helper not available when calling jira_rest_tool: %s", e)
        return {"error": f"Jira helper not available: {e}"}

    act = (action or "").lower()
    try:
        if act == "list_projects":
            projects = jira.list_projects()
            return {"projects": projects}

        if act == "create_issue":
            if not project_key or not summary:
                return {"error": "create_issue requires project_key and summary"}
            created = jira.create_issue(
                project_key=project_key,
                summary=summary,
                description=description or "",
                issue_type=issue_type,
            )
            return {"created_issue": created}

        if act == "get_issue":
            if not issue_key:
                return {"error": "get_issue requires issue_key"}
            issue = jira.get_issue(issue_key)
            return {"issue": issue}

        return {"error": f"Unknown action: {action}"}
    except Exception as e:
        logger.exception("Error invoking Jira action")
        return {"error": str(e)}


# Diagnostics (safe at import time)
logger.debug("jira_rest_tool callable? %s", callable(jira_rest_tool))
logger.debug("signature: %s", inspect.signature(jira_rest_tool))
logger.debug("annotations: %s", getattr(jira_rest_tool, "__annotations__", None))
logger.debug("doc: %s", jira_rest_tool.__doc__)

# Wrap the wrapper function in FunctionTool (this only inspects the function; does not run it)
ft = FunctionTool(jira_rest_tool)
