# PassQuest

## Visão geral

PassQuest é um jogo web de senha progressiva. A pessoa escolhe uma modalidade e deve criar uma senha que satisfaça todas as regras. A interface e os textos estão em português do Brasil.

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

## Fluxo da partida e pontuação

- O jogo inicia com um modal de boas-vindas e fundo desfocado, contendo as opções **Contagem regressiva** e **Tempo livre**.
- Em **Contagem regressiva**, a partida dura 90 segundos. Ao término, ela encerra mesmo sem vitória.
- Em **Tempo livre**, o cronômetro conta para cima e a partida só termina quando a senha estiver correta.
- A pontuação-base é 100 pontos por regra satisfeita no fim da partida.
- Em **Contagem regressiva**, uma vitória ganha 5 pontos por segundo restante. Exemplo: terminar com 5 segundos restantes adiciona 25 pontos.
- Em **Tempo livre**, uma vitória perde 1 ponto por segundo que ultrapassar 30 segundos. A pontuação de uma vitória nesta modalidade nunca pode ser menor que 100 pontos.
- A tela final deve mostrar tempo usado, regras satisfeitas e pontuação.
- O botão de reinício deve voltar ao modal de escolha de modalidade e restaurar os estados do jogo.
- O campo de senha não deve permitir ações de copiar ou colar, inclusive pelos atalhos de teclado.

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
- Nunca minifique arquivos editáveis do projeto, como componentes React, estilos, configurações e documentação. Preserve quebras de linha, indentação consistente e uma estrutura fácil de revisar.
