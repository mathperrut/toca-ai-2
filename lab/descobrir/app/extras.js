/* =========================================================
   TOCA AÍ 2 — extras.js
   Recursos extras (Fase 6):
     1. Treino de ouvido: maior/menor, intervalos, graus e sétima.
     2. Gravar você tocando: grava pelo microfone e guarda no aparelho.
     3. Descobrir acordes: ouvindo pelo microfone (ao vivo) ou um MP3
        seu (vira uma música em "Minhas músicas", já sincronizada).
   O treino de velocidade (repetir um trecho subindo a velocidade)
   fica no jogo (jogo.js) e na página da música (app.js).
   ========================================================= */
'use strict';

/* ---------- 1. Treino de ouvido ---------- */
// Mais um tipo de pergunta: o acorde tem sétima?
OUVIDO.setima = {
  titulo: 'Tem sétima?', dica: 'A sétima deixa o acorde com um gosto de "quero continuar".',
  sortear() {
    const pares = [['C', 'C7'], ['G', 'G7'], ['A', 'A7'], ['E', 'E7'], ['D', 'D7'], ['Am', 'Am7'], ['Em', 'Em7'], ['Dm', 'Dm7']];
    const [sem, com] = sortear(pares), tem = Math.random() < 0.5, nome = tem ? com : sem;
    return { tocar: () => ouvirAcorde(nome), opcoes: ['Sem sétima', 'Com sétima'], certa: tem ? 1 : 0, explica: `Era ${nome}: ${tem ? 'com' : 'sem'} sétima.` };
  }
};
const TIPOS_OUVIDO = [
  ['maiorMenor', 'Maior ou menor', 'Um acorde: aberto e alegre, ou fechado e triste?'],
  ['intervalo', 'Intervalos', 'Duas notas: qual é a distância entre elas?'],
  ['grau', 'Graus da família', 'Depois do I, qual veio: IV, V ou vi?'],
  ['setima', 'Tem sétima?', 'O acorde tem a sétima ou não?']
];
function abrirTreinoOuvido() {
  abrirJanela('Treino de ouvido', `<div class="ouvido-tela">
    <p class="sub">10 perguntas por rodada. Use fone de ouvido se puder e cante o que ouvir: o ouvido aprende mais rápido.</p>
    <div class="modos" id="ou-tipos">${TIPOS_OUVIDO.map(([k, n, d]) => `<button type="button" class="modo" data-ou="${k}"><b>${n}</b><small>${d}${S.recordes['ouvido:' + k] ? ` Recorde: ${S.recordes['ouvido:' + k]} de 10.` : ''}</small></button>`).join('')}</div>
    <div id="ou-area"></div></div>`);
  $('#janela').classList.add('cheia');
  $$('[data-ou]').forEach(b => b.addEventListener('click', () => {
    const tipo = b.dataset.ou;
    $('#ou-tipos').hidden = true;
    const area = $('#ou-area');
    exercicioOuvido(area, tipo, { n: 10, aoFim: acertos => {
      const chave = 'ouvido:' + tipo, antes = S.recordes[chave] || 0;
      if (acertos > antes) S.recordes[chave] = acertos;
      ganharXP(5 + acertos, 'treino de ouvido', true);
      Store.salvar();
      if (!area.querySelector('#ou-outro')) area.insertAdjacentHTML('beforeend', '<button class="btn largo" id="ou-outro">Outro treino</button>');
      area.querySelector('#ou-outro').addEventListener('click', () => abrirTreinoOuvido());
    } });
  }));
}

/* ---------- 2. Gravar você tocando ----------
   O áudio fica no aparelho (IndexedDB, o mesmo banco dos MP3), com a chave "rec:<número>".
   A lista (nome, data, duração) fica no estado do app. */
