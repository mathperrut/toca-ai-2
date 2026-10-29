/* =========================================================
   TOCA AÍ — aprender.js
   Tudo o que ENSINA, no estilo dos apps de violão para iniciantes:
   1. Desenho de acorde para iniciante (cor por dedo, nome das cordas)
   2. Professor de acordes: ensina DEDO A DEDO e confere no microfone
   3. Player de lições: uma ideia por tela, botão "Continuar"
   4. Treinos: 1 minuto de trocas e mini afinador
   5. Telas: Aprender (curso, apostilas, treinos), Acordes e boas-vindas
   ========================================================= */
'use strict';

const ORD = ['6ª', '5ª', '4ª', '3ª', '2ª', '1ª'];
const NOME_CORDA = ['Mi grave', 'Lá', 'Ré', 'Sol', 'Si', 'Mi agudo'];

/* ===== 1. Desenho de acorde =====
   Como o violão de pé na sua frente: 6ª corda (a mais grossa) à esquerda.
   passo: mostra só os dedos até esse passo (o atual pulsa). */
function passosDoAcorde(nome) {
  const a = acordePorNome(nome);
  if (!a) return [];
  const out = [];
  if (a.barre) {
    const cs = a.frets.map((f, i) => (f === a.barre ? i : -1)).filter(i => i >= 0);
    if (cs.length > 1) out.push({ dedo: 1, casa: a.barre, cordas: cs, pestana: true });
  }
  a.frets.forEach((f, i) => {
    const d = a.fingers[i] || 1;
    if (f > 0 && !(out[0]?.pestana && f === a.barre && d === 1)) out.push({ dedo: d, casa: f, cordas: [i] });
  });
  // junta o mesmo dedo em várias cordas (ex.: dedo 3 deitado)
  const junto = [];
  for (const p of out.sort((x, y) => x.dedo - y.dedo || x.cordas[0] - y.cordas[0])) {
    const ant = junto.at(-1);
    if (ant && !ant.pestana && ant.dedo === p.dedo && ant.casa === p.casa) ant.cordas.push(...p.cordas);
    else junto.push({ ...p, cordas: [...p.cordas] });
  }
  return junto;
}
function textoPasso(p) {
  const nome = `<b>Dedo ${p.dedo}</b> (${NOMES_DEDOS[p.dedo] || 'dedo'})`;
  if (p.pestana || p.cordas.length > 1) {
    const de = Math.min(...p.cordas), ate = Math.max(...p.cordas);
    return `${nome} <b>deitado</b> na <b>casa ${p.casa}</b>, cobrindo da ${ORD[de]} até a ${ORD[ate]} corda.`;
  }
  const c = p.cordas[0];
  return `${nome} na <b>casa ${p.casa}</b> da <b>${ORD[c]} corda</b> (${NOME_CORDA[c]}).`;
}
function diagramaAcorde(nome, { tam = 'md', passo = null, rotulos = true } = {}) {
  const a = acordePorNome(nome);
  if (!a) return `<div class="diag-vazio diag-${tam}">${esc(nome)}</div>`;
  const W = 170, x0 = 30, dx = 22, y0 = 34, dy = 34, casas = 4, H = y0 + casas * dy + (rotulos ? 30 : 10);
  const usadas = a.frets.filter(f => f > 0);
  const base = usadas.length && Math.max(...usadas) > casas ? Math.min(...usadas) : 1;
  const passos = passosDoAcorde(nome);
  const visivel = k => passo === null || k <= passo;
  const xC = i => x0 + i * dx, yF = f => y0 + (f - base + 0.5) * dy;
  let s = `<svg class="diag diag-${tam}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Acorde ${esc(nome)}">`;
  for (let k = 0; k <= casas; k++) s += `<line class="${k === 0 && base === 1 ? 'dg-pestana' : 'dg-traste'}" x1="${x0}" x2="${x0 + 5 * dx}" y1="${y0 + k * dy}" y2="${y0 + k * dy}"/>`;
  for (let i = 0; i < 6; i++) s += `<line class="dg-corda" style="stroke-width:${2.4 - i * 0.28}" x1="${xC(i)}" x2="${xC(i)}" y1="${y0}" y2="${y0 + casas * dy}"/>`;
  if (base > 1) s += `<text class="dg-casa" x="${x0 - 9}" y="${yF(base) + 4}" text-anchor="end">${base}ª</text>`;
  a.frets.forEach((f, i) => {
    if (f < 0) s += `<text class="dg-x" x="${xC(i)}" y="${y0 - 11}" text-anchor="middle">×</text>`;
    else if (f === 0) s += `<circle class="dg-solta" cx="${xC(i)}" cy="${y0 - 15}" r="5.5"/>`;
  });
  passos.forEach((p, k) => {
    if (!visivel(k)) return;
    const atual = passo !== null && k === passo, cls = `dg-dedo d${p.dedo}${atual ? ' dg-atual' : ''}`;
    if (p.cordas.length > 1) {
      const x1 = xC(Math.min(...p.cordas)), x2 = xC(Math.max(...p.cordas));
      s += `<rect class="${cls}" x="${x1 - 10}" y="${yF(p.casa) - 10}" width="${x2 - x1 + 20}" height="20" rx="10"/>`;
      s += `<text class="dg-num" x="${(x1 + x2) / 2}" y="${yF(p.casa) + 4.5}" text-anchor="middle">${p.dedo}</text>`;
    } else {
      s += `<circle class="${cls}" cx="${xC(p.cordas[0])}" cy="${yF(p.casa)}" r="10.5"/>`;
      s += `<text class="dg-num" x="${xC(p.cordas[0])}" y="${yF(p.casa) + 4.5}" text-anchor="middle">${p.dedo}</text>`;
    }
  });
  if (rotulos) LETRAS_CORDAS.forEach((l, i) => { s += `<text class="dg-rot" x="${xC(i)}" y="${y0 + casas * dy + 20}" text-anchor="middle">${l === 'e' ? 'E' : l}</text>`; });
  return s + '</svg>';
}
function descricaoAcorde(nome) {
  const n = passosDoAcorde(nome).length;
  return `${nomeAcorde(nome)}, ${n} ${n === 1 ? 'dedo' : 'dedos'}`;
}
// Toca corda por corda (ajuda a achar a corda abafada)
function tocarCordaPorCorda(nome) {
  const a = acordePorNome(nome);
  if (!a) return;
  Som.init();
  let t = Som.agora + 0.05;
  a.frets.forEach((f, i) => { if (f >= 0) { Som.nota(CORDAS_SOLTAS[i] * Math.pow(2, f / 12), t, 0.4, i); t += 0.45; } });
}
function ouvirAcorde(nome) { Som.init(); Som.golpe(nome, Som.agora + 0.03, 'D', 0.34); }

/* O som tem que ser o da imagem:
   uma nota -> só a nota; várias notas -> a sequência; acorde -> o acorde. */
