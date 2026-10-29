# Toca Aí 2 — violão com música brasileira

Segunda versão do [Toca Aí](https://github.com/mathperrut/toca-a-). A base é a mesma (o design, o jogo no estilo Yousician, o curso, as apostilas e o violão gravado), e as novidades entram **em fases**: cada fase termina com um APK para testar, e a próxima só começa depois de aprovada.

| Parte | Linguagem | O que faz |
|---|---|---|
| App (raiz da pasta) | HTML, CSS, JavaScript | Telas, jogo, curso, apostilas, afinador |
| `capacitor.config.json`, `package.json`, `android-build/` | JSON + JavaScript (Node) | Empacotam o site como **app Android** com o Capacitor |
| `.github/workflows/apk.yml` | YAML (GitHub Actions) | Robô que **gera o .apk sozinho** a cada atualização |
| `ia/` | **Python** (NumPy, SciPy, scikit-learn) | Projeto de estudo: rede neural que reconhece acordes |

---

## Fases

| Fase | O que entra | Situação |
|---|---|---|
| 1. Base e correções | Botão Voltar nas lições, botão "Consegui", trocas com microfone, som certo para cada imagem, nome e ícone novos | **Pronta** |
| 2. Tocar junto e mudar o tom | Violão + batida, violão + batida + banda, tudo (gravação original); volume de cada parte; tom −6 a +6; repetir um trecho | **Pronta** |
| 3. Microfone mais preciso | Medir a precisão com gravações reais; jeito novo de ouvir as notas; ensinar o app a ouvir o seu violão | **Pronta** |
| 4. Níveis e conteúdo | Iniciante, Intermediário e Avançado no curso, nas apostilas e nas músicas; cifragem, teoria, técnica, ritmos, treino de ouvido | **Pronta** |
| 5. Vozes do instrutor | Vozes gravadas no app (feminina, masculina, grave e fina) | Planejada |
| 6. Recursos extras | Repetir trecho com velocidade subindo, descobrir acordes ouvindo, treino de ouvido, gravar você tocando | Planejada |

### O que mudou na Fase 4
- **Três níveis** no curso, nas apostilas e nas músicas: **Iniciante** (9 unidades, 35 lições), **Intermediário** (6 unidades, 24 lições) e **Avançado** (6 unidades, 22 lições). A tela de boas-vindas pergunta o seu nível e começa no lugar certo.
- **A cifra por dentro** (fim do Iniciante): por que o A é o Lá (as letras dos monges medievais e as sílabas de Guido d’Arezzo), maior e menor, os números (7, 7M, 9, 6, 13, sus4), sustenido e bemol, diminuto, meio-diminuto e a barra do baixo. Toque em cada parte de **F#m7/E** e ouça o acorde sendo montado.
- **Intermediário:** pestana (F, Bm e um desenho que vira 12 acordes), intervalos, tríades e sétimas, samba e pagode com a banda, dedilhado p-i-m-a e valsa em 3 tempos, campo harmônico, graus e transposição, e um repertório.
- **Avançado:** escala maior e pentatônica com improviso em cima da banda, II–V–I, dominantes secundárias e diminuto de passagem, acordes da bossa nova (7M(9), m7(9), 7(13)), baixo que anda, técnicas (hammer-on, pull-off, slide, bend, vibrato, abafado), tirar música de ouvido e um repertório de bossa e samba.
- **Treino de ouvido** dentro das lições: maior ou menor, intervalos e graus (I, IV, V, vi).
- **11 apostilas novas** (20 no total, separadas por nível), cada uma com desenhos que tocam, analogia, pegadinha e teste.
- **23 músicas novas** (só os acordes, sem letra): 12 no Intermediário (Trem das Onze, Aquarela, Malandragem, Pais e Filhos…) e 11 no Avançado (Garota de Ipanema, Chega de Saudade, Wave, Flor de Lis, As Rosas Não Falam…).
- **Acordes fáceis por música:** nas músicas do Intermediário e do Avançado os acordes começam como na cifra; a escolha fica guardada em cada música.
- **Mais desenhos de acorde:** diminuto, meio-diminuto, sus4, 6, m6, 6(9), 7(9), m7(9), 7(13), 7(b9), 7(#9), 7(b13), 7(#11), 7(4/9), m7(11), m7M, aumentado, e acordes com baixo (C/E, G/B, D/F#, Bb/D, Dm/F…).

**Como o app monta um acorde com baixo (para estudar):** para C/E, ele pega o desenho do C e procura o Mi nas três cordas mais graves (até a casa 5), abafando as cordas de baixo. Depois confere se as cordas de cima ainda têm as notas que fazem o acorde (a quinta pode faltar), se a mão alcança (no máximo 4 casas de distância) e se bastam 4 dedos. Entre as opções que passam, fica com a de menor "custo": menos cordas abafadas, sem buraco no meio e sem esticar a mão. Arquivo: `acordes.js`, função `comBaixo`.

### O que mudou na Fase 3
- **Testado com gravações de verdade:** 8.438 batidas do [GuitarSet](https://zenodo.org/records/3371780) (violonistas reais, licença CC BY 4.0), avaliadas num robô do GitHub (branch `laboratorio`, arquivo `lab/avaliar.py`).
- **Jeito novo de ouvir as notas** (agora é o padrão):

| Situação | Antes | Agora |
|---|---|---|
| Violão afinado: aceita o acorde certo | 64% | **77%** |
| Violão um pouco desafinado (+35 cents): aceita o acorde certo | 36% | **72%** |
| Depois de "Ensinar o meu violão" | — | **79%** |
| Aceita um acorde errado | 4% | 5% |

- **Ensinar o meu violão** (Ajustes, ou no professor de cada acorde): você toca cada acorde 3 vezes e o app guarda como o *seu* violão soa. Se a batida não parecer o acorde pedido, ele pede para tocar de novo.
- **Basic Pitch (IA do Spotify):** o modelo não carregou no robô de testes e deixaria o app bem mais pesado. Como o método novo já resolveu a maior parte do problema, ficou de fora.

**Como o ouvido novo funciona (para estudar):** o som vira um espectro (FFT). Em vez de somar a energia de todas as frequências, o app procura só os **picos** (as notas que soam de verdade), acha a posição exata de cada pico entre duas faixas da FFT (interpolação por parábola) e usa a escala logarítmica (`log(1 + 60·força)`) para uma nota forte não esconder as outras. Antes de juntar os picos nas 12 notas, mede **quanto o violão está desafinado** (média circular dos desvios em cents, pesada pela força de cada pico) e desconta esse desvio. Por fim compara as 12 notas com o "molde" de cada acorde (semelhança do cosseno). Arquivos: `audio-detect.js` e `jogo.js`.

### O que mudou na Fase 2
- **Tocar junto**, na página da música, com 3 opções:
  - **Violão e batida:** o violão do app e a percussão.
  - **Violão, batida e banda:** com baixo e piano (sanfona no baião).
  - **Tudo: voz e instrumentos:** a gravação original, pelo vídeo oficial do YouTube ou por um MP3 seu.
- **Volume de cada parte** (violão do app, batida, baixo, piano/sanfona, gravação).
- **8 ritmos da banda**, escolhidos pelo ritmo da música: pop acústico, rock, balada, baião (zabumba, triângulo e sanfona), samba e pagode (surdo, pandeiro, tamborim/tantã), bossa nova (aro e baixo) e samba-rock.
- **Tom:** botões − e + mudam meio tom por vez, até 3 tons para cima ou para baixo, e o app mostra o nome do tom quando tem certeza (ex.: "Si maior, o tom da gravação").
- **Capotraste:** com "Tenho capotraste", o app testa as casas 0 a 7 e escolhe a que deixa os acordes mais fáceis, preferindo os desenhos que você já treinou.
- **MP3 seu:** fica guardado só no celular; depois de sincronizar, toca no tom e na velocidade que você escolher. O YouTube não deixa mudar o tom, então com o vídeo o jogo usa o tom original.
- **Repetir o trecho:** a parte escolhida toca 8 vezes seguidas.
- **Fone de ouvido:** sem fone, no modo No tempo, a banda toca baixinho para o microfone ouvir só você.

**Como a banda funciona (para estudar):** cada ritmo é uma receita escrita em semicolcheias (16 passos por compasso de 4 tempos). O baixo segue graus do acorde: **R** (fundamental), **5** (quinta), **8** (oitava) e **A** (aproximação: meio tom antes do próximo acorde). O piano monta as notas do acorde numa oitava só. Um agendador olha 0,35 tempo à frente e marca cada som no relógio de áudio, igual a um metrônomo.

**Como o tom muda num MP3 (para estudar):** primeiro um *phase vocoder* estica o tempo sem mudar o tom (FFT em pedaços de 46 ms, com a fase de cada frequência corrigida e "travada" nos picos do espectro); depois o áudio é lido mais rápido, o que volta ao tamanho original e sobe o tom. +2 semitons = esticar 12% e ler 12% mais rápido. Arquivo: `mp3.js`.

### O que mudou na Fase 1
- **Voltar nas lições:** um botão só. Volta uma tela; na primeira tela de uma lição, abre a lição anterior na última tela. Da tela "Lição concluída", volta para a última tela.
- **"Consegui" no jogo:** no modo Esperar por mim, se o microfone não reconhecer em 4 segundos, aparecem **Consegui** (você confirma que tocou certo) e **Pular**. O resultado mostra quantos você confirmou.
- **1 minuto de trocas com microfone:** bata uma vez em cada acorde; o app conta uma troca cada vez que o acorde muda (bater de novo no mesmo acorde não conta). O botão "Troquei" continua como reserva.
- **O som é o da imagem:** no professor de acordes, cada dedo toca **só a sua nota** (a pestana toca as notas que o dedo deitado cobre) e o acorde inteiro só soa no final. Nas apostilas e lições, as cordas, as notas do braço e a tablatura tocam exatamente o que mostram, acendendo em vermelho o que está soando.
- **Toca Aí 2 ao lado do Toca Aí:** nome, ID (`br.com.tocaai2.app`) e ícone próprios. Os dois apps podem ficar instalados juntos.

**Como o microfone conta as trocas (para estudar):** a cada batida, o app transforma o som em 12 números (a força de cada nota, o *cromagrama*) e compara com o "molde" dos dois acordes. Fica com o mais parecido, se for parecido o bastante. A troca é contada quando o acorde reconhecido muda em relação ao anterior: é uma pequena **máquina de estados** com um estado só, "qual acorde soou por último".

---

## 1. Instalar no celular

1. No **celular**, abra `https://github.com/mathperrut/toca-ai-2/releases/latest`.
2. Toque em **TocaAi2.apk**, depois em **Abrir**.
3. O Android avisa que o app não veio da Play Store: **Configurações → Permitir desta fonte** e volte para instalar.
4. Na primeira vez que o app pedir o **microfone**, toque em **Permitir** (sem isso o jogo não consegue conferir o que você toca).

O progresso do Toca Aí 2 começa do zero (é outro app). O Toca Aí continua instalado e funcionando.

**Atualizar:** baixe a versão nova em Releases e instale **por cima**. O progresso continua, porque toda versão usa a mesma assinatura (`android-build/debug.keystore`, chave de uso pessoal, senha `android`; para a Play Store seria preciso uma chave própria e secreta).

**Como o .apk nasce:** cada envio para a branch `main` faz o GitHub Actions copiar o app para um projeto Android, gerar ícones, compilar e publicar uma versão nova em **Releases** (versões 2.0.N). Para gerar no PC (precisa do Android Studio): `npm install`, `npm run android`, `npx cap open android`.

**Pelo navegador:** dá para abrir como site (`python -m http.server 8000` e `http://localhost:8000`), mas a **busca automática de cifras só funciona no .apk** (explicação na seção 3).

---

## 2. O que tem no app

### Jogo (inspirado no Yousician)
- **Seis cordas deitadas**, a 1ª (mais fina) em cima, como na tablatura. Em Ajustes dá para inverter.
- Os acordes chegam como **blocos coloridos**; cada batida é uma **barra com seta** (▼ para baixo, ▲ para cima); notas soltas são **bolinhas com o número da casa**.
- A **linha vermelha** é o "agora" e uma **bolinha vermelha quica** marcando o tempo.
- Em cima: o acorde da vez com o desenho, o próximo e o aviso **"em 3, 2, 1"** antes da troca.

| Modo | Para quem | Como funciona |
|---|---|---|
| **Esperar por mim** (padrão) | Quem está começando | A música **para em cada acorde** até o microfone ouvir o acorde certo |
| **No tempo** | Quem já troca os acordes | Pontua cada batida (Perfeito, Bom, Ok) e dá +50 quando o acorde soa certo |
| **Praticar** | Para ouvir e acompanhar | Sem pontos, com o violão do app tocando junto |

- **Velocidade:** 40%, 60% (padrão), 80% ou 100%, inclusive no meio do jogo (botão de pausa).
- **Resultado:** porcentagem, até 3 estrelas (45%, 70% e 90%), o acorde que mais deu trabalho e um botão para treiná-lo.

### Buscar qualquer música (no .apk)
1. Aba **Músicas** → digite o nome → **Montar jogo**.
2. O app baixa a **cifra simplificada do Cifra Club**, pega só os acordes, coloca **capotraste** se isso deixar os acordes mais fáceis, troca acordes difíceis por versões sem pestana e procura a **gravação oficial no YouTube**.
3. A música fica salva em **Minhas músicas**, pronta para jogar.

No navegador, o botão abre a busca do Cifra Club; você copia a cifra e cola em **Colar cifra**.

### Músicas para começar
| Música | Artista | Acordes | Capo |
|---|---|---|---|
| Pra Não Dizer Que Não Falei das Flores | Geraldo Vandré | Em D | 1 |
| Que País É Este | Legião Urbana | Em C D | — |
| Asa Branca | Luiz Gonzaga | G C D | — |
| Velha Infância | Tribalistas | Em Am D | 2 |
| O Sol | Vitor Kley | Em Am C D | 2 |
| Trem-Bala | Ana Vilela | A9 D9 E | 2 |
| Só os Loucos Sabem | Charlie Brown Jr. | G Em C D Am | — |
| Tempo Perdido | Legião Urbana | C Am7 Bm Em | — |
| Andar com Fé | Gilberto Gil | A E7 D | 3 |
| Anunciação | Alceu Valença | G Am C Em F | — |

Mais 8 do **Jorge Ben Jor** (Taj Mahal, Mas Que Nada, W/Brasil, País Tropical...) e 7 **melodias de domínio público** para treinar notas soltas.

### Curso, apostilas e vídeos
- **Curso em 3 níveis:** 21 unidades e 81 lições curtas (uma ideia por tela). No Iniciante, cada unidade termina numa música que usa só o que você aprendeu: Em → Em e D → Em, C e D → G e baião → Am e batida pop → A, E e tablatura → sétimas e Jorge Ben → a cifra. Depois vêm o Intermediário e o Avançado (veja a Fase 4).
- **Apostilas (20, por nível):** como o violão funciona, afinar, postura, ler diagrama e tablatura, a cifra por dentro, como os acordes se formam, ritmo e como estudar (Iniciante); notas no braço, ritmos brasileiros, intervalos e tríades, pestana, dedilhados, campo harmônico e transposição (Intermediário); escalas e pentatônica, harmonia, acordes da bossa nova, técnicas, tirar música de ouvido, samba e choro (Avançado). Cada uma tem analogias, "pegadinhas" e um teste.
- **Mini vídeos (10):** de 25 a 57 segundos, com narração e o som do violão: partes do violão, cordas, afinar, postura, diagrama, batida, tablatura, como jogar, samba e rotina de estudo.

### Som de violão gravado
- Duas coleções de **notas gravadas de violões reais**: **clássico (náilon)** e **acústico**, escolhidas em Ajustes.
- A batida é montada em tempo real: as cordas entram uma depois da outra, cada nota varia um pouco de força e afinação, a nota anterior da mesma corda é abafada e há um eco curto de sala.

### Afinador e metrônomo
Afinador corda por corda (marca cada corda afinada) e metrônomo com luzes.

---

## 3. Como funciona por dentro (para estudar)

**Microfone conferindo o acorde** (`audio-detect.js`, `jogo.js`)
1. Um *AudioWorklet* procura o **ataque** (o "estalo" da palhetada), não o volume, porque a batida anterior ainda está soando.
2. O som vira um **cromagrama**: 12 números, a força de cada nota (Dó, Dó#, Ré...).
3. O app monta o **molde** do acorde esperado a partir do desenho de verdade (cordas e casas, com os harmônicos de cada corda e o capotraste).
4. Compara os dois com a **similaridade de cosseno** (o "ângulo" entre dois vetores). Se o esperado for parecido o bastante e não perder para outro acorde da música, conta como certo. Se errar, o app diz com qual acorde soou ("Soou como Am").
5. Notas soltas usam o **método MPM** (o mesmo do afinador) para achar a frequência.
6. O atraso do microfone é medido sozinho durante o jogo (ou em Ajustes → Calibrar).

**Busca automática** (`cifras.js`)
- No .apk, o plugin `CapacitorHttp` faz o pedido pelo Android, sem a regra de **CORS** que impede um site de ler outro. É por isso que no navegador não funciona.
- A página da cifra é lida como HTML: cada acorde está num `<b>`; o app guarda **só os acordes**, nunca a letra.
- A **duração** de cada acorde é estimada pela distância até o próximo na linha (cifra não traz o tempo).
- **Capotraste inteligente:** testa capo de 0 a 7, transpõe os acordes e soma o "custo" de cada um (pestana custa caro, acorde aberto custa pouco). Fica com o menor total.

**Gravação do YouTube como relógio** (`youtube.js`): o vídeo é o "relógio-mestre". A cada quadro o jogo compara a posição dele com a do vídeo: diferença pequena, corrige 30% por quadro; diferença grande (o vídeo travou), pula junto. O app usa o player oficial e não baixa nem separa o áudio.

**Som** (`som.js`): para cada nota, pega a gravação mais próxima e muda a velocidade um pouquinho para acertar a afinação exata (assim o capotraste soa certo).

**Vídeos** (`videos/`): os quadros foram desenhados em HTML e fotografados com Playwright; a narração é uma voz sintética (Piper) e o violão vem das mesmas notas gravadas do app; o ffmpeg junta tudo.

---

## 4. A IA em Python (pasta `ia/`)

Projeto de estudo de **machine learning** (o jogo usa o método dos moldes, que aceita capotraste e qualquer acorde).

1. **Dados** (`sintetizador.py`): um violão sintético (Karplus-Strong) gera milhares de acordes com variações (afinação, corda abafada, ruído, sala). Isso é **aumento de dados**.
2. **Características** (`caracteristicas.py`): cada pedaço de áudio vira 24 números (cromagrama + cromagrama só dos graves).
3. **Modelo** (`treinar.py`): rede neural 24 → 96 → 33 (32 acordes + "nenhum").
4. **Resultado** em dados que o modelo nunca viu: **84,6%** (o método antigo de moldes fazia 63,3%).
5. **Exportação:** os pesos viram `modelo-acordes.json`, e o `ia.js` refaz as contas no celular.

```bash
cd ia
pip install -r requirements.txt
python treinar.py
```

**Desafio:** gravar acordes do seu violão, treinar a rede com eles e comparar com o método dos moldes do jogo.

---

## 5. Arquivos

| Arquivo | Papel |
|---|---|
| `index.html` | Estrutura das telas |
| `tema.css` | Visual (preto, branco e vermelho, fonte Jost), tema claro e escuro |
| `data.js` | Acordes, ritmos, curso, melodias e as músicas do catálogo |
| `acordes.js` | Nomes e desenhos de acordes, versões fáceis, sequências |
| `som.js` | Violão gravado, batidas, metrônomo, mixer (volume de cada parte) |
| `banda.js` | A banda: ritmos, baixo e teclado seguindo os acordes |
| `tom.js` | Mudar o tom, descobrir o tom da música, escolher o capotraste |
| `mp3.js` | MP3 seu: guardar, sincronizar, mudar tom e velocidade (phase vocoder) |
| `jogo.js` | O jogo: desenho das cordas, modos, pontuação, microfone |
| `cifras.js` | Busca e leitura de cifras, capotraste inteligente, YouTube |
| `aprender.js` | Curso, lições (com Voltar), professor de acordes, sons que acompanham as imagens, 1 minuto de trocas |
| `apostilas.js` | Apostilas, quizzes, mini vídeos e os desenhos que tocam (`ligarSons`) |
| `youtube.js`, `gravacao.js` | Player do YouTube, sincronia e tocar junto |
| `audio-detect.js`, `ia.js` | Microfone (ataque, cromagrama, afinador) e rede neural |
| `app.js` | Telas, progresso, ajustes, afinador, integração com o Android |
| `sw.js`, `manifest.webmanifest` | Funcionar offline e instalar como app |
| `sons/`, `fontes/`, `videos/`, `icones/`, `assets/` | Notas gravadas, fonte, mini vídeos, ícones e tela de abertura |

## 6. Limitações
- Use **fone de ouvido** no modo No tempo: sem ele o microfone também ouve o violão do app.
- Lugar barulhento atrapalha: ajuste a **Sensibilidade** em Ajustes.
- A duração dos acordes de músicas buscadas é estimada. Com a gravação sincronizada, o jogo fica bem mais fiel.
- A busca depende do formato das páginas do Cifra Club; se ele mudar, a busca pode parar e o app avisa (dá para colar a cifra).

## 7. Créditos e direitos
- **Sons:** violão da University of Iowa Electronic Music Studios e de *quartertone* (Freesound); baixo da Karoryfer Samples e harmônio de *donyaquick* (Freesound), reunidos pelo projeto [tonejs-instruments](https://github.com/nbrosowsky/tonejs-instruments), licença [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/). Percussão e piano da [Versilian Community Sample Library](https://github.com/sgossner/VCSL) (CC0). Detalhes em `sons/CREDITOS.txt`.
- **Fonte:** Jost (SIL Open Font License, `fontes/OFL-Jost.txt`).
- **Narração dos vídeos:** voz "faber" do [Piper](https://github.com/rhasspy/piper).
- **Músicas:** o app não traz letras nem gravações. Guarda só a sequência de acordes; as gravações tocam pelo player oficial do YouTube. As melodias inclusas são de domínio público.
