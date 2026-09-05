# Studio FB — Gestão

Estrutura estática do sistema Studio FB.

## Arquivos

- `index.html` — estrutura da interface
- `assets/css/styles.css` — estilos visuais
- `assets/js/app.js` — lógica da aplicação, Firebase Authentication e Firestore

## Deploy no Netlify

Este projeto não precisa de build.

Configuração recomendada:

- Branch: `main`
- Base directory: vazio
- Build command: vazio
- Publish directory: `.`

O deploy é disparado automaticamente pelos pushes no GitHub.

## Segurança

O login utiliza Firebase Authentication (e-mail e senha).

A proteção dos dados do Firestore deve ser mantida nas Firestore Security Rules,
permitindo acesso apenas aos UIDs autorizados.
