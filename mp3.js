/* =========================================================
   TOCA AÍ 2 — mp3.js
   "Tudo: voz e instrumentos" com um MP3 SEU.
   O arquivo fica só no seu celular (IndexedDB). Depois de sincronizar
   (bater no tempo junto com a música), o app consegue tocar a gravação
   em OUTRO TOM e em OUTRA VELOCIDADE, como a extensão Transpose.

   COMO MUDAR O TOM SEM MUDAR A VELOCIDADE (para estudar)
   Se você só tocar o áudio mais rápido, ele fica mais agudo E mais curto
   (o "efeito esquilo"). O truque tem 2 passos:
   1. ESTICAR o tempo sem mudar o tom, com um "phase vocoder": corta o
      som em pedacinhos de 46 ms, olha as frequências de cada um (FFT) e
      remonta os pedaços mais espaçados, corrigindo a FASE de cada
      frequência para não dar "eco". Os picos do espectro mandam na fase
      das frequências vizinhas ("fase travada"), o que deixa o som mais limpo.
   2. Tocar esse áudio esticado mais rápido (reamostrar): ele volta ao
      tamanho certo e o tom sobe.
   Ex.: +2 semitons = esticar 12% e depois ler 12% mais rápido.
   ========================================================= */
'use strict';

const CODIGO_VOCODER = `
'use strict';
function prepararFFT(N) {
  const lg = Math.log2(N), rev = new Uint32Array(N);
  for (let i = 0; i < N; i++) { let r = 0; for (let b = 0; b < lg; b++) r = (r << 1) | ((i >> b) & 1); rev[i] = r; }
  const cos = new Float64Array(N / 2), sin = new Float64Array(N / 2);
  for (let i = 0; i < N / 2; i++) { cos[i] = Math.cos(2 * Math.PI * i / N); sin[i] = -Math.sin(2 * Math.PI * i / N); }
  return { N, rev, cos, sin };
}
function fft(f, re, im, inversa) {
  const { N, rev, cos, sin } = f;
  for (let i = 0; i < N; i++) { const j = rev[i]; if (j > i) { let t = re[i]; re[i] = re[j]; re[j] = t; t = im[i]; im[i] = im[j]; im[j] = t; } }
  for (let tam = 2; tam <= N; tam <<= 1) {
    const meio = tam >> 1, passo = N / tam;
    for (let i = 0; i < N; i += tam) for (let j = 0, k = 0; j < meio; j++, k += passo) {
      const wr = cos[k], wi = inversa ? -sin[k] : sin[k], a = i + j, b = a + meio;
      const tr = re[b] * wr - im[b] * wi, ti = re[b] * wi + im[b] * wr;
      re[b] = re[a] - tr; im[b] = im[a] - ti; re[a] += tr; im[a] += ti;
    }
  }
  if (inversa) for (let i = 0; i < N; i++) { re[i] /= N; im[i] /= N; }
}
const embrulhar = a => a - 2 * Math.PI * Math.round(a / (2 * Math.PI));
onmessage = e => {
  const { x, k, v } = e.data;
  const tom = Math.pow(2, k / 12), alfa = tom / v;
  const N = 1024, Hs = N / 4, Ha = Hs / alfa, nb = N / 2 + 1;
  const f = prepararFFT(N), jan = new Float64Array(N);
  for (let i = 0; i < N; i++) jan[i] = 0.5 - 0.5 * Math.cos(2 * Math.PI * i / N);
  const quadros = Math.max(1, Math.floor((x.length - N) / Ha) + 1);
  const L = (quadros - 1) * Hs + N;
  const y = new Float64Array(L), soma = new Float64Array(L);
  const re = new Float64Array(N), im = new Float64Array(N);
  const mag = new Float64Array(nb), fase = new Float64Array(nb), faseAnt = new Float64Array(nb), sint = new Float64Array(nb), novo = new Float64Array(nb);
  const omega = new Float64Array(nb); for (let b = 0; b < nb; b++) omega[b] = 2 * Math.PI * b / N;
  const picos = new Int32Array(nb), dono = new Int32Array(nb);
  let posAnt = 0;
  for (let q = 0; q < quadros; q++) {
    const pos = Math.round(q * Ha);
    for (let i = 0; i < N; i++) { const s = pos + i < x.length ? x[pos + i] : 0; re[i] = s * jan[i]; im[i] = 0; }
    fft(f, re, im, false);
    let maior = 0;
    for (let b = 0; b < nb; b++) { mag[b] = Math.hypot(re[b], im[b]); fase[b] = Math.atan2(im[b], re[b]); if (mag[b] > maior) maior = mag[b]; }
    if (q === 0) sint.set(fase);
    else {
      const ha = pos - posAnt;
      // 1) acha os picos do espectro
      let np = 0;
      for (let b = 1; b < nb - 1; b++) if (mag[b] > mag[b - 1] && mag[b] >= mag[b + 1] && mag[b] > maior * 1e-4) picos[np++] = b;
      if (!np) {
        for (let b = 0; b < nb; b++) { const d = embrulhar(fase[b] - faseAnt[b] - omega[b] * ha); novo[b] = sint[b] + (omega[b] + d / ha) * Hs; }
      } else {
        // 2) cada pico avança a fase pela sua frequência verdadeira
        for (let i = 0; i < np; i++) { const p = picos[i]; const d = embrulhar(fase[p] - faseAnt[p] - omega[p] * ha); novo[p] = sint[p] + (omega[p] + d / ha) * Hs; }
        // 3) as frequências vizinhas seguem o pico mais perto (fase travada)
        let i = 0;
        for (let b = 0; b < nb; b++) {
          while (i < np - 1 && Math.abs(picos[i + 1] - b) < Math.abs(picos[i] - b)) i++;
          dono[b] = picos[i];
        }
        for (let b = 0; b < nb; b++) { const p = dono[b]; if (p !== b) novo[b] = novo[p] + (fase[b] - fase[p]); }
      }
      sint.set(novo);
    }
    faseAnt.set(fase); posAnt = pos;
    for (let b = 0; b < nb; b++) { re[b] = mag[b] * Math.cos(sint[b]); im[b] = mag[b] * Math.sin(sint[b]); }
    for (let b = 1; b < N / 2; b++) { re[N - b] = re[b]; im[N - b] = -im[b]; }
    fft(f, re, im, true);
    const o = q * Hs;
    for (let i = 0; i < N; i++) { y[o + i] += re[i] * jan[i]; soma[o + i] += jan[i] * jan[i]; }
    if (q % 400 === 0) postMessage({ progresso: q / quadros * 0.95 });
  }
  for (let i = 0; i < L; i++) y[i] /= Math.max(soma[i], 0.1);
  // reamostra: lê "tom" vezes mais rápido (volta ao tamanho e sobe o tom)
  const M = Math.floor((L - 3) / tom);
  const z = new Float32Array(M);
  for (let n = 0; n < M; n++) {
    const t = n * tom, i = Math.floor(t), fr = t - i;
    const a = y[i > 0 ? i - 1 : 0], b = y[i], c = y[i + 1], d = y[i + 2];
    z[n] = b + 0.5 * fr * (c - a + fr * (2 * a - 5 * b + 4 * c - d + fr * (3 * (b - c) + d - a)));
  }
  postMessage({ fim: true, z }, [z.buffer]);
};`;

