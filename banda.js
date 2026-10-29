/* =========================================================
   TOCA AÍ 2 — banda.js
   A banda que toca junto com você: percussão, baixo e teclado
   (piano, ou sanfona no baião). Tudo gravado de instrumentos de
   verdade (pasta sons/banda, ver sons/CREDITOS.txt).

   COMO FUNCIONA
   • Cada ritmo (pop, rock, baião, samba, pagode, bossa, samba-rock)
     é uma "receita" escrita em semicolcheias: um compasso de 4 tempos
     tem 16 passos (4 por tempo).
   • A percussão repete a receita. O baixo e o teclado seguem a mesma
     receita, mas com as notas do acorde da vez: R = fundamental,
     5 = quinta, 8 = oitava, A = nota de aproximação (meio tom antes
     do próximo acorde, como os baixistas fazem).
   • O agendador funciona como o metrônomo: a cada quadro olha um
     pouco à frente e marca no relógio de áudio os sons que vão tocar.
   ========================================================= */
'use strict';

const BANDA_PASTA = 'sons/banda';
const BANDA_PERC = ['bumbo', 'surdo', 'surdo-abafado', 'zabumba', 'tanta', 'cajon-tapa', 'cajon-leve', 'caixa', 'aro', 'chimbal', 'chimbal-aberto',
  'shaker-ida', 'shaker-volta', 'ganza', 'platinela', 'triangulo', 'triangulo-preso', 'agogo-agudo', 'agogo-grave', 'claves', 'bacalhau', 'tamborim',
  'palmas', 'pandeiro-grave', 'pandeiro-tapa', 'pandeiro-ponta'];
const BANDA_NOTAS = {
  baixo: [31, 34, 37, 40, 43, 46, 49, 52],
  piano: [55, 60, 67, 72, 79],
  sanfona: [55, 58, 61, 64, 67, 70, 73]
};

/* ---------- As receitas de cada ritmo ----------
   perc:    [som, passos, força, (ciclo em passos, se não for 1 compasso), (taxa: afinação do som)]
   baixo:   [passo, grau, duração em passos]
   teclado: [passo, duração em passos, força] */
