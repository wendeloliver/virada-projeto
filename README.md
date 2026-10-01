# VIRADA

Viva um dia de trabalho simulado antes de mudar de carreira. A IA cria o dia, você decide, e o relatório mostra o que te energizou, o que te drenou e o que já serve da sua bagagem.

## Rodar no VS Code

1. Instale o Node.js 20.6 ou superior (nodejs.org).
2. Abra esta pasta no VS Code (Arquivo > Abrir Pasta).
3. Abra o terminal (Ctrl+`) e rode:
   ```
   npm install
   ```
4. Duplique `.env.example` com o nome `.env` e cole sua chave em `ANTHROPIC_API_KEY`
   (crie uma em console.anthropic.com > API Keys).
5. Inicie:
   ```
   npm start
   ```
6. Abra http://localhost:3000

## Estrutura

- `public/index.html`: todo o app (HTML, CSS e JavaScript).
- `server.js`: servidor que guarda a chave e chama a IA (`POST /api/ai`), com limite de usos por hora.
- `.env`: sua chave. Nunca envie este arquivo para o GitHub (já está no `.gitignore`).

## Antes de publicar para o público

- Coloque uma política de privacidade (as pessoas contam sobre suas carreiras).
- O limite por IP é simples e fica em memória; para produção, use algo persistente.
- Hospedagem sugerida: Render, Railway ou Fly.io (defina `ANTHROPIC_API_KEY` nas variáveis de ambiente).
