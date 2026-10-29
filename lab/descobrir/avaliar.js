// Laboratório do Toca Aí 2: quão bem o "Descobrir acordes" acerta em gravações REAIS de violão?
// Dados: GuitarSet (Xi et al., 2018, CC BY 4.0) — 180 gravações de acompanhamento ("comp"), 6 violonistas,
// com o acorde tocado anotado instante a instante. Usa o MESMO código do app (pasta app/, cópia do extras.js etc.).
// Mede, a cada 0,1 s: raiz certa, maior/menor certo (regra MIREX "majmin") e o nome exato (C, Cm, C7, Cm7, C7M),
// sem o Viterbi (quadro a quadro) e com o Viterbi + tom (o que o app mostra). Saída: ../saida/descobrir.json
const fs = require('fs'), path = require('path'), vm = require('vm'), { execFileSync } = require('child_process');
const DADOS = process.argv[2] || '../dados', SAIDA = process.argv[3] || 'saida';
const APP = path.join(__dirname, 'app');
const ler = (arq, de, ate) => { const s = fs.readFileSync(path.join(APP, arq), 'utf8'); const i = de ? s.indexOf(de) : 0, j = ate ? s.indexOf(ate, i + 1) : s.length; if (i < 0 || j < 0) throw new Error(arq + ': ' + de); return s.slice(i, j); };
const ctx = { console, Math, Float32Array, Float64Array, Int16Array, Array, Object, Set, Map, JSON, Number, String, isFinite, Promise, setTimeout, S: { cfg: {} } };
vm.createContext(ctx);
vm.runInContext([ler('data.js', 'const CHORDS', 'const NIVEIS'), ler('acordes.js'), ler('tom.js', 'const NOMES_TOM', 'function tomPadrao'),
  ler('audio-detect.js', 'function cromaDePicos', 'const NOMES_NOTAS ='), ler('extras.js', 'const QUALIDADES_DESCOBRIR', '// Janela "Descobrir acordes"'),
  'globalThis.API = { Descobrir, AJUSTE_DESCOBRIR, normalizarCentrado };'].join('\n;\n'), ctx);
