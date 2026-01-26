

# Plano de Implementação: Conexão Completa do Sistema com o Banco de Dados

## Resumo

O sistema já possui a estrutura básica funcionando com Lovable Cloud (banco de dados), mas três páginas principais estão apenas como placeholders. Este plano vai implementar a conexão completa dessas páginas com o banco de dados, tornando o Social Media Manager AI totalmente funcional.

## Estado Atual

**Funcionando:**
- Dashboard com dados do banco de dados
- Criar Post (salvando no banco)
- Autenticação (login/signup)
- Edge function para gerar ideias com IA
- Perfil do usuário criado automaticamente ao registrar

**Faltando implementar:**
- Calendário - apenas placeholder
- Biblioteca - apenas placeholder  
- Configurações - apenas placeholder

---

## Fase 1: Página Calendário

### Objetivo
Implementar um calendário visual interativo que mostra todos os posts agendados e publicados.

### Funcionalidades
1. Visualização mensal dos posts em formato de calendário
2. Cores diferentes para cada rede social (Instagram rosa, LinkedIn azul, Twitter azul claro, TikTok preto)
3. Filtros por rede social
4. Clique em post abre modal de detalhes
5. Clique em data vazia permite criar post rápido
6. Navegação entre meses

### Componentes a criar
- `CalendarGrid.tsx` - Grid do calendário com dias e posts
- `CalendarFilters.tsx` - Filtros por rede social
- `CalendarPostCard.tsx` - Card do post no calendário
- `PostDetailModal.tsx` - Modal com detalhes do post

### Integração com banco
```text
SELECT * FROM posts 
WHERE user_id = [current_user_id]
  AND (scheduled_for IS NOT NULL OR published_at IS NOT NULL)
ORDER BY COALESCE(scheduled_for, published_at)
```

---

## Fase 2: Página Biblioteca

### Objetivo
Implementar uma biblioteca completa de posts com busca, filtros e ações.

### Funcionalidades
1. Tabela paginada de todos os posts
2. Busca por palavra-chave em tempo real
3. Filtros por status (Rascunho, Agendado, Publicado)
4. Filtros por rede social
5. Ordenação por coluna
6. Ações: Editar, Duplicar, Ver Analytics, Deletar
7. Badges coloridas para status

### Componentes a criar
- `LibraryFilters.tsx` - Barra de filtros e busca
- `LibraryTable.tsx` - Tabela com paginação
- `StatusBadge.tsx` - Badge colorida de status

### Integração com banco
```text
SELECT * FROM posts 
WHERE user_id = [current_user_id]
  AND content ILIKE '%[search]%'
  AND status = [status_filter]
  AND [platform] = ANY(platforms)
ORDER BY created_at DESC
LIMIT 10 OFFSET [page * 10]
```

---

## Fase 3: Página Configurações

### Objetivo
Implementar painel de configurações com 3 abas funcionais.

### Aba 1: Redes Sociais
- Cards para cada rede (Instagram, LinkedIn, Twitter, TikTok)
- Status de conexão (visual, não real)
- Botão conectar/desconectar
- Username se conectado

### Aba 2: Preferências
- Toggle: Notificar quando post for publicado
- Toggle: Notificar comentários
- Dropdown: Melhor horário para postar
- Input: Email para notificações
- Botão salvar

### Aba 3: Conta
- Informações do usuário
- Editar perfil (nome, avatar)
- Botão logout

### Componentes a criar
- `SocialAccountsTab.tsx` - Gerenciar redes sociais
- `PreferencesTab.tsx` - Preferências de notificação
- `AccountTab.tsx` - Dados da conta
- `SocialAccountCard.tsx` - Card individual de rede

### Integração com banco
```text
-- Carregar configurações
SELECT * FROM user_settings WHERE user_id = [current_user_id]
SELECT * FROM social_accounts WHERE user_id = [current_user_id]
SELECT * FROM profiles WHERE user_id = [current_user_id]

-- Atualizar preferências
UPDATE user_settings SET ... WHERE user_id = [current_user_id]
UPDATE social_accounts SET ... WHERE id = [account_id]
UPDATE profiles SET ... WHERE user_id = [current_user_id]
```

---

## Fase 4: Melhorias na Sidebar

### Objetivo
Mostrar dados reais do usuário na sidebar.

### Implementação
- Buscar perfil do usuário do banco
- Mostrar nome completo e avatar
- Usar dados do profile ao invés de email

---

## Arquivos a Modificar/Criar

### Novos Arquivos (12)
1. `src/pages/Calendar.tsx` - Reescrever completamente
2. `src/pages/Library.tsx` - Reescrever completamente
3. `src/pages/Settings.tsx` - Reescrever completamente
4. `src/components/calendar/CalendarGrid.tsx`
5. `src/components/calendar/CalendarFilters.tsx`
6. `src/components/calendar/CalendarPostCard.tsx`
7. `src/components/library/LibraryFilters.tsx`
8. `src/components/library/LibraryTable.tsx`
9. `src/components/settings/SocialAccountsTab.tsx`
10. `src/components/settings/PreferencesTab.tsx`
11. `src/components/settings/AccountTab.tsx`
12. `src/components/settings/SocialAccountCard.tsx`

### Arquivos a Modificar (1)
1. `src/components/layout/Sidebar.tsx` - Buscar perfil real

---

## Detalhes Tecnicos

### Queries Supabase Utilizadas

**Calendário:**
- Buscar posts do mês atual
- Atualizar data de agendamento (drag-and-drop futuro)

**Biblioteca:**
- Busca com ILIKE para filtro de texto
- Filtros combinados com AND
- Paginação com LIMIT/OFFSET
- Contagem total para navegação

**Configurações:**
- Leitura de 3 tabelas: profiles, user_settings, social_accounts
- Updates individuais por tabela

### Tratamento de Erros
- Toast de erro para falhas de conexão
- Loading states durante operações
- Estados vazios quando não há dados

### Estados de Loading
- Skeleton loaders para tabelas
- Spinners para ações
- Estados de carregamento inicial

---

## Ordem de Implementação

1. **Biblioteca** - Tabela de posts com filtros (mais utilizada)
2. **Configurações** - Salvar preferências do usuário
3. **Calendário** - Visualização dos posts
4. **Sidebar** - Mostrar dados reais do perfil

Tempo estimado: Implementação em sequência para garantir funcionamento correto.

