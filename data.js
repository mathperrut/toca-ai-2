/* =========================================================
   TOCA AÍ — data.js
   Aqui fica só o CONTEÚDO do app: acordes, ritmos, curso,
   melodias e músicas. A lógica fica nos outros arquivos.
   Separar dados de lógica deixa o código fácil de manter:
   para criar uma lição nova, você só mexe aqui.
   ========================================================= */
'use strict';

/* ---------- ACORDES ----------
   frets:   casa apertada em cada corda, da 6ª (Mi grave) até a 1ª (Mi agudo)
            -1 = não tocar a corda | 0 = corda solta
   fingers: dedo da mão esquerda em cada corda (1 indicador ... 4 mindinho)
   barre:   casa da pestana (quando o dedo 1 deita sobre várias cordas)
*/
const CHORDS = [
  { id: 'C',   frets: [-1, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0] },
  { id: 'D',   frets: [-1, -1, 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2] },
  { id: 'E',   frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0] },
  { id: 'G',   frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, 0, 0, 0, 3] },
  { id: 'A',   frets: [-1, 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0] },
  { id: 'Am',  frets: [-1, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0] },
  { id: 'Dm',  frets: [-1, -1, 0, 2, 3, 1], fingers: [0, 0, 0, 2, 3, 1] },
  { id: 'Em',  frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0] },
  { id: 'A7',  frets: [-1, 0, 2, 0, 2, 0], fingers: [0, 0, 2, 0, 3, 0] },
  { id: 'B7',  frets: [-1, 2, 1, 2, 0, 2], fingers: [0, 2, 1, 3, 0, 4] },
  { id: 'C7',  frets: [-1, 3, 2, 3, 1, 0], fingers: [0, 3, 2, 4, 1, 0] },
  { id: 'D7',  frets: [-1, -1, 0, 2, 1, 2], fingers: [0, 0, 0, 2, 1, 3] },
  { id: 'E7',  frets: [0, 2, 0, 1, 0, 0], fingers: [0, 2, 0, 1, 0, 0] },
  { id: 'G7',  frets: [3, 2, 0, 0, 0, 1], fingers: [3, 2, 0, 0, 0, 1] },
  { id: 'Am7', frets: [-1, 0, 2, 0, 1, 0], fingers: [0, 0, 2, 0, 1, 0] },
  { id: 'Dm7', frets: [-1, -1, 0, 2, 1, 1], fingers: [0, 0, 0, 2, 1, 1] },
  { id: 'Em7', frets: [0, 2, 0, 0, 0, 0], fingers: [0, 2, 0, 0, 0, 0] },
  { id: 'Bm7', frets: [-1, 2, 0, 2, 0, 2], fingers: [0, 1, 0, 2, 0, 3] },
  { id: 'C7M', frets: [-1, 3, 2, 0, 0, 0], fingers: [0, 3, 2, 0, 0, 0] },
  { id: 'F7M', frets: [-1, -1, 3, 2, 1, 0], fingers: [0, 0, 3, 2, 1, 0] },
  { id: 'D7M', frets: [-1, -1, 0, 2, 2, 2], fingers: [0, 0, 0, 1, 2, 3] },
  { id: 'Eb7M', frets: [-1, -1, 1, 3, 3, 3], fingers: [0, 0, 1, 3, 3, 3] },   // dedo 3 deitado nas 3 cordas finas
  { id: 'G7M', frets: [3, 2, 0, 0, 0, 2], fingers: [3, 2, 0, 0, 0, 1] },
  { id: 'E7(9)', frets: [0, 2, 0, 1, 0, 2], fingers: [0, 2, 0, 1, 0, 3] },
  { id: 'D7(9)', frets: [-1, -1, 0, 2, 1, 0], fingers: [0, 0, 0, 2, 1, 0] },
  { id: 'F#m7', frets: [-1, -1, 2, 2, 2, 2], fingers: [0, 0, 1, 1, 1, 1], barre: 2 }, // pestana pequena
  { id: 'F',   frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1], barre: 1 },
  // acordes abertos para os níveis Intermediário e Avançado
  { id: 'C6',  frets: [-1, 3, 2, 2, 1, 0], fingers: [0, 4, 2, 3, 1, 0] },
  { id: 'Asus4', frets: [-1, 0, 2, 2, 3, 0], fingers: [0, 0, 1, 2, 3, 0] },
  { id: 'Dsus4', frets: [-1, -1, 0, 2, 3, 3], fingers: [0, 0, 0, 1, 2, 3] },
  { id: 'Esus4', frets: [0, 2, 2, 2, 0, 0], fingers: [0, 2, 3, 4, 0, 0] },
  { id: 'Em7(b5)', frets: [0, 1, 2, 0, 3, 0], fingers: [0, 1, 2, 0, 4, 0] },
  { id: 'Bm7(b5)', frets: [-1, 2, 3, 2, 3, -1], fingers: [0, 1, 3, 2, 4, 0] },
  { id: 'F#m7(b5)', frets: [2, -1, 2, 2, 1, -1], fingers: [2, 0, 3, 4, 1, 0] },
  { id: 'B°', frets: [-1, 2, 3, 1, 3, -1], fingers: [0, 2, 3, 1, 4, 0] },
  { id: 'A7(13)', frets: [-1, 0, 2, 0, 2, 2], fingers: [0, 0, 1, 0, 2, 3] },
  { id: 'C7(9)', frets: [-1, 3, 2, 3, 3, -1], fingers: [0, 2, 1, 3, 4, 0] },
  { id: 'C7M(9)', frets: [-1, 3, 2, 4, 3, -1], fingers: [0, 2, 1, 4, 3, 0] },
  { id: 'G/B', frets: [-1, 2, 0, 0, 0, 3], fingers: [0, 1, 0, 0, 0, 3] },
  { id: 'C/E', frets: [0, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0] },
  { id: 'D/F#', frets: [2, -1, 0, 2, 3, 2], fingers: [1, 0, 0, 2, 4, 3] },
  { id: 'Am/G', frets: [3, 0, 2, 2, 1, 0], fingers: [4, 0, 2, 3, 1, 0] },
  { id: 'Bb',  frets: [-1, 1, 3, 3, 3, 1], fingers: [0, 1, 2, 3, 4, 1], barre: 1 },
  { id: 'Bm',  frets: [-1, 2, 4, 4, 3, 2], fingers: [0, 1, 3, 4, 2, 1], barre: 2 },
  { id: 'F#m', frets: [2, 4, 4, 2, 2, 2], fingers: [1, 3, 4, 1, 1, 1], barre: 2 },
  { id: 'Gm',  frets: [3, 5, 5, 3, 3, 3], fingers: [1, 3, 4, 1, 1, 1], barre: 3 },
  { id: 'Cm',  frets: [-1, 3, 5, 5, 4, 3], fingers: [0, 1, 3, 4, 2, 1], barre: 3 },
  // Acordes "com nona" muito usados nas cifras brasileiras (mais fáceis que o acorde comum!)
  { id: 'A9',  frets: [-1, 0, 2, 2, 0, 0], fingers: [0, 0, 1, 2, 0, 0] },
  { id: 'D9',  frets: [-1, -1, 0, 2, 3, 0], fingers: [0, 0, 0, 1, 2, 0] },
  { id: 'C9',  frets: [-1, 3, 2, 0, 3, 0], fingers: [0, 2, 1, 0, 3, 0] },
  { id: 'Em9', frets: [0, 2, 0, 0, 0, 2], fingers: [0, 1, 0, 0, 0, 2] },
];

/* ---------- RITMOS (batidas da mão direita) ----------
   passos: um símbolo por subdivisão do tempo
   D para baixo, U para cima, B polegar no baixo, F dedos juntos,
   X polegar + dedos, p/i/m/a um dedo, - pausa (a mão passa sem tocar) */
const PATTERNS = [
  {
    id: 'quatro', nome: '4 para baixo', genero: 'Iniciante',
    beats: 4, sub: 1, bpm: 66,
    passos: ['D', 'D', 'D', 'D'],
    demo: ['Am7', 'Em7'],
    dica: 'Uma batida para baixo em cada tempo. Conte 1, 2, 3, 4.'
  },
  {
    id: 'baixocima', nome: 'Baixo e cima', genero: 'Iniciante',
    beats: 4, sub: 2, bpm: 60,
    passos: ['D', 'U', 'D', 'U', 'D', 'U', 'D', 'U'],
    demo: ['C', 'Dm7'],
    dica: 'No número, para baixo; no "e", para cima. A mão nunca para.'
  },
  {
    id: 'pop', nome: 'Batida básica', genero: 'Pop / balada',
    beats: 4, sub: 2, bpm: 80,
    passos: ['D', '-', 'D', 'U', '-', 'U', 'D', 'U'],
    demo: ['G', 'D', 'Em', 'C'],
    dica: 'A mão direita nunca para: ela sobe e desce o tempo todo, como um pêndulo. Nas pausas ela só passa sem encostar nas cordas.'
  },
  {
    id: 'baiao', nome: 'Baião', genero: 'Baião / forró',
    beats: 2, sub: 4, bpm: 90,
    passos: ['B', '-', '-', 'B', 'F', '-', 'F', '-'],
    demo: ['G', 'C', 'D7', 'G'],
    dica: 'O polegar imita a zabumba: "tum... tum". Os dedos respondem como o triângulo.'
  },
  {
    id: 'samba', nome: 'Samba', genero: 'Samba',
    beats: 2, sub: 4, bpm: 85,
    passos: ['B', 'F', '-', 'F', 'B', '-', 'F', '-'],
    demo: ['Am', 'Dm', 'E7', 'Am'],
    dica: 'O polegar é o surdo: marca os 2 tempos sem falhar. Os dedos são o tamborim, sempre fora do tempo forte.'
  },
  {
    id: 'pagode', nome: 'Pagode', genero: 'Pagode',
    beats: 2, sub: 4, bpm: 85,
    passos: ['B', '-', 'F', 'F', 'B', 'F', '-', 'F'],
    demo: ['C', 'A7', 'Dm', 'G7'],
    dica: 'Mesma base do samba, mas os dedos ficam mais "cheios". Solte o pulso e deixe o polegar firme.'
  },
  {
    id: 'bossa', nome: 'Bossa nova', genero: 'Bossa nova',
    beats: 4, sub: 4, bpm: 70,
    passos: ['X', '-', '-', 'F', 'B', '-', 'F', '-', 'B', '-', 'F', '-', 'B', 'F', '-', '-'],
    demo: ['Dm7', 'G7', 'C7M', 'C7M'],
    dica: 'Polegar regular como um relógio em todos os tempos. Os dedos fazem a "síncope": entram antes ou depois do polegar, quase nunca junto.'
  },
  {
    id: 'sambarock', nome: 'Samba-rock', genero: 'Samba-rock',
    beats: 4, sub: 4, bpm: 104,
    passos: ['D', '-', 'U', 'D', '-', 'U', 'D', 'U', '-', 'U', 'D', '-', 'U', 'D', 'U', '-'],
    demo: ['C', 'Dm7', 'Em7', 'Dm7'],
    dica: 'A batida do Jorge Ben: mão direita solta, acentos fora do tempo e muito "balanço". Mantenha o pulso girando sem parar.'
  },
  {
    id: 'dedilhado', nome: 'Dedilhado MPB', genero: 'MPB',
    beats: 4, sub: 2, bpm: 70,
    passos: ['p', 'i', 'm', 'a', 'm', 'i', 'm', 'i'],
    demo: ['Am', 'C', 'G', 'D'],
    dica: 'Cada dedo cuida de uma corda: polegar no baixo, indicador na 3ª, médio na 2ª, anelar na 1ª. Não olhe para a mão direita.'
  },
  {
    id: 'valsa', nome: 'Valsa', genero: 'Valsa / seresta',
    beats: 3, sub: 1, bpm: 84,
    passos: ['B', 'F', 'F'],
    demo: ['G', 'D7', 'D7', 'G'],
    dica: 'Três tempos por compasso: o polegar no 1 e os dedos juntos no 2 e no 3. "TUM, pá, pá".'
  },
];

/* ---------- CURSO ----------
   Unidades curtas, um acorde novo de cada vez, sempre terminando
   numa música de verdade que usa só o que você aprendeu
   (o método do JustinGuitar e do Simply Guitar).
   Tipos de passo:
     texto   explicação curta (visual = desenho das apostilas)
     video   mini vídeo
     acorde  ensina um acorde dedo a dedo
     troca   1 minuto de trocas entre dois acordes
     quiz    pergunta que corrige na hora
     afinar  mini afinador
     tocar   o jogo (seq = sequência curta, ou musica = id do catálogo;
             banda: true = a banda toca junto nos modos Prática e No tempo)
     notas   o jogo com notas soltas (melodia = id de MELODIAS)
     ouvido  treino de ouvido (tipo: maiorMenor, intervalo ou grau)
   Nos níveis Intermediário e Avançado os acordes ficam como na cifra
   (sem a troca automática por acordes fáceis). */
