/* =========================================================
   TOCA AÍ — apostilas.js
   As apostilas: textos curtos que explicam COMO o violão funciona
   e COMO estudar. Cada uma tem:
     • um mini vídeo no começo;
     • seções curtas com desenhos;
     • "Analogia": uma comparação com algo do dia a dia;
     • "Pegadinha": o erro que quase todo iniciante comete;
     • um teste rápido que corrige na hora.
   ========================================================= */
'use strict';

/* ---------- Desenhos das apostilas (SVG) ---------- */
const DESENHOS = {
  // Violão inteiro com as partes
  partes: () => `<svg class="ap-svg" viewBox="0 0 360 520" role="img" aria-label="Partes do violão">
    <g class="pt-violao">
      <rect x="152" y="18" width="56" height="78" rx="10"/>
      ${[0, 1, 2].map(i => `<circle cx="144" cy="${34 + i * 22}" r="6"/><circle cx="216" cy="${34 + i * 22}" r="6"/>`).join('')}
      <rect class="pt-nut" x="160" y="96" width="40" height="5"/>
      <rect x="162" y="101" width="36" height="170"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7].map(k => `<line class="pt-traste" x1="162" x2="198" y1="${118 + k * 20}" y2="${118 + k * 20}"/>`).join('')}
      <path d="M180 262 C 108 262 92 300 104 336 C 112 360 84 372 84 418 C 84 476 132 506 180 506 C 228 506 276 476 276 418 C 276 372 248 360 256 336 C 268 300 252 262 180 262 Z"/>
      <circle class="pt-boca" cx="180" cy="352" r="27"/>
      <circle class="pt-roseta" cx="180" cy="352" r="34"/>
      <rect class="pt-cavalete" x="138" y="438" width="84" height="16" rx="4"/>
      <line class="pt-rastilho" x1="150" x2="210" y1="444" y2="444"/>
      ${[0, 1, 2, 3, 4, 5].map(i => `<line class="pt-corda" x1="${166 + i * 5.6}" x2="${166 + i * 5.6}" y1="98" y2="446"/>`).join('')}
    </g>
    <g class="pt-rot">
      <text x="236" y="30">Tarraxas</text><path d="M232 26h-10"/>
      <text x="22" y="62">Cabeça (mão)</text><path d="M104 58h40"/>
      <text x="216" y="100">Pestana</text><path d="M212 98h-10"/>
      <text x="216" y="160">Trastes</text><path d="M212 157h-12"/>
      <text x="22" y="192">Braço</text><path d="M66 188h94"/>
      <text x="22" y="214" class="pt-mini">o espaço entre</text><text x="22" y="230" class="pt-mini">2 trastes é a casa</text>
      <text x="282" y="352">Boca</text><path d="M278 348h-62"/>
      <text x="282" y="300">Tampo</text><path d="M278 296h-40"/>
      <text x="282" y="448">Cavalete</text><path d="M278 444h-54"/>
      <text x="16" y="452">Rastilho</text><path d="M78 448h70"/>
      <text x="16" y="404">Caixa</text><path d="M58 400h28"/>
    </g></svg>`,

  // As 6 cordas com número, letra e nome
  cordas: () => `<div class="ap-som"><svg class="ap-svg" viewBox="0 0 320 170" role="group" aria-label="As seis cordas: toque numa corda para ouvir">
    ${[0, 1, 2, 3, 4, 5].map(i => `<g class="tocavel" data-i="${i}" data-nota="${i}:0" role="button" tabindex="0" aria-label="${ORD[i]} corda solta, ${NOME_CORDA[i]}">
      <rect x="${30 + i * 52 - 24}" y="0" width="48" height="170" fill="transparent"/>
      <line class="dg-corda" style="stroke-width:${4.2 - i * 0.6}" x1="${30 + i * 52}" x2="${30 + i * 52}" y1="8" y2="104"/>
      <text class="ap-t-forte" x="${30 + i * 52}" y="126" text-anchor="middle">${ORD[i]}</text>
      <text class="ap-t" x="${30 + i * 52}" y="146" text-anchor="middle">${'EADGBE'[i]}</text>
      <text class="ap-t-fraco" x="${30 + i * 52}" y="164" text-anchor="middle">${NOME_CORDA[i].split(' ')[0]}</text></g>`).join('')}
  </svg><button class="btn mini" data-seq="0:0 1:0 2:0 3:0 4:0 5:0">${IC.som} Ouvir as 6 cordas</button></div>`,

  // Casas e trastes
  casas: () => `<div class="ap-som"><svg class="ap-svg" viewBox="0 0 320 170" role="img" aria-label="Casas e trastes">
    <text class="ap-t-fraco" x="160" y="14" text-anchor="middle">cabeça do violão</text>
    <line class="dg-pestana" x1="40" x2="260" y1="26" y2="26"/>
    ${[1, 2, 3, 4].map(k => `<line class="dg-traste" x1="40" x2="260" y1="${26 + k * 32}" y2="${26 + k * 32}"/><text class="ap-t" x="270" y="${26 + k * 32 - 12}">casa ${k}</text>`).join('')}
    ${[0, 1, 2, 3, 4, 5].map(i => `<line class="dg-corda" x1="${40 + i * 44}" x2="${40 + i * 44}" y1="26" y2="154"/>`).join('')}
    <g class="tocavel" data-nota="4:1" role="button" tabindex="0" aria-label="Ouvir: 2ª corda, casa 1 (Dó)"><circle class="dg-dedo d1" cx="216" cy="44" r="10"/><text class="dg-num" x="216" y="48.5" text-anchor="middle">1</text></g>
    <text class="ap-t-fraco" x="34" y="62" text-anchor="end">traste</text>
  </svg><div class="linha-botoes"><button class="btn mini" data-nota="4:0">${IC.som} Corda solta (Si)</button><button class="btn mini" data-nota="4:1">${IC.som} Casa 1 (Dó)</button></div></div>`,

  // Dedos numerados
  dedos: () => `<div class="ap-dedos">${[1, 2, 3, 4].map(d => `<span><i class="bola d${d}">${d}</i>${NOMES_DEDOS[d]}</span>`).join('')}<span><i class="bola polegar">P</i>polegar (atrás do braço)</span></div>`,

  // Como ler o diagrama
  diagrama: () => `<div class="ap-diag">${diagramaAcorde('Am7', { tam: 'lg' })}<ul>
    <li><span class="ap-o"></span> corda solta: toca sem apertar</li>
    <li><span class="ap-x">×</span> não toca essa corda</li>
    <li><i class="bola d1">1</i> aperte aqui com o dedo 1</li>
    <li><b>E A D G B E</b> embaixo: o nome de cada corda</li></ul><button class="btn mini" data-ouvir="Am7">${IC.som} Ouvir o Am7</button></div>`,

  // Tablatura
  tab: () => {
    const notas = [[2, 0], [2, 0], [1, 3], [1, 3], [0, 0], [0, 0], [1, 3]];   // linha 0 = 1ª corda (e)
    return `<div class="ap-som"><svg class="ap-svg" viewBox="0 0 340 150" role="img" aria-label="Tablatura do começo de Brilha, Brilha Estrelinha">
    ${['e', 'B', 'G', 'D', 'A', 'E'].map((l, i) => `<text class="ap-t-forte" x="8" y="${24 + i * 20}">${l}</text><line class="dg-traste" x1="26" x2="330" y1="${20 + i * 20}" y2="${20 + i * 20}"/>`).join('')}
    ${notas.map(([c, f], k) => { const x = 60 + k * 40; return `<g data-i="${k}"><rect class="ap-tab-fundo" x="${x - 9}" y="${20 + c * 20 - 9}" width="18" height="18" rx="4"/><text class="ap-tab-num" x="${x}" y="${20 + c * 20 + 5}" text-anchor="middle">${f}</text></g>`; }).join('')}
    <text class="ap-t-fraco" x="178" y="146" text-anchor="middle">leia da esquerda para a direita</text>
  </svg><button class="btn mini" data-seq="${notas.map(([c, f]) => `${5 - c}:${f}`).join(' ')}">${IC.som} Ouvir a tablatura</button></div>`;
  },

  // Notas na 6ª e na 5ª corda
  notasBraco: () => {
    const casas = 12, x0 = 30, dx = 24, notas6 = ['E', 'F', '', 'G', '', 'A', '', 'B', 'C', '', 'D', '', 'E'], notas5 = ['A', '', 'B', 'C', '', 'D', '', 'E', 'F', '', 'G', '', 'A'];
    let s = `<div class="ap-som"><svg class="ap-svg" viewBox="0 0 340 120" role="group" aria-label="Notas na 6ª e 5ª corda: toque numa nota para ouvir">`;
    for (let k = 0; k <= casas; k++) s += `<line class="${k === 0 ? 'dg-pestana' : 'dg-traste'}" x1="${x0 + k * dx}" x2="${x0 + k * dx}" y1="30" y2="74"/>`;
    s += `<line class="dg-corda" x1="${x0}" x2="${x0 + casas * dx}" y1="40" y2="40"/><line class="dg-corda" style="stroke-width:2.6" x1="${x0}" x2="${x0 + casas * dx}" y1="64" y2="64"/>`;
    s += `<text class="ap-t-forte" x="8" y="44">5ª</text><text class="ap-t-forte" x="8" y="68">6ª</text>`;
    const pos = k => (k === 0 ? x0 - 12 : x0 + (k - 0.5) * dx);
    const bola = (n, k, corda, y) => `<g class="tocavel" data-nota="${corda}:${k}" role="button" tabindex="0" aria-label="${n}: ${ORD[corda]} corda, ${k ? 'casa ' + k : 'solta'}"><circle class="ap-nota" cx="${pos(k)}" cy="${y}" r="9"/><text class="ap-nota-t" x="${pos(k)}" y="${y + 4}" text-anchor="middle">${n}</text></g>`;
    notas5.forEach((n, k) => { if (n) s += bola(n, k, 1, 40); });
    notas6.forEach((n, k) => { if (n) s += bola(n, k, 0, 64); });
    [3, 5, 7, 9, 12].forEach(k => { s += `<text class="ap-t-fraco" x="${x0 + (k - 0.5) * dx}" y="96" text-anchor="middle">${k}</text>`; });
    return s + `<text class="ap-t-fraco" x="170" y="114" text-anchor="middle">casas com marcação no braço</text></svg><p class="sub">Toque numa nota para ouvir.</p></div>`;
  },

  // Maior x menor: E e Em lado a lado
  maiorMenor: () => `<div class="ap-par">${['E', 'Em'].map(a => `<figure>${diagramaAcorde(a, { tam: 'md' })}<figcaption><b>${a}</b> ${a === 'E' ? 'maior: som alegre' : 'menor: som triste'}<button class="btn mini" data-ouvir="${a}">${IC.som} Ouvir</button></figcaption></figure>`).join('')}</div>`,

  // Campo harmônico de Sol
  campo: () => `<div class="ap-som"><div class="ap-campo">${['G', 'Am', 'Bm', 'C', 'D', 'Em'].map((a, i) => `<button type="button" data-i="${i}" data-ouvir="${a}" aria-label="Ouvir ${a}"><b>${a}</b><small>${['I', 'ii', 'iii', 'IV', 'V', 'vi'][i]}</small></button>`).join('')}</div><button class="btn mini" data-acordes="G Am Bm C D Em">${IC.som} Ouvir a família</button></div>`,

  // Batidas
  batida: () => `<div class="ap-som"><div class="ap-batida">${['1', 'e', '2', 'e', '3', 'e', '4', 'e'].map((n, k) => `<span data-i="${k}" class="${k % 2 ? 'cima' : ''}"><b>${k % 2 ? '↑' : '↓'}</b><small>${n}</small></span>`).join('')}</div><button class="btn mini" data-golpes="Em:D U D U D U D U">${IC.som} Ouvir a batida (com Em)</button></div>`,

  // Ritmos com botão de ouvir
  ritmos: () => `<div class="ap-ritmos">${['samba', 'pagode', 'bossa', 'baiao', 'sambarock'].map(id => { const p = patternById(id); return `<div class="ap-ritmo"><b>${esc(p.genero)}</b>${batidaHTML(p)}<button class="btn mini" data-ritmo="${id}">${IC.som} Ouvir</button></div>`; }).join('')}</div>`,

  // Rotina de estudo
  rotina: () => `<ol class="ap-rotina">
    <li><b>1 min</b><span>Afinar</span></li><li><b>3 min</b><span>Acorde novo, dedo a dedo</span></li>
    <li><b>3 min</b><span>1 minuto de trocas</span></li><li><b>3 min</b><span>Uma música no jogo</span></li></ol>`
};

/* ---------- Desenhos dos níveis Intermediário e Avançado ----------
   Posições "corda:casa" (corda 0 = 6ª ... 5 = 1ª), na 1ª posição do braço. */