/* Toca a gravação processada no relógio do jogo.
   posicao = segundo da gravação ORIGINAL (o jogo sincroniza por ela). */
class TocadorProcessado {
  constructor(buffer, v) { this.buf = buffer; this.v = v; this.fonte = null; this.inicio = 0; this.p0 = 0; this.tocando = false; this.pausadoEm = null; }
  get posicao() { return (this.tocando ? this.p0 + (Som.agora - this.inicio) : (this.pausadoEm ?? this.p0)) * this.v; }
  tocarDe(posOriginal) {
    this.parar();
    const p = Math.max(0, posOriginal / this.v), s = Som.ctx.createBufferSource();
    s.buffer = this.buf; s.connect(Som.trilha('gravacao'));
    this.inicio = Som.agora + 0.05; this.p0 = p;
    s.start(this.inicio, p);
    this.fonte = s; this.tocando = true; this.pausadoEm = null;
    return Promise.resolve();
  }
  pausar() { if (!this.tocando) return; this.pausadoEm = this.p0 + (Som.agora - this.inicio); try { this.fonte.stop(); } catch (e) {} this.tocando = false; }
  continuar() { if (this.tocando) return; this.tocarDe((this.pausadoEm ?? this.p0) * this.v); }
  parar() { try { this.fonte?.stop(); } catch (e) {} this.fonte = null; this.tocando = false; }
  definirTaxa() { return Promise.resolve(this.v); }
  destruir() { this.parar(); }
}

