# User administration and private AI keys

- [ ] Confirm secure Firebase server deployment and the owner's administrative account.
- [ ] Implement private user listing and block/unblock with server-enforced access control.
- [ ] Implement encrypted, isolated per-user AI credentials and generation routing.
- [ ] Test administrator, regular-user, blocked-user, and credential-isolation flows end to end.

Blocker: Firebase administrative credentials/server deployment are not configured. No account may be granted administrator access based only on its email in client code.