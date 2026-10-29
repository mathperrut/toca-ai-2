# Narração dos mini vídeos do Toca Aí 2 com o Kokoro (modelo de voz Apache 2.0), em 4 vozes.
# Para cada voz: uma gravação por cena de cada vídeo + uma amostra para os Ajustes.
# Saída: saida/vozes/<voz>/<video>-<cena>.opus, saida/vozes/<voz>/amostra.opus e saida/vozes/info.json
import json, os, subprocess, urllib.request
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro

BASE = 'https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/'
for f in ('kokoro-v1.0.onnx', 'voices-v1.0.bin'):
    if not os.path.exists(f):
        urllib.request.urlretrieve(BASE + f, f)
k = Kokoro('kokoro-v1.0.onnx', 'voices-v1.0.bin')
print('vozes em português:', [v for v in k.get_voices() if v[:2] in ('pf', 'pm')])

ROT = json.load(open('roteiros.json', encoding='utf-8'))
AMOSTRA = 'Olá! Eu vou ser a sua voz nas aulas do Toca Aí. Vamos tocar?'
# nome: (voz do Kokoro, velocidade, altura alvo em Hz: muda o tom sem mudar o timbre)
VOZES = {
    'feminina': ('pf_dora', 1.0, None),
    'masculina': ('pm_alex', 1.0, None),
    'grave': ('pm_santa', 0.95, 88.0),
    'fina': ('pf_dora', 1.04, 250.0),
}

def f0_mediana(x, sr):
    """Altura média da voz (autocorrelação em janelas de 40 ms, só nos trechos com voz)."""
    n = int(0.04 * sr); passo = n // 2
    lmin, lmax = int(sr / 400), int(sr / 60)
    energia = np.sqrt(np.mean(x ** 2)) + 1e-9
    f0s = []
    for i in range(0, len(x) - n, passo):
        q = x[i:i + n] * np.hanning(n)
        if np.sqrt(np.mean(q ** 2)) < energia * 0.5:
            continue
        ac = np.correlate(q, q, 'full')[n - 1:]
        ac /= ac[0] + 1e-9
        lag = lmin + int(np.argmax(ac[lmin:lmax]))
        if ac[lag] > 0.55:
            f0s.append(sr / lag)
    return float(np.median(f0s)) if f0s else None

def gerar(texto, voz, vel):
    x, sr = k.create(texto, voice=voz, speed=vel, lang='pt-br')
    return np.asarray(x, dtype=np.float32), sr

def salvar(x, sr, destino, razao=None):
    tmp = destino + '.wav'
    sf.write(tmp, x, sr)
    filtro = ['-af', f'rubberband=pitch={razao:.4f}:formant=preserved'] if razao and abs(razao - 1) > 0.01 else []
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, *filtro, '-ac', '1', '-c:a', 'libopus', '-b:a', '64k', destino], check=True)
    os.remove(tmp)

info = {'modelo': 'Kokoro-82M v1.0 (Apache 2.0), kokoro-onnx', 'vozes': {}}
for nome, (voz, vel, alvo) in VOZES.items():
    pasta = f'saida/vozes/{nome}'
    os.makedirs(pasta, exist_ok=True)
    # mede a altura da voz numa frase longa e decide o ajuste
    x, sr = gerar('Na mão que aperta as cordas, cada dedo tem um número. O polegar fica atrás do braço.', voz, vel)
    f0 = f0_mediana(x, sr)
    razao = None
    if alvo and f0:
        razao = float(np.clip(alvo / f0, 2 ** (-4 / 12), 2 ** (4 / 12)))
    info['vozes'][nome] = {'kokoro': voz, 'velocidade': vel, 'altura_original_hz': f0, 'ajuste_tom': razao}
    print(nome, voz, 'altura', f0, 'ajuste', razao, flush=True)
    x, sr = gerar(AMOSTRA, voz, vel)
    salvar(x, sr, f'{pasta}/amostra.opus', razao)
    for vid, cenas in ROT.items():
        for i, c in enumerate(cenas):
            x, sr = gerar(c['fala'], voz, vel)
            salvar(x, sr, f'{pasta}/{vid}-{i}.opus', razao)
            info['vozes'][nome][f'{vid}-{i}'] = round(len(x) / sr / (1.0), 3)
    # confere a altura depois do ajuste
    if razao:
        y, sry = sf.read(f'{pasta}/amostra.opus') if False else (None, None)
json.dump(info, open('saida/vozes/info.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('FIM')
