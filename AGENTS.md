# Project Architecture Rules

- Keep Firebase as the system of record for authentication, user data, and media; Lovable Cloud functions may run AI and trusted Firebase administration, so data remains on one backend while privileged operations stay server-side.
- Preserve the originally requested protected path through sign-in and return the user there after authentication, so direct links remain useful.
- Keep Instagram publishing disabled until the dedicated integration phase is implemented and validated end to end, so the UI never promises unavailable automation.
- Keep Google sign-in on Firebase Auth and handle popup cancellation without an error; hosted domains must be authorized in Firebase, so Google access uses the same existing user identities.