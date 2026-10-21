/*
  CONFIGURAÇÃO DA LOJA
  Tudo que muda no dia a dia fica aqui: número do WhatsApp, link do grupo,
  valor da entrega grátis e a lista de produtos com preço.
  ATENÇÃO: número e preços abaixo são PROVISÓRIOS (demonstração).
*/
window.LOJA = {
  whatsapp: "5511900000000",            // só números, com 55 + DDD
  grupoWhatsapp: "#",                   // link de convite do grupo de clientes
  instagram: "https://www.instagram.com/frutasmaromba/",
  ifood: "#",
  entregaGratisAcima: 80,               // em reais
};

window.CATEGORIAS = [
  { id: "frutas", nome: "Frutas", desc: "Escolhidas a dedo, do jeito que o atleta pede", img: "img/cat-frutas.webp", cor: "vermelho" },
  { id: "graos", nome: "Grãos", desc: "Castanhas, aveia, tâmara e pasta de amendoim", img: "img/cat-graos.webp", cor: "amarelo" },
  { id: "suplementos", nome: "Suplementos", desc: "Whey, creatina e barra de proteína", img: "img/cat-suplementos.webp", cor: "verde" },
];

// selo: "Mais vendido" | "Atleta indica" | "Novo" | "" ; top: posição no Top 5 (ou 0)
window.PRODUTOS = [
  { id: "morango", cat: "frutas", nome: "Morango", un: "bandeja 250 g", preco: 12.9, selo: "Mais vendido", top: 1, img: "morango" },
  { id: "banana", cat: "frutas", nome: "Banana prata", un: "dúzia", preco: 9.9, top: 2, img: "banana" },
  { id: "abacate", cat: "frutas", nome: "Abacate", un: "kg", preco: 11.9, de: 14.9, selo: "Atleta indica", top: 4, img: "abacate" },
  { id: "mamao", cat: "frutas", nome: "Mamão papaya", un: "unidade", preco: 7.9, img: "mamao" },
  { id: "pitaya", cat: "frutas", nome: "Pitaya", un: "unidade", preco: 14.9, selo: "Novo", img: "pitaya" },
  { id: "maca", cat: "frutas", nome: "Maçã gala", un: "kg", preco: 12.9, img: "maca" },
  { id: "mirtilo", cat: "frutas", nome: "Mirtilo", un: "125 g", preco: 13.9, img: "mirtilo" },
  { id: "manga", cat: "frutas", nome: "Manga palmer", un: "unidade", preco: 6.9, img: "manga" },

  { id: "pasta-amendoim", cat: "graos", nome: "Pasta de amendoim", un: "500 g", preco: 24.9, selo: "Mais vendido", top: 3, img: "pasta-amendoim" },
  { id: "castanhas", cat: "graos", nome: "Mix de castanhas", un: "250 g", preco: 29.9, selo: "Novo", img: "castanhas" },
  { id: "aveia", cat: "graos", nome: "Aveia em flocos", un: "1 kg", preco: 15.9, img: "aveia" },
  { id: "tamara", cat: "graos", nome: "Tâmara", un: "250 g", preco: 19.9, img: "tamara" },
  { id: "granola", cat: "graos", nome: "Granola sem açúcar", un: "500 g", preco: 22.9, img: "granola" },

  { id: "whey", cat: "suplementos", nome: "Whey concentrado", un: "900 g", preco: 129.9, de: 149.9, selo: "Mais vendido", top: 5, img: "whey" },
  { id: "creatina", cat: "suplementos", nome: "Creatina monohidratada", un: "300 g", preco: 89.9, img: "creatina" },
  { id: "barra", cat: "suplementos", nome: "Barra de proteína", un: "caixa com 12", preco: 99.9, selo: "Atleta indica", img: "barra" },
];

/*
  DEPOIMENTOS: prints de conversas/feedbacks de clientes.
  Salve as imagens em img/depoimentos/ (vertical, de preferência 1080 de largura)
  e liste aqui. Com a lista vazia, o site mostra espaços reservados.
  Ex.: { img: "img/depoimentos/01.jpg", legenda: "Cliente de Alphaville" },
*/
window.DEPOIMENTOS = [
];
