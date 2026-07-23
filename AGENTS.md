# SC_FEEDBACK

Formulário de feedback (single-page HTML estático "GovSC EducaIA") que envia respostas a uma planilha Google via um proxy serverless na Vercel.

## Stack
- **Frontend:** HTML/CSS/JS puro em um único `index.html` (sem framework, sem build). Fontes/ícones via CDN (Google Fonts, Font Awesome).
- **Backend:** 1 função serverless Vercel — `api/submit.js` (Node handler, ES module) que repassa o payload para um Google Apps Script.
- **Deploy:** Vercel (auto-deploy da `main`).
- **Package manager:** nenhum — não há `package.json` nem dependências.

## Comandos
- Não há build/test/lint. Para desenvolver localmente com a função serverless: `vercel dev` (Vercel CLI). Sem isso, o `index.html` abre direto no navegador, mas `/api/submit` só funciona no ambiente Vercel.

## Estrutura
- `index.html` — a página inteira (markup, estilos inline, e o JS que faz `fetch` para `/api/submit`, com fallback direto ao Google Apps Script).
- `api/submit.js` — proxy POST: trata CORS/OPTIONS, serializa o body e faz POST url-encoded para o Google Apps Script.
- `vercel.json` — configura `maxDuration: 30` para `api/submit.js`.

## Convenções de código
- JavaScript vanilla, sem transpilação. Mantenha o handler como ES module (`export default`).
- CORS liberado (`Access-Control-Allow-Origin: *`) por ser formulário público.

## Variáveis de ambiente
- Nenhuma env configurada. A URL do Google Apps Script está hardcoded em `api/submit.js` (`GOOGLE_SCRIPT_URL`). **Recomendação:** mover essa URL para uma env (ex.: `GOOGLE_SCRIPT_URL`) nas Environment Variables da Vercel em vez de deixá-la no código.

## CI/CD & Deploy
- Deploy automático pela Vercel na `main`. **Não há CI.** Para um projeto tão enxuto, CI é opcional; no máximo um lint de HTML/JS em PR.

## Boas práticas de PR
- Branches `feat/…`, `fix/…`, `chore/…`; Conventional Commits; PRs pequenos; ao menos 1 review; squash merge; `main` sempre publicável.
- Checklist: página abre sem erro no console, `/api/submit` responde 200, sem segredos novos hardcoded, screenshots de mudanças visuais.

## Testes
- Sem testes. Valide manualmente: submeter o formulário e confirmar que a linha chega na planilha Google.

## Segurança & dados
- O formulário coleta feedback que pode conter dados pessoais — atenção à LGPD no armazenamento (planilha Google) e retenção.
- O handler retorna `success: true` mesmo em erro (para não travar o usuário mobile); logs ficam no painel de Functions da Vercel. Ao depurar, confie nos logs, não na resposta.
- Evite adicionar chaves/tokens ao `index.html` (é público) ou ao repositório.

## Gotchas
- A URL do Apps Script está fixa no código; trocar de planilha exige editar `api/submit.js` (idealmente virar env).
- O `fetch` do front tem fallback que chama o Apps Script diretamente — mudanças de CORS/endpoint precisam ser refletidas nos dois lugares (`index.html` e `api/submit.js`).
- `maxDuration: 30` está definido no `vercel.json`; não renomeie `api/submit.js` sem atualizar essa config.
