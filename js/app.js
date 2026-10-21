(() => {
  const L = window.LOJA, CATS = window.CATEGORIAS, PRODS = window.PRODUTOS;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const real = v => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const porId = Object.fromEntries(PRODS.map(p => [p.id, p]));
  const img = p => `img/produtos/${p.img}.webp`;
  const zapUrl = txt => `https://wa.me/${L.whatsapp}?text=${encodeURIComponent(txt)}`;

  /* ---------- sacola (salva no navegador) ---------- */
  const CHAVE = "fm-sacola";
  let sacola = {};
  try { sacola = JSON.parse(localStorage.getItem(CHAVE)) || {}; } catch (e) { sacola = {}; }
  for (const id in sacola) if (!porId[id]) delete sacola[id];
  const salvar = () => { try { localStorage.setItem(CHAVE, JSON.stringify(sacola)); } catch (e) {} };
  const qtdTotal = () => Object.values(sacola).reduce((a, b) => a + b, 0);
  const valorTotal = () => Object.entries(sacola).reduce((a, [id, q]) => a + porId[id].preco * q, 0);

  function mudar(id, delta) {
    const antes = sacola[id] || 0;
    const q = Math.max(0, antes + delta);
    if (q) sacola[id] = q; else delete sacola[id];
    salvar();
    atualizar();
    if (delta > 0 && antes === 0) toast(`${porId[id].nome} na sacola`);
  }

  /* ---------- componentes ---------- */
  const seloHtml = p => {
    if (!p.selo) return "";
    const c = p.selo === "Atleta indica" ? "atleta" : p.selo === "Novo" ? "novo" : "";
    return `<span class="selo ${c}">${p.selo}</span>`;
  };
  const controle = (p, curto) => {
    const q = sacola[p.id] || 0;
    if (!q) return `<button class="add" data-add="${p.id}" aria-label="Adicionar ${p.nome}">+ <span>Adicionar</span></button>`;
    return `<div class="passo"><button data-sub="${p.id}" aria-label="Tirar um ${p.nome}">−</button><span>${q}</span><button data-add="${p.id}" aria-label="Mais um ${p.nome}">+</button></div>`;
  };
  const card = p => `
    <article class="prod" data-prod="${p.id}">
      <div class="prod-img"><img src="${img(p)}" alt="${p.nome}" loading="lazy" width="640" height="640"></div>
      ${seloHtml(p)}
      <div class="prod-info">
        <h3>${p.nome}</h3><span class="un">${p.un}</span>
        <div class="preco">${p.de ? `<s>${real(p.de)}</s>` : ""}${real(p.preco)}${p.de ? `<span class="desc">-${Math.round((1 - p.preco / p.de) * 100)}%</span>` : ""}</div>
        <div class="controle">${controle(p)}</div>
      </div>
    </article>`;
  const linha = (p, n) => `
    <li class="tp" data-prod="${p.id}">
      ${n ? `<span class="n">${n}</span>` : ""}
      <img src="${img(p)}" alt="${p.nome}" loading="lazy">
      <div><b>${p.nome}</b><small>${p.un} · ${real(p.preco)}</small></div>
      <div class="controle">${controle(p)}</div>
    </li>`;

  /* ---------- render ---------- */
  $("#cats-nav").innerHTML =
    `<a class="cn todos ativo" href="#inicio" data-alvo="inicio">Tudo</a>` +
    CATS.map(c => `<a class="cn" href="#${c.id}" data-alvo="${c.id}"><img src="${c.img}" alt="">${c.nome}</a>`).join("") +
    `<a class="cn" href="#mais-pedidos" data-alvo="mais-pedidos"><span class="cn-ico"><svg><use href="#i-flame"/></svg></span>Ofertas</a>`;

  $("#cats").innerHTML = CATS.map(c => `
    <a class="cat ${c.cor} reveal" href="#${c.id}">
      <img src="${c.img}" alt="" loading="lazy">
      <span class="qt">${PRODS.filter(p => p.cat === c.id).length} itens <svg><use href="#i-seta"/></svg></span>
      <h3 class="disp">${c.nome}</h3><p>${c.desc}</p>
    </a>`).join("");

  $("#trilho-destaque").innerHTML = PRODS.filter(p => p.selo || p.de).map(card).join("");

  $("#vitrines").innerHTML = CATS.map(c => `
    <section class="bloco vitrine" id="${c.id}">
      <div class="tit tit-linha reveal"><h2 class="disp">${c.nome}</h2><button class="ver" data-ver="${c.id}">Ver todos <svg><use href="#i-seta"/></svg></button></div>
      <div class="trilho" id="trilho-${c.id}">${PRODS.filter(p => p.cat === c.id).map(card).join("")}</div>
    </section>`).join("");

  $("#top5").innerHTML = PRODS.filter(p => p.top).sort((a, b) => a.top - b.top).map(p => linha(p, p.top)).join("");

  // links
  $("#link-grupo").href = L.grupoWhatsapp;
  $("#link-insta").href = L.instagram;
  $("#link-ifood").href = L.ifood;
  $("#ano").textContent = new Date().getFullYear();
  $$("[data-zap]").forEach(a => { a.href = zapUrl(a.dataset.zap); a.target = "_blank"; a.rel = "noopener"; });

  /* ---------- atualizar tudo que depende da sacola ---------- */
  function atualizar() {
    $$("[data-prod]").forEach(el => {
      const ctl = $(".controle", el);
      if (ctl) ctl.innerHTML = controle(porId[el.dataset.prod]);
    });
    const q = qtdTotal(), v = valorTotal();
    const badge = $("#qtd-topo");
    if (badge.textContent !== String(q)) { badge.classList.remove("pulo"); void badge.offsetWidth; badge.classList.add("pulo"); }
    badge.textContent = q; badge.hidden = !q;
    $("#barra-pedido").hidden = !q || $("#sacola").classList.contains("aberta");
    $("#qtd-barra").textContent = q;
    $("#total-barra").textContent = real(v);

    // barra de frete
    const meta = L.entregaGratisAcima, falta = meta - v;
    $("#frete-progresso").style.width = `${Math.min(100, (v / meta) * 100)}%`;
    $("#frete").classList.toggle("ok", falta <= 0);
    $("#frete-txt").textContent = !q ? `Entrega grátis em pedidos acima de ${real(meta)}`
      : falta > 0 ? `Faltam ${real(falta)} pra entrega grátis` : "Entrega grátis liberada no seu pedido";

    // painel
    $("#sp-itens").innerHTML = Object.keys(sacola).map(id => {
      const p = porId[id];
      return `<li class="sp-item" data-prod="${id}"><img src="${img(p)}" alt=""><div><b>${p.nome}</b><small>${p.un}</small><span class="v">${real(p.preco * sacola[id])}</span></div><div class="controle">${controle(p)}</div></li>`;
    }).join("");
    $("#sp-vazio").hidden = !!q;
    $("#sp-form").hidden = !q;
    $("#sp-total").textContent = real(v);
    $("#sp-nota").textContent = !q ? "" : falta > 0 ? "A taxa de entrega é confirmada no WhatsApp." : "Entrega grátis neste pedido.";
    $("#enviar").disabled = !q;
  }

  /* ---------- cliques de + / − ---------- */
  document.addEventListener("click", e => {
    const add = e.target.closest("[data-add]"), sub = e.target.closest("[data-sub]");
    if (add) { e.preventDefault(); mudar(add.dataset.add, 1); }
    if (sub) { e.preventDefault(); mudar(sub.dataset.sub, -1); }
    const ver = e.target.closest("[data-ver]");
    if (ver) {
      const t = $("#trilho-" + ver.dataset.ver);
      const aberto = t.classList.toggle("grade");
      ver.innerHTML = aberto ? "Mostrar menos" : `Ver todos <svg><use href="#i-seta"/></svg>`;
      if (!aberto) t.closest("section").scrollIntoView({ block: "start" });
    }
  });

  /* ---------- painel da sacola ---------- */
  const painel = $("#sacola"), veu = $("#veu");
  let ultimoFoco = null;
  function abrirSacola() {
    ultimoFoco = document.activeElement;
    painel.classList.add("aberta"); painel.setAttribute("aria-hidden", "false");
    veu.hidden = false; document.body.style.overflow = "hidden";
    atualizar(); setTimeout(() => $("#fechar-sacola").focus(), 50);
  }
  function fecharSacola() {
    painel.classList.remove("aberta"); painel.setAttribute("aria-hidden", "true");
    veu.hidden = true; document.body.style.overflow = "";
    atualizar(); ultimoFoco && ultimoFoco.focus && ultimoFoco.focus();
  }
  $("#abrir-sacola").onclick = abrirSacola;
  $("#barra-pedido").onclick = abrirSacola;
  $("#fechar-sacola").onclick = fecharSacola;
  veu.onclick = fecharSacola;

  const form = $("#sp-form");

  // dados do cliente lembrados neste navegador
  try {
    const d = JSON.parse(localStorage.getItem("fm-cliente")) || {};
    ["nome", "endereco"].forEach(k => { if (d[k]) form[k].value = d[k]; });
  } catch (e) {}

  form.addEventListener("submit", e => {
    e.preventDefault();
    if (!qtdTotal()) return;
    const nome = form.nome.value.trim(), end = form.endereco.value.trim(), obs = form.obs.value.trim();
    if (!nome) { form.nome.focus(); toast("Coloca seu nome pra gente"); return; }
    if (!end) { form.endereco.focus(); toast("Falta o endereço de entrega"); return; }
    try { localStorage.setItem("fm-cliente", JSON.stringify({ nome, endereco: end })); } catch (e) {}

    const linhas = Object.entries(sacola).map(([id, q]) => {
      const p = porId[id];
      return `• ${q}x ${p.nome} (${p.un}) — ${real(p.preco * q)}`;
    });
    const msg = [
      "Olá, Frutas Maromba! Quero fazer um pedido pelo site:",
      "",
      ...linhas,
      "",
      `*Total estimado: ${real(valorTotal())}*`,
      "",
      `Nome: ${nome}`,
      `Entrega em: ${end}`,
      obs ? `Obs.: ${obs}` : "",
    ].filter((l, i, a) => !(l === "" && a[i - 1] === "")).join("\n").trim();
    window.open(zapUrl(msg), "_blank", "noopener");
  });

  /* ---------- busca ---------- */
  const busca = $("#busca"), bInput = $("#busca-input"), bRes = $("#busca-res");
  const norm = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  function buscar() {
    const t = norm(bInput.value.trim());
    const lista = t ? PRODS.filter(p => norm(`${p.nome} ${p.cat} ${p.un}`).includes(t)) : PRODS;
    bRes.innerHTML = lista.length ? `<ul style="list-style:none;display:grid;gap:10px">${lista.map(p => linha(p)).join("")}</ul>`
      : `<p class="busca-vazio">Não achamos "${bInput.value}". Chama no WhatsApp que a gente vê pra você.</p>`;
  }
  $("#abrir-busca").onclick = () => { busca.hidden = false; document.body.style.overflow = "hidden"; buscar(); bInput.focus(); };
  const fecharBusca = () => { busca.hidden = true; document.body.style.overflow = ""; };
  $("#fechar-busca").onclick = fecharBusca;
  bInput.addEventListener("input", buscar);
  document.addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    if (!busca.hidden) fecharBusca(); else if (painel.classList.contains("aberta")) fecharSacola();
  });

  /* ---------- toast ---------- */
  let tt;
  function toast(t) {
    const el = $("#toast"); el.textContent = t; el.classList.add("on");
    clearTimeout(tt); tt = setTimeout(() => el.classList.remove("on"), 1800);
  }

  /* ---------- depoimentos (prints de clientes) ---------- */
  const DEPOS = window.DEPOIMENTOS || [];
  const imgDepo = d => (window.__IMG && window.__IMG[d.img]) || d.img;
  if (DEPOS.length) {
    $("#prints").innerHTML = DEPOS.map((d, i) => `
      <button class="print reveal" data-print="${i}" aria-label="Ver depoimento ${i + 1}">
        <img src="${imgDepo(d)}" alt="Print de depoimento de cliente${d.legenda ? ": " + d.legenda : ""}" loading="lazy">
        ${d.legenda ? `<span>${d.legenda}</span>` : ""}
      </button>`).join("");
  } else {
    const bolhas = ["e l", "d c", "e m", "d l", "e c"].map(b => `<i class="${b}"></i>`).join("");
    $("#prints").innerHTML = [1, 2, 3, 4].map(() => `
      <div class="print vazio reveal" aria-hidden="true"><div class="bolhas">${bolhas}</div><span>Print do cliente</span></div>`).join("");
  }
  const lb = $("#lb"), lbImg = $("#lb-img");
  let atual = 0;
  const mostrar = i => {
    atual = (i + DEPOS.length) % DEPOS.length;
    lbImg.src = imgDepo(DEPOS[atual]);
    $("#lb-cont").textContent = `${atual + 1} de ${DEPOS.length}`;
  };
  const fecharLb = () => { lb.hidden = true; document.body.style.overflow = ""; };
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-print]");
    if (!b) return;
    mostrar(+b.dataset.print); lb.hidden = false; document.body.style.overflow = "hidden";
  });
  $("#lb-x").onclick = fecharLb;
  $("#lb-ant").onclick = () => mostrar(atual - 1);
  $("#lb-prox").onclick = () => mostrar(atual + 1);
  lb.addEventListener("click", e => { if (e.target === lb) fecharLb(); });
  let x0 = null;
  lb.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 50) mostrar(atual + (dx < 0 ? 1 : -1));
  });
  document.addEventListener("keydown", e => {
    if (lb.hidden) return;
    if (e.key === "Escape") fecharLb();
    if (e.key === "ArrowRight") mostrar(atual + 1);
    if (e.key === "ArrowLeft") mostrar(atual - 1);
  });

  /* ---------- animação ao rolar ---------- */
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add("visto"); io.unobserve(en.target); }
  }), { rootMargin: "0px 0px -8% 0px" });
  $$(".reveal").forEach((el, i) => { el.style.transitionDelay = `${(i % 4) * 70}ms`; io.observe(el); });
  // garantia: nada fica invisível se a rolagem for rápida demais
  const revelarPassados = () => $$(".reveal:not(.visto)").forEach(el => { if (el.getBoundingClientRect().top < innerHeight) el.classList.add("visto"); });
  addEventListener("scroll", () => requestAnimationFrame(revelarPassados), { passive: true });

  /* ---------- categoria ativa no menu ---------- */
  const navLinks = $$(".cn");
  const secoes = ["mais-pedidos", ...CATS.map(c => c.id)].map(id => document.getElementById(id));
  function marcarAtivo() {
    const y = $("#topo").getBoundingClientRect().bottom + 40;
    let atual = "inicio";
    secoes.forEach(s => { if (s.getBoundingClientRect().top <= y) atual = s.id; });
    if (atual === "mais-pedidos" && secoes[1].getBoundingClientRect().top > y && window.scrollY < 200) atual = "inicio";
    navLinks.forEach(a => {
      const on = a.dataset.alvo === atual;
      if (on && !a.classList.contains("ativo")) {
        const c = a.parentElement;
        c.scrollTo({ left: a.offsetLeft - c.clientWidth / 2 + a.offsetWidth / 2, behavior: "smooth" });
      }
      a.classList.toggle("ativo", on);
    });
  }
  let raf;
  addEventListener("scroll", () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(marcarAtivo); }, { passive: true });

  atualizar();
})();
