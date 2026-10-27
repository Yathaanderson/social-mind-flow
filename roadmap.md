# User administration and private AI keys

## Google sign-in
- [x] Verify Firebase Google provider and hosted authorized domains.
- [x] Improve sign-in error feedback and restore controls after popup completion (two policy tests passed; mobile popup opens Google and cancellation restores the button).
- [ ] Add published and preview app domains to Firebase authorized domains (requires owner configuration).
- [ ] Verify Google account sign-in end to end with an authorized domain and the user's Google session.

Google blocker: Firebase public configuration lists only localhost and the Firebase hosting domains. The published and preview Lovable domains are missing; published Google attempt fails. No administrative credential is configured to change these settings. Owner must add social-mind-flow.lovable.app and id-preview--3b6f6d71-651d-45a1-a258-5667ab7133b9.lovable.app in Firebase Authentication → Settings → Authorized domains. Successful Google sign-in remains unverified without the user's Google session.

- [x] Confirm owner account (yatha@socialmindflow.app) and permission to use Lovable Cloud for trusted Firebase administration.
- [ ] Configure the Firebase administrative credential securely.
- [ ] Implement private user listing and block/unblock with server-enforced access control.
- [ ] Implement encrypted, isolated per-user AI credentials and generation routing.
- [ ] Test administrator, regular-user, blocked-user, and credential-isolation flows end to end.

Blocker: The secure FIREBASE_SERVICE_ACCOUNT form was declined. Listing all Auth users, granting administrator access, blocking accounts, and verifying private credential storage cannot proceed without this authorization. No account may be granted administrator access based only on its email in client code. No user access or AI-generation behavior has been changed.