function freqDaCasa(corda, casa) { return CORDAS_SOLTAS[corda] * Math.pow(2, casa / 12); }   // corda 0 = 6ª
function ouvirNota(corda, casa) { Som.init(); Som.nota(freqDaCasa(corda, casa), Som.agora + 0.03, 0.46, corda); }
// aoTocar(i) acende o item i na tela enquanto ele soa (i = -1 quando acaba)
function ouvirSequencia(notas, { passo = 0.45, aoTocar = null } = {}) {
  Som.init();
  const t0 = Som.agora + 0.06;
  notas.forEach(([corda, casa], i) => {
    const t = t0 + i * passo;
    Som.nota(freqDaCasa(corda, casa), t, 0.46, corda);
    if (aoTocar) quandoTocar(t, () => aoTocar(i));
  });
  if (aoTocar) quandoTocar(t0 + notas.length * passo, () => aoTocar(-1));
}
function ouvirAcordes(lista, { passo = 1.1, aoTocar = null } = {}) {
  Som.init();
  const t0 = Som.agora + 0.05;
  lista.forEach((a, i) => { const t = t0 + i * passo; Som.golpe(a, t, 'D', 0.32); if (aoTocar) quandoTocar(t, () => aoTocar(i)); });
  if (aoTocar) quandoTocar(t0 + lista.length * passo, () => aoTocar(-1));
}
// golpes: 'D U D U' (para baixo / para cima) com um acorde
function ouvirGolpes(acorde, golpes, { passo = 0.32, aoTocar = null } = {}) {
  Som.init();
  const t0 = Som.agora + 0.05;
  golpes.forEach((g, i) => { const t = t0 + i * passo; Som.golpe(acorde, t, g, g === 'U' ? 0.24 : 0.32); if (aoTocar) quandoTocar(t, () => aoTocar(i)); });
  if (aoTocar) quandoTocar(t0 + golpes.length * passo, () => aoTocar(-1));
}
// As notas de um passo do professor (um dedo = uma nota; dedo deitado = várias notas).
// Na pestana o desenho mostra o dedo cobrindo todas as cordas do meio, então soam todas.
function notasDoPasso(p) {
  let cordas = [...p.cordas].sort((x, y) => x - y);
  if (p.pestana) { const de = cordas[0], ate = cordas.at(-1); cordas = Array.from({ length: ate - de + 1 }, (_, k) => de + k); }
  return cordas.map(c => [c, p.casa]);
}

/* Acordes aprendidos (pelas lições concluídas ou marcados à mão) */
/* Técnicas de mão esquerda, para ouvir: h hammer-on, p pull-off, s slide,
   b bend (sobe e volta), v vibrato. O slide e o bend mudam a velocidade da
   gravação da nota enquanto ela soa, como o dedo mudando o tamanho da corda. */
function ouvirTecnica(corda, de, para, tipo) {
  Som.init();
  const t = Som.agora + 0.05, f = c => freqDaCasa(corda, c);
  if (tipo === 'h' || tipo === 'p') {
    Som.nota(f(de), t, 0.46, corda, { humano: false });
    Som.nota(f(para), t + 0.45, tipo === 'h' ? 0.32 : 0.28, corda, { humano: false, ligado: true });   // sem a mão direita
    return;
  }
  const s = Som.nota(f(de), t, 0.46, corda, { humano: false });
  const pr = s && s.playbackRate;
  if (!pr) return;
  const r0 = pr.value, r1 = r0 * Math.pow(2, (para - de) / 12);
  if (tipo === 's') { pr.setValueAtTime(r0, t + 0.45); pr.linearRampToValueAtTime(r1, t + 0.6); }
  else if (tipo === 'b') { pr.setValueAtTime(r0, t + 0.35); pr.linearRampToValueAtTime(r1, t + 0.62); pr.setValueAtTime(r1, t + 1.25); pr.linearRampToValueAtTime(r0, t + 1.5); }
  else if (tipo === 'v') {
    const alto = r0 * Math.pow(2, 0.3 / 12);
    for (let k = 0; k < 9; k++) { const tk = t + 0.3 + k * 0.15; pr.setValueAtTime(r0, tk); pr.linearRampToValueAtTime(alto, tk + 0.075); pr.linearRampToValueAtTime(r0, tk + 0.15); }
  }
}

/* ===== Treino de ouvido =====
   O app toca, você responde. Cada tipo sorteia uma pergunta nova:
     maiorMenor  um acorde: maior ou menor?
     intervalo   duas notas, uma depois da outra: que distância?
     grau        primeiro o I (a casa), depois um acorde da família: I, IV, V ou vi? */
const sortear = lista => lista[Math.floor(Math.random() * lista.length)];
const OUVIDO = {
  maiorMenor: {
    titulo: 'Maior ou menor?', dica: 'Maior soa aberto e alegre; menor, mais fechado.',
    sortear() {
      const raiz = sortear(['C', 'D', 'E', 'G', 'A', 'B', 'F']), menor = Math.random() < 0.5, nome = raiz + (menor ? 'm' : '');
      return { tocar: () => ouvirAcorde(nome), opcoes: ['Maior', 'Menor'], certa: menor ? 1 : 0, explica: `Era ${nome}: ${menor ? 'menor' : 'maior'}.` };
    }
  },
  intervalo: {
    titulo: 'Que intervalo é este?', dica: 'Duas notas, uma depois da outra. Cante as duas antes de responder.',
    sortear() {
      const ops = [[3, 'Terça menor'], [4, 'Terça maior'], [5, 'Quarta justa'], [7, 'Quinta justa'], [12, 'Oitava']];
      const k = Math.floor(Math.random() * ops.length), [casas] = ops[k];
      const corda = sortear([0, 1]), casa = sortear([0, 1, 2, 3]);
      return { tocar: () => ouvirSequencia([[corda, casa], [corda, casa + casas]], { passo: 0.75 }), opcoes: ops.map(o => o[1]), certa: k,
        explica: `${ops[k][1]}: ${casas} casas de distância.` };
    }
  },
  grau: {
    titulo: 'Qual acorde da família?', dica: 'Primeiro toca o I, a casa. Depois, o acorde misterioso.',
    sortear() {
      const tons = { C: ['C', 'F', 'G', 'Am'], G: ['G', 'C', 'D', 'Em'], D: ['D', 'G', 'A', 'Bm'], A: ['A', 'D', 'E', 'F#m'] };
      const tom = sortear(Object.keys(tons)), k = Math.floor(Math.random() * 4), acs = tons[tom];
      return { tocar: () => ouvirAcordes([acs[0], acs[k]], { passo: 1.4 }), opcoes: ['I (a casa)', 'IV', 'V', 'vi (menor)'], certa: k,
        explica: `Em ${tom}: ${['I', 'IV', 'V', 'vi'][k]} = ${acs[k]}.` };
    }
  }
};
function exercicioOuvido(area, tipo, { n = 5, aoFim = null } = {}) {
  const ex = OUVIDO[tipo] || OUVIDO.maiorMenor;
  let k = 0, acertos = 0, atual = null;
  const proxima = () => {
    if (k >= n) {
      area.innerHTML = `<div class="ouvido"><h3>${esc(ex.titulo)}</h3><div class="qz-fim"><b>${acertos} de ${n}</b><span>${acertos === n ? 'Ouvido afiado!' : acertos >= n / 2 ? 'Muito bem. Repita amanhã e o número sobe.' : 'Ouvido se treina: tente de novo mais devagar.'}</span><button class="btn mini" id="ou-de-novo">De novo</button></div></div>`;
      area.querySelector('#ou-de-novo').addEventListener('click', () => { k = 0; acertos = 0; proxima(); });
      registrar('quiz', acertos);
      aoFim?.(acertos);
      return;
    }
    atual = ex.sortear();
    area.innerHTML = `<div class="ouvido"><h3>${esc(ex.titulo)}</h3><p class="sub">${esc(ex.dica)}</p><p class="qz-num">Pergunta ${k + 1} de ${n}</p>
      <button class="btn primario largo grande" id="ou-tocar">${IC.som} Ouvir de novo</button>
      <div class="qz-opcoes">${atual.opcoes.map((o, i) => `<button class="opcao" data-k="${i}">${esc(o)}</button>`).join('')}</div><p class="qz-exp" aria-live="polite"></p></div>`;
    area.querySelector('#ou-tocar').addEventListener('click', () => atual.tocar());
    area.querySelectorAll('[data-k]').forEach(b => b.addEventListener('click', () => {
      if (area.querySelector('.opcao[disabled]')) return;
      const ok = +b.dataset.k === atual.certa;
      if (ok) acertos++;
      area.querySelectorAll('[data-k]').forEach(x => { x.disabled = true; if (+x.dataset.k === atual.certa) x.classList.add('certa'); else if (x === b) x.classList.add('errada'); });
      area.querySelector('.qz-exp').innerHTML = `<b>${ok ? 'Isso!' : 'Quase.'}</b> ${esc(atual.explica)} <button class="btn mini" id="ou-prox">${k + 1 < n ? 'Próxima' : 'Ver resultado'}</button>`;
      vibrar(ok ? 12 : [8, 40, 8]);
      area.querySelector('#ou-prox').addEventListener('click', () => { k++; proxima(); });
    }));
    setTimeout(() => atual.tocar(), 250);
  };
  proxima();
}

