# Frutas Maromba · site

Catálogo mobile-first de frutas, grãos e suplementos. O cliente monta a sacola e o botão **Enviar pedido no WhatsApp** abre a conversa com o pedido escrito (itens, total, nome e endereço). Delivery em Alphaville e Osasco.

HTML, CSS e JavaScript puros, servidos com [Vite](https://vitejs.dev/).

## Rodar

```bash
npm install
npm run dev      # http://localhost:8080
npm run build    # gera dist/ para publicar
npm run deploy   # publica no GitHub Pages (branch gh-pages)
```

No ar: https://thsantosmercadolivre-lab.github.io/frutas-maromba-site/

## Onde mexer

| O quê | Onde |
|---|---|
| Número do WhatsApp, link do Grupo VIP, iFood, Instagram, valor da entrega grátis | `public/js/config.js` → `window.LOJA` |
| Produtos (nome, unidade, preço, preço antigo, selo, Top 5) | `public/js/config.js` → `window.PRODUTOS` |
| Prints de depoimentos | imagens em `public/img/depoimentos/` + lista `window.DEPOIMENTOS` em `public/js/config.js` |
| Textos e seções | `index.html` |
| Visual (cores, fontes, layout) | `public/css/style.css` |
| Carrinho, busca, pedido no WhatsApp | `public/js/app.js` |

> Número do WhatsApp, link do grupo e preços ainda são **provisórios**.

## Estrutura da página

Barra de entrega grátis · cabeçalho com busca e sacola · atalhos de categoria · hero · vantagens (WhatsApp, entrega no dia, Pix, iFood) · categorias (Frutas, Grãos, Suplementos) · mais pedidos · vitrine por categoria · Top 5 · depoimentos · como pedir em 3 passos · Grupo VIP · rodapé · barra fixa do pedido · sacola · busca.

## Visual

Fontes Unbounded, Manrope e JetBrains Mono (Google Fonts). Paleta: preto `#060706`, verde `#93B721` / `#C2EC3C`, amarelo `#FFD525`, laranja `#F64710`, vermelho `#E8352B`. Imagens do hero, do Grupo VIP e ícones dos passos geradas no Higgsfield; fotos de produto do Pexels (créditos em `public/img/creditos-fotos.txt`).