const POS_NOTA = { C3: '1:3', D3: '2:0', E3: '2:2', F3: '2:3', G3: '3:0', A3: '3:2', B3: '4:0', C4: '4:1', D4: '4:3', E4: '5:0', F4: '5:1', G4: '5:3' };
const umRitmo = id => { const p = patternById(id); return `<div class="ap-ritmos"><div class="ap-ritmo"><b>${esc(p.genero)}</b>${batidaHTML(p)}<button class="btn mini" data-ritmo="${id}">${IC.som} Ouvir</button></div></div>`; };
const figuras = (lista, tam = 'sm') => `<div class="ap-par ${lista.length > 2 ? 'muitos' : ''}" style="--n:${lista.length === 3 ? 3 : 2}">${lista.map(([a, t]) => `<figure>${diagramaAcorde(a, { tam, rotulos: false })}<figcaption><b>${esc(a)}</b>${t ? ` ${t}` : ''}<button class="btn mini" data-ouvir="${esc(a)}" aria-label="Ouvir ${esc(a)}">${IC.som} Ouvir</button></figcaption></figure>`).join('')}</div>`;
const seqAcordes = (acs, rotulos = []) => `<div class="ap-som"><div class="ap-seq">${acs.map((a, i) => `<button type="button" data-i="${i}" data-ouvir="${esc(a)}"><b>${esc(a)}</b>${rotulos[i] ? `<small>${rotulos[i]}</small>` : ''}</button>`).join('')}</div><button class="btn mini" data-acordes="${acs.join(' ')}">${IC.som} Ouvir a sequência</button></div>`;
// Um trecho de tablatura (cordas 1, 2 e 3) com a técnica escrita: 5h7, 7b9...
const tabTecnica = (corda, texto, rotulo, tecnica) => {
  const linha = 5 - corda;                      // 0 = 1ª corda (em cima), 1 = 2ª, 2 = 3ª
  return `<div class="ap-tec"><svg class="ap-svg" viewBox="0 0 200 70" role="img" aria-label="${esc(rotulo)}: ${esc(texto)} na ${6 - corda}ª corda">
    ${['e', 'B', 'G'].map((l, k) => `<text class="ap-t-fraco" x="6" y="${19 + k * 20}">${l}</text><line class="dg-traste" x1="20" x2="190" y1="${15 + k * 20}" y2="${15 + k * 20}"/>`).join('')}
    <rect class="ap-tab-fundo" x="68" y="${15 + linha * 20 - 9}" width="74" height="18" rx="4"/>
    <text class="ap-tab-num" x="105" y="${15 + linha * 20 + 5}" text-anchor="middle">${esc(texto)}</text>
  </svg><b>${esc(rotulo)}</b><button class="btn mini" data-tecnica="${tecnica}">${IC.som} Ouvir</button></div>`;
};

Object.assign(DESENHOS, {
  // As 7 notas e as 7 letras
  letras: () => `<div class="ap-som"><div class="ap-letras">${[['C', 'Dó'], ['D', 'Ré'], ['E', 'Mi'], ['F', 'Fá'], ['G', 'Sol'], ['A', 'Lá'], ['B', 'Si']].map(([l, n], i) => `<button type="button" data-i="${i}" data-nota="${POS_NOTA[l + '3']}" aria-label="${n}"><b>${l}</b><small>${n}</small></button>`).join('')}</div><button class="btn mini" data-seq="${['C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4'].map(n => POS_NOTA[n]).join(' ')}">${IC.som} Ouvir as 7 notas</button></div>`,

  // Contando as notas a partir do G: 1, 3 e 5 formam o acorde; o 7 entra no G7
  contar: () => {
    const l = [['G', 1, '3:0'], ['A', 2, '3:2'], ['B', 3, '4:0'], ['C', 4, '4:1'], ['D', 5, '4:3'], ['E', 6, '5:0'], ['F', 7, '5:1'], ['G', 8, '5:3']];
    return `<div class="ap-som"><div class="ap-contar">${l.map(([n, k, pos], i) => `<button type="button" class="${[1, 3, 5, 8].includes(k) ? 'base' : k === 7 ? 'sete' : ''}" data-i="${i}" data-nota="${pos}" aria-label="${n}, nota ${k}"><b>${n}</b><small>${k}</small></button>`).join('')}</div>
      <p class="ap-legenda"><span class="base">1, 3 e 5</span> formam o G. <span class="sete">7</span> é a nota que o G7 soma.</p>
      <div class="linha-botoes"><button class="btn mini" data-ouvir="G">${IC.som} G</button><button class="btn mini" data-ouvir="G7">${IC.som} G7</button><button class="btn mini" data-seq="${l.map(x => x[2]).join(' ')}">${IC.som} Contar</button></div></div>`;
  },

  // A família do Dó com sétima, sétima maior e nona
  setimas: () => figuras([['C', 'maior'], ['C7', 'tensão'], ['C7M', 'macio'], ['C9', 'brilho']]),

  // Sustenido: uma casa acima
  sustenido: () => `<div class="ap-som"><div class="ap-letras tres">${[['F', 'Fá', '0:1'], ['F#', 'Fá# = Solb', '0:2'], ['G', 'Sol', '0:3']].map(([n, t, pos], i) => `<button type="button" data-i="${i}" data-nota="${pos}"><b>${n}</b><small>${t}</small><small>casa ${pos.split(':')[1]}</small></button>`).join('')}</div><p class="sub">Na 6ª corda: cada casa é meio tom.</p><button class="btn mini" data-seq="0:1 0:2 0:3">${IC.som} Subir meio tom de cada vez</button></div>`,

  // A barra: o baixo anda
  barra: () => `<div class="ap-bloco">${figuras([['C', 'baixo Dó'], ['G/B', 'baixo Si'], ['Am', 'baixo Lá']])}<div class="ap-som"><button class="btn mini" data-acordes="C G/B Am">${IC.som} Ouvir o baixo descendo</button></div></div>`,

  // Lendo uma cifra parte por parte: F, F#, F#m, F#m7, F#m7/E
  anatomia: () => {
    const partes = [['F', 'Fá', '0:1 1:3 2:3 3:2 4:1 5:1'], ['#', 'sustenido', '0:2 1:4 2:4 3:3 4:2 5:2'], ['m', 'menor', '0:2 1:4 2:4 3:2 4:2 5:2'],
      ['7', 'sétima', '0:2 1:4 2:2 3:2 4:2 5:2'], ['/E', 'baixo Mi', '0:0 1:4 2:2 3:2 4:2 5:2']];
    return `<div class="ap-som"><div class="ap-anatomia">${partes.map(([p, t, notas], i) => `<button type="button" data-i="${i}" data-juntas="${notas}" aria-label="${esc(p)}: ${esc(t)}"><b>${esc(p)}</b><small>${t}</small></button>`).join('')}</div><p class="sub">Toque em cada parte, da esquerda para a direita: o acorde vai sendo montado.</p></div>`;
  },

  // O F com pestana, corda por corda
  pestanaF: () => `<div class="ap-diag">${diagramaAcorde('F', { tam: 'lg' })}<div class="linha-botoes"><button class="btn mini" data-ouvir="F">${IC.som} Ouvir o F</button><button class="btn mini" data-seq="0:1 1:3 2:3 3:2 4:1 5:1">${IC.som} Corda por corda</button></div></div>`,

  // Intervalos a partir do Lá (5ª corda solta)
  intervalos: () => `<div class="ap-bloco"><div class="ap-intervalos">${[[1, '2ª menor'], [2, '2ª maior'], [3, '3ª menor'], [4, '3ª maior'], [5, '4ª justa'], [6, 'trítono'], [7, '5ª justa'], [12, 'oitava']].map(([k, n]) => `<button type="button" class="${[3, 4, 7].includes(k) ? 'forte' : ''}" data-seq="1:0 1:${k}"><b>${k} ${k === 1 ? 'casa' : 'casas'}</b><small>${n}</small></button>`).join('')}</div><p class="sub">Cada botão toca o Lá (5ª corda solta) e depois a nota do intervalo.</p></div>`,

  // As quatro tríades de Dó
  triades: () => `<div class="ap-triades">${[['Maior', 'C E G', '4 + 3', '1:3 2:2 3:0', '1:3 2:2 3:0'], ['Menor', 'C Eb G', '3 + 4', '1:3 2:1 3:0', '1:3 2:1 3:0'],
    ['Diminuta', 'C Eb Gb', '3 + 3', '1:3 2:1 2:4', '1:3 2:4 4:4'], ['Aumentada', 'C E G#', '4 + 4', '1:3 2:2 3:1', '1:3 2:2 3:1']].map(([n, notas, f, seq, juntas]) => `<div class="ap-triade"><b>${n}</b><span>${notas}</span><small>${f} casas</small><div class="linha-botoes"><button class="btn mini" data-seq="${seq}" aria-label="Ouvir as notas da tríade ${n.toLowerCase()}">${IC.som} Notas</button><button class="btn mini" data-juntas="${juntas}" aria-label="Ouvir a tríade ${n.toLowerCase()}">${IC.som} Juntas</button></div></div>`).join('')}</div>`,

  // Mão direita: p i m a
  pima: () => `<div class="ap-som"><div class="ap-pima">${[['p', 'polegar', '6ª, 5ª e 4ª: o baixo', '1:3'], ['i', 'indicador', '3ª corda', '3:0'], ['m', 'médio', '2ª corda', '4:1'], ['a', 'anelar', '1ª corda', '5:0']].map(([l, n, c, pos], i) => `<button type="button" data-i="${i}" data-nota="${pos}"><b>${l}</b><span>${n}</span><small>${c}</small></button>`).join('')}</div><button class="btn mini" data-seq="1:3 3:0 4:1 5:0 4:1 3:0">${IC.som} p i m a m i, no acorde C</button></div>`,

  // Três dedilhados para ouvir
  dedilhados: () => `<div class="ap-ritmos">${[['Simples', 'C:p i m i p i m i'], ['MPB', 'Am:p i m a m i m i'], ['Valsa, 3 tempos', 'G:p F F p F F']].map(([n, g]) => `<div class="ap-ritmo"><b>${n}</b><span class="ap-golpes">${g.split(':')[1].replace(/F/g, '(im)')}</span><button class="btn mini" data-golpes="${g}">${IC.som} Ouvir</button></div>`).join('')}</div>`,

  // Campo harmônico de Dó
  campoC: () => `<div class="ap-som"><div class="ap-campo sete">${['C', 'Dm', 'Em', 'F', 'G', 'Am', 'Bm7(b5)'].map((a, i) => `<button type="button" data-i="${i}" data-ouvir="${a}" aria-label="Ouvir ${a}"><b>${a}</b><small>${['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii'][i]}</small></button>`).join('')}</div><button class="btn mini" data-acordes="C Dm Em F G Am Bm7(b5) C">${IC.som} Ouvir a família</button></div>`,

  // I vi IV V em 4 tons
  transpor: () => {
    const tons = { C: ['C', 'Am', 'F', 'G'], G: ['G', 'Em', 'C', 'D'], D: ['D', 'Bm', 'G', 'A'], A: ['A', 'F#m', 'D', 'E'] };
    return `<table class="ap-tabela"><thead><tr><th>Tom</th><th>I</th><th>vi</th><th>IV</th><th>V</th><th><span class="sr">Ouvir</span></th></tr></thead><tbody>${Object.entries(tons).map(([t, acs]) => `<tr><th>${t}</th>${acs.map(a => `<td>${a}</td>`).join('')}<td><button class="btn mini" data-acordes="${acs.join(' ')}" aria-label="Ouvir em ${t}">${IC.som}</button></td></tr>`).join('')}</tbody></table>`;
  },

  // Escala de Dó com tons e semitons
  escalaMaior: () => {
    const n = ['C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4'], passos = ['T', 'T', 'S', 'T', 'T', 'T', 'S'];
    return `<div class="ap-som"><div class="ap-escala">${n.map((x, i) => `${i ? `<span class="ap-passo ${passos[i - 1] === 'S' ? 'semi' : ''}" aria-label="${passos[i - 1] === 'S' ? 'semitom' : 'tom'}">${passos[i - 1]}</span>` : ''}<button type="button" data-i="${i}" data-nota="${POS_NOTA[x]}">${x[0]}</button>`).join('')}</div><button class="btn mini" data-seq="${n.map(x => POS_NOTA[x]).join(' ')}">${IC.som} Ouvir a escala de Dó</button></div>`;
  },

  // Pentatônica de Lá menor, a caixa da casa 5 (1ª corda em cima)
  penta: () => {
    const x0 = 34, dx = 50, y0 = 18, dy = 20;
    const notas = [[0, 5, 'A'], [0, 8, 'C'], [1, 5, 'D'], [1, 7, 'E'], [2, 5, 'G'], [2, 7, 'A'], [3, 5, 'C'], [3, 7, 'D'], [4, 5, 'E'], [4, 8, 'G'], [5, 5, 'A'], [5, 8, 'C']];
    const y = c => y0 + (5 - c) * dy, x = f => x0 + (f - 4.5) * dx;
    let s = `<div class="ap-som"><svg class="ap-svg" viewBox="0 0 300 160" role="group" aria-label="Pentatônica de Lá menor na casa 5: toque numa nota para ouvir">`;
    for (let k = 4; k <= 9; k++) s += `<line class="dg-traste" x1="${x0 + (k - 4) * dx}" x2="${x0 + (k - 4) * dx}" y1="${y0}" y2="${y0 + 5 * dy}"/>`;
    for (let c = 0; c < 6; c++) s += `<line class="dg-corda" style="stroke-width:${1 + (5 - c) * 0.35}" x1="${x0}" x2="${x0 + 5 * dx}" y1="${y(c)}" y2="${y(c)}"/><text class="ap-t-fraco" x="8" y="${y(c) + 4}">${6 - c}ª</text>`;
    notas.forEach(([c, f, n], i) => { s += `<g class="tocavel" data-i="${i}" data-nota="${c}:${f}" role="button" tabindex="0" aria-label="${n}: ${6 - c}ª corda, casa ${f}"><circle class="ap-nota ${n === 'A' ? 'raiz' : ''}" cx="${x(f)}" cy="${y(c)}" r="9"/><text class="ap-nota-t" x="${x(f)}" y="${y(c) + 4}" text-anchor="middle">${n}</text></g>`; });
    [5, 7].forEach(f => { s += `<text class="ap-t-fraco" x="${x(f)}" y="${y0 + 5 * dy + 22}" text-anchor="middle">casa ${f}</text>`; });
    return s + `</svg><p class="sub">Em destaque, o Lá: a nota de casa.</p><button class="btn mini" data-seq="${notas.map(([c, f]) => `${c}:${f}`).join(' ')}">${IC.som} Ouvir subindo</button></div>`;
  },

  // Tensão e resolução do G7
  resolucao: () => `<div class="ap-ritmos">${[['G → C', 'G C', 'sem a sétima', 'acordes'], ['G7 → C', 'G7 C', 'com a sétima: mais vontade de chegar', 'acordes'], ['Si sobe para Dó', '4:0 4:1', 'a terça do G7', 'seq'], ['Fá desce para Mi', '5:1 5:0', 'a sétima do G7', 'seq']].map(([n, v, t, tipo]) => `<div class="ap-ritmo"><b>${n}</b><small>${t}</small><button class="btn mini" data-${tipo}="${v}">${IC.som} Ouvir</button></div>`).join('')}</div>`,

  // II-V-I em 3 tons
  iiVI: () => {
    const tons = { 'Dó': ['Dm7', 'G7', 'C7M'], Sol: ['Am7', 'D7', 'G7M'], 'Ré': ['Em7', 'A7', 'D7M'] };
    return `<table class="ap-tabela"><thead><tr><th>Tom</th><th>ii</th><th>V</th><th>I</th><th><span class="sr">Ouvir</span></th></tr></thead><tbody>${Object.entries(tons).map(([t, acs]) => `<tr><th>${t}</th>${acs.map(a => `<td>${a}</td>`).join('')}<td><button class="btn mini" data-acordes="${acs.join(' ')}" aria-label="Ouvir em ${t}">${IC.som}</button></td></tr>`).join('')}</tbody></table>`;
  },

  // Dominantes secundárias em Dó
  dominantes: () => seqAcordes(['C', 'A7', 'Dm', 'G7', 'C'], ['I', 'leva ao Dm', 'ii', 'V7', 'I']),

  // Diminuto de passagem
  diminuto: () => `<div class="ap-bloco">${figuras([['C#°', 'diminuto']], 'md')}${seqAcordes(['C', 'C#°', 'Dm7', 'G7'], ['I', 'passagem', 'ii', 'V7'])}</div>`,

  // Acordes da bossa
  bossaAcordes: () => `<div class="ap-bloco">${figuras([['C7M(9)', ''], ['Am7(9)', ''], ['Dm7(9)', ''], ['G7(13)', '']])}<div class="ap-som"><button class="btn mini" data-acordes="Dm7(9) G7(13) C7M(9) Am7(9)">${IC.som} Ouvir os quatro em sequência</button></div></div>`,

  // O baixo que anda
  baixoAnda: () => `<div class="ap-bloco">${seqAcordes(['C', 'C/B', 'Am', 'Am/G', 'F', 'G', 'C'], ['Dó', 'Si', 'Lá', 'Sol', 'Fá', 'Sol', 'Dó'])}<div class="ap-som"><button class="btn mini" data-seq="1:3 1:2 1:0 0:3 0:1 0:3 1:3">${IC.som} Só o baixo</button></div></div>`,

  // Técnicas de mão esquerda
  ligados: () => `<div class="ap-tecs">${tabTecnica(3, '5 h 7', 'Hammer-on', '3:5:7:h')}${tabTecnica(3, '7 p 5', 'Pull-off', '3:7:5:p')}</div>`,
  slideBend: () => `<div class="ap-tecs">${tabTecnica(4, '5 / 7', 'Slide subindo', '4:5:7:s')}${tabTecnica(4, '7 \\ 5', 'Slide descendo', '4:7:5:s')}${tabTecnica(4, '7 b 9', 'Bend de um tom', '4:7:9:b')}${tabTecnica(4, '7 ~', 'Vibrato', '4:7:7:v')}</div>`,
  abafado: () => `<div class="ap-ritmos">${[['Batida normal', 'Am7:D D U D U D U'], ['Com tapa', 'Am7:D T U D T U D U']].map(([n, g]) => `<div class="ap-ritmo"><b>${n}</b><span class="ap-golpes">${g.split(':')[1].replace(/T/g, 'tapa')}</span><button class="btn mini" data-golpes="${g}">${IC.som} Ouvir</button></div>`).join('')}</div>`,

  // Um ritmo só
  ritmoSamba: () => umRitmo('samba'),
  ritmoPagode: () => umRitmo('pagode'),
  ritmoValsa: () => umRitmo('valsa'),
  ritmoBossa: () => umRitmo('bossa')
});

