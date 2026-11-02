/* =========================================================
   Academia Sô Fit — comportamento do site
   ========================================================= */
(function () {
  'use strict';

  const C = window.SOFIT;
  const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  const DIAS_CURTOS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  /* ---------- utilidades ---------- */
  function linkWhatsApp(msg) {
    return 'https://wa.me/' + C.whatsapp + '?text=' + encodeURIComponent(msg || C.mensagemPadrao);
  }

  function formatarHora(h) {
    const hh = Math.floor(h);
    const mm = Math.round((h - hh) * 60);
    return String(hh).padStart(2, '0') + ':' + String(mm).padStart(2, '0');
  }

  // Cria um elemento com texto. Usar textContent (e não innerHTML)
  // garante que nada escrito na planilha vire código na página.
  function el(tag, classe, texto) {
    const e = document.createElement(tag);
    if (classe) e.className = classe;
    if (texto) e.textContent = texto;
    return e;
  }

  /* ---------- links do WhatsApp ---------- */
  document.querySelectorAll('[data-wa]').forEach(function (a) {
    a.href = linkWhatsApp(a.dataset.wa);
    a.target = '_blank';
    a.rel = 'noopener';
  });

  /* ---------- aberto / fechado agora ---------- */
  function atualizarStatus() {
    const agora = new Date();
    const hoje = agora.getDay();
    const h = agora.getHours() + agora.getMinutes() / 60;
    const turno = C.funcionamento[hoje];
    const aberto = !!turno && h >= turno[0] && h < turno[1];
    let texto = '';

    if (aberto) {
      texto = 'Aberto agora · fecha às ' + formatarHora(turno[1]);
    } else {
      for (let i = 0; i < 8; i++) {
        const dia = (hoje + i) % 7;
        const t = C.funcionamento[dia];
        if (!t) continue;
        if (i === 0 && h >= t[0]) continue;
        const quando = i === 0 ? 'hoje' : i === 1 ? 'amanhã' : DIAS[dia];
        texto = 'Fechado agora · abre ' + quando + ' às ' + formatarHora(t[0]);
        break;
      }
    }
    document.getElementById('status-texto').textContent = texto;
    document.getElementById('status-ponto').classList.toggle('aberto', aberto);
  }
  atualizarStatus();
  setInterval(atualizarStatus, 60 * 1000);

  /* ---------- texto de funcionamento no contato ---------- */
  (function () {
    const f = C.funcionamento;
    const linhas = [];
    const semana = [1, 2, 3, 4, 5].map(function (d) { return String(f[d]); });
    if (semana.every(function (s) { return s === semana[0]; }) && f[1]) {
      linhas.push('Seg a sex · ' + formatarHora(f[1][0]) + '–' + formatarHora(f[1][1]));
    } else {
      [1, 2, 3, 4, 5].forEach(function (d) {
        linhas.push(DIAS_CURTOS[d] + ' · ' + (f[d] ? formatarHora(f[d][0]) + '–' + formatarHora(f[d][1]) : 'fechado'));
      });
    }
    [6, 0].forEach(function (d) {
      linhas.push(DIAS_CURTOS[d] + ' · ' + (f[d] ? formatarHora(f[d][0]) + '–' + formatarHora(f[d][1]) : 'fechado'));
    });
    const alvo = document.getElementById('funcionamento-texto');
    linhas.forEach(function (l, i) {
      if (i) alvo.appendChild(document.createElement('br'));
      alvo.appendChild(document.createTextNode(l));
    });
  })();

  /* ---------- horários por dia ---------- */
  (function () {
    const abas = document.getElementById('abas-dias');
    const agenda = document.getElementById('agenda');
    const hoje = new Date().getDay();

    function mostrarDia(dia) {
      abas.querySelectorAll('button').forEach(function (b) {
        b.setAttribute('aria-selected', String(Number(b.dataset.dia) === dia));
      });
      agenda.replaceChildren();

      const itens = [];
      const t = C.funcionamento[dia];
      if (t) itens.push({ hora: formatarHora(t[0]) + '–' + formatarHora(t[1]), nome: 'Musculação', obs: 'Sala livre, com professor' });
      (C.aulas[dia] || []).forEach(function (a) { itens.push(a); });

      if (!itens.length) {
        agenda.appendChild(el('p', 'agenda__linha agenda__nome', 'Fechado. Descanso também é treino.'));
        return;
      }
      itens.forEach(function (a) {
        const linha = el('div', 'agenda__linha');
        linha.append(el('span', 'agenda__hora', a.hora), el('span', 'agenda__nome', a.nome), el('span', 'agenda__obs', a.obs || ''));
        agenda.appendChild(linha);
      });
    }

    [1, 2, 3, 4, 5, 6, 0].forEach(function (d) {
      const b = el('button', '', DIAS_CURTOS[d] + (d === hoje ? ' · hoje' : ''));
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.dataset.dia = d;
      b.addEventListener('click', function () { mostrarDia(d); });
      abas.appendChild(b);
    });
    mostrarDia(hoje);
  })();

  /* ---------- qual é o seu objetivo ---------- */
  (function () {
    const OBJETIVOS = {
      massa: {
        titulo: 'Musculação',
        desc: 'Treino de força na sala de musculação, com orientação de professor pra montar seu treino desde o primeiro dia.',
        msg: 'Oi! Quero ganhar massa e gostaria de agendar uma aula experimental na Sô Fit.'
      },
      emagrecer: {
        titulo: 'Spinning + Cardio',
        desc: 'Aulas coletivas de ritmo forte, combinadas com musculação. A aula de Cardio de quarta às 18:20 é um ótimo começo.',
        msg: 'Oi! Quero emagrecer e gostaria de conhecer as aulas de spinning e cardio da Sô Fit.'
      },
      zero: {
        titulo: 'Aula experimental',
        desc: 'Sem pressão: você conhece a academia, conversa com um professor e começa no seu ritmo.',
        msg: 'Oi! Estou começando agora e gostaria de agendar uma aula experimental na Sô Fit.'
      }
    };
    const botoes = document.querySelectorAll('[data-objetivo]');
    const caixa = document.getElementById('resultado');

    botoes.forEach(function (b) {
      b.addEventListener('click', function () {
        const o = OBJETIVOS[b.dataset.objetivo];
        botoes.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        document.getElementById('resultado-titulo').textContent = o.titulo;
        document.getElementById('resultado-desc').textContent = o.desc;
        const link = document.getElementById('resultado-link');
        link.href = linkWhatsApp(o.msg);
        link.target = '_blank';
        link.rel = 'noopener';
        caixa.hidden = false;
      });
    });
  })();

  /* ---------- planos: Sô Fit x Gympass/TotalPass ---------- */
  (function () {
    const abas = [document.getElementById('aba-direto'), document.getElementById('aba-apps')];
    abas.forEach(function (aba) {
      aba.addEventListener('click', function () {
        abas.forEach(function (a) {
          const ativa = a === aba;
          a.setAttribute('aria-selected', String(ativa));
          document.getElementById(a.getAttribute('aria-controls')).hidden = !ativa;
        });
      });
    });
  })();

  /* =========================================================
     PLANILHA: avisos e campanhas
     ========================================================= */

  // Lê um CSV respeitando aspas (textos com vírgula ou quebra de linha).
  function lerCSV(texto) {
    const linhas = [];
    let linha = [], celula = '', aspas = false;
    for (let i = 0; i < texto.length; i++) {
      const c = texto[i];
      if (aspas) {
        if (c === '"' && texto[i + 1] === '"') { celula += '"'; i++; }
        else if (c === '"') aspas = false;
        else celula += c;
      } else if (c === '"') aspas = true;
      else if (c === ',') { linha.push(celula); celula = ''; }
      else if (c === '\n' || c === '\r') {
        if (c === '\r' && texto[i + 1] === '\n') i++;
        linha.push(celula); linhas.push(linha); linha = []; celula = '';
      } else celula += c;
    }
    if (celula || linha.length) { linha.push(celula); linhas.push(linha); }
    return linhas;
  }

  // "Mostrar até" -> mostrar_ate (sem acento, minúsculo, com _)
  function normalizar(s) {
    return s.normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase().replace(/\s+/g, '_');
  }

  function paraObjetos(linhas) {
    if (!linhas.length) return [];
    const cab = linhas[0].map(normalizar);
    return linhas.slice(1)
      .filter(function (l) { return l.some(function (c) { return c.trim(); }); })
      .map(function (l) {
        const o = {};
        cab.forEach(function (k, i) { o[k] = (l[i] || '').trim(); });
        return o;
      });
  }

  function marcado(v) {
    return ['sim', 's', 'x', 'true', 'verdadeiro', '1'].indexOf(String(v || '').trim().toLowerCase()) !== -1;
  }

  // "30/11/2026" -> data do fim daquele dia
  function lerData(v) {
    const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(v || '');
    return m ? new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]), 23, 59, 59) : null;
  }

  function aindaValido(item) {
    const ate = lerData(item.mostrar_ate);
    return !ate || ate >= new Date();
  }

  function linkSeguro(v) {
    return /^https?:\/\//i.test(v || '') ? v : '';
  }

  async function carregarAba(nome) {
    const url = 'https://docs.google.com/spreadsheets/d/' + encodeURIComponent(C.planilhaId) +
      '/gviz/tq?tqx=out:csv&sheet=' + encodeURIComponent(nome);
    const resp = await fetch(url, { cache: 'no-store' });
    if (!resp.ok) throw new Error('Planilha não respondeu (' + resp.status + ')');
    return paraObjetos(lerCSV(await resp.text()));
  }

  function mostrarAvisos(lista) {
    const ativos = lista.filter(function (a) { return marcado(a.ativo) && a.titulo && aindaValido(a); });
    const secao = document.getElementById('avisos');
    const alvo = document.getElementById('avisos-lista');
    alvo.replaceChildren();
    secao.hidden = ativos.length === 0;

    ativos.forEach(function (a) {
      const card = el('article', 'aviso');
      if (a.tipo) card.appendChild(el('span', 'aviso__tipo', a.tipo));
      card.appendChild(el('h3', 'aviso__titulo', a.titulo));
      if (a.texto) card.appendChild(el('p', 'aviso__texto', a.texto));
      if (a.data) card.appendChild(el('span', 'aviso__data', a.data));
      const link = linkSeguro(a.link);
      if (link) {
        const l = el('a', 'aviso__link', 'Saiba mais →');
        l.href = link; l.target = '_blank'; l.rel = 'noopener';
        card.appendChild(l);
      }
      alvo.appendChild(card);
    });
  }

  // Escolhe texto branco ou preto conforme a cor de fundo da campanha.
  function corDoTexto(hex) {
    const n = parseInt(hex.slice(1), 16);
    const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    return (0.299 * r + 0.587 * g + 0.114 * b) > 160 ? '#0A0A0A' : '#FFFFFF';
  }

  function mostrarCampanha(lista) {
    const c = lista.find(function (x) { return marcado(x.ativa) && x.nome && aindaValido(x); });
    const faixa = document.getElementById('campanha');
    if (!c) { faixa.hidden = true; return; }

    const cor = /^#[0-9a-f]{6}$/i.test(c.cor || '') ? c.cor : '#1E5BD8';
    document.documentElement.style.setProperty('--campanha', cor);
    document.documentElement.style.setProperty('--campanha-texto', corDoTexto(cor));
    document.getElementById('campanha-nome').textContent = c.nome;
    document.getElementById('campanha-msg').textContent = c.mensagem || '';
    const link = document.getElementById('campanha-link');
    const url = linkSeguro(c.link);
    link.hidden = !url;
    if (url) { link.href = url; link.target = '_blank'; link.rel = 'noopener'; }
    faixa.hidden = false;
  }

  async function carregarConteudo() {
    if (!C.planilhaId) {
      mostrarAvisos(C.exemplo.avisos);
      mostrarCampanha(C.exemplo.campanha);
      return;
    }
    try {
      const [avisos, campanha] = await Promise.all([carregarAba('Avisos'), carregarAba('Campanha')]);
      mostrarAvisos(avisos);
      mostrarCampanha(campanha);
    } catch (erro) {
      // Se a planilha falhar, o site segue normal, só sem avisos e campanha.
      console.warn('Não consegui ler a planilha.', erro);
      mostrarAvisos([]);
      mostrarCampanha([]);
    }
  }
  carregarConteudo();
})();