function acordesAprendidos() {
  const set = new Set(S.acordesSei || []);
  for (const l of LESSONS) if (S.licoes[l.id]) l.passos.forEach(p => { if (p.t === 'acorde') set.add(p.acorde); });
  return set;
}
function seiAcorde(nome) { const sei = acordesAprendidos(); return sei.has(nome) || sei.has(simplificar(nome)); }

/* ===== 2. Professor de acordes (dedo a dedo) ===== */
function ensinarAcorde(caixa, nome, { aoCompletar } = {}) {
  const passos = passosDoAcorde(nome), a = acordePorNome(nome);
  let k = 0, completou = false;
  const primeira = a ? a.frets.findIndex(f => f >= 0) : 0;
  caixa.innerHTML = `
    <div class="ens">
      <div class="ens-topo"><b class="ens-nome">${esc(nome)}</b><span class="sub">${esc(descricaoAcorde(nome))}</span></div>
      <div class="ens-diag" id="ens-diag"></div>
      <div class="ens-pontos" id="ens-pontos">${Array.from({ length: passos.length + 1 }, () => '<i></i>').join('')}</div>
      <p class="ens-texto" id="ens-texto" aria-live="polite"></p>
      <div class="ens-acoes">
        <button class="btn-icone" id="ens-volta" aria-label="Passo anterior">${IC.voltar}</button>
        <button class="btn" id="ens-ouvir">${IC.som} Ouvir</button>
        <button class="btn primario" id="ens-prox">Próximo</button>
      </div>
      <div class="ens-final" id="ens-final" hidden>
        <button class="btn" id="ens-corda">${IC.som} Corda por corda</button>
        <button class="btn" id="ens-mic">${IC.mic} Conferir no microfone</button>
        <button class="btn mini sem-borda" id="ens-calib">Ensinar este acorde ao app</button>
      </div>
      <p class="ens-res" id="ens-res" aria-live="polite"></p>
    </div>`;
  const q = s => caixa.querySelector(s);
  const mostrar = () => {
    const final = k >= passos.length;
    q('#ens-diag').innerHTML = diagramaAcorde(nome, { tam: 'xl', passo: final ? null : k });
    q('#ens-texto').innerHTML = final
      ? `Agora toque as cordas, começando pela <b>${ORD[primeira]}</b>${a && a.frets.some(f => f < 0) ? ' (pule as que têm ×)' : ''}. Todas devem soar limpas.`
      : `<span class="ens-passo">Passo ${k + 1} de ${passos.length}</span> ${textoPasso(passos[k])}`;
    q('#ens-final').hidden = !final;
    q('#ens-prox').hidden = final;
    // o botão diz o que vai soar: a nota do dedo da vez ou o acorde inteiro
    const nNotas = final ? 0 : passos[k].cordas.length;
    q('#ens-ouvir').innerHTML = `${IC.som} ${final ? 'Ouvir o acorde' : nNotas > 1 ? 'Ouvir as notas' : 'Ouvir a nota'}`;
    q('#ens-volta').disabled = k === 0;
    caixa.querySelectorAll('#ens-pontos i').forEach((b, j) => { b.classList.toggle('feito', j < k); b.classList.toggle('on', j === k); });
    if (final && !completou) { completou = true; aoCompletar?.(); }
  };
  q('#ens-prox').addEventListener('click', () => { k = Math.min(passos.length, k + 1); mostrar(); });
  q('#ens-volta').addEventListener('click', () => { k = Math.max(0, k - 1); mostrar(); q('#ens-res').textContent = ''; });
  q('#ens-ouvir').addEventListener('click', () => {
    if (k >= passos.length) return ouvirAcorde(nome);
    const notas = notasDoPasso(passos[k]);
    if (notas.length === 1) ouvirNota(...notas[0]); else ouvirSequencia(notas, { passo: 0.3 });
  });
  q('#ens-corda').addEventListener('click', () => tocarCordaPorCorda(nome));
  q('#ens-mic').addEventListener('click', () => conferirAcordeMic(nome, q('#ens-res'), q('#ens-mic')));
  q('#ens-calib').addEventListener('click', () => abrirCalibracao([nome]));
  mostrar();
}
// Escuta uma batida e diz se soou como o acorde pedido
async function conferirAcordeMic(nome, saida, botao) {
  try { await Detector.ligar(); } catch (e) { saida.textContent = msgSemMicrofone(e); return; }
  botao.disabled = true;
  saida.className = 'ens-res'; saida.textContent = 'Ouvindo… toque o acorde uma vez e deixe soar.';
  const vizinhos = ['C', 'D', 'E', 'G', 'A', 'Am', 'Em', 'Dm', 'D7', 'G7', 'E7', 'A7', 'C7', 'B7', 'Am7', 'Em7', 'Bm7'].filter(x => x !== nome);
  let feito = false;
  const fim = setTimeout(() => { if (!feito) { cancela(); botao.disabled = false; saida.textContent = 'Não ouvi nada. Toque mais forte, perto do celular.'; } }, 8000);
  const cancela = Detector.aoAtacar(async () => {
    if (feito) return;
    feito = true; cancela(); clearTimeout(fim);
    await new Promise(r => setTimeout(r, 160));
    const r = await Jogo.lerCroma(5, 60);
    botao.disabled = false;
    if (!r) { saida.textContent = 'Som muito baixo. Toque mais forte, perto do celular.'; return; }
    const av = Jogo.avaliarAcorde(r.croma, nome, vizinhos, 0);
    if (av.ok) { saida.className = 'ens-res ok'; saida.innerHTML = `${IC.check} Soou como <b>${esc(nome)}</b>. Muito bem!`; vibrar([15, 50, 15]); }
    else if (av.outro && av.simOutro > 0.6) saida.innerHTML = `Soou mais parecido com <b>${esc(av.outro)}</b>. Confira cada dedo e se as cordas soltas estão soando.`;
    else saida.textContent = 'Não reconheci o acorde. Alguma corda pode estar abafada: use "Corda por corda" e compare.';
  });
}

/* ===== 2b. Ensinar o app a ouvir o SEU violão (calibração) =====
   Cada violão, cada celular e cada quarto soam diferente. Aqui o app guarda
   como o SEU violão soa em cada acorde (a média de 3 batidas) e mistura isso
   com o molde teórico na hora de conferir. */
