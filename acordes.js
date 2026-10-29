/* =========================================================
   TOCA AÍ — acordes.js
   1. Acordes por nome: acha o desenho de QUALQUER acorde
      (inclusive os que não estão no data.js, gerando pestana).
   2. Acordes fáceis: troca cada acorde pela forma mais fácil.
   3. Músicas: transforma as seções em uma linha do tempo.
   4. Notas de um acorde (para o microfone saber o que esperar).
   ========================================================= */
'use strict';

/* ===== 1. Acordes por nome ===== */
const RAIZ_PC = { C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11 };
const NOMES_PC = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const ENARMONICO = { 'C#': 'Db', Db: 'C#', 'D#': 'Eb', Eb: 'D#', 'F#': 'Gb', Gb: 'F#', 'G#': 'Ab', Ab: 'G#', 'A#': 'Bb', Bb: 'A#' };

// Deixa a cifra no padrão do app: Cmaj7 -> C7M, C7/9 -> C7(9), Cdim -> C°
function normalizarAcorde(nome) {
  let s = String(nome || '').trim().replace(/\s+/g, '').replace(/♯/g, '#').replace(/♭/g, 'b');
  s = s.replace(/maj7|M7|7\+|Δ7?/g, '7M').replace(/º|dim/g, '°').replace(/7\/9/g, '7(9)').replace(/m7\/9/g, 'm7(9)');
  // grafias antigas: A7(9)b -> A7(b9), E7(13b) -> E7(b13), G7/5b -> G7(b5), G7/13b -> G7(b13), E9- -> E7(b9)
  s = s.replace(/\((\d+)\)b$/, '(b$1)').replace(/\((\d+)([b#])\)/g, '($2$1)').replace(/\((\d+)-\)/g, '(b$1)')
       .replace(/7\/(5|9|11|13)([b#])$/, '7($2$1)').replace(/^([A-G][#b]?)9-/, '$17(b9)');
  return s;
}
function partesAcorde(nome) {
  // a qualidade pode ter barras dentro de parênteses: D7(4/9)
  const m = normalizarAcorde(nome).match(/^([A-G](?:#|b)?)((?:[^/(]|\([^)]*\))*)(?:\/([A-G](?:#|b)?))?$/);
  return m ? { raiz: m[1], qual: m[2], baixo: m[3] || null, pc: RAIZ_PC[m[1]] } : null;
}

// Extensões viram a versão mais simples que ainda soa parecido.
// Na cifra brasileira "A9" é o Lá com nona (add9): vira Lá maior.
const SIMPLIFICACOES = [
  [/^(7\(9\)|7\(13\)|7\(4\)|7sus4|7\(b9\)|7\(#9\)|7\(#11\)|7\(b13\)|7\(9\/13\)|7\(4\/9\)|13|11)$/, '7'],
  [/^(m7\(9\)|m9|m7\(11\)|m11)$/, 'm7'],
  [/^(7M\(9\)|7M\(13\)|7M\(#11\))$/, '7M'],
  [/^(m7\(b5\)|ø|°7)$/, '°'],
  [/^(m6|m\(9\)|madd9|m7M|m\(7M\)|m6\(9\))$/, 'm'],
  [/^(9|6|6\(9\)|add9|\(9\)|sus2|sus4|4|\+|aug|5|5\(9\))$/, ''],
];
// Moldes de pestana. r = casa da pestana. [casas relativas], [dedos]. null = não toca
const MOLDES = {
  // fundamental na 6ª corda (desenho do E)
  E: { base: 4, formas: {
    '': [[0, 2, 2, 1, 0, 0], [1, 3, 4, 2, 1, 1]], m: [[0, 2, 2, 0, 0, 0], [1, 3, 4, 1, 1, 1]],
    '7': [[0, 2, 0, 1, 0, 0], [1, 3, 1, 2, 1, 1]], m7: [[0, 2, 0, 0, 0, 0], [1, 3, 1, 1, 1, 1]],
    '7M': [[0, null, 1, 1, 0, null], [1, 0, 3, 4, 2, 0]],
    'm7(b5)': [[0, null, 0, 0, -1, null], [2, 0, 3, 4, 1, 0]],
    sus4: [[0, 2, 2, 2, 0, 0], [1, 2, 3, 4, 1, 1]],
    '6': [[0, 2, 2, 1, 2, 0], [1, 2, 3, 1, 4, 1]],
    '7(9)': [[0, 2, 0, 1, 0, 2], [1, 3, 1, 2, 1, 4]],
    '7(13)': [[0, null, 0, 1, 2, null], [1, 0, 2, 3, 4, 0]],
    'm7(9)': [[0, null, 0, 0, 0, 2], [1, 0, 1, 1, 1, 3]],
    '7(b9)': [[0, null, 0, 1, 0, 1], [1, 0, 1, 2, 1, 3]],
    '7(b13)': [[0, null, 0, 1, 1, null], [1, 0, 1, 2, 3, 0]],
    '7(4/9)': [[0, null, 0, 2, 0, 2], [1, 0, 1, 3, 1, 4]],
    '7(4)': [[0, 2, 0, 2, 0, 0], [1, 3, 1, 4, 1, 1]],
    '6(9)': [[0, -1, -1, -1, 0, 0], [2, 1, 1, 1, 3, 4]],
    'm7M': [[0, 2, 1, 0, 0, 0], [1, 4, 2, 1, 1, 1]],
    '+': [[0, null, 2, 1, 1, 0], [1, 0, 4, 2, 3, 1]],
    '7(#11)': [[0, null, 0, 1, -1, null], [2, 0, 3, 4, 1, 0]],
    'm7(11)': [[0, null, 0, 0, -2, null], [2, 0, 3, 4, 1, 0]] } },
  // fundamental na 5ª corda (desenho do A)
  A: { base: 9, formas: {
    '': [[null, 0, 2, 2, 2, 0], [0, 1, 2, 3, 4, 1]], m: [[null, 0, 2, 2, 1, 0], [0, 1, 3, 4, 2, 1]],
    '7': [[null, 0, 2, 0, 2, 0], [0, 1, 3, 1, 4, 1]], m7: [[null, 0, 2, 0, 1, 0], [0, 1, 3, 1, 2, 1]],
    '7M': [[null, 0, 2, 1, 2, 0], [0, 1, 3, 2, 4, 1]],
    '°': [[null, 0, 1, -1, 1, null], [0, 2, 3, 1, 4, 0]],                 // diminuto com sétima (o "°" da cifra)
    'm7(b5)': [[null, 0, 1, 0, 1, null], [0, 1, 3, 2, 4, 0]],
    sus4: [[null, 0, 2, 2, 3, 0], [0, 1, 2, 3, 4, 1]],
    '6': [[null, 0, 2, 2, 2, 2], [0, 1, 3, 3, 3, 3]],
    m6: [[null, 0, 2, 2, 1, 2], [0, 1, 3, 4, 2, 4]],
    '7(13)': [[null, 0, 2, 0, 2, 2], [0, 1, 2, 1, 3, 4]],
    '7(9)': [[null, 0, -1, 0, 0, null], [0, 2, 1, 3, 4, 0]],
    '7M(9)': [[null, 0, -1, 1, 0, null], [0, 2, 1, 4, 3, 0]],
    'm7(9)': [[null, 0, -2, 0, 0, null], [0, 2, 1, 3, 4, 0]],
    '7(b9)': [[null, 0, 2, 3, 2, 3], [0, 1, 2, 4, 3, 4]],
    '7(#9)': [[null, 0, -1, 0, 1, null], [0, 2, 1, 3, 4, 0]],
    '7(#11)': [[null, 0, 1, 0, 2, null], [0, 1, 3, 2, 4, 0]],
    '7(4/9)': [[null, 0, 0, 0, 0, 0], [0, 1, 1, 1, 1, 1]],
    '7(4)': [[null, 0, 2, 0, 3, 0], [0, 1, 3, 1, 4, 1]],
    'm7(11)': [[null, 0, 0, 0, 1, null], [0, 1, 1, 1, 2, 0]],
    '6(9)': [[null, 0, -1, -1, 0, 0], [0, 2, 1, 1, 3, 4]],
    'm7M': [[null, 0, 2, 1, 1, 0], [0, 1, 4, 2, 3, 1]],
    '+': [[null, 0, -1, -2, -2, null], [0, 4, 3, 1, 2, 0]] } },
  // fundamental na 4ª corda (desenho do D)
  D: { base: 2, formas: {
    '°': [[null, null, 0, 1, 0, 1], [0, 0, 1, 3, 2, 4]],
    'm7(b5)': [[null, null, 0, 1, 1, 1], [0, 0, 1, 2, 2, 2]],
    sus4: [[null, null, 0, 2, 3, 3], [0, 0, 0, 1, 2, 3]],
    m6: [[null, null, 0, 2, 0, 1], [0, 0, 0, 2, 0, 1]] } }
};
// Nomes diferentes para o mesmo acorde
const QUAL_ALIAS = { '5+': '+', '(#5)': '+', aug: '+', '#5': '+', '7(#5)': '7(b13)', '7(5+)': '7(b13)', 'm11': 'm7(11)', 'm9': 'm7(9)',
  '6/9': '6(9)', '69': '6(9)', '7(9/4)': '7(4/9)', '9sus4': '7(4/9)', '7sus4(9)': '7(4/9)', '7sus4': '7(4)', '11': '7(4/9)', 'm(7M)': 'm7M', 'm7M(9)': 'm7M', '7(b5)': '7(#11)' };
function gerarForma(pc, qual) {
  let melhor = null;
  for (const molde of Object.values(MOLDES)) {
    const f = molde.formas[qual];
    if (!f) continue;
    let r = (pc - molde.base + 12) % 12;
    if (f[0].some(x => x !== null && x + r < 0)) r += 12;       // o desenho não cabe tão perto da cabeça: uma oitava acima
    if (!melhor || r < melhor.r) melhor = { r, f };
  }
  if (!melhor) return null;
  const { r, f } = melhor;
  const frets = f[0].map(x => x === null ? -1 : x + r);
  // na casa 0 não há pestana: o dedo é o número da casa (formas pequenas)
  if (r === 0) { const dd = dedilhar(frets, 1); return dd && { frets, fingers: dd.fingers, barre: dd.barre }; }
  let fingers = f[1].slice();
  // corda solta no molde que virou casa presa (desenhos do D), ou casa presa que virou corda solta: refaz os dedos
  if (r > 0 && frets.some((x, i) => (x > 0 && !fingers[i]) || (x === 0 && fingers[i]))) {
    const dd = dedilhar(frets);
    if (!dd) return null;
    return { frets, fingers: dd.fingers, barre: dd.barre };
  }
  const umas = fingers.filter(d => d === 1).length;
  return { frets, fingers, barre: umas > 1 && r > 0 && frets.filter(x => x === r).length > 1 ? r : undefined };
}

/* Dedos para um desenho: um dedo por casa, a partir do 1 na casa mais baixa;
   empate na mesma casa: a corda mais grave leva o dedo menor (como no E: 2 e 3).
   Mais de 4 notas presas: pestana com o dedo 1 na casa mais baixa. */
function dedilhar(frets, casaDoDedo1 = null) {
  const notas = frets.map((f, i) => ({ f, i })).filter(x => x.f > 0);
  const fingers = frets.map(() => 0);
  if (!notas.length) return { fingers, barre: undefined };
  const menor = casaDoDedo1 ?? Math.min(...notas.map(x => x.f));     // 1ª posição: dedo 1 na casa 1, dedo 2 na casa 2...
  let resto = notas, barre, dedo = 1;
  const maisBaixa = Math.min(...notas.map(x => x.f));
  const naCasa = notas.filter(x => x.f === maisBaixa);
  const de = Math.min(...naCasa.map(x => x.i)), ate = Math.max(...naCasa.map(x => x.i));
  if (notas.length > 4) {
    if (naCasa.length < 2 || frets.slice(de).some(f => f === 0)) return null;   // pestana não pode passar por corda solta
    barre = maisBaixa; naCasa.forEach(x => { fingers[x.i] = 1; });
    resto = notas.filter(x => x.f !== maisBaixa); dedo = 2;
  } else if (notas.length === 4 && naCasa.length >= 2 && ate === Math.max(...notas.map(x => x.i))
             && frets.slice(de, ate + 1).every(f => f === maisBaixa)) {
    // meia pestana nas cordas de cima (como no F/A: x03211) economiza um dedo
    naCasa.forEach(x => { fingers[x.i] = 1; });
    resto = notas.filter(x => x.f !== maisBaixa); dedo = 2;
  }
  resto.sort((a, b) => a.f - b.f || a.i - b.i);
  if (resto.length + dedo - 1 > 4) return null;
  resto.forEach((x, k) => {
    const sobra = resto.length - k - 1;                      // dedos que ainda faltam depois deste
    dedo = Math.min(4 - sobra, Math.max(dedo, 1 + x.f - menor));
    fingers[x.i] = dedo++;
  });
  return { fingers, barre };
}

/* Acorde com baixo diferente (C/E, G/B, D/F#, Bb/D): põe a nota do baixo numa
   das três cordas mais graves (até a casa 5), abafa as de baixo dela e confere
   se o resto ainda tem as notas que fazem o acorde (a quinta pode faltar). */
const CORDAS_MIDI_AC = [40, 45, 50, 55, 59, 64];
function comBaixo(forma, pcBaixo, pcRaiz) {
  const tocadas = forma.frets.map((x, i) => (x >= 0 ? i : -1)).filter(i => i >= 0);
  if (!tocadas.length) return null;
  const nota = (fr, i) => (CORDAS_MIDI_AC[i] + fr[i]) % 12;
  if (nota(forma.frets, tocadas[0]) === pcBaixo) return { ...forma };          // já está no baixo
  const doAcorde = new Set(tocadas.map(i => nota(forma.frets, i)));
  const essenciais = [...doAcorde].filter(pc => pc !== (pcRaiz + 7) % 12 && pc !== pcBaixo);
  let melhor = null;
  for (const corda of [0, 1, 2]) {
    if (corda > tocadas[0] + 2) break;
    const casa = ((pcBaixo - CORDAS_MIDI_AC[corda]) % 12 + 12) % 12;
    if (casa > 5) continue;
    for (const abafaVizinha of [false, true]) {                 // como no F/G: 3x3211
      const fr = forma.frets.map((x, i) => (i < corda ? -1 : i === corda ? casa : x));
      if (abafaVizinha) { if (corda === 5 || fr[corda + 1] < 0) continue; fr[corda + 1] = -1; }
      const resto = new Set(fr.map((x, i) => (x >= 0 && i > corda ? nota(fr, i) : -1)).filter(x => x >= 0));
      if (!essenciais.every(pc => resto.has(pc))) continue;
      const presas = fr.filter(x => x > 0);
      const vao = presas.length ? Math.max(...presas) - Math.min(...presas) : 0;
      if (vao > 3) continue;
      const dd = dedilhar(fr);
      if (!dd) continue;
      const primeira = fr.findIndex((x, i) => i > corda && x >= 0);
      const meio = fr.slice(corda + 1, primeira).length;          // cordas abafadas no meio (como no D/F#)
      const custo = corda * 0.3 + meio + (casa > 0 ? 0.5 : 0) + Math.max(0, vao - 2) * 0.6;
      if (!melhor || custo < melhor.custo) melhor = { custo, frets: fr, fingers: dd.fingers, barre: dd.barre };
    }
  }
  return melhor && { ...forma, frets: melhor.frets, fingers: melhor.fingers, barre: melhor.barre };
}

const _cacheAcordes = new Map();
// Devolve { id, frets, fingers, barre, aproximado? } ou null
function acordePorNome(nome) {
  if (!nome) return null;
  if (_cacheAcordes.has(nome)) return _cacheAcordes.get(nome);
  const achar = id => CHORDS.find(c => c.id === id);
  let r = achar(nome);
  if (!r) {
    const p = partesAcorde(nome);
    if (p) {
      const raizes = [p.raiz, ENARMONICO[p.raiz]].filter(Boolean);
      const qual = QUAL_ALIAS[p.qual] || p.qual;
      const tentativas = [qual];
      for (const [re, troca] of SIMPLIFICACOES) if (re.test(qual)) { tentativas.push(troca); break; }
      const familia = qual.startsWith('m') && !qual.startsWith('7M') ? 'm' : '';
      if (!tentativas.includes(familia)) tentativas.push(familia);
      for (const q of tentativas) {
        for (const rz of raizes) { const c = achar(rz + q); if (c) { r = { ...c, id: nome, aproximado: q !== qual || p.baixo ? c.id : null }; break; } }
        if (r) break;
        const g = gerarForma(p.pc, q);
        if (g) { r = { ...g, id: nome, aproximado: q !== qual || p.baixo ? p.raiz + q : null, gerado: true }; break; }
      }
      // baixo diferente: tenta colocar a nota do baixo no desenho
      if (r && p.baixo && RAIZ_PC[p.baixo] !== undefined) {
        const b = comBaixo(r, RAIZ_PC[p.baixo], p.pc);
        // se o desenho só era "aproximado" por causa do baixo, agora ele é exato
        if (b) r = { ...b, id: nome, aproximado: r.aproximado && r.aproximado !== p.raiz + p.qual ? r.aproximado : null };
      }
    }
  }
  _cacheAcordes.set(nome, r || null);
  return r || null;
}
const chordById = id => acordePorNome(id);

/* ===== 2. Acordes fáceis =====
   Troca cada acorde pela forma MAIS FÁCIL da mesma família
   (como o "Simplify chords" do Chordify). Custo = dedos usados
   + 3 se tem pestana + 2 se o desenho foi gerado pelo app.
   Ex.: E7(9) -> E7, Bm -> Bm7, F -> F7M (dica clássica de professor:
   o F7M soa parecido e não tem pestana). */
function custoAcorde(a) {
  if (!a) return 99;
  const dedos = new Set(a.frets.map((f, i) => (f > 0 ? a.fingers[i] || 1 : 0)).filter(Boolean)).size;
  return dedos + (a.barre ? 3 : 0) + (a.gerado ? 2 : 0);
}
function simplificar(nome) {
  const p = partesAcorde(nome);
  if (!p) return nome;
  // acorde que já é fácil (desenho aberto, até 3 dedos) fica como está
  const original = acordePorNome(nome);
  if (original && !original.barre && !original.gerado && !original.aproximado && custoAcorde(original) <= 3) return nome;
  const q = p.qual, menor = q.startsWith('m') && !q.startsWith('7M');
  const cands = [nome];
  for (const [re, troca] of SIMPLIFICACOES) if (re.test(q)) cands.push(p.raiz + troca);
  if (p.baixo) cands.push(p.raiz + q);                              // G/B -> G
  if (menor) cands.push(p.raiz + 'm', p.raiz + 'm7');
  else if (/7/.test(q) && !q.startsWith('7M')) cands.push(p.raiz + '7');
  else { cands.push(p.raiz); if (q === '' || q === '9' || q === 'add9') cands.push(p.raiz + '7M'); }
  // desenho aproximado (ex.: G/B mostrado como G): o nome exato do desenho ganha no empate
  let melhor = nome, custo = custoAcorde(original) + (original && original.aproximado ? 0.5 : 0);
  for (const c of cands) {
    const ac = acordePorNome(c);
    const k = custoAcorde(ac) + (ac && ac.aproximado ? 0.5 : 0) + (c.endsWith('7M') && !q.startsWith('7M') ? 1 : 0); // 7M só se ajudar muito
    if (k < custo) { melhor = c; custo = k; }
  }
  return melhor;
}

/* ===== 3. Músicas -> linha do tempo ===== */
// "Am7:2 Bm7:2 Em:4" -> [{acorde:'Am7', tempos:2}, ...]
function lerSequencia(seq, temposPadrao = 4) {
  return String(seq || '').replace(/[|,;]/g, ' ').split(/\s+/).filter(Boolean).map(tok => {
    const i = tok.lastIndexOf(':');
    const a = i > 0 ? tok.slice(0, i) : tok, t = i > 0 ? tok.slice(i + 1) : '';
    return { acorde: normalizarAcorde(a), tempos: Math.max(0.5, +t || temposPadrao) };
  });
}
// Junta as seções (com repetições) em uma lista de trechos com início em tempos
function musicaParaTrechos(musica, indiceSecao = null) {
  const secoes = indiceSecao === null ? musica.secoes : [musica.secoes[indiceSecao]];
  const trechos = [];
  let inicio = 0;
  secoes.forEach(sec => {
    for (let r = 0; r < (sec.repetir || 1); r++) {
      lerSequencia(sec.seq).forEach(x => { trechos.push({ ...x, inicio, secao: sec.nome }); inicio += x.tempos; });
    }
  });
  return trechos;
}
function acordesUnicos(musica) {
  return [...new Set(musica.secoes.flatMap(s => lerSequencia(s.seq).map(x => x.acorde)))];
}
function totalTempos(musica) { const t = musicaParaTrechos(musica); return t.length ? t.at(-1).inicio + t.at(-1).tempos : 0; }
function duracaoMusica(musica, bpm = musica.bpm) { return totalTempos(musica) * 60 / bpm; }
function dificuldade(musica) {
  const acs = [...new Set(acordesUnicos(musica).map(simplificar))].map(acordePorNome);
  const pestanas = acs.filter(a => a && a.barre).length;
  const semForma = acs.filter(a => !a).length;
  if (pestanas + semForma >= 2 || acs.length > 8) return 'Difícil';
  if (pestanas || acs.length > 5) return 'Médio';
  return 'Fácil';
}

// Quais cordas cada golpe atinge (0 = 6ª corda, a mais grossa)
function cordasDoGolpe(acorde, tok) {
  const a = acordePorNome(acorde);
  if (!a) return [];
  const tocadas = [0, 1, 2, 3, 4, 5].filter(i => a.frets[i] >= 0);
  const baixo = tocadas[0];
  const finas = [3, 4, 5].filter(i => a.frets[i] >= 0);
  switch (tok) {
    case 'D': return tocadas;
    case 'U': return tocadas.filter(i => i >= 2);
    case 'B': case 'p': return [baixo];
    case 'F': return finas;
    case 'X': return [baixo, ...finas];
    case 'T': return tocadas;
    case 'i': return [3]; case 'm': return [4]; case 'a': return [5];
  }
  return [];
}
const NOME_GOLPE = {
  D: 'Para baixo', U: 'Para cima', B: 'Polegar no baixo', F: 'Dedos juntos',
  X: 'Polegar e dedos', T: 'Tapa abafado', p: 'Polegar', i: 'Indicador', m: 'Médio', a: 'Anelar'
};
const NOMES_DEDOS = ['', 'indicador', 'médio', 'anelar', 'mindinho'];
const NOMES_CORDAS = ['6ª (Mi grave)', '5ª (Lá)', '4ª (Ré)', '3ª (Sol)', '2ª (Si)', '1ª (Mi agudo)'];
const LETRAS_CORDAS = ['E', 'A', 'D', 'G', 'B', 'e'];

/* ===== 4. Notas de um acorde =====
   Cada corda solta tem uma nota (MIDI 40 = Mi grave). Apertar a casa f
   sobe f semitons. O capotraste sobe todas as cordas junto. */
function notasDoAcorde(nome, capo = 0) {
  const a = acordePorNome(nome);
  if (!a) return [];
  return a.frets.map((f, i) => (f < 0 ? null : MIDI_SOLTAS[i] + f + capo)).filter(n => n !== null);
}

// Nome do acorde que a rede neural conhece (ou um parecido)
function nomeNoModelo(nome) {
  if (typeof IA === 'undefined' || !IA.modelo) return null;
  const cls = IA.modelo.classes;
  if (cls.includes(nome)) return nome;
  const a = acordePorNome(nome);
  if (a && a.aproximado && cls.includes(a.aproximado)) return a.aproximado;
  return null;
}

// Nome por extenso: "Am" -> "Lá menor"
const NOTAS_PT = { C: 'Dó', D: 'Ré', E: 'Mi', F: 'Fá', G: 'Sol', A: 'Lá', B: 'Si' };
function nomeAcorde(id) {
  const m = String(id).match(/^([A-G])(#|b)?(.*)$/);
  if (!m) return id;
  const nome = NOTAS_PT[m[1]] + (m[2] === '#' ? ' sustenido' : m[2] === 'b' ? ' bemol' : '');
  const mapa = { '': ' maior', m: ' menor', '7': ' com sétima', m7: ' menor com sétima', '7M': ' com sétima maior', '°': ' diminuto', 'm7(b5)': ' meio-diminuto' };
  return nome + (mapa[m[3]] ?? ' ' + m[3]);
}
