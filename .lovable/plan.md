
# Plano: Drag-and-Drop no Calendário

## Objetivo
Adicionar funcionalidade de arrastar e soltar posts entre datas no calendário para reagendar de forma visual e intuitiva.

## Abordagem Tecnica

Utilizaremos a **HTML5 Drag and Drop API nativa** do navegador, que:
- Nao requer bibliotecas adicionais
- E leve e performatica
- Funciona bem com React
- Suporta feedback visual nativo

## Como vai funcionar

1. Usuario clica e segura um post no calendario
2. Post fica semi-transparente indicando que esta sendo arrastado
3. Ao passar sobre outras datas, a celula do dia destaca visualmente
4. Ao soltar em outra data, o post e reagendado automaticamente
5. Toast de confirmacao aparece com a nova data

## Arquivos a Modificar

### 1. CalendarPostCard.tsx
**Mudancas:**
- Adicionar atributo `draggable={true}`
- Implementar `onDragStart` para iniciar o arrasto e salvar dados do post
- Adicionar estilos visuais durante o arrasto (opacity, cursor)

### 2. CalendarGrid.tsx
**Mudancas:**
- Adicionar prop `onPostDrop` para receber callback de reagendamento
- Implementar `onDragOver` nas celulas de dia para permitir drop
- Implementar `onDragEnter/onDragLeave` para feedback visual ao passar sobre datas
- Implementar `onDrop` para capturar o post e chamar callback com nova data
- Estado local para controlar qual celula esta destacada

### 3. Calendar.tsx (pagina principal)
**Mudancas:**
- Adicionar funcao `handlePostDrop(postId, newDate)` que:
  - Atualiza `scheduled_for` no banco de dados
  - Muda status para "agendado" se necessario
  - Mostra toast de confirmacao
  - Recarrega posts do calendario

## Detalhes de Implementacao

### Dados do Drag
```text
Durante o drag, armazenamos no dataTransfer:
- post.id (para identificar qual post)
- Data original (para feedback)
```

### Estados Visuais
```text
Post sendo arrastado:
- opacity: 0.5
- cursor: grabbing
- scale: 0.95

Celula de destino (hover):
- background: primary/20
- border: dashed primary
- scale: 1.02
```

### Validacoes
- Apenas posts com status "rascunho" ou "agendado" podem ser movidos
- Posts "publicados" nao podem ser arrastados (ja foram publicados)
- Feedback visual diferente para posts nao arrastaveis

### Query de Atualizacao
```text
UPDATE posts
SET scheduled_for = [nova_data],
    status = 'agendado'
WHERE id = [post_id]
  AND user_id = [current_user_id]
```

## Experiencia do Usuario

1. **Cursor**: Muda para "grab" ao passar sobre posts arrastaveis
2. **Arrastar**: Post fica transparente, celulas destino destacam
3. **Soltar**: Animacao suave, toast confirma reagendamento
4. **Erro**: Toast de erro se falhar, post volta a posicao original
5. **Posts publicados**: Cursor "not-allowed", nao arrastavel

## Arquivos Envolvidos

| Arquivo | Acao |
|---------|------|
| `src/components/calendar/CalendarPostCard.tsx` | Modificar |
| `src/components/calendar/CalendarGrid.tsx` | Modificar |
| `src/pages/Calendar.tsx` | Modificar |

## Ordem de Implementacao

1. **CalendarPostCard**: Tornar arrastavel com draggable e onDragStart
2. **CalendarGrid**: Adicionar drop zones nas celulas de dias
3. **Calendar.tsx**: Implementar logica de atualizacao no banco
4. **Testes**: Verificar arrastar entre meses e feedback visual
