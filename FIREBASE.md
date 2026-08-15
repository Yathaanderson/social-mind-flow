# Firebase — segurança e deploy

O backend de dados deste projeto é o Firebase (Auth, Firestore, Storage).
As regras de segurança agora estão versionadas no repositório.

## Arquivos

| Arquivo | O que é |
| --- | --- |
| `firestore.rules` | Regras do Firestore: cada usuário só acessa documentos com `user_id == auth.uid` |
| `storage.rules` | Regras do Storage: só o dono envia em `post-images/{uid}/`, máx. 5 MB, só imagens |
| `firestore.indexes.json` | Índices compostos das consultas do Dashboard, Biblioteca e Calendário |
| `firebase.json` | Aponta o CLI para os arquivos acima |

## Como publicar as regras

```bash
npm install -g firebase-tools
firebase login
firebase use <seu-project-id>
firebase deploy --only firestore:rules,firestore:indexes,storage
```

Enquanto esse deploy não for feito, as regras que valem são as que estão hoje no
console do Firebase — se o projeto foi criado em modo de teste, os dados estão
abertos e expiram (ou já expiraram) automaticamente.

## Modelo de dados esperado pelas regras

Toda escrita precisa incluir `user_id` igual ao UID autenticado. Coleções:

- `posts`
- `profiles`
- `social_accounts` (guarda `access_token` — nunca deve ser legível por terceiros)
- `user_settings`

Qualquer coleção nova é bloqueada por padrão: adicione um bloco `match` explícito
em `firestore.rules` antes de usá-la.

## Observações

- As chaves `VITE_FIREBASE_*` são públicas por design; a proteção real vem das regras acima.
- A geração de IA (texto e imagem) roda em funções de backend, sem chave no navegador.
- Imagens em `post-images/` são de leitura pública: não envie conteúdo sensível por lá.