const Gravador = {
  rec: null, pedacos: [], stream: null, inicio: 0, nivel: null,
  get gravando() { return !!(this.rec && this.rec.state === 'recording'); },
  tipo() {
    const tipos = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'];
    return (window.MediaRecorder && tipos.find(t => MediaRecorder.isTypeSupported?.(t))) || '';
  },
  async iniciar() {
    if (!window.MediaRecorder) throw new Error('sem-suporte');
    // microfone "cru", como o detector usa: sem cancelar eco nem mexer no volume (o violão soa natural)
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
    const tipo = this.tipo();
    this.rec = new MediaRecorder(this.stream, tipo ? { mimeType: tipo, audioBitsPerSecond: 96000 } : undefined);
    this.pedacos = [];
    this.rec.ondataavailable = e => { if (e.data && e.data.size) this.pedacos.push(e.data); };
    this.rec.start(1000);
    this.inicio = Date.now();
  },
  // Para e guarda. Devolve o item da lista (ou null se ficou curtinho demais)
  async parar(titulo = 'Gravação') {
    if (!this.rec) return null;
    const rec = this.rec, duracao = (Date.now() - this.inicio) / 1000;
    await new Promise(ok => { rec.onstop = ok; try { rec.stop(); } catch (e) { ok(); } });
    this.stream?.getTracks().forEach(t => t.stop());
    this.rec = null; this.stream = null;
    if (duracao < 1 || !this.pedacos.length) return null;
    const blob = new Blob(this.pedacos, { type: rec.mimeType || 'audio/webm' });
    const item = { id: 'rec:' + Date.now(), titulo, data: new Date().toISOString(), duracao: Math.round(duracao) };
    await BancoAudio._tx('readwrite', st => st.put({ blob, nome: titulo, tipo: blob.type }, item.id));
    S.minhasGravacoes = [item, ...(S.minhasGravacoes || [])].slice(0, 60);
    Store.salvar();
    return item;
  },
  async apagar(id) {
    await BancoAudio.apagar(id).catch(() => {});
    S.minhasGravacoes = (S.minhasGravacoes || []).filter(g => g.id !== id);
    Store.salvar();
  }
};
const duracaoTexto = s => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;
const dataTexto = iso => { try { return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) + ', ' + new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; } };
function abrirGravador() {
  let timer = null, tocador = null, url = null;
  const lista = () => (S.minhasGravacoes || []).map(g => `<li class="grav-item" data-id="${esc(g.id)}">
      <button class="btn-icone" data-acao="tocar" aria-label="Ouvir ${esc(g.titulo)}">${IC.play}</button>
      <span class="grav-txt"><b>${esc(g.titulo)}</b><small>${dataTexto(g.data)}, ${duracaoTexto(g.duracao)}</small></span>
      <button class="btn mini" data-acao="baixar">Salvar</button>
      <button class="btn mini sem-borda" data-acao="apagar" aria-label="Apagar ${esc(g.titulo)}">Apagar</button></li>`).join('');
  abrirJanela('Gravar você tocando', `<div class="grav">
      <p class="sub">Grave um trecho e ouça depois: é o jeito mais rápido de achar o que melhorar. Fica só no seu celular.</p>
      <div class="grav-painel">
        <b class="grav-tempo" id="gr-tempo" aria-live="off">0:00</b>
        <div class="medidor" aria-hidden="true"><i id="gr-nivel"></i></div>
        <button class="btn primario largo grande" id="gr-btn">${IC.mic} Gravar</button>
        <p class="sub" id="gr-msg" aria-live="polite"></p>
      </div>
      <section><h3>Suas gravações</h3><ul class="grav-lista" id="gr-lista">${lista() || '<li class="vazio">Nenhuma gravação ainda.</li>'}</ul></section>
    </div>`, () => { clearInterval(timer); if (Gravador.gravando) Gravador.parar('Gravação'); tocador?.pause(); if (url) URL.revokeObjectURL(url); });
  $('#janela').classList.add('cheia');
  const btn = $('#gr-btn'), msg = $('#gr-msg');
  const desenharLista = () => { $('#gr-lista').innerHTML = lista() || '<li class="vazio">Nenhuma gravação ainda.</li>'; ligarLista(); };
  btn.addEventListener('click', async () => {
    if (Gravador.gravando) {
      clearInterval(timer);
      btn.disabled = true;
      const n = (S.minhasGravacoes || []).length + 1;
      const item = await Gravador.parar(`Gravação ${n}`);
      btn.disabled = false; btn.innerHTML = `${IC.mic} Gravar`; btn.classList.remove('gravando');
      $('#gr-nivel').style.transform = 'scaleX(0)';
      msg.textContent = item ? 'Guardada. Toque em ▶ para ouvir.' : 'Ficou curtinha demais: grave pelo menos 1 segundo.';
      desenharLista();
      return;
    }
    try { await Gravador.iniciar(); }
    catch (e) { msg.textContent = e.message === 'sem-suporte' ? 'Este aparelho não consegue gravar áudio pelo app.' : msgSemMicrofone(e); return; }
    btn.innerHTML = 'Parar e guardar'; btn.classList.add('gravando');
    msg.textContent = 'Gravando…';
    // medidor de volume
    try {
      Som.init();
      const an = Som.ctx.createAnalyser(); an.fftSize = 1024;
      Som.ctx.createMediaStreamSource(Gravador.stream).connect(an);
      const buf = new Float32Array(an.fftSize);
      timer = setInterval(() => {
        $('#gr-tempo').textContent = duracaoTexto((Date.now() - Gravador.inicio) / 1000);
        an.getFloatTimeDomainData(buf);
        let r = 0; for (const v of buf) r += v * v;
        $('#gr-nivel').style.transform = `scaleX(${Math.min(1, Math.sqrt(r / buf.length) * 6)})`;
      }, 120);
    } catch (e) { timer = setInterval(() => { $('#gr-tempo').textContent = duracaoTexto((Date.now() - Gravador.inicio) / 1000); }, 250); }
  });
  function ligarLista() {
    $$('#gr-lista [data-acao]').forEach(b => b.addEventListener('click', async () => {
      const id = b.closest('[data-id]').dataset.id, g = (S.minhasGravacoes || []).find(x => x.id === id);
      if (b.dataset.acao === 'apagar') { tocador?.pause(); await Gravador.apagar(id); desenharLista(); return; }
      const reg = await BancoAudio.ler(id);
      if (!reg) { msg.textContent = 'Não achei esse áudio no aparelho.'; return; }
      if (url) URL.revokeObjectURL(url);
      url = URL.createObjectURL(reg.blob);
      if (b.dataset.acao === 'tocar') {
        tocador?.pause();
        tocador = new Audio(url); tocador.play().catch(() => {});
        msg.textContent = `Tocando: ${g ? g.titulo : ''}`;
      } else {
        const ext = /mp4/.test(reg.tipo || '') ? 'm4a' : /ogg/.test(reg.tipo || '') ? 'ogg' : 'webm';
        const a = document.createElement('a'); a.href = url; a.download = `${(g ? g.titulo : 'gravacao').replace(/[^\wÀ-ú -]/g, '')}.${ext}`;
        document.body.appendChild(a); a.click(); a.remove();
      }
    }));
  }
  ligarLista();
}

