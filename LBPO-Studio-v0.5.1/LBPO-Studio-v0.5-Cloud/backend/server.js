/** LBPO-Studio v0.5 Backend (Express)
 * - Serves static (frontend/) and minimal mock APIs for auth/subscription/optimize
 * - No secrets committed. Read .env for PORT, MODE
*/
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Mock DB in memory (demo)
let users = {};
let plans = {};

app.get('/health', (req,res)=>res.json({ok:true, version:'v0.5'}));

app.post('/api/register', (req,res)=>{
  const {name,email,password} = req.body||{};
  if(!email || !password){ return res.status(400).json({error:'missing fields'}); }
  users[email] = {name,email,password};
  plans[email] = 'Free';
  res.json({ok:true, user:{name,email}, plan:plans[email]});
});

app.post('/api/login', (req,res)=>{
  const {email,password} = req.body||{};
  if(!email || !users[email] || users[email].password!==password){ return res.status(401).json({error:'invalid'}); }
  res.json({ok:true, user:{name:users[email].name,email}, plan:plans[email]||'Free'});
});

app.post('/api/upgrade', (req,res)=>{
  const {email} = req.body||{};
  if(!email) return res.status(400).json({error:'missing email'});
  plans[email] = `Plus ($${process.env.SUBSCRIPTION_PRICE||'5'}/mo)`;
  res.json({ok:true, plan:plans[email]});
});

app.post('/api/cancel', (req,res)=>{
  const {email} = req.body||{};
  if(!email) return res.status(400).json({error:'missing email'});
  plans[email] = 'Free';
  res.json({ok:true, plan:plans[email]});
});

app.post('/api/optimize', (req,res)=>{
  function rnd(n){ return Math.random()*n }
  let acc = 52 + rnd(8), f1 = acc - 2 + rnd(3), pass = acc - 4 + rnd(6);
  const steps = [
    { name: "Explicit output schema", boost: 4 + rnd(2.5) },
    { name: "Few-shot from examples", boost: 5 + rnd(3) },
    { name: "Short CoT reasoning", boost: 3 + rnd(2) },
    { name: "Negative constraints", boost: 2 + rnd(1.5) },
    { name: "Self-check verifier", boost: 4 + rnd(2.5) },
  ];
  const labels = [], series = [], barsL = [], barsV = [];
  steps.forEach((s,i)=>{
    acc = Math.min(100, acc + s.boost);
    f1 = Math.min(100, f1 + s.boost*0.9);
    pass = Math.min(100, pass + s.boost*0.85);
    labels.push(`v${i+1}`);
    series.push(Math.round(acc));
    barsL.push(s.name);
    barsV.push(Math.round(s.boost*10)/10);
  });
  const best = [
    "You are a precise assistant.",
    "Task: "+(req.body?.task||"Classify sentiment..."),
    "Rules:",
    "1) Output exact required format only.",
    "2) Think briefly, then output final answer only.",
    "3) If uncertain, choose safest default."
  ].join("\n");
  res.json({ acc:Math.round(acc), f1:Math.round(f1), pass:Math.round(pass), cost:100-Math.round(rnd(25)),
    labels, series, barsL, barsV, best, versions: labels.map((l,i)=>`${l} · ${barsL[i]} · +${barsV[i]}%`).join("\n"), progress: Math.round((acc-50)/0.5) });
});

// Serve frontend
const FE = process.env.FRONTEND_DIR || path.join(__dirname, '..', 'frontend');
app.use(express.static(FE));
app.get('*', (req,res)=>res.sendFile(path.join(FE,'index.html')));

const PORT = process.env.PORT || 10000;
app.listen(PORT, ()=>console.log(`LBPO v0.5 backend on :${PORT}`));
