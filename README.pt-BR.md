# ⚖️ The Tiebreaker — App para Tomada de Decisões

🌐 [English](README.md) | **Português (Brasil)**

Aplicação web que ajuda a definir os **prós e contras** de cada decisão importante. Descreva seu dilema, informe as opções que está considerando e o app — com o apoio da API do **Google Gemini** — gera uma análise estruturada e um veredito claro para ajudar você a desempatar.

> ⚠️ **Status do projeto:** protótipo / prova de conceito. Os testes continuam e podem ocorrer mudanças.

---

## ✨ Funcionalidades

Para cada decisão, o app gera:

1. **Resumo executivo** do dilema em 2 a 3 frases.
2. **Prós e contras ponderados** por opção, com peso de impacto (1 a 5), categoria temática, explicação e sugestão de mitigação para os contras.
3. **Tabela comparativa multicritério** com notas de 1 a 10 e uma justificativa breve por critério (por exemplo: retorno a longo prazo, estresse/bem-estar, reversibilidade, alinhamento com valores pessoais, velocidade de execução).
4. **Análise SWOT (FOFA)** — forças, fraquezas, oportunidades e ameaças — para cada opção.
5. **Veredito do Tiebreaker**:
   - Opção recomendada e nível de confiança.
   - O critério decisivo de desempate ("The Clincher").
   - Pergunta de intuição (*gut check*).
   - Armadilhas cognitivas e pontos cegos.
   - Plano de ação imediato em 3 passos, com prazos.

Além disso:

- **Sugestão de opções:** se você não sabe quais alternativas considerar, o app propõe de 2 a 3 caminhos concretos a partir do título do seu dilema.
- **Perguntas de acompanhamento:** depois do veredito, você pode fazer novas perguntas ao Tiebreaker.
- **Opções vagas:** se uma opção expressa dúvida ou inércia (ex.: "não sei", "deixar rolar"), a IA é instruída a desafiá-la e mostrar o custo invisível de não decidir.
- **Bilíngue:** análise em português (`pt`, padrão) e inglês (`en`).
- **Modo de contingência (fallback):** se o serviço de IA estiver ocupado, limitado ou falhar, o servidor devolve uma análise estratégica genérica gerada localmente (marcada com `isFallback: true`), para que o app continue funcionando.

---

## 🧰 Tecnologias

| Área | Ferramentas |
| --- | --- |
| Frontend | React 19, Vite, Tailwind CSS 4, Motion (animações), Lucide React (ícones), canvas-confetti |
| Backend | Node.js + Express, executado com `tsx` |
| IA | Google Gemini via SDK `@google/genai` |
| Linguagem | TypeScript |
| Gerenciador de pacotes | Bun (`bun.lock`); npm também funciona |

---

## 📁 Estrutura do repositório

```
.
├── src/             # Código do frontend (React)
├── server.ts        # Servidor Express: API + integração com Gemini + Vite
├── index.html       # Ponto de entrada HTML do app
├── vite.config.ts   # Configuração do Vite
├── tsconfig.json    # Configuração do TypeScript
├── package.json     # Dependências e scripts
├── bun.lock         # Lockfile do Bun
├── metadata.json    # Metadados da aplicação
├── .env.example     # Modelo de variáveis de ambiente
└── .gitignore
```

---

## 🚀 Instalação e uso local

### Requisitos

