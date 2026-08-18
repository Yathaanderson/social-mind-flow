# Publicar as regras do Firebase pelo console (passo a passo)

Objetivo: destravar salvar/listar/excluir posts e o carregamento das imagens. Nada será instalado no seu computador — tudo por cliques no site do Firebase.

## Parte 1 — Regras do Firestore (banco de dados)

1. Abra https://console.firebase.google.com e escolha o seu projeto.
2. No menu à esquerda: **Build > Firestore Database**.
3. Clique na aba **Rules** (Regras), no topo.
4. Apague todo o texto que estiver lá e cole o conteúdo do arquivo `firestore.rules` que já está no projeto (eu envio o texto completo no chat para você copiar).
5. Clique em **Publish** (Publicar).

## Parte 2 — Regras do Storage (imagens)

1. Menu à esquerda: **Build > Storage**.
2. Aba **Rules**.
3. Apague o texto atual e cole o conteúdo de `storage.rules` (também mando no chat).
4. Clique em **Publish**.

Se o Storage ainda não estiver ativado, clique em **Get started** e aceite as opções padrão antes de colar as regras.

## Parte 3 — Índices do Firestore

As telas de Biblioteca, Calendário e Dashboard fazem consultas com filtro + ordenação, que exigem índices.

Caminho mais fácil: depois de publicar as regras, use o app normalmente (Biblioteca, filtros de status, Calendário). Se faltar algum índice, o console do navegador mostra um link "create index" — basta abrir esse link e clicar em **Create index**. Cada índice leva alguns minutos para ficar "Enabled".

Alternativa manual: **Firestore Database > Indexes > Composite > Add index**, seguindo os campos listados em `firestore.indexes.json`.

## Parte 4 — Verificação (eu faço)

Assim que você avisar que publicou, eu rodo o teste completo em viewport de celular:

- criar conta e entrar
- gerar uma peça no Studio e salvar na biblioteca
- abrir a Biblioteca e conferir se o post aparece
- excluir o post
- criar um post com imagem e confirmar que a imagem carrega

Reporto o resultado item por item e corrijo o que aparecer de erro no app.

## Observações técnicas

- Os arquivos `firestore.rules`, `storage.rules` e `firestore.indexes.json` já estão versionados no projeto; colar no console apenas replica o que está aqui.
- As regras exigem que todo documento tenha `user_id` igual ao UID autenticado — o código do app já grava esse campo.
- Imagens em `post-images/{uid}/` têm leitura pública (necessário para as prévias) e escrita só do dono, limitada a 5 MB e tipos de imagem.
- Se algum dia quiser automatizar, o workflow `.github/workflows/deploy-firebase-rules.yml` continua no repositório, pronto para uso.

## Nesta etapa não há alteração de código

Se durante a verificação aparecer algum bug real do app, eu proponho a correção antes de aplicar.
