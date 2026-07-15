# PassQuest

## Visão geral

PassQuest é um jogo web de senha progressiva. A pessoa joga contra um cronômetro de 60 segundos e deve criar uma senha que satisfaça todas as regras. A interface e os textos estão em português do Brasil.

## Stack e estrutura

- React com Vite.
- Tailwind CSS via plugin do Vite.
- Ícones do `lucide-react`.
- A lógica e a interface do jogo estão centralizadas em `src/main.jsx`.
- Os estilos globais e a importação do Tailwind estão em `src/styles.css`.

## Regras do jogo

- As regras ficam no array `rules` em `src/main.jsx`.
- Em cada envio, todas as regras devem ser avaliadas.
- Exiba somente a primeira regra não atendida; não apresente uma lista de erros ao jogador.
- Ao alterar ou adicionar regras, confirme que a senha-exemplo pretendida pelo produto continua possível e que as regras não entram em conflito.
- A regra de letras sequenciais significa uma sequência alfabética contínua, como `abcde`, e não somente letras agrupadas como `carro`.

## Fluxo da partida

- O jogo inicia com um modal de boas-vindas e fundo desfocado.
- O cronômetro de 60 segundos só começa depois do clique em **Iniciar partida**.
- Ao acabar o tempo, bloqueie a partida e ofereça reinício.
- O botão de reinício deve voltar ao modal inicial e restaurar o tempo para 60 segundos.

## Comandos

```bash
npm run dev
npm run build
npm run preview
```

Execute `npm run build` depois de mudanças para validar a aplicação.

## Publicação

- O deploy é feito no GitHub Pages pelo workflow `.github/workflows/deploy.yml`, a cada push na branch `main`.
- O workflow instala dependências com `npm ci`, gera o projeto com `npm run build` e publica a pasta `dist/` como artefato.
- `dist/` é saída gerada: deve permanecer no `.gitignore` e não deve ser versionada.

## Convenções

- Preserve a experiência visual escura com destaques em violeta.
- Prefira textos curtos, claros e acolhedores em português.
- Não trate a senha digitada como uma senha real nem a envie para serviços externos.
