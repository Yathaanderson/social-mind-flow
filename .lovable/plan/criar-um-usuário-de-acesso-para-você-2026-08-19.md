# Criar um usuário de acesso para você

## Situação atual (verificada)

- O login do sistema é feito pelo Firebase Authentication (e-mail/senha ou Google).
- Não existe nenhum conceito de "usuário admin" no código: não há tabela/coleção de papéis, nem tela de administração. Todo usuário logado vê apenas os próprios dados (as regras do Firestore filtram por `user_id`).
- Eu não consigo *listar* os usuários já cadastrados no Firebase: isso exige uma chave de administrador do seu projeto Firebase, que não está disponível aqui. Ou seja, não tenho como confirmar se já existe uma conta sua — só você consegue ver isso em Authentication > Users no console do Firebase.

## O que proponho fazer

1. Criar uma conta nova pela própria tela de cadastro do app (mesmo fluxo de qualquer usuário), com:
   - e-mail: `yatha@socialmindflow.app` (ou o e-mail que você preferir)
   - senha forte gerada na hora
2. Validar a conta ponta a ponta: entrar, abrir o Studio, salvar uma peça, ver na Biblioteca e excluir.
3. Te entregar e-mail e senha no chat para você acessar, com a recomendação de trocar a senha depois.

## Observações

- Essa conta é um usuário comum — não dá privilégios extras, porque o sistema não tem esse recurso hoje.
- Se você quiser de fato um perfil de administrador (ver/gerenciar posts de todos os usuários), isso é um trabalho separado: criar coleção de papéis, ajustar as regras do Firestore e uma tela de admin. Posso planejar isso depois, se quiser.
- Se você já tem um e-mail cadastrado e só esqueceu a senha, o caminho melhor é adicionar um botão "Esqueci minha senha" na tela de login (envio de e-mail de redefinição pelo Firebase). Me avise se prefere essa opção.
