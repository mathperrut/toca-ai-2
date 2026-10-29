/* =========================================================
   TOCA AÍ 2 — tom.js
   Mudar o TOM da música (como a extensão Transpose ou o "Tom" do
   Cifra Club) e escolher o CAPOTRASTE.

   PARA ENTENDER
   • Meio tom (semitom) = 1 casa do violão. Um tom = 2 casas.
   • Transpor = somar o mesmo número de semitons em TODOS os acordes:
     A, D, E (Lá maior) +2 vira B, E, F# (Si maior). A música é a mesma,
     só fica mais aguda ou mais grave.
   • O capotraste é uma "pestana de metal". Com ele na casa 2, o desenho
     de A soa como B. Por isso dá para tocar num tom difícil usando os
     desenhos fáceis: o app testa as casas 0 a 7 e escolhe a que deixa
     os acordes com menos dedos e sem pestana.
   ========================================================= */
'use strict';

const NOMES_TOM = ['Dó', 'Dó#', 'Ré', 'Mi♭', 'Mi', 'Fá', 'Fá#', 'Sol', 'Lá♭', 'Lá', 'Si♭', 'Si'];
const CIFRA_TOM = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];

// O tipo do acorde que importa para achar o tom: maior (M), menor (m) ou diminuto (d)
function tipoDoAcorde(nome) {
  const p = partesAcorde(nome);
  if (!p) return null;
  const q = p.qual || '';
  const tipo = /°|dim|m7\(b5\)|ø/.test(q) ? 'd' : /^m(?!aj)/.test(q) ? 'm' : 'M';
  return { pc: p.pc, tipo };
}

/* Qual é o tom? Cada tom tem uma "família" de acordes (o campo harmônico).
   Damos pontos para o tom cuja família mais aparece na música (pesando pela
   duração), com bônus quando o 1º e o último acorde são a "casa" do tom. */