/* ---------- Sons das imagens ----------
   Cada imagem toca exatamente o que mostra:
     data-ouvir="Em"          -> o acorde
     data-nota="4:1"          -> UMA nota (corda 0 = 6ª ... 5 = 1ª; casa 0 = solta)
     data-seq="3:0 3:0 4:3"   -> notas em sequência, acendendo cada [data-i]
     data-acordes="G Am Bm"   -> acordes em sequência, acendendo cada [data-i]
     data-golpes="Em:D U D U" -> uma batida com um acorde, acendendo cada [data-i]
     data-ritmo="samba"       -> um ritmo brasileiro
     data-juntas="1:3 2:2"    -> notas juntas, como um acorde dedilhado bem rápido
     data-tecnica="3:5:7:h"   -> corda:de:para:técnica (h hammer-on, p pull-off, s slide, b bend, v vibrato) */
function ligarSons(raiz) {
  const acender = (el, i) => (el.closest('.ap-som') || raiz).querySelectorAll('[data-i]').forEach(x => x.classList.toggle('tocando', +x.dataset.i === i));
  const piscar = el => { el.classList.add('tocando'); setTimeout(() => el.classList.remove('tocando'), 450); };
  const ligar = (sel, fn) => raiz.querySelectorAll(sel).forEach(el => {
    el.addEventListener('click', ev => { ev.stopPropagation(); fn(el); });
    if (el.tagName !== 'BUTTON') el.addEventListener('keydown', ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); fn(el); } });
  });
  const pares = txt => txt.trim().split(/\s+/).map(x => x.split(':').map(Number));
  ligar('[data-ouvir]', el => { ouvirAcorde(el.dataset.ouvir); if (el.dataset.i !== undefined) piscar(el); });
  ligar('[data-nota]', el => { ouvirNota(...el.dataset.nota.split(':').map(Number)); if (!el.matches('button')) piscar(el); });
  ligar('[data-seq]', el => ouvirSequencia(pares(el.dataset.seq), { aoTocar: i => acender(el, i) }));
  ligar('[data-acordes]', el => ouvirAcordes(el.dataset.acordes.trim().split(/\s+/), { aoTocar: i => acender(el, i) }));
  ligar('[data-golpes]', el => { const [ac, g] = el.dataset.golpes.split(':'); ouvirGolpes(ac, g.trim().split(/\s+/), { aoTocar: i => acender(el, i) }); });
  ligar('[data-ritmo]', el => ouvirBatida(patternById(el.dataset.ritmo), 2));
  ligar('[data-juntas]', el => { ouvirSequencia(pares(el.dataset.juntas), { passo: 0.022 }); if (el.dataset.i !== undefined) piscar(el); });
  ligar('[data-tecnica]', el => { const [c, de, para, tipo] = el.dataset.tecnica.split(':'); ouvirTecnica(+c, +de, +para, tipo); });
}

