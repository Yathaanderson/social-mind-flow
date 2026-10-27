import { describe, expect, it } from 'vitest';
import { googleAuthErrorMessage } from './google-auth';

describe('Google authentication error policy', () => {
  it('does not treat cancellation as a failed login', () => {
    expect(googleAuthErrorMessage({ code: 'auth/popup-closed-by-user' })).toBeNull();
    expect(googleAuthErrorMessage({ code: 'auth/cancelled-popup-request' })).toBeNull();
  });

  it('distinguishes missing domain authorization from missing provider activation', () => {
    expect(googleAuthErrorMessage({ code: 'auth/unauthorized-domain' })).not.toEqual(
      googleAuthErrorMessage({ code: 'auth/operation-not-allowed' }),
    );
  });
});