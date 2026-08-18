# Reteste completo no celular após publicação das regras

Você publicou as regras do Firestore e do Storage. Agora vou validar, no viewport de celular, se todo o fluxo real funciona contra o Firebase de produção.

## O que será testado (ponta a ponta)

1. Cadastro e login com uma conta nova (e-mail/senha).
2. Leitura do perfil e carregamento do Dashboard sem erro de permissão.
3. Studio: gerar peça e "Salvar na biblioteca" criando rascunho real.
4. Biblioteca: listar, editar, duplicar e excluir o post criado.
5. Upload de imagem em post (Storage) e verificação de que a URL carrega na prévia e na listagem.
6. Console e rede limpos: sem `Missing or insufficient permissions` e sem erros novos.

## Como

Automação com Playwright em viewport 430x786 contra o app rodando localmente, com screenshots em cada etapa e captura de console/rede.

## Se algo falhar

Reporto item por item com a evidência (erro exato + tela) e, quando a causa for código do app (não regra do Firebase), corrijo em seguida:
- Regra faltando/estrita demais: aponto a linha exata a ajustar no console.
- Índice do Firestore ausente: informo o link de criação gerado pelo erro.
- Bug de aplicação: correção direta no arquivo envolvido.

## Resultado

Um relatório curto marcando cada um dos 6 pontos como OK ou com falha, e os arquivos corrigidos caso apareça bug no app.