const ACORDES_CALIBRAR = ['Em', 'D', 'C', 'G', 'Am', 'A', 'E', 'Dm', 'Am7', 'Bm7', 'Em7', 'D7', 'B7', 'A7', 'E7', 'G7', 'C7'];
function abrirCalibracao(lista = null) {
  S.calibracao = S.calibracao || {};
  if (!lista) {
    lista = ACORDES_CALIBRAR.filter(a => seiAcorde(a));
    for (const a of ACORDES_CALIBRAR.slice(0, 5)) if (!lista.includes(a)) lista.push(a);
  }
  let fila = [], atual = null, amostras = [], off = null, lendo = false;
  abrirJanela('Ensinar o seu violão', `
    <div class="calib">
      <p class="sub">O app aprende como o seu violão e o microfone do seu celular soam. Em cada acorde, bata <b>3 vezes para baixo</b>, deixando soar entre uma e outra. Fique perto do celular, num lugar sem barulho.</p>
      <div class="calib-lista" id="calib-lista"></div>
      <div class="calib-area" id="calib-area" hidden></div>
      <div class="linha-botoes"><button class="btn primario" id="calib-ir">Começar</button><button class="btn mini sem-borda" id="calib-apagar">Esquecer tudo</button></div>
    </div>`, () => { off?.(); off = null; });
  const q = s => $('#janela-corpo').querySelector(s);
  const desenharLista = () => {
    q('#calib-lista').innerHTML = lista.map(a => `<button class="calib-item ${S.calibracao[a] ? 'feito' : ''} ${a === atual ? 'agora' : ''}" data-ac="${esc(a)}"><b>${esc(a)}</b><small>${S.calibracao[a] ? 'pronto' : a === atual ? 'agora' : 'falta'}</small></button>`).join('');
    q('#calib-lista').querySelectorAll('[data-ac]').forEach(b => b.addEventListener('click', () => { fila = [b.dataset.ac]; proximo(); }));
  };
  const proximo = async () => {
    atual = fila.shift() || null; amostras = [];
    desenharLista();
    const area = q('#calib-area');
    if (!atual) {
      area.hidden = false;
      area.innerHTML = `<p class="ps-ok">${IC.check} Pronto! Agora o microfone confere comparando com o som do seu violão.</p>`;
      q('#calib-ir').textContent = 'Ensinar de novo';
      off?.(); off = null; return;
    }
    try { await Detector.ligar(); } catch (e) { area.hidden = false; area.textContent = msgSemMicrofone(e); return; }
    area.hidden = false;
    area.innerHTML = `<div class="calib-acorde">${diagramaAcorde(atual, { tam: 'md' })}</div>
      <p class="calib-pede">Toque o <b>${esc(atual)}</b>: <span id="calib-n">0</span> de 3</p>
      <div class="medidor" aria-hidden="true"><i id="calib-nivel"></i></div>
      <p class="sub" id="calib-msg" aria-live="polite"></p>`;
    off?.();
    const offA = Detector.aoAtacar(async () => {
      if (lendo || !atual) return;
      lendo = true;
      await new Promise(r => setTimeout(r, 150));
      const r = await Jogo.lerCroma(3, 45);
      lendo = false;
      const msg = q('#calib-msg');
      if (!r || r.energia < 1e-6) { if (msg) msg.textContent = 'Muito baixo. Toque mais forte, perto do celular.'; return; }
      const c = Jogo.centralizar(r.croma);
      const teoria = Jogo.modeloNotas(notasDoAcorde(atual, 0));
      const sim = c.reduce((t, v, i) => t + v * teoria[i], 0);
      if (sim < 0.35) { if (msg) msg.textContent = `Esse som não parece um ${atual}. Confira os dedos e se as cordas soltas estão soando.`; return; }
      amostras.push(c);
      q('#calib-n').textContent = amostras.length;
      if (msg) msg.textContent = amostras.length < 3 ? 'Boa! De novo.' : '';
      vibrar(10);
      if (amostras.length >= 3) {
        const media = Jogo.centralizar(Array.from({ length: 12 }, (_, i) => amostras.reduce((t, a) => t + a[i], 0) / amostras.length));
        S.calibracao[atual] = media.map(v => +v.toFixed(3));
        Store.salvar();
        setTimeout(proximo, 500);
      }
    });
    const offN = Detector.aoNivel(e => { const n = q('#calib-nivel'); if (n) n.style.transform = `scaleX(${Math.min(1, Math.sqrt(e) * 4)})`; });
    off = () => { offA(); offN(); };
  };
  q('#calib-ir').addEventListener('click', () => { fila = lista.filter(a => !S.calibracao[a]); if (!fila.length) fila = [...lista]; proximo(); });
  q('#calib-apagar').addEventListener('click', () => { S.calibracao = {}; Store.salvar(); desenharLista(); toast('O app esqueceu o som do seu violão'); });
  desenharLista();
}

/* ===== 3. Player de lições ===== */
function unidadeDaLicao(id) { return CURSO.find(u => u.licoes.some(l => l.id === id)); }
function proximaLicao() { return LESSONS.find(l => !S.licoes[l.id]); }

/* passo: em que tela começar (número, ou 'fim' para a última).
   O botão Voltar volta uma tela; na primeira tela, volta para a lição anterior. */
function abrirLicao(id, { passo = 0 } = {}) {
  const l = lessonById(id), u = unidadeDaLicao(id);
  const pos = LESSONS.findIndex(x => x.id === id), anterior = LESSONS[pos - 1] || null;
  let i = passo === 'fim' ? l.passos.length - 1 : Math.max(0, Math.min(l.passos.length - 1, passo | 0));
  let limpar = null, acaoFinal = null;
  abrirJanela(l.titulo, `
    <div class="lc">
      <div class="lc-prog" aria-hidden="true"><i id="lc-barra"></i></div>
      <div class="lc-passo" id="lc-passo"></div>
      <div class="lc-rodape">
        <button class="btn grande lc-voltar" id="lc-volta">${IC.voltar}<span>Voltar</span></button>
        <button class="btn primario largo grande" id="lc-cont">Continuar</button>
      </div>
    </div>`, () => { limpar?.(); limpar = null; });
  $('#janela').classList.add('cheia');
  const area = $('#lc-passo'), cont = $('#lc-cont'), volta = $('#lc-volta');
  const mostrar = () => {
    limpar?.(); limpar = null;
    acaoFinal = null;
    const p = l.passos[i];
    $('#lc-barra').style.transform = `scaleX(${i / l.passos.length})`;
    cont.disabled = false; cont.textContent = 'Continuar';
    volta.disabled = i === 0 && !anterior;
    volta.setAttribute('aria-label', i === 0 && anterior ? `Voltar para a lição anterior: ${anterior.titulo}` : 'Voltar uma tela');
    area.innerHTML = '';
    area.classList.remove('entrar'); void area.offsetWidth; area.classList.add('entrar');
    $('#janela-corpo').scrollTop = 0;
    limpar = PASSOS[p.t](area, p, { cont, l, u }) || null;
  };
  cont.addEventListener('click', () => {
    if (cont.disabled) return;
    if (acaoFinal) return acaoFinal();
    if (i < l.passos.length - 1) { i++; mostrar(); }
    else { acaoFinal = concluirLicao(l, u, area, cont, () => { limpar?.(); limpar = null; }); volta.disabled = false; }
  });
  volta.addEventListener('click', () => {
    if (acaoFinal) { mostrar(); return; }                 // da tela "Lição concluída" volta para a última tela
    if (i > 0) { i--; mostrar(); return; }
    if (anterior) { limpar?.(); limpar = null; abrirLicao(anterior.id, { passo: 'fim' }); }
  });
  mostrar();
}