/* ---------- Conteúdo ---------- */
const APOSTILAS = [
  {
    id: 'violao', nivel: 'iniciante', titulo: 'O violão por dentro', resumo: 'As partes do violão, como o som nasce e por que cada casa muda a nota.', video: 'partes', min: 5,
    secoes: [
      { titulo: 'As partes do violão', visual: 'partes', html: `<p>O violão tem três partes grandes: a <b>cabeça</b> (onde ficam as tarraxas), o <b>braço</b> (onde a mão esquerda aperta as cordas) e a <b>caixa</b> (o corpo oco que faz o som ficar forte).</p>
        <p>As <b>tarraxas</b> esticam ou afrouxam cada corda. É com elas que você afina. Os <b>trastes</b> são os ferrinhos do braço, e o espaço entre dois trastes se chama <b>casa</b>.</p>` },
      { titulo: 'Como o som nasce', html: `<p>Quando você bate na corda, ela vibra muito rápido. Essa vibração passa pelo <b>rastilho</b> e pelo <b>cavalete</b> até o <b>tampo</b> (a madeira da frente). O tampo vibra junto, e o ar dentro da caixa sai pela <b>boca</b>. Por isso o violão soa alto sem precisar de tomada.</p>` },
      { tipo: 'analogia', html: 'A corda é a sua voz e a caixa é um megafone. Sem a caixa, a corda faria um som fininho, quase sem volume.' },
      { titulo: 'Por que apertar uma casa muda a nota', visual: 'casas', html: `<p>Apertar uma casa <b>encurta</b> o pedaço da corda que vibra. Corda mais curta vibra mais rápido, e o som fica mais <b>agudo</b>.</p>
        <p>Cada casa sobe o som em <b>meio tom</b>. Doze casas sobem uma <b>oitava</b>: a mesma nota, mais aguda. Na casa 12 a corda vibra pela metade.</p>` },
      { titulo: 'Nylon ou aço?', html: `<p>O <b>violão de nylon</b> (clássico) tem som macio e é o mais usado no samba, na bossa nova e na MPB. As cordas machucam menos os dedos no começo.</p>
        <p>O <b>violão de aço</b> (folk) tem som mais brilhante e é comum no pop e no sertanejo. As cordas são mais duras.</p>` },
      { tipo: 'pegadinha', html: 'Nunca coloque cordas de aço num violão de nylon. Elas puxam com muito mais força e podem rachar o tampo ou entortar o braço.' },
      { tipo: 'pegadinha', html: 'A palavra <b>pestana</b> tem dois sentidos: é a peça entre a cabeça e o braço e também o acorde em que o dedo 1 deita sobre várias cordas.' }
    ],
    quiz: [
      { p: 'Para que servem as tarraxas?', o: ['Para afinar as cordas', 'Para aumentar o volume', 'Para trocar de acorde'], c: 0, e: 'As tarraxas esticam ou afrouxam a corda: é assim que se afina.' },
      { p: 'Apertar uma casa mais perto da boca do violão deixa o som…', o: ['Mais grave', 'Mais agudo', 'Igual'], c: 1, e: 'A parte da corda que vibra fica mais curta, então vibra mais rápido: som mais agudo.' },
      { p: 'Quantas casas sobem uma oitava?', o: ['7', '10', '12'], c: 2, e: 'Doze casas = doze meios tons = uma oitava. Por isso a casa 12 tem marcação dupla.' }
    ]
  },
  {
    id: 'afinar', nivel: 'iniciante', titulo: 'Afinação', resumo: 'O nome de cada corda solta e dois jeitos de afinar: com o app e de ouvido.', video: 'afinar', min: 4,
    secoes: [
      { titulo: 'As notas das cordas soltas', visual: 'cordas', html: `<p>Da mais grossa (6ª) para a mais fina (1ª): <b>Mi, Lá, Ré, Sol, Si, Mi</b>. Na cifra: <b>E A D G B E</b>.</p>
        <p>Um jeito de decorar: <b>E</b>u <b>A</b>mo <b>D</b>oce <b>d</b>e <b>G</b>oiaba, <b>B</b>em <b>E</b>scuro.</p>` },
      { titulo: 'Afinando com o app', html: `<p>Abra a aba <b>Afinador</b> e toque uma corda solta. O ponteiro mostra se a nota está certa:</p>
        <ul><li>Ponteiro para a <b>esquerda</b>: está grave. Aperte a tarraxa (o som sobe).</li>
        <li>Ponteiro para a <b>direita</b>: está agudo. Afrouxe a tarraxa (o som desce).</li>
        <li>No centro e verde: afinada.</li></ul>` },
      { tipo: 'analogia', html: 'Afinar é como regular o volume de uma conversa: você vai devagar até encontrar o ponto certo. Gire a tarraxa aos poucos, um quarto de volta por vez.' },
      { titulo: 'Afinando de ouvido (método da casa 5)', html: `<p>Com a 6ª corda afinada, dá para afinar as outras comparando:</p>
        <ul><li>6ª corda na <b>casa 5</b> = 5ª corda solta (Lá)</li><li>5ª corda na casa 5 = 4ª solta (Ré)</li><li>4ª corda na casa 5 = 3ª solta (Sol)</li>
        <li>3ª corda na <b>casa 4</b> = 2ª solta (Si)</li><li>2ª corda na casa 5 = 1ª solta (Mi)</li></ul>` },
      { tipo: 'pegadinha', html: 'No método de ouvido, a 3ª corda é a exceção: ela usa a <b>casa 4</b>, e não a 5.' },
      { tipo: 'pegadinha', html: 'Se passar do ponto, afrouxe um pouco e chegue na nota <b>subindo</b>. Assim a corda segura a afinação por mais tempo.' },
      { titulo: 'Cordas novas desafinam', html: '<p>Cordas novas esticam nos primeiros dias e desafinam rápido. É normal: afine antes de cada treino.</p>' }
    ],
    quiz: [
      { p: 'Qual é a nota da 5ª corda solta?', o: ['Mi', 'Lá', 'Ré'], c: 1, e: 'E A D G B E: a 5ª corda é o Lá (A).' },
      { p: 'O ponteiro do afinador está para a esquerda. O que fazer?', o: ['Afrouxar a tarraxa', 'Apertar a tarraxa', 'Trocar a corda'], c: 1, e: 'Esquerda é grave. Apertar a tarraxa estica a corda e o som sobe.' },
      { p: 'No método de ouvido, que casa da 3ª corda dá a nota da 2ª corda solta?', o: ['Casa 5', 'Casa 4', 'Casa 3'], c: 1, e: 'É a única exceção: casa 4.' }
    ]
  },
  {
    id: 'postura', nivel: 'iniciante', titulo: 'Postura e mãos', resumo: 'Como sentar, segurar o violão e usar cada mão sem dor.', video: 'postura', min: 4,
    secoes: [
      { titulo: 'Sentado do jeito certo', html: `<p>Costas retas, pés no chão. O violão encosta no seu corpo e a cintura dele fica sobre a perna. O braço do violão aponta um pouco para cima, nunca para o chão.</p>` },
      { titulo: 'A mão que aperta as cordas', visual: 'dedos', html: `<p>Os dedos têm número: <b>1</b> indicador, <b>2</b> médio, <b>3</b> anelar e <b>4</b> mindinho. O polegar fica <b>atrás do braço</b>, mais ou menos no meio.</p>
        <p>Use a <b>ponta</b> dos dedos, com eles curvados, e aperte <b>logo atrás do traste</b>. Unhas curtas ajudam muito.</p>` },
      { tipo: 'analogia', html: 'Pense nos dedos como martelinhos: a ponta cai firme e reta na corda. Dedo deitado encosta nas cordas vizinhas e abafa o som.' },
      { titulo: 'A mão da batida', html: `<p>Na batida, quem trabalha é o <b>pulso</b>, solto, como quem sacode água da mão. Com palheta, segure entre o polegar e o indicador deixando só a pontinha para fora.</p>
        <p>Nos ritmos com dedos (samba, bossa), o polegar (<b>P</b>) toca as cordas graves e os dedos (<b>i m a</b>) as agudas.</p>` },
      { tipo: 'pegadinha', html: 'Apertar com força demais cansa a mão e não melhora o som. Aperte só o suficiente para a nota soar limpa.' },
      { titulo: 'Dor nos dedos é normal', html: '<p>Nas primeiras semanas a ponta dos dedos dói. Em 2 a 3 semanas se formam calos e a dor passa. Treine pouco e todo dia, e pare se doer muito.</p>' }
    ],
    quiz: [
      { p: 'Qual é o dedo 3?', o: ['Médio', 'Anelar', 'Mindinho'], c: 1, e: '1 indicador, 2 médio, 3 anelar, 4 mindinho.' },
      { p: 'Onde apertar a corda dentro da casa?', o: ['No meio da casa', 'Logo atrás do traste', 'Em cima do traste'], c: 1, e: 'Logo atrás do traste o som sai limpo com menos força.' },
      { p: 'Quem faz o movimento da batida?', o: ['O ombro', 'O pulso solto', 'Só os dedos'], c: 1, e: 'O pulso solto deixa a batida leve e no tempo.' }
    ]
  },
  {
    id: 'ler', nivel: 'iniciante', titulo: 'Diagramas, cifras e tablaturas', resumo: 'Os três jeitos de escrever música para violão, e como o jogo usa cada um.', video: 'diagrama', min: 5,
    secoes: [
      { titulo: 'O diagrama de acorde', visual: 'diagrama', html: `<p>É o violão <b>de pé na sua frente</b>. As linhas em pé são as cordas, com a 6ª (a mais grossa) à esquerda. As linhas deitadas são os trastes, e a linha grossa de cima é o começo do braço.</p>
        <p>Se aparecer um número ao lado, como <b>5ª</b>, o desenho começa naquela casa.</p>` },
      { titulo: 'A cifra', html: `<p>Na cifra, cada acorde tem uma letra: <b>C</b> Dó, <b>D</b> Ré, <b>E</b> Mi, <b>F</b> Fá, <b>G</b> Sol, <b>A</b> Lá, <b>B</b> Si. Depois da letra vêm detalhes:</p>
        <ul><li><b>m</b> = menor (Am = Lá menor)</li><li><b>7</b> = com sétima (G7)</li><li><b>7M</b> = com sétima maior (C7M)</li><li><b>9</b> = com nona (A9)</li>
        <li><b>/</b> = baixo diferente (G/B = Sol com Si no baixo)</li><li><b>#</b> = meio tom acima, <b>b</b> = meio tom abaixo</li></ul>` },
      { titulo: 'A tablatura', visual: 'tab', html: `<p>A tablatura tem <b>6 linhas</b>, uma para cada corda. Os <b>números</b> dizem a casa que você aperta, e <b>0</b> é corda solta. Leia da esquerda para a direita.</p>
        <p>O jogo do app é uma tablatura em movimento: as notas e os acordes andam pelas 6 cordas até a linha vermelha.</p>` },
      { tipo: 'pegadinha', html: 'Na tablatura, a linha de <b>cima</b> é a <b>1ª corda</b> (a mais fina). É o contrário do que você vê olhando para baixo enquanto toca. Se preferir, troque a ordem nos Ajustes.' },
      { tipo: 'analogia', html: 'O diagrama é uma foto da mão parada. A tablatura é um filme: mostra o que tocar e em que ordem.' }
    ],
    quiz: [
      { p: 'No diagrama, a linha da esquerda é…', o: ['A 1ª corda', 'A 6ª corda', 'O primeiro traste'], c: 1, e: 'O violão está de pé na sua frente: a corda grossa (6ª) fica à esquerda.' },
      { p: 'Na tablatura, o número 0 significa…', o: ['Não tocar', 'Corda solta', 'Casa 10'], c: 1, e: '0 = toca a corda sem apertar nenhuma casa.' },
      { p: 'O que é Am?', o: ['Lá maior', 'Lá menor', 'Lá com sétima'], c: 1, e: 'A = Lá, m = menor.' }
    ]
  },
  {
    id: 'notas', nivel: 'intermediario', titulo: 'Notas no braço', resumo: 'As 7 notas, tons e semitons, e como achar qualquer nota.', min: 5,
    secoes: [
      { titulo: 'As 7 notas', html: `<p>A música usa 7 notas que se repetem: <b>Dó, Ré, Mi, Fá, Sol, Lá, Si</b> (C D E F G A B). Depois do Si vem o Dó de novo, mais agudo: isso é uma <b>oitava</b>.</p>` },
      { titulo: 'Tons e semitons', html: `<p>No violão, de uma casa para a vizinha a nota sobe um <b>semitom</b> (meio tom). Duas casas = um <b>tom</b>.</p>
        <p>Entre a maioria das notas há um tom (duas casas). Mas entre <b>Mi e Fá</b> e entre <b>Si e Dó</b> há só um semitom (uma casa).</p>` },
      { tipo: 'pegadinha', html: 'Por isso não se usa "Mi sustenido" nem "Si sustenido" no dia a dia: meio tom acima do Mi já é o Fá, e acima do Si já é o Dó.' },
      { titulo: 'Sustenido e bemol', html: `<p><b>#</b> (sustenido) sobe meio tom e <b>b</b> (bemol) desce meio tom. C# e Db são a <b>mesma casa</b> com dois nomes.</p>` },
      { titulo: 'Achando notas na 6ª e na 5ª corda', visual: 'notasBraco', html: `<p>Saber as notas dessas duas cordas ajuda a montar acordes com pestana: a nota mais grave do acorde dá o nome a ele.</p>` },
      { tipo: 'analogia', html: 'O braço é como um teclado de piano deitado em 6 fileiras: cada casa é uma tecla, branca ou preta.' }
    ],
    quiz: [
      { p: 'Quantas casas há entre Mi e Fá?', o: ['Uma', 'Duas', 'Três'], c: 0, e: 'Mi–Fá é um semitom: uma casa só.' },
      { p: 'Qual nota fica na casa 3 da 6ª corda?', o: ['Fá', 'Sol', 'Lá'], c: 1, e: 'Mi (solta), Fá (1), Fá# (2), Sol (3).' },
      { p: 'C# e Db são…', o: ['Notas diferentes', 'A mesma nota', 'Acordes'], c: 1, e: 'Mesma casa, dois nomes.' }
    ]
  },
  {
    id: 'acordes', nivel: 'iniciante', titulo: 'Como os acordes funcionam', resumo: 'O que faz um acorde ser maior ou menor, a sétima, e o truque do capotraste.', min: 6,
    secoes: [
      { titulo: 'O que é um acorde', html: `<p>Acorde é um grupo de <b>3 ou mais notas</b> tocadas juntas. O básico é a <b>tríade</b>: a nota que dá o nome (fundamental), a <b>terça</b> e a <b>quinta</b>. Dó maior = Dó, Mi e Sol.</p>` },
      { tipo: 'analogia', html: 'Um acorde é uma receita com três ingredientes. Trocar um ingrediente só (a terça) muda o sabor de alegre para triste.' },
      { titulo: 'Maior ou menor', visual: 'maiorMenor', html: `<p>A diferença está na terça. No acorde <b>maior</b> ela fica 4 semitons acima da fundamental (som alegre). No <b>menor</b>, 3 semitons (som triste).</p>
        <p>No violão: do E para o Em você só tira o dedo 1. Ouça os dois.</p>` },
      { titulo: 'A sétima', html: `<p>Somar mais uma nota, a <b>sétima</b>, muda a cor do acorde. O <b>G7</b> tem uma tensão que "pede" para ir ao C. O <b>C7M</b> (sétima maior) tem aquele som sonhador da bossa nova.</p>` },
      { titulo: 'Acordes que combinam', visual: 'campo', html: `<p>Cada tom tem uma família de acordes que soam bem juntos: o <b>campo harmônico</b>. Em Sol maior a família é G, Am, Bm, C, D e Em.</p>
        <p>É por isso que G, C e D aparecem juntos em tantas músicas, como <b>Asa Branca</b>.</p>` },
      { titulo: 'O capotraste', html: `<p>O capotraste é uma "pestana de fora": você prende numa casa e todas as cordas sobem junto. Os desenhos dos acordes continuam os mesmos, só que soam mais agudos.</p>
        <p>Assim você toca no tom da gravação usando acordes fáceis. O app sugere a casa certa em cada música.</p>` },
      { tipo: 'pegadinha', html: 'Com o capotraste, as casas contam a partir dele. Um acorde "na casa 2" fica 2 casas depois do capo.' }
    ],
    quiz: [
      { p: 'O que muda entre um acorde maior e um menor?', o: ['A fundamental', 'A terça', 'A quinta'], c: 1, e: 'É a terça: 4 semitons no maior, 3 no menor.' },
      { p: 'Qual acorde "pede" para ir para o C?', o: ['G7', 'Em', 'A'], c: 0, e: 'O G7 tem tensão que se resolve no C.' },
      { p: 'Com o capotraste, os desenhos dos acordes…', o: ['Mudam todos', 'Continuam iguais, mas soam mais agudos', 'Ficam mais graves'], c: 1, e: 'O capo sobe todas as cordas junto.' }
    ]
  },
  {
    id: 'ritmo', nivel: 'iniciante', titulo: 'Ritmo e batida', resumo: 'Pulso, compasso, a batida para baixo e para cima, e por que começar devagar.', video: 'batida', min: 4,
    secoes: [
      { titulo: 'O pulso', html: `<p>Toda música tem um <b>pulso</b>, como um coração batendo. A velocidade dele se mede em <b>BPM</b> (batidas por minuto). O metrônomo marca esse pulso.</p>` },
      { titulo: 'O compasso', html: `<p>Os tempos se juntam em grupos. <b>4 por 4</b> (1, 2, 3, 4) é o mais comum no pop e na MPB. <b>2 por 4</b> (1, 2) é o do samba e do baião. <b>3 por 4</b> (1, 2, 3) é o da valsa.</p>` },
      { titulo: 'Para baixo e para cima', visual: 'batida', html: `<p>Bata <b>para baixo</b> no número (1, 2, 3, 4) e <b>para cima</b> no "e" entre eles. A mão vai e volta o tempo todo, como um pêndulo. Nas pausas ela passa sem encostar nas cordas.</p>` },
      { tipo: 'pegadinha', html: 'Parar a mão nas pausas faz você perder o tempo. A mão nunca para: ela só deixa de encostar.' },
      { tipo: 'analogia', html: 'Andar de bicicleta devagar é mais difícil, mas é assim que se aprende o equilíbrio. Tocar devagar e certo ensina a mão; a velocidade vem depois sozinha.' },
      { titulo: 'Comece devagar', html: '<p>No jogo, comece em <b>40% ou 60%</b> da velocidade. Quando tirar 3 estrelas, suba 20%. É o caminho mais rápido para tocar a música inteira.</p>' }
    ],
    quiz: [
      { p: 'No 4 por 4, quando a mão vai para cima?', o: ['No número', 'No "e" entre os números', 'Nunca'], c: 1, e: 'Baixo no número, cima no "e".' },
      { p: 'O samba costuma ser em…', o: ['2 por 4', '3 por 4', '6 por 8'], c: 0, e: 'Samba e baião: 2 tempos por compasso.' },
      { p: 'Numa pausa da batida, a mão…', o: ['Para', 'Continua indo e voltando sem tocar', 'Bate mais forte'], c: 1, e: 'O movimento contínuo mantém o tempo.' }
    ]
  },
  {
    id: 'brasil', nivel: 'intermediario', titulo: 'Ritmos brasileiros', resumo: 'Samba, pagode, bossa nova, baião e o samba-rock do Jorge Ben Jor.', video: 'samba', min: 6,
    secoes: [
      { titulo: 'Ouça cada ritmo', visual: 'ritmos', html: '<p><b>P</b> é o polegar nas cordas graves e <b>d</b> são os dedos juntos nas agudas. Toque em Ouvir para escutar.</p>' },
      { titulo: 'Samba', html: `<p>Em 2 por 4. O <b>polegar</b> faz o papel do surdo, marcando os dois tempos sem falhar. Os <b>dedos</b> fazem o tamborim, entrando fora do tempo forte (isso é a <b>síncope</b>).</p>` },
      { titulo: 'Pagode', html: '<p>A base é a do samba, com os dedos mais cheios e às vezes um <b>tapa</b> abafado nas cordas, que soa como percussão.</p>' },
      { titulo: 'Bossa nova', html: `<p>Criada no fim dos anos 1950, com João Gilberto no violão. O polegar marca os tempos como um relógio e os dedos fazem a síncope. Os acordes têm sétima e nona: Dm7, G7, C7M.</p>` },
      { titulo: 'Baião e xote', html: '<p>O ritmo de Luiz Gonzaga. O polegar imita a <b>zabumba</b> ("tum... tum") e os dedos respondem como o <b>triângulo</b>.</p>' },
      { titulo: 'Samba-rock', html: `<p>Nos anos 1960, Jorge Ben Jor criou um jeito próprio de tocar violão, misturando samba, rock e soul. A mão direita é solta, com acentos fora do tempo e muito balanço. É a batida de Mas Que Nada, Taj Mahal e País Tropical.</p>` },
      { tipo: 'analogia', html: 'Num ritmo brasileiro o violão é uma bateria inteira: o polegar é o bumbo e os dedos são a caixa e o chocalho.' },
      { tipo: 'pegadinha', html: 'Nos ritmos com polegar, não deixe o polegar acompanhar os dedos. Ele é o "chão" da música: regular, sempre no tempo.' }
    ],
    quiz: [
      { p: 'No samba, o polegar faz o papel de qual instrumento?', o: ['Tamborim', 'Surdo', 'Cuíca'], c: 1, e: 'O polegar marca os tempos como o surdo.' },
      { p: 'Quem criou o samba-rock no violão?', o: ['Tom Jobim', 'Jorge Ben Jor', 'Luiz Gonzaga'], c: 1, e: 'Jorge Ben Jor, nos anos 1960.' },
      { p: 'No baião, os dedos imitam…', o: ['O triângulo', 'O pandeiro', 'O surdo'], c: 0, e: 'Polegar = zabumba, dedos = triângulo.' }
    ]
  },
  {
    id: 'estudar', nivel: 'iniciante', titulo: 'Como estudar violão', resumo: 'Uma rotina de 10 minutos por dia e como usar o jogo para aprender mais rápido.', video: 'estudar', min: 4,
    secoes: [
      { titulo: 'Pouco e todo dia', html: `<p>10 minutos por dia ensinam mais do que 2 horas só no domingo. A mão aprende pela <b>repetição espaçada</b>: cada noite de sono "grava" o que você treinou.</p>` },
      { titulo: 'Rotina de 10 minutos', visual: 'rotina', html: '<p>Faça nesta ordem. Se tiver mais tempo, repita a música.</p>' },
      { titulo: 'Os três modos do jogo', html: `<ul><li><b>Esperar por mim</b>: a música para em cada acorde e só continua quando você acerta. Use para aprender.</li>
        <li><b>No tempo</b>: a música não para e o microfone dá pontos. Use para testar.</li>
        <li><b>Prática</b>: o app toca junto, sem pontos. Use para sentir a música.</li></ul>` },
      { tipo: 'analogia', html: 'Estudar violão é como academia: a carga sobe aos poucos. Velocidade é a carga. Suba 20% quando ficar fácil.' },
      { tipo: 'pegadinha', html: 'O erro mais comum é querer tocar rápido logo no começo. A mão aprende o movimento errado e depois é difícil desaprender.' },
      { titulo: 'Grave você mesmo', html: '<p>Grave um vídeo tocando uma vez por semana. Ouvir a própria gravação mostra o que melhorar e também o quanto você já evoluiu.</p>' }
    ],
    quiz: [
      { p: 'O que ensina mais?', o: ['2 horas no domingo', '10 minutos por dia', 'Tanto faz'], c: 1, e: 'A repetição espaçada grava o movimento na memória.' },
      { p: 'Qual modo do jogo é melhor para aprender uma música nova?', o: ['No tempo', 'Esperar por mim', 'Prática'], c: 1, e: 'Sem pressa, você acerta cada acorde antes de seguir.' },
      { p: 'Quando subir a velocidade?', o: ['No primeiro dia', 'Quando tirar 3 estrelas', 'Nunca'], c: 1, e: 'Ficou fácil? Suba 20%.' }
    ]
  },
  /* ===== Iniciante ===== */
  {
    id: 'cifra', nivel: 'iniciante', titulo: 'A cifra por dentro', resumo: 'Por que cada acorde tem uma letra, e como ler qualquer cifra: m, 7, 7M, 9, #, b, ° e a barra.', video: 'cifra', min: 8,
    secoes: [
      { titulo: 'Sete notas, sete letras', visual: 'letras', html: `<p>A música que ouvimos usa 7 notas naturais: <b>Dó, Ré, Mi, Fá, Sol, Lá, Si</b>. A cifra troca cada nome por uma letra: <b>C D E F G A B</b>.</p>
        <p>A letra do acorde é a sua <b>fundamental</b>, a nota que dá o nome e serve de chão para as outras. O acorde <b>C</b> é construído em cima do Dó; o <b>A</b>, em cima do Lá.</p>` },
      { titulo: 'Por que o A é o Lá', html: `<p>Na Idade Média os monges já escreviam as notas com letras. A contagem começava pelo <b>Lá</b>, a nota mais grave do sistema que eles usavam, e seguia em ordem: A (Lá), B (Si), C (Dó)…</p>
        <p>Por volta do ano 1000, o monge italiano <b>Guido d’Arezzo</b> criou um jeito de cantar as notas: usou a primeira sílaba de cada verso de um hino a São João, em que cada verso começava uma nota acima: <b>Ut, Re, Mi, Fa, Sol, La</b>. Séculos depois o Ut virou <b>Dó</b>, mais fácil de cantar, e entrou o <b>Si</b>, das iniciais de <i>Sancte Iohannes</i>.</p>
        <p>Brasil, Itália e França falam Dó, Ré, Mi. Os países de língua inglesa e alemã ficaram com as letras. A cifra popular usa as letras porque são curtas e iguais em qualquer lugar.</p>` },
      { tipo: 'analogia', html: 'A letra do acorde é como o sobrenome de uma família: Am, A7 e A9 são todos “da família Lá”. O que vem depois da letra diz qual parente ele é.' },
      { titulo: 'Maior e menor', visual: 'maiorMenor', html: `<p>Só a letra = acorde <b>maior</b> (som aberto, alegre). Um <b>m</b> minúsculo logo depois da letra = <b>menor</b> (som mais fechado). <b>A</b> é Lá maior e <b>Am</b> é Lá menor.</p>
        <p>Entre os dois muda <b>uma nota só</b>, a terça. Ouça o E e o Em.</p>` },
      { titulo: 'Os números contam notas', visual: 'contar', html: `<p>Os números contam as notas a partir da fundamental. Conte as letras a partir do G: G (1), A (2), B (3), C (4), D (5), E (6), F (7). Um acorde comum junta as notas <b>1, 3 e 5</b>. O número da cifra diz qual nota <b>a mais</b> entrou:</p>
        <ul><li><b>7</b> = sétima, um tom (2 casas) abaixo da oitava: o G7 soma o Fá. Som de tensão, que pede o próximo acorde.</li>
        <li><b>7M</b> = sétima maior, meio tom (1 casa) abaixo da oitava: o G7M soma o Fá#. Som macio, de bossa nova.</li>
        <li><b>9</b> = nona, a 2ª nota uma oitava acima: o A9 soma o Si.</li>
        <li><b>6</b> e <b>13</b> = a 6ª nota. O 13 é a mesma nota uma oitava acima, e vem junto com a sétima.</li>
        <li><b>4</b> ou <b>sus4</b> = a 4ª nota entra no lugar da terça: som “suspenso”.</li></ul>` },
      { tipo: 'pegadinha', html: 'Muita cifra brasileira chama de <b>A9</b> o desenho do A sem o dedo 3 (Lá, Mi, Lá, Si, Mi). Ele tem a nona (Si), mas perde a terça (Dó#): o nome técnico seria <b>Asus2</b>. Os dois soam parecidos e um é usado no lugar do outro.' },
      { titulo: 'Sustenido e bemol', visual: 'sustenido', html: `<p><b>#</b> (sustenido) = meio tom acima, uma casa. <b>b</b> (bemol) = meio tom abaixo. <b>F#</b> (Fá sustenido) e <b>Gb</b> (Sol bemol) são a mesma casa com dois nomes: isso se chama <b>enarmonia</b>.</p>` },
      { tipo: 'pegadinha', html: 'Em <b>Bb</b> o primeiro B é a nota Si e o segundo b, minúsculo, é o bemol: Si bemol. Em <b>Bbm</b> ainda vem o m de menor: Si bemol menor.' },
      { titulo: 'Diminuto e meio-diminuto', html: `<p><b>°</b> (diminuto) é um acorde de notas a 3 casas uma da outra, muito tenso, usado para ligar acordes vizinhos (C, C#°, Dm). <b>m7(b5)</b>, às vezes escrito <b>ø</b>, é o meio-diminuto: um acorde menor com a quinta meio tom abaixo, comum em tom menor.</p>` },
      { titulo: 'A barra e o baixo', visual: 'barra', html: `<p>O que vem depois da <b>/</b> é a nota do <b>baixo</b>, a mais grave. <b>C/E</b> é o acorde de Dó com o Mi no baixo. A barra serve para o baixo andar de uma nota para a vizinha: C, G/B, Am (Dó, Si, Lá).</p>` },
      { tipo: 'pegadinha', html: '<b>7M</b> (M maiúsculo) é sétima maior; o <b>m</b> minúsculo logo depois da letra é menor. <b>Am7M</b> junta os dois: Lá menor com sétima maior.' },
      { titulo: 'Lendo uma cifra completa', visual: 'anatomia', html: `<p>Leia sempre nesta ordem: <b>letra</b> (fundamental), <b>#</b> ou <b>b</b>, <b>m</b> (menor), números e, por último, a <b>barra</b>. <b>F#m7/E</b> = Fá sustenido menor com sétima, com Mi no baixo.</p>` },
      { tipo: 'curiosidade', html: 'Na Alemanha, <b>H</b> é o Si e <b>B</b> é o Si bemol. Por isso Bach escreveu melodias com as notas do próprio nome: B-A-C-H = Si bemol, Lá, Dó, Si.' }
    ],
    quiz: [
      { p: 'Por que o Lá é a letra A?', o: ['A contagem antiga das notas começava pelo Lá', 'Porque é a nota mais usada', 'Por causa do alfabeto grego'], c: 0, e: 'Os monges medievais contavam as notas a partir do Lá, a mais grave do sistema deles.' },
      { p: 'O que é Bb7M?', o: ['Si bemol com sétima maior', 'Si bemol menor com sétima', 'Si com sétima e Si no baixo'], c: 0, e: 'B = Si, b = bemol, 7M = sétima maior.' },
      { p: 'Em D/F#, qual é a nota mais grave?', o: ['Ré', 'Fá sustenido', 'Lá'], c: 1, e: 'Depois da barra vem o baixo: Fá sustenido.' },
      { p: 'Qual nota o 7 acrescenta ao G7?', o: ['Fá', 'Fá sustenido', 'Mi'], c: 0, e: 'O 7 é a sétima menor, 2 casas abaixo da oitava: Fá. O Fá# seria o 7M.' }
    ]
  },
  /* ===== Intermediário ===== */
  {
    id: 'intervalos', nivel: 'intermediario', titulo: 'Intervalos e tríades', resumo: 'A distância entre as notas e a receita de cada acorde: maior, menor, diminuto e aumentado.', min: 6,
    secoes: [
      { titulo: 'O que é um intervalo', visual: 'intervalos', html: `<p>Intervalo é a distância entre duas notas. No violão é fácil medir: conte as <b>casas</b>, cada uma é um semitom.</p>
        <ul><li>1 casa: segunda menor</li><li>2 casas: segunda maior</li><li><b>3 casas: terça menor</b></li><li><b>4 casas: terça maior</b></li><li>5 casas: quarta justa</li><li>6 casas: trítono</li><li><b>7 casas: quinta justa</b></li><li>12 casas: oitava</li></ul>` },
      { tipo: 'analogia', html: 'Intervalos são degraus de uma escada: a terça menor sobe 3 degrauzinhos e a maior sobe 4. Um degrau a mais ou a menos muda todo o clima.' },
      { titulo: 'Tríades: empilhando terças', visual: 'triades', html: `<p>A tríade junta três notas: a fundamental, a <b>terça</b> e a <b>quinta</b>. A receita muda com o tipo das terças empilhadas:</p>
        <ul><li><b>Maior</b> = 4 + 3 casas (C E G): alegre, estável.</li><li><b>Menor</b> = 3 + 4 casas (C Eb G): mais sombrio.</li>
        <li><b>Diminuta</b> = 3 + 3 casas (C Eb Gb): tensa, instável.</li><li><b>Aumentada</b> = 4 + 4 casas (C E G#): suspense, sonho.</li></ul>` },
      { titulo: 'Por que o desenho muda tão pouco', visual: 'maiorMenor', html: `<p>Do <b>E</b> para o <b>Em</b>, do <b>A</b> para o <b>Am</b> e do <b>D</b> para o <b>Dm</b>, só um dedo muda, sempre uma casa. É a terça descendo meio tom: de maior para menor.</p>` },
      { titulo: 'Inversões', html: `<p>As notas do acorde podem vir em qualquer ordem. Quando a mais grave não é a fundamental, o acorde está <b>invertido</b>: C/E (Mi no baixo) é a 1ª inversão e C/G (Sol no baixo) é a 2ª. O nome não muda; muda o peso do som.</p>` },
      { tipo: 'pegadinha', html: 'A quinta é a nota que mais pode faltar: muitos desenhos de violão tiram a quinta e quase ninguém percebe. Já a terça não pode faltar, porque é ela que diz se o acorde é maior ou menor.' }
    ],
    quiz: [
      { p: 'Quantas casas há numa terça menor?', o: ['2', '3', '4'], c: 1, e: '3 casas = terça menor; 4 = terça maior.' },
      { p: 'C, E e G# formam um acorde…', o: ['Maior', 'Diminuto', 'Aumentado'], c: 2, e: '4 + 4 casas: aumentado.' },
      { p: 'Em C/G, qual nota está no baixo?', o: ['Dó', 'Mi', 'Sol'], c: 2, e: 'C/G é a 2ª inversão: Sol no baixo.' }
    ]
  },
  {
    id: 'pestana', nivel: 'intermediario', titulo: 'A pestana sem dor', resumo: 'Como fazer o F e o Bm soarem limpos, e como um único desenho vira 12 acordes.', video: 'pestana', min: 6,
    secoes: [
      { titulo: 'O que é a pestana', visual: 'pestanaF', html: `<p>Na pestana o <b>dedo 1 deita</b> sobre várias cordas na mesma casa, como um capotraste feito com o dedo. Os outros dedos montam um desenho conhecido logo à frente: no <b>F</b> é o desenho do <b>E</b>; no <b>Bm</b>, o do <b>Am</b>.</p>` },
      { titulo: 'Passo a passo', html: `<ol><li>Use a <b>lateral</b> do dedo 1, a parte mais dura, e não a parte mole da frente.</li>
        <li>Deixe o dedo <b>colado no traste</b>: quanto mais perto, menos força.</li>
        <li>Polegar atrás do braço, mais ou menos atrás do dedo 2. Puxe o violão de leve com o braço, em vez de esmagar com o polegar.</li>
        <li>Toque <b>corda por corda</b> e ajuste o dedo até todas soarem.</li></ol>` },
      { tipo: 'analogia', html: 'A pestana é uma pinça com alavanca: o polegar é o apoio e o peso do braço faz a força. Se a mão inteira dói, você está apertando, não pinçando.' },
      { tipo: 'pegadinha', html: 'Cordas que somem quase sempre caem nas dobrinhas das juntas do dedo. Mova o dedo 1 alguns milímetros para cima ou para baixo e teste de novo.' },
      { titulo: 'Um desenho, doze acordes', visual: 'notasBraco', html: `<p>Mova o desenho do F pelo braço: o nome do acorde é a nota da <b>6ª corda</b> onde está a pestana. Casa 1 = F, casa 3 = G, casa 5 = A, casa 7 = B, casa 8 = C.</p>
        <p>O desenho do Bm (menor, com a fundamental na <b>5ª corda</b>) faz o mesmo: casa 2 = Bm, casa 3 = Cm, casa 5 = Dm, casa 7 = Em.</p>` },
      { titulo: 'Treino de três semanas', html: `<p>1 minuto por dia: monte o F, toque, solte e monte de novo. Depois troque C e F no treino de trocas. Enquanto o F não sai, use o <b>F7M</b> (sem pestana) ou a meia pestana só nas cordas 1 e 2.</p>` }
    ],
    quiz: [
      { p: 'Qual parte do dedo 1 faz a pestana?', o: ['A lateral, mais dura', 'A ponta', 'A parte mole da frente'], c: 0, e: 'A lateral é mais firme e tem menos dobrinhas.' },
      { p: 'Desenho do F com a pestana na casa 3. Que acorde soa?', o: ['F#', 'G', 'A'], c: 1, e: 'Na 6ª corda a casa 3 é o Sol.' },
      { p: 'Desenho do Bm com a pestana na casa 5. Que acorde soa?', o: ['Dm', 'Em', 'Cm'], c: 0, e: 'Na 5ª corda a casa 5 é o Ré.' }
    ]
  },
  {
    id: 'dedilhado', nivel: 'intermediario', titulo: 'Dedilhados', resumo: 'p, i, m, a: cada dedo numa corda, o baixo certo de cada acorde e três dedilhados clássicos.', min: 6,
    secoes: [
      { titulo: 'Os dedos da mão direita', visual: 'pima', html: `<p>No dedilhado as cordas são tocadas uma a uma. Cada dedo tem uma letra, que vem do espanhol: <b>p</b> polegar (pulgar), <b>i</b> indicador (índice), <b>m</b> médio (medio), <b>a</b> anelar (anular). O mindinho quase nunca é usado.</p>` },
      { titulo: 'Quem toca o quê', html: `<ul><li><b>p</b>: as cordas graves (6ª, 5ª e 4ª), sempre o <b>baixo</b> do acorde</li><li><b>i</b>: a 3ª corda</li><li><b>m</b>: a 2ª corda</li><li><b>a</b>: a 1ª corda</li></ul>
        <p>Assim a mão fica parada no lugar e só os dedos se mexem.</p>` },
      { titulo: 'O baixo de cada acorde', html: `<p>O polegar começa na corda da <b>fundamental</b>: no <b>E</b>, <b>Em</b> e <b>G</b>, a 6ª corda; no <b>A</b>, <b>Am</b> e <b>C</b>, a 5ª; no <b>D</b> e <b>Dm</b>, a 4ª.</p>` },
      { titulo: 'Três dedilhados', visual: 'dedilhados', html: `<p>Comece pelo mais simples e só passe para o próximo quando o primeiro sair sem olhar para a mão.</p>` },
      { tipo: 'analogia', html: 'Dedilhar é como digitar sem olhar o teclado: cada dedo mora numa tecla. No começo é lento; depois os dedos acham o caminho sozinhos.' },
      { tipo: 'pegadinha', html: 'Não apoie a mão inteira no tampo. O pulso fica solto, um pouco acima das cordas, e os dedos puxam a corda para dentro da mão, não para cima.' }
    ],
    quiz: [
      { p: 'Qual dedo toca o baixo?', o: ['i', 'p', 'a'], c: 1, e: 'p = polegar, sempre no baixo do acorde.' },
      { p: 'No acorde C, em qual corda o polegar começa?', o: ['6ª', '5ª', '4ª'], c: 1, e: 'A fundamental do C (Dó) está na 5ª corda, casa 3.' },
      { p: 'O “a” do dedilhado é…', o: ['O anelar', 'O polegar', 'O médio'], c: 0, e: 'p polegar, i indicador, m médio, a anelar.' }
    ]
  },
  {
    id: 'campo', nivel: 'intermediario', titulo: 'Campo harmônico e transposição', resumo: 'Os 7 acordes de cada tom, os graus em números romanos, como mudar o tom e as contas do capotraste.', min: 7,
    secoes: [
      { titulo: 'A família de cada tom', visual: 'campoC', html: `<p>Os acordes de uma música quase sempre saem da mesma <b>família</b>: o campo harmônico. Ele nasce da escala maior: cada nota da escala vira a fundamental de um acorde feito só com notas da escala.</p>
        <p>Em Dó maior: <b>C, Dm, Em, F, G, Am e Bm7(b5)</b>.</p>` },
      { titulo: 'Os graus', html: `<p>Cada acorde ganha um número romano pelo lugar que ocupa: <b>I, ii, iii, IV, V, vi, vii</b>. Maiúsculo = maior, minúsculo = menor. A fórmula é igual em todo tom maior: <b>maior, menor, menor, maior, maior, menor, meio-diminuto</b>.</p>` },
      { titulo: 'Os mais importantes', html: `<ul><li><b>I</b> (tônica): a casa, onde a música descansa.</li><li><b>IV</b> (subdominante): o passeio, se afasta sem tensão.</li>
        <li><b>V</b> (dominante): a tensão que pede para voltar ao I. Com sétima (V7), pede ainda mais.</li><li><b>vi</b>: o parente triste do I, com quase as mesmas notas.</li></ul>` },
      { tipo: 'analogia', html: 'O campo harmônico é uma casa: o I é a sala, o IV e o V são os quartos e o vi é a varanda. Dá para passear por todos os cômodos, mas a música sempre volta para a sala.' },
      { titulo: 'Mudando o tom', visual: 'transpor', html: `<p>Pense em graus, não em letras. A sequência <b>I, vi, IV, V</b> em Dó é C, Am, F, G; em Sol é G, Em, C, D; em Ré é D, Bm, G, A. Mudar o tom é trocar a linha da tabela. O botão <b>Tom</b> de cada música faz essa conta por você.</p>` },
      { titulo: 'As contas do capotraste', html: `<p>Cada casa do capotraste sobe meio tom. Com o capo na casa 2, o desenho do <b>G</b> soa <b>A</b> e o do <b>C</b> soa <b>D</b>. Para tocar uma música em Lá usando desenhos de Sol: capo na casa 2. Conta: o que soa = desenho + casas do capo.</p>` },
      { tipo: 'pegadinha', html: 'Um tom acima são 2 casas. Subir um tom a partir do G dá A, e não G#.' },
      { titulo: 'Tom menor', html: `<p>Toda música menor tem um irmão maior com as mesmas notas: o <b>relativo</b>. Lá menor é relativo de Dó maior; Mi menor, de Sol maior. O campo de Lá menor usa os acordes de Dó começando pelo Am, e quase sempre troca o Em por <b>E7</b>, que puxa com mais força para o Am.</p>` }
    ],
    quiz: [
      { p: 'Qual é o V de Ré maior?', o: ['G', 'A', 'Bm'], c: 1, e: 'D (I), Em (ii), F#m (iii), G (IV), A (V).' },
      { p: 'I, vi, IV, V em Sol maior', o: ['G, Em, C, D', 'G, Am, C, D', 'G, Em, D, C'], c: 0, e: 'I = G, vi = Em, IV = C, V = D.' },
      { p: 'Capo na casa 3 e desenho de Em. Que acorde soa?', o: ['Gm', 'F#m', 'Em'], c: 0, e: 'E + 3 casas = G: soa Sol menor.' }
    ]
  },
  /* ===== Avançado ===== */
  {
    id: 'escalas', nivel: 'avancado', titulo: 'Escalas e pentatônica', resumo: 'A escala maior, a menor natural e a pentatônica: o mapa para solar e improvisar.', video: 'pentatonica', min: 7,
    secoes: [
      { titulo: 'A escala maior', visual: 'escalaMaior', html: `<p>A escala maior tem 7 notas separadas por tons (T, 2 casas) e semitons (S, 1 casa) nesta ordem: <b>T T S T T T S</b>. Começando no Dó: C D E F G A B C. Com a mesma fórmula, começando em qualquer nota, você monta a escala maior daquele tom.</p>` },
      { titulo: 'A menor natural', html: `<p>Comece a escala de Dó pelo Lá: A B C D E F G A. É a <b>escala menor natural</b> de Lá, com a fórmula <b>T S T T S T T</b>. Mesmas notas, outro ponto de partida, outro clima.</p>` },
      { titulo: 'A pentatônica', visual: 'penta', html: `<p>Tire da escala menor as duas notas mais “perigosas”, a 2ª e a 6ª, e sobra a <b>pentatônica menor</b>, de 5 notas: em Lá, <b>A C D E G</b>. Quase nenhuma nota soa errada sobre os acordes do tom. É a escala do blues, do rock e de muitos solos de MPB.</p>` },
      { titulo: 'A caixa da casa 5', html: `<p>No braço, a pentatônica de Lá forma uma caixa a partir da casa 5, com duas notas em cada corda. Nas cordas 6, 2 e 1 use os dedos <b>1 e 4</b> (casas 5 e 8); nas cordas 5, 4 e 3, os dedos <b>1 e 3</b> (casas 5 e 7).</p>
        <p>Mova a caixa e o tom muda junto: a partir da casa 3 é a pentatônica de Sol menor; a partir da casa 12, a de Mi menor.</p>` },
      { tipo: 'analogia', html: 'A pentatônica é como um piano só com as teclas pretas: quase qualquer combinação soa bem. Por isso é a primeira escala de quem quer improvisar.' },
      { titulo: 'Pentatônica maior', html: `<p>As mesmas 5 notas começando pelo Dó (C D E G A) formam a <b>pentatônica maior</b> de Dó. A caixa de Lá menor serve para solar em Dó maior: é o mesmo truque dos tons relativos.</p>` },
      { tipo: 'pegadinha', html: 'Escala não é música. Ao improvisar, use poucas notas, repita ideias e deixe espaços: uma frase de 3 notas bem tocada vale mais que a escala inteira correndo.' }
    ],
    quiz: [
      { p: 'Qual é a fórmula da escala maior?', o: ['T T S T T T S', 'T S T T S T T', 'T T T S T T S'], c: 0, e: 'Tom, tom, semitom, tom, tom, tom, semitom.' },
      { p: 'Quais são as notas da pentatônica de Lá menor?', o: ['A C D E G', 'A B C E F', 'A C# E F# G'], c: 0, e: 'É a menor natural sem a 2ª (Si) e a 6ª (Fá).' },
      { p: 'A caixa da pentatônica a partir da casa 3 da 6ª corda é de…', o: ['Sol menor', 'Lá menor', 'Fá menor'], c: 0, e: 'Casa 3 da 6ª corda = Sol.' }
    ]
  },
  {
    id: 'harmonia', nivel: 'avancado', titulo: 'Harmonia: tensão e resolução', resumo: 'Por que alguns acordes pedem outros: o V7, o II–V–I, as dominantes secundárias e o diminuto.', min: 7,
    secoes: [
      { titulo: 'Tensão e resolução', visual: 'resolucao', html: `<p>Música é sair de casa e voltar. O acorde <b>V7</b> (G7, em Dó) tem duas notas que brigam, o Si e o Fá, a 6 casas uma da outra: o <b>trítono</b>. O ouvido pede alívio: o Si sobe para o Dó e o Fá desce para o Mi. Resultado: o acorde C.</p>` },
      { titulo: 'O II–V–I', visual: 'iiVI', html: `<p>Antes do V7, a música costuma passar pelo <b>ii</b>, um acorde menor com sétima. Em Dó: <b>Dm7, G7, C7M</b>. É a frase mais tocada da bossa nova e do jazz. Em Sol: Am7, D7, G7M. Em Ré: Em7, A7, D7M.</p>` },
      { titulo: 'Dominantes secundárias', visual: 'dominantes', html: `<p>Qualquer acorde do campo pode ganhar o seu próprio V7, emprestado de outro tom. Em Dó: <b>A7</b> leva ao Dm, <b>E7</b> leva ao Am, <b>D7</b> leva ao G e <b>C7</b> leva ao F. É o tempero do samba e do choro: C, A7, Dm, G7, C.</p>` },
      { tipo: 'analogia', html: 'Uma dominante secundária é uma placa de “vire à direita” antes da esquina: o ouvido já sabe para onde a música vai e gosta de ter acertado.' },
      { titulo: 'O diminuto de passagem', visual: 'diminuto', html: `<p>O acorde <b>°</b> liga dois acordes subindo o baixo meio tom: <b>C, C#°, Dm</b> ou <b>F, F#°, G</b>. Ele funciona como um V7 disfarçado do acorde seguinte.</p>` },
      { titulo: 'O ii–V em tom menor', html: `<p>No tom menor o ii vira <b>meio-diminuto</b>: em Lá menor, <b>Bm7(b5), E7, Am</b>. É o som de boleros, sambas-canção e muitos clássicos da MPB.</p>` },
      { tipo: 'pegadinha', html: 'Nem todo acorde com 7 é dominante: <b>Dm7</b> e <b>C7M</b> têm sétima e são acordes de repouso. Dominante é o acorde <b>maior com sétima menor</b> (o X7), como G7 e A7.' }
    ],
    quiz: [
      { p: 'Qual é o II–V–I de Sol maior?', o: ['Am7, D7, G7M', 'Dm7, G7, C7M', 'Em7, A7, D7M'], c: 0, e: 'ii = Am7, V = D7, I = G7M.' },
      { p: 'Em Dó maior, qual acorde prepara o Am?', o: ['E7', 'A7', 'D7'], c: 0, e: 'O V de Lá é o Mi: E7.' },
      { p: 'Quais notas formam o trítono do G7?', o: ['Si e Fá', 'Sol e Ré', 'Dó e Mi'], c: 0, e: 'Si (a terça) e Fá (a sétima), a 6 casas uma da outra.' }
    ]
  },
  {
    id: 'bossa', nivel: 'avancado', titulo: 'Acordes da bossa nova', resumo: 'Sétimas, nonas e treze: os desenhos, a batida de João Gilberto e a condução de vozes.', min: 7,
    secoes: [
      { titulo: 'O som da bossa', visual: 'bossaAcordes', html: `<p>A bossa nova nasceu no Rio no fim dos anos 1950, com Tom Jobim, Vinicius de Moraes e o violão de <b>João Gilberto</b>. Os acordes ganham notas extras, as <b>tensões</b>: 7M, 9 e 13. Elas deixam a harmonia macia e cheia de cor.</p>` },
      { titulo: 'Os acordes mais usados', html: `<ul><li><b>7M(9)</b>, como C7M(9): repouso com brilho.</li><li><b>m7(9)</b>, como Am7(9): menor macio.</li>
        <li><b>7(9)</b>: o dominante mais suave.</li><li><b>7(13)</b>, como G7(13): o dominante com o sabor da bossa.</li>
        <li><b>m7(b5)</b> e <b>°</b>: para os caminhos em tom menor e as passagens.</li></ul>` },
      { titulo: 'A batida de João Gilberto', visual: 'ritmoBossa', html: `<p>O polegar faz o baixo nos tempos, regular como um relógio, imitando o surdo. Os dedos tocam as cordas agudas na <b>síncope</b>, quase sempre antes ou depois do polegar, imitando o tamborim. Toque baixinho: a bossa é falada, não gritada.</p>` },
      { titulo: 'Condução de vozes', html: `<p>Nos acordes da bossa as notas quase não pulam: de um acorde para o outro, cada voz anda o mínimo possível. Em <b>Dm7(9), G7(13), C7M(9)</b> o Fá fica parado e depois desce para o Mi, e o Dó desce para o Si. Isso se chama <b>condução de vozes</b> e é o segredo do som “liso”.</p>` },
      { tipo: 'analogia', html: 'Na bossa o violão é uma pequena orquestra: o polegar é o contrabaixo e os dedos são os sopros, sempre entrando na hora inesperada.' },
      { tipo: 'pegadinha', html: 'Não force todas as tensões ao mesmo tempo. Um acorde com 7M e 9 já é bossa. O excesso embola o som, principalmente nas cordas graves.' }
    ],
    quiz: [
      { p: 'Quem criou a batida de violão da bossa nova?', o: ['João Gilberto', 'Luiz Gonzaga', 'Jorge Ben Jor'], c: 0, e: 'João Gilberto, no fim dos anos 1950.' },
      { p: 'Na batida da bossa, o polegar…', o: ['Marca os tempos, regular', 'Faz a síncope', 'Fica parado'], c: 0, e: 'O polegar é o relógio; os dedos fazem a síncope.' },
      { p: 'Qual acorde é um dominante com sabor de bossa?', o: ['G7(13)', 'C7M', 'Am'], c: 0, e: 'O 13 sobre o G7 é a marca dos dominantes na bossa.' }
    ]
  },
  {
    id: 'tecnicas', nivel: 'avancado', titulo: 'Técnicas de mão esquerda', resumo: 'Hammer-on, pull-off, slide, bend, vibrato e abafado: como ligar as notas e dar voz à melodia.', min: 6,
    secoes: [
      { titulo: 'Ligados: hammer-on e pull-off', visual: 'ligados', html: `<p>No <b>hammer-on</b> (h) você toca uma nota e “martela” outro dedo numa casa à frente, sem tocar de novo: a segunda nota nasce da batida do dedo. No <b>pull-off</b> (p) é o contrário: com os dois dedos apertados, puxe o da frente num pequeno peteleco, e a nota de trás soa.</p>` },
      { titulo: 'Slide, bend e vibrato', visual: 'slideBend', html: `<p>No <b>slide</b> (/ para subir, \\ para descer) o dedo escorrega de uma casa para outra sem soltar a corda. No <b>bend</b> (b) você empurra a corda para o lado e a nota sobe: 7b9 sobe um tom, como se fosse a casa 9. No violão de nylon o bend é pequeno: meio tom já soa bonito. O <b>vibrato</b> (~) é um bend bem pequeno e repetido, que deixa a nota cantando.</p>` },
      { tipo: 'analogia', html: 'Ligados são como falar sem parar para respirar: as notas saem emendadas, numa frase só. Tocar cada nota com a mão direita é como falar sílaba por sílaba.' },
      { tipo: 'pegadinha', html: 'No hammer-on a força vem do dedo caindo rápido e perto do traste, não de apertar muito. No pull-off, puxe a corda um pouquinho para baixo antes de soltar: se só levantar o dedo, a nota morre.' },
      { titulo: 'Abafado e tapa', visual: 'abafado', html: `<p>Com a lateral da mão direita encostada nas cordas, bem perto do cavalete, a batida fica curta e grave: o <b>abafado</b>. No pagode e no samba-rock, um <b>tapa</b> rápido nas cordas faz o mesmo efeito, como a caixa de uma bateria.</p>` }
    ],
    quiz: [
      { p: 'Na tablatura, o que significa 5h7?', o: ['Toque a casa 5 e martele a 7', 'Toque a 5 e a 7 juntas', 'Deslize da 5 até a 7'], c: 0, e: 'h = hammer-on.' },
      { p: '7b9 quer dizer…', o: ['Empurrar a corda na casa 7 até soar a nota da casa 9', 'Tocar a casa 7 e depois a 9', 'Casa 7 com bemol'], c: 0, e: 'b = bend: a nota sobe 2 casas, um tom.' },
      { p: 'No pull-off, a nota de trás soa porque…', o: ['O dedo da frente puxa a corda ao sair', 'A mão direita toca de novo', 'O polegar ajuda'], c: 0, e: 'É um pequeno peteleco do dedo que sai.' }
    ]
  },
  {
    id: 'ouvido', nivel: 'avancado', titulo: 'Tirando música de ouvido', resumo: 'Um método em 5 passos: a casa, o baixo, a família, a forma e o ritmo.', min: 6,
    secoes: [
      { titulo: 'Por que vale a pena', html: `<p>Cifras da internet erram muito. Tirar de ouvido treina a escuta e faz você entender a música por dentro. Comece por músicas simples, com 3 ou 4 acordes.</p>` },
      { titulo: '1. Ache a casa', html: `<p>Ouça o fim de uma parte, onde a música descansa. Cante essa nota e procure no violão, na 6ª ou na 5ª corda. Ela costuma ser o <b>I</b> do tom (ou o vi, se a música for triste).</p>` },
      { titulo: '2. Siga o baixo', html: `<p>A nota mais grave quase sempre é a <b>letra do acorde</b>. Acompanhe o baixo nota por nota e anote: Dó… Lá… Fá… Sol…</p>` },
      { titulo: '3. Use a família', visual: 'campoC', html: `<p>Com o tom em mãos, só 6 acordes são candidatos fortes. Se o baixo é Lá e a música está em Dó, o acorde provavelmente é <b>Am</b>. Teste o maior e o menor e fique com o que combina com a melodia.</p>` },
      { titulo: '4. A forma', html: `<p>Músicas repetem partes: introdução, primeira parte, refrão. Tire uma parte inteira e depois só confira as repetições.</p>` },
      { titulo: '5. O ritmo', html: `<p>Por último, a batida: ouça a percussão e o violão da gravação e bata palmas junto antes de tocar.</p>` },
      { tipo: 'analogia', html: 'É como montar um quebra-cabeça: primeiro as bordas (a casa e o baixo), depois o meio (os acordes) e por fim os detalhes (o ritmo e os enfeites).' },
      { tipo: 'pegadinha', html: 'Não procure o acorde pela melodia da voz: a voz passeia por várias notas em cima do mesmo acorde. O baixo é muito mais confiável.' }
    ],
    quiz: [
      { p: 'Qual é a pista mais confiável para descobrir o acorde?', o: ['O baixo', 'A melodia da voz', 'A bateria'], c: 0, e: 'A nota mais grave quase sempre é a letra do acorde.' },
      { p: 'A música está em Sol e o baixo está em Mi. Qual acorde é mais provável?', o: ['Em', 'E', 'E7'], c: 0, e: 'Em é o vi de Sol maior: está na família.' },
      { p: 'Onde a música costuma descansar?', o: ['No acorde I', 'No V7', 'No diminuto'], c: 0, e: 'O I é a casa do tom.' }
    ]
  },
  {
    id: 'samba2', nivel: 'avancado', titulo: 'Samba e choro: baixarias e partido-alto', resumo: 'As baixarias que ligam os acordes, o violão de 7 cordas, o partido-alto e o pagode de fundo de quintal.', min: 6,
    secoes: [
      { titulo: 'As baixarias', visual: 'baixoAnda', html: `<p>No samba e no choro, o violão faz frases no grave que ligam um acorde ao outro: as <b>baixarias</b>. Elas andam por notas vizinhas da escala, subindo ou descendo até a fundamental do próximo acorde.</p>` },
      { titulo: 'O violão de 7 cordas', html: `<p>Para ter ainda mais grave, o choro usa o <b>violão de 7 cordas</b>, com uma corda a mais abaixo da 6ª, afinada em Dó ou Si. Dino 7 Cordas e Raphael Rabello são dois mestres do instrumento.</p>` },
      { titulo: 'O partido-alto', html: `<p>O <b>partido-alto</b> é um samba de roda em que o coro canta um refrão e os <b>versadores</b> improvisam versos, muitas vezes desafiando uns aos outros. Ganhou força no Rio, em torno da escola Império Serrano, com nomes como Candeia, Clementina de Jesus e Aniceto do Império. O pandeiro dá um tapa seco no centro do couro, que marca o estilo.</p>` },
      { titulo: 'Do fundo de quintal ao pagode', visual: 'ritmoPagode', html: `<p>Nos anos 1970 e 1980, as rodas do bloco <b>Cacique de Ramos</b> juntaram o partido-alto, o banjo com braço de cavaquinho, o tantã e o repique de mão. Dali saiu o grupo <b>Fundo de Quintal</b> e o som que o Brasil passou a chamar de pagode, de Zeca Pagodinho, Jorge Aragão e Arlindo Cruz.</p>` },
      { tipo: 'analogia', html: 'A baixaria é uma conversa entre o violão e o cantor: quando a voz respira, o violão responde lá embaixo.' },
      { tipo: 'pegadinha', html: 'A baixaria tem que chegar na fundamental do próximo acorde <b>no tempo forte</b>. Se ela atrasar, o acorde novo entra sem chão.' }
    ],
    quiz: [
      { p: 'O que é uma baixaria?', o: ['Uma frase no grave que liga dois acordes', 'Uma batida mais forte', 'Um acorde menor'], c: 0, e: 'É o violão falando nos graves entre os acordes.' },
      { p: 'No partido-alto, quem improvisa os versos?', o: ['Os versadores', 'O coro', 'O pandeiro'], c: 0, e: 'O coro canta o refrão e os versadores improvisam.' },
      { p: 'De qual roda saiu o grupo Fundo de Quintal?', o: ['Do Cacique de Ramos', 'Da Portela', 'Do Clube da Esquina'], c: 0, e: 'Das rodas do Cacique de Ramos, no Rio.' }
    ]
  }
];

