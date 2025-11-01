from app.tools.jira_functiontool_adaptor import ft
import inspect
print("ft type:", type(ft))
print("wrapped func:", ft.func.__name__)
print("signature:", inspect.signature(ft.func))