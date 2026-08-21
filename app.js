
(async()=>{
const $=x=>document.getElementById(x), root=$('app');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const D=await fetch('colegiado.json',{cache:'no-store'}).then(r=>r.json());
root.innerHTML=`<div class="hero"><small>UFPR · CURSO DE BIOMEDICINA</small><h1>${esc(D.title)}</h1></div><div class="about">${esc(D.description)}</div><div class="controls"><input id="q" placeholder="Buscar nome, departamento ou e-mail"><select id="f"><option value="todos">Todos</option><option value="titular">Titulares</option><option value="suplente">Suplentes</option><option value="coord">Coordenação</option><option value="disc">Discentes</option></select></div><section id="coordS"><h2>Coordenação</h2><div id="coord" class="grid"></div></section><section id="depS"><h2>Representantes por departamento</h2><div id="deps" class="grid"></div></section><section id="discS"><h2>Representação discente</h2><div id="disc" class="grid"></div></section>`;
const emails=e=>e?.length?`<div class="emails">${e.map(x=>`<a href="mailto:${esc(x)}">${esc(x)}</a>`).join('')}</div>`:`<div class="empty">E-mail não informado</div>`;
const card=(c,n,e)=>`<article class="card"><span class="badge ${c==='Suplente'?'suplente':''}">${esc(c)}</span><div class="name">${n?esc(n):'<span class="empty">Representante não informado</span>'}</div>${emails(e)}</article>`;
function render(){
 let q=$('q').value.toLowerCase().trim(),f=$('f').value;
 let ok=(cargo)=>f==='todos'||(f==='titular'&&cargo==='Titular')||(f==='suplente'&&cargo==='Suplente');
 let c=D.coordenacao.filter(x=>(f==='todos'||f==='coord')&&(!q||[x.cargo,x.nome,...x.emails].join(' ').toLowerCase().includes(q)));
 $('coord').innerHTML=c.map(x=>card(x.cargo,x.nome,x.emails)).join('');$('coordS').style.display=c.length?'block':'none';
 let deps=[];
 if(f!=='coord'&&f!=='disc') for(const [dep,ms] of D.departamentos){let fm=ms.filter(x=>ok(x[0])&&(!q||[dep,...x].flat().join(' ').toLowerCase().includes(q)));if(fm.length)deps.push(`<article class="dept"><h3>${esc(dep)}</h3>${fm.map(x=>`<div class="member"><span class="badge ${x[0]==='Suplente'?'suplente':''}">${esc(x[0])}</span><div class="name">${x[1]?esc(x[1]):'<span class="empty">Representante não informado</span>'}</div>${emails(x[2])}</div>`).join('')}</article>`)}
 $('deps').innerHTML=deps.join('');$('depS').style.display=deps.length?'block':'none';
 let ds=D.discentes.filter(x=>(f==='todos'||f==='disc')&&(!q||[x.cargo,x.nome,...x.emails].join(' ').toLowerCase().includes(q)));
 $('disc').innerHTML=ds.map(x=>card(x.cargo,x.nome,x.emails)).join('');$('discS').style.display=ds.length?'block':'none';
}
$('q').addEventListener('input',render);$('f').addEventListener('change',render);render();
})();