/* ---------- 3. Descobrir acordes ----------
   O som vira 12 números por instante (o cromagrama, o mesmo do jogo) e é
   comparado com o "molde" de 60 acordes (maior, menor, 7, m7 e 7M dos 12 tons).
   Dois cuidados que fazem diferença (medidos no lab/, com gravações reais):
     - HARMÔNICOS: uma corda não soa só a sua nota; soa também o 3º harmônico
       (uma quinta acima) e o 5º (uma terça acima). Por isso o molde de cada
       acorde já inclui os harmônicos das suas notas. Sem isso, um Dó maior
       parece C7M (o 5º harmônico do Sol é um Si) e um Lá menor parece Am7.
     - BAIXO: a nota mais grave que tem harmônicos (e não a mais forte) diz a
       raiz. É ela que separa Am7 de C e C7M de Em.
   Para não pular de acorde a cada instante, o app usa o ALGORITMO DE VITERBI:
   ele acha a sequência de acordes mais provável sabendo que um acorde tende a
   continuar (como um GPS que não acredita num pulo de 1 km em 1 segundo).
   No MP3, o app também acha o andamento (BPM) e o tom, e converte os tempos
   em batidas: o resultado vira uma música que dá para tocar no jogo. */
const QUALIDADES_DESCOBRIR = [['', [0, 4, 7]], ['m', [0, 3, 7]], ['7', [0, 4, 7, 10]], ['m7', [0, 3, 7, 10]], ['7M', [0, 4, 7, 11]]];
const NOMES_DESCOBRIR = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
// Ajustes escolhidos no laboratório (lab/descobrir): harmônicos (força que sobra a cada harmônico e quantos),
// peso do baixo, desconto das tétrades (só ganham com sobra) e o "custo de trocar" do Viterbi
const AJUSTE_DESCOBRIR = { harm: 0.9, nHarm: 4, baixo: 0.05, tetrade: 0.03, troca: 3, forca: 9, tom: 0.6 };
const Descobrir = {
  _moldes: null,
  moldes() {
    if (this._moldes) return this._moldes;
    const { harm, nHarm } = AJUSTE_DESCOBRIR, lista = [];
    for (let r = 0; r < 12; r++) for (const [q, ints] of QUALIDADES_DESCOBRIR) {
      const t = new Float32Array(12);
      ints.forEach((iv, k) => {
        for (let h = 1; h <= nHarm; h++) t[(r + iv + Math.round(12 * Math.log2(h))) % 12] += [1, 0.85, 0.75, 0.55][k] * harm ** (h - 1);
      });
      lista.push({ nome: NOMES_DESCOBRIR[r] + q, raiz: r, q, v: normalizarCentrado(t) });
    }
    this._moldes = lista;
    return lista;
  },
  // pontuação de cada acorde para um cromagrama (e, se houver, o baixo)
  pontuar(croma, baixo) {
    const c = normalizarCentrado(croma), M = this.moldes(), out = new Float32Array(M.length);
    const { baixo: pb, tetrade } = AJUSTE_DESCOBRIR;
    let bmax = 0; if (baixo) for (const v of baixo) bmax = Math.max(bmax, v);
    for (let k = 0; k < M.length; k++) {
      let s = 0; for (let i = 0; i < 12; i++) s += c[i] * M[k].v[i];
      if (bmax > 0) s += pb * (baixo[M[k].raiz] / bmax);
      if (M[k].q.length > 1) s -= tetrade;
      out[k] = s;
    }
    return out;
  },
  /* Viterbi: escolhe, para cada instante, o acorde da sequência mais provável.
     notas[t].s[k] = pontuação; ficar no mesmo acorde custa 0, trocar custa "troca". */
  viterbi(notas, { troca = AJUSTE_DESCOBRIR.troca, forca = AJUSTE_DESCOBRIR.forca, bonus = null } = {}) {
    const T = notas.length, K = this.moldes().length + 1;   // + "sem acorde"
    if (!T) return [];
    const ant = new Int16Array(T * K), V = new Float32Array(K), N = new Float32Array(K);
    const em = (t, k) => (k === K - 1 ? (notas[t].silencio ? 2 : forca * 0.18) : (notas[t].silencio ? -3 : forca * notas[t].s[k] + (bonus ? bonus[k] : 0)));
    for (let k = 0; k < K; k++) V[k] = em(0, k);
    for (let t = 1; t < T; t++) {
      let best = -Infinity, bk = 0;
      for (let k = 0; k < K; k++) if (V[k] > best) { best = V[k]; bk = k; }
      for (let k = 0; k < K; k++) {
        const ficar = V[k], trocar = best - troca;
        if (ficar >= trocar) { N[k] = ficar + em(t, k); ant[t * K + k] = k; }
        else { N[k] = trocar + em(t, k); ant[t * K + k] = bk; }
      }
      V.set(N);
    }
    let k = 0; for (let j = 1; j < K; j++) if (V[j] > V[k]) k = j;
    const caminho = new Int16Array(T);
    for (let t = T - 1; t >= 0; t--) { caminho[t] = k; k = ant[t * K + k]; }
    return Array.from(caminho, x => (x === K - 1 ? null : this.moldes()[x].nome));
  },
  // trechos [{acorde, t0, t1}] a partir do caminho (instantes de "passo" segundos)
  trechos(caminho, passo, minimo = 0.45) {
    const out = [];
    caminho.forEach((a, t) => {
      const ult = out.at(-1);
      if (ult && ult.acorde === a) ult.t1 = (t + 1) * passo;
      else out.push({ acorde: a, t0: t * passo, t1: (t + 1) * passo });
    });
    // junta trechos curtinhos ao vizinho anterior
    const limpo = [];
    for (const tr of out) {
      if (limpo.length && (tr.t1 - tr.t0 < minimo || tr.acorde === null)) { limpo.at(-1).t1 = tr.t1; continue; }
      if (limpo.length && limpo.at(-1).acorde === tr.acorde) { limpo.at(-1).t1 = tr.t1; continue; }
      limpo.push({ ...tr });
    }
    return limpo.filter(t => t.acorde);
  },

  /* ----- MP3: análise completa ----- */
  PASSO: 0.1,
  // 1) o som vira, a cada 0,1 s, um cromagrama + a nota do baixo + a energia
  async extrairQuadros(x, SR, aoProgresso = () => {}) {
    const N = 4096, hop = Math.round(SR * this.PASSO), hz = SR / N, janela = hann(N);
    const re = new Float64Array(N), im = new Float64Array(N), db = new Float32Array(N / 2 + 1);
    const notas = [];
    const nQuadros = Math.max(0, Math.floor((x.length - N) / hop));
    for (let q = 0; q < nQuadros; q++) {
      const o = q * hop;
      for (let i = 0; i < N; i++) { re[i] = x[o + i] * janela[i]; im[i] = 0; }
      fft(re, im);
      let energia = 0;
      for (let i = 0; i <= N / 2; i++) {
        const mag = Math.hypot(re[i], im[i]) / N;
        db[i] = 20 * Math.log10(mag + 1e-12);
        energia += mag * mag;
      }
      const r = cromaDePicos(db, hz, N / 2 + 1);
      notas.push({ croma: r.croma, baixo: baixoDePicos(db, hz, N / 2 + 1), energia });
      if (q % 200 === 0) { aoProgresso(q / nQuadros); await new Promise(ok => setTimeout(ok, 0)); }
    }
    return notas;
  },
  // 2) decide os acordes: 1ª passada, depois favorece os acordes do tom encontrado (2ª passada)
  decidir(notas) {
    const energias = notas.map(n => n.energia).sort((a, b) => a - b), tipica = energias[Math.floor(energias.length * 0.6)] || 0;
    const quadros = notas.map(n => ({ silencio: n.energia < tipica * 0.02, s: this.pontuar(n.croma, n.baixo) }));
    let caminho = this.viterbi(quadros);
    const tr1 = this.trechos(caminho, this.PASSO);
    const tom = estimarTom(tr1.map(t => ({ acorde: t.acorde, tempos: t.t1 - t.t0 })));
    if (tom && AJUSTE_DESCOBRIR.tom) {
      const bonus = this.moldes().map(m => (acordeNoTom(m, tom) ? AJUSTE_DESCOBRIR.tom : 0));
      caminho = this.viterbi(quadros, { bonus });
    }
    return { trechos: this.trechos(caminho, this.PASSO), tom, caminho };
  },
  async analisarArquivo(arquivo, aoProgresso = () => {}) {
    const SR = 22050;
    const bruto = await arquivo.arrayBuffer();
    const ctx = new OfflineAudioContext(1, SR, SR);
    const buf = await new Promise((ok, erro) => ctx.decodeAudioData(bruto, ok, erro));
    const x = buf.getChannelData(0);
    aoProgresso(0.1);
    const notas = await this.extrairQuadros(x, SR, p => aoProgresso(0.1 + 0.6 * p));
    aoProgresso(0.75);
    const { trechos, tom } = this.decidir(notas);
    aoProgresso(0.85);
    const { bpm, fase } = andamento(x, SR);
    aoProgresso(1);
    return { trechos, bpm, fase, tom, duracao: x.length / SR };
  },
  // trechos em segundos -> sequência em tempos (batidas), alinhada à grade do andamento
  paraSequencia({ trechos, bpm, fase }) {
    const seg = 60 / bpm, beat = t => Math.round((t - fase) / seg);
    const itens = [];
    for (const tr of trechos) {
      const b0 = beat(tr.t0), b1 = Math.max(b0 + 1, beat(tr.t1));
      const ult = itens.at(-1);
      if (ult && ult.acorde === tr.acorde) { ult.b1 = b1; continue; }
      if (ult && b0 < ult.b1) { if (b1 <= ult.b1) continue; itens.push({ acorde: tr.acorde, b0: ult.b1, b1 }); continue; }
      itens.push({ acorde: tr.acorde, b0, b1 });
    }
    if (!itens.length) return { seq: '', inicio: 0 };
    // buracos (sem acorde) viram parte do acorde anterior
    for (let i = 1; i < itens.length; i++) if (itens[i].b0 > itens[i - 1].b1) itens[i - 1].b1 = itens[i].b0;
    const inicio = fase + itens[0].b0 * seg;
    return { seq: itens.map(i => `${i.acorde}:${i.b1 - i.b0}`).join(' '), inicio };
  }
};
/* A nota do baixo: a mais grave (Dó2 a Si3) que soa E tem harmônicos por cima.
   "Saliência" de uma nota = força dela + 0,8 x a do 2º harmônico + 0,6 x a do 3º...
   Fica com a mais grave que chega à metade da maior saliência. Assim o Mi grave
   do Em ganha, mesmo soando mais fraco que o Si (o violão é assim: a corda grossa
   tem a nota fraca e os harmônicos fortes). Devolve 12 números (1 na nota do baixo). */