const PASSOS = {
  texto(area, p) {
    area.innerHTML = `<div class="ps-texto">${p.visual ? `<div class="ps-visual">${DESENHOS[p.visual]?.() || ''}</div>` : ''}<h3>${esc(p.titulo)}</h3><p>${p.texto}</p></div>`;
    ligarSons(area);
  },
  video(area, p) {
    area.innerHTML = `<div class="ps-video">${videoHTML(p.video)}</div>`;
    ligarVideos(area);
    return () => area.querySelectorAll('video, audio').forEach(m => m.pause());
  },
  acorde(area, p, { cont }) {
    ensinarAcorde(area, p.acorde, { aoCompletar: () => { cont.textContent = 'Já sei, continuar'; } });
  },
  quiz(area, p, { cont }) {
    cont.disabled = true;
    area.innerHTML = `<div class="qz"><p class="qz-p">${esc(p.pergunta)}</p><div class="qz-opcoes">${p.opcoes.map((o, k) => `<button class="opcao" data-k="${k}">${esc(o)}</button>`).join('')}</div><p class="qz-exp" id="ps-explica" aria-live="polite"></p></div>`;
    area.querySelectorAll('[data-k]').forEach(b => b.addEventListener('click', () => {
      const certo = +b.dataset.k === p.certa;
      area.querySelectorAll('[data-k]').forEach(x => { x.disabled = true; if (+x.dataset.k === p.certa) x.classList.add('certa'); else if (x === b) x.classList.add('errada'); });
      area.querySelector('#ps-explica').innerHTML = `<b>${certo ? 'Isso!' : 'Quase.'}</b> ${esc(p.explica)}`;
      vibrar(certo ? 15 : [10, 40, 10]);
      cont.disabled = false;
    }));
  },
  troca(area, p) { return trocaUmMinuto(area, p.a, p.b); },
  afinar(area) { return miniAfinador(area); },
  // O jogo dentro da lição
  tocar(area, p, { cont, u }) {
    const m = p.musica ? acharMusica(p.musica) : null;
    // no Iniciante os acordes difíceis viram fáceis; do Intermediário em diante, ficam como na cifra
    const facil = p.facil ?? ((u && u.nivel) || 'iniciante') === 'iniciante';
    const comoToca = a => (facil ? simplificar(a) : a);
    const titulo = p.titulo || (m ? `${m.titulo}${p.secao != null ? ': ' + m.secoes[p.secao].nome : ''}` : 'Toque junto');
    const modo = p.modo || 'espera';
    const nomesModo = { espera: 'Esperar por mim: a música para em cada acorde até você acertar.', tempo: 'No tempo: a música não para, e o microfone dá os pontos.', pratica: 'Prática: o app toca junto, sem pontos.' };
    cont.textContent = 'Pular';
    area.innerHTML = `
      <div class="ps-tocar">
        <h3>${esc(titulo)}</h3>
        ${m?.capo ? `<p class="sub">Capotraste na ${m.capo}ª casa para soar como a gravação (opcional).</p>` : ''}
        <p class="sub">${nomesModo[modo]}</p>
        <div class="ps-acordes">${[...new Set((m ? musicaParaTrechos(m, p.secao ?? null) : lerSequencia(p.seq)).map(x => comoToca(x.acorde)))].map(a => `<figure>${diagramaAcorde(a, { tam: 'sm', rotulos: false })}<figcaption>${esc(a)}</figcaption></figure>`).join('')}</div>
        ${p.banda && modo !== 'espera' ? `<p class="sub">${IC.som} A banda toca junto (percussão, baixo e teclado).</p>` : ''}
        <button class="btn primario largo grande" id="ps-play">${IC.play} Começar</button>
        <div id="ps-fim"></div>
      </div>`;
    area.querySelector('#ps-play').addEventListener('click', () => {
      const fim = r => {
        cont.textContent = 'Continuar';
        const ok = r.pct === null || r.pct >= 50 || r.modo === 'espera';
        area.querySelector('#ps-fim').innerHTML = `<p class="ps-ok">${ok ? IC.check + ' Muito bem!' : 'Quase lá. Tente de novo ou continue.'}</p>`;
      };
      if (m) jogarMusica(m, p.secao ?? null, { modo, ritmo: p.ritmo, vel: 60, facil, aoFim: fim });
      else {
        let ini = 0;
        const trechos = lerSequencia(p.seq).map(x => { const t = { ...x, inicio: ini }; ini += x.tempos; return t; });
        const banda = p.banda && modo !== 'espera' ? { estilo: ESTILO_DO_PADRAO[p.padrao] || 'pop', partes: ['batida', 'baixo', 'teclado'] } : null;
        Jogo.abrir({ titulo, trechos, padrao: patternById(p.padrao || 'quatro'), ritmo: p.ritmo || 'acorde', bpm: p.bpm || 60, bpmBase: p.bpm || 60,
          modo, entrada: modo === 'pratica' ? 'nenhuma' : 'mic', facil, banda, fone: !!S.cfg.fone, mix: { ...S.cfg.mix }, guia: true, aoFim: fim });
      }
    });
  },
  ouvido(area, p, { cont }) {
    cont.textContent = 'Pular';
    exercicioOuvido(area, p.tipo, { n: p.n || 5, aoFim: () => { cont.textContent = 'Continuar'; } });
  },
  notas(area, p, { cont }) {
    const me = MELODIAS.find(x => x.id === p.melodia);
    cont.textContent = 'Pular';
    area.innerHTML = `
      <div class="ps-tocar">
        <h3>${esc(p.titulo || me.titulo)}</h3>
        <p class="sub">Cada bolinha é uma nota: a linha é a corda e o número é a casa (0 = solta). A música espera você tocar cada nota.</p>
        <button class="btn primario largo grande" id="ps-play">${IC.play} Começar</button>
        <div id="ps-fim"></div>
      </div>`;
    area.querySelector('#ps-play').addEventListener('click', () => jogarMelodia(me.id, { modo: 'espera', vel: 100, aoFim: () => { cont.textContent = 'Continuar'; area.querySelector('#ps-fim').innerHTML = `<p class="ps-ok">${IC.check} Muito bem!</p>`; } }));
  }
};

function concluirLicao(l, u, area, cont, limpar) {
  limpar();
  const novo = !S.licoes[l.id];
  S.licoes[l.id] = true;
  if (novo) { registrar('licoes', 1); ganharXP(20, 'lição concluída', true); }
  Store.salvar();
  $('#lc-barra').style.transform = 'scaleX(1)';
  const prox = LESSONS[LESSONS.findIndex(x => x.id === l.id) + 1];
  const musica = l.musicaFinal && u.musica ? acharMusica(u.musica) : null;
  const uProx = prox ? unidadeDaLicao(prox.id) : null;
  const fimDeNivel = uProx && uProx.nivel !== u.nivel && LESSONS.filter(x => unidadeDaLicao(x.id).nivel === u.nivel).every(x => S.licoes[x.id]);
  const novos = l.passos.filter(p => p.t === 'acorde').map(p => p.acorde);
  area.innerHTML = `
    <div class="ps-fim">
      <span class="fim-bola" aria-hidden="true">${IC.check}</span>
      <h3>Lição concluída</h3>
      ${novos.length ? `<p>Você aprendeu: <b>${novos.join(', ')}</b></p>` : ''}
      ${musica ? `<p>Você já consegue tocar <b>${esc(musica.titulo)}</b> inteira.</p>` : ''}
      ${fimDeNivel ? `<p class="ps-nivel">Você terminou o nível <b>${esc(nivelDe(u.nivel).nome)}</b>. Agora começa o <b>${esc(nivelDe(uProx.nivel).nome)}</b>: ${esc(nivelDe(uProx.nivel).resumo)}</p>` : ''}
    </div>`;
  vibrar([20, 60, 20]);
  if (fimDeNivel) { S.cfg.nivel = uProx.nivel; nivelCurso = null; Store.salvar(); }
  cont.textContent = musica ? `Abrir ${musica.titulo}` : prox ? `Próxima: ${prox.titulo}` : 'Voltar';
  return () => {
    fecharJanela();
    if (musica) abrirMusica(musica.id);
    else if (prox) abrirLicao(prox.id);
    if (['hoje', 'aprender', 'acordes'].includes(viewAtual)) RENDER[viewAtual]();
  };
}