const ESTILOS = {
  pop: {
    nome: 'Pop acústico', passos: 16, instrumento: 'piano',
    perc: [['bumbo', [0, 6, 8], 0.9], ['cajon-tapa', [4, 12], 0.75], ['cajon-leve', [3, 14], 0.5],
      ['shaker-ida', [0, 4, 8, 12], 0.45], ['shaker-volta', [2, 6, 10, 14], 0.55], ['platinela', [4, 12], 0.3]],
    baixo: [[0, 'R', 6], [6, 'R', 2], [8, '5', 4], [12, 'R', 2], [14, 'A', 2]],
    teclado: [[0, 8, 0.5], [8, 8, 0.42]]
  },
  rock: {
    nome: 'Rock', passos: 16, instrumento: null,
    perc: [['bumbo', [0, 8, 10], 0.95], ['caixa', [4, 12], 0.8], ['chimbal', [0, 2, 4, 6, 8, 10, 12, 14], 0.5]],
    baixo: [[0, 'R', 2], [2, 'R', 2], [4, 'R', 2], [6, 'R', 2], [8, 'R', 2], [10, 'R', 2], [12, 'R', 2], [14, 'A', 2]],
    teclado: []
  },
  balada: {
    nome: 'Balada', passos: 16, instrumento: 'piano',
    perc: [['bumbo', [0, 10], 0.7], ['aro', [4, 12], 0.6], ['shaker-ida', [0, 4, 8, 12], 0.3], ['shaker-volta', [2, 6, 10, 14], 0.35]],
    baixo: [[0, 'R', 8], [8, '5', 6], [14, 'A', 2]],
    teclado: [[0, 16, 0.45]]
  },
  baiao: {
    nome: 'Baião', passos: 8, instrumento: 'sanfona',
    perc: [['zabumba', [0, 3], 0.9], ['surdo-abafado', [4], 0.55], ['bacalhau', [2, 6], 0.5],
      ['triangulo-preso', [0, 1, 3, 4, 5, 7], 0.42], ['triangulo', [2, 6], 0.5]],
    baixo: [[0, 'R', 3], [3, '5', 1], [4, 'R', 4]],
    teclado: [[0, 2, 0.35], [2, 2, 0.6], [6, 2, 0.6]]
  },
  samba: {
    nome: 'Samba', passos: 8, instrumento: 'piano', ginga: 0.035,
    perc: [['surdo-abafado', [0], 0.6], ['surdo', [4], 0.9],
      ['pandeiro-grave', [0, 4], 0.6], ['pandeiro-ponta', [1, 2, 5, 6], 0.45], ['pandeiro-tapa', [3, 7], 0.6],
      ['tamborim', [0, 2, 5, 7, 9, 11, 13, 14], 0.5, 16, 1.5]],
    baixo: [[0, 'R', 3], [3, '5', 1], [4, 'R', 3], [7, 'A', 1]],
    teclado: [[2, 2, 0.4], [6, 2, 0.4]]
  },
  pagode: {
    nome: 'Pagode', passos: 8, instrumento: 'piano', ginga: 0.03,
    perc: [['surdo-abafado', [0], 0.55], ['surdo', [4], 0.85], ['tanta', [0, 3, 4, 7], 0.6, 8, 0.85],
      ['pandeiro-grave', [0, 4], 0.55], ['pandeiro-ponta', [1, 2, 5, 6], 0.45], ['pandeiro-tapa', [3, 7], 0.55]],
    baixo: [[0, 'R', 3], [3, '5', 1], [4, 'R', 3], [7, 'A', 1]],
    teclado: [[0, 8, 0.38]]
  },
  bossa: {
    nome: 'Bossa nova', passos: 16, instrumento: 'piano',
    perc: [['aro', [0, 3, 6, 10, 13, 18, 22, 25, 28], 0.55, 32], ['bumbo', [0, 6, 8, 14], 0.45],
      ['shaker-ida', [0, 4, 8, 12], 0.25], ['shaker-volta', [2, 6, 10, 14], 0.3]],
    baixo: [[0, 'R', 6], [6, '5', 2], [8, 'R', 6], [14, '5', 2]],
    teclado: [[0, 16, 0.38]]
  },
  sambarock: {
    nome: 'Samba-rock', passos: 16, instrumento: 'piano',
    perc: [['bumbo', [0, 3, 8, 11], 0.9], ['caixa', [4, 12], 0.6], ['palmas', [4, 12], 0.45],
      ['chimbal', [0, 2, 4, 6, 8, 10, 12, 14], 0.42], ['agogo-agudo', [2, 10], 0.32], ['agogo-grave', [6, 14], 0.32]],
    baixo: [[0, 'R', 3], [3, 'R', 3], [6, '5', 2], [8, 'R', 3], [11, '8', 3], [14, 'A', 2]],
    teclado: [[3, 2, 0.42], [6, 2, 0.36], [11, 2, 0.42], [14, 2, 0.36]]
  }
};
// Ritmo da mão direita (data.js) -> estilo da banda
const ESTILO_DO_PADRAO = { quatro: 'rock', baixocima: 'pop', pop: 'pop', dedilhado: 'balada', baiao: 'baiao', samba: 'samba', pagode: 'pagode', bossa: 'bossa', sambarock: 'sambarock' };
function estiloDaMusica(m) { return ESTILO_DO_PADRAO[m && m.padrao] || 'pop'; }

/* ---------- Mixer ----------
   Cada parte tem o seu volume (0 a 1). As 3 opções de "Tocar junto" são
   só combinações prontas desses volumes. */
const MIX_PADRAO = { violao: 0.85, batida: 0.8, baixo: 0.85, teclado: 0.6, gravacao: 1 };
const JUNTO = {
  batida: { nome: 'Violão e batida', desc: 'O violão do app e a percussão', partes: ['violao', 'batida'] },
  banda: { nome: 'Violão, batida e banda', desc: 'Com baixo e piano (sanfona no baião)', partes: ['violao', 'batida', 'baixo', 'teclado'] },
  tudo: { nome: 'Tudo: voz e instrumentos', desc: 'A gravação original (YouTube ou um MP3 seu)', partes: ['gravacao'] }
};