const PESOS_HARM_BAIXO = [1, 0.8, 0.6, 0.5, 0.4];
function baixoDePicos(db, hz, n = db.length) {
  const b = new Float32Array(12);
  const i0 = Math.max(2, Math.floor(50 / hz)), i1 = Math.min(n - 2, Math.ceil(2000 / hz));
  let maior = 0;
  for (let i = i0; i < i1; i++) { const m = Math.pow(10, db[i] / 20); if (isFinite(m) && m > maior) maior = m; }
  if (!maior) return b;
  const L = new Float32Array(i1 - i0 + 2);
  let lmax = 0;
  for (let i = i0 - 1; i <= i1; i++) { const m = Math.pow(10, db[i] / 20); const v = isFinite(m) ? Math.log1p(60 * m / maior) : 0; L[i - i0 + 1] = v; if (v > lmax) lmax = v; }
  const picos = [];
  for (let i = i0; i < i1; i++) {
    const a = L[i - i0], c = L[i - i0 + 1], d0 = L[i - i0 + 2];
    if (c > a && c >= d0 && c > 0.18 * lmax) {
      const den = a - 2 * c + d0, d = den ? 0.5 * (a - d0) / den : 0;
      picos.push([69 + 12 * Math.log2(((i + d) * hz) / 440), c / lmax]);
    }
  }
  if (!picos.length) return b;
  let sx = 0, sy = 0;
  for (const [m, w] of picos) { const dv = m - Math.round(m); sx += w * Math.cos(2 * Math.PI * dv); sy += w * Math.sin(2 * Math.PI * dv); }
  const af = Math.atan2(sy, sx) / (2 * Math.PI);
  const forca = alvo => { let v = 0; for (const [m, w] of picos) if (Math.abs(m - af - alvo) < 0.4 && w > v) v = w; return v; };
  const sal = [];
  for (let m = 36; m <= 59; m++) {
    if (!forca(m)) { sal.push(0); continue; }
    let s = 0; PESOS_HARM_BAIXO.forEach((w, h) => { s += w * forca(m + 12 * Math.log2(h + 1)); });
    sal.push(s);
  }
  const mx = Math.max(...sal);
  if (mx > 0) b[(36 + sal.findIndex(s => s >= 0.5 * mx)) % 12] = 1;
  return b;
}
function normalizarCentrado(v) {
  const m = v.reduce((a, b) => a + b, 0) / v.length;
  const c = Array.from(v, x => x - m), n = Math.hypot(...c) || 1;
  return c.map(x => x / n);
}
// O acorde faz parte do campo harmônico do tom? (maior: I ii iii IV V vi; menor: i iv v/V VI VII III)
function acordeNoTom(m, tom) {
  const g = (m.raiz - tom.pc + 12) % 12, menor = m.q.startsWith('m') && m.q !== '7M';
  if (tom.modo === 'maior') return menor ? [2, 4, 9].includes(g) : [0, 5, 7].includes(g) && (m.q !== '7' || g === 7);
  return menor ? [0, 5, 7].includes(g) : [3, 8, 10, 7].includes(g);
}
function hann(N) { const w = new Float64Array(N); for (let i = 0; i < N; i++) w[i] = 0.5 - 0.5 * Math.cos(2 * Math.PI * i / (N - 1)); return w; }
// FFT radix-2 (no lugar): re e im de tamanho potência de 2
function fft(re, im) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = -2 * Math.PI / len, wr = Math.cos(ang), wi = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let cr = 1, ci = 0;
      for (let k = 0; k < len / 2; k++) {
        const a = i + k, b = a + len / 2;
        const tr = re[b] * cr - im[b] * ci, ti = re[b] * ci + im[b] * cr;
        re[b] = re[a] - tr; im[b] = im[a] - ti; re[a] += tr; im[a] += ti;
        const ncr = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = ncr;
      }
    }
  }
}
/* Andamento: "força dos ataques" (quanto a energia sobe de um instante para o outro),
   depois autocorrelação para achar o intervalo que mais se repete (60 a 180 BPM,
   preferindo os andamentos mais comuns, perto de 100). A fase é onde os ataques caem. */
