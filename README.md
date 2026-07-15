# PassQuest 🔐

**PassQuest** é um jogo estilo *The Password Game*: o jogador precisa criar uma senha que satisfaça uma lista crescente de regras (cada vez mais estranhas e desafiadoras), tudo isso contra um cronômetro de 30 segundos.

## Como jogar

1. Clique em **Iniciar partida**.
2. Digite uma senha no campo de tentativa e envie.
3. A cada regra atendida, uma nova (e mais difícil) aparece.
4. Vença desbloqueando o "cofre" ao satisfazer todas as regras antes do tempo acabar — ou tente de novo se o tempo esgotar.

### Exemplos de regras

- Ter pelo menos 8 caracteres, letras e números.
- Conter a palavra "carro".
- Ter um número múltiplo de 7.
- Conter um emoji ao lado de um caractere especial.
- A soma dos números da senha deve ser igual a 23.

## Tecnologias

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [lucide-react](https://lucide.dev/) (ícones)

## Rodando localmente

```bash
# instalar dependências
npm install

# ambiente de desenvolvimento
npm run dev

# build de produção
npm run build

# preview do build de produção
npm run preview
```

## Estrutura do projeto

```
├── index.html        # ponto de entrada HTML
├── src/
│   ├── main.jsx       # lógica do jogo e componente principal
│   └── styles.css     # estilos globais (Tailwind)
├── vite.config.js     # configuração do Vite
└── package.json
```

## Licença

Este projeto é apenas para fins de estudo e diversão. Sem senhas reais são armazenadas ou processadas.