/* Os três níveis do curso e das apostilas */
const NIVEIS = [
  { id: 'iniciante', nome: 'Iniciante', resumo: 'Do zero às primeiras músicas: acordes abertos, batidas e a leitura da cifra.' },
  { id: 'intermediario', nome: 'Intermediário', resumo: 'Pestana, como os acordes são feitos, samba, dedilhado e campo harmônico.' },
  { id: 'avancado', nome: 'Avançado', resumo: 'Escalas e improviso, a harmonia da bossa nova, técnicas e tirar música de ouvido.' }
];
const nivelDe = id => NIVEIS.find(n => n.id === id) || NIVEIS[0];
const CURSO = [
  {
    id: 'u1', nivel: 'iniciante', titulo: 'Conhecendo o violão', resumo: 'As partes, as cordas, a afinação e as primeiras notas.',
    licoes: [
      { id: 'u1l1', titulo: 'As partes do violão', min: 3, passos: [
        { t: 'video', video: 'partes' },
        { t: 'texto', titulo: 'Cabeça, braço e caixa', visual: 'partes',
          texto: 'As <b>tarraxas</b> da cabeça afinam as cordas. No <b>braço</b> a mão esquerda aperta as cordas nas <b>casas</b>. A <b>caixa</b> é oca: ela faz o som ficar forte.' },
        { t: 'quiz', pergunta: 'Para que servem as tarraxas?', opcoes: ['Para afinar', 'Para aumentar o volume', 'Para trocar de acorde'], certa: 0,
          explica: 'Elas esticam ou afrouxam a corda. É assim que se afina.' }
      ] },
      { id: 'u1l2', titulo: 'As 6 cordas', min: 2, passos: [
        { t: 'texto', titulo: 'Da mais grossa para a mais fina', visual: 'cordas',
          texto: 'A corda <b>mais grossa</b> é a <b>6ª</b> e a mais fina é a <b>1ª</b>. Os nomes, da grossa para a fina: <b>Mi, Lá, Ré, Sol, Si, Mi</b> (E A D G B E). Para decorar: <b>E</b>u <b>A</b>mo <b>D</b>oce <b>d</b>e <b>G</b>oiaba, <b>B</b>em <b>E</b>scuro.' },
        { t: 'quiz', pergunta: 'Qual é a corda mais grossa?', opcoes: ['A 1ª', 'A 6ª', 'A 3ª'], certa: 1,
          explica: 'A contagem começa pela mais fina, então a mais grossa é a 6ª (Mi grave).' }
      ] },
      { id: 'u1l3', titulo: 'Afinar o violão', min: 3, passos: [
        { t: 'video', video: 'afinar' },
        { t: 'texto', titulo: 'Sempre antes de tocar', visual: null,
          texto: 'Violão desafinado faz até o acorde certo soar errado. Toque uma corda solta e olhe o ponteiro: para a <b>esquerda</b> está grave (aperte a tarraxa), para a <b>direita</b> está agudo (afrouxe).' },
        { t: 'afinar' }
      ] },
      { id: 'u1l4', titulo: 'Postura e mãos', min: 3, passos: [
        { t: 'video', video: 'postura' },
        { t: 'texto', titulo: 'Os dedos têm número', visual: 'dedos',
          texto: 'Na mão que aperta as cordas: <b>1</b> indicador, <b>2</b> médio, <b>3</b> anelar, <b>4</b> mindinho. O polegar fica atrás do braço. Aperte com a <b>ponta</b> do dedo, logo atrás do traste.' },
        { t: 'quiz', pergunta: 'Qual é o dedo 2?', opcoes: ['Indicador', 'Médio', 'Anelar'], certa: 1, explica: '1 indicador, 2 médio, 3 anelar, 4 mindinho.' }
      ] },
      { id: 'u1l5', titulo: 'Suas primeiras notas', min: 4, passos: [
        { t: 'texto', titulo: 'Como funciona o jogo', visual: null,
          texto: 'As cordas aparecem deitadas: a <b>1ª corda em cima</b>, como numa tablatura. As notas deslizam até a <b>linha vermelha</b>, e a bolinha vermelha cai em cima delas na hora de tocar. O número é a casa: <b>0</b> é corda solta.' },
        { t: 'video', video: 'jogo' },
        { t: 'notas', melodia: 'soltas', titulo: 'Toque as cordas soltas' }
      ] }
    ]
  },
  {
    id: 'u2', nivel: 'iniciante', titulo: 'Primeiro acorde: Em', resumo: 'Leia um diagrama, monte o Em e faça a primeira batida.',
    licoes: [
      { id: 'u2l1', titulo: 'Como ler um acorde', min: 3, passos: [
        { t: 'video', video: 'diagrama' },
        { t: 'texto', titulo: 'O desenho do acorde', visual: 'diagrama',
          texto: 'É o violão <b>de pé na sua frente</b>: a linha da <b>esquerda é a 6ª corda</b>. A bolinha mostra onde apertar e o número é o dedo. <b>O</b> é corda solta e <b>×</b> é corda que não toca.' },
        { t: 'quiz', pergunta: 'Um × em cima da corda quer dizer…', opcoes: ['Apertar com o dedo 1', 'Não tocar essa corda', 'Tocar mais forte'], certa: 1, explica: 'A corda com × fica de fora da batida.' }
      ] },
      { id: 'u2l2', titulo: 'Em (Mi menor)', min: 4, passos: [
        { t: 'texto', titulo: 'Dois dedos e seis cordas', visual: null,
          texto: 'O <b>Em</b> usa só os dedos 2 e 3, e você toca <b>todas as 6 cordas</b>. É um dos acordes mais usados do violão.' },
        { t: 'acorde', acorde: 'Em' },
        { t: 'tocar', titulo: 'Toque o Em quando a bolinha cair', seq: 'Em:4 Em:4 Em:4 Em:4', padrao: 'quatro', ritmo: 'acorde', bpm: 60, modo: 'espera' }
      ] },
      { id: 'u2l3', titulo: 'A batida para baixo', min: 4, passos: [
        { t: 'video', video: 'batida' },
        { t: 'texto', titulo: 'Contando até 4', visual: 'batida',
          texto: 'Bata <b>para baixo</b> uma vez em cada tempo e conte em voz alta: <b>1, 2, 3, 4</b>. O pulso fica solto, como quem sacode água da mão.' },
        { t: 'tocar', titulo: 'Em, quatro batidas por compasso', seq: 'Em:4 Em:4 Em:4 Em:4', padrao: 'quatro', ritmo: 'tempos', bpm: 60, modo: 'tempo' }
      ] }
    ]
  },
  {
    id: 'u3', nivel: 'iniciante', titulo: 'Dois acordes: Em e D', resumo: 'Com dois acordes você já toca uma música inteira.', musica: 'pra-nao-dizer',
    licoes: [
      { id: 'u3l1', titulo: 'D (Ré maior)', min: 4, passos: [
        { t: 'texto', titulo: 'Um triângulo de dedos', visual: null,
          texto: 'O <b>D</b> forma um triângulo com os dedos 1, 2 e 3 nas três cordas mais finas. Toque só as <b>4 cordas finas</b>: a 6ª e a 5ª têm ×.' },
        { t: 'acorde', acorde: 'D' },
        { t: 'tocar', titulo: 'Toque o D', seq: 'D:4 D:4 D:4 D:4', padrao: 'quatro', ritmo: 'acorde', bpm: 60, modo: 'espera' }
      ] },
      { id: 'u3l2', titulo: 'Trocar Em e D', min: 4, passos: [
        { t: 'texto', titulo: 'O segredo da troca', visual: null,
          texto: 'Levante <b>todos os dedos juntos</b> e pouse todos juntos no acorde novo. Olhe para onde os dedos vão, não para onde estavam.' },
        { t: 'troca', a: 'Em', b: 'D' },
        { t: 'tocar', titulo: 'Em e D no tempo', seq: 'Em:4 D:4 Em:4 D:4 Em:4 D:4', padrao: 'quatro', ritmo: 'acorde', bpm: 60, modo: 'espera' }
      ] },
      { id: 'u3l3', titulo: 'Música: Pra Não Dizer Que Não Falei das Flores', min: 5, musicaFinal: true, passos: [
        { t: 'texto', titulo: 'Sua primeira música', visual: null,
          texto: 'Esta música de Geraldo Vandré tem só <b>Em e D</b> do começo ao fim. Comece no modo <b>Esperar por mim</b>: a música para em cada acorde até você acertar.' },
        { t: 'tocar', musica: 'pra-nao-dizer', secao: 0, ritmo: 'acorde', modo: 'espera' }
      ] }
    ]
  },
  {
    id: 'u4', nivel: 'iniciante', titulo: 'Três acordes: Em, C e D', resumo: 'O C entra na turma e o rock nacional fica ao alcance.', musica: 'que-pais-e-este',
    licoes: [
      { id: 'u4l1', titulo: 'C (Dó maior)', min: 4, passos: [
        { t: 'texto', titulo: 'Uma escadinha', visual: null,
          texto: 'O <b>C</b> parece uma escadinha: dedo 3 na 5ª corda, dedo 2 na 4ª e dedo 1 na 2ª. A 6ª corda fica de fora.' },
        { t: 'acorde', acorde: 'C' },
        { t: 'troca', a: 'C', b: 'D' }
      ] },
      { id: 'u4l2', titulo: 'Em, C e D juntos', min: 4, passos: [
        { t: 'tocar', titulo: 'Em, C e D', seq: 'Em:4 C:4 D:4 Em:4 C:4 D:4', padrao: 'quatro', ritmo: 'acorde', bpm: 60, modo: 'espera' },
        { t: 'tocar', titulo: 'Agora no tempo', seq: 'Em:4 C:4 D:4 Em:4 C:4 D:4', padrao: 'quatro', ritmo: 'tempos', bpm: 66, modo: 'tempo' }
      ] },
      { id: 'u4l3', titulo: 'Música: Que País É Este', min: 5, musicaFinal: true, passos: [
        { t: 'texto', titulo: 'Rock com três acordes', visual: null,
          texto: 'A Legião Urbana fez este clássico só com <b>Em, C e D</b> e batidas para baixo. Comece com a Introdução.' },
        { t: 'tocar', musica: 'que-pais-e-este', secao: 0, ritmo: 'acorde', modo: 'espera' }
      ] }
    ]
  },
  {
    id: 'u5', nivel: 'iniciante', titulo: 'G e o baião', resumo: 'O G completa o trio G, C e D, e você toca Luiz Gonzaga.', musica: 'asa-branca',
    licoes: [
      { id: 'u5l1', titulo: 'G (Sol maior)', min: 4, passos: [
        { t: 'acorde', acorde: 'G' },
        { t: 'troca', a: 'G', b: 'C' },
        { t: 'troca', a: 'G', b: 'D' }
      ] },
      { id: 'u5l2', titulo: 'Ritmos brasileiros: o baião', min: 4, passos: [
        { t: 'video', video: 'samba' },
        { t: 'texto', titulo: 'Polegar e dedos', visual: null,
          texto: 'No baião o <b>polegar</b> faz a zabumba nas cordas graves ("tum... tum") e os <b>dedos</b> respondem nas agudas, como o triângulo. Se ficar difícil, use batidas para baixo: tudo bem.' },
        { t: 'tocar', titulo: 'G, C e D no baião', seq: 'G:4 C:4 D:4 G:4', padrao: 'baiao', ritmo: 'batida', bpm: 70, modo: 'pratica' }
      ] },
      { id: 'u5l3', titulo: 'Música: Asa Branca', min: 5, musicaFinal: true, passos: [
        { t: 'tocar', musica: 'asa-branca', secao: 0, ritmo: 'acorde', modo: 'espera' }
      ] }
    ]
  },
  {
    id: 'u6', nivel: 'iniciante', titulo: 'Am e a batida pop', resumo: 'Am, a batida para cima e duas músicas de MPB e pop.', musica: 'o-sol',
    licoes: [
      { id: 'u6l1', titulo: 'Am (Lá menor)', min: 4, passos: [
        { t: 'texto', titulo: 'Parece o E, uma corda abaixo', visual: null,
          texto: 'O <b>Am</b> tem o mesmo desenho do E, só que uma corda mais para baixo. A 6ª corda fica de fora.' },
        { t: 'acorde', acorde: 'Am' },
        { t: 'troca', a: 'Am', b: 'Em' }
      ] },
      { id: 'u6l2', titulo: 'Para baixo e para cima', min: 4, passos: [
        { t: 'texto', titulo: 'A mão nunca para', visual: 'batida',
          texto: 'Bata <b>para baixo</b> no número e <b>para cima</b> no "e": 1 e 2 e 3 e 4 e. A mão vai e volta como um pêndulo.' },
        { t: 'tocar', titulo: 'Baixo e cima com Em e Am', seq: 'Em:4 Am:4 Em:4 Am:4', padrao: 'baixocima', ritmo: 'batida', bpm: 56, modo: 'pratica' }
      ] },
      { id: 'u6l3', titulo: 'Música: Velha Infância', min: 5, musicaFinal: true, passos: [
        { t: 'tocar', musica: 'velha-infancia', secao: 0, ritmo: 'acorde', modo: 'espera' }
      ] },
      { id: 'u6l4', titulo: 'Música: O Sol', min: 5, musicaFinal: true, passos: [
        { t: 'tocar', musica: 'o-sol', secao: 0, ritmo: 'acorde', modo: 'espera' }
      ] }
    ]
  },
  {
    id: 'u7', nivel: 'iniciante', titulo: 'A, E e a tablatura', resumo: 'Mais dois acordes, a primeira melodia e Trem-Bala.', musica: 'trem-bala',
    licoes: [
      { id: 'u7l1', titulo: 'A (Lá maior)', min: 4, passos: [
        { t: 'texto', titulo: 'Três dedos na mesma casa', visual: null,
          texto: 'No <b>A</b> os dedos 1, 2 e 3 ficam lado a lado na casa 2. Se não couberem, deixe-os um pouco inclinados.' },
        { t: 'acorde', acorde: 'A' },
        { t: 'troca', a: 'A', b: 'D' }
      ] },
      { id: 'u7l2', titulo: 'E (Mi maior)', min: 4, passos: [
        { t: 'acorde', acorde: 'E' },
        { t: 'troca', a: 'A', b: 'E' }
      ] },
      { id: 'u7l3', titulo: 'Lendo tablatura', min: 4, passos: [
        { t: 'video', video: 'tab' },
        { t: 'texto', titulo: 'Seis linhas e números', visual: 'tab',
          texto: 'Cada linha é uma corda, com a <b>1ª em cima</b>. O número diz a casa e <b>0</b> é corda solta. Toque as notas uma de cada vez, da esquerda para a direita.' },
        { t: 'notas', melodia: 'estrelinha', titulo: 'Brilha, Brilha Estrelinha' }
      ] },
      { id: 'u7l4', titulo: 'Música: Trem-Bala', min: 5, musicaFinal: true, passos: [
        { t: 'texto', titulo: 'A9 e D9', visual: null,
          texto: 'Na cifra aparecem <b>A9</b> e <b>D9</b>: são o A e o D com um dedo a menos (fica uma corda solta soando). Mais fácil e mais bonito.' },
        { t: 'tocar', musica: 'trem-bala', secao: 0, ritmo: 'acorde', modo: 'espera' }
      ] }
    ]
  },
  {
    id: 'u8', nivel: 'iniciante', titulo: 'Sétimas e Jorge Ben Jor', resumo: 'Am7, Bm7, B7 e D7, o samba-rock e as músicas do Jorge Ben.', musica: 'taj-mahal',
    licoes: [
      { id: 'u8l1', titulo: 'Am7 e Bm7', min: 4, passos: [
        { t: 'texto', titulo: 'O som da sétima', visual: null,
          texto: 'Somar a <b>sétima</b> deixa o acorde com mais "balanço". O <b>Am7</b> é o Am sem o dedo 3, e o <b>Bm7</b> substitui o Bm, que tem pestana.' },
        { t: 'acorde', acorde: 'Am7' },
        { t: 'acorde', acorde: 'Bm7' },
        { t: 'troca', a: 'Am7', b: 'Bm7' }
      ] },
      { id: 'u8l2', titulo: 'O samba-rock', min: 4, passos: [
        { t: 'texto', titulo: 'A batida do Jorge Ben', visual: null,
          texto: 'Mão direita solta, acentos fora do tempo e muito balanço. Comece ouvindo a prática e acompanhando só com batidas para baixo.' },
        { t: 'tocar', titulo: 'Am7, Bm7 e Em', seq: 'Am7:2 Bm7:2 Em:4 Am7:2 Bm7:2 Em:4', padrao: 'sambarock', ritmo: 'batida', bpm: 76, modo: 'pratica' }
      ] },
      { id: 'u8l3', titulo: 'Música: Taj Mahal', min: 5, musicaFinal: true, passos: [
        { t: 'texto', titulo: 'O capotraste', visual: null,
          texto: 'Para soar igual à gravação, coloque o <b>capotraste na 2ª casa</b>. Sem capo também vale: o desenho é o mesmo, só fica mais grave.' },
        { t: 'tocar', musica: 'taj-mahal', secao: 0, ritmo: 'acorde', modo: 'espera' }
      ] },
      { id: 'u8l4', titulo: 'B7 e D7', min: 4, passos: [
        { t: 'acorde', acorde: 'B7' },
        { t: 'acorde', acorde: 'D7' },
        { t: 'troca', a: 'Em7', b: 'B7' }
      ] },
      { id: 'u8l5', titulo: 'Música: Mas Que Nada', min: 5, musicaFinal: true, passos: [
        { t: 'tocar', musica: 'mas-que-nada', secao: 0, ritmo: 'acorde', modo: 'espera' }
      ] }
    ]
  },
  /* ===== Iniciante, fim: a cifra ===== */
  {
    id: 'u9', nivel: 'iniciante', titulo: 'A cifra: o nome de cada acorde', resumo: 'Por que cada acorde tem uma letra, e o que querem dizer o m, os números, o # e a barra.', musica: 'chove-chuva',
    licoes: [
      { id: 'u9l1', titulo: 'Por que letras?', min: 4, passos: [
        { t: 'texto', titulo: 'Sete notas, sete letras', visual: 'letras',
          texto: 'A música usa 7 notas: <b>Dó, Ré, Mi, Fá, Sol, Lá, Si</b>. Na cifra cada uma vira uma letra: <b>C D E F G A B</b>. A letra do acorde é a nota principal dele, a <b>fundamental</b>: o acorde C é construído em cima do Dó. Toque nas letras para ouvir.' },
        { t: 'texto', titulo: 'Por que o A é o Lá?', visual: null,
          texto: 'Há mais de mil anos os monges da Europa já escreviam as notas com letras e começavam a contar pelo <b>Lá</b>, a nota mais grave do sistema que usavam: A, B, C… Por volta do ano 1000, o monge italiano <b>Guido d’Arezzo</b> deu nomes cantáveis às notas, com a primeira sílaba de cada verso de um hino: <b>Ut, Ré, Mi, Fá, Sol, Lá</b>. Depois o Ut virou <b>Dó</b> e chegou o <b>Si</b>. O Brasil fala Dó, Ré, Mi, mas a cifra usa as letras: são curtas e iguais no mundo todo.' },
        { t: 'quiz', pergunta: 'Qual letra é o Sol?', opcoes: ['S', 'G', 'D'], certa: 1, explica: 'C D E F G A B = Dó Ré Mi Fá Sol Lá Si. O Sol é o G.' },
        { t: 'quiz', pergunta: 'O acorde D é construído em cima de qual nota?', opcoes: ['Dó', 'Ré', 'Mi'], certa: 1, explica: 'D é Ré. A letra é sempre a fundamental do acorde.' }
      ] },
      { id: 'u9l2', titulo: 'Maior e menor', min: 3, passos: [
        { t: 'texto', titulo: 'Sem nada é maior; com m é menor', visual: 'maiorMenor',
          texto: 'Só a letra quer dizer acorde <b>maior</b>, de som aberto e alegre: <b>A</b> é Lá maior. Um <b>m</b> minúsculo logo depois da letra quer dizer <b>menor</b>, de som mais fechado e triste: <b>Am</b> é Lá menor. Entre o E e o Em muda uma nota só. Ouça os dois.' },
        { t: 'quiz', pergunta: 'O que é Dm?', opcoes: ['Ré maior', 'Ré menor', 'Dó menor'], certa: 1, explica: 'D = Ré e m = menor.' },
        { t: 'quiz', pergunta: 'Qual destes é um acorde maior?', opcoes: ['Em', 'G', 'Am'], certa: 1, explica: 'Sem o m depois da letra, o acorde é maior.' }
      ] },
      { id: 'u9l3', titulo: 'Os números do acorde', min: 5, passos: [
        { t: 'texto', titulo: 'Contando a partir da letra', visual: 'contar',
          texto: 'Os números contam as notas a partir da fundamental. Conte as letras a partir do G: G (1), A (2), B (3), C (4), D (5), E (6), F (7). O acorde G junta as notas <b>1, 3 e 5</b>: Sol, Si e Ré. No <b>G7</b> entra também a nota 7, o Fá.' },
        { t: 'texto', titulo: '7, 7M e 9', visual: 'setimas',
          texto: '<b>7</b> soma a sétima, 2 casas abaixo da oitava: um som de tensão, que pede o próximo acorde. <b>7M</b> é a sétima maior, só 1 casa abaixo da oitava: som macio, de bossa nova. <b>9</b> soma a nona, a 2ª nota uma oitava acima: o acorde fica mais brilhante.' },
        { t: 'quiz', pergunta: 'O que o número 7 faz no acorde?', opcoes: ['Soma uma nota: a sétima', 'Manda tocar 7 cordas', 'Manda apertar a casa 7'], certa: 0, explica: 'O número conta notas a partir da fundamental. O 7 é a sétima nota.' },
        { t: 'quiz', pergunta: 'Qual soa mais macio, com cara de bossa nova?', opcoes: ['C7M', 'C7', 'C'], certa: 0, explica: 'A sétima maior (7M) é o som da bossa. O 7 sozinho tem mais tensão.' }
      ] },
      { id: 'u9l4', titulo: 'Sustenido, bemol e a barra', min: 5, passos: [
        { t: 'texto', titulo: '# sobe, b desce', visual: 'sustenido',
          texto: '<b>#</b> (sustenido) sobe <b>meio tom</b>, uma casa. <b>b</b> (bemol) desce uma casa. <b>F#</b> é Fá sustenido e <b>Bb</b> é Si bemol. F# e Gb são a mesma casa com dois nomes.' },
        { t: 'texto', titulo: 'A barra: o baixo', visual: 'barra',
          texto: 'Depois da barra vem a nota do <b>baixo</b>, a mais grave do acorde: <b>G/B</b> é o acorde G com o Si no baixo. A barra faz o baixo andar de uma nota para a vizinha: em <b>C, G/B, Am</b> o baixo desce Dó, Si, Lá.' },
        { t: 'texto', titulo: 'Lendo uma cifra inteira', visual: 'anatomia',
          texto: 'Leia na ordem: <b>letra</b>, <b>#</b> ou <b>b</b>, <b>m</b>, números e, por último, a <b>barra</b>. <b>F#m7/E</b> = Fá sustenido menor com sétima, com Mi no baixo. Toque em cada parte para ouvir o acorde sendo montado.' },
        { t: 'quiz', pergunta: 'O que é G/B?', opcoes: ['Sol com Si no baixo', 'Sol ou Si, tanto faz', 'Sol bemol'], certa: 0, explica: 'Depois da barra vem a nota do baixo.' },
        { t: 'quiz', pergunta: 'Qual nota é a mesma casa que F#?', opcoes: ['Fb', 'Gb', 'G#'], certa: 1, explica: 'Fá sustenido (meio tom acima do Fá) = Sol bemol (meio tom abaixo do Sol).' }
      ] },
      { id: 'u9l5', titulo: 'Música: Chove Chuva', min: 5, musicaFinal: true, passos: [
        { t: 'texto', titulo: 'Uma música só de sétimas', visual: null,
          texto: 'Chove Chuva, de Jorge Ben Jor, usa <b>Am7, Dm7, A7, D7 e G7</b>. Antes de tocar, leia cada nome em voz alta: “Lá menor com sétima”, “Ré menor com sétima”, “Lá com sétima”… Assim a cifra vira linguagem.' },
        { t: 'tocar', musica: 'chove-chuva', secao: 0, ritmo: 'acorde', modo: 'espera' }
      ] }
    ]
  },
  /* ===== Intermediário ===== */
  {
    id: 'i1', nivel: 'intermediario', titulo: 'A pestana', resumo: 'O dedo 1 deitado: F e Bm soando limpos, e um desenho que vira 12 acordes.', musica: 'anunciacao',
    licoes: [
      { id: 'i1l1', titulo: 'Como fazer a pestana', min: 5, passos: [
        { t: 'texto', titulo: 'O dedo 1 deitado', visual: 'pestanaF',
          texto: 'Na pestana o <b>dedo 1</b> deita sobre várias cordas na mesma casa, como um capotraste. Use a <b>lateral</b> do dedo (a parte mais dura), bem colada no traste, e deixe o peso do braço ajudar em vez de esmagar com o polegar.' },
        { t: 'texto', titulo: 'Teste corda por corda', visual: null,
          texto: 'Monte a pestana e toque <b>uma corda de cada vez</b>. Se alguma sair abafada, mova o dedo 1 alguns milímetros para cima ou para baixo: quase sempre a corda caiu numa dobrinha do dedo.' },
        { t: 'acorde', acorde: 'F' },
        { t: 'quiz', pergunta: 'Qual parte do dedo 1 faz a pestana?', opcoes: ['A lateral, mais dura', 'A ponta', 'A parte mole da frente'], certa: 0, explica: 'A lateral é mais firme e tem menos dobrinhas.' }
      ] },
      { id: 'i1l2', titulo: 'F na prática', min: 4, passos: [
        { t: 'texto', titulo: 'Enquanto o F não sai', visual: null,
          texto: 'Treine o F completo <b>1 minuto por dia</b>: em 2 ou 3 semanas ele sai limpo. Enquanto isso, nas músicas, use o <b>F7M</b> (sem pestana) ou a meia pestana só nas cordas 1 e 2.' },
        { t: 'troca', a: 'C', b: 'F' },
        { t: 'tocar', titulo: 'C, F e G', seq: 'C:4 F:4 G:4 C:4 C:4 F:4 G:4 C:4', padrao: 'pop', ritmo: 'acorde', bpm: 60, modo: 'espera' }
      ] },
      { id: 'i1l3', titulo: 'Bm: o Am que anda', min: 4, passos: [
        { t: 'texto', titulo: 'O desenho do Am com pestana', visual: null,
          texto: 'O <b>Bm</b> é o desenho do <b>Am</b> com pestana, duas casas acima: o dedo 1 deita na casa 2 e os dedos 2, 3 e 4 fazem o desenho do Am logo à frente. A 6ª corda não toca.' },
        { t: 'acorde', acorde: 'Bm' },
        { t: 'troca', a: 'D', b: 'Bm' },
        { t: 'tocar', titulo: 'D, Bm, G e A', seq: 'D:4 Bm:4 G:4 A:4 D:4 Bm:4 G:4 A:4', padrao: 'pop', ritmo: 'acorde', bpm: 60, modo: 'espera' }
      ] },
      { id: 'i1l4', titulo: 'Um desenho, doze acordes', min: 5, passos: [
        { t: 'texto', titulo: 'Mova a pestana', visual: 'notasBraco',
          texto: 'O desenho do F serve para <b>qualquer</b> acorde maior: o nome é a nota da <b>6ª corda</b> onde está a pestana. Casa 3 = <b>G</b>, casa 5 = <b>A</b>, casa 8 = <b>C</b>. O desenho do Bm faz o mesmo com a <b>5ª corda</b>: casa 3 = Cm, casa 5 = Dm, casa 7 = Em. No exercício: <b>F#m</b> é o desenho do Em com pestana na casa 2; <b>Bm</b> e <b>C#m</b> são o desenho do Am nas casas 2 e 4.' },
        { t: 'quiz', pergunta: 'Desenho do F com a pestana na casa 5. Que acorde é?', opcoes: ['G', 'A', 'B'], certa: 1, explica: 'Na 6ª corda: E (solta), F (1), F# (2), G (3), G# (4), A (5).' },
        { t: 'quiz', pergunta: 'Desenho do Bm com a pestana na casa 7. Que acorde é?', opcoes: ['Em', 'Dm', 'Fm'], certa: 0, explica: 'Na 5ª corda: A (solta), Bb (1), B (2), C (3), C# (4), D (5), D# (6), E (7).' },
        { t: 'tocar', titulo: 'Só pestanas: F#m, Bm e C#m', seq: 'F#m:4 Bm:4 C#m:4 F#m:4 F#m:4 Bm:4 C#m:4 F#m:4', padrao: 'quatro', ritmo: 'acorde', bpm: 56, modo: 'espera' }
      ] },
      { id: 'i1l5', titulo: 'Música: Anunciação', min: 5, musicaFinal: true, passos: [
        { t: 'texto', titulo: 'O F numa música', visual: null,
          texto: 'Anunciação, de Alceu Valença, tem um <b>F</b> no meio de G, Am, C e Em. Comece no modo Esperar por mim. Aqui os acordes ficam como na cifra, com pestana.' },
        { t: 'tocar', musica: 'anunciacao', secao: 0, ritmo: 'acorde', modo: 'espera' }
      ] }
    ]
  },
  {
    id: 'i2', nivel: 'intermediario', titulo: 'Como os acordes são feitos', resumo: 'Intervalos, tríades e sétimas: a receita por trás de cada nome da cifra.',
    licoes: [
      { id: 'i2l1', titulo: 'Intervalos', min: 5, passos: [
        { t: 'texto', titulo: 'A distância entre duas notas', visual: 'intervalos',
          texto: 'Intervalo é a distância entre duas notas, e no violão ele se mede em <b>casas</b> (semitons). Os que montam os acordes: <b>3 casas</b> = terça menor, <b>4 casas</b> = terça maior, <b>7 casas</b> = quinta justa. <b>12 casas</b> = oitava, a mesma nota mais aguda.' },
        { t: 'quiz', pergunta: 'Quantas casas tem uma terça maior?', opcoes: ['3', '4', '5'], certa: 1, explica: 'Terça menor = 3 casas, terça maior = 4.' },
        { t: 'quiz', pergunta: 'E a quinta justa?', opcoes: ['5', '7', '9'], certa: 1, explica: '7 casas. É a nota que deixa o acorde cheio.' },
        { t: 'ouvido', tipo: 'intervalo', n: 5 }
      ] },
      { id: 'i2l2', titulo: 'Tríades', min: 5, passos: [
        { t: 'texto', titulo: 'Empilhando terças', visual: 'triades',
          texto: 'A tríade empilha duas <b>terças</b> em cima da fundamental. <b>Maior</b> = 4 + 3 casas (C E G). <b>Menor</b> = 3 + 4 (C Eb G). <b>Diminuta</b> = 3 + 3 (C Eb Gb), som tenso. <b>Aumentada</b> = 4 + 4 (C E G#), som de suspense.' },
        { t: 'texto', titulo: 'Por isso o dedo anda uma casa', visual: 'maiorMenor',
          texto: 'Do E para o Em, do A para o Am e do D para o Dm muda <b>uma nota só</b>: a terça desce uma casa. É a diferença entre 4 e 3 casas.' },
        { t: 'quiz', pergunta: 'C, Eb e G formam…', opcoes: ['Dó maior', 'Dó menor', 'Dó diminuto'], certa: 1, explica: 'Do C ao Eb são 3 casas (terça menor) e do Eb ao G são 4: menor.' },
        { t: 'quiz', pergunta: 'Qual tríade é 4 + 4 casas?', opcoes: ['Maior', 'Diminuta', 'Aumentada'], certa: 2, explica: 'Duas terças maiores: aumentada.' },
        { t: 'ouvido', tipo: 'maiorMenor', n: 5 }
      ] },
      { id: 'i2l3', titulo: 'Sétimas', min: 5, passos: [
        { t: 'texto', titulo: 'A quarta nota', visual: 'setimas',
          texto: 'Empilhe mais uma terça e nasce o acorde de <b>sétima</b>. <b>C7M</b> = C E G B (sétima maior: sonhador). <b>C7</b> = C E G Bb (sétima menor: tensão que quer resolver). <b>Cm7</b> = C Eb G Bb (macio, muito usado no samba). Mais uma terça e chega a <b>nona</b>, o Ré.' },
        { t: 'texto', titulo: 'Por que o G7 pede o C', visual: 'resolucao',
          texto: 'No <b>G7</b> as notas <b>Si</b> e <b>Fá</b> ficam a 6 casas uma da outra, o <b>trítono</b>, e soam instáveis. O ouvido pede alívio: o Si sobe para o <b>Dó</b> e o Fá desce para o <b>Mi</b>, notas do acorde C.' },
        { t: 'acorde', acorde: 'C7' },
        { t: 'quiz', pergunta: 'Qual é a sétima do C7?', opcoes: ['B', 'Bb', 'A'], certa: 1, explica: 'O 7 é a sétima menor, 2 casas abaixo do Dó: o Si bemol. O Si natural seria o 7M.' },
        { t: 'tocar', titulo: 'Sétimas em sequência', seq: 'C7M:4 A7:4 Dm7:4 G7:4 C7M:4 A7:4 Dm7:4 G7:4', padrao: 'pop', ritmo: 'acorde', bpm: 60, modo: 'espera' }
      ] }
    ]
  },
  {
    id: 'i3', nivel: 'intermediario', titulo: 'Samba e pagode', resumo: 'O polegar no surdo, os dedos no tamborim e o tapa do pagode, com a banda tocando junto.', musica: 'trem-das-onze',
    licoes: [
      { id: 'i3l1', titulo: 'O samba completo', min: 5, passos: [
        { t: 'video', video: 'samba' },
        { t: 'texto', titulo: 'Surdo e tamborim', visual: 'ritmoSamba',
          texto: 'No samba o <b>polegar</b> toca o baixo nos dois tempos, como o surdo, e os <b>dedos</b> puxam as cordas agudas no contratempo, como o tamborim. Conte “<b>1</b> e <b>2</b> e” e deixe o polegar firme: ele é o chão da música.' },
        { t: 'tocar', titulo: 'Samba em Lá menor', seq: 'Am:4 Dm:4 E7:4 Am:4 Am:4 Dm:4 E7:4 Am:4', padrao: 'samba', ritmo: 'batida', bpm: 66, modo: 'pratica', banda: true }
      ] },
      { id: 'i3l2', titulo: 'O pagode e o tapa', min: 5, passos: [
        { t: 'texto', titulo: 'Mão cheia', visual: 'ritmoPagode',
          texto: 'O pagode usa a base do samba com a mão direita mais <b>cheia</b>. Às vezes os dedos dão um <b>tapa</b> nas cordas, abafando o som como uma caixa de percussão. O pulso fica solto e o polegar não para.' },
        { t: 'tocar', titulo: 'Pagode em Dó', seq: 'C:4 A7:4 Dm:4 G7:4 C:4 A7:4 Dm:4 G7:4', padrao: 'pagode', ritmo: 'batida', bpm: 70, modo: 'pratica', banda: true }
      ] },
      { id: 'i3l3', titulo: 'O caminho do samba', min: 5, passos: [
        { t: 'texto', titulo: 'C, A7, Dm, G7', visual: 'dominantes',
          texto: 'A sequência <b>C, A7, Dm, G7</b> aparece em centenas de sambas. O <b>A7</b> puxa para o Dm e o <b>G7</b> puxa de volta para o C. Agora no tempo, com a banda.' },
        { t: 'tocar', titulo: 'No tempo', seq: 'C:4 A7:4 Dm:4 G7:4 C:4 A7:4 Dm:4 G7:4', padrao: 'samba', ritmo: 'acorde', bpm: 70, modo: 'tempo', banda: true }
      ] },
      { id: 'i3l4', titulo: 'Música: Trem das Onze', min: 5, musicaFinal: true, passos: [
        { t: 'texto', titulo: 'Samba paulista', visual: null,
          texto: 'Trem das Onze, de Adoniran Barbosa, estourou com os Demônios da Garoa em 1964. Está em Lá menor: <b>Am, Dm, E7</b> e o <b>F</b> com pestana. Comece no Esperar por mim e depois tente com a batida de samba.' },
        { t: 'tocar', musica: 'trem-das-onze', secao: 1, ritmo: 'acorde', modo: 'espera' }
      ] }
    ]
  },
  {
    id: 'i4', nivel: 'intermediario', titulo: 'Dedilhado e valsa', resumo: 'p, i, m, a: cada dedo numa corda, o baixo certo de cada acorde e o compasso de 3.', musica: 'aquarela',
    licoes: [
      { id: 'i4l1', titulo: 'p, i, m, a', min: 5, passos: [
        { t: 'texto', titulo: 'Cada dedo numa corda', visual: 'pima',
          texto: 'No dedilhado cada dedo da mão direita cuida de uma corda: <b>p</b> (polegar) no baixo, <b>i</b> (indicador) na 3ª, <b>m</b> (médio) na 2ª e <b>a</b> (anelar) na 1ª. As letras vêm do espanhol: pulgar, índice, medio, anular.' },
        { t: 'tocar', titulo: 'Dedilhado em Am e C', seq: 'Am:4 Am:4 C:4 C:4 Am:4 Am:4 C:4 C:4', padrao: 'dedilhado', ritmo: 'batida', bpm: 56, modo: 'pratica' }
      ] },
      { id: 'i4l2', titulo: 'O baixo certo', min: 5, passos: [
        { t: 'texto', titulo: 'O polegar acha a fundamental', visual: null,
          texto: 'O polegar começa sempre na corda da <b>fundamental</b>, a nota da letra: no <b>E</b>, <b>Em</b> e <b>G</b>, a 6ª corda; no <b>A</b>, <b>Am</b> e <b>C</b>, a 5ª; no <b>D</b> e <b>Dm</b>, a 4ª.' },
        { t: 'quiz', pergunta: 'No D, o polegar toca qual corda?', opcoes: ['6ª', '5ª', '4ª'], certa: 2, explica: 'A fundamental do D é a 4ª corda solta (Ré).' },
        { t: 'quiz', pergunta: 'E no C?', opcoes: ['5ª, casa 3', '6ª, casa 3', '4ª solta'], certa: 0, explica: 'O Dó do acorde C está na 5ª corda, casa 3.' },
        { t: 'notas', melodia: 'arpejos', titulo: 'Arpejos: C, Am, F e G' }
      ] },
      { id: 'i4l3', titulo: 'A valsa', min: 4, passos: [
        { t: 'texto', titulo: 'Três tempos', visual: 'ritmoValsa',
          texto: 'A valsa tem <b>3 tempos</b> por compasso: o polegar no 1 e os dedos juntos no 2 e no 3, “TUM, pá, pá”. É o compasso das serestas e das modinhas.' },
        { t: 'tocar', titulo: 'Valsa em Sol', seq: 'G:3 G:3 D7:3 D7:3 D7:3 D7:3 G:3 G:3', padrao: 'valsa', ritmo: 'batida', bpm: 80, modo: 'pratica', banda: true }
      ] },
      { id: 'i4l4', titulo: 'Música: Aquarela', min: 5, musicaFinal: true, passos: [
        { t: 'texto', titulo: 'Dedilhado com baixos que andam', visual: null,
          texto: 'Aquarela, de Toquinho (1983), é tocada dedilhada. Repare nos acordes com barra: <b>G/B</b>, <b>Em/D</b>, <b>D/F#</b> e <b>C/E</b>. Neles o polegar não toca a fundamental, e sim a nota depois da barra.' },
        { t: 'tocar', musica: 'aquarela', secao: 2, ritmo: 'acorde', modo: 'espera' }
      ] }
    ]
  },
  {
    id: 'i5', nivel: 'intermediario', titulo: 'Campo harmônico', resumo: 'A família de acordes de cada tom, os graus e como mudar o tom de qualquer música.', musica: 'pais-e-filhos',
    licoes: [
      { id: 'i5l1', titulo: 'A família de acordes', min: 5, passos: [
        { t: 'texto', titulo: 'Os 7 acordes de um tom', visual: 'campoC',
          texto: 'Cada tom tem <b>7 acordes</b> que nascem da sua escala: o <b>campo harmônico</b>. Em Dó maior: <b>C, Dm, Em, F, G, Am e Bm7(b5)</b>. Os números romanos dão o lugar de cada um: I, ii, iii, IV, V, vi, vii. Maiúsculo = maior, minúsculo = menor.' },
        { t: 'texto', titulo: 'A fórmula', visual: null,
          texto: 'Em <b>qualquer</b> tom maior a ordem é a mesma: <b>maior, menor, menor, maior, maior, menor, meio-diminuto</b>. Em Sol: G, Am, Bm, C, D, Em, F#m7(b5).' },
        { t: 'quiz', pergunta: 'Em Ré maior, qual é o IV?', opcoes: ['G', 'A', 'Em'], certa: 0, explica: 'D (I), Em (ii), F#m (iii), G (IV).' },
        { t: 'quiz', pergunta: 'Qual é o vi de Dó maior?', opcoes: ['Am', 'Em', 'Dm'], certa: 0, explica: 'C D E F G A: a 6ª nota é o Lá, e o vi é menor: Am.' }
      ] },
      { id: 'i5l2', titulo: 'I, IV e V', min: 5, passos: [
        { t: 'texto', titulo: 'As três mais usadas', visual: null,
          texto: 'Os acordes <b>I, IV e V</b> sustentam milhares de músicas. Em Sol: G, C e D (Asa Branca!). Em Lá: A, D e E. O <b>V</b> cria tensão e o <b>I</b> é a casa, onde a música descansa.' },
        { t: 'quiz', pergunta: 'I, IV e V em Lá maior', opcoes: ['A, D e E', 'A, C e D', 'A, B e E'], certa: 0, explica: 'A (1), B (2), C# (3), D (4), E (5).' },
        { t: 'ouvido', tipo: 'grau', n: 5 },
        { t: 'tocar', titulo: 'I, IV e V em Lá', seq: 'A:4 D:4 E:4 A:4 A:4 D:4 E:4 A:4', padrao: 'baiao', ritmo: 'acorde', bpm: 70, modo: 'tempo', banda: true }
      ] },
      { id: 'i5l3', titulo: 'Mudando o tom', min: 5, passos: [
        { t: 'texto', titulo: 'Pense em graus', visual: 'transpor',
          texto: 'Pense na música em <b>graus</b>, não em letras: “I, vi, IV, V”. Em Dó é C, Am, F, G; em Sol é G, Em, C, D. Mudar o tom é trocar a linha da tabela. O botão <b>Tom</b> de cada música faz essa conta por você.' },
        { t: 'texto', titulo: 'As contas do capotraste', visual: null,
          texto: 'Cada casa do capotraste sobe meio tom. Com o capo na casa 2, o desenho do <b>G</b> soa <b>A</b> e o do <b>C</b> soa <b>D</b>. O que soa = desenho + casas do capo.' },
        { t: 'quiz', pergunta: 'I, vi, IV, V em Ré maior', opcoes: ['D, Bm, G, A', 'D, Em, G, A', 'D, Bm, A, G'], certa: 0, explica: 'I = D, vi = Bm, IV = G, V = A.' },
        { t: 'quiz', pergunta: 'Capo na casa 2 e desenho de G. Que acorde soa?', opcoes: ['G', 'A', 'F'], certa: 1, explica: 'G + 2 casas = A.' }
      ] },
      { id: 'i5l4', titulo: 'Música: Pais e Filhos', min: 5, musicaFinal: true, passos: [
        { t: 'texto', titulo: 'A família de Sol numa música', visual: null,
          texto: 'Pais e Filhos, da Legião Urbana (1989), está em Sol maior: <b>G</b> (I), <b>Am</b> (ii), <b>Bm</b> (iii), <b>C</b> (IV), <b>D</b> (V) e <b>Em</b> (vi). O <b>F</b> não é da família: é um acorde emprestado de outro tom, que muda a cor da música.' },
        { t: 'tocar', musica: 'pais-e-filhos', secao: 1, ritmo: 'acorde', modo: 'espera' }
      ] }
    ]
  },
  {
    id: 'i6', nivel: 'intermediario', titulo: 'Repertório', resumo: 'Quatro músicas para juntar tudo: pestana, sétimas, samba e baixos que andam.', musica: 'o-leaozinho',
    licoes: [
      { id: 'i6l1', titulo: 'Música: Deixa a Vida Me Levar', min: 5, musicaFinal: true, passos: [
        { t: 'texto', titulo: 'Pagode em Mi maior', visual: null,
          texto: 'Gravada por Zeca Pagodinho em 2002. Os acordes menores com sétima <b>C#m7</b>, <b>F#m7</b> e <b>G#m7</b> são feitos com pestana, no desenho do Am7 ou do Em7.' },
        { t: 'tocar', musica: 'deixa-a-vida-me-levar', secao: 1, ritmo: 'acorde', modo: 'espera' }
      ] },
      { id: 'i6l2', titulo: 'Música: Azul da Cor do Mar', min: 5, musicaFinal: true, passos: [
        { t: 'texto', titulo: 'O soul de Tim Maia', visual: null,
          texto: 'Tim Maia gravou em 1970. <b>A7M</b>, <b>Bm7</b>, <b>C#m7</b> e <b>D7M</b>: sétimas maiores e menores, o som do soul brasileiro. Toque com a batida pop, solta.' },
        { t: 'tocar', musica: 'azul-da-cor-do-mar', secao: 0, ritmo: 'acorde', modo: 'espera' }
      ] },
      { id: 'i6l3', titulo: 'Música: Malandragem', min: 5, musicaFinal: true, passos: [
        { t: 'texto', titulo: 'Pestana do começo ao fim', visual: null,
          texto: 'Composta por Cazuza e Frejat, ficou famosa com Cássia Eller em 1994. <b>Dm</b>, <b>Bb</b>, <b>Gm</b>, <b>F</b> e <b>C</b>: um ótimo treino de pestana.' },
        { t: 'tocar', musica: 'malandragem', secao: 1, ritmo: 'acorde', modo: 'espera' }
      ] },
      { id: 'i6l4', titulo: 'Música: O Leãozinho', min: 5, musicaFinal: true, passos: [
        { t: 'texto', titulo: 'O baixo que desce', visual: null,
          texto: 'Caetano Veloso gravou em 1977. Toque dedilhado e acompanhe o baixo descendo de casa em casa: <b>Am</b>, <b>Am/G#</b>, <b>Am/G</b>, <b>Am/F#</b>.' },
        { t: 'tocar', musica: 'o-leaozinho', secao: 1, ritmo: 'acorde', modo: 'espera' }
      ] }
    ]
  },
  /* ===== Avançado ===== */
  {
    id: 'a1', nivel: 'avancado', titulo: 'Escalas e improviso', resumo: 'A escala maior, a pentatônica e a primeira improvisação em cima da banda.',
    licoes: [
      { id: 'a1l1', titulo: 'A escala maior', min: 5, passos: [
        { t: 'texto', titulo: 'Tom, tom, semitom', visual: 'escalaMaior',
          texto: 'A escala maior tem 7 notas separadas por tons (T, 2 casas) e semitons (S, 1 casa): <b>T T S T T T S</b>. Começando no Dó: C D E F G A B C. A mesma fórmula, começando em qualquer nota, dá a escala maior daquele tom.' },
        { t: 'notas', melodia: 'escala-do', titulo: 'Escala de Dó' },
        { t: 'quiz', pergunta: 'Qual é a fórmula da escala maior?', opcoes: ['T T S T T T S', 'T S T T S T T', 'T T T S T T S'], certa: 0, explica: 'Tom, tom, semitom, tom, tom, tom, semitom.' }
      ] },
      { id: 'a1l2', titulo: 'A pentatônica', min: 5, passos: [
        { t: 'texto', titulo: 'Cinco notas que não erram', visual: 'penta',
          texto: 'A <b>pentatônica menor</b> tem só 5 notas, e quase nenhuma soa errada sobre os acordes do tom. A de Lá menor: <b>A C D E G</b>. No braço ela forma uma caixa a partir da casa 5, com duas notas em cada corda.' },
        { t: 'notas', melodia: 'penta-am', titulo: 'Pentatônica de Lá menor (posição aberta)' },
        { t: 'quiz', pergunta: 'Quais são as notas da pentatônica de Lá menor?', opcoes: ['A C D E G', 'A B C E F', 'A C# E F# G'], certa: 0, explica: 'É a escala menor de Lá sem a 2ª (Si) e a 6ª (Fá).' }
      ] },
      { id: 'a1l3', titulo: 'Improvisando', min: 5, passos: [
        { t: 'texto', titulo: 'Poucas notas, muito espaço', visual: null,
          texto: 'A banda vai tocar <b>Am, G, F e G</b>. Use a pentatônica de Lá menor e invente: comece com 3 notas, repita uma ideia, deixe espaço entre as frases e termine no <b>Lá</b>, a nota de casa.' },
        { t: 'tocar', titulo: 'Base para improvisar', seq: 'Am:4 G:4 F:4 G:4 Am:4 G:4 F:4 G:4 Am:4 G:4 F:4 G:4 Am:8', padrao: 'pop', ritmo: 'acorde', bpm: 76, modo: 'pratica', banda: true }
      ] }
    ]
  },
  {
    id: 'a2', nivel: 'avancado', titulo: 'Tensão e resolução', resumo: 'O II–V–I, as dominantes secundárias e o diminuto de passagem.', musica: 'as-rosas-nao-falam',
    licoes: [
      { id: 'a2l1', titulo: 'O II–V–I', min: 5, passos: [
        { t: 'texto', titulo: 'A frase mais tocada da bossa', visual: 'iiVI',
          texto: 'Antes de chegar em casa, a música passa pelo <b>ii</b> e pelo <b>V7</b>. Em Dó: <b>Dm7, G7, C7M</b>. O Dm7 prepara, o G7 cria a tensão e o C7M resolve. Em Sol: Am7, D7, G7M. Em Ré: Em7, A7, D7M.' },
        { t: 'quiz', pergunta: 'II–V–I em Ré maior', opcoes: ['Em7, A7, D7M', 'Am7, D7, G7M', 'Em7, B7, D7M'], certa: 0, explica: 'ii = Em7, V = A7, I = D7M.' },
        { t: 'tocar', titulo: 'II–V–I em Dó e em Sol', seq: 'Dm7:4 G7:4 C7M:8 Am7:4 D7:4 G7M:8', padrao: 'bossa', ritmo: 'acorde', bpm: 66, modo: 'espera' }
      ] },
      { id: 'a2l2', titulo: 'Dominantes secundárias', min: 5, passos: [
        { t: 'texto', titulo: 'Um V7 para cada acorde', visual: 'dominantes',
          texto: 'Qualquer acorde do campo pode ganhar o seu próprio V7. Em Dó: <b>A7</b> leva ao Dm, <b>E7</b> leva ao Am, <b>D7</b> leva ao G. É o tempero do samba e do choro.' },
        { t: 'quiz', pergunta: 'Qual acorde prepara o Am?', opcoes: ['E7', 'A7', 'G7'], certa: 0, explica: 'O V de Lá é o Mi: E7.' },
        { t: 'tocar', titulo: 'C, E7, Am, A7, Dm, G7', seq: 'C:4 E7:4 Am:4 A7:4 Dm:4 G7:4 C:8', padrao: 'samba', ritmo: 'acorde', bpm: 66, modo: 'espera' }
      ] },
      { id: 'a2l3', titulo: 'O diminuto de passagem', min: 5, passos: [
        { t: 'texto', titulo: 'O baixo sobe meio tom', visual: 'diminuto',
          texto: 'O acorde <b>°</b> liga dois acordes subindo o baixo meio tom: <b>C, C#°, Dm7</b>. Ele funciona como um V7 disfarçado do acorde seguinte. Nele as notas ficam a 3 casas uma da outra.' },
        { t: 'acorde', acorde: 'C#°' },
        { t: 'tocar', titulo: 'C, C#°, Dm7, G7', seq: 'C:4 C#°:4 Dm7:4 G7:4 C:4 C#°:4 Dm7:4 G7:4', padrao: 'bossa', ritmo: 'acorde', bpm: 64, modo: 'espera' }
      ] },
      { id: 'a2l4', titulo: 'Música: As Rosas Não Falam', min: 5, musicaFinal: true, passos: [
        { t: 'texto', titulo: 'Dominantes e baixarias', visual: null,
          texto: 'Cartola gravou em 1976. Em Ré menor, o <b>A7</b> e o <b>E7</b> são as dominantes, e os acordes com barra (<b>Dm/C</b>, <b>Gm/Bb</b>, <b>A7/C#</b>, <b>E7/G#</b>) desenham a baixaria do violão.' },
        { t: 'tocar', musica: 'as-rosas-nao-falam', secao: 1, ritmo: 'acorde', modo: 'espera' }
      ] }
    ]
  },
  {
    id: 'a3', nivel: 'avancado', titulo: 'Acordes da bossa nova', resumo: 'Sétimas maiores, nonas e treze, o baixo que anda e o ii–V em tom menor.', musica: 'samba-de-uma-nota-so',
    licoes: [
      { id: 'a3l1', titulo: 'Nonas e treze', min: 6, passos: [
        { t: 'texto', titulo: 'As cores da bossa', visual: 'bossaAcordes',
          texto: 'A bossa nova colore os acordes com <b>tensões</b>: <b>C7M(9)</b>, <b>Am7(9)</b>, <b>Dm7(9)</b>, <b>G7(13)</b>. A nota extra fica no alto do desenho, onde o ouvido presta mais atenção.' },
        { t: 'acorde', acorde: 'C7M(9)' },
        { t: 'acorde', acorde: 'G7(13)' },
        { t: 'tocar', titulo: 'Dm7(9), G7(13), C7M(9)', seq: 'Dm7(9):4 G7(13):4 C7M(9):8 Dm7(9):4 G7(13):4 C7M(9):8', padrao: 'bossa', ritmo: 'acorde', bpm: 60, modo: 'espera' }
      ] },
      { id: 'a3l2', titulo: 'O baixo que anda', min: 5, passos: [
        { t: 'texto', titulo: 'Inversões', visual: 'baixoAnda',
          texto: 'Com a barra, o baixo desce de nota em nota enquanto o desenho de cima quase não muda: <b>C, C/B, Am, Am/G, F</b>. É o baixo caminhante de muitas canções da MPB.' },
        { t: 'notas', melodia: 'baixo-anda', titulo: 'Só o baixo: Dó, Si, Lá, Sol, Fá' },
        { t: 'tocar', titulo: 'C, C/B, Am, Am/G, F, G', seq: 'C:4 C/B:4 Am:4 Am/G:4 F:4 G:4 C:8', padrao: 'dedilhado', ritmo: 'acorde', bpm: 60, modo: 'espera' }
      ] },
      { id: 'a3l3', titulo: 'O ii–V em tom menor', min: 5, passos: [
        { t: 'texto', titulo: 'O meio-diminuto', visual: null,
          texto: 'Em tom menor o ii vira <b>meio-diminuto</b>, o m7(b5): em Lá menor, <b>Bm7(b5), E7, Am</b>. É o som de boleros, sambas-canção e muitos clássicos da MPB.' },
        { t: 'acorde', acorde: 'Bm7(b5)' },
        { t: 'tocar', titulo: 'Bm7(b5), E7, Am', seq: 'Bm7(b5):4 E7:4 Am:8 Bm7(b5):4 E7:4 Am:8', padrao: 'bossa', ritmo: 'acorde', bpm: 60, modo: 'espera' }
      ] },
      { id: 'a3l4', titulo: 'Música: Samba de Uma Nota Só', min: 5, musicaFinal: true, passos: [
        { t: 'texto', titulo: 'Uma nota, muitos acordes', visual: null,
          texto: 'De Tom Jobim e Newton Mendonça (1960). A melodia fica parada numa nota enquanto os acordes descem meio tom por vez por baixo dela: é a condução de vozes levada ao extremo.' },
        { t: 'tocar', musica: 'samba-de-uma-nota-so', secao: 0, ritmo: 'acorde', modo: 'espera' }
      ] }
    ]
  },
  {
    id: 'a4', nivel: 'avancado', titulo: 'Técnicas', resumo: 'Hammer-on, pull-off, slide, bend, vibrato e abafado: como dar voz às notas.',
    licoes: [
      { id: 'a4l1', titulo: 'Ligados', min: 4, passos: [
        { t: 'texto', titulo: 'Hammer-on e pull-off', visual: 'ligados',
          texto: '<b>Hammer-on (h)</b>: toque a nota e “martele” outro dedo uma ou duas casas à frente, sem tocar de novo. <b>Pull-off (p)</b>: com os dois dedos apertados, puxe o da frente num pequeno peteleco, e a nota de trás soa. Na tablatura: 5h7 e 7p5.' },
        { t: 'quiz', pergunta: 'Na tablatura, o que quer dizer 2h4?', opcoes: ['Toque a casa 2 e martele a 4', 'Toque a 2 e a 4 juntas', 'Casa 24'], certa: 0, explica: 'h = hammer-on: a segunda nota nasce do dedo batendo na corda.' }
      ] },
      { id: 'a4l2', titulo: 'Slide, bend e vibrato', min: 4, passos: [
        { t: 'texto', titulo: 'Escorregar e empurrar', visual: 'slideBend',
          texto: '<b>Slide (/)</b>: o dedo escorrega de uma casa a outra sem soltar a corda, 5/7. <b>Bend (b)</b>: empurre a corda para o lado e a nota sobe, 7b9 sobe um tom. No nylon o bend é curto: meio tom já soa bonito. <b>Vibrato (~)</b>: um bend pequeno e repetido, que deixa a nota cantando.' },
        { t: 'quiz', pergunta: '7b9 quer dizer…', opcoes: ['Empurrar a corda na casa 7 até soar como a casa 9', 'Tocar a casa 7 e depois a 9', 'Casa 7 com bemol'], certa: 0, explica: 'b = bend: a nota sobe 2 casas (um tom) sem trocar de casa.' }
      ] },
      { id: 'a4l3', titulo: 'Abafado e tapa', min: 4, passos: [
        { t: 'texto', titulo: 'Som de percussão', visual: 'abafado',
          texto: 'Com a lateral da mão direita encostada nas cordas, bem perto do cavalete, a batida fica curta e grave: o <b>abafado</b>. No pagode e no samba-rock, um <b>tapa</b> rápido nas cordas faz o papel da caixa da bateria.' },
        { t: 'tocar', titulo: 'Samba-rock com a banda', seq: 'Am7:4 D7:4 Am7:4 D7:4 Am7:4 D7:4 Am7:4 D7:4', padrao: 'sambarock', ritmo: 'batida', bpm: 84, modo: 'pratica', banda: true }
      ] }
    ]
  },
  {
    id: 'a5', nivel: 'avancado', titulo: 'Tirando música de ouvido', resumo: 'O tom, o baixo, a família de acordes e o ouvido treinado para reconhecer cada som.',
    licoes: [
      { id: 'a5l1', titulo: 'Ache a casa', min: 5, passos: [
        { t: 'texto', titulo: 'Onde a música descansa', visual: null,
          texto: 'Ouça o fim de um trecho, onde a música “descansa”. Cante essa nota e procure no violão, na 6ª ou na 5ª corda: ela costuma ser o <b>I</b> do tom (ou o vi, se a música for triste). Com o tom em mãos, só 6 acordes são candidatos fortes.' },
        { t: 'ouvido', tipo: 'grau', n: 6 }
      ] },
      { id: 'a5l2', titulo: 'Siga o baixo', min: 5, passos: [
        { t: 'texto', titulo: 'O baixo entrega o acorde', visual: 'campoC',
          texto: 'A nota mais grave quase sempre é a <b>letra do acorde</b>. Siga o baixo e anote: Dó… Lá… Fá… Sol… Depois teste o acorde <b>maior</b> e o <b>menor</b> de cada nota e fique com o que combina com a melodia.' },
        { t: 'ouvido', tipo: 'maiorMenor', n: 6 },
        { t: 'quiz', pergunta: 'A música está em Sol e o baixo está em Mi. Qual acorde é mais provável?', opcoes: ['Em', 'E', 'E7'], certa: 0, explica: 'Em é o vi de Sol maior: faz parte da família.' }
      ] },
      { id: 'a5l3', titulo: 'Ouvido afiado', min: 5, passos: [
        { t: 'texto', titulo: 'Treino de todo dia', visual: null,
          texto: 'Reconhecer intervalos é a base para tirar melodias e solos. Cante cada nota depois de ouvir: cantar ensina o ouvido mais rápido do que só escutar.' },
        { t: 'ouvido', tipo: 'intervalo', n: 8 }
      ] }
    ]
  },
  {
    id: 'a6', nivel: 'avancado', titulo: 'Repertório da bossa e do samba', resumo: 'Cinco clássicos com a harmonia completa, como na cifra original.', musica: 'chega-de-saudade',
    licoes: [
      { id: 'a6l1', titulo: 'Música: Garota de Ipanema', min: 5, musicaFinal: true, passos: [
        { t: 'texto', titulo: 'A mais gravada', visual: null,
          texto: 'De Tom Jobim e Vinicius de Moraes (1962). Comece pela primeira parte, em <b>F7M</b> e <b>G7(13)</b>. A segunda parte viaja para longe, por <b>F#7M</b> e <b>B7(9)</b>, e volta.' },
        { t: 'tocar', musica: 'garota-de-ipanema', secao: 3, ritmo: 'acorde', modo: 'espera' }
      ] },
      { id: 'a6l2', titulo: 'Música: O Sol Nascerá', min: 5, musicaFinal: true, passos: [
        { t: 'texto', titulo: 'Samba com cor de bossa', visual: null,
          texto: 'De Cartola e Elton Medeiros (1964). Um samba com acordes de bossa: <b>Dm7(9)</b>, <b>G7(13)</b> e <b>C7M(9)</b>, o ii–V–I com tensões.' },
        { t: 'tocar', musica: 'o-sol-nascera', secao: 0, ritmo: 'acorde', modo: 'espera' }
      ] },
      { id: 'a6l3', titulo: 'Música: Wave', min: 5, musicaFinal: true, passos: [
        { t: 'texto', titulo: 'O diminuto que abre a porta', visual: null,
          texto: 'Tom Jobim, 1967. O tema começa no <b>D7M(9)</b> e logo passa pelo <b>Bb°</b>, um diminuto que leva ao Am7. Depois vêm dominantes com 9 e 13.' },
        { t: 'tocar', musica: 'wave', secao: 1, ritmo: 'acorde', modo: 'espera' }
      ] },
      { id: 'a6l4', titulo: 'Música: Flor de Lis', min: 5, musicaFinal: true, passos: [
        { t: 'texto', titulo: 'O violão de Djavan', visual: null,
          texto: 'Djavan gravou em 1976. Tem ii–V em tom maior e em tom menor, com dominantes alteradas como <b>E7(b13)</b> e <b>B7(b9)</b>.' },
        { t: 'tocar', musica: 'flor-de-lis', secao: 1, ritmo: 'acorde', modo: 'espera' }
      ] },
      { id: 'a6l5', titulo: 'Música: Chega de Saudade', min: 5, musicaFinal: true, passos: [
        { t: 'texto', titulo: 'Onde a bossa nova começou', visual: null,
          texto: 'De Tom Jobim e Vinicius de Moraes. Na voz e no violão de João Gilberto, em 1958, virou o marco inicial da bossa nova. A primeira parte é em Ré menor e a segunda vira Ré maior.' },
        { t: 'tocar', musica: 'chega-de-saudade', secao: 1, ritmo: 'acorde', modo: 'espera' }
      ] }
    ]
  }
];
const LESSONS = CURSO.flatMap(u => u.licoes.map(l => ({ ...l, mod: u.id })));

