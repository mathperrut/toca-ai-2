#!/usr/bin/env python3
"""Laboratório do Toca Aí 2: quão bem o microfone reconhece acordes de violão DE VERDADE?

Dados: GuitarSet (Xi, Bittner, Pauwels, Ye, Bello, 2018), licença CC BY 4.0.
https://zenodo.org/records/3371780  — 6 violonistas, gravações com microfone,
e anotação de cada nota (com o instante exato) e do acorde tocado.

Métodos comparados (todos decidem com a mesma regra do app):
  A  o cromagrama atual do app (soma da força de cada frequência na nota mais perto)
  B  cromagrama novo: picos do espectro, compressão logarítmica e correção de afinação
  C  B + calibração pessoal (o "molde" de cada acorde aprende com o violão de quem toca)
  D  Basic Pitch (IA de notas do Spotify, Apache-2.0)
Condições: violão afinado e violão desafinado em +35 cents (como um iniciante esquecendo de afinar).
"""
import glob, json, math, os, sys, time
import numpy as np
import soundfile as sf
from scipy.signal import resample_poly

DADOS, SAIDA = sys.argv[1], sys.argv[2]
os.makedirs(SAIDA, exist_ok=True)
AQUI = os.path.dirname(os.path.abspath(__file__))
MODELOS = json.load(open(os.path.join(AQUI, 'modelos.json')))
HARM = [(0, 1), (12, .5), (19, .33), (24, .25), (28, .2), (31, .16)]
PC = {'C': 0, 'B#': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4, 'Fb': 4, 'E#': 5, 'F': 5, 'F#': 6, 'Gb': 6,
      'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11, 'Cb': 11}
NOMES = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']
INTERVALOS = {'': [0, 4, 7], 'm': [0, 3, 7], '7': [0, 4, 7, 10], '7M': [0, 4, 7, 11], 'm7': [0, 3, 7, 10], 'm7(b5)': [0, 3, 6, 10],
              '°': [0, 3, 6, 9], 'sus4': [0, 5, 7], '+': [0, 4, 8], '6': [0, 4, 7, 9], 'm6': [0, 3, 7, 9]}
HARTE = {'maj': '', 'min': 'm', '7': '7', 'maj7': '7M', 'min7': 'm7', 'hdim7': 'm7(b5)', 'dim': '°', 'dim7': '°', 'sus4': 'sus4',
         'aug': '+', 'maj6': '6', 'min6': 'm6', '9': '7', 'min9': 'm7', 'maj9': '7M', 'sus2': ''}
log = open(os.path.join(SAIDA, 'log.txt'), 'w')
def p(*a):
    s = ' '.join(str(x) for x in a); print(s); log.write(s + '\n'); log.flush()

def nome_app(rotulo):
    """'Eb:min7(9)/5' -> 'Ebm7' (o nome no padrão do app)"""
    if rotulo in ('N', 'X') or not rotulo: return None
    raiz, _, q = rotulo.partition(':')
    q = q.split('/')[0]
    q = q.split('(')[0] if q not in HARTE else q
    if raiz not in PC: return None
    q = HARTE.get(q if q else 'maj')
    if q is None: return None
    return NOMES[PC[raiz]] + q

def tons(nome):
    for q in sorted(INTERVALOS, key=len, reverse=True):
        for r in NOMES:
            if nome == r + q: return PC[r], INTERVALOS[q]
    return None

def normal(v):
    v = np.asarray(v, float); v = v - v.mean(); n = np.linalg.norm(v)
    return v / n if n else v

_cache_mod = {}
def molde(nome, tipo):
    """tipo 'app': desenho do violão do app + harmônicos (como hoje); 'notas': só as notas do acorde (para o Basic Pitch)"""
    k = (nome, tipo)
    if k in _cache_mod: return _cache_mod[k]
    t = tons(nome); v = np.zeros(12)
    if tipo == 'app':
        midis = MODELOS.get(nome) or [48 + t[0] + i for i in t[1]]
        for n in midis:
            for st, w in HARM: v[(n + st) % 12] += w
    else:
        for i in t[1]: v[(t[0] + i) % 12] += 1
    _cache_mod[k] = normal(v)
    return _cache_mod[k]

# ---------- espectro como o AnalyserNode do navegador ----------
N = 8192
BLACK = np.blackman(N)
HANN = np.hanning(N)
def quadro(x, sr, t, janela):
    i = int(t * sr)
    seg = x[max(0, i - N):i]
    if len(seg) < N: seg = np.pad(seg, (N - len(seg), 0))
    return np.abs(np.fft.rfft(seg * janela))

def croma_A(x, sr, tempos):
    """o método atual: cada faixa de frequência (75 a 1100 Hz) soma na nota mais perto"""
    c = np.zeros(12); hz = sr / N
    i0, i1 = int(75 / hz), int(math.ceil(1100 / hz))
    f = np.arange(i0, i1) * hz
    pcs = np.round(69 + 12 * np.log2(f / 440)).astype(int) % 12
    for t in tempos:
        mag = quadro(x, sr, t, BLACK)[i0:i1]
        np.add.at(c, pcs, mag)
    return c

def croma_B(x, sr, tempos, afinacao=None):
    """o método novo: só os PICOS do espectro (as notas de verdade), força comprimida (log)
    e correção de afinação (se o violão está todo um pouco agudo ou grave)"""
    hz = sr / N
    i0, i1 = int(70 / hz), int(2000 / hz)
    picos = []
    for t in tempos:
        mag = quadro(x, sr, t, HANN)
        L = np.log1p(60 * mag / (mag[i0:i1].max() + 1e-12))
        seg = L[i0:i1]
        lim = 0.18 * seg.max()
        k = np.where((seg[1:-1] > seg[:-2]) & (seg[1:-1] >= seg[2:]) & (seg[1:-1] > lim))[0] + 1
        for j in k:
            a, b, cc = seg[j - 1], seg[j], seg[j + 1]
            d = 0.5 * (a - cc) / (a - 2 * b + cc) if (a - 2 * b + cc) != 0 else 0
            f = (i0 + j + d) * hz
            picos.append((69 + 12 * math.log2(f / 440), b))
    if not picos: return np.zeros(12), 0.0
    m = np.array([q[0] for q in picos]); w = np.array([q[1] for q in picos])
    if afinacao is None:
        desv = m - np.round(m)
        afinacao = math.atan2((w * np.sin(2 * np.pi * desv)).sum(), (w * np.cos(2 * np.pi * desv)).sum()) / (2 * np.pi)
    m = m - afinacao
    dev = np.abs(m - np.round(m))
    c = np.zeros(12)
    np.add.at(c, np.round(m).astype(int) % 12, w * np.clip(1 - 2 * dev, 0, 1))
    return c, afinacao

def avaliar(cr, esperado, outros, moldes, limiar=0.52, folga=0.04):
    """a regra do app: parece o esperado (>= limiar) e não perde para outro acorde da música"""
    c = normal(cr)
    s_esp = float(c @ moldes(esperado))
    s_out = max([float(c @ moldes(o)) for o in outros if o != esperado] or [-1])
    return s_esp, s_out, (s_esp >= limiar and s_esp >= s_out - folga)

# ---------- dados ----------
def ler_jams(caminho):
    j = json.load(open(caminho))
    notas = []
    acordes = None
    cands = [a for a in j['annotations'] if a['namespace'] == 'chord']
    for a in cands:
        meta = json.dumps(a.get('annotation_metadata', {})).lower() + json.dumps(a.get('sandbox', {})).lower()
        if 'perform' in meta: acordes = a
    if acordes is None and cands: acordes = cands[-1]
    for a in j['annotations']:
        if a['namespace'] == 'note_midi':
            for d in a['data']: notas.append((d['time'], d['value']))
    segs = [(d['time'], d['time'] + d['duration'], d['value']) for d in (acordes['data'] if acordes else [])]
    return sorted(notas), segs, [json.dumps(a.get('annotation_metadata', {}))[:160] for a in cands]

def batidas(notas, janela=0.06, minimo=3):
    """agrupa notas que começam juntas (uma batida no violão = várias cordas em ~30 ms)"""
    out, grupo = [], []
    for t, m in notas:
        if grupo and t - grupo[0][0] > janela:
            if len(grupo) >= minimo: out.append(grupo[0][0])
            grupo = []
        grupo.append((t, m))
    if len(grupo) >= minimo: out.append(grupo[0][0])
    return out

def main():
    jams = sorted(glob.glob(os.path.join(DADOS, 'anot', '**', '*_comp.jams'), recursive=True))
    p('arquivos de anotação (comp):', len(jams))
    if jams: p('metadados dos acordes (1º arquivo):', ler_jams(jams[0])[2])
    audio = {os.path.basename(f).replace('_mic.wav', ''): f for f in glob.glob(os.path.join(DADOS, 'mic', '**', '*_mic.wav'), recursive=True)}
    p('áudios (mic):', len(audio))
    amostras = []   # cada batida: dados para todos os métodos
    t_ini = time.time()
    for jf in jams:
        base = os.path.basename(jf).replace('.jams', '')
        if base not in audio: continue
        x, sr = sf.read(audio[base])
        if x.ndim > 1: x = x.mean(1)
        notas, segs, _ = ler_jams(jf)
        nomes_seg = [(a, b, nome_app(r)) for a, b, r in segs]
        acordes_musica = sorted({n for _, _, n in nomes_seg if n})
        if len(acordes_musica) < 2: continue
        # versão desafinada: +35 cents (lê o áudio um pouco mais rápido)
        fator = 2 ** (35 / 1200)
        up, down = 10000, int(round(10000 * fator))
        xd = resample_poly(x, up, down)
        for t in batidas(notas):
            seg = next((s for s in nomes_seg if s[0] <= t + 0.02 < s[1]), None)
            if not seg or not seg[2] or t + 0.3 > seg[1] + 0.25: continue
            tempos = [t + 0.12, t + 0.165, t + 0.21]
            tempos_d = [q / fator for q in tempos]
            cA = croma_A(x, sr, tempos); cB, afin = croma_B(x, sr, tempos)
            cAd = croma_A(xd, sr, tempos_d); cBd, afin_d = croma_B(xd, sr, tempos_d)
            amostras.append({'arq': base, 'jogador': base[:2], 't': t, 'acorde': seg[2], 'musica': acordes_musica,
                             'A': cA, 'B': cB, 'Ad': cAd, 'Bd': cBd, 'afin': afin, 'afin_d': afin_d})
    p(f'batidas analisadas: {len(amostras)} em {time.time() - t_ini:.0f} s')
    if not amostras: return

    def iguais(a, b): return tons(a) and tons(b) and {(tons(a)[0] + i) % 12 for i in tons(a)[1]} == {(tons(b)[0] + i) % 12 for i in tons(b)[1]}

    def medir(chave, moldes, limiar=0.52, folga=0.04):
        acertos = aceitos = testes_falsos = falsos = 0
        for a in amostras:
            c = a[chave]
            outros = [o for o in a['musica'] if not iguais(o, a['acorde'])]
            if not outros: continue
            # 1) identificar: o acorde da música mais parecido é o certo?
            sims = {o: float(normal(c) @ moldes(o)) for o in a['musica']}
            melhor = max(sims, key=sims.get)
            acertos += iguais(melhor, a['acorde'])
            # 2) o jogo espera o acorde certo: aceita?
            aceitos += avaliar(c, a['acorde'], a['musica'], moldes, limiar, folga)[2]
            # 3) o jogo espera OUTRO acorde da música: aceita por engano?
            for o in outros:
                testes_falsos += 1
                falsos += avaliar(c, o, a['musica'], moldes, limiar, folga)[2]
        n = sum(1 for a in amostras if any(not iguais(o, a['acorde']) for o in a['musica']))
        return {'identifica': acertos / n, 'aceita_certo': aceitos / n, 'aceita_errado': falsos / max(1, testes_falsos), 'n': n}

    def melhor_limiar(chave, moldes):
        """procura o limiar que aceita mais acordes certos com no máximo 5% de aceites errados"""
        melhor = None
        for lim in np.arange(0.2, 0.86, 0.02):
            for folga in (0.0, 0.04, 0.08):
                r = medir(chave, moldes, lim, folga)
                if r['aceita_errado'] <= 0.05 and (not melhor or r['aceita_certo'] > melhor[2]['aceita_certo']):
                    melhor = (round(float(lim), 2), folga, r)
        return melhor

    mApp = lambda n: molde(n, 'app')
    resultados = {}
    for nome, chave in [('A (atual) afinado', 'A'), ('B (novo) afinado', 'B'), ('A (atual) desafinado +35c', 'Ad'), ('B (novo) desafinado +35c', 'Bd')]:
        r = medir(chave, mApp); ml = melhor_limiar(chave, mApp)
        resultados[nome] = {'regra_do_app': r, 'melhor_limiar': {'limiar': ml[0], 'folga': ml[1], **ml[2]} if ml else None}
        p(nome, json.dumps(resultados[nome]))

    # C: calibração pessoal (para cada violonista, o molde aprende com as OUTRAS gravações dele)
    perfis = {}
    for a in amostras:
        perfis.setdefault((a['jogador'], a['acorde']), []).append((a['arq'], normal(a['B'])))
    def moldes_calibrados(amostra_atual):
        def f(nome):
            vs = [v for arq, v in perfis.get((amostra_atual['jogador'], nome), []) if arq != amostra_atual['arq']][:6]
            base = molde(nome, 'app')
            return normal(0.5 * base + 0.5 * normal(np.mean(vs, 0))) if len(vs) >= 2 else base
        return f
    def medir_C(limiar=0.52, folga=0.04):
        acertos = aceitos = tf = falsos = n = 0
        for a in amostras:
            outros = [o for o in a['musica'] if not iguais(o, a['acorde'])]
            if not outros: continue
            n += 1; mol = moldes_calibrados(a); c = normal(a['B'])
            sims = {o: float(c @ mol(o)) for o in a['musica']}
            acertos += iguais(max(sims, key=sims.get), a['acorde'])
            aceitos += avaliar(a['B'], a['acorde'], a['musica'], mol, limiar, folga)[2]
            for o in outros:
                tf += 1; falsos += avaliar(a['B'], o, a['musica'], mol, limiar, folga)[2]
        return {'identifica': acertos / n, 'aceita_certo': aceitos / n, 'aceita_errado': falsos / max(1, tf), 'n': n}
    rc = medir_C()
    best = None
    for lim in np.arange(0.2, 0.86, 0.02):
        for folga in (0.0, 0.04, 0.08):
            r = medir_C(lim, folga)
            if r['aceita_errado'] <= 0.05 and (not best or r['aceita_certo'] > best[2]['aceita_certo']): best = (round(float(lim), 2), folga, r)
    resultados['C (novo + calibração) afinado'] = {'regra_do_app': rc, 'melhor_limiar': {'limiar': best[0], 'folga': best[1], **best[2]} if best else None}
    p('C', json.dumps(resultados['C (novo + calibração) afinado']))
    afs = [a['afin'] * 100 for a in amostras]; afd = [a['afin_d'] * 100 for a in amostras]
    resultados['afinacao_medida_cents'] = {'afinado_mediana': float(np.median(afs)), 'desafinado_mediana': float(np.median(afd))}
    p('afinação medida (cents):', resultados['afinacao_medida_cents'])

    # D: Basic Pitch (IA de notas do Spotify)
    try:
        from basic_pitch.inference import predict
        from basic_pitch import ICASSP_2022_MODEL_PATH
        fps = 22050 / 256
        por_arq = {}
        t0 = time.time(); seg_audio = 0
        for arq in sorted({a['arq'] for a in amostras}):
            saida, _, _ = predict(audio[arq], ICASSP_2022_MODEL_PATH)
            por_arq[arq] = saida['note']
            seg_audio += len(saida['note']) / fps
        tempo_bp = time.time() - t0
        for a in amostras:
            nota = por_arq[a['arq']]
            i0, i1 = int((a['t'] + 0.03) * fps), int((a['t'] + 0.25) * fps) + 1
            act = nota[i0:i1].mean(0)
            c = np.zeros(12)
            np.add.at(c, (np.arange(len(act)) + 21) % 12, act)
            a['D'] = c
        mNotas = lambda n: molde(n, 'notas')
        r = medir('D', mNotas); ml = melhor_limiar('D', mNotas)
        resultados['D (Basic Pitch) afinado'] = {'regra_do_app': r, 'melhor_limiar': {'limiar': ml[0], 'folga': ml[1], **ml[2]} if ml else None,
                                                  'segundos_de_processamento_por_segundo_de_audio_no_servidor': tempo_bp / max(1, seg_audio)}
        p('D', json.dumps(resultados['D (Basic Pitch) afinado']))
    except Exception as e:
        resultados['D (Basic Pitch) afinado'] = {'erro': repr(e)[:300]}
        p('Basic Pitch falhou:', repr(e)[:300])

    json.dump(resultados, open(os.path.join(SAIDA, 'resultados.json'), 'w'), indent=1, ensure_ascii=False)
    p('fim')

main()