const Banda = {
  sons: new Map(), carregando: null,

  // Carrega os sons uma vez só (na primeira vez que a banda toca)
  carregar() {
    if (this.carregando) return this.carregando;
    Som.init();
    const ctx = Som.ctx;
    const um = (nome, arquivo) => fetch(`${BANDA_PASTA}/${arquivo}.mp3`)
      .then(r => (r.ok ? r.arrayBuffer() : Promise.reject(r.status)))
      .then(b => new Promise((ok, erro) => ctx.decodeAudioData(b, ok, erro)))
      .then(buf => {
        // onde o som começa de verdade (o MP3 tem um silêncio curtinho no início)
        const d = buf.getChannelData(0);
        let pico = 0; for (let i = 0; i < Math.min(d.length, 6000); i++) pico = Math.max(pico, Math.abs(d[i]));
        let ini = 0; while (ini < d.length && Math.abs(d[ini]) < pico * 0.05) ini++;
        this.sons.set(nome, { buf, ini: Math.max(0, ini - 24) / buf.sampleRate });
      })
      .catch(() => {});
    const lista = [...BANDA_PERC.map(n => um(n, n))];
    for (const [inst, notas] of Object.entries(BANDA_NOTAS)) for (const m of notas) lista.push(um(`${inst}-${m}`, `${inst}-${m}`));
    this.carregando = Promise.all(lista);
    return this.carregando;
  },
  get pronta() { return this.sons.size > 0; },

  // Um som de percussão. taxa muda a afinação (1.5 = mais agudo)
  bater(nome, t, forca = 0.7, destino = Som.trilha('batida'), taxa = 1) {
    const s = this.sons.get(nome);
    if (!s || !Som.ctx) return;
    const c = Som.ctx, f = c.createBufferSource(), g = c.createGain();
    f.buffer = s.buf; f.playbackRate.value = taxa * (1 + (Math.random() - 0.5) * 0.01);
    g.gain.value = forca * (0.9 + Math.random() * 0.2);
    f.connect(g).connect(destino);
    f.start(Math.max(t, c.currentTime), s.ini);
    Som.fontes.push(f);
  },

  // Uma nota de baixo, piano ou sanfona, com começo e fim
  nota(inst, midi, t, dur, forca = 0.6, destino) {
    const notas = BANDA_NOTAS[inst];
    let perto = notas[0];
    for (const n of notas) if (Math.abs(n - midi) < Math.abs(perto - midi)) perto = n;
    const s = this.sons.get(`${inst}-${perto}`);
    if (!s || !Som.ctx) return;
    const c = Som.ctx, f = c.createBufferSource(), g = c.createGain();
    f.buffer = s.buf; f.playbackRate.value = Math.pow(2, (midi - perto) / 12);
    const t0 = Math.max(t, c.currentTime), solta = inst === 'piano' ? 0.18 : inst === 'baixo' ? 0.06 : 0.09;
    g.gain.setValueAtTime(forca, t0);
    g.gain.setValueAtTime(forca, t0 + Math.max(0.03, dur));
    g.gain.exponentialRampToValueAtTime(0.0008, t0 + Math.max(0.03, dur) + solta);
    f.connect(g).connect(destino || Som.trilha(inst === 'baixo' ? 'baixo' : 'teclado'));
    f.start(t0, s.ini);
    f.stop(t0 + dur + solta + 0.05);
    Som.fontes.push(f);
  }
};

/* ---------- Harmonia ---------- */
// Notas (classes de altura 0-11) de um acorde, a partir do desenho no violão
function notasDoAcordeBanda(nome) {
  const pcs = [...new Set(notasDoAcorde(nome, 0).map(n => n % 12))];
  return pcs;
}
function graus(nome) {
  const p = partesAcorde(nome);
  if (!p) return null;
  const raiz = p.pc, baixo = p.baixo ? RAIZ_PC[p.baixo] : raiz;
  const diminuta = /°|b5|dim/.test(p.qual);
  return { raiz, baixo, quinta: (raiz + (diminuta ? 6 : 7)) % 12 };
}
// Nota grave entre Lá 1 (33) e Sol# 2 (44)
const grave = pc => 33 + ((pc - 9 + 12) % 12);
// Teclado: notas do acorde fechadas numa oitava (Lá 3 a Sol# 4 no piano; uma oitava acima na sanfona)
function voicing(nome, inst, desloc) {
  let pcs = notasDoAcordeBanda(nome).map(pc => (pc + desloc) % 12);
  const g = graus(nome);
  if (pcs.length > 4 && g) pcs = pcs.filter(pc => pc !== (g.raiz + desloc) % 12);          // o baixo já toca a fundamental
  if (pcs.length > 4 && g) pcs = pcs.filter(pc => pc !== (g.quinta + desloc) % 12);
  const base = inst === 'sanfona' ? 60 : 57;
  return pcs.map(pc => base + ((pc - base % 12 + 12) % 12)).sort((a, b) => a - b);
}

/* ---------- O acompanhamento de uma música ----------
   trechos: [{ acorde, inicio, tempos }] (em tempos), acordes como você toca (desenhos)
   desloc: quantos semitons somar para soar igual ao seu violão (o capotraste)
   tempoDe(beat): em que segundo do relógio de áudio cai aquele tempo */
