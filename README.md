# Loja de Filmes

Loja virtual de filmes feita em **Vue 3**, com catálogo em tempo real da API do [TMDB](https://www.themoviedb.org/), favoritos, carrinho e checkout.

Projeto criado originalmente em 2022 para um processo seletivo e reescrito do zero na versão 2.0, com arquitetura, tipagem e design atualizados.

## Funcionalidades

- **Catálogo** com os filmes populares, filtro por gênero e rolagem infinita
- **Busca** que responde enquanto você digita (com debounce)
- **Página do filme** com sinopse, duração, gêneros, elenco e link do trailer
- **Favoritos e carrinho** em painel lateral, salvos no navegador
- **Checkout** com validação, máscaras de CPF, celular e CEP e endereço preenchido automaticamente pelo [ViaCEP](https://viacep.com.br/)
- Layout **mobile-first**, tema escuro e estados de carregamento, erro e lista vazia

## Stack

| Parte | Tecnologia |
| --- | --- |
| Base | Vue 3.5 (`<script setup>`), TypeScript, Vite 6 |
| Estado | Pinia + `useLocalStorage` (VueUse) |
| Rotas | Vue Router 4 com carregamento sob demanda |
| Estilo | Tailwind CSS 4 |
| Formulário | Zod (validação) e Maska (máscaras) |

## Estrutura

```
src/
├── components/   # cart, layout, movies e ui (componentes reutilizáveis)
├── composables/  # useMovieFeed (paginação/rolagem) e useMovieActions
├── services/     # cliente da API do TMDB
├── stores/       # cart, favorites e ui (Pinia)
├── types/        # tipos dos dados do TMDB
├── utils/        # formatação e regras do checkout
└── views/        # Home, Filme e Checkout
```

## Rodando localmente

1. Crie uma chave gratuita em [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api).
2. Copie `.env.example` para `.env.local` e cole a chave em `VITE_TMDB_API_KEY`.
3. Instale e rode:

```bash
npm install
npm run dev
```

Abra [http://localhost:5173](http://localhost:5173).

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Checagem de tipos + build de produção em `dist/` |
| `npm run preview` | Serve a build localmente |

---

Projeto de estudo: nenhuma compra é processada. Dados e imagens fornecidos pelo TMDB.