/* ---------- Mini vídeos ----------
   Vídeos curtos (30 a 60 s) feitos para o app, na pasta videos/.
   O vídeo traz as imagens e o violão; a voz do instrutor fica num arquivo
   separado para cada voz (videos/vozes/<voz>/<vídeo>.webm), alinhado com o
   vídeo. O app toca os dois juntos, então dá para trocar a voz a qualquer hora. */
const VIDEOS = {
  partes: { titulo: 'As partes do violão', arquivo: 'videos/partes.mp4', nivel: 'iniciante' },
  cordas: { titulo: 'As 6 cordas', arquivo: 'videos/cordas.mp4', nivel: 'iniciante' },
  afinar: { titulo: 'Como afinar', arquivo: 'videos/afinar.mp4', nivel: 'iniciante' },
  postura: { titulo: 'Postura e mãos', arquivo: 'videos/postura.mp4', nivel: 'iniciante' },
  diagrama: { titulo: 'Como ler um acorde', arquivo: 'videos/diagrama.mp4', nivel: 'iniciante' },
  batida: { titulo: 'A batida', arquivo: 'videos/batida.mp4', nivel: 'iniciante' },
  tab: { titulo: 'Como ler tablatura', arquivo: 'videos/tab.mp4', nivel: 'iniciante' },
  jogo: { titulo: 'Como funciona o jogo', arquivo: 'videos/jogo.mp4', nivel: 'iniciante' },
  cifra: { titulo: 'A cifra', arquivo: 'videos/cifra.mp4', nivel: 'iniciante' },
  estudar: { titulo: 'Como estudar', arquivo: 'videos/estudar.mp4', nivel: 'iniciante' },
  samba: { titulo: 'Ritmos brasileiros', arquivo: 'videos/samba.mp4', nivel: 'intermediario' },
  pestana: { titulo: 'A pestana', arquivo: 'videos/pestana.mp4', nivel: 'intermediario' },
  pentatonica: { titulo: 'A pentatônica', arquivo: 'videos/pentatonica.mp4', nivel: 'avancado' }
};

