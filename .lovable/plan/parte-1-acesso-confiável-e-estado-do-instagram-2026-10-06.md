# Parte 1 — acesso confiável e estado do Instagram

## Objetivo
Deixar o acesso diário confiável sem alterar a criação, a biblioteca ou outras funções que já funcionam.

## Implementação
- Manter a cópia de segurança criada antes das alterações.
- Preservar o roteamento atual, pois as páginas publicadas já abrem diretamente; validar atualização, arquivos estáticos, sessão e página inexistente.
- Manter a proteção das páginas internas e melhorar o retorno ao login quando não houver sessão.
- Substituir mensagens técnicas do Instagram por uma explicação simples do que funciona agora, dos requisitos futuros e do modo de teste.
- Corrigir problemas de base encontrados durante a auditoria que possam quebrar a compilação, sem ampliar o escopo funcional.

## Validação
- Testar `/auth`, `/dashboard`, `/library`, `/calendar` e `/settings` por acesso direto e atualização.
- Confirmar redirecionamento ao login sem sessão e permanência no painel com sessão.
- Confirmar que arquivos estáticos continuam acessíveis e páginas inexistentes exibem a tela 404 do aplicativo.
- Verificar a tela do Instagram em celular e desktop e conferir erros do console.

## Limites desta parte
Não alterar geração, calendário, biblioteca ou publicação automática no Instagram. Essas melhorias ficam para as próximas partes.
