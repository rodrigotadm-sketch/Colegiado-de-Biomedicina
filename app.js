
(async()=>{
const root=document.getElementById('app'), $=x=>document.getElementById(x);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const D=await fetch('colegiado.json',{cache:'no-store'}).then(r=>r.json());

root.innerHTML=`<div class="hero"><small>UFPR · CURSO DE BIOMEDICINA</small><h1>${esc(D.title)}</h1></div>
<div class="about">${esc(D.description)}</div>
<div class="controls"><input id="q" placeholder="Buscar nome, departamento, unidade ou e-mail">
<select id="f"><option value="todos">Todos</option><option value="titular">Titulares</option><option value="suplente">Suplentes</option><option value="coord">Coordenação</option><option value="disc">Discentes</option></select></div>
<section id="coordS"><h2>Coordenação</h2><div id="coord" class="grid"></div></section>
<section id="depS"><h2>Representantes por departamento</h2><div id="deps" class="grid"></div></section>
<section id="discS"><h2>Representação discente</h2><div id="disc" class="grid"></div></section>`;

const emails=e=>e?.length?`<div class="emails">${e.map(x=>`<a href="mailto:${esc(x)}">${esc(x)}</a>`).join('')}</div>`:`<div class="empty">E-mail não informado</div>`;
const extra=m=>`<div class="meta">
${m.departamento_unidade?`<div><b>Departamento/Unidade:</b> ${esc(m.departamento_unidade)}</div>`:''}
${m.mandato?`<div><b>Mandato:</b> ${esc(m.mandato)}</div>`:''}
${m.situacao?`<div><b>Situação:</b> ${esc(m.situacao)}</div>`:''}
${m.lattes?`<div><a class="lattes" href="${esc(m.lattes)}" target="_blank" rel="noopener">Currículo Lattes</a></div>`:''}
</div>`;
const card=m=>`<article class="card"><span class="badge ${m.situacao==='Suplente'?'suplente':''}">${esc(m.cargo)}</span><div class="name">${m.nome?esc(m.nome):'<span class="empty">Representante não informado</span>'}</div>${extra(m)}${emails(m.emails)}</article>`;

function render(){
 const q=$('q').value.toLowerCase().trim(), f=$('f').value;
 const roleOk=m=>f==='todos'||(f==='titular'&&m.situacao==='Titular')||(f==='suplente'&&m.situacao==='Suplente');

 const c=D.coordenacao.filter(m=>(f==='todos'||f==='coord')&&(!q||JSON.stringify(m).toLowerCase().includes(q)));
 $('coord').innerHTML=c.map(card).join(''); $('coordS').style.display=c.length?'block':'none';

 let deps=[];
 if(f!=='coord'&&f!=='disc') D.departamentos.forEach(d=>{
   const ms=d.membros.map(m=>({...m,departamento_unidade:[d.departamento,d.unidade].filter(Boolean).join(' · ')}))
    .filter(m=>roleOk(m)&&(!q||JSON.stringify(m).toLowerCase().includes(q)));
   if(ms.length) deps.push(`<article class="dept"><h3>${esc(d.departamento)}</h3>${ms.map(m=>`<div class="member">${card(m).replace('<article class="card">','').replace('</article>','')}</div>`).join('')}</article>`);
 });
 $('deps').innerHTML=deps.join(''); $('depS').style.display=deps.length?'block':'none';

 const ds=D.discentes.filter(m=>(f==='todos'||f==='disc')&&(!q||JSON.stringify(m).toLowerCase().includes(q)));
 $('disc').innerHTML=ds.map(card).join(''); $('discS').style.display=ds.length?'block':'none';
}
$('q').addEventListener('input',render);$('f').addEventListener('change',render);render();
})();