/* ===== 4. Treinos ===== */
/* "1 minuto de trocas" (JustinGuitar): troque entre dois acordes o máximo que puder em 60 s.
   O microfone ouve cada batida e conta uma troca quando o acorde muda (Em -> D -> Em...).
   Bater várias vezes no mesmo acorde não conta. Sem microfone, o botão "Troquei" conta na mão. */
function trocaUmMinuto(area, a, b) {
  const chave = `${a}>${b}`;
  let n = 0, fim = 0, timer = null, vez = 0, ultimo = null, offAtaque = null, comMic = false, lendo = false;
  area.innerHTML = `
    <div class="troca">
      <h3>1 minuto de trocas</h3>
      <p class="sub">Troque entre <b>${esc(a)}</b> e <b>${esc(b)}</b> o máximo que puder. Bata <b>uma vez</b> em cada acorde: o microfone conta as trocas sozinho. Recorde: <b>${S.recordes[chave] || 0}</b></p>
      <div class="troca-par">
        <figure data-i="0">${diagramaAcorde(a, { tam: 'md' })}<figcaption>${esc(a)}</figcaption></figure>
        <figure data-i="1">${diagramaAcorde(b, { tam: 'md' })}<figcaption>${esc(b)}</figcaption></figure>
      </div>
      <div class="troca-num"><span><b id="tr-tempo">60</b>segundos</span><span><b id="tr-n">0</b>trocas</span></div>
      <p class="troca-ouvi" id="tr-ouvi" aria-live="polite"></p>
      <button class="btn primario largo grande" id="tr-btn">Começar</button>
      <button class="btn largo" id="tr-mao" hidden>Troquei (contar na mão)</button>
    </div>`;
  const q = s => area.querySelector(s);
  const marcar = () => area.querySelectorAll('.troca-par figure').forEach(f => f.classList.toggle('vez', !!timer && +f.dataset.i === vez));
  const contar = () => { n++; q('#tr-n').textContent = n; vibrar(8); };
  const pararMic = () => { offAtaque?.(); offAtaque = null; };

  // Cada batida: lê as notas que soaram e decide se foi o acorde A, o B ou outro som
  const aoAtacar = async () => {
    if (!timer || lendo) return;
    lendo = true;
    await new Promise(r => setTimeout(r, 120));          // deixa o acorde "abrir" depois do ataque
    const r = await Jogo.lerCroma(3, 45);
    lendo = false;
    if (!timer || !r) return;
    const avA = Jogo.avaliarAcorde(r.croma, a, [b], 0), avB = Jogo.avaliarAcorde(r.croma, b, [a], 0);
    const qual = avA.ok && (!avB.ok || avA.sim >= avB.sim) ? 0 : avB.ok ? 1 : null;
    const ouvi = q('#tr-ouvi');
    if (qual === null) { ouvi.className = 'troca-ouvi'; ouvi.textContent = 'Ouvi outro som. Confira os dedos.'; return; }
    ouvi.className = 'troca-ouvi ok'; ouvi.innerHTML = `Ouvi <b>${esc(qual ? b : a)}</b> ${IC.check}`;
    if (ultimo !== null && qual !== ultimo) contar();   // mudou de acorde: 1 troca
    ultimo = qual; vez = 1 - qual; marcar();
  };

  const terminar = () => {
    clearInterval(timer); timer = null; pararMic(); marcar(); ativos.delete('trocas');
    const rec = S.recordes[chave] || 0;
    if (n > rec) S.recordes[chave] = n;
    registrar('trocas', n);
    q('#tr-btn').textContent = 'De novo'; q('#tr-btn').hidden = false; q('#tr-mao').hidden = true;
    q('#tr-ouvi').className = 'troca-ouvi'; q('#tr-ouvi').textContent = n > rec && rec ? `Novo recorde: ${n} trocas!` : `${n} trocas. ${n >= 30 ? 'Ótimo!' : 'Amanhã o número sobe.'}`;
  };

  q('#tr-btn').addEventListener('click', async () => {
    if (timer) { contar(); vez = 1 - vez; ultimo = 1 - vez; marcar(); return; }   // modo sem microfone
    n = 0; vez = 0; ultimo = null; q('#tr-n').textContent = 0;
    // liga o microfone (se não der, conta na mão)
    try { await Detector.ligar(); comMic = true; } catch (e) { comMic = false; q('#tr-ouvi').textContent = msgSemMicrofone(e); }
    fim = Date.now() + 60000;
    timer = setInterval(() => {
      const r = Math.max(0, Math.ceil((fim - Date.now()) / 1000));
      q('#tr-tempo').textContent = r;
      if (r === 0) terminar();
    }, 200);
    ativos.add('trocas'); marcar();
    if (comMic) {
      offAtaque = Detector.aoAtacar(aoAtacar);
      q('#tr-btn').hidden = true; q('#tr-mao').hidden = false;
      q('#tr-ouvi').className = 'troca-ouvi'; q('#tr-ouvi').innerHTML = `Ouvindo… comece pelo <b>${esc(a)}</b>`;
    } else q('#tr-btn').textContent = 'Troquei';
  });
  // reserva: se o microfone não estiver reconhecendo, dá para contar na mão
  q('#tr-mao').addEventListener('click', () => { if (!timer) return; contar(); vez = 1 - vez; ultimo = 1 - vez; marcar(); });
  return () => { clearInterval(timer); timer = null; pararMic(); ativos.delete('trocas'); };
}

