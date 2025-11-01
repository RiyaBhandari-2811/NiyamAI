# file: app/tools/jira_function_tool_adapter.py
from typing import Optional
import inspect
import os
import logging

# Import only classes / functions — do NOT instantiate them at import time.
from app.tools.jira_rest_tool import JiraRestTool
from app.tools.get_firestore_doc_id import get_firestore_doc_id
from google.adk.tools.function_tool import FunctionTool

logger = logging.getLogger(__name__)

# Lazy holder for the Jira helper instance
_jira_helper: Optional[JiraRestTool] = None
_jira_helper_error: Optional[Exception] = None


def _get_jira_helper() -> JiraRestTool:
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
        collection = os.getenv("JIRA_TOKEN_COLLECTION", "users")
        # Allow explicit override of doc_id via env var for convenience
        env_doc_id = os.getenv("JIRA_TOKEN_DOC_ID")

        if env_doc_id:
            doc_id = env_doc_id
            logger.debug("Using JIRA_TOKEN_DOC_ID from env: %s", doc_id)
        else:
            # Try to compute doc id via helper (if available)
            project_id = os.getenv("GOOGLE_CLOUD_PROJECT")
            database_id = os.getenv("GCP_FIRESTORE_DB")
            logger.debug("Attempting get_firestore_doc_id with project=%s db=%s collection=%s",
                         project_id, database_id, collection)
            doc_id = get_firestore_doc_id(project_id=project_id, database_id=database_id, collection_name=collection)

        if not doc_id:
            raise RuntimeError(
                "Firestore doc id for Jira tokens not found. "
                "Set JIRA_TOKEN_DOC_ID env var or ensure get_firestore_doc_id can resolve it."
            )

        # Instantiate JiraRestTool (this will perform Firestore IO)
        logger.info("Instantiating JiraRestTool with collection=%s doc_id=%s", collection, doc_id)
        _jira_helper = JiraRestTool(collection=collection, doc_id=doc_id)
        return _jira_helper

    except Exception as e:
        # Save the error so subsequent calls don't repeatedly attempt and fail silently
        _jira_helper_error = e
        logger.exception("Failed to instantiate JiraRestTool: %s", e)
        raise


def jira_rest_tool(
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
    try:
        jira = _get_jira_helper()
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