/* ---------- MELODIAS (notas soltas) ----------
   Só músicas de DOMÍNIO PÚBLICO (folclore e compositores antigos).
   Nota = nome + oitava (G3 = Sol da 3ª corda solta) : duração em tempos.
   O app escolhe a corda e a casa na 1ª posição (casas 0 a 4). */
const MELODIAS = [
  { id: 'soltas', titulo: 'Cordas soltas', origem: 'Exercício', bpm: 60, beats: 4,
    notas: 'E2:2 A2:2 D3:2 G3:2 B3:2 E4:2 E4:2 B3:2 G3:2 D3:2 A2:2 E2:4' },
  { id: 'primeiras', titulo: 'Primeiras casas', origem: 'Exercício', bpm: 60, beats: 4,
    notas: 'B3:2 C4:2 D4:2 C4:2 B3:2 C4:2 D4:4 E4:2 F4:2 G4:2 F4:2 E4:2 F4:2 G4:4' },
  { id: 'escala-do', titulo: 'Escala de Dó', origem: 'Exercício', bpm: 60, beats: 4,
    notas: 'C3:1 D3:1 E3:1 F3:1 G3:1 A3:1 B3:1 C4:1 C4:1 B3:1 A3:1 G3:1 F3:1 E3:1 D3:1 C3:1' },
  { id: 'arpejos', titulo: 'Arpejos: C, Am, F e G', origem: 'Exercício', bpm: 60, beats: 4,
    notas: 'C3:0.5 E3:0.5 G3:0.5 C4:0.5 E4:0.5 C4:0.5 G3:0.5 E3:0.5 A2:0.5 E3:0.5 A3:0.5 C4:0.5 E4:0.5 C4:0.5 A3:0.5 E3:0.5 F2:0.5 C3:0.5 F3:0.5 A3:0.5 C4:0.5 A3:0.5 F3:0.5 C3:0.5 G2:0.5 D3:0.5 G3:0.5 B3:0.5 D4:0.5 B3:0.5 G3:0.5 D3:0.5 C3:4' },
  { id: 'penta-am', titulo: 'Pentatônica de Lá menor', origem: 'Exercício', bpm: 70, beats: 4,
    notas: 'A2:1 C3:1 D3:1 E3:1 G3:1 A3:1 C4:1 D4:1 E4:1 G4:1 A4:2 G4:1 E4:1 D4:1 C4:1 A3:1 G3:1 E3:1 D3:1 C3:1 A2:3' },
  { id: 'baixo-anda', titulo: 'Baixo que anda', origem: 'Exercício', bpm: 66, beats: 4,
    notas: 'C3:2 B2:2 A2:2 G2:2 F2:2 G2:2 C3:4' },
  { id: 'estrelinha', titulo: 'Brilha, Brilha Estrelinha', origem: 'Canção tradicional (domínio público)', bpm: 72, beats: 4,
    notas: 'G3:1 G3:1 D4:1 D4:1 E4:1 E4:1 D4:2 C4:1 C4:1 B3:1 B3:1 A3:1 A3:1 G3:2 D4:1 D4:1 C4:1 C4:1 B3:1 B3:1 A3:2 D4:1 D4:1 C4:1 C4:1 B3:1 B3:1 A3:2 G3:1 G3:1 D4:1 D4:1 E4:1 E4:1 D4:2 C4:1 C4:1 B3:1 B3:1 A3:1 A3:1 G3:2' },
  { id: 'ode', titulo: 'Ode à Alegria', origem: 'Beethoven, 1824 (domínio público)', bpm: 76, beats: 4,
    notas: 'B3:1 B3:1 C4:1 D4:1 D4:1 C4:1 B3:1 A3:1 G3:1 G3:1 A3:1 B3:1 B3:1.5 A3:0.5 A3:2 B3:1 B3:1 C4:1 D4:1 D4:1 C4:1 B3:1 A3:1 G3:1 G3:1 A3:1 B3:1 A3:1.5 G3:0.5 G3:2' },
  { id: 'parabens', titulo: 'Parabéns pra Você', origem: 'Melodia de 1893 (domínio público)', bpm: 84, beats: 3,
    notas: 'D3:0.75 D3:0.25 E3:1 D3:1 G3:1 F#3:2 D3:0.75 D3:0.25 E3:1 D3:1 A3:1 G3:2 D3:0.75 D3:0.25 D4:1 B3:1 G3:1 F#3:1 E3:2 C4:0.75 C4:0.25 B3:1 G3:1 A3:1 G3:3' },
  { id: 'jingle', titulo: 'Jingle Bells', origem: 'James Pierpont, 1857 (domínio público)', bpm: 96, beats: 4,
    notas: 'B3:1 B3:1 B3:2 B3:1 B3:1 B3:2 B3:1 D4:1 G3:1.5 A3:0.5 B3:4 C4:1 C4:1 C4:1.5 C4:0.5 C4:1 B3:1 B3:1 B3:0.5 B3:0.5 B3:1 A3:1 A3:1 B3:1 A3:2 D4:2 B3:1 B3:1 B3:2 B3:1 B3:1 B3:2 B3:1 D4:1 G3:1.5 A3:0.5 B3:4 C4:1 C4:1 C4:1.5 C4:0.5 C4:1 B3:1 B3:1 B3:0.5 B3:0.5 D4:1 D4:1 C4:1 A3:1 G3:4' }
];