- [Bun](https://bun.sh) ou [Node.js](https://nodejs.org) (recomendado v18 ou superior)
- Uma chave de API do Gemini ([Google AI Studio](https://aistudio.google.com/apikey))

### Passos

1. **Clone o repositório**

   ```bash
   git clone https://github.com/MachineBrAr/App-para-toma-de-decis-o.git
   cd App-para-toma-de-decis-o
   ```

2. **Instale as dependências**

   ```bash
   bun install
   # ou
   npm install
   ```

3. **Configure as variáveis de ambiente**

   ```bash
   cp .env.example .env
   ```

   Edite o `.env` e preencha seus valores:

   ```env
   GEMINI_API_KEY="sua_chave_da_api_gemini"
   APP_URL="http://localhost:3000"
   ```

4. **Inicie o servidor de desenvolvimento**

   ```bash
   bun run dev
   # ou
   npm run dev
   ```

   O app ficará disponível em **http://localhost:3000** (a porta pode ser alterada com a variável `PORT`).

> Sem a `GEMINI_API_KEY` o servidor inicia normalmente, mas os endpoints de análise retornarão erro ou conteúdo de contingência.

---

## 🔐 Variáveis de ambiente

| Variável | Descrição | Obrigatória |
| --- | --- | --- |
| `GEMINI_API_KEY` | Chave da API do Gemini para a análise com IA | Sim |
| `APP_URL` | URL onde o app está hospedado (links próprios, callbacks) | Não (local) |
| `PORT` | Porta do servidor (padrão `3000`) | Não |
| `DISABLE_HMR` | Se `true`, desativa o hot reload do Vite em desenvolvimento | Não |

⚠️ **Nunca envie seu arquivo `.env` para o repositório.** A chave é usada apenas no servidor e não é exposta ao navegador.

---

## 📜 Scripts disponíveis

| Comando | Descrição |
| --- | --- |
| `dev` | Inicia o servidor com Vite em modo de desenvolvimento |
| `build` | Gera o build de produção em `dist/` |
| `start` | Inicia o servidor em modo de produção (serve `dist/`) |
| `preview` | Pré-visualiza o build com Vite |
| `lint` | Verifica os tipos com TypeScript (`tsc --noEmit`) |
| `clean` | Remove `dist` e `server.js` |

Para produção:

```bash
bun run build
bun run start
```

---

## 🔌 API

Todos os endpoints são requisições `POST` com corpo JSON, exceto o health check.

### `GET /api/health`
Verifica se o servidor está ativo e se há chave de API configurada.

```json
{ "status": "ok", "hasApiKey": true }
```

### `POST /api/analyze-decision`
Gera a análise completa de uma decisão.

```json
{
  "title": "Devo trocar de emprego ou continuar onde estou?",
  "context": "Contexto adicional (opcional)",
  "options": ["Trocar de emprego", "Continuar"],
  "priorities": ["Estabilidade", "Crescimento"],
  "language": "pt"
}
```

- `title` é obrigatório.
- Se forem enviadas menos de 2 opções válidas, são usadas duas opções padrão ("seguir em frente" / "manter o status quo").
- Resposta: `summary`, `optionsAnalysis`, `comparisonMatrix` e `verdict`.

### `POST /api/suggest-options`
Sugere de 2 a 3 opções concretas a partir do título do dilema.

```json
{ "title": "Devo me mudar de cidade?", "context": "", "language": "pt" }
```

Resposta: `{ "options": ["...", "..."] }`

### `POST /api/ask-tiebreaker`
Responde a uma pergunta de acompanhamento sobre a decisão e seu veredito.

```json
{
  "decisionTitle": "...",
  "currentVerdict": "...",
  "question": "E se o salário cair 10%?",
  "language": "pt"
}
```

Resposta: `{ "answer": "..." }`

---

## ⚠️ Aviso

As recomendações geradas por IA são um **apoio à reflexão**, não substituem o seu próprio julgamento nem aconselhamento profissional (financeiro, jurídico, médico etc.). A decisão final é sempre sua.

---

## 📄 Licença

Este projeto é de **domínio público**. Qualquer pessoa pode copiá-lo, modificá-lo, distribuí-lo e usá-lo, para fins pessoais ou comerciais, sem pedir permissão nem dar atribuição.

É fornecido "como está", sem garantia de qualquer tipo.

## 👤 Autor

Desenvolvido por [MachineBrAr](https://github.com/MachineBrAr).