class Acompanhamento {
  constructor({ trechos, estilo = 'pop', desloc = 0, partes = ['batida', 'baixo', 'teclado'] }) {
    this.trechos = trechos;
    this.est = ESTILOS[estilo] || ESTILOS.pop;
    this.desloc = desloc;
    this.partes = new Set(partes);
    this.total = trechos.length ? trechos.at(-1).inicio + trechos.at(-1).tempos : 0;
    this.passo = 0;                                   // próximo passo (semicolcheia) a agendar
  }
  irPara(beat) { this.passo = Math.max(0, Math.ceil(beat * 4 - 1e-6)); }
  trechoEm(beat) {
    let k = 0;
    while (k < this.trechos.length - 1 && this.trechos[k + 1].inicio <= beat + 1e-6) k++;
    return k;
  }
  // começa um acorde novo neste passo?
  mudaEm(beat) { return this.trechos.some(t => Math.abs(t.inicio - beat) < 1e-6); }
  proximaMudanca(beat) { const t = this.trechos.find(x => x.inicio > beat + 1e-6); return t ? t.inicio : this.total; }

  agendar(ateBeat, tempoDe) {
    const e = this.est, porTempo = 4;
    while (this.passo / porTempo < Math.min(ateBeat, this.total)) {
      const s = this.passo++, beat = s / porTempo, pos = s % e.passos;
      const k = this.trechoEm(beat), tr = this.trechos[k];
      const ginga = e.ginga && s % 2 ? e.ginga : 0;           // samba: as semicolcheias "fracas" atrasam um tiquinho
      const t = tempoDe(beat + ginga);
      const seg = tempoDe(beat + 1) - tempoDe(beat);           // duração de 1 tempo agora
      if (this.partes.has('batida')) {
        for (const [som, passos, forca, ciclo, taxa] of e.perc) {
          const p = ciclo ? s % ciclo : pos;
          if (passos.includes(p)) Banda.bater(som, t + (Math.random() - 0.5) * 0.006, forca * (p === 0 ? 1.08 : 1), Som.trilha('batida'), taxa || 1);
        }
      }
      if (!tr || !tr.acorde) continue;
      const muda = this.mudaEm(beat);
      const fimAcorde = this.proximaMudanca(beat);
      // Baixo: segue a receita; se o acorde muda num passo sem nota, toca a fundamental ali
      if (this.partes.has('baixo')) {
        let ev = e.baixo.find(b => b[0] === pos);
        if (!ev && muda) { const prox = e.baixo.find(b => b[0] > pos); ev = [pos, 'R', prox ? prox[0] - pos : e.passos - pos]; }
        if (ev) {
          const g = graus(tr.acorde);
          if (g) {
            let midi;
            const raiz = grave((g.baixo + this.desloc) % 12);
            if (ev[1] === 'R') midi = raiz;
            else if (ev[1] === '5') { midi = grave((g.quinta + this.desloc) % 12); if (midi < raiz) midi += 12; if (midi > 50) midi -= 12; }
            else if (ev[1] === '8') midi = raiz + 12 > 52 ? raiz : raiz + 12;
            else {                                            // A: meio tom antes do próximo acorde
              const prox = this.trechos[k + 1];
              const gp = prox && prox.inicio <= beat + ev[2] / porTempo + 1e-6 ? graus(prox.acorde) : null;
              if (gp && gp.baixo !== g.baixo) { const alvo = grave((gp.baixo + this.desloc) % 12); midi = alvo + (alvo > raiz ? -1 : 1); }
              else midi = grave((g.quinta + this.desloc) % 12);
            }
            const durBeats = Math.min(ev[2] / porTempo, fimAcorde - beat);
            Banda.nota('baixo', midi, t, Math.max(0.08, durBeats * seg * 0.92), 0.85);
          }
        }
      }
      // Teclado: acordes nos passos da receita (e sempre que o acorde muda)
      const inst = e.instrumento;
      if (this.partes.has('teclado') && inst && e.teclado.length) {
        let ev = e.teclado.find(x => x[0] === pos);
        if (!ev && muda) { const prox = e.teclado.find(x => x[0] > pos); ev = [pos, prox ? prox[0] - pos : e.passos - pos, 0.45]; }
        if (ev) {
          const durBeats = Math.min(ev[1] / porTempo, fimAcorde - beat);
          const notas = voicing(tr.acorde, inst, this.desloc);
          notas.forEach((n, i) => Banda.nota(inst, n, t + i * 0.004, Math.max(0.1, durBeats * seg * 0.95), ev[2] * (inst === 'sanfona' ? 0.55 : 0.6) / Math.sqrt(notas.length / 3)));
        }
      }
    }
  }
}