// Transforma "G3:1 D4:2" em notas com corda, casa e dedo (1ª posição: casas 0 a 4)
const _NOTA_PC = { C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11 };
const _SOLTAS = [40, 45, 50, 55, 59, 64];
function lerMelodia(texto) {
  let inicio = 0;
  return String(texto).trim().split(/\s+/).map(tok => {
    const [n, t] = tok.split(':');
    const m = n.match(/^([A-G](?:#|b)?)(-?\d)$/);
    const midi = 12 * (+m[2] + 1) + _NOTA_PC[m[1]];
    let corda = 0, casa = 99;
    _SOLTAS.forEach((s, i) => { const f = midi - s; if (f >= 0 && f <= 4 && f < casa) { casa = f; corda = i; } });
    if (casa === 99) { corda = 5; casa = Math.max(0, midi - 64); }
    const nota = { midi, corda, casa, dedo: casa > 0 ? Math.min(4, casa) : 0, tempos: +t || 1, inicio };
    inicio += nota.tempos;
    return nota;
  });
}

/* ---------- CATÁLOGO DE MÚSICAS ----------
   Só a sequência de ACORDES (sem letra, por direitos autorais), tirada do
   Cifra Club: versão simplificada para o Iniciante e para parte do
   Intermediário, versão completa para o Avançado. A duração de cada acorde
   foi estimada pela posição dele na cifra.
   grupo: iniciante, jorge (Jorge Ben Jor), intermediario ou avancado.
   capo: casa do capotraste para soar igual à gravação. Os desenhos são os da mão.
   youtube: vídeo oficial (o app toca pelo player do YouTube, sem copiar o áudio). */
const CATALOGO = [
 {
  "id": "pra-nao-dizer",
  "grupo": "iniciante",
  "titulo": "Pra Não Dizer Que Não Falei das Flores",
  "artista": "Geraldo Vandré",
  "genero": "MPB",
  "padrao": "pop",
  "bpm": 110,
  "capo": 1,
  "youtube": "KdvsXn8oVPY",
  "nota": "Só dois acordes, Em e D, a música inteira. Com capotraste na 1ª casa soa igual à gravação.",
  "secoes": [
   {
    "nome": "Intro",
    "seq": "Em:4 D:4 Em:4 D:4 Em:4",
    "repetir": 1
   },
   {
    "nome": "Solo Intro",
    "seq": "Em:2 D:4 Em:4 D:4 Em:4 D:4 Em:4 D:4 Em:4 D:4 Em:4 D:4 Em:4 Em:4 D:4 Em:4 D:4 Em:4 D:4 Em:4 D:4 Em:4 D:4 Em:4 D:4 Em:4 D:4 Em:4 D:4 Em:4",
    "repetir": 1
   },
   {
    "nome": "Ponte",
    "seq": "D:4 Em:4 D:4 Em:4 D:4 Em:4 D:4 Em:4 D:4 Em:4 D:4 Em:4 D:4 Em:4 D:4 Em:4 D:4 Em:4 D:4 Em:4",
    "repetir": 2
   },
   {
    "nome": "Ponte",
    "seq": "D:4 Em:4 D:4 Em:4 D:4 Em:4 D:4 Em:4 D:4 Em:4 D:4 Em:4 D:4 Em:4 D:4 Em:4 D:4 Em:4 D:4 Em:4 D:4 Em:4 D:4 Em:4 D:4 Em:4 D:4 Em:4 D:4 Em:4 D:4 Em:4 D:4 Em:4 D:4 Em:4 D:4 Em:4 D:4 Em:4",
    "repetir": 1
   }
  ],
  "fonte": "https://www.cifraclub.com.br/geraldo-vandre/pra-nao-dizer-que-nao-falei-das-flores/simplificada.html"
 },
 {
  "id": "que-pais-e-este",
  "grupo": "iniciante",
  "titulo": "Que País É Este",
  "artista": "Legião Urbana",
  "genero": "Rock",
  "padrao": "quatro",
  "bpm": 140,
  "capo": 0,
  "youtube": "kFpkyT_KPpc",
  "nota": "Três acordes e batida só para baixo, bem rock. Ótima para treinar a troca C ↔ D.",
  "secoes": [
   {
    "nome": "Intro",
    "seq": "Em:4 C:4 D:4",
    "repetir": 1
   },
   {
    "nome": "Ritmo",
    "seq": "Em:4 C:4 D:4",
    "repetir": 1
   },
   {
    "nome": "Primeira Parte",
    "seq": "Em:4 C:2 D:4 Em:4 C:2 D:4 Em:4 C:2 D:4 Em:4 C:4 D:2 Em:2 C:2 D:4",
    "repetir": 1
   },
   {
    "nome": "Refrão",
    "seq": "Em:4 C:2 D:4 Em:4 C:2 D:4 Em:4 C:2 D:4 Em:4 C:4 D:4 Em:4 C:4 D:4 Em:4 C:4 D:4 Em:4 C:4 D:4",
    "repetir": 1
   },
   {
    "nome": "Segunda Parte",
    "seq": "Em:4 C:4 D:4 Em:4 C:2 D:4 Em:4 C:2 D:4 Em:4 C:2 D:4 Em:4 C:2 D:4 Em:4 C:2 D:4 Em:4 C:2 D:4 Em:4 C:2 D:4 Em:4 C:2 D:4",
    "repetir": 1
   },
   {
    "nome": "Refrão",
    "seq": "Em:4 C:2 D:4 Em:4 C:2 D:4 Em:4 C:2 D:4 Em:4 C:2 D:4 Em:4 C:4 D:4 Em:4 C:4 D:4 Em:4 C:4 D:4 Em:4 C:4 D:4",
    "repetir": 1
   },
   {
    "nome": "Ponte",
    "seq": "Em:4 C:2 D:4 Em:4 C:2 D:4 Em:4 C:2 D:4 Em:4 C:2 D:4 Em:4 C:2 D:4 Em:4 C:2 D:4",
    "repetir": 1
   },
   {
    "nome": "Refrão",
    "seq": "Em:4 C:2 D:4 Em:4 C:2 D:4 Em:4 C:2 D:4 Em:4 C:2 D:2 Em:4",
    "repetir": 1
   }
  ],
  "fonte": "https://www.cifraclub.com.br/legiao-urbana/que-pais-e-esse/simplificada.html"
 },
 {
  "id": "asa-branca",
  "grupo": "iniciante",
  "titulo": "Asa Branca",
  "artista": "Luiz Gonzaga",
  "genero": "Baião",
  "padrao": "baiao",
  "bpm": 116,
  "capo": 0,
  "youtube": "0kCm1XTZ_qA",
  "nota": "G, C e D: os três acordes mais usados da música brasileira.",
  "secoes": [
   {
    "nome": "Primeira Parte",
    "seq": "G:4 C:4 G:2 D:2 G:4 G:4 C:4 D:4 G:4",
    "repetir": 1
   },
   {
    "nome": "Segunda Parte",
    "seq": "G:4 C:4 G:2 D:2 G:4 G:4 C:4 D:4 G:4 G:4 C:4 D:4 G:4",
    "repetir": 1
   },
   {
    "nome": "Terceira Parte",
    "seq": "G:4 C:4 G:2 D:2 G:4 G:4 C:4 D:4 G:4 G:4 C:4 D:4 G:4",
    "repetir": 1
   },
   {
    "nome": "Quarta Parte",
    "seq": "G:4 C:4 G:2 D:2 G:4 G:4 C:4 D:4 G:4 G:4 C:4 D:4 G:4",
    "repetir": 1
   },
   {
    "nome": "Quinta Parte",
    "seq": "G:4 C:4 G:2 D:2 G:4 G:4 C:4 D:4 G:4 G:4 C:4 D:4 G:4",
    "repetir": 1
   }
  ],
  "fonte": "https://www.cifraclub.com.br/luiz-gonzaga/asa-branca/simplificada.html"
 },
 {
  "id": "velha-infancia",
  "grupo": "iniciante",
  "titulo": "Velha Infância",
  "artista": "Tribalistas",
  "genero": "MPB",
  "padrao": "pop",
  "bpm": 92,
  "capo": 2,
  "youtube": "Fub2qOHlyOE",
  "nota": "Em, Am e D se repetindo. Com capotraste na 2ª casa fica igual à gravação.",
  "secoes": [
   {
    "nome": "Intro",
    "seq": "Em:4 Am:4 D:4 Em:4 Em:4 Am:4 D:4 Em:4",
    "repetir": 1
   },
   {
    "nome": "Primeira Parte",
    "seq": "Em:4 Am:4 D:4 Em:4 Am:4 D:4 Em:4",
    "repetir": 1
   },
   {
    "nome": "Refrão",
    "seq": "Am:4 D:4 Em:4 Am:4 D:4 Em:4 Am:4 D:4 Em:4 Am:4 D:4 Em:4",
    "repetir": 1
   },
   {
    "nome": "Segunda Parte",
    "seq": "Am:4 D:4 Em:4 Am:4 D:4 Em:4 Am:4 D:4 Em:4 Am:4 D:4 Em:4",
    "repetir": 1
   },
   {
    "nome": "Refrão",
    "seq": "Am:4 D:4 Em:4 Am:4 D:4 Em:4 Am:4 D:4 Em:4 Am:4 D:4 Em:4",
    "repetir": 1
   },
   {
    "nome": "Segunda Parte",
    "seq": "Am:4 D:4 Em:4 Am:4 D:4 Em:4",
    "repetir": 1
   },
   {
    "nome": "Ponte",
    "seq": "Am:4 D:4 Em:4 Am:4 D:4 Em:4 Am:4 D:4 Em:4",
    "repetir": 1
   },
   {
    "nome": "Final",
    "seq": "Am:4 D:4 Em:4 Am:4 D:4 Em:4 Am:4 D:4 Em:4 Am:4 D:4 Em:4 Am:4 D:4 Em:4 Am:4 D:4 Em:4",
    "repetir": 1
   }
  ],
  "fonte": "https://www.cifraclub.com.br/tribalistas/velha-infancia/simplificada.html"
 },
 {
  "id": "o-sol",
  "grupo": "iniciante",
  "titulo": "O Sol",
  "artista": "Vitor Kley",
  "genero": "Pop",
  "padrao": "pop",
  "bpm": 98,
  "capo": 2,
  "youtube": "yOwwSByMd0k",
  "nota": "Quatro acordes abertos. Com capotraste na 2ª casa fica igual à gravação.",
  "secoes": [
   {
    "nome": "Intro",
    "seq": "Em:4 Am:4 Em:4 Am:4",
    "repetir": 1
   },
   {
    "nome": "Primeira parte",
    "seq": "Em:4 Am:4 Em:4 Am:4 Em:4 Am:4 Em:4 Am:4",
    "repetir": 1
   },
   {
    "nome": "Pré-refrão",
    "seq": "C:4 Am:4 Em:4 D:4 C:4 Am:4 Em:4 D:4",
    "repetir": 1
   },
   {
    "nome": "Refrão",
    "seq": "C:4 Am:4 Em:4 D:4 C:4 Am:4 Em:4 D:4 C:4 Am:4 Em:4 D:4",
    "repetir": 1
   },
   {
    "nome": "Primeira parte",
    "seq": "Em:4 Am:4 Em:4 Am:4 Em:4 Am:4 Em:4 Am:4",
    "repetir": 1
   },
   {
    "nome": "Pré-refrão",
    "seq": "C:4 Am:4 Em:4 D:4 C:4 Am:4 Em:4 D:4",
    "repetir": 1
   },
   {
    "nome": "Refrão",
    "seq": "C:4 Am:4 Em:4 D:4 C:4 Am:4 Em:4 D:4 C:4 Am:4 Em:4 D:4",
    "repetir": 1
   },
   {
    "nome": "Segunda parte",
    "seq": "C:4 Am:4 Em:8 D:4 C:8 Am:4 Em:8 D:4 C:2 D:4",
    "repetir": 1
   },
   {
    "nome": "Refrão",
    "seq": "C:4 Am:4 Em:4 D:4 C:4 Am:4 Em:4 D:4 C:4 Am:4 Em:4 D:4 C:4",
    "repetir": 1
   }
  ],
  "fonte": "https://www.cifraclub.com.br/vitor-kley/o-sol/simplificada.html"
 },
 {
  "id": "trem-bala",
  "grupo": "iniciante",
  "titulo": "Trem-Bala",
  "artista": "Ana Vilela",
  "genero": "MPB",
  "padrao": "pop",
  "bpm": 93,
  "capo": 2,
  "youtube": "sWhy1VcvvgY",
  "nota": "A, D e E (o A9 e o D9 são o A e o D com um dedo a menos). Capotraste na 2ª casa para soar como a gravação.",
  "secoes": [
   {
    "nome": "Intro",
    "seq": "A9:4 D9:4 A9:4 E:4",
    "repetir": 1
   },
   {
    "nome": "Primeira Parte",
    "seq": "A9:4 D9:4 A9:4 E:4 A9:4 D9:4 A9:4 E:4",
    "repetir": 1
   },
   {
    "nome": "Refrão",
    "seq": "D9:4 E:4 A9:4 D9:4 E:4 A9:4",
    "repetir": 1
   },
   {
    "nome": "Segunda Parte",
    "seq": "D9:4 A9:4 E:4 A9:4 D9:4 A9:4 E:4",
    "repetir": 1
   },
   {
    "nome": "Refrão 2",
    "seq": "D9:4 E:4 A9:4 D9:4 E:4 A9:4",
    "repetir": 1
   },
   {
    "nome": "Terceira Parte",
    "seq": "D9:4 A9:4 E:4 A9:4 D9:4 A9:4 E:4",
    "repetir": 1
   },
   {
    "nome": "Refrão 3",
    "seq": "D9:4 E:4 A9:4 D9:4 E:4 A9:4",
    "repetir": 1
   },
   {
    "nome": "Ponte",
    "seq": "D9:4 E:4 A9:4 D9:4 E:4 A9:4",
    "repetir": 1
   },
   {
    "nome": "Refrão Final",
    "seq": "D9:4 E:4 A9:4 D9:4 E:4 A9:4",
    "repetir": 1
   }
  ],
  "fonte": "https://www.cifraclub.com.br/ana-vilela/trem-bala/simplificada.html"
 },
 {
  "id": "so-os-loucos-sabem",
  "grupo": "iniciante",
  "titulo": "Só os Loucos Sabem",
  "artista": "Charlie Brown Jr.",
  "genero": "Pop rock",
  "padrao": "pop",
  "bpm": 82,
  "capo": 0,
  "youtube": "JRJj4z-prvM",
  "nota": "G, Em, C, D e Am: a sequência mais famosa do pop.",
  "secoes": [
   {
    "nome": "Intro",
    "seq": "G:4 Em:4 C:4 G:4 Em:4 C:4",
    "repetir": 1
   },
   {
    "nome": "Primeira Parte",
    "seq": "Em:4 C:4 G:4 Em:4 G:4 D:4 Em:2 C:4 G:4 Am:4 C:4 Em:4 C:4 G:4 Em:4 G:4 D:4 Em:4 C:4 G:4 Am:8 C:8",
    "repetir": 1
   },
   {
    "nome": "Refrão",
    "seq": "Em:2 C:2 G:4 Em:2 G:2 D:4 Em:2 C:2 G:4 Am:4 C:4 G:4 Em:4 C:4 G:4 Em:4 C:4",
    "repetir": 1
   },
   {
    "nome": "Segunda Parte",
    "seq": "Em:2 C:4 G:4 Em:2 G:4 D:4 Em:4 C:4 G:4 Am:4 C:4 Em:2 C:2 G:4 Em:2 G:2 D:4 Em:4 C:4 G:4 Am:4 C:4 G:4 Em:4 C:4 G:4 Em:4 C:4",
    "repetir": 1
   },
   {
    "nome": "Primeira Parte",
    "seq": "Em:4 C:4 G:4 Em:4 G:4 D:4 Em:2 C:4 G:4 Am:4 C:4",
    "repetir": 1
   },
   {
    "nome": "Final",
    "seq": "G:4 Em:4 C:4 G:4 Em:4 C:4 G:4",
    "repetir": 1
   }
  ],
  "fonte": "https://www.cifraclub.com.br/charlie-brown-jr/so-os-loucos-sabem/simplificada.html"
 },
 {
  "id": "tempo-perdido",
  "grupo": "iniciante",
  "titulo": "Tempo Perdido",
  "artista": "Legião Urbana",
  "genero": "Rock",
  "padrao": "pop",
  "bpm": 93,
  "capo": 0,
  "youtube": "SLaNv85zvCk",
  "nota": "C, Am7, Bm e Em. O Bm vira Bm7 (sem pestana) no modo fácil.",
  "secoes": [
   {
    "nome": "Intro",
    "seq": "C:4 Am7:4 Bm:4 Em:4",
    "repetir": 1
   },
   {
    "nome": "Primeira Parte",
    "seq": "C:4 Am7:4 Bm:4 Em:4 C:4 Am7:4 Bm:4 Em:4 C:4 Am7:4 Bm:8 Em:4 C:4 Am7:4 Bm:4 Em:4 C:4 Am7:4 Bm:4 Em:4 C:2 Am7:4 Bm:2 Em:4 Bm:2 Em:4 Bm:2 Em:4",
    "repetir": 1
   },
   {
    "nome": "Segunda Parte",
    "seq": "C:4 Am7:4 Bm:4 Em:4 C:4 Am7:4 Bm:2 Em:4 C:4 Am7:4 Bm:4 Em:2 C:4 Am7:4 Bm:4 Em:4 Bm:4 Em:4 Bm:4 Em:4",
    "repetir": 1
   },
   {
    "nome": "Terceira Parte",
    "seq": "C:2 Am7:4 Bm:4 Em:2 C:2 Am7:4 Bm:2 Em:4 C:4 Am7:4 Bm:4 Em:4 C:4 Am7:4 Bm:2 Em:4 Bm:2 Em:4 Bm:2 Em:4",
    "repetir": 1
   }
  ],
  "fonte": "https://www.cifraclub.com.br/legiao-urbana/tempo-perdido/simplificada.html"
 },
 {
  "id": "andar-com-fe",
  "grupo": "iniciante",
  "titulo": "Andar com Fé",
  "artista": "Gilberto Gil",
  "genero": "MPB",
  "padrao": "pop",
  "bpm": 95,
  "capo": 3,
  "youtube": "h0cKwTOPsmU",
  "nota": "No tom original tem F (pestana). Com capotraste na 3ª casa você toca A, E7 e D e soa igual.",
  "secoes": [
   {
    "nome": "Início",
    "seq": "A:4 E7:4 A:4 E7:4 D:4 E7:4 A:4 E7:4 D:4 E7:4 A:4 E7:4 A:4 E7:4 D:4 E7:4 A:4 E7:4 D:4 E7:4 A:4 E7:4 A:4 E7:4 D:4 E7:4 A:4 E7:4 D:4 E7:4 A:4 E7:4",
    "repetir": 1
   }
  ],
  "fonte": "https://www.cifraclub.com.br/gilberto-gil/andar-com-fe/simplificada.html"
 },
 {
  "id": "anunciacao",
  "grupo": "iniciante",
  "titulo": "Anunciação",
  "artista": "Alceu Valença",
  "genero": "Forró",
  "padrao": "baiao",
  "bpm": 102,
  "capo": 0,
  "youtube": "OR74idpsweg",
  "nota": "G, Am, C, Em e F. No modo fácil o F vira F7M, sem pestana.",
  "secoes": [
   {
    "nome": "Primeira Parte",
    "seq": "G:8 Am:4 C:4 G:4 Am:4 C:4 G:4 Am:4 C:4 G:4 Am:4 C:4 G:4",
    "repetir": 1
   },
   {
    "nome": "Refrão",
    "seq": "G:2 Em:4 F:4 C:4 G:4 Em:4 F:4 C:4 G:4",
    "repetir": 1
   },
   {
    "nome": "Segunda Parte",
    "seq": "Am:4 C:4 G:4 Am:4 C:4 G:4",
    "repetir": 1
   },
   {
    "nome": "Refrão",
    "seq": "G:2 Em:4 F:4 C:4 G:4 G:2 Em:4 F:4 C:4 G:4 Am:4 C:4 G:4 Am:4 C:4 G:4",
    "repetir": 1
   },
   {
    "nome": "Primeira Parte",
    "seq": "Am:4 C:4 G:4 Am:4 C:4 G:4",
    "repetir": 1
   },
   {
    "nome": "Refrão",
    "seq": "G:2 Em:4 F:4 C:4 G:4 Em:4 F:4 C:4 G:4",
    "repetir": 1
   },
   {
    "nome": "Segunda Parte",
    "seq": "Am:4 C:4 G:4 Am:4 C:4 G:4",
    "repetir": 1
   },
   {
    "nome": "Refrão",
    "seq": "G:2 Em:4 F:4 C:4 G:4 G:2 Em:4 F:4 C:4 G:4",
    "repetir": 1
   },
   {
    "nome": "Final",
    "seq": "Am:4 C:4 G:4 Am:4 C:4 G:4",
    "repetir": 1
   }
  ],
  "fonte": "https://www.cifraclub.com.br/alceu-valenca/anunciacao/simplificada.html"
 },
 {
  "id": "taj-mahal",
  "grupo": "jorge",
  "titulo": "Taj Mahal",
  "artista": "Jorge Ben Jor",
  "genero": "Samba-rock",
  "padrao": "sambarock",
  "bpm": 120,
  "capo": 2,
  "youtube": "c8AuG1W59ig",
  "nota": "No tom original é tudo com pestana. Com capotraste na 2ª casa vira Am7, Bm7, Em e D7.",
  "secoes": [
   {
    "nome": "Primeira Parte",
    "seq": "Am7:4 Bm7:4 Em:4 Am7:2 Bm7:4 Em:4 Am7:4 Bm7:4 Em:4 Am7:4 Bm7:4 Em:4",
    "repetir": 1
   },
   {
    "nome": "Refrão",
    "seq": "Am7:4 Bm7:4 Em:4 Am7:4 Bm7:4 Em:4 Am7:2 Bm7:4 Em:4 Am7:2 Bm7:4 Em:4",
    "repetir": 1
   },
   {
    "nome": "Segunda Parte",
    "seq": "Am7:4 D7(9):4 Em:4 Am7:4 D7(9):4 Em:4 Am7:4 Am7:4 Em:4 Am7:4 Am7:4 Em:4",
    "repetir": 1
   },
   {
    "nome": "Refrão",
    "seq": "Am7:4 Bm7:4 Em:4 Am7:4 Bm7:4 Em:4 Am7:2 Bm7:4 Em:4 Am7:2 Bm7:4 Em:4",
    "repetir": 1
   }
  ],
  "fonte": "https://www.cifraclub.com.br/jorge-ben-jor/taj-mahal/simplificada.html"
 },
 {
  "id": "pais-tropical",
  "grupo": "jorge",
  "titulo": "País Tropical",
  "artista": "Jorge Ben Jor",
  "genero": "Samba-rock",
  "padrao": "sambarock",
  "bpm": 118,
  "capo": 0,
  "youtube": "JzByVhWju88",
  "nota": "Só acordes abertos: G7, C7, D7, Em, D e C.",
  "secoes": [
   {
    "nome": "Início",
    "seq": "G7:2 C7:2 D7:4 Em:2 D:2 C:2 D:2 Em:4 D:2 C:2 D:2 Em:4 D:2 C:2 D:2 Em:4 D:2 C:4 D:2 Em:2 D:2 C:4 D:2 Em:2 D:2 C:4 D:4 Em:2 D:4 C:4 D:4 G7:4 C7:4 G7:4 C7:4 G7:4 C7:4 D7:4 Em:2 D:2 C:2 D:2 Em:4 D:2 C:2 D:2 Em:4 D:2 C:2 D:2 Em:4 D:2 C:4 D:2 Em:2 D:2 C:4 D:2 Em:2 D:2 C:4 D:4 Em:2 D:4 C:4 D:4 G7:4 C7:4 G7:4 C7:4 G7:4 C7:4 D7:4 Em:2 D:2 C:4 D:2 Em:2 D:2 C:4 D:2 Em:2 D:4 D:2 C:4 D:2 Em:2 D:2 C:4 D:2 Em:2 D:2 C:4 D:2 Em:2 D:4 C:4 D:2 G7:4 C7:4 D7:2 G7:4 C7:4 D7:2 G7:4",
    "repetir": 1
   }
  ],
  "fonte": "https://www.cifraclub.com.br/jorge-ben-jor/pais-tropical/simplificada.html"
 },
 {
  "id": "mas-que-nada",
  "grupo": "jorge",
  "titulo": "Mas Que Nada",
  "artista": "Jorge Ben Jor",
  "genero": "Samba",
  "padrao": "sambarock",
  "bpm": 100,
  "capo": 3,
  "youtube": "",
  "nota": "No tom original (Gm) tudo tem pestana. Com capotraste na 3ª casa vira Em7, B7, D7 e Am7.",
  "secoes": [
   {
    "nome": "Intro",
    "seq": "Em7:4 B7:4 Em7:4 B7:4 Em7:4 B7:4 Em7:4 D7:4 Em7:4 B7:4",
    "repetir": 1
   },
   {
    "nome": "Refrão",
    "seq": "Em7:2 Am7:2 D7:2 Em7:4 B7:2 Em7:2 B7:4 Em7:2 Am7:2 D7:2 Em7:4 B7:2 Em7:2 B7:4",
    "repetir": 1
   },
   {
    "nome": "Primeira Parte",
    "seq": "Em7:4 B7:4 Em7:4 B7:4 Em7:4 B7:4 Em7:4",
    "repetir": 1
   },
   {
    "nome": "Pré-Refrão",
    "seq": "Am7:4 D7:4 Em7:4 Am7:4 D7:4 Em7:4 B7:2 Em7:4 B7:4 Em7:4 B7:4 Em7:4 B7:4 Em7:4",
    "repetir": 1
   },
   {
    "nome": "Refrão",
    "seq": "Em7:2 Am7:2 D7:2 Em7:4 B7:2 Em7:2 B7:4 Em7:2 Am7:2 D7:2 Em7:4 B7:2 Em7:2 B7:4",
    "repetir": 1
   },
   {
    "nome": "Solo",
    "seq": "Em7:4 Am7:4 D7:4 Em7:4 B7:4 Em7:4 B7:4 Em7:4 Am7:4 D7:4 Em7:4 B7:4 Em7:4 B7:4",
    "repetir": 1
   },
   {
    "nome": "Pré-Refrão",
    "seq": "Am7:4 D7:4 Em7:4 Am7:4 D7:4 Em7:4 B7:2 Em7:4 B7:4 Em7:4 B7:4 Em7:4 B7:4 Em7:4",
    "repetir": 1
   },
   {
    "nome": "Refrão",
    "seq": "Em7:2 Am7:2 D7:2 Em7:4 B7:2 Em7:2 B7:4 Em7:2 Am7:2 D7:2 Em7:4 B7:2 Em7:2 B7:4",
    "repetir": 1
   },
   {
    "nome": "Final",
    "seq": "Em7:4 B7:4 Em7:4 B7:4 Em7:4 B7:4 Em7:4 B7:4 Em7:4 B7:4 Em7:4 B7:4 Em7:4",
    "repetir": 1
   }
  ],
  "fonte": "https://www.cifraclub.com.br/jorge-ben-jor/mas-que-nada/simplificada.html"
 },
 {
  "id": "w-brasil",
  "grupo": "jorge",
  "titulo": "W/Brasil (Chama o Síndico)",
  "artista": "Jorge Ben Jor",
  "genero": "Samba-rock",
  "padrao": "sambarock",
  "bpm": 105,
  "capo": 3,
  "youtube": "bkM1u4GxHzw",
  "nota": "Dois acordes a música toda. Com capotraste na 3ª casa: A e D.",
  "secoes": [
   {
    "nome": "Intro",
    "seq": "A:4 D:4 A:2 D:2 A:2 D:2 A:2 D:4 A:2 D:2 A:2 D:2 A:2 D:4 A:2 D:2 A:4 D:4 A:2 D:4 A:4 D:4 A:4 D:4 A:4 D:2 A:2 D:2 A:2 D:2 A:2 D:4 A:4 D:4 A:4 D:2 A:4 D:4 A:4 D:4 A:4 D:4 A:4 D:4 A:2 D:4 A:4 D:4 A:4 A:2 D:2 A:2 D:4 A:2 D:2 A:2 D:4 A:4 D:2 A:2 D:2 A:4 D:4 A:4 D:4 A:4 D:4 A:4 D:4 A:4 D:4 A:4 D:2 A:2 D:4 A:2 D:4 A:2 D:4 A:2 D:4 A:4 D:2 A:2 D:4 A:4 D:4 A:4 D:2 A:4 A:4 D:4 A:2 D:2 A:2 D:4 A:4 D:2 A:2 D:4 A:4 D:4 A:2 D:4 A:2 D:2 A:2 D:4 A:2 D:2 A:4 D:4 A:2 D:2 A:4 D:2 A:2 D:2 A:2 D:4 A:2 D:2 A:2 D:2 A:2 D:4 A:2 D:4 A:2 D:4 A:4 D:2 A:2 D:4 A:4 D:2 A:4 D:2 A:2 D:4 A:4 D:4 A:4 D:4 A:4 D:2 A:4 D:4 A:2 D:4 A:2 D:2 A:4 D:4 A:2 D:4 A:2 D:2 A:2 D:2 A:2 D:4 A:2 D:4 A:4 D:4 A:4 D:4 A:4 D:4 A:4 D:4 A:4 D:2 A:4 D:4 A:2 D:4 A:4 D:4 A:4 D:2 A:2 D:4 A:2 D:2 A:2 D:2 A:4 D:4 A:4",
    "repetir": 1
   }
  ],
  "fonte": "https://www.cifraclub.com.br/jorge-ben-jor/wbrasil-chama-sindico/simplificada.html"
 },
 {
  "id": "filho-maravilha",
  "grupo": "jorge",
  "titulo": "Filho Maravilha",
  "artista": "Jorge Ben Jor",
  "genero": "Samba-rock",
  "padrao": "sambarock",
  "bpm": 110,
  "capo": 0,
  "youtube": "RXqfj88I-p8",
  "nota": "Em, C, D e as sétimas Em7, Am7 e Bm7: tudo aberto.",
  "secoes": [
   {
    "nome": "Intro",
    "seq": "Em:4 C:4 D:4 Em7:4 C:2 D9:4 Em7:2 C:2 D9:2 Em7:4 C:4 D9:2 Em7:4 C:2 D9:4 Em7:4 C:2 D9:4 Em7:4 C:2 D9:2 Em7:4 C:2 Em7:2 C:2 D9:4 Em7:4 C:2 D9:4 Em7:4 C:2 D9:4 Em7:8 C:4 D9:2 Em7:4 C:2 D9:4 Em7:8 C:4 D9:4 Em7:4 C:2 D9:4 Em7:4 C:4 D9:2 Em7:4 C:4 D9:4 Em7:4 C:4 D9:4 Em7:4 C:4 D9:4 Em7:4 Am7:2 Bm7:4 Em7:2 Am7:2 Bm7:4 Em7:4 Am7:2 Bm7:4 Em7:2 Am7:2 Bm7:4 Em7:4 Am7:2 Bm7:4 Em7:2 Am7:2 Bm7:4 Em7:4 C:4 D9:4 Em7:2 C:2 D9:4 Em7:4 Am7:2 Bm7:4 Em7:2 Am7:2 Bm7:4 Em7:4 C:4 D9:4 Em7:2 C:2 D9:4",
    "repetir": 1
   }
  ],
  "fonte": "https://www.cifraclub.com.br/jorge-ben-jor/filho-maravilha/simplificada.html"
 },
 {
  "id": "chove-chuva",
  "grupo": "jorge",
  "titulo": "Chove Chuva",
  "artista": "Jorge Ben Jor",
  "genero": "Samba-bossa",
  "padrao": "bossa",
  "bpm": 100,
  "capo": 0,
  "youtube": "Ubol9NyLWZc",
  "nota": "Acordes com sétima, bem bossa nova.",
  "secoes": [
   {
    "nome": "Intro",
    "seq": "Am7:4 Dm7:4 Am7:4 Dm7:4 Am7:4 Dm7:4 Am7:4 A7:4",
    "repetir": 1
   },
   {
    "nome": "Refrão",
    "seq": "D7:4 Am7:4 D7:4 Am7:4",
    "repetir": 1
   },
   {
    "nome": "Primeira Parte",
    "seq": "D7:4 G7:4 Am7:2 A7:4 D7:4 G7:4 Am7:4 D7:4 Am7:4 D7:4 Am7:4 D7:2 Dm7:4 G7:4 Am7:4 A7:4 D7:4 G7:4 Am7:4 A7:4 D7:4 G7:4 Am7:2 A7:4",
    "repetir": 1
   },
   {
    "nome": "Refrão",
    "seq": "D7:4 Am7:4 D7:4 Am7:4",
    "repetir": 1
   },
   {
    "nome": "Primeira Parte",
    "seq": "D7:4 G7:4 Am7:2 A7:4 D7:4 G7:4 Am7:4 D7:4 Am7:4 D7:4 Am7:4 D7:2 Dm7:4 G7:4 Am7:4 A7:4 D7:4 G7:4 Am7:4 A7:4 D7:4 G7:4 Am7:2 A7:4",
    "repetir": 1
   },
   {
    "nome": "Refrão",
    "seq": "D7:4 Am7:4 D7:4 Am7:4 D7:4 Am7:4 D7:4 Am7:4",
    "repetir": 1
   },
   {
    "nome": "Final",
    "seq": "D7:4 Am7:4 D7:4 Am7:4",
    "repetir": 1
   }
  ],
  "fonte": "https://www.cifraclub.com.br/jorge-ben-jor/chove-chuva/simplificada.html"
 },
 {
  "id": "magnolia",
  "grupo": "jorge",
  "titulo": "Magnólia",
  "artista": "Jorge Ben Jor",
  "genero": "Samba-rock",
  "padrao": "sambarock",
  "bpm": 121,
  "capo": 0,
  "youtube": "NE0FAmjSE_8",
  "nota": "Mais difícil: tem Gm, F#m e Fm com pestana. Deixe para depois de Taj Mahal.",
  "secoes": [
   {
    "nome": "Intro",
    "seq": "Gm:4 F#m:4 Em:4 F#m:4 Em:4 D7M:4 Em7:8 D7M:4 Em7:8 F#m7:4 Em7:4 F#m7:4 Em7:4 F#m7:4 Em7:4 D7M:2 Em7:4 F#m7:4 Em7:4 D7M:2 Em7:4 F#m7:4 Em7:4 D7M:2 Em7:4 F#m:2 Gm:2 Fm:4 Em7:4 F#m:2 Gm:2 F#m:4 Em7:4 F#m:2 Gm:2 F#m:4 Em7:4 F#m:2 Gm:2 F#m:4 Em7:8 F#m:4 Gm:4 F#m:4 Em7:8 F#m:2 Gm:2 F#m:4 Em7:4 F#m7:4 Em7:4 D7M:2 Em7:4 F#m7:4 Em7:4 D7M:2 Em7:4 F#m7:4 Em7:4 F#m7:4 Em7:4 F#m7:4 Em7:4 F#m7:4 Em7:4 F#m7:2 Em7:2 F#m7:2 Em7:4 F#m7:2 Em7:2 F#m7:2 Em7:4 F#m7:2 Em7:4 F#m7:2 Em7:4 F#m7:2 Em7:4",
    "repetir": 1
   }
  ],
  "fonte": "https://www.cifraclub.com.br/jorge-ben-jor/magnolia/simplificada.html"
 },
 {
  "id": "amante-amado",
  "grupo": "jorge",
  "titulo": "Amante Amado",
  "artista": "Jorge Ben Jor",
  "genero": "Samba-rock",
  "padrao": "sambarock",
  "bpm": 100,
  "capo": 0,
  "youtube": "gASmm3bqWow",
  "nota": "A marca da música é a descida E7(9) → Eb7M → D7M: o mesmo desenho descendo uma casa.",
  "secoes": [
   {
    "nome": "Introdução",
    "seq": "E7(9):4 Eb7M:4 D7M:8",
    "repetir": 1
   },
   {
    "nome": "Primeira parte",
    "seq": "E7(9):4 Eb7M:4 D7M:8 E7(9):4 Eb7M:4 D7M:8",
    "repetir": 1
   },
   {
    "nome": "Segunda parte",
    "seq": "G7M:4 F#m7:4 Em7:4 A7:4 D7M:4 G7M:4 F#m7:4 Em7:4 C:4 A7:4 D7M:8",
    "repetir": 1
   },
   {
    "nome": "Refrão",
    "seq": "E7(9):4 Eb7M:4 D7M:8 E7(9):4 Eb7M:4 D7M:8",
    "repetir": 1
   },
   {
    "nome": "Segunda parte",
    "seq": "G7M:4 F#m7:4 Em7:4 A7:4 D7M:4 G7M:4 F#m7:4 Em7:4 C:4 A7:4 D7M:8",
    "repetir": 1
   },
   {
    "nome": "Refrão final",
    "seq": "E7(9):4 Eb7M:4 D7M:8 E7(9):4 Eb7M:4 D7M:8 E7(9):4 Eb7M:4 D7M:8",
    "repetir": 1
   }
  ],
  "fonte": "https://www.cifraclub.com.br/jorge-ben-jor/amante-amado/simplificada.html"
 },
 /* ===== Intermediário e Avançado (só acordes, do Cifra Club; versão completa ou simplificada, ver "fonte") ===== */
 {
  "id": "deixa-a-vida-me-levar",
  "grupo": "intermediario",
  "titulo": "Deixa a Vida Me Levar",
  "artista": "Zeca Pagodinho",
  "genero": "Samba",
  "padrao": "pagode",
  "bpm": 92,
  "capo": 0,
  "tom": "E",
  "youtube": "oTREAvZbmME",
  "nota": "Pagode com acordes menores com sétima: C#m7, F#m7 e G#m7.",
  "secoes": [
   {
    "nome": "Intro",
    "seq": "A:4 B7:4 C#m7:4 F#m7:4 G#m7:4 A:4 B7:4 E:4 B7:4",
    "repetir": 1
   },
   {
    "nome": "Primeira Parte",
    "seq": "E:4 B7:4 E:4 F#m7:4 B7:4 E:2 B7:4 E:4 B7:2 E:4 C#7:4 F#m7:4 B7:4 E:4",
    "repetir": 1
   },
   {
    "nome": "Refrão",
    "seq": "A:4 E:4 F#m7:4 B7:2 E:4 E7:2 A:4 B7:4 E:4 B7:4 E:2 B7:4",
    "repetir": 1
   },
   {
    "nome": "Segunda Parte",
    "seq": "E:4 B7:2 E:4 F#m7:2 C#7:4 F#m7:4 B7:4 E:4 B7:4",
    "repetir": 1
   },
   {
    "nome": "Terceira Parte",
    "seq": "E:4 B7:4 E:4 B7:4 E:4 E7:2 A:2 C#7:4 F#m7:4 Am:4 G#m7:4 C#7:4 F#m7:4 B7:4 E:4",
    "repetir": 1
   },
   {
    "nome": "Refrão",
    "seq": "A:4 E:4 F#m7:4 B7:2 E:4 E7:2 A:4 B7:4 E:4 B7:4 E:2 B7:4",
    "repetir": 1
   },
   {
    "nome": "Primeira Parte",
    "seq": "E:4 B7:4 E:4 F#m7:4 B7:4 E:2 B7:4 E:4 B7:2 E:4 C#7:4 F#m7:4 B7:4 E:4",
    "repetir": 1
   },
   {
    "nome": "Refrão",
    "seq": "A:4 E:4 F#m7:4 B7:2 E:4 E7:2 A:4 B7:4 E:4 B7:4 E:2 B7:4",
    "repetir": 1
   },
   {
    "nome": "Segunda Parte",
    "seq": "E:4 B7:2 E:4 F#m7:2 C#7:4 F#m7:4 B7:4 E:4 B7:4",
    "repetir": 1
   },
   {
    "nome": "Terceira Parte",
    "seq": "E:4 B7:4 E:4 B7:4 E:4 E7:2 A:2 C#7:4 F#m7:4 Am:4 G#m7:4 C#7:4 F#m7:4 B7:4 E:4",
    "repetir": 1
   },
   {
    "nome": "Refrão",
    "seq": "A:4 E:4 F#m7:4 B7:2 E:4 E7:2 A:4 B7:4 E:4 B7:4 E:2 B7:4 A:4 E:4 F#m7:4 B7:2 E:4 E7:2 A:4 B7:4 E:4 B7:4 E:2 B7:4 A:4 E:4 F#m7:4 B7:2 E:4 E7:2 A:4 B7:4 E:4 B7:4 E:4",
    "repetir": 1
   }
  ],
  "fonte": "https://www.cifraclub.com.br/zeca-pagodinho/deixa-vida-me-levar/simplificada.html"
 },
 {
  "id": "trem-das-onze",
  "grupo": "intermediario",
  "titulo": "Trem das Onze",
  "artista": "Adoniran Barbosa",
  "genero": "Samba",
  "padrao": "samba",
  "bpm": 91,
  "capo": 0,
  "tom": "Am",
  "youtube": "RkkGVgOqPuM",
  "nota": "Samba paulista em Lá menor, com o F de pestana e o E7 que puxa de volta.",
  "secoes": [
   {
    "nome": "Intro",
    "seq": "Dm:4 Am:4 F:4 E:4 Am:4 A7:4 Dm:4 Am:4 F:4 E:4 Am:4 E:4",
    "repetir": 1
   },
   {
    "nome": "Primeira Parte",
    "seq": "Am:4 E:2 A7:4 Dm:4 Am:4 F:4 E:4 Am:4 E:2 A7:4 Dm:4 Am:4 F:4 E:4 Am:4",
    "repetir": 1
   },
   {
    "nome": "Segunda Parte",
    "seq": "A7:4 Dm:4 D7:4 E:2 A7:4 Dm:2 Am:4 F:4 E:4 Am:4 E:4",
    "repetir": 1
   },
   {
    "nome": "Primeira Parte",
    "seq": "Am:4 E:2 A7:4 Dm:4 Am:4 F:4 E:4 Am:4",
    "repetir": 1
   },
   {
    "nome": "Segunda Parte",
    "seq": "A7:4 Dm:4 D7:4 E:2 A7:4 Dm:2 Am:4 F:4 E:4 Am:4 A7:4",
    "repetir": 1
   },
   {
    "nome": "Final",
    "seq": "Dm:4 Am:4 F:4 E:4 Am:4 A7:4 Dm:4 Am:4 F:4 E:4 Am:4",
    "repetir": 1
   }
  ],
  "fonte": "https://www.cifraclub.com.br/adoniran-barbosa/trem-das-onze/simplificada.html"
 },
 {
  "id": "o-que-e-o-que-e",
  "grupo": "intermediario",
  "titulo": "O Que É, O Que É",
  "artista": "Gonzaguinha",
  "genero": "MPB",
  "padrao": "samba",
  "bpm": 100,
  "capo": 0,
  "tom": "A",
  "youtube": "IYZcsb706q8",
  "nota": "Muitos acordes com sétima e dominantes que levam de um acorde a outro.",
  "secoes": [
   {
    "nome": "Refrão",
    "seq": "A:2 C#7:2 F#m7:4 Bm7:2 E7:4 Bm7:4 E7:4 A:4 E7:4 A:4 A7:4 D:4 Dm:4 A:2 F#7:4 Bm7:4 E7:4 A:2 E7:4",
    "repetir": 1
   },
   {
    "nome": "Primeira Parte",
    "seq": "Am:4 Dm:4 E7:4 Am:4 E7:4 Am:4 A7:2 Dm:4 E7:4 Am:4",
    "repetir": 1
   },
   {
    "nome": "Segunda Parte",
    "seq": "G7:4 C:4 E7:4 A7:4 Dm:4 Am:4 F7:4 E7:4",
    "repetir": 1
   },
   {
    "nome": "Terceira Parte",
    "seq": "Am:4 E7:4 Bb7:4 A7:4 Dm:4 Am:4 F7:4 E7:4",
    "repetir": 1
   },
   {
    "nome": "Quarta Parte",
    "seq": "Am:4 G7:4 C:4 E7:4 Am:4 B7:4 E7:4 Am:4 G7:4 C:2 A7:4",
    "repetir": 1
   },
   {
    "nome": "Pré-Refrão",
    "seq": "Dm:4 E7:4 Am:4 F7:4 E7:4",
    "repetir": 1
   },
   {
    "nome": "Refrão",
    "seq": "A:2 C#7:2 F#m7:4 Bm7:2 E7:4 Bm7:4 E7:4 A:4 E7:4 A:4 A7:4 D:4 Dm:4 A:2 F#7:4 Bm7:4 E7:4 A:4 E7:4 A:2 C#7:2 F#m7:4 Bm7:2 E7:4 Bm7:4 E7:4 A:4 E7:4 A:4 A7:4 D:4 Dm:4 A:2 F#7:4 Bm7:4 E7:4 A:2 E7:4 A:2 C#7:2 F#m7:4 Bm7:2 E7:4 Bm7:4 E7:4 A:4 E7:4 A:4 A7:4 D:4 Dm:4 A:2 F#7:4 Bm7:4 E7:4 A:4",
    "repetir": 1
   }
  ],
  "fonte": "https://www.cifraclub.com.br/gonzaguinha/o-que-e-que-e/simplificada.html"
 },
 {
  "id": "aquarela",
  "grupo": "intermediario",
  "titulo": "Aquarela",
  "artista": "Toquinho",
  "genero": "MPB",
  "padrao": "dedilhado",
  "bpm": 76,
  "capo": 0,
  "tom": "G",
  "youtube": "2YkZmzAgfuA",
  "nota": "Dedilhada, com baixos que andam: G/B, Em/D, D/F# e C/E.",
  "secoes": [
   {
    "nome": "Intro",
    "seq": "G:4 G/B:4 C:4 C/D:4 G:4 G/B:4 C:4 C/D:4",
    "repetir": 1
   },
   {
    "nome": "Intro",
    "seq": "G:4 G/B:4 C:4 C/D:4",
    "repetir": 1
   },
   {
    "nome": "Primeira Parte",
    "seq": "G:4 G/B:4 C:2 C/D:4 G:4 G/B:4 C:4 C/D:4 G:4 G/B:4 C:4 C/D:4 G:4 G/B:4 C:4 C/D:4",
    "repetir": 1
   },
   {
    "nome": "Pré-Refrão",
    "seq": "Em:4 Em/D:4 C:4 F7M:4 G:4 G/B:4 C:4 C/D:4",
    "repetir": 1
   },
   {
    "nome": "Refrão",
    "seq": "G:4 D/F#:4 C/E:4 C/D:4 G:4 D/F#:4 C/E:4 C/D:4 G:4 B7:4 Em:4 A7:4 C/D:4 G:4 D/F#:4 C/E:4 C/D:4 G:4 D/F#:4 C/E:4 C/D:4 G:4 B7:4 Em:4 A7:4 C/D:4 G:4 G/B:4 C:4 C/D:4 G:4 G/B:4 C:4 C/D:4",
    "repetir": 1
   },
   {
    "nome": "Segunda Parte",
    "seq": "G:4 G/B:4 C:4 C/D:4 G:4 G/B:4 C:4 C/D:4 G:4 G/B:4 C:4 C/D:4 G:4 G/B:4 C:4 C/D:4",
    "repetir": 1
   },
   {
    "nome": "Pré-Refrão 2",
    "seq": "Em:4 Em/D:4 C:4 F7M:4 G:4 G/B:4 C:4 C/D:4",
    "repetir": 1
   },
   {
    "nome": "Refrão 2",
    "seq": "G:2 D/F#:4 C/E:4 C/D:4 G:4 D/F#:4 C/E:4 C/D:4 G:4 B7:4 Em:4 A7:4 C/D:4 G:4 D/F#:4 C/E:4 C/D:4 G:4 D/F#:4 C/E:4 C/D:4 G:4 B7:4 Em:4 A7:4 C/D:4",
    "repetir": 1
   },
   {
    "nome": "Final",
    "seq": "G:4 G/B:4 C:2 C/D:4 G:4 G/B:4 C:4 C/D:4 G:4 G/B:4 C:4 C/D:4",
    "repetir": 1
   },
   {
    "nome": "Final",
    "seq": "G:4 G/B:4 C:4 C/D:4 G:4",
    "repetir": 1
   }
  ],
  "fonte": "https://www.cifraclub.com.br/toquinho/aquarela/"
 },
 {
  "id": "o-leaozinho",
  "grupo": "intermediario",
  "titulo": "O Leãozinho",
  "artista": "Caetano Veloso",
  "genero": "MPB",
  "padrao": "dedilhado",
  "bpm": 70,
  "capo": 0,
  "tom": "C",
  "youtube": "wJ2prEKx3_Y",
  "nota": "O baixo desce de casa em casa: Am, Am/G#, Am/G, Am/F#.",
  "secoes": [
   {
    "nome": "Intro",
    "seq": "C:4",
    "repetir": 1
   },
   {
    "nome": "Primeira Parte",
    "seq": "C:4 G7:4 Am:4 Em:4 F:4 Bb:4 C:4 G7:4 Am:4 Em:4 F:4 Bb:4 C:4",
    "repetir": 1
   },
   {
    "nome": "Segunda Parte",
    "seq": "Am:4 Am/G#:4 Am/G:2 Am/F#:4 Am/F:4 Am/E:4 Dm7:2 G7:4 Am:4 Am/G#:4 Am/G:2 Am/F#:4 Am/F:4 Am/E:4 Dm:2 G7:4",
    "repetir": 1
   },
   {
    "nome": "Terceira Parte",
    "seq": "C:4 G7:4 Am:4 Em:4 F:4 Bb:4 C:4 G7:4 Am:4 Em:4 F:4 Bb:4 C:4",
    "repetir": 1
   },
   {
    "nome": "Segunda Parte",
    "seq": "Am:4 Am/G#:4 Am/G:2 Am/F#:4 Am/F:4 Am/E:4 Dm7:2 G7:4 Am:4 Am/G#:4 Am/G:2 Am/F#:4 Am/F:4 Am/E:4 Dm:2 G7:4",
    "repetir": 1
   },
   {
    "nome": "Terceira Parte",
    "seq": "C:4 G7:4 Am:4 Em:4 F:4 Bb:4 C:4 G7:4 Am:4 Em:4 F:4 Bb:4 C:4",
    "repetir": 1
   }
  ],
  "fonte": "https://www.cifraclub.com.br/caetano-veloso/o-leaozinho/"
 },
 {
  "id": "azul-da-cor-do-mar",
  "grupo": "intermediario",
  "titulo": "Azul da Cor do Mar",
  "artista": "Tim Maia",
  "genero": "Soul",
  "padrao": "pop",
  "bpm": 85,
  "capo": 0,
  "tom": "A",
  "youtube": "A9kTV-wpiWk",
  "nota": "Soul de Tim Maia com sétimas maiores e menores com pestana.",
  "secoes": [
   {
    "nome": "Primeira Parte",
    "seq": "A7M:2 Bm7:4 C#m7:4 Bm7:4 E7(4/9):4 A7M:2 E7(4/9):4 A7M:2 Bm7:4 C#m7:4 Bm7:4 E7(4/9):4 A7M:4",
    "repetir": 1
   },
   {
    "nome": "Solo 1",
    "seq": "Bm7:4 C#m7:4 Bm7:4 D7M:4 E7:4",
    "repetir": 1
   },
   {
    "nome": "Segunda Parte",
    "seq": "A7M:2 Bm7:4 C#m7:4 Bm7:4 E7(4/9):4 A7M:2 E7(4/9):4 A7M:2 Bm7:4 C#m7:4 Bm7:4 E7(4/9):4 A7M:2 E7(4/9):4",
    "repetir": 1
   },
   {
    "nome": "Solo 2",
    "seq": "A7M:4 Bm7:4 C#m7:4 Bm7:4 E7(4/9):4 A7M:4 E7(4/9):4 A7M:4 Bm7:4 C#m7:4 Bm7:4 E7(4/9):4 A7:4",
    "repetir": 1
   },
   {
    "nome": "Solo 1",
    "seq": "Bm7:4 C#m7:4 Bm7:4 D7M:4 E7:4 A7M:2 Bm7:4 C#m7:4 Bm7:4 E7(4/9):4 A7M:2 E7(4/9):4 A7M:2 Bm7:4 C#m7:4 Bm7:4 E7(4/9):4 A7M:2 E7(4/9):4",
    "repetir": 1
   },
   {
    "nome": "Final",
    "seq": "A7M:4 Bm7:4 C#m7:4 Bm7:4 E7(4/9):4 A7M:4 E7(4/9):4 A7M:4 Bm7:4 C#m7:4 Bm7:4 E7(4/9):4 A7M:4 E7(4/9):4 A7M:4 Bm7:4 C#m7:4 Bm7:4 E7(4/9):4 A7M:4 E7(4/9):4 A7M:4",
    "repetir": 1
   }
  ],
  "fonte": "https://www.cifraclub.com.br/tim-maia/azul-da-cor-do-mar/"
 },
 {
  "id": "gostava-tanto-de-voce",
  "grupo": "intermediario",
  "titulo": "Gostava Tanto de Você",
  "artista": "Tim Maia",
  "genero": "Soul",
  "padrao": "pop",
  "bpm": 90,
  "capo": 0,
  "tom": "A",
  "youtube": "cxSzri346W0",
  "nota": "Só 4 acordes: A7M, E7(4/9), Bm7 e C#m7.",
  "secoes": [
   {
    "nome": "Intro",
    "seq": "A7M:4 E7(4/9):4 A7M:4 E7(4/9):4",
    "repetir": 1
   },
   {
    "nome": "Primeira Parte",
    "seq": "A7M:8 Bm7:4 C#m7:4 Bm7:4 A7M:4 Bm7:4 C#m7:4 Bm7:4 A7M:4 E7(4/9):4",
    "repetir": 1
   },
   {
    "nome": "Refrão",
    "seq": "A7M:4 E7(4/9):8 A7M:4 E7(4/9):8 C#m7:2 Bm7:4",
    "repetir": 1
   },
   {
    "nome": "Segunda Parte",
    "seq": "A7M:4 Bm7:4 C#m7:4 Bm7:4 C#m7:4 Bm7:4 A7M:4 E7(4/9):4 A7M:2 E7(4/9):4",
    "repetir": 1
   },
   {
    "nome": "Refrão",
    "seq": "A7M:4 E7(4/9):8 A7M:4 E7(4/9):8 C#m7:2 Bm7:4",
    "repetir": 1
   },
   {
    "nome": "Primeira Parte",
    "seq": "C#m7:8 Bm7:4 A7M:4 Bm7:4 C#m7:4 Bm7:4 A7M:4 Bm7:4 C#m7:4 E7(4/9):4",
    "repetir": 1
   },
   {
    "nome": "Refrão",
    "seq": "C#m7:4 Bm7:4 A7M:2 E7(4/9):4 A7M:2 E7(4/9):4",
    "repetir": 1
   },
   {
    "nome": "Segunda Parte",
    "seq": "A7M:4 E7(4/9):4 A7M:4 E7(4/9):4 A7M:4 E7(4/9):4 A7M:4 E7(4/9):4 A7M:2 E7(4/9):4",
    "repetir": 1
   },
   {
    "nome": "Refrão",
    "seq": "A7M:4 E7(4/9):8 A7M:4 E7(4/9):8 C#m7:2 Bm7:4",
    "repetir": 1
   },
   {
    "nome": "Final",
    "seq": "E7(4/9):4 A7M:4 E7(4/9):4 A7M:4",
    "repetir": 1
   }
  ],
  "fonte": "https://www.cifraclub.com.br/tim-maia/gostava-tanto-de-voce/"
 },
 {
  "id": "pais-e-filhos",
  "grupo": "intermediario",
  "titulo": "Pais e Filhos",
  "artista": "Legião Urbana",
  "genero": "Pop Rock",
  "padrao": "pop",
  "bpm": 76,
  "capo": 0,
  "tom": "G",
  "youtube": "DEwLqT669Do",
  "nota": "Campo harmônico de Sol, com o F emprestado de outro tom.",
  "secoes": [
   {
    "nome": "Intro",
    "seq": "C:4 D:4 G:4 C:4 D:4 G:4 C:4 D:4 G:4 C:4 D:4 G:4",
    "repetir": 1
   },
   {
    "nome": "Primeira Parte",
    "seq": "C:2 D:4 G:4 C:4 D:4 G:4 C:4 D:2 G:4 C:2 D:4 G:2 C:2 D:4",
    "repetir": 1
   },
   {
    "nome": "Segunda Parte",
    "seq": "F:4 Em:2 C:2 Bm:2 Am:4 D:4",
    "repetir": 1
   },
   {
    "nome": "Primeira Parte",
    "seq": "C:2 D:4 G:4 C:2 D:4 G:4 C:4 D:4 G:4 C:4 D:4 G:4 C:2 D:4",
    "repetir": 1
   },
   {
    "nome": "Segunda Parte",
    "seq": "F:2 Em:4 C:4 Bm:4 Am:4 D:4",
    "repetir": 1
   },
   {
    "nome": "Refrão",
    "seq": "G:2 C:4 Em:4 C:4 G:2 C:4 Em:4 C:4",
    "repetir": 1
   },
   {
    "nome": "Terceira Parte",
    "seq": "C:2 D:2 G:4 C:2 D:2 G:4 C:2 D:2 G:4 C:4 D:4 G:4 C:4 D:2 G:4 C:4 D:4 G:4 C:4 D:4 G:4 C:4 D:4 G:4 C:4 D:2 G:4 C:4 D:2 G:4 C:4 D:4 G:4 C:4 D:2 F:2 Em:4 C:2 Bm:2 Am:2 D:4",
    "repetir": 1
   },
   {
    "nome": "Refrão",
    "seq": "G:2 C:4 Em:4 C:4 G:2 C:4 Em:4 C:4 G:4 C:4 Em:4 C:4 G:4 C:4 Em:4 C:4 C:4 D:2 G:4 C:4 D:2 G:4 C:2 D:2 G:4 C:2 D:4 G:4",
    "repetir": 1
   },
   {
    "nome": "Final",
    "seq": "C:4 D:4 G:4 C:4 D:4 G:4 C:4 D:4 G:4 C:4 D:4 G:4",
    "repetir": 1
   }
  ],
  "fonte": "https://www.cifraclub.com.br/legiao-urbana/pais-filhos/simplificada.html"
 },
 {
  "id": "malandragem",
  "grupo": "intermediario",
  "titulo": "Malandragem",
  "artista": "Cássia Eller",
  "genero": "Pop Rock",
  "padrao": "pop",
  "bpm": 67,
  "capo": 0,
  "tom": "Dm",
  "youtube": "TlGZai-wge4",
  "nota": "Pestana o tempo todo: Dm, Bb, Gm, F e C.",
  "secoes": [
   {
    "nome": "Intro",
    "seq": "Dm:4 Bb:4 C:4",
    "repetir": 1
   },
   {
    "nome": "Primeira Parte",
    "seq": "Dm:4 C:4 Gm:4 Dm:4 C:4 Gm:4 Dm:4 C:4 Bb:4 Dm:4 C:4 Gm:4 Dm:4 C:4 Bb:4",
    "repetir": 1
   },
   {
    "nome": "Refrão",
    "seq": "Dm:4 C:4 F:2 G:4 Dm:4 C:4 F:4 G:4 Bb:4 C:4 Dm:4 Bb:4 C:4 Dm:4",
    "repetir": 1
   },
   {
    "nome": "Segunda Parte",
    "seq": "C:4 Gm:4 Dm:4 G:4 F:4 C:4 Dm:4 Bb:4 Dm:4 G:4 F:4 C:4 Dm:4 Bb:8 Dm:4",
    "repetir": 1
   },
   {
    "nome": "Refrão",
    "seq": "Dm:4 C:4 F:2 G:4 Dm:4 C:4 F:4 G:4 Bb:4 C:4 Dm:4 Bb:4 C:4 Dm:4",
    "repetir": 1
   },
   {
    "nome": "Solo",
    "seq": "C:4 Gm:4 Dm:4",
    "repetir": 1
   },
   {
    "nome": "Segunda Parte",
    "seq": "G:4 F:4 C:4 Dm:4 Bb:4 Dm:4 G:4 F:4 C:4 Dm:4 Bb:8 Dm:4",
    "repetir": 1
   },
   {
    "nome": "Refrão",
    "seq": "Dm:4 C:4 F:2 G:4 Dm:4 C:4 F:4 G:4 Bb:4 C:4 Dm:4 Bb:4 C:4 Dm:4 Dm:4",
    "repetir": 1
   }
  ],
  "fonte": "https://www.cifraclub.com.br/cassia-eller/malandragem/"
 },
 {
  "id": "disritmia",
  "grupo": "intermediario",
  "titulo": "Disritmia",
  "artista": "Martinho da Vila",
  "genero": "Samba",
  "padrao": "samba",
  "bpm": 90,
  "capo": 0,
  "tom": "Gm",
  "youtube": "9y7P1af3NAM",
  "nota": "Samba em Sol menor com o meio-diminuto Dm7(b5).",
  "secoes": [
   {
    "nome": "Intro",
    "seq": "Gm7:4",
    "repetir": 1
   },
   {
    "nome": "Primeira Parte",
    "seq": "Gm7:4 Dm7(b5):4 G7:4 Cm7:4 D7:4 Gm7:4",
    "repetir": 1
   },
   {
    "nome": "Refrão",
    "seq": "Cm7:4 Gm7:4 D7:4 Gm7:4 Cm7:4 Gm7:4 D7:4 Gm7:4",
    "repetir": 1
   },
   {
    "nome": "Segunda Parte",
    "seq": "Gm7:4 Dm7(b5):4 G7:4 Cm7:4 D7:4 Gm7:4",
    "repetir": 1
   },
   {
    "nome": "Refrão",
    "seq": "Cm7:4 Gm7:4 D7:4 Gm7:4 Cm7:4 Gm7:4 D7:4 Gm7:4 Cm7:4 Gm7:4 D7:4 Gm7:4 Cm7:4 Gm7:4 D7:4 Gm7:4 Cm7:4 Gm7:4 D7:4 Gm7:4 Cm7:4 Gm7:4 D7:4 Gm7:4",
    "repetir": 1
   }
  ],
  "fonte": "https://www.cifraclub.com.br/martinho-da-vila/disritimia/simplificada.html"
 },
 {
  "id": "andanca",
  "grupo": "intermediario",
  "titulo": "Andança",
  "artista": "Beth Carvalho",
  "genero": "Samba",
  "padrao": "samba",
  "bpm": 100,
  "capo": 0,
  "tom": "D",
  "youtube": "XAU4p_a4F1Y",
  "nota": "Passeia por Bb e Eb, longe do tom de Ré, e volta pelo A7.",
  "secoes": [
   {
    "nome": "Intro",
    "seq": "D:4 Bb:4 Eb:4 Em7(b5):4 A7:4",
    "repetir": 1
   },
   {
    "nome": "Primeira Parte",
    "seq": "D:4 Bb:4 Eb:4 Em7(b5):2 A7:4 D:4 Bb:4 Eb:4 Em7(b5):2 A7:4 D7:4",
    "repetir": 1
   },
   {
    "nome": "Refrão",
    "seq": "D:8 E:4 A7:4 A:4 G:2 A:2 D:4 E:4 A7:4 A:4 G:2 A:2 D:4",
    "repetir": 1
   },
   {
    "nome": "Segunda Parte",
    "seq": "D:4 Bb:4 Eb:4 Em7(b5):2 A7:4 D:4 Bb:4 Eb7M:4 Em7(b5):2 A7:4 D7:4",
    "repetir": 1
   },
   {
    "nome": "Refrão Final",
    "seq": "D:8 D:4 E:4 A7:4 A:4 G:2 A:2 D:4 D:4 E:4 A7:4 A:4 G:2 A:2 D:4 D:4 E:4 A7:4 A:4 G:2 A:2 D:4 D:4 E:4 A7:4 A:4 G:2 A:2 D:4 D:4 E:4 A7:4 A:4 G:2 A:2 D:4 D:4 E:4 A7:4 A:4 G:2 A:2 D:4",
    "repetir": 1
   }
  ],
  "fonte": "https://www.cifraclub.com.br/beth-carvalho/andanca/simplificada.html"
 },
 {
  "id": "ta-escrito",
  "grupo": "intermediario",
  "titulo": "Tá Escrito",
  "artista": "Grupo Revelação",
  "genero": "Pagode",
  "padrao": "pagode",
  "bpm": 92,
  "capo": 0,
  "tom": "F",
  "youtube": "7mrpqHl_6qw",
  "nota": "Pagode em Fá, cheio de pestanas: Bb, Gm, Cm.",
  "secoes": [
   {
    "nome": "Intro",
    "seq": "F:4",
    "repetir": 1
   },
   {
    "nome": "Primeira Parte",
    "seq": "F:8 C:4 Bb:4 F:4 Dm:4 Gm:4 C7:4 F:8 C:4 Bb:4 F:4 Dm:4 Gm:4 C7:2 F:2 F7:4",
    "repetir": 1
   },
   {
    "nome": "Segunda Parte",
    "seq": "Bb:8 F:4 F/C:4 Am:4 Gm:4 C7:4 F:4 F7M:4 Cm:4 F7:4",
    "repetir": 1
   },
   {
    "nome": "Pré-Refrão",
    "seq": "Bb:8 F:4 F/C:4 Am:2 D7(b9):4 Gm:4 C7:4 F:4 D7:4 Gm:4 C7:4 F:2 F7:4",
    "repetir": 1
   },
   {
    "nome": "Refrão",
    "seq": "Bb:4 C7:4 F:2 F7M:2 F6:4 C:4 Bb:4 C:4 F:4 F7:4 Bb:4 C7:4 F:2 F7M:2 F6:4 C:4 Bb:4 C:4 F:4",
    "repetir": 1
   },
   {
    "nome": "Primeira Parte",
    "seq": "F:8 C:4 Bb:4 F:4 Dm:4 Gm:4 C7:4 F:8 C:4 Bb:4 F:4 Dm:4 Gm:4 C7:4 F:2 F7:4",
    "repetir": 1
   },
   {
    "nome": "Segunda Parte",
    "seq": "Bb:8 F:4 F/C:4 Am:4 Gm:4 C7:4 F:4 F7M:4 Cm:4 F7:4",
    "repetir": 1
   },
   {
    "nome": "Pré-Refrão",
    "seq": "Bb:8 F:4 F/C:4 Am:2 D7(b9):4 Gm:4 C7:4 F:4 D7:4 Gm:4 C7:4 F:2 F7:4",
    "repetir": 1
   },
   {
    "nome": "Refrão Final",
    "seq": "Bb:4 C7:4 F:2 F7M:2 F6:4 C:4 Bb:4 C:4 F:4 F7:4 Bb:4 C7:4 F:2 F7M:2 F6:4 C:4 Bb:4 C:4 F:2 F7:4 Bb:4 C7:4 F:2 F7M:2 F6:4 C:4 Bb:4 C:4 F:4 F7:4 Bb:4 C7:4 F:2 F7M:2 F6:4 C:4 Bb:4 C:4 F:2 F7:4 Bb:4 C7:4 F:2 F7M:2 F6:4 C:4 Bb:4 C:4 F:4",
    "repetir": 1
   }
  ],
  "fonte": "https://www.cifraclub.com.br/revelacao/ta-escrito/"
 },
 {
  "id": "o-sol-nascera",
  "grupo": "avancado",
  "titulo": "O Sol Nascerá",
  "artista": "Cartola",
  "genero": "Samba",
  "padrao": "samba",
  "bpm": 92,
  "capo": 0,
  "tom": "C",
  "youtube": "UDmjhNnfnGo",
  "nota": "Samba de Cartola com harmonia de bossa: Dm7(9), G7(13), C7M(9).",
  "secoes": [
   {
    "nome": "Música inteira",
    "seq": "Gm7:4 C7(9):4 F7M:4 Fm6:4 F7M:4 Fm6:4 C7M:4 G7:4 C6(9):2 C7(9):2 F7M:4 D7:2 A7:2 Dm7(9):2 G7:4 C6(9):2 C7(9):2 F7M:4 Dm7(9):2 G7(13):4 C7M(9):4 G7(#5):4 Gm7:4 C7(9):4 F7M:4 Fm6:4 C7M(9):4 Dm7:4 G7:4",
    "repetir": 1
   }
  ],
  "fonte": "https://www.cifraclub.com.br/cartola/o-sol-nascera/"
 },
 {
  "id": "garota-de-ipanema",
  "grupo": "avancado",
  "titulo": "Garota de Ipanema",
  "artista": "Tom Jobim",
  "genero": "Bossa Nova",
  "padrao": "bossa",
  "bpm": 120,
  "capo": 0,
  "tom": "F",
  "youtube": "uW5acE-5280",
  "nota": "O clássico da bossa nova, com a ponte que passa por Gb7(#11) e F#7M.",
  "secoes": [
   {
    "nome": "Ritmo Padrão",
    "seq": "F7M:4 G7(13):4 Gm7:4 C7(b9):4 Am7(11):4 Ab7(#11):4 Gm7(11):4 Gb7(#11):4",
    "repetir": 1
   },
   {
    "nome": "Passagem",
    "seq": "F7M:8 G7(13):4 Gm7:4 C7(b9):4 F7M:4",
    "repetir": 1
   },
   {
    "nome": "Segunda Parte",
    "seq": "F#7M:4 B7(9):4 F#m7:8 D7(9):4 Gm7:4 Eb7(9):4 Am7:4 D7(b9):4 Gm7:4 C7(b9):4",
    "repetir": 1
   },
   {
    "nome": "Primeira Parte",
    "seq": "F7M:8 G7(13):4 Gm7:4 C7(b9):4 F7M:4",
    "repetir": 1
   },
   {
    "nome": "Final",
    "seq": "C7(b9):4 F7M:4 C7(b9):4 F7M:4",
    "repetir": 1
   }
  ],
  "fonte": "https://www.cifraclub.com.br/tom-jobim/garota-de-ipanema/"
 },
 {
  "id": "corcovado",
  "grupo": "avancado",
  "titulo": "Corcovado",
  "artista": "Tom Jobim",
  "genero": "Bossa Nova",
  "padrao": "bossa",
  "bpm": 100,
  "capo": 0,
  "youtube": "wilIgoJ294M",
  "nota": "Começa no Am6 e passeia por dominantes e diminutos.",
  "secoes": [
   {
    "nome": "Intro",
    "seq": "Am:4 E7:4 Gm:4 C7:4 F7M:4 E7:4 C9:4 Am:4 G#°:4",
    "repetir": 1
   },
   {
    "nome": "Primeira Parte",
    "seq": "Am:4 E7:4 Gm:4 C7:4 F7M:4 Fm:4 E7:4 A7:4 D7:8 Dm7:4 G7:4",
    "repetir": 1
   },
   {
    "nome": "Segunda Parte",
    "seq": "Am:8 E7:4 Gm:8 F7M:4",
    "repetir": 1
   },
   {
    "nome": "Refrão",
    "seq": "Fm:4 Em7:4 Am7:4 Dm7:4 G7:4 Bb7:2 A7:4 Dm7:4 G7:4 Am:4 E7:4 Gm:4 C7:4 F7M:4 E7:4 C9:4 Am:4 G#°:4",
    "repetir": 1
   },
   {
    "nome": "Refrão Final",
    "seq": "Fm7:4 Em7:4 Am7:4 Dm7:4 G7:4 Bb7:2 A7:4 Dm7:4 G7:4 Am6:4 G#°:2 Am:2 G#°:4 Am:4 G#°:4",
    "repetir": 1
   }
  ],
  "fonte": "https://www.cifraclub.com.br/tom-jobim/corcovado/simplificada.html"
 },
 {
  "id": "wave",
  "grupo": "avancado",
  "titulo": "Wave",
  "artista": "Tom Jobim",
  "genero": "Bossa Nova",
  "padrao": "bossa",
  "bpm": 110,
  "capo": 0,
  "tom": "D",
  "youtube": "4Bag7nmDDwQ",
  "nota": "Começa com o diminuto Bb° e é cheia de dominantes com 9 e 13.",
  "secoes": [
   {
    "nome": "Intro",
    "seq": "Dm7:4 G/D:4 Dm7:4 G/D:4 Dm7:4 G/D:4 Dm7:4 Dm7:4 G/D:4 Dm7:4 G/D:4 Dm7:4 G/D:4 Dm7:4 Dm7:4 G/D:4 Dm7:4 G/D:4 Dm7:4 G/D:4 Dm7:4",
    "repetir": 1
   },
   {
    "nome": "Primeira Parte",
    "seq": "D7M(9):4 Bb°:4 Am7:2 D7(b9):4 G7M:2 Gm6:4 F#7(13):2 F#7(b13):4 B7(9):4 B7(b9):2 E7(9):4 Bb7(13):4 A7(b13):4 Dm7:2 G/D:2 Dm7:2 G/D:4 D7M(9):4 Bb°:4 Am7:2 D7(b9):4 G7M:4 Gm6:4 F#7(13):2 F#7(b13):4 B7(9):4 B7(b9):4 E7(9):4 Bb7(13):4 A7(b13):4 Dm7:2 G/D:2 Dm7:2 G/D:4",
    "repetir": 1
   },
   {
    "nome": "Segunda Parte",
    "seq": "Gm7:4 C/Bb:4 Am7:4 Ab/Bb:4 Bb/Ab:4 Gm7:2 A7(b13):2 A7:4",
    "repetir": 1
   },
   {
    "nome": "Terceira Parte",
    "seq": "A7:4 D7M(9):4 Bb°:4 Am7:2 D7(b9):4 G7M:4 Gm6:4 F#7(13):2 F#7(b13):4 B7(9):4 B7(b9):2 E7(9):4 Bb7(13):4 A7(b13):4 Dm7:2 G/D:2 Dm7:2 G/D:4",
    "repetir": 1
   },
   {
    "nome": "Solo",
    "seq": "D7M:4 Bb°:4 Am7:4 D7(b9):4 G7M:4 Gm6:4 F#7(13):4 F#7(b13):4 B7(9):4 B7(b9):4 E7(9):4 Bb7(13):4 A7(b13):4 Dm7:4 G/D:4 Dm7:4 G/D:4",
    "repetir": 1
   },
   {
    "nome": "Segunda Parte",
    "seq": "Gm7:4 C/Bb:4 Am7:4 Ab/Bb:4 Bb/Ab:4 Gm7:2 A7(b13):2 A7:4",
    "repetir": 1
   },
   {
    "nome": "Terceira Parte",
    "seq": "A7:4 D7M(9):4 Bb°:4 Am7:2 D7(b9):4 G7M:4 Gm6:4 F#7(13):2 F#7(b13):4 B7(9):4 B7(b9):2 E7(9):4 Bb7(13):4 A7(b13):4 Dm7:2 G/D:2 Dm7:2 G/D:4",
    "repetir": 1
   },
   {
    "nome": "Repete Intro",
    "seq": "Dm7:4 G/D:4 Dm7:4 G/D:4 Dm7:4 G/D:4 Dm7:4 Dm7:4 G/D:4 Dm7:4 G/D:4 Dm7:4 G/D:4 Dm7:4 Dm7:4 G/D:4 Dm7:4 G/D:4 Dm7:4 G/D:4 Dm7:4 D7M(9):4",
    "repetir": 1
   }
  ],
  "fonte": "https://www.cifraclub.com.br/tom-jobim/wave/"
 },
 {
  "id": "chega-de-saudade",
  "grupo": "avancado",
  "titulo": "Chega de Saudade",
  "artista": "Tom Jobim",
  "genero": "Bossa Nova",
  "padrao": "bossa",
  "bpm": 120,
  "capo": 0,
  "tom": "Dm",
  "youtube": "PpP9QNnkIWU",
  "nota": "Começa em Ré menor e vira Ré maior: o marco inicial da bossa nova.",
  "secoes": [
   {
    "nome": "Intro",
    "seq": "Gm7:4 A7(b13):4 Dm:4 Cm6:4 Bm7(#11):4 Bb7(13):4 A7(b13):4 Dm7:4 Eb7(9/11):4",
    "repetir": 1
   },
   {
    "nome": "Primeira Parte",
    "seq": "Dm:4 B°:4 Bbm6:4 A7(b13):4 Dm7:4 Eb7(9):2 Dm7:4 E7:2 Am7:4 Bb6:4 A7:4 A7(b13):2 Dm:4 B°:4 Bbm6:4 A7(b13):2 D7M:4 D7(b9):4 Gm7:4 A7(b13):4 Dm:4 Dm/C:4 E7/B:4 A7(b13):4 Bbm6:2 Dm7:4 Em7:4 A7(13):4",
    "repetir": 1
   },
   {
    "nome": "Segunda Parte",
    "seq": "D7M(9):2 B7:2 E7(9):4 G/A:2 A7(9):4 D°:4 D6:4 D7M:4 D°:4 Em7:4 E7(9):4 Gm6:2 A7(b9):2 D7M(9):2 Bm7:4 E7(9):4 F#7:4 Bm7:2 Bbm7:4 Am7:4 D7(b9):2 G7M:4 Gm7:4 F#m7:4 B7(13):4 E7(9):4 A7:4 F#13:4 B7:4 E7(9):4 A7(13):4 D:4 Dm:4 Dm/C:4 E7/B:4 Bbm6:4 A7(b13):4 Dm7:4 Eb7(9):4 Dm7:4 E7:4 Am7:4 Bb6:4 A7:4 A7(b13):4 Dm:4 Dm/C:4 E7/B:4 Bbm6:4",
    "repetir": 1
   },
   {
    "nome": "Primeira Parte",
    "seq": "A7(b13):2 D7M:4 D7(b9):4 Gm7:4 A7(b13):4 Dm:4 Am/C:4 E7/B:4 A7(b13):4 Bbm6:2 Dm7:4 Em7:4 A7(13):4 D7M(9):4 B7:4 E7(9):4 G/A:4 A7(9):4 D°:4 D6:4 D7M:4 D°:4 Em7:4 E7(9):4 Gm6:4 A7(b9):4",
    "repetir": 1
   },
   {
    "nome": "Segunda Parte",
    "seq": "D7M(9):2 Bm7:4 E7(9):4 F#7:4 Bm7:2 Bbm7:4 Am7:4 D7(b9):2 G7M:4 Gm7:4 F#m7:4 B7(13):4 E7(9):4 A7:4 F#13:4 B7:4 E7(9):4 A7(13):4 D:4 B7:4 E7(9):4 A7(13):4 D:4 B7:4 E7(9):4 A7(13):4 D:4",
    "repetir": 1
   }
  ],
  "fonte": "https://www.cifraclub.com.br/tom-jobim/chega-de-saudade/"
 },
 {
  "id": "samba-de-uma-nota-so",
  "grupo": "avancado",
  "titulo": "Samba de Uma Nota Só",
  "artista": "Tom Jobim",
  "genero": "Bossa Nova",
  "padrao": "bossa",
  "bpm": 120,
  "capo": 0,
  "tom": "G",
  "youtube": "nwerSLDhqZo",
  "nota": "A melodia fica numa nota só enquanto os acordes descem por baixo dela.",
  "secoes": [
   {
    "nome": "Música inteira",
    "seq": "Bm7:4 Bb7:4 Am7:4 G#7(#11):4 Bm7:4 Bb7:4 Am7(11):4 G#7(#11):4 Bm7:2 Bb7:4 Am7(11):4 G#7(#11):4 Dm7(11):4 Db7(#11):4 C6:4 Cm6:4 Bm7:4 Bb7:4 Am7(11):4 G7M:4 Cm7:4 F7(9):4 Bb7M:2 Eb7(9):4 Bb7M:2 Eb7(9):4 A#m7:4 Eb7(9):4 G#7M:4 Cm7:2 D7:4 Bm7:4 Bb7:4 Am7(11):4 G#7(#11):4 Bm7:4 Bb7:4 Am7(11):4 G#7(#11):4 Dm7(11):4 Db7(#11):4 C6:4 Cm6:4 Dm7(11):4 Db7(#11):4 G#7M:4 G7M:4",
    "repetir": 1
   }
  ],
  "fonte": "https://www.cifraclub.com.br/tom-jobim/samba-de-uma-nota-so/"
 },
 {
  "id": "aguas-de-marco",
  "grupo": "avancado",
  "titulo": "Águas de Março",
  "artista": "Tom Jobim",
  "genero": "Bossa Nova",
  "padrao": "bossa",
  "bpm": 120,
  "capo": 0,
  "tom": "B",
  "youtube": "g2P_OupxkB8",
  "nota": "O baixo desce sem parar por baixo de acordes cheios de cor.",
  "secoes": [
   {
    "nome": "Intro",
    "seq": "B/A:4",
    "repetir": 1
   },
   {
    "nome": "Primeira Parte",
    "seq": "G#m6:4 Em6/G:4 B7M(9)/F#:4 F7(#11):4 E7M(13):4 Em6:4 B7M(9):4 F#m7:4 B7:2 B6(9)/F:4 Em6:4 B6(9):4 F#m7:4 B7(9):2 B6(9)/F:4 Em6:4 B6(9):4 F#m7:4 B7(9):2 B6(9)/F:4 Em6:4 B6(9):4 F#m7:4 B7:2 B6(9)/F:4 Em6:4 B7M(9):4",
    "repetir": 1
   },
   {
    "nome": "Segunda Parte",
    "seq": "B/A:4 G#m6:4 Em6/G:4 B6(9):4 F#m7:4 B7(9):2 B6(9)/F:4 Em6:4 B6(9):4 F#m7:4 B7:2 B6(9)/F:4 Em6:4 B6(9):4",
    "repetir": 1
   },
   {
    "nome": "Terceira Parte",
    "seq": "B/A:4 G#m6:4 Em6/G:4 B7M(9)/F#:4 F#m7:4 B7(9):4 B6(9)/F:4 Em6:4 B6(9):4 F#m7:4 B7:2 B6(9)/F:4 Em6:4 B6(9):4 F#m7:4 B7(9):2 B6(9)/F:4 Em6:4 B6(9):4 B/A:4 G#m6:4 Em6/G:4 B7M(9)/F#:4 F#m7:4 B7(9):4 B6(9)/F:4 Em6:4 B6(9):4",
    "repetir": 1
   },
   {
    "nome": "Solo",
    "seq": "F/D#:4 D/C:4 B/A:4 G#m6:4 Em6/G:4 B7M(9)/F#:4 F7(#11):4 E7M(13):4 Em6:4 B6:4 F#m7:4 B7(9):4 Bb9/F:4 Em6:4 B6(9):4",
    "repetir": 1
   },
   {
    "nome": "Quarta Parte",
    "seq": "B7(13):4 B6(9)/F:4 Em6:4 B6(9):4 B7(9):4 B7(9):4 B6(9)/F:4 Em6:4 B6(9):4",
    "repetir": 1
   },
   {
    "nome": "Quinta Parte",
    "seq": "B/A:4 G#m6:4 Em6/G:4 B7M(9)/F#:4 Bm7:4 D#/B:4 C/B:4 B:4 Bm7:4 D#/B:4 C/B:4 B:4 B/A:4 G#m6:4 Em6/G:4 B7M(9)/F#:4 F#m7:2 B7(9):2 B6(9)/F:4 Em6:4 B6(9):4 F#m7:4 B7(9):4 B6(9)/F:4 Em6:4 B6(9):4",
    "repetir": 1
   },
   {
    "nome": "Final",
    "seq": "B/A:4 G#m6:4 Em6/G:4 B7M(9)/F#:4 F#m7:4 B7(9):4 B6(9)/F:4 Em6:4 B6(9):4 Bm7:4 D#/B:4 C/B:4 B:4",
    "repetir": 1
   }
  ],
  "fonte": "https://www.cifraclub.com.br/tom-jobim/aguas-de-marco/"
 },
 {
  "id": "o-barquinho",
  "grupo": "avancado",
  "titulo": "O Barquinho",
  "artista": "Roberto Menescal",
  "genero": "Bossa Nova",
  "padrao": "bossa",
  "bpm": 110,
  "capo": 0,
  "youtube": "F5eYpjYWy2s",
  "nota": "Sétimas maiores com nona que sobem e descem pelo braço.",
  "secoes": [
   {
    "nome": "Música inteira",
    "seq": "C7M(9):4 Eb7M(9):4 Dm7(9):4 G6:4 C7M(9):4 C7M(9):4 F#m11:4 B7:4 Bb7M(9):8 Bm7(9):4 E7(b13):4 Ab7M:8 Dm7:4 G7(b5):4 Em7:2 A7(b9):4 Dm7:2 G7(b13):4 C7M(9):8 F#m11:4 B7:4 Bb7M(9):8 Bm7(9):4 E7(b13):4 Ab7M:8 Dm7(9):4 G7(b13):4 Em7:2 A7(b9):4 Dm7:2 G7(b13):4 Em7:2 A7(b9):2 Dm7:2 G7(b13):4",
    "repetir": 1
   }
  ],
  "fonte": "https://www.cifraclub.com.br/roberto-menescal/o-barquinho/"
 },
 {
  "id": "carinhoso",
  "grupo": "avancado",
  "titulo": "Carinhoso",
  "artista": "Pixinguinha",
  "genero": "Samba",
  "padrao": "samba",
  "bpm": 93,
  "capo": 0,
  "tom": "G",
  "youtube": "Jy5Dl8GwC1w",
  "nota": "Choro de Pixinguinha com baixos que andam e acordes de passagem.",
  "secoes": [
   {
    "nome": "Intro",
    "seq": "G:4 G5+:4 G6:4 G5+:4 G:4 G5+:4 G6:4 G5+:4",
    "repetir": 1
   },
   {
    "nome": "Primeira Parte",
    "seq": "G:2 G5+:2 G6:4 G5+:4 G:2 G5+:2 G6:4 G7:2 Bm:2 Bm5+:2 Bm6:4 Bm5+:4 Bm:2 Bm5+:2 Bm6:4",
    "repetir": 1
   },
   {
    "nome": "Segunda Parte",
    "seq": "B7:4 Em7:2 A7(13):2 D6(9):4 G7(13):2 C6(9):2 E7:4 Am7:4 A7(13):2 D/C:2 G/B:2 Eb7:4 D7:2 G6(9):4",
    "repetir": 1
   },
   {
    "nome": "Terceira Parte",
    "seq": "Bm7:4 Em:4 F#7:4 Bm7:4 Bb7:2 D/A:2 Bm7:4 E7/G#:4 A/G:4 D/F#:4 Fm7:2 Am/E:2 D7:2 G:4",
    "repetir": 1
   },
   {
    "nome": "Quarta Parte",
    "seq": "F#:2 F#/E:4 F#7/C#:2 A#°:2 Am7:4 D7:2 G6(9):2 B7/F#:4 Em:2 B7/F#:2 Em/G:4 G7/B:2 C:2 E/D:2 Am/E:4 Eb7:2 G:2 E7:4 Am7:2 D7:4 G:4",
    "repetir": 1
   },
   {
    "nome": "Final",
    "seq": "G:4 G7:4 C/G:4 Cm/G:4 G:4 Bbm6:4 Am7:4 Ab7M:4 G7M(6):4",
    "repetir": 1
   }
  ],
  "fonte": "https://www.cifraclub.com.br/pixinguinha/carinhoso/"
 },
 {
  "id": "flor-de-lis",
  "grupo": "avancado",
  "titulo": "Flor de Lis",
  "artista": "Djavan",
  "genero": "MPB",
  "padrao": "samba",
  "bpm": 86,
  "capo": 0,
  "tom": "C",
  "youtube": "k55L6LGS_Ns",
  "nota": "Djavan: ii–V em tom maior e menor, com dominantes alteradas.",
  "secoes": [
   {
    "nome": "Intro",
    "seq": "C7M(9):4 Fm6:4 C7M(9):4 Fm6:4",
    "repetir": 1
   },
   {
    "nome": "Primeira Parte",
    "seq": "C7M(9):4 Bm7(b5):4 E7(b13):4 Am7(9):2 D7(13):4 Gm7:4 C7(9):4 F#m7(b5):4 B7(b9):4 Bb7M:4 A7(b13):4 F#m7(b5):4 B7(b9):4 Em7(9):4 A7(b13):4 D7(9):4 G7(4/9):2 G7(b9):4 C7M(9):4 Bm7(b5):4 E7(b13):4 Am7(9):2 D7(13):4 Gm7:4 C7(9):4 F#m7(b5):4 B7(b9):4 Bb7M:4 A7(b13):4 F#m7(b5):4 B7(b9):4 Em7(9):4 A7(b13):4",
    "repetir": 1
   },
   {
    "nome": "Pré-Refrão",
    "seq": "Am6:4 Fm6:2 C7M(9):2 E7(#9):4 Am7(9):4 E/G#:2 Gm7:4",
    "repetir": 1
   },
   {
    "nome": "Refrão",
    "seq": "C7(9):4 F7M:4 Bb7(9):2 Em7(9):4 A7(b13):4 D7(9):4 G7(4/9):2 G7(b9):2 Gm7:4 C7(9):4 F7M:4 Bb7(9):2 Em7(9):4 A7(b13):4 D7(9):4 G7(4/9):2 G7(b9):2 C6(9):2 G7(b13):4",
    "repetir": 1
   },
   {
    "nome": "Interlúdio",
    "seq": "C7M(9):4 Fm6:4 C7M(9):4 Fm6:4",
    "repetir": 1
   },
   {
    "nome": "Primeira Parte",
    "seq": "C7M(9):4 Bm7(b5):4 E7(b13):4 Am7(9):2 D7(13):4 Gm7:4 C7(9):4 F#m7(b5):4 B7(b9):4 Bb7M:4 A7(b13):4 F#m7(b5):4 B7(b9):4 Em7(9):4 A7(b13):4 D7(9):4 G7(4/9):2 G7(b9):4 C7M(9):4 Bm7(b5):4 E7(b13):4 Am7(9):2 D7(13):4 Gm7:4 C7(9):4 F#m7(b5):4 B7(b9):4 Bb7M:4 A7(b13):4 F#m7(b5):4 B7(b9):4 Em7(9):4 A7(b13):4",
    "repetir": 1
   },
   {
    "nome": "Pré-Refrão",
    "seq": "Am6:4 Fm6:2 C7M(9):2 E7(#9):4 Am7(9):4 E/G#:2 Gm7:4",
    "repetir": 1
   },
   {
    "nome": "Refrão",
    "seq": "C7(9):4 F7M:4 Bb7(9):2 Em7(9):4 A7(b13):4 D7(9):4 G7(4/9):2 G7(b9):2 Gm7:4 C7(9):4 F7M:4 Bb7(9):2 Em7(9):4 A7(b13):4 D7(9):4 G7(4/9):2 G7(b9):2 Gm7:4 C7(9):4 F7M:4 Bb7(9):2 Em7(9):4 A7(b13):4 D7(9):4 G7(4/9):2 G7(b9):2 Gm7:4 C7(9):4 F7M:4 Bb7(9):2 Em7(9):4 A7(b13):4 D7(9):4 G7(4/9):2 G7(b9):2 C7M(9):4",
    "repetir": 1
   },
   {
    "nome": "Final",
    "seq": "C7M(9):4 Fm6:4 C7M(9):4 Fm6:4 C6(9):4",
    "repetir": 1
   }
  ],
  "fonte": "https://www.cifraclub.com.br/djavan/flor-de-lis/"
 },
 {
  "id": "as-rosas-nao-falam",
  "grupo": "avancado",
  "titulo": "As Rosas Não Falam",
  "artista": "Cartola",
  "genero": "Samba",
  "padrao": "samba",
  "bpm": 100,
  "capo": 0,
  "tom": "Dm",
  "youtube": "pBWg7LGETL0",
  "nota": "Cartola em Ré menor: os acordes com barra fazem a baixaria do violão.",
  "secoes": [
   {
    "nome": "Intro",
    "seq": "Dm:4 Dm/C:4 B°:4 Gm/Bb:4 E7:4 A7:4 Dm:4 A7:4",
    "repetir": 1
   },
   {
    "nome": "Primeira Parte",
    "seq": "Dm:4 Dm/C:4 Gm/Bb:4 Gm/F:4 E7:4 A7/C#:4 A7:2 Dm:2 A7:4",
    "repetir": 1
   },
   {
    "nome": "Segunda Parte",
    "seq": "Dm:4 Dm/C:2 Dm/A:4 E7/G#:4 E7/D:4 Gm/Bb:4 A7:4 A7/E:2 Dm:2 D7/F#:4",
    "repetir": 1
   },
   {
    "nome": "Terceira Parte",
    "seq": "Gm:4 Gm/F:4 Dm:4 Dm/C:4 E7/B:4 E7/D:4 E7/B:2 A7:2 A7/E:4",
    "repetir": 1
   },
   {
    "nome": "Quarta Parte",
    "seq": "Dm:4 Dm/C:4 Gm/Bb:4 Gm/F:4 E7:4 E7/B:2 A7/C#:4 A7:2 Dm:2 A7:4",
    "repetir": 1
   },
   {
    "nome": "Primeira Parte",
    "seq": "Dm:4 Dm/C:4 Gm/Bb:4 Gm/F:4 E7:4 A7/C#:4 A7:2 Dm:2 A7:4",
    "repetir": 1
   },
   {
    "nome": "Segunda Parte",
    "seq": "Dm:4 Dm/C:2 Dm/A:4 E7/G#:4 E7/D:4 Gm/Bb:4 A7:4 A7/E:2 Dm:2 D7/F#:4",
    "repetir": 1
   },
   {
    "nome": "Terceira Parte",
    "seq": "Gm:4 Gm/F:4 Dm:4 Dm/C:4 E7/B:4 E7/D:4 E7/B:2 A7:2 A7/E:4",
    "repetir": 1
   },
   {
    "nome": "Quarta Parte",
    "seq": "Dm:4 Dm/C:4 Gm/Bb:4 Gm/F:4 E7:4 E7/B:2 A7/C#:4 A7:2 Dm:2 A7:4",
    "repetir": 1
   },
   {
    "nome": "Dedilhado",
    "seq": "Dm:4 Dm/C:4 Gm/Bb:4 Gm/F:4 E7:4 E7/B:2 A7:4 A7/E:4 Dm:2 Dm9:4",
    "repetir": 1
   },
   {
    "nome": "Final",
    "seq": "Dm9:4",
    "repetir": 1
   }
  ],
  "fonte": "https://www.cifraclub.com.br/cartola/as-rosas-nao-falam/"
 }
];

/* ---------- MISSÕES DIÁRIAS ----------
   metrica: o que é contado no dia | alvo: quanto precisa */
const MISSOES = [
  { id: 'licao', texto: 'Conclua 1 lição', metrica: 'licoes', alvo: 1, xp: 30 },
  { id: 'trocas', texto: 'Faça 20 trocas de acorde', metrica: 'trocas', alvo: 20, xp: 25 },
  { id: 'quiz', texto: 'Acerte 7 acordes no quiz', metrica: 'quiz', alvo: 7, xp: 20 },
  { id: 'batida', texto: 'Tire 70% ou mais num jogo no tempo', metrica: 'batida', alvo: 70, xp: 30 },
  { id: 'minutos', texto: 'Treine 10 minutos', metrica: 'min', alvo: 10, xp: 25 },
  { id: 'musica', texto: 'Toque 1 música até o fim', metrica: 'musicas', alvo: 1, xp: 30 },
];

const TITULOS = ['Calouro', 'Aprendiz', 'Batuqueiro', 'Seresteiro', 'Partideiro', 'Bamba', 'Mestre da roda'];
