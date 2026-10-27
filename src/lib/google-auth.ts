export function googleAuthErrorMessage(error: unknown): string | null {
  const code = typeof error === 'object' && error !== null && 'code' in error
    ? String(error.code)
    : '';

  switch (code) {
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return null;
    case 'auth/unauthorized-domain':
      return 'Este endereço do app ainda precisa ser autorizado no Firebase para entrar com Google.';
    case 'auth/popup-blocked':
      return 'O navegador bloqueou a janela do Google. Permita janelas pop-up para este site e tente novamente.';
    case 'auth/operation-not-allowed':
      return 'O acesso com Google precisa ser habilitado no Firebase.';
    case 'auth/account-exists-with-different-credential':
      return 'Este e-mail já utiliza outra forma de acesso. Entre pelo método original antes de conectar o Google.';
    case 'auth/network-request-failed':
      return 'Não foi possível conectar ao Google. Verifique sua internet e tente novamente.';
    default:
      return 'Não foi possível entrar com Google. Tente novamente.';
  }
}