/* Vozes do instrutor (geradas com o Kokoro, um modelo de voz aberto) */
const VOZES_INSTRUTOR = {
  feminina: { nome: 'Feminina', desc: 'Voz de mulher, clara e calma' },
  masculina: { nome: 'Masculina', desc: 'Voz de homem, tom médio' },
  grave: { nome: 'Grave', desc: 'Voz de homem bem grave' },
  fina: { nome: 'Fina', desc: 'Voz de mulher mais aguda' }
};
const vozAtual = () => (VOZES_INSTRUTOR[S.cfg.voz] ? S.cfg.voz : 'feminina');
const arquivoDaVoz = (voz, id) => `videos/vozes/${voz}/${id}.webm`;
function seletorVoz(classe = '') {
  return `<div class="segmentado ${classe}" role="group" aria-label="Voz do instrutor">${Object.entries(VOZES_INSTRUTOR).map(([k, v]) => `<button type="button" data-voz="${k}" aria-pressed="${vozAtual() === k}">${v.nome}</button>`).join('')}</div>`;
}

function videoHTML(id, { auto = false } = {}) {
  const v = VIDEOS[id];
  if (!v) return '';
  return `<figure class="video" data-video-id="${id}"><video src="${v.arquivo}" poster="${v.arquivo.replace('.mp4', '.jpg')}" controls playsinline preload="none" ${auto ? 'autoplay' : ''}></video>
    <audio preload="none" data-voz-atual="${vozAtual()}" src="${arquivoDaVoz(vozAtual(), id)}"></audio>
    <figcaption><span>${esc(v.titulo)}</span><span class="vd-voz">Voz: ${seletorVoz('mini')}</span></figcaption></figure>`;
}
/* A narração é um arquivo pequeno: o app o carrega inteiro na memória (um "blob").
   Assim dá para pular para qualquer ponto na hora, mesmo onde o servidor não
   entrega pedaços do arquivo (é o que permite avançar o vídeo e trocar de voz no meio). */