// Mini afinador para a lição
function miniAfinador(area) {
  let alvo = null, ligado = false, timer = null, leit = [];
  area.innerHTML = `
    <div class="mini-af">
      <h3>Afine as 6 cordas</h3>
      <p class="sub">Toque uma corda solta. Ponteiro à esquerda: aperte a tarraxa. À direita: afrouxe. Os botões tocam o som certo de cada corda.</p>
      <div class="af-nota pequena"><b id="maf-nota">—</b><span id="maf-dica">Toque em "Usar microfone"</span></div>
      <div class="af-escala" aria-hidden="true"><span class="af-zona"></span><i id="maf-ponteiro"></i></div>
      <div class="af-cordas">${[0, 1, 2, 3, 4, 5].map(i => `<button class="af-corda" data-c="${i}"><b>${'EADGBE'[i]}</b><small>${ORD[i]}</small></button>`).join('')}</div>
      <button class="btn primario largo" id="maf-mic">${IC.mic} Usar microfone</button>
    </div>`;
  area.querySelectorAll('[data-c]').forEach(b => b.addEventListener('click', () => { alvo = +b.dataset.c; Som.init(); Som.nota(CORDAS_SOLTAS[alvo], Som.agora + 0.02, 0.5, alvo, { humano: false }); }));
  const ler = () => {
    const r = Detector.altura();
    if (r && r.freq > 60 && r.freq < 700) {
      leit.push(r.freq); if (leit.length > 5) leit.shift();
      const f = mediana(leit);
      let c = alvo;
      if (c === null) { c = 0; CORDAS_SOLTAS.forEach((x, i) => { if (Math.abs(Math.log2(f / x)) < Math.abs(Math.log2(f / CORDAS_SOLTAS[c]))) c = i; }); }
      const cents = Math.round(1200 * Math.log2(f / CORDAS_SOLTAS[c]));
      area.querySelector('#maf-nota').textContent = `${'EADGBE'[c]}, ${ORD[c]} corda`;
      area.querySelector('#maf-ponteiro').style.left = (50 + Math.max(-50, Math.min(50, cents))) + '%';
      const ok = Math.abs(cents) <= 5;
      area.querySelector('.mini-af').classList.toggle('certo', ok);
      area.querySelector('#maf-dica').textContent = ok ? 'Afinada' : cents < 0 ? 'Grave: aperte um pouco a tarraxa' : 'Aguda: afrouxe um pouco';
    }
    timer = setTimeout(ler, 80);
  };
  area.querySelector('#maf-mic').addEventListener('click', async e => {
    if (ligado) return;
    const b = e.currentTarget;
    try { await Detector.ligar(); } catch (err) { area.querySelector('#maf-dica').textContent = msgSemMicrofone(err); return; }
    ligado = true; b.textContent = 'Ouvindo…'; b.disabled = true; ler();
  });
  return () => clearTimeout(timer);
}

/* ===== 5. Telas ===== */
let abaAprender = 'curso';
function renderAprender() {
  const v = $('#view-aprender');
  v.innerHTML = `
    <header class="pagina-topo"><h2 class="titulo-grande">Aprender</h2></header>
    <div class="abas" role="tablist">${[['curso', 'Curso'], ['apostilas', 'Apostilas'], ['treinos', 'Treinos']].map(([k, n]) => `<button role="tab" aria-selected="${abaAprender === k}" data-aba="${k}">${n}</button>`).join('')}</div>
    <div id="aba-conteudo"></div>`;
  $$('[data-aba]', v).forEach(b => b.addEventListener('click', () => { abaAprender = b.dataset.aba; renderAprender(); }));
  const c = $('#aba-conteudo');
  if (abaAprender === 'curso') renderCurso(c);
  else if (abaAprender === 'apostilas') renderApostilas(c);
  else renderTreinos(c);
}
/* Seletor de nível (Iniciante, Intermediário, Avançado) */
let nivelCurso = null, nivelApostilas = null;           // null = automático
function nivelDoCurso() {
  const prox = proximaLicao();
  return prox ? unidadeDaLicao(prox.id).nivel : (S.cfg.nivel || 'avancado');
}
function seletorNivel(atual, info) {
  return `<div class="niveis" role="radiogroup" aria-label="Nível">${NIVEIS.map(n => `<button role="radio" aria-checked="${n.id === atual}" data-nivel="${n.id}"><b>${esc(n.nome)}</b><small>${esc(info(n.id))}</small></button>`).join('')}</div>`;
}
function ligarNiveis(c, aoEscolher) {
  $$('[data-nivel]', c).forEach(b => b.addEventListener('click', () => aoEscolher(b.dataset.nivel)));
  // setas do teclado no grupo de níveis
  const grupo = c.querySelector('.niveis');
  grupo?.addEventListener('keydown', e => {
    if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    const k = NIVEIS.findIndex(n => n.id === grupo.querySelector('[aria-checked="true"]').dataset.nivel);
    const novo = NIVEIS[(k + (e.key === 'ArrowRight' ? 1 : NIVEIS.length - 1)) % NIVEIS.length].id;
    aoEscolher(novo); setTimeout(() => c.querySelector(`[data-nivel="${novo}"]`)?.focus(), 0);
  });
}
function renderCurso(c) {
  const prox = proximaLicao();
  const nivel = nivelCurso || nivelDoCurso();
  const unidades = CURSO.filter(u => u.nivel === nivel);
  const info = id => { const ls = LESSONS.filter(l => unidadeDaLicao(l.id).nivel === id); const f = ls.filter(l => S.licoes[l.id]).length; return f === ls.length ? 'Concluído' : `${f} de ${ls.length} lições`; };
  c.innerHTML = `${seletorNivel(nivel, info)}<p class="sub nivel-resumo">${esc(nivelDe(nivel).resumo)}</p>` + unidades.map((u, ui) => {
    const feitas = u.licoes.filter(l => S.licoes[l.id]).length, m = u.musica ? acharMusica(u.musica) : null;
    return `<section class="unidade ${feitas === u.licoes.length ? 'completa' : ''}">
      <header class="un-topo"><span class="un-num">${ui + 1}</span><div><h3>${esc(u.titulo)}</h3><p class="sub">${esc(u.resumo)}</p></div><span class="un-cont">${feitas}/${u.licoes.length}</span></header>
      <ol class="un-licoes">${u.licoes.map(l => {
        const feito = S.licoes[l.id], ehProx = prox && prox.id === l.id;
        const acs = l.passos.filter(p => p.t === 'acorde').map(p => p.acorde);
        return `<li><button class="un-licao ${feito ? 'feito' : ''} ${ehProx ? 'prox' : ''}" data-licao="${l.id}">
          <span class="un-marca" aria-hidden="true">${feito ? IC.check : l.musicaFinal ? IC.nota : ''}</span>
          <span class="un-txt"><b>${esc(l.titulo)}</b><small>${l.min} min${acs.length ? ', ' + acs.join(', ') : ''}</small></span>
          ${ehProx ? '<span class="un-agora">Começar</span>' : ''}
        </button></li>`;
      }).join('')}</ol>
      ${m ? `<p class="un-musica">${IC.nota} No fim desta unidade: <b>${esc(m.titulo)}</b></p>` : ''}
    </section>`;
  }).join('');
  ligarNiveis(c, id => { nivelCurso = id; renderCurso(c); });
  $$('[data-licao]', c).forEach(b => b.addEventListener('click', () => abrirLicao(b.dataset.licao)));
}
function renderApostilas(c) {
  const nivel = nivelApostilas || S.cfg.nivel || nivelDoCurso();
  const lista = APOSTILAS.filter(a => (a.nivel || 'iniciante') === nivel);
  const info = id => { const as = APOSTILAS.filter(a => (a.nivel || 'iniciante') === id); const f = as.filter(a => S.apostilas?.[a.id]).length; return `${f} de ${as.length} lidas`; };
  c.innerHTML = `
    ${Object.values(VIDEOS).some(v => v.nivel === nivel) ? `<section class="secao">
      <div class="secao-topo"><h3>Mini vídeos</h3></div>
      <div class="videos">${Object.entries(VIDEOS).filter(([, v]) => v.nivel === nivel).map(([id, v]) => `<button class="video-card" data-video="${id}"><span class="vc-capa"><img src="${v.arquivo.replace('.mp4', '.jpg')}" alt="" loading="lazy"><span class="vc-play" aria-hidden="true">${IC.play}</span></span><b>${esc(v.titulo)}</b></button>`).join('')}</div>
    </section>` : ''}
    ${seletorNivel(nivel, info)}
    <section class="secao">
      <div class="secao-topo"><h3>Apostilas: ${esc(nivelDe(nivel).nome)}</h3><span class="sub">${lista.length} textos curtos</span></div>
      <div class="lista">${lista.map((a, i) => `<button class="linha-apostila" data-apostila="${a.id}"><span class="la-num">${i + 1}</span><span class="la-txt"><b>${esc(a.titulo)}</b><small>${esc(a.resumo)}</small></span><span class="la-dir">${S.apostilas?.[a.id] ? `<span class="la-feita">${IC.check}</span>` : `<small>${a.min} min</small>`}</span></button>`).join('')}</div>
    </section>`;
  ligarNiveis(c, id => { nivelApostilas = id; renderApostilas(c); });
  $$('[data-video]', c).forEach(b => b.addEventListener('click', () => abrirVideo(b.dataset.video)));
  $$('[data-apostila]', c).forEach(b => b.addEventListener('click', () => abrirApostila(b.dataset.apostila)));
}
function renderTreinos(c) {
  const rec = Object.entries(S.recordes).sort((a, b) => b[1] - a[1])[0];
  c.innerHTML = `<div class="treinos">
    <button class="treino-card" data-treino="trocas">${icone('<path d="M7 7h11l-3-3M17 17H6l3 3"/>')}<b>1 minuto de trocas</b><span>Troque entre 2 acordes o máximo que puder.${rec ? ` Recorde: ${rec[1]}` : ''}</span></button>
    <button class="treino-card" data-treino="ritmo">${icone('<path d="M4 12h3l2-6 4 12 2-6h5"/>')}<b>Ritmo</b><span>Samba, pagode, bossa, baião e pop.</span></button>
    <button class="treino-card" data-treino="quiz">${icone('<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6M12 17h.01"/>')}<b>Que acorde é este?</b><span>10 perguntas, corrige na hora.</span></button>
    <button class="treino-card" data-melodia="primeiras">${IC.nota}<b>Notas soltas</b><span>As primeiras casas da 1ª e da 2ª corda.</span></button>
  </div>`;
  $$('[data-treino]', c).forEach(b => b.addEventListener('click', () => JOGOS[b.dataset.treino]()));
  $$('[data-melodia]', c).forEach(b => b.addEventListener('click', () => jogarMelodia(b.dataset.melodia)));
}

