# Laboratório do Toca Aí 2

Experimentos que medem e melhoram o app. Rodam no GitHub Actions (`.github/workflows/lab.yml`) e guardam os resultados em `lab/saida/`.

## Avaliação do microfone (`avaliar.py`)
Mede quantas vezes o app reconhece o acorde certo em gravações reais de violão do **GuitarSet** (Xi et al., 2018; licença CC BY 4.0; https://zenodo.org/records/3371780). Os áudios não ficam neste repositório: são baixados a cada execução.

Métodos: **A** (o atual), **B** (cromagrama novo com correção de afinação), **C** (B + calibração com o violão de quem toca) e **D** (Basic Pitch, a IA de notas do Spotify).

## descobrir (Fase 6)
Avalia o **Descobrir acordes** (o app ouve e diz o acorde, entre 60, sem saber a música) nas 180 gravações de
acompanhamento do GuitarSet, com o mesmo código do app (cópia em `descobrir/app/`). Compara moldes com e sem
harmônicos, o peso do baixo, o desconto das tétrades e o "custo de trocar" do Viterbi. Resultado: `saida/descobrir.json`.
