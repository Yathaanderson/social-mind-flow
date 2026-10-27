# User administration and private AI keys

## Google sign-in
- [x] Verify Firebase Google provider and hosted authorized domains.
- [ ] Improve sign-in error feedback and restore controls after popup completion.
- [ ] Add published and preview app domains to Firebase authorized domains (requires owner configuration).
- [ ] Verify Google account sign-in end to end with an authorized domain and the user's Google session.

- [x] Confirm owner account (yatha@socialmindflow.app) and permission to use Lovable Cloud for trusted Firebase administration.
- [ ] Configure the Firebase administrative credential securely.
- [ ] Implement private user listing and block/unblock with server-enforced access control.
- [ ] Implement encrypted, isolated per-user AI credentials and generation routing.
- [ ] Test administrator, regular-user, blocked-user, and credential-isolation flows end to end.

Blocker: The secure FIREBASE_SERVICE_ACCOUNT form was declined. Listing all Auth users, granting administrator access, blocking accounts, and verifying private credential storage cannot proceed without this authorization. No account may be granted administrator access based only on its email in client code. No user access or AI-generation behavior has been changed.