const _vozNaMemoria = new Map();
function carregarVoz(voz, id) {
  const url = arquivoDaVoz(voz, id);
  if (!_vozNaMemoria.has(url)) {
    _vozNaMemoria.set(url, fetch(url).then(r => (r.ok ? r.blob() : Promise.reject(r.status))).then(b => URL.createObjectURL(b)).catch(() => { _vozNaMemoria.delete(url); return url; }));
  }
  return _vozNaMemoria.get(url);
}
/* Liga a voz ao vídeo: play, pausa, avançar, velocidade e volume do vídeo valem para a voz.
   A cada atualização do vídeo a voz é conferida e, se escorregar mais de 0,2 s, volta para o lugar. */
function ligarVideos(raiz) {
  raiz.querySelectorAll('figure.video:not([data-ligado])').forEach(fig => {
    fig.dataset.ligado = '1';
    const v = fig.querySelector('video'), a = fig.querySelector('audio'), id = fig.dataset.videoId;
    if (!v || !a) return;
    // troca o arquivo da voz pelo que está na memória (e, se o vídeo já está tocando, continua do mesmo ponto)
    const usarVoz = voz => {
      a.dataset.vozAtual = voz;
      return carregarVoz(voz, id).then(u => {
        if (a.dataset.vozAtual !== voz || a.src === u) return;
        const tocando = !v.paused;
        a.pause(); a.src = u; a.load();
        if (tocando) tocar(); else irPara(v.currentTime);
      });
    };
    const irPara = t => {
      if (a.readyState >= 1) { try { a.currentTime = t; } catch (e) {} }
      else a.addEventListener('loadedmetadata', () => { try { a.currentTime = v.currentTime; } catch (e) {} }, { once: true });
    };
    const tocar = () => { a.playbackRate = v.playbackRate; a.volume = v.volume; a.muted = v.muted; if (a.readyState < 1) a.preload = 'auto'; irPara(v.currentTime); a.play().catch(() => {}); };
    v.addEventListener('play', tocar);
    v.addEventListener('playing', () => { if (a.paused) tocar(); });
    v.addEventListener('pause', () => a.pause());
    v.addEventListener('waiting', () => a.pause());
    v.addEventListener('ended', () => a.pause());
    v.addEventListener('seeking', () => irPara(v.currentTime));
    v.addEventListener('ratechange', () => { a.playbackRate = v.playbackRate; });
    v.addEventListener('volumechange', () => { a.volume = v.volume; a.muted = v.muted; });
    v.addEventListener('timeupdate', () => { if (!v.paused && a.readyState >= 1 && Math.abs(a.currentTime - v.currentTime) > 0.2) irPara(v.currentTime); });
    fig.querySelectorAll('button[data-voz]').forEach(b => b.addEventListener('click', () => {
      S.cfg.voz = b.dataset.voz; Store.salvar();
      document.querySelectorAll('button[data-voz]').forEach(x => x.setAttribute('aria-pressed', x.dataset.voz === S.cfg.voz));
      usarVoz(vozAtual());
    }));
    usarVoz(vozAtual());
  });
}
// Amostra de uma voz (nos Ajustes)
let amostraVoz = null;
function ouvirAmostraVoz(voz) {
  try { amostraVoz?.pause(); } catch (e) {}
  amostraVoz = new Audio(arquivoDaVoz(voz, 'amostra'));
  amostraVoz.play().catch(() => {});
}
function abrirVideo(id) {
  const v = VIDEOS[id];
  if (!v) return;
  abrirJanela(v.titulo, videoHTML(id, { auto: true }), () => { $('#janela-corpo')?.querySelectorAll('audio').forEach(a => a.pause()); });
  $('#janela').classList.add('janela-video');
  ligarVideos($('#janela-corpo'));
}

