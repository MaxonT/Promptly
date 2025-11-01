// LBPO-Studio v0.5 front controller
// Params (replace or generate from a config loader)
const CONFIG = {
  PRODUCT_NAME: "Promptly",
  OUTPUT_MODE: "{{OUTPUT_MODE}}", // static-ui-only | runnable-demo
  BRAND_PRIMARY: "{{BRAND_PRIMARY}}",
  BRAND_SECONDARY: "{{BRAND_SECONDARY}}",
  LANG_SET: "{{LANG_SET}}", // CSV or preset
  SUBSCRIPTION_PRICE: "{{SUBSCRIPTION_PRICE}}",
  IDENTITY_FIELDS: "{{IDENTITY_FIELDS}}", // e.g., "email,password,name"
  PERSISTENCE_POLICY: "{{PERSISTENCE_POLICY}}", // local-storage-only | mock-api | real-backend
  PAGES: "{{PAGES}}",
  LEGAL_SCOPE: "{{LEGAL_SCOPE}}",
  THEME_MODES: "{{THEME_MODES}}", // "system,light,dark"
  ICON_PACK: "{{ICON_PACK}}"
};

// Cookie consent minimal
const Cookie = {
  allowed:false,
  load(){ try{ this.allowed = localStorage.getItem('consent')==='1'; }catch(e){ this.allowed=false; } },
  accept(){ try{ localStorage.setItem('consent','1'); this.allowed=true; document.querySelector('#cookieBanner')?.remove(); }catch(e){} },
  reject(){ try{ localStorage.setItem('consent','0'); this.allowed=false; document.querySelector('#cookieBanner')?.remove(); }catch(e){} }
};

// Theme
const Theme = {
  current:'system',
  init(){
    this.current = Cookie.allowed && localStorage.getItem('theme') || 'system';
    this.apply(this.current);
  },
  apply(mode){
    this.current = mode;
    document.documentElement.classList.remove('light','dark');
    if(mode==='light') document.documentElement.classList.add('light');
    if(mode==='dark') document.documentElement.classList.add('dark');
    if(Cookie.allowed){ localStorage.setItem('theme', mode); }
  }
};

// Auth (mock)
const Auth = {
  user:null,
  load(){ if(Cookie.allowed){ try{ this.user = JSON.parse(localStorage.getItem('user')||'null'); }catch(e){} } },
  login(email){ this.user={email, plan: (JSON.parse(localStorage.getItem('plan')||'{"name":"Free"}')).name}; if(Cookie.allowed) localStorage.setItem('user',JSON.stringify(this.user)); renderAuth(); },
  logout(){ this.user=null; if(Cookie.allowed) localStorage.removeItem('user'); renderAuth(); },
  signup(name,email){ this.user={name,email, plan:'Free'}; if(Cookie.allowed) localStorage.setItem('user',JSON.stringify(this.user)); renderAuth(); }
};

// Subscription (mock)
const Sub = {
  plan: {name:'Free'},
  load(){ if(Cookie.allowed){ try{ this.plan = JSON.parse(localStorage.getItem('plan')||'{"name":"Free"}'); }catch(e){} } },
  upgrade(){ this.plan={name:`Plus ($${CONFIG.SUBSCRIPTION_PRICE}/mo)`}; if(Cookie.allowed) localStorage.setItem('plan',JSON.stringify(this.plan)); renderPlan(); },
  cancel(){ this.plan={name:'Free'}; if(Cookie.allowed) localStorage.setItem('plan',JSON.stringify(this.plan)); renderPlan(); }
};

// i18n
let lang='en';
function setLang(l){
  lang=l;
  const t=window.I18N[l]||window.I18N.en;
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key=el.getAttribute('data-i18n');
    el.textContent = (t[key]||key).replaceAll('{{SUBSCRIPTION_PRICE}}', CONFIG.SUBSCRIPTION_PRICE);
  });
  document.title = t.appTitle.replaceAll('{{PRODUCT_NAME}}', CONFIG.PRODUCT_NAME);
}