const MP3 = {
  cache: new Map(),   // "id|tom|velocidade" -> AudioBuffer
  mono: new Map(),    // id -> { x, sr } (o áudio original em mono, 22 kHz)
  tocador: null,

  meta(m) { S.gravacoes = S.gravacoes || {}; return S.gravacoes[m.id] || null; },

  // Decodifica o arquivo em mono a 22.050 Hz (metade do CD: rápido e suficiente para treinar)
  async decodificar(m) {
    if (this.mono.has(m.id)) return this.mono.get(m.id);
    const reg = await BancoAudio.ler(m.id);
    if (!reg) throw new Error('Não achei o arquivo. Escolha o MP3 de novo.');
    const sr = 22050, dados = await reg.blob.arrayBuffer();
    const oc = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, sr, sr);
    const buf = await new Promise((ok, erro) => oc.decodeAudioData(dados, ok, erro));
    const x = new Float32Array(buf.length);
    for (let c = 0; c < buf.numberOfChannels; c++) { const d = buf.getChannelData(c); for (let i = 0; i < x.length; i++) x[i] += d[i] / buf.numberOfChannels; }
    const r = { x, sr: buf.sampleRate };
    this.mono.set(m.id, r);
    return r;
  },

  // k: semitons; v: velocidade (0.4 a 1). Devolve um AudioBuffer pronto para tocar.
  async processar(m, k, v, aoProgresso) {
    const chave = `${m.id}|${k}|${v}`;
    if (this.cache.has(chave)) return this.cache.get(chave);
    Som.init();
    const { x, sr } = await this.decodificar(m);
    let z;
    if (!k && v === 1) z = x;
    else z = await new Promise((ok, erro) => {
      const url = URL.createObjectURL(new Blob([CODIGO_VOCODER], { type: 'application/javascript' }));
      const w = new Worker(url);
      w.onmessage = e => {
        if (e.data.progresso !== undefined) aoProgresso?.(e.data.progresso);
        if (e.data.fim) { w.terminate(); URL.revokeObjectURL(url); ok(e.data.z); }
      };
      w.onerror = e => { w.terminate(); URL.revokeObjectURL(url); erro(new Error('Não consegui processar o áudio.')); };
      w.postMessage({ x: x.slice(), k, v });
    });
    const buf = Som.ctx.createBuffer(1, z.length, sr);
    buf.getChannelData(0).set(z);
    if (this.cache.size > 3) this.cache.delete(this.cache.keys().next().value);
    this.cache.set(chave, buf);
    return buf;
  },

  parar() { this.tocador?.parar(); },

  /* Painel na tela da música (dentro de "Tudo: voz e instrumentos") */
  async painel(caixa, m) {
    const meta = this.meta(m);
    const reg = meta ? await BancoAudio.ler(m.id) : null;
    if (!meta || !reg) {
      caixa.innerHTML = `
        <div class="mp3">
          <p class="sub">Escolha um arquivo de áudio desta música (MP3, M4A ou WAV). Ele fica guardado só no seu celular e não é enviado para lugar nenhum.</p>
          <label class="btn">${IC.mais} Escolher arquivo<input type="file" accept="audio/*" id="mp3-arq" hidden></label>
          <p class="sub" id="mp3-msg" aria-live="polite"></p>
        </div>`;
      caixa.querySelector('#mp3-arq').addEventListener('change', async e => {
        const arq = e.target.files[0];
        if (!arq) return;
        caixa.querySelector('#mp3-msg').textContent = 'Guardando…';
        try {
          await BancoAudio.salvar(m.id, arq);
          S.gravacoes[m.id] = { nome: arq.name, offset: 0, bpm: m.bpm, sincronizada: false };
          this.mono.delete(m.id); [...this.cache.keys()].filter(c => c.startsWith(m.id + '|')).forEach(c => this.cache.delete(c));
          Store.salvar();
          this.painel(caixa, m);
        } catch (err) { caixa.querySelector('#mp3-msg').textContent = 'Não consegui guardar o arquivo neste aparelho.'; }
      });
      return;
    }
    caixa.innerHTML = `
      <div class="mp3">
        <p class="mp3-arq">${IC.nota}<b>${esc(meta.nome || 'Gravação')}</b></p>
        <p class="sub">${meta.sincronizada
          ? `Sincronizado (${(+meta.bpm).toFixed(0)} BPM). No jogo, a gravação toca no tom e na velocidade que você escolher.`
          : 'Falta sincronizar: toque a música e bata no tempo junto com ela. Leva uns 20 segundos.'}</p>
        <div class="linha-botoes">
          <button class="btn ${meta.sincronizada ? '' : 'primario'}" id="mp3-sinc">${meta.sincronizada ? 'Sincronizar de novo' : 'Sincronizar'}</button>
          <button class="btn mini" id="mp3-ouvir">${IC.som} Ouvir no tom escolhido</button>
          <button class="btn mini sem-borda" id="mp3-apagar">Apagar</button>
        </div>
        <p class="sub" id="mp3-msg" aria-live="polite"></p>
        <div id="mp3-sinc-area"></div>
      </div>`;
    const q = s => caixa.querySelector(s);
    q('#mp3-sinc').addEventListener('click', () => {
      abrirSincronia(q('#mp3-sinc-area'), m, meta, reg.blob, () => { q('#mp3-sinc-area').innerHTML = ''; this.painel(caixa, m); });
      q('#mp3-sinc-area').scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
    q('#mp3-apagar').addEventListener('click', async () => {
      await BancoAudio.apagar(m.id).catch(() => {});
      delete S.gravacoes[m.id]; this.mono.delete(m.id); Store.salvar();
      this.painel(caixa, m);
    });
    q('#mp3-ouvir').addEventListener('click', async e => {
      const b = e.currentTarget;
      if (this.tocador?.tocando) { this.parar(); b.innerHTML = `${IC.som} Ouvir no tom escolhido`; return; }
      const arr = arranjo(m), v = Math.max(0.4, Math.min(1, S.cfg.vel / 100));
      b.disabled = true;
      try {
        const buf = await this.processar(m, arr.k, v, p => { q('#mp3-msg').textContent = `Mudando o tom e a velocidade… ${Math.round(p * 100)}%`; });
        q('#mp3-msg').textContent = arr.k ? `Tocando ${descreverDesvio(arr.k)}, a ${Math.round(v * 100)}% da velocidade.` : `Tocando no tom da gravação, a ${Math.round(v * 100)}% da velocidade.`;
        aplicarMix();
        this.tocador = new TocadorProcessado(buf, v);
        this.tocador.tocarDe(Math.max(0, (meta.offset || 0) - 2));
        b.innerHTML = `${IC.pausa} Parar`;
      } catch (err) { q('#mp3-msg').textContent = err.message; }
      b.disabled = false;
    });
  },

  /* O jogo com a SUA gravação como relógio-mestre (igual ao vídeo do YouTube) */
  async jogar(m, secao = null, opcoes = {}) {
    const meta = this.meta(m);
    if (!meta || !meta.sincronizada) { toast('Primeiro escolha e sincronize o MP3 (logo acima)'); return; }
    const arr = arranjo(m, opcoes.k !== undefined ? { k: opcoes.k } : {});
    const v = Math.max(0.4, Math.min(1, (opcoes.vel || S.cfg.vel) / 100));
    const msg = $('#mp3-msg');
    let buf;
    try { buf = await this.processar(m, arr.k, v, p => { if (msg) msg.textContent = `Preparando a gravação… ${Math.round(p * 100)}%`; }); }
    catch (err) { toast(err.message); return; }
    if (msg) msg.textContent = '';
    this.parar();
    const tc = new TocadorProcessado(buf, v);
    this.tocador = tc;
    const pos0 = posicaoNaGravacao(meta, temposAteSecao(m, secao));
    const pedido = opcoes.modo || S.cfg.modo;
    const modo = pedido === 'tempo' ? 'tempo' : 'pratica';     // com a gravação a música não para
    jogarMusica(m, secao, {
      k: arr.k, modo, bpm: meta.bpm * v, bpmBase: meta.bpm, repetir: false,
      gravacao: { tocador: tc, pos0, taxa: v, mestre: true },
      refazer: novo => this.jogar(m, secao, { k: arr.k, vel: novo.bpm ? Math.round(novo.bpm / meta.bpm * 100) : Math.round(v * 100), modo: novo.modo || modo }),
      aoSair: () => tc.parar()
    });
    aplicarMix();
    await tc.tocarDe(Math.max(0, pos0 - 2.5 * v));       // começa 2,5 s antes do 1º acorde
  }
};
