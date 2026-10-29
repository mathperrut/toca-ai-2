# Confere se as 4 vozes da narração dão para entender: transcreve cada fala com o Whisper (faster-whisper, modelo small)
# e compara com o texto do roteiro. Saída: saida/vozes/ouvir.json (taxa de erro por voz e as falas mais difíceis).
import json, re, unicodedata
from faster_whisper import WhisperModel

ROT = json.load(open('roteiros.json', encoding='utf-8'))
VOZES = ['feminina', 'masculina', 'grave', 'fina']
NUM = {'0': 'zero', '1': 'um', '2': 'dois', '3': 'três', '4': 'quatro', '5': 'cinco', '6': 'seis', '7': 'sete', '8': 'oito', '9': 'nove', '10': 'dez', '12': 'doze'}

def palavras(t):
    t = unicodedata.normalize('NFC', t.lower())
    t = re.sub(r"[^\w\s]", ' ', t)
    return [NUM.get(p, p) for p in t.split()]

def distancia(a, b):
    d = list(range(len(b) + 1))
    for i in range(1, len(a) + 1):
        ant, d[0] = d[0], i
        for j in range(1, len(b) + 1):
            ant, d[j] = d[j], min(d[j] + 1, d[j - 1] + 1, ant + (a[i - 1] != b[j - 1]))
    return d[len(b)]

m = WhisperModel('small', device='cpu', compute_type='int8')
res = {}
for voz in VOZES:
    erros = total = cerros = ctotal = 0
    falas = []
    for vid, cenas in ROT.items():
        for i, c in enumerate(cenas):
            segs, _ = m.transcribe(f'saida/vozes/{voz}/{vid}-{i}.opus', language='pt', beam_size=5)
            ouvido = ' '.join(s.text for s in segs).strip()
            a, b = palavras(c['fala']), palavras(ouvido)
            e = distancia(a, b); erros += e; total += len(a)
            ca, cb = ''.join(a), ''.join(b)
            ce = distancia(list(ca), list(cb)); cerros += ce; ctotal += len(ca)
            falas.append({'id': f'{vid}-{i}', 'erro': round(e / max(1, len(a)), 3), 'roteiro': c['fala'], 'ouvido': ouvido})
    falas.sort(key=lambda f: -f['erro'])
    res[voz] = {'erro_palavras': round(erros / total, 4), 'erro_letras': round(cerros / ctotal, 4), 'piores': falas[:8]}
    print(voz, res[voz]['erro_palavras'], res[voz]['erro_letras'], flush=True)
json.dump(res, open('saida/vozes/ouvir.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('FIM')
