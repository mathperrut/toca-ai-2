// Busca músicas novas para os níveis Intermediário e Avançado do Toca Aí 2.
// Para cada linha de musicas.txt: acha a música no Cifra Club, guarda SÓ os acordes
// (a letra é descartada pelo próprio leitor de cifras do app), o tom/capo, o BPM
// (songbpm.com) e o vídeo oficial que deixa tocar dentro de apps (oEmbed = 200).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import vm from 'node:vm';
import { DOMParser } from 'linkedom';
const espera = ms => new Promise(r => setTimeout(r, ms));
for (const f of ['data.js', 'acordes.js', 'cifras.js']) vm.runInThisContext(readFileSync('../app/' + f, 'utf8').replace(/^'use strict';/m, ''), { filename: f });
let ultimo = 0;
const get = async (url, ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36') => {
  const dt = Date.now() - ultimo; if (dt < 900) await espera(900 - dt); ultimo = Date.now();
  try { const r = await fetch(url, { headers: { 'User-Agent': ua, 'Accept-Language': 'pt-BR,pt;q=0.9' } }); return { status: r.status, texto: await r.text(), url: r.url }; }
  catch (e) { return { status: 0, texto: '', url }; }
};
Cifras.configurar({ DOMParser, http: (url, { ua }) => get(url, ua) });
const semAcento = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const lista = readFileSync('musicas.txt', 'utf8').split('\n').map(s => s.trim()).filter(s => s && !s.startsWith('#')).map(l => l.split('|').map(s => s.trim()));
const saida = [];
mkdirSync('saida', { recursive: true });
for (const [nivel, busca, artistaEsperado, buscaYt] of lista) {
  const item = { nivel, busca };
  try {
    const achados = await Cifras.procurar(busca);
    const a = achados.find(x => semAcento(x.artista).includes(semAcento(artistaEsperado))) || achados[0];
    if (!a) throw new Error('não achei');
    Object.assign(item, { slugArtista: a.slugArtista, slugMusica: a.slugMusica });
    const orig = await Cifras.baixar(a.slugArtista, a.slugMusica, { simplificada: false });
    Object.assign(item, { titulo: a.titulo, artista: a.artista, genero: orig.genero, tom: orig.tom, formaTom: orig.formaTom, capo: orig.capo, secoes: orig.secoes });
    try {
      const simp = await Cifras.baixar(a.slugArtista, a.slugMusica, { simplificada: true });
      if (simp.simplificada) Object.assign(item, { secoesSimp: simp.secoes, capoSimp: simp.capo, tomSimp: simp.tom });
    } catch (e) {}
  } catch (e) { item.erro = String(e.message || e); }
  if (!item.erro) {
    const bp = await get(`https://songbpm.com/@${item.slugArtista}/${item.slugMusica}`);
    const mb = bp.texto.match(/(?:tempo of|Tempo)\D{0,40}?(\d{2,3})\s*BPM/i) || bp.texto.match(/(\d{2,3})\s*BPM/);
    item.bpm = mb ? +mb[1] : null;
    const yt = await Cifras.youtube(item.titulo, item.artista).catch(() => []);
    const cands = yt.slice(0, 4);
    for (const v of cands) {
      const o = await get('https://www.youtube.com/oembed?format=json&url=' + encodeURIComponent('https://www.youtube.com/watch?v=' + v.id));
      v.embed = o.status;
    }
    item.youtube = cands.map(v => ({ id: v.id, titulo: v.titulo, canal: v.canal, pontos: v.pontos, embed: v.embed, duracao: v.duracao }));
  }
  saida.push(item);
  const acs = item.secoes ? [...new Set(item.secoes.flatMap(s => lerSequencia(s.seq).map(x => x.acorde)))] : [];
  console.log(`\n# [${nivel}] ${item.titulo || busca} / ${item.artista || ''} ${item.erro ? 'ERRO ' + item.erro : ''}`);
  if (!item.erro) {
    console.log(`  ${item.slugArtista}/${item.slugMusica} | tom ${item.tom}${item.formaTom ? ' (forma ' + item.formaTom + ')' : ''} capo ${item.capo} | gênero ${item.genero} | bpm ${item.bpm} | seções ${item.secoes.length} | simplificada: ${!!item.secoesSimp}`);
    console.log(`  acordes: ${acs.join(' ')}`);
    (item.youtube || []).forEach(v => console.log(`  yt ${v.id} embed=${v.embed} [${v.pontos}] ${v.titulo} / ${v.canal} ${v.duracao}`));
  }
}
writeFileSync('saida/musicas.json', JSON.stringify(saida, null, 1));
console.log('\nFIM');
