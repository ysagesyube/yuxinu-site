# Yuxinu — site institucional

Reconstrução do site institucional publicado em [yuxinu.org](https://yuxinu.org) (hospedado no Netlify, projeto `zingy-sawine-271e49`), com foco em performance, SEO, acessibilidade e segurança.

> Este repositório é o site estático institucional. A plataforma de voluntariado (Next.js) vive em um repositório separado.

## Stack

Site estático (HTML5 + CSS + JS vanilla, sem build step), com sistema de tradução (PT/EN/ES) via `data-i18n`.

## Estrutura

```
index.html          página principal
404.html             página de erro customizada
css/
  fonts.css          @font-face (Manrope)
  main.css           estilos do site
js/
  i18n.js            dicionário e troca de idioma (PT/EN/ES)
  interactions.js     reveals on-scroll, parallax, contadores, menu, formulário
assets/              imagens, ícones, favicons e fontes
netlify.toml         headers de segurança/cache e configuração de build
robots.txt / sitemap.xml
site.webmanifest
```

## Rodar localmente

```bash
npx serve .
```

## Deploy

Publicado no Netlify (projeto `zingy-sawine-271e49`, domínio `yuxinu.org`).