/* ---------- Leitor de apostila ---------- */
function abrirApostila(id) {
  const a = APOSTILAS.find(x => x.id === id);
  if (!a) return;
  const corpo = a.secoes.map(s => {
    if (s.tipo === 'analogia') return `<aside class="ap-caixa analogia"><b>Analogia</b><p>${s.html}</p></aside>`;
    if (s.tipo === 'pegadinha') return `<aside class="ap-caixa pegadinha"><b>Pegadinha</b><p>${s.html}</p></aside>`;
    if (s.tipo === 'curiosidade') return `<aside class="ap-caixa curiosidade"><b>Curiosidade</b><p>${s.html}</p></aside>`;
    return `<section class="ap-secao"><h3>${esc(s.titulo)}</h3>${s.visual ? `<div class="ap-visual">${DESENHOS[s.visual]()}</div>` : ''}${s.html}</section>`;
  }).join('');
  abrirJanela(a.titulo, `
    <article class="apostila">
      <p class="ap-resumo">${esc(a.resumo)}</p>
      ${a.video ? videoHTML(a.video) : ''}
      ${corpo}
      <section class="ap-teste"><h3>Teste rápido</h3><div id="ap-quiz"></div></section>
    </article>`);
  $('#janela').classList.add('cheia');
  const raiz = $('#janela-corpo');
  ligarSons(raiz);
  ligarVideos(raiz);
  montarQuiz($('#ap-quiz'), a.quiz, acertos => {
    S.apostilas = S.apostilas || {};
    const antes = S.apostilas[a.id] || 0;
    S.apostilas[a.id] = Math.max(antes, acertos);
    if (!antes) ganharXP(15, 'apostila lida');
    Store.salvar();
  });
}

// Quiz que corrige na hora (uma pergunta por vez)
function montarQuiz(area, perguntas, aoFim) {
  let i = 0, acertos = 0;
  const mostrar = () => {
    if (i >= perguntas.length) {
      area.innerHTML = `<div class="qz-fim"><b>${acertos} de ${perguntas.length}</b><span>${acertos === perguntas.length ? 'Tudo certo!' : 'Releia as partes que ficaram em dúvida.'}</span><button class="btn mini" id="qz-de-novo">Refazer</button></div>`;
      area.querySelector('#qz-de-novo').addEventListener('click', () => { i = 0; acertos = 0; mostrar(); });
      aoFim?.(acertos);
      return;
    }
    const q = perguntas[i];
    area.innerHTML = `<div class="qz"><p class="qz-num">Pergunta ${i + 1} de ${perguntas.length}</p><p class="qz-p">${esc(q.p)}</p>
      <div class="qz-opcoes">${q.o.map((o, k) => `<button class="opcao" data-k="${k}">${esc(o)}</button>`).join('')}</div><p class="qz-exp" aria-live="polite"></p></div>`;
    area.querySelectorAll('[data-k]').forEach(b => b.addEventListener('click', () => {
      if (area.querySelector('.opcao[disabled]')) return;
      const ok = +b.dataset.k === q.c;
      if (ok) acertos++;
      area.querySelectorAll('[data-k]').forEach(x => { x.disabled = true; if (+x.dataset.k === q.c) x.classList.add('certa'); else if (x === b) x.classList.add('errada'); });
      area.querySelector('.qz-exp').innerHTML = `<b>${ok ? 'Isso!' : 'Quase.'}</b> ${esc(q.e)} <button class="btn mini" id="qz-prox">${i + 1 < perguntas.length ? 'Próxima' : 'Ver resultado'}</button>`;
      vibrar(ok ? 12 : [8, 40, 8]);
      area.querySelector('#qz-prox').addEventListener('click', () => { i++; mostrar(); });
    }));
  };
  mostrar();
}