const { Descobrir, AJUSTE_DESCOBRIR } = ctx.API;
const PADRAO = { ...AJUSTE_DESCOBRIR };
const PC = { C: 0, 'B#': 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, Fb: 4, 'E#': 5, F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11, Cb: 11 };
// rótulo Harte ('Eb:min7') -> { pc, triade: 'maj'|'min'|null, q: '' | 'm' | '7' | 'm7' | '7M' | null }
const EXATO = { maj: '', min: 'm', '7': '7', min7: 'm7', maj7: '7M' };
const TRIADE = { maj: 'maj', min: 'min', '7': 'maj', min7: 'min', maj7: 'maj', maj6: 'maj', min6: 'min', '9': 'maj', min9: 'min', maj9: 'maj', '11': 'maj', '13': 'maj', minmaj7: 'min' };
function rotulo(r) {
  if (!r || r === 'N' || r === 'X') return null;
  const [raiz, resto = 'maj'] = r.split(':');
  if (!(raiz in PC)) return null;
  const q = resto.split('/')[0].replace(/\(.*\)/, '') || 'maj';
  return { pc: PC[raiz], triade: TRIADE[q] || null, q: q in EXATO ? EXATO[q] : null };
}
function lerJams(arq) {
  const j = JSON.parse(fs.readFileSync(arq, 'utf8'));
  const cands = j.annotations.filter(a => a.namespace === 'chord');
  let ac = cands.find(a => (JSON.stringify(a.annotation_metadata || {}) + JSON.stringify(a.sandbox || {})).toLowerCase().includes('perform')) || cands.at(-1);
  return { segs: (ac ? ac.data : []).map(d => ({ t0: d.time, t1: d.time + d.duration, r: rotulo(d.value) })), qual: cands.indexOf(ac) };
}
function decodificar(arq) {
  const b = execFileSync('ffmpeg', ['-v', 'error', '-i', arq, '-f', 'f32le', '-ac', '1', '-ar', '22050', '-'], { maxBuffer: 1 << 30 });
  return new Float32Array(b.buffer, b.byteOffset, b.length / 4);
}
function procurar(dir, fim) { const out = []; for (const e of fs.readdirSync(dir, { withFileTypes: true })) { const p = path.join(dir, e.name); if (e.isDirectory()) out.push(...procurar(p, fim)); else if (p.endsWith(fim)) out.push(p); } return out; }
const majmin = q => (q.startsWith('m') && q !== '7M' ? 'min' : 'maj');
const partes = nome => { const m = nome.match(/^([A-G][#b]?)(.*)$/); return { pc: PC[m[1]], q: m[2] }; };
(async () => {
  const jams = procurar(path.join(DADOS, 'anot'), '_comp.jams').sort();
  const audio = Object.fromEntries(procurar(path.join(DADOS, 'mic'), '_mic.wav').map(f => [path.basename(f).replace('_mic.wav', ''), f]));
  console.log('comp:', jams.length, 'áudios:', Object.keys(audio).length);
  const arquivos = [];
  const t0 = Date.now();
  for (const jf of jams) {
    const base = path.basename(jf).replace('.jams', '');
    if (!audio[base]) continue;
    const { segs, qual } = lerJams(jf);
    const x = decodificar(audio[base]);
    const notas = await Descobrir.extrairQuadros(x, 22050);
    const meio = 4096 / 2 / 22050;
    const verdade = notas.map((_, i) => { const t = i * Descobrir.PASSO + meio; const s = segs.find(s => t >= s.t0 && t < s.t1); return s ? s.r : null; });
    arquivos.push({ base, jogador: base.slice(0, 2), estilo: base.slice(3, 5), notas, verdade, qual });
  }
  console.log(`quadros extraídos em ${((Date.now() - t0) / 1000).toFixed(0)} s; anotação usada: ${[...new Set(arquivos.map(a => a.qual))].join(',')}`);
  function avaliar(aj, { porJogador = false, confusao = false } = {}) {
    Object.assign(AJUSTE_DESCOBRIR, PADRAO, aj); Descobrir._moldes = null;
    const M = Descobrir.moldes();
    const z = () => ({ raiz: 0, mm: 0, nmm: 0, ex: 0, nex: 0, nraiz: 0 });
    const tot = { quadro: z(), viterbi: z(), final: z() }, jog = {};
    const Q = ['', 'm', '7', 'm7', '7M'], mat = Q.map(() => Q.map(() => 0));
    const conta = (acc, v, nome) => {
      if (!v) return;
      const p = nome ? partes(nome) : null;
      acc.nraiz++; if (p && p.pc === v.pc) acc.raiz++;
      if (v.triade) { acc.nmm++; if (p && p.pc === v.pc && majmin(p.q) === v.triade) acc.mm++; }
      if (v.q !== null) { acc.nex++; if (p && p.pc === v.pc && p.q === v.q) acc.ex++; }
    };
    for (const a of arquivos) {
      const { caminho, trechos } = Descobrir.decidir(a.notas);
      const final = a.notas.map((_, i) => { const t = (i + 0.5) * Descobrir.PASSO; const tr = trechos.find(x => t >= x.t0 && t < x.t1); return tr ? tr.acorde : null; });
      const j = jog[a.jogador] || (jog[a.jogador] = z());
      a.notas.forEach((n, i) => {
        const v = a.verdade[i]; if (!v) return;
        const s = Descobrir.pontuar(n.croma, n.baixo); let k = 0; for (let q = 1; q < s.length; q++) if (s[q] > s[k]) k = q;
        conta(tot.quadro, v, M[k].nome); conta(tot.viterbi, v, caminho[i]); conta(tot.final, v, final[i]); conta(j, v, final[i]);
        if (confusao && v.q !== null && caminho[i]) { const p = partes(caminho[i]); if (p.pc === v.pc) mat[Q.indexOf(v.q)][Q.indexOf(p.q)]++; }
      });
    }
    const pct = (a, b) => +(100 * a / Math.max(1, b)).toFixed(1);
    const fmt = acc => ({ raiz: pct(acc.raiz, acc.nraiz), maior_menor: pct(acc.mm, acc.nmm), exato: pct(acc.ex, acc.nex) });
    const r = { ajuste: aj, quadro: fmt(tot.quadro), viterbi: fmt(tot.viterbi), final: fmt(tot.final) };
    if (porJogador) r.por_jogador = Object.fromEntries(Object.entries(jog).map(([k, v]) => [k, fmt(v)]));
    if (confusao) r.confusao_tipos = { linhas_real_colunas_app: Q.map(q => q || 'M'), m: mat };
    return r;
  }
  const res = { dados: 'GuitarSet comp (CC BY 4.0)', arquivos: arquivos.length, quadros: arquivos.reduce((t, a) => t + a.verdade.filter(Boolean).length, 0), testes: [] };
  // como era antes: molde sem harmônicos (o baixo antigo, pela energia, era ainda pior no banco de testes local)
  res.antes = avaliar({ nHarm: 1, baixo: 0, tetrade: 0.04 }, { porJogador: true });
  res.antes_troca_1_2 = avaliar({ nHarm: 1, baixo: 0, tetrade: 0.04, troca: 1.2 });
  console.log('antes (sem harmônicos, sem baixo):', JSON.stringify(res.antes));
  // 1ª rodada (out/2026): harm 0.6-0.9, nHarm 4 e 8, baixo 0-0.2, tétrade 0.03 e 0.06 -> o melhor foi harm 0.9, nHarm 4, baixo 0.1, troca 3.
  // 2ª rodada: refino em volta disso (harm 0.8-1, nHarm 3-5, troca 3-8) -> harm 0.9, nHarm 3, baixo 0.1; troca 5 (8 ganha só 0,2 ponto
  // e demora mais para trocar). Esse virou o padrão do app. A grade só roda com GRADE=1; sem isso, mede só o padrão do app.
  if (process.env.GRADE === '1') for (const harm of [0.8, 0.9, 1.0]) for (const nHarm of [3, 4, 5]) for (const baixo of [0.05, 0.1]) for (const tetrade of [0.03]) {
    const r = avaliar({ harm, nHarm, baixo, tetrade, troca: 3, tom: 0.6 });
    res.testes.push(r);
    console.log(JSON.stringify(r));
  }
  const nota = r => r.final.maior_menor + 0.5 * r.final.exato;
  res.testes.sort((a, b) => nota(b) - nota(a));
  // os 3 melhores: troca e tom
  res.ajuste_fino = [];
  for (const base of res.testes.slice(0, 3)) for (const troca of [3, 4, 5, 6, 8]) for (const tom of [0.6, 1]) res.ajuste_fino.push(avaliar({ ...base.ajuste, troca, tom }));
  res.ajuste_fino.sort((a, b) => nota(b) - nota(a));
  if (res.ajuste_fino.length) res.melhor = avaliar(res.ajuste_fino[0].ajuste, { porJogador: true, confusao: true });
  res.padrao_do_app = avaliar({}, { porJogador: true, confusao: true });
  if (res.melhor) console.log('MELHOR:', JSON.stringify(res.melhor));
  console.log('PADRÃO DO APP:', JSON.stringify(res.padrao_do_app));
  fs.mkdirSync(SAIDA, { recursive: true });
  fs.writeFileSync(path.join(SAIDA, 'descobrir.json'), JSON.stringify(res, null, 1));
  console.log('FIM');
})();
