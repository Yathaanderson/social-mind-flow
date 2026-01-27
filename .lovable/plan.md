

# Plano: Geração de Imagens com IA para Posts

## Objetivo
Adicionar a capacidade de gerar imagens automaticamente usando o modelo `google/gemini-2.5-flash-image` do Lovable AI, permitindo que usuários criem imagens únicas para seus posts baseadas em descrições textuais.

---

## Arquitetura da Solução

```text
+------------------+       +------------------------+       +-------------------+
|   ImageUpload    | ----> | generate-post-image    | ----> |   Lovable AI      |
|   (Frontend)     |       |   (Edge Function)      |       | gemini-flash-image|
+------------------+       +------------------------+       +-------------------+
        |                            |                              |
        v                            v                              v
  [Prompt do usuário]    [Chamada à API com prompt]    [Retorna base64 da imagem]
        |                            |                              |
        v                            v                              v
+------------------+       +------------------------+       +-------------------+
| post-images      | <---- |   Upload do base64     | <---- |   Imagem gerada   |
| (Storage Bucket) |       |   convertido para file |       |                   |
+------------------+       +------------------------+       +-------------------+
```

---

## Etapas de Implementação

### 1. Criar Edge Function para Geração de Imagens

Criar uma nova função `generate-post-image` que:
- Recebe um prompt descritivo do usuário
- Chama a API do Lovable AI com o modelo `google/gemini-2.5-flash-image`
- Retorna a imagem em base64

**Arquivo**: `supabase/functions/generate-post-image/index.ts`

```typescript
// Estrutura da função:
// - Recebe: { prompt: string, style?: string }
// - Retorna: { imageBase64: string } ou { error: string }
// - Usa modalities: ["image", "text"] conforme documentação
```

### 2. Atualizar config.toml

Registrar a nova Edge Function no arquivo de configuração para deploy automático.

### 3. Criar Componente AIImageGenerator

Novo componente que:
- Exibe campo de texto para descrição da imagem
- Seletor de estilo visual (opcional)
- Botão para gerar imagem
- Preview da imagem gerada
- Botão para usar a imagem no post

**Arquivo**: `src/components/post/AIImageGenerator.tsx`

### 4. Atualizar ImageUpload

Integrar o `AIImageGenerator` no componente `ImageUpload` existente, adicionando uma terceira opção além de upload e URL:
- Upload de arquivo (existente)
- URL externa (existente)
- **Gerar com IA (novo)**

### 5. Fluxo de Geração

```text
1. Usuário digita descrição da imagem
2. Clica em "Gerar Imagem"
3. Frontend chama Edge Function
4. Edge Function chama Lovable AI
5. Imagem retorna em base64
6. Frontend converte base64 para File
7. Faz upload para o bucket post-images
8. Retorna URL pública para o post
```

---

## Detalhes Técnicos

### Edge Function - generate-post-image

```typescript
// Payload para o Lovable AI
{
  model: "google/gemini-2.5-flash-image",
  messages: [
    {
      role: "user",
      content: `Crie uma imagem profissional para redes sociais: ${prompt}`
    }
  ],
  modalities: ["image", "text"]
}

// Resposta esperada
{
  choices: [{
    message: {
      images: [{
        image_url: { url: "data:image/png;base64,..." }
      }]
    }
  }]
}
```

### Estilos Visuais (Opcional)

O usuário poderá escolher estilos como:
- **Minimalista** - Clean e moderno
- **Colorido** - Vibrante e chamativo
- **Profissional** - Corporativo e formal
- **Artístico** - Criativo e abstrato

### Tratamento de Erros

- 429 (Rate Limit): Mensagem amigável pedindo para aguardar
- 402 (Sem créditos): Orientar sobre adição de créditos
- Outros erros: Mensagem genérica com opção de retry

### Upload da Imagem Gerada

```typescript
// Converter base64 para File
const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, '');
const blob = await fetch(imageUrl).then(r => r.blob());
const file = new File([blob], `ai-${Date.now()}.png`, { type: 'image/png' });

// Upload para o bucket (reusa lógica existente)
await supabase.storage.from('post-images').upload(filePath, file);
```

---

## Arquivos a Serem Criados/Modificados

| Arquivo | Ação | Descrição |
|---------|------|-----------|
| `supabase/functions/generate-post-image/index.ts` | Criar | Edge Function para geração |
| `supabase/config.toml` | Modificar | Registrar nova função |
| `src/components/post/AIImageGenerator.tsx` | Criar | Componente de geração |
| `src/components/post/ImageUpload.tsx` | Modificar | Integrar geração com IA |

---

## Interface do Usuário

O componente `ImageUpload` terá três abas ou seções:

1. **Upload** - Arrastar ou selecionar arquivo
2. **URL** - Colar link de imagem externa
3. **Gerar com IA** - Descrever e gerar imagem

Na seção "Gerar com IA":
- Campo de texto para descrição
- Dropdown de estilo (opcional)
- Botão "Gerar Imagem" com loading state
- Preview da imagem gerada com botões "Usar" e "Gerar Outra"

---

## Considerações de Segurança

- A `LOVABLE_API_KEY` já está configurada automaticamente no backend
- Imagens são armazenadas no bucket com RLS por usuário
- Nenhuma chave exposta no frontend

