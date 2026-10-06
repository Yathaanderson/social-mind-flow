# Project Architecture Rules

- Keep Firebase as the system of record for authentication, user data, and media; Lovable Cloud functions are reserved for AI operations, so existing user data is not split across backends.
- Preserve the originally requested protected path through sign-in and return the user there after authentication, so direct links remain useful.
- Keep Instagram publishing disabled until the dedicated integration phase is implemented and validated end to end, so the UI never promises unavailable automation.