function andamento(x, SR) {
  const hop = 512, N = 1024, nQ = Math.floor((x.length - N) / hop);
  if (nQ < 50) return { bpm: 90, fase: 0 };
  const env = new Float32Array(nQ);
  let ant = 0;
  for (let q = 0; q < nQ; q++) {
    let e = 0; const o = q * hop;
    for (let i = 0; i < N; i++) e += x[o + i] * x[o + i];
    const l = Math.log1p(1000 * e);
    env[q] = Math.max(0, l - ant); ant = l;
  }
  const dt = hop / SR;
  let melhor = 90, maior = -Infinity;
  for (let bpm = 60; bpm <= 180; bpm += 0.5) {
    const lag = 60 / bpm / dt;
    let s = 0;
    for (let q = 0; q + lag * 2 < nQ; q++) {
      const a = env[q], b = env[Math.round(q + lag)], c = env[Math.round(q + 2 * lag)];
      s += a * b + 0.5 * a * c;
    }
    s *= Math.exp(-0.5 * Math.pow(Math.log2(bpm / 100) / 0.6, 2));     // prefere perto de 100
    if (s > maior) { maior = s; melhor = bpm; }
  }
  const per = 60 / melhor / dt;
  let fase = 0, fmax = -Infinity;
  for (let f = 0; f < per; f += 1) {
    let s = 0; for (let q = f; q < nQ; q += per) s += env[Math.round(q)] || 0;
    if (s > fmax) { fmax = s; fase = f; }
  }
  return { bpm: Math.round(melhor), fase: fase * dt };
}

