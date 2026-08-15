# Auditoria das novas integrações + correções

Analisei o estado atual do código. A integração com Firebase (Auth, Firestore, Storage) está montada e coerente, e não há erros de runtime registrados no preview. Porém encontrei 4 problemas confirmados que quebram funcionalidades e 1 risco grave de segurança.

## O que está funcionando

- Autenticação (login por e-mail/senha e Google) via Firebase, com proteção de rotas no layout principal.
- Camada de dados Firestore completa: posts (listagem, filtro, agenda, CRUD), perfis, contas sociais e preferências.
- Upload de imagens para o Storage e as telas de Studio, Calendário, Biblioteca, Dashboard e Configurações.

## Problemas encontrados

### 1. Chave da OpenAI exposta no navegador (crítico)
`VITE_OPENAI_API_KEY` está no `.env` e é lida direto no front (`src/lib/openai.ts`, `src/lib/openai-image.ts`). Tudo que começa com `VITE_` vai para o bundle público: qualquer visitante do app publicado pode extrair essa chave e gastar sua conta. A chave atual deve ser considerada vazada e revogada.

Correção: mover as chamadas de texto e imagem para o backend (Lovable Cloud), guardando a chave como secret do servidor. Alternativa recomendada: usar o gateway de IA nativo, que já cobre geração de texto e imagem sem chave própria.

### 2. Cadastro de novo usuário quebra
Em `AuthContext.signUp` é chamado `credential.user.updateProfile(...)`, método que não existe na versão modular do Firebase. O usuário é criado, mas o app lança erro logo depois e o nome não é salvo. Correção: usar a função `updateProfile(user, { displayName })` importada de `firebase/auth` e gravar o perfil no Firestore.

### 3. Excluir post na Biblioteca não funciona
Em `src/pages/Library.tsx` o estado `deletePost` tem o mesmo nome da função importada de exclusão, então o `deletePost(...)` dentro de `handleDelete` chama o objeto do estado, não a função — resultando em erro. Correção: renomear o estado para `postToDelete`.

### 4. Menu mobile com prop inválida
`src/components/layout/Sidebar.tsx` usa `<SheetTrigger asItem>` em vez de `asChild`, gerando botão dentro de botão (HTML inválido e aviso do React). Como você está no preview mobile, esse é o menu lateral. Correção: trocar por `asChild`.

### 5. Configuração de TypeScript desatualizada
`tsconfig.app.json` ainda usa `baseUrl`, opção removida nas versões atuais, o que faz o typecheck falhar. Correção: substituir por `paths: { "*": ["./*"] }` mantendo o alias `@/`.

## Ponto de arquitetura a decidir

O projeto tem o Lovable Cloud ativo, mas todo o backend real está no Firebase. Manter os dois é fonte de confusão e custo. Além disso, não há arquivos de regras de segurança do Firestore/Storage versionados no projeto — sem regras corretas no console do Firebase, os dados dos usuários podem estar abertos a qualquer um.

Duas opções:
- **Manter Firebase**: eu documento e versiono as regras recomendadas de Firestore e Storage (cada usuário só lê/escreve os próprios dados) e o backend serve apenas para proteger a chave de IA.
- **Migrar para o Lovable Cloud**: banco, auth, storage e funções de IA num só lugar, com segurança por linha e sem chave exposta. Migração maior, feita por etapas.

## Conselhos práticos (fora do escopo dos bugs)

- Nunca expor chave de provedor de IA no front — toda chamada paga deve passar por função de servidor com limite por usuário.
- Adicionar tratamento de erro visível quando a geração de IA falhar (hoje alguns fluxos só logam no console).
- Criar índices no Firestore para as consultas com filtro + ordenação da Biblioteca antes que o volume cresça.
- Definir metadados de SEO reais no `index.html` (título e descrição do produto) antes de divulgar o link publicado.

## Escopo técnico da correção (etapa 1)

Arquivos a alterar: `src/contexts/AuthContext.tsx`, `src/pages/Library.tsx`, `src/components/layout/Sidebar.tsx`, `tsconfig.app.json`, e a camada de IA (`src/lib/openai*.ts` + componentes que a consomem) movida para chamada de backend.