const FAMILIA = {
  // maior: I ii iii IV V vi vii°, e o VII♭ (muito usado no rock e na MPB)
  maior: [[0, 'M'], [2, 'm'], [4, 'm'], [5, 'M'], [7, 'M'], [9, 'm'], [11, 'd'], [10, 'M', 0.5]],
  // menor: i ii° III iv V v VI VII, e o IV maior (o "menor dórico" do samba e da bossa)
  menor: [[0, 'm'], [2, 'd'], [3, 'M'], [5, 'm'], [7, 'M'], [7, 'm'], [8, 'M'], [10, 'M'], [5, 'M', 0.7]]
};
function estimarTom(itens) {
  const acs = itens.map(x => ({ ...tipoDoAcorde(x.acorde), peso: x.tempos || 1 })).filter(x => x.tipo);
  if (!acs.length) return null;
  const todos = [];
  for (let pc = 0; pc < 12; pc++) for (const modo of ['maior', 'menor']) {
    const tipoTonica = modo === 'maior' ? 'M' : 'm';
    let pts = 0;
    for (const a of acs) {
      const grau = (a.pc - pc + 12) % 12;
      const f = FAMILIA[modo].find(([g, t]) => g === grau && t === a.tipo);
      if (f) pts += a.peso * (f[2] || 1);
      if (grau === 0 && a.tipo === tipoTonica) pts += a.peso * 0.6;           // o acorde "casa" pesa mais
    }
    const ehTonica = a => a && (a.pc - pc + 12) % 12 === 0 && a.tipo === tipoTonica;
    if (ehTonica(acs[0])) pts += 2;
    if (ehTonica(acs.at(-1))) pts += 4;
    todos.push({ pc, modo, pts });
  }
  todos.sort((a, b) => b.pts - a.pts);
  const [melhor, segundo] = todos;
  // "seguro": o 1º colocado ganha com folga (senão o app não arrisca dizer o nome do tom)
  const total = acs.reduce((t, a) => t + a.peso, 0);
  melhor.seguro = melhor.pts - segundo.pts >= Math.max(1.5, total * 0.08);
  return melhor;
}
function nomeDoTom(t, desloc = 0) {
  if (!t || !t.seguro) return '';
  const pc = ((t.pc + desloc) % 12 + 12) % 12;
  return `${NOMES_TOM[pc]} ${t.modo} (${CIFRA_TOM[pc]}${t.modo === 'menor' ? 'm' : ''})`;
}
const BEMOL_MAIOR = new Set([5, 10, 3, 8, 1]), BEMOL_MENOR = new Set([2, 7, 0, 5, 10, 3]);
function usaBemol(t, desloc = 0) {
  if (!t) return false;
  const pc = ((t.pc + desloc) % 12 + 12) % 12;
  return t.modo === 'maior' ? BEMOL_MAIOR.has(pc) : BEMOL_MENOR.has(pc);
}
const PARA_BEMOL = { 'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb' }, PARA_SUSTENIDO = { Db: 'C#', Eb: 'D#', Gb: 'F#', Ab: 'G#', Bb: 'A#' };
function grafar(nome, bemol) {
  const mapa = bemol ? PARA_BEMOL : PARA_SUSTENIDO;
  return nome.replace(/^([A-G](?:#|b)?)|\/([A-G](?:#|b)?)/g, (m, r, b) => { const n = r || b; const novo = mapa[n] || n; return r ? novo : '/' + novo; });
}
function transporCifra(nome, n, bemol) { return n ? grafar(Cifras.transpor(nome, n), bemol) : nome; }

// "1 tom acima", "½ tom abaixo", "1½ tom acima"...
function descreverDesvio(k) {
  if (!k) return 'o tom da gravação';
  const tons = Math.abs(k) / 2, inteiro = Math.floor(tons), meio = tons % 1 ? '½' : '';
  const qtd = inteiro ? `${inteiro}${meio}` : meio;
  return `${qtd} ${tons > 1 ? 'tons' : 'tom'} ${k > 0 ? 'acima' : 'abaixo'} da gravação`;
}

/* O arranjo que você vai tocar.
   k: semitons em relação à GRAVAÇÃO (0 = tom original).
   Sem capotraste, o padrão é tocar os desenhos fáceis sem capo (fica mais grave
   que a gravação, se a música pede capo). Com capotraste, o padrão é o tom original. */
function tomPadrao(m, temCapo = !!S.cfg.temCapo) { return temCapo ? 0 : -(m.capo || 0); }
function tomEscolhido(m, temCapo = !!S.cfg.temCapo) {
  const salvo = S.tons && S.tons[m.id];
  return typeof salvo === 'number' ? salvo : tomPadrao(m, temCapo);
}
function arranjo(m, { k = null, temCapo = !!S.cfg.temCapo } = {}) {
  const capoOrig = m.capo || 0;
  k = Math.max(-6, Math.min(6, k === null ? tomEscolhido(m, temCapo) : k));
  const alvo = capoOrig + k;                       // semitons a somar nos desenhos originais para soar no tom pedido
  const unicos = acordesUnicos(m);
  // tom da gravação, a partir dos acordes que soam (desenhos + capo original)
  const itens = musicaParaTrechos(m).map(t => ({ acorde: Cifras.transpor(t.acorde, capoOrig), tempos: t.tempos }));
  const original = estimarTom(itens);
  const bemol = original ? usaBemol(original, k) : false;
  let capo = 0;
  if (temCapo) {
    const fixo = S.capoFixo && S.capoFixo[m.id];
    if (typeof fixo === 'number') capo = fixo;
    else {
      // testa as casas 0 a 7: soma o "custo" dos desenhos (dedos, pestana) e prefere
      // manter os desenhos da música (os que você já treinou), se forem quase tão fáceis
      let melhor = Infinity;
      for (let c = 0; c <= 7; c++) {
        const custo = unicos.reduce((t, a) => t + custoAcorde(acordePorNome(simplificar(Cifras.transpor(a, alvo - c)))), 0) + c * 0.35 - (alvo - c === 0 ? 1.5 : 0);
        if (custo < melhor - 0.01) { melhor = custo; capo = c; }
      }
    }
  }
  const desloc = alvo - capo;                       // quanto os DESENHOS mudam
  const bemolDesenho = original ? usaBemol(original, k - capo) : false;
  const secoes = desloc ? m.secoes.map(s => ({ ...s, seq: lerSequencia(s.seq).map(x => `${transporCifra(x.acorde, desloc, bemolDesenho)}:${x.tempos}`).join(' ') })) : m.secoes;
  return {
    k, capo, desloc, temCapo, secoes,
    musica: { ...m, secoes, capo },                 // a música já no tom e com o capo escolhidos
    tomOriginal: original, nomeOriginal: nomeDoTom(original), nomeAtual: nomeDoTom(original, k), bemol,
    desvio: descreverDesvio(k)
  };
}