// Janela "Descobrir acordes"
function abrirDescobrir() {
  let parar = null;
  abrirJanela('Descobrir acordes', `<div class="desc">
      <p class="sub">O app ouve a música e mostra os acordes. É um palpite: confira de ouvido e ajuste o que precisar.</p>
      <div class="modos">
        <button type="button" class="modo" id="ds-mic"><b>${IC.mic} Ouvir pelo microfone</b><small>Toque o violão (ou ponha a música para tocar perto do celular) e veja o acorde na hora</small></button>
        <label class="modo" id="ds-arq-rot"><b>${IC.nota} Escolher um MP3</b><small>O app tira os acordes da música inteira e cria uma cifra que você pode jogar, já sincronizada com o áudio</small><input type="file" accept="audio/*" id="ds-arq" hidden></label>
      </div>
      <div id="ds-area" aria-live="polite"></div>
    </div>`, () => parar?.());
  $('#janela').classList.add('cheia');
  $('#ds-mic').addEventListener('click', async () => { parar?.(); parar = await descobrirAoVivo($('#ds-area')); });
  $('#ds-arq').addEventListener('change', e => { const arq = e.target.files[0]; if (arq) { parar?.(); parar = null; descobrirArquivo($('#ds-area'), arq); } });
}
const LIMIAR_AO_VIVO = 0.6;
async function descobrirAoVivo(area) {
  area.innerHTML = `<div class="ds-vivo"><b class="ds-acorde" id="ds-ac">…</b><small id="ds-dica">Ouvindo</small><div class="ds-hist" id="ds-hist"></div><button class="btn largo" id="ds-parar">Parar</button></div>`;
  try { await Detector.ligar(); } catch (e) { area.innerHTML = `<p class="sub">${esc(msgSemMicrofone(e))}</p>`; return null; }
  let media = null, mediaB = null, ultimo = null, contagem = 0, mostrado = null, timer = null;
  const hist = [];
  const passo = () => {
    const r = Detector.croma();
    if (!r || r.energia < 1e-7) { $('#ds-dica') && ($('#ds-dica').textContent = 'Silêncio'); return; }
    const an = Detector.analisadorFreq, b = baixoDePicos(Detector._bufEsp, Som.ctx.sampleRate / an.fftSize, an.frequencyBinCount);
    media = media ? media.map((v, i) => 0.6 * v + 0.4 * r.croma[i]) : Array.from(r.croma);
    mediaB = mediaB ? mediaB.map((v, i) => 0.6 * v + 0.4 * b[i]) : Array.from(b);
    const s = Descobrir.pontuar(media, mediaB), M = Descobrir.moldes();
    let k = 0; for (let j = 1; j < s.length; j++) if (s[j] > s[k]) k = j;
    // parecido de verdade com o molde (sem contar o baixo)? senão, é ruído ou um acorde que o app não conhece
    const c = normalizarCentrado(media); let parecido = 0; for (let i = 0; i < 12; i++) parecido += c[i] * M[k].v[i];
    const nome = parecido > LIMIAR_AO_VIVO ? M[k].nome : null;
    contagem = nome === ultimo ? contagem + 1 : 1; ultimo = nome;
    if (nome && contagem >= 3 && nome !== mostrado) {             // 3 leituras iguais (~0,4 s) antes de trocar
      mostrado = nome;
      $('#ds-ac').textContent = nome;
      hist.push(nome); if (hist.length > 12) hist.shift();
      $('#ds-hist').innerHTML = hist.map(a => `<span class="chip-acorde">${esc(a)}</span>`).join('');
      vibrar(6);
    }
    $('#ds-dica').textContent = nome ? 'Ouvindo' : 'Não reconheci: toque um acorde';
  };
  timer = setInterval(passo, 120);
  ativos.add('descobrir');
  const parar = () => { clearInterval(timer); timer = null; ativos.delete('descobrir'); };
  area.querySelector('#ds-parar').addEventListener('click', () => { parar(); area.innerHTML = hist.length ? `<p class="sub">Acordes que apareceram: <b>${hist.map(esc).join(', ')}</b></p>` : ''; });
  return parar;
}
async function descobrirArquivo(area, arquivo) {
  area.innerHTML = `<div class="ds-prog"><p>Ouvindo <b>${esc(arquivo.name)}</b>…</p><div class="medidor"><i id="ds-barra"></i></div></div>`;
  let r;
  try { r = await Descobrir.analisarArquivo(arquivo, p => { const b = $('#ds-barra'); if (b) b.style.transform = `scaleX(${p})`; }); }
  catch (e) { area.innerHTML = '<p class="sub">Não consegui abrir esse arquivo. Tente um MP3, M4A ou WAV.</p>'; return; }
  const { seq, inicio } = Descobrir.paraSequencia(r);
  if (!seq) { area.innerHTML = '<p class="sub">Não achei acordes nesse arquivo.</p>'; return; }
  const titulo = arquivo.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim() || 'Música descoberta';
  const itens = lerSequencia(seq);
  const unicos = [...new Set(itens.map(x => x.acorde))];
  area.innerHTML = `<div class="ds-res">
      <p><b>${unicos.length} acordes</b>, ${r.bpm} BPM${r.tom && r.tom.seguro ? `, tom provável: <b>${esc(nomeDoTom(r.tom))}</b>` : ''}.</p>
      <div class="ds-hist">${unicos.map(a => `<span class="chip-acorde">${esc(a)}</span>`).join('')}</div>
      <label class="faixa">Nome<input type="text" id="ds-nome" value="${esc(titulo)}" maxlength="60"></label>
      <button class="btn primario largo" id="ds-salvar">Salvar em Minhas músicas</button>
      <p class="sub">A cifra fica em "Minhas músicas" e o áudio fica guardado só no seu celular, já sincronizado com o jogo.</p>
    </div>`;
  area.querySelector('#ds-salvar').addEventListener('click', async e => {
    e.currentTarget.disabled = true;
    const m = {
      id: 'd' + Date.now().toString(36), origem: 'descoberta', titulo: $('#ds-nome').value.trim() || titulo, artista: '', genero: '', padrao: 'pop',
      bpm: r.bpm, bpmEstimado: true, capo: 0, secoes: [{ nome: 'Música', seq, repetir: 1 }],
      nota: 'Acordes descobertos pelo app ouvindo o seu MP3. É um palpite: confira de ouvido e ajuste o que precisar.', status: 'aprendendo'
    };
    try {
      await BancoAudio.salvar(m.id, arquivo);
      S.gravacoes = S.gravacoes || {};
      S.gravacoes[m.id] = { nome: arquivo.name, offset: inicio, bpm: r.bpm, sincronizada: true };
    } catch (err) { /* sem áudio guardado: a cifra fica do mesmo jeito */ }
    S.musicas.unshift(m);
    S.cfg.junto = 'tudo'; S.cfg.fonteTudo = 'mp3';
    Store.salvar();
    fecharJanela();
    if (viewAtual === 'musicas') RENDER.musicas();
    abrirMusica(m.id);
  });
}