// Charts (reuse v0.4 behavior)
let lineChart, barChart, pieChart, gaugeChart;
function buildCharts(){
  lineChart=new Chart(document.getElementById('line'),{type:'line',data:{labels:[],datasets:[{label:'Accuracy',data:[],borderWidth:3,tension:.35}]},options:{plugins:{legend:{display:false}},scales:{y:{min:0,max:100,ticks:{callback:v=>v+'%'}}}});
  barChart=new Chart(document.getElementById('bar'),{type:'bar',data:{labels:[],datasets:[{label:'Δ Accuracy',data:[]}]},options:{plugins:{legend:{display:false}},scales:{y:{ticks:{callback:v=>v+'%'}}}});
  pieChart=new Chart(document.getElementById('pie'),{type:'doughnut',data:{labels:['Pass','Fail'],datasets:[{data:[0,100]}]},options:{plugins:{legend:{position:'bottom'}}}});
  gaugeChart=new Chart(document.getElementById('gauge'),{type:'doughnut',data:{labels:['Progress','Remaining'],datasets:[{data:[0,100],cutout:'75%'}]},options:{plugins:{legend:{display:false}}}});
}
function simulate(){
  const task = document.getElementById('task').value.trim()||'Classify sentiment of a sentence; output POS or NEG only.';
  function rnd(n){return Math.random()*n}
  let acc=52+rnd(8), f1=acc-2+rnd(3), pass=acc-4+rnd(6);
  const steps=[
    {name:'Explicit output schema',boost:4+rnd(2.5)},
    {name:'Few-shot from examples',boost:5+rnd(3)},
    {name:'Short CoT reasoning',boost:3+rnd(2)},
    {name:'Negative constraints',boost:2+rnd(1.5)},
    {name:'Self-check verifier',boost:4+rnd(2.5)}
  ];
  const labels=[], series=[], barsL=[], barsV=[];
  steps.forEach((s,i)=>{acc=Math.min(100,acc+s.boost);f1=Math.min(100,f1+s.boost*.9);pass=Math.min(100,pass+s.boost*.85);labels.push('v'+(i+1));series.push(Math.round(acc));barsL.push(s.name);barsV.push(Math.round(s.boost*10)/10)});
  const best = [
    'You are a precise assistant.',
    'Task: '+task,
    'Rules:',
    '1) Output the exact required format only.',
    '2) Think briefly, then output final answer only.',
    '3) If uncertain, choose safest default.'
  ].join('\n');
  return {acc:Math.round(acc), f1:Math.round(f1), pass:Math.round(pass), cost:100-Math.round(rnd(25)), labels, series, barsL, barsV, best, versions:labels.map((l,i)=>`${l} · ${barsL[i]} · +${barsV[i]}%`).join('\n'), progress: Math.round((acc-50)/0.5)}
}
function runOpt(){
  const r=simulate();
  document.getElementById('acc').textContent=r.acc+'%';
  document.getElementById('f1').textContent=r.f1+'%';
  document.getElementById('pass').textContent=r.pass+'%';
  document.getElementById('cost').textContent=r.cost+'%';
  document.getElementById('prog').textContent=r.progress+'%';
  lineChart.data.labels=r.labels; lineChart.data.datasets[0].data=r.series; lineChart.update();
  barChart.data.labels=r.barsL; barChart.data.datasets[0].data=r.barsV; barChart.update();
  pieChart.data.datasets[0].data=[r.pass,100-r.pass]; pieChart.update();
  gaugeChart.data.datasets[0].data=[r.acc,100-r.acc]; gaugeChart.update();
  document.getElementById('best').value=r.best;
  document.getElementById('versions').textContent=r.versions;
}

// Render helpers
function renderAuth(){
  const userEl=document.getElementById('userSlot');
  if(Auth.user){
    userEl.innerHTML = `<span>${Auth.user.email||Auth.user.name}</span> · <button id="logoutBtn" class="link">`+(window.I18N[lang]?.logout||'Logout')+`</button>`;
    document.getElementById('logoutBtn').onclick=()=>Auth.logout();
  }else{
    userEl.innerHTML = `<a href="login.html" class="link" data-i18n="login">${window.I18N[lang]?.login||'Login'}</a> · <a href="signup.html" class="link" data-i18n="signup">${window.I18N[lang]?.signup||'Signup'}</a>`;
  }
}
function renderPlan(){
  const planEl=document.getElementById('planSlot');
  planEl.textContent = (window.I18N[lang]?.currentPlan||'Current plan')+': '+(Sub.plan.name);
}

// On load
window.addEventListener('DOMContentLoaded',()=>{
  Cookie.load(); Auth.load(); Sub.load();
  // theme init
  Theme.init();
  // language
  const defaultLang = (CONFIG.LANG_SET && CONFIG.LANG_SET.split(',')[0].trim()) || 'en';
  setLang(Cookie.allowed && localStorage.getItem('lang') || defaultLang);
  // charts
  buildCharts();
  // nav
  renderAuth(); renderPlan();
  // cookie banner if not decided
  if(localStorage.getItem('consent')===null){
    document.getElementById('cookieBanner').style.display='block';
  }
  // binds
  document.getElementById('run').onclick=runOpt;
  document.getElementById('langSel').onchange=(e)=>{ if(Cookie.allowed){ localStorage.setItem('lang',e.target.value); } setLang(e.target.value); };
  document.getElementById('themeSel').onchange=(e)=>Theme.apply(e.target.value);
  document.getElementById('acceptCookies').onclick=()=>Cookie.accept();
  document.getElementById('rejectCookies').onclick=()=>Cookie.reject();
});