// Acordes: os que você sabe e os grupos para aprender
const GRUPOS_ACORDES = [
  ['Para começar', ['Em', 'D', 'C', 'G', 'Am', 'A', 'E', 'Dm']],
  ['Com sétima', ['Em7', 'Am7', 'Bm7', 'Dm7', 'G7', 'C7', 'D7', 'A7', 'E7', 'B7']],
  ['Com nona e sétima maior', ['A9', 'D9', 'C9', 'C7M', 'F7M', 'G7M', 'D7M', 'D7(9)', 'E7(9)']],
  ['Com pestana', ['F', 'Bm', 'Bb', 'F#m', 'F#m7', 'Gm', 'Cm', 'Eb7M']]
];
function renderAcordes() {
  const sei = acordesAprendidos();
  const v = $('#view-acordes');
  const vistos = new Set(sei);
  v.innerHTML = `
    <header class="pagina-topo"><h2 class="titulo-grande">Acordes</h2><p class="sub">Toque num acorde para aprender dedo a dedo.</p></header>
    ${sei.size ? `<section class="secao"><div class="secao-topo"><h3>Você já sabe</h3><span class="sub">${sei.size}</span></div><div class="grade-acordes">${[...sei].map(cardAcorde).join('')}</div></section>` : ''}
    ${GRUPOS_ACORDES.map(([t, lista]) => { const so = lista.filter(x => !vistos.has(x)); so.forEach(x => vistos.add(x)); return so.length ? `<section class="secao"><div class="secao-topo"><h3>${t}</h3></div><div class="grade-acordes">${so.map(cardAcorde).join('')}</div></section>` : ''; }).join('')}`;
  $$('[data-acorde]', v).forEach(b => b.addEventListener('click', () => abrirAcorde(b.dataset.acorde)));
}
function cardAcorde(nome) {
  const sei = seiAcorde(nome);
  return `<button class="card-acorde ${sei ? 'sei' : ''}" data-acorde="${esc(nome)}">${diagramaAcorde(nome, { tam: 'sm', rotulos: false })}<b>${esc(nome)}</b>${sei ? `<span class="sei-marca" aria-label="Você sabe">${IC.check}</span>` : ''}</button>`;
}
function abrirAcorde(nome) {
  const usam = todasMusicas().filter(m => acordesUnicos(m).some(a => a === nome || simplificar(a) === nome));
  abrirJanela(nome, `<div id="ac-ens"></div>
    <div class="ac-extra">
      <label class="alternar"><input type="checkbox" id="ac-sei" ${seiAcorde(nome) ? 'checked' : ''}><span>Já sei este acorde</span></label>
      ${usam.length ? `<p class="sub">Aparece em: ${usam.slice(0, 8).map(m => `<button class="link" data-musica="${esc(m.id)}">${esc(m.titulo)}</button>`).join(', ')}</p>` : ''}
    </div>`);
  ensinarAcorde($('#ac-ens'), nome);
  $('#ac-sei').addEventListener('change', e => {
    const lista = new Set(S.acordesSei || []);
    e.target.checked ? lista.add(nome) : lista.delete(nome);
    S.acordesSei = [...lista]; Store.salvar();
    if (viewAtual === 'acordes') renderAcordes();
  });
  $$('#janela [data-musica]').forEach(b => b.addEventListener('click', () => { const id = b.dataset.musica; fecharJanela(); abrirMusica(id); }));
}

/* Boas-vindas (primeiro uso): pergunta o seu nível e leva ao lugar certo */
function verificarBoasVindas() {
  if (S.onb) return;
  if (Object.keys(S.licoes || {}).length) { S.onb = true; return; }
  abrirJanela('Boas-vindas', `
    <div class="onb">
      <span class="onb-logo" aria-hidden="true"></span>
      <h2>Vamos tocar violão</h2>
      <p class="sub">Lições curtas, um acorde de cada vez e músicas brasileiras de verdade. O microfone escuta você tocar.</p>
      <h3>Você já toca?</h3>
      <div class="modos">
        <button class="modo" data-onb="0"><b>Nunca toquei</b><small>Começar do zero, no Iniciante</small></button>
        <button class="modo" data-onb="1"><b>Sei alguns acordes</b><small>Pular o básico do Iniciante</small></button>
        <button class="modo" data-onb="2"><b>Já toco músicas</b><small>Começar no Intermediário: pestana, samba, dedilhado</small></button>
        <button class="modo" data-onb="3"><b>Toco bem, com pestana</b><small>Começar no Avançado: escalas, bossa, técnicas</small></button>
      </div>
    </div>`);
  $('#janela').classList.add('cheia');
  $$('[data-onb]').forEach(b => b.addEventListener('click', () => {
    const resp = +b.dataset.onb;
    S.onb = true;
    // as lições anteriores ao ponto de partida ficam marcadas como vistas (dá para abrir quando quiser)
    const pular = resp === 0 ? [] : resp === 1 ? ['u1', 'u2'] : resp === 2 ? CURSO.filter(u => u.nivel === 'iniciante').map(u => u.id)
      : CURSO.filter(u => u.nivel !== 'avancado').map(u => u.id);
    CURSO.filter(u => pular.includes(u.id)).forEach(u => u.licoes.forEach(l => { S.licoes[l.id] = true; }));
    S.cfg.nivel = resp <= 1 ? 'iniciante' : resp === 2 ? 'intermediario' : 'avancado';
    if (resp >= 1) S.cfg.modo = 'tempo';
    Store.salvar();
    fecharJanela();
    irPara(resp >= 2 ? 'aprender' : 'hoje');
    const p = proximaLicao(); if (p) abrirLicao(p.id);
  }));
}
