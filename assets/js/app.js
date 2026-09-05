import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, doc, getDocs, setDoc, deleteDoc, getDoc, writeBatch }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  setPersistence,
  browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDc8muhoCO9wOTRAXG3uYXM35-UwUjZlbQ",
  authDomain: "studio-fb-371e4.firebaseapp.com",
  projectId: "studio-fb-371e4",
  storageBucket: "studio-fb-371e4.firebasestorage.app",
  messagingSenderId: "808935402407",
  appId: "1:808935402407:web:1aae43a85d855728ed6482",
  measurementId: "G-Y57YZLCKFF"
};
const app  = initializeApp(firebaseConfig);
const db   = getFirestore(app);
const auth = getAuth(app);

// ═══════════════════════════════════════════════════
// FIREBASE AUTHENTICATION — e-mail + senha
// A autenticação real é validada pelo Firebase.
// A proteção dos dados deve ser complementada pelas Firestore Security Rules.
// ═══════════════════════════════════════════════════
const loginScreen = document.getElementById('login-screen');
const appMain     = document.querySelector('.main');
const appSidebar  = document.getElementById('sidebar');

function mostrarLogin() {
  loginScreen.style.display = 'flex';
  appMain.style.display = 'none';
  appSidebar.style.display = 'none';

  const email = document.getElementById('login-email');
  const senha = document.getElementById('login-senha');
  const erro  = document.getElementById('login-erro');

  if (erro) erro.style.display = 'none';
  if (senha) senha.value = '';

  setTimeout(() => {
    if (email && !email.value) email.focus();
    else if (senha) senha.focus();
  }, 100);
}

function mostrarApp(user) {
  loginScreen.style.display = 'none';
  appMain.style.display = '';
  appSidebar.style.display = '';

  const emailSeguro = user?.email || 'Usuário autenticado';
  document.getElementById('sidebar-footer').innerHTML =
    `<div style="font-size:11px;color:#444;margin-bottom:5px">Studio FB © 2026</div>
     <div style="font-size:10px;color:#555;margin-bottom:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${emailSeguro}">${emailSeguro}</div>
     <button onclick="fazerLogout()" style="background:none;border:1px solid #333;color:#666;border-radius:4px;padding:5px 10px;font-size:11px;cursor:pointer;width:100%;font-family:'Barlow',sans-serif" onmouseover="this.style.borderColor='#D32F2F';this.style.color='#D32F2F'" onmouseout="this.style.borderColor='#333';this.style.color='#666'">Sair</button>`;

  if (!alunos.length) init();
}

function mensagemErroAuth(code) {
  const mensagens = {
    'auth/invalid-email': 'Informe um e-mail válido.',
    'auth/invalid-credential': 'E-mail ou senha incorretos.',
    'auth/user-not-found': 'E-mail ou senha incorretos.',
    'auth/wrong-password': 'E-mail ou senha incorretos.',
    'auth/user-disabled': 'Este acesso foi desativado.',
    'auth/too-many-requests': 'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
    'auth/network-request-failed': 'Falha de conexão. Verifique a internet e tente novamente.',
    'auth/operation-not-allowed': 'Login por e-mail e senha ainda não foi habilitado no Firebase.'
  };
  return mensagens[code] || 'Não foi possível entrar. Tente novamente.';
}

window.fazerLogin = async function() {
  const emailCampo = document.getElementById('login-email');
  const senhaCampo = document.getElementById('login-senha');
  const btn = document.getElementById('login-submit');
  const erro = document.getElementById('login-erro');

  const email = emailCampo?.value.trim() || '';
  const senha = senhaCampo?.value || '';

  erro.style.display = 'none';

  if (!email || !senha) {
    erro.textContent = 'Informe e-mail e senha.';
    erro.style.display = 'block';
    (!email ? emailCampo : senhaCampo)?.focus();
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.textContent = 'ENTRANDO...';
    btn.style.opacity = '0.75';
  }

  try {
    // Mantém a sessão apenas durante esta sessão do navegador,
    // comportamento semelhante ao sessionStorage usado anteriormente.
    await setPersistence(auth, browserSessionPersistence);
    await signInWithEmailAndPassword(auth, email, senha);
    // A abertura do sistema é feita pelo onAuthStateChanged no final do arquivo.
  } catch (err) {
    console.error('Falha no Firebase Auth:', err);
    erro.textContent = mensagemErroAuth(err?.code);
    erro.style.display = 'block';
    senhaCampo.value = '';
    senhaCampo.focus();
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'ENTRAR';
      btn.style.opacity = '1';
    }
  }
};

window.fazerLogout = async function() {
  try {
    await signOut(auth);
  } catch (err) {
    console.error('Falha ao sair:', err);
    alert('Não foi possível encerrar a sessão. Tente novamente.');
  }
};

// Login por submit de formulário: evita handlers inline e mantém o HTML válido.
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    window.fazerLogin();
  });
}

// ═══════════════════════════════════════════════════
// CONSTANTES
// ═══════════════════════════════════════════════════
const HOJE      = new Date();
const MES_ATUAL = HOJE.getMonth();
const ANO_ATUAL = HOJE.getFullYear();
const MESES_NOMES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const MESES_ABREV = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'];

const DESP_BASE = {
  operacional:    [{desc:'Gabriel (professor principal)',valor:2200,tipo:'recorrente'},{desc:'Louan',valor:300,tipo:'recorrente'},{desc:'Ruan (auxiliar/limpeza)',valor:210,tipo:'recorrente'}],
  despesa_op:     [{desc:'Pró-labore',valor:0,tipo:'recorrente'},{desc:'Manutenção e reposição',valor:729.77,tipo:'pontual'}],
  administrativo: [{desc:'Contadora',valor:0,tipo:'recorrente'},{desc:'Sistema de gestão',valor:195.90,tipo:'recorrente'},{desc:'Taxas e renovações',valor:690.68,tipo:'pontual'},{desc:'Apple Bill',valor:130.79,tipo:'recorrente'}],
  marketing:      [{desc:'Anúncio Instagram / tráfego pago',valor:227.80,tipo:'pontual'},{desc:'Brindes e materiais promocionais',valor:0,tipo:'pontual'}],
  impostos:       [{desc:'Simples Nacional / DAS',valor:0,tipo:'recorrente'},{desc:'ISS',valor:0,tipo:'recorrente'},{desc:'Outros impostos',valor:0,tipo:'pontual'}],
};

const ALUNOS_INICIAIS = [
  {id:'1',  nome:'Lucas + Luana + Francisca', plano:'anual',      valor:8100, inicio:'2025-10-01',venc:'2026-09-30',pgto:'PIX',    recebimento:'mensal', status:'pago',        obs:'Anual - Família',whats:''},
  {id:'2',  nome:'Victor',                    plano:'mensal',     valor:475,  inicio:'2026-01-01',venc:'2026-12-31',pgto:'Cartão', recebimento:'mensal', status:'pago',        obs:'',whats:''},
  {id:'3',  nome:'Wellington',                plano:'mensal',     valor:475,  inicio:'2026-01-01',venc:'2026-12-31',pgto:'PIX',    recebimento:'mensal', status:'pago',        obs:'',whats:''},
  {id:'4',  nome:'Ana Isabel',                plano:'mensal',     valor:400,  inicio:'2026-01-01',venc:'2026-12-31',pgto:'Cartão', recebimento:'mensal', status:'pago',        obs:'',whats:''},
  {id:'5',  nome:'Carlinhos',                 plano:'anual',      valor:4800, inicio:'2025-11-01',venc:'2026-10-31',pgto:'PIX',    recebimento:'avista', status:'pago',        obs:'7/12',whats:''},
  {id:'6',  nome:'Danyel',                    plano:'trimestral', valor:437,  inicio:'2026-01-01',venc:'2026-03-31',pgto:'PIX',    recebimento:'avista', status:'inadimplente',obs:'',whats:''},
  {id:'7',  nome:'Alinne',                    plano:'mensal',     valor:400,  inicio:'2026-01-01',venc:'2026-12-31',pgto:'PIX',    recebimento:'mensal', status:'confirmar',   obs:'',whats:''},
  {id:'8',  nome:'George',                    plano:'mensal',     valor:800,  inicio:'2026-01-01',venc:'2026-12-31',pgto:'Cartão', recebimento:'mensal', status:'pago',        obs:'',whats:''},
  {id:'9',  nome:'Maria Clara',               plano:'anual',      valor:4800, inicio:'2025-09-01',venc:'2026-08-31',pgto:'Cartão', recebimento:'avista', status:'pago',        obs:'9/12',whats:''},
  {id:'10', nome:'Yasmin',                    plano:'anual',      valor:4800, inicio:'2025-12-01',venc:'2026-11-30',pgto:'PIX',    recebimento:'avista', status:'pago',        obs:'6/12',whats:''},
  {id:'11', nome:'Catarina',                  plano:'anual',      valor:4800, inicio:'2025-12-01',venc:'2026-11-30',pgto:'Cartão', recebimento:'avista', status:'pago',        obs:'6/12',whats:''},
  {id:'12', nome:'Eutrópico',                 plano:'mensal',     valor:150,  inicio:'2026-01-01',venc:'2026-12-31',pgto:'PIX',    recebimento:'mensal', status:'pago',        obs:'',whats:''},
  {id:'13', nome:'Marcos',                    plano:'anual',      valor:4800, inicio:'2025-10-01',venc:'2026-09-30',pgto:'PIX',    recebimento:'avista', status:'pago',        obs:'8/12',whats:''},
  {id:'14', nome:'Luciano',                   plano:'anual',      valor:4800, inicio:'2025-11-01',venc:'2026-10-31',pgto:'PIX',    recebimento:'avista', status:'pago',        obs:'7/12',whats:''},
  {id:'15', nome:'Victor (Alinne)',            plano:'mensal',     valor:350,  inicio:'2026-01-01',venc:'2026-12-31',pgto:'PIX',    recebimento:'mensal', status:'pago',        obs:'',whats:''},
  {id:'16', nome:'Ana Virgínia',              plano:'trimestral', valor:410,  inicio:'2026-02-01',venc:'2026-04-30',pgto:'PIX',    recebimento:'avista', status:'pendente',    obs:'',whats:''},
  {id:'17', nome:'Lucas Alves',               plano:'anual',      valor:4800, inicio:'2026-01-01',venc:'2026-12-31',pgto:'PIX',    recebimento:'avista', status:'pago',        obs:'5/12',whats:''},
  {id:'18', nome:'Aponea',                    plano:'anual',      valor:4800, inicio:'2026-01-01',venc:'2026-12-31',pgto:'PIX',    recebimento:'avista', status:'pago',        obs:'5/12',whats:''},
  {id:'19', nome:'Clarissa',                  plano:'mensal',     valor:100,  inicio:'2026-01-01',venc:'2026-12-31',pgto:'PIX',    recebimento:'mensal', status:'pago',        obs:'',whats:''},
  {id:'20', nome:'Ana Carla',                 plano:'semestral',  valor:396,  inicio:'2026-02-01',venc:'2026-07-31',pgto:'PIX',    recebimento:'avista', status:'pago',        obs:'',whats:''},
  {id:'21', nome:'Laísa Allen',               plano:'anual',      valor:4656, inicio:'2026-03-01',venc:'2027-02-28',pgto:'PIX',    recebimento:'avista', status:'pago',        obs:'3/12',whats:''},
  {id:'22', nome:'Marlom',                    plano:'trimestral', valor:417,  inicio:'2026-03-01',venc:'2026-05-31',pgto:'PIX',    recebimento:'avista', status:'pago',        obs:'',whats:''},
  {id:'23', nome:'Iago',                      plano:'trimestral', valor:823,  inicio:'2026-03-01',venc:'2026-05-31',pgto:'Cartão', recebimento:'avista', status:'pago',        obs:'',whats:''},
  {id:'24', nome:'Sâmea',                     plano:'anual',      valor:4800, inicio:'2026-03-01',venc:'2027-02-28',pgto:'PIX',    recebimento:'avista', status:'pago',        obs:'3/12',whats:''},
];

// ═══════════════════════════════════════════════════
// ESTADO
// ═══════════════════════════════════════════════════
let alunos = [];
let contratos = [];
let pagamentos = [];
let financeiroModo = 'competencia'; // competencia | caixa
let viewAtual = 'dashboard';
let editandoId = null;
let despMes = MES_ATUAL, despAno = ANO_ATUAL;
let finMes  = MES_ATUAL, finAno  = ANO_ATUAL;
let despCatAtual = 'operacional', despIdxAtual = null, despEditando = false;
let filtroStatus = '', filtroPlano = '', filtroSearch = '', filtroOrdem = 'az';
let despCache = {};   // chave → {cats, programadas}
let progCache = null; // despesas programadas

// ═══════════════════════════════════════════════════
// UTILS
// ═══════════════════════════════════════════════════
function addMeses(dateStr, n) { const d=new Date(dateStr); d.setMonth(d.getMonth()+n); return d.toISOString().split('T')[0]; }
function diasAte(v) { if(!v) return 9999; return Math.round((new Date(v)-HOJE)/86400000); }
function fmtData(s) { if(!s) return '—'; const [y,m,d]=s.split('-'); return `${d}/${m}/${y}`; }
function parseDataLocal(s) {
  if(!s) return null;
  const [y,m,d] = String(s).split('-').map(Number);
  if(!y || !m || !d) return null;
  return new Date(y, m-1, d);
}
function dataNascimentoAluno(a) { return a?.nascimento || a?.dataNascimento || ''; }
function calcularIdade(nascimento, ref = HOJE) {
  const nasc = parseDataLocal(nascimento);
  if(!nasc) return null;
  let idade = ref.getFullYear() - nasc.getFullYear();
  const jaFez = ref.getMonth() > nasc.getMonth() || (ref.getMonth() === nasc.getMonth() && ref.getDate() >= nasc.getDate());
  if(!jaFez) idade--;
  return idade >= 0 ? idade : null;
}
function idadeNoAniversario(nascimento, ano = ANO_ATUAL) {
  const nasc = parseDataLocal(nascimento);
  if(!nasc) return null;
  return Math.max(0, ano - nasc.getFullYear());
}
function fmtAniversario(nascimento) {
  const nasc = parseDataLocal(nascimento);
  if(!nasc) return '—';
  return `${String(nasc.getDate()).padStart(2,'0')}/${String(nasc.getMonth()+1).padStart(2,'0')}`;
}
function getAniversariantesMes(mes = MES_ATUAL) {
  return alunos
    .filter(a => {
      const nasc = parseDataLocal(dataNascimentoAluno(a));
      return nasc && nasc.getMonth() === mes;
    })
    .sort((a,b) => parseDataLocal(dataNascimentoAluno(a)).getDate() - parseDataLocal(dataNascimentoAluno(b)).getDate());
}
function mediaIdadeAlunos() {
  const idades = alunos.map(a => calcularIdade(dataNascimentoAluno(a))).filter(v => Number.isFinite(v));
  if(!idades.length) return null;
  return idades.reduce((acc,v)=>acc+v,0) / idades.length;
}
function mensalidadeAluno(a) {
  // Sempre retorna o valor mensal real, independente do plano
  const div = {mensal:1,trimestral:3,semestral:6,anual:12};
  return Number(a.valor) / (div[a.plano] || 1);
}
function fmtValor(v) { return 'R$\u00a0'+Number(v).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2}); }
function chaveDesp(mes,ano) { return `${ano}_${String(mes).padStart(2,'0')}`; }
function gerarId() { return String(Date.now()); }

function planoBadge(p) {
  const l={mensal:'Mensal',trimestral:'Trimestral',semestral:'Semestral',anual:'Anual'};
  return `<span class="badge badge-${p}">${l[p]||p}</span>`;
}
function statusBadge(s) {
  const l={pago:'Pago',pendente:'Pendente',inadimplente:'Inadimplente',nao_renovou:'Não renovou',confirmar:'A confirmar'};
  return `<span class="badge badge-${s}"><span class="status-dot"></span>${l[s]||s}</span>`;
}
function progressAnual(obs) {
  const m=obs&&obs.match(/(\d+)\/12/);
  if(!m) return '';
  const pct=Math.round((parseInt(m[1])/12)*100);
  return `<div class="progress-wrap"><div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div><span class="progress-label">${m[0]}</span></div>`;
}

function progressPlano(a) {
  // Barra de progresso automática baseada em início e vencimento
  const ini = new Date(a.inicio);
  const venc = new Date(a.venc);
  const hoje = new Date();
  const totalDias = Math.max(1, Math.round((venc - ini) / 86400000));
  const diasPassados = Math.max(0, Math.min(totalDias, Math.round((hoje - ini) / 86400000)));
  const pct = Math.round((diasPassados / totalDias) * 100);
  const periodos = {mensal:'1 mês', trimestral:'3 meses', semestral:'6 meses', anual:'12 meses'};
  const periodo = periodos[a.plano] || '';
  const mens = mensalidadeAluno(a);
  const totalContrato = Number(a.valor);
  
  // Label da parcela atual (ex: 3/12, 2/6, 1/3, 1/1)
  const totalMeses = {mensal:1,trimestral:3,semestral:6,anual:12}[a.plano]||1;
  const mesAtual = Math.min(totalMeses, Math.ceil(diasPassados / (totalDias / totalMeses)));
  const parcelaLabel = totalMeses > 1 ? `${mesAtual}/${totalMeses}` : '';

  return `<div class="progress-wrap">
    <div class="progress-bar" style="width:80px">
      <div class="progress-fill" style="width:${pct}%"></div>
    </div>
    <span class="progress-label">${pct}% ${parcelaLabel ? '· '+parcelaLabel : ''}</span>
  </div>
  <div style="font-size:10px;color:var(--texto-muted);margin-top:2px">
    ${fmtValor(mens)}/mês · Total ${fmtValor(totalContrato)}
  </div>`;
}
function mensalidade(a) {
  const div={mensal:1,trimestral:3,semestral:6,anual:12};
  return Number(a.valor)/(div[a.plano]||1);
}
function receitaMensal() {
  return alunos.filter(a=>a.status==='pago').reduce((acc,a)=>acc+mensalidadeAluno(a),0);
}
function receitaMesEsp(mes,ano) {
  const ini=new Date(ano,mes,1), fim=new Date(ano,mes+1,0);
  return alunos.filter(a=>a.status!=='confirmar'&&new Date(a.inicio)<=fim&&new Date(a.venc)>=ini)
    .reduce((acc,a)=>acc+mensalidadeAluno(a),0);
}
function toast(msg) { const t=document.getElementById('toast'); t.textContent=msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),2800); }
function loading(sim) {
  document.getElementById('content').innerHTML = sim
    ? `<div style="display:flex;align-items:center;justify-content:center;height:300px;flex-direction:column;gap:16px"><div style="width:40px;height:40px;border:3px solid var(--borda);border-top-color:var(--vermelho);border-radius:50%;animation:spin 0.8s linear infinite"></div><div style="color:var(--texto-muted);font-size:13px">Carregando...</div></div><style>@keyframes spin{to{transform:rotate(360deg)}}</style>` : '';
}


// ═══════════════════════════════════════════════════
// TRILHA DE AUDITORIA
// ═══════════════════════════════════════════════════
async function registrarAuditoria(acao, alunoId, alunoNome, dadosAntes, dadosDepois) {
  try {
    const id = gerarId();
    await setDoc(doc(db,'auditoria',id), {
      id, acao, alunoId: alunoId||'', alunoNome: alunoNome||'',
      dadosAntes: JSON.stringify(dadosAntes||{}),
      dadosDepois: JSON.stringify(dadosDepois||{}),
      data: new Date().toISOString().split('T')[0],
      hora: new Date().toLocaleTimeString('pt-BR'),
      ts: Date.now()
    });
  } catch(e) { console.warn('Auditoria falhou:', e); }
}

// ═══════════════════════════════════════════════════
// FIREBASE — ALUNOS
// ═══════════════════════════════════════════════════
async function carregarAlunos() {
  try {
    const snap = await getDocs(collection(db,'alunos'));
    if (snap.empty) {
      for (const a of ALUNOS_INICIAIS) await setDoc(doc(db,'alunos',a.id), a);
      alunos = [...ALUNOS_INICIAIS];
    } else {
      alunos = snap.docs.map(d=>({...d.data()}));
    }
  } catch(e) { console.error(e); toast('Erro ao carregar alunos'); }
}
async function salvarAlunoDb(a) { await setDoc(doc(db,'alunos',String(a.id)), a); }
async function excluirAlunoDb(id) { await deleteDoc(doc(db,'alunos',String(id))); }

// ═══════════════════════════════════════════════════
// FIREBASE — HISTÓRICO DE PAGAMENTOS
// ═══════════════════════════════════════════════════
async function registrarHistorico(alunoId, alunoNome, tipo, valor, obs) {
  const id = gerarId();
  const registro = {
    id, alunoId, alunoNome, tipo, valor,
    data: new Date().toISOString().split('T')[0],
    obs: obs || '',
    ts: Date.now()
  };
  await setDoc(doc(db,'historico',id), registro);
}
async function carregarHistorico(alunoId) {
  try {
    const snap = await getDocs(collection(db,'historico'));
    return snap.docs.map(d=>d.data()).filter(h=>h.alunoId===alunoId).sort((a,b)=>b.ts-a.ts);
  } catch(e) { return []; }
}

// ═══════════════════════════════════════════════════
// FIREBASE — DESPESAS PROGRAMADAS
// ═══════════════════════════════════════════════════
async function carregarProgramadas() {
  if (progCache) return progCache;
  try {
    const snap = await getDocs(collection(db,'despesas_prog'));
    progCache = snap.docs.map(d=>({id:d.id,...d.data()}));
  } catch(e) { progCache = []; }
  return progCache;
}
async function salvarProgramada(p) {
  await setDoc(doc(db,'despesas_prog',p.id), p);
  progCache = null; // invalidar cache
}
async function excluirProgramada(id) {
  await deleteDoc(doc(db,'despesas_prog',id));
  progCache = null;
}

// ═══════════════════════════════════════════════════
// FIREBASE — DESPESAS POR MÊS
// ═══════════════════════════════════════════════════
async function loadDespesas(mes, ano) {
  const chave = chaveDesp(mes,ano);
  if (despCache[chave]) return despCache[chave];

  // Carregar do Firestore
  let cats = null;
  try {
    const snap = await getDoc(doc(db,'despesas',chave));
    if (snap.exists()) cats = snap.data().cats;
  } catch(e) {}

  // Se não existe, usar base
  if (!cats) {
    cats = JSON.parse(JSON.stringify(DESP_BASE));
    await setDoc(doc(db,'despesas',chave),{cats});
  }

  // Injetar despesas programadas deste mês
  const prog = await carregarProgramadas();
  prog.forEach(p => {
    const iniAno=parseInt(p.iniAno), iniMes=parseInt(p.iniMes);
    const fimAno=parseInt(p.fimAno), fimMes=parseInt(p.fimMes);
    const dentroRange = (ano>iniAno||(ano===iniAno&&mes>=iniMes)) && (ano<fimAno||(ano===fimAno&&mes<=fimMes));
    if (!dentroRange) return;

    // Verificar se já existe na lista (evitar duplicata)
    const cat = cats[p.cat] || [];
    const jaExiste = cat.some(x=>x.progId===p.id);
    if (!jaExiste) {
      let valorParcela = Number(p.valor);
      if (p.tipo==='parcelada') {
        const iniTotal = iniAno*12+iniMes;
        const mesTotalAtual = ano*12+mes;
        const numParcela = mesTotalAtual - iniTotal + 1;
        valorParcela = Number(p.valor);
        if (numParcela < 1 || numParcela > p.totalParcelas) return;
      }
      cats[p.cat] = [...cat, {
        desc: p.tipo==='parcelada' ? `${p.desc} (${(ano*12+mes)-(iniAno*12+iniMes)+1}/${p.totalParcelas})` : p.desc,
        valor: valorParcela,
        tipo: p.tipo,
        progId: p.id,
        fixo: true
      }];
    }
  });

  despCache[chave] = cats;
  return cats;
}

async function saveDespesas(mes, ano, cats) {
  const chave = chaveDesp(mes,ano);
  // Filtrar itens de programadas antes de salvar (não salvar os injetados)
  const catsLimpas = {};
  Object.keys(cats).forEach(cat => {
    catsLimpas[cat] = cats[cat].filter(d => !d.fixo);
  });
  despCache[chave] = cats; // manter cache completo
  await setDoc(doc(db,'despesas',chave),{cats:catsLimpas});
}

function totalDesp(cats) {
  return Object.values(cats).flat().reduce((a,d)=>a+Number(d.valor),0);
}

// ═══════════════════════════════════════════════════
// SIDEBAR MOBILE
// ═══════════════════════════════════════════════════
function toggleSidebar() {
  const sb=document.getElementById('sidebar'), ov=document.getElementById('sidebar-overlay');
  const open=sb.classList.toggle('open');
  ov.style.display=open?'block':'none';
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').style.display='none';
}
window.toggleSidebar=toggleSidebar;

// ═══════════════════════════════════════════════════
// NAVEGAÇÃO
// ═══════════════════════════════════════════════════
function setView(v) {
  viewAtual=v; closeSidebar();
  document.querySelectorAll('.nav-item').forEach((el,i)=>el.classList.toggle('active',['dashboard','alunos','despesas','financeiro','agenda','auditoria'][i]===v));
  document.getElementById('page-title').textContent={dashboard:'Dashboard',alunos:'Alunos',despesas:'Despesas',financeiro:'Financeiro',agenda:'Agenda de Turmas',auditoria:'Trilha de Auditoria'}[v];
  document.getElementById('topbar-right').innerHTML=(v==='alunos'||v==='dashboard')
    ?`<button class="btn btn-primary" onclick="openModalAluno()">+ Novo Aluno</button>`:'';
  render();
}
window.setView=setView;

function render() {
  if(viewAtual==='dashboard') renderDashboard();
  else if(viewAtual==='alunos') renderAlunos();
  else if(viewAtual==='despesas') renderDespesasView();
  else if(viewAtual==='financeiro') renderFinanceiroView();
  else if(viewAtual==='agenda') renderAgendaView();
  else if(viewAtual==='auditoria') renderAuditoriaView();
}

// ═══════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════
function renderDashboard() {
  const ativos       = alunos.filter(a=>a.status==='pago'||a.status==='pendente').length;
  const semContrato  = alunos.filter(a=>diasAte(a.venc)<0&&a.status!=='inadimplente').length;
  const inadimplentes= alunos.filter(a=>a.status==='inadimplente').length;
  const venc30       = alunos.filter(a=>{const d=diasAte(a.venc);return d>=0&&d<=10;});
  const venc7        = alunos.filter(a=>{const d=diasAte(a.venc);return d>=0&&d<=7;});
  const receitaComp  = receitaMesEsp(MES_ATUAL, ANO_ATUAL);
  const receitaCx    = receitaCaixaMes(MES_ATUAL, ANO_ATUAL);
  const receita      = receitaDoMesSelecionada(MES_ATUAL, ANO_ATUAL);
  const chave        = chaveDesp(MES_ATUAL,ANO_ATUAL);
  const despAtual    = despCache[chave]||DESP_BASE;
  const totDesp      = totalDesp(despAtual);
  const resultado    = receita-totDesp;
  const resPos       = resultado>=0;
  const aniversariantesMes = getAniversariantesMes(MES_ATUAL);
  const aniversariantesHtml = aniversariantesMes.length
    ? aniversariantesMes.map(a=>{
        const nasc = dataNascimentoAluno(a);
        const idadeAniv = idadeNoAniversario(nasc, ANO_ATUAL);
        const dia = fmtAniversario(nasc).split('/')[0];
        const hojeAniv = parseDataLocal(nasc)?.getDate() === HOJE.getDate() && parseDataLocal(nasc)?.getMonth() === MES_ATUAL;
        return `<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 24px;border-bottom:1px solid var(--borda)">
          <div style="cursor:pointer" onclick="abrirPerfilAluno('${a.id}')">
            <div style="font-weight:600;font-size:13.5px;color:var(--vermelho);text-decoration:underline;text-underline-offset:2px">${a.nome}</div>
            <div style="font-size:11px;color:var(--texto-muted)">Dia ${dia} · ${idadeAniv!==null ? idadeAniv+' anos' : 'idade não calculada'}</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:12px;font-weight:700;color:${hojeAniv?'var(--vermelho)':'var(--texto)' }">${hojeAniv?'Hoje':'Dia '+dia}</div>
            <span class="badge" style="background:var(--vermelho-light);color:var(--vermelho)">🎂 Aniv.</span>
          </div>
        </div>`;
      }).join('')
    : `<div class="empty"><div class="empty-icon">🎂</div>Nenhum aniversário cadastrado para ${MESES_NOMES[MES_ATUAL]}</div>`;

  let alertas='';
  if(venc7.length) alertas+=`<div class="alert-bar urgente"><span class="alert-icon">🚨</span><strong>${venc7.length} contrato(s)</strong>&nbsp;vence(m) em até 7 dias:&nbsp;${venc7.map(a=>a.nome).join(', ')}</div>`;
  if(venc30.filter(a=>diasAte(a.venc)>7).length) alertas+=`<div class="alert-bar atencao"><span class="alert-icon">⏰</span><strong>${venc30.filter(a=>diasAte(a.venc)>7).length} contrato(s)</strong>&nbsp;vence(m) nos próximos 10 dias:&nbsp;${venc30.filter(a=>diasAte(a.venc)>7).map(a=>a.nome).join(', ')}</div>`;
  if(inadimplentes) alertas+=`<div class="alert-bar urgente"><span class="alert-icon">🔴</span><strong>${inadimplentes} inadimplente(s):</strong>&nbsp;${alunos.filter(a=>a.status==='inadimplente').map(a=>a.nome).join(', ')}</div>`;
  if(semContrato) alertas+=`<div class="alert-bar atencao"><span class="alert-icon">📋</span><strong>${semContrato} sem contrato ativo</strong>&nbsp;— verificar renovação:&nbsp;${alunos.filter(a=>diasAte(a.venc)<0&&a.status!=='inadimplente').map(a=>a.nome).join(', ')}</div>`;

  document.getElementById('content').innerHTML=`
    <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--texto-muted);margin-bottom:10px">Alunos <span style="font-weight:400;font-size:9px">(clique para filtrar)</span></div>
    <div class="cards-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:16px">
      <div class="card c-green" style="cursor:pointer" onclick="irParaAlunos('pago')" title="Ver ativos"><div class="card-accent" style="background:var(--verde)"></div><div class="card-label">Ativos</div><div class="card-value">${ativos}</div><div class="card-sub">contratos vigentes</div><div class="card-icon">👥</div></div>
      <div class="card" style="border-top:3px solid #6b7280;cursor:pointer" onclick="irParaAlunos('nao_renovou')" title="Ver sem contrato"><div class="card-label">Sem Contrato</div><div class="card-value" style="color:#6b7280">${semContrato}</div><div class="card-sub">não renovaram</div><div class="card-icon" style="opacity:0.07">📋</div></div>
      <div class="card c-yellow" style="cursor:pointer" onclick="irParaAlunos('vencendo')" title="Ver vencendo"><div class="card-accent" style="background:var(--amarelo)"></div><div class="card-label">Vencendo em 10 dias</div><div class="card-value">${venc30.length}</div><div class="card-sub">vence em até 10 dias</div><div class="card-icon">⏰</div></div>
      <div class="card c-red" style="cursor:pointer" onclick="irParaAlunos('inadimplente')" title="Ver inadimplentes"><div class="card-accent" style="background:var(--vermelho)"></div><div class="card-label">Inadimplentes</div><div class="card-value">${inadimplentes}</div><div class="card-sub">contratos em atraso</div><div class="card-icon">⚠️</div></div>
    </div>
    <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:10px">
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--texto-muted)">Financeiro — ${MESES_NOMES[MES_ATUAL]} <span style="font-weight:400;color:var(--texto-muted)">(${financeiroModo==='competencia'?'competência':'caixa'})</span></div>
      <div style="display:flex;gap:6px">
        <button class="btn ${financeiroModo==='competencia'?'btn-primary':'btn-ghost'} btn-sm" onclick="setModoFinanceiro('competencia')">Competência</button>
        <button class="btn ${financeiroModo==='caixa'?'btn-primary':'btn-ghost'} btn-sm" onclick="setModoFinanceiro('caixa')">Caixa</button>
      </div>
    </div>
    <div class="cards-grid" style="grid-template-columns:repeat(3,1fr);margin-bottom:24px">
      <div class="card c-green" style="cursor:pointer" onclick="abrirResumoReceita()" title="Ver contribuição por aluno"><div class="card-accent" style="background:var(--verde)"></div><div class="card-label">Receita ${financeiroModo==='competencia'?'Competência':'Caixa'} ↗</div><div class="card-value" style="font-size:24px;padding-top:4px">${fmtValor(receita)}</div><div class="card-sub">Comp.: ${fmtValor(receitaComp)} · Caixa: ${fmtValor(receitaCx)}</div><div class="card-icon">💰</div></div>
      <div class="card c-red" style="cursor:pointer" onclick="setView('despesas')" title="Ver despesas"><div class="card-accent" style="background:var(--vermelho)"></div><div class="card-label">Total Despesas ↗</div><div class="card-value" style="font-size:24px;padding-top:4px">${fmtValor(totDesp)}</div><div class="card-sub">clique para ver despesas</div><div class="card-icon">💸</div></div>
      <div class="card" style="border-top:3px solid ${resPos?'var(--verde)':'var(--vermelho)'};cursor:pointer" onclick="setView('financeiro')" title="Ver financeiro"><div class="card-label">Resultado do Mês ↗</div><div class="card-value" style="font-size:24px;padding-top:4px;color:${resPos?'var(--verde)':'var(--vermelho)'}">${resPos?'':'-'}${fmtValor(Math.abs(resultado))}</div><div class="card-sub">clique para ver financeiro</div><div class="card-icon">${resPos?'📈':'📉'}</div></div>
    </div>
    ${alertas?`<div style="margin-bottom:20px">${alertas}</div>`:''}
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px">
      <div class="section-box">
        <div class="section-header"><div class="section-title">Status dos Alunos</div></div>
        <div style="padding:20px 24px">
          ${['pago','pendente','inadimplente','confirmar'].map(s=>{
            const count=alunos.filter(a=>a.status===s).length;
            const labels={pago:'Pagos',pendente:'Pendentes',inadimplente:'Inadimplentes',confirmar:'A confirmar'};
            const colors={pago:'var(--verde)',pendente:'var(--amarelo)',inadimplente:'var(--vermelho)',confirmar:'#9ca3af'};
            const pct=alunos.length?Math.round((count/alunos.length)*100):0;
            return `<div style="margin-bottom:14px;cursor:pointer" onclick="irParaAlunos('${s}')" title="Ver ${labels[s]}">
              <div style="display:flex;justify-content:space-between;margin-bottom:5px;font-size:13px">
                <span style="font-weight:600;color:${colors[s]}">${labels[s]}</span>
                <span style="color:var(--texto-muted)">${count} (${pct}%) →</span>
              </div>
              <div style="height:6px;background:var(--borda);border-radius:3px;overflow:hidden">
                <div style="height:100%;width:${pct}%;background:${colors[s]};border-radius:3px;transition:width 0.4s"></div>
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>
      <div class="section-box">
        <div class="section-header"><div class="section-title">Vencimentos Próximos</div><button class="btn btn-ghost btn-sm" onclick="setView('alunos')">Ver todos</button></div>
        <div style="padding:0">
          ${(()=>{
            const prox=alunos.filter(a=>{const d=diasAte(a.venc);return d>=0&&d<=10;}).sort((a,b)=>new Date(a.venc)-new Date(b.venc));
            if(!prox.length) return `<div class="empty"><div class="empty-icon">✅</div>Nenhum vencimento nos próximos 10 dias</div>`;
            return prox.map(a=>{
              const d=diasAte(a.venc);
              const cor=d<=7?'var(--vermelho)':'var(--amarelo)';
              const wBtn=a.whats?`<a href="https://wa.me/55${a.whats.replace(/\D/g,'')}" target="_blank" style="font-size:18px;text-decoration:none" title="WhatsApp">📱</a>`:'';
              return `<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 24px;border-bottom:1px solid var(--borda)"><div style="cursor:pointer" onclick="abrirPerfilAluno('${a.id}')"><div style="font-weight:600;font-size:13.5px;color:var(--vermelho);text-decoration:underline;text-underline-offset:2px">${a.nome}</div><div style="font-size:11px;color:var(--texto-muted)">${fmtData(a.venc)}</div></div><div style="display:flex;align-items:center;gap:8px">${wBtn}<div style="text-align:right"><div style="font-size:12px;font-weight:700;color:${cor}">${d===0?'Hoje':d===1?'Amanhã':d+' dias'}</div>${statusBadge(a.status)}</div></div></div>`;
            }).join('');
          })()}
        </div>
      </div>
      <div class="section-box">
        <div class="section-header">
          <div>
            <div class="section-title">Aniversariantes do Mês</div>
            <div style="font-size:12px;color:var(--texto-muted)">${MESES_NOMES[MES_ATUAL]} · ${aniversariantesMes.length} aluno(s)</div>
          </div>
        </div>
        <div style="padding:0">
          ${aniversariantesHtml}
        </div>
      </div>
    </div>`;
}

// ═══════════════════════════════════════════════════
// ALUNOS
// ═══════════════════════════════════════════════════
function renderAlunos() {
  // Ler filtros diretamente do DOM se os elementos já existem
  const buscaEl   = document.getElementById('busca-alunos');
  const statusEl  = document.getElementById('filtro-status');
  const planoEl   = document.getElementById('filtro-plano');
  const ordemEl   = document.getElementById('filtro-ordem');
  if (buscaEl)  filtroSearch = buscaEl.value;
  if (statusEl) filtroStatus = statusEl.value;
  if (planoEl)  filtroPlano  = planoEl.value;
  if (ordemEl)  filtroOrdem  = ordemEl.value;

  const sorted = [...alunos].sort((a,b)=>{
    if(filtroOrdem==='az') return a.nome.localeCompare(b.nome,'pt-BR');
    if(filtroOrdem==='za') return b.nome.localeCompare(a.nome,'pt-BR');
    if(filtroOrdem==='venc') return new Date(a.venc)-new Date(b.venc);
    return 0;
  });
  const search = filtroSearch.trim().toLowerCase();
  const filtered=sorted.filter(a=>{
    if(filtroStatus){
      const sc = statusContrato(a);
      const d = diasAte(a.venc);
      if(filtroStatus==='_vencendo10' && !(d>=0&&d<=10)) return false;
      else if(filtroStatus==='inadimplente' && a.status!=='inadimplente') return false;
      else if(filtroStatus==='nao_renovou' && sc.contrato!=='nao_renovou' && sc.contrato!=='a_renovar') return false;
      else if(filtroStatus==='pago' && sc.contrato!=='ativo') return false;
      else if(filtroStatus==='pendente' && sc.contrato!=='aguardando') return false;
      else if(filtroStatus==='confirmar' && a.status!=='confirmar') return false;
    }
    if(filtroPlano&&a.plano!==filtroPlano) return false;
    if(search&&!a.nome.toLowerCase().includes(search)) return false;
    return true;
  });
  const rows=filtered.map(a=>{
    const sc = statusContrato(a);
    const dias=diasAte(a.venc);
    const diasLabel=dias<0?`<div class="td-days text-red">${Math.abs(dias)}d atraso</div>`:dias<=7?`<div class="td-days text-red">${dias}d</div>`:dias<=10?`<div class="td-days" style="color:var(--amarelo)">${dias}d</div>`:'';
    const bolinhaColor = sc.contrato==='ativo'?'#22c55e':sc.contrato==='aguardando'?'#f59e0b':sc.contrato==='em_atraso'||sc.contrato==='inadimplente'?'#ef4444':'#9ca3af';
    const bolinha = `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${bolinhaColor};margin-right:6px;flex-shrink:0;box-shadow:0 0 0 2px ${bolinhaColor}33"></span>`;
    const progHtml = progressPlano(a);
    const wBtn=a.whats?`<a href="https://wa.me/55${a.whats.replace(/\D/g,'')}" target="_blank" class="btn btn-ghost btn-sm" title="WhatsApp" style="margin-left:4px">📱</a>`:'';
    const btnPagar = (a.recebimento==='mensal' && sc.contrato!=='ativo' && sc.contrato!=='nao_renovou' && sc.contrato!=='confirmar' && sc.contrato!=='a_renovar')
      ? `<button class="btn btn-success btn-sm" onclick="registrarPagamento('${a.id}')" style="margin-left:4px" title="Registrar pagamento">💰</button>` : '';
    return `<tr>
      <td>
        <div style="display:flex;align-items:center">
          ${bolinha}
          <span class="td-nome" onclick="abrirPerfilAluno('${a.id}')" style="cursor:pointer;color:var(--vermelho);text-decoration:underline;text-underline-offset:3px">${a.nome}</span>
        </div>
        ${dataNascimentoAluno(a) ? `<div style="font-size:10.5px;color:var(--texto-muted);margin-top:3px;margin-left:14px">🎂 ${fmtAniversario(dataNascimentoAluno(a))} · ${calcularIdade(dataNascimentoAluno(a))} anos</div>` : ''}
        <div style="margin-top:4px;margin-left:14px">${progHtml}</div>
      </td>
      <td>${planoBadge(a.plano)}</td>
      <td>
        <span class="td-valor">${fmtValor(mensalidadeAluno(a))}</span>
        <div style="font-size:10px;color:var(--texto-muted)">Total: ${fmtValor(Number(a.valor))}</div>
      </td>
      <td><div class="td-data">${fmtData(a.inicio)}</div></td>
      <td><div class="td-data">${fmtData(a.venc)}</div>${diasLabel}</td>
      <td>
        <span class="badge badge-${sc.contrato}" style="color:${sc.cor};background:${sc.cor}18">${sc.icon} ${sc.label}</span>
        <div style="margin-top:4px">
          <select class="status-select" onchange="changeStatus('${a.id}',this.value)" style="font-size:10px;color:var(--texto-muted)">
            <option value="pago" ${a.status==='pago'?'selected':''}>Pago</option>
            <option value="pendente" ${a.status==='pendente'?'selected':''}>Pendente</option>
            <option value="inadimplente" ${a.status==='inadimplente'?'selected':''}>Inadimplente</option>
            <option value="confirmar" ${a.status==='confirmar'?'selected':''}>A confirmar</option>
            <option value="nao_renovou" ${a.status==='nao_renovou'?'selected':''}>Não renovou</option>
          </select>
        </div>
      </td>
      <td class="text-muted" style="font-size:12px">${a.pgto}${a.parcelas?`<div style="font-size:10px">${a.parcelas}x de ${fmtValor(mensalidadeAluno(a))}</div>`:''}</td>
      <td style="white-space:nowrap">
        <button class="btn btn-ghost btn-sm" onclick="abrirPerfilAluno('${a.id}')" title="Perfil do aluno">👤</button>
        <button class="btn btn-ghost btn-sm" onclick="openModalAluno('${a.id}')" style="margin-left:4px" title="Editar">✏️</button>
        <button class="btn btn-ghost btn-sm" onclick="renovar('${a.id}')" style="margin-left:4px" title="Renovar">🔄</button>
        ${btnPagar}${wBtn}
        <button class="btn btn-danger btn-sm" onclick="excluir('${a.id}')" style="margin-left:4px" title="Excluir">🗑</button>
      </td>
    </tr>`;
  }).join('');

  // Só renderiza o HTML se os filtros ainda não existem no DOM
  // (evita recriar o DOM e perder o estado dos filtros)
  const jaTemFiltros = document.getElementById('busca-alunos');
  if (!jaTemFiltros) {
    document.getElementById('content').innerHTML=`
      <div class="section-box">
        <div class="section-header">
          <div class="section-title">Alunos <span id="alunos-count" class="text-muted" style="font-size:14px;font-family:'Barlow',sans-serif;font-weight:400">(${filtered.length}/${alunos.length})</span></div>
          <div class="filters">
            <input class="search-input" id="busca-alunos" type="text" placeholder="🔍 Buscar..." value="${filtroSearch}">
            <select class="filter-select" id="filtro-status">
              <option value="">Todos os status</option>
              <option value="pago" ${filtroStatus==='pago'?'selected':''}>Pago</option>
              <option value="pendente" ${filtroStatus==='pendente'?'selected':''}>Pendente</option>
              <option value="inadimplente" ${filtroStatus==='inadimplente'?'selected':''}>Inadimplente</option>
              <option value="nao_renovou" ${filtroStatus==='nao_renovou'?'selected':''}>Não renovou</option>
              <option value="confirmar" ${filtroStatus==='confirmar'?'selected':''}>A confirmar</option>
            </select>
            <select class="filter-select" id="filtro-plano">
              <option value="">Todos os planos</option>
              <option value="mensal" ${filtroPlano==='mensal'?'selected':''}>Mensal</option>
              <option value="trimestral" ${filtroPlano==='trimestral'?'selected':''}>Trimestral</option>
              <option value="semestral" ${filtroPlano==='semestral'?'selected':''}>Semestral</option>
              <option value="anual" ${filtroPlano==='anual'?'selected':''}>Anual</option>
            </select>
            <select class="filter-select" id="filtro-ordem">
              <option value="az" ${filtroOrdem==='az'?'selected':''}>A → Z</option>
              <option value="za" ${filtroOrdem==='za'?'selected':''}>Z → A</option>
              <option value="venc" ${filtroOrdem==='venc'?'selected':''}>Vencimento</option>
            </select>
            <button class="btn btn-ghost btn-sm" onclick="exportarCSV()">⬇️ CSV</button>
          </div>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Nome</th><th>Plano</th><th>Valor</th><th>Início</th><th>Vencimento</th><th>Status</th><th>Pagamento</th><th>Ações</th></tr></thead>
            <tbody id="alunos-tbody"></tbody>
          </table>
          <div id="alunos-empty" style="display:none"><div class="empty"><div class="empty-icon">🔍</div>Nenhum aluno encontrado.</div></div>
        </div>
      </div>`;

    // Adicionar event listeners reais — funcionam em módulos ES6
    document.getElementById('busca-alunos').addEventListener('input', function() {
      filtroSearch = this.value;
      renderAlunos();
    });
    document.getElementById('filtro-status').addEventListener('change', function() {
      filtroStatus = this.value;
      renderAlunos();
    });
    document.getElementById('filtro-plano').addEventListener('change', function() {
      filtroPlano = this.value;
      renderAlunos();
    });
    document.getElementById('filtro-ordem').addEventListener('change', function() {
      filtroOrdem = this.value;
      renderAlunos();
    });
  }

  // Atualizar só o tbody e o contador — sem recriar os filtros
  const tbody = document.getElementById('alunos-tbody');
  const empty = document.getElementById('alunos-empty');
  const count = document.getElementById('alunos-count');
  if (tbody) tbody.innerHTML = rows;
  if (empty) empty.style.display = rows ? 'none' : '';
  if (count) count.textContent = `(${filtered.length}/${alunos.length})`;

  // Restaurar foco na busca se estava ativo
  const busca = document.getElementById('busca-alunos');
  if (busca && document.activeElement === busca) busca.focus();
}


// ═══════════════════════════════════════════════════
// DESPESAS
// ═══════════════════════════════════════════════════
async function renderDespesasView() {
  loading(true);
  const cats = await loadDespesas(despMes, despAno);
  const catDefs = {
    operacional:   {label:'Colaboradores', icon:'👔', color:'var(--azul)'},
    despesa_op:    {label:'Despesas Operacionais',icon:'🏢', color:'var(--roxo)'},
    administrativo:{label:'Administrativo',       icon:'📋', color:'var(--texto-mid)'},
    marketing:     {label:'Marketing',            icon:'📣', color:'var(--vermelho)'},
    impostos:      {label:'Impostos',             icon:'🧾', color:'#b45309'},
  };
  const tot = totalDesp(cats);

  document.getElementById('content').innerHTML=`
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:12px">
      <div>
        <div style="font-size:12px;color:var(--texto-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Total lançado</div>
        <div style="font-family:'Bebas Neue',sans-serif;font-size:32px;color:var(--vermelho)">${fmtValor(tot)}</div>
      </div>
      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
        <div class="mes-selector">
          <button class="mes-btn" id="btn-desp-prev" onclick="navegarDesp(-1)">◀</button>
          <div class="mes-label" id="label-desp">${MESES_NOMES[despMes]} ${despAno}</div>
          <button class="mes-btn" id="btn-desp-next" onclick="navegarDesp(1)">▶</button>
        </div>
        <button class="btn btn-ghost btn-sm" onclick="copiarMes()" title="Copiar despesas deste mês para os próximos">📋 Copiar mês</button>
      </div>
    </div>
    <div class="desp-grid">
      ${Object.entries(catDefs).map(([cat,info])=>{
        const items=cats[cat]||[];
        const total=items.reduce((a,d)=>a+Number(d.valor),0);
        return `<div class="desp-card">
          <div class="desp-card-title" style="color:${info.color}">${info.icon} ${info.label}</div>
          ${items.map((d,i)=>{
            const tipoBadge=d.tipo&&d.tipo!=='pontual'?`<span class="desp-tipo-badge desp-tipo-${d.tipo}">${d.tipo==='recorrente'?'Recorrente':'Parcelada'}</span>`:'';
            const actions=d.fixo
              ?`<button class="desp-btn" onclick="cancelarProg('${d.progId}')" title="Cancelar a partir deste mês">🚫</button>`
              :`<button class="desp-btn" onclick="editarDesp('${cat}',${i})" title="Editar">✏️</button>
                <button class="desp-btn" onclick="excluirDesp('${cat}',${i})" title="Excluir">🗑</button>`;
            return `<div class="desp-item">
              <span class="desp-nome">${d.desc}</span>
              ${tipoBadge}
              <span class="desp-valor">${fmtValor(d.valor)}</span>
              <div class="desp-actions">${actions}</div>
            </div>`;
          }).join('')}
          <button class="desp-add" onclick="openModalDespNovo('${cat}')">＋ Adicionar item</button>
          <div class="desp-total"><span>Total</span><span>${fmtValor(total)}</span></div>
        </div>`;
      }).join('')}
    </div>`;
}

window.navegarDesp = async function(dir) {
  despMes += dir;
  if (despMes > 11) { despMes = 0; despAno++; }
  if (despMes < 0)  { despMes = 11; despAno--; }
  await renderDespesasView();
};

// ═══════════════════════════════════════════════════
// FINANCEIRO
// ═══════════════════════════════════════════════════
async function renderFinanceiroView() {
  loading(true);
  const cats = await loadDespesas(finMes, finAno);
  const receita = receitaMesEsp(finMes, finAno);
  const catDefs = {
    operacional:   {label:'Colaboradores', icon:'👔', color:'var(--azul)'},
    despesa_op:    {label:'Despesas Operacionais',icon:'🏢', color:'var(--roxo)'},
    administrativo:{label:'Administrativo',       icon:'📋', color:'var(--texto-mid)'},
    marketing:     {label:'Marketing',            icon:'📣', color:'var(--vermelho)'},
    impostos:      {label:'Impostos',             icon:'🧾', color:'#b45309'},
  };
  const totais={};
  let totDesp=0;
  Object.keys(catDefs).forEach(cat=>{totais[cat]=(cats[cat]||[]).reduce((a,d)=>a+Number(d.valor),0);totDesp+=totais[cat];});
  const resultado=receita-totDesp;
  const resPos=resultado>=0;

  // Projeção anual
  const projecao = await Promise.all(Array.from({length:12},async(_,i)=>{
    const d=await loadDespesas(i,finAno);
    const r=receitaMesEsp(i,finAno);
    const td=totalDesp(d);
    return {mes:i,receita:r,desp:td,resultado:r-td,cats:d};
  }));
  const totAnoRec=projecao.reduce((a,p)=>a+p.receita,0);
  const totAnoDesp=projecao.reduce((a,p)=>a+p.desp,0);
  const totAnoRes=totAnoRec-totAnoDesp;

  document.getElementById('content').innerHTML=`
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:12px">
      <div style="display:flex;align-items:center;gap:12px">
        <div class="mes-selector">
          <button class="mes-btn" onclick="navegarFin(-1)">◀</button>
          <div class="mes-label">${MESES_NOMES[finMes]} ${finAno}</div>
          <button class="mes-btn" onclick="navegarFin(1)">▶</button>
        </div>
      </div>
      <button class="btn btn-ghost btn-sm" onclick="setView('despesas')">✏️ Editar despesas</button>
      <button class="btn btn-primary btn-sm" onclick="imprimirDRE()">🖨️ Imprimir Resumo</button>
    </div>

    <!-- 3 CARDS -->
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px">
      <div class="card c-green" style="border-top:3px solid var(--verde)"><div class="card-label">Receita do Mês</div><div class="card-value" style="font-size:24px;padding-top:4px">${fmtValor(receita)}</div><div class="card-sub">alunos ativos em ${MESES_ABREV[finMes]}</div></div>
      <div class="card" style="border-top:3px solid var(--vermelho)"><div class="card-label">Total Despesas</div><div class="card-value" style="font-size:24px;padding-top:4px;color:var(--vermelho)">${fmtValor(totDesp)}</div><div class="card-sub">${receita>0?(totDesp/receita*100).toFixed(1):0}% da receita</div></div>
      <div class="card" style="border-top:3px solid ${resPos?'var(--verde)':'var(--vermelho)'}"><div class="card-label">Resultado</div><div class="card-value" style="font-size:24px;padding-top:4px;color:${resPos?'var(--verde)':'var(--vermelho)'}">${resPos?'':'-'}${fmtValor(Math.abs(resultado))}</div><div class="card-sub">${resPos?'▲ superávit':'▼ déficit'}</div></div>
    </div>

    <!-- RESUMO FINANCEIRO -->
    <div class="section-box" style="margin-bottom:24px">
      <div class="section-header"><div class="section-title">Resumo Financeiro — ${MESES_NOMES[finMes]} ${finAno}</div></div>
      <div style="padding:0">
        <div style="padding:14px 24px;border-bottom:1px solid var(--borda);background:#f9fafb;display:flex;justify-content:space-between;align-items:center">
          <span style="font-weight:700">💰 Receita líquida</span>
          <span style="font-weight:700;color:var(--verde);font-size:15px">${fmtValor(receita)}</span>
        </div>
        ${Object.entries(catDefs).map(([cat,info])=>{
          const pct=receita>0?(totais[cat]/receita*100):0;
          return `<div style="padding:12px 24px;border-bottom:1px solid var(--borda);display:grid;grid-template-columns:1fr auto 120px;align-items:center;gap:12px">
            <span style="font-size:13px;color:var(--texto-mid)">${info.icon} ${info.label}</span>
            <span style="font-weight:700;color:var(--vermelho);white-space:nowrap">${fmtValor(totais[cat])}</span>
            <div>
              <div style="height:5px;background:var(--borda);border-radius:2px;overflow:hidden">
                <div style="height:100%;width:${Math.min(100,pct)}%;background:${info.color};border-radius:2px"></div>
              </div>
              <div style="font-size:10px;color:var(--texto-muted);margin-top:2px">${pct.toFixed(0)}% da receita</div>
            </div>
          </div>`;
        }).join('')}
        <div style="padding:14px 24px;border-bottom:1px solid var(--borda);display:flex;justify-content:space-between;font-weight:700">
          <span>Total despesas</span>
          <span style="color:var(--vermelho)">${fmtValor(totDesp)}</span>
        </div>
        <div style="padding:14px 24px;background:${resPos?'rgba(46,125,50,0.05)':'rgba(211,47,47,0.05)'};display:flex;justify-content:space-between;font-weight:700;font-size:15px">
          <span>Resultado</span>
          <span style="color:${resPos?'var(--verde)':'var(--vermelho)'}">${resPos?'':'-'}${fmtValor(Math.abs(resultado))}</span>
        </div>
      </div>
    </div>

    <!-- PROJEÇÃO ANUAL COM NAVEGAÇÃO DE ANO -->
    <div class="section-box">
      <div class="section-header">
        <div class="section-title">Projeção Anual</div>
        <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
          <div class="mes-selector" style="padding:4px 10px">
            <button class="mes-btn" onclick="navegarAnoPro(-1)">◀</button>
            <div class="mes-label" style="min-width:50px">${finAno}</div>
            <button class="mes-btn" onclick="navegarAnoPro(1)">▶</button>
          </div>
          <div style="font-size:12px;color:var(--texto-muted)">
            Rec: <strong style="color:var(--verde)">${fmtValor(totAnoRec)}</strong> &nbsp;
            Desp: <strong style="color:var(--vermelho)">${fmtValor(totAnoDesp)}</strong> &nbsp;
            Res: <strong style="color:${totAnoRes>=0?'var(--verde)':'var(--vermelho)'}">${totAnoRes>=0?'':'-'}${fmtValor(Math.abs(totAnoRes))}</strong>
          </div>
        </div>
      </div>
      <div style="overflow-x:auto">
        <table>
          <thead><tr><th>Mês</th><th>Receita</th><th>Custos Op.</th><th>Desp. Op.</th><th>Adm.</th><th>Marketing</th><th>Total Desp.</th><th>Resultado</th></tr></thead>
          <tbody>
            ${projecao.map(p=>{
              const isAtual=p.mes===finMes&&finAno===ANO_ATUAL;
              const isFuturo=new Date(finAno,p.mes,1)>HOJE;
              const tops={
                operacional:(p.cats.operacional||[]).reduce((a,x)=>a+Number(x.valor),0),
                despesa_op:(p.cats.despesa_op||[]).reduce((a,x)=>a+Number(x.valor),0),
                administrativo:(p.cats.administrativo||[]).reduce((a,x)=>a+Number(x.valor),0),
                marketing:(p.cats.marketing||[]).reduce((a,x)=>a+Number(x.valor),0),
              };
              return `<tr style="${isAtual?'background:rgba(211,47,47,0.04);font-weight:600':''}${isFuturo?';color:var(--texto-muted)':''}">
                <td style="font-weight:600;white-space:nowrap">${MESES_ABREV[p.mes]}${isFuturo?' <span style="font-size:10px">(proj.)</span>':''}${isAtual?' <span style="font-size:10px;color:var(--vermelho)">◀</span>':''}</td>
                <td style="color:var(--verde);font-weight:600">${fmtValor(p.receita)}</td>
                <td>${fmtValor(tops.operacional)}</td>
                <td>${fmtValor(tops.despesa_op)}</td>
                <td>${fmtValor(tops.administrativo)}</td>
                <td>${fmtValor(tops.marketing)}</td>
                <td style="color:var(--vermelho);font-weight:600">${fmtValor(p.desp)}</td>
                <td style="font-weight:700;color:${p.resultado>=0?'var(--verde)':'var(--vermelho)'}">${p.resultado>=0?'':'-'}${fmtValor(Math.abs(p.resultado))}</td>
              </tr>`;
            }).join('')}
          </tbody>
          <tfoot>
            <tr style="background:#f9fafb;font-weight:700;border-top:2px solid var(--borda)">
              <td>TOTAL</td>
              <td style="color:var(--verde)">${fmtValor(totAnoRec)}</td>
              ${['operacional','despesa_op','administrativo','marketing'].map(cat=>`<td>${fmtValor(projecao.reduce((a,p)=>a+(p.cats[cat]||[]).reduce((x,y)=>x+Number(y.valor),0),0))}</td>`).join('')}
              <td style="color:var(--vermelho)">${fmtValor(totAnoDesp)}</td>
              <td style="color:${totAnoRes>=0?'var(--verde)':'var(--vermelho)'}">${totAnoRes>=0?'':'-'}${fmtValor(Math.abs(totAnoRes))}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>`;
}

window.navegarFin = async function(dir) {
  finMes += dir;
  if (finMes > 11) { finMes = 0; finAno++; }
  if (finMes < 0)  { finMes = 11; finAno--; }
  await renderFinanceiroView();
};
window.navegarAnoPro = async function(dir) {
  finAno += dir;
  await renderFinanceiroView();
};

// ═══════════════════════════════════════════════════
// AÇÕES ALUNOS
// ═══════════════════════════════════════════════════
async function changeStatus(id, s) {
  alunos = alunos.map(a=>a.id===id?{...a,status:s}:a);
  await salvarAlunoDb(alunos.find(a=>a.id===id));
  toast('Status atualizado ✓');
  if(viewAtual==='dashboard') renderDashboard();
  else renderAlunos();
}
window.changeStatus=changeStatus;

function renovar(id) {
  // Abre modal de renovação em vez de renovar direto
  abrirModalRenovacao(id);
}
window.renovar = renovar;

function abrirModalRenovacao(id) {
  const a = alunos.find(x=>x.id===id);
  if (!a) return;

  // D+1 como sugestão de início
  const vencDate = new Date(a.venc);
  vencDate.setDate(vencDate.getDate()+1);
  const novoInicio = vencDate.toISOString().split('T')[0];
  const planoAtual = a.plano;
  const meses = {mensal:1,trimestral:3,semestral:6,anual:12}[planoAtual]||1;
  const novoVenc = addMeses(novoInicio, meses);
  const valorAtual = Number(a.valor);

  const html = `<div style="position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:400;display:flex;align-items:center;justify-content:center;padding:16px" id="modal-renov-overlay">
    <div style="background:#fff;border-radius:12px;padding:0;width:100%;max-width:500px;box-shadow:var(--shadow-lg);max-height:90vh;overflow-y:auto">
      <div style="padding:20px 24px 0;display:flex;align-items:center;justify-content:space-between">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:22px">Renovar Contrato</div>
        <button onclick="document.getElementById('modal-renov-overlay').remove()" style="background:none;border:none;font-size:20px;cursor:pointer;color:#999">✕</button>
      </div>
      <div style="padding:8px 24px;font-size:13px;color:var(--texto-muted);border-bottom:1px solid var(--borda);margin-bottom:0">
        <strong>${a.nome}</strong> — contrato atual: ${fmtData(a.inicio)} → ${fmtData(a.venc)}
      </div>
      <div style="padding:20px 24px">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Novo plano</label>
            <select class="form-select" id="renov-plano" onchange="calcRenovVenc()">
              <option value="mensal" ${planoAtual==='mensal'?'selected':''}>Mensal</option>
              <option value="trimestral" ${planoAtual==='trimestral'?'selected':''}>Trimestral</option>
              <option value="semestral" ${planoAtual==='semestral'?'selected':''}>Semestral</option>
              <option value="anual" ${planoAtual==='anual'?'selected':''}>Anual</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Valor total (R$)</label>
            <input class="form-input" type="number" id="renov-valor" value="${valorAtual}" step="0.01" onchange="calcRenovMens()">
            <div class="form-hint" id="renov-mens-hint"></div>
          </div>
          <div class="form-group">
            <label class="form-label">Início do novo contrato</label>
            <input class="form-input" type="date" id="renov-inicio" value="${novoInicio}" onchange="calcRenovVenc()">
            <div class="form-hint">Sugestão: D+1 do vencimento atual</div>
          </div>
          <div class="form-group">
            <label class="form-label">Vencimento (calculado)</label>
            <input class="form-input" type="date" id="renov-venc" value="${novoVenc}">
            <div class="form-hint">Editável manualmente se necessário</div>
          </div>
          <div class="form-group">
            <label class="form-label">Forma de pagamento</label>
            <select class="form-select" id="renov-pgto" onchange="toggleRenovParcelas()">
              <option value="PIX" ${a.pgto==='PIX'?'selected':''}>PIX</option>
              <option value="Cartão" ${a.pgto==='Cartão'?'selected':''}>Cartão de crédito</option>
              <option value="Dinheiro" ${a.pgto==='Dinheiro'?'selected':''}>Dinheiro</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Recebimento</label>
            <select class="form-select" id="renov-recebimento">
              <option value="avista" ${(a.recebimento||'avista')==='avista'?'selected':''}>À vista</option>
              <option value="mensal" ${a.recebimento==='mensal'?'selected':''}>Mensal (PIX recorrente)</option>
            </select>
          </div>
          <div class="form-group" id="renov-parcelas-group" style="display:none">
            <label class="form-label">Parcelamento</label>
            <select class="form-select" id="renov-parcelas" onchange="calcRenovMens()">
              <option value="">À vista</option>
              ${[2,3,4,5,6,7,8,9,10,11,12].map(n=>`<option value="${n}">${n}x</option>`).join('')}
            </select>
            <div class="form-hint" id="renov-parc-hint"></div>
          </div>
          <div class="form-group full">
            <label class="form-label">Observações</label>
            <input class="form-input" type="text" id="renov-obs" placeholder="Ex: Mudou de trimestral para anual">
          </div>
        </div>
      </div>
      <div style="padding:16px 24px 20px;border-top:1px solid var(--borda);display:flex;justify-content:flex-end;gap:8px">
        <button class="btn btn-ghost" onclick="document.getElementById('modal-renov-overlay').remove()">Cancelar</button>
        <button class="btn btn-primary" onclick="confirmarRenovacao('${id}')">🔄 Confirmar Renovação</button>
      </div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
  calcRenovMens();
}
window.abrirModalRenovacao = abrirModalRenovacao;

window.calcRenovVenc = function() {
  const plano = document.getElementById('renov-plano')?.value;
  const inicio = document.getElementById('renov-inicio')?.value;
  if (!plano || !inicio) return;
  const meses = {mensal:1,trimestral:3,semestral:6,anual:12}[plano]||1;
  document.getElementById('renov-venc').value = addMeses(inicio, meses);
  calcRenovMens();
};

window.calcRenovMens = function() {
  const valor = parseFloat(document.getElementById('renov-valor')?.value)||0;
  const plano = document.getElementById('renov-plano')?.value||'mensal';
  const parc  = parseInt(document.getElementById('renov-parcelas')?.value)||0;
  const div   = {mensal:1,trimestral:3,semestral:6,anual:12}[plano]||1;
  const hint  = document.getElementById('renov-mens-hint');
  const hintP = document.getElementById('renov-parc-hint');
  if (hint) hint.textContent = valor > 0 ? `Mensalidade: R$ ${(valor/div).toLocaleString('pt-BR',{minimumFractionDigits:2})}` : '';
  if (hintP && parc >= 2 && valor > 0) hintP.textContent = `${parc}x de R$ ${(valor/parc).toLocaleString('pt-BR',{minimumFractionDigits:2})}`;
};

window.toggleRenovParcelas = function() {
  const pgto = document.getElementById('renov-pgto')?.value;
  const grp  = document.getElementById('renov-parcelas-group');
  if (grp) grp.style.display = pgto==='Cartão' ? '' : 'none';
};

async function confirmarRenovacao(id) {
  const a = alunos.find(x=>x.id===id);
  if (!a) return;
  const plano      = document.getElementById('renov-plano').value;
  const valor      = parseFloat(document.getElementById('renov-valor').value)||0;
  const inicio     = document.getElementById('renov-inicio').value;
  const venc       = document.getElementById('renov-venc').value;
  const pgto       = document.getElementById('renov-pgto').value;
  const receb      = document.getElementById('renov-recebimento').value;
  const parcelas   = document.getElementById('renov-parcelas')?.value||null;
  const obs        = document.getElementById('renov-obs').value;
  if (!inicio || !venc || valor <= 0) { alert('Preencha todos os campos obrigatórios.'); return; }

  const div = {mensal:1,trimestral:3,semestral:6,anual:12}[plano]||1;
  const at = {...a, plano, valor, inicio, venc, pgto, recebimento:receb,
    parcelas: parcelas ? parseInt(parcelas) : null, status:'pendente'};
  alunos = alunos.map(x=>x.id===id?at:x);
  await salvarAlunoDb(at);

  // Histórico
  const reg = {
    id:gerarId(), alunoId:id, alunoNome:a.nome,
    data:new Date().toISOString().split('T')[0],
    plano, valor, mensalidade: valor/div,
    inicio, venc, pgto, recebimento:receb,
    tipo:`Renovação — ${plano}`, obs, ts:Date.now()
  };
  await setDoc(doc(db,'historico',reg.id), reg);
  await registrarAuditoria('renovacao_contrato',id,a.nome,
    {plano:a.plano,valor:a.valor,venc:a.venc},{plano,valor,venc});

  document.getElementById('modal-renov-overlay').remove();
  toast(`${a.nome} renovado até ${fmtData(venc)} 🔄`);
  if (viewAtual==='alunos') renderAlunos();
  else if (viewAtual==='dashboard') renderDashboard();
  else abrirPerfilAluno(id);
}
window.confirmarRenovacao = confirmarRenovacao;

async function excluir(id) {
  const a=alunos.find(x=>x.id===id);
  if(!confirm(`Arquivar ${a?.nome}? O registro ficará na trilha de auditoria.`)) return;
  // Soft delete — marcar como arquivado
  const at={...a, status:'arquivado', arquivado_em:new Date().toISOString().split('T')[0]};
  await salvarAlunoDb(at);
  await registrarAuditoria('exclusao_aluno',id,a.nome,{...a},{status:'arquivado'});
  alunos=alunos.filter(x=>x.id!==id);
  toast('Aluno arquivado. Pode ser restaurado na trilha de auditoria.');
  render();
}
window.excluir=excluir;

function exportarCSV() {
  const header='Nome,Plano,Valor,Início,Vencimento,Status,Pagamento,WhatsApp\n';
  const rows=alunos.map(a=>`"${a.nome}","${a.plano}","${a.valor}","${a.inicio}","${a.venc}","${a.status}","${a.pgto}","${a.whats||''}"`).join('\n');
  const blob=new Blob([header+rows],{type:'text/csv;charset=utf-8;'});
  const url=URL.createObjectURL(blob);
  const link=document.createElement('a');
  link.href=url; link.download='alunos_studiofb.csv'; link.click();
  URL.revokeObjectURL(url);
  toast('CSV exportado ✓');
}
window.exportarCSV=exportarCSV;

// ═══════════════════════════════════════════════════
// MODAL ALUNO
// ═══════════════════════════════════════════════════
function openModalAluno(id) {
  editandoId=id||null;
  document.getElementById('modal-aluno-title').textContent=id?'Editar Aluno':'Cadastrar Aluno';
  if(id) {
    const a=alunos.find(x=>x.id===id);
    document.getElementById('f-nome').value=a.nome;
    document.getElementById('f-whats').value=a.whats||'';
    document.getElementById('f-nascimento').value=dataNascimentoAluno(a);
    document.getElementById('f-plano').value=a.plano;
    document.getElementById('f-valor').value=a.valor;
    document.getElementById('f-inicio').value=a.inicio;
    document.getElementById('f-venc').value=a.venc;
    document.getElementById('f-pgto').value=a.pgto;
    document.getElementById('f-recebimento').value=a.recebimento||'avista';
    document.getElementById('f-status').value=a.status;
    // Mostrar campo parcelas se cartão
    if(a.pgto==='Cartão'){
      document.getElementById('f-parcelas-group').style.display='';
      document.getElementById('f-parcelas').value=a.parcelas||'';
    } else {
      document.getElementById('f-parcelas-group').style.display='none';
    }
    document.getElementById('f-obs').value=a.obs||'';
  } else {
    const hoje=HOJE.toISOString().split('T')[0];
    document.getElementById('f-nome').value='';
    document.getElementById('f-whats').value='';
    document.getElementById('f-nascimento').value='';
    document.getElementById('f-plano').value='mensal';
    document.getElementById('f-valor').value='400';
    document.getElementById('f-inicio').value=hoje;
    document.getElementById('f-venc').value=addMeses(hoje,1);
    document.getElementById('f-pgto').value='PIX';
    document.getElementById('f-recebimento').value='mensal';
    document.getElementById('f-status').value='pendente';
    document.getElementById('f-obs').value='';
  }
  document.getElementById('modal-aluno').classList.add('open');
}
window.openModalAluno=openModalAluno;
function closeModalAluno(){document.getElementById('modal-aluno').classList.remove('open');}
window.closeModalAluno=closeModalAluno;

window.autoPreencherPlano=function(){
  const p=document.getElementById('f-plano').value;
  const i=document.getElementById('f-inicio').value;
  if(!i) return;
  document.getElementById('f-venc').value=addMeses(i,{mensal:1,trimestral:3,semestral:6,anual:12}[p]);
  if(!editandoId) document.getElementById('f-valor').value={mensal:400,trimestral:1100,semestral:2100,anual:4000}[p];
};

async function salvarAluno() {
  const nome=document.getElementById('f-nome').value.trim();
  if(!nome){alert('Informe o nome.');return;}
  const parcelasVal = document.getElementById('f-parcelas')?.value || '';
  const obj={nome,whats:document.getElementById('f-whats').value,nascimento:document.getElementById('f-nascimento').value||'',plano:document.getElementById('f-plano').value,valor:parseFloat(document.getElementById('f-valor').value)||0,inicio:document.getElementById('f-inicio').value,venc:document.getElementById('f-venc').value,pgto:document.getElementById('f-pgto').value,parcelas:parcelasVal?parseInt(parcelasVal):null,recebimento:document.getElementById('f-recebimento').value,status:document.getElementById('f-status').value,obs:document.getElementById('f-obs').value};
  if(editandoId){
    const antes = alunos.find(a=>a.id===editandoId);
    const at={...antes,...obj};
    alunos=alunos.map(a=>a.id===editandoId?at:a);
    await salvarAlunoDb(at);
    await registrarAuditoria('edicao_aluno',editandoId,obj.nome,
      {nome:antes.nome,plano:antes.plano,valor:antes.valor,venc:antes.venc,status:antes.status},
      {nome:obj.nome,plano:obj.plano,valor:obj.valor,venc:obj.venc,status:obj.status});
    toast('Aluno atualizado ✓');
  } else {
    const novo={id:gerarId(),...obj};
    alunos.push(novo);
    await salvarAlunoDb(novo);
    await registrarAuditoria('cadastro_aluno',novo.id,obj.nome,{},{...obj});
    toast('Aluno cadastrado ✓');
  }
  closeModalAluno(); render();
}
window.salvarAluno=salvarAluno;

// ═══════════════════════════════════════════════════
// MODAL DESPESA
// ═══════════════════════════════════════════════════
function popularSelectFim() {
  const sel=document.getElementById('df-fim-mes');
  sel.innerHTML='';
  for(let a=despAno;a<=despAno+3;a++){
    for(let m=0;m<12;m++){
      if(a===despAno&&m<despMes) continue;
      const opt=document.createElement('option');
      opt.value=`${a}_${m}`;
      opt.textContent=`${MESES_NOMES[m]} ${a}`;
      sel.appendChild(opt);
    }
  }
}

window.onTipoChange=function(){
  const t=document.getElementById('df-tipo').value;
  document.getElementById('df-fim-group').style.display=t==='recorrente'?'':'none';
  document.getElementById('df-parcelas-group').style.display=t==='parcelada'?'':'none';
  if(t==='parcelada'){
    document.getElementById('df-parcelas').oninput=function(){
      const n=parseInt(this.value)||0;
      if(n>1){
        const fim=new Date(despAno,despMes+n-1,1);
        document.getElementById('df-parcelas-hint').textContent=`Última parcela: ${MESES_NOMES[fim.getMonth()]} ${fim.getFullYear()}`;
      }
    };
  }
};

function openModalDespNovo(cat) {
  despCatAtual=cat; despIdxAtual=null; despEditando=false;
  document.getElementById('modal-desp-title').textContent='Adicionar Despesa';
  document.getElementById('df-cat').value=cat;
  document.getElementById('df-cat').disabled=false;
  document.getElementById('df-desc').value='';
  document.getElementById('df-desc').disabled=false;
  document.getElementById('df-valor').value='';
  document.getElementById('df-tipo').value='pontual';
  document.getElementById('df-tipo-group').style.display='';
  document.getElementById('df-fim-group').style.display='none';
  document.getElementById('df-parcelas-group').style.display='none';
  popularSelectFim();
  document.getElementById('modal-desp').classList.add('open');
}
window.openModalDespNovo=openModalDespNovo;

async function editarDesp(cat, idx) {
  despCatAtual=cat; despIdxAtual=idx; despEditando=true;
  const cats=await loadDespesas(despMes,despAno);
  const item=cats[cat][idx];
  document.getElementById('modal-desp-title').textContent='Editar Despesa';
  document.getElementById('df-cat').value=cat;
  document.getElementById('df-cat').disabled=true;
  document.getElementById('df-desc').value=item.desc;
  document.getElementById('df-desc').disabled=true;
  document.getElementById('df-valor').value=item.valor;
  document.getElementById('df-tipo').value='pontual';
  document.getElementById('df-tipo-group').style.display='none';
  document.getElementById('df-fim-group').style.display='none';
  document.getElementById('df-parcelas-group').style.display='none';
  document.getElementById('modal-desp').classList.add('open');
}
window.editarDesp=editarDesp;

function closeModalDesp(){document.getElementById('modal-desp').classList.remove('open');}
window.closeModalDesp=closeModalDesp;

async function salvarDesp() {
  const desc=document.getElementById('df-desc').value.trim();
  const valor=parseFloat(document.getElementById('df-valor').value)||0;
  const tipo=document.getElementById('df-tipo').value;
  despCatAtual = document.getElementById('df-cat')?.value || despCatAtual;
  if(!desc){alert('Informe a descrição.');return;}

  const cats=await loadDespesas(despMes,despAno);

  if(despEditando && despIdxAtual!==null) {
    // Edição simples de valor
    cats[despCatAtual][despIdxAtual].valor=valor;
    await saveDespesas(despMes,despAno,cats);
    toast('Despesa atualizada ✓');

  } else if(tipo==='pontual') {
    cats[despCatAtual]=[...( cats[despCatAtual]||[]),{desc,valor,tipo:'pontual'}];
    await saveDespesas(despMes,despAno,cats);
    toast('Despesa lançada ✓');

  } else if(tipo==='recorrente') {
    const fimStr=document.getElementById('df-fim-mes').value;
    const [fimAnoS,fimMesS]=fimStr.split('_');
    const prog={id:gerarId(),desc,valor,tipo:'recorrente',cat:despCatAtual,iniMes:despMes,iniAno:despAno,fimMes:parseInt(fimMesS),fimAno:parseInt(fimAnoS)};
    await salvarProgramada(prog);
    despCache={}; // invalidar cache para recarregar com a nova programada
    toast('Despesa recorrente criada ✓');

  } else if(tipo==='parcelada') {
    const n=parseInt(document.getElementById('df-parcelas').value)||0;
    if(n<2){alert('Informe ao menos 2 parcelas.');return;}
    const fimMesCalc=(despMes+n-1)%12;
    const fimAnoCalc=despAno+Math.floor((despMes+n-1)/12);
    const prog={id:gerarId(),desc,valor,tipo:'parcelada',cat:despCatAtual,iniMes:despMes,iniAno:despAno,fimMes:fimMesCalc,fimAno:fimAnoCalc,totalParcelas:n};
    await salvarProgramada(prog);
    despCache={};
    toast(`Parcelamento em ${n}x criado ✓`);
  }

  closeModalDesp();
  await renderDespesasView();
}
window.salvarDesp=salvarDesp;

async function excluirDesp(cat, idx) {
  if(!confirm('Remover esta despesa?')) return;
  const cats=await loadDespesas(despMes,despAno);
  cats[cat].splice(idx,1);
  await saveDespesas(despMes,despAno,cats);
  despCache[chaveDesp(despMes,despAno)]=null;
  toast('Despesa removida.');
  await renderDespesasView();
}
window.excluirDesp=excluirDesp;

async function cancelarProg(progId) {
  if(!confirm('Cancelar esta despesa a partir deste mês?')) return;
  // Ajustar fim para o mês anterior ao atual
  const prog=(await carregarProgramadas()).find(p=>p.id===progId);
  if(!prog) return;
  let novoFimMes=despMes-1, novoFimAno=despAno;
  if(novoFimMes<0){novoFimMes=11;novoFimAno--;}
  if(novoFimAno<prog.iniAno||(novoFimAno===prog.iniAno&&novoFimMes<prog.iniMes)){
    // Encerra antes do início — excluir totalmente
    await excluirProgramada(progId);
    toast('Despesa programada removida.');
  } else {
    await salvarProgramada({...prog,fimMes:novoFimMes,fimAno:novoFimAno});
    toast('Despesa cancelada a partir deste mês ✓');
  }
  despCache={};
  await renderDespesasView();
}
window.cancelarProg=cancelarProg;

// ═══════════════════════════════════════════════════
// HISTÓRICO DE PAGAMENTOS
// ═══════════════════════════════════════════════════
async function verHistorico(alunoId, alunoNome) {
  // Buscar histórico no Firestore
  let registros = [];
  try {
    const snap = await getDocs(collection(db,'historico'));
    registros = snap.docs.map(d=>d.data()).filter(r=>r.alunoId===alunoId)
      .sort((a,b)=>new Date(b.data)-new Date(a.data));
  } catch(e) {}

  const html = registros.length
    ? registros.map(r=>`
        <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid var(--borda)">
          <div>
            <div style="font-weight:600;font-size:13.5px">Renovação — ${fmtData(r.data)}</div>
            <div style="font-size:12px;color:var(--texto-muted)">Venc. anterior: ${fmtData(r.vencAnterior)} → Novo: ${fmtData(r.novoVenc)}</div>
          </div>
          <div style="text-align:right">
            <div style="font-weight:700;color:var(--verde)">${fmtValor(r.valor)}</div>
            <div style="font-size:11px;color:var(--texto-muted)">${r.plano}</div>
          </div>
        </div>`).join('')
    : `<div class="empty"><div class="empty-icon">📋</div>Nenhuma renovação registrada ainda.</div>`;

  // Mostrar em modal genérico
  document.getElementById('modal-hist-title').textContent = `Histórico — ${alunoNome}`;
  document.getElementById('modal-hist-body').innerHTML = html;
  document.getElementById('modal-hist').classList.add('open');
}
window.verHistorico = verHistorico;

// ═══════════════════════════════════════════════════
// FECHAR MODAIS
// ═══════════════════════════════════════════════════
['modal-aluno','modal-desp','modal-hist'].forEach(id=>{
  document.getElementById(id).addEventListener('click',function(e){
    if(e.target===this) {
      if(id==='modal-aluno') closeModalAluno();
      else if(id==='modal-desp') closeModalDesp();
      else this.classList.remove('open');
    }
  });
});

// ═══════════════════════════════════════════════════
// STATUS AUTOMÁTICO DE CONTRATO
// ═══════════════════════════════════════════════════
function statusContrato(a) {
  // Retorna objeto com statusContrato e statusPgto para exibição
  const dias = diasAte(a.venc);
  const contratoVigente = dias >= 0;
  const rec = a.recebimento || 'avista';

  // Contrato vencido
  if (!contratoVigente) {
    if (a.status === 'nao_renovou') return {contrato:'nao_renovou', label:'Não renovou', cor:'var(--roxo)', icon:'❌'};
    return {contrato:'a_renovar', label:'A renovar', cor:'#b45309', icon:'📋'};
  }

  // Contrato vigente — verificar pagamento
  if (a.status === 'confirmar') return {contrato:'confirmar', label:'A confirmar', cor:'#6b7280', icon:'❓'};
  if (a.status === 'inadimplente') return {contrato:'inadimplente', label:'Inadimplente', cor:'var(--vermelho)', icon:'🔴'};

  // À vista — pago de uma vez, não precisa controle mensal
  if (rec === 'avista') {
    if (a.status === 'pago') return {contrato:'ativo', label:'Ativo', cor:'var(--verde)', icon:'✅'};
    return {contrato:'aguardando', label:'Aguardando', cor:'var(--azul)', icon:'⏳'};
  }

  // Mensal — verificar se pagou este mês
  const chave = `pgto_${ANO_ATUAL}_${String(MES_ATUAL).padStart(2,'0')}_${a.id}`;
  const pagouEsteMes = sessionStorage.getItem(chave) === '1' || a.status === 'pago';
  if (pagouEsteMes) return {contrato:'ativo', label:'Ativo', cor:'var(--verde)', icon:'✅'};
  // Verificar se está em atraso (já passamos do dia 10 do mês)
  const diaAtual = HOJE.getDate();
  if (diaAtual > 10) return {contrato:'em_atraso', label:'Em atraso', cor:'var(--vermelho)', icon:'⚠️'};
  return {contrato:'aguardando', label:'Aguardando pgto', cor:'var(--azul)', icon:'⏳'};
}

// ═══════════════════════════════════════════════════
// REGISTRAR PAGAMENTO MENSAL
// ═══════════════════════════════════════════════════
async function registrarPagamento(id) {
  const a = alunos.find(x=>x.id===id);
  if (!a) return;
  const chave = `pgto_${ANO_ATUAL}_${String(MES_ATUAL).padStart(2,'0')}_${id}`;
  sessionStorage.setItem(chave, '1');
  // Salvar no histórico
  const registro = {
    id: gerarId(), alunoId: id, alunoNome: a.nome,
    data: HOJE.toISOString().split('T')[0],
    mes: MES_ATUAL, ano: ANO_ATUAL,
    plano: a.plano, valor: mensalidadeAluno(a),
    tipo: 'pagamento_mensal', ts: Date.now()
  };
  await setDoc(doc(db,'historico',registro.id), registro);
  toast(`✅ Pagamento de ${a.nome} registrado!`);
  renderAlunos();
}
window.registrarPagamento = registrarPagamento;


// ═══════════════════════════════════════════════════
// NAVEGAÇÃO RÁPIDA DO DASHBOARD
// ═══════════════════════════════════════════════════
function irParaAlunos(filtro) {
  filtroStatus = filtro === 'vencendo' ? '' : filtro;
  // Para vencendo — filtrar por dias até vencimento
  if (filtro === 'vencendo') {
    filtroStatus = '_vencendo10'; // flag especial tratada no renderAlunos
  }
  setView('alunos');
}
window.irParaAlunos = irParaAlunos;

// ═══════════════════════════════════════════════════
// PARCELAS NO CARTÃO
// ═══════════════════════════════════════════════════
window.toggleParcelas = function() {
  const pgto = document.getElementById('f-pgto').value;
  const grp = document.getElementById('f-parcelas-group');
  grp.style.display = pgto === 'Cartão' ? '' : 'none';
  if (pgto !== 'Cartão') document.getElementById('f-parcelas').value = '';
  calcParcela();
};
window.calcParcela = function() {
  const n = parseInt(document.getElementById('f-parcelas').value) || 0;
  const valor = parseFloat(document.getElementById('f-valor').value) || 0;
  const hint = document.getElementById('f-parcela-hint');
  if (n >= 2 && valor > 0) {
    hint.textContent = `${n}x de R$ ${(valor/n).toLocaleString('pt-BR',{minimumFractionDigits:2})}`;
  } else {
    hint.textContent = '';
  }
};

// ═══════════════════════════════════════════════════
// ÁREA DO ALUNO — PERFIL COMPLETO
// ═══════════════════════════════════════════════════
async function abrirPerfilAluno(id) {
  const a = alunos.find(x=>x.id===id);
  if (!a) return;

  // Carregar histórico
  let historico = [];
  try {
    const snap = await getDocs(collection(db,'historico'));
    historico = snap.docs.map(d=>d.data()).filter(h=>h.alunoId===id&&h.status!=='excluido').sort((a,b)=>b.ts-a.ts);
  } catch(e) {}

  // Carregar férias
  let ferias = a.ferias || [];
  const limiteDias = {mensal:0,trimestral:7,semestral:15,anual:30}[a.plano]||0;
  const diasUsados = ferias.reduce((acc,f)=>{
    const ini = new Date(f.inicio), fim = new Date(f.fim);
    return acc + Math.max(0,Math.round((fim-ini)/86400000)+1);
  },0);
  const diasRestantes = Math.max(0, limiteDias - diasUsados);

  const sc = statusContrato(a);
  const mens = mensalidadeAluno(a);
  const freq = a.frequencia || 3;

  // Calcular vencimento ajustado pelas férias
  let vencAjustado = a.venc;
  if (ferias.length > 0 && limiteDias > 0) {
    const treinsosRepor = Math.round(diasUsados / 7 * freq);
    const diasExtras = Math.round(treinsosRepor / freq * 7);
    vencAjustado = addMeses(a.venc, 0);
    const vencDate = new Date(a.venc);
    vencDate.setDate(vencDate.getDate() + diasExtras);
    vencAjustado = vencDate.toISOString().split('T')[0];
  }

  const feriasHtml = ferias.length
    ? ferias.map((f,i)=>{
        const dias = Math.max(0,Math.round((new Date(f.fim)-new Date(f.inicio))/86400000)+1);
        const treinos = Math.round(dias/7*freq);
        return `<div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--borda)">
          <div style="flex:1"><span style="font-weight:600">${fmtData(f.inicio)} → ${fmtData(f.fim)}</span>
          <span style="font-size:11px;color:var(--texto-muted);margin-left:8px">${dias} dias · ${treinos} treino(s) a repor</span></div>
          <button class="btn btn-ghost btn-sm" onclick="editarFerias('${id}',${i},${limiteDias},${diasUsados - dias})">✏️</button>
          <button class="btn btn-danger btn-sm" onclick="excluirFerias('${id}',${i})">🗑</button>
        </div>`;
      }).join('')
    : '<div style="color:var(--texto-muted);font-size:13px;padding:8px 0">Nenhum período de férias registrado.</div>';

  const histHtml = historico.length
    ? historico.slice(0,20).map(h=>{
        const isRenovacao = h.tipo && h.tipo.startsWith('Renovação');
        const label = h.tipo==='pagamento_mensal' ? '💰 Pagamento mensal'
          : isRenovacao ? `🔄 ${h.tipo}` : `📋 ${h.tipo||'Registro'}`;
        const detalhe = isRenovacao && h.inicio && h.venc
          ? `<div style="font-size:11px;color:var(--texto-muted);margin-top:2px">${fmtData(h.inicio)} → ${fmtData(h.venc)} · Registrado em ${fmtData(h.data)}</div>`
          : `<div style="font-size:11px;color:var(--texto-muted)">${fmtData(h.data)} · ${h.plano||a.plano}</div>`;
        const editBtn = isRenovacao
          ? `<button class="btn btn-ghost btn-sm" onclick="editarRenovacaoHistorico('${id}','${h.id}')" title="Editar renovação">✏️</button>`
          : `<button class="btn btn-ghost btn-sm" onclick="editarHistorico('${id}','${a.nome}','${h.id}')" title="Editar">✏️</button>`;
        return `<div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--borda)">
          <div style="flex:1">
            <div style="font-weight:600;font-size:13px">${label}</div>
            ${detalhe}
          </div>
          <div style="font-weight:700;color:var(--verde);margin-right:8px">${fmtValor(h.valor||h.mensalidade||0)}</div>
          ${editBtn}
          <button class="btn btn-danger btn-sm" onclick="excluirHistorico('${id}','${h.id}')" title="Excluir">🗑</button>
        </div>`;
      }).join('')
    : '<div style="color:var(--texto-muted);font-size:13px;padding:8px 0">Nenhum histórico encontrado.</div>';

  document.getElementById('content').innerHTML = `
    <div style="margin-bottom:20px">
      <button class="btn btn-ghost btn-sm" onclick="setView('alunos')">← Voltar para Alunos</button>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px">
      <!-- DADOS DO ALUNO -->
      <div class="section-box">
        <div class="section-header">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${sc.cor};box-shadow:0 0 0 3px ${sc.cor}33"></span>
            <div class="section-title">${a.nome}</div>
          </div>
          <button class="btn btn-ghost btn-sm" onclick="openModalAluno('${a.id}')">✏️ Editar</button>
        </div>
        <div style="padding:16px 24px">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            ${[
              ['Plano', `${a.plano.charAt(0).toUpperCase()+a.plano.slice(1)}`],
              ['Mensalidade', fmtValor(mens)],
              ['Valor total', fmtValor(Number(a.valor))],
              ['Pagamento', a.pgto + (a.parcelas ? ` ${a.parcelas}x` : '')],
              ['Recebimento', a.recebimento==='mensal'?'Mensal':'À vista'],
              ['WhatsApp', a.whats||'—'],
              ['Nascimento', dataNascimentoAluno(a) ? fmtData(dataNascimentoAluno(a)) : '—'],
              ['Idade', calcularIdade(dataNascimentoAluno(a))!==null ? calcularIdade(dataNascimentoAluno(a))+' anos' : '—'],
              ['Aniversário', dataNascimentoAluno(a) ? fmtAniversario(dataNascimentoAluno(a)) : '—'],
            ].map(([l,v])=>`<div><div style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--texto-muted);margin-bottom:3px">${l}</div><div style="font-weight:600">${v}</div></div>`).join('')}
          </div>
          ${a.obs ? `<div style="margin-top:12px;padding:8px 12px;background:var(--cinza-light);border-radius:6px;font-size:12px;color:var(--texto-muted)">${a.obs}</div>` : ''}
        </div>
      </div>

      <!-- CONTRATO -->
      <div class="section-box">
        <div class="section-header"><div class="section-title">Contrato Atual</div>
          <button class="btn btn-primary btn-sm" onclick="renovar('${a.id}')">🔄 Renovar</button>
        </div>
        <div style="padding:16px 24px">
          <div style="margin-bottom:12px">
            <span class="badge badge-${sc.contrato}" style="color:${sc.cor};background:${sc.cor}18;font-size:12px">${sc.icon} ${sc.label}</span>
          </div>
          ${[
            ['Início', fmtData(a.inicio)],
            ['Vencimento original', fmtData(a.venc)],
            ['Vencimento ajustado', vencAjustado !== a.venc ? fmtData(vencAjustado)+' (com férias)' : fmtData(a.venc)],
            ['Dias até vencer', diasAte(a.venc)<0 ? Math.abs(diasAte(a.venc))+'d em atraso' : diasAte(a.venc)+'d'],
          ].map(([l,v])=>`<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--borda);font-size:13px"><span style="color:var(--texto-muted)">${l}</span><span style="font-weight:600">${v}</span></div>`).join('')}
          <div style="margin-top:12px">${progressPlano(a)}</div>
          ${a.recebimento==='mensal' ? `<button class="btn btn-success btn-sm" onclick="registrarPagamento('${a.id}')" style="margin-top:12px;width:100%">💰 Registrar Pagamento do Mês</button>` : ''}
        </div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px">
      <!-- FÉRIAS -->
      <div class="section-box">
        <div class="section-header">
          <div>
            <div class="section-title">Férias / Trancamento</div>
            ${limiteDias>0 ? `<div style="font-size:12px;color:var(--texto-muted)">${diasUsados}/${limiteDias} dias usados · ${diasRestantes} restantes</div>` : '<div style="font-size:12px;color:var(--texto-muted)">Plano mensal — sem direito a férias</div>'}
          </div>
          ${limiteDias>0 ? `<button class="btn btn-ghost btn-sm" onclick="abrirModalFerias('${a.id}')">+ Adicionar</button>` : ''}
        </div>
        <div style="padding:12px 24px">
          ${limiteDias>0 ? `
          <div style="margin-bottom:12px">
            <div style="height:8px;background:var(--borda);border-radius:4px;overflow:hidden">
              <div style="height:100%;width:${Math.min(100,diasUsados/limiteDias*100)}%;background:${diasRestantes===0?'var(--vermelho)':'var(--amarelo)'};border-radius:4px"></div>
            </div>
            <div style="font-size:11px;color:var(--texto-muted);margin-top:4px">
              Freq: ${freq}x/semana · Treinos perdidos: ${Math.round(diasUsados/7*freq)} · Dias extras: ${Math.round(Math.round(diasUsados/7*freq)/freq*7)}
            </div>
          </div>
          ${feriasHtml}` : '<div style="color:var(--texto-muted);font-size:13px">Plano mensal não tem direito a férias.</div>'}
        </div>
      </div>

      <!-- FREQUÊNCIA -->
      <div class="section-box">
        <div class="section-header"><div class="section-title">Configuração de Treino</div></div>
        <div style="padding:16px 24px">
          <div class="form-group">
            <label class="form-label">Frequência semanal (dias/semana)</label>
            <select class="form-select" id="select-freq-${a.id}" onchange="salvarFrequencia('${a.id}',this.value)">
              ${[1,2,3,4,5,6,7].map(n=>`<option value="${n}" ${freq===n?'selected':''}>${n}x por semana</option>`).join('')}
            </select>
          </div>
          <div style="margin-top:12px">
            <button class="btn btn-primary btn-sm" onclick="abrirModalEncaixarTurma('${a.id}')" style="width:100%">📅 Encaixar em Turmas</button>
          </div>
          ${(a.turmas||[]).length ? `<div style="margin-top:12px;padding:10px;background:var(--cinza-light);border-radius:6px">
            <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--texto-muted);margin-bottom:6px">Turmas atuais</div>
            ${(a.turmas||[]).map(t=>`<div style="font-size:12px;padding:3px 0">${t.dia} — ${t.horario}</div>`).join('')}
          </div>` : ''}
          <div style="margin-top:16px;padding:12px;background:var(--cinza-light);border-radius:6px;font-size:12px;color:var(--texto-muted)">
            Com ${freq}x/semana e ${diasUsados} dias de férias:<br>
            → ${Math.round(diasUsados/7*freq)} treino(s) a repor<br>
            → +${Math.round(Math.round(diasUsados/7*freq)/freq*7)} dias no contrato
          </div>
        </div>
      </div>
    </div>

    <!-- HISTÓRICO DE PAGAMENTOS -->
    <div class="section-box">
      <div class="section-header">
        <div class="section-title">Histórico de Pagamentos</div>
        <button class="btn btn-ghost btn-sm" onclick="abrirModalLancarPgto('${a.id}','${a.nome}')">+ Lançar</button>
      </div>
      <div style="padding:12px 24px">
        ${histHtml}
        ${historico.length>10?`<div style="text-align:center;padding:8px;font-size:12px;color:var(--texto-muted)">Mostrando últimos 10 de ${historico.length} registros</div>`:''}
      </div>
    </div>`;

  document.getElementById('page-title').textContent = a.nome;
}
window.abrirPerfilAluno = abrirPerfilAluno;

// ═══════════════════════════════════════════════════
// FÉRIAS
// ═══════════════════════════════════════════════════
async function salvarFrequencia(id, freq) {
  const a = alunos.find(x=>x.id===id);
  if (!a) return;
  const at = {...a, frequencia: parseInt(freq)};
  alunos = alunos.map(x=>x.id===id?at:x);
  await salvarAlunoDb(at);
  toast('Frequência atualizada ✓');
  abrirPerfilAluno(id);
}
window.salvarFrequencia = salvarFrequencia;

function abrirModalFerias(id) {
  const a = alunos.find(x=>x.id===id);
  if (!a) return;
  const limiteDias = {mensal:0,trimestral:7,semestral:15,anual:30}[a.plano]||0;
  const diasUsados = (a.ferias||[]).reduce((acc,f)=>{
    return acc + Math.max(0,Math.round((new Date(f.fim)-new Date(f.inicio))/86400000)+1);
  },0);
  const diasRestantes = Math.max(0,limiteDias-diasUsados);

  const html = `<div style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:300;display:flex;align-items:center;justify-content:center;padding:16px" id="modal-ferias-overlay">
    <div style="background:#fff;border-radius:12px;padding:24px;width:100%;max-width:420px;box-shadow:var(--shadow-lg)">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:20px;margin-bottom:4px">Adicionar Férias</div>
      <div style="font-size:12px;color:var(--texto-muted);margin-bottom:20px">${diasRestantes} dias disponíveis de ${limiteDias}</div>
      <div class="form-grid" style="grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group">
          <label class="form-label">Data início</label>
          <input class="form-input" type="date" id="ferias-ini">
        </div>
        <div class="form-group">
          <label class="form-label">Data fim</label>
          <input class="form-input" type="date" id="ferias-fim">
        </div>
        <div class="form-group full" id="ferias-hint" style="font-size:12px;color:var(--texto-muted)"></div>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px">
        <button class="btn btn-ghost" onclick="document.getElementById('modal-ferias-overlay').remove()">Cancelar</button>
        <button class="btn btn-primary" onclick="confirmarFerias('${id}',${limiteDias},${diasUsados})">Adicionar</button>
      </div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
  
  // Calcular dias ao selecionar datas
  ['ferias-ini','ferias-fim'].forEach(id2 => {
    document.getElementById(id2).addEventListener('change', () => {
      const ini = document.getElementById('ferias-ini').value;
      const fim = document.getElementById('ferias-fim').value;
      if (ini && fim) {
        const dias = Math.max(0,Math.round((new Date(fim)-new Date(ini))/86400000)+1);
        const hint = document.getElementById('ferias-hint');
        if (dias > diasRestantes) {
          hint.style.color = 'var(--vermelho)';
          hint.textContent = `⚠️ ${dias} dias selecionados — excede o limite de ${diasRestantes} dias disponíveis!`;
        } else {
          hint.style.color = 'var(--texto-muted)';
          hint.textContent = `${dias} dia(s) selecionado(s)`;
        }
      }
    });
  });
}
window.abrirModalFerias = abrirModalFerias;

async function confirmarFerias(id, limiteDias, diasUsados) {
  const ini = document.getElementById('ferias-ini').value;
  const fim = document.getElementById('ferias-fim').value;
  if (!ini || !fim || ini > fim) { alert('Datas inválidas.'); return; }
  const dias = Math.max(0,Math.round((new Date(fim)-new Date(ini))/86400000)+1);
  if (diasUsados + dias > limiteDias) { alert(`Limite de ${limiteDias} dias excedido.`); return; }
  
  const a = alunos.find(x=>x.id===id);
  const ferias = [...(a.ferias||[]), {inicio:ini, fim}];
  const at = {...a, ferias};
  alunos = alunos.map(x=>x.id===id?at:x);
  await salvarAlunoDb(at);
  document.getElementById('modal-ferias-overlay').remove();
  toast(`${dias} dia(s) de férias adicionados ✓`);
  abrirPerfilAluno(id);
}
window.confirmarFerias = confirmarFerias;

async function excluirFerias(id, idx) {
  if (!confirm('Remover este período de férias?')) return;
  const a = alunos.find(x=>x.id===id);
  const feriasAntes = [...(a.ferias||[])];
  const ferias = feriasAntes.filter((_,i)=>i!==idx);
  const at = {...a, ferias};
  alunos = alunos.map(x=>x.id===id?at:x);
  await salvarAlunoDb(at);
  await registrarAuditoria('exclusao_ferias', id, a.nome,
    {periodo: feriasAntes[idx]}, {removido: true});
  toast('Férias removidas.');
  abrirPerfilAluno(id);
}
window.excluirFerias = excluirFerias;

// ═══════════════════════════════════════════════════
// LANÇAR PAGAMENTO MANUAL (histórico)
// ═══════════════════════════════════════════════════
function abrirModalLancarPgto(id, nome) {
  const html = `<div style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:300;display:flex;align-items:center;justify-content:center;padding:16px" id="modal-pgto-overlay">
    <div style="background:#fff;border-radius:12px;padding:24px;width:100%;max-width:420px;box-shadow:var(--shadow-lg)">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:20px;margin-bottom:16px">Lançar Pagamento</div>
      <div class="form-grid" style="grid-template-columns:1fr">
        <div class="form-group">
          <label class="form-label">Data do pagamento</label>
          <input class="form-input" type="date" id="pgto-data" value="${new Date().toISOString().split('T')[0]}">
        </div>
        <div class="form-group">
          <label class="form-label">Valor (R$)</label>
          <input class="form-input" type="number" id="pgto-valor" step="0.01" placeholder="0,00">
        </div>
        <div class="form-group">
          <label class="form-label">Descrição</label>
          <input class="form-input" type="text" id="pgto-desc" placeholder="Ex: Mensalidade maio/2026">
        </div>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px">
        <button class="btn btn-ghost" onclick="document.getElementById('modal-pgto-overlay').remove()">Cancelar</button>
        <button class="btn btn-primary" onclick="confirmarLancPgto('${id}','${nome}')">Confirmar</button>
      </div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
}
window.abrirModalLancarPgto = abrirModalLancarPgto;

async function confirmarLancPgto(id, nome) {
  const data = document.getElementById('pgto-data').value;
  const valor = parseFloat(document.getElementById('pgto-valor').value)||0;
  const desc = document.getElementById('pgto-desc').value.trim() || 'Pagamento manual';
  if (!data || valor <= 0) { alert('Preencha data e valor.'); return; }
  const registro = {
    id: gerarId(), alunoId: id, alunoNome: nome,
    data, valor, plano: alunos.find(x=>x.id===id)?.plano||'',
    tipo: desc, ts: Date.now()
  };
  await setDoc(doc(db,'historico',registro.id), registro);
  document.getElementById('modal-pgto-overlay').remove();
  toast('Pagamento registrado ✓');
  abrirPerfilAluno(id);
}
window.confirmarLancPgto = confirmarLancPgto;


// ═══════════════════════════════════════════════════
// EDITAR / EXCLUIR HISTÓRICO DE PAGAMENTOS
// ═══════════════════════════════════════════════════
function editarHistorico(alunoId, alunoNome, histId) {
  // Buscar registro no Firebase para preencher o modal
  getDoc(doc(db,'historico',histId)).then(snap => {
    if (!snap.exists()) { toast('Registro não encontrado.', false); return; }
    const h = snap.data();
    const html = `<div style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:300;display:flex;align-items:center;justify-content:center;padding:16px" id="modal-edithist-overlay">
      <div style="background:#fff;border-radius:12px;padding:24px;width:100%;max-width:420px;box-shadow:var(--shadow-lg)">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:20px;margin-bottom:16px">Editar Registro</div>
        <div class="form-grid" style="grid-template-columns:1fr">
          <div class="form-group">
            <label class="form-label">Data</label>
            <input class="form-input" type="date" id="edithist-data" value="${h.data}">
          </div>
          <div class="form-group">
            <label class="form-label">Valor (R$)</label>
            <input class="form-input" type="number" id="edithist-valor" step="0.01" value="${h.valor}">
          </div>
          <div class="form-group">
            <label class="form-label">Descrição</label>
            <input class="form-input" type="text" id="edithist-desc" value="${h.tipo||''}">
          </div>
        </div>
        <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px">
          <button class="btn btn-ghost" onclick="document.getElementById('modal-edithist-overlay').remove()">Cancelar</button>
          <button class="btn btn-primary" onclick="confirmarEditHistorico('${alunoId}','${histId}')">Salvar</button>
        </div>
      </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
  });
}
window.editarHistorico = editarHistorico;

async function confirmarEditHistorico(alunoId, histId) {
  const data  = document.getElementById('edithist-data').value;
  const valor = parseFloat(document.getElementById('edithist-valor').value)||0;
  const tipo  = document.getElementById('edithist-desc').value.trim();
  if (!data || valor <= 0) { alert('Preencha data e valor.'); return; }
  const snap = await getDoc(doc(db,'historico',histId));
  const dadosAntes = snap.exists() ? snap.data() : {};
  const dadosDepois = {...dadosAntes, data, valor, tipo};
  const alunoNome = alunos.find(x=>x.id===alunoId)?.nome||'';
  await setDoc(doc(db,'historico',histId), dadosDepois);
  await registrarAuditoria('edicao_pagamento', alunoId, alunoNome, dadosAntes, dadosDepois);
  document.getElementById('modal-edithist-overlay').remove();
  toast('Registro atualizado ✓');
  abrirPerfilAluno(alunoId);
}
window.confirmarEditHistorico = confirmarEditHistorico;

async function excluirHistorico(alunoId, histId) {
  if (!confirm('Excluir este registro? Ele ficará arquivado na trilha de auditoria.')) return;
  // Buscar dados antes de arquivar
  const snap = await getDoc(doc(db,'historico',histId));
  const dadosAntes = snap.exists() ? snap.data() : {};
  const alunoNome = alunos.find(x=>x.id===alunoId)?.nome||'';
  // Soft delete — marcar como excluído, não apagar
  await setDoc(doc(db,'historico',histId), {
    ...dadosAntes, status:'excluido',
    excluido_em: new Date().toISOString().split('T')[0],
    excluido_ts: Date.now()
  });
  await registrarAuditoria('exclusao_pagamento', alunoId, alunoNome, dadosAntes, {status:'excluido'});
  toast('Registro arquivado. Pode ser restaurado na trilha de auditoria.');
  abrirPerfilAluno(alunoId);
}
window.excluirHistorico = excluirHistorico;

// ═══════════════════════════════════════════════════
// EDITAR FÉRIAS
// ═══════════════════════════════════════════════════
function editarFerias(id, idx, limiteDias, diasOutros) {
  const a = alunos.find(x=>x.id===id);
  const f = (a.ferias||[])[idx];
  if (!f) return;
  const html = `<div style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:300;display:flex;align-items:center;justify-content:center;padding:16px" id="modal-editferias-overlay">
    <div style="background:#fff;border-radius:12px;padding:24px;width:100%;max-width:420px;box-shadow:var(--shadow-lg)">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:20px;margin-bottom:4px">Editar Férias</div>
      <div style="font-size:12px;color:var(--texto-muted);margin-bottom:20px">${Math.max(0,limiteDias-diasOutros)} dias disponíveis para este período</div>
      <div class="form-grid" style="grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group">
          <label class="form-label">Data início</label>
          <input class="form-input" type="date" id="editferias-ini" value="${f.inicio}">
        </div>
        <div class="form-group">
          <label class="form-label">Data fim</label>
          <input class="form-input" type="date" id="editferias-fim" value="${f.fim}">
        </div>
        <div class="form-group full" id="editferias-hint" style="font-size:12px;color:var(--texto-muted)"></div>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px">
        <button class="btn btn-ghost" onclick="document.getElementById('modal-editferias-overlay').remove()">Cancelar</button>
        <button class="btn btn-primary" onclick="confirmarEditFerias('${id}',${idx},${limiteDias},${diasOutros})">Salvar</button>
      </div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', html);

  ['editferias-ini','editferias-fim'].forEach(fid => {
    document.getElementById(fid).addEventListener('change', () => {
      const ini = document.getElementById('editferias-ini').value;
      const fim = document.getElementById('editferias-fim').value;
      if (ini && fim) {
        const dias = Math.max(0,Math.round((new Date(fim)-new Date(ini))/86400000)+1);
        const disponiveis = Math.max(0,limiteDias-diasOutros);
        const hint = document.getElementById('editferias-hint');
        if (dias > disponiveis) {
          hint.style.color = 'var(--vermelho)';
          hint.textContent = `⚠️ ${dias} dias — excede o limite de ${disponiveis} dias!`;
        } else {
          hint.style.color = 'var(--texto-muted)';
          hint.textContent = `${dias} dia(s)`;
        }
      }
    });
  });
}
window.editarFerias = editarFerias;

async function confirmarEditFerias(id, idx, limiteDias, diasOutros) {
  const ini = document.getElementById('editferias-ini').value;
  const fim = document.getElementById('editferias-fim').value;
  if (!ini || !fim || ini > fim) { alert('Datas inválidas.'); return; }
  const dias = Math.max(0,Math.round((new Date(fim)-new Date(ini))/86400000)+1);
  if (diasOutros + dias > limiteDias) { alert(`Limite de ${limiteDias} dias excedido.`); return; }
  const a = alunos.find(x=>x.id===id);
  const feriasAntes = (a.ferias||[])[idx];
  const ferias = [...(a.ferias||[])];
  ferias[idx] = {inicio:ini, fim};
  const at = {...a, ferias};
  alunos = alunos.map(x=>x.id===id?at:x);
  await salvarAlunoDb(at);
  await registrarAuditoria('edicao_ferias', id, a.nome,
    {periodo: feriasAntes}, {periodo: {inicio:ini,fim}});
  document.getElementById('modal-editferias-overlay').remove();
  toast('Férias atualizadas ✓');
  abrirPerfilAluno(id);
}
window.confirmarEditFerias = confirmarEditFerias;


// ═══════════════════════════════════════════════════
// RESUMO DE RECEITA (modal do dashboard)
// ═══════════════════════════════════════════════════
function abrirResumoReceita() {
  const div = {mensal:1, trimestral:3, semestral:6, anual:12};
  const ativos = alunos
    .filter(a => a.status === 'pago')
    .sort((a,b) => mensalidadeAluno(b) - mensalidadeAluno(a));
  const total = ativos.reduce((acc,a) => acc + mensalidadeAluno(a), 0);

  const linhas = ativos.map(a => {
    const mens = mensalidadeAluno(a);
    const pct  = total > 0 ? (mens/total*100).toFixed(1) : 0;
    const planoLabel = {mensal:'Mensal',trimestral:'Trimestral',semestral:'Semestral',anual:'Anual'}[a.plano]||a.plano;
    return `<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--borda);cursor:pointer" onclick="document.getElementById('modal-receita-overlay').remove();abrirPerfilAluno('${a.id}')">
      <div style="flex:1">
        <div style="font-weight:600;color:var(--vermelho);text-decoration:underline;text-underline-offset:2px">${a.nome}</div>
        <div style="font-size:11px;color:var(--texto-muted)">${planoLabel} · ${a.pgto}</div>
      </div>
      <div style="text-align:right">
        <div style="font-weight:700;color:var(--verde)">${fmtValor(mens)}</div>
        <div style="font-size:10px;color:var(--texto-muted)">${pct}% da receita</div>
      </div>
    </div>`;
  }).join('');

  const html = `<div style="position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:400;display:flex;align-items:center;justify-content:center;padding:16px" id="modal-receita-overlay">
    <div style="background:#fff;border-radius:12px;width:100%;max-width:500px;max-height:85vh;overflow-y:auto;box-shadow:var(--shadow-lg)">
      <div style="padding:20px 24px;border-bottom:1px solid var(--borda);display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;background:#fff;z-index:1">
        <div>
          <div style="font-family:'Bebas Neue',sans-serif;font-size:22px">Receita Estimada</div>
          <div style="font-size:12px;color:var(--texto-muted)">${MESES_NOMES[MES_ATUAL]} ${ANO_ATUAL} · ${ativos.length} alunos pagos</div>
        </div>
        <div style="text-align:right">
          <div style="font-family:'Bebas Neue',sans-serif;font-size:28px;color:var(--verde)">${fmtValor(total)}</div>
          <button onclick="document.getElementById('modal-receita-overlay').remove()" style="background:none;border:none;cursor:pointer;font-size:13px;color:var(--texto-muted)">✕ Fechar</button>
        </div>
      </div>
      <div style="padding:0 24px 16px">
        ${linhas}
        <div style="display:flex;justify-content:space-between;padding:12px 0;font-weight:700;font-size:14px;border-top:2px solid var(--borda);margin-top:4px">
          <span>Total estimado</span>
          <span style="color:var(--verde)">${fmtValor(total)}</span>
        </div>
      </div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
  document.getElementById('modal-receita-overlay').addEventListener('click', function(e) {
    if (e.target === this) this.remove();
  });
}
window.abrirResumoReceita = abrirResumoReceita;

// ═══════════════════════════════════════════════════
// EDITAR RENOVAÇÃO DO HISTÓRICO — abre modal completo
// ═══════════════════════════════════════════════════
function editarRenovacaoHistorico(alunoId, histId) {
  const a = alunos.find(x=>x.id===alunoId);
  if (!a) return;
  // Carregar dados do registro do histórico
  getDoc(doc(db,'historico',histId)).then(snap => {
    if (!snap.exists()) { toast('Registro não encontrado.', false); return; }
    const h = snap.data();
    // Preencher o modal de renovação com os dados existentes
    const plano   = h.plano || a.plano;
    const valor   = h.valor || Number(a.valor);
    const inicio  = h.inicio || a.inicio;
    const venc    = h.venc   || a.venc;
    const pgto    = h.pgto   || a.pgto;
    const receb   = h.recebimento || a.recebimento || 'avista';
    const obs     = h.obs || '';

    const meses = {mensal:1,trimestral:3,semestral:6,anual:12}[plano]||1;
    const divPlano = meses;

    const html = `<div style="position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:400;display:flex;align-items:center;justify-content:center;padding:16px" id="modal-editrenov-overlay">
      <div style="background:#fff;border-radius:12px;padding:0;width:100%;max-width:500px;box-shadow:var(--shadow-lg);max-height:90vh;overflow-y:auto">
        <div style="padding:20px 24px 0;display:flex;align-items:center;justify-content:space-between">
          <div style="font-family:'Bebas Neue',sans-serif;font-size:22px">Editar Renovação</div>
          <button onclick="document.getElementById('modal-editrenov-overlay').remove()" style="background:none;border:none;font-size:20px;cursor:pointer;color:#999">✕</button>
        </div>
        <div style="padding:8px 24px;font-size:13px;color:var(--texto-muted);border-bottom:1px solid var(--borda)">
          <strong>${a.nome}</strong> · Registrado em ${fmtData(h.data)}
        </div>
        <div style="padding:20px 24px">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Plano</label>
              <select class="form-select" id="er-plano" onchange="calcERVenc()">
                <option value="mensal" ${plano==='mensal'?'selected':''}>Mensal</option>
                <option value="trimestral" ${plano==='trimestral'?'selected':''}>Trimestral</option>
                <option value="semestral" ${plano==='semestral'?'selected':''}>Semestral</option>
                <option value="anual" ${plano==='anual'?'selected':''}>Anual</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Valor total (R$)</label>
              <input class="form-input" type="number" id="er-valor" value="${valor}" step="0.01" onchange="calcERMens()">
              <div class="form-hint" id="er-mens-hint"></div>
            </div>
            <div class="form-group">
              <label class="form-label">Início do contrato</label>
              <input class="form-input" type="date" id="er-inicio" value="${inicio}" onchange="calcERVenc()">
            </div>
            <div class="form-group">
              <label class="form-label">Vencimento</label>
              <input class="form-input" type="date" id="er-venc" value="${venc}">
            </div>
            <div class="form-group">
              <label class="form-label">Forma de pagamento</label>
              <select class="form-select" id="er-pgto">
                <option value="PIX" ${pgto==='PIX'?'selected':''}>PIX</option>
                <option value="Cartão" ${pgto==='Cartão'?'selected':''}>Cartão</option>
                <option value="Dinheiro" ${pgto==='Dinheiro'?'selected':''}>Dinheiro</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Recebimento</label>
              <select class="form-select" id="er-recebimento">
                <option value="avista" ${receb==='avista'?'selected':''}>À vista</option>
                <option value="mensal" ${receb==='mensal'?'selected':''}>Mensal</option>
              </select>
            </div>
            <div class="form-group full">
              <label class="form-label">Observações</label>
              <input class="form-input" type="text" id="er-obs" value="${obs}" placeholder="Opcional">
            </div>
          </div>
        </div>
        <div style="padding:16px 24px 20px;border-top:1px solid var(--borda);display:flex;justify-content:flex-end;gap:8px">
          <button class="btn btn-ghost" onclick="document.getElementById('modal-editrenov-overlay').remove()">Cancelar</button>
          <button class="btn btn-primary" onclick="confirmarEditRenovacao('${alunoId}','${histId}')">💾 Salvar Renovação</button>
        </div>
      </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
    calcERMens();
  });
}
window.editarRenovacaoHistorico = editarRenovacaoHistorico;

window.calcERVenc = function() {
  const p = document.getElementById('er-plano')?.value;
  const i = document.getElementById('er-inicio')?.value;
  if (!p || !i) return;
  document.getElementById('er-venc').value = addMeses(i, {mensal:1,trimestral:3,semestral:6,anual:12}[p]||1);
  calcERMens();
};
window.calcERMens = function() {
  const v = parseFloat(document.getElementById('er-valor')?.value)||0;
  const p = document.getElementById('er-plano')?.value||'mensal';
  const div = {mensal:1,trimestral:3,semestral:6,anual:12}[p]||1;
  const hint = document.getElementById('er-mens-hint');
  if (hint && v > 0) hint.textContent = `Mensalidade: R$ ${(v/div).toLocaleString('pt-BR',{minimumFractionDigits:2})}`;
};

async function confirmarEditRenovacao(alunoId, histId) {
  const plano  = document.getElementById('er-plano').value;
  const valor  = parseFloat(document.getElementById('er-valor').value)||0;
  const inicio = document.getElementById('er-inicio').value;
  const venc   = document.getElementById('er-venc').value;
  const pgto   = document.getElementById('er-pgto').value;
  const receb  = document.getElementById('er-recebimento').value;
  const obs    = document.getElementById('er-obs').value;
  if (!inicio || !venc || valor <= 0) { alert('Preencha todos os campos.'); return; }

  const div = {mensal:1,trimestral:3,semestral:6,anual:12}[plano]||1;
  const snap = await getDoc(doc(db,'historico',histId));
  const dadosAntes = snap.exists() ? snap.data() : {};

  // Atualizar registro do histórico
  const dadosDepois = {...dadosAntes, plano, valor, inicio, venc, pgto, recebimento:receb, obs,
    tipo:`Renovação — ${plano}`, mensalidade: valor/div};
  await setDoc(doc(db,'historico',histId), dadosDepois);

  // Atualizar também o contrato atual do aluno se este for o registro mais recente
  const a = alunos.find(x=>x.id===alunoId);
  if (a) {
    const at = {...a, plano, valor, inicio, venc, pgto, recebimento:receb};
    alunos = alunos.map(x=>x.id===alunoId?at:x);
    await salvarAlunoDb(at);
  }

  await registrarAuditoria('edicao_renovacao', alunoId, a?.nome||'', dadosAntes, dadosDepois);
  document.getElementById('modal-editrenov-overlay').remove();
  toast('Renovação atualizada ✓');
  abrirPerfilAluno(alunoId);
}
window.confirmarEditRenovacao = confirmarEditRenovacao;

// ═══════════════════════════════════════════════════
// COPIAR / SINCRONIZAR MÊS DE DESPESAS — V25
// A cópia agora replica a situação da página do mês atual para os meses seguintes:
// - adiciona despesas manuais que existem no mês modelo;
// - remove dos meses de destino despesas manuais que não existem mais no mês modelo;
// - preserva despesas programadas/recorrentes injetadas pelo sistema, colaboradores e taxas informativas.
// Observação: esta rotina sincroniza apenas a camada manual do mês. Despesas programadas
// continuam sendo controladas pelos botões de editar/encerrar da própria despesa programada.
// ═══════════════════════════════════════════════════
function ehDespesaFixaOuSistemaV25(d){
  return !!(d && (d.fixo || d.progId || d.__pessoalV20 || d.__colaboradorConsolidadoV22));
}
function limparMetadadosCopiaDespV25(item){
  const c = {...item};
  delete c.fixo;
  delete c.progId;
  delete c.__pessoalV20;
  delete c.__colaboradorConsolidadoV22;
  delete c.funcionarioId;
  delete c.grupo;
  delete c.clt;
  delete c.remuneracao;
  delete c.encargos;
  delete c.provisoes;
  delete c.total;
  return c;
}
function clonarDespesaManualParaCopiaV25(item, cat, origemMes, origemAno){
  return {
    ...limparMetadadosCopiaDespV25(item),
    copiadoPorV25:true,
    origemCopia:`${origemAno}_${String(origemMes).padStart(2,'0')}`,
    atualizadoPorCopiaEm:new Date().toISOString()
  };
}
function resumoCatsManuaisV25(cats){
  let qtd=0, total=0;
  Object.values(cats||{}).forEach(lista=>{
    (lista||[]).forEach(d=>{
      if(!ehDespesaFixaOuSistemaV25(d)){
        qtd++;
        total += Number(d.valor||0);
      }
    });
  });
  return {qtd,total};
}
async function copiarMes() {
  const quantos = parseInt(prompt('Sincronizar a página de despesas de ' + MESES_NOMES[despMes] + '/' + despAno + ' para quantos meses à frente?', '1'));
  if (!quantos || quantos < 1 || quantos > 12) { toast('Quantidade inválida.', false); return; }

  const catsOrigem = await loadDespesas(despMes, despAno);
  const resumoOrigem = resumoCatsManuaisV25(catsOrigem);
  const ok = confirm(
    'Sincronizar despesas para os próximos ' + quantos + ' mês(es)?\n\n' +
    'O mês atual será usado como modelo.\n\n' +
    '• Despesas manuais que existem neste mês serão copiadas/atualizadas nos meses seguintes.\n' +
    '• Despesas manuais dos meses seguintes que não existem mais neste mês serão removidas.\n' +
    '• Despesas programadas, colaboradores e taxas informativas serão preservados.\n\n' +
    'Modelo atual: ' + resumoOrigem.qtd + ' despesa(s) manual(is), total ' + fmtValor(resumoOrigem.total) + '.'
  );
  if(!ok) return;

  const catsModelo = {};
  const categorias = new Set([...Object.keys(DESP_BASE||{}), ...Object.keys(catsOrigem||{})]);
  categorias.forEach(cat => {
    catsModelo[cat] = (catsOrigem[cat]||[])
      .filter(d => !ehDespesaFixaOuSistemaV25(d))
      .map(d => clonarDespesaManualParaCopiaV25(d, cat, despMes, despAno));
  });

  let sincronizados = 0;
  for (let i = 1; i <= quantos; i++) {
    let novoMes = despMes + i;
    let novoAno = despAno;
    while (novoMes > 11) { novoMes -= 12; novoAno++; }

    const destino = await loadDespesas(novoMes, novoAno);
    const catsDestino = {};
    const catsTodas = new Set([...categorias, ...Object.keys(destino||{})]);

    catsTodas.forEach(cat => {
      const preservadas = (destino[cat]||[]).filter(d => ehDespesaFixaOuSistemaV25(d));
      catsDestino[cat] = [
        ...preservadas,
        ...(catsModelo[cat]||[]).map(d => ({...d, origemCopia:`${despAno}_${String(despMes).padStart(2,'0')}`, destinoCopia:`${novoAno}_${String(novoMes).padStart(2,'0')}`}))
      ];
    });

    await saveDespesas(novoMes, novoAno, catsDestino);
    despCache[chaveDesp(novoMes, novoAno)] = null;
    sincronizados++;
  }
  despCache[chaveDesp(despMes, despAno)] = null;
  toast(`✅ Página de despesas sincronizada para ${sincronizados} mês(es)!`);
  await renderDespesasView();
}
window.copiarMes = copiarMes;

// ═══════════════════════════════════════════════════
// IMPRIMIR DRE
// ═══════════════════════════════════════════════════
async function imprimirDRE() {
  const cats = await loadDespesas(finMes, finAno);
  const receita = receitaMesEsp(finMes, finAno);
  const catDefs = {
    operacional:   'Colaboradores',
    despesa_op:    'Despesas Operacionais',
    administrativo:'Administrativo',
    marketing:     'Marketing',
    impostos:      'Impostos',
  };
  const totais = {};
  let totDesp = 0;
  Object.keys(catDefs).forEach(cat => {
    totais[cat] = (cats[cat]||[]).reduce((a,d)=>a+Number(d.valor),0);
    totDesp += totais[cat];
  });
  const resultado = receita - totDesp;
  const resPos = resultado >= 0;

  // Alunos ativos no mês para discriminar receita
  const iniMes = new Date(finAno, finMes, 1);
  const fimMes = new Date(finAno, finMes+1, 0);
  const alunosAtivos = [...alunos]
    .filter(a => a.status !== 'confirmar' && new Date(a.inicio) <= fimMes && new Date(a.venc) >= iniMes)
    .sort((a,b) => a.nome.localeCompare(b.nome,'pt-BR'));

  const linhasAlunos = alunosAtivos.map(a => {
    const mens = mensalidadeAluno(a);
    const planoLabel = {mensal:'Mensal',trimestral:'Trimestral',semestral:'Semestral',anual:'Anual'}[a.plano]||a.plano;
    return `<tr>
      <td style="padding:6px 8px;border-bottom:1px solid #eee">${a.nome}</td>
      <td style="padding:6px 8px;border-bottom:1px solid #eee;color:#666;font-size:11px">${planoLabel}</td>
      <td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right;font-weight:600">${fmtValor(mens)}</td>
    </tr>`;
  }).join('');

  const linhasDesp = Object.entries(catDefs).map(([cat, label]) => {
    const items = (cats[cat]||[]).filter(d=>Number(d.valor)>0);
    if (!items.length && totais[cat] === 0) return '';
    const linhasItens = items.map(d => `<tr>
      <td style="padding:5px 8px 5px 20px;border-bottom:1px solid #eee;color:#555">${d.desc}</td>
      <td style="padding:5px 8px;border-bottom:1px solid #eee;text-align:right">${fmtValor(d.valor)}</td>
    </tr>`).join('');
    return `<tr style="background:#f9f9f9">
      <td style="padding:8px 8px;font-weight:700;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:#333">${label}</td>
      <td style="padding:8px 8px;text-align:right;font-weight:700">${fmtValor(totais[cat])}</td>
    </tr>${linhasItens}`;
  }).join('');

  const dataImpressao = new Date().toLocaleDateString('pt-BR');

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Resumo Financeiro — ${MESES_NOMES[finMes]} ${finAno}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Barlow', Arial, sans-serif; font-size: 13px; color: #111; background: #fff; padding: 32px; max-width: 720px; margin: 0 auto; }
  @media print {
    body { padding: 16px; }
    .no-print { display: none; }
  }

  /* HEADER */
  .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; padding-bottom: 20px; border-bottom: 3px solid #111; }
  .logo { font-family: 'Bebas Neue', sans-serif; font-size: 36px; letter-spacing: 1px; line-height: 1; }
  .logo span { color: #D32F2F; }
  .logo-sub { font-size: 10px; color: #999; letter-spacing: 3px; text-transform: uppercase; margin-top: 3px; }
  .header-right { text-align: right; }
  .dre-title { font-family: 'Bebas Neue', sans-serif; font-size: 22px; color: #D32F2F; letter-spacing: 1px; }
  .dre-periodo { font-size: 13px; color: #555; margin-top: 2px; }
  .dre-data { font-size: 11px; color: #999; margin-top: 4px; }

  /* SEÇÕES */
  .section { margin-bottom: 24px; }
  .section-title { font-family: 'Bebas Neue', sans-serif; font-size: 15px; letter-spacing: 0.5px; color: #fff; background: #111; padding: 8px 12px; border-radius: 4px 4px 0 0; }
  table { width: 100%; border-collapse: collapse; border: 1px solid #eee; border-top: none; }
  .total-row td { padding: 8px 8px; font-weight: 700; font-size: 13px; background: #f4f4f4; border-top: 2px solid #ddd; }

  /* RESULTADO */
  .resultado-box { margin-top: 24px; border: 2px solid ${resPos?'#2e7d32':'#D32F2F'}; border-radius: 8px; padding: 16px 20px; background: ${resPos?'rgba(46,125,50,0.05)':'rgba(211,47,47,0.05)'}; display: flex; justify-content: space-between; align-items: center; }
  .resultado-label { font-family: 'Bebas Neue', sans-serif; font-size: 18px; letter-spacing: 0.5px; color: ${resPos?'#2e7d32':'#D32F2F'}; }
  .resultado-valor { font-family: 'Bebas Neue', sans-serif; font-size: 28px; color: ${resPos?'#2e7d32':'#D32F2F'}; }
  .resultado-sub { font-size: 11px; color: #999; margin-top: 4px; }

  /* RESUMO */
  .resumo { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-bottom: 24px; }
  .resumo-card { border: 1px solid #eee; border-radius: 6px; padding: 12px 14px; }
  .resumo-label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-bottom: 4px; }
  .resumo-valor { font-family: 'Bebas Neue', sans-serif; font-size: 22px; }

  .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #eee; display: flex; justify-content: space-between; font-size: 11px; color: #bbb; }

  .btn-print { display: block; margin: 0 auto 20px; padding: 10px 28px; background: #D32F2F; color: #fff; border: none; border-radius: 6px; font-family: 'Barlow', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; }
</style>
</head>
<body>

<button class="btn-print no-print" onclick="window.print()">🖨️ Imprimir / Salvar PDF</button>

<div class="header">
  <div>
    <div class="logo">studio <span>FB</span></div>
    <div class="logo-sub">Saúde &amp; Movimento</div>
  </div>
  <div class="header-right">
    <div class="dre-title">Resumo Financeiro</div>
    <div class="dre-periodo">${MESES_NOMES[finMes]} de ${finAno}</div>
    <div class="dre-data">Emitido em ${dataImpressao}</div>
  </div>
</div>

<!-- RESUMO -->
<div class="resumo">
  <div class="resumo-card">
    <div class="resumo-label">Receita Total</div>
    <div class="resumo-valor" style="color:#2e7d32">${fmtValor(receita)}</div>
  </div>
  <div class="resumo-card">
    <div class="resumo-label">Total Despesas</div>
    <div class="resumo-valor" style="color:#D32F2F">${fmtValor(totDesp)}</div>
    <div style="font-size:11px;color:#999">${receita>0?(totDesp/receita*100).toFixed(1):0}% da receita</div>
  </div>
  <div class="resumo-card">
    <div class="resumo-label">Resultado</div>
    <div class="resumo-valor" style="color:${resPos?'#2e7d32':'#D32F2F'}">${resPos?'':'-'}${fmtValor(Math.abs(resultado))}</div>
    <div style="font-size:11px;color:#999">${resPos?'Superávit':'Déficit'}</div>
  </div>
</div>

<!-- RECEITA -->
<div class="section">
  <div class="section-title">Receita — Alunos Ativos (${alunosAtivos.length})</div>
  <table>
    <thead><tr style="background:#fafafa">
      <th style="padding:7px 8px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#999;border-bottom:1px solid #eee">Aluno</th>
      <th style="padding:7px 8px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#999;border-bottom:1px solid #eee">Plano</th>
      <th style="padding:7px 8px;text-align:right;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#999;border-bottom:1px solid #eee">Mensalidade</th>
    </tr></thead>
    <tbody>${linhasAlunos}</tbody>
    <tfoot><tr class="total-row">
      <td colspan="2">Total Receita</td>
      <td style="text-align:right;color:#2e7d32">${fmtValor(receita)}</td>
    </tr></tfoot>
  </table>
</div>

<!-- DESPESAS -->
<div class="section">
  <div class="section-title">Despesas Discriminadas</div>
  <table>
    <tbody>${linhasDesp}</tbody>
    <tfoot><tr class="total-row">
      <td>Total Despesas</td>
      <td style="text-align:right;color:#D32F2F">${fmtValor(totDesp)}</td>
    </tr></tfoot>
  </table>
</div>

<!-- RESULTADO -->
<div class="resultado-box">
  <div>
    <div class="resultado-label">${resPos?'✅ Resultado positivo':'⚠️ Resultado negativo'}</div>
    <div class="resultado-sub">${MESES_NOMES[finMes]} ${finAno} — Receita ${fmtValor(receita)} − Despesas ${fmtValor(totDesp)}</div>
  </div>
  <div class="resultado-valor">${resPos?'':'-'}${fmtValor(Math.abs(resultado))}</div>
</div>

<div class="footer">
  <span>Studio FB — Saúde &amp; Movimento</span>
  <span>Resumo gerado em ${dataImpressao}</span>
</div>

</body>
</html>`;

  const janela = window.open('', '_blank');
  janela.document.write(html);
  janela.document.close();
}
window.imprimirDRE = imprimirDRE;


// ═══════════════════════════════════════════════════
// FIREBASE — AGENDA
// ═══════════════════════════════════════════════════
let agendaCache = null;

async function carregarAgenda() {
  if (agendaCache) return agendaCache;
  try {
    const snap = await getDoc(doc(db,'config','agenda'));
    agendaCache = snap.exists() ? snap.data() : { turmas: [], limitePadrao: 5 };
  } catch(e) { agendaCache = { turmas: [], limitePadrao: 5 }; }
  return agendaCache;
}

async function salvarAgenda(dados) {
  agendaCache = dados;
  await setDoc(doc(db,'config','agenda'), dados);
}

const DIAS_SEMANA = ['Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo'];

// ═══════════════════════════════════════════════════
// AGENDA — VIEW
// ═══════════════════════════════════════════════════
async function renderAgendaView() {
  loading(true);
  const agenda = await carregarAgenda();
  const turmas = agenda.turmas || [];

  // Agrupar turmas por dia
  const porDia = {};
  DIAS_SEMANA.forEach(d => { porDia[d] = turmas.filter(t=>t.dia===d); });

  const diasHtml = DIAS_SEMANA.map(dia => {
    const ts = porDia[dia];
    const linhas = ts.length
      ? ts.map((t,i) => {
          const alunosNaTurma = alunos.filter(a=>(a.turmas||[]).some(at=>at.dia===dia&&at.horario===t.horario));
          const ocupacao = alunosNaTurma.length;
          const limite   = t.limite || agenda.limitePadrao || 5;
          const cor      = ocupacao >= limite ? 'var(--vermelho)' : ocupacao >= limite*0.8 ? 'var(--amarelo)' : 'var(--verde)';
          return `<div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--borda)">
            <div style="flex:1">
              <div style="font-weight:600">${t.horario}</div>
              <div style="font-size:11px;color:var(--texto-muted)">${alunosNaTurma.map(a=>a.nome.split(' ')[0]).join(', ')||'Vazio'}</div>
            </div>
            <div style="font-size:12px;font-weight:700;color:${cor}">${ocupacao}/${limite}</div>
            <button class="btn btn-ghost btn-sm" onclick="editarTurma('${dia}',${i})" title="Editar">✏️</button>
            <button class="btn btn-danger btn-sm" onclick="excluirTurma('${dia}',${i})" title="Excluir">🗑</button>
          </div>`;
        }).join('')
      : `<div style="color:var(--texto-muted);font-size:12px;padding:8px 0">Nenhum horário cadastrado</div>`;

    return `<div class="desp-card">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <div class="desp-card-title" style="margin-bottom:0">${dia}</div>
        <div style="display:flex;gap:6px">
          <button class="btn btn-ghost btn-sm" onclick="copiarDia('${dia}')" title="Copiar horários para outros dias">📋 Copiar</button>
          <button class="btn btn-primary btn-sm" onclick="adicionarHorario('${dia}')">+ Horário</button>
        </div>
      </div>
      ${linhas}
    </div>`;
  }).join('');

  document.getElementById('content').innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:12px">
      <div style="font-size:13px;color:var(--texto-muted)">Configure os horários das turmas e encaixe os alunos no perfil de cada um.</div>
      <div style="display:flex;gap:8px;align-items:center">
        <label style="font-size:12px;font-weight:600;color:var(--texto-muted);text-transform:uppercase;letter-spacing:0.5px">Limite padrão por turma:</label>
        <input type="number" min="1" max="30" value="${agenda.limitePadrao||5}"
          style="width:60px;padding:6px 10px;border:1px solid var(--borda);border-radius:6px;font-size:13px;text-align:center"
          onchange="salvarLimitePadrao(this.value)">
        <button class="btn btn-ghost btn-sm" onclick="aplicarLimiteTodas()" title="Aplicar este limite a todas as turmas">Aplicar a todas</button>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px">
      ${diasHtml}
    </div>`;
}
window.renderAgendaView = renderAgendaView;

async function salvarLimitePadrao(val) {
  const agenda = await carregarAgenda();
  agenda.limitePadrao = parseInt(val)||5;
  await salvarAgenda(agenda);
  toast('Limite padrão atualizado ✓');
}
window.salvarLimitePadrao = salvarLimitePadrao;

async function aplicarLimiteTodas() {
  const agenda = await carregarAgenda();
  const limite = agenda.limitePadrao || 5;
  if (!confirm(`Aplicar limite de ${limite} alunos a TODAS as turmas?`)) return;
  agenda.turmas = agenda.turmas.map(t=>({...t, limite}));
  await salvarAgenda(agenda);
  toast('Limite aplicado a todas as turmas ✓');
  renderAgendaView();
}
window.aplicarLimiteTodas = aplicarLimiteTodas;

function adicionarHorario(dia, turmaIdx=null, editando=null) {
  const horarioVal = editando ? editando.horario : '';
  const limiteVal  = editando ? editando.limite  : '';
  const html = `<div style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:300;display:flex;align-items:center;justify-content:center;padding:16px" id="modal-horario-overlay">
    <div style="background:#fff;border-radius:12px;padding:24px;width:100%;max-width:380px;box-shadow:var(--shadow-lg)">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:20px;margin-bottom:4px">${turmaIdx!==null?'Editar':'Novo'} Horário — ${dia}</div>
      <div style="font-size:12px;color:var(--texto-muted);margin-bottom:20px">Ex: 08:00–09:00</div>
      <div class="form-grid" style="grid-template-columns:1fr">
        <div class="form-group">
          <label class="form-label">Horário</label>
          <input class="form-input" type="text" id="hor-horario" placeholder="08:00–09:00" value="${horarioVal}">
        </div>
        <div class="form-group">
          <label class="form-label">Limite de alunos</label>
          <input class="form-input" type="number" id="hor-limite" min="1" max="30" placeholder="Padrão do estúdio" value="${limiteVal}">
        </div>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px">
        <button class="btn btn-ghost" onclick="document.getElementById('modal-horario-overlay').remove()">Cancelar</button>
        <button class="btn btn-primary" onclick="confirmarHorario('${dia}',${turmaIdx})">Salvar</button>
      </div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
  document.getElementById('hor-horario').focus();
}
window.adicionarHorario = adicionarHorario;

async function confirmarHorario(dia, turmaIdx) {
  const horario = document.getElementById('hor-horario').value.trim();
  const limite  = parseInt(document.getElementById('hor-limite').value)||null;
  if (!horario) { alert('Informe o horário.'); return; }
  const agenda = await carregarAgenda();
  if (!agenda.turmas) agenda.turmas = [];
  if (turmaIdx !== null && turmaIdx >= 0) {
    // Editar turma existente
    const idx = agenda.turmas.findIndex(t=>t.dia===dia&&agenda.turmas.filter(x=>x.dia===dia).indexOf(t)===turmaIdx);
    if (idx >= 0) agenda.turmas[idx] = {...agenda.turmas[idx], horario, ...(limite?{limite}:{})};
  } else {
    // Nova turma
    agenda.turmas.push({ dia, horario, limite: limite||null, criadoEm: new Date().toISOString().split('T')[0] });
  }
  await salvarAgenda(agenda);
  document.getElementById('modal-horario-overlay').remove();
  toast('Horário salvo ✓');
  renderAgendaView();
}
window.confirmarHorario = confirmarHorario;

function editarTurma(dia, idx) {
  carregarAgenda().then(agenda => {
    const turmasDia = agenda.turmas.filter(t=>t.dia===dia);
    if (idx < turmasDia.length) adicionarHorario(dia, idx, turmasDia[idx]);
  });
}
window.editarTurma = editarTurma;

async function excluirTurma(dia, idx) {
  if (!confirm('Excluir este horário?')) return;
  const agenda = await carregarAgenda();
  const turmasDia = agenda.turmas.filter(t=>t.dia===dia);
  const turmaParaRemover = turmasDia[idx];
  agenda.turmas = agenda.turmas.filter(t=>!(t.dia===dia&&t.horario===turmaParaRemover.horario));
  await salvarAgenda(agenda);
  toast('Horário excluído.');
  renderAgendaView();
}
window.excluirTurma = excluirTurma;

function copiarDia(diaOrigem) {
  const checkboxes = DIAS_SEMANA.filter(d=>d!==diaOrigem)
    .map(d=>`<label style="display:flex;align-items:center;gap:8px;padding:6px 0;cursor:pointer">
      <input type="checkbox" value="${d}" style="width:16px;height:16px"> ${d}
    </label>`).join('');

  const html = `<div style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:300;display:flex;align-items:center;justify-content:center;padding:16px" id="modal-copiahorario-overlay">
    <div style="background:#fff;border-radius:12px;padding:24px;width:100%;max-width:360px;box-shadow:var(--shadow-lg)">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:20px;margin-bottom:4px">Copiar Horários</div>
      <div style="font-size:12px;color:var(--texto-muted);margin-bottom:16px">Copiar horários de <strong>${diaOrigem}</strong> para:</div>
      <div id="dias-destino">${checkboxes}</div>
      <div style="font-size:11px;color:var(--texto-muted);margin-top:8px">⚠️ Horários existentes nos dias selecionados serão mantidos. Só novos serão adicionados.</div>
      <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px">
        <button class="btn btn-ghost" onclick="document.getElementById('modal-copiahorario-overlay').remove()">Cancelar</button>
        <button class="btn btn-primary" onclick="confirmarCopiarDia('${diaOrigem}')">Copiar</button>
      </div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
}
window.copiarDia = copiarDia;

async function confirmarCopiarDia(diaOrigem) {
  const selecionados = [...document.querySelectorAll('#dias-destino input:checked')].map(el=>el.value);
  if (!selecionados.length) { alert('Selecione ao menos um dia.'); return; }
  const agenda = await carregarAgenda();
  const turmasOrigem = agenda.turmas.filter(t=>t.dia===diaOrigem);
  selecionados.forEach(diaDestino => {
    const horariosExistentes = agenda.turmas.filter(t=>t.dia===diaDestino).map(t=>t.horario);
    turmasOrigem.forEach(t => {
      if (!horariosExistentes.includes(t.horario)) {
        agenda.turmas.push({...t, dia:diaDestino});
      }
    });
  });
  await salvarAgenda(agenda);
  document.getElementById('modal-copiahorario-overlay').remove();
  toast(`Horários copiados para ${selecionados.join(', ')} ✓`);
  renderAgendaView();
}
window.confirmarCopiarDia = confirmarCopiarDia;

// ═══════════════════════════════════════════════════
// ENCAIXAR ALUNO EM TURMA (no perfil do aluno)
// ═══════════════════════════════════════════════════
async function abrirModalEncaixarTurma(alunoId) {
  const agenda = await carregarAgenda();
  const turmas = agenda.turmas || [];
  const a = alunos.find(x=>x.id===alunoId);
  if (!a) return;
  const turmasAluno = a.turmas || [];

  const linhasTurmas = DIAS_SEMANA.map(dia => {
    const ts = turmas.filter(t=>t.dia===dia);
    if (!ts.length) return '';
    const opts = ts.map(t => {
      const jaEncaixado = turmasAluno.some(at=>at.dia===dia&&at.horario===t.horario);
      const ocupacao = alunos.filter(al=>(al.turmas||[]).some(at=>at.dia===dia&&at.horario===t.horario)).length;
      const limite   = t.limite || agenda.limitePadrao || 5;
      const cheio    = ocupacao >= limite && !jaEncaixado;
      return `<label style="display:flex;align-items:center;gap:8px;padding:4px 0;cursor:${cheio?'not-allowed':'pointer'}">
        <input type="checkbox" value="${dia}|${t.horario}" ${jaEncaixado?'checked':''} ${cheio?'disabled':''} style="width:15px;height:15px">
        <span>${t.horario} <span style="font-size:11px;color:${cheio?'var(--vermelho)':'var(--texto-muted)'}">(${ocupacao}/${limite}${cheio?' — lotado':''})</span></span>
      </label>`;
    }).join('');
    return `<div style="margin-bottom:12px"><div style="font-weight:700;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:var(--texto-muted);margin-bottom:4px">${dia}</div>${opts}</div>`;
  }).join('');

  const html = `<div style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:300;display:flex;align-items:center;justify-content:center;padding:16px" id="modal-encaixar-overlay">
    <div style="background:#fff;border-radius:12px;padding:24px;width:100%;max-width:420px;max-height:85vh;overflow-y:auto;box-shadow:var(--shadow-lg)">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:20px;margin-bottom:4px">Encaixar em Turmas</div>
      <div style="font-size:12px;color:var(--texto-muted);margin-bottom:16px">${a.nome}</div>
      ${linhasTurmas||'<div style="color:var(--texto-muted)">Nenhum horário cadastrado. Vá em Agenda para criar horários.</div>'}
      <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px">
        <button class="btn btn-ghost" onclick="document.getElementById('modal-encaixar-overlay').remove()">Cancelar</button>
        <button class="btn btn-primary" onclick="confirmarEncaixe('${alunoId}')">Salvar</button>
      </div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
}
window.abrirModalEncaixarTurma = abrirModalEncaixarTurma;

async function confirmarEncaixe(alunoId) {
  const selecionados = [...document.querySelectorAll('#modal-encaixar-overlay input[type=checkbox]:checked')]
    .map(el=>{ const [dia,horario]=el.value.split('|'); return {dia,horario}; });
  const a = alunos.find(x=>x.id===alunoId);
  const at = {...a, turmas:selecionados, frequencia:selecionados.length};
  alunos = alunos.map(x=>x.id===alunoId?at:x);
  await salvarAlunoDb(at);
  document.getElementById('modal-encaixar-overlay').remove();
  toast('Turmas atualizadas ✓');
  abrirPerfilAluno(alunoId);
}
window.confirmarEncaixe = confirmarEncaixe;

// ═══════════════════════════════════════════════════
// TRILHA DE AUDITORIA — VIEW
// ═══════════════════════════════════════════════════
async function renderAuditoriaView() {
  loading(true);
  let registros = [];
  try {
    const snap = await getDocs(collection(db,'auditoria'));
    registros = snap.docs.map(d=>d.data()).sort((a,b)=>b.ts-a.ts);
  } catch(e) { registros = []; }

  let excluidos = [];
  try {
    const snapH = await getDocs(collection(db,'historico'));
    excluidos = snapH.docs.map(d=>d.data()).filter(h=>h.status==='excluido');
  } catch(e) {}

  const acaoLabels = {
    cadastro_aluno:'👤 Cadastro de aluno', edicao_aluno:'✏️ Edição de aluno',
    exclusao_aluno:'🗑 Aluno arquivado', renovacao_contrato:'🔄 Renovação',
    edicao_pagamento:'✏️ Edição de pagamento', exclusao_pagamento:'🗑 Pagamento arquivado',
    edicao_ferias:'✏️ Edição de férias', exclusao_ferias:'🗑 Férias removidas',
  };

  const rows = registros.length ? registros.map(r => {
    let antes={},depois={};
    try{antes=JSON.parse(r.dadosAntes||'{}')}catch(e){}
    try{depois=JSON.parse(r.dadosDepois||'{}')}catch(e){}
    const diff=Object.keys({...antes,...depois}).filter(k=>JSON.stringify(antes[k])!==JSON.stringify(depois[k])&&k!=='ts')
      .map(k=>`<span style="font-size:11px;background:#f4f4f4;padding:1px 5px;border-radius:3px;margin:1px">${k}: <span style="color:#999;text-decoration:line-through">${antes[k]||'—'}</span>→<strong>${depois[k]||'—'}</strong></span>`).join(' ');
    return `<tr>
      <td style="font-size:12px;color:var(--texto-muted);white-space:nowrap">${r.data} ${r.hora||''}</td>
      <td><strong>${acaoLabels[r.acao]||r.acao}</strong></td>
      <td style="font-weight:600">${r.alunoNome||'—'}</td>
      <td style="font-size:11px">${diff||'—'}</td>
    </tr>`;
  }).join('') : `<tr><td colspan="4"><div class="empty"><div class="empty-icon">🔍</div>Nenhuma ação registrada ainda.</div></td></tr>`;

  const excRows = excluidos.length ? excluidos.map(h=>`<tr>
    <td style="font-size:12px;color:var(--texto-muted)">${h.excluido_em||h.data}</td>
    <td style="font-weight:600">${h.alunoNome||'—'}</td>
    <td>${h.tipo||'—'} — ${fmtValor(h.valor)}</td>
    <td><button class="btn btn-success btn-sm" onclick="restaurarHistorico('${h.id}')">↩ Restaurar</button></td>
  </tr>`).join('') : `<tr><td colspan="4" style="padding:16px;color:var(--texto-muted);text-align:center">Nenhum registro arquivado.</td></tr>`;

  document.getElementById('content').innerHTML = `
    <div style="margin-bottom:20px">
      <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:12px 16px;font-size:13px">
        🔒 <strong>Área restrita</strong> — Todas as alterações ficam registradas. Nenhum dado é apagado permanentemente.
      </div>
    </div>
    <div class="section-box" style="margin-bottom:20px">
      <div class="section-header">
        <div class="section-title">Histórico de Ações (${registros.length})</div>
        <div style="font-size:12px;color:var(--texto-muted)">Edições, exclusões e renovações</div>
      </div>
      <div style="overflow-x:auto"><table>
        <thead><tr><th>Data/Hora</th><th>Ação</th><th>Aluno</th><th>Alterações</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>
    </div>
    <div class="section-box">
      <div class="section-header">
        <div class="section-title">Registros Arquivados (${excluidos.length})</div>
        <div style="font-size:12px;color:var(--texto-muted)">Podem ser restaurados</div>
      </div>
      <div style="overflow-x:auto"><table>
        <thead><tr><th>Arquivado em</th><th>Aluno</th><th>Descrição</th><th>Ação</th></tr></thead>
        <tbody>${excRows}</tbody>
      </table></div>
    </div>`;
}
window.renderAuditoriaView = renderAuditoriaView;

async function restaurarHistorico(histId) {
  if (!confirm('Restaurar este registro?')) return;
  await setDoc(doc(db,'historico',histId),{status:'ativo'},{merge:true});
  toast('Registro restaurado ✓');
  renderAuditoriaView();
}
window.restaurarHistorico = restaurarHistorico;


// ═══════════════════════════════════════════════════
// REFATORAÇÃO — CONTRATOS, PAGAMENTOS E FINANCEIRO CAIXA/COMPETÊNCIA
// ═══════════════════════════════════════════════════
const PLANO_MESES = {mensal:1,trimestral:3,semestral:6,anual:12};
const PLANO_LABEL = {mensal:'Mensal',trimestral:'Trimestral',semestral:'Semestral',anual:'Anual'};

function esc(v){ return String(v ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
function valorContrato(c){ return Number(c?.valorTotal ?? c?.valor ?? 0); }
function mesesContrato(c){
  if (!c) return 1;
  return PLANO_MESES[c.plano] || Math.max(1, Math.round((new Date(c.venc)-new Date(c.inicio))/86400000/30));
}
function mensalidadeContrato(c){ return valorContrato(c) / mesesContrato(c); }
function dataMesInicio(mes,ano){ return new Date(ano, mes, 1); }
function dataMesFim(mes,ano){ return new Date(ano, mes+1, 0, 23, 59, 59); }
function dataLocal(dateStr){
  const [y,m,d] = String(dateStr||'').split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m-1, d);
}
function contratoSobrepoeMes(c, mes, ano){
  if (!c || c.status === 'excluido' || c.status === 'cancelado') return false;
  const ini = dataLocal(c.inicio), venc = dataLocal(c.venc);
  if (!ini || !venc) return false;
  return ini <= dataMesFim(mes,ano) && venc >= dataMesInicio(mes,ano);
}
function diasContratoNoMes(c, mes, ano){
  if (!c || c.status === 'excluido' || c.status === 'cancelado') return 0;
  const inicio = dataLocal(c.inicio), venc = dataLocal(c.venc);
  if (!inicio || !venc) return 0;

  // Para competência, o vencimento é tratado como limite exclusivo.
  // Ex.: contrato 08/03 a 08/04 pertence a março; o contrato seguinte começa em 08/04.
  const fimExclusivo = new Date(venc);
  if (fimExclusivo <= inicio) fimExclusivo.setDate(fimExclusivo.getDate()+1);

  const mesInicio = new Date(ano, mes, 1);
  const mesFimExclusivo = new Date(ano, mes+1, 1);
  const inicioCalc = new Date(Math.max(inicio.getTime(), mesInicio.getTime()));
  const fimCalc = new Date(Math.min(fimExclusivo.getTime(), mesFimExclusivo.getTime()));
  if (fimCalc <= inicioCalc) return 0;
  return Math.ceil((fimCalc - inicioCalc) / 86400000);
}
function mesesCompetenciaContrato(c){
  const inicio = dataLocal(c?.inicio), venc = dataLocal(c?.venc);
  if (!inicio || !venc || c.status === 'excluido' || c.status === 'cancelado') return [];
  const qtdMeses = Math.max(1, mesesContrato(c));
  const meses = [];
  const cursor = new Date(inicio.getFullYear(), inicio.getMonth(), 1);
  const fimLoop = new Date(venc.getFullYear(), venc.getMonth(), 1);
  while (cursor <= fimLoop) {
    const ano = cursor.getFullYear(), mes = cursor.getMonth();
    const dias = diasContratoNoMes(c, mes, ano);
    if (dias > 0) meses.push({ano, mes, dias, chave:`${ano}_${String(mes).padStart(2,'0')}`});
    cursor.setMonth(cursor.getMonth()+1);
  }
  return meses
    .sort((a,b)=> b.dias - a.dias || a.ano - b.ano || a.mes - b.mes)
    .slice(0, qtdMeses)
    .sort((a,b)=> a.ano - b.ano || a.mes - b.mes);
}
function contratoContaCompetenciaMes(c, mes, ano){
  const chave = `${ano}_${String(mes).padStart(2,'0')}`;
  return mesesCompetenciaContrato(c).some(m=>m.chave===chave);
}
function nomeContrato(c){
  if (c?.nome) return c.nome;
  if (!c?.inicio) return `${PLANO_LABEL[c?.plano]||'Contrato'}`;
  const [ano,mes] = c.inicio.split('-');
  const nomeMes = MESES_NOMES[(parseInt(mes,10)||1)-1] || '';
  return `${nomeMes}/${ano} — ${PLANO_LABEL[c.plano]||c.plano||'Contrato'}`;
}
function contratosDoAluno(alunoId){
  return contratos.filter(c=>String(c.alunoId)===String(alunoId) && c.status!=='excluido')
    .sort((a,b)=>new Date(a.inicio)-new Date(b.inicio));
}
function pagamentosDoContrato(contratoId){
  return pagamentos.filter(p=>String(p.contratoId)===String(contratoId) && p.status!=='excluido')
    .sort((a,b)=>new Date(a.data)-new Date(b.data));
}
function pagamentosDoAluno(alunoId){
  return pagamentos.filter(p=>String(p.alunoId)===String(alunoId) && p.status!=='excluido')
    .sort((a,b)=>new Date(b.data)-new Date(a.data));
}
function totalPagoContrato(contratoId){ return pagamentosDoContrato(contratoId).reduce((s,p)=>s+Number(p.valor||0),0); }
function saldoContrato(c){ return Math.max(0, valorContrato(c) - totalPagoContrato(c?.id)); }
function contratoVigenteAluno(alunoId){
  const lista = contratosDoAluno(alunoId);
  const hoje = new Date();
  const vigente = lista.find(c=>new Date(c.inicio)<=hoje && new Date(c.venc)>=hoje);
  if (vigente) return vigente;
  const futuro = lista.find(c=>new Date(c.inicio)>hoje);
  if (futuro) return futuro;
  return lista[lista.length-1] || null;
}
function statusContratoObj(c){
  if(!c) return {contrato:'nao_renovou', label:'Sem contrato', cor:'#6b7280', icon:'📋'};
  const hoje = new Date();
  const ini = new Date(c.inicio), venc = new Date(c.venc);
  if (ini > hoje) return {contrato:'aguardando', label:'Contrato futuro', cor:'var(--azul)', icon:'⏳'};
  if (venc < hoje) return {contrato:'a_renovar', label:'A renovar', cor:'#b45309', icon:'📋'};
  const pago = totalPagoContrato(c.id);
  const total = valorContrato(c);
  if (pago >= total && total > 0) return {contrato:'ativo', label:'Vigente e quitado', cor:'var(--verde)', icon:'✅'};
  if (pago > 0) return {contrato:'aguardando', label:'Vigente — parcial', cor:'var(--amarelo)', icon:'◐'};
  return {contrato:'aguardando', label:'Vigente — em aberto', cor:'var(--azul)', icon:'⏳'};
}
function hidratarAlunosComContratos(){
  alunos = alunos.filter(a=>a.status!=='arquivado').map(a=>{
    const c = contratoVigenteAluno(a.id);
    const dataEntrada = a.dataEntrada || a.entrada || a.inicio || '';
    return {
      ...a,
      dataEntrada,
      contratoAtual: c,
      contratosAluno: contratosDoAluno(a.id),
      pagamentosAluno: pagamentosDoAluno(a.id),
      plano: c?.plano || a.plano || 'mensal',
      valor: c ? valorContrato(c) : Number(a.valor||0),
      inicio: c?.inicio || a.inicio || dataEntrada,
      venc: c?.venc || a.venc || dataEntrada,
      pgto: c?.pgto || a.pgto || 'PIX',
      recebimento: c?.recebimento || a.recebimento || 'avista',
      parcelas: c?.parcelas ?? a.parcelas ?? null,
      status: c ? (statusContratoObj(c).contrato==='ativo' ? 'pago' : 'pendente') : (a.status||'nao_renovou')
    };
  });
}
async function carregarContratos(){
  try {
    const snap = await getDocs(collection(db,'contratos'));
    contratos = snap.docs.map(d=>({id:d.id,...d.data()}));
  } catch(e) { contratos = []; console.warn('Erro ao carregar contratos', e); }

  // Migração leve: se algum aluno antigo ainda não tem contrato, cria um contrato inicial a partir dos campos antigos.
  const batch = writeBatch(db);
  let criou = 0;
  for (const a of alunos) {
    const jaTem = contratos.some(c=>String(c.alunoId)===String(a.id));
    if (!jaTem && a.plano && a.inicio && a.venc) {
      const id = `ct_${a.id}_${Date.now()}_${criou}`;
      const c = {
        id, alunoId:String(a.id), alunoNome:a.nome||'', nome:'Contrato inicial',
        plano:a.plano, valorTotal:Number(a.valor||0), inicio:a.inicio, venc:a.venc,
        pgto:a.pgto||'PIX', recebimento:a.recebimento||'avista', parcelas:a.parcelas||null,
        status:'ativo', obs:a.obs||'', origem:'migracao_campos_antigos', criadoEm:new Date().toISOString(), ts:Date.now()+criou
      };
      contratos.push(c); batch.set(doc(db,'contratos',id), c); criou++;
    }
  }
  if (criou) { try { await batch.commit(); } catch(e) { console.warn('Migração contratos falhou', e); } }
}
async function carregarPagamentos(){
  try {
    const snap = await getDocs(collection(db,'pagamentos'));
    pagamentos = snap.docs.map(d=>({id:d.id,...d.data()}));
  } catch(e) { pagamentos = []; console.warn('Erro ao carregar pagamentos', e); }
}
async function salvarContratoDb(c){
  contratos = contratos.filter(x=>String(x.id)!==String(c.id)).concat(c);
  await setDoc(doc(db,'contratos',String(c.id)), c);
  hidratarAlunosComContratos();
}
async function salvarPagamentoDb(p){
  pagamentos = pagamentos.filter(x=>String(x.id)!==String(p.id)).concat(p);
  await setDoc(doc(db,'pagamentos',String(p.id)), p);
  hidratarAlunosComContratos();
}

mensalidadeAluno = function(a){ return mensalidadeContrato(a?.contratoAtual) || 0; };
mensalidade = mensalidadeAluno;
receitaMensal = function(){ return receitaMesEsp(MES_ATUAL, ANO_ATUAL); };
receitaMesEsp = function(mes,ano){
  return contratos.filter(c=>contratoContaCompetenciaMes(c,mes,ano)).reduce((acc,c)=>acc+mensalidadeContrato(c),0);
};
function receitaCaixaMes(mes,ano){
  return pagamentos.filter(p=>p.status!=='excluido' && p.data && new Date(p.data)>=dataMesInicio(mes,ano) && new Date(p.data)<=dataMesFim(mes,ano))
    .reduce((acc,p)=>acc+Number(p.valor||0),0);
}
function receitaDoMesSelecionada(mes,ano){ return financeiroModo==='caixa' ? receitaCaixaMes(mes,ano) : receitaMesEsp(mes,ano); }
statusContrato = function(a){ return statusContratoObj(a?.contratoAtual); };

function statusContratoHistorico(c){
  if(!c) return {contrato:'nao_renovou', label:'Sem contrato', cor:'#6b7280', icon:'📋'};
  const hoje = new Date();
  const ini = dataLocal(c.inicio), venc = dataLocal(vencAjustadoContrato(c));
  const pago = totalPagoContrato(c.id);
  const total = valorContrato(c);
  const saldo = Math.max(0,total-pago);
  if (ini > hoje) return {contrato:'futuro', label:'Contrato futuro', cor:'var(--azul)', icon:'⏳'};
  if (venc < hoje) return saldo>0
    ? {contrato:'inadimplente', label:'Vencido em aberto', cor:'var(--vermelho)', icon:'🔴'}
    : {contrato:'quitado', label:'Quitado', cor:'var(--verde)', icon:'✅'};
  if (pago >= total && total > 0) return {contrato:'ativo', label:'Vigente e quitado', cor:'var(--verde)', icon:'✅'};
  if (pago > 0) return {contrato:'aguardando', label:'Vigente — parcial', cor:'var(--amarelo)', icon:'◐'};
  return {contrato:'aguardando', label:'Vigente — pendente', cor:'var(--azul)', icon:'⏳'};
}
progressPlano = function(a){
  const c = a?.contratoAtual;
  if(!c) return `<div style="font-size:11px;color:var(--texto-muted);margin-top:2px">Sem contrato cadastrado</div>`;
  const ini = new Date(c.inicio), venc = new Date(c.venc), hoje = new Date();
  const totalDias = Math.max(1, Math.round((venc-ini)/86400000));
  const diasPassados = Math.max(0, Math.min(totalDias, Math.round((hoje-ini)/86400000)));
  const pct = Math.round((diasPassados/totalDias)*100);
  const pago = totalPagoContrato(c.id), total = valorContrato(c), saldo = Math.max(0,total-pago);
  const pctPago = total>0 ? Math.min(100, Math.round(pago/total*100)) : 0;
  return `<div class="progress-wrap"><div class="progress-bar" style="width:80px"><div class="progress-fill" style="width:${pct}%"></div></div><span class="progress-label">${pct}% do período</span></div>
  <div style="font-size:10px;color:var(--texto-muted);margin-top:2px">${fmtValor(mensalidadeContrato(c))}/mês · Total ${fmtValor(total)}</div>
  <div style="font-size:10px;color:${saldo>0?'var(--amarelo)':'var(--verde)'};margin-top:1px">Pago ${fmtValor(pago)} (${pctPago}%) · Saldo ${fmtValor(saldo)}</div>`;
};


let alunoPerfilAtualId = null;
function resumoTurmasAluno(a){
  const turmas = a?.turmas || [];
  if(!turmas.length) return '—';
  return turmas.map(t=>`<div style="font-size:12px;line-height:1.35;margin-bottom:2px"><strong>${esc(t.dia||'Dia')}</strong> · ${esc(t.horario||'horário não informado')}</div>`).join('');
}

openModalAluno = function(id){
  editandoId = id || null;
  if(id){
    const a = alunos.find(x=>String(x.id)===String(id));
    if(!a) return;
    const html = `<div style="position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:400;display:flex;align-items:center;justify-content:center;padding:16px" id="modal-editaluno-overlay">
      <div style="background:#fff;border-radius:12px;width:100%;max-width:480px;box-shadow:var(--shadow-lg);max-height:90vh;overflow-y:auto">
        <div style="padding:20px 24px 0;display:flex;align-items:center;justify-content:space-between">
          <div style="font-family:'Bebas Neue',sans-serif;font-size:22px">Editar dados do aluno</div>
          <button onclick="document.getElementById('modal-editaluno-overlay').remove()" style="background:none;border:none;font-size:20px;cursor:pointer;color:#999">✕</button>
        </div>
        <div style="padding:8px 24px 0;font-size:12px;color:var(--texto-muted)">Plano, valor e vencimento agora ficam no histórico de contratos.</div>
        <div style="padding:20px 24px" class="form-grid">
          <div class="form-group full"><label class="form-label">Nome completo</label><input class="form-input" id="ea-nome" value="${esc(a.nome)}"></div>
          <div class="form-group full"><label class="form-label">WhatsApp</label><input class="form-input" id="ea-whats" value="${esc(a.whats||'')}"></div>
          <div class="form-group"><label class="form-label">Data de entrada</label><input class="form-input" id="ea-dataEntrada" type="date" value="${a.dataEntrada||a.inicio||''}"></div>
          <div class="form-group"><label class="form-label">Frequência semanal</label><select class="form-select" id="ea-frequencia">${[1,2,3,4,5,6,7].map(n=>`<option value="${n}" ${(a.frequencia||3)===n?'selected':''}>${n}x por semana</option>`).join('')}</select></div>
          <div class="form-group full"><label class="form-label">Observações do aluno</label><input class="form-input" id="ea-obs" value="${esc(a.obsAluno||a.obs||'')}"></div>
        </div>
        <div style="padding:16px 24px 20px;border-top:1px solid var(--borda);display:flex;justify-content:flex-end;gap:8px">
          <button class="btn btn-ghost" onclick="document.getElementById('modal-editaluno-overlay').remove()">Cancelar</button>
          <button class="btn btn-primary" onclick="confirmarEditAluno('${id}')">Salvar</button>
        </div>
      </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
    return;
  }
  document.getElementById('modal-aluno-title').textContent = 'Cadastrar Aluno + Primeiro Contrato';
  const hoje = HOJE.toISOString().split('T')[0];
  document.getElementById('f-nome').value='';
  document.getElementById('f-whats').value='';
  document.getElementById('f-plano').value='mensal';
  document.getElementById('f-valor').value='400';
  document.getElementById('f-inicio').value=hoje;
  document.getElementById('f-venc').value=addMeses(hoje,1);
  document.getElementById('f-pgto').value='PIX';
  document.getElementById('f-recebimento').value='mensal';
  document.getElementById('f-status').value='pendente';
  document.getElementById('f-obs').value='';
  document.getElementById('modal-aluno').classList.add('open');
};
window.openModalAluno = openModalAluno;

window.confirmarEditAluno = async function(id){
  const a = alunos.find(x=>String(x.id)===String(id)); if(!a) return;
  const antes = {...a};
  const at = {...a,
    nome:document.getElementById('ea-nome').value.trim(),
    whats:document.getElementById('ea-whats').value.trim(),
    dataEntrada:document.getElementById('ea-dataEntrada').value,
    frequencia:parseInt(document.getElementById('ea-frequencia').value)||3,
    obsAluno:document.getElementById('ea-obs').value.trim()
  };
  if(!at.nome){ alert('Informe o nome.'); return; }
  // Atualiza também o nome nos contratos/pagamentos para facilitar leitura no Firebase.
  for (const c of contratos.filter(c=>String(c.alunoId)===String(id))) { c.alunoNome = at.nome; await setDoc(doc(db,'contratos',String(c.id)), c); }
  for (const p of pagamentos.filter(p=>String(p.alunoId)===String(id))) { p.alunoNome = at.nome; await setDoc(doc(db,'pagamentos',String(p.id)), p); }
  alunos = alunos.map(x=>String(x.id)===String(id)?at:x);
  await salvarAlunoDb({id:at.id,nome:at.nome,whats:at.whats,dataEntrada:at.dataEntrada,frequencia:at.frequencia,ferias:at.ferias||[],turmas:at.turmas||[],obsAluno:at.obsAluno,statusGeral:at.statusGeral||'ativo'});
  await registrarAuditoria('edicao_aluno', id, at.nome, {nome:antes.nome,whats:antes.whats,dataEntrada:antes.dataEntrada||antes.inicio}, {nome:at.nome,whats:at.whats,dataEntrada:at.dataEntrada});
  hidratarAlunosComContratos();
  document.getElementById('modal-editaluno-overlay').remove();
  toast('Dados do aluno atualizados ✓');
  abrirPerfilAluno(id);
};

salvarAluno = async function(){
  const nome = document.getElementById('f-nome').value.trim();
  if(!nome){ alert('Informe o nome.'); return; }
  const alunoId = gerarId();
  const dataEntrada = document.getElementById('f-inicio').value || HOJE.toISOString().split('T')[0];
  const aluno = {id:alunoId,nome,whats:document.getElementById('f-whats').value.trim(),dataEntrada,frequencia:3,ferias:[],turmas:[],obsAluno:'',statusGeral:'ativo'};
  const plano = document.getElementById('f-plano').value;
  const valor = parseFloat(document.getElementById('f-valor').value)||0;
  const inicio = dataEntrada;
  const venc = document.getElementById('f-venc').value;
  const parcelasVal = document.getElementById('f-parcelas')?.value || '';
  if(!inicio || !venc || valor<=0){ alert('Preencha início, vencimento e valor do contrato.'); return; }
  const contratoId = `ct_${alunoId}_${Date.now()}`;
  const contrato = {id:contratoId, alunoId, alunoNome:nome, nome:'Contrato inicial', plano, valorTotal:valor, inicio, venc,
    pgto:document.getElementById('f-pgto').value, parcelas:parcelasVal?parseInt(parcelasVal):null,
    recebimento:document.getElementById('f-recebimento').value, status:'ativo', obs:document.getElementById('f-obs').value.trim(), criadoEm:new Date().toISOString(), ts:Date.now()};
  alunos.push(aluno); contratos.push(contrato);
  await salvarAlunoDb(aluno);
  await salvarContratoDb(contrato);
  if(document.getElementById('f-status').value==='pago'){
    const p = {id:`pg_${contratoId}_${Date.now()}`, contratoId, alunoId, alunoNome:nome, valor, data:inicio, forma:contrato.pgto, parcelas:contrato.pgto==='Cartão'?contrato.parcelas:null, descricao:'Pagamento do contrato inicial', status:'ativo', ts:Date.now()};
    await salvarPagamentoDb(p);
  }
  await registrarAuditoria('cadastro_aluno', alunoId, nome, {}, {aluno, contrato});
  closeModalAluno(); hidratarAlunosComContratos(); toast('Aluno e contrato inicial cadastrados ✓'); render();
};
window.salvarAluno = salvarAluno;

function abrirModalContrato(alunoId, contratoId=null){
  const a = alunos.find(x=>String(x.id)===String(alunoId)); if(!a) return;
  const atual = contratoId ? contratos.find(c=>String(c.id)===String(contratoId)) : contratoVigenteAluno(alunoId);
  const baseInicio = atual?.venc ? (()=>{const d=new Date(atual.venc); d.setDate(d.getDate()+1); return d.toISOString().split('T')[0];})() : (a.dataEntrada||HOJE.toISOString().split('T')[0]);
  const c = contratoId ? atual : {plano:atual?.plano||'mensal', valorTotal:atual?valorContrato(atual):400, inicio:baseInicio, venc:addMeses(baseInicio, PLANO_MESES[atual?.plano||'mensal']||1), pgto:atual?.pgto||'PIX', recebimento:atual?.recebimento||'mensal', parcelas:null, obs:''};
  const titulo = contratoId ? 'Editar Contrato' : 'Novo Contrato / Renovação';
  const html = `<div style="position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:400;display:flex;align-items:center;justify-content:center;padding:16px" id="modal-contrato-overlay">
    <div style="background:#fff;border-radius:12px;padding:0;width:100%;max-width:520px;box-shadow:var(--shadow-lg);max-height:90vh;overflow-y:auto">
      <div style="padding:20px 24px 0;display:flex;align-items:center;justify-content:space-between"><div style="font-family:'Bebas Neue',sans-serif;font-size:22px">${titulo}</div><button onclick="document.getElementById('modal-contrato-overlay').remove()" style="background:none;border:none;font-size:20px;cursor:pointer;color:#999">✕</button></div>
      <div style="padding:8px 24px;font-size:13px;color:var(--texto-muted);border-bottom:1px solid var(--borda)"><strong>${esc(a.nome)}</strong></div>
      <div style="padding:20px 24px" class="form-grid">
        <div class="form-group"><label class="form-label">Nome do contrato</label><input class="form-input" id="ct-nome" value="${esc(c?.nome && c.nome!=='Contrato inicial'?c.nome:'') }" placeholder="Ex: Maio/2026 — Anual"></div>
        <div class="form-group"><label class="form-label">Plano</label><select class="form-select" id="ct-plano" onchange="calcContratoVenc()">${Object.entries(PLANO_LABEL).map(([v,l])=>`<option value="${v}" ${c.plano===v?'selected':''}>${l}</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label">Valor total (R$)</label><input class="form-input" type="number" id="ct-valor" value="${valorContrato(c)}" step="0.01" oninput="calcContratoMensalidade()"><div class="form-hint" id="ct-mens-hint"></div></div>
        <div class="form-group"><label class="form-label">Início</label><input class="form-input" type="date" id="ct-inicio" value="${c.inicio||''}" onchange="calcContratoVenc()"></div>
        <div class="form-group"><label class="form-label">Vencimento</label><input class="form-input" type="date" id="ct-venc" value="${c.venc||''}"><div class="form-hint">Editável manualmente</div></div>
        <div class="form-group"><label class="form-label">Forma prevista</label><select class="form-select" id="ct-pgto"><option value="PIX" ${c.pgto==='PIX'?'selected':''}>PIX</option><option value="Cartão" ${c.pgto==='Cartão'?'selected':''}>Cartão</option><option value="Dinheiro" ${c.pgto==='Dinheiro'?'selected':''}>Dinheiro</option></select></div>
        <div class="form-group"><label class="form-label">Recebimento</label><select class="form-select" id="ct-receb"><option value="mensal" ${c.recebimento==='mensal'?'selected':''}>Mensal/recorrente</option><option value="avista" ${c.recebimento==='avista'?'selected':''}>À vista ou negociado</option></select></div>
        <div class="form-group full"><label class="form-label">Observações</label><input class="form-input" id="ct-obs" value="${esc(c.obs||'')}"></div>
      </div>
      <div style="padding:16px 24px 20px;border-top:1px solid var(--borda);display:flex;justify-content:flex-end;gap:8px"><button class="btn btn-ghost" onclick="document.getElementById('modal-contrato-overlay').remove()">Cancelar</button><button class="btn btn-primary" onclick="confirmarSalvarContrato('${alunoId}','${contratoId||''}')">Salvar contrato</button></div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', html); calcContratoMensalidade();
}
window.abrirModalContrato = abrirModalContrato;
renovar = function(id){ abrirModalContrato(id); };
window.renovar = renovar;
window.calcContratoVenc = function(){ const p=document.getElementById('ct-plano')?.value; const i=document.getElementById('ct-inicio')?.value; if(p&&i) document.getElementById('ct-venc').value=addMeses(i,PLANO_MESES[p]||1); calcContratoMensalidade(); };
window.calcContratoMensalidade = function(){ const v=parseFloat(document.getElementById('ct-valor')?.value)||0; const p=document.getElementById('ct-plano')?.value||'mensal'; const h=document.getElementById('ct-mens-hint'); if(h) h.textContent = v>0 ? `Competência estimada: ${fmtValor(v/(PLANO_MESES[p]||1))}/mês` : ''; };
window.confirmarSalvarContrato = async function(alunoId, contratoId){
  const a = alunos.find(x=>String(x.id)===String(alunoId)); if(!a) return;
  const existente = contratoId ? contratos.find(c=>String(c.id)===String(contratoId)) : null;
  const plano=document.getElementById('ct-plano').value, valor=parseFloat(document.getElementById('ct-valor').value)||0, inicio=document.getElementById('ct-inicio').value, venc=document.getElementById('ct-venc').value;
  if(!inicio || !venc || valor<=0){ alert('Preencha início, vencimento e valor.'); return; }
  const id = contratoId || `ct_${alunoId}_${Date.now()}`;
  const c = {id, alunoId:String(alunoId), alunoNome:a.nome, nome:document.getElementById('ct-nome').value.trim()||'', plano, valorTotal:valor, inicio, venc, pgto:document.getElementById('ct-pgto').value, recebimento:document.getElementById('ct-receb').value, parcelas:null, status:'ativo', obs:document.getElementById('ct-obs').value.trim(), criadoEm:existente?.criadoEm||new Date().toISOString(), ts:existente?.ts||Date.now(), atualizadoEm:new Date().toISOString()};
  await salvarContratoDb(c);
  await registrarAuditoria(contratoId?'edicao_contrato':'renovacao_contrato', alunoId, a.nome, existente||{}, c);
  document.getElementById('modal-contrato-overlay').remove();
  toast(contratoId?'Contrato atualizado ✓':'Novo contrato cadastrado ✓');
  abrirPerfilAluno(alunoId);
};

async function excluirContrato(alunoId, contratoId){
  const c = contratos.find(x=>String(x.id)===String(contratoId)); if(!c) return;
  if(!confirm('Arquivar este contrato? Os pagamentos dele continuarão no histórico.')) return;
  const antes = {...c}; c.status='excluido'; c.excluidoEm=new Date().toISOString();
  await salvarContratoDb(c); await registrarAuditoria('exclusao_contrato', alunoId, c.alunoNome, antes, {status:'excluido'});
  toast('Contrato arquivado ✓'); abrirPerfilAluno(alunoId);
}
window.excluirContrato = excluirContrato;

function abrirModalPagamentoContrato(alunoId, contratoId=null, pagamentoId=null){
  const a = alunos.find(x=>String(x.id)===String(alunoId)); if(!a) return;
  const c = contratoId ? contratos.find(x=>String(x.id)===String(contratoId)) : contratoVigenteAluno(alunoId);
  if(!c){ alert('Cadastre um contrato antes de lançar pagamento.'); return; }
  const p = pagamentoId ? pagamentos.find(x=>String(x.id)===String(pagamentoId)) : null;
  const sugestao = Math.max(0, saldoContrato(c));
  const html = `<div style="position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:420;display:flex;align-items:center;justify-content:center;padding:16px" id="modal-pagamento-overlay">
    <div style="background:#fff;border-radius:12px;padding:24px;width:100%;max-width:440px;box-shadow:var(--shadow-lg)">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:22px;margin-bottom:4px">${p?'Editar Pagamento':'Registrar Pagamento'}</div>
      <div style="font-size:12px;color:var(--texto-muted);margin-bottom:16px"><strong>${esc(a.nome)}</strong> · ${esc(nomeContrato(c))}<br>Saldo atual: ${fmtValor(sugestao)}</div>
      <div class="form-grid" style="grid-template-columns:1fr">
        <div class="form-group"><label class="form-label">Data do pagamento</label><input class="form-input" type="date" id="pg-data" value="${p?.data||HOJE.toISOString().split('T')[0]}"></div>
        <div class="form-group"><label class="form-label">Valor (R$)</label><input class="form-input" type="number" id="pg-valor" step="0.01" value="${p?.valor ?? sugestao}"></div>
        <div class="form-group"><label class="form-label">Forma</label><select class="form-select" id="pg-forma" onchange="togglePgParcelas()"><option value="PIX" ${(p?.forma||c.pgto)==='PIX'?'selected':''}>PIX</option><option value="Cartão" ${(p?.forma||c.pgto)==='Cartão'?'selected':''}>Cartão</option><option value="Dinheiro" ${(p?.forma||c.pgto)==='Dinheiro'?'selected':''}>Dinheiro</option></select></div>
        <div class="form-group" id="pg-parcelas-group" style="display:none"><label class="form-label">Parcelamento no cartão</label><select class="form-select" id="pg-parcelas"><option value="">Não informado</option><option value="1" ${p?.parcelas===1?'selected':''}>1x</option><option value="2" ${p?.parcelas===2?'selected':''}>2x</option><option value="3" ${p?.parcelas===3?'selected':''}>3x</option><option value="4" ${p?.parcelas===4?'selected':''}>4x</option><option value="5" ${p?.parcelas===5?'selected':''}>5x</option><option value="6" ${p?.parcelas===6?'selected':''}>6x</option><option value="7" ${p?.parcelas===7?'selected':''}>7x</option><option value="8" ${p?.parcelas===8?'selected':''}>8x</option><option value="9" ${p?.parcelas===9?'selected':''}>9x</option><option value="10" ${p?.parcelas===10?'selected':''}>10x</option><option value="11" ${p?.parcelas===11?'selected':''}>11x</option><option value="12" ${p?.parcelas===12?'selected':''}>12x</option></select><div class="form-hint">Só para registro. No caixa entra o valor total recebido.</div></div>
        <div class="form-group"><label class="form-label">Descrição</label><input class="form-input" id="pg-desc" value="${esc(p?.descricao||'Pagamento do contrato')}"></div>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px"><button class="btn btn-ghost" onclick="document.getElementById('modal-pagamento-overlay').remove()">Cancelar</button><button class="btn btn-primary" onclick="confirmarPagamentoContrato('${alunoId}','${c.id}','${pagamentoId||''}')">Salvar</button></div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
  window.togglePgParcelas();
}
window.abrirModalPagamentoContrato = abrirModalPagamentoContrato;
window.togglePgParcelas = function(){
  const forma = document.getElementById('pg-forma')?.value;
  const grp = document.getElementById('pg-parcelas-group');
  if (!grp) return;
  grp.style.display = forma === 'Cartão' ? '' : 'none';
  if (forma !== 'Cartão') { const el = document.getElementById('pg-parcelas'); if (el) el.value = ''; }
};
abrirModalLancarPgto = function(id,nome){ abrirModalPagamentoContrato(id); };
window.abrirModalLancarPgto = abrirModalLancarPgto;
registrarPagamento = async function(id){ abrirModalPagamentoContrato(id); };
window.registrarPagamento = registrarPagamento;
window.confirmarPagamentoContrato = async function(alunoId, contratoId, pagamentoId){
  const c = contratos.find(x=>String(x.id)===String(contratoId)); const a = alunos.find(x=>String(x.id)===String(alunoId)); if(!c||!a) return;
  const valor=parseFloat(document.getElementById('pg-valor').value)||0, data=document.getElementById('pg-data').value;
  if(!data || valor<=0){ alert('Preencha data e valor.'); return; }
  const existente = pagamentoId ? pagamentos.find(p=>String(p.id)===String(pagamentoId)) : null;
  const id = pagamentoId || `pg_${contratoId}_${Date.now()}`;
  const forma = document.getElementById('pg-forma').value;
  const parcelas = forma === 'Cartão' ? (parseInt(document.getElementById('pg-parcelas')?.value)||null) : null;
  const pg = {id, contratoId:String(contratoId), alunoId:String(alunoId), alunoNome:a.nome, valor, data, forma, parcelas, descricao:document.getElementById('pg-desc').value.trim()||'Pagamento', status:'ativo', ts:existente?.ts||Date.now(), atualizadoEm:new Date().toISOString()};
  await salvarPagamentoDb(pg); await registrarAuditoria(pagamentoId?'edicao_pagamento':'pagamento_contrato', alunoId, a.nome, existente||{}, pg);
  document.getElementById('modal-pagamento-overlay').remove(); toast('Pagamento salvo ✓'); abrirPerfilAluno(alunoId);
};
function editarPagamento(alunoId, pagamentoId){ const p=pagamentos.find(x=>String(x.id)===String(pagamentoId)); if(p) abrirModalPagamentoContrato(alunoId,p.contratoId,pagamentoId); }
window.editarPagamento = editarPagamento;
async function excluirPagamento(alunoId, pagamentoId){
  const p = pagamentos.find(x=>String(x.id)===String(pagamentoId)); if(!p) return;
  if(!confirm('Arquivar este pagamento?')) return;
  const antes={...p}; p.status='excluido'; p.excluidoEm=new Date().toISOString(); await salvarPagamentoDb(p);
  await registrarAuditoria('exclusao_pagamento', alunoId, p.alunoNome, antes, {status:'excluido'});
  toast('Pagamento arquivado ✓'); abrirPerfilAluno(alunoId);
}
window.excluirPagamento = excluirPagamento;

abrirPerfilAluno = async function(id){
  alunoPerfilAtualId = String(id);
  hidratarAlunosComContratos();
  const a = alunos.find(x=>String(x.id)===String(id)); if(!a) return;
  const lista = contratosDoAluno(id).sort((x,y)=>new Date(y.inicio)-new Date(x.inicio));
  const cAtual = contratoVigenteAluno(id);
  const sc = statusContratoObj(cAtual);
  const freq = a.frequencia || 3;
  const limiteDias = {mensal:0,trimestral:7,semestral:15,anual:30}[cAtual?.plano]||0;
  const ferias = a.ferias || [];
  const diasUsados = ferias.reduce((acc,f)=>acc+Math.max(0,Math.round((new Date(f.fim)-new Date(f.inicio))/86400000)+1),0);
  const diasRestantes = Math.max(0,limiteDias-diasUsados);
  const feriasHtml = ferias.length ? ferias.map((f,i)=>`<div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--borda)"><div style="flex:1"><strong>${fmtData(f.inicio)} → ${fmtData(f.fim)}</strong></div><button class="btn btn-ghost btn-sm" onclick="editarFerias('${id}',${i},${limiteDias},${diasUsados})">✏️</button><button class="btn btn-danger btn-sm" onclick="excluirFerias('${id}',${i})">🗑</button></div>`).join('') : '<div style="color:var(--texto-muted);font-size:13px;padding:8px 0">Nenhum período registrado.</div>';
  const contratoAtualHtml = cAtual ? `<div style="padding:16px 24px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px"><span class="badge badge-${sc.contrato}" style="color:${sc.cor};background:${sc.cor}18;font-size:12px">${sc.icon} ${sc.label}</span><button class="btn btn-ghost btn-sm" onclick="abrirModalContrato('${id}','${cAtual.id}')">✏️ Editar</button></div>
      ${[['Contrato',nomeContrato(cAtual)],['Plano',PLANO_LABEL[cAtual.plano]||cAtual.plano],['Início',fmtData(cAtual.inicio)],['Vencimento',fmtData(cAtual.venc)],['Valor total',fmtValor(valorContrato(cAtual))],['Pago',fmtValor(totalPagoContrato(cAtual.id))],['Saldo',fmtValor(saldoContrato(cAtual))]].map(([l,v])=>`<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--borda);font-size:13px"><span style="color:var(--texto-muted)">${l}</span><span style="font-weight:600">${v}</span></div>`).join('')}
      <div style="display:flex;gap:8px;margin-top:12px"><button class="btn btn-success btn-sm" onclick="abrirModalPagamentoContrato('${id}','${cAtual.id}')" style="flex:1">💰 Registrar pagamento</button><button class="btn btn-primary btn-sm" onclick="abrirModalContrato('${id}')" style="flex:1">🔄 Renovar</button></div>
    </div>` : `<div class="empty"><div class="empty-icon">📋</div>Sem contrato cadastrado.<br><button class="btn btn-primary btn-sm" onclick="abrirModalContrato('${id}')" style="margin-top:12px">+ Criar contrato</button></div>`;
  const contratosHtml = lista.length ? lista.map(c=>{
    const pago=totalPagoContrato(c.id), saldo=saldoContrato(c), s=statusContratoHistorico(c);
    return `<tr><td><strong>${esc(nomeContrato(c))}</strong><div style="font-size:11px;color:var(--texto-muted)">${fmtData(c.inicio)} → ${fmtData(c.venc)}</div></td><td>${planoBadge(c.plano)}</td><td style="font-weight:700">${fmtValor(valorContrato(c))}</td><td style="color:var(--verde);font-weight:700">${fmtValor(pago)}</td><td style="color:${saldo>0?'var(--amarelo)':'var(--verde)'};font-weight:700">${fmtValor(saldo)}</td><td><span class="badge" style="color:${s.cor};background:${s.cor}18">${s.icon} ${s.label}</span></td><td style="white-space:nowrap"><button class="btn btn-success btn-sm" onclick="abrirModalPagamentoContrato('${id}','${c.id}')">💰</button><button class="btn btn-ghost btn-sm" onclick="abrirModalContrato('${id}','${c.id}')">✏️</button><button class="btn btn-danger btn-sm" onclick="excluirContrato('${id}','${c.id}')">🗑</button></td></tr>`;
  }).join('') : '<tr><td colspan="7"><div class="empty">Nenhum contrato cadastrado.</div></td></tr>';
  const pgRows = pagamentosDoAluno(id).map(p=>`<tr><td>${fmtData(p.data)}</td><td><strong>${esc(p.descricao||'Pagamento')}</strong><div style="font-size:11px;color:var(--texto-muted)">${esc(nomeContrato(contratos.find(c=>String(c.id)===String(p.contratoId))||{}))} · ${p.forma||'—'}${p.parcelas?` · ${p.parcelas}x`:''}</div></td><td style="font-weight:700;color:var(--verde)">${fmtValor(p.valor)}</td><td style="white-space:nowrap"><button class="btn btn-ghost btn-sm" onclick="editarPagamento('${id}','${p.id}')">✏️</button><button class="btn btn-danger btn-sm" onclick="excluirPagamento('${id}','${p.id}')">🗑</button></td></tr>`).join('') || '<tr><td colspan="4"><div class="empty">Nenhum pagamento registrado.</div></td></tr>';
  document.getElementById('content').innerHTML = `<div style="margin-bottom:20px"><button class="btn btn-ghost btn-sm" onclick="setView('alunos')">← Voltar para Alunos</button></div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px">
    <div class="section-box"><div class="section-header"><div class="section-title">${esc(a.nome)}</div><button class="btn btn-ghost btn-sm" onclick="openModalAluno('${id}')">✏️ Editar aluno</button></div><div style="padding:16px 24px;display:grid;grid-template-columns:1fr 1fr;gap:12px">${[['Entrada no Studio',fmtData(a.dataEntrada)],['WhatsApp',a.whats||'—'],['Frequência',`${freq}x/semana`],['Turmas',resumoTurmasAluno(a)]].map(([l,v])=>`<div><div style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--texto-muted);margin-bottom:3px">${l}</div><div style="font-weight:600">${v}</div></div>`).join('')}${a.obsAluno?`<div style="grid-column:1/-1;padding:8px 12px;background:var(--cinza-light);border-radius:6px;font-size:12px;color:var(--texto-muted)">${esc(a.obsAluno)}</div>`:''}</div></div>
    <div class="section-box"><div class="section-header"><div class="section-title">Contrato vigente</div></div>${contratoAtualHtml}</div>
  </div>
  <div class="section-box" style="margin-bottom:20px"><div class="section-header"><div class="section-title">Histórico de Contratos</div><button class="btn btn-primary btn-sm" onclick="abrirModalContrato('${id}')">+ Novo contrato</button></div><div class="table-wrap"><table><thead><tr><th>Contrato</th><th>Plano</th><th>Total</th><th>Pago</th><th>Saldo</th><th>Status</th><th>Ações</th></tr></thead><tbody>${contratosHtml}</tbody></table></div></div>
  <div class="section-box" style="margin-bottom:20px"><div class="section-header"><div class="section-title">Pagamentos</div><button class="btn btn-ghost btn-sm" onclick="abrirModalPagamentoContrato('${id}')">+ Lançar</button></div><div class="table-wrap"><table><thead><tr><th>Data</th><th>Descrição</th><th>Valor</th><th>Ações</th></tr></thead><tbody>${pgRows}</tbody></table></div></div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px"><div class="section-box"><div class="section-header"><div><div class="section-title">Férias / Trancamento</div><div style="font-size:12px;color:var(--texto-muted)">${limiteDias>0?`${diasUsados}/${limiteDias} dias usados · ${diasRestantes} restantes`:'Plano mensal — sem direito a férias'}</div></div>${limiteDias>0?`<button class="btn btn-ghost btn-sm" onclick="abrirModalFerias('${id}')">+ Adicionar</button>`:''}</div><div style="padding:12px 24px">${limiteDias>0?feriasHtml:'<div style="color:var(--texto-muted);font-size:13px">Plano mensal não tem direito a férias.</div>'}</div></div><div class="section-box"><div class="section-header"><div class="section-title">Configuração de treino</div></div><div style="padding:16px 24px"><div class="form-group"><label class="form-label">Frequência semanal</label><select class="form-select" onchange="salvarFrequencia('${id}',this.value)">${[1,2,3,4,5,6,7].map(n=>`<option value="${n}" ${freq===n?'selected':''}>${n}x por semana</option>`).join('')}</select></div><button class="btn btn-primary btn-sm" onclick="abrirModalEncaixarTurma('${id}')" style="width:100%;margin-top:12px">📅 Encaixar em Turmas</button></div></div></div>`;
  document.getElementById('page-title').textContent = a.nome;
};
window.abrirPerfilAluno = abrirPerfilAluno;

renderFinanceiroView = async function(){
  loading(true);
  const cats = await loadDespesas(finMes, finAno);
  const receita = receitaDoMesSelecionada(finMes, finAno);
  const receitaComp = receitaMesEsp(finMes, finAno);
  const receitaCx = receitaCaixaMes(finMes, finAno);
  const catDefs = {operacional:{label:'Colaboradores',icon:'👔',color:'var(--azul)'},despesa_op:{label:'Despesas Operacionais',icon:'🏢',color:'var(--roxo)'},administrativo:{label:'Administrativo',icon:'📋',color:'var(--texto-mid)'},marketing:{label:'Marketing',icon:'📣',color:'var(--vermelho)'},impostos:{label:'Impostos',icon:'🧾',color:'#b45309'}};
  const totais={}; let totDesp=0; Object.keys(catDefs).forEach(cat=>{totais[cat]=(cats[cat]||[]).reduce((a,d)=>a+Number(d.valor),0);totDesp+=totais[cat];});
  const resultado=receita-totDesp, resPos=resultado>=0;
  const projecao = await Promise.all(Array.from({length:12},async(_,i)=>{const d=await loadDespesas(i,finAno); const r=financeiroModo==='caixa'?receitaCaixaMes(i,finAno):receitaMesEsp(i,finAno); const td=totalDesp(d); return {mes:i,receita:r,desp:td,resultado:r-td,cats:d};}));
  const totAnoRec=projecao.reduce((a,p)=>a+p.receita,0), totAnoDesp=projecao.reduce((a,p)=>a+p.desp,0), totAnoRes=totAnoRec-totAnoDesp;
  const contratosMes = contratos.filter(c=>contratoContaCompetenciaMes(c,finMes,finAno)).sort((a,b)=>mensalidadeContrato(b)-mensalidadeContrato(a));
  const pagamentosMes = pagamentos.filter(p=>p.status!=='excluido' && p.data && new Date(p.data)>=dataMesInicio(finMes,finAno) && new Date(p.data)<=dataMesFim(finMes,finAno)).sort((a,b)=>new Date(b.data)-new Date(a.data));
  const linhasReceita = financeiroModo==='caixa'
    ? pagamentosMes.map(p=>`<tr><td>${fmtData(p.data)}</td><td>${esc(p.alunoNome||'—')}<div style="font-size:11px;color:var(--texto-muted)">${esc(p.descricao||'Pagamento')} · ${p.forma||'—'}${p.parcelas?` · ${p.parcelas}x`:''}</div></td><td style="color:var(--verde);font-weight:700">${fmtValor(p.valor)}</td></tr>`).join('')
    : contratosMes.map(c=>`<tr><td>${esc(c.alunoNome||'—')}</td><td>${esc(nomeContrato(c))}<div style="font-size:11px;color:var(--texto-muted)">${fmtData(c.inicio)} → ${fmtData(c.venc)}</div></td><td style="color:var(--verde);font-weight:700">${fmtValor(mensalidadeContrato(c))}</td></tr>`).join('');
  document.getElementById('content').innerHTML = `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:12px"><div class="mes-selector"><button class="mes-btn" onclick="navegarFin(-1)">◀</button><div class="mes-label">${MESES_NOMES[finMes]} ${finAno}</div><button class="mes-btn" onclick="navegarFin(1)">▶</button></div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn ${financeiroModo==='competencia'?'btn-primary':'btn-ghost'} btn-sm" onclick="setModoFinanceiro('competencia')">Competência</button><button class="btn ${financeiroModo==='caixa'?'btn-primary':'btn-ghost'} btn-sm" onclick="setModoFinanceiro('caixa')">Caixa</button><button class="btn btn-ghost btn-sm" onclick="setView('despesas')">✏️ Editar despesas</button><button class="btn btn-primary btn-sm" onclick="imprimirDRE()">🖨️ Imprimir</button></div></div>
  <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:12px 16px;font-size:13px;margin-bottom:20px"><strong>Visão atual: ${financeiroModo==='competencia'?'Competência':'Caixa'}.</strong> Competência reconhece contratos por ciclos mensais a partir da data de início; Caixa mostra pagamentos recebidos no mês. Comp.: <strong>${fmtValor(receitaComp)}</strong> · Caixa: <strong>${fmtValor(receitaCx)}</strong></div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px"><div class="card c-green" style="border-top:3px solid var(--verde)"><div class="card-label">Receita do Mês</div><div class="card-value" style="font-size:24px;padding-top:4px">${fmtValor(receita)}</div><div class="card-sub">${financeiroModo==='competencia'?'por ciclos mensais do contrato':'por pagamentos recebidos'}</div></div><div class="card" style="border-top:3px solid var(--vermelho)"><div class="card-label">Total Despesas</div><div class="card-value" style="font-size:24px;padding-top:4px;color:var(--vermelho)">${fmtValor(totDesp)}</div><div class="card-sub">${receita>0?(totDesp/receita*100).toFixed(1):0}% da receita</div></div><div class="card" style="border-top:3px solid ${resPos?'var(--verde)':'var(--vermelho)'}"><div class="card-label">Resultado</div><div class="card-value" style="font-size:24px;padding-top:4px;color:${resPos?'var(--verde)':'var(--vermelho)'}">${resPos?'':'-'}${fmtValor(Math.abs(resultado))}</div><div class="card-sub">${resPos?'▲ superávit':'▼ déficit'}</div></div></div>
  <div class="section-box" style="margin-bottom:24px"><div class="section-header"><div class="section-title">Receita — ${financeiroModo==='competencia'?'Competência':'Caixa'}</div></div><div class="table-wrap"><table><thead><tr>${financeiroModo==='caixa'?'<th>Data</th><th>Aluno / descrição</th><th>Valor</th>':'<th>Aluno</th><th>Contrato</th><th>Receita mensal</th>'}</tr></thead><tbody>${linhasReceita||`<tr><td colspan="3"><div class="empty">Nenhuma receita nesta visão.</div></td></tr>`}</tbody></table></div></div>
  <div class="section-box" style="margin-bottom:24px"><div class="section-header"><div class="section-title">Resumo Financeiro</div></div><div style="padding:0"><div style="padding:14px 24px;border-bottom:1px solid var(--borda);background:#f9fafb;display:flex;justify-content:space-between;align-items:center"><span style="font-weight:700">💰 Receita líquida</span><span style="font-weight:700;color:var(--verde);font-size:15px">${fmtValor(receita)}</span></div>${Object.entries(catDefs).map(([cat,info])=>{const pct=receita>0?(totais[cat]/receita*100):0;return `<div style="padding:12px 24px;border-bottom:1px solid var(--borda);display:grid;grid-template-columns:1fr auto 120px;align-items:center;gap:12px"><span style="font-size:13px;color:var(--texto-mid)">${info.icon} ${info.label}</span><span style="font-weight:700;color:var(--vermelho);white-space:nowrap">${fmtValor(totais[cat])}</span><div><div style="height:5px;background:var(--borda);border-radius:2px;overflow:hidden"><div style="height:100%;width:${Math.min(100,pct)}%;background:${info.color};border-radius:2px"></div></div><div style="font-size:10px;color:var(--texto-muted);margin-top:2px">${pct.toFixed(0)}% da receita</div></div></div>`;}).join('')}<div style="padding:14px 24px;border-bottom:1px solid var(--borda);display:flex;justify-content:space-between;font-weight:700"><span>Total despesas</span><span style="color:var(--vermelho)">${fmtValor(totDesp)}</span></div><div style="padding:14px 24px;background:${resPos?'rgba(46,125,50,0.05)':'rgba(211,47,47,0.05)'};display:flex;justify-content:space-between;font-weight:700;font-size:15px"><span>Resultado</span><span style="color:${resPos?'var(--verde)':'var(--vermelho)'}">${resPos?'':'-'}${fmtValor(Math.abs(resultado))}</span></div></div></div>
  <div class="section-box"><div class="section-header"><div class="section-title">Projeção Anual — ${financeiroModo==='competencia'?'Competência':'Caixa'}</div><div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap"><div class="mes-selector" style="padding:4px 10px"><button class="mes-btn" onclick="navegarAnoPro(-1)">◀</button><div class="mes-label" style="min-width:50px">${finAno}</div><button class="mes-btn" onclick="navegarAnoPro(1)">▶</button></div><div style="font-size:12px;color:var(--texto-muted)">Rec: <strong style="color:var(--verde)">${fmtValor(totAnoRec)}</strong> &nbsp; Desp: <strong style="color:var(--vermelho)">${fmtValor(totAnoDesp)}</strong> &nbsp; Res: <strong style="color:${totAnoRes>=0?'var(--verde)':'var(--vermelho)'}">${totAnoRes>=0?'':'-'}${fmtValor(Math.abs(totAnoRes))}</strong></div></div></div><div style="overflow-x:auto"><table><thead><tr><th>Mês</th><th>Receita</th><th>Total Desp.</th><th>Resultado</th></tr></thead><tbody>${projecao.map(p=>`<tr style="${p.mes===finMes?'background:rgba(211,47,47,0.04);font-weight:600':''}"><td style="font-weight:600">${MESES_ABREV[p.mes]}</td><td style="color:var(--verde);font-weight:600">${fmtValor(p.receita)}</td><td style="color:var(--vermelho);font-weight:600">${fmtValor(p.desp)}</td><td style="font-weight:700;color:${p.resultado>=0?'var(--verde)':'var(--vermelho)'}">${p.resultado>=0?'':'-'}${fmtValor(Math.abs(p.resultado))}</td></tr>`).join('')}</tbody><tfoot><tr style="background:#f9fafb;font-weight:700;border-top:2px solid var(--borda)"><td>TOTAL</td><td style="color:var(--verde)">${fmtValor(totAnoRec)}</td><td style="color:var(--vermelho)">${fmtValor(totAnoDesp)}</td><td style="color:${totAnoRes>=0?'var(--verde)':'var(--vermelho)'}">${totAnoRes>=0?'':'-'}${fmtValor(Math.abs(totAnoRes))}</td></tr></tfoot></table></div></div>`;
};
window.setModoFinanceiro = function(modo){
  financeiroModo = modo;
  if (viewAtual === 'financeiro') renderFinanceiroView();
  else if (viewAtual === 'dashboard') renderDashboard();
  else render();
};


// Modal de receita atualizado: acompanha a visão Competência/Caixa usada no Dashboard e no Financeiro.
abrirResumoReceita = function() {
  const mes = MES_ATUAL, ano = ANO_ATUAL;
  const total = receitaDoMesSelecionada(mes, ano);
  const receitaComp = receitaMesEsp(mes, ano);
  const receitaCx = receitaCaixaMes(mes, ano);
  const contratosMes = contratos.filter(c=>contratoContaCompetenciaMes(c,mes,ano)).sort((a,b)=>mensalidadeContrato(b)-mensalidadeContrato(a));
  const pagamentosMes = pagamentos.filter(p=>p.status!=='excluido' && p.data && new Date(p.data)>=dataMesInicio(mes,ano) && new Date(p.data)<=dataMesFim(mes,ano)).sort((a,b)=>new Date(b.data)-new Date(a.data));
  const linhas = financeiroModo==='caixa'
    ? pagamentosMes.map(p=>`<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--borda);cursor:pointer" onclick="document.getElementById('modal-receita-overlay').remove();abrirPerfilAluno('${p.alunoId}')"><div style="flex:1"><div style="font-weight:600;color:var(--vermelho);text-decoration:underline;text-underline-offset:2px">${esc(p.alunoNome||'—')}</div><div style="font-size:11px;color:var(--texto-muted)">${fmtData(p.data)} · ${esc(p.descricao||'Pagamento')} · ${p.forma||'—'}${p.parcelas?` · ${p.parcelas}x`:''}</div></div><div style="text-align:right"><div style="font-weight:700;color:var(--verde)">${fmtValor(p.valor)}</div><div style="font-size:10px;color:var(--texto-muted)">caixa</div></div></div>`).join('')
    : contratosMes.map(c=>{const mens=mensalidadeContrato(c); const pct=total>0?(mens/total*100).toFixed(1):0; return `<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--borda);cursor:pointer" onclick="document.getElementById('modal-receita-overlay').remove();abrirPerfilAluno('${c.alunoId}')"><div style="flex:1"><div style="font-weight:600;color:var(--vermelho);text-decoration:underline;text-underline-offset:2px">${esc(c.alunoNome||'—')}</div><div style="font-size:11px;color:var(--texto-muted)">${esc(nomeContrato(c))} · ${fmtData(c.inicio)} → ${fmtData(c.venc)}</div></div><div style="text-align:right"><div style="font-weight:700;color:var(--verde)">${fmtValor(mens)}</div><div style="font-size:10px;color:var(--texto-muted)">${pct}% da receita</div></div></div>`;}).join('');
  const html = `<div style="position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:400;display:flex;align-items:center;justify-content:center;padding:16px" id="modal-receita-overlay">
    <div style="background:#fff;border-radius:12px;width:100%;max-width:560px;max-height:85vh;overflow-y:auto;box-shadow:var(--shadow-lg)">
      <div style="padding:20px 24px;border-bottom:1px solid var(--borda);display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;background:#fff;z-index:1;gap:12px">
        <div>
          <div style="font-family:'Bebas Neue',sans-serif;font-size:22px">Receita — ${financeiroModo==='competencia'?'Competência':'Caixa'}</div>
          <div style="font-size:12px;color:var(--texto-muted)">${MESES_NOMES[mes]} ${ano} · Comp.: ${fmtValor(receitaComp)} · Caixa: ${fmtValor(receitaCx)}</div>
          <div style="display:flex;gap:6px;margin-top:10px"><button class="btn ${financeiroModo==='competencia'?'btn-primary':'btn-ghost'} btn-sm" onclick="setModoFinanceiro('competencia');document.getElementById('modal-receita-overlay').remove();abrirResumoReceita()">Competência</button><button class="btn ${financeiroModo==='caixa'?'btn-primary':'btn-ghost'} btn-sm" onclick="setModoFinanceiro('caixa');document.getElementById('modal-receita-overlay').remove();abrirResumoReceita()">Caixa</button></div>
        </div>
        <div style="text-align:right;min-width:125px">
          <div style="font-family:'Bebas Neue',sans-serif;font-size:28px;color:var(--verde)">${fmtValor(total)}</div>
          <button onclick="document.getElementById('modal-receita-overlay').remove()" style="background:none;border:none;cursor:pointer;font-size:13px;color:var(--texto-muted)">✕ Fechar</button>
        </div>
      </div>
      <div style="padding:0 24px 16px">
        ${linhas || `<div class="empty">Nenhuma receita nesta visão.</div>`}
        <div style="display:flex;justify-content:space-between;padding:12px 0;font-weight:700;font-size:14px;border-top:2px solid var(--borda);margin-top:4px"><span>Total</span><span style="color:var(--verde)">${fmtValor(total)}</span></div>
      </div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
  document.getElementById('modal-receita-overlay').addEventListener('click', function(e) { if (e.target === this) this.remove(); });
};
window.abrirResumoReceita = abrirResumoReceita;


// ═══════════════════════════════════════════════════
// AJUSTES LGV V3 — IMPOSTOS, TURMAS, TAXAS DE CARTÃO
// ═══════════════════════════════════════════════════
function num(v){ return Number(v||0); }
function valorTaxaCartao(p){
  if(!p || p.forma !== 'Cartão') return 0;
  if(p.taxaCartaoValor !== undefined && p.taxaCartaoValor !== null) return Math.max(0, num(p.taxaCartaoValor));
  if(num(p.valorBruto)>0 && num(p.valor)>0) return Math.max(0, num(p.valorBruto)-num(p.valor));
  return 0;
}
function pagamentosCartaoMes(mes,ano){
  return pagamentos.filter(p=>p.status!=='excluido' && p.forma==='Cartão' && p.data && new Date(p.data)>=dataMesInicio(mes,ano) && new Date(p.data)<=dataMesFim(mes,ano));
}
function totalTaxaCartaoMes(mes,ano){ return pagamentosCartaoMes(mes,ano).reduce((s,p)=>s+valorTaxaCartao(p),0); }
function totalBrutoCartaoMes(mes,ano){ return pagamentosCartaoMes(mes,ano).reduce((s,p)=>s+num(p.valorBruto||p.valor),0); }
function totalLiquidoCartaoMes(mes,ano){ return pagamentosCartaoMes(mes,ano).reduce((s,p)=>s+num(p.valor),0); }
function totalBrutoPagoContrato(contratoId){ return pagamentosDoContrato(contratoId).reduce((s,p)=>s+num(p.valorBruto||p.valor),0); }
function detalheCartaoTexto(p){
  if(!p || p.forma!=='Cartão') return '';
  const taxa = valorTaxaCartao(p);
  const bruto = num(p.valorBruto||p.valor);
  const perc = p.taxaCartaoPerc ? ` · taxa ${Number(p.taxaCartaoPerc).toLocaleString('pt-BR',{maximumFractionDigits:2})}%` : '';
  return ` · ${p.parcelas?`${p.parcelas}x · `:''}bruto ${fmtValor(bruto)}${taxa>0?` · líquido ${fmtValor(p.valor)} · taxa ${fmtValor(taxa)}${perc}`:''}`;
}
function garantirOpcaoImpostos(){
  const sel = document.getElementById('df-cat');
  if(sel && ![...sel.options].some(o=>o.value==='impostos')){
    const opt = document.createElement('option'); opt.value='impostos'; opt.textContent='Impostos'; sel.appendChild(opt);
  }
}

// Modal de contrato com valor bruto/líquido para cartão
function abrirModalContratoLGV(alunoId, contratoId=null){
  const a = alunos.find(x=>String(x.id)===String(alunoId)); if(!a) return;
  const atual = contratoId ? contratos.find(c=>String(c.id)===String(contratoId)) : contratoVigenteAluno(alunoId);
  const baseInicio = atual?.venc ? (()=>{const d=new Date(atual.venc); d.setDate(d.getDate()+1); return d.toISOString().split('T')[0];})() : (a.dataEntrada||HOJE.toISOString().split('T')[0]);
  const c = contratoId ? atual : {plano:atual?.plano||'mensal', valorTotal:atual?valorContrato(atual):400, valorBruto:atual?.valorBruto||null, taxaCartaoPerc:atual?.taxaCartaoPerc||null, taxaCartaoValor:atual?.taxaCartaoValor||null, inicio:baseInicio, venc:addMeses(baseInicio, PLANO_MESES[atual?.plano||'mensal']||1), pgto:atual?.pgto||'PIX', recebimento:atual?.recebimento||'mensal', parcelas:atual?.parcelas||null, obs:''};
  const titulo = contratoId ? 'Editar Contrato' : 'Novo Contrato / Renovação';
  const brutoInicial = c.valorBruto || valorContrato(c);
  const html = `<div style="position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:400;display:flex;align-items:center;justify-content:center;padding:16px" id="modal-contrato-overlay">
    <div style="background:#fff;border-radius:12px;padding:0;width:100%;max-width:560px;box-shadow:var(--shadow-lg);max-height:90vh;overflow-y:auto">
      <div style="padding:20px 24px 0;display:flex;align-items:center;justify-content:space-between"><div style="font-family:'Bebas Neue',sans-serif;font-size:22px">${titulo}</div><button onclick="document.getElementById('modal-contrato-overlay').remove()" style="background:none;border:none;font-size:20px;cursor:pointer;color:#999">✕</button></div>
      <div style="padding:8px 24px;font-size:13px;color:var(--texto-muted);border-bottom:1px solid var(--borda)"><strong>${esc(a.nome)}</strong></div>
      <div style="padding:20px 24px" class="form-grid">
        <div class="form-group"><label class="form-label">Nome do contrato</label><input class="form-input" id="ct-nome" value="${esc(c?.nome && c.nome!=='Contrato inicial'?c.nome:'') }" placeholder="Ex: Maio/2026 — Anual"></div>
        <div class="form-group"><label class="form-label">Plano</label><select class="form-select" id="ct-plano" onchange="calcContratoVenc()">${Object.entries(PLANO_LABEL).map(([v,l])=>`<option value="${v}" ${c.plano===v?'selected':''}>${l}</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label">Valor líquido / competência (R$)</label><input class="form-input" type="number" id="ct-valor" value="${valorContrato(c)}" step="0.01" oninput="calcContratoMensalidade()"><div class="form-hint" id="ct-mens-hint"></div></div>
        <div class="form-group"><label class="form-label">Forma prevista</label><select class="form-select" id="ct-pgto" onchange="toggleCtCartao()"><option value="PIX" ${c.pgto==='PIX'?'selected':''}>PIX</option><option value="Cartão" ${c.pgto==='Cartão'?'selected':''}>Cartão</option><option value="Dinheiro" ${c.pgto==='Dinheiro'?'selected':''}>Dinheiro</option></select></div>
        <div class="form-group" id="ct-bruto-group" style="display:none"><label class="form-label">Valor cobrado no cartão (bruto)</label><input class="form-input" type="number" id="ct-valor-bruto" value="${brutoInicial||''}" step="0.01" oninput="calcCtCartao()"><div class="form-hint">Só registro e base para taxa. Não entra no resultado.</div></div>
        <div class="form-group" id="ct-taxa-group" style="display:none"><label class="form-label">Taxa do cartão (%)</label><input class="form-input" type="number" id="ct-taxa-perc" value="${c.taxaCartaoPerc||''}" step="0.01" oninput="calcCtCartao()"><div class="form-hint" id="ct-taxa-hint"></div></div>
        <div class="form-group" id="ct-parcelas-group" style="display:none"><label class="form-label">Parcelamento no cartão</label><select class="form-select" id="ct-parcelas"><option value="">Não informado</option>${Array.from({length:12},(_,i)=>i+1).map(n=>`<option value="${n}" ${Number(c.parcelas)===n?'selected':''}>${n}x</option>`).join('')}</select><div class="form-hint">Só para registro.</div></div>
        <div class="form-group"><label class="form-label">Início</label><input class="form-input" type="date" id="ct-inicio" value="${c.inicio||''}" onchange="calcContratoVenc()"></div>
        <div class="form-group"><label class="form-label">Vencimento</label><input class="form-input" type="date" id="ct-venc" value="${c.venc||''}"><div class="form-hint">Editável manualmente</div></div>
        <div class="form-group"><label class="form-label">Recebimento</label><select class="form-select" id="ct-receb"><option value="mensal" ${c.recebimento==='mensal'?'selected':''}>Mensal/recorrente</option><option value="avista" ${c.recebimento==='avista'?'selected':''}>À vista ou negociado</option></select></div>
        <div class="form-group full"><label class="form-label">Observações</label><input class="form-input" id="ct-obs" value="${esc(c.obs||'')}"></div>
      </div>
      <div style="padding:16px 24px 20px;border-top:1px solid var(--borda);display:flex;justify-content:flex-end;gap:8px"><button class="btn btn-ghost" onclick="document.getElementById('modal-contrato-overlay').remove()">Cancelar</button><button class="btn btn-primary" onclick="confirmarSalvarContrato('${alunoId}','${contratoId||''}')">Salvar contrato</button></div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', html); calcContratoMensalidade(); toggleCtCartao();
}
abrirModalContrato = abrirModalContratoLGV;
window.abrirModalContrato = abrirModalContrato;
renovar = function(id){ abrirModalContrato(id); };
window.renovar = renovar;
window.toggleCtCartao = function(){
  const forma = document.getElementById('ct-pgto')?.value;
  ['ct-bruto-group','ct-taxa-group','ct-parcelas-group'].forEach(id=>{ const el=document.getElementById(id); if(el) el.style.display = forma==='Cartão' ? '' : 'none'; });
  if(forma==='Cartão') calcCtCartao();
};
window.calcCtCartao = function(){
  const bruto = parseFloat(document.getElementById('ct-valor-bruto')?.value)||0;
  const perc = parseFloat(document.getElementById('ct-taxa-perc')?.value)||0;
  const taxa = bruto>0 && perc>0 ? bruto*perc/100 : 0;
  const liquido = Math.max(0, bruto-taxa);
  const hint = document.getElementById('ct-taxa-hint');
  if(hint) hint.textContent = bruto>0 && perc>0 ? `Taxa estimada: ${fmtValor(taxa)} · líquido: ${fmtValor(liquido)}` : 'Informe percentual para calcular a taxa automaticamente.';
  if(bruto>0 && perc>0) { const v=document.getElementById('ct-valor'); if(v) v.value = liquido.toFixed(2); calcContratoMensalidade(); }
};
window.confirmarSalvarContrato = async function(alunoId, contratoId){
  const a = alunos.find(x=>String(x.id)===String(alunoId)); if(!a) return;
  const existente = contratoId ? contratos.find(c=>String(c.id)===String(contratoId)) : null;
  const plano=document.getElementById('ct-plano').value, valor=parseFloat(document.getElementById('ct-valor').value)||0, inicio=document.getElementById('ct-inicio').value, venc=document.getElementById('ct-venc').value;
  if(!inicio || !venc || valor<=0){ alert('Preencha início, vencimento e valor.'); return; }
  const id = contratoId || `ct_${alunoId}_${Date.now()}`;
  const forma = document.getElementById('ct-pgto').value;
  const bruto = forma==='Cartão' ? (parseFloat(document.getElementById('ct-valor-bruto')?.value)||null) : null;
  const taxaPerc = forma==='Cartão' ? (parseFloat(document.getElementById('ct-taxa-perc')?.value)||null) : null;
  const taxaValor = forma==='Cartão' && bruto && taxaPerc ? bruto*taxaPerc/100 : null;
  const parcelas = forma==='Cartão' ? (parseInt(document.getElementById('ct-parcelas')?.value)||null) : null;
  const c = {id, alunoId:String(alunoId), alunoNome:a.nome, nome:document.getElementById('ct-nome').value.trim()||'', plano, valorTotal:valor, valorBruto:bruto, taxaCartaoPerc:taxaPerc, taxaCartaoValor:taxaValor, inicio, venc, pgto:forma, recebimento:document.getElementById('ct-receb').value, parcelas, status:'ativo', obs:document.getElementById('ct-obs').value.trim(), criadoEm:existente?.criadoEm||new Date().toISOString(), ts:existente?.ts||Date.now(), atualizadoEm:new Date().toISOString()};
  await salvarContratoDb(c);
  await registrarAuditoria(contratoId?'edicao_contrato':'renovacao_contrato', alunoId, a.nome, existente||{}, c);
  document.getElementById('modal-contrato-overlay').remove();
  toast(contratoId?'Contrato atualizado ✓':'Novo contrato cadastrado ✓');
  abrirPerfilAluno(alunoId);
};

// Modal de pagamento com bruto/líquido/taxa no cartão
function abrirModalPagamentoContratoLGV(alunoId, contratoId=null, pagamentoId=null){
  const a = alunos.find(x=>String(x.id)===String(alunoId)); if(!a) return;
  const c = contratoId ? contratos.find(x=>String(x.id)===String(contratoId)) : contratoVigenteAluno(alunoId);
  if(!c){ alert('Cadastre um contrato antes de lançar pagamento.'); return; }
  const p = pagamentoId ? pagamentos.find(x=>String(x.id)===String(pagamentoId)) : null;
  const sugestao = Math.max(0, saldoContrato(c));
  const brutoPago = totalBrutoPagoContrato(c.id);
  const brutoContrato = num(c.valorBruto||0);
  const sugestaoBruto = p?.valorBruto ?? (brutoContrato>0 ? Math.max(0, brutoContrato-brutoPago) : sugestao);
  const formaInicial = p?.forma || c.pgto || 'PIX';
  const taxaPercInicial = p?.taxaCartaoPerc ?? c.taxaCartaoPerc ?? '';
  const valorLiquidoInicial = p?.valor ?? sugestao;
  const html = `<div style="position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:420;display:flex;align-items:center;justify-content:center;padding:16px" id="modal-pagamento-overlay">
    <div style="background:#fff;border-radius:12px;padding:24px;width:100%;max-width:480px;box-shadow:var(--shadow-lg);max-height:90vh;overflow-y:auto">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:22px;margin-bottom:4px">${p?'Editar Pagamento':'Registrar Pagamento'}</div>
      <div style="font-size:12px;color:var(--texto-muted);margin-bottom:16px"><strong>${esc(a.nome)}</strong> · ${esc(nomeContrato(c))}<br>Saldo líquido atual: ${fmtValor(sugestao)}</div>
      <div class="form-grid" style="grid-template-columns:1fr">
        <div class="form-group"><label class="form-label">Data do pagamento</label><input class="form-input" type="date" id="pg-data" value="${p?.data||HOJE.toISOString().split('T')[0]}"></div>
        <div class="form-group"><label class="form-label">Forma</label><select class="form-select" id="pg-forma" onchange="togglePgCartao()"><option value="PIX" ${formaInicial==='PIX'?'selected':''}>PIX</option><option value="Cartão" ${formaInicial==='Cartão'?'selected':''}>Cartão</option><option value="Dinheiro" ${formaInicial==='Dinheiro'?'selected':''}>Dinheiro</option></select></div>
        <div class="form-group" id="pg-bruto-group" style="display:none"><label class="form-label">Valor cobrado no cartão (bruto)</label><input class="form-input" type="number" id="pg-valor-bruto" step="0.01" value="${sugestaoBruto||''}" oninput="calcPgCartao()"><div class="form-hint">Só registro e base da taxa. Não entra no caixa nem na competência.</div></div>
        <div class="form-group" id="pg-taxa-group" style="display:none"><label class="form-label">Taxa do cartão (%)</label><input class="form-input" type="number" id="pg-taxa-perc" step="0.01" value="${taxaPercInicial}" oninput="calcPgCartao()"><div class="form-hint" id="pg-taxa-hint"></div></div>
        <div class="form-group"><label class="form-label" id="pg-valor-label">Valor recebido / líquido (R$)</label><input class="form-input" type="number" id="pg-valor" step="0.01" value="${valorLiquidoInicial}"><div class="form-hint">Este é o valor usado na visão de caixa e para quitar o contrato.</div></div>
        <div class="form-group" id="pg-parcelas-group" style="display:none"><label class="form-label">Parcelamento no cartão</label><select class="form-select" id="pg-parcelas"><option value="">Não informado</option>${Array.from({length:12},(_,i)=>i+1).map(n=>`<option value="${n}" ${Number(p?.parcelas||c.parcelas)===n?'selected':''}>${n}x</option>`).join('')}</select><div class="form-hint">Só para registro. No caixa entra o valor líquido recebido.</div></div>
        <div class="form-group"><label class="form-label">Descrição</label><input class="form-input" id="pg-desc" value="${esc(p?.descricao||'Pagamento do contrato')}"></div>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px"><button class="btn btn-ghost" onclick="document.getElementById('modal-pagamento-overlay').remove()">Cancelar</button><button class="btn btn-primary" onclick="confirmarPagamentoContrato('${alunoId}','${c.id}','${pagamentoId||''}')">Salvar</button></div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
  togglePgCartao();
}
abrirModalPagamentoContrato = abrirModalPagamentoContratoLGV;
window.abrirModalPagamentoContrato = abrirModalPagamentoContrato;
registrarPagamento = async function(id){ abrirModalPagamentoContrato(id); };
window.registrarPagamento = registrarPagamento;
window.togglePgCartao = function(){
  const forma = document.getElementById('pg-forma')?.value;
  ['pg-bruto-group','pg-taxa-group','pg-parcelas-group'].forEach(id=>{ const el=document.getElementById(id); if(el) el.style.display = forma==='Cartão' ? '' : 'none'; });
  const lbl = document.getElementById('pg-valor-label'); if(lbl) lbl.textContent = forma==='Cartão' ? 'Valor líquido recebido (R$)' : 'Valor recebido (R$)';
  if(forma==='Cartão') calcPgCartao();
};
window.calcPgCartao = function(){
  const bruto = parseFloat(document.getElementById('pg-valor-bruto')?.value)||0;
  const perc = parseFloat(document.getElementById('pg-taxa-perc')?.value)||0;
  const taxa = bruto>0 && perc>0 ? bruto*perc/100 : 0;
  const liquido = Math.max(0, bruto-taxa);
  const hint = document.getElementById('pg-taxa-hint');
  if(hint) hint.textContent = bruto>0 && perc>0 ? `Taxa: ${fmtValor(taxa)} · líquido recebido: ${fmtValor(liquido)}` : 'Informe percentual para calcular a taxa automaticamente.';
  if(bruto>0 && perc>0) { const v=document.getElementById('pg-valor'); if(v) v.value = liquido.toFixed(2); }
};
window.confirmarPagamentoContrato = async function(alunoId, contratoId, pagamentoId){
  const c = contratos.find(x=>String(x.id)===String(contratoId)); const a = alunos.find(x=>String(x.id)===String(alunoId)); if(!c||!a) return;
  const valor=parseFloat(document.getElementById('pg-valor').value)||0, data=document.getElementById('pg-data').value;
  if(!data || valor<=0){ alert('Preencha data e valor.'); return; }
  const existente = pagamentoId ? pagamentos.find(p=>String(p.id)===String(pagamentoId)) : null;
  const id = pagamentoId || `pg_${contratoId}_${Date.now()}`;
  const forma = document.getElementById('pg-forma').value;
  const parcelas = forma === 'Cartão' ? (parseInt(document.getElementById('pg-parcelas')?.value)||null) : null;
  const valorBruto = forma === 'Cartão' ? (parseFloat(document.getElementById('pg-valor-bruto')?.value)||null) : null;
  const taxaPerc = forma === 'Cartão' ? (parseFloat(document.getElementById('pg-taxa-perc')?.value)||null) : null;
  const taxaValor = forma === 'Cartão' ? (valorBruto && taxaPerc ? valorBruto*taxaPerc/100 : Math.max(0, num(valorBruto)-valor)) : null;
  const pg = {id, contratoId:String(contratoId), alunoId:String(alunoId), alunoNome:a.nome, valor, valorLiquido:valor, valorBruto, taxaCartaoPerc:taxaPerc, taxaCartaoValor:taxaValor, data, forma, parcelas, descricao:document.getElementById('pg-desc').value.trim()||'Pagamento', status:'ativo', ts:existente?.ts||Date.now(), atualizadoEm:new Date().toISOString()};
  await salvarPagamentoDb(pg); await registrarAuditoria(pagamentoId?'edicao_pagamento':'pagamento_contrato', alunoId, a.nome, existente||{}, pg);
  document.getElementById('modal-pagamento-overlay').remove(); toast('Pagamento salvo ✓'); abrirPerfilAluno(alunoId);
};

// Despesas: impostos no modal e taxas de cartão informativas, fora do resultado
renderDespesasView = async function(){
  loading(true); garantirOpcaoImpostos();
  const cats = await loadDespesas(despMes, despAno);
  const catDefs = {operacional:{label:'Colaboradores',icon:'👔',color:'var(--azul)'},despesa_op:{label:'Despesas Operacionais',icon:'🏢',color:'var(--roxo)'},administrativo:{label:'Administrativo',icon:'📋',color:'var(--texto-mid)'},marketing:{label:'Marketing',icon:'📣',color:'var(--vermelho)'},impostos:{label:'Impostos',icon:'🧾',color:'#b45309'}};
  const tot = totalDesp(cats), taxas = pagamentosCartaoMes(despMes,despAno), totTaxa = totalTaxaCartaoMes(despMes,despAno);
  const taxasHtml = taxas.filter(p=>valorTaxaCartao(p)>0).map(p=>`<div class="desp-item"><span class="desp-nome">${esc(p.alunoNome||'—')} <span style="color:var(--texto-muted);font-size:11px">· ${fmtData(p.data)}${p.parcelas?` · ${p.parcelas}x`:''}</span></span><span class="desp-tipo-badge desp-tipo-pontual">Informativo</span><span class="desp-valor">${fmtValor(valorTaxaCartao(p))}</span></div>`).join('') || `<div style="color:var(--texto-muted);font-size:13px;padding:8px 0">Nenhuma taxa de cartão registrada neste mês.</div>`;
  document.getElementById('content').innerHTML=`
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:12px"><div><div style="font-size:12px;color:var(--texto-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Total lançado no DRE</div><div style="font-family:'Bebas Neue',sans-serif;font-size:32px;color:var(--vermelho)">${fmtValor(tot)}</div><div style="font-size:11px;color:var(--texto-muted)">Taxas de cartão são exibidas à parte e não entram no resultado.</div></div><div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap"><div class="mes-selector"><button class="mes-btn" onclick="navegarDesp(-1)">◀</button><div class="mes-label">${MESES_NOMES[despMes]} ${despAno}</div><button class="mes-btn" onclick="navegarDesp(1)">▶</button></div><button class="btn btn-ghost btn-sm" onclick="copiarMes()">📋 Copiar mês</button></div></div>
    <div class="desp-grid">${Object.entries(catDefs).map(([cat,info])=>{const items=cats[cat]||[]; const total=items.reduce((a,d)=>a+Number(d.valor),0); return `<div class="desp-card"><div class="desp-card-title" style="color:${info.color}">${info.icon} ${info.label}</div>${items.map((d,i)=>{const tipoBadge=d.tipo&&d.tipo!=='pontual'?`<span class="desp-tipo-badge desp-tipo-${d.tipo}">${d.tipo==='recorrente'?'Recorrente':'Parcelada'}</span>`:''; const actions=d.fixo?`<button class="desp-btn" onclick="cancelarProg('${d.progId}')">🚫</button>`:`<button class="desp-btn" onclick="editarDesp('${cat}',${i})">✏️</button><button class="desp-btn" onclick="excluirDesp('${cat}',${i})">🗑</button>`; return `<div class="desp-item"><span class="desp-nome">${esc(d.desc)}</span>${tipoBadge}<span class="desp-valor">${fmtValor(d.valor)}</span><div class="desp-actions">${actions}</div></div>`;}).join('')}<button class="desp-add" onclick="openModalDespNovo('${cat}')">＋ Adicionar item</button><div class="desp-total"><span>Total</span><span>${fmtValor(total)}</span></div></div>`;}).join('')}
      <div class="desp-card" style="border-color:#fed7aa;background:#fff7ed"><div class="desp-card-title" style="color:#b45309">💳 Taxas de cartão</div><div style="font-size:12px;color:#92400e;margin-bottom:8px">Informativo. Não entra no total de despesas, caixa, competência ou resultado.</div>${taxasHtml}<div class="desp-total"><span>Total informativo</span><span>${fmtValor(totTaxa)}</span></div></div>
    </div>`;
};
window.renderDespesasView = renderDespesasView;

// Financeiro com taxas de cartão informativas e impostos garantidos
renderFinanceiroView = async function(){
  loading(true);
  const cats = await loadDespesas(finMes, finAno);
  const receita = receitaDoMesSelecionada(finMes, finAno), receitaComp = receitaMesEsp(finMes, finAno), receitaCx = receitaCaixaMes(finMes, finAno);
  const catDefs = {operacional:{label:'Colaboradores',icon:'👔',color:'var(--azul)'},despesa_op:{label:'Despesas Operacionais',icon:'🏢',color:'var(--roxo)'},administrativo:{label:'Administrativo',icon:'📋',color:'var(--texto-mid)'},marketing:{label:'Marketing',icon:'📣',color:'var(--vermelho)'},impostos:{label:'Impostos',icon:'🧾',color:'#b45309'}};
  const totais={}; let totDesp=0; Object.keys(catDefs).forEach(cat=>{totais[cat]=(cats[cat]||[]).reduce((a,d)=>a+Number(d.valor),0); totDesp+=totais[cat];});
  const totTaxa = totalTaxaCartaoMes(finMes, finAno), brutoCartao = totalBrutoCartaoMes(finMes, finAno), liquidoCartao = totalLiquidoCartaoMes(finMes, finAno);
  const resultado = receita - totDesp, resPos=resultado>=0;
  const contratosMes = contratos.filter(c=>contratoContaCompetenciaMes(c,finMes,finAno)).sort((a,b)=>mensalidadeContrato(b)-mensalidadeContrato(a));
  const pagamentosMes = pagamentos.filter(p=>p.status!=='excluido' && p.data && new Date(p.data)>=dataMesInicio(finMes,finAno) && new Date(p.data)<=dataMesFim(finMes,finAno)).sort((a,b)=>new Date(b.data)-new Date(a.data));
  const linhasReceita = financeiroModo==='caixa'
    ? pagamentosMes.map(p=>`<tr><td>${fmtData(p.data)}</td><td><strong>${esc(p.alunoNome||'—')}</strong><div style="font-size:11px;color:var(--texto-muted)">${esc(p.descricao||'Pagamento')} · ${p.forma||'—'}${detalheCartaoTexto(p)}</div></td><td style="font-weight:700;color:var(--verde)">${fmtValor(p.valor)}</td></tr>`).join('')
    : contratosMes.map(c=>`<tr><td><strong>${esc(c.alunoNome||'—')}</strong></td><td>${esc(nomeContrato(c))}<div style="font-size:11px;color:var(--texto-muted)">${fmtData(c.inicio)} → ${fmtData(c.venc)}${c.pgto==='Cartão'&&c.valorBruto?` · bruto cartão ${fmtValor(c.valorBruto)} · líquido ${fmtValor(valorContrato(c))}`:''}</div></td><td style="font-weight:700;color:var(--verde)">${fmtValor(mensalidadeContrato(c))}</td></tr>`).join('');
  const taxasRows = pagamentosCartaoMes(finMes,finAno).filter(p=>valorTaxaCartao(p)>0).map(p=>`<tr><td>${fmtData(p.data)}</td><td><strong>${esc(p.alunoNome||'—')}</strong><div style="font-size:11px;color:var(--texto-muted)">Bruto ${fmtValor(p.valorBruto||p.valor)} · líquido ${fmtValor(p.valor)}${p.parcelas?` · ${p.parcelas}x`:''}</div></td><td style="font-weight:700;color:#b45309">${fmtValor(valorTaxaCartao(p))}</td></tr>`).join('');
  const projecao = await Promise.all(Array.from({length:12},async(_,i)=>{const d=await loadDespesas(i,finAno); const r=financeiroModo==='caixa'?receitaCaixaMes(i,finAno):receitaMesEsp(i,finAno); const td=totalDesp(d); return {mes:i,receita:r,desp:td,resultado:r-td};}));
  const totAnoRec=projecao.reduce((a,p)=>a+p.receita,0), totAnoDesp=projecao.reduce((a,p)=>a+p.desp,0), totAnoRes=totAnoRec-totAnoDesp;
  document.getElementById('content').innerHTML=`<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:12px"><div class="mes-selector"><button class="mes-btn" onclick="navegarFin(-1)">◀</button><div class="mes-label">${MESES_NOMES[finMes]} ${finAno}</div><button class="mes-btn" onclick="navegarFin(1)">▶</button></div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn ${financeiroModo==='competencia'?'btn-primary':'btn-ghost'} btn-sm" onclick="setModoFinanceiro('competencia')">Competência</button><button class="btn ${financeiroModo==='caixa'?'btn-primary':'btn-ghost'} btn-sm" onclick="setModoFinanceiro('caixa')">Caixa</button><button class="btn btn-ghost btn-sm" onclick="setView('despesas')">✏️ Editar despesas</button><button class="btn btn-primary btn-sm" onclick="imprimirDRE()">🖨️ Imprimir</button></div></div>
  <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:12px 16px;font-size:13px;margin-bottom:20px"><strong>Visão atual: ${financeiroModo==='competencia'?'Competência':'Caixa'}.</strong> Competência reconhece contratos por ciclos mensais a partir da data de início; Caixa mostra pagamentos líquidos recebidos. Comp.: <strong>${fmtValor(receitaComp)}</strong> · Caixa: <strong>${fmtValor(receitaCx)}</strong>. Taxas de cartão aparecem como informativo e não alteram o resultado.</div>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px"><div class="card c-green" style="border-top:3px solid var(--verde)"><div class="card-label">Receita do Mês</div><div class="card-value" style="font-size:24px;padding-top:4px">${fmtValor(receita)}</div><div class="card-sub">${financeiroModo==='competencia'?'ciclos mensais do contrato':'pagamentos líquidos'}</div></div><div class="card" style="border-top:3px solid var(--vermelho)"><div class="card-label">Total Despesas</div><div class="card-value" style="font-size:24px;padding-top:4px;color:var(--vermelho)">${fmtValor(totDesp)}</div><div class="card-sub">impostos incluídos</div></div><div class="card" style="border-top:3px solid ${resPos?'var(--verde)':'var(--vermelho)'}"><div class="card-label">Resultado</div><div class="card-value" style="font-size:24px;padding-top:4px;color:${resPos?'var(--verde)':'var(--vermelho)'}">${resPos?'':'-'}${fmtValor(Math.abs(resultado))}</div><div class="card-sub">${resPos?'▲ superávit':'▼ déficit'}</div></div><div class="card" style="border-top:3px solid #b45309"><div class="card-label">Taxas cartão</div><div class="card-value" style="font-size:24px;padding-top:4px;color:#b45309">${fmtValor(totTaxa)}</div><div class="card-sub">informativo · fora do DRE</div></div></div>
  <div class="section-box" style="margin-bottom:24px"><div class="section-header"><div class="section-title">Receita — ${financeiroModo==='competencia'?'Competência':'Caixa'}</div></div><div class="table-wrap"><table><thead><tr>${financeiroModo==='caixa'?'<th>Data</th><th>Aluno / descrição</th><th>Valor líquido</th>':'<th>Aluno</th><th>Contrato</th><th>Receita mensal</th>'}</tr></thead><tbody>${linhasReceita||`<tr><td colspan="3"><div class="empty">Nenhuma receita nesta visão.</div></td></tr>`}</tbody></table></div></div>
  <div class="section-box" style="margin-bottom:24px"><div class="section-header"><div class="section-title">Resumo Financeiro</div></div><div style="padding:0"><div style="padding:14px 24px;border-bottom:1px solid var(--borda);background:#f9fafb;display:flex;justify-content:space-between;align-items:center"><span style="font-weight:700">💰 Receita líquida</span><span style="font-weight:700;color:var(--verde);font-size:15px">${fmtValor(receita)}</span></div>${Object.entries(catDefs).map(([cat,info])=>{const pct=receita>0?(totais[cat]/receita*100):0;return `<div style="padding:12px 24px;border-bottom:1px solid var(--borda);display:grid;grid-template-columns:1fr auto 120px;align-items:center;gap:12px"><span style="font-size:13px;color:var(--texto-mid)">${info.icon} ${info.label}</span><span style="font-weight:700;color:var(--vermelho);white-space:nowrap">${fmtValor(totais[cat])}</span><div><div style="height:5px;background:var(--borda);border-radius:2px;overflow:hidden"><div style="height:100%;width:${Math.min(100,pct)}%;background:${info.color};border-radius:2px"></div></div><div style="font-size:10px;color:var(--texto-muted);margin-top:2px">${pct.toFixed(0)}% da receita</div></div></div>`;}).join('')}<div style="padding:12px 24px;border-bottom:1px solid var(--borda);background:#fff7ed;display:flex;justify-content:space-between"><span style="color:#92400e">💳 Taxas de cartão <small>(informativo, fora do resultado)</small></span><span style="font-weight:700;color:#b45309">${fmtValor(totTaxa)}</span></div><div style="padding:14px 24px;border-bottom:1px solid var(--borda);display:flex;justify-content:space-between;font-weight:700"><span>Total despesas</span><span style="color:var(--vermelho)">${fmtValor(totDesp)}</span></div><div style="padding:14px 24px;background:${resPos?'rgba(46,125,50,0.05)':'rgba(211,47,47,0.05)'};display:flex;justify-content:space-between;font-weight:700;font-size:15px"><span>Resultado</span><span style="color:${resPos?'var(--verde)':'var(--vermelho)'}">${resPos?'':'-'}${fmtValor(Math.abs(resultado))}</span></div></div></div>
  <div class="section-box" style="margin-bottom:24px"><div class="section-header"><div><div class="section-title">Taxas de cartão — Detalhe</div><div style="font-size:12px;color:var(--texto-muted)">Bruto cartão: ${fmtValor(brutoCartao)} · líquido recebido: ${fmtValor(liquidoCartao)} · taxa: ${fmtValor(totTaxa)}</div></div></div><div class="table-wrap"><table><thead><tr><th>Data</th><th>Pagamento</th><th>Taxa</th></tr></thead><tbody>${taxasRows||`<tr><td colspan="3"><div class="empty">Nenhuma taxa registrada neste mês.</div></td></tr>`}</tbody></table></div></div>
  <div class="section-box"><div class="section-header"><div class="section-title">Projeção Anual — ${financeiroModo==='competencia'?'Competência':'Caixa'}</div><div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap"><div class="mes-selector" style="padding:4px 10px"><button class="mes-btn" onclick="navegarAnoPro(-1)">◀</button><div class="mes-label" style="min-width:50px">${finAno}</div><button class="mes-btn" onclick="navegarAnoPro(1)">▶</button></div><div style="font-size:12px;color:var(--texto-muted)">Rec: <strong style="color:var(--verde)">${fmtValor(totAnoRec)}</strong> &nbsp; Desp: <strong style="color:var(--vermelho)">${fmtValor(totAnoDesp)}</strong> &nbsp; Res: <strong style="color:${totAnoRes>=0?'var(--verde)':'var(--vermelho)'}">${totAnoRes>=0?'':'-'}${fmtValor(Math.abs(totAnoRes))}</strong></div></div></div><div style="overflow-x:auto"><table><thead><tr><th>Mês</th><th>Receita</th><th>Total Desp.</th><th>Resultado</th></tr></thead><tbody>${projecao.map(p=>`<tr style="${p.mes===finMes?'background:rgba(211,47,47,0.04);font-weight:600':''}"><td style="font-weight:600">${MESES_ABREV[p.mes]}</td><td style="color:var(--verde);font-weight:600">${fmtValor(p.receita)}</td><td style="color:var(--vermelho);font-weight:600">${fmtValor(p.desp)}</td><td style="font-weight:700;color:${p.resultado>=0?'var(--verde)':'var(--vermelho)'}">${p.resultado>=0?'':'-'}${fmtValor(Math.abs(p.resultado))}</td></tr>`).join('')}</tbody><tfoot><tr style="background:#f9fafb;font-weight:700;border-top:2px solid var(--borda)"><td>TOTAL</td><td style="color:var(--verde)">${fmtValor(totAnoRec)}</td><td style="color:var(--vermelho)">${fmtValor(totAnoDesp)}</td><td style="color:${totAnoRes>=0?'var(--verde)':'var(--vermelho)'}">${totAnoRes>=0?'':'-'}${fmtValor(Math.abs(totAnoRes))}</td></tr></tfoot></table></div></div>`;
};
window.renderFinanceiroView = renderFinanceiroView;

// Impressão usando a visão atual e mantendo taxas de cartão fora do resultado
imprimirDRE = async function(){
  const cats = await loadDespesas(finMes, finAno);
  const receita = receitaDoMesSelecionada(finMes, finAno), receitaComp = receitaMesEsp(finMes, finAno), receitaCx = receitaCaixaMes(finMes, finAno);
  const catDefs = {operacional:'Colaboradores',despesa_op:'Despesas Operacionais',administrativo:'Administrativo',marketing:'Marketing',impostos:'Impostos'};
  const totais={}; let totDesp=0; Object.keys(catDefs).forEach(cat=>{totais[cat]=(cats[cat]||[]).reduce((a,d)=>a+Number(d.valor),0); totDesp+=totais[cat];});
  const resultado=receita-totDesp, resPos=resultado>=0, totTaxa=totalTaxaCartaoMes(finMes,finAno);
  const contratosMes = contratos.filter(c=>contratoContaCompetenciaMes(c,finMes,finAno)).sort((a,b)=>(a.alunoNome||'').localeCompare(b.alunoNome||'','pt-BR'));
  const pagamentosMes = pagamentos.filter(p=>p.status!=='excluido' && p.data && new Date(p.data)>=dataMesInicio(finMes,finAno) && new Date(p.data)<=dataMesFim(finMes,finAno)).sort((a,b)=>(a.alunoNome||'').localeCompare(b.alunoNome||'','pt-BR'));
  const linhasReceita = financeiroModo==='caixa'
    ? pagamentosMes.map(p=>`<tr><td>${esc(p.alunoNome||'—')}<div style="font-size:11px;color:#777">${fmtData(p.data)} · ${p.forma||'—'}${detalheCartaoTexto(p)}</div></td><td style="text-align:right;font-weight:600">${fmtValor(p.valor)}</td></tr>`).join('')
    : contratosMes.map(c=>`<tr><td>${esc(c.alunoNome||'—')}<div style="font-size:11px;color:#777">${esc(nomeContrato(c))}</div></td><td style="text-align:right;font-weight:600">${fmtValor(mensalidadeContrato(c))}</td></tr>`).join('');
  const linhasDesp = Object.entries(catDefs).map(([cat,label])=>{const items=(cats[cat]||[]).filter(d=>Number(d.valor)>0); if(!items.length&&totais[cat]===0) return ''; const linhasItens=items.map(d=>`<tr><td style="padding-left:22px;color:#555">${esc(d.desc)}</td><td style="text-align:right">${fmtValor(d.valor)}</td></tr>`).join(''); return `<tr style="background:#f7f7f7"><td><strong>${label}</strong></td><td style="text-align:right"><strong>${fmtValor(totais[cat])}</strong></td></tr>${linhasItens}`;}).join('');
  const linhasTaxa = pagamentosCartaoMes(finMes,finAno).filter(p=>valorTaxaCartao(p)>0).map(p=>`<tr><td>${esc(p.alunoNome||'—')}<div style="font-size:11px;color:#777">${fmtData(p.data)} · bruto ${fmtValor(p.valorBruto||p.valor)} · líquido ${fmtValor(p.valor)}${p.parcelas?` · ${p.parcelas}x`:''}</div></td><td style="text-align:right">${fmtValor(valorTaxaCartao(p))}</td></tr>`).join('');
  const dataImpressao = new Date().toLocaleDateString('pt-BR');
  const htmlPrint = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Resumo Financeiro — ${MESES_NOMES[finMes]} ${finAno}</title><style>@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700&display=swap');*{box-sizing:border-box}body{font-family:Barlow,Arial,sans-serif;font-size:13px;color:#111;background:#fff;padding:32px;max-width:760px;margin:0 auto}table{width:100%;border-collapse:collapse;border:1px solid #eee}td,th{padding:7px 8px;border-bottom:1px solid #eee}th{text-align:left;color:#777;font-size:11px;text-transform:uppercase}.logo{font-family:'Bebas Neue';font-size:36px}.logo span{color:#D32F2F}.header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #111;padding-bottom:18px;margin-bottom:22px}.title{font-family:'Bebas Neue';font-size:24px;color:#D32F2F}.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:22px}.card{border:1px solid #eee;border-radius:8px;padding:12px}.label{font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#999}.value{font-family:'Bebas Neue';font-size:23px}.sec{margin-bottom:22px}.sec-title{background:#111;color:#fff;font-family:'Bebas Neue';font-size:16px;padding:8px 10px;border-radius:4px 4px 0 0}.result{border:2px solid ${resPos?'#2e7d32':'#D32F2F'};border-radius:8px;padding:16px 18px;display:flex;justify-content:space-between;align-items:center;background:${resPos?'rgba(46,125,50,.05)':'rgba(211,47,47,.05)'}}.btn{display:block;margin:0 auto 18px;padding:10px 24px;background:#D32F2F;color:#fff;border:0;border-radius:6px;font-weight:700}@media print{body{padding:14px}.no-print{display:none}}</style></head><body><button class="btn no-print" onclick="window.print()">🖨️ Imprimir / Salvar PDF</button><div class="header"><div><div class="logo">studio <span>FB</span></div><div style="font-size:10px;color:#999;letter-spacing:3px;text-transform:uppercase">Saúde &amp; Movimento</div></div><div style="text-align:right"><div class="title">Resumo Financeiro</div><div>${MESES_NOMES[finMes]} de ${finAno}</div><div style="font-size:11px;color:#999">Emitido em ${dataImpressao} · Visão: ${financeiroModo==='competencia'?'Competência':'Caixa'}</div></div></div><div class="cards"><div class="card"><div class="label">Receita</div><div class="value" style="color:#2e7d32">${fmtValor(receita)}</div><div style="font-size:11px;color:#777">Comp. ${fmtValor(receitaComp)} · Caixa ${fmtValor(receitaCx)}</div></div><div class="card"><div class="label">Despesas</div><div class="value" style="color:#D32F2F">${fmtValor(totDesp)}</div><div style="font-size:11px;color:#777">Impostos incluídos</div></div><div class="card"><div class="label">Resultado</div><div class="value" style="color:${resPos?'#2e7d32':'#D32F2F'}">${resPos?'':'-'}${fmtValor(Math.abs(resultado))}</div></div></div><div class="sec"><div class="sec-title">Receita — ${financeiroModo==='competencia'?'Competência':'Caixa'}</div><table><thead><tr><th>Descrição</th><th style="text-align:right">Valor</th></tr></thead><tbody>${linhasReceita||'<tr><td colspan="2">Nenhuma receita.</td></tr>'}</tbody><tfoot><tr><td><strong>Total receita</strong></td><td style="text-align:right;color:#2e7d32"><strong>${fmtValor(receita)}</strong></td></tr></tfoot></table></div><div class="sec"><div class="sec-title">Despesas Discriminadas</div><table><tbody>${linhasDesp}</tbody><tfoot><tr><td><strong>Total despesas</strong></td><td style="text-align:right;color:#D32F2F"><strong>${fmtValor(totDesp)}</strong></td></tr></tfoot></table></div><div class="sec"><div class="sec-title">Taxas de cartão — informativo</div><table><tbody>${linhasTaxa||'<tr><td>Nenhuma taxa de cartão registrada no mês.</td><td style="text-align:right">R$ 0,00</td></tr>'}</tbody><tfoot><tr><td><strong>Total informativo</strong></td><td style="text-align:right;color:#b45309"><strong>${fmtValor(totTaxa)}</strong></td></tr></tfoot></table><div style="font-size:11px;color:#777;margin-top:6px">Essas taxas não entram no total de despesas nem no resultado.</div></div><div class="result"><div><div style="font-family:'Bebas Neue';font-size:18px;color:${resPos?'#2e7d32':'#D32F2F'}">${resPos?'Resultado positivo':'Resultado negativo'}</div><div style="font-size:12px;color:#777">Receita ${fmtValor(receita)} − Despesas ${fmtValor(totDesp)}</div></div><div style="font-family:'Bebas Neue';font-size:28px;color:${resPos?'#2e7d32':'#D32F2F'}">${resPos?'':'-'}${fmtValor(Math.abs(resultado))}</div></div></body></html>`;
  const janela = window.open('', '_blank'); janela.document.write(htmlPrint); janela.document.close();
};
window.imprimirDRE = imprimirDRE;

exportarCSV = function(){
  const header='Nome,WhatsApp,DataEntrada,ContratoAtual,Plano,ValorTotal,InicioContrato,Vencimento,Saldo\n';
  const rows=alunos.map(a=>{const c=a.contratoAtual; return `"${a.nome}","${a.whats||''}","${a.dataEntrada||''}","${c?nomeContrato(c):''}","${c?.plano||''}","${c?valorContrato(c):''}","${c?.inicio||''}","${c?.venc||''}","${c?saldoContrato(c):''}"`;}).join('\n');
  const blob=new Blob([header+rows],{type:'text/csv;charset=utf-8;'}); const url=URL.createObjectURL(blob); const link=document.createElement('a'); link.href=url; link.download='alunos_contratos_studiofb.csv'; link.click(); URL.revokeObjectURL(url); toast('CSV exportado ✓');
};
window.exportarCSV = exportarCSV;

// ═══════════════════════════════════════════════════
// AJUSTES LGV V4 — CARTÃO POR BRUTO/LÍQUIDO E RECORRÊNCIAS EDITÁVEIS
// ═══════════════════════════════════════════════════
function diferencaTaxaCartao(bruto, liquido){ return Math.max(0, num(bruto) - num(liquido)); }
valorTaxaCartao = function(p){
  if(!p || p.forma !== 'Cartão') return 0;
  if(num(p.valorBruto)>0 && num(p.valor)>0) return diferencaTaxaCartao(p.valorBruto, p.valor);
  if(p.taxaCartaoValor !== undefined && p.taxaCartaoValor !== null) return Math.max(0, num(p.taxaCartaoValor));
  return 0;
};
window.valorTaxaCartao = valorTaxaCartao;
detalheCartaoTexto = function(p){
  if(!p || p.forma!=='Cartão') return '';
  const taxa = valorTaxaCartao(p);
  const bruto = num(p.valorBruto||p.valor);
  return ` · ${p.parcelas?`${p.parcelas}x · `:''}bruto ${fmtValor(bruto)}${taxa>0?` · líquido ${fmtValor(p.valor)} · taxa ${fmtValor(taxa)}`:''}`;
};
window.detalheCartaoTexto = detalheCartaoTexto;

// Contrato: cartão usa apenas bruto e líquido. A taxa é bruto - líquido.
function abrirModalContratoLGV4(alunoId, contratoId=null){
  const a = alunos.find(x=>String(x.id)===String(alunoId)); if(!a) return;
  const atual = contratoId ? contratos.find(c=>String(c.id)===String(contratoId)) : contratoVigenteAluno(alunoId);
  const baseInicio = atual?.venc ? (()=>{const d=new Date(atual.venc); d.setDate(d.getDate()+1); return d.toISOString().split('T')[0];})() : (a.dataEntrada||HOJE.toISOString().split('T')[0]);
  const c = contratoId ? atual : {plano:atual?.plano||'mensal', valorTotal:atual?valorContrato(atual):400, valorBruto:atual?.valorBruto||null, inicio:baseInicio, venc:addMeses(baseInicio, PLANO_MESES[atual?.plano||'mensal']||1), pgto:atual?.pgto||'PIX', recebimento:atual?.recebimento||'mensal', parcelas:atual?.parcelas||null, obs:''};
  const titulo = contratoId ? 'Editar Contrato' : 'Novo Contrato / Renovação';
  const brutoInicial = c.valorBruto || valorContrato(c);
  const html = `<div style="position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:400;display:flex;align-items:center;justify-content:center;padding:16px" id="modal-contrato-overlay">
    <div style="background:#fff;border-radius:12px;padding:0;width:100%;max-width:560px;box-shadow:var(--shadow-lg);max-height:90vh;overflow-y:auto">
      <div style="padding:20px 24px 0;display:flex;align-items:center;justify-content:space-between"><div style="font-family:'Bebas Neue',sans-serif;font-size:22px">${titulo}</div><button onclick="document.getElementById('modal-contrato-overlay').remove()" style="background:none;border:none;font-size:20px;cursor:pointer;color:#999">✕</button></div>
      <div style="padding:8px 24px;font-size:13px;color:var(--texto-muted);border-bottom:1px solid var(--borda)"><strong>${esc(a.nome)}</strong></div>
      <div style="padding:20px 24px" class="form-grid">
        <div class="form-group"><label class="form-label">Nome do contrato</label><input class="form-input" id="ct-nome" value="${esc(c?.nome && c.nome!=='Contrato inicial'?c.nome:'') }" placeholder="Ex: Maio/2026 — Anual"></div>
        <div class="form-group"><label class="form-label">Plano</label><select class="form-select" id="ct-plano" onchange="calcContratoVenc()">${Object.entries(PLANO_LABEL).map(([v,l])=>`<option value="${v}" ${c.plano===v?'selected':''}>${l}</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label">Valor líquido / competência (R$)</label><input class="form-input" type="number" id="ct-valor" value="${valorContrato(c)}" step="0.01" oninput="calcContratoMensalidade(); calcCtCartao();"><div class="form-hint" id="ct-mens-hint"></div></div>
        <div class="form-group"><label class="form-label">Forma prevista</label><select class="form-select" id="ct-pgto" onchange="toggleCtCartao()"><option value="PIX" ${c.pgto==='PIX'?'selected':''}>PIX</option><option value="Cartão" ${c.pgto==='Cartão'?'selected':''}>Cartão</option><option value="Dinheiro" ${c.pgto==='Dinheiro'?'selected':''}>Dinheiro</option></select></div>
        <div class="form-group" id="ct-bruto-group" style="display:none"><label class="form-label">Valor cobrado no cartão (bruto)</label><input class="form-input" type="number" id="ct-valor-bruto" value="${brutoInicial||''}" step="0.01" oninput="calcCtCartao()"><div class="form-hint">Só para registro. A taxa é calculada automaticamente: bruto − líquido.</div></div>
        <div class="form-group" id="ct-cartao-resumo-group" style="display:none"><label class="form-label">Resumo do cartão</label><div class="form-input" id="ct-cartao-hint" style="background:#fff7ed;color:#92400e;min-height:40px;display:flex;align-items:center">Informe bruto e líquido para calcular a taxa.</div></div>
        <div class="form-group" id="ct-parcelas-group" style="display:none"><label class="form-label">Parcelamento no cartão</label><select class="form-select" id="ct-parcelas"><option value="">Não informado</option>${Array.from({length:12},(_,i)=>i+1).map(n=>`<option value="${n}" ${Number(c.parcelas)===n?'selected':''}>${n}x</option>`).join('')}</select><div class="form-hint">Só para registro.</div></div>
        <div class="form-group"><label class="form-label">Início</label><input class="form-input" type="date" id="ct-inicio" value="${c.inicio||''}" onchange="calcContratoVenc()"></div>
        <div class="form-group"><label class="form-label">Vencimento</label><input class="form-input" type="date" id="ct-venc" value="${c.venc||''}"><div class="form-hint">Editável manualmente</div></div>
        <div class="form-group"><label class="form-label">Recebimento</label><select class="form-select" id="ct-receb"><option value="mensal" ${c.recebimento==='mensal'?'selected':''}>Mensal/recorrente</option><option value="avista" ${c.recebimento==='avista'?'selected':''}>À vista ou negociado</option></select></div>
        <div class="form-group full"><label class="form-label">Observações</label><input class="form-input" id="ct-obs" value="${esc(c.obs||'')}"></div>
      </div>
      <div style="padding:16px 24px 20px;border-top:1px solid var(--borda);display:flex;justify-content:flex-end;gap:8px"><button class="btn btn-ghost" onclick="document.getElementById('modal-contrato-overlay').remove()">Cancelar</button><button class="btn btn-primary" onclick="confirmarSalvarContrato('${alunoId}','${contratoId||''}')">Salvar contrato</button></div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', html); calcContratoMensalidade(); toggleCtCartao();
}
abrirModalContrato = abrirModalContratoLGV4;
window.abrirModalContrato = abrirModalContrato;
renovar = function(id){ abrirModalContrato(id); };
window.renovar = renovar;
window.toggleCtCartao = function(){
  const forma = document.getElementById('ct-pgto')?.value;
  ['ct-bruto-group','ct-cartao-resumo-group','ct-parcelas-group'].forEach(id=>{ const el=document.getElementById(id); if(el) el.style.display = forma==='Cartão' ? '' : 'none'; });
  if(forma==='Cartão') calcCtCartao();
};
window.calcCtCartao = function(){
  const bruto = parseFloat(document.getElementById('ct-valor-bruto')?.value)||0;
  const liquido = parseFloat(document.getElementById('ct-valor')?.value)||0;
  const taxa = diferencaTaxaCartao(bruto, liquido);
  const hint = document.getElementById('ct-cartao-hint');
  if(hint) {
    hint.textContent = bruto>0 && liquido>0
      ? `Bruto ${fmtValor(bruto)} − líquido ${fmtValor(liquido)} = taxa ${fmtValor(taxa)}`
      : 'Informe bruto e líquido para calcular a taxa.';
  }
};
window.confirmarSalvarContrato = async function(alunoId, contratoId){
  const a = alunos.find(x=>String(x.id)===String(alunoId)); if(!a) return;
  const existente = contratoId ? contratos.find(c=>String(c.id)===String(contratoId)) : null;
  const plano=document.getElementById('ct-plano').value, valor=parseFloat(document.getElementById('ct-valor').value)||0, inicio=document.getElementById('ct-inicio').value, venc=document.getElementById('ct-venc').value;
  if(!inicio || !venc || valor<=0){ alert('Preencha início, vencimento e valor.'); return; }
  const id = contratoId || `ct_${alunoId}_${Date.now()}`;
  const forma = document.getElementById('ct-pgto').value;
  const bruto = forma==='Cartão' ? (parseFloat(document.getElementById('ct-valor-bruto')?.value)||null) : null;
  if(forma==='Cartão' && bruto && bruto < valor){ alert('No cartão, o valor bruto não pode ser menor que o valor líquido.'); return; }
  const taxaValor = forma==='Cartão' && bruto ? Math.max(0, bruto-valor) : null;
  const parcelas = forma==='Cartão' ? (parseInt(document.getElementById('ct-parcelas')?.value)||null) : null;
  const c = {id, alunoId:String(alunoId), alunoNome:a.nome, nome:document.getElementById('ct-nome').value.trim()||'', plano, valorTotal:valor, valorBruto:bruto, taxaCartaoValor:taxaValor, inicio, venc, pgto:forma, recebimento:document.getElementById('ct-receb').value, parcelas, status:'ativo', obs:document.getElementById('ct-obs').value.trim(), criadoEm:existente?.criadoEm||new Date().toISOString(), ts:existente?.ts||Date.now(), atualizadoEm:new Date().toISOString()};
  await salvarContratoDb(c);
  await registrarAuditoria(contratoId?'edicao_contrato':'renovacao_contrato', alunoId, a.nome, existente||{}, c);
  document.getElementById('modal-contrato-overlay').remove();
  toast(contratoId?'Contrato atualizado ✓':'Novo contrato cadastrado ✓');
  abrirPerfilAluno(alunoId);
};

// Pagamento: cartão usa apenas bruto e líquido. A taxa é bruto - líquido.
function abrirModalPagamentoContratoLGV4(alunoId, contratoId=null, pagamentoId=null){
  const a = alunos.find(x=>String(x.id)===String(alunoId)); if(!a) return;
  const c = contratoId ? contratos.find(x=>String(x.id)===String(contratoId)) : contratoVigenteAluno(alunoId);
  if(!c){ alert('Cadastre um contrato antes de lançar pagamento.'); return; }
  const p = pagamentoId ? pagamentos.find(x=>String(x.id)===String(pagamentoId)) : null;
  const sugestao = Math.max(0, saldoContrato(c));
  const brutoPago = totalBrutoPagoContrato(c.id);
  const brutoContrato = num(c.valorBruto||0);
  const sugestaoBruto = p?.valorBruto ?? (brutoContrato>0 ? Math.max(0, brutoContrato-brutoPago) : sugestao);
  const formaInicial = p?.forma || c.pgto || 'PIX';
  const valorLiquidoInicial = p?.valor ?? sugestao;
  const html = `<div style="position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:420;display:flex;align-items:center;justify-content:center;padding:16px" id="modal-pagamento-overlay">
    <div style="background:#fff;border-radius:12px;padding:24px;width:100%;max-width:480px;box-shadow:var(--shadow-lg);max-height:90vh;overflow-y:auto">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:22px;margin-bottom:4px">${p?'Editar Pagamento':'Registrar Pagamento'}</div>
      <div style="font-size:12px;color:var(--texto-muted);margin-bottom:16px"><strong>${esc(a.nome)}</strong> · ${esc(nomeContrato(c))}<br>Saldo líquido atual: ${fmtValor(sugestao)}</div>
      <div class="form-grid" style="grid-template-columns:1fr">
        <div class="form-group"><label class="form-label">Data do pagamento</label><input class="form-input" type="date" id="pg-data" value="${p?.data||HOJE.toISOString().split('T')[0]}"></div>
        <div class="form-group"><label class="form-label">Forma</label><select class="form-select" id="pg-forma" onchange="togglePgCartao()"><option value="PIX" ${formaInicial==='PIX'?'selected':''}>PIX</option><option value="Cartão" ${formaInicial==='Cartão'?'selected':''}>Cartão</option><option value="Dinheiro" ${formaInicial==='Dinheiro'?'selected':''}>Dinheiro</option></select></div>
        <div class="form-group" id="pg-bruto-group" style="display:none"><label class="form-label">Valor cobrado no cartão (bruto)</label><input class="form-input" type="number" id="pg-valor-bruto" step="0.01" value="${sugestaoBruto||''}" oninput="calcPgCartao()"><div class="form-hint">Só registro. Não entra no caixa nem na competência.</div></div>
        <div class="form-group"><label class="form-label" id="pg-valor-label">Valor recebido / líquido (R$)</label><input class="form-input" type="number" id="pg-valor" step="0.01" value="${valorLiquidoInicial}" oninput="calcPgCartao()"><div class="form-hint">Este é o valor usado na visão de caixa e para quitar o contrato.</div></div>
        <div class="form-group" id="pg-cartao-resumo-group" style="display:none"><label class="form-label">Resumo do cartão</label><div class="form-input" id="pg-cartao-hint" style="background:#fff7ed;color:#92400e;min-height:40px;display:flex;align-items:center">Informe bruto e líquido para calcular a taxa.</div></div>
        <div class="form-group" id="pg-parcelas-group" style="display:none"><label class="form-label">Parcelamento no cartão</label><select class="form-select" id="pg-parcelas"><option value="">Não informado</option>${Array.from({length:12},(_,i)=>i+1).map(n=>`<option value="${n}" ${Number(p?.parcelas||c.parcelas)===n?'selected':''}>${n}x</option>`).join('')}</select><div class="form-hint">Só para registro. No caixa entra o valor líquido recebido.</div></div>
        <div class="form-group"><label class="form-label">Descrição</label><input class="form-input" id="pg-desc" value="${esc(p?.descricao||'Pagamento do contrato')}"></div>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px"><button class="btn btn-ghost" onclick="document.getElementById('modal-pagamento-overlay').remove()">Cancelar</button><button class="btn btn-primary" onclick="confirmarPagamentoContrato('${alunoId}','${c.id}','${pagamentoId||''}')">Salvar</button></div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
  togglePgCartao();
}
abrirModalPagamentoContrato = abrirModalPagamentoContratoLGV4;
window.abrirModalPagamentoContrato = abrirModalPagamentoContrato;
registrarPagamento = async function(id){ abrirModalPagamentoContrato(id); };
window.registrarPagamento = registrarPagamento;
window.togglePgCartao = function(){
  const forma = document.getElementById('pg-forma')?.value;
  ['pg-bruto-group','pg-cartao-resumo-group','pg-parcelas-group'].forEach(id=>{ const el=document.getElementById(id); if(el) el.style.display = forma==='Cartão' ? '' : 'none'; });
  const lbl = document.getElementById('pg-valor-label'); if(lbl) lbl.textContent = forma==='Cartão' ? 'Valor líquido recebido (R$)' : 'Valor recebido (R$)';
  if(forma==='Cartão') calcPgCartao();
};
window.calcPgCartao = function(){
  const bruto = parseFloat(document.getElementById('pg-valor-bruto')?.value)||0;
  const liquido = parseFloat(document.getElementById('pg-valor')?.value)||0;
  const taxa = diferencaTaxaCartao(bruto, liquido);
  const hint = document.getElementById('pg-cartao-hint');
  if(hint) {
    hint.textContent = bruto>0 && liquido>0
      ? `Bruto ${fmtValor(bruto)} − líquido ${fmtValor(liquido)} = taxa ${fmtValor(taxa)}`
      : 'Informe bruto e líquido para calcular a taxa.';
  }
};
window.confirmarPagamentoContrato = async function(alunoId, contratoId, pagamentoId){
  const c = contratos.find(x=>String(x.id)===String(contratoId)); const a = alunos.find(x=>String(x.id)===String(alunoId)); if(!c||!a) return;
  const valor=parseFloat(document.getElementById('pg-valor').value)||0, data=document.getElementById('pg-data').value;
  if(!data || valor<=0){ alert('Preencha data e valor.'); return; }
  const existente = pagamentoId ? pagamentos.find(p=>String(p.id)===String(pagamentoId)) : null;
  const id = pagamentoId || `pg_${contratoId}_${Date.now()}`;
  const forma = document.getElementById('pg-forma').value;
  const parcelas = forma === 'Cartão' ? (parseInt(document.getElementById('pg-parcelas')?.value)||null) : null;
  const valorBruto = forma === 'Cartão' ? (parseFloat(document.getElementById('pg-valor-bruto')?.value)||null) : null;
  if(forma==='Cartão' && valorBruto && valorBruto < valor){ alert('No cartão, o valor bruto não pode ser menor que o valor líquido.'); return; }
  const taxaValor = forma === 'Cartão' ? Math.max(0, num(valorBruto)-valor) : null;
  const pg = {id, contratoId:String(contratoId), alunoId:String(alunoId), alunoNome:a.nome, valor, valorLiquido:valor, valorBruto, taxaCartaoValor:taxaValor, data, forma, parcelas, descricao:document.getElementById('pg-desc').value.trim()||'Pagamento', status:'ativo', ts:existente?.ts||Date.now(), atualizadoEm:new Date().toISOString()};
  await salvarPagamentoDb(pg); await registrarAuditoria(pagamentoId?'edicao_pagamento':'pagamento_contrato', alunoId, a.nome, existente||{}, pg);
  document.getElementById('modal-pagamento-overlay').remove(); toast('Pagamento salvo ✓'); abrirPerfilAluno(alunoId);
};

// Programadas: permite editar ou encerrar recorrência/parcelamento a partir do mês em tela.
function mesAnteriorObj(mes, ano){ mes -= 1; if(mes<0){mes=11; ano--;} return {mes, ano}; }
function mesesEntreIncl(iniMes, iniAno, fimMes, fimAno){ return Math.max(1, (fimAno*12+fimMes) - (iniAno*12+iniMes) + 1); }
window.editarProg = async function(progId){
  const prog=(await carregarProgramadas()).find(p=>p.id===progId);
  if(!prog){ toast('Despesa programada não encontrada.'); return; }
  garantirOpcaoImpostos();
  const html = `<div style="position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:430;display:flex;align-items:center;justify-content:center;padding:16px" id="modal-prog-overlay">
    <div style="background:#fff;border-radius:12px;padding:24px;width:100%;max-width:460px;box-shadow:var(--shadow-lg)">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:22px;margin-bottom:4px">Editar despesa daqui para frente</div>
      <div style="font-size:12px;color:var(--texto-muted);margin-bottom:16px">A alteração vale a partir de ${MESES_NOMES[despMes]} ${despAno}. Meses anteriores ficam preservados.</div>
      <div class="form-grid" style="grid-template-columns:1fr">
        <div class="form-group"><label class="form-label">Categoria</label><select class="form-select" id="prog-cat"><option value="operacional" ${prog.cat==='operacional'?'selected':''}>Colaboradores</option><option value="despesa_op" ${prog.cat==='despesa_op'?'selected':''}>Despesas Operacionais</option><option value="administrativo" ${prog.cat==='administrativo'?'selected':''}>Administrativo</option><option value="marketing" ${prog.cat==='marketing'?'selected':''}>Marketing</option><option value="impostos" ${prog.cat==='impostos'?'selected':''}>Impostos</option></select></div>
        <div class="form-group"><label class="form-label">Descrição</label><input class="form-input" id="prog-desc" value="${esc(prog.desc||'')}"></div>
        <div class="form-group"><label class="form-label">Novo valor (R$)</label><input class="form-input" type="number" step="0.01" id="prog-valor" value="${prog.valor||0}"></div>
        <div style="background:#fffbeb;border:1px solid #fde68a;color:#92400e;border-radius:8px;padding:10px 12px;font-size:12px">Tipo: <strong>${prog.tipo==='parcelada'?'parcelada':'recorrente'}</strong>. Para remover daqui em diante, use o botão de bloquear/encerrar.</div>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px"><button class="btn btn-ghost" onclick="document.getElementById('modal-prog-overlay').remove()">Cancelar</button><button class="btn btn-primary" onclick="confirmarEditarProg('${progId}')">Salvar daqui para frente</button></div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
};
window.confirmarEditarProg = async function(progId){
  const prog=(await carregarProgramadas()).find(p=>p.id===progId);
  if(!prog){ toast('Despesa programada não encontrada.'); return; }
  const novoDesc=document.getElementById('prog-desc').value.trim();
  const novoValor=parseFloat(document.getElementById('prog-valor').value)||0;
  const novaCat=document.getElementById('prog-cat').value;
  if(!novoDesc || novoValor<=0){ alert('Informe descrição e valor.'); return; }
  const inicioAtual = despAno*12 + despMes;
  const inicioProg = Number(prog.iniAno)*12 + Number(prog.iniMes);
  const fimProg = Number(prog.fimAno)*12 + Number(prog.fimMes);
  if(inicioAtual <= inicioProg){
    await salvarProgramada({...prog, desc:novoDesc, valor:novoValor, cat:novaCat});
  } else if(inicioAtual > fimProg){
    alert('Este item programado não está ativo neste mês.'); return;
  } else {
    const ant = mesAnteriorObj(despMes, despAno);
    await salvarProgramada({...prog, fimMes:ant.mes, fimAno:ant.ano});
    const novo = {...prog, id:gerarId(), desc:novoDesc, valor:novoValor, cat:novaCat, iniMes:despMes, iniAno:despAno, criadoEm:new Date().toISOString()};
    if(novo.tipo==='parcelada') novo.totalParcelas = mesesEntreIncl(despMes, despAno, Number(prog.fimMes), Number(prog.fimAno));
    await salvarProgramada(novo);
  }
  despCache={};
  document.getElementById('modal-prog-overlay').remove();
  toast('Despesa atualizada daqui para frente ✓');
  await renderDespesasView();
};

const cancelarProgAnterior = cancelarProg;
cancelarProg = async function(progId){
  if(!confirm('Encerrar/remover esta despesa a partir deste mês? Os meses anteriores ficam preservados.')) return;
  const prog=(await carregarProgramadas()).find(p=>p.id===progId);
  if(!prog) return;
  let novoFimMes=despMes-1, novoFimAno=despAno;
  if(novoFimMes<0){novoFimMes=11;novoFimAno--;}
  if(novoFimAno<prog.iniAno||(novoFimAno===prog.iniAno&&novoFimMes<prog.iniMes)){
    await excluirProgramada(progId);
    toast('Despesa programada removida.');
  } else {
    await salvarProgramada({...prog,fimMes:novoFimMes,fimAno:novoFimAno});
    toast('Despesa encerrada a partir deste mês ✓');
  }
  despCache={};
  await renderDespesasView();
};
window.cancelarProg = cancelarProg;

renderDespesasView = async function(){
  loading(true); garantirOpcaoImpostos();
  const cats = await loadDespesas(despMes, despAno);
  const catDefs = {operacional:{label:'Colaboradores',icon:'👔',color:'var(--azul)'},despesa_op:{label:'Despesas Operacionais',icon:'🏢',color:'var(--roxo)'},administrativo:{label:'Administrativo',icon:'📋',color:'var(--texto-mid)'},marketing:{label:'Marketing',icon:'📣',color:'var(--vermelho)'},impostos:{label:'Impostos',icon:'🧾',color:'#b45309'}};
  const tot = totalDesp(cats), taxas = pagamentosCartaoMes(despMes,despAno), totTaxa = totalTaxaCartaoMes(despMes,despAno);
  const taxasHtml = taxas.filter(p=>valorTaxaCartao(p)>0).map(p=>`<div class="desp-item"><span class="desp-nome">${esc(p.alunoNome||'—')} <span style="color:var(--texto-muted);font-size:11px">· ${fmtData(p.data)}${p.parcelas?` · ${p.parcelas}x`:''}</span></span><span class="desp-tipo-badge desp-tipo-pontual">Informativo</span><span class="desp-valor">${fmtValor(valorTaxaCartao(p))}</span></div>`).join('') || `<div style="color:var(--texto-muted);font-size:13px;padding:8px 0">Nenhuma taxa de cartão registrada neste mês.</div>`;
  document.getElementById('content').innerHTML=`
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:12px"><div><div style="font-size:12px;color:var(--texto-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Total lançado no DRE</div><div style="font-family:'Bebas Neue',sans-serif;font-size:32px;color:var(--vermelho)">${fmtValor(tot)}</div><div style="font-size:11px;color:var(--texto-muted)">Taxas de cartão são exibidas à parte e não entram no resultado.</div></div><div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap"><div class="mes-selector"><button class="mes-btn" onclick="navegarDesp(-1)">◀</button><div class="mes-label">${MESES_NOMES[despMes]} ${despAno}</div><button class="mes-btn" onclick="navegarDesp(1)">▶</button></div><button class="btn btn-ghost btn-sm" onclick="copiarMes()">📋 Copiar mês</button></div></div>
    <div class="desp-grid">${Object.entries(catDefs).map(([cat,info])=>{const items=cats[cat]||[]; const total=items.reduce((a,d)=>a+Number(d.valor),0); return `<div class="desp-card"><div class="desp-card-title" style="color:${info.color}">${info.icon} ${info.label}</div>${items.map((d,i)=>{const tipoBadge=d.tipo&&d.tipo!=='pontual'?`<span class="desp-tipo-badge desp-tipo-${d.tipo}">${d.tipo==='recorrente'?'Recorrente':'Parcelada'}</span>`:''; const actions=d.fixo?`<button class="desp-btn" onclick="editarProg('${d.progId}')" title="Editar daqui para frente">✏️</button><button class="desp-btn" onclick="cancelarProg('${d.progId}')" title="Encerrar daqui para frente">🚫</button>`:`<button class="desp-btn" onclick="editarDesp('${cat}',${i})" title="Editar">✏️</button><button class="desp-btn" onclick="excluirDesp('${cat}',${i})" title="Excluir">🗑</button>`; return `<div class="desp-item"><span class="desp-nome">${esc(d.desc)}</span>${tipoBadge}<span class="desp-valor">${fmtValor(d.valor)}</span><div class="desp-actions">${actions}</div></div>`;}).join('')}<button class="desp-add" onclick="openModalDespNovo('${cat}')">＋ Adicionar item</button><div class="desp-total"><span>Total</span><span>${fmtValor(total)}</span></div></div>`;}).join('')}
      <div class="desp-card" style="border-color:#fed7aa;background:#fff7ed"><div class="desp-card-title" style="color:#b45309">💳 Taxas de cartão</div><div style="font-size:12px;color:#92400e;margin-bottom:8px">Informativo. Não entra no total de despesas, caixa, competência ou resultado.</div>${taxasHtml}<div class="desp-total"><span>Total informativo</span><span>${fmtValor(totTaxa)}</span></div></div>
    </div>`;
};
window.renderDespesasView = renderDespesasView;


// ═══════════════════════════════════════════════════
// AJUSTES LGV V6 — PROGRESSO EM FRAÇÃO, FÉRIAS, PENDENTES E AULA EXTRA
// ═══════════════════════════════════════════════════
function diasEntreIncl(inicio, fim){
  const ini = dataLocal(inicio), f = dataLocal(fim);
  if(!ini || !f || f < ini) return 0;
  return Math.max(0, Math.round((f - ini) / 86400000) + 1);
}
function diasFeriasAluno(alunoId){
  const a = alunos.find(x=>String(x.id)===String(alunoId));
  const c = contratosDoAluno(alunoId).slice(-1)[0] || a?.contratoAtual;
  const plano = c?.plano || a?.plano || 'mensal';
  const limite = {mensal:0,trimestral:7,semestral:15,anual:30}[plano] || 0;
  const dias = (a?.ferias || []).reduce((acc,f)=>acc + diasEntreIncl(f.inicio, f.fim), 0);
  return Math.max(0, Math.min(dias, limite));
}
function vencAjustadoContrato(c){
  if(!c?.venc) return c?.venc || '';
  const extras = diasFeriasAluno(c.alunoId);
  if(!extras) return c.venc;
  const d = dataLocal(c.venc);
  if(!d) return c.venc;
  d.setDate(d.getDate() + extras);
  return d.toISOString().split('T')[0];
}
function diasAteContrato(c){
  if(!c) return 9999;
  return Math.round((dataLocal(vencAjustadoContrato(c)) - HOJE) / 86400000);
}
contratoVigenteAluno = function(alunoId){
  const lista = contratosDoAluno(alunoId);
  const hoje = new Date();
  const vigente = lista.find(c=>dataLocal(c.inicio)<=hoje && dataLocal(vencAjustadoContrato(c))>=hoje);
  if (vigente) return vigente;
  const futuro = lista.find(c=>dataLocal(c.inicio)>hoje);
  if (futuro) return futuro;
  return lista[lista.length-1] || null;
};
statusContratoObj = function(c){
  if(!c) return {contrato:'nao_renovou', label:'Sem contrato', cor:'#6b7280', icon:'📋'};
  const hoje = new Date();
  const ini = dataLocal(c.inicio), venc = dataLocal(vencAjustadoContrato(c));
  const pago = totalPagoContrato(c.id);
  const total = valorContrato(c);
  const saldo = Math.max(0,total-pago);
  if (ini > hoje) return {contrato:'futuro', label:'Contrato futuro', cor:'var(--azul)', icon:'⏳'};
  if (venc < hoje) return saldo>0
    ? {contrato:'inadimplente', label:'Vencido em aberto', cor:'var(--vermelho)', icon:'🔴'}
    : {contrato:'a_renovar', label:'A renovar', cor:'#b45309', icon:'📋'};
  if (pago >= total && total > 0) return {contrato:'ativo', label:'Vigente e quitado', cor:'var(--verde)', icon:'✅'};
  if (pago > 0) return {contrato:'aguardando', label:'Vigente — parcial', cor:'var(--amarelo)', icon:'◐'};
  return {contrato:'aguardando', label:'Vigente — pendente', cor:'var(--azul)', icon:'⏳'};
};
statusContrato = function(a){ return statusContratoObj(a?.contratoAtual); };
hidratarAlunosComContratos = function(){
  alunos = alunos.filter(a=>a.status!=='arquivado').map(a=>{
    const c = contratoVigenteAluno(a.id);
    const dataEntrada = a.dataEntrada || a.entrada || a.inicio || '';
    const vencAjust = c ? vencAjustadoContrato(c) : (a.venc || dataEntrada);
    const st = c ? statusContratoObj(c) : null;
    return {
      ...a,
      dataEntrada,
      contratoAtual: c,
      contratosAluno: contratosDoAluno(a.id),
      pagamentosAluno: pagamentosDoAluno(a.id),
      plano: c?.plano || a.plano || 'mensal',
      valor: c ? valorContrato(c) : Number(a.valor||0),
      inicio: c?.inicio || a.inicio || dataEntrada,
      venc: vencAjust,
      vencOriginal: c?.venc || a.venc || dataEntrada,
      pgto: c?.pgto || a.pgto || 'PIX',
      recebimento: c?.recebimento || a.recebimento || 'avista',
      parcelas: c?.parcelas ?? a.parcelas ?? null,
      status: c ? (st.contrato==='ativo' ? 'pago' : st.contrato==='inadimplente' ? 'inadimplente' : 'pendente') : (a.status||'nao_renovou')
    };
  });
};

diasContratoNoMes = function(c, mes, ano){
  if (!c || c.status === 'excluido' || c.status === 'cancelado') return 0;
  const inicio = dataLocal(c.inicio), venc = dataLocal(vencAjustadoContrato(c));
  if (!inicio || !venc) return 0;
  const fimExclusivo = new Date(venc);
  if (fimExclusivo <= inicio) fimExclusivo.setDate(fimExclusivo.getDate()+1);
  const mesInicio = new Date(ano, mes, 1);
  const mesFimExclusivo = new Date(ano, mes+1, 1);
  const inicioCalc = new Date(Math.max(inicio.getTime(), mesInicio.getTime()));
  const fimCalc = new Date(Math.min(fimExclusivo.getTime(), mesFimExclusivo.getTime()));
  if (fimCalc <= inicioCalc) return 0;
  return Math.ceil((fimCalc - inicioCalc) / 86400000);
};
mesesCompetenciaContrato = function(c){
  const inicio = dataLocal(c?.inicio), venc = dataLocal(vencAjustadoContrato(c));
  if (!inicio || !venc || c.status === 'excluido' || c.status === 'cancelado') return [];
  const qtdMeses = Math.max(1, mesesContrato(c));
  const meses = [];
  const cursor = new Date(inicio.getFullYear(), inicio.getMonth(), 1);
  const fimLoop = new Date(venc.getFullYear(), venc.getMonth(), 1);
  while (cursor <= fimLoop) {
    const ano = cursor.getFullYear(), mes = cursor.getMonth();
    const dias = diasContratoNoMes(c, mes, ano);
    if (dias > 0) meses.push({ano, mes, dias, chave:`${ano}_${String(mes).padStart(2,'0')}`});
    cursor.setMonth(cursor.getMonth()+1);
  }
  return meses
    .sort((a,b)=> b.dias - a.dias || a.ano - b.ano || a.mes - b.mes)
    .slice(0, qtdMeses)
    .sort((a,b)=> a.ano - b.ano || a.mes - b.mes);
};
contratoContaCompetenciaMes = function(c, mes, ano){
  const chave = `${ano}_${String(mes).padStart(2,'0')}`;
  return mesesCompetenciaContrato(c).some(m=>m.chave===chave);
};

progressPlano = function(a){
  const c = a?.contratoAtual;
  if(!c) return `<div style="font-size:11px;color:var(--texto-muted);margin-top:2px">Sem contrato cadastrado</div>`;
  const ini = dataLocal(c.inicio), venc = dataLocal(vencAjustadoContrato(c)), hoje = new Date();
  const totalDias = Math.max(1, Math.round((venc-ini)/86400000));
  const diasPassados = Math.max(0, Math.min(totalDias, Math.round((hoje-ini)/86400000)));
  const pct = Math.round((diasPassados/totalDias)*100);
  const totalMeses = PLANO_MESES[c.plano] || 1;
  const segmento = totalDias / totalMeses;
  const etapa = hoje < ini ? 0 : Math.max(1, Math.min(totalMeses, Math.ceil((diasPassados || 1) / segmento)));
  const labelPeriodo = c.plano === 'mensal' ? `${pct}% do período` : `${etapa}/${totalMeses}`;
  const pago = totalPagoContrato(c.id), total = valorContrato(c), saldo = Math.max(0,total-pago);
  const pctPago = total>0 ? Math.min(100, Math.round(pago/total*100)) : 0;
  const tooltipFerias = c.venc !== vencAjustadoContrato(c) ? ` · venc. ajustado ${fmtData(vencAjustadoContrato(c))}` : '';
  return `<div class="progress-wrap"><div class="progress-bar" style="width:80px"><div class="progress-fill" style="width:${pct}%"></div></div><span class="progress-label">${labelPeriodo}</span></div>
  <div style="font-size:10px;color:var(--texto-muted);margin-top:2px">${fmtValor(mensalidadeContrato(c))}/mês · Total ${fmtValor(total)}${tooltipFerias}</div>
  <div style="font-size:10px;color:${saldo>0?'var(--amarelo)':'var(--verde)'};margin-top:1px">Pago ${fmtValor(pago)} (${pctPago}%) · Saldo ${fmtValor(saldo)}</div>`;
};

function isAulaExtraPagamento(p){ return p && p.tipo === 'aula_extra' && p.status !== 'excluido'; }
function aulasExtrasMes(mes, ano){
  return pagamentos.filter(p=>isAulaExtraPagamento(p) && p.data && new Date(p.data)>=dataMesInicio(mes,ano) && new Date(p.data)<=dataMesFim(mes,ano));
}
function totalAulasExtrasMes(mes, ano){ return aulasExtrasMes(mes,ano).reduce((acc,p)=>acc+Number(p.valor||0),0); }
receitaMesEsp = function(mes,ano){
  const contratosValor = contratos.filter(c=>contratoContaCompetenciaMes(c,mes,ano)).reduce((acc,c)=>acc+mensalidadeContrato(c),0);
  return contratosValor + totalAulasExtrasMes(mes,ano);
};
receitaCaixaMes = function(mes,ano){
  return pagamentos.filter(p=>p.status!=='excluido' && p.data && new Date(p.data)>=dataMesInicio(mes,ano) && new Date(p.data)<=dataMesFim(mes,ano))
    .reduce((acc,p)=>acc+Number(p.valor||0),0);
};
receitaDoMesSelecionada = function(mes,ano){ return financeiroModo==='caixa' ? receitaCaixaMes(mes,ano) : receitaMesEsp(mes,ano); };

function alunosPendentesPagamento(){
  const hoje = new Date();
  return alunos.filter(a=>{
    const c = a.contratoAtual || contratoVigenteAluno(a.id);
    if(!c) return false;
    const ini = dataLocal(c.inicio), venc = dataLocal(vencAjustadoContrato(c));
    return ini <= hoje && venc >= hoje && saldoContrato(c) > 0;
  });
}

renderDashboard = function() {
  hidratarAlunosComContratos();
  const quitados = alunos.filter(a=>statusContrato(a).contrato==='ativo').length;
  const pendentesPgto = alunosPendentesPagamento();
  const semContrato  = alunos.filter(a=>{const sc=statusContrato(a); return sc.contrato==='nao_renovou'||sc.contrato==='a_renovar';}).length;
  const inadimplentes= alunos.filter(a=>statusContrato(a).contrato==='inadimplente').length;
  const venc30       = alunos.filter(a=>{const d=diasAte(a.venc);return d>=0&&d<=10;});
  const venc7        = alunos.filter(a=>{const d=diasAte(a.venc);return d>=0&&d<=7;});
  const receitaComp  = receitaMesEsp(MES_ATUAL, ANO_ATUAL);
  const receitaCx    = receitaCaixaMes(MES_ATUAL, ANO_ATUAL);
  const receita      = receitaDoMesSelecionada(MES_ATUAL, ANO_ATUAL);
  const chave        = chaveDesp(MES_ATUAL,ANO_ATUAL);
  const despAtual    = despCache[chave]||DESP_BASE;
  const totDesp      = totalDesp(despAtual);
  const resultado    = receita-totDesp;
  const resPos       = resultado>=0;
  let alertas='';
  if(venc7.length) alertas+=`<div class="alert-bar urgente"><span class="alert-icon">🚨</span><strong>${venc7.length} contrato(s)</strong>&nbsp;vence(m) em até 7 dias:&nbsp;${venc7.map(a=>a.nome).join(', ')}</div>`;
  if(venc30.filter(a=>diasAte(a.venc)>7).length) alertas+=`<div class="alert-bar atencao"><span class="alert-icon">⏰</span><strong>${venc30.filter(a=>diasAte(a.venc)>7).length} contrato(s)</strong>&nbsp;vence(m) nos próximos 10 dias:&nbsp;${venc30.filter(a=>diasAte(a.venc)>7).map(a=>a.nome).join(', ')}</div>`;
  if(pendentesPgto.length) alertas+=`<div class="alert-bar atencao"><span class="alert-icon">💰</span><strong>${pendentesPgto.length} pendente(s) de pagamento:</strong>&nbsp;${pendentesPgto.map(a=>a.nome).join(', ')}</div>`;
  if(inadimplentes) alertas+=`<div class="alert-bar urgente"><span class="alert-icon">🔴</span><strong>${inadimplentes} inadimplente(s):</strong>&nbsp;${alunos.filter(a=>statusContrato(a).contrato==='inadimplente').map(a=>a.nome).join(', ')}</div>`;
  if(semContrato) alertas+=`<div class="alert-bar atencao"><span class="alert-icon">📋</span><strong>${semContrato} sem contrato ativo</strong>&nbsp;— verificar renovação:&nbsp;${alunos.filter(a=>{const sc=statusContrato(a);return sc.contrato==='nao_renovou'||sc.contrato==='a_renovar';}).map(a=>a.nome).join(', ')}</div>`;

  document.getElementById('content').innerHTML=`
    <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--texto-muted);margin-bottom:10px">Alunos <span style="font-weight:400;font-size:9px">(clique para filtrar)</span></div>
    <div class="cards-grid" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr));margin-bottom:16px">
      <div class="card c-green" style="cursor:pointer" onclick="irParaAlunos('pago')" title="Ver quitados"><div class="card-accent" style="background:var(--verde)"></div><div class="card-label">Quitados</div><div class="card-value">${quitados}</div><div class="card-sub">vigentes e pagos</div><div class="card-icon">✅</div></div>
      <div class="card c-yellow" style="cursor:pointer" onclick="irParaAlunos('pendente')" title="Ver pendentes"><div class="card-accent" style="background:var(--amarelo)"></div><div class="card-label">Pendentes</div><div class="card-value">${pendentesPgto.length}</div><div class="card-sub">vigentes com saldo</div><div class="card-icon">💰</div></div>
      <div class="card" style="border-top:3px solid #6b7280;cursor:pointer" onclick="irParaAlunos('nao_renovou')" title="Ver sem contrato"><div class="card-label">Sem Contrato</div><div class="card-value" style="color:#6b7280">${semContrato}</div><div class="card-sub">não renovaram</div><div class="card-icon" style="opacity:0.07">📋</div></div>
      <div class="card c-yellow" style="cursor:pointer" onclick="irParaAlunos('vencendo')" title="Ver vencendo"><div class="card-accent" style="background:var(--amarelo)"></div><div class="card-label">Vencendo em 10 dias</div><div class="card-value">${venc30.length}</div><div class="card-sub">vence em até 10 dias</div><div class="card-icon">⏰</div></div>
      <div class="card c-red" style="cursor:pointer" onclick="irParaAlunos('inadimplente')" title="Ver inadimplentes"><div class="card-accent" style="background:var(--vermelho)"></div><div class="card-label">Inadimplentes</div><div class="card-value">${inadimplentes}</div><div class="card-sub">vencidos em aberto</div><div class="card-icon">⚠️</div></div>
    </div>
    <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:10px">
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--texto-muted)">Financeiro — ${MESES_NOMES[MES_ATUAL]} <span style="font-weight:400;color:var(--texto-muted)">(${financeiroModo==='competencia'?'competência':'caixa'})</span></div>
      <div style="display:flex;gap:6px"><button class="btn ${financeiroModo==='competencia'?'btn-primary':'btn-ghost'} btn-sm" onclick="setModoFinanceiro('competencia')">Competência</button><button class="btn ${financeiroModo==='caixa'?'btn-primary':'btn-ghost'} btn-sm" onclick="setModoFinanceiro('caixa')">Caixa</button></div>
    </div>
    <div class="cards-grid" style="grid-template-columns:repeat(auto-fit,minmax(190px,1fr));margin-bottom:24px">
      <div class="card c-green" style="cursor:pointer" onclick="abrirResumoReceita()" title="Ver contribuição por aluno"><div class="card-accent" style="background:var(--verde)"></div><div class="card-label">Receita ${financeiroModo==='competencia'?'Competência':'Caixa'} ↗</div><div class="card-value" style="font-size:24px;padding-top:4px">${fmtValor(receita)}</div><div class="card-sub">Comp.: ${fmtValor(receitaComp)} · Caixa: ${fmtValor(receitaCx)}</div><div class="card-icon">💰</div></div>
      <div class="card c-red" style="cursor:pointer" onclick="setView('despesas')" title="Ver despesas"><div class="card-accent" style="background:var(--vermelho)"></div><div class="card-label">Total Despesas ↗</div><div class="card-value" style="font-size:24px;padding-top:4px">${fmtValor(totDesp)}</div><div class="card-sub">clique para ver despesas</div><div class="card-icon">💸</div></div>
      <div class="card" style="border-top:3px solid ${resPos?'var(--verde)':'var(--vermelho)'};cursor:pointer" onclick="setView('financeiro')" title="Ver financeiro"><div class="card-label">Resultado do Mês ↗</div><div class="card-value" style="font-size:24px;padding-top:4px;color:${resPos?'var(--verde)':'var(--vermelho)'}">${resPos?'':'-'}${fmtValor(Math.abs(resultado))}</div><div class="card-sub">clique para ver financeiro</div><div class="card-icon">${resPos?'📈':'📉'}</div></div>
    </div>
    ${alertas?`<div style="margin-bottom:20px">${alertas}</div>`:''}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div class="section-box"><div class="section-header"><div class="section-title">Status dos Alunos</div></div><div style="padding:20px 24px">
        ${[['ativo','Quitados','var(--verde)',quitados],['aguardando','Pendentes','var(--amarelo)',pendentesPgto.length],['inadimplente','Inadimplentes','var(--vermelho)',inadimplentes],['nao_renovou','Sem contrato','#9ca3af',semContrato]].map(([s,label,color,count])=>{const pct=alunos.length?Math.round((count/alunos.length)*100):0; const filtro=s==='ativo'?'pago':s==='aguardando'?'pendente':s; return `<div style="margin-bottom:14px;cursor:pointer" onclick="irParaAlunos('${filtro}')"><div style="display:flex;justify-content:space-between;margin-bottom:5px;font-size:13px"><span style="font-weight:600;color:${color}">${label}</span><span style="color:var(--texto-muted)">${count} (${pct}%) →</span></div><div style="height:6px;background:var(--borda);border-radius:3px;overflow:hidden"><div style="height:100%;width:${pct}%;background:${color};border-radius:3px;transition:width 0.4s"></div></div></div>`;}).join('')}
      </div></div>
      <div class="section-box"><div class="section-header"><div class="section-title">Vencimentos Próximos</div><button class="btn btn-ghost btn-sm" onclick="setView('alunos')">Ver todos</button></div><div style="padding:0">${(()=>{const prox=alunos.filter(a=>{const d=diasAte(a.venc);return d>=0&&d<=10;}).sort((a,b)=>new Date(a.venc)-new Date(b.venc)); if(!prox.length) return `<div class="empty"><div class="empty-icon">✅</div>Nenhum vencimento nos próximos 10 dias</div>`; return prox.map(a=>{const d=diasAte(a.venc);const cor=d<=7?'var(--vermelho)':'var(--amarelo)';const wBtn=a.whats?`<a href="https://wa.me/55${a.whats.replace(/\D/g,'')}" target="_blank" style="font-size:18px;text-decoration:none" title="WhatsApp">📱</a>`:''; return `<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 24px;border-bottom:1px solid var(--borda)"><div style="cursor:pointer" onclick="abrirPerfilAluno('${a.id}')"><div style="font-weight:600;font-size:13.5px;color:var(--vermelho);text-decoration:underline;text-underline-offset:2px">${a.nome}</div><div style="font-size:11px;color:var(--texto-muted)">${fmtData(a.venc)}</div></div><div style="display:flex;align-items:center;gap:8px">${wBtn}<div style="text-align:right"><div style="font-size:12px;font-weight:700;color:${cor}">${d===0?'Hoje':d===1?'Amanhã':d+' dias'}</div>${statusBadge(a.status)}</div></div></div>`;}).join('');})()}</div></div>
    </div>`;
};
window.renderDashboard = renderDashboard;

function abrirModalAulaExtra(alunoId, pagamentoId=null){
  const a = alunos.find(x=>String(x.id)===String(alunoId)); if(!a) return;
  const p = pagamentoId ? pagamentos.find(x=>String(x.id)===String(pagamentoId)) : null;
  const formaInicial = p?.forma || 'PIX';
  const html = `<div style="position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:440;display:flex;align-items:center;justify-content:center;padding:16px" id="modal-aulaextra-overlay">
    <div style="background:#fff;border-radius:12px;padding:24px;width:100%;max-width:460px;box-shadow:var(--shadow-lg)">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:22px;margin-bottom:4px">${p?'Editar Aula Extra':'Registrar Aula Extra'}</div>
      <div style="font-size:12px;color:var(--texto-muted);margin-bottom:16px"><strong>${esc(a.nome)}</strong> · entra em competência e caixa no mês da data.</div>
      <div class="form-grid" style="grid-template-columns:1fr">
        <div class="form-group"><label class="form-label">Data da aula/recebimento</label><input class="form-input" type="date" id="ae-data" value="${p?.data||HOJE.toISOString().split('T')[0]}"></div>
        <div class="form-group"><label class="form-label">Descrição</label><input class="form-input" id="ae-desc" value="${esc(p?.descricao||'Aula extra')}" placeholder="Ex: Aula extra sábado"></div>
        <div class="form-group"><label class="form-label">Valor recebido (R$)</label><input class="form-input" type="number" step="0.01" id="ae-valor" value="${p?.valor||''}"></div>
        <div class="form-group"><label class="form-label">Forma</label><select class="form-select" id="ae-forma"><option value="PIX" ${formaInicial==='PIX'?'selected':''}>PIX</option><option value="Cartão" ${formaInicial==='Cartão'?'selected':''}>Cartão</option><option value="Dinheiro" ${formaInicial==='Dinheiro'?'selected':''}>Dinheiro</option></select></div>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px"><button class="btn btn-ghost" onclick="document.getElementById('modal-aulaextra-overlay').remove()">Cancelar</button><button class="btn btn-primary" onclick="confirmarAulaExtra('${alunoId}','${pagamentoId||''}')">Salvar</button></div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
}
window.abrirModalAulaExtra = abrirModalAulaExtra;
window.confirmarAulaExtra = async function(alunoId, pagamentoId){
  const a = alunos.find(x=>String(x.id)===String(alunoId)); if(!a) return;
  const data = document.getElementById('ae-data').value;
  const valor = parseFloat(document.getElementById('ae-valor').value)||0;
  const descricao = document.getElementById('ae-desc').value.trim() || 'Aula extra';
  const forma = document.getElementById('ae-forma').value;
  if(!data || valor<=0){ alert('Preencha data e valor.'); return; }
  const existente = pagamentoId ? pagamentos.find(p=>String(p.id)===String(pagamentoId)) : null;
  const id = pagamentoId || `ae_${alunoId}_${Date.now()}`;
  const pg = {id, contratoId:'aula_extra', tipo:'aula_extra', alunoId:String(alunoId), alunoNome:a.nome, valor, valorLiquido:valor, valorBruto:forma==='Cartão'?valor:null, taxaCartaoValor:null, data, forma, parcelas:null, descricao, status:'ativo', ts:existente?.ts||Date.now(), atualizadoEm:new Date().toISOString()};
  await salvarPagamentoDb(pg);
  await registrarAuditoria(pagamentoId?'edicao_aula_extra':'aula_extra', alunoId, a.nome, existente||{}, pg);
  document.getElementById('modal-aulaextra-overlay').remove();
  toast('Aula extra salva ✓');
  abrirPerfilAluno(alunoId);
};
editarPagamento = function(alunoId, pagamentoId){
  const p=pagamentos.find(x=>String(x.id)===String(pagamentoId));
  if(!p) return;
  if(isAulaExtraPagamento(p)) abrirModalAulaExtra(alunoId, pagamentoId);
  else abrirModalPagamentoContrato(alunoId,p.contratoId,pagamentoId);
};
window.editarPagamento = editarPagamento;

abrirPerfilAluno = async function(id){
  alunoPerfilAtualId = String(id);
  hidratarAlunosComContratos();
  const a = alunos.find(x=>String(x.id)===String(id)); if(!a) return;
  const lista = contratosDoAluno(id).sort((x,y)=>new Date(y.inicio)-new Date(x.inicio));
  const cAtual = contratoVigenteAluno(id);
  const sc = statusContratoObj(cAtual);
  const freq = a.frequencia || 3;
  const limiteDias = {mensal:0,trimestral:7,semestral:15,anual:30}[cAtual?.plano]||0;
  const ferias = a.ferias || [];
  const diasUsados = ferias.reduce((acc,f)=>acc+diasEntreIncl(f.inicio,f.fim),0);
  const diasRestantes = Math.max(0,limiteDias-diasUsados);
  const treinosPerdidos = Math.round(diasUsados/7*freq);
  const vencAtualAjust = cAtual ? vencAjustadoContrato(cAtual) : '';
  const feriasHtml = ferias.length ? ferias.map((f,i)=>{ const d=diasEntreIncl(f.inicio,f.fim); return `<div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--borda)"><div style="flex:1"><strong>${fmtData(f.inicio)} → ${fmtData(f.fim)}</strong><div style="font-size:11px;color:var(--texto-muted)">${d} dia(s) · vigência ajustada automaticamente</div></div><button class="btn btn-ghost btn-sm" onclick="editarFerias('${id}',${i},${limiteDias},${diasUsados-d})">✏️</button><button class="btn btn-danger btn-sm" onclick="excluirFerias('${id}',${i})">🗑</button></div>`;}).join('') : '<div style="color:var(--texto-muted);font-size:13px;padding:8px 0">Nenhum período registrado.</div>';
  const contratoAtualHtml = cAtual ? `<div style="padding:16px 24px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px"><span class="badge badge-${sc.contrato}" style="color:${sc.cor};background:${sc.cor}18;font-size:12px">${sc.icon} ${sc.label}</span><button class="btn btn-ghost btn-sm" onclick="abrirModalContrato('${id}','${cAtual.id}')">✏️ Editar</button></div>
      ${[['Contrato',nomeContrato(cAtual)],['Plano',PLANO_LABEL[cAtual.plano]||cAtual.plano],['Início',fmtData(cAtual.inicio)],['Vencimento original',fmtData(cAtual.venc)],['Vencimento ajustado',vencAtualAjust!==cAtual.venc?`${fmtData(vencAtualAjust)} (com férias)`:fmtData(cAtual.venc)],['Valor total',fmtValor(valorContrato(cAtual))],['Pago',fmtValor(totalPagoContrato(cAtual.id))],['Saldo',fmtValor(saldoContrato(cAtual))]].map(([l,v])=>`<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--borda);font-size:13px"><span style="color:var(--texto-muted)">${l}</span><span style="font-weight:600">${v}</span></div>`).join('')}
      <div style="margin-top:12px">${progressPlano({...a, contratoAtual:cAtual})}</div>
      <div style="display:flex;gap:8px;margin-top:12px"><button class="btn btn-success btn-sm" onclick="abrirModalPagamentoContrato('${id}','${cAtual.id}')" style="flex:1">💰 Registrar pagamento</button><button class="btn btn-primary btn-sm" onclick="abrirModalContrato('${id}')" style="flex:1">🔄 Renovar</button></div>
    </div>` : `<div class="empty"><div class="empty-icon">📋</div>Sem contrato cadastrado.<br><button class="btn btn-primary btn-sm" onclick="abrirModalContrato('${id}')" style="margin-top:12px">+ Criar contrato</button></div>`;
  const contratosHtml = lista.length ? lista.map(c=>{
    const pago=totalPagoContrato(c.id), saldo=saldoContrato(c), s=statusContratoHistorico(c), vAdj=vencAjustadoContrato(c);
    return `<tr><td><strong>${esc(nomeContrato(c))}</strong><div style="font-size:11px;color:var(--texto-muted)">${fmtData(c.inicio)} → ${fmtData(vAdj)}${vAdj!==c.venc?' · com férias':''}</div></td><td>${planoBadge(c.plano)}</td><td style="font-weight:700">${fmtValor(valorContrato(c))}</td><td style="color:var(--verde);font-weight:700">${fmtValor(pago)}</td><td style="color:${saldo>0?'var(--amarelo)':'var(--verde)'};font-weight:700">${fmtValor(saldo)}</td><td><span class="badge" style="color:${s.cor};background:${s.cor}18">${s.icon} ${s.label}</span></td><td style="white-space:nowrap"><button class="btn btn-success btn-sm" onclick="abrirModalPagamentoContrato('${id}','${c.id}')">💰</button><button class="btn btn-ghost btn-sm" onclick="abrirModalContrato('${id}','${c.id}')">✏️</button><button class="btn btn-danger btn-sm" onclick="excluirContrato('${id}','${c.id}')">🗑</button></td></tr>`;
  }).join('') : '<tr><td colspan="7"><div class="empty">Nenhum contrato cadastrado.</div></td></tr>';
  const pgRows = pagamentosDoAluno(id).map(p=>{ const isExtra=isAulaExtraPagamento(p); const contratoTxt = isExtra ? 'Aula extra · entra em caixa e competência' : `${esc(nomeContrato(contratos.find(c=>String(c.id)===String(p.contratoId))||{}))} · ${p.forma||'—'}${detalheCartaoTexto(p)}`; return `<tr><td>${fmtData(p.data)}</td><td><strong>${esc(p.descricao||'Pagamento')}</strong>${isExtra?` <span class="badge" style="background:var(--azul-light);color:var(--azul);margin-left:6px">Aula extra</span>`:''}<div style="font-size:11px;color:var(--texto-muted)">${contratoTxt}</div></td><td style="font-weight:700;color:var(--verde)">${fmtValor(p.valor)}</td><td style="white-space:nowrap"><button class="btn btn-ghost btn-sm" onclick="editarPagamento('${id}','${p.id}')">✏️</button><button class="btn btn-danger btn-sm" onclick="excluirPagamento('${id}','${p.id}')">🗑</button></td></tr>`;}).join('') || '<tr><td colspan="4"><div class="empty">Nenhum pagamento registrado.</div></td></tr>';
  document.getElementById('content').innerHTML = `<div style="margin-bottom:20px"><button class="btn btn-ghost btn-sm" onclick="setView('alunos')">← Voltar para Alunos</button></div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px">
    <div class="section-box"><div class="section-header"><div class="section-title">${esc(a.nome)}</div><button class="btn btn-ghost btn-sm" onclick="openModalAluno('${id}')">✏️ Editar aluno</button></div><div style="padding:16px 24px;display:grid;grid-template-columns:1fr 1fr;gap:12px">${[['Entrada no Studio',fmtData(a.dataEntrada)],['WhatsApp',a.whats||'—'],['Frequência',`${freq}x/semana`],['Turmas',resumoTurmasAluno(a)]].map(([l,v])=>`<div><div style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--texto-muted);margin-bottom:3px">${l}</div><div style="font-weight:600">${v}</div></div>`).join('')}${a.obsAluno?`<div style="grid-column:1/-1;padding:8px 12px;background:var(--cinza-light);border-radius:6px;font-size:12px;color:var(--texto-muted)">${esc(a.obsAluno)}</div>`:''}</div></div>
    <div class="section-box"><div class="section-header"><div class="section-title">Contrato vigente</div></div>${contratoAtualHtml}</div>
  </div>
  <div class="section-box" style="margin-bottom:20px"><div class="section-header"><div class="section-title">Histórico de Contratos</div><button class="btn btn-primary btn-sm" onclick="abrirModalContrato('${id}')">+ Novo contrato</button></div><div class="table-wrap"><table><thead><tr><th>Contrato</th><th>Plano</th><th>Total</th><th>Pago</th><th>Saldo</th><th>Status</th><th>Ações</th></tr></thead><tbody>${contratosHtml}</tbody></table></div></div>
  <div class="section-box" style="margin-bottom:20px"><div class="section-header"><div><div class="section-title">Pagamentos e Aulas Extras</div><div style="font-size:12px;color:var(--texto-muted)">Aulas extras entram no caixa e na competência na data lançada.</div></div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-primary btn-sm" onclick="abrirModalAulaExtra('${id}')">+ Aula extra</button><button class="btn btn-ghost btn-sm" onclick="abrirModalPagamentoContrato('${id}')">+ Pagamento</button></div></div><div class="table-wrap"><table><thead><tr><th>Data</th><th>Descrição</th><th>Valor</th><th>Ações</th></tr></thead><tbody>${pgRows}</tbody></table></div></div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px"><div class="section-box"><div class="section-header"><div><div class="section-title">Férias / Trancamento</div><div style="font-size:12px;color:var(--texto-muted)">${limiteDias>0?`${diasUsados}/${limiteDias} dias usados · ${diasRestantes} restantes`:'Plano mensal — sem direito a férias'}</div></div>${limiteDias>0?`<button class="btn btn-ghost btn-sm" onclick="abrirModalFerias('${id}')">+ Adicionar</button>`:''}</div><div style="padding:12px 24px">${limiteDias>0?`<div style="margin-bottom:12px"><div style="height:8px;background:var(--borda);border-radius:4px;overflow:hidden"><div style="height:100%;width:${Math.min(100,diasUsados/limiteDias*100)}%;background:${diasRestantes===0?'var(--vermelho)':'var(--amarelo)'};border-radius:4px"></div></div><div style="font-size:11px;color:var(--texto-muted);margin-top:4px">Freq: ${freq}x/semana · Treinos afetados: ${treinosPerdidos} · Vigência final: ${cAtual?fmtData(vencAtualAjust):'—'}</div></div>${feriasHtml}`:'<div style="color:var(--texto-muted);font-size:13px">Plano mensal não tem direito a férias.</div>'}</div></div><div class="section-box"><div class="section-header"><div class="section-title">Configuração de treino</div></div><div style="padding:16px 24px"><div class="form-group"><label class="form-label">Frequência semanal</label><select class="form-select" onchange="salvarFrequencia('${id}',this.value)">${[1,2,3,4,5,6,7].map(n=>`<option value="${n}" ${freq===n?'selected':''}>${n}x por semana</option>`).join('')}</select></div><button class="btn btn-primary btn-sm" onclick="abrirModalEncaixarTurma('${id}')" style="width:100%;margin-top:12px">📅 Encaixar em Turmas</button></div></div></div>`;
  document.getElementById('page-title').textContent = a.nome;
};
window.abrirPerfilAluno = abrirPerfilAluno;

renderFinanceiroView = async function(){
  loading(true);
  const cats = await loadDespesas(finMes, finAno);
  const receita = receitaDoMesSelecionada(finMes, finAno), receitaComp = receitaMesEsp(finMes, finAno), receitaCx = receitaCaixaMes(finMes, finAno);
  const catDefs = {operacional:{label:'Colaboradores',icon:'👔',color:'var(--azul)'},despesa_op:{label:'Despesas Operacionais',icon:'🏢',color:'var(--roxo)'},administrativo:{label:'Administrativo',icon:'📋',color:'var(--texto-mid)'},marketing:{label:'Marketing',icon:'📣',color:'var(--vermelho)'},impostos:{label:'Impostos',icon:'🧾',color:'#b45309'},pessoal:{label:'Pessoal e Encargos',icon:'👷',color:'#0f766e'}};
  const totais={}; let totDesp=0; Object.keys(catDefs).forEach(cat=>{totais[cat]=(cats[cat]||[]).reduce((a,d)=>a+Number(d.valor),0); totDesp+=totais[cat];});
  const totTaxa = totalTaxaCartaoMes(finMes, finAno);
  const resultado = receita - totDesp, resPos=resultado>=0;
  const contratosMes = contratos.filter(c=>contratoContaCompetenciaMes(c,finMes,finAno)).sort((a,b)=>mensalidadeContrato(b)-mensalidadeContrato(a));
  const extrasMes = aulasExtrasMes(finMes,finAno).sort((a,b)=>new Date(b.data)-new Date(a.data));
  const pagamentosMes = pagamentos.filter(p=>p.status!=='excluido' && p.data && new Date(p.data)>=dataMesInicio(finMes,finAno) && new Date(p.data)<=dataMesFim(finMes,finAno)).sort((a,b)=>new Date(b.data)-new Date(a.data));
  const linhasCompContratos = contratosMes.map(c=>`<tr><td><strong>${esc(c.alunoNome||'—')}</strong></td><td>${esc(nomeContrato(c))}<div style="font-size:11px;color:var(--texto-muted)">${competenciaResumoContratoMesV18(c,finMes,finAno)}${c.pgto==='Cartão'&&c.valorBruto?` · bruto cartão ${fmtValor(c.valorBruto)} · líquido ${fmtValor(valorContrato(c))}`:''}</div></td><td style="font-weight:700;color:var(--verde)">${fmtValor(mensalidadeContrato(c))}</td></tr>`).join('');
  const linhasCompExtras = extrasMes.map(p=>`<tr><td><strong>${esc(p.alunoNome||'—')}</strong></td><td>${esc(p.descricao||'Aula extra')}<div style="font-size:11px;color:var(--texto-muted)">${fmtData(p.data)} · aula extra · entra em competência e caixa</div></td><td style="font-weight:700;color:var(--verde)">${fmtValor(p.valor)}</td></tr>`).join('');
  const linhasReceita = financeiroModo==='caixa'
    ? pagamentosMes.map(p=>`<tr><td>${fmtData(p.data)}</td><td><strong>${esc(p.alunoNome||'—')}</strong>${isAulaExtraPagamento(p)?` <span class="badge" style="background:var(--azul-light);color:var(--azul);margin-left:6px">Aula extra</span>`:''}<div style="font-size:11px;color:var(--texto-muted)">${esc(p.descricao||'Pagamento')} · ${p.forma||'—'}${detalheCartaoTexto(p)}</div></td><td style="font-weight:700;color:var(--verde)">${fmtValor(p.valor)}</td></tr>`).join('')
    : linhasCompContratos + linhasCompExtras;
  const taxasRows = pagamentosCartaoMes(finMes,finAno).filter(p=>valorTaxaCartao(p)>0).map(p=>`<tr><td>${fmtData(p.data)}</td><td><strong>${esc(p.alunoNome||'—')}</strong><div style="font-size:11px;color:var(--texto-muted)">Bruto ${fmtValor(p.valorBruto||p.valor)} · líquido ${fmtValor(p.valor)}${p.parcelas?` · ${p.parcelas}x`:''}</div></td><td style="font-weight:700;color:#b45309">${fmtValor(valorTaxaCartao(p))}</td></tr>`).join('');
  const projecao = await Promise.all(Array.from({length:12},async(_,i)=>{const d=await loadDespesas(i,finAno); const r=financeiroModo==='caixa'?receitaCaixaMes(i,finAno):receitaMesEsp(i,finAno); const td=totalDesp(d); return {mes:i,receita:r,desp:td,resultado:r-td};}));
  const totAnoRec=projecao.reduce((a,p)=>a+p.receita,0), totAnoDesp=projecao.reduce((a,p)=>a+p.desp,0), totAnoRes=totAnoRec-totAnoDesp;
  document.getElementById('content').innerHTML=`<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:12px"><div class="mes-selector"><button class="mes-btn" onclick="navegarFin(-1)">◀</button><div class="mes-label">${MESES_NOMES[finMes]} ${finAno}</div><button class="mes-btn" onclick="navegarFin(1)">▶</button></div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn ${financeiroModo==='competencia'?'btn-primary':'btn-ghost'} btn-sm" onclick="setModoFinanceiro('competencia')">Competência</button><button class="btn ${financeiroModo==='caixa'?'btn-primary':'btn-ghost'} btn-sm" onclick="setModoFinanceiro('caixa')">Caixa</button><button class="btn btn-ghost btn-sm" onclick="setView('despesas')">✏️ Editar despesas</button><button class="btn btn-primary btn-sm" onclick="imprimirDRE()">🖨️ Imprimir</button></div></div>
  <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:12px 16px;font-size:13px;margin-bottom:20px"><strong>Visão atual: ${financeiroModo==='competencia'?'Competência':'Caixa'}.</strong> Competência mensaliza contratos pelo mês predominante e inclui aulas extras na data; Caixa mostra pagamentos líquidos recebidos. Comp.: <strong>${fmtValor(receitaComp)}</strong> · Caixa: <strong>${fmtValor(receitaCx)}</strong>. Taxas de cartão aparecem como informativo e não alteram o resultado.</div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:16px;margin-bottom:24px"><div class="card c-green" style="border-top:3px solid var(--verde)"><div class="card-label">Receita do Mês</div><div class="card-value" style="font-size:24px;padding-top:4px">${fmtValor(receita)}</div><div class="card-sub">${financeiroModo==='competencia'?'contratos + aulas extras':'pagamentos líquidos'}</div></div><div class="card" style="border-top:3px solid var(--vermelho)"><div class="card-label">Total Despesas</div><div class="card-value" style="font-size:24px;padding-top:4px;color:var(--vermelho)">${fmtValor(totDesp)}</div><div class="card-sub">impostos incluídos</div></div><div class="card" style="border-top:3px solid ${resPos?'var(--verde)':'var(--vermelho)'}"><div class="card-label">Resultado</div><div class="card-value" style="font-size:24px;padding-top:4px;color:${resPos?'var(--verde)':'var(--vermelho)'}">${resPos?'':'-'}${fmtValor(Math.abs(resultado))}</div><div class="card-sub">${resPos?'▲ superávit':'▼ déficit'}</div></div><div class="card" style="border-top:3px solid #b45309"><div class="card-label">Taxas cartão</div><div class="card-value" style="font-size:24px;padding-top:4px;color:#b45309">${fmtValor(totTaxa)}</div><div class="card-sub">informativo · fora do DRE</div></div></div>
  <div class="section-box" style="margin-bottom:24px"><div class="section-header"><div class="section-title">Receita — ${financeiroModo==='competencia'?'Competência':'Caixa'}</div></div><div class="table-wrap"><table><thead><tr>${financeiroModo==='caixa'?'<th>Data</th><th>Aluno / descrição</th><th>Valor</th>':'<th>Aluno</th><th>Contrato / aula extra</th><th>Receita mensal</th>'}</tr></thead><tbody>${linhasReceita||`<tr><td colspan="3"><div class="empty">Nenhuma receita nesta visão.</div></td></tr>`}</tbody></table></div></div>
  <div class="section-box" style="margin-bottom:24px"><div class="section-header"><div class="section-title">Resumo Financeiro</div></div><div style="padding:0"><div style="padding:14px 24px;border-bottom:1px solid var(--borda);background:#f9fafb;display:flex;justify-content:space-between;align-items:center"><span style="font-weight:700">💰 Receita líquida</span><span style="font-weight:700;color:var(--verde);font-size:15px">${fmtValor(receita)}</span></div>${Object.entries(catDefs).map(([cat,info])=>{const pct=receita>0?(totais[cat]/receita*100):0;return `<div style="padding:12px 24px;border-bottom:1px solid var(--borda);display:grid;grid-template-columns:1fr auto 120px;align-items:center;gap:12px"><span style="font-size:13px;color:var(--texto-mid)">${info.icon} ${info.label}</span><span style="font-weight:700;color:var(--vermelho);white-space:nowrap">${fmtValor(totais[cat])}</span><div><div style="height:5px;background:var(--borda);border-radius:2px;overflow:hidden"><div style="height:100%;width:${Math.min(100,pct)}%;background:${info.color};border-radius:2px"></div></div><div style="font-size:10px;color:var(--texto-muted);margin-top:2px">${pct.toFixed(0)}% da receita</div></div></div>`;}).join('')}<div style="padding:14px 24px;border-bottom:1px solid var(--borda);display:flex;justify-content:space-between;font-weight:700"><span>Total despesas</span><span style="color:var(--vermelho)">${fmtValor(totDesp)}</span></div><div style="padding:14px 24px;background:${resPos?'rgba(46,125,50,0.05)':'rgba(211,47,47,0.05)'};display:flex;justify-content:space-between;font-weight:700;font-size:15px"><span>Resultado</span><span style="color:${resPos?'var(--verde)':'var(--vermelho)'}">${resPos?'':'-'}${fmtValor(Math.abs(resultado))}</span></div></div></div>
  ${taxasRows?`<div class="section-box" style="margin-bottom:24px"><div class="section-header"><div class="section-title">Taxas de cartão — informativo</div></div><div class="table-wrap"><table><thead><tr><th>Data</th><th>Aluno</th><th>Taxa</th></tr></thead><tbody>${taxasRows}</tbody></table></div></div>`:''}
  <div class="section-box"><div class="section-header"><div class="section-title">Projeção Anual — ${financeiroModo==='competencia'?'Competência':'Caixa'}</div><div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap"><div class="mes-selector" style="padding:4px 10px"><button class="mes-btn" onclick="navegarAnoPro(-1)">◀</button><div class="mes-label" style="min-width:50px">${finAno}</div><button class="mes-btn" onclick="navegarAnoPro(1)">▶</button></div><div style="font-size:12px;color:var(--texto-muted)">Rec: <strong style="color:var(--verde)">${fmtValor(totAnoRec)}</strong> &nbsp; Desp: <strong style="color:var(--vermelho)">${fmtValor(totAnoDesp)}</strong> &nbsp; Res: <strong style="color:${totAnoRes>=0?'var(--verde)':'var(--vermelho)'}">${totAnoRes>=0?'':'-'}${fmtValor(Math.abs(totAnoRes))}</strong></div></div></div><div style="overflow-x:auto"><table><thead><tr><th>Mês</th><th>Receita</th><th>Total Desp.</th><th>Resultado</th></tr></thead><tbody>${projecao.map(p=>`<tr style="${p.mes===finMes?'background:rgba(211,47,47,0.04);font-weight:600':''}"><td style="font-weight:600">${MESES_ABREV[p.mes]}</td><td style="color:var(--verde);font-weight:600">${fmtValor(p.receita)}</td><td style="color:var(--vermelho);font-weight:600">${fmtValor(p.desp)}</td><td style="font-weight:700;color:${p.resultado>=0?'var(--verde)':'var(--vermelho)'}">${p.resultado>=0?'':'-'}${fmtValor(Math.abs(p.resultado))}</td></tr>`).join('')}</tbody><tfoot><tr style="background:#f9fafb;font-weight:700;border-top:2px solid var(--borda)"><td>TOTAL</td><td style="color:var(--verde)">${fmtValor(totAnoRec)}</td><td style="color:var(--vermelho)">${fmtValor(totAnoDesp)}</td><td style="color:${totAnoRes>=0?'var(--verde)':'var(--vermelho)'}">${totAnoRes>=0?'':'-'}${fmtValor(Math.abs(totAnoRes))}</td></tr></tfoot></table></div></div>`;
};
window.renderFinanceiroView = renderFinanceiroView;

abrirResumoReceita = function() {
  const mes = MES_ATUAL, ano = ANO_ATUAL;
  const total = receitaDoMesSelecionada(mes, ano);
  const receitaComp = receitaMesEsp(mes, ano);
  const receitaCx = receitaCaixaMes(mes, ano);
  const contratosMes = contratos.filter(c=>contratoContaCompetenciaMes(c,mes,ano)).sort((a,b)=>mensalidadeContrato(b)-mensalidadeContrato(a));
  const extrasMes = aulasExtrasMes(mes,ano).sort((a,b)=>new Date(b.data)-new Date(a.data));
  const pagamentosMes = pagamentos.filter(p=>p.status!=='excluido' && p.data && new Date(p.data)>=dataMesInicio(mes,ano) && new Date(p.data)<=dataMesFim(mes,ano)).sort((a,b)=>new Date(b.data)-new Date(a.data));
  const linhas = financeiroModo==='caixa'
    ? pagamentosMes.map(p=>`<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--borda);cursor:pointer" onclick="document.getElementById('modal-receita-overlay').remove();abrirPerfilAluno('${p.alunoId}')"><div style="flex:1"><div style="font-weight:600;color:var(--vermelho);text-decoration:underline;text-underline-offset:2px">${esc(p.alunoNome||'—')}</div><div style="font-size:11px;color:var(--texto-muted)">${fmtData(p.data)} · ${esc(p.descricao||'Pagamento')} · ${p.forma||'—'}${isAulaExtraPagamento(p)?' · aula extra':''}${detalheCartaoTexto(p)}</div></div><div style="text-align:right"><div style="font-weight:700;color:var(--verde)">${fmtValor(p.valor)}</div><div style="font-size:10px;color:var(--texto-muted)">caixa</div></div></div>`).join('')
    : contratosMes.map(c=>{const mens=mensalidadeContrato(c); const pct=total>0?(mens/total*100).toFixed(1):0; return `<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--borda);cursor:pointer" onclick="document.getElementById('modal-receita-overlay').remove();abrirPerfilAluno('${c.alunoId}')"><div style="flex:1"><div style="font-weight:600;color:var(--vermelho);text-decoration:underline;text-underline-offset:2px">${esc(c.alunoNome||'—')}</div><div style="font-size:11px;color:var(--texto-muted)">${esc(nomeContrato(c))} · ${competenciaResumoContratoMesV18(c,mes,ano)}</div></div><div style="text-align:right"><div style="font-weight:700;color:var(--verde)">${fmtValor(mens)}</div><div style="font-size:10px;color:var(--texto-muted)">${pct}% da receita</div></div></div>`;}).join('') + extrasMes.map(p=>`<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--borda);cursor:pointer" onclick="document.getElementById('modal-receita-overlay').remove();abrirPerfilAluno('${p.alunoId}')"><div style="flex:1"><div style="font-weight:600;color:var(--vermelho);text-decoration:underline;text-underline-offset:2px">${esc(p.alunoNome||'—')}</div><div style="font-size:11px;color:var(--texto-muted)">${fmtData(p.data)} · ${esc(p.descricao||'Aula extra')} · aula extra</div></div><div style="text-align:right"><div style="font-weight:700;color:var(--verde)">${fmtValor(p.valor)}</div><div style="font-size:10px;color:var(--texto-muted)">competência + caixa</div></div></div>`).join('');
  const html = `<div style="position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:400;display:flex;align-items:center;justify-content:center;padding:16px" id="modal-receita-overlay"><div style="background:#fff;border-radius:12px;width:100%;max-width:560px;max-height:85vh;overflow-y:auto;box-shadow:var(--shadow-lg)"><div style="padding:20px 24px;border-bottom:1px solid var(--borda);display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;background:#fff;z-index:1;gap:12px"><div><div style="font-family:'Bebas Neue',sans-serif;font-size:22px">Receita — ${financeiroModo==='competencia'?'Competência':'Caixa'}</div><div style="font-size:12px;color:var(--texto-muted)">${MESES_NOMES[mes]} ${ano} · Comp.: ${fmtValor(receitaComp)} · Caixa: ${fmtValor(receitaCx)}</div><div style="display:flex;gap:6px;margin-top:10px"><button class="btn ${financeiroModo==='competencia'?'btn-primary':'btn-ghost'} btn-sm" onclick="setModoFinanceiro('competencia');document.getElementById('modal-receita-overlay').remove();abrirResumoReceita()">Competência</button><button class="btn ${financeiroModo==='caixa'?'btn-primary':'btn-ghost'} btn-sm" onclick="setModoFinanceiro('caixa');document.getElementById('modal-receita-overlay').remove();abrirResumoReceita()">Caixa</button></div></div><div style="text-align:right;min-width:125px"><div style="font-family:'Bebas Neue',sans-serif;font-size:28px;color:var(--verde)">${fmtValor(total)}</div><button onclick="document.getElementById('modal-receita-overlay').remove()" style="background:none;border:none;cursor:pointer;font-size:13px;color:var(--texto-muted)">✕ Fechar</button></div></div><div style="padding:0 24px 16px">${linhas || `<div class="empty">Nenhuma receita nesta visão.</div>`}<div style="display:flex;justify-content:space-between;padding:12px 0;font-weight:700;font-size:14px;border-top:2px solid var(--borda);margin-top:4px"><span>Total</span><span style="color:var(--verde)">${fmtValor(total)}</span></div></div></div></div>`;
  document.body.insertAdjacentHTML('beforeend', html);
  document.getElementById('modal-receita-overlay').addEventListener('click', function(e) { if (e.target === this) this.remove(); });
};
window.abrirResumoReceita = abrirResumoReceita;

imprimirDRE = async function(){
  const cats = await loadDespesas(finMes, finAno);
  const receita = receitaDoMesSelecionada(finMes, finAno), receitaComp = receitaMesEsp(finMes, finAno), receitaCx = receitaCaixaMes(finMes, finAno);
  const catDefs = {operacional:'Colaboradores',despesa_op:'Despesas Operacionais',administrativo:'Administrativo',marketing:'Marketing',impostos:'Impostos',pessoal:'Pessoal e Encargos'};
  const totais={}; let totDesp=0; Object.keys(catDefs).forEach(cat=>{totais[cat]=(cats[cat]||[]).reduce((a,d)=>a+Number(d.valor),0); totDesp+=totais[cat];});
  const resultado=receita-totDesp, resPos=resultado>=0, totTaxa=totalTaxaCartaoMes(finMes,finAno);
  const contratosMes = contratos.filter(c=>contratoContaCompetenciaMes(c,finMes,finAno)).sort((a,b)=>(a.alunoNome||'').localeCompare(b.alunoNome||'','pt-BR'));
  const extrasMes = aulasExtrasMes(finMes,finAno).sort((a,b)=>(a.alunoNome||'').localeCompare(b.alunoNome||'','pt-BR'));
  const pagamentosMes = pagamentos.filter(p=>p.status!=='excluido' && p.data && new Date(p.data)>=dataMesInicio(finMes,finAno) && new Date(p.data)<=dataMesFim(finMes,finAno)).sort((a,b)=>(a.alunoNome||'').localeCompare(b.alunoNome||'','pt-BR'));
  const linhasReceita = financeiroModo==='caixa'
    ? pagamentosMes.map(p=>`<tr><td>${esc(p.alunoNome||'—')}<div style="font-size:11px;color:#777">${fmtData(p.data)} · ${p.forma||'—'}${isAulaExtraPagamento(p)?' · aula extra':''}${detalheCartaoTexto(p)}</div></td><td style="text-align:right;font-weight:600">${fmtValor(p.valor)}</td></tr>`).join('')
    : contratosMes.map(c=>`<tr><td>${esc(c.alunoNome||'—')}<div style="font-size:11px;color:#777">${esc(nomeContrato(c))}</div></td><td style="text-align:right;font-weight:600">${fmtValor(mensalidadeContrato(c))}</td></tr>`).join('') + extrasMes.map(p=>`<tr><td>${esc(p.alunoNome||'—')}<div style="font-size:11px;color:#777">${fmtData(p.data)} · ${esc(p.descricao||'Aula extra')} · aula extra</div></td><td style="text-align:right;font-weight:600">${fmtValor(p.valor)}</td></tr>`).join('');
  const linhasDesp = Object.entries(catDefs).map(([cat,label])=>{const items=(cats[cat]||[]).filter(d=>Number(d.valor)>0); if(!items.length&&totais[cat]===0) return ''; const linhasItens=items.map(d=>`<tr><td style="padding-left:22px;color:#555">${esc(d.desc)}</td><td style="text-align:right">${fmtValor(d.valor)}</td></tr>`).join(''); return `<tr style="background:#f7f7f7"><td><strong>${label}</strong></td><td style="text-align:right"><strong>${fmtValor(totais[cat])}</strong></td></tr>${linhasItens}`;}).join('');
  const linhasTaxa = pagamentosCartaoMes(finMes,finAno).filter(p=>valorTaxaCartao(p)>0).map(p=>`<tr><td>${esc(p.alunoNome||'—')}<div style="font-size:11px;color:#777">${fmtData(p.data)} · bruto ${fmtValor(p.valorBruto||p.valor)} · líquido ${fmtValor(p.valor)}${p.parcelas?` · ${p.parcelas}x`:''}</div></td><td style="text-align:right">${fmtValor(valorTaxaCartao(p))}</td></tr>`).join('');
  const dataImpressao = new Date().toLocaleDateString('pt-BR');
  const htmlPrint = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Resumo Financeiro — ${MESES_NOMES[finMes]} ${finAno}</title><style>@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700&display=swap');*{box-sizing:border-box}body{font-family:Barlow,Arial,sans-serif;font-size:13px;color:#111;background:#fff;padding:32px;max-width:760px;margin:0 auto}table{width:100%;border-collapse:collapse;border:1px solid #eee}td,th{padding:7px 8px;border-bottom:1px solid #eee}th{text-align:left;color:#777;font-size:11px;text-transform:uppercase}.logo{font-family:'Bebas Neue';font-size:36px}.logo span{color:#D32F2F}.header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #111;padding-bottom:18px;margin-bottom:22px}.title{font-family:'Bebas Neue';font-size:24px;color:#D32F2F}.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:22px}.card{border:1px solid #eee;border-radius:8px;padding:12px}.label{font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#999}.value{font-family:'Bebas Neue';font-size:23px}.sec{margin-bottom:22px}.sec-title{background:#111;color:#fff;font-family:'Bebas Neue';font-size:16px;padding:8px 10px;border-radius:4px 4px 0 0}.result{border:2px solid ${resPos?'#2e7d32':'#D32F2F'};border-radius:8px;padding:16px 18px;display:flex;justify-content:space-between;align-items:center;background:${resPos?'rgba(46,125,50,.05)':'rgba(211,47,47,.05)'}}.btn{display:block;margin:0 auto 18px;padding:10px 24px;background:#D32F2F;color:#fff;border:0;border-radius:6px;font-weight:700}@media print{body{padding:14px}.no-print{display:none}}</style></head><body><button class="btn no-print" onclick="window.print()">🖨️ Imprimir / Salvar PDF</button><div class="header"><div><div class="logo">studio <span>FB</span></div><div style="font-size:10px;color:#999;letter-spacing:3px;text-transform:uppercase">Saúde &amp; Movimento</div></div><div style="text-align:right"><div class="title">Resumo Financeiro</div><div>${MESES_NOMES[finMes]} de ${finAno}</div><div style="font-size:11px;color:#999">Emitido em ${dataImpressao} · Visão: ${financeiroModo==='competencia'?'Competência':'Caixa'}</div></div></div><div class="cards"><div class="card"><div class="label">Receita</div><div class="value" style="color:#2e7d32">${fmtValor(receita)}</div><div style="font-size:11px;color:#777">Comp. ${fmtValor(receitaComp)} · Caixa ${fmtValor(receitaCx)}</div></div><div class="card"><div class="label">Despesas</div><div class="value" style="color:#D32F2F">${fmtValor(totDesp)}</div><div style="font-size:11px;color:#777">Impostos incluídos</div></div><div class="card"><div class="label">Resultado</div><div class="value" style="color:${resPos?'#2e7d32':'#D32F2F'}">${resPos?'':'-'}${fmtValor(Math.abs(resultado))}</div></div></div><div class="sec"><div class="sec-title">Receita — ${financeiroModo==='competencia'?'Competência':'Caixa'}</div><table><thead><tr><th>Descrição</th><th style="text-align:right">Valor</th></tr></thead><tbody>${linhasReceita||'<tr><td colspan="2">Nenhuma receita.</td></tr>'}</tbody><tfoot><tr><td><strong>Total receita</strong></td><td style="text-align:right;color:#2e7d32"><strong>${fmtValor(receita)}</strong></td></tr></tfoot></table></div><div class="sec"><div class="sec-title">Despesas Discriminadas</div><table><tbody>${linhasDesp}</tbody><tfoot><tr><td><strong>Total despesas</strong></td><td style="text-align:right;color:#D32F2F"><strong>${fmtValor(totDesp)}</strong></td></tr></tfoot></table></div><div class="sec"><div class="sec-title">Taxas de cartão — informativo</div><table><tbody>${linhasTaxa||'<tr><td>Nenhuma taxa de cartão registrada no mês.</td><td style="text-align:right">R$ 0,00</td></tr>'}</tbody><tfoot><tr><td><strong>Total informativo</strong></td><td style="text-align:right;color:#b45309"><strong>${fmtValor(totTaxa)}</strong></td></tr></tfoot></table><div style="font-size:11px;color:#777;margin-top:6px">Essas taxas não entram no total de despesas nem no resultado.</div></div><div class="result"><div><div style="font-family:'Bebas Neue';font-size:18px;color:${resPos?'#2e7d32':'#D32F2F'}">${resPos?'Resultado positivo':'Resultado negativo'}</div><div style="font-size:12px;color:#777">Receita ${fmtValor(receita)} − Despesas ${fmtValor(totDesp)}</div></div><div style="font-family:'Bebas Neue';font-size:28px;color:${resPos?'#2e7d32':'#D32F2F'}">${resPos?'':'-'}${fmtValor(Math.abs(resultado))}</div></div></body></html>`;
  const janela = window.open('', '_blank'); janela.document.write(htmlPrint); janela.document.close();
};
window.imprimirDRE = imprimirDRE;


// ═══════════════════════════════════════════════════
// AJUSTES LGV V8 — MENU CAIXA / CAIXINHAS / PROVISÕES
// V20 — Módulo Pessoal e provisões trabalhistas + manutenção percentual.
// ═══════════════════════════════════════════════════
let cxMes = MES_ATUAL, cxAno = ANO_ATUAL;
let caixaConfig = null;
let caixaMovs = [];
let caixaAjustes = {};
let caixaSelecionada = 'giro';

const CAIXAS_PADRAO = [
  {id:'antecipados', nome:'Pagamento antecipado provisionado', icon:'🔒', tipo:'automatico', pct:0, metaValor:0, metaMeses:0, conta:'', cor:'#92400e', desc:'Dinheiro já recebido, mas pertencente a competências futuras.'},
  {id:'giro', nome:'Caixa de giro', icon:'🔁', tipo:'editavel', pct:20, metaValor:0, metaMeses:0.5, conta:'', cor:'var(--azul)', desc:'Liquidez curta para segurar o funcionamento mensal do estúdio.'},
  {id:'reserva', nome:'Reserva de emergência', icon:'🛡️', tipo:'editavel', pct:30, metaValor:0, metaMeses:6, conta:'', cor:'var(--verde)', desc:'Proteção para queda de receita, emergência ou problema relevante.'},
  {id:'manutencao', nome:'Provisão de manutenção', icon:'🧰', tipo:'editavel', pct:15, metaValor:0, metaMeses:3, conta:'', cor:'var(--amarelo)', desc:'Reparos, conservação, pequenos ajustes e manutenções do espaço.'},
  {id:'investimentos', nome:'Investimentos futuros / equipamentos', icon:'🚀', tipo:'editavel', pct:20, metaValor:0, metaMeses:0, conta:'', cor:'var(--roxo)', desc:'Equipamentos, melhorias, mentorias, ampliação e projetos de crescimento.'},
  {id:'lucro', nome:'Distribuição de lucro', icon:'💵', tipo:'editavel', pct:15, metaValor:0, metaMeses:0, conta:'', cor:'var(--texto-mid)', desc:'Valor que pode ser separado para distribuição depois das proteções.'}
];

function idxMesCaixa(mes, ano){ return Number(ano)*12 + Number(mes); }
function chaveMesCaixa(mes, ano){ return `${ano}_${String(mes).padStart(2,'0')}`; }
function mesAnoDeData(dataStr){ const d=dataLocal(dataStr); return d ? {mes:d.getMonth(), ano:d.getFullYear(), idx:idxMesCaixa(d.getMonth(),d.getFullYear())} : null; }
function nomeMesAno(mes, ano){ return `${MESES_NOMES[mes]} ${ano}`; }
function caixaById(id){ return (caixaConfig?.caixas||CAIXAS_PADRAO).find(c=>c.id===id) || CAIXAS_PADRAO.find(c=>c.id===id) || {id,nome:id,icon:'📦',pct:0}; }
function caixasEditaveis(){ return (caixaConfig?.caixas||CAIXAS_PADRAO).filter(c=>c.tipo!=='automatico'); }
function caixaIds(){ return (caixaConfig?.caixas||CAIXAS_PADRAO).map(c=>c.id); }
function totalPctCaixas(){ return caixasEditaveis().reduce((s,c)=>s+Number(c.pct||0),0); }

function contaCaixaNome(c){ return (c && c.conta && String(c.conta).trim()) ? String(c.conta).trim() : 'Conta não informada'; }
function isDespManutencao(d){ const s = String(d?.desc||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''); return ['manutencao','reposicao','reparo','conserto','pintura','ajuste','reforma'].some(k=>s.includes(k)); }
function totalManutencaoCats(cats){ return Object.entries(cats||{}).reduce((acc,[cat,lista])=>acc+(lista||[]).filter(d=>cat==='despesa_op' && isDespManutencao(d)).reduce((s,d)=>s+Number(d.valor||0),0),0); }
function dataMesIter(mes, ano, delta){ const d=new Date(ano,mes,1); d.setMonth(d.getMonth()+delta); return {mes:d.getMonth(), ano:d.getFullYear()}; }
async function carregarDespesasSomenteLeitura(mes, ano){
  try { const snap = await getDoc(doc(db,'despesas',chaveDesp(mes,ano))); return snap.exists() ? snap.data().cats : null; }
  catch(e){ return null; }
}
async function inteligenciaMetasCaixa(mes, ano, catsAtual){
  const registros=[];
  for(let i=-11;i<=0;i++){
    const d=dataMesIter(mes,ano,i);
    let cats = (d.mes===mes && d.ano===ano) ? catsAtual : await carregarDespesasSomenteLeitura(d.mes,d.ano);
    if(cats){ registros.push({mes:d.mes,ano:d.ano,total:totalDesp(cats),manutencao:totalManutencaoCats(cats)}); }
  }
  if(!registros.length && catsAtual) registros.push({mes,ano,total:totalDesp(catsAtual),manutencao:totalManutencaoCats(catsAtual)});
  const mediaDesp = registros.length ? registros.reduce((s,r)=>s+r.total,0)/registros.length : 0;
  const mediaManut = registros.length ? registros.reduce((s,r)=>s+r.manutencao,0)/registros.length : 0;
  const manutMes = totalManutencaoCats(catsAtual||{});
  const manutProvisionar = Math.max(0, mediaManut - manutMes);
  const manutUsoEstimado = Math.max(0, manutMes - mediaManut);
  return {mesesBase:registros.length, mediaDesp, mediaManut, manutMes, manutProvisionar, manutUsoEstimado};
}
function metaCaixaDinamica(c, resumo){
  const intel = resumo?.intel || {};
  if(c.id==='giro') return Math.max(Number(c.metaValor||0), Number(intel.mediaDesp||0)*0.5);
  if(c.id==='reserva') return Math.max(Number(c.metaValor||0), Number(intel.mediaDesp||0)*6);
  if(c.id==='manutencao') return Math.max(Number(c.metaValor||0), Number(intel.mediaManut||0)*3);
  if(Number(c.metaMeses||0)>0) return Math.max(Number(c.metaValor||0), Number(c.metaMeses||0)*Number(intel.mediaDesp||0));
  return Number(c.metaValor||0);
}
function sugestaoCaixaDinamica(c, resumo){
  // Todas as caixinhas editáveis, inclusive manutenção, usam o percentual configurado.
  return Math.max(0, Number(resumo?.base||0) * Number(c.pct||0) / 100);
}
function resumoPorContasCaixa(resumo){
  const mapa = {};
  (caixaConfig?.caixas||CAIXAS_PADRAO).forEach(c=>{
    const conta = contaCaixaNome(c);
    const valor = c.tipo==='automatico' ? Number(resumo?.prov?.saldoAtual||0) : saldoCaixaManual(c.id,cxMes,cxAno);
    if(!mapa[conta]) mapa[conta]={total:0,itens:[]};
    mapa[conta].total += valor;
    mapa[conta].itens.push({nome:c.nome, icon:c.icon, valor});
  });
  return mapa;
}

async function carregarCaixaConfig(){
  try {
    const snap = await getDoc(doc(db,'config','caixa'));
    if (snap.exists()) {
      const cfg = snap.data();
      const existentes = cfg.caixas || [];
      const mescladas = CAIXAS_PADRAO.map(p=>({...p, ...(existentes.find(x=>x.id===p.id)||{})}));
      caixaConfig = {...cfg, caixas:mescladas};
    } else {
      caixaConfig = {caixas:JSON.parse(JSON.stringify(CAIXAS_PADRAO)), criadoEm:new Date().toISOString()};
      await setDoc(doc(db,'config','caixa'), caixaConfig);
    }
  } catch(e) {
    console.warn('Erro ao carregar configuração de caixa', e);
    caixaConfig = {caixas:JSON.parse(JSON.stringify(CAIXAS_PADRAO))};
  }
  return caixaConfig;
}
async function salvarCaixaConfig(){
  if(!caixaConfig) await carregarCaixaConfig();
  caixaConfig.atualizadoEm = new Date().toISOString();
  await setDoc(doc(db,'config','caixa'), caixaConfig);
}
async function carregarMovCaixa(force=false){
  if (caixaMovs.length && !force) return caixaMovs;
  try {
    const snap = await getDocs(collection(db,'caixa_movimentacoes'));
    caixaMovs = snap.docs.map(d=>({id:d.id,...d.data()}));
  } catch(e) { caixaMovs = []; console.warn('Erro ao carregar movimentações de caixa', e); }
  return caixaMovs;
}
async function carregarAjustesCaixa(force=false){
  if (Object.keys(caixaAjustes).length && !force) return caixaAjustes;
  try {
    const snap = await getDocs(collection(db,'caixa_ajustes'));
    caixaAjustes = {};
    snap.docs.forEach(d=>caixaAjustes[d.id] = {id:d.id,...d.data()});
  } catch(e) { caixaAjustes = {}; console.warn('Erro ao carregar ajustes de caixa', e); }
  return caixaAjustes;
}
async function salvarMovCaixa(m){
  caixaMovs = caixaMovs.filter(x=>String(x.id)!==String(m.id)).concat(m);
  await setDoc(doc(db,'caixa_movimentacoes',String(m.id)), m);
}
function movimentosAteMes(mes,ano){ const idx=idxMesCaixa(mes,ano); return caixaMovs.filter(m=>m.status!=='excluido' && mesAnoDeData(m.data)?.idx <= idx); }
function movimentosDoMesCaixa(mes,ano){ const idx=idxMesCaixa(mes,ano); return caixaMovs.filter(m=>m.status!=='excluido' && mesAnoDeData(m.data)?.idx === idx).sort((a,b)=>new Date(b.data)-new Date(a.data)); }
function valorMovParaCaixa(m, caixaId){
  const v = Number(m.valor||0);
  const tipo = m.tipo || 'entrada_manual';
  if (tipo==='transferencia') return (m.destino===caixaId?v:0) - (m.origem===caixaId?v:0);
  if (['saida_emergencial','investimento','distribuicao_lucro','saida_manual'].includes(tipo)) return (m.origem===caixaId || m.caixaId===caixaId) ? -v : 0;
  return (m.destino===caixaId || m.caixaId===caixaId) ? v : 0;
}
function saldoCaixaManual(caixaId, mes=cxMes, ano=cxAno){ return movimentosAteMes(mes,ano).reduce((s,m)=>s+valorMovParaCaixa(m,caixaId),0); }
function movimentosCaixaSelecionada(caixaId, mes=cxMes, ano=cxAno){ return movimentosDoMesCaixa(mes,ano).filter(m=>valorMovParaCaixa(m,caixaId)!==0); }

function qtdMesesCompetenciaAte(c, mes, ano){ const idx=idxMesCaixa(mes,ano); return mesesCompetenciaContrato(c).filter(x=>idxMesCaixa(x.mes,x.ano)<=idx).length; }
function qtdMesesCompetenciaAntes(c, mes, ano){ const idx=idxMesCaixa(mes,ano); return mesesCompetenciaContrato(c).filter(x=>idxMesCaixa(x.mes,x.ano)<idx).length; }
function totalPagoContratoAte(c, mes, ano){
  const fim = dataMesFim(mes,ano);
  return pagamentosDoContrato(c.id).filter(p=>p.data && dataLocal(p.data) <= fim).reduce((s,p)=>s+Number(p.valor||0),0);
}
function totalPagoContratoAntesMes(c, mes, ano){
  const ini = dataMesInicio(mes,ano);
  return pagamentosDoContrato(c.id).filter(p=>p.data && dataLocal(p.data) < ini).reduce((s,p)=>s+Number(p.valor||0),0);
}
function saldoAntecipadoContratoFimMes(c, mes, ano){
  if(!c || c.status==='excluido') return 0;
  const pagoAte = Math.min(valorContrato(c), totalPagoContratoAte(c,mes,ano));
  if (pagoAte <= 0) return 0;
  const reconhecidoAte = Math.min(valorContrato(c), mensalidadeContrato(c) * qtdMesesCompetenciaAte(c,mes,ano));
  return Math.max(0, pagoAte - reconhecidoAte);
}
function saldoAntecipadoFimMes(mes, ano){ return contratos.filter(c=>c.status!=='excluido').reduce((s,c)=>s+saldoAntecipadoContratoFimMes(c,mes,ano),0); }
function mesAnteriorCaixa(mes,ano){ const d=new Date(ano,mes,1); d.setMonth(d.getMonth()-1); return {mes:d.getMonth(), ano:d.getFullYear()}; }
function liberacaoProvisionadaMes(mes, ano){
  return contratos.filter(c=>contratoContaCompetenciaMes(c,mes,ano)).reduce((s,c)=>{
    const pagoAntes = totalPagoContratoAntesMes(c,mes,ano);
    const reconhecidoAntes = Math.min(valorContrato(c), mensalidadeContrato(c)*qtdMesesCompetenciaAntes(c,mes,ano));
    return s + Math.max(0, Math.min(mensalidadeContrato(c), pagoAntes - reconhecidoAntes));
  },0);
}
function resumoProvisaoAntecipados(mes=cxMes, ano=cxAno){
  const ant = mesAnteriorCaixa(mes,ano);
  const saldoAtual = saldoAntecipadoFimMes(mes,ano);
  const saldoAnterior = saldoAntecipadoFimMes(ant.mes,ant.ano);
  const liberado = liberacaoProvisionadaMes(mes,ano);
  const novo = Math.max(0, saldoAtual - saldoAnterior + liberado);
  return {saldoAtual, saldoAnterior, liberado, novo};
}

async function resumoCaixaMes(mes=cxMes, ano=cxAno){
  const cats = await loadDespesas(mes,ano);
  const desp = totalDesp(cats);
  const recComp = receitaMesEsp(mes,ano);
  const recCx = receitaCaixaMes(mes,ano);
  const resComp = recComp - desp;
  const resCx = recCx - desp;
  const chave = chaveMesCaixa(mes,ano);
  const ajuste = caixaAjustes[chave] || null;
  const baseAuto = Math.max(0,resComp);
  const base = ajuste && ajuste.valorBaseManual !== undefined && ajuste.valorBaseManual !== '' ? Math.max(0,Number(ajuste.valorBaseManual||0)) : baseAuto;
  const prov = resumoProvisaoAntecipados(mes,ano);
  const intel = await inteligenciaMetasCaixa(mes, ano, cats);
  return {desp, recComp, recCx, resComp, resCx, baseAuto, base, ajuste, prov, intel};
}
function metaCaixa(c, despMes){ return Number(c.metaMeses||0)>0 ? Number(c.metaMeses||0)*Number(despMes||0) : Number(c.metaValor||0); }
function sugestaoCaixa(c, base){ return Math.max(0, Number(base||0) * Number(c.pct||0) / 100); }
function labelTipoMov(t){ return ({entrada_manual:'Entrada manual',saida_emergencial:'Saída emergencial',investimento:'Investimento/melhoria',transferencia:'Transferência',distribuicao_lucro:'Distribuição de lucro',ajuste_saldo:'Ajuste de saldo',sugestao_auto:'Sugestão automática'})[t] || t || 'Movimentação'; }
function labelCaixa(id){ const c=caixaById(id); return `${c.icon||'📦'} ${c.nome||id}`; }

function ensureCaixaMenu(){
  const nav = document.querySelector('.nav'); if(!nav) return;
  const labels = [['dashboard','Dashboard'],['alunos','Alunos'],['despesas','Despesas'],['financeiro','Financeiro'],['agenda','Agenda'],['auditoria','Auditoria']];
  document.querySelectorAll('.nav .nav-item').forEach(el=>{
    const txt = (el.textContent||'').trim();
    const item = labels.find(x=>txt.includes(x[1]));
    if(item && !el.dataset.view) el.dataset.view = item[0];
  });
  if(!nav.querySelector('[data-view="caixa"]')){
    const el = document.createElement('div');
    el.className = 'nav-item'; el.dataset.view='caixa';
    el.innerHTML = '<span class="nav-icon">🏦</span> Caixa';
    el.onclick = () => setView('caixa');
    const fin = nav.querySelector('[data-view="financeiro"]');
    if(fin && fin.nextSibling) nav.insertBefore(el, fin.nextSibling); else nav.appendChild(el);
  }
}

setView = function(v){
  ensureCaixaMenu();
  viewAtual = v; closeSidebar();
  document.querySelectorAll('.nav-item').forEach(el=>el.classList.toggle('active', el.dataset.view===v));
  const titulos = {dashboard:'Dashboard',alunos:'Alunos',despesas:'Despesas',financeiro:'Financeiro',caixa:'Caixa',agenda:'Agenda de Turmas',auditoria:'Trilha de Auditoria'};
  document.getElementById('page-title').textContent = titulos[v] || 'Dashboard';
  document.getElementById('topbar-right').innerHTML = v==='caixa'
    ? `<button class="btn btn-ghost" onclick="abrirConfigCaixas()">⚙️ Configurar</button><button class="btn btn-primary" onclick="abrirModalMovCaixa()">+ Movimentação</button>`
    : (v==='alunos'||v==='dashboard') ? `<button class="btn btn-primary" onclick="openModalAluno()">+ Novo Aluno</button>` : '';
  render();
};
window.setView = setView;

render = function(){
  ensureCaixaMenu();
  if(viewAtual==='dashboard') renderDashboard();
  else if(viewAtual==='alunos') renderAlunos();
  else if(viewAtual==='despesas') renderDespesasView();
  else if(viewAtual==='financeiro') renderFinanceiroView();
  else if(viewAtual==='caixa') renderCaixaView();
  else if(viewAtual==='agenda') renderAgendaView();
  else if(viewAtual==='auditoria') renderAuditoriaView();
};
window.render = render;

async function renderCaixaView(){
  loading(true);
  ensureCaixaMenu();
  await carregarCaixaConfig(); await carregarMovCaixa(); await carregarAjustesCaixa();
  const resumo = await resumoCaixaMes(cxMes,cxAno);
  const caixas = caixaConfig.caixas || CAIXAS_PADRAO;
  if(!caixaSelecionada) caixaSelecionada = 'giro';
  const totalManual = caixas.filter(c=>c.tipo!=='automatico').reduce((s,c)=>s+saldoCaixaManual(c.id,cxMes,cxAno),0);
  const totalGeral = totalManual + resumo.prov.saldoAtual;
  const pctTotal = totalPctCaixas();
  const caixaCards = caixas.map(c=>{
    const auto = c.tipo==='automatico';
    const saldo = auto ? resumo.prov.saldoAtual : saldoCaixaManual(c.id,cxMes,cxAno);
    const meta = auto ? 0 : metaCaixaDinamica(c,resumo);
    const sugestao = auto ? 0 : sugestaoCaixaDinamica(c,resumo);
    const progresso = meta>0 ? Math.min(100, Math.round(saldo/meta*100)) : 0;
    const selected = caixaSelecionada===c.id;
    return `<div class="card" style="cursor:pointer;border-top:3px solid ${c.cor||'var(--texto-mid)'};${selected?'box-shadow:0 0 0 2px rgba(211,47,47,.16), var(--shadow-md)':''}" onclick="abrirCaixaPerfil('${c.id}')">
      <div class="card-label">${esc(c.nome)}</div>
      <div class="card-value" style="font-size:24px;padding-top:4px;color:${c.cor||'var(--texto)'}">${fmtValor(saldo)}</div>
      <div class="card-sub">${auto?`Automático · liberou ${fmtValor(resumo.prov.liberado)} no mês`:`Sug.: ${fmtValor(sugestao)} · ${Number(c.pct||0)}%`}</div>
      <div style="font-size:10px;color:var(--texto-muted);margin-top:5px">📍 ${esc(contaCaixaNome(c))}</div>${!auto&&meta>0?`<div style="margin-top:10px"><div style="height:6px;background:var(--borda);border-radius:4px;overflow:hidden"><div style="height:100%;width:${progresso}%;background:${c.cor||'var(--vermelho)'}"></div></div><div style="font-size:10px;color:var(--texto-muted);margin-top:4px">Meta: ${fmtValor(meta)} · ${progresso}%</div></div>`:''}
      <div class="card-icon">${c.icon||'📦'}</div>
    </div>`;
  }).join('');
  const selecionada = caixaById(caixaSelecionada);
  const perfil = renderPerfilCaixaHtml(selecionada, resumo);
  const alertaPct = pctTotal!==100 ? `<div class="alert-bar atencao"><span class="alert-icon">⚙️</span><strong>Percentuais somam ${pctTotal}%.</strong>&nbsp;Ajuste em Configurar para fechar 100%, se quiser uma distribuição completa.</div>` : '';
  document.getElementById('content').innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:12px">
      <div class="mes-selector"><button class="mes-btn" onclick="navegarCaixa(-1)">◀</button><div class="mes-label">${nomeMesAno(cxMes,cxAno)}</div><button class="mes-btn" onclick="navegarCaixa(1)">▶</button></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-ghost btn-sm" onclick="editarValorBaseCaixa()">✏️ Editar valor base</button><button class="btn btn-success btn-sm" onclick="aplicarSugestaoCaixa()">Aplicar sugestão</button><button class="btn btn-ghost btn-sm" onclick="desfazerSugestaoCaixa()">Desfazer sugestão</button><button class="btn btn-primary btn-sm" onclick="abrirModalMovCaixa()">+ Movimentação</button><button class="btn btn-ghost btn-sm" onclick="abrirConfigCaixas()">Configurar</button></div>
    </div>
    <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:12px 16px;font-size:13px;margin-bottom:16px"><strong>Menu Caixa.</strong> O resultado por competência orienta a distribuição. Pagamentos antecipados são provisionados automaticamente e liberados mês a mês conforme viram competência.</div>
    ${alertaPct}
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px;margin-bottom:22px">
      <div class="card c-green" style="border-top:3px solid var(--verde)"><div class="card-label">Resultado competência</div><div class="card-value" style="font-size:24px;padding-top:4px;color:${resumo.resComp>=0?'var(--verde)':'var(--vermelho)'}">${resumo.resComp>=0?'':'-'}${fmtValor(Math.abs(resumo.resComp))}</div><div class="card-sub">Receita ${fmtValor(resumo.recComp)} − despesas ${fmtValor(resumo.desp)}</div></div>
      <div class="card" style="border-top:3px solid var(--azul)"><div class="card-label">Resultado de caixa</div><div class="card-value" style="font-size:24px;padding-top:4px;color:${resumo.resCx>=0?'var(--verde)':'var(--vermelho)'}">${resumo.resCx>=0?'':'-'}${fmtValor(Math.abs(resumo.resCx))}</div><div class="card-sub">Entradas líquidas ${fmtValor(resumo.recCx)} − despesas</div></div>
      <div class="card" style="border-top:3px solid #92400e"><div class="card-label">Antecipado provisionado</div><div class="card-value" style="font-size:24px;padding-top:4px;color:#92400e">${fmtValor(resumo.prov.saldoAtual)}</div><div class="card-sub">Novo: ${fmtValor(resumo.prov.novo)} · Liberado: ${fmtValor(resumo.prov.liberado)}</div></div>
      <div class="card" style="border-top:3px solid var(--roxo)"><div class="card-label">Base da sugestão</div><div class="card-value" style="font-size:24px;padding-top:4px;color:var(--roxo)">${fmtValor(resumo.base)}</div><div class="card-sub">${resumo.ajuste?'manual':'automática'} · saldos em caixas: ${fmtValor(totalGeral)}</div></div>
    </div>
    <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--texto-muted);margin-bottom:10px">Caixinhas</div>
    <div class="cards-grid" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr));margin-bottom:22px">${caixaCards}</div>
    ${renderResumoContasHtml(resumo)}
    <div style="background:#f8fafc;border:1px solid var(--borda);border-radius:8px;padding:12px 16px;font-size:12px;color:var(--texto-muted);margin-bottom:16px">Metas técnicas: giro = 50% da média de despesas; reserva = 6 meses da média de despesas; manutenção = média de manutenção × 3. A sugestão mensal de todas as caixinhas editáveis segue o percentual configurado. Base histórica usada nas metas: ${resumo.intel.mesesBase} mês(es).</div>
    ${perfil}`;
}
window.renderCaixaView = renderCaixaView;


function renderResumoContasHtml(resumo){
  const mapa = resumoPorContasCaixa(resumo);
  const linhas = Object.entries(mapa).map(([conta,d])=>`<div style="border:1px solid var(--borda);border-radius:8px;padding:12px;background:#fff"><div style="display:flex;justify-content:space-between;gap:10px"><strong>${esc(conta)}</strong><strong>${fmtValor(d.total)}</strong></div><div style="margin-top:8px;font-size:11px;color:var(--texto-muted)">${d.itens.map(i=>`${i.icon||'📦'} ${esc(i.nome)}: <strong>${fmtValor(i.valor)}</strong>`).join(' · ')}</div></div>`).join('');
  return `<div class="section-box" style="margin-bottom:18px"><div class="section-header"><div><div class="section-title">Resumo por conta/local</div><div style="font-size:12px;color:var(--texto-muted)">Mostra onde está cada caixinha. Pode haver mais de uma caixinha na mesma conta.</div></div></div><div style="padding:16px 24px;display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px">${linhas||'<div style="color:var(--texto-muted)">Nenhuma conta informada.</div>'}</div></div>`;
}

function renderPerfilCaixaHtml(c, resumo){
  const auto = c.tipo==='automatico';
  const saldo = auto ? resumo.prov.saldoAtual : saldoCaixaManual(c.id,cxMes,cxAno);
  const meta = auto ? 0 : metaCaixaDinamica(c,resumo);
  const sugestao = auto ? 0 : sugestaoCaixaDinamica(c,resumo);
  const movimentos = auto ? [] : movimentosCaixaSelecionada(c.id,cxMes,cxAno);
  const rows = auto ? renderAntecipadosRows() : movimentos.map(m=>{
    const v = valorMovParaCaixa(m,c.id);
    return `<tr><td>${fmtData(m.data)}</td><td><strong>${esc(labelTipoMov(m.tipo))}</strong><div style="font-size:11px;color:var(--texto-muted)">${esc(m.descricao||'—')}${m.origem||m.destino?` · ${m.origem?`Origem: ${esc(caixaById(m.origem).nome||m.origem)}`:''}${m.destino?` · Destino: ${esc(caixaById(m.destino).nome||m.destino)}`:''}`:''}</div></td><td style="font-weight:700;color:${v>=0?'var(--verde)':'var(--vermelho)'}">${v>=0?'+':'-'}${fmtValor(Math.abs(v))}</td><td><button class="desp-btn" title="Editar" onclick="abrirModalMovCaixa('${c.id}','${m.id}')">✏️</button><button class="desp-btn" title="Excluir" onclick="excluirMovCaixa('${m.id}')">🗑</button></td></tr>`;
  }).join('');
  return `<div class="section-box"><div class="section-header"><div><div class="section-title">${c.icon||'📦'} ${esc(c.nome)}</div><div style="font-size:12px;color:var(--texto-muted);max-width:720px">${esc(c.desc||'')}</div><div style="font-size:11px;color:var(--texto-muted);margin-top:4px">📍 Conta/local: <strong>${esc(contaCaixaNome(c))}</strong></div>${auto?'<div style="margin-top:8px;background:#fffbeb;border:1px solid #fde68a;border-radius:6px;padding:8px 10px;font-size:12px;color:#92400e"><strong>Por que não mexer?</strong> Este dinheiro já entrou no caixa, mas pertence a meses futuros. Ele é liberado automaticamente conforme vira competência do mês.</div>':''}</div><div style="display:flex;gap:8px;flex-wrap:wrap">${!auto?`<button class="btn btn-ghost btn-sm" onclick="abrirConfigCaixas('${c.id}')">Editar meta/%/conta</button><button class="btn btn-primary btn-sm" onclick="abrirModalMovCaixa('${c.id}')">+ Movimento</button>`:`<button class="btn btn-ghost btn-sm" onclick="abrirConfigCaixas('${c.id}')">Editar conta/local</button>`}</div></div>
    <div style="padding:16px 24px;display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:14px;border-bottom:1px solid var(--borda)">
      <div><div class="card-label">Saldo atual</div><div style="font-family:'Bebas Neue';font-size:26px;color:${c.cor||'var(--texto)'}">${fmtValor(saldo)}</div></div>
      ${!auto?`<div><div class="card-label">Sugestão do mês</div><div style="font-family:'Bebas Neue';font-size:26px;color:var(--verde)">${fmtValor(sugestao)}</div><div style="font-size:11px;color:var(--texto-muted)">${Number(c.pct||0)}% da base</div></div><div><div class="card-label">Meta</div><div style="font-family:'Bebas Neue';font-size:26px">${meta>0?fmtValor(meta):'—'}</div><div style="font-size:11px;color:var(--texto-muted)">${Number(c.metaMeses||0)>0?`${c.metaMeses} mês(es) de despesas`:'valor livre/editável'}</div></div>`:`<div><div class="card-label">Novo provisionado</div><div style="font-family:'Bebas Neue';font-size:26px;color:#92400e">${fmtValor(resumo.prov.novo)}</div></div><div><div class="card-label">Liberado no mês</div><div style="font-family:'Bebas Neue';font-size:26px;color:var(--verde)">${fmtValor(resumo.prov.liberado)}</div></div>`}
    </div>
    <div class="table-wrap"><table><thead><tr>${auto?'<th>Aluno</th><th>Contrato</th><th>Provisionado futuro</th>':'<th>Data</th><th>Movimentação</th><th>Valor</th><th>Ações</th>'}</tr></thead><tbody>${rows || `<tr><td colspan="4" style="color:var(--texto-muted);padding:22px;text-align:center">Nenhum registro neste mês.</td></tr>`}</tbody></table></div></div>`;
}
function renderAntecipadosRows(){
  return contratos.filter(c=>saldoAntecipadoContratoFimMes(c,cxMes,cxAno)>0).sort((a,b)=>saldoAntecipadoContratoFimMes(b,cxMes,cxAno)-saldoAntecipadoContratoFimMes(a,cxMes,cxAno)).map(c=>`<tr><td><strong>${esc(c.alunoNome||'—')}</strong></td><td>${esc(nomeContrato(c))}<div style="font-size:11px;color:var(--texto-muted)">${fmtData(c.inicio)} → ${fmtData(vencAjustadoContrato(c))} · mensalidade ${fmtValor(mensalidadeContrato(c))}</div></td><td style="font-weight:700;color:#92400e">${fmtValor(saldoAntecipadoContratoFimMes(c,cxMes,cxAno))}</td></tr>`).join('');
}

window.navegarCaixa = function(delta){ cxMes += delta; if(cxMes<0){cxMes=11;cxAno--;} if(cxMes>11){cxMes=0;cxAno++;} renderCaixaView(); };
window.abrirCaixaPerfil = function(id){ caixaSelecionada = id; renderCaixaView(); };

window.editarValorBaseCaixa = async function(){
  const resumo = await resumoCaixaMes(cxMes,cxAno);
  const atual = resumo.ajuste?.valorBaseManual ?? resumo.baseAuto;
  const valor = prompt(`Valor base para sugestão em ${nomeMesAno(cxMes,cxAno)}:`, String(Number(atual||0).toFixed(2)));
  if(valor===null) return;
  const n = Number(String(valor).replace(',','.'));
  if(isNaN(n) || n<0){ toast('Valor inválido.'); return; }
  const chave = chaveMesCaixa(cxMes,cxAno);
  const reg = {id:chave, mes:cxMes, ano:cxAno, valorBaseManual:n, atualizadoEm:new Date().toISOString()};
  caixaAjustes[chave]=reg;
  await setDoc(doc(db,'caixa_ajustes',chave), reg);
  toast('Valor base ajustado ✓'); renderCaixaView();
};

window.abrirConfigCaixas = async function(focoId=null){
  await carregarCaixaConfig();
  const resumo = await resumoCaixaMes(cxMes,cxAno);
  const linhas = caixaConfig.caixas.map(c=>`<div style="border:1px solid var(--borda);border-radius:8px;padding:12px;margin-bottom:10px;background:${focoId===c.id?'#fff7ed':'#fff'}"><div style="font-weight:700;margin-bottom:8px">${c.icon||'📦'} ${esc(c.nome)}</div><div class="form-grid"><div class="form-group full"><label class="form-label">Conta/local</label><input class="form-input" type="text" id="cfg-conta-${c.id}" value="${esc(contaCaixaNome(c)==='Conta não informada'?'':contaCaixaNome(c))}" placeholder="Ex: Itaú, Banco do Brasil, Fintech Pay..."></div>${c.tipo==='automatico'?`<div class="form-group full"><div class="form-hint">Caixinha automática: o saldo vem dos pagamentos antecipados provisionados. Só a conta/local é editável.</div></div>`:`<div class="form-group"><label class="form-label">% da sugestão</label><input class="form-input" type="number" step="0.01" id="cfg-pct-${c.id}" value="${Number(c.pct||0)}"></div><div class="form-group"><label class="form-label">Meta fixa (R$)</label><input class="form-input" type="number" step="0.01" id="cfg-meta-${c.id}" value="${Number(c.metaValor||0)}"></div><div class="form-group full"><label class="form-label">Meta em meses de despesas</label><input class="form-input" type="number" step="0.1" id="cfg-meses-${c.id}" value="${Number(c.metaMeses||0)}"><div class="form-hint">Meta técnica atual: ${fmtValor(metaCaixaDinamica(c,resumo))}. A técnica usa histórico de até 12 meses; metas fixas continuam editáveis.</div></div>`}</div></div>`).join('');
  const html = `<div style="position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:460;display:flex;align-items:center;justify-content:center;padding:16px" id="modal-config-caixa"><div style="background:#fff;border-radius:12px;width:100%;max-width:720px;max-height:88vh;overflow-y:auto;box-shadow:var(--shadow-lg)"><div style="padding:20px 24px;border-bottom:1px solid var(--borda);display:flex;justify-content:space-between;align-items:center"><div><div style="font-family:'Bebas Neue';font-size:22px">Configurar Caixinhas</div><div style="font-size:12px;color:var(--texto-muted)">Percentuais e metas são editáveis. Pagamento antecipado é automático.</div></div><button class="modal-close" onclick="document.getElementById('modal-config-caixa').remove()">✕</button></div><div style="padding:18px 24px">${linhas}<div style="font-size:12px;color:var(--texto-muted);margin-top:8px">Soma atual dos percentuais: <strong>${totalPctCaixas()}%</strong></div></div><div class="modal-footer"><button class="btn btn-ghost" onclick="document.getElementById('modal-config-caixa').remove()">Cancelar</button><button class="btn btn-primary" onclick="confirmarConfigCaixas()">Salvar</button></div></div></div>`;
  document.body.insertAdjacentHTML('beforeend', html);
};
window.confirmarConfigCaixas = async function(){
  caixaConfig.caixas = caixaConfig.caixas.map(c=>{
    const conta = document.getElementById(`cfg-conta-${c.id}`)?.value?.trim() || '';
    if(c.tipo==='automatico') return {...c, conta};
    return {...c, conta, pct:Number(document.getElementById(`cfg-pct-${c.id}`).value||0), metaValor:Number(document.getElementById(`cfg-meta-${c.id}`).value||0), metaMeses:Number(document.getElementById(`cfg-meses-${c.id}`).value||0)};
  });
  await salvarCaixaConfig();
  document.getElementById('modal-config-caixa')?.remove();
  toast('Configuração das caixas salva ✓'); renderCaixaView();
};

window.abrirModalMovCaixa = async function(defaultCaixa=null, movId=null){
  await carregarCaixaConfig(); await carregarMovCaixa();
  const mov = movId ? caixaMovs.find(x=>String(x.id)===String(movId)) : null;
  const idCaixa = defaultCaixa || mov?.caixaId || mov?.origem || mov?.destino || caixaSelecionada || 'giro';
  const optsCaixas = caixasEditaveis().map(c=>`<option value="${c.id}" ${c.id===idCaixa?'selected':''}>${esc(c.nome)}</option>`).join('');
  const tipoAtual = mov?.tipo || 'entrada_manual';
  const dataAtual = mov?.data || new Date(cxAno,cxMes,1).toISOString().split('T')[0];
  const valorAtual = mov ? Number(mov.valor||0) : '';
  const descAtual = mov?.descricao || '';
  const parcelasAtual = mov ? 1 : 1;
  const html = `<div style="position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:470;display:flex;align-items:center;justify-content:center;padding:16px" id="modal-mov-caixa"><div style="background:#fff;border-radius:12px;width:100%;max-width:520px;box-shadow:var(--shadow-lg)"><div class="modal-header"><div><div class="modal-title">${mov?'Editar':'Movimentação de'} Caixa</div><div style="font-size:12px;color:var(--texto-muted)">Não entra no DRE. Serve para controlar destino do dinheiro.</div></div><button class="modal-close" onclick="document.getElementById('modal-mov-caixa').remove()">✕</button></div><div class="modal-body"><div class="form-grid"><div class="form-group"><label class="form-label">Data</label><input class="form-input" type="date" id="mov-data" value="${dataAtual}"></div><div class="form-group"><label class="form-label">Tipo</label><select class="form-select" id="mov-tipo" onchange="atualizarCamposMovCaixa()"><option value="entrada_manual" ${tipoAtual==='entrada_manual'?'selected':''}>Entrada manual</option><option value="saida_emergencial" ${tipoAtual==='saida_emergencial'?'selected':''}>Saída emergencial</option><option value="investimento" ${tipoAtual==='investimento'?'selected':''}>Investimento/melhoria</option><option value="transferencia" ${tipoAtual==='transferencia'?'selected':''}>Transferência entre caixas</option><option value="distribuicao_lucro" ${tipoAtual==='distribuicao_lucro'?'selected':''}>Distribuição de lucro</option><option value="ajuste_saldo" ${tipoAtual==='ajuste_saldo'?'selected':''}>Ajuste de saldo</option></select></div><div class="form-group" id="mov-origem-wrap"><label class="form-label">Origem</label><select class="form-select" id="mov-origem">${optsCaixas}</select></div><div class="form-group" id="mov-destino-wrap"><label class="form-label">Destino</label><select class="form-select" id="mov-destino">${optsCaixas}</select></div><div class="form-group"><label class="form-label">Valor total (R$)</label><input class="form-input" type="number" step="0.01" id="mov-valor" placeholder="0,00" value="${valorAtual}"></div><div class="form-group"><label class="form-label">Parcelas</label><input class="form-input" type="number" min="1" max="60" id="mov-parcelas" value="${parcelasAtual}" ${mov?'disabled':''}><div class="form-hint">${mov?'Edição altera só esta movimentação.':'Para investimento parcelado, informe o total e o número de parcelas.'}</div></div><div class="form-group full"><label class="form-label">Descrição</label><input class="form-input" id="mov-desc" placeholder="Ex: compra de equipamento, saída emergencial, transferência..." value="${esc(descAtual)}"></div></div></div><div class="modal-footer"><button class="btn btn-ghost" onclick="document.getElementById('modal-mov-caixa').remove()">Cancelar</button><button class="btn btn-primary" onclick="confirmarMovCaixa('${movId||''}')">Salvar</button></div></div></div>`;
  document.body.insertAdjacentHTML('beforeend', html);
  if(mov?.origem) document.getElementById('mov-origem').value = mov.origem;
  if(mov?.destino) document.getElementById('mov-destino').value = mov.destino;
  atualizarCamposMovCaixa();
};
window.atualizarCamposMovCaixa = function(){
  const tipo = document.getElementById('mov-tipo')?.value;
  const origem = document.getElementById('mov-origem-wrap'), destino = document.getElementById('mov-destino-wrap');
  if(!origem||!destino) return;
  origem.style.display = ['saida_emergencial','investimento','transferencia','distribuicao_lucro'].includes(tipo) ? '' : 'none';
  destino.style.display = ['entrada_manual','transferencia','ajuste_saldo'].includes(tipo) ? '' : 'none';
  if(tipo==='saida_emergencial') document.getElementById('mov-origem').value='reserva';
  if(tipo==='investimento') document.getElementById('mov-origem').value='investimentos';
  if(tipo==='distribuicao_lucro') document.getElementById('mov-origem').value='lucro';
};
window.confirmarMovCaixa = async function(movId=''){
  const tipo = document.getElementById('mov-tipo').value;
  const data = document.getElementById('mov-data').value;
  const valorTotal = Number(document.getElementById('mov-valor').value||0);
  const parcelas = movId ? 1 : Math.max(1, parseInt(document.getElementById('mov-parcelas').value||'1'));
  const descricao = document.getElementById('mov-desc').value || labelTipoMov(tipo);
  const origem = document.getElementById('mov-origem').value;
  const destino = document.getElementById('mov-destino').value;
  if(!data || valorTotal<=0){ toast('Informe data e valor.'); return; }
  if(tipo==='transferencia' && origem===destino){ toast('Origem e destino precisam ser diferentes.'); return; }
  if(movId){
    const existente = caixaMovs.find(x=>String(x.id)===String(movId));
    if(!existente){ toast('Movimentação não encontrada.'); return; }
    const mov = {...existente, tipo, data, valor:Number(valorTotal.toFixed(2)), origem:['saida_emergencial','investimento','transferencia','distribuicao_lucro'].includes(tipo)?origem:'', destino:['entrada_manual','transferencia','ajuste_saldo'].includes(tipo)?destino:'', caixaId:['entrada_manual','ajuste_saldo'].includes(tipo)?destino:origem, descricao, atualizadoEm:new Date().toISOString()};
    await salvarMovCaixa(mov);
    document.getElementById('modal-mov-caixa')?.remove();
    toast('Movimentação atualizada ✓'); renderCaixaView(); return;
  }
  const valorParcela = valorTotal / parcelas;
  for(let i=0;i<parcelas;i++){
    const d = dataLocal(data); d.setMonth(d.getMonth()+i);
    const id = `cx_${Date.now()}_${i}`;
    const mov = {id,tipo,data:d.toISOString().split('T')[0],valor:Number(valorParcela.toFixed(2)),valorTotal,parcelas,parcela:i+1,origem:['saida_emergencial','investimento','transferencia','distribuicao_lucro'].includes(tipo)?origem:'',destino:['entrada_manual','transferencia','ajuste_saldo'].includes(tipo)?destino:'',caixaId:['entrada_manual','ajuste_saldo'].includes(tipo)?destino:origem,descricao:parcelas>1?`${descricao} (${i+1}/${parcelas})`:descricao,status:'ativo',criadoEm:new Date().toISOString(),ts:Date.now()+i};
    await salvarMovCaixa(mov);
  }
  document.getElementById('modal-mov-caixa')?.remove();
  toast('Movimentação registrada ✓'); renderCaixaView();
};
window.excluirMovCaixa = async function(id){
  const m = caixaMovs.find(x=>String(x.id)===String(id)); if(!m) return;
  if(!confirm('Excluir esta movimentação de caixa?')) return;
  m.status='excluido'; m.excluidoEm=new Date().toISOString();
  await salvarMovCaixa(m); toast('Movimentação excluída ✓'); renderCaixaView();
};

window.aplicarSugestaoCaixa = async function(){
  await carregarCaixaConfig(); await carregarMovCaixa(); await carregarAjustesCaixa();
  const resumo = await resumoCaixaMes(cxMes,cxAno);
  if(resumo.base<=0){ toast('Não há valor livre positivo para distribuir.'); return; }
  const existentes = caixaMovs.filter(m=>m.status!=='excluido' && m.tipo==='sugestao_auto' && m.mes===cxMes && m.ano===cxAno);
  if(existentes.length && !confirm('Já existe sugestão automática aplicada neste mês. Substituir?')) return;
  const batch = writeBatch(db);
  existentes.forEach(m=>{ const novo={...m,status:'excluido',excluidoEm:new Date().toISOString()}; batch.set(doc(db,'caixa_movimentacoes',m.id), novo); caixaMovs = caixaMovs.map(x=>x.id===m.id?novo:x); });
  let count=0;
  caixasEditaveis().forEach((c,idx)=>{
    const valor = sugestaoCaixaDinamica(c,resumo);
    if(valor<=0) return;
    const id = `cx_auto_${chaveMesCaixa(cxMes,cxAno)}_${c.id}_${Date.now()}_${idx}`;
    const mov = {id,tipo:'sugestao_auto',data:new Date(cxAno,cxMes,1).toISOString().split('T')[0],mes:cxMes,ano:cxAno,valor:Number(valor.toFixed(2)),destino:c.id,caixaId:c.id,descricao:`Sugestão automática — ${nomeMesAno(cxMes,cxAno)}`,status:'ativo',criadoEm:new Date().toISOString(),ts:Date.now()+idx};
    batch.set(doc(db,'caixa_movimentacoes',id), mov); caixaMovs.push(mov); count++;
  });
  await batch.commit();
  toast(`${count} alocação(ões) aplicada(s) ✓`); renderCaixaView();
};

window.desfazerSugestaoCaixa = async function(){
  await carregarMovCaixa(true);
  const existentes = caixaMovs.filter(m=>m.status!=='excluido' && m.tipo==='sugestao_auto' && m.mes===cxMes && m.ano===cxAno);
  if(!existentes.length){ toast('Não há sugestão automática aplicada neste mês.'); return; }
  if(!confirm(`Desfazer ${existentes.length} alocação(ões) automáticas de ${nomeMesAno(cxMes,cxAno)}?`)) return;
  const batch = writeBatch(db);
  existentes.forEach(m=>{
    const novo={...m,status:'excluido',excluidoEm:new Date().toISOString()};
    batch.set(doc(db,'caixa_movimentacoes',m.id), novo);
    caixaMovs = caixaMovs.map(x=>x.id===m.id?novo:x);
  });
  await batch.commit();
  toast('Sugestão automática desfeita ✓'); renderCaixaView();
};



// ═══════════════════════════════════════════════════
// AJUSTES LGV V11 — CAIXA: LUCRO, PROVISÃO, VISÃO ANUAL E PERFORMANCE
// ═══════════════════════════════════════════════════
let caixaVisao = 'mensal'; // mensal | anual

function normalizarCaixasV11(){
  const padraoLucro = CAIXAS_PADRAO.find(c=>c.id==='lucro');
  if(padraoLucro){
    padraoLucro.nome = 'Lucros a distribuir';
    padraoLucro.icon = '💵';
    padraoLucro.desc = 'Resultado já separado para decisão do sócio: pode ficar acumulado, ser transferido para uma caixinha ou ser realizado como distribuição de lucro.';
    padraoLucro.conta = padraoLucro.conta || '';
  }
  if(caixaConfig && Array.isArray(caixaConfig.caixas)){
    caixaConfig.caixas = caixaConfig.caixas.map(c=> c.id==='lucro' ? {...c, nome:'Lucros a distribuir', icon:'💵', desc:'Resultado já separado para decisão do sócio: pode ficar acumulado, ser transferido para uma caixinha ou ser realizado como distribuição de lucro.'} : c);
  }
}
const carregarCaixaConfigBaseV11 = carregarCaixaConfig;
carregarCaixaConfig = async function(){
  const cfg = await carregarCaixaConfigBaseV11();
  normalizarCaixasV11();
  return cfg;
};
window.carregarCaixaConfig = carregarCaixaConfig;

function showBusy(msg='Processando...'){
  let el=document.getElementById('busy-overlay-lgv');
  if(!el){
    el=document.createElement('div');
    el.id='busy-overlay-lgv';
    el.style.cssText='position:fixed;inset:0;background:rgba(255,255,255,.72);z-index:900;display:none;align-items:center;justify-content:center;backdrop-filter:blur(2px)';
    el.innerHTML=`<div style="background:#111;color:#fff;border-radius:12px;padding:18px 22px;box-shadow:var(--shadow-lg);display:flex;align-items:center;gap:12px;font-weight:700"><div style="width:22px;height:22px;border:3px solid #444;border-top-color:#D32F2F;border-radius:50%;animation:spin .8s linear infinite"></div><span id="busy-text-lgv">${esc(msg)}</span></div>`;
    document.body.appendChild(el);
  }
  const txt=document.getElementById('busy-text-lgv'); if(txt) txt.textContent=msg;
  el.style.display='flex';
}
function hideBusy(){ const el=document.getElementById('busy-overlay-lgv'); if(el) el.style.display='none'; }
async function busyRun(msg, fn){ try{ showBusy(msg); return await fn(); } finally { hideBusy(); } }

function anosPeriodoOptions(anoAtual){
  const min = Math.min(2024, anoAtual-2, ANO_ATUAL-2);
  const max = Math.max(ANO_ATUAL+3, anoAtual+3);
  let html='';
  for(let a=min;a<=max;a++) html += `<option value="${a}" ${a===anoAtual?'selected':''}>${a}</option>`;
  return html;
}
function seletorMesAnoHtml(ctx, mes, ano){
  const meses = MESES_NOMES.map((m,i)=>`<option value="${i}" ${i===mes?'selected':''}>${m}</option>`).join('');
  return `<div class="mes-selector mes-selector-v11" data-ctx="${ctx}" style="gap:6px;flex-wrap:wrap">
    <button class="mes-btn" onclick="navegarPeriodoV11('${ctx}',-1)">◀</button>
    <select class="filter-select" id="sel-mes-${ctx}" onchange="setPeriodoSelecionado('${ctx}')" style="min-width:120px">${meses}</select>
    <select class="filter-select" id="sel-ano-${ctx}" onchange="setPeriodoSelecionado('${ctx}')" style="min-width:82px">${anosPeriodoOptions(ano)}</select>
    <button class="mes-btn" onclick="navegarPeriodoV11('${ctx}',1)">▶</button>
    <button class="btn btn-ghost btn-sm" onclick="irMesAtualV11('${ctx}')">Hoje</button>
  </div>`;
}
window.setPeriodoSelecionado = function(ctx){
  const m = Number(document.getElementById(`sel-mes-${ctx}`)?.value ?? MES_ATUAL);
  const a = Number(document.getElementById(`sel-ano-${ctx}`)?.value ?? ANO_ATUAL);
  if(ctx==='desp'){ despMes=m; despAno=a; renderDespesasView(); }
  if(ctx==='fin'){ finMes=m; finAno=a; renderFinanceiroView(); }
  if(ctx==='caixa'){ cxMes=m; cxAno=a; renderCaixaView(); }
};
window.navegarPeriodoV11 = function(ctx, delta){
  if(ctx==='desp') navegarDesp(delta);
  if(ctx==='fin') navegarFin(delta);
  if(ctx==='caixa') navegarCaixa(delta);
};
window.irMesAtualV11 = function(ctx){
  if(ctx==='desp'){ despMes=MES_ATUAL; despAno=ANO_ATUAL; renderDespesasView(); }
  if(ctx==='fin'){ finMes=MES_ATUAL; finAno=ANO_ATUAL; renderFinanceiroView(); }
  if(ctx==='caixa'){ cxMes=MES_ATUAL; cxAno=ANO_ATUAL; renderCaixaView(); }
};
function aprimorarSeletoresPeriodo(){
  document.querySelectorAll('.mes-selector').forEach(el=>{
    if(el.classList.contains('mes-selector-v11')) return;
    const html = el.innerHTML || '';
    let ctx = '';
    if(html.includes('navegarDesp')) ctx='desp';
    else if(html.includes('navegarFin')) ctx='fin';
    else if(html.includes('navegarCaixa')) ctx='caixa';
    else return;
    const mes = ctx==='desp'?despMes:ctx==='fin'?finMes:cxMes;
    const ano = ctx==='desp'?despAno:ctx==='fin'?finAno:cxAno;
    el.outerHTML = seletorMesAnoHtml(ctx, mes, ano);
  });
}
const renderDespesasBaseV11 = renderDespesasView;
renderDespesasView = async function(){ await renderDespesasBaseV11(); aprimorarSeletoresPeriodo(); };
window.renderDespesasView = renderDespesasView;
const renderFinanceiroBaseV11 = renderFinanceiroView;
renderFinanceiroView = async function(){ await renderFinanceiroBaseV11(); aprimorarSeletoresPeriodo(); };
window.renderFinanceiroView = renderFinanceiroView;

function saldoAntecipadoTeoricoFimMes(mes, ano){ return contratos.filter(c=>c.status!=='excluido').reduce((s,c)=>s+saldoAntecipadoContratoFimMes(c,mes,ano),0); }
function ajusteImplantacaoProvisionamento(){ return caixaConfig?.provisaoImplantacao || null; }
function idxAjusteProv(a){ return a ? idxMesCaixa(Number(a.mes), Number(a.ano)) : null; }
function saldoAntecipadoGerencialFimMes(mes, ano){
  const teorico = saldoAntecipadoTeoricoFimMes(mes,ano);
  const aj = ajusteImplantacaoProvisionamento();
  if(!aj) return teorico;
  const idxAtual = idxMesCaixa(mes,ano), idxCorte = idxAjusteProv(aj);
  if(idxAtual < idxCorte) return teorico;
  const saldoReal = Number(aj.saldoReal||0);
  let oldCorte = 0, oldAtualEquivalente = 0, novoDepoisCorte = 0;
  contratos.filter(c=>c.status!=='excluido').forEach(c=>{
    const sCorte = saldoAntecipadoContratoFimMes(c, Number(aj.mes), Number(aj.ano));
    const sAtual = saldoAntecipadoContratoFimMes(c, mes, ano);
    oldCorte += sCorte;
    oldAtualEquivalente += Math.min(sAtual, sCorte);
    novoDepoisCorte += Math.max(0, sAtual - sCorte);
  });
  const oldReservadoAtual = oldCorte > 0 ? saldoReal * (oldAtualEquivalente / oldCorte) : 0;
  return Math.max(0, oldReservadoAtual + novoDepoisCorte);
}
resumoProvisaoAntecipados = function(mes=cxMes, ano=cxAno){
  const ant = mesAnteriorCaixa(mes,ano);
  const saldoAtual = saldoAntecipadoGerencialFimMes(mes,ano);
  const saldoAnterior = saldoAntecipadoGerencialFimMes(ant.mes,ant.ano);
  const liberadoTeorico = liberacaoProvisionadaMes(mes,ano);
  const liberado = Math.min(liberadoTeorico, Math.max(0, saldoAnterior));
  const novo = Math.max(0, saldoAtual - saldoAnterior + liberado);
  const teoricoAtual = saldoAntecipadoTeoricoFimMes(mes,ano);
  return {saldoAtual, saldoAnterior, liberado, novo, teoricoAtual, ajuste:ajusteImplantacaoProvisionamento()};
};
window.ajustarProvisaoAntecipada = async function(){
  await carregarCaixaConfig();
  const teorico = saldoAntecipadoTeoricoFimMes(cxMes,cxAno);
  const atual = resumoProvisaoAntecipados(cxMes,cxAno).saldoAtual;
  const valor = prompt(`Saldo real reservado hoje em Pagamento antecipado provisionado (${nomeMesAno(cxMes,cxAno)}).\n\nSaldo teórico do sistema: ${fmtValor(teorico)}\nInforme quanto existe de verdade reservado:`, String(Number(atual||0).toFixed(2)));
  if(valor===null) return;
  const n = Number(String(valor).replace(',','.'));
  if(isNaN(n) || n<0){ toast('Valor inválido.'); return; }
  caixaConfig.provisaoImplantacao = {mes:cxMes, ano:cxAno, saldoReal:Number(n.toFixed(2)), teoricoNoCorte:Number(teorico.toFixed(2)), atualizadoEm:new Date().toISOString()};
  await salvarCaixaConfig();
  toast('Saldo real provisionado ajustado ✓'); renderCaixaView();
};
window.removerAjusteProvisao = async function(){
  await carregarCaixaConfig();
  if(!caixaConfig.provisaoImplantacao){ toast('Não há ajuste manual aplicado.'); return; }
  if(!confirm('Remover ajuste manual do provisionamento e voltar ao saldo teórico?')) return;
  delete caixaConfig.provisaoImplantacao;
  await salvarCaixaConfig();
  toast('Ajuste removido ✓'); renderCaixaView();
};

function renderAntecipadosRowsV11(){
  const prov = resumoProvisaoAntecipados(cxMes,cxAno);
  const ajuste = prov.ajuste;
  const resumoAjuste = ajuste ? `<tr style="background:#fff7ed"><td><strong>Ajuste de implantação</strong><div style="font-size:11px;color:#92400e">Corte em ${nomeMesAno(Number(ajuste.mes),Number(ajuste.ano))}. Teórico no corte: ${fmtValor(ajuste.teoricoNoCorte)} · real informado: ${fmtValor(ajuste.saldoReal)}.</div></td><td>Saldo gerencial</td><td style="font-weight:700;color:#92400e">${fmtValor(prov.saldoAtual)}</td></tr>` : '';
  const linhas = contratos.filter(c=>saldoAntecipadoContratoFimMes(c,cxMes,cxAno)>0).sort((a,b)=>saldoAntecipadoContratoFimMes(b,cxMes,cxAno)-saldoAntecipadoContratoFimMes(a,cxMes,cxAno)).map(c=>`<tr><td><strong>${esc(c.alunoNome||'—')}</strong></td><td>${esc(nomeContrato(c))}<div style="font-size:11px;color:var(--texto-muted)">${fmtData(c.inicio)} → ${fmtData(vencAjustadoContrato(c))} · mensalidade ${fmtValor(mensalidadeContrato(c))}</div></td><td style="font-weight:700;color:#92400e">${fmtValor(saldoAntecipadoContratoFimMes(c,cxMes,cxAno))}</td></tr>`).join('');
  return resumoAjuste + (linhas || `<tr><td colspan="3"><div class="empty">Nenhum contrato com provisionamento teórico neste mês.</div></td></tr>`);
}
renderAntecipadosRows = renderAntecipadosRowsV11;
window.renderAntecipadosRows = renderAntecipadosRowsV11;

function renderResumoContasHtmlV11(resumo){
  const mapa = resumoPorContasCaixa(resumo);
  const linhas = Object.entries(mapa).map(([conta,d])=>`<div style="border:1px solid var(--borda);border-radius:8px;padding:12px;background:#fff"><div style="display:flex;justify-content:space-between;gap:10px"><strong>${esc(conta)}</strong><strong>${fmtValor(d.total)}</strong></div><div style="margin-top:8px;font-size:11px;color:var(--texto-muted)">${d.itens.map(i=>`${i.icon||'📦'} ${esc(i.nome)}: <strong>${fmtValor(i.valor)}</strong>`).join(' · ')}</div></div>`).join('');
  return `<div class="section-box" style="margin-bottom:18px"><div class="section-header"><div><div class="section-title">Resumo por conta/local</div><div style="font-size:12px;color:var(--texto-muted)">Mostra onde está cada caixinha. Pode haver mais de uma caixinha na mesma conta.</div></div></div><div style="padding:16px 24px;display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px">${linhas||'<div style="color:var(--texto-muted)">Nenhuma conta informada.</div>'}</div></div>`;
}
renderResumoContasHtml = renderResumoContasHtmlV11;

function renderPerfilCaixaHtmlV11(c, resumo){
  const auto = c.tipo==='automatico';
  const isLucro = c.id==='lucro';
  const saldo = auto ? resumo.prov.saldoAtual : saldoCaixaManual(c.id,cxMes,cxAno);
  const meta = auto ? 0 : metaCaixaDinamica(c,resumo);
  const sugestao = auto ? 0 : sugestaoCaixaDinamica(c,resumo);
  const movimentos = auto ? [] : movimentosCaixaSelecionada(c.id,cxMes,cxAno);
  const rows = auto ? renderAntecipadosRowsV11() : movimentos.map(m=>{
    const v = valorMovParaCaixa(m,c.id);
    return `<tr><td>${fmtData(m.data)}</td><td><strong>${esc(labelTipoMov(m.tipo))}</strong><div style="font-size:11px;color:var(--texto-muted)">${esc(m.descricao||'—')}${m.origem||m.destino?` · ${m.origem?`Origem: ${esc(caixaById(m.origem).nome||m.origem)}`:''}${m.destino?` · Destino: ${esc(caixaById(m.destino).nome||m.destino)}`:''}`:''}</div></td><td style="font-weight:700;color:${v>=0?'var(--verde)':'var(--vermelho)'}">${v>=0?'+':'-'}${fmtValor(Math.abs(v))}</td><td><button class="desp-btn" title="Editar" onclick="abrirModalMovCaixa('${c.id}','${m.id}')">✏️</button><button class="desp-btn" title="Excluir" onclick="excluirMovCaixa('${m.id}')">🗑</button></td></tr>`;
  }).join('');
  const boxAuto = auto ? `<div style="margin-top:8px;background:#fffbeb;border:1px solid #fde68a;border-radius:6px;padding:8px 10px;font-size:12px;color:#92400e"><strong>Por que não mexer direto?</strong> Este dinheiro já entrou no caixa, mas pertence a meses futuros. Para contratos antigos, use “Ajustar saldo real” para informar quanto ainda existe de verdade reservado.</div>` : '';
  const boxLucro = isLucro ? `<div style="margin-top:8px;background:#f8fafc;border:1px solid var(--borda);border-radius:6px;padding:8px 10px;font-size:12px;color:var(--texto-mid)"><strong>Como usar:</strong> se o lucro não for retirado, ele pode ficar acumulado aqui como “lucro a distribuir” ou ser transferido para reserva, giro, manutenção ou investimentos. Quando Fernando transferir para a conta pessoal, registre como lucro realizado.</div>` : '';
  const botoes = auto
    ? `<button class="btn btn-ghost btn-sm" onclick="abrirConfigCaixas('${c.id}')">Editar conta/local</button><button class="btn btn-primary btn-sm" onclick="ajustarProvisaoAntecipada()">Ajustar saldo real</button>${resumo.prov.ajuste?`<button class="btn btn-ghost btn-sm" onclick="removerAjusteProvisao()">Remover ajuste</button>`:''}`
    : isLucro
      ? `<button class="btn btn-primary btn-sm" onclick="abrirModalMovCaixa('lucro',null,'distribuicao_lucro')">Realizar distribuição</button><button class="btn btn-ghost btn-sm" onclick="abrirModalMovCaixa('lucro',null,'transferencia')">Transferir para caixinha</button><button class="btn btn-ghost btn-sm" onclick="abrirConfigCaixas('${c.id}')">Editar %</button>`
      : `<button class="btn btn-ghost btn-sm" onclick="abrirConfigCaixas('${c.id}')">Editar meta/%/conta</button><button class="btn btn-primary btn-sm" onclick="abrirModalMovCaixa('${c.id}')">+ Movimento</button>`;
  return `<div class="section-box"><div class="section-header"><div><div class="section-title">${c.icon||'📦'} ${esc(c.nome)}</div><div style="font-size:12px;color:var(--texto-muted);max-width:720px">${esc(c.desc||'')}</div><div style="font-size:11px;color:var(--texto-muted);margin-top:4px">📍 Conta/local: <strong>${esc(contaCaixaNome(c))}</strong></div>${boxAuto}${boxLucro}</div><div style="display:flex;gap:8px;flex-wrap:wrap">${botoes}</div></div>
    <div style="padding:16px 24px;display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:14px;border-bottom:1px solid var(--borda)">
      <div><div class="card-label">Saldo atual</div><div style="font-family:'Bebas Neue';font-size:26px;color:${c.cor||'var(--texto)'}">${fmtValor(saldo)}</div></div>
      ${!auto?`<div><div class="card-label">Sugestão do mês</div><div style="font-family:'Bebas Neue';font-size:26px;color:var(--verde)">${fmtValor(sugestao)}</div><div style="font-size:11px;color:var(--texto-muted)">${Number(c.pct||0)}% da base</div></div><div><div class="card-label">Meta</div><div style="font-family:'Bebas Neue';font-size:26px">${meta>0?fmtValor(meta):'—'}</div><div style="font-size:11px;color:var(--texto-muted)">${Number(c.metaMeses||0)>0?`${c.metaMeses} mês(es) de despesas`:'valor livre/editável'}</div></div>`:`<div><div class="card-label">Novo provisionado</div><div style="font-family:'Bebas Neue';font-size:26px;color:#92400e">${fmtValor(resumo.prov.novo)}</div></div><div><div class="card-label">Liberado no mês</div><div style="font-family:'Bebas Neue';font-size:26px;color:var(--verde)">${fmtValor(resumo.prov.liberado)}</div></div>`}
    </div>
    <div class="table-wrap"><table><thead><tr>${auto?'<th>Aluno / ajuste</th><th>Contrato</th><th>Provisionado</th>':'<th>Data</th><th>Movimentação</th><th>Valor</th><th>Ações</th>'}</tr></thead><tbody>${rows || `<tr><td colspan="4"><div class="empty">Nenhuma movimentação nesta caixinha no mês selecionado.</div></td></tr>`}</tbody></table></div></div>`;
}
renderPerfilCaixaHtml = renderPerfilCaixaHtmlV11;
window.renderPerfilCaixaHtml = renderPerfilCaixaHtmlV11;

function renderCaixaVisaoToggle(){
  return `<div style="display:flex;gap:6px;flex-wrap:wrap"><button class="btn ${caixaVisao==='mensal'?'btn-primary':'btn-ghost'} btn-sm" onclick="setVisaoCaixa('mensal')">Mensal</button><button class="btn ${caixaVisao==='anual'?'btn-primary':'btn-ghost'} btn-sm" onclick="setVisaoCaixa('anual')">Anual</button></div>`;
}
window.setVisaoCaixa = function(v){ caixaVisao=v; renderCaixaView(); };

renderCaixaView = async function(){
  loading(true);
  ensureCaixaMenu();
  await carregarCaixaConfig(); await carregarMovCaixa(); await carregarAjustesCaixa();
  normalizarCaixasV11();
  if(caixaVisao==='anual') return renderCaixaAnualView();
  const resumo = await resumoCaixaMes(cxMes,cxAno);
  const caixas = caixaConfig.caixas || CAIXAS_PADRAO;
  if(!caixaSelecionada) caixaSelecionada = 'giro';
  const totalManual = caixas.filter(c=>c.tipo!=='automatico').reduce((s,c)=>s+saldoCaixaManual(c.id,cxMes,cxAno),0);
  const totalGeral = totalManual + resumo.prov.saldoAtual;
  const pctTotal = totalPctCaixas();
  const caixaCards = caixas.map(c=>{
    const auto = c.tipo==='automatico';
    const saldo = auto ? resumo.prov.saldoAtual : saldoCaixaManual(c.id,cxMes,cxAno);
    const meta = auto ? 0 : metaCaixaDinamica(c,resumo);
    const sugestao = auto ? 0 : sugestaoCaixaDinamica(c,resumo);
    const progresso = meta>0 ? Math.min(100, Math.round(saldo/meta*100)) : 0;
    const selected = caixaSelecionada===c.id;
    return `<div class="card" style="cursor:pointer;border-top:3px solid ${c.cor||'var(--texto-mid)'};${selected?'box-shadow:0 0 0 2px rgba(211,47,47,.16), var(--shadow-md)':''}" onclick="abrirCaixaPerfil('${c.id}')"><div class="card-label">${esc(c.nome)}</div><div class="card-value" style="font-size:24px;padding-top:4px;color:${c.cor||'var(--texto)'}">${fmtValor(saldo)}</div><div class="card-sub">${auto?`Automático · liberou ${fmtValor(resumo.prov.liberado)} no mês`:`Sug.: ${fmtValor(sugestao)} · ${Number(c.pct||0)}%`}</div><div style="font-size:10px;color:var(--texto-muted);margin-top:5px">📍 ${esc(contaCaixaNome(c))}</div>${!auto&&meta>0?`<div style="margin-top:10px"><div style="height:6px;background:var(--borda);border-radius:4px;overflow:hidden"><div style="height:100%;width:${progresso}%;background:${c.cor||'var(--vermelho)'}"></div></div><div style="font-size:10px;color:var(--texto-muted);margin-top:4px">Meta: ${fmtValor(meta)} · ${progresso}%</div></div>`:''}<div class="card-icon">${c.icon||'📦'}</div></div>`;
  }).join('');
  const selecionada = caixaById(caixaSelecionada);
  const perfil = renderPerfilCaixaHtmlV11(selecionada, resumo);
  const alertaPct = pctTotal!==100 ? `<div class="alert-bar atencao"><span class="alert-icon">⚙️</span><strong>Percentuais somam ${pctTotal}%.</strong>&nbsp;Ajuste em Configurar para fechar 100%, se quiser uma distribuição completa.</div>` : '';
  document.getElementById('content').innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:12px"><div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">${seletorMesAnoHtml('caixa',cxMes,cxAno)}${renderCaixaVisaoToggle()}</div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-ghost btn-sm" onclick="editarValorBaseCaixa()">✏️ Editar valor base</button><button class="btn btn-success btn-sm" onclick="aplicarSugestaoCaixa()">Aplicar sugestão</button><button class="btn btn-ghost btn-sm" onclick="desfazerSugestaoCaixa()">Desfazer sugestão</button><button class="btn btn-primary btn-sm" onclick="abrirModalMovCaixa()">+ Movimentação</button><button class="btn btn-ghost btn-sm" onclick="abrirConfigCaixas()">Configurar</button></div></div>
    <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:12px 16px;font-size:13px;margin-bottom:16px"><strong>Menu Caixa.</strong> O resultado por competência orienta a distribuição. Pagamentos antecipados são provisionados automaticamente e liberados mês a mês. Para contratos anteriores à implantação, ajuste o saldo real dentro da caixinha de antecipados.</div>
    ${alertaPct}
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px;margin-bottom:22px"><div class="card c-green" style="border-top:3px solid var(--verde)"><div class="card-label">Resultado competência</div><div class="card-value" style="font-size:24px;padding-top:4px;color:${resumo.resComp>=0?'var(--verde)':'var(--vermelho)'}">${resumo.resComp>=0?'':'-'}${fmtValor(Math.abs(resumo.resComp))}</div><div class="card-sub">Receita ${fmtValor(resumo.recComp)} − despesas ${fmtValor(resumo.desp)}</div></div><div class="card" style="border-top:3px solid var(--azul)"><div class="card-label">Resultado de caixa</div><div class="card-value" style="font-size:24px;padding-top:4px;color:${resumo.resCx>=0?'var(--verde)':'var(--vermelho)'}">${resumo.resCx>=0?'':'-'}${fmtValor(Math.abs(resumo.resCx))}</div><div class="card-sub">Entradas líquidas ${fmtValor(resumo.recCx)} − despesas</div></div><div class="card" style="border-top:3px solid #92400e"><div class="card-label">Antecipado provisionado</div><div class="card-value" style="font-size:24px;padding-top:4px;color:#92400e">${fmtValor(resumo.prov.saldoAtual)}</div><div class="card-sub">Novo: ${fmtValor(resumo.prov.novo)} · Liberado: ${fmtValor(resumo.prov.liberado)}${resumo.prov.ajuste?' · ajustado':''}</div></div><div class="card" style="border-top:3px solid var(--roxo)"><div class="card-label">Base da sugestão</div><div class="card-value" style="font-size:24px;padding-top:4px;color:var(--roxo)">${fmtValor(resumo.base)}</div><div class="card-sub">${resumo.ajuste?'manual':'competência'} · saldos em caixas: ${fmtValor(totalGeral)}</div></div></div>
    <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--texto-muted);margin-bottom:10px">Caixinhas</div><div class="cards-grid" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr));margin-bottom:22px">${caixaCards}</div>${renderResumoContasHtmlV11(resumo)}<div style="background:#f8fafc;border:1px solid var(--borda);border-radius:8px;padding:12px 16px;font-size:12px;color:var(--texto-muted);margin-bottom:16px">Metas técnicas: giro = 50% da média de despesas; reserva = 6 meses da média de despesas; manutenção = média de manutenção × 3. A sugestão mensal de todas as caixinhas editáveis segue o percentual configurado. Base histórica usada nas metas: ${resumo.intel.mesesBase} mês(es).</div>${perfil}`;
};
window.renderCaixaView = renderCaixaView;

async function renderCaixaAnualView(){
  loading(true);
  const meses=[];
  for(let i=0;i<12;i++) meses.push(await resumoCaixaMes(i,cxAno));
  const atualResumo = await resumoCaixaMes(cxMes,cxAno);
  const caixas = caixaConfig.caixas || CAIXAS_PADRAO;
  const saldoManual = caixas.filter(c=>c.tipo!=='automatico').reduce((s,c)=>s+saldoCaixaManual(c.id,cxMes,cxAno),0);
  const saldoTotal = saldoManual + atualResumo.prov.saldoAtual;
  const totComp = meses.reduce((s,r)=>s+r.recComp,0), totDesp = meses.reduce((s,r)=>s+r.desp,0), totRes = totComp - totDesp;
  const mediaResPos = meses.filter((_,i)=>i<=cxMes).filter(r=>r.resComp>0).reduce((s,r)=>s+r.resComp,0) / Math.max(1, meses.filter((_,i)=>i<=cxMes && i>=0).length);
  const projDez = saldoTotal + Math.max(0, mediaResPos) * Math.max(0, 11-cxMes);
  const linhas = meses.map((r,i)=>{
    const maior = Math.max(...meses.map(x=>Math.abs(x.resComp)),1);
    const w = Math.round(Math.abs(r.resComp)/maior*100);
    return `<tr style="${i===cxMes?'background:rgba(211,47,47,.04);font-weight:600':''}"><td>${MESES_ABREV[i]}</td><td style="color:var(--verde);font-weight:600">${fmtValor(r.recComp)}</td><td style="color:var(--vermelho);font-weight:600">${fmtValor(r.desp)}</td><td style="color:${r.resComp>=0?'var(--verde)':'var(--vermelho)'};font-weight:700">${r.resComp>=0?'':'-'}${fmtValor(Math.abs(r.resComp))}<div style="height:4px;background:#eee;border-radius:4px;margin-top:5px;overflow:hidden"><div style="height:100%;width:${w}%;background:${r.resComp>=0?'var(--verde)':'var(--vermelho)'}"></div></div></td><td style="color:#92400e;font-weight:600">${fmtValor(r.prov.saldoAtual)}</td></tr>`;
  }).join('');
  document.getElementById('content').innerHTML = `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:12px"><div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center"><div class="mes-selector mes-selector-v11"><button class="mes-btn" onclick="cxAno--;renderCaixaView()">◀</button><select class="filter-select" id="sel-ano-caixa-anual" onchange="cxAno=Number(this.value);renderCaixaView()" style="min-width:90px">${anosPeriodoOptions(cxAno)}</select><button class="mes-btn" onclick="cxAno++;renderCaixaView()">▶</button></div>${renderCaixaVisaoToggle()}</div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-ghost btn-sm" onclick="cxMes=MES_ATUAL;cxAno=ANO_ATUAL;renderCaixaView()">Ano atual</button><button class="btn btn-primary btn-sm" onclick="setVisaoCaixa('mensal')">Ver mês</button></div></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:16px;margin-bottom:22px"><div class="card c-green"><div class="card-label">Resultado competência acumulado</div><div class="card-value" style="font-size:24px;color:${totRes>=0?'var(--verde)':'var(--vermelho)'}">${totRes>=0?'':'-'}${fmtValor(Math.abs(totRes))}</div><div class="card-sub">Receita ${fmtValor(totComp)} − despesas ${fmtValor(totDesp)}</div></div><div class="card"><div class="card-label">Saldo total em caixinhas</div><div class="card-value" style="font-size:24px;color:var(--azul)">${fmtValor(saldoTotal)}</div><div class="card-sub">Mês base: ${nomeMesAno(cxMes,cxAno)}</div></div><div class="card"><div class="card-label">Provisionado futuro</div><div class="card-value" style="font-size:24px;color:#92400e">${fmtValor(atualResumo.prov.saldoAtual)}</div><div class="card-sub">Valor protegido de contratos futuros</div></div><div class="card"><div class="card-label">Projeção até dezembro</div><div class="card-value" style="font-size:24px;color:var(--roxo)">${fmtValor(projDez)}</div><div class="card-sub">mantida a média positiva recente</div></div></div>${renderResumoContasHtmlV11(atualResumo)}<div class="section-box"><div class="section-header"><div><div class="section-title">Visão anual do caixa — ${cxAno}</div><div style="font-size:12px;color:var(--texto-muted)">Evolução gerencial por competência e saldo provisionado.</div></div></div><div class="table-wrap"><table><thead><tr><th>Mês</th><th>Receita competência</th><th>Despesas</th><th>Resultado</th><th>Provisionado</th></tr></thead><tbody>${linhas}</tbody></table></div></div>`;
}

window.abrirModalMovCaixa = async function(defaultCaixa=null, movId=null, defaultTipo=null){
  await carregarCaixaConfig(); await carregarMovCaixa(); normalizarCaixasV11();
  const mov = movId ? caixaMovs.find(x=>String(x.id)===String(movId)) : null;
  const idCaixa = defaultCaixa || mov?.caixaId || mov?.origem || mov?.destino || caixaSelecionada || 'giro';
  const optsCaixas = caixasEditaveis().map(c=>`<option value="${c.id}" ${c.id===idCaixa?'selected':''}>${esc(c.nome)}</option>`).join('');
  const tipoAtual = mov?.tipo || defaultTipo || 'entrada_manual';
  const dataAtual = mov?.data || new Date(cxAno,cxMes,1).toISOString().split('T')[0];
  const valorAtual = mov ? Number(mov.valor||0) : '';
  const descAtual = mov?.descricao || '';
  const html = `<div style="position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:470;display:flex;align-items:center;justify-content:center;padding:16px" id="modal-mov-caixa"><div style="background:#fff;border-radius:12px;width:100%;max-width:520px;box-shadow:var(--shadow-lg)"><div class="modal-header"><div><div class="modal-title">${mov?'Editar':'Movimentação de'} Caixa</div><div style="font-size:12px;color:var(--texto-muted)">Não entra no DRE. Serve para controlar destino do dinheiro.</div></div><button class="modal-close" onclick="document.getElementById('modal-mov-caixa').remove()">✕</button></div><div class="modal-body"><div class="form-grid"><div class="form-group"><label class="form-label">Data</label><input class="form-input" type="date" id="mov-data" value="${dataAtual}"></div><div class="form-group"><label class="form-label">Tipo</label><select class="form-select" id="mov-tipo" onchange="atualizarCamposMovCaixa()"><option value="entrada_manual" ${tipoAtual==='entrada_manual'?'selected':''}>Entrada manual</option><option value="saida_emergencial" ${tipoAtual==='saida_emergencial'?'selected':''}>Saída emergencial</option><option value="investimento" ${tipoAtual==='investimento'?'selected':''}>Investimento/melhoria</option><option value="transferencia" ${tipoAtual==='transferencia'?'selected':''}>Transferência entre caixas</option><option value="distribuicao_lucro" ${tipoAtual==='distribuicao_lucro'?'selected':''}>Lucro realizado</option><option value="ajuste_saldo" ${tipoAtual==='ajuste_saldo'?'selected':''}>Ajuste de saldo</option></select></div><div class="form-group" id="mov-origem-wrap"><label class="form-label">Origem</label><select class="form-select" id="mov-origem">${optsCaixas}</select></div><div class="form-group" id="mov-destino-wrap"><label class="form-label">Destino</label><select class="form-select" id="mov-destino">${optsCaixas}</select></div><div class="form-group"><label class="form-label">Valor total (R$)</label><input class="form-input" type="number" step="0.01" id="mov-valor" placeholder="0,00" value="${valorAtual}"></div><div class="form-group"><label class="form-label">Parcelas</label><input class="form-input" type="number" min="1" max="60" id="mov-parcelas" value="1" ${mov?'disabled':''}><div class="form-hint">${mov?'Edição altera só esta movimentação.':'Para investimento parcelado, informe o total e o número de parcelas.'}</div></div><div class="form-group full"><label class="form-label">Descrição</label><input class="form-input" id="mov-desc" placeholder="Ex: lucro realizado, transferência para reserva, compra de equipamento..." value="${esc(descAtual)}"></div></div></div><div class="modal-footer"><button class="btn btn-ghost" onclick="document.getElementById('modal-mov-caixa').remove()">Cancelar</button><button class="btn btn-primary" onclick="confirmarMovCaixa('${movId||''}')">Salvar</button></div></div></div>`;
  document.body.insertAdjacentHTML('beforeend', html);
  if(mov?.origem) document.getElementById('mov-origem').value = mov.origem;
  if(mov?.destino) document.getElementById('mov-destino').value = mov.destino;
  if(defaultCaixa==='lucro' && !mov){ document.getElementById('mov-origem').value='lucro'; if(defaultTipo==='transferencia' && document.getElementById('mov-destino').value==='lucro') document.getElementById('mov-destino').value='reserva'; }
  atualizarCamposMovCaixa();
};
window.atualizarCamposMovCaixa = function(){
  const tipo = document.getElementById('mov-tipo')?.value;
  const origem = document.getElementById('mov-origem-wrap'), destino = document.getElementById('mov-destino-wrap');
  if(!origem||!destino) return;
  origem.style.display = ['saida_emergencial','investimento','transferencia','distribuicao_lucro'].includes(tipo) ? '' : 'none';
  destino.style.display = ['entrada_manual','transferencia','ajuste_saldo'].includes(tipo) ? '' : 'none';
  if(tipo==='saida_emergencial') document.getElementById('mov-origem').value='reserva';
  if(tipo==='investimento') document.getElementById('mov-origem').value='investimentos';
  if(tipo==='distribuicao_lucro') document.getElementById('mov-origem').value='lucro';
};
labelTipoMov = function(t){ return ({entrada_manual:'Entrada manual',saida_emergencial:'Saída emergencial',investimento:'Investimento/melhoria',transferencia:'Transferência',distribuicao_lucro:'Lucro realizado',ajuste_saldo:'Ajuste de saldo',sugestao_auto:'Sugestão automática'})[t] || t || 'Movimentação'; };
window.labelTipoMov = labelTipoMov;

const confirmarMovCaixaBaseV11 = window.confirmarMovCaixa;
window.confirmarMovCaixa = async function(movId=''){ return busyRun('Salvando movimentação...', ()=>confirmarMovCaixaBaseV11(movId)); };
const aplicarSugestaoBaseV11 = window.aplicarSugestaoCaixa;
window.aplicarSugestaoCaixa = async function(){ return busyRun('Aplicando sugestão...', aplicarSugestaoBaseV11); };
const desfazerSugestaoBaseV11 = window.desfazerSugestaoCaixa;
window.desfazerSugestaoCaixa = async function(){ return busyRun('Desfazendo sugestão...', desfazerSugestaoBaseV11); };


// ═══════════════════════════════════════════════════
// AJUSTES LGV V11.2 — LUCRO SEM CONTA, RECOMPOSIÇÃO DE PROVISÃO E PERFORMANCE
// ═══════════════════════════════════════════════════
let caixaMovsLoadedV112 = false;
let caixaAjustesLoadedV112 = false;

function normalizarCaixasV112(){
  const aplicar = c => {
    if(c.id==='lucro') return {...c, nome:'Lucros a distribuir', icon:'💵', conta:'', semConta:true, desc:'Lucro já apurado e ainda não destinado. Pode ficar acumulado, ser transferido para uma caixinha ou ser realizado como distribuição para Fernando.'};
    if(c.id==='antecipados') return {...c, nome:'Pagamento antecipado provisionado', desc:'Dinheiro já recebido, mas ainda vinculado a meses futuros de contratos vendidos.'};
    return c;
  };
  for(let i=0;i<CAIXAS_PADRAO.length;i++) CAIXAS_PADRAO[i] = aplicar(CAIXAS_PADRAO[i]);
  if(caixaConfig && Array.isArray(caixaConfig.caixas)) caixaConfig.caixas = caixaConfig.caixas.map(aplicar);
}
const carregarCaixaConfigBaseV112 = carregarCaixaConfig;
carregarCaixaConfig = async function(){
  const cfg = await carregarCaixaConfigBaseV112();
  normalizarCaixasV112();
  return cfg;
};
window.carregarCaixaConfig = carregarCaixaConfig;

const carregarMovCaixaBaseV112 = carregarMovCaixa;
carregarMovCaixa = async function(force=false){
  if(caixaMovsLoadedV112 && !force) return caixaMovs;
  const r = await carregarMovCaixaBaseV112(true);
  caixaMovsLoadedV112 = true;
  return r;
};
window.carregarMovCaixa = carregarMovCaixa;

const carregarAjustesCaixaBaseV112 = carregarAjustesCaixa;
carregarAjustesCaixa = async function(force=false){
  if(caixaAjustesLoadedV112 && !force) return caixaAjustes;
  const r = await carregarAjustesCaixaBaseV112(true);
  caixaAjustesLoadedV112 = true;
  return r;
};
window.carregarAjustesCaixa = carregarAjustesCaixa;

function contaCaixaLabel(c){
  if(c?.id==='lucro') return '';
  return contaCaixaNome(c);
}

function resumoPorContasCaixaV112(resumo){
  const mapa = {};
  (caixaConfig?.caixas||CAIXAS_PADRAO).forEach(c=>{
    if(c.id==='lucro') return; // lucro não tem conta própria; ele será destinado ou distribuído depois
    const conta = contaCaixaNome(c);
    const valor = c.id==='antecipados' ? Number(resumo?.prov?.saldoAtual||0) : saldoCaixaManual(c.id,cxMes,cxAno);
    if(!mapa[conta]) mapa[conta]={total:0,itens:[]};
    mapa[conta].total += valor;
    mapa[conta].itens.push({nome:c.nome, icon:c.icon, valor});
  });
  return mapa;
}
resumoPorContasCaixa = resumoPorContasCaixaV112;

function renderResumoContasHtmlV112(resumo){
  const mapa = resumoPorContasCaixaV112(resumo);
  const linhas = Object.entries(mapa).map(([conta,d])=>`<div style="border:1px solid var(--borda);border-radius:8px;padding:12px;background:#fff"><div style="display:flex;justify-content:space-between;gap:10px"><strong>${esc(conta)}</strong><strong>${fmtValor(d.total)}</strong></div><div style="margin-top:8px;font-size:11px;color:var(--texto-muted)">${d.itens.map(i=>`${i.icon||'📦'} ${esc(i.nome)}: <strong>${fmtValor(i.valor)}</strong>`).join(' · ')}</div></div>`).join('');
  return `<div class="section-box" style="margin-bottom:18px"><div class="section-header"><div><div class="section-title">Resumo por conta/local</div><div style="font-size:12px;color:var(--texto-muted)">Mostra onde está o dinheiro das caixinhas. <strong>Lucros a distribuir</strong> não aparece aqui porque ainda não foi enviado para conta pessoal nem para uma caixinha específica.</div></div></div><div style="padding:16px 24px;display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px">${linhas||'<div style="color:var(--texto-muted)">Nenhuma conta/local informada.</div>'}</div></div>`;
}
renderResumoContasHtml = renderResumoContasHtmlV112;
window.renderResumoContasHtml = renderResumoContasHtmlV112;

function idxToMesAno(idx){ return {ano:Math.floor(idx/12), mes:idx%12}; }
function provisionamentoAjusteMaisRecenteAte(mes, ano){
  const alvo = idxMesCaixa(mes,ano);
  const cfgAj = caixaConfig?.provisaoImplantacao ? [{...caixaConfig.provisaoImplantacao, origem:'config'}] : [];
  const ajustesColecao = Object.values(caixaAjustes||{}).filter(a=>a && a.saldoProvisionadoManual!==undefined).map(a=>({...a, origem:'ajuste'}));
  return [...cfgAj, ...ajustesColecao]
    .filter(a=>idxMesCaixa(Number(a.mes),Number(a.ano))<=alvo)
    .sort((a,b)=>idxMesCaixa(Number(b.mes),Number(b.ano))-idxMesCaixa(Number(a.mes),Number(a.ano)))[0] || null;
}
function provisaoTeoricaResumoMes(mes,ano){
  const ant = mesAnteriorCaixa(mes,ano);
  const saldoAtual = saldoAntecipadoTeoricoFimMes(mes,ano);
  const saldoAnterior = saldoAntecipadoTeoricoFimMes(ant.mes,ant.ano);
  const liberado = liberacaoProvisionadaMes(mes,ano);
  const novo = Math.max(0, saldoAtual - saldoAnterior + liberado);
  return {saldoAtual, saldoAnterior, liberado, novo};
}
function valorMovProvisionamentoNoMes(mes,ano){
  const idx = idxMesCaixa(mes,ano);
  return caixaMovs.filter(m=>m.status!=='excluido' && mesAnoDeData(m.data)?.idx===idx).reduce((s,m)=>{
    const v=Number(m.valor||0);
    if(m.tipo==='recomposicao_antecipado' || m.destino==='antecipados' || m.caixaId==='antecipados') return s+v;
    if(m.tipo==='liberacao_antecipado' || m.origem==='antecipados') return s-v;
    return s;
  },0);
}
function saldoAntecipadoGerencialFimMesV112(mes,ano){
  const teorico = saldoAntecipadoTeoricoFimMes(mes,ano);
  const aj = provisionamentoAjusteMaisRecenteAte(mes,ano);
  if(!aj) return teorico;
  const idxAtual=idxMesCaixa(mes,ano), idxCorte=idxMesCaixa(Number(aj.mes),Number(aj.ano));
  let real = Number((aj.saldoProvisionadoManual ?? aj.saldoReal) || 0);
  for(let idx=idxCorte; idx<=idxAtual; idx++){
    const {mes:m, ano:a}=idxToMesAno(idx);
    const t = provisaoTeoricaResumoMes(m,a);
    if(idx>idxCorte) real += Number(t.novo||0) - Number(t.liberado||0);
    real += valorMovProvisionamentoNoMes(m,a);
    real = Math.max(0, real);
  }
  return Math.min(Math.max(0, real), Math.max(teorico, real));
}
saldoAntecipadoGerencialFimMes = saldoAntecipadoGerencialFimMesV112;

resumoProvisaoAntecipados = function(mes=cxMes, ano=cxAno){
  const ant = mesAnteriorCaixa(mes,ano);
  const teoricoAtual = saldoAntecipadoTeoricoFimMes(mes,ano);
  const teoricoAnterior = saldoAntecipadoTeoricoFimMes(ant.mes,ant.ano);
  const saldoAtual = saldoAntecipadoGerencialFimMesV112(mes,ano);
  const saldoAnterior = saldoAntecipadoGerencialFimMesV112(ant.mes,ant.ano);
  const liberadoTeorico = liberacaoProvisionadaMes(mes,ano);
  const liberado = Math.min(liberadoTeorico, Math.max(0, saldoAnterior));
  const recomposicao = valorMovProvisionamentoNoMes(mes,ano);
  const novoTeorico = Math.max(0, teoricoAtual - teoricoAnterior + liberadoTeorico);
  const novo = Math.max(0, saldoAtual - saldoAnterior + liberado - Math.max(0,recomposicao));
  const ajuste = provisionamentoAjusteMaisRecenteAte(mes,ano);
  return {saldoAtual, saldoAnterior, liberado, novo, recomposicao, teoricoAtual, teoricoAnterior, novoTeorico, liberadoTeorico, ajuste, defasagem:Math.max(0,teoricoAtual-saldoAtual), excedente:Math.max(0,saldoAtual-teoricoAtual)};
};
window.resumoProvisaoAntecipados = resumoProvisaoAntecipados;

window.ajustarProvisaoAntecipada = async function(){
  await carregarCaixaConfig(); await carregarAjustesCaixa();
  const prov = resumoProvisaoAntecipados(cxMes,cxAno);
  const valor = prompt(`Saldo real reservado hoje em Pagamento antecipado provisionado (${nomeMesAno(cxMes,cxAno)}).\n\nSaldo teórico que deveria estar protegido: ${fmtValor(prov.teoricoAtual)}\nSaldo gerencial atual: ${fmtValor(prov.saldoAtual)}\n\nInforme quanto existe de verdade reservado:`, String(Number(prov.saldoAtual||0).toFixed(2)));
  if(valor===null) return;
  const n = Number(String(valor).replace(',','.'));
  if(isNaN(n) || n<0){ toast('Valor inválido.'); return; }
  const chave = chaveMesCaixa(cxMes,cxAno);
  const reg = {...(caixaAjustes[chave]||{}), id:chave, mes:cxMes, ano:cxAno, saldoProvisionadoManual:Number(n.toFixed(2)), teoricoProvisionadoNoCorte:Number(prov.teoricoAtual.toFixed(2)), atualizadoEm:new Date().toISOString()};
  caixaAjustes[chave]=reg;
  await setDoc(doc(db,'caixa_ajustes',chave), reg);
  toast('Saldo real provisionado ajustado ✓'); renderCaixaView();
};
window.removerAjusteProvisao = async function(){
  await carregarAjustesCaixa(true);
  const chave = chaveMesCaixa(cxMes,cxAno);
  const reg = caixaAjustes[chave];
  if(!reg || reg.saldoProvisionadoManual===undefined){ toast('Não há ajuste manual neste mês.'); return; }
  if(!confirm('Remover o ajuste manual de provisionamento deste mês?')) return;
  delete reg.saldoProvisionadoManual;
  delete reg.teoricoProvisionadoNoCorte;
  reg.atualizadoEm=new Date().toISOString();
  caixaAjustes[chave]=reg;
  await setDoc(doc(db,'caixa_ajustes',chave), reg);
  toast('Ajuste removido ✓'); renderCaixaView();
};

function sugestaoRecomposicaoProvisionamento(resumo){ return Math.max(0, Math.min(Number(resumo?.base||0), Number(resumo?.prov?.defasagem||0))); }
sugestaoCaixaDinamica = function(c, resumo){
  const recompor = sugestaoRecomposicaoProvisionamento(resumo);
  if(c.id==='antecipados') return recompor;
  if(Number(resumo?.prov?.defasagem||0)>0) return 0;
  // Todas as caixinhas editáveis, inclusive manutenção, usam o percentual configurado.
  return Math.max(0, Number(resumo?.base||0) * Number(c.pct||0) / 100);
};
window.sugestaoCaixaDinamica = sugestaoCaixaDinamica;

function renderAntecipadosRowsV112(){
  const prov = resumoProvisaoAntecipados(cxMes,cxAno);
  const ajuste = prov.ajuste;
  const alerta = `<tr style="background:${prov.defasagem>0?'#fef2f2':'#f0fdf4'}"><td><strong>${prov.defasagem>0?'Recomposição necessária':'Provisionamento equilibrado'}</strong><div style="font-size:11px;color:${prov.defasagem>0?'#991b1b':'#166534'}">Teórico: ${fmtValor(prov.teoricoAtual)} · reservado: ${fmtValor(prov.saldoAtual)} · diferença: ${fmtValor(prov.defasagem)}. ${prov.defasagem>0?'Enquanto houver diferença, a sugestão automática prioriza recompor esta caixinha antes de distribuir para outras.':'O saldo reservado cobre o valor que deveria estar protegido.'}</div></td><td>Resumo gerencial</td><td style="font-weight:700;color:${prov.defasagem>0?'#991b1b':'#166534'}">${fmtValor(prov.defasagem)}</td></tr>`;
  const resumoAjuste = ajuste ? `<tr style="background:#fff7ed"><td><strong>Ajuste manual aplicado</strong><div style="font-size:11px;color:#92400e">Corte em ${nomeMesAno(Number(ajuste.mes),Number(ajuste.ano))}. Teórico no corte: ${fmtValor(ajuste.teoricoProvisionadoNoCorte ?? ajuste.teoricoNoCorte ?? 0)} · real informado: ${fmtValor(ajuste.saldoProvisionadoManual ?? ajuste.saldoReal ?? 0)}.</div></td><td>Saldo gerencial</td><td style="font-weight:700;color:#92400e">${fmtValor(prov.saldoAtual)}</td></tr>` : '';
  const linhas = contratos.filter(c=>saldoAntecipadoContratoFimMes(c,cxMes,cxAno)>0).sort((a,b)=>saldoAntecipadoContratoFimMes(b,cxMes,cxAno)-saldoAntecipadoContratoFimMes(a,cxMes,cxAno)).map(c=>`<tr><td><strong>${esc(c.alunoNome||'—')}</strong></td><td>${esc(nomeContrato(c))}<div style="font-size:11px;color:var(--texto-muted)">${fmtData(c.inicio)} → ${fmtData(vencAjustadoContrato(c))} · mensalidade ${fmtValor(mensalidadeContrato(c))}</div></td><td style="font-weight:700;color:#92400e">${fmtValor(saldoAntecipadoContratoFimMes(c,cxMes,cxAno))}</td></tr>`).join('');
  return alerta + resumoAjuste + (linhas || `<tr><td colspan="3"><div class="empty">Nenhum contrato com provisionamento teórico neste mês.</div></td></tr>`);
}
renderAntecipadosRows = renderAntecipadosRowsV112;
window.renderAntecipadosRows = renderAntecipadosRowsV112;

function renderPerfilCaixaHtmlV112(c, resumo){
  const auto = c.tipo==='automatico';
  const isLucro = c.id==='lucro';
  const saldo = auto ? resumo.prov.saldoAtual : saldoCaixaManual(c.id,cxMes,cxAno);
  const meta = auto ? 0 : metaCaixaDinamica(c,resumo);
  const sugestao = sugestaoCaixaDinamica(c,resumo);
  const movimentos = auto ? [] : movimentosCaixaSelecionada(c.id,cxMes,cxAno);
  const rows = auto ? renderAntecipadosRowsV112() : movimentos.map(m=>{
    const v = valorMovParaCaixa(m,c.id);
    return `<tr><td>${fmtData(m.data)}</td><td><strong>${esc(labelTipoMov(m.tipo))}</strong><div style="font-size:11px;color:var(--texto-muted)">${esc(m.descricao||'—')}${m.origem||m.destino?` · ${m.origem?`Origem: ${esc(caixaById(m.origem).nome||m.origem)}`:''}${m.destino?` · Destino: ${esc(caixaById(m.destino).nome||m.destino)}`:''}`:''}</div></td><td style="font-weight:700;color:${v>=0?'var(--verde)':'var(--vermelho)'}">${v>=0?'+':'-'}${fmtValor(Math.abs(v))}</td><td><button class="desp-btn" title="Editar" onclick="abrirModalMovCaixa('${c.id}','${m.id}')">✏️</button><button class="desp-btn" title="Excluir" onclick="excluirMovCaixa('${m.id}')">🗑</button></td></tr>`;
  }).join('');
  const linhaConta = isLucro ? '' : `<div style="font-size:11px;color:var(--texto-muted);margin-top:4px">📍 Conta/local: <strong>${esc(contaCaixaNome(c))}</strong></div>`;
  const boxAuto = auto ? `<div style="margin-top:8px;background:#fffbeb;border:1px solid #fde68a;border-radius:6px;padding:8px 10px;font-size:12px;color:#92400e"><strong>Por que não mexer direto?</strong> Este dinheiro já entrou no caixa, mas pertence a meses futuros. Se o valor real reservado for menor que o teórico, informe o saldo real e o sistema passa a priorizar a recomposição.</div>${resumo.prov.defasagem>0?`<div style="margin-top:8px;background:#fef2f2;border:1px solid #fecaca;border-radius:6px;padding:8px 10px;font-size:12px;color:#991b1b"><strong>Prioridade:</strong> há ${fmtValor(resumo.prov.defasagem)} de defasagem. A sugestão automática será direcionada para recompor esse valor antes das demais caixinhas.</div>`:''}` : '';
  const boxLucro = isLucro ? `<div style="margin-top:8px;background:#f8fafc;border:1px solid var(--borda);border-radius:6px;padding:8px 10px;font-size:12px;color:var(--texto-mid)"><strong>Sem conta própria.</strong> Este é um saldo de decisão: Fernando pode deixar acumulado, transferir para uma caixinha do negócio ou realizar a distribuição para a conta pessoal.</div>` : '';
  const botoes = auto
    ? `<button class="btn btn-primary btn-sm" onclick="ajustarProvisaoAntecipada()">Ajustar saldo real</button>${resumo.prov.ajuste?`<button class="btn btn-ghost btn-sm" onclick="removerAjusteProvisao()">Remover ajuste do mês</button>`:''}<button class="btn btn-ghost btn-sm" onclick="abrirConfigCaixas('${c.id}')">Editar conta/local</button>`
    : isLucro
      ? `<button class="btn btn-primary btn-sm" onclick="abrirModalMovCaixa('lucro',null,'distribuicao_lucro')">Realizar distribuição</button><button class="btn btn-ghost btn-sm" onclick="abrirModalMovCaixa('lucro',null,'transferencia')">Transferir para caixinha</button><button class="btn btn-ghost btn-sm" onclick="abrirConfigCaixas('${c.id}')">Editar %</button>`
      : `<button class="btn btn-ghost btn-sm" onclick="abrirConfigCaixas('${c.id}')">Editar meta/%/conta</button><button class="btn btn-primary btn-sm" onclick="abrirModalMovCaixa('${c.id}')">+ Movimento</button>`;
  const cardsAuto = `<div><div class="card-label">Saldo teórico</div><div style="font-family:'Bebas Neue';font-size:26px;color:#92400e">${fmtValor(resumo.prov.teoricoAtual)}</div></div><div><div class="card-label">Defasagem</div><div style="font-family:'Bebas Neue';font-size:26px;color:${resumo.prov.defasagem>0?'var(--vermelho)':'var(--verde)'}">${fmtValor(resumo.prov.defasagem)}</div></div><div><div class="card-label">Liberado no mês</div><div style="font-family:'Bebas Neue';font-size:26px;color:var(--verde)">${fmtValor(resumo.prov.liberado)}</div></div>`;
  return `<div class="section-box"><div class="section-header"><div><div class="section-title">${c.icon||'📦'} ${esc(c.nome)}</div><div style="font-size:12px;color:var(--texto-muted);max-width:720px">${esc(c.desc||'')}</div>${linhaConta}${boxAuto}${boxLucro}</div><div style="display:flex;gap:8px;flex-wrap:wrap">${botoes}</div></div>
    <div style="padding:16px 24px;display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:14px;border-bottom:1px solid var(--borda)">
      <div><div class="card-label">Saldo atual</div><div style="font-family:'Bebas Neue';font-size:26px;color:${c.cor||'var(--texto)'}">${fmtValor(saldo)}</div></div>
      ${auto?cardsAuto:`<div><div class="card-label">Sugestão do mês</div><div style="font-family:'Bebas Neue';font-size:26px;color:var(--verde)">${fmtValor(sugestao)}</div><div style="font-size:11px;color:var(--texto-muted)">${Number(c.pct||0)}% da base</div></div><div><div class="card-label">Meta</div><div style="font-family:'Bebas Neue';font-size:26px">${meta>0?fmtValor(meta):'—'}</div><div style="font-size:11px;color:var(--texto-muted)">${Number(c.metaMeses||0)>0?`${c.metaMeses} mês(es) de despesas`:'valor livre/editável'}</div></div>`}
    </div>
    <div class="table-wrap"><table><thead><tr>${auto?'<th>Aluno / ajuste</th><th>Contrato</th><th>Provisionado</th>':'<th>Data</th><th>Movimentação</th><th>Valor</th><th>Ações</th>'}</tr></thead><tbody>${rows || `<tr><td colspan="4"><div class="empty">Nenhuma movimentação nesta caixinha no mês selecionado.</div></td></tr>`}</tbody></table></div></div>`;
}
renderPerfilCaixaHtml = renderPerfilCaixaHtmlV112;
window.renderPerfilCaixaHtml = renderPerfilCaixaHtmlV112;

window.abrirConfigCaixas = async function(focoId=null){
  await carregarCaixaConfig();
  const resumo = await resumoCaixaMes(cxMes,cxAno);
  const linhas = caixaConfig.caixas.map(c=>{
    const isLucro=c.id==='lucro';
    const contaHtml = isLucro ? `<div class="form-group full"><div class="form-hint"><strong>Lucros a distribuir não têm conta própria.</strong> Eles ficam aguardando uma decisão: distribuir para Fernando ou transferir para uma caixinha que esteja em alguma conta/local.</div></div>` : `<div class="form-group full"><label class="form-label">Conta/local</label><input class="form-input" type="text" id="cfg-conta-${c.id}" value="${esc(contaCaixaNome(c)==='Conta não informada'?'':contaCaixaNome(c))}" placeholder="Ex: Itaú, Banco do Brasil, Fintech Pay..."></div>`;
    const extra = c.tipo==='automatico' ? `<div class="form-group full"><div class="form-hint">Caixinha automática: o saldo vem dos pagamentos antecipados provisionados. A conta/local é apenas para controle de onde esse dinheiro está guardado.</div></div>` : `<div class="form-group"><label class="form-label">% da sugestão</label><input class="form-input" type="number" step="0.01" id="cfg-pct-${c.id}" value="${Number(c.pct||0)}"></div><div class="form-group"><label class="form-label">Meta fixa (R$)</label><input class="form-input" type="number" step="0.01" id="cfg-meta-${c.id}" value="${Number(c.metaValor||0)}"></div><div class="form-group full"><label class="form-label">Meta em meses de despesas</label><input class="form-input" type="number" step="0.1" id="cfg-meses-${c.id}" value="${Number(c.metaMeses||0)}"><div class="form-hint">Meta técnica atual: ${fmtValor(metaCaixaDinamica(c,resumo))}. A técnica usa histórico de até 12 meses; metas fixas continuam editáveis.</div></div>`;
    return `<div style="border:1px solid var(--borda);border-radius:8px;padding:12px;margin-bottom:10px;background:${focoId===c.id?'#fff7ed':'#fff'}"><div style="font-weight:700;margin-bottom:8px">${c.icon||'📦'} ${esc(c.nome)}</div><div class="form-grid">${contaHtml}${extra}</div></div>`;
  }).join('');
  const html = `<div style="position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:460;display:flex;align-items:center;justify-content:center;padding:16px" id="modal-config-caixa"><div style="background:#fff;border-radius:12px;width:100%;max-width:720px;max-height:88vh;overflow-y:auto;box-shadow:var(--shadow-lg)"><div style="padding:20px 24px;border-bottom:1px solid var(--borda);display:flex;justify-content:space-between;align-items:center"><div><div style="font-family:'Bebas Neue';font-size:22px">Configurar Caixinhas</div><div style="font-size:12px;color:var(--texto-muted)">Percentuais e metas são editáveis. Pagamento antecipado é automático.</div></div><button class="modal-close" onclick="document.getElementById('modal-config-caixa').remove()">✕</button></div><div style="padding:18px 24px">${linhas}<div style="font-size:12px;color:var(--texto-muted);margin-top:8px">Soma atual dos percentuais: <strong>${totalPctCaixas()}%</strong></div></div><div class="modal-footer"><button class="btn btn-ghost" onclick="document.getElementById('modal-config-caixa').remove()">Cancelar</button><button class="btn btn-primary" onclick="confirmarConfigCaixas()">Salvar</button></div></div></div>`;
  document.body.insertAdjacentHTML('beforeend', html);
};

window.confirmarConfigCaixas = async function(){
  caixaConfig.caixas = caixaConfig.caixas.map(c=>{
    const conta = c.id==='lucro' ? '' : (document.getElementById(`cfg-conta-${c.id}`)?.value?.trim() || '');
    if(c.tipo==='automatico') return {...c, conta};
    return {...c, conta, pct:Number(document.getElementById(`cfg-pct-${c.id}`)?.value||0), metaValor:Number(document.getElementById(`cfg-meta-${c.id}`)?.value||0), metaMeses:Number(document.getElementById(`cfg-meses-${c.id}`)?.value||0)};
  });
  await salvarCaixaConfig();
  document.getElementById('modal-config-caixa')?.remove();
  toast('Configuração das caixas salva ✓'); renderCaixaView();
};

valorMovParaCaixa = function(m, caixaId){
  const v = Number(m.valor||0);
  const tipo = m.tipo || 'entrada_manual';
  if(tipo==='recomposicao_antecipado') return caixaId==='antecipados' ? v : 0;
  if(tipo==='transferencia') return (m.destino===caixaId?v:0) - (m.origem===caixaId?v:0);
  if(['saida_emergencial','investimento','distribuicao_lucro','saida_manual'].includes(tipo)) return (m.origem===caixaId || m.caixaId===caixaId) ? -v : 0;
  return (m.destino===caixaId || m.caixaId===caixaId) ? v : 0;
};
window.valorMovParaCaixa = valorMovParaCaixa;

labelTipoMov = function(t){ return ({entrada_manual:'Entrada manual',saida_emergencial:'Saída emergencial',investimento:'Investimento/melhoria',transferencia:'Transferência',distribuicao_lucro:'Lucro realizado',ajuste_saldo:'Ajuste de saldo',sugestao_auto:'Sugestão automática',recomposicao_antecipado:'Recomposição do antecipado'})[t] || t || 'Movimentação'; };
window.labelTipoMov = labelTipoMov;

window.aplicarSugestaoCaixa = async function(){
  return busyRun('Aplicando sugestão...', async ()=>{
    await carregarCaixaConfig(); await carregarMovCaixa(); await carregarAjustesCaixa();
    const resumo = await resumoCaixaMes(cxMes,cxAno);
    if(resumo.base<=0){ toast('Não há valor livre positivo para distribuir.'); return; }
    const existentes = caixaMovs.filter(m=>m.status!=='excluido' && ['sugestao_auto','recomposicao_antecipado'].includes(m.tipo) && m.mes===cxMes && m.ano===cxAno);
    if(existentes.length && !confirm('Já existe sugestão automática aplicada neste mês. Substituir?')) return;
    const batch = writeBatch(db);
    existentes.forEach(m=>{ const novo={...m,status:'excluido',excluidoEm:new Date().toISOString()}; batch.set(doc(db,'caixa_movimentacoes',m.id), novo); caixaMovs = caixaMovs.map(x=>x.id===m.id?novo:x); });
    let count=0;
    const recompor = sugestaoRecomposicaoProvisionamento(resumo);
    if(recompor>0){
      const id=`cx_recomp_${chaveMesCaixa(cxMes,cxAno)}_${Date.now()}`;
      const mov={id,tipo:'recomposicao_antecipado',data:new Date(cxAno,cxMes,1).toISOString().split('T')[0],mes:cxMes,ano:cxAno,valor:Number(recompor.toFixed(2)),destino:'antecipados',caixaId:'antecipados',descricao:`Recomposição automática do pagamento antecipado — ${nomeMesAno(cxMes,cxAno)}`,status:'ativo',criadoEm:new Date().toISOString(),ts:Date.now()};
      batch.set(doc(db,'caixa_movimentacoes',id), mov); caixaMovs.push(mov); count++;
    } else {
      caixasEditaveis().forEach((c,idx)=>{
        const valor = sugestaoCaixaDinamica(c,resumo);
        if(valor<=0) return;
        const id = `cx_auto_${chaveMesCaixa(cxMes,cxAno)}_${c.id}_${Date.now()}_${idx}`;
        const mov = {id,tipo:'sugestao_auto',data:new Date(cxAno,cxMes,1).toISOString().split('T')[0],mes:cxMes,ano:cxAno,valor:Number(valor.toFixed(2)),destino:c.id,caixaId:c.id,descricao:`Sugestão automática — ${nomeMesAno(cxMes,cxAno)}`,status:'ativo',criadoEm:new Date().toISOString(),ts:Date.now()+idx};
        batch.set(doc(db,'caixa_movimentacoes',id), mov); caixaMovs.push(mov); count++;
      });
    }
    await batch.commit();
    toast(`${count} alocação(ões) aplicada(s) ✓`); renderCaixaView();
  });
};
window.desfazerSugestaoCaixa = async function(){
  return busyRun('Desfazendo sugestão...', async ()=>{
    await carregarMovCaixa(true);
    const existentes = caixaMovs.filter(m=>m.status!=='excluido' && ['sugestao_auto','recomposicao_antecipado'].includes(m.tipo) && m.mes===cxMes && m.ano===cxAno);
    if(!existentes.length){ toast('Não há sugestão automática aplicada neste mês.'); return; }
    if(!confirm(`Desfazer ${existentes.length} alocação(ões) automáticas de ${nomeMesAno(cxMes,cxAno)}?`)) return;
    const batch = writeBatch(db);
    existentes.forEach(m=>{ const novo={...m,status:'excluido',excluidoEm:new Date().toISOString()}; batch.set(doc(db,'caixa_movimentacoes',m.id), novo); caixaMovs = caixaMovs.map(x=>x.id===m.id?novo:x); });
    await batch.commit();
    toast('Sugestão automática desfeita ✓'); renderCaixaView();
  });
};

async function resumoCaixaMesLeve(mes,ano){
  const cats = await loadDespesas(mes,ano);
  const desp = totalDesp(cats);
  const recComp = receitaMesEsp(mes,ano);
  const recCx = receitaCaixaMes(mes,ano);
  const resComp = recComp - desp;
  const resCx = recCx - desp;
  const prov = resumoProvisaoAntecipados(mes,ano);
  return {desp,recComp,recCx,resComp,resCx,prov};
}

renderCaixaAnualView = async function(){
  return busyRun('Carregando visão anual...', async ()=>{
    const meses=[];
    for(let i=0;i<12;i++) meses.push(await resumoCaixaMesLeve(i,cxAno));
    const atualResumo = await resumoCaixaMesLeve(cxMes,cxAno);
    const caixas = caixaConfig?.caixas || CAIXAS_PADRAO;
    const saldoManual = caixas.filter(c=>c.tipo!=='automatico').reduce((s,c)=>s+saldoCaixaManual(c.id,cxMes,cxAno),0);
    const saldoTotal = saldoManual + atualResumo.prov.saldoAtual;
    const totComp = meses.reduce((s,r)=>s+r.recComp,0), totDesp = meses.reduce((s,r)=>s+r.desp,0), totRes = meses.reduce((s,r)=>s+r.resComp,0);
    const resPositivos = meses.slice(0,Math.max(1,cxMes+1)).map(r=>r.resComp).filter(x=>x>0);
    const mediaResPos = resPositivos.length ? resPositivos.reduce((a,b)=>a+b,0)/resPositivos.length : 0;
    const projDez = saldoTotal + Math.max(0, mediaResPos) * Math.max(0, 11-cxMes);
    const maior = Math.max(...meses.map(x=>Math.abs(x.resComp)),1);
    const linhas = meses.map((r,i)=>{ const w=Math.round(Math.abs(r.resComp)/maior*100); return `<tr style="${i===cxMes?'background:rgba(211,47,47,.04);font-weight:600':''}"><td>${MESES_ABREV[i]}</td><td style="color:var(--verde);font-weight:600">${fmtValor(r.recComp)}</td><td style="color:var(--vermelho);font-weight:600">${fmtValor(r.desp)}</td><td style="color:${r.resComp>=0?'var(--verde)':'var(--vermelho)'};font-weight:700">${r.resComp>=0?'':'-'}${fmtValor(Math.abs(r.resComp))}<div style="height:4px;background:#eee;border-radius:4px;margin-top:5px;overflow:hidden"><div style="height:100%;width:${w}%;background:${r.resComp>=0?'var(--verde)':'var(--vermelho)'}"></div></div></td><td style="color:#92400e;font-weight:600">${fmtValor(r.prov.saldoAtual)}</td><td style="color:${r.prov.defasagem>0?'var(--vermelho)':'var(--verde)'};font-weight:600">${fmtValor(r.prov.defasagem||0)}</td></tr>`; }).join('');
    document.getElementById('content').innerHTML = `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:12px"><div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center"><div class="mes-selector mes-selector-v11"><button class="mes-btn" onclick="cxAno--;renderCaixaView()">◀</button><select class="filter-select" id="sel-ano-caixa-anual" onchange="cxAno=Number(this.value);renderCaixaView()" style="min-width:90px">${anosPeriodoOptions(cxAno)}</select><button class="mes-btn" onclick="cxAno++;renderCaixaView()">▶</button></div>${renderCaixaVisaoToggle()}</div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-ghost btn-sm" onclick="cxMes=MES_ATUAL;cxAno=ANO_ATUAL;renderCaixaView()">Ano atual</button><button class="btn btn-primary btn-sm" onclick="setVisaoCaixa('mensal')">Ver mês</button></div></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:16px;margin-bottom:22px"><div class="card c-green"><div class="card-label">Resultado competência acumulado</div><div class="card-value" style="font-size:24px;color:${totRes>=0?'var(--verde)':'var(--vermelho)'}">${totRes>=0?'':'-'}${fmtValor(Math.abs(totRes))}</div><div class="card-sub">Receita ${fmtValor(totComp)} − despesas ${fmtValor(totDesp)}</div></div><div class="card"><div class="card-label">Saldo total em caixinhas</div><div class="card-value" style="font-size:24px;color:var(--azul)">${fmtValor(saldoTotal)}</div><div class="card-sub">Mês base: ${nomeMesAno(cxMes,cxAno)}</div></div><div class="card"><div class="card-label">Provisionado futuro</div><div class="card-value" style="font-size:24px;color:#92400e">${fmtValor(atualResumo.prov.saldoAtual)}</div><div class="card-sub">Teórico ${fmtValor(atualResumo.prov.teoricoAtual)} · defasagem ${fmtValor(atualResumo.prov.defasagem||0)}</div></div><div class="card"><div class="card-label">Projeção até dezembro</div><div class="card-value" style="font-size:24px;color:var(--roxo)">${fmtValor(projDez)}</div><div class="card-sub">mantida a média positiva recente</div></div></div>${renderResumoContasHtmlV112(atualResumo)}<div class="section-box"><div class="section-header"><div><div class="section-title">Visão anual do caixa — ${cxAno}</div><div style="font-size:12px;color:var(--texto-muted)">Visão rápida e leve: usa resumo mensal sem recalcular metas técnicas mês a mês.</div></div></div><div class="table-wrap"><table><thead><tr><th>Mês</th><th>Receita competência</th><th>Despesas</th><th>Resultado</th><th>Provisionado</th><th>Defasagem</th></tr></thead><tbody>${linhas}</tbody></table></div></div>`;
  });
};
window.renderCaixaAnualView = renderCaixaAnualView;

function cardContaCaixaHtml(c){ return c.id==='lucro' ? '' : `<div style="font-size:10px;color:var(--texto-muted);margin-top:5px">📍 ${esc(contaCaixaNome(c))}</div>`; }

renderCaixaView = async function(){
  loading(true);
  ensureCaixaMenu();
  await carregarCaixaConfig(); await carregarMovCaixa(); await carregarAjustesCaixa();
  normalizarCaixasV112();
  if(caixaVisao==='anual') return renderCaixaAnualView();
  const resumo = await resumoCaixaMes(cxMes,cxAno);
  const caixas = caixaConfig.caixas || CAIXAS_PADRAO;
  if(!caixaSelecionada) caixaSelecionada = 'giro';
  const totalManual = caixas.filter(c=>c.tipo!=='automatico').reduce((s,c)=>s+saldoCaixaManual(c.id,cxMes,cxAno),0);
  const totalGeral = totalManual + resumo.prov.saldoAtual;
  const pctTotal = totalPctCaixas();
  const caixaCards = caixas.map(c=>{
    const auto = c.tipo==='automatico';
    const saldo = auto ? resumo.prov.saldoAtual : saldoCaixaManual(c.id,cxMes,cxAno);
    const meta = auto ? 0 : metaCaixaDinamica(c,resumo);
    const sugestao = sugestaoCaixaDinamica(c,resumo);
    const progresso = meta>0 ? Math.min(100, Math.round(saldo/meta*100)) : 0;
    const selected = caixaSelecionada===c.id;
    const sub = c.id==='antecipados' ? `Defasagem: ${fmtValor(resumo.prov.defasagem||0)} · recompor: ${fmtValor(sugestao)}` : auto ? `Automático · liberou ${fmtValor(resumo.prov.liberado)} no mês` : c.id==='lucro' ? `Aguardando decisão · Sug.: ${fmtValor(sugestao)}` : `Sug.: ${fmtValor(sugestao)} · ${Number(c.pct||0)}%`;
    return `<div class="card" style="cursor:pointer;border-top:3px solid ${c.cor||'var(--texto-mid)'};${selected?'box-shadow:0 0 0 2px rgba(211,47,47,.16), var(--shadow-md)':''}" onclick="abrirCaixaPerfil('${c.id}')"><div class="card-label">${esc(c.nome)}</div><div class="card-value" style="font-size:24px;padding-top:4px;color:${c.cor||'var(--texto)'}">${fmtValor(saldo)}</div><div class="card-sub">${sub}</div>${cardContaCaixaHtml(c)}${!auto&&meta>0?`<div style="margin-top:10px"><div style="height:6px;background:var(--borda);border-radius:4px;overflow:hidden"><div style="height:100%;width:${progresso}%;background:${c.cor||'var(--vermelho)'}"></div></div><div style="font-size:10px;color:var(--texto-muted);margin-top:4px">Meta: ${fmtValor(meta)} · ${progresso}%</div></div>`:''}<div class="card-icon">${c.icon||'📦'}</div></div>`;
  }).join('');
  const selecionada = caixaById(caixaSelecionada);
  const perfil = renderPerfilCaixaHtmlV112(selecionada, resumo);
  const alertaPct = pctTotal!==100 ? `<div class="alert-bar atencao"><span class="alert-icon">⚙️</span><strong>Percentuais somam ${pctTotal}%.</strong>&nbsp;Ajuste em Configurar para fechar 100%, se quiser uma distribuição completa.</div>` : '';
  const alertaProv = resumo.prov.defasagem>0 ? `<div class="alert-bar urgente"><span class="alert-icon">🔒</span><strong>Provisionamento defasado em ${fmtValor(resumo.prov.defasagem)}.</strong>&nbsp;A sugestão automática vai recompor primeiro o pagamento antecipado antes de mandar dinheiro para as demais caixinhas.</div>` : '';
  document.getElementById('content').innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:12px"><div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">${seletorMesAnoHtml('caixa',cxMes,cxAno)}${renderCaixaVisaoToggle()}</div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-ghost btn-sm" onclick="editarValorBaseCaixa()">✏️ Editar valor base</button><button class="btn btn-success btn-sm" onclick="aplicarSugestaoCaixa()">Aplicar sugestão</button><button class="btn btn-ghost btn-sm" onclick="desfazerSugestaoCaixa()">Desfazer sugestão</button><button class="btn btn-primary btn-sm" onclick="abrirModalMovCaixa()">+ Movimentação</button><button class="btn btn-ghost btn-sm" onclick="abrirConfigCaixas()">Configurar</button></div></div>
    <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:12px 16px;font-size:13px;margin-bottom:16px"><strong>Menu Caixa.</strong> O resultado por competência orienta a distribuição. Pagamentos antecipados são provisionados automaticamente e liberados mês a mês. Se houver defasagem no provisionamento antigo, a recomposição vira prioridade.</div>
    ${alertaPct}${alertaProv}
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px;margin-bottom:22px"><div class="card c-green" style="border-top:3px solid var(--verde)"><div class="card-label">Resultado competência</div><div class="card-value" style="font-size:24px;padding-top:4px;color:${resumo.resComp>=0?'var(--verde)':'var(--vermelho)'}">${resumo.resComp>=0?'':'-'}${fmtValor(Math.abs(resumo.resComp))}</div><div class="card-sub">Receita ${fmtValor(resumo.recComp)} − despesas ${fmtValor(resumo.desp)}</div></div><div class="card" style="border-top:3px solid var(--azul)"><div class="card-label">Resultado de caixa</div><div class="card-value" style="font-size:24px;padding-top:4px;color:${resumo.resCx>=0?'var(--verde)':'var(--vermelho)'}">${resumo.resCx>=0?'':'-'}${fmtValor(Math.abs(resumo.resCx))}</div><div class="card-sub">Entradas líquidas ${fmtValor(resumo.recCx)} − despesas</div></div><div class="card" style="border-top:3px solid #92400e"><div class="card-label">Antecipado provisionado</div><div class="card-value" style="font-size:24px;padding-top:4px;color:#92400e">${fmtValor(resumo.prov.saldoAtual)}</div><div class="card-sub">Teórico: ${fmtValor(resumo.prov.teoricoAtual)} · defasagem: ${fmtValor(resumo.prov.defasagem||0)}</div></div><div class="card" style="border-top:3px solid var(--roxo)"><div class="card-label">Base da sugestão</div><div class="card-value" style="font-size:24px;padding-top:4px;color:var(--roxo)">${fmtValor(resumo.base)}</div><div class="card-sub">${resumo.ajuste?'manual':'competência'} · saldos em caixas: ${fmtValor(totalGeral)}</div></div></div>
    <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--texto-muted);margin-bottom:10px">Caixinhas</div><div class="cards-grid" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr));margin-bottom:22px">${caixaCards}</div>${renderResumoContasHtmlV112(resumo)}<div style="background:#f8fafc;border:1px solid var(--borda);border-radius:8px;padding:12px 16px;font-size:12px;color:var(--texto-muted);margin-bottom:16px">Metas técnicas: giro = 50% da média de despesas; reserva = 6 meses da média de despesas; manutenção = média de manutenção × 3. A sugestão mensal de todas as caixinhas editáveis segue o percentual configurado. Base histórica usada nas metas: ${resumo.intel.mesesBase} mês(es).</div>${perfil}`;
};
window.renderCaixaView = renderCaixaView;

async function precarregarCaixaEmSegundoPlano(){
  try{
    await carregarCaixaConfig();
    await carregarMovCaixa();
    await carregarAjustesCaixa();
    console.log('Dados do caixa pré-carregados.');
  } catch(e){ console.warn('Pré-carregamento do caixa falhou', e); }
}
window.precarregarCaixaEmSegundoPlano = precarregarCaixaEmSegundoPlano;



// ═══════════════════════════════════════════════════
// PATCH v11.3 — lucro no relatório, conta do lucro, recomposição visível e loadings
// ═══════════════════════════════════════════════════
normalizarCaixasV112 = function(){
  const aplicar = c => {
    if(c.id==='lucro') return {...c, nome:'Lucros a distribuir', icon:'💵', semConta:false, desc:'Lucro já apurado e ainda não destinado. Pode ficar acumulado em uma conta/local, ser transferido para uma caixinha ou ser realizado como distribuição para Fernando.'};
    if(c.id==='antecipados') return {...c, nome:'Pagamento antecipado provisionado', desc:'Dinheiro já recebido, mas ainda vinculado a meses futuros de contratos vendidos.'};
    return c;
  };
  for(let i=0;i<CAIXAS_PADRAO.length;i++) CAIXAS_PADRAO[i] = aplicar(CAIXAS_PADRAO[i]);
  if(caixaConfig && Array.isArray(caixaConfig.caixas)) caixaConfig.caixas = caixaConfig.caixas.map(aplicar);
};
window.normalizarCaixasV112 = normalizarCaixasV112;

contaCaixaLabel = function(c){ return contaCaixaNome(c); };
cardContaCaixaHtml = function(c){ return `<div style="font-size:10px;color:var(--texto-muted);margin-top:5px">📍 ${esc(contaCaixaNome(c))}</div>`; };

function resumoPorContasCaixaV113(resumo){
  const mapa = {};
  (caixaConfig?.caixas||CAIXAS_PADRAO).forEach(c=>{
    const conta = contaCaixaNome(c);
    const valor = c.id==='antecipados' ? Number(resumo?.prov?.saldoAtual||0) : saldoCaixaManual(c.id,cxMes,cxAno);
    if(!mapa[conta]) mapa[conta]={total:0,itens:[]};
    mapa[conta].total += valor;
    mapa[conta].itens.push({nome:c.nome, icon:c.icon, valor});
  });
  return mapa;
}
resumoPorContasCaixa = resumoPorContasCaixaV113;

function renderResumoContasHtmlV113(resumo){
  const mapa = resumoPorContasCaixaV113(resumo);
  const linhas = Object.entries(mapa).map(([conta,d])=>`<div style="border:1px solid var(--borda);border-radius:8px;padding:12px;background:#fff"><div style="display:flex;justify-content:space-between;gap:10px"><strong>${esc(conta)}</strong><strong>${fmtValor(d.total)}</strong></div><div style="margin-top:8px;font-size:11px;color:var(--texto-muted)">${d.itens.map(i=>`${i.icon||'📦'} ${esc(i.nome)}: <strong>${fmtValor(i.valor)}</strong>`).join(' · ')}</div></div>`).join('');
  return `<div class="section-box" style="margin-bottom:18px"><div class="section-header"><div><div class="section-title">Resumo por conta/local</div><div style="font-size:12px;color:var(--texto-muted)">Mostra onde está o dinheiro das caixinhas, inclusive lucros acumulados ainda não distribuídos.</div></div></div><div style="padding:16px 24px;display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px">${linhas||'<div style="color:var(--texto-muted)">Nenhuma conta/local informada.</div>'}</div></div>`;
}
renderResumoContasHtml = renderResumoContasHtmlV113;
renderResumoContasHtmlV112 = renderResumoContasHtmlV113;
window.renderResumoContasHtml = renderResumoContasHtmlV113;

function movimentosDistribuicaoLucroMesV113(mes,ano){
  const ini = dataMesInicio(mes,ano), fim = dataMesFim(mes,ano);
  return (caixaMovs||[]).filter(m=>m.status!=='excluido' && m.tipo==='distribuicao_lucro' && m.data && dataLocal(m.data)>=ini && dataLocal(m.data)<=fim)
    .sort((a,b)=>dataLocal(a.data)-dataLocal(b.data));
}
function totalDistribuicaoLucroMesV113(mes,ano){ return movimentosDistribuicaoLucroMesV113(mes,ano).reduce((s,m)=>s+Number(m.valor||0),0); }
function movimentosDestinoLucroMesV113(mes,ano){
  const ini = dataMesInicio(mes,ano), fim = dataMesFim(mes,ano);
  return (caixaMovs||[]).filter(m=>m.status!=='excluido' && m.data && dataLocal(m.data)>=ini && dataLocal(m.data)<=fim && (m.origem==='lucro' || m.destino==='lucro' || m.caixaId==='lucro'))
    .sort((a,b)=>dataLocal(a.data)-dataLocal(b.data));
}

function renderAntecipadosRowsV113(){
  const prov = resumoProvisaoAntecipados(cxMes,cxAno);
  const movs = movimentosCaixaSelecionada('antecipados',cxMes,cxAno);
  const movRows = movs.map(m=>{
    const v = valorMovParaCaixa(m,'antecipados');
    return `<tr style="background:${m.tipo==='recomposicao_antecipado'?'#f0fdf4':'#fff'}"><td>${fmtData(m.data)}<div style="font-size:10px;color:var(--texto-muted)">${esc(labelTipoMov(m.tipo))}</div></td><td><strong>${esc(m.descricao||labelTipoMov(m.tipo))}</strong><div style="font-size:11px;color:var(--texto-muted)">Movimentação registrada no caixa do mês.</div></td><td style="font-weight:700;color:${v>=0?'var(--verde)':'var(--vermelho)'}">${v>=0?'+':'-'}${fmtValor(Math.abs(v))}</td><td><button class="desp-btn" title="Editar" onclick="abrirModalMovCaixa('antecipados','${m.id}')">✏️</button><button class="desp-btn" title="Excluir" onclick="excluirMovCaixa('${m.id}')">🗑</button></td></tr>`;
  }).join('');
  const ajuste = prov.ajuste;
  const resumoAjuste = ajuste ? `<tr style="background:#fff7ed"><td><strong>Ajuste de implantação</strong><div style="font-size:11px;color:#92400e">Corte em ${nomeMesAno(Number(ajuste.mes),Number(ajuste.ano))}. Teórico no corte: ${fmtValor(ajuste.teoricoNoCorte||0)} · real informado: ${fmtValor(ajuste.saldoProvisionadoManual ?? ajuste.saldoReal ?? 0)}.</div></td><td>Saldo gerencial</td><td style="font-weight:700;color:#92400e">${fmtValor(prov.saldoAtual)}</td><td><button class="desp-btn" onclick="ajustarProvisaoAntecipada()">✏️</button></td></tr>` : '';
  const alerta = `<tr style="background:${prov.defasagem>0?'#fef2f2':'#f0fdf4'}"><td><strong>${prov.defasagem>0?'Recomposição necessária':'Provisionamento equilibrado'}</strong><div style="font-size:11px;color:${prov.defasagem>0?'#991b1b':'#166534'}">Teórico: ${fmtValor(prov.teoricoAtual)} · reservado: ${fmtValor(prov.saldoAtual)} · diferença: ${fmtValor(prov.defasagem)}.</div></td><td>${prov.defasagem>0?'A sugestão do mês deve priorizar esta recomposição.':'O saldo reservado cobre o valor protegido.'}</td><td style="font-weight:700;color:${prov.defasagem>0?'#991b1b':'#166534'}">${fmtValor(prov.defasagem)}</td><td></td></tr>`;
  const contratoRows = contratos.filter(c=>saldoAntecipadoContratoFimMes(c,cxMes,cxAno)>0).sort((a,b)=>saldoAntecipadoContratoFimMes(b,cxMes,cxAno)-saldoAntecipadoContratoFimMes(a,cxMes,cxAno)).map(c=>`<tr><td><strong>${esc(c.alunoNome||'—')}</strong></td><td>${esc(nomeContrato(c))}<div style="font-size:11px;color:var(--texto-muted)">${fmtData(c.inicio)} → ${fmtData(vencAjustadoContrato(c))} · mensalidade ${fmtValor(mensalidadeContrato(c))}</div></td><td style="font-weight:700;color:#92400e">${fmtValor(saldoAntecipadoContratoFimMes(c,cxMes,cxAno))}</td><td></td></tr>`).join('');
  return movRows + alerta + resumoAjuste + (contratoRows || `<tr><td colspan="4"><div class="empty">Nenhum contrato com provisionamento teórico neste mês.</div></td></tr>`);
}
renderAntecipadosRows = renderAntecipadosRowsV113;
renderAntecipadosRowsV11 = renderAntecipadosRowsV113;
window.renderAntecipadosRows = renderAntecipadosRowsV113;

function renderPerfilCaixaHtmlV113(c, resumo){
  const auto = c.tipo==='automatico';
  const isLucro = c.id==='lucro';
  const saldo = auto ? resumo.prov.saldoAtual : saldoCaixaManual(c.id,cxMes,cxAno);
  const meta = auto ? 0 : metaCaixaDinamica(c,resumo);
  const sugestao = sugestaoCaixaDinamica(c,resumo);
  const movimentos = auto ? [] : movimentosCaixaSelecionada(c.id,cxMes,cxAno);
  const rows = auto ? renderAntecipadosRowsV113() : movimentos.map(m=>{
    const v = valorMovParaCaixa(m,c.id);
    return `<tr><td>${fmtData(m.data)}</td><td><strong>${esc(labelTipoMov(m.tipo))}</strong><div style="font-size:11px;color:var(--texto-muted)">${esc(m.descricao||'—')}${m.origem||m.destino?` · ${m.origem?`Origem: ${esc(caixaById(m.origem).nome||m.origem)}`:''}${m.destino?` · Destino: ${esc(caixaById(m.destino).nome||m.destino)}`:''}`:''}</div></td><td style="font-weight:700;color:${v>=0?'var(--verde)':'var(--vermelho)'}">${v>=0?'+':'-'}${fmtValor(Math.abs(v))}</td><td><button class="desp-btn" title="Editar" onclick="abrirModalMovCaixa('${c.id}','${m.id}')">✏️</button><button class="desp-btn" title="Excluir" onclick="excluirMovCaixa('${m.id}')">🗑</button></td></tr>`;
  }).join('');
  const boxAuto = auto ? `<div style="margin-top:8px;background:#fffbeb;border:1px solid #fde68a;border-radius:6px;padding:8px 10px;font-size:12px;color:#92400e"><strong>Por que não mexer direto?</strong> Este dinheiro já entrou no caixa, mas pertence a meses futuros. Se o saldo real estiver abaixo do teórico, a recomposição deve ser priorizada e fica registrada no extrato da caixinha.</div>${resumo.prov.defasagem>0?`<div style="margin-top:8px;background:#fef2f2;border:1px solid #fecaca;border-radius:6px;padding:8px 10px;font-size:12px;color:#991b1b"><strong>Prioridade:</strong> faltam ${fmtValor(resumo.prov.defasagem)} para recompor o pagamento antecipado provisionado.</div>`:''}` : '';
  const boxLucro = isLucro ? `<div style="margin-top:8px;background:#f8fafc;border:1px solid var(--borda);border-radius:6px;padding:8px 10px;font-size:12px;color:var(--texto-mid)"><strong>Como usar:</strong> se o lucro não for retirado, ele pode ficar acumulado aqui em uma conta/local. Quando Fernando transferir para a conta pessoal, registre como lucro realizado. Também é possível transferir para outra caixinha.</div>` : '';
  const botoes = auto
    ? `<button class="btn btn-ghost btn-sm" onclick="abrirConfigCaixas('${c.id}')">Editar conta/local</button><button class="btn btn-primary btn-sm" onclick="ajustarProvisaoAntecipada()">Ajustar saldo real</button>${resumo.prov.ajuste?`<button class="btn btn-ghost btn-sm" onclick="removerAjusteProvisao()">Remover ajuste</button>`:''}`
    : isLucro
      ? `<button class="btn btn-primary btn-sm" onclick="abrirModalMovCaixa('lucro',null,'distribuicao_lucro')">Realizar distribuição</button><button class="btn btn-ghost btn-sm" onclick="abrirModalMovCaixa('lucro',null,'transferencia')">Transferir para caixinha</button><button class="btn btn-ghost btn-sm" onclick="abrirConfigCaixas('${c.id}')">Editar %/conta</button>`
      : `<button class="btn btn-ghost btn-sm" onclick="abrirConfigCaixas('${c.id}')">Editar meta/%/conta</button><button class="btn btn-primary btn-sm" onclick="abrirModalMovCaixa('${c.id}')">+ Movimento</button>`;
  const cardsAuto = `<div><div class="card-label">Saldo teórico</div><div style="font-family:'Bebas Neue';font-size:26px;color:#92400e">${fmtValor(resumo.prov.teoricoAtual)}</div></div><div><div class="card-label">Defasagem</div><div style="font-family:'Bebas Neue';font-size:26px;color:${resumo.prov.defasagem>0?'var(--vermelho)':'var(--verde)'}">${fmtValor(resumo.prov.defasagem)}</div></div><div><div class="card-label">Liberado no mês</div><div style="font-family:'Bebas Neue';font-size:26px;color:var(--verde)">${fmtValor(resumo.prov.liberado)}</div></div>`;
  return `<div class="section-box"><div class="section-header"><div><div class="section-title">${c.icon||'📦'} ${esc(c.nome)}</div><div style="font-size:12px;color:var(--texto-muted);max-width:720px">${esc(c.desc||'')}</div><div style="font-size:11px;color:var(--texto-muted);margin-top:4px">📍 Conta/local: <strong>${esc(contaCaixaNome(c))}</strong></div>${boxAuto}${boxLucro}</div><div style="display:flex;gap:8px;flex-wrap:wrap">${botoes}</div></div>
    <div style="padding:16px 24px;display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:14px;border-bottom:1px solid var(--borda)">
      <div><div class="card-label">Saldo atual</div><div style="font-family:'Bebas Neue';font-size:26px;color:${c.cor||'var(--texto)'}">${fmtValor(saldo)}</div></div>
      ${auto?cardsAuto:`<div><div class="card-label">Sugestão do mês</div><div style="font-family:'Bebas Neue';font-size:26px;color:var(--verde)">${fmtValor(sugestao)}</div><div style="font-size:11px;color:var(--texto-muted)">${Number(c.pct||0)}% da base</div></div><div><div class="card-label">Meta</div><div style="font-family:'Bebas Neue';font-size:26px">${meta>0?fmtValor(meta):'—'}</div><div style="font-size:11px;color:var(--texto-muted)">${Number(c.metaMeses||0)>0?`${c.metaMeses} mês(es) de despesas`:'valor livre/editável'}</div></div>`}
    </div>
    <div class="table-wrap"><table><thead><tr>${auto?'<th>Registro</th><th>Descrição / contrato</th><th>Valor</th><th>Ações</th>':'<th>Data</th><th>Movimentação</th><th>Valor</th><th>Ações</th>'}</tr></thead><tbody>${rows || `<tr><td colspan="4"><div class="empty">Nenhuma movimentação nesta caixinha no mês selecionado.</div></td></tr>`}</tbody></table></div></div>`;
}
renderPerfilCaixaHtml = renderPerfilCaixaHtmlV113;
renderPerfilCaixaHtmlV112 = renderPerfilCaixaHtmlV113;
window.renderPerfilCaixaHtml = renderPerfilCaixaHtmlV113;

window.abrirConfigCaixas = async function(focoId=null){
  return busyRun('Carregando configuração...', async ()=>{
    await carregarCaixaConfig();
    const resumo = await resumoCaixaMes(cxMes,cxAno);
    const linhas = caixaConfig.caixas.map(c=>{
      const contaHtml = `<div class="form-group full"><label class="form-label">Conta/local</label><input class="form-input" type="text" id="cfg-conta-${c.id}" value="${esc(contaCaixaNome(c)==='Conta não informada'?'':contaCaixaNome(c))}" placeholder="Ex: Itaú, Banco do Brasil, Fintech Pay..."></div>`;
      const extra = c.tipo==='automatico' ? `<div class="form-group full"><div class="form-hint">Caixinha automática: o saldo vem dos pagamentos antecipados provisionados. A conta/local indica onde esse dinheiro está guardado.</div></div>` : `<div class="form-group"><label class="form-label">% da sugestão</label><input class="form-input" type="number" step="0.01" id="cfg-pct-${c.id}" value="${Number(c.pct||0)}"></div><div class="form-group"><label class="form-label">Meta fixa (R$)</label><input class="form-input" type="number" step="0.01" id="cfg-meta-${c.id}" value="${Number(c.metaValor||0)}"></div><div class="form-group full"><label class="form-label">Meta em meses de despesas</label><input class="form-input" type="number" step="0.1" id="cfg-meses-${c.id}" value="${Number(c.metaMeses||0)}"><div class="form-hint">Meta técnica atual: ${fmtValor(metaCaixaDinamica(c,resumo))}. A técnica usa histórico de até 12 meses; metas fixas continuam editáveis.</div></div>`;
      return `<div style="border:1px solid var(--borda);border-radius:8px;padding:12px;margin-bottom:10px;background:${focoId===c.id?'#fff7ed':'#fff'}"><div style="font-weight:700;margin-bottom:8px">${c.icon||'📦'} ${esc(c.nome)}</div><div class="form-grid">${contaHtml}${extra}</div></div>`;
    }).join('');
    const html = `<div style="position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:460;display:flex;align-items:center;justify-content:center;padding:16px" id="modal-config-caixa"><div style="background:#fff;border-radius:12px;width:100%;max-width:720px;max-height:88vh;overflow-y:auto;box-shadow:var(--shadow-lg)"><div style="padding:20px 24px;border-bottom:1px solid var(--borda);display:flex;justify-content:space-between;align-items:center"><div><div style="font-family:'Bebas Neue';font-size:22px">Configurar Caixinhas</div><div style="font-size:12px;color:var(--texto-muted)">Percentuais, metas e contas/locais são editáveis. Lucros acumulados também precisam de conta/local.</div></div><button class="modal-close" onclick="document.getElementById('modal-config-caixa').remove()">✕</button></div><div style="padding:18px 24px">${linhas}<div style="font-size:12px;color:var(--texto-muted);margin-top:8px">Soma atual dos percentuais: <strong>${totalPctCaixas()}%</strong></div></div><div class="modal-footer"><button class="btn btn-ghost" onclick="document.getElementById('modal-config-caixa').remove()">Cancelar</button><button class="btn btn-primary" onclick="confirmarConfigCaixas()">Salvar</button></div></div></div>`;
    document.body.insertAdjacentHTML('beforeend', html);
  });
};

window.confirmarConfigCaixas = async function(){
  return busyRun('Salvando configuração...', async ()=>{
    caixaConfig.caixas = caixaConfig.caixas.map(c=>{
      const conta = document.getElementById(`cfg-conta-${c.id}`)?.value?.trim() || '';
      if(c.tipo==='automatico') return {...c, conta};
      return {...c, conta, pct:Number(document.getElementById(`cfg-pct-${c.id}`)?.value||0), metaValor:Number(document.getElementById(`cfg-meta-${c.id}`)?.value||0), metaMeses:Number(document.getElementById(`cfg-meses-${c.id}`)?.value||0)};
    });
    await salvarCaixaConfig();
    document.getElementById('modal-config-caixa')?.remove();
    toast('Configuração das caixas salva ✓'); renderCaixaView();
  });
};

window.editarValorBaseCaixa = async function(){
  showBusy('Carregando valor base...');
  const resumo = await resumoCaixaMes(cxMes,cxAno);
  hideBusy();
  const atual = resumo.ajuste?.valorBaseManual ?? resumo.baseAuto;
  const valor = prompt(`Valor base para sugestão em ${nomeMesAno(cxMes,cxAno)}:`, String(Number(atual||0).toFixed(2)));
  if(valor===null) return;
  const n = Number(String(valor).replace(',','.'));
  if(isNaN(n) || n<0){ toast('Valor inválido.'); return; }
  return busyRun('Salvando valor base...', async ()=>{
    const chave = chaveMesCaixa(cxMes,cxAno);
    const reg = {id:chave, mes:cxMes, ano:cxAno, valorBaseManual:n, atualizadoEm:new Date().toISOString()};
    caixaAjustes[chave]=reg;
    await setDoc(doc(db,'caixa_ajustes',chave), reg);
    toast('Valor base ajustado ✓'); renderCaixaView();
  });
};

const abrirModalMovCaixaBaseV113 = window.abrirModalMovCaixa;
window.abrirModalMovCaixa = async function(defaultCaixa=null, movId=null, tipoPadrao=null){
  return busyRun('Carregando movimentação...', async ()=>{
    await abrirModalMovCaixaBaseV113(defaultCaixa, movId);
    if(tipoPadrao && !movId){
      const sel = document.getElementById('mov-tipo');
      if(sel){ sel.value = tipoPadrao; atualizarCamposMovCaixa(); }
    }
  });
};
const confirmarMovCaixaBaseV113 = window.confirmarMovCaixa;
window.confirmarMovCaixa = async function(...args){ return busyRun('Salvando movimentação...', async ()=>confirmarMovCaixaBaseV113(...args)); };
const excluirMovCaixaBaseV113 = window.excluirMovCaixa;
window.excluirMovCaixa = async function(...args){ return busyRun('Excluindo movimentação...', async ()=>excluirMovCaixaBaseV113(...args)); };
window.setVisaoCaixa = function(v){ caixaVisao=v; return busyRun('Carregando visão...', async ()=>renderCaixaView()); };

// V23 — correção do botão de impressão do Financeiro
// Abre a janela durante o clique para evitar bloqueio de pop-up e usa o mês/ano financeiro selecionado.
imprimirDRE = async function(){
  const w = window.open('', '_blank');
  if (!w) {
    alert('O navegador bloqueou a janela de impressão. Libere pop-ups para este site e tente novamente.');
    return;
  }

  w.document.write(`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Gerando resumo financeiro...</title></head><body style="font-family:Arial,sans-serif;padding:32px;color:#555">Gerando resumo financeiro...</body></html>`);
  w.document.close();

  try {
    return await busyRun('Gerando impressão...', async ()=>{
    await carregarMovCaixa(true);
    const cats = await loadDespesas(finMes, finAno);
    const receita = receitaDoMesSelecionada(finMes, finAno);
    const receitaComp = receitaMesEsp(finMes, finAno);
    const receitaCx = receitaCaixaMes(finMes, finAno);
    const totDesp = totalDesp(cats);
    const resultado = receita - totDesp;
    const resPos = resultado >= 0;
    const contratosMes = contratos.filter(c=>contratoContaCompetenciaMes(c,finMes,finAno));
    const pgsMes = pagamentos.filter(p=>p.status!=='excluido' && p.data && dataLocal(p.data)>=dataMesInicio(finMes,finAno) && dataLocal(p.data)<=dataMesFim(finMes,finAno));
    const linhasReceita = financeiroModo==='caixa'
      ? pgsMes.map(p=>`<tr><td>${esc(p.alunoNome||'—')}<div style="font-size:11px;color:#777">${fmtData(p.data)} · ${esc(p.descricao||p.tipo||'Pagamento')} · ${esc(p.forma||'')}</div></td><td style="text-align:right;color:#2e7d32"><strong>${fmtValor(p.valor)}</strong></td></tr>`).join('')
      : contratosMes.map(c=>`<tr><td>${esc(c.alunoNome||'—')}<div style="font-size:11px;color:#777">${esc(nomeContrato(c))} · ${competenciaResumoContratoMesV18(c,finMes,finAno)}</div></td><td style="text-align:right;color:#2e7d32"><strong>${fmtValor(mensalidadeContrato(c))}</strong></td></tr>`).join('') + aulasExtrasMes(finMes,finAno).map(p=>`<tr><td>${esc(p.alunoNome||'—')}<div style="font-size:11px;color:#777">Aula extra · ${fmtData(p.data)} · ${esc(p.descricao||'')}</div></td><td style="text-align:right;color:#2e7d32"><strong>${fmtValor(p.valor)}</strong></td></tr>`).join('');
    const linhasDesp = Object.entries(cats).flatMap(([cat,arr])=>(arr||[]).map(d=>`<tr><td>${esc(d.desc)}<div style="font-size:11px;color:#777">${esc(cat)}</div></td><td style="text-align:right;color:#D32F2F"><strong>${fmtValor(d.valor)}</strong></td></tr>`)).join('');
    const linhasTaxa = pagamentosCartaoMes(finMes,finAno).filter(p=>valorTaxaCartao(p)>0).map(p=>`<tr><td>${esc(p.alunoNome||'—')}<div style="font-size:11px;color:#777">${fmtData(p.data)} · bruto ${fmtValor(p.valorBruto||p.valor)} · líquido ${fmtValor(p.valor)}${p.parcelas?` · ${p.parcelas}x`:''}</div></td><td style="text-align:right">${fmtValor(valorTaxaCartao(p))}</td></tr>`).join('');
    const totTaxa = totalTaxaCartaoMes(finMes,finAno);
    const distLucro = movimentosDistribuicaoLucroMesV113(finMes,finAno);
    const totDist = totalDistribuicaoLucroMesV113(finMes,finAno);
    const lucroMovs = movimentosDestinoLucroMesV113(finMes,finAno);
    const linhasLucro = distLucro.map(m=>`<tr><td>${fmtData(m.data)}<div style="font-size:11px;color:#777">${esc(m.descricao||'Distribuição de lucro realizada')}</div></td><td style="text-align:right;color:#D32F2F"><strong>${fmtValor(m.valor)}</strong></td></tr>`).join('');
    const linhasDestinoLucro = lucroMovs.filter(m=>m.tipo!=='distribuicao_lucro').map(m=>`<tr><td>${fmtData(m.data)}<div style="font-size:11px;color:#777">${esc(labelTipoMov(m.tipo))} · ${esc(m.descricao||'')}</div></td><td style="text-align:right"><strong>${fmtValor(m.valor)}</strong></td></tr>`).join('');
    const dataImpressao = new Date().toLocaleDateString('pt-BR');
    const htmlPrint = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Resumo Financeiro — ${MESES_NOMES[finMes]} ${finAno}</title><style>@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700&display=swap');*{box-sizing:border-box}body{font-family:Barlow,Arial,sans-serif;font-size:13px;color:#111;background:#fff;padding:32px;max-width:780px;margin:0 auto}table{width:100%;border-collapse:collapse;border:1px solid #eee}td,th{padding:7px 8px;border-bottom:1px solid #eee}th{text-align:left;color:#777;font-size:11px;text-transform:uppercase}.logo{font-family:'Bebas Neue';font-size:36px}.logo span{color:#D32F2F}.header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #111;padding-bottom:18px;margin-bottom:22px}.title{font-family:'Bebas Neue';font-size:24px;color:#D32F2F}.cards{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:22px}.card{border:1px solid #eee;border-radius:8px;padding:12px}.label{font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#999}.value{font-family:'Bebas Neue';font-size:22px}.sec{margin-bottom:22px}.sec-title{background:#111;color:#fff;font-family:'Bebas Neue';font-size:16px;padding:8px 10px;border-radius:4px 4px 0 0}.result{border:2px solid ${resPos?'#2e7d32':'#D32F2F'};border-radius:8px;padding:16px 18px;display:flex;justify-content:space-between;align-items:center;background:${resPos?'rgba(46,125,50,.05)':'rgba(211,47,47,.05)'}}.btn{display:block;margin:0 auto 18px;padding:10px 24px;background:#D32F2F;color:#fff;border:0;border-radius:6px;font-weight:700}@media print{body{padding:14px}.no-print{display:none}.cards{grid-template-columns:repeat(2,1fr)}}</style></head><body><button class="btn no-print" onclick="window.print()">🖨️ Imprimir / Salvar PDF</button><div class="header"><div><div class="logo">studio <span>FB</span></div><div style="font-size:10px;color:#999;letter-spacing:3px;text-transform:uppercase">Saúde &amp; Movimento</div></div><div style="text-align:right"><div class="title">Resumo Financeiro</div><div>${MESES_NOMES[finMes]} de ${finAno}</div><div style="font-size:11px;color:#999">Emitido em ${dataImpressao} · Visão: ${financeiroModo==='competencia'?'Competência':'Caixa'}</div></div></div><div class="cards"><div class="card"><div class="label">Receita</div><div class="value" style="color:#2e7d32">${fmtValor(receita)}</div><div style="font-size:11px;color:#777">Comp. ${fmtValor(receitaComp)} · Caixa ${fmtValor(receitaCx)}</div></div><div class="card"><div class="label">Despesas</div><div class="value" style="color:#D32F2F">${fmtValor(totDesp)}</div></div><div class="card"><div class="label">Resultado</div><div class="value" style="color:${resPos?'#2e7d32':'#D32F2F'}">${resPos?'':'-'}${fmtValor(Math.abs(resultado))}</div></div><div class="card"><div class="label">Lucro distribuído</div><div class="value" style="color:#D32F2F">${fmtValor(totDist)}</div><div style="font-size:11px;color:#777">Informar à contadora</div></div></div><div class="sec"><div class="sec-title">Receita — ${financeiroModo==='competencia'?'Competência':'Caixa'}</div><table><thead><tr><th>Descrição</th><th style="text-align:right">Valor</th></tr></thead><tbody>${linhasReceita||'<tr><td colspan="2">Nenhuma receita.</td></tr>'}</tbody><tfoot><tr><td><strong>Total receita</strong></td><td style="text-align:right;color:#2e7d32"><strong>${fmtValor(receita)}</strong></td></tr></tfoot></table></div><div class="sec"><div class="sec-title">Despesas discriminadas</div><table><tbody>${linhasDesp||'<tr><td>Nenhuma despesa.</td><td style="text-align:right">R$ 0,00</td></tr>'}</tbody><tfoot><tr><td><strong>Total despesas</strong></td><td style="text-align:right;color:#D32F2F"><strong>${fmtValor(totDesp)}</strong></td></tr></tfoot></table></div><div class="sec"><div class="sec-title">Distribuição de lucro — controle para contadora</div><table><tbody>${linhasLucro||'<tr><td>Nenhuma distribuição de lucro realizada neste mês.</td><td style="text-align:right">R$ 0,00</td></tr>'}</tbody><tfoot><tr><td><strong>Total distribuído para Fernando</strong></td><td style="text-align:right;color:#D32F2F"><strong>${fmtValor(totDist)}</strong></td></tr></tfoot></table><div style="font-size:11px;color:#777;margin-top:6px">Este valor não é despesa operacional. É destinação do lucro após o resultado do mês.</div>${linhasDestinoLucro?`<div style="margin-top:10px;font-size:12px;color:#555"><strong>Outras destinações do lucro no mês:</strong></div><table style="margin-top:6px"><tbody>${linhasDestinoLucro}</tbody></table>`:''}</div><div class="sec"><div class="sec-title">Taxas de cartão — informativo</div><table><tbody>${linhasTaxa||'<tr><td>Nenhuma taxa de cartão registrada no mês.</td><td style="text-align:right">R$ 0,00</td></tr>'}</tbody><tfoot><tr><td><strong>Total informativo</strong></td><td style="text-align:right;color:#b45309"><strong>${fmtValor(totTaxa)}</strong></td></tr></tfoot></table><div style="font-size:11px;color:#777;margin-top:6px">Essas taxas não entram no total de despesas nem no resultado.</div></div><div class="result"><div><div style="font-family:'Bebas Neue';font-size:18px;color:${resPos?'#2e7d32':'#D32F2F'}">${resPos?'Resultado positivo':'Resultado negativo'}</div><div style="font-size:12px;color:#777">Receita ${fmtValor(receita)} − Despesas ${fmtValor(totDesp)}</div></div><div style="font-family:'Bebas Neue';font-size:28px;color:${resPos?'#2e7d32':'#D32F2F'}">${resPos?'':'-'}${fmtValor(Math.abs(resultado))}</div></div></body></html>`;
      if (w.closed) return;
      w.document.open();
      w.document.write(htmlPrint);
      w.document.close();
      w.focus();
    });
  } catch (erro) {
    console.error('Erro ao gerar o resumo financeiro para impressão:', erro);
    if (!w.closed) w.close();
    alert('Não foi possível gerar o resumo para impressão. Tente novamente.');
  }
};
window.imprimirDRE = imprimirDRE;



// ═══════════════════════════════════════════════════
// V12 — ACOMPANHAMENTO DE DESTINAÇÃO DO RESULTADO + OTIMIZAÇÕES
// ═══════════════════════════════════════════════════
let resumoCaixaCacheV12 = {};
function chaveResumoCaixaV12(mes, ano){ return `${ano}_${String(mes).padStart(2,'0')}`; }
function limparCacheCaixaV12(){ resumoCaixaCacheV12 = {}; }

const resumoCaixaMesBaseV12 = resumoCaixaMes;
resumoCaixaMes = async function(mes=cxMes, ano=cxAno){
  const chave = chaveResumoCaixaV12(mes, ano);
  if(resumoCaixaCacheV12[chave]) return resumoCaixaCacheV12[chave];
  const r = await resumoCaixaMesBaseV12(mes, ano);
  resumoCaixaCacheV12[chave] = r;
  return r;
};
window.resumoCaixaMes = resumoCaixaMes;

const salvarMovCaixaBaseV12 = salvarMovCaixa;
salvarMovCaixa = async function(m){
  limparCacheCaixaV12();
  return salvarMovCaixaBaseV12(m);
};
window.salvarMovCaixa = salvarMovCaixa;

const salvarCaixaConfigBaseV12 = salvarCaixaConfig;
salvarCaixaConfig = async function(){
  limparCacheCaixaV12();
  return salvarCaixaConfigBaseV12();
};
window.salvarCaixaConfig = salvarCaixaConfig;

function movimentosDestinacaoResultadoMesV12(mes=cxMes, ano=cxAno){
  const movs = movimentosDoMesCaixa(mes, ano);
  return movs.filter(m => {
    if(m.status==='excluido') return false;
    const tipo = m.tipo || '';
    if(['sugestao_auto','recomposicao_antecipado','distribuicao_lucro'].includes(tipo)) return true;
    if(tipo==='transferencia' && (m.origem==='lucro' || m.caixaId==='lucro')) return true;
    // Entrada manual em uma caixinha também pode ser usada quando Fernando destinar o resultado um por um.
    if(tipo==='entrada_manual' && m.destino && m.destino!=='lucro') return true;
    return false;
  });
}

function valorDestinadoResultadoMesV12(mes=cxMes, ano=cxAno){
  return movimentosDestinacaoResultadoMesV12(mes, ano).reduce((acc,m)=>acc+Math.abs(Number(m.valor||0)),0);
}

function renderAcompanhamentoDestinacaoV12(resumo){
  const base = Math.max(0, Number(resumo?.base||0));
  const destinado = valorDestinadoResultadoMesV12(cxMes, cxAno);
  const restante = Math.max(0, base - destinado);
  const excedente = Math.max(0, destinado - base);
  const pct = base>0 ? Math.min(100, Math.round((Math.min(destinado,base)/base)*100)) : 0;
  const movs = movimentosDestinacaoResultadoMesV12(cxMes,cxAno).sort((a,b)=>new Date(a.data)-new Date(b.data));
  const linhas = movs.length ? movs.map(m=>{
    const destino = m.tipo==='distribuicao_lucro'
      ? 'Conta pessoal / lucro realizado'
      : m.tipo==='recomposicao_antecipado'
        ? 'Pagamento antecipado provisionado'
        : caixaById(m.destino||m.caixaId||m.origem)?.nome || m.destino || m.caixaId || m.origem || '—';
    return `<tr><td>${fmtData(m.data)}</td><td><strong>${esc(labelTipoMov(m.tipo))}</strong><div style="font-size:11px;color:var(--texto-muted)">${esc(m.descricao||'Destinação do resultado')} · Destino: ${esc(destino)}</div></td><td style="text-align:right;font-weight:700;color:var(--verde)">${fmtValor(Math.abs(Number(m.valor||0)))}</td></tr>`;
  }).join('') : `<tr><td colspan="3"><div style="padding:18px;text-align:center;color:var(--texto-muted)">Nenhuma destinação registrada para este resultado ainda.</div></td></tr>`;
  const alerta = restante>0
    ? `<div style="background:#fffbeb;border:1px solid #fde68a;color:#92400e;border-radius:8px;padding:10px 12px;font-size:12px;margin-top:12px"><strong>Ainda falta destinar ${fmtValor(restante)}.</strong> Fernando pode aplicar a sugestão automática ou lançar manualmente para reserva, giro, manutenção, investimentos, provisionamento ou lucro realizado.</div>`
    : excedente>0
      ? `<div style="background:#fff7ed;border:1px solid #fed7aa;color:#9a3412;border-radius:8px;padding:10px 12px;font-size:12px;margin-top:12px"><strong>Destinação acima da base em ${fmtValor(excedente)}.</strong> Pode ser intencional, mas vale conferir se não houve lançamento duplicado.</div>`
      : `<div style="background:#f0fdf4;border:1px solid #bbf7d0;color:#166534;border-radius:8px;padding:10px 12px;font-size:12px;margin-top:12px"><strong>Resultado totalmente destinado.</strong> O mês já tem uma decisão de caixa registrada.</div>`;
  return `<div class="section-box" style="margin-bottom:22px"><div class="section-header"><div><div class="section-title">Destinação do resultado do mês</div><div style="font-size:12px;color:var(--texto-muted)">Acompanhe quanto do resultado base já foi direcionado para as caixinhas, recomposição ou distribuição.</div></div></div><div style="padding:18px 24px"><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-bottom:14px"><div style="background:#f9fafb;border:1px solid var(--borda);border-radius:8px;padding:12px"><div class="card-label">Resultado base</div><div style="font-weight:800;font-size:18px;color:var(--roxo)">${fmtValor(base)}</div></div><div style="background:#f9fafb;border:1px solid var(--borda);border-radius:8px;padding:12px"><div class="card-label">Já destinado</div><div style="font-weight:800;font-size:18px;color:var(--verde)">${fmtValor(destinado)}</div></div><div style="background:#f9fafb;border:1px solid var(--borda);border-radius:8px;padding:12px"><div class="card-label">Falta destinar</div><div style="font-weight:800;font-size:18px;color:${restante>0?'#b45309':'var(--verde)'}">${fmtValor(restante)}</div></div></div><div style="height:10px;background:var(--borda);border-radius:999px;overflow:hidden"><div style="height:100%;width:${pct}%;background:${restante>0?'var(--amarelo)':'var(--verde)'};border-radius:999px;transition:width .25s"></div></div><div style="display:flex;justify-content:space-between;font-size:11px;color:var(--texto-muted);margin-top:5px"><span>${pct}% destinado</span><span>${excedente>0?`Excedente: ${fmtValor(excedente)}`:`Base: ${fmtValor(base)}`}</span></div>${alerta}<div class="table-wrap" style="margin-top:14px"><table><thead><tr><th>Data</th><th>Movimentação</th><th style="text-align:right">Valor</th></tr></thead><tbody>${linhas}</tbody></table></div></div></div>`;
}

const renderCaixaViewBaseV12 = renderCaixaView;
renderCaixaView = async function(){
  ensureCaixaMenu();
  showBusy(caixaVisao==='anual' ? 'Carregando visão anual do caixa...' : 'Carregando caixa...');
  try{
    await carregarCaixaConfig();
    await carregarMovCaixa();
    await carregarAjustesCaixa();
    normalizarCaixasV112();
    if(caixaVisao==='anual'){
      await renderCaixaAnualView();
      return;
    }
    const resumo = await resumoCaixaMes(cxMes,cxAno);
    const caixas = caixaConfig.caixas || CAIXAS_PADRAO;
    if(!caixaSelecionada) caixaSelecionada = 'giro';
    const totalManual = caixas.filter(c=>c.tipo!=='automatico').reduce((s,c)=>s+saldoCaixaManual(c.id,cxMes,cxAno),0);
    const totalGeral = totalManual + resumo.prov.saldoAtual;
    const pctTotal = totalPctCaixas();
    const caixaCards = caixas.map(c=>{
      const auto = c.tipo==='automatico';
      const saldo = auto ? resumo.prov.saldoAtual : saldoCaixaManual(c.id,cxMes,cxAno);
      const meta = auto ? 0 : metaCaixaDinamica(c,resumo);
      const sugestao = sugestaoCaixaDinamica(c,resumo);
      const progresso = meta>0 ? Math.min(100, Math.round(saldo/meta*100)) : 0;
      const selected = caixaSelecionada===c.id;
      const sub = c.id==='antecipados' ? `Defasagem: ${fmtValor(resumo.prov.defasagem||0)} · recompor: ${fmtValor(sugestao)}` : auto ? `Automático · liberou ${fmtValor(resumo.prov.liberado)} no mês` : c.id==='lucro' ? `Aguardando decisão · Sug.: ${fmtValor(sugestao)}` : `Sug.: ${fmtValor(sugestao)} · ${Number(c.pct||0)}%`;
      return `<div class="card" style="cursor:pointer;border-top:3px solid ${c.cor||'var(--texto-mid)'};${selected?'box-shadow:0 0 0 2px rgba(211,47,47,.16), var(--shadow-md)':''}" onclick="abrirCaixaPerfil('${c.id}')"><div class="card-label">${esc(c.nome)}</div><div class="card-value" style="font-size:24px;padding-top:4px;color:${c.cor||'var(--texto)'}">${fmtValor(saldo)}</div><div class="card-sub">${sub}</div>${cardContaCaixaHtml(c)}${!auto&&meta>0?`<div style="margin-top:10px"><div style="height:6px;background:var(--borda);border-radius:4px;overflow:hidden"><div style="height:100%;width:${progresso}%;background:${c.cor||'var(--vermelho)'}"></div></div><div style="font-size:10px;color:var(--texto-muted);margin-top:4px">Meta: ${fmtValor(meta)} · ${progresso}%</div></div>`:''}<div class="card-icon">${c.icon||'📦'}</div></div>`;
    }).join('');
    const selecionada = caixaById(caixaSelecionada);
    const perfil = renderPerfilCaixaHtmlV112(selecionada, resumo);
    const alertaPct = pctTotal!==100 ? `<div class="alert-bar atencao"><span class="alert-icon">⚙️</span><strong>Percentuais somam ${pctTotal}%.</strong>&nbsp;Ajuste em Configurar para fechar 100%, se quiser uma distribuição completa.</div>` : '';
    const alertaProv = resumo.prov.defasagem>0 ? `<div class="alert-bar urgente"><span class="alert-icon">🔒</span><strong>Provisionamento defasado em ${fmtValor(resumo.prov.defasagem)}.</strong>&nbsp;A sugestão automática vai recompor primeiro o pagamento antecipado antes de mandar dinheiro para as demais caixinhas.</div>` : '';
    document.getElementById('content').innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:12px"><div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">${seletorMesAnoHtml('caixa',cxMes,cxAno)}${renderCaixaVisaoToggle()}</div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-ghost btn-sm" onclick="editarValorBaseCaixa()">✏️ Editar valor base</button><button class="btn btn-success btn-sm" onclick="aplicarSugestaoCaixa()">Aplicar sugestão</button><button class="btn btn-ghost btn-sm" onclick="desfazerSugestaoCaixa()">Desfazer sugestão</button><button class="btn btn-primary btn-sm" onclick="abrirModalMovCaixa()">+ Movimentação</button><button class="btn btn-ghost btn-sm" onclick="abrirConfigCaixas()">Configurar</button></div></div>
      <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:12px 16px;font-size:13px;margin-bottom:16px"><strong>Menu Caixa.</strong> O resultado por competência orienta a distribuição. Pagamentos antecipados são provisionados automaticamente e liberados mês a mês. Se houver defasagem no provisionamento antigo, a recomposição vira prioridade.</div>
      ${alertaPct}${alertaProv}
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px;margin-bottom:22px"><div class="card c-green" style="border-top:3px solid var(--verde)"><div class="card-label">Resultado competência</div><div class="card-value" style="font-size:24px;padding-top:4px;color:${resumo.resComp>=0?'var(--verde)':'var(--vermelho)'}">${resumo.resComp>=0?'':'-'}${fmtValor(Math.abs(resumo.resComp))}</div><div class="card-sub">Receita ${fmtValor(resumo.recComp)} − despesas ${fmtValor(resumo.desp)}</div></div><div class="card" style="border-top:3px solid var(--azul)"><div class="card-label">Resultado de caixa</div><div class="card-value" style="font-size:24px;padding-top:4px;color:${resumo.resCx>=0?'var(--verde)':'var(--vermelho)'}">${resumo.resCx>=0?'':'-'}${fmtValor(Math.abs(resumo.resCx))}</div><div class="card-sub">Entradas líquidas ${fmtValor(resumo.recCx)} − despesas</div></div><div class="card" style="border-top:3px solid #92400e"><div class="card-label">Antecipado provisionado</div><div class="card-value" style="font-size:24px;padding-top:4px;color:#92400e">${fmtValor(resumo.prov.saldoAtual)}</div><div class="card-sub">Teórico: ${fmtValor(resumo.prov.teoricoAtual)} · defasagem: ${fmtValor(resumo.prov.defasagem||0)}</div></div><div class="card" style="border-top:3px solid var(--roxo)"><div class="card-label">Base da sugestão</div><div class="card-value" style="font-size:24px;padding-top:4px;color:var(--roxo)">${fmtValor(resumo.base)}</div><div class="card-sub">${resumo.ajuste?'manual':'competência'} · saldos em caixas: ${fmtValor(totalGeral)}</div></div></div>
      ${renderAcompanhamentoDestinacaoV12(resumo)}
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--texto-muted);margin-bottom:10px">Caixinhas</div><div class="cards-grid" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr));margin-bottom:22px">${caixaCards}</div>${renderResumoContasHtmlV112(resumo)}<div style="background:#f8fafc;border:1px solid var(--borda);border-radius:8px;padding:12px 16px;font-size:12px;color:var(--texto-muted);margin-bottom:16px">Metas técnicas: giro = 50% da média de despesas; reserva = 6 meses da média de despesas; manutenção = média de manutenção × 3. A sugestão mensal de todas as caixinhas editáveis segue o percentual configurado. Base histórica usada nas metas: ${resumo.intel.mesesBase} mês(es).</div>${perfil}`;
  } finally { hideBusy(); }
};
window.renderCaixaView = renderCaixaView;

const aplicarSugestaoCaixaBaseV12 = window.aplicarSugestaoCaixa;
window.aplicarSugestaoCaixa = async function(){
  limparCacheCaixaV12();
  return busyRun('Aplicando sugestão e atualizando destinação...', async ()=>aplicarSugestaoCaixaBaseV12());
};
const desfazerSugestaoCaixaBaseV12 = window.desfazerSugestaoCaixa;
window.desfazerSugestaoCaixa = async function(){
  limparCacheCaixaV12();
  return busyRun('Desfazendo sugestão e recalculando saldos...', async ()=>desfazerSugestaoCaixaBaseV12());
};



// ═══════════════════════════════════════════════════
// PATCH V14 — ANIVERSÁRIOS / DATA DE NASCIMENTO
// Corrige a versão com contratos: campos finais sobrescreviam parte da primeira alteração.
// ═══════════════════════════════════════════════════
function anivDataAlunoV14(a){ return a?.nascimento || a?.dataNascimento || ''; }
function anivParseDataV14(s){
  if(!s) return null;
  const p = String(s).split('-').map(Number);
  if(p.length !== 3 || !p[0] || !p[1] || !p[2]) return null;
  return new Date(p[0], p[1]-1, p[2]);
}
function anivFmtV14(s){
  const d = anivParseDataV14(s);
  if(!d) return '—';
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`;
}
function anivIdadeV14(s, ref = HOJE){
  const d = anivParseDataV14(s);
  if(!d) return null;
  let idade = ref.getFullYear() - d.getFullYear();
  const jaFez = ref.getMonth() > d.getMonth() || (ref.getMonth() === d.getMonth() && ref.getDate() >= d.getDate());
  if(!jaFez) idade--;
  return idade >= 0 ? idade : null;
}
function anivIdadeNoAnoV14(s, ano = ANO_ATUAL){
  const d = anivParseDataV14(s);
  if(!d) return null;
  const idade = ano - d.getFullYear();
  return idade >= 0 ? idade : null;
}
function anivListaMesV14(mes = MES_ATUAL){
  return alunos
    .filter(a => {
      const d = anivParseDataV14(anivDataAlunoV14(a));
      return d && d.getMonth() === mes;
    })
    .sort((a,b) => anivParseDataV14(anivDataAlunoV14(a)).getDate() - anivParseDataV14(anivDataAlunoV14(b)).getDate());
}
function anivLinhaCampoV14(id, label, value=''){
  return `<div class="form-group"><label class="form-label">${label}</label><input class="form-input" id="${id}" type="date" value="${value||''}"><div class="form-hint">Usado para idade e aniversariantes do mês</div></div>`;
}
function anivGarantirCampoNovoAlunoV14(){
  if(document.getElementById('f-nascimento')) return;
  const whats = document.getElementById('f-whats');
  const ref = whats?.closest('.form-group');
  if(ref) ref.insertAdjacentHTML('afterend', anivLinhaCampoV14('f-nascimento','Data de nascimento'));
}
function anivGarantirCampoEditarAlunoV14(a){
  const overlay = document.getElementById('modal-editaluno-overlay');
  if(!overlay || document.getElementById('ea-nascimento')) return;
  const whats = document.getElementById('ea-whats');
  const ref = whats?.closest('.form-group');
  if(ref) ref.insertAdjacentHTML('afterend', anivLinhaCampoV14('ea-nascimento','Data de nascimento', anivDataAlunoV14(a)));
}
function anivBlocoDashboardV14(){
  const lista = anivListaMesV14(MES_ATUAL);
  const linhas = lista.length ? lista.map(a => {
    const nasc = anivDataAlunoV14(a);
    const d = anivParseDataV14(nasc);
    const hoje = d && d.getDate() === HOJE.getDate() && d.getMonth() === HOJE.getMonth();
    const idade = anivIdadeNoAnoV14(nasc, ANO_ATUAL);
    return `<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 24px;border-bottom:1px solid var(--borda)">
      <div style="cursor:pointer" onclick="abrirPerfilAluno('${a.id}')">
        <div style="font-weight:600;font-size:13.5px;color:var(--vermelho);text-decoration:underline;text-underline-offset:2px">${esc(a.nome)}</div>
        <div style="font-size:11px;color:var(--texto-muted)">${idade!==null ? idade+' anos' : 'idade não calculada'}</div>
      </div>
      <div style="text-align:right">
        <div style="font-size:12px;font-weight:800;color:${hoje?'var(--verde)':'var(--texto)'}">${hoje?'Hoje 🎉':'Dia '+String(d.getDate()).padStart(2,'0')}</div>
        <div style="font-size:11px;color:var(--texto-muted)">${anivFmtV14(nasc)}</div>
      </div>
    </div>`;
  }).join('') : `<div class="empty"><div class="empty-icon">🎂</div>Nenhum aniversário cadastrado para ${MESES_NOMES[MES_ATUAL]}</div>`;
  return `<div class="section-box" id="aniv-dashboard-v14" style="margin-top:16px">
    <div class="section-header">
      <div><div class="section-title">Aniversariantes do Mês</div><div style="font-size:12px;color:var(--texto-muted)">${MESES_NOMES[MES_ATUAL]} · ${lista.length} aluno(s)</div></div>
    </div>
    <div style="padding:0">${linhas}</div>
  </div>`;
}
function anivInserirDashboardV14(){
  const content = document.getElementById('content');
  if(!content || document.getElementById('aniv-dashboard-v14')) return;
  content.insertAdjacentHTML('beforeend', anivBlocoDashboardV14());
}
function anivInserirPerfilV14(id){
  const a = alunos.find(x=>String(x.id)===String(id));
  if(!a) return;
  const nasc = anivDataAlunoV14(a);
  const idade = anivIdadeV14(nasc);
  const boxes = document.querySelectorAll('#content .section-box');
  const corpo = boxes[0]?.querySelector('.section-header + div');
  if(!corpo || document.getElementById('aniv-perfil-v14')) return;
  const html = `<div id="aniv-perfil-v14"><div style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--texto-muted);margin-bottom:3px">Nascimento</div><div style="font-weight:600">${nasc ? fmtData(nasc) : '—'}</div></div>
    <div><div style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--texto-muted);margin-bottom:3px">Idade</div><div style="font-weight:600">${idade!==null ? idade+' anos' : '—'}</div></div>
    <div><div style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--texto-muted);margin-bottom:3px">Aniversário</div><div style="font-weight:600">${nasc ? anivFmtV14(nasc) : '—'}</div></div>`;
  corpo.insertAdjacentHTML('beforeend', html);
}

const openModalAlunoBaseV14 = openModalAluno;
openModalAluno = function(id){
  const ret = openModalAlunoBaseV14(id);
  setTimeout(()=>{
    if(id){
      const a = alunos.find(x=>String(x.id)===String(id));
      anivGarantirCampoEditarAlunoV14(a);
    } else {
      anivGarantirCampoNovoAlunoV14();
      const f = document.getElementById('f-nascimento');
      if(f) f.value = '';
    }
  },0);
  return ret;
};
window.openModalAluno = openModalAluno;

window.confirmarEditAluno = async function(id){
  const a = alunos.find(x=>String(x.id)===String(id)); if(!a) return;
  const antes = {...a};
  const at = {...a,
    nome:document.getElementById('ea-nome').value.trim(),
    whats:document.getElementById('ea-whats').value.trim(),
    nascimento:document.getElementById('ea-nascimento')?.value || '',
    dataNascimento:document.getElementById('ea-nascimento')?.value || '',
    dataEntrada:document.getElementById('ea-dataEntrada').value,
    frequencia:parseInt(document.getElementById('ea-frequencia').value)||3,
    obsAluno:document.getElementById('ea-obs').value.trim()
  };
  if(!at.nome){ alert('Informe o nome.'); return; }
  for (const c of contratos.filter(c=>String(c.alunoId)===String(id))) { c.alunoNome = at.nome; await setDoc(doc(db,'contratos',String(c.id)), c); }
  for (const p of pagamentos.filter(p=>String(p.alunoId)===String(id))) { p.alunoNome = at.nome; await setDoc(doc(db,'pagamentos',String(p.id)), p); }
  alunos = alunos.map(x=>String(x.id)===String(id)?at:x);
  await salvarAlunoDb({id:at.id,nome:at.nome,whats:at.whats,nascimento:at.nascimento,dataNascimento:at.dataNascimento,dataEntrada:at.dataEntrada,frequencia:at.frequencia,ferias:at.ferias||[],turmas:at.turmas||[],obsAluno:at.obsAluno,statusGeral:at.statusGeral||'ativo'});
  await registrarAuditoria('edicao_aluno', id, at.nome, {nome:antes.nome,whats:antes.whats,nascimento:anivDataAlunoV14(antes),dataEntrada:antes.dataEntrada||antes.inicio}, {nome:at.nome,whats:at.whats,nascimento:at.nascimento,dataEntrada:at.dataEntrada});
  hidratarAlunosComContratos();
  document.getElementById('modal-editaluno-overlay')?.remove();
  toast('Dados do aluno atualizados ✓');
  abrirPerfilAluno(id);
};

salvarAluno = async function(){
  anivGarantirCampoNovoAlunoV14();
  const nome = document.getElementById('f-nome').value.trim();
  if(!nome){ alert('Informe o nome.'); return; }
  const alunoId = gerarId();
  const dataEntrada = document.getElementById('f-inicio').value || HOJE.toISOString().split('T')[0];
  const nascimento = document.getElementById('f-nascimento')?.value || '';
  const aluno = {id:alunoId,nome,whats:document.getElementById('f-whats').value.trim(),nascimento,dataNascimento:nascimento,dataEntrada,frequencia:3,ferias:[],turmas:[],obsAluno:'',statusGeral:'ativo'};
  const plano = document.getElementById('f-plano').value;
  const valor = parseFloat(document.getElementById('f-valor').value)||0;
  const inicio = dataEntrada;
  const venc = document.getElementById('f-venc').value;
  const parcelasVal = document.getElementById('f-parcelas')?.value || '';
  if(!inicio || !venc || valor<=0){ alert('Preencha início, vencimento e valor do contrato.'); return; }
  const contratoId = `ct_${alunoId}_${Date.now()}`;
  const contrato = {id:contratoId, alunoId, alunoNome:nome, nome:'Contrato inicial', plano, valorTotal:valor, inicio, venc,
    pgto:document.getElementById('f-pgto').value, parcelas:parcelasVal?parseInt(parcelasVal):null,
    recebimento:document.getElementById('f-recebimento').value, status:'ativo', obs:document.getElementById('f-obs').value.trim(), criadoEm:new Date().toISOString(), ts:Date.now()};
  alunos.push(aluno); contratos.push(contrato);
  await salvarAlunoDb(aluno);
  await salvarContratoDb(contrato);
  if(document.getElementById('f-status').value==='pago'){
    const p = {id:`pg_${contratoId}_${Date.now()}`, contratoId, alunoId, alunoNome:nome, valor, data:inicio, forma:contrato.pgto, parcelas:contrato.pgto==='Cartão'?contrato.parcelas:null, descricao:'Pagamento do contrato inicial', status:'ativo', ts:Date.now()};
    await salvarPagamentoDb(p);
  }
  await registrarAuditoria('cadastro_aluno', alunoId, nome, {}, {aluno, contrato});
  closeModalAluno(); hidratarAlunosComContratos(); toast('Aluno e contrato inicial cadastrados ✓'); render();
};
window.salvarAluno = salvarAluno;

const renderDashboardBaseV14 = renderDashboard;
renderDashboard = function(){
  renderDashboardBaseV14();
  anivInserirDashboardV14();
};
window.renderDashboard = renderDashboard;

const abrirPerfilAlunoBaseV14 = abrirPerfilAluno;
abrirPerfilAluno = async function(id){
  await abrirPerfilAlunoBaseV14(id);
  anivInserirPerfilV14(id);
};
window.abrirPerfilAluno = abrirPerfilAluno;


// ═══════════════════════════════════════════════════
// MELHORIA V17 — LEMBRETE DE REAJUSTE DE MENSALIDADE
// Campos no aluno: reajusteInicio e reajusteFim.
// O dashboard mostra alunos com reajuste previsto para o mês atual.
// ═══════════════════════════════════════════════════
function reajDataInicioAlunoV17(a){ return a?.reajusteInicio || a?.reajusteDataInicio || a?.periodoReajusteInicio || ''; }
function reajDataFimAlunoV17(a){ return a?.reajusteFim || a?.reajusteDataFim || a?.periodoReajusteFim || ''; }
function reajParseDataV17(s){
  if(!s) return null;
  const p = String(s).split('-').map(Number);
  if(p.length !== 3 || !p[0] || !p[1] || !p[2]) return null;
  return new Date(p[0], p[1]-1, p[2]);
}
function reajFmtPeriodoV17(a){
  const ini = reajDataInicioAlunoV17(a), fim = reajDataFimAlunoV17(a);
  if(!ini && !fim) return '—';
  if(ini && fim) return `${fmtData(ini)} → ${fmtData(fim)}`;
  if(ini) return `A partir de ${fmtData(ini)}`;
  return `Até ${fmtData(fim)}`;
}
function reajDiasAteV17(data){
  const d = reajParseDataV17(data);
  if(!d) return null;
  const hoje = new Date(HOJE.getFullYear(), HOJE.getMonth(), HOJE.getDate());
  return Math.round((d - hoje) / 86400000);
}
function reajListaMesV17(mes = MES_ATUAL, ano = ANO_ATUAL){
  return alunos
    .filter(a => {
      const d = reajParseDataV17(reajDataFimAlunoV17(a));
      return d && d.getMonth() === mes && d.getFullYear() === ano;
    })
    .sort((a,b) => reajParseDataV17(reajDataFimAlunoV17(a)) - reajParseDataV17(reajDataFimAlunoV17(b)));
}
function reajCampoDataV17(id, label, value='', hint=''){
  return `<div class="form-group"><label class="form-label">${label}</label><input class="form-input" id="${id}" type="date" value="${value||''}">${hint?`<div class="form-hint">${hint}</div>`:''}</div>`;
}
function reajGarantirCamposNovoAlunoV17(){
  if(document.getElementById('f-reajusteInicio') || document.getElementById('reajuste-novo-bloco-v17')) return;
  const venc = document.getElementById('f-venc');
  const ref = venc?.closest('.form-group');
  if(!ref) return;
  const inicioContrato = document.getElementById('f-inicio')?.value || HOJE.toISOString().split('T')[0];
  const fimPadrao = inicioContrato ? addMeses(inicioContrato, 12) : '';
  ref.insertAdjacentHTML('afterend', `<div class="form-group full" id="reajuste-novo-bloco-v17" style="padding:10px 12px;border:1px solid var(--borda);border-radius:var(--radius-sm);background:#fff">
    <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:var(--texto-mid);margin-bottom:10px">Lembrete de reajuste</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      ${reajCampoDataV17('f-reajusteInicio','Início do período',inicioContrato,'Início da contagem do reajuste')}
      ${reajCampoDataV17('f-reajusteFim','Data prevista do reajuste',fimPadrao,'Aparece no dashboard no mês informado')}
    </div>
  </div>`);
}
function reajGarantirCamposEditarAlunoV17(a){
  const overlay = document.getElementById('modal-editaluno-overlay');
  if(!overlay || document.getElementById('ea-reajusteInicio') || document.getElementById('reajuste-editar-bloco-v17')) return;
  const dataEntrada = document.getElementById('ea-dataEntrada');
  const ref = dataEntrada?.closest('.form-group');
  const ini = reajDataInicioAlunoV17(a) || a?.dataEntrada || a?.inicio || '';
  const fim = reajDataFimAlunoV17(a) || (ini ? addMeses(ini,12) : '');
  const html = `<div class="form-group full" id="reajuste-editar-bloco-v17" style="padding:10px 12px;border:1px solid var(--borda);border-radius:var(--radius-sm);background:#fff">
    <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:var(--texto-mid);margin-bottom:10px">Lembrete de reajuste</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      ${reajCampoDataV17('ea-reajusteInicio','Início do período',ini,'Início da contagem do reajuste')}
      ${reajCampoDataV17('ea-reajusteFim','Data prevista do reajuste',fim,'Aparece no dashboard no mês informado')}
    </div>
  </div>`;
  if(ref) ref.insertAdjacentHTML('afterend', html);
}
function reajBlocoDashboardV17(){
  const lista = reajListaMesV17(MES_ATUAL, ANO_ATUAL);
  const linhas = lista.length ? lista.map(a => {
    const fim = reajDataFimAlunoV17(a);
    const d = reajParseDataV17(fim);
    const dias = reajDiasAteV17(fim);
    let status = dias === 0 ? 'Hoje' : dias < 0 ? `${Math.abs(dias)} dia(s) em atraso` : `em ${dias} dia(s)`;
    const c = a.contratoAtual || contratoVigenteAluno(a.id);
    const mens = c ? mensalidadeContrato(c) : mensalidadeAluno(a);
    return `<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 24px;border-bottom:1px solid var(--borda)">
      <div style="cursor:pointer" onclick="abrirPerfilAluno('${a.id}')">
        <div style="font-weight:600;font-size:13.5px;color:var(--vermelho);text-decoration:underline;text-underline-offset:2px">${esc(a.nome)}</div>
        <div style="font-size:11px;color:var(--texto-muted)">Período: ${reajFmtPeriodoV17(a)}</div>
      </div>
      <div style="text-align:right">
        <div style="font-size:12px;font-weight:800;color:${dias!==null && dias<=0?'var(--vermelho)':'var(--texto)'}">Dia ${String(d.getDate()).padStart(2,'0')} · ${status}</div>
        <div style="font-size:11px;color:var(--texto-muted)">Mensalidade atual: ${fmtValor(mens)}</div>
      </div>
    </div>`;
  }).join('') : `<div class="empty"><div class="empty-icon">📌</div>Nenhum reajuste previsto para ${MESES_NOMES[MES_ATUAL]}</div>`;
  return `<div class="section-box" id="reaj-dashboard-v17" style="margin-top:16px">
    <div class="section-header">
      <div><div class="section-title">Reajustes do Mês</div><div style="font-size:12px;color:var(--texto-muted)">${MESES_NOMES[MES_ATUAL]} · ${lista.length} aluno(s)</div></div>
    </div>
    <div style="padding:0">${linhas}</div>
  </div>`;
}
function reajInserirDashboardV17(){
  const content = document.getElementById('content');
  if(!content || document.getElementById('reaj-dashboard-v17')) return;
  const aniv = document.getElementById('aniv-dashboard-v14');
  if(aniv) aniv.insertAdjacentHTML('afterend', reajBlocoDashboardV17());
  else content.insertAdjacentHTML('beforeend', reajBlocoDashboardV17());
}
function reajInserirPerfilV17(id){
  const a = alunos.find(x=>String(x.id)===String(id));
  if(!a) return;
  const boxes = document.querySelectorAll('#content .section-box');
  const corpo = boxes[0]?.querySelector('.section-header + div');
  if(!corpo || document.getElementById('reaj-perfil-v17')) return;
  const fim = reajDataFimAlunoV17(a);
  const dias = reajDiasAteV17(fim);
  let infoFim = fim ? fmtData(fim) : '—';
  if(fim && dias !== null) infoFim += dias === 0 ? ' · hoje' : (dias < 0 ? ` · ${Math.abs(dias)} dia(s) em atraso` : ` · em ${dias} dia(s)`);
  const html = `<div id="reaj-perfil-v17"><div style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--texto-muted);margin-bottom:3px">Período de reajuste</div><div style="font-weight:600">${reajFmtPeriodoV17(a)}</div></div>
    <div><div style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--texto-muted);margin-bottom:3px">Próximo reajuste</div><div style="font-weight:600">${infoFim}</div></div>`;
  corpo.insertAdjacentHTML('beforeend', html);
}

const openModalAlunoBaseV17 = openModalAluno;
openModalAluno = function(id){
  const ret = openModalAlunoBaseV17(id);
  setTimeout(()=>{
    if(id){
      const a = alunos.find(x=>String(x.id)===String(id));
      reajGarantirCamposEditarAlunoV17(a);
    } else {
      reajGarantirCamposNovoAlunoV17();
    }
  },0);
  return ret;
};
window.openModalAluno = openModalAluno;

window.confirmarEditAluno = async function(id){
  const a = alunos.find(x=>String(x.id)===String(id)); if(!a) return;
  const antes = {...a};
  const at = {...a,
    nome:document.getElementById('ea-nome').value.trim(),
    whats:document.getElementById('ea-whats').value.trim(),
    nascimento:document.getElementById('ea-nascimento')?.value || anivDataAlunoV14(a) || '',
    dataNascimento:document.getElementById('ea-nascimento')?.value || anivDataAlunoV14(a) || '',
    reajusteInicio:document.getElementById('ea-reajusteInicio')?.value || '',
    reajusteFim:document.getElementById('ea-reajusteFim')?.value || '',
    dataEntrada:document.getElementById('ea-dataEntrada').value,
    frequencia:parseInt(document.getElementById('ea-frequencia').value)||3,
    obsAluno:document.getElementById('ea-obs').value.trim()
  };
  if(!at.nome){ alert('Informe o nome.'); return; }
  for (const c of contratos.filter(c=>String(c.alunoId)===String(id))) { c.alunoNome = at.nome; await setDoc(doc(db,'contratos',String(c.id)), c); }
  for (const p of pagamentos.filter(p=>String(p.alunoId)===String(id))) { p.alunoNome = at.nome; await setDoc(doc(db,'pagamentos',String(p.id)), p); }
  alunos = alunos.map(x=>String(x.id)===String(id)?at:x);
  await salvarAlunoDb({id:at.id,nome:at.nome,whats:at.whats,nascimento:at.nascimento,dataNascimento:at.dataNascimento,reajusteInicio:at.reajusteInicio,reajusteFim:at.reajusteFim,dataEntrada:at.dataEntrada,frequencia:at.frequencia,ferias:at.ferias||[],turmas:at.turmas||[],obsAluno:at.obsAluno,statusGeral:at.statusGeral||'ativo'});
  await registrarAuditoria('edicao_aluno', id, at.nome,
    {nome:antes.nome,whats:antes.whats,nascimento:anivDataAlunoV14(antes),reajusteInicio:reajDataInicioAlunoV17(antes),reajusteFim:reajDataFimAlunoV17(antes),dataEntrada:antes.dataEntrada||antes.inicio},
    {nome:at.nome,whats:at.whats,nascimento:at.nascimento,reajusteInicio:at.reajusteInicio,reajusteFim:at.reajusteFim,dataEntrada:at.dataEntrada}
  );
  hidratarAlunosComContratos();
  document.getElementById('modal-editaluno-overlay')?.remove();
  toast('Dados do aluno atualizados ✓');
  abrirPerfilAluno(id);
};

salvarAluno = async function(){
  anivGarantirCampoNovoAlunoV14();
  reajGarantirCamposNovoAlunoV17();
  const nome = document.getElementById('f-nome').value.trim();
  if(!nome){ alert('Informe o nome.'); return; }
  const alunoId = gerarId();
  const dataEntrada = document.getElementById('f-inicio').value || HOJE.toISOString().split('T')[0];
  const nascimento = document.getElementById('f-nascimento')?.value || '';
  const reajusteInicio = document.getElementById('f-reajusteInicio')?.value || '';
  const reajusteFim = document.getElementById('f-reajusteFim')?.value || '';
  const aluno = {id:alunoId,nome,whats:document.getElementById('f-whats').value.trim(),nascimento,dataNascimento:nascimento,reajusteInicio,reajusteFim,dataEntrada,frequencia:3,ferias:[],turmas:[],obsAluno:'',statusGeral:'ativo'};
  const plano = document.getElementById('f-plano').value;
  const valor = parseFloat(document.getElementById('f-valor').value)||0;
  const inicio = dataEntrada;
  const venc = document.getElementById('f-venc').value;
  const parcelasVal = document.getElementById('f-parcelas')?.value || '';
  if(!inicio || !venc || valor<=0){ alert('Preencha início, vencimento e valor do contrato.'); return; }
  const contratoId = `ct_${alunoId}_${Date.now()}`;
  const contrato = {id:contratoId, alunoId, alunoNome:nome, nome:'Contrato inicial', plano, valorTotal:valor, inicio, venc,
    pgto:document.getElementById('f-pgto').value, parcelas:parcelasVal?parseInt(parcelasVal):null,
    recebimento:document.getElementById('f-recebimento').value, status:'ativo', obs:document.getElementById('f-obs').value.trim(), criadoEm:new Date().toISOString(), ts:Date.now()};
  alunos.push(aluno); contratos.push(contrato);
  await salvarAlunoDb(aluno);
  await salvarContratoDb(contrato);
  if(document.getElementById('f-status').value==='pago'){
    const p = {id:`pg_${contratoId}_${Date.now()}`, contratoId, alunoId, alunoNome:nome, valor, data:inicio, forma:contrato.pgto, parcelas:contrato.pgto==='Cartão'?contrato.parcelas:null, descricao:'Pagamento do contrato inicial', status:'ativo', ts:Date.now()};
    await salvarPagamentoDb(p);
  }
  await registrarAuditoria('cadastro_aluno', alunoId, nome, {}, {aluno, contrato});
  closeModalAluno(); hidratarAlunosComContratos(); toast('Aluno e contrato inicial cadastrados ✓'); render();
};
window.salvarAluno = salvarAluno;

const renderDashboardBaseV17 = renderDashboard;
renderDashboard = function(){
  renderDashboardBaseV17();
  reajInserirDashboardV17();
};
window.renderDashboard = renderDashboard;

const abrirPerfilAlunoBaseV17 = abrirPerfilAluno;
abrirPerfilAluno = async function(id){
  await abrirPerfilAlunoBaseV17(id);
  reajInserirPerfilV17(id);
};
window.abrirPerfilAluno = abrirPerfilAluno;


// ═══════════════════════════════════════════════════
// AJUSTE LGV V18 — COMPETÊNCIA POR CICLOS MENSAIS DO CONTRATO
// Regra: a competência não é mais escolhida pelo mês predominante.
// Cada contrato gera N competências mensais a partir da data de início/fechamento.
// Ex.: trimestral iniciado em 20/01 → 20/01, 20/02 e 20/03.
// Caixa permanece separado: continua vindo apenas dos pagamentos lançados.
// ═══════════════════════════════════════════════════
function pad2V18(n){ return String(n).padStart(2,'0'); }
function dataIsoLocalV18(d){ return `${d.getFullYear()}-${pad2V18(d.getMonth()+1)}-${pad2V18(d.getDate())}`; }
function addMesesCicloV18(dataStr, qtd){
  const base = dataLocal(dataStr);
  if(!base) return null;
  const diaOriginal = base.getDate();
  const alvo = new Date(base.getFullYear(), base.getMonth() + qtd, 1);
  const ultimoDiaMesAlvo = new Date(alvo.getFullYear(), alvo.getMonth()+1, 0).getDate();
  alvo.setDate(Math.min(diaOriginal, ultimoDiaMesAlvo));
  return alvo;
}
function dataInicioCompetenciaContratoV18(c){
  // Campo preparado para o futuro, caso o sistema precise separar início do contrato e início da competência.
  return c?.competenciaInicio || c?.inicio || '';
}
mesesCompetenciaContrato = function(c){
  if(!c || c.status === 'excluido' || c.status === 'cancelado') return [];
  const inicioCompetencia = dataInicioCompetenciaContratoV18(c);
  const inicio = dataLocal(inicioCompetencia);
  if(!inicio) return [];
  const qtd = Math.max(1, mesesContrato(c));
  const valor = mensalidadeContrato(c);
  const lista = [];
  for(let i=0; i<qtd; i++){
    const d = addMesesCicloV18(inicioCompetencia, i);
    if(!d) continue;
    lista.push({
      ano: d.getFullYear(),
      mes: d.getMonth(),
      dia: d.getDate(),
      data: dataIsoLocalV18(d),
      chave: `${d.getFullYear()}_${pad2V18(d.getMonth())}`,
      parcela: i + 1,
      total: qtd,
      valor
    });
  }
  return lista;
};
function competenciaContratoMesV18(c, mes, ano){
  const chave = `${ano}_${pad2V18(mes)}`;
  return mesesCompetenciaContrato(c).find(m=>m.chave===chave) || null;
}
contratoContaCompetenciaMes = function(c, mes, ano){
  return !!competenciaContratoMesV18(c, mes, ano);
};
function competenciaResumoContratoMesV18(c, mes, ano){
  const comp = competenciaContratoMesV18(c, mes, ano);
  if(!comp) return `${fmtData(dataInicioCompetenciaContratoV18(c))} → ${fmtData(vencAjustadoContrato(c))}`;
  return `Competência ${fmtData(comp.data)} · ${comp.parcela}/${comp.total} · ${fmtData(dataInicioCompetenciaContratoV18(c))} → ${fmtData(vencAjustadoContrato(c))}`;
}


// ═══════════════════════════════════════════════════
// AJUSTES LGV V21 — COLABORADORES E ESTRUTURA TRABALHISTA REVISADA
// - Módulo exibido como "Colaboradores"; coleções antigas são preservadas.
// - CLT manual: salário bruto, descontos do colaborador, encargos patronais e provisões.
// - DRE = salário bruto/remuneração + encargos da empresa + provisões.
// - INSS/IRRF descontados não são custos adicionais; apenas explicam o líquido.
// - Somente a provisão precisa de confirmação para atualizar a caixinha trabalhista.
// - Custos entram na categoria padrão "Colaboradores", sem cartão visual destacado.
// - Navegação mensal segue o mesmo seletor de mês/ano/Hoje das despesas.
// ═══════════════════════════════════════════════════
let pessoalFuncionariosV20 = [];
let pessoalMesesV20 = {};
let psMesV20 = MES_ATUAL, psAnoV20 = ANO_ATUAL;

const RUBRICAS_PROV_V20 = [
  ['prov13','13º salário'],
  ['provFerias','1/3 de férias'],
  ['provFgts13','FGTS sobre 13º'],
  ['provFgtsFerias','FGTS sobre 1/3 de férias'],
  ['provMulta','Multa rescisória'],
  ['provOutras','Outras provisões']
];
const RUBRICAS_DESCONTOS_V21 = [
  ['inssDesconto','INSS descontado'],
  ['irrfDesconto','IRRF descontado'],
  ['outrosDescontos','Outros descontos']
];
const RUBRICAS_ENCARGOS_V21 = [
  ['fgtsMensal','FGTS mensal'],
  ['inssPatronal','Contribuição patronal'],
  ['ratTerceiros','RAT / terceiros'],
  ['outrosEncargosPatronais','Outros encargos patronais']
];

function chavePessoalMesV20(funcId, mes, ano){ return `${funcId}_${ano}_${String(mes).padStart(2,'0')}`; }
function idxPessoalV20(mes, ano){ return Number(ano)*12 + Number(mes); }
function mesAnoInputV20(mes, ano){ return `${ano}-${String(mes+1).padStart(2,'0')}`; }
function parseMesAnoV20(v){ const p=String(v||'').split('-').map(Number); return p.length===2&&p[0]&&p[1]?{ano:p[0],mes:p[1]-1}:null; }
function cloneV20(v){ return JSON.parse(JSON.stringify(v)); }
function nV20(v){ return Number(v||0); }

async function carregarPessoalV20(force=false){
  if(pessoalFuncionariosV20.length && Object.keys(pessoalMesesV20).length && !force) return;
  try{
    const [fs,ms] = await Promise.all([getDocs(collection(db,'pessoal_funcionarios')),getDocs(collection(db,'pessoal_mensal'))]);
    pessoalFuncionariosV20 = fs.docs.map(d=>({id:d.id,...d.data()})).filter(f=>f.status!=='excluido');
    pessoalMesesV20 = {}; ms.docs.forEach(d=>pessoalMesesV20[d.id]={id:d.id,...d.data()});
  }catch(e){ console.warn('Erro ao carregar módulo Colaboradores',e); pessoalFuncionariosV20=[]; pessoalMesesV20={}; }
}
async function salvarFuncionarioV20(f){
  pessoalFuncionariosV20 = pessoalFuncionariosV20.filter(x=>String(x.id)!==String(f.id)).concat(f);
  await setDoc(doc(db,'pessoal_funcionarios',String(f.id)),f);
}
async function salvarMensalV20(r){
  pessoalMesesV20[r.id]=r;
  await setDoc(doc(db,'pessoal_mensal',String(r.id)),r);
}
function registroMensalV20(funcId,mes,ano){ return pessoalMesesV20[chavePessoalMesV20(funcId,mes,ano)] || {id:chavePessoalMesV20(funcId,mes,ano),funcionarioId:funcId,mes,ano}; }
function versoesFuncV20(f){ return Array.isArray(f?.versoes)&&f.versoes.length ? f.versoes : []; }
function configFuncMesV20(f,mes,ano){
  const idx=idxPessoalV20(mes,ano);
  return versoesFuncV20(f).filter(v=>idxPessoalV20(v.inicioMes,v.inicioAno)<=idx).sort((a,b)=>idxPessoalV20(b.inicioMes,b.inicioAno)-idxPessoalV20(a.inicioMes,a.inicioAno))[0] || null;
}
function funcAtivoMesV20(f,mes,ano){
  const cfg=configFuncMesV20(f,mes,ano); if(!cfg) return false;
  const idx=idxPessoalV20(mes,ano);
  if(f.fimAno!==undefined && f.fimMes!==undefined && f.fimAno!==null && f.fimMes!==null && idx>idxPessoalV20(f.fimMes,f.fimAno)) return false;
  return f.status!=='excluido';
}
function remunBaseCfgV21(cfg){
  if(!cfg) return 0;
  if(cfg.clt && cfg.salarioBruto!==undefined && cfg.salarioBruto!==null && cfg.salarioBruto!=='') return nV20(cfg.salarioBruto);
  return nV20(cfg.remuneracao);
}
function remunMesV20(f,mes,ano){
  const cfg=configFuncMesV20(f,mes,ano); if(!cfg) return 0;
  const r=registroMensalV20(f.id,mes,ano);
  if(r.remuneracaoOverride!==undefined && r.remuneracaoOverride!==null && r.remuneracaoOverride!=='') return nV20(r.remuneracaoOverride);
  return cfg.remuneracaoTipo==='variavel' ? 0 : remunBaseCfgV21(cfg);
}
function descontosCfgV21(cfg){
  return cfg?.clt ? RUBRICAS_DESCONTOS_V21.reduce((s,[k])=>s+nV20(cfg[k]),0) : 0;
}
function encargosCfgV20(cfg){
  if(!cfg?.clt) return 0;
  const temEstruturaNova = RUBRICAS_ENCARGOS_V21.some(([k])=>cfg[k]!==undefined && cfg[k]!==null && cfg[k]!=='');
  if(temEstruturaNova) return RUBRICAS_ENCARGOS_V21.reduce((s,[k])=>s+nV20(cfg[k]),0);
  return nV20(cfg.encargos); // compatibilidade com registros da v20
}
function provisoesCfgV20(cfg){ return cfg?.clt ? RUBRICAS_PROV_V20.reduce((s,[k])=>s+nV20(cfg[k]),0) : 0; }
function resumoFuncMesV20(f,mes,ano){
  const cfg=configFuncMesV20(f,mes,ano); if(!cfg) return null;
  const reg=registroMensalV20(f.id,mes,ano);
  const remuneracao=remunMesV20(f,mes,ano);
  const descontos=descontosCfgV21(cfg);
  const liquido=cfg.clt?Math.max(0,remuneracao-descontos):remuneracao;
  const encargos=encargosCfgV20(cfg), provisoes=provisoesCfgV20(cfg);
  return {
    f,cfg,reg,remuneracao,salarioBruto:cfg.clt?remuneracao:0,descontos,liquido,
    encargos,provisoes,total:remuneracao+encargos+provisoes,
    variavelPendente:cfg.remuneracaoTipo==='variavel' && !(reg.remuneracaoOverride>0)
  };
}
function ativosPessoalMesV20(mes,ano){ return pessoalFuncionariosV20.filter(f=>funcAtivoMesV20(f,mes,ano)).map(f=>resumoFuncMesV20(f,mes,ano)).filter(Boolean); }
function totalProvisoesPessoalMesV20(mes,ano){ return ativosPessoalMesV20(mes,ano).reduce((s,x)=>s+x.provisoes,0); }
function totalCustoPessoalMesV20(mes,ano){ return ativosPessoalMesV20(mes,ano).reduce((s,x)=>s+x.total,0); }
function totalProvisaoConfirmadaMesV20(mes,ano){ return ativosPessoalMesV20(mes,ano).reduce((s,x)=>s+(x.reg.provisaoConfirmada?nV20(x.reg.provisaoValorSnapshot||x.provisoes):0),0); }
function pendenciaProvisaoMesV20(mes,ano){ return Math.max(0,totalProvisoesPessoalMesV20(mes,ano)-totalProvisaoConfirmadaMesV20(mes,ano)); }

function invalidarDespesasPessoalV20(){ despCache={}; }
function normalizaTextoV20(s){ return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim(); }
function itemCasaComAntigoV20(d,cfg){
  if(!cfg?.substituirAntiga) return false;
  const alvo=normalizaTextoV20(cfg.descricaoAntiga||''); if(!alvo) return false;
  return normalizaTextoV20(d?.desc).includes(alvo);
}
const loadDespesasBaseV20 = loadDespesas;
loadDespesas = async function(mes,ano){
  await carregarPessoalV20();
  const base=await loadDespesasBaseV20(mes,ano);
  const cats={};
  Object.entries(base||{}).forEach(([k,v])=>{
    if(k==='pessoal') return; // remove categoria transitória criada na v20
    cats[k]=(v||[]).filter(d=>!d.__pessoalV20).map(d=>({...d}));
  });
  if(!cats.operacional) cats.operacional=[];
  const ativos=ativosPessoalMesV20(mes,ano);
  ativos.forEach(x=>{
    if(x.cfg.substituirAntiga){
      Object.keys(cats).forEach(cat=>{ cats[cat]=(cats[cat]||[]).filter(d=>!itemCasaComAntigoV20(d,x.cfg)); });
    }
  });
  // V22: cada colaborador aparece como uma única despesa consolidada.
  // Os componentes permanecem separados nos metadados para detalhamento, DRE e futura escrituração.
  ativos.forEach(x=>{
    cats.operacional.push({
      desc:String(x.f.nome||'Colaborador'),
      valor:x.total,
      tipo:'recorrente',
      fixo:true,
      __pessoalV20:true,
      __colaboradorConsolidadoV22:true,
      funcionarioId:x.f.id,
      grupo:'consolidado',
      clt:!!x.cfg.clt,
      remuneracao:x.remuneracao,
      encargos:x.encargos,
      provisoes:x.provisoes,
      total:x.total
    });
  });
  despCache[chaveDesp(mes,ano)]=cats;
  return cats;
};
window.loadDespesas=loadDespesas;

function ensurePessoalMenuV20(){
  const nav=document.querySelector('.nav'); if(!nav) return;
  let el=nav.querySelector('[data-view="pessoal"]');
  if(!el){
    el=document.createElement('div'); el.className='nav-item'; el.dataset.view='pessoal';
    const desp=nav.querySelector('[data-view="despesas"]'); if(desp) nav.insertBefore(el,desp); else nav.appendChild(el);
  }
  el.innerHTML='<span class="nav-icon">👷</span> Colaboradores';
  el.onclick=()=>setView('pessoal');
}
const ensureCaixaMenuBaseV20=ensureCaixaMenu;
ensureCaixaMenu=function(){ ensureCaixaMenuBaseV20(); ensurePessoalMenuV20(); };
window.ensureCaixaMenu=ensureCaixaMenu;

const setViewBaseV20=setView;
setView=function(v){
  ensureCaixaMenu();
  if(v==='colaboradores') v='pessoal';
  if(v!=='pessoal') return setViewBaseV20(v);
  viewAtual='pessoal'; closeSidebar();
  document.querySelectorAll('.nav-item').forEach(el=>el.classList.toggle('active',el.dataset.view==='pessoal'));
  document.getElementById('page-title').textContent='Colaboradores';
  document.getElementById('topbar-right').innerHTML='<button class="btn btn-primary" onclick="abrirFuncionarioV20()">+ Colaborador</button>';
  renderPessoalV20();
};
window.setView=setView;
const renderBaseV20=render;
render=function(){ if(viewAtual==='pessoal') return renderPessoalV20(); return renderBaseV20(); };
window.render=render;

// Integra o seletor de Colaboradores ao padrão mês/ano/Hoje já usado nas despesas.
const setPeriodoSelecionadoBaseV21=window.setPeriodoSelecionado;
window.setPeriodoSelecionado=function(ctx){
  if(ctx==='pessoal'){
    psMesV20=Number(document.getElementById('sel-mes-pessoal')?.value ?? MES_ATUAL);
    psAnoV20=Number(document.getElementById('sel-ano-pessoal')?.value ?? ANO_ATUAL);
    renderPessoalV20(); return;
  }
  return setPeriodoSelecionadoBaseV21(ctx);
};
const navegarPeriodoBaseV21=window.navegarPeriodoV11;
window.navegarPeriodoV11=function(ctx,delta){
  if(ctx==='pessoal'){ navegarPessoalV20(delta); return; }
  return navegarPeriodoBaseV21(ctx,delta);
};
const irMesAtualBaseV21=window.irMesAtualV11;
window.irMesAtualV11=function(ctx){
  if(ctx==='pessoal'){ psMesV20=MES_ATUAL;psAnoV20=ANO_ATUAL;renderPessoalV20();return; }
  return irMesAtualBaseV21(ctx);
};

function statusPillV20(ok,texto){ return `<span class="badge" style="background:${ok?'var(--verde-light)':'var(--amarelo-light)'};color:${ok?'var(--verde)':'#92400e'}">${ok?'✓':'⏳'} ${texto}</span>`; }
function detalheListaV21(cfg,rubricas,vazio){
  return rubricas.filter(([k])=>nV20(cfg[k])>0).map(([k,l])=>`<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:12px;gap:12px"><span style="color:var(--texto-muted)">${l}</span><strong>${fmtValor(cfg[k])}</strong></div>`).join('') || `<div style="color:var(--texto-muted);font-size:12px">${vazio}</div>`;
}
function detalheProvisoesHtmlV20(cfg){ return detalheListaV21(cfg,RUBRICAS_PROV_V20,'Nenhuma provisão cadastrada.'); }
function detalheDescontosHtmlV21(cfg){ return detalheListaV21(cfg,RUBRICAS_DESCONTOS_V21,'Nenhum desconto cadastrado.'); }
function detalheEncargosHtmlV21(cfg){
  const temNovo=RUBRICAS_ENCARGOS_V21.some(([k])=>cfg[k]!==undefined && cfg[k]!==null && cfg[k]!=='');
  if(!temNovo && nV20(cfg.encargos)>0) return `<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:12px"><span style="color:var(--texto-muted)">Encargos da versão anterior — revisar</span><strong>${fmtValor(cfg.encargos)}</strong></div>`;
  return detalheListaV21(cfg,RUBRICAS_ENCARGOS_V21,'Nenhum encargo patronal cadastrado.');
}
async function renderPessoalV20(){
  loading(true); await carregarPessoalV20();
  const lista=ativosPessoalMesV20(psMesV20,psAnoV20);
  const totalRem=lista.reduce((s,x)=>s+x.remuneracao,0);
  const totalLiq=lista.reduce((s,x)=>s+x.liquido,0);
  const totalDesc=lista.reduce((s,x)=>s+x.descontos,0);
  const totalEnc=lista.reduce((s,x)=>s+x.encargos,0);
  const totalProv=lista.reduce((s,x)=>s+x.provisoes,0);
  const total=totalRem+totalEnc+totalProv;
  const cards=lista.map(x=>{
    const cfg=x.cfg,r=x.reg;
    const resumoValores=cfg.clt?`
      <div><div class="card-label">Salário bruto</div><div style="font-family:'Bebas Neue';font-size:25px">${fmtValor(x.remuneracao)}</div>${x.variavelPendente?'<div style="font-size:11px;color:var(--vermelho)">Valor do mês ainda não informado</div>':''}</div>
      <div><div class="card-label">Líquido estimado</div><div style="font-family:'Bebas Neue';font-size:25px;color:var(--azul)">${fmtValor(x.liquido)}</div><div style="font-size:11px;color:var(--texto-muted)">Bruto menos descontos</div></div>
      <div><div class="card-label">Descontos do colaborador</div><div style="font-family:'Bebas Neue';font-size:25px">${fmtValor(x.descontos)}</div><div style="font-size:11px;color:var(--texto-muted)">Não somam novamente na DRE</div></div>
      <div><div class="card-label">Encargos da empresa</div><div style="font-family:'Bebas Neue';font-size:25px">${fmtValor(x.encargos)}</div></div>
      <div><div class="card-label">Provisões</div><div style="font-family:'Bebas Neue';font-size:25px;color:#0f766e">${fmtValor(x.provisoes)}</div></div>
      <div><div class="card-label">Custo mensal na DRE</div><div style="font-family:'Bebas Neue';font-size:25px;color:var(--vermelho)">${fmtValor(x.total)}</div></div>`:
      `<div><div class="card-label">Remuneração</div><div style="font-family:'Bebas Neue';font-size:25px">${fmtValor(x.remuneracao)}</div>${x.variavelPendente?'<div style="font-size:11px;color:var(--vermelho)">Valor do mês ainda não informado</div>':''}</div><div><div class="card-label">Custo mensal na DRE</div><div style="font-family:'Bebas Neue';font-size:25px;color:var(--vermelho)">${fmtValor(x.total)}</div></div>`;
    const detalhesClt=cfg.clt?`<div style="padding:14px 24px;display:grid;grid-template-columns:repeat(3,1fr);gap:18px;border-top:1px solid var(--borda)">
      <div><div style="font-weight:700;margin-bottom:8px">Descontos do colaborador</div>${detalheDescontosHtmlV21(cfg)}</div>
      <div><div style="font-weight:700;margin-bottom:8px">Encargos da empresa</div>${detalheEncargosHtmlV21(cfg)}</div>
      <div><div style="font-weight:700;margin-bottom:8px">Composição das provisões</div>${detalheProvisoesHtmlV20(cfg)}</div>
    </div>`:'';
    return `<div class="section-box" style="margin-bottom:16px">
      <div class="section-header"><div><div class="section-title">${esc(x.f.nome)} ${cfg.clt?'<span class="badge badge-pago" style="margin-left:6px">CLT</span>':'<span class="badge badge-confirmar" style="margin-left:6px">Sem CLT</span>'}</div><div style="font-size:12px;color:var(--texto-muted)">${cfg.remuneracaoTipo==='variavel'?'Remuneração variável':'Remuneração fixa'} · configuração desde ${MESES_NOMES[cfg.inicioMes]} ${cfg.inicioAno}</div></div><div style="display:flex;gap:6px;flex-wrap:wrap"><button class="btn btn-ghost btn-sm" onclick="abrirFuncionarioV20('${x.f.id}')">✏️ Editar daqui para frente</button><button class="btn btn-danger btn-sm" onclick="encerrarFuncionarioV20('${x.f.id}')">Encerrar</button></div></div>
      <div style="padding:16px 24px;display:grid;grid-template-columns:repeat(auto-fit,minmax(155px,1fr));gap:12px;border-bottom:1px solid var(--borda)">${resumoValores}</div>
      <div style="padding:14px 24px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap">
        <div><div style="font-weight:700;margin-bottom:6px">Operação do mês</div><div style="font-size:12px;color:var(--texto-muted)">${cfg.clt?'Somente a transferência da provisão precisa ser confirmada nesta versão.':'A remuneração entra diretamente na DRE; o controle de pagamento ficará para a futura escrituração.'}</div></div>
        <div style="display:flex;gap:7px;flex-wrap:wrap;align-items:center">${cfg.remuneracaoTipo==='variavel'?`<button class="btn btn-ghost btn-sm" onclick="definirRemuneracaoMesV20('${x.f.id}')">Definir valor do mês</button>`:''}${cfg.clt?`${statusPillV20(!!r.provisaoConfirmada,'Provisão')}<button class="btn ${r.provisaoConfirmada?'btn-ghost':'btn-primary'} btn-sm" onclick="confirmarPessoalV20('${x.f.id}','provisao')">${r.provisaoConfirmada?'Desfazer provisão':'Confirmar provisão'}</button>`:''}</div>
      </div>${detalhesClt}</div>`;
  }).join('');
  document.getElementById('content').innerHTML=`
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;gap:12px;flex-wrap:wrap"><div>${seletorMesAnoHtml('pessoal',psMesV20,psAnoV20)}</div><button class="btn btn-primary" onclick="abrirFuncionarioV20()">+ Colaborador</button></div>
    <div style="background:#f8fafc;border:1px solid var(--borda);border-radius:8px;padding:12px 16px;font-size:13px;color:var(--texto-mid);margin-bottom:16px"><strong>Competência do colaborador.</strong> A DRE reconhece remuneração/salário bruto, encargos pagos pela empresa e provisões. INSS, IRRF e outros descontos do colaborador apenas explicam o valor líquido e não são somados novamente como custo. Nesta etapa, somente a provisão exige confirmação para atualizar a caixinha trabalhista.</div>
    <div class="cards-grid" style="grid-template-columns:repeat(auto-fit,minmax(170px,1fr));margin-bottom:20px"><div class="card"><div class="card-label">Remuneração / bruto</div><div class="card-value" style="font-size:25px">${fmtValor(totalRem)}</div></div><div class="card"><div class="card-label">Líquido estimado</div><div class="card-value" style="font-size:25px;color:var(--azul)">${fmtValor(totalLiq)}</div></div><div class="card"><div class="card-label">Descontos</div><div class="card-value" style="font-size:25px">${fmtValor(totalDesc)}</div><div class="card-sub">informativo; já contidos no bruto</div></div><div class="card"><div class="card-label">Encargos da empresa</div><div class="card-value" style="font-size:25px">${fmtValor(totalEnc)}</div></div><div class="card"><div class="card-label">Provisões do mês</div><div class="card-value" style="font-size:25px;color:#0f766e">${fmtValor(totalProv)}</div><div class="card-sub">Pendente: ${fmtValor(pendenciaProvisaoMesV20(psMesV20,psAnoV20))}</div></div><div class="card"><div class="card-label">Custo total</div><div class="card-value" style="font-size:25px;color:var(--vermelho)">${fmtValor(total)}</div></div></div>
    ${cards||'<div class="section-box"><div class="empty"><div class="empty-icon">👷</div>Nenhum colaborador ativo neste mês.<br><button class="btn btn-primary btn-sm" onclick="abrirFuncionarioV20()" style="margin-top:12px">+ Cadastrar colaborador</button></div></div>'}`;
}
window.renderPessoalV20=renderPessoalV20;
window.navegarPessoalV20=function(delta){ psMesV20+=delta;if(psMesV20<0){psMesV20=11;psAnoV20--;}if(psMesV20>11){psMesV20=0;psAnoV20++;}renderPessoalV20(); };

function valorCfgV21(cfg,k,legacy=0){
  if(cfg?.[k]!==undefined && cfg?.[k]!==null && cfg?.[k]!=='') return nV20(cfg[k]);
  return nV20(legacy);
}
function camposCltV20(cfg={}){
  const bruto=remunBaseCfgV21(cfg);
  const temNovoEnc=RUBRICAS_ENCARGOS_V21.some(([k])=>cfg[k]!==undefined && cfg[k]!==null && cfg[k]!=='');
  const legadoOutros=temNovoEnc?0:nV20(cfg.encargos);
  return `<div id="p-clt-campos" style="display:${cfg.clt?'':'none'};grid-column:1/-1">
    <div style="font-family:'Bebas Neue';font-size:17px;letter-spacing:.4px;margin:12px 0 8px">Folha do colaborador</div>
    <div class="form-grid">
      <div class="form-group"><label class="form-label">INSS descontado do colaborador</label><input class="form-input p-calc-v21" id="p-inssDesconto" type="number" step="0.01" value="${valorCfgV21(cfg,'inssDesconto')}" oninput="atualizarResumoCltV21()"><div class="form-hint">Retido do salário; não é custo adicional.</div></div>
      <div class="form-group"><label class="form-label">IRRF descontado</label><input class="form-input p-calc-v21" id="p-irrfDesconto" type="number" step="0.01" value="${valorCfgV21(cfg,'irrfDesconto')}" oninput="atualizarResumoCltV21()"></div>
      <div class="form-group"><label class="form-label">Outros descontos</label><input class="form-input p-calc-v21" id="p-outrosDescontos" type="number" step="0.01" value="${valorCfgV21(cfg,'outrosDescontos')}" oninput="atualizarResumoCltV21()"></div>
      <div class="form-group"><label class="form-label">Salário líquido estimado</label><input class="form-input" id="p-liquido-calculado" value="${fmtValor(Math.max(0,bruto-descontosCfgV21(cfg)))}" disabled><div class="form-hint">Salário bruto menos descontos.</div></div>
    </div>
    <div style="font-family:'Bebas Neue';font-size:17px;letter-spacing:.4px;margin:18px 0 8px">Encargos pagos pela empresa</div>
    <div class="form-grid">
      <div class="form-group"><label class="form-label">FGTS mensal</label><input class="form-input p-calc-v21" id="p-fgtsMensal" type="number" step="0.01" value="${valorCfgV21(cfg,'fgtsMensal')}" oninput="atualizarResumoCltV21()"><div class="form-hint">Custo do empregador.</div></div>
      <div class="form-group"><label class="form-label">Contribuição patronal</label><input class="form-input p-calc-v21" id="p-inssPatronal" type="number" step="0.01" value="${valorCfgV21(cfg,'inssPatronal')}" oninput="atualizarResumoCltV21()"><div class="form-hint">Preencher somente quando aplicável.</div></div>
      <div class="form-group"><label class="form-label">RAT / terceiros</label><input class="form-input p-calc-v21" id="p-ratTerceiros" type="number" step="0.01" value="${valorCfgV21(cfg,'ratTerceiros')}" oninput="atualizarResumoCltV21()"></div>
      <div class="form-group"><label class="form-label">Outros encargos patronais / ajuste</label><input class="form-input p-calc-v21" id="p-outrosEncargosPatronais" type="number" step="0.01" value="${valorCfgV21(cfg,'outrosEncargosPatronais',legadoOutros)}" oninput="atualizarResumoCltV21()">${legadoOutros>0?'<div class="form-hint" style="color:#92400e">Valor trazido do campo genérico da versão anterior. Revise a classificação.</div>':''}</div>
    </div>
    <div style="font-family:'Bebas Neue';font-size:17px;letter-spacing:.4px;margin:18px 0 8px">Provisões trabalhistas</div>
    <div class="form-grid">
      <div class="form-group"><label class="form-label">Provisão do 13º</label><input class="form-input p-calc-v21" id="p-prov13" type="number" step="0.01" value="${nV20(cfg.prov13)}" oninput="atualizarResumoCltV21()"></div>
      <div class="form-group"><label class="form-label">Provisão do 1/3 de férias</label><input class="form-input p-calc-v21" id="p-provFerias" type="number" step="0.01" value="${nV20(cfg.provFerias)}" oninput="atualizarResumoCltV21()"></div>
      <div class="form-group"><label class="form-label">FGTS sobre o 13º</label><input class="form-input p-calc-v21" id="p-provFgts13" type="number" step="0.01" value="${nV20(cfg.provFgts13)}" oninput="atualizarResumoCltV21()"></div>
      <div class="form-group"><label class="form-label">FGTS sobre 1/3 de férias</label><input class="form-input p-calc-v21" id="p-provFgtsFerias" type="number" step="0.01" value="${nV20(cfg.provFgtsFerias)}" oninput="atualizarResumoCltV21()"></div>
      <div class="form-group"><label class="form-label">Provisão multa rescisória</label><input class="form-input p-calc-v21" id="p-provMulta" type="number" step="0.01" value="${nV20(cfg.provMulta)}" oninput="atualizarResumoCltV21()"></div>
      <div class="form-group"><label class="form-label">Outras provisões</label><input class="form-input p-calc-v21" id="p-provOutras" type="number" step="0.01" value="${nV20(cfg.provOutras)}" oninput="atualizarResumoCltV21()"></div>
    </div>
    <div id="p-resumo-clt-v21" style="margin-top:16px;background:#f8fafc;border:1px solid var(--borda);border-radius:8px;padding:14px"></div>
  </div>`;
}
window.atualizarResumoCltV21=function(){
  const n=id=>nV20(document.getElementById(id)?.value);
  const bruto=n('p-remuneracao');
  const descontos=n('p-inssDesconto')+n('p-irrfDesconto')+n('p-outrosDescontos');
  const liquido=Math.max(0,bruto-descontos);
  const encargos=n('p-fgtsMensal')+n('p-inssPatronal')+n('p-ratTerceiros')+n('p-outrosEncargosPatronais');
  const provisoes=n('p-prov13')+n('p-provFerias')+n('p-provFgts13')+n('p-provFgtsFerias')+n('p-provMulta')+n('p-provOutras');
  const total=bruto+encargos+provisoes;
  const liq=document.getElementById('p-liquido-calculado');if(liq)liq.value=fmtValor(liquido);
  const box=document.getElementById('p-resumo-clt-v21');if(box)box.innerHTML=`<div style="font-weight:700;margin-bottom:10px">Resumo mensal</div><div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px"><div><div class="card-label">Bruto</div><strong>${fmtValor(bruto)}</strong></div><div><div class="card-label">Descontos</div><strong>${fmtValor(descontos)}</strong></div><div><div class="card-label">Líquido</div><strong style="color:var(--azul)">${fmtValor(liquido)}</strong></div><div><div class="card-label">Encargos + provisões</div><strong>${fmtValor(encargos+provisoes)}</strong></div><div><div class="card-label">Custo DRE</div><strong style="color:var(--vermelho)">${fmtValor(total)}</strong></div></div>${descontos>bruto?'<div style="color:var(--vermelho);font-size:12px;margin-top:8px">Os descontos não podem superar o salário bruto.</div>':''}`;
};
window.toggleCltV20=function(){
  const clt=document.getElementById('p-clt')?.checked;
  const el=document.getElementById('p-clt-campos'); if(el) el.style.display=clt?'':'none';
  const lab=document.getElementById('p-remuneracao-label'); if(lab)lab.textContent=clt?'Salário bruto mensal':'Remuneração mensal base';
  const hint=document.getElementById('p-remuneracao-hint'); if(hint)hint.textContent=clt?'Valor bruto da folha. INSS e IRRF serão informados separadamente como descontos.':'No variável, serve como referência; o mês só entra após informar o valor.';
  if(clt)setTimeout(()=>atualizarResumoCltV21(),0);
};
window.abrirFuncionarioV20=async function(id=''){
  await carregarPessoalV20();
  const f=id?pessoalFuncionariosV20.find(x=>String(x.id)===String(id)):null;
  const cfg=f?configFuncMesV20(f,psMesV20,psAnoV20):{inicioMes:psMesV20,inicioAno:psAnoV20,remuneracaoTipo:'fixa',clt:false};
  const html=`<div class="overlay open" id="modal-pessoal-v20" style="z-index:480"><div class="modal" style="max-width:800px"><div class="modal-header"><div><div class="modal-title">${f?'Editar':'Cadastrar'} colaborador</div><div style="font-size:12px;color:var(--texto-muted)">${f?'A nova configuração será aplicada a partir do mês escolhido, preservando o histórico anterior.':'Os valores serão repetidos mensalmente a partir da vigência.'}</div></div><button class="modal-close" onclick="document.getElementById('modal-pessoal-v20').remove()">✕</button></div><div class="modal-body"><div class="form-grid"><div class="form-group full"><label class="form-label">Nome</label><input class="form-input" id="p-nome" value="${esc(f?.nome||'')}"></div><div class="form-group"><label class="form-label">Aplicar configuração a partir de</label><input class="form-input" id="p-vigencia" type="month" value="${mesAnoInputV20(psMesV20,psAnoV20)}"></div><div class="form-group"><label class="form-label">Tipo de remuneração</label><select class="form-select" id="p-tipo"><option value="fixa" ${cfg.remuneracaoTipo!=='variavel'?'selected':''}>Fixa — repetir todo mês</option><option value="variavel" ${cfg.remuneracaoTipo==='variavel'?'selected':''}>Variável — informar mensalmente</option></select></div><div class="form-group"><label class="form-label" id="p-remuneracao-label">${cfg.clt?'Salário bruto mensal':'Remuneração mensal base'}</label><input class="form-input" id="p-remuneracao" type="number" step="0.01" value="${remunBaseCfgV21(cfg)}" oninput="atualizarResumoCltV21()"><div class="form-hint" id="p-remuneracao-hint">${cfg.clt?'Valor bruto da folha. INSS e IRRF serão informados separadamente como descontos.':'No variável, serve como referência; o mês só entra após informar o valor.'}</div></div><div class="form-group"><label class="form-label">Estrutura CLT</label><label style="display:flex;align-items:center;gap:9px;padding:9px 0"><input id="p-clt" type="checkbox" ${cfg.clt?'checked':''} onchange="toggleCltV20()" style="width:18px;height:18px"> Ativar folha, encargos e provisões</label></div>${camposCltV20(cfg)}<div class="form-group full" style="margin-top:6px"><label style="display:flex;align-items:center;gap:9px"><input id="p-substituir" type="checkbox" ${cfg.substituirAntiga?'checked':''} style="width:18px;height:18px"> Substituir uma despesa antiga a partir desta vigência</label></div><div class="form-group full"><label class="form-label">Texto da despesa antiga</label><input class="form-input" id="p-antiga" value="${esc(cfg.descricaoAntiga||f?.nome||'')}" placeholder="Ex: Gabriel (professor principal)"><div class="form-hint">Evita duplicidade. Os meses anteriores permanecem preservados.</div></div></div></div><div class="modal-footer"><button class="btn btn-ghost" onclick="document.getElementById('modal-pessoal-v20').remove()">Cancelar</button><button class="btn btn-primary" onclick="salvarFuncionarioFormV20('${id}')">Salvar</button></div></div></div>`;
  document.body.insertAdjacentHTML('beforeend',html);
  if(cfg.clt)setTimeout(()=>atualizarResumoCltV21(),0);
};
window.salvarFuncionarioFormV20=async function(id=''){
  const nome=document.getElementById('p-nome').value.trim();
  const vig=parseMesAnoV20(document.getElementById('p-vigencia').value);
  if(!nome||!vig){toast('Informe nome e vigência.');return;}
  const clt=document.getElementById('p-clt').checked;
  const remuneracao=nV20(document.getElementById('p-remuneracao').value);
  const inssDesconto=clt?nV20(document.getElementById('p-inssDesconto').value):0;
  const irrfDesconto=clt?nV20(document.getElementById('p-irrfDesconto').value):0;
  const outrosDescontos=clt?nV20(document.getElementById('p-outrosDescontos').value):0;
  if(clt && inssDesconto+irrfDesconto+outrosDescontos>remuneracao+0.01){toast('Os descontos não podem superar o salário bruto.');return;}
  const fgtsMensal=clt?nV20(document.getElementById('p-fgtsMensal').value):0;
  const inssPatronal=clt?nV20(document.getElementById('p-inssPatronal').value):0;
  const ratTerceiros=clt?nV20(document.getElementById('p-ratTerceiros').value):0;
  const outrosEncargosPatronais=clt?nV20(document.getElementById('p-outrosEncargosPatronais').value):0;
  const encargos=fgtsMensal+inssPatronal+ratTerceiros+outrosEncargosPatronais;
  const nova={
    inicioMes:vig.mes,inicioAno:vig.ano,remuneracaoTipo:document.getElementById('p-tipo').value,
    remuneracao,salarioBruto:clt?remuneracao:0,clt,
    inssDesconto,irrfDesconto,outrosDescontos,
    fgtsMensal,inssPatronal,ratTerceiros,outrosEncargosPatronais,encargos,
    prov13:clt?nV20(document.getElementById('p-prov13').value):0,
    provFerias:clt?nV20(document.getElementById('p-provFerias').value):0,
    provFgts13:clt?nV20(document.getElementById('p-provFgts13').value):0,
    provFgtsFerias:clt?nV20(document.getElementById('p-provFgtsFerias').value):0,
    provMulta:clt?nV20(document.getElementById('p-provMulta').value):0,
    provOutras:clt?nV20(document.getElementById('p-provOutras').value):0,
    substituirAntiga:document.getElementById('p-substituir').checked,
    descricaoAntiga:document.getElementById('p-antiga').value.trim(),atualizadoEm:new Date().toISOString()
  };
  let f=id?pessoalFuncionariosV20.find(x=>String(x.id)===String(id)):null;
  if(!f){const fid=`pf_${Date.now()}`;f={id:fid,nome,status:'ativo',versoes:[nova],criadoEm:new Date().toISOString()};}
  else{const vs=versoesFuncV20(f).filter(v=>!(v.inicioMes===vig.mes&&v.inicioAno===vig.ano));f={...f,nome,versoes:[...vs,nova],status:'ativo',atualizadoEm:new Date().toISOString()};}
  await salvarFuncionarioV20(f);invalidarDespesasPessoalV20();document.getElementById('modal-pessoal-v20')?.remove();await loadDespesas(psMesV20,psAnoV20);toast('Colaborador salvo ✓');renderPessoalV20();
};
window.encerrarFuncionarioV20=async function(id){
  const f=pessoalFuncionariosV20.find(x=>String(x.id)===String(id));if(!f)return;
  if(!confirm(`Encerrar ${f.nome} a partir de ${MESES_NOMES[psMesV20]} ${psAnoV20}? O histórico anterior será mantido.`))return;
  let d=new Date(psAnoV20,psMesV20,1);d.setMonth(d.getMonth()-1);
  f={...f,fimMes:d.getMonth(),fimAno:d.getFullYear(),atualizadoEm:new Date().toISOString()};
  await salvarFuncionarioV20(f);invalidarDespesasPessoalV20();toast('Colaborador encerrado ✓');renderPessoalV20();
};
window.definirRemuneracaoMesV20=async function(id){
  const f=pessoalFuncionariosV20.find(x=>String(x.id)===String(id));if(!f)return;
  const r=registroMensalV20(id,psMesV20,psAnoV20);
  const atual=r.remuneracaoOverride??remunBaseCfgV21(configFuncMesV20(f,psMesV20,psAnoV20));
  const v=prompt(`Remuneração/salário bruto de ${f.nome} em ${MESES_NOMES[psMesV20]} ${psAnoV20}:`,String(atual));if(v===null)return;
  const n=Number(String(v).replace(',','.'));if(isNaN(n)||n<0){toast('Valor inválido.');return;}
  await salvarMensalV20({...r,remuneracaoOverride:n,atualizadoEm:new Date().toISOString()});invalidarDespesasPessoalV20();await loadDespesas(psMesV20,psAnoV20);toast('Valor mensal atualizado ✓');renderPessoalV20();
};

async function removerMovPessoalV20(id){
  const m=caixaMovs.find(x=>String(x.id)===String(id)); if(m){m.status='excluido';m.excluidoEm=new Date().toISOString();await setDoc(doc(db,'caixa_movimentacoes',id),m);}
}
window.confirmarPessoalV20=async function(id,tipo){
  if(tipo!=='provisao') return;
  const f=pessoalFuncionariosV20.find(x=>String(x.id)===String(id));if(!f)return;
  const x=resumoFuncMesV20(f,psMesV20,psAnoV20),r={...registroMensalV20(id,psMesV20,psAnoV20)};
  if(!x.cfg.clt||x.provisoes<=0){toast('Não há provisões cadastradas.');return;}
  const movId=`cx_pessoal_${id}_${psAnoV20}_${String(psMesV20).padStart(2,'0')}`;
  if(r.provisaoConfirmada){
    if(!confirm('Desfazer a transferência para a caixinha trabalhista?'))return;
    r.provisaoConfirmada=false;r.provisaoData='';await removerMovPessoalV20(movId);
  }else{
    const data=prompt('Data da transferência para a caixinha:',new Date().toISOString().split('T')[0]);if(!data)return;
    const detalhe={};RUBRICAS_PROV_V20.forEach(([k])=>detalhe[k]=nV20(x.cfg[k]));
    r.provisaoConfirmada=true;r.provisaoData=data;r.provisaoValorSnapshot=x.provisoes;r.provisoesSnapshot=detalhe;
    const mov={id:movId,tipo:'provisao_trabalhista',data,mes:psMesV20,ano:psAnoV20,valor:Number(x.provisoes.toFixed(2)),destino:'trabalhista',caixaId:'trabalhista',funcionarioId:id,funcionarioNome:f.nome,detalhePessoal:detalhe,descricao:`Provisões trabalhistas — ${f.nome} — ${MESES_NOMES[psMesV20]} ${psAnoV20}`,status:'ativo',criadoEm:new Date().toISOString(),ts:Date.now()};
    await salvarMovCaixa(mov);
  }
  r.atualizadoEm=new Date().toISOString();await salvarMensalV20(r);toast('Provisão atualizada ✓');renderPessoalV20();
};

function pendenciasPessoalV20(mes,ano){
  const lista=ativosPessoalMesV20(mes,ano);let provisoes=0,variaveis=0;
  lista.forEach(x=>{if(x.variavelPendente)variaveis++;if(x.cfg.clt&&x.provisoes>0&&!x.reg.provisaoConfirmada)provisoes++;});
  return{provisoes,variaveis,total:provisoes+variaveis};
}
function inserirDashboardPessoalV20(){
  const cont=document.getElementById('content');if(!cont)return;
  const p=pendenciasPessoalV20(MES_ATUAL,ANO_ATUAL),custo=totalCustoPessoalMesV20(MES_ATUAL,ANO_ATUAL),prov=totalProvisoesPessoalMesV20(MES_ATUAL,ANO_ATUAL);
  const box=`<div class="section-box" style="margin-top:16px"><div class="section-header"><div><div class="section-title">👷 Colaboradores — ${MESES_NOMES[MES_ATUAL]}</div><div style="font-size:12px;color:var(--texto-muted)">Custo reconhecido na DRE: <strong>${fmtValor(custo)}</strong> · provisões previstas: <strong>${fmtValor(prov)}</strong></div></div><button class="btn btn-ghost btn-sm" onclick="setView('pessoal')">Abrir módulo</button></div><div style="padding:14px 24px;display:flex;gap:8px;flex-wrap:wrap">${p.total?`${p.variaveis?statusPillV20(false,`${p.variaveis} valor(es) variável(is)`):''}${p.provisoes?statusPillV20(false,`${p.provisoes} provisão(ões)`):''}`:'<span style="color:var(--verde);font-weight:600">✓ Nenhuma pendência de colaboradores no mês.</span>'}</div></div>`;
  cont.insertAdjacentHTML('beforeend',box);
}
const renderDashboardBaseV20=renderDashboard;
renderDashboard=function(){ renderDashboardBaseV20(); inserirDashboardPessoalV20(); };
window.renderDashboard=renderDashboard;

// Caixinha especial de provisão trabalhista.
if(!CAIXAS_PADRAO.some(c=>c.id==='trabalhista')){
  const pos=Math.max(0,CAIXAS_PADRAO.findIndex(c=>c.id==='investimentos'));
  CAIXAS_PADRAO.splice(pos,0,{id:'trabalhista',nome:'Provisão trabalhista',icon:'👷',tipo:'especial',pct:0,metaValor:0,metaMeses:0,conta:'',cor:'#0f766e',desc:'Valores já reconhecidos como custo na DRE e efetivamente separados para 13º, férias, FGTS e rescisões.'});
}
function normalizarTrabalhistaV20(){
  if(caixaConfig?.caixas && !caixaConfig.caixas.some(c=>c.id==='trabalhista')) caixaConfig.caixas.splice(Math.max(0,caixaConfig.caixas.findIndex(c=>c.id==='investimentos')),0,cloneV20(CAIXAS_PADRAO.find(c=>c.id==='trabalhista')));
  if(caixaConfig?.caixas) caixaConfig.caixas=caixaConfig.caixas.map(c=>c.id==='trabalhista'?{...c,tipo:'especial',pct:0,nome:'Provisão trabalhista',icon:'👷',cor:'#0f766e'}:c);
}
const carregarCaixaConfigBaseV20=carregarCaixaConfig;
carregarCaixaConfig=async function(){const r=await carregarCaixaConfigBaseV20();normalizarTrabalhistaV20();return r;};window.carregarCaixaConfig=carregarCaixaConfig;
const salvarCaixaConfigBaseV20=salvarCaixaConfig;
salvarCaixaConfig=async function(){normalizarTrabalhistaV20();return salvarCaixaConfigBaseV20();};window.salvarCaixaConfig=salvarCaixaConfig;
totalPctCaixas=function(){return (caixaConfig?.caixas||CAIXAS_PADRAO).filter(c=>c.tipo!=='automatico'&&c.tipo!=='especial').reduce((s,c)=>s+nV20(c.pct),0);};window.totalPctCaixas=totalPctCaixas;
const sugestaoCaixaDinamicaBaseV20=sugestaoCaixaDinamica;
sugestaoCaixaDinamica=function(c,resumo){if(c.id==='trabalhista')return pendenciaProvisaoMesV20(cxMes,cxAno);return sugestaoCaixaDinamicaBaseV20(c,resumo);};window.sugestaoCaixaDinamica=sugestaoCaixaDinamica;
const metaCaixaDinamicaBaseV20=metaCaixaDinamica;
metaCaixaDinamica=function(c,resumo){if(c.id==='trabalhista')return 0;return metaCaixaDinamicaBaseV20(c,resumo);};window.metaCaixaDinamica=metaCaixaDinamica;

function saldosRubricasV20(){
  const mapa={};
  Object.values(pessoalMesesV20).filter(r=>r.provisaoConfirmada&&r.provisoesSnapshot).forEach(r=>{if(!mapa[r.funcionarioId])mapa[r.funcionarioId]={};RUBRICAS_PROV_V20.forEach(([k])=>mapa[r.funcionarioId][k]=nV20(mapa[r.funcionarioId][k])+nV20(r.provisoesSnapshot[k]));});
  caixaMovs.filter(m=>m.status!=='excluido'&&m.tipo==='uso_provisao_trabalhista').forEach(m=>{if(!mapa[m.funcionarioId])mapa[m.funcionarioId]={};mapa[m.funcionarioId][m.rubrica]=nV20(mapa[m.funcionarioId][m.rubrica])-nV20(m.valor);});
  return mapa;
}
function renderPerfilTrabalhistaV20(c,resumo){
  const saldo=saldoCaixaManual('trabalhista',cxMes,cxAno),prev=totalProvisoesPessoalMesV20(cxMes,cxAno),real=totalProvisaoConfirmadaMesV20(cxMes,cxAno),pend=Math.max(0,prev-real),mapa=saldosRubricasV20();
  const funcs=Object.entries(mapa).map(([id,r])=>{const f=pessoalFuncionariosV20.find(x=>String(x.id)===String(id));const total=RUBRICAS_PROV_V20.reduce((s,[k])=>s+nV20(r[k]),0);return `<tr><td><strong>${esc(f?.nome||'Colaborador')}</strong></td><td>${RUBRICAS_PROV_V20.filter(([k])=>Math.abs(nV20(r[k]))>.004).map(([k,l])=>`${l}: <strong>${fmtValor(r[k])}</strong>`).join('<br>')||'—'}</td><td style="font-weight:700;color:#0f766e">${fmtValor(total)}</td></tr>`;}).join('');
  const movs=movimentosCaixaSelecionada('trabalhista',cxMes,cxAno).map(m=>{const v=valorMovParaCaixa(m,'trabalhista');return `<tr><td>${fmtData(m.data)}</td><td><strong>${esc(labelTipoMov(m.tipo))}</strong><div style="font-size:11px;color:var(--texto-muted)">${esc(m.descricao||'—')}</div></td><td style="font-weight:700;color:${v>=0?'var(--verde)':'var(--vermelho)'}">${v>=0?'+':'-'}${fmtValor(Math.abs(v))}</td></tr>`;}).join('');
  return `<div class="section-box"><div class="section-header"><div><div class="section-title">👷 Provisão trabalhista</div><div style="font-size:12px;color:var(--texto-muted)">A DRE reconhece o custo mensal. O saldo só aumenta quando Fernando confirma a transferência.</div><div style="font-size:11px;color:var(--texto-muted);margin-top:4px">📍 Conta/local: <strong>${esc(contaCaixaNome(c))}</strong></div></div><div style="display:flex;gap:6px;flex-wrap:wrap"><button class="btn btn-primary btn-sm" onclick="registrarUsoProvisaoV20()">Usar provisão</button><button class="btn btn-ghost btn-sm" onclick="abrirConfigCaixas('trabalhista')">Editar conta/local</button><button class="btn btn-ghost btn-sm" onclick="setView('pessoal')">Abrir Colaboradores</button></div></div><div style="padding:16px 24px;display:grid;grid-template-columns:repeat(4,1fr);gap:12px;border-bottom:1px solid var(--borda)"><div><div class="card-label">Saldo atual</div><div style="font-family:'Bebas Neue';font-size:26px;color:#0f766e">${fmtValor(saldo)}</div></div><div><div class="card-label">Previsto no mês</div><div style="font-family:'Bebas Neue';font-size:26px">${fmtValor(prev)}</div></div><div><div class="card-label">Transferido</div><div style="font-family:'Bebas Neue';font-size:26px;color:var(--verde)">${fmtValor(real)}</div></div><div><div class="card-label">Pendente</div><div style="font-family:'Bebas Neue';font-size:26px;color:${pend>0?'var(--vermelho)':'var(--verde)'}">${fmtValor(pend)}</div></div></div><div style="padding:16px 24px"><div style="font-weight:700;margin-bottom:10px">Saldo detalhado por colaborador</div><div class="table-wrap"><table><thead><tr><th>Colaborador</th><th>Composição acumulada</th><th>Total</th></tr></thead><tbody>${funcs||'<tr><td colspan="3"><div class="empty">Nenhuma provisão confirmada.</div></td></tr>'}</tbody></table></div><div style="font-weight:700;margin:18px 0 10px">Movimentações do mês</div><div class="table-wrap"><table><thead><tr><th>Data</th><th>Movimentação</th><th>Valor</th></tr></thead><tbody>${movs||'<tr><td colspan="3"><div class="empty">Nenhuma movimentação no mês.</div></td></tr>'}</tbody></table></div></div></div>`;
}
const renderPerfilCaixaHtmlBaseV20=renderPerfilCaixaHtml;
renderPerfilCaixaHtml=function(c,resumo){if(c?.id==='trabalhista')return renderPerfilTrabalhistaV20(c,resumo);return renderPerfilCaixaHtmlBaseV20(c,resumo);};window.renderPerfilCaixaHtml=renderPerfilCaixaHtml;
window.registrarUsoProvisaoV20=async function(){
  await carregarPessoalV20();await carregarMovCaixa();
  const ativos=pessoalFuncionariosV20.filter(f=>Object.values(saldosRubricasV20()[f.id]||{}).some(v=>nV20(v)>0));if(!ativos.length){toast('Não há saldo detalhado disponível.');return;}
  const nomes=ativos.map((f,i)=>`${i+1} - ${f.nome}`).join('\n'),escolha=prompt(`Colaborador:\n${nomes}`,'1');if(escolha===null)return;
  const f=ativos[Number(escolha)-1];if(!f){toast('Colaborador inválido.');return;}
  const saldo=saldosRubricasV20()[f.id]||{},rubs=RUBRICAS_PROV_V20.filter(([k])=>nV20(saldo[k])>0);
  const rtxt=rubs.map(([k,l],i)=>`${i+1} - ${l} (${fmtValor(saldo[k])})`).join('\n'),re=prompt(`Provisão:\n${rtxt}`,'1');if(re===null)return;
  const [rub,l]=rubs[Number(re)-1]||[];if(!rub){toast('Provisão inválida.');return;}
  const vv=prompt(`Valor a utilizar de ${l}:`,String(nV20(saldo[rub]).toFixed(2)));if(vv===null)return;
  const valor=Number(String(vv).replace(',','.'));if(!(valor>0)||valor>nV20(saldo[rub])+0.01){toast('Valor inválido ou superior ao saldo.');return;}
  const data=prompt('Data do pagamento:',new Date().toISOString().split('T')[0]);if(!data)return;
  const id=`cx_uso_trab_${Date.now()}`,mov={id,tipo:'uso_provisao_trabalhista',data,valor,origem:'trabalhista',caixaId:'trabalhista',funcionarioId:f.id,funcionarioNome:f.nome,rubrica:rub,descricao:`Uso de ${l} — ${f.nome}`,status:'ativo',criadoEm:new Date().toISOString(),ts:Date.now()};
  await salvarMovCaixa(mov);toast('Uso da provisão registrado ✓');renderCaixaView();
};
const valorMovParaCaixaBaseV20=valorMovParaCaixa;
valorMovParaCaixa=function(m,id){if(m.tipo==='uso_provisao_trabalhista')return id==='trabalhista'?-nV20(m.valor):0;return valorMovParaCaixaBaseV20(m,id);};window.valorMovParaCaixa=valorMovParaCaixa;
const labelTipoMovBaseV20=labelTipoMov;
labelTipoMov=function(t){if(t==='provisao_trabalhista')return'Transferência de provisão trabalhista';if(t==='uso_provisao_trabalhista')return'Uso de provisão trabalhista';return labelTipoMovBaseV20(t);};window.labelTipoMov=labelTipoMov;

// Não incluir a caixinha trabalhista na distribuição percentual automática.
window.aplicarSugestaoCaixa=async function(){
  return busyRun('Aplicando sugestão...',async()=>{await carregarCaixaConfig();await carregarMovCaixa();await carregarAjustesCaixa();const resumo=await resumoCaixaMes(cxMes,cxAno);if(resumo.base<=0){toast('Não há valor livre positivo para distribuir.');return;}const existentes=caixaMovs.filter(m=>m.status!=='excluido'&&['sugestao_auto','recomposicao_antecipado'].includes(m.tipo)&&m.mes===cxMes&&m.ano===cxAno);if(existentes.length&&!confirm('Já existe sugestão automática aplicada neste mês. Substituir?'))return;const batch=writeBatch(db);existentes.forEach(m=>{const novo={...m,status:'excluido',excluidoEm:new Date().toISOString()};batch.set(doc(db,'caixa_movimentacoes',m.id),novo);caixaMovs=caixaMovs.map(x=>x.id===m.id?novo:x);});let count=0;const recompor=sugestaoRecomposicaoProvisionamento(resumo);if(recompor>0){const id=`cx_recomp_${chaveMesCaixa(cxMes,cxAno)}_${Date.now()}`,mov={id,tipo:'recomposicao_antecipado',data:new Date(cxAno,cxMes,1).toISOString().split('T')[0],mes:cxMes,ano:cxAno,valor:Number(recompor.toFixed(2)),destino:'antecipados',caixaId:'antecipados',descricao:`Recomposição automática do pagamento antecipado — ${nomeMesAno(cxMes,cxAno)}`,status:'ativo',criadoEm:new Date().toISOString(),ts:Date.now()};batch.set(doc(db,'caixa_movimentacoes',id),mov);caixaMovs.push(mov);count++;}else{(caixaConfig?.caixas||CAIXAS_PADRAO).filter(c=>c.tipo!=='automatico'&&c.tipo!=='especial').forEach((c,i)=>{const valor=sugestaoCaixaDinamica(c,resumo);if(valor<=0)return;const id=`cx_auto_${chaveMesCaixa(cxMes,cxAno)}_${c.id}_${Date.now()}_${i}`,mov={id,tipo:'sugestao_auto',data:new Date(cxAno,cxMes,1).toISOString().split('T')[0],mes:cxMes,ano:cxAno,valor:Number(valor.toFixed(2)),destino:c.id,caixaId:c.id,descricao:`Sugestão automática — ${nomeMesAno(cxMes,cxAno)}`,status:'ativo',criadoEm:new Date().toISOString(),ts:Date.now()+i};batch.set(doc(db,'caixa_movimentacoes',id),mov);caixaMovs.push(mov);count++;});}await batch.commit();toast(`${count} alocação(ões) aplicada(s) ✓`);renderCaixaView();});
};


// ═══════════════════════════════════════════════════
// V22 — Exibição consolidada e expansível dos colaboradores em Despesas
// A DRE continua recebendo os componentes separados conceitualmente, mas a tela
// mostra somente o custo mensal total de cada colaborador, com detalhamento sob demanda.
// ═══════════════════════════════════════════════════
function detalheColaboradorDespesasV22(x){
  const clt=!!x.cfg.clt;
  const linhas=clt ? [
    ['Salário bruto',x.remuneracao],
    ['Encargos da empresa',x.encargos],
    ['Provisões trabalhistas',x.provisoes]
  ] : [
    ['Remuneração mensal',x.remuneracao]
  ];
  return `<div style="padding:4px 14px 12px 38px;background:#fafafa;border-top:1px dashed var(--borda)">
    ${linhas.map(([label,valor])=>`<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:7px 0;border-bottom:1px solid var(--borda);font-size:12.5px"><span style="color:var(--texto-mid)">${label}</span><strong>${fmtValor(valor)}</strong></div>`).join('')}
    <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding-top:9px;font-size:13px"><strong>Custo mensal total</strong><strong style="color:var(--vermelho)">${fmtValor(x.total)}</strong></div>
  </div>`;
}

function consolidarColaboradoresNaTelaDespesasV22(){
  const ativos=ativosPessoalMesV20(despMes,despAno);
  if(!ativos.length) return;

  const card=[...document.querySelectorAll('.desp-card')].find(el=>
    (el.querySelector('.desp-card-title')?.textContent||'').includes('Colaboradores')
  );
  if(!card) return;

  const itens=[...card.querySelectorAll('.desp-item')];
  ativos.forEach(x=>{
    const item=itens.find(el=>(el.querySelector('.desp-nome')?.textContent||'').trim()===String(x.f.nome||'').trim());
    if(!item) return;
    const nome=esc(x.f.nome||'Colaborador');
    const resumo=x.cfg.clt?'Salário, encargos e provisões':'Remuneração mensal';
    const bloco=document.createElement('details');
    bloco.className='desp-colaborador-v22';
    bloco.style.cssText='border-bottom:1px solid var(--borda);';
    bloco.innerHTML=`<summary style="list-style:none;display:flex;align-items:center;gap:9px;padding:11px 0;cursor:pointer;user-select:none">
      <span class="desp-colab-seta-v22" style="width:18px;color:var(--texto-muted);font-size:12px;transition:transform .15s">▶</span>
      <span style="flex:1;min-width:0"><strong>${nome}</strong><span style="display:block;font-size:11px;color:var(--texto-muted);margin-top:2px">${resumo} · clique para detalhar</span></span>
      <span class="desp-valor">${fmtValor(x.total)}</span>
    </summary>${detalheColaboradorDespesasV22(x)}`;
    bloco.addEventListener('toggle',()=>{
      const seta=bloco.querySelector('.desp-colab-seta-v22');
      if(seta) seta.style.transform=bloco.open?'rotate(90deg)':'rotate(0deg)';
    });
    item.replaceWith(bloco);
  });
}

const renderDespesasBaseV22=renderDespesasView;
renderDespesasView=async function(){
  await renderDespesasBaseV22();
  consolidarColaboradoresNaTelaDespesasV22();
};
window.renderDespesasView=renderDespesasView;


// ═══════════════════════════════════════════════════
// V24 — Flag de Nota Fiscal na Receita por Competência
// Regra visual simples: 🧾 Emitir ou ✅ Emitida.
// A tela mostra apenas dois estados para Fernando, mas o sistema guarda o motivo interno
// para diferenciar nota mensal emitida, nota integral já emitida, sem cobrança e pendência.
// ═══════════════════════════════════════════════════
let notasFiscaisCacheV24 = {};
let notasFiscaisCarregadasV24 = false;
let nfFiltroV24 = 'todas'; // todas | a_emitir | emitida

function normalizarNomeNFV24(nome){
  return String(nome||'')
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
}
function competenciaNFV24(mes, ano){ return `${ano}-${String(Number(mes)+1).padStart(2,'0')}`; }
function chaveNFV24(tipo, origemId, mes, ano){
  return `nf_${tipo}_${String(origemId||'sem_id').replace(/[^A-Za-z0-9_-]/g,'_')}_${ano}_${String(Number(mes)+1).padStart(2,'0')}`;
}

const NF_A_EMITIR_INICIAL_V24 = new Set([
  'eutropio','victor emanuel','francisca filha','luana bandeira','hercilia rolim','lucas viana','victor sergio','ana isabel','alinne barros','george paiva','iago noronha','fernando moura'
]);
const NF_SEM_COBRANCA_V24 = new Set(['eliane batista']);
const NF_INTEGRAL_JA_EMITIDA_V24 = new Set([
  'danyel castelo branco','maria clara vasconcelos','ana virginia','ana carla','antonio ribeiro paiva junior','antonio ribeiro','marcos dias','luciano coelho','carlinhos','yasmin','catarina vasconcelos','laisa allen','lucas alves','aponea ciriaco','lais caldas'
]);

async function carregarNotasFiscaisV24(forcar=false){
  if(notasFiscaisCarregadasV24 && !forcar) return notasFiscaisCacheV24;
  try{
    const snap = await getDocs(collection(db,'notas_fiscais'));
    notasFiscaisCacheV24 = {};
    snap.forEach(d=>{ notasFiscaisCacheV24[d.id] = d.data(); });
    notasFiscaisCarregadasV24 = true;
  }catch(e){
    console.warn('Não foi possível carregar notas fiscais:', e);
    notasFiscaisCarregadasV24 = true;
  }
  return notasFiscaisCacheV24;
}

function regraPadraoNFContratoV24(c, mes, ano){
  const nome = normalizarNomeNFV24(c?.alunoNome||'');
  if(NF_SEM_COBRANCA_V24.has(nome)) return {statusNF:'emitida', motivoNF:'sem_cobranca'};
  if(NF_A_EMITIR_INICIAL_V24.has(nome)) return {statusNF:'a_emitir', motivoNF:'pendente_emissao'};
  if(NF_INTEGRAL_JA_EMITIDA_V24.has(nome)) return {statusNF:'emitida', motivoNF:'nota_integral_ja_emitida'};
  if(c?.plano === 'mensal' || c?.recebimento === 'mensal') return {statusNF:'a_emitir', motivoNF:'pendente_emissao'};
  const ini = dataLocal(c?.inicio);
  if(ini && ini >= new Date(2026,5,1)) return {statusNF:'a_emitir', motivoNF:'pendente_emissao'};
  return {statusNF:'emitida', motivoNF:'nota_integral_ja_emitida'};
}

function obterStatusNFItemV24(item){
  const salvo = notasFiscaisCacheV24[item.key];
  if(salvo?.statusNF) return {statusNF:salvo.statusNF, motivoNF:salvo.motivoNF||'manual', salvo:true, dados:salvo};
  if(item.tipo === 'contrato') return {...regraPadraoNFContratoV24(item.contrato, item.mes, item.ano), salvo:false};
  return {statusNF:'a_emitir', motivoNF:'pendente_emissao', salvo:false};
}

function itensReceitaCompetenciaNFV24(mes, ano){
  const contratosMes = contratos
    .filter(c=>contratoContaCompetenciaMes(c,mes,ano))
    .sort((a,b)=>(a.alunoNome||'').localeCompare(b.alunoNome||'','pt-BR'));
  const itens = contratosMes.map(c=>({
    tipo:'contrato',
    origemId:String(c.id),
    key:chaveNFV24('contrato', c.id, mes, ano),
    alunoId:String(c.alunoId||''),
    alunoNome:c.alunoNome||'—',
    contrato:c,
    descricao:nomeContrato(c),
    detalhe:`${fmtData(c.inicio)} → ${fmtData(vencAjustadoContrato(c)||c.venc)}${c.pgto==='Cartão'&&c.valorBruto?` · bruto cartão ${fmtValor(c.valorBruto)} · líquido ${fmtValor(valorContrato(c))}`:''}`,
    valor:mensalidadeContrato(c),
    mes, ano
  }));
  if(typeof aulasExtrasMes === 'function'){
    aulasExtrasMes(mes,ano).sort((a,b)=>(a.alunoNome||'').localeCompare(b.alunoNome||'','pt-BR')).forEach(p=>{
      itens.push({
        tipo:'aula_extra',
        origemId:String(p.id),
        key:chaveNFV24('aula_extra', p.id, mes, ano),
        alunoId:String(p.alunoId||''),
        alunoNome:p.alunoNome||'—',
        descricao:p.descricao||'Aula extra',
        detalhe:`${fmtData(p.data)} · aula extra`,
        valor:Number(p.valor||0),
        pagamento:p,
        mes, ano
      });
    });
  }
  return itens;
}

function motivoNFTextoV24(motivo){
  return ({
    pendente_emissao:'Pendente de emissão da nota fiscal desta competência.',
    nota_mensal_emitida:'Nota fiscal mensal marcada como emitida.',
    nota_integral_ja_emitida:'Competência coberta por nota integral já emitida anteriormente.',
    sem_cobranca:'Sem cobrança real / valor simbólico. Não há pendência de emissão.',
    manual:'Status ajustado manualmente.'
  })[motivo] || 'Controle de nota fiscal.';
}

function chipNFV24(item){
  const st = obterStatusNFItemV24(item);
  const emitir = st.statusNF === 'a_emitir';
  const prox = emitir ? 'emitida' : 'a_emitir';
  const label = emitir ? '🧾 Emitir' : '✅ Emitida';
  const cor = emitir ? '#92400e' : 'var(--verde)';
  const bg = emitir ? '#fff7ed' : 'rgba(46,125,50,0.08)';
  const border = emitir ? '#fed7aa' : 'rgba(46,125,50,0.22)';
  const title = emitir ? 'Clique para marcar como emitida' : `${motivoNFTextoV24(st.motivoNF)} Clique para reabrir como emitir.`;
  return `<button class="nf-chip-v24" title="${esc(title)}" onclick='alternarNFV24(${JSON.stringify(item.tipo)},${JSON.stringify(item.origemId)},${item.mes},${item.ano},${JSON.stringify(prox)})' style="color:${cor};background:${bg};border-color:${border}">${label}</button>`;
}

function renderTabelaReceitaNFV24(box){
  const todos = itensReceitaCompetenciaNFV24(finMes, finAno);
  const filtrados = todos.filter(item=>{
    if(nfFiltroV24==='todas') return true;
    return obterStatusNFItemV24(item).statusNF === nfFiltroV24;
  });
  const totalFiltro = filtrados.reduce((s,i)=>s+Number(i.valor||0),0);
  const table = box.querySelector('table');
  if(!table) return;
  const header = box.querySelector('.section-header');
  if(header && !header.querySelector('.nf-filtros-v24')){
    header.insertAdjacentHTML('beforeend', `<div class="nf-filtros-v24" style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
      <span style="font-size:11px;color:var(--texto-muted);font-weight:700;text-transform:uppercase;letter-spacing:.8px">NF</span>
      ${['todas','a_emitir','emitida'].map(f=>`<button class="btn ${nfFiltroV24===f?'btn-primary':'btn-ghost'} btn-sm" onclick="setFiltroNFV24('${f}')">${f==='todas'?'Todas':f==='a_emitir'?'Emitir':'Emitida'}</button>`).join('')}
    </div>`);
  }else if(header){
    const filtros = header.querySelector('.nf-filtros-v24');
    if(filtros){
      filtros.innerHTML = `<span style="font-size:11px;color:var(--texto-muted);font-weight:700;text-transform:uppercase;letter-spacing:.8px">NF</span>${['todas','a_emitir','emitida'].map(f=>`<button class="btn ${nfFiltroV24===f?'btn-primary':'btn-ghost'} btn-sm" onclick="setFiltroNFV24('${f}')">${f==='todas'?'Todas':f==='a_emitir'?'Emitir':'Emitida'}</button>`).join('')}`;
    }
  }
  table.innerHTML = `<thead><tr><th>Aluno</th><th>Contrato / detalhe</th><th style="text-align:right">Receita mensal</th><th style="text-align:center;width:120px">NF</th></tr></thead><tbody>${filtrados.map(item=>`<tr><td><strong>${esc(item.alunoNome||'—')}</strong></td><td>${esc(item.descricao||'—')}<div style="font-size:11px;color:var(--texto-muted)">${esc(item.detalhe||'')}</div></td><td style="font-weight:700;color:var(--verde);text-align:right">${fmtValor(item.valor)}</td><td style="text-align:center">${chipNFV24(item)}</td></tr>`).join('') || `<tr><td colspan="4"><div class="empty">Nenhuma receita neste filtro.</div></td></tr>`}</tbody><tfoot><tr style="background:#f9fafb;font-weight:700"><td colspan="2">${nfFiltroV24==='todas'?'Total receita':'Total filtrado'}</td><td style="text-align:right;color:var(--verde)">${fmtValor(totalFiltro)}</td><td></td></tr></tfoot>`;
}

function resumoNotasFiscaisV24(){
  const itens = itensReceitaCompetenciaNFV24(finMes, finAno);
  let qtdEmitir=0, qtdEmitida=0, valEmitir=0, valEmitida=0;
  itens.forEach(item=>{
    const st = obterStatusNFItemV24(item).statusNF;
    if(st==='a_emitir'){ qtdEmitir++; valEmitir += Number(item.valor||0); }
    else { qtdEmitida++; valEmitida += Number(item.valor||0); }
  });
  return {itens,qtdEmitir,qtdEmitida,valEmitir,valEmitida};
}

function aplicarNotaFiscalFinanceiroV24(){
  if(financeiroModo !== 'competencia') return;
  document.querySelectorAll('.nf-resumo-v24').forEach(el=>el.remove());
  const box = [...document.querySelectorAll('.section-box')].find(el=>{
    const t = el.querySelector('.section-title')?.textContent || '';
    return t.includes('Receita') && t.includes('Competência');
  });
  if(!box) return;
  const r = resumoNotasFiscaisV24();
  box.insertAdjacentHTML('beforebegin', `<div class="nf-resumo-v24" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin-bottom:18px">
    <div class="card" style="border-top:3px solid #b45309"><div class="card-label">Notas fiscais — ${MESES_NOMES[finMes]} ${finAno}</div><div class="card-value" style="font-size:24px;color:#b45309">${fmtValor(r.valEmitir)}</div><div class="card-sub">🧾 Emitir: ${r.qtdEmitir} aluno(s)</div></div>
    <div class="card" style="border-top:3px solid var(--verde)"><div class="card-label">Sem pendência de NF</div><div class="card-value" style="font-size:24px;color:var(--verde)">${fmtValor(r.valEmitida)}</div><div class="card-sub">✅ Emitida: ${r.qtdEmitida} aluno(s)</div></div>
  </div>`);
  renderTabelaReceitaNFV24(box);
}

window.setFiltroNFV24 = function(filtro){
  nfFiltroV24 = filtro || 'todas';
  aplicarNotaFiscalFinanceiroV24();
};

window.alternarNFV24 = async function(tipo, origemId, mes, ano, novoStatus){
  const key = chaveNFV24(tipo, origemId, mes, ano);
  const item = itensReceitaCompetenciaNFV24(mes, ano).find(i=>i.key===key);
  if(!item) return;
  if(novoStatus === 'a_emitir' && !confirm('Reabrir esta competência como Emitir?')) return;
  const reg = {
    id:key,
    tipoOrigem:tipo,
    origemId:String(origemId),
    alunoId:item.alunoId||'',
    alunoNome:item.alunoNome||'',
    competencia:competenciaNFV24(mes,ano),
    mes:Number(mes),
    ano:Number(ano),
    valor:Number(item.valor||0),
    statusNF:novoStatus,
    motivoNF:novoStatus==='emitida'?'nota_mensal_emitida':'pendente_emissao',
    atualizadoEm:new Date().toISOString(),
    ts:Date.now()
  };
  try{
    await setDoc(doc(db,'notas_fiscais',key), reg);
    notasFiscaisCacheV24[key] = reg;
    await registrarAuditoria('nota_fiscal_status', item.alunoId||'', item.alunoNome||'', {}, reg);
    toast(novoStatus==='emitida'?'Nota fiscal marcada como emitida ✓':'Nota fiscal reaberta como emitir ✓');
    aplicarNotaFiscalFinanceiroV24();
  }catch(e){
    console.error(e);
    alert('Não foi possível salvar o status da nota fiscal.');
  }
};

function instalarEstilosNFV24(){
  if(document.getElementById('nf-v24-style')) return;
  const st=document.createElement('style');
  st.id='nf-v24-style';
  st.textContent=`.nf-chip-v24{border:1px solid;border-radius:999px;padding:5px 10px;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;transition:.15s}.nf-chip-v24:hover{transform:translateY(-1px);box-shadow:0 3px 10px rgba(0,0,0,.08)}.nf-filtros-v24 .btn{padding:5px 10px}`;
  document.head.appendChild(st);
}
instalarEstilosNFV24();

const renderFinanceiroBaseV24 = renderFinanceiroView;
renderFinanceiroView = async function(){
  await carregarNotasFiscaisV24();
  await renderFinanceiroBaseV24();
  aplicarNotaFiscalFinanceiroV24();
};
window.renderFinanceiroView = renderFinanceiroView;


// ═══════════════════════════════════════════════════
// V27 — Cancelamento de contrato e reembolso
// Mantém a V26 e acrescenta regra de sugestão: após os prazos contratuais de 25%/15%, multa sugerida de 5%.
// Modal único: o sistema sugere, Fernando revisa/altera e salva.
// Reembolso não vira despesa. Multa/benefícios retidos viram receita extra, fora do fluxo de NF.
// A provisão de pagamentos antecipados é reduzida pelo valor liquidado no cancelamento.
// ═══════════════════════════════════════════════════
const VALORES_AVISTA_REEMBOLSO_V26 = {
  1:{trimestral:1079,semestral:1837,anual:2977},
  2:{trimestral:1367,semestral:2387,anual:4027},
  3:{trimestral:1647,semestral:2937,anual:5087},
  4:{trimestral:1927,semestral:3487,anual:6137},
  5:{trimestral:2207,semestral:4037,anual:7187}
};

function numV26(v){ return Number(String(v ?? '').replace(',','.')) || 0; }
function moneyInputV26(id, valor){ const el=document.getElementById(id); if(el) el.value = (Number(valor||0)).toFixed(2); }
function readMoneyV26(id){ return numV26(document.getElementById(id)?.value); }
function pad2V26(n){ return String(Number(n)).padStart(2,'0'); }
function ymV26(mes,ano){ return `${ano}-${pad2V26(Number(mes)+1)}`; }
function parseYMV26(ym){ const [y,m]=String(ym||'').split('-').map(Number); return {ano:y||ANO_ATUAL, mes:Math.max(0,(m||1)-1)}; }
function fimCompetenciaV26(ym){ const {ano,mes}=parseYMV26(ym); return new Date(ano, mes+1, 0).toISOString().split('T')[0]; }
function mesAnoDataIgualV26(data, mes, ano){ const d=dataLocal(data); return !!d && d.getFullYear()===Number(ano) && d.getMonth()===Number(mes); }
function competenciaPadraoCancelamentoV26(c, dataCancelamento){
  const d = dataLocal(dataCancelamento) || new Date();
  return `${d.getFullYear()}-${pad2V26(d.getMonth()+1)}`;
}
function mesesUtilizadosAteCompetenciaV26(c, ym){
  const ini = dataLocal(c?.inicio);
  if(!ini) return 1;
  const {ano,mes}=parseYMV26(ym);
  const bruto = (ano - ini.getFullYear())*12 + (mes - ini.getMonth()) + 1;
  return Math.max(1, Math.min(mesesContrato(c), bruto));
}
function valorVistaReferenciaV26(c){
  if(c?.valorVistaReferencia) return Number(c.valorVistaReferencia||0);
  const freq = Math.max(1, Math.min(5, Number(alunos.find(a=>String(a.id)===String(c?.alunoId))?.frequencia || c?.frequencia || 3)));
  return Number(VALORES_AVISTA_REEMBOLSO_V26[freq]?.[c?.plano] || valorContrato(c) || 0);
}
function percentualMultaReembolsoV26(plano, mesesUsados){
  if(plano === 'mensal') return 0;
  const m = Number(mesesUsados||0);

  // Política contratual: 25% e 15% nos prazos iniciais;
  // orientação operacional do Fernando: após esses prazos, sugerir 5%.
  if(plano === 'trimestral') return m <= 1 ? 25 : (m <= 2 ? 15 : 5);
  if(plano === 'semestral') return m <= 2 ? 25 : (m <= 4 ? 15 : 5);
  if(plano === 'anual') return m <= 3 ? 25 : (m <= 6 ? 15 : 5);
  return 0;
}
function sugestaoReembolsoV26(c, dataCancelamento=null, ultComp=null){
  const dataCanc = dataCancelamento || new Date().toISOString().split('T')[0];
  const comp = ultComp || competenciaPadraoCancelamentoV26(c, dataCanc);
  const mesesPlano = mesesContrato(c);
  const mesesUsados = mesesUtilizadosAteCompetenciaV26(c, comp);
  const valorTotal = valorContrato(c);
  const valorVista = valorVistaReferenciaV26(c);
  const pct = percentualMultaReembolsoV26(c?.plano, mesesUsados);
  if(c?.plano === 'mensal'){
    return {dataCancelamento:dataCanc, ultimaCompetencia:comp, mesesPlano, mesesUsados, valorTotal, valorVista, percentualMulta:0, valorConsumido:valorTotal, multaRetida:0, extrasDescontados:0, valorReembolsado:0};
  }
  const mensal = mesesPlano ? valorTotal / mesesPlano : valorTotal;
  const valorConsumido = mensal * mesesUsados;
  const multaRetida = valorTotal * pct / 100;
  const valorReembolsado = Math.max(0, valorVista - valorConsumido - multaRetida);
  return {dataCancelamento:dataCanc, ultimaCompetencia:comp, mesesPlano, mesesUsados, valorTotal, valorVista, percentualMulta:pct, valorConsumido, multaRetida, extrasDescontados:0, valorReembolsado};
}
function vencEfetivoContratoV26(c){
  if(c?.status === 'cancelado' && c?.cancelamento?.ultimaCompetencia){
    return c.cancelamento.vencEfetivo || fimCompetenciaV26(c.cancelamento.ultimaCompetencia);
  }
  return vencAjustadoContrato(c) || c?.venc || '';
}
function totalLiquidadoCancelamentoV26(c, mes=null, ano=null){
  const canc = c?.cancelamento;
  if(!canc || canc.status === 'excluido') return 0;
  if(mes !== null && ano !== null){
    const dataRef = canc.dataCancelamento || canc.dataReembolso;
    const d = dataLocal(dataRef);
    if(d && d > dataMesFim(mes,ano)) return 0;
  }
  return Number(canc.valorReembolsado||0) + Number(canc.multaRetida||0) + Number(canc.extrasDescontados||0);
}
function receitasExtrasCancelamentoMesV26(mes, ano){
  return contratos
    .filter(c=>c.status !== 'excluido' && c.cancelamento && c.cancelamento.status !== 'excluido' && mesAnoDataIgualV26(c.cancelamento.dataCancelamento || c.cancelamento.dataReembolso, mes, ano))
    .map(c=>{
      const multa = Number(c.cancelamento.multaRetida||0);
      const extras = Number(c.cancelamento.extrasDescontados||0);
      const valor = multa + extras;
      return {contrato:c, alunoId:String(c.alunoId||''), alunoNome:c.alunoNome||'—', valor, multa, extras, data:c.cancelamento.dataCancelamento||c.cancelamento.dataReembolso, descricao: extras>0 ? 'Multa/benefícios de cancelamento' : 'Multa rescisória'};
    }).filter(x=>Number(x.valor||0)>0);
}
function totalReceitasExtrasCancelamentoMesV26(mes, ano){ return receitasExtrasCancelamentoMesV26(mes,ano).reduce((s,x)=>s+Number(x.valor||0),0); }

contratoSobrepoeMes = function(c, mes, ano){
  if(!c || c.status === 'excluido') return false;
  const ini = dataLocal(c.inicio), venc = dataLocal(vencEfetivoContratoV26(c));
  if(!ini || !venc) return false;
  return ini <= dataMesFim(mes,ano) && venc >= dataMesInicio(mes,ano);
};
diasContratoNoMes = function(c, mes, ano){
  if(!c || c.status === 'excluido') return 0;
  const inicio = dataLocal(c.inicio), venc = dataLocal(vencEfetivoContratoV26(c));
  if(!inicio || !venc) return 0;
  const fimExclusivo = new Date(venc);
  if(fimExclusivo <= inicio) fimExclusivo.setDate(fimExclusivo.getDate()+1);
  const mesInicio = new Date(ano, mes, 1);
  const mesFimExclusivo = new Date(ano, mes+1, 1);
  const inicioCalc = new Date(Math.max(inicio.getTime(), mesInicio.getTime()));
  const fimCalc = new Date(Math.min(fimExclusivo.getTime(), mesFimExclusivo.getTime()));
  if(fimCalc <= inicioCalc) return 0;
  return Math.ceil((fimCalc - inicioCalc) / 86400000);
};
mesesCompetenciaContrato = function(c){
  const inicio = dataLocal(c?.inicio), venc = dataLocal(vencEfetivoContratoV26(c));
  if(!inicio || !venc || c.status === 'excluido') return [];
  const qtdMeses = Math.max(1, mesesContrato(c));
  const meses = [];
  const cursor = new Date(inicio.getFullYear(), inicio.getMonth(), 1);
  const fimLoop = new Date(venc.getFullYear(), venc.getMonth(), 1);
  while(cursor <= fimLoop){
    const ano = cursor.getFullYear(), mes = cursor.getMonth();
    const dias = diasContratoNoMes(c, mes, ano);
    if(dias > 0) meses.push({ano, mes, dias, chave:`${ano}_${String(mes).padStart(2,'0')}`});
    cursor.setMonth(cursor.getMonth()+1);
  }
  return meses.sort((a,b)=> b.dias - a.dias || a.ano - b.ano || a.mes - b.mes).slice(0, qtdMeses).sort((a,b)=> a.ano - b.ano || a.mes - b.mes);
};
contratoContaCompetenciaMes = function(c, mes, ano){
  const chave = `${ano}_${String(mes).padStart(2,'0')}`;
  return mesesCompetenciaContrato(c).some(m=>m.chave===chave);
};
statusContratoObj = function(c){
  if(!c) return {contrato:'nao_renovou', label:'Sem contrato', cor:'#6b7280', icon:'📋'};
  if(c.status === 'cancelado') return {contrato:'cancelado', label:'Cancelado', cor:'var(--vermelho)', icon:'⛔'};
  const hoje = new Date();
  const ini = dataLocal(c.inicio), venc = dataLocal(vencEfetivoContratoV26(c));
  if(ini > hoje) return {contrato:'futuro', label:'Contrato futuro', cor:'var(--azul)', icon:'⏳'};
  if(venc < hoje){
    const saldo = Math.max(0, valorContrato(c) - totalPagoContrato(c.id));
    return saldo>0 ? {contrato:'inadimplente', label:'Vencido em aberto', cor:'var(--vermelho)', icon:'🔴'} : {contrato:'quitado', label:'Quitado', cor:'var(--verde)', icon:'✅'};
  }
  const pago = totalPagoContrato(c.id), total = valorContrato(c);
  if(pago >= total && total > 0) return {contrato:'ativo', label:'Vigente e quitado', cor:'var(--verde)', icon:'✅'};
  if(pago > 0) return {contrato:'aguardando', label:'Vigente — parcial', cor:'var(--amarelo)', icon:'◐'};
  return {contrato:'aguardando', label:'Vigente — em aberto', cor:'var(--azul)', icon:'⏳'};
};
contratoVigenteAluno = function(alunoId){
  const lista = contratosDoAluno(alunoId);
  const hoje = new Date();
  const vigente = lista.find(c=>c.status!=='cancelado' && dataLocal(c.inicio)<=hoje && dataLocal(vencEfetivoContratoV26(c))>=hoje);
  if(vigente) return vigente;
  const futuro = lista.find(c=>c.status!=='cancelado' && dataLocal(c.inicio)>hoje);
  if(futuro) return futuro;
  return lista[lista.length-1] || null;
};
statusContrato = function(a){ return statusContratoObj(a?.contratoAtual); };
saldoAntecipadoContratoFimMes = function(c, mes, ano){
  if(!c || c.status==='excluido') return 0;
  const pagoAte = Math.min(valorContrato(c), totalPagoContratoAte(c,mes,ano));
  if(pagoAte <= 0) return 0;
  const reconhecidoAte = Math.min(valorContrato(c), mensalidadeContrato(c) * qtdMesesCompetenciaAte(c,mes,ano));
  const liquidado = totalLiquidadoCancelamentoV26(c,mes,ano);
  return Math.max(0, pagoAte - reconhecidoAte - liquidado);
};
const receitaMesEspBaseV26 = receitaMesEsp;
receitaMesEsp = function(mes,ano){ return receitaMesEspBaseV26(mes,ano) + totalReceitasExtrasCancelamentoMesV26(mes,ano); };
receitaMensal = function(){ return receitaMesEsp(MES_ATUAL, ANO_ATUAL); };
receitaDoMesSelecionada = function(mes,ano){ return financeiroModo==='caixa' ? receitaCaixaMes(mes,ano) : receitaMesEsp(mes,ano); };

const abrirPerfilAlunoBaseV26 = abrirPerfilAluno;
abrirPerfilAluno = async function(id){
  await abrirPerfilAlunoBaseV26(id);
  const a = alunos.find(x=>String(x.id)===String(id));
  const c = a?.contratoAtual || contratoVigenteAluno(id);
  if(!a || !c) return;
  const box = [...document.querySelectorAll('.section-box')].find(el=>el.querySelector('.section-title')?.textContent?.includes('Contrato Atual'));
  if(!box) return;
  const header = box.querySelector('.section-header');
  if(header && !header.querySelector('.btn-cancelamento-v26')){
    header.insertAdjacentHTML('beforeend', `<button class="btn ${c.status==='cancelado'?'btn-ghost':'btn-danger'} btn-sm btn-cancelamento-v26" onclick="abrirModalCancelamentoV26('${String(a.id)}','${String(c.id)}')">${c.status==='cancelado'?'📄 Ver cancelamento':'⛔ Cancelar / Reembolso'}</button>`);
  }
  if(c.cancelamento && !box.querySelector('.resumo-cancelamento-v26')){
    const canc = c.cancelamento;
    const area = box.querySelector('div[style*="padding:16px 24px"]') || box;
    const receitaExtra = Number(canc.multaRetida||0) + Number(canc.extrasDescontados||0);
    area.insertAdjacentHTML('beforeend', `<div class="resumo-cancelamento-v26" style="margin-top:14px;border:1px solid #fecaca;background:#fef2f2;border-radius:8px;padding:10px 12px;font-size:12px;color:#7f1d1d">
      <div style="font-weight:800;margin-bottom:6px">⛔ Contrato cancelado</div>
      <div>Cancelamento: <strong>${fmtData(canc.dataCancelamento)}</strong> · Última competência: <strong>${esc(canc.ultimaCompetencia||'—')}</strong></div>
      <div>Consumido: <strong>${fmtValor(canc.valorConsumido||0)}</strong> · Reembolso: <strong>${fmtValor(canc.valorReembolsado||0)}</strong></div>
      <div>Receita extra de cancelamento: <strong>${fmtValor(receitaExtra)}</strong> <span style="color:#991b1b">(fora da rotina de NF)</span></div>
    </div>`);
  }
};
window.abrirPerfilAluno = abrirPerfilAluno;

window.recalcularSugestaoCancelamentoV26 = function(){
  const contratoId = document.getElementById('cr-contrato-id')?.value;
  const c = contratos.find(x=>String(x.id)===String(contratoId));
  if(!c) return;
  const dataCancel = document.getElementById('cr-data-cancelamento')?.value || new Date().toISOString().split('T')[0];
  const ultComp = document.getElementById('cr-ultima-competencia')?.value || competenciaPadraoCancelamentoV26(c,dataCancel);
  const meses = mesesUtilizadosAteCompetenciaV26(c, ultComp);
  const valorTotal = readMoneyV26('cr-valor-total') || valorContrato(c);
  const valorVista = readMoneyV26('cr-valor-vista') || valorVistaReferenciaV26(c);
  const pct = percentualMultaReembolsoV26(c.plano, meses);
  const fake = {...c, valorTotal};
  const mensal = (PLANO_MESES[c.plano]||mesesContrato(c)) ? valorTotal/(PLANO_MESES[c.plano]||mesesContrato(c)) : valorTotal;
  const consumido = c.plano==='mensal' ? valorTotal : mensal * meses;
  const multa = c.plano==='mensal' ? 0 : valorTotal * pct / 100;
  const extras = readMoneyV26('cr-extras');
  const reembolso = c.plano==='mensal' ? 0 : Math.max(0, valorVista - consumido - multa - extras);
  const mEl=document.getElementById('cr-meses-usados'); if(mEl) mEl.value = meses;
  const pEl=document.getElementById('cr-pct-multa'); if(pEl) pEl.value = pct;
  moneyInputV26('cr-valor-consumido', consumido);
  moneyInputV26('cr-multa', multa);
  moneyInputV26('cr-reembolso', reembolso);
  const alerta=document.getElementById('cr-alerta-fechamento'); if(alerta) alerta.textContent = 'Sugestão recalculada. Fernando ainda pode alterar qualquer valor antes de salvar.';
};
window.atualizarFechamentoCancelamentoV26 = function(){
  const total = readMoneyV26('cr-valor-total');
  const consumido = readMoneyV26('cr-valor-consumido');
  const multa = readMoneyV26('cr-multa');
  const extras = readMoneyV26('cr-extras');
  const reembolso = readMoneyV26('cr-reembolso');
  const soma = consumido + multa + extras + reembolso;
  const dif = total - soma;
  const el=document.getElementById('cr-alerta-fechamento');
  if(el) el.innerHTML = Math.abs(dif) < 0.02 ? `Fechamento: valores informados fecham com o total do contrato.` : `Atenção: consumido + multa + extras + reembolso = ${fmtValor(soma)}. Diferença para o total: ${fmtValor(dif)}.`;
};

window.abrirModalCancelamentoV26 = function(alunoId, contratoId=''){
  const a = alunos.find(x=>String(x.id)===String(alunoId));
  const c = contratos.find(x=>String(x.id)===String(contratoId)) || a?.contratoAtual || contratoVigenteAluno(alunoId);
  if(!a || !c){ alert('Contrato não encontrado.'); return; }
  const existente = c.cancelamento || null;
  const hoje = new Date().toISOString().split('T')[0];
  const sug = sugestaoReembolsoV26(c, existente?.dataCancelamento || hoje, existente?.ultimaCompetencia || null);
  const dados = existente ? {...sug, ...existente} : sug;
  const contas = ['InfinitePay','Banco do Brasil','Aplicação BB','Dinheiro','Outra'];
  const receitaExtra = Number(dados.multaRetida||0) + Number(dados.extrasDescontados||0);
  const html = `<div style="position:fixed;inset:0;background:rgba(0,0,0,.58);z-index:520;display:flex;align-items:center;justify-content:center;padding:16px" id="modal-cancelamento-v26">
    <div style="background:#fff;border-radius:12px;width:100%;max-width:760px;max-height:90vh;overflow-y:auto;box-shadow:var(--shadow-lg)">
      <div style="padding:20px 24px;border-bottom:1px solid var(--borda);display:flex;justify-content:space-between;align-items:flex-start;gap:12px">
        <div><div style="font-family:'Bebas Neue',sans-serif;font-size:24px">Cancelamento e Reembolso</div><div style="font-size:12px;color:var(--texto-muted)"><strong>${esc(a.nome)}</strong> · ${esc(PLANO_LABEL[c.plano]||c.plano)} · ${fmtData(c.inicio)} → ${fmtData(c.venc)}</div></div>
        <button onclick="document.getElementById('modal-cancelamento-v26').remove()" style="background:none;border:none;font-size:20px;cursor:pointer;color:#999">✕</button>
      </div>
      <div style="padding:14px 24px;background:#fff7ed;border-bottom:1px solid #fed7aa;font-size:12px;color:#92400e"><strong>Sugestão editável:</strong> o sistema preenche com a política do contrato, mas o valor oficial será exatamente o que Fernando salvar nos campos abaixo.</div>
      <input type="hidden" id="cr-aluno-id" value="${esc(a.id)}"><input type="hidden" id="cr-contrato-id" value="${esc(c.id)}">
      <div style="padding:20px 24px" class="form-grid">
        <div class="form-group"><label class="form-label">Data do cancelamento</label><input class="form-input" type="date" id="cr-data-cancelamento" value="${esc(dados.dataCancelamento||hoje)}"></div>
        <div class="form-group"><label class="form-label">Última competência consumida</label><input class="form-input" type="month" id="cr-ultima-competencia" value="${esc(dados.ultimaCompetencia||ymV26(new Date().getMonth(),new Date().getFullYear()))}"></div>
        <div class="form-group"><label class="form-label">Meses utilizados</label><input class="form-input" type="number" id="cr-meses-usados" value="${Number(dados.mesesUsados||0)}" min="0" step="1"></div>
        <div class="form-group"><label class="form-label">% multa sugerida</label><input class="form-input" type="number" id="cr-pct-multa" value="${Number(dados.percentualMulta||0)}" step="0.01"><div class="form-hint">Após os prazos de 25%/15%, sugerir 5%. Campo editável.</div></div>
        <div class="form-group"><label class="form-label">Valor total do contrato (R$)</label><input class="form-input" type="number" id="cr-valor-total" value="${Number(dados.valorTotal||0).toFixed(2)}" step="0.01"></div>
        <div class="form-group"><label class="form-label">Valor à vista ref. (R$)</label><input class="form-input" type="number" id="cr-valor-vista" value="${Number(dados.valorVista||0).toFixed(2)}" step="0.01"><div class="form-hint">Base do reembolso prevista no contrato.</div></div>
        <div class="form-group"><label class="form-label">Valor consumido (R$)</label><input class="form-input" type="number" id="cr-valor-consumido" value="${Number(dados.valorConsumido||0).toFixed(2)}" step="0.01" oninput="atualizarFechamentoCancelamentoV26()"></div>
        <div class="form-group"><label class="form-label">Multa retida (R$)</label><input class="form-input" type="number" id="cr-multa" value="${Number(dados.multaRetida||0).toFixed(2)}" step="0.01" oninput="atualizarFechamentoCancelamentoV26()"></div>
        <div class="form-group"><label class="form-label">Extras/benefícios descontados (R$)</label><input class="form-input" type="number" id="cr-extras" value="${Number(dados.extrasDescontados||0).toFixed(2)}" step="0.01" oninput="atualizarFechamentoCancelamentoV26()"><div class="form-hint">Fisio, nutri, brinde ou outro benefício utilizado.</div></div>
        <div class="form-group"><label class="form-label">Valor reembolsado (R$)</label><input class="form-input" type="number" id="cr-reembolso" value="${Number(dados.valorReembolsado||0).toFixed(2)}" step="0.01" oninput="atualizarFechamentoCancelamentoV26()"></div>
        <div class="form-group"><label class="form-label">Conta do reembolso</label><select class="form-select" id="cr-conta">${contas.map(ct=>`<option value="${ct}" ${(dados.contaReembolso||'InfinitePay')===ct?'selected':''}>${ct}</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label">Data do reembolso</label><input class="form-input" type="date" id="cr-data-reembolso" value="${esc(dados.dataReembolso||dados.dataCancelamento||hoje)}"></div>
        <div class="form-group full"><label class="form-label">Observação</label><input class="form-input" id="cr-obs" value="${esc(dados.observacao||'') }" placeholder="Ex.: cancelamento solicitado pelo aluno, acordo aprovado por Fernando..."></div>
      </div>
      <div style="padding:0 24px 14px"><div id="cr-alerta-fechamento" style="font-size:12px;color:var(--texto-muted);background:#f9fafb;border:1px solid var(--borda);border-radius:8px;padding:10px 12px">Receita extra atual: ${fmtValor(receitaExtra)}. Reembolso não será tratado como despesa.</div></div>
      <div style="padding:16px 24px 20px;border-top:1px solid var(--borda);display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap">
        <button class="btn btn-ghost" onclick="recalcularSugestaoCancelamentoV26();atualizarFechamentoCancelamentoV26()">Recalcular sugestão</button>
        <div style="display:flex;gap:8px"><button class="btn btn-ghost" onclick="document.getElementById('modal-cancelamento-v26').remove()">Cancelar</button><button class="btn btn-danger" onclick="confirmarCancelamentoReembolsoV26()">Confirmar cancelamento</button></div>
      </div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
  atualizarFechamentoCancelamentoV26();
};

window.confirmarCancelamentoReembolsoV26 = async function(){
  const alunoId = document.getElementById('cr-aluno-id')?.value;
  const contratoId = document.getElementById('cr-contrato-id')?.value;
  const a = alunos.find(x=>String(x.id)===String(alunoId));
  const c = contratos.find(x=>String(x.id)===String(contratoId));
  if(!a || !c){ alert('Aluno ou contrato não encontrado.'); return; }
  if(!confirm('Confirmar o cancelamento deste contrato? As receitas futuras serão interrompidas.')) return;
  const dataCancelamento = document.getElementById('cr-data-cancelamento').value;
  const ultimaCompetencia = document.getElementById('cr-ultima-competencia').value;
  const cancelamento = {
    status:'ativo',
    dataCancelamento,
    ultimaCompetencia,
    vencEfetivo:fimCompetenciaV26(ultimaCompetencia),
    mesesUsados:Number(document.getElementById('cr-meses-usados').value||0),
    percentualMulta:Number(document.getElementById('cr-pct-multa').value||0),
    valorTotal:Number(readMoneyV26('cr-valor-total').toFixed(2)),
    valorVista:Number(readMoneyV26('cr-valor-vista').toFixed(2)),
    valorConsumido:Number(readMoneyV26('cr-valor-consumido').toFixed(2)),
    multaRetida:Number(readMoneyV26('cr-multa').toFixed(2)),
    extrasDescontados:Number(readMoneyV26('cr-extras').toFixed(2)),
    valorReembolsado:Number(readMoneyV26('cr-reembolso').toFixed(2)),
    contaReembolso:document.getElementById('cr-conta').value,
    dataReembolso:document.getElementById('cr-data-reembolso').value,
    observacao:document.getElementById('cr-obs').value.trim(),
    atualizadoEm:new Date().toISOString(),
    ts:Date.now()
  };
  const atualizado = {...c, status:'cancelado', cancelamento, vencOriginal:c.vencOriginal||c.venc, atualizadoEm:new Date().toISOString()};
  await salvarContratoDb(atualizado);
  await setDoc(doc(db,'cancelamentos_reembolsos',String(contratoId)), {id:String(contratoId), contratoId:String(contratoId), alunoId:String(alunoId), alunoNome:a.nome, ...cancelamento});
  const hist = {id:`hist_cancel_${contratoId}_${Date.now()}`, alunoId:String(alunoId), alunoNome:a.nome, contratoId:String(contratoId), tipo:'cancelamento_reembolso', data:dataCancelamento, valor:cancelamento.valorReembolsado, multaRetida:cancelamento.multaRetida, extrasDescontados:cancelamento.extrasDescontados, descricao:'Cancelamento de contrato / reembolso', status:'ativo', ts:Date.now()};
  await setDoc(doc(db,'historico',hist.id), hist);
  await registrarAuditoria('cancelamento_reembolso', alunoId, a.nome, {}, {contratoId, cancelamento});
  document.getElementById('modal-cancelamento-v26')?.remove();
  hidratarAlunosComContratos();
  toast('Cancelamento e reembolso registrados ✓');
  abrirPerfilAluno(alunoId);
};

const renderTabelaReceitaNFBaseV26 = renderTabelaReceitaNFV24;
renderTabelaReceitaNFV24 = function(box){
  const todos = itensReceitaCompetenciaNFV24(finMes, finAno);
  const filtrados = todos.filter(item=> nfFiltroV24==='todas' ? true : obterStatusNFItemV24(item).statusNF === nfFiltroV24);
  const extrasCancelamento = nfFiltroV24==='todas' ? receitasExtrasCancelamentoMesV26(finMes,finAno) : [];
  const totalFiltro = filtrados.reduce((s,i)=>s+Number(i.valor||0),0) + extrasCancelamento.reduce((s,i)=>s+Number(i.valor||0),0);
  const table = box.querySelector('table'); if(!table) return;
  const header = box.querySelector('.section-header');
  if(header){
    let filtros = header.querySelector('.nf-filtros-v24');
    if(!filtros){
      header.insertAdjacentHTML('beforeend', `<div class="nf-filtros-v24" style="display:flex;align-items:center;gap:6px;flex-wrap:wrap"></div>`);
      filtros = header.querySelector('.nf-filtros-v24');
    }
    filtros.innerHTML = `<span style="font-size:11px;color:var(--texto-muted);font-weight:700;text-transform:uppercase;letter-spacing:.8px">NF</span>${['todas','a_emitir','emitida'].map(f=>`<button class="btn ${nfFiltroV24===f?'btn-primary':'btn-ghost'} btn-sm" onclick="setFiltroNFV24('${f}')">${f==='todas'?'Todas':f==='a_emitir'?'Emitir':'Emitida'}</button>`).join('')}`;
  }
  const linhasNormais = filtrados.map(item=>`<tr><td><strong>${esc(item.alunoNome||'—')}</strong></td><td>${esc(item.descricao||'—')}<div style="font-size:11px;color:var(--texto-muted)">${esc(item.detalhe||'')}</div></td><td style="font-weight:700;color:var(--verde);text-align:right">${fmtValor(item.valor)}</td><td style="text-align:center">${chipNFV24(item)}</td></tr>`).join('');
  const linhasExtras = extrasCancelamento.map(x=>`<tr style="background:#f8fafc"><td><strong>${esc(x.alunoNome||'—')}</strong></td><td>${esc(x.descricao)}<div style="font-size:11px;color:var(--texto-muted)">${fmtData(x.data)} · receita extra fora da rotina de NF</div></td><td style="font-weight:700;color:var(--verde);text-align:right">${fmtValor(x.valor)}</td><td style="text-align:center"><span class="badge" style="background:#eef2ff;color:#3730a3">Extra</span></td></tr>`).join('');
  table.innerHTML = `<thead><tr><th>Aluno</th><th>Contrato / detalhe</th><th style="text-align:right">Receita mensal</th><th style="text-align:center;width:120px">NF</th></tr></thead><tbody>${linhasNormais}${linhasExtras || ''}${(!linhasNormais&&!linhasExtras)?`<tr><td colspan="4"><div class="empty">Nenhuma receita neste filtro.</div></td></tr>`:''}</tbody><tfoot><tr style="background:#f9fafb;font-weight:700"><td colspan="2">${nfFiltroV24==='todas'?'Total receita':'Total filtrado'}</td><td style="text-align:right;color:var(--verde)">${fmtValor(totalFiltro)}</td><td></td></tr></tfoot>`;
};
window.renderTabelaReceitaNFV24 = renderTabelaReceitaNFV24;

const abrirResumoReceitaBaseV26 = abrirResumoReceita;
abrirResumoReceita = function(){
  const mes = MES_ATUAL, ano = ANO_ATUAL;
  const total = receitaDoMesSelecionada(mes, ano);
  const receitaComp = receitaMesEsp(mes, ano);
  const receitaCx = receitaCaixaMes(mes, ano);
  const contratosMes = contratos.filter(c=>contratoContaCompetenciaMes(c,mes,ano)).sort((a,b)=>(a.alunoNome||'').localeCompare(b.alunoNome||'','pt-BR'));
  const pagamentosMes = pagamentos.filter(p=>p.status!=='excluido' && p.data && new Date(p.data)>=dataMesInicio(mes,ano) && new Date(p.data)<=dataMesFim(mes,ano)).sort((a,b)=>new Date(b.data)-new Date(a.data));
  const multas = receitasExtrasCancelamentoMesV26(mes,ano);
  const linhas = financeiroModo==='caixa'
    ? pagamentosMes.map(p=>`<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--borda);cursor:pointer" onclick="document.getElementById('modal-receita-overlay').remove();abrirPerfilAluno('${p.alunoId}')"><div style="flex:1"><div style="font-weight:600;color:var(--vermelho);text-decoration:underline;text-underline-offset:2px">${esc(p.alunoNome||'—')}</div><div style="font-size:11px;color:var(--texto-muted)">${fmtData(p.data)} · ${esc(p.descricao||'Pagamento')} · ${p.forma||'—'}${isAulaExtraPagamento(p)?' · aula extra':''}${detalheCartaoTexto(p)}</div></div><div style="text-align:right"><div style="font-weight:700;color:var(--verde)">${fmtValor(p.valor)}</div><div style="font-size:10px;color:var(--texto-muted)">caixa</div></div></div>`).join('')
    : contratosMes.map(c=>{const mens=mensalidadeContrato(c); const pct=total>0?(mens/total*100).toFixed(1):0; return `<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--borda);cursor:pointer" onclick="document.getElementById('modal-receita-overlay').remove();abrirPerfilAluno('${c.alunoId}')"><div style="flex:1"><div style="font-weight:600;color:var(--vermelho);text-decoration:underline;text-underline-offset:2px">${esc(c.alunoNome||'—')}</div><div style="font-size:11px;color:var(--texto-muted)">${esc(nomeContrato(c))} · ${fmtData(c.inicio)} → ${fmtData(vencEfetivoContratoV26(c))}</div></div><div style="text-align:right"><div style="font-weight:700;color:var(--verde)">${fmtValor(mens)}</div><div style="font-size:10px;color:var(--texto-muted)">${pct}% da receita</div></div></div>`;}).join('') + (typeof aulasExtrasMes==='function'?aulasExtrasMes(mes,ano).map(p=>`<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--borda);cursor:pointer" onclick="document.getElementById('modal-receita-overlay').remove();abrirPerfilAluno('${p.alunoId}')"><div style="flex:1"><div style="font-weight:600;color:var(--vermelho);text-decoration:underline;text-underline-offset:2px">${esc(p.alunoNome||'—')}</div><div style="font-size:11px;color:var(--texto-muted)">${fmtData(p.data)} · ${esc(p.descricao||'Aula extra')} · aula extra</div></div><div style="text-align:right"><div style="font-weight:700;color:var(--verde)">${fmtValor(p.valor)}</div><div style="font-size:10px;color:var(--texto-muted)">competência + caixa</div></div></div>`).join(''):'') + multas.map(x=>`<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--borda);background:#f8fafc"><div style="flex:1"><div style="font-weight:600;color:var(--vermelho)">${esc(x.alunoNome||'—')}</div><div style="font-size:11px;color:var(--texto-muted)">${fmtData(x.data)} · ${esc(x.descricao)} · fora da rotina de NF</div></div><div style="text-align:right"><div style="font-weight:700;color:var(--verde)">${fmtValor(x.valor)}</div><div style="font-size:10px;color:var(--texto-muted)">receita extra</div></div></div>`).join('');
  const html = `<div style="position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:400;display:flex;align-items:center;justify-content:center;padding:16px" id="modal-receita-overlay"><div style="background:#fff;border-radius:12px;width:100%;max-width:560px;max-height:85vh;overflow-y:auto;box-shadow:var(--shadow-lg)"><div style="padding:20px 24px;border-bottom:1px solid var(--borda);display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;background:#fff;z-index:1;gap:12px"><div><div style="font-family:'Bebas Neue',sans-serif;font-size:22px">Receita — ${financeiroModo==='competencia'?'Competência':'Caixa'}</div><div style="font-size:12px;color:var(--texto-muted)">${MESES_NOMES[mes]} ${ano} · Comp.: ${fmtValor(receitaComp)} · Caixa: ${fmtValor(receitaCx)}</div><div style="display:flex;gap:6px;margin-top:10px"><button class="btn ${financeiroModo==='competencia'?'btn-primary':'btn-ghost'} btn-sm" onclick="setModoFinanceiro('competencia');document.getElementById('modal-receita-overlay').remove();abrirResumoReceita()">Competência</button><button class="btn ${financeiroModo==='caixa'?'btn-primary':'btn-ghost'} btn-sm" onclick="setModoFinanceiro('caixa');document.getElementById('modal-receita-overlay').remove();abrirResumoReceita()">Caixa</button></div></div><div style="text-align:right;min-width:125px"><div style="font-family:'Bebas Neue',sans-serif;font-size:28px;color:var(--verde)">${fmtValor(total)}</div><button onclick="document.getElementById('modal-receita-overlay').remove()" style="background:none;border:none;cursor:pointer;font-size:13px;color:var(--texto-muted)">✕ Fechar</button></div></div><div style="padding:0 24px 16px">${linhas || `<div class="empty">Nenhuma receita nesta visão.</div>`}<div style="display:flex;justify-content:space-between;padding:12px 0;font-weight:700;font-size:14px;border-top:2px solid var(--borda);margin-top:4px"><span>Total</span><span style="color:var(--verde)">${fmtValor(total)}</span></div></div></div></div>`;
  document.body.insertAdjacentHTML('beforeend', html);
  document.getElementById('modal-receita-overlay').addEventListener('click', function(e){ if(e.target===this) this.remove(); });
};
window.abrirResumoReceita = abrirResumoReceita;


// ═══════════════════════════════════════════════════
// V28 — Correção definitiva da competência das receitas
// Regra LGV: a receita por competência começa no mês da matrícula/renovação
// e segue mês a mês até completar a quantidade de competências do plano.
// Não usa mais proporção por dias ativos nem escolhe o mês predominante.
// Ex.: contrato mensal iniciado em 20/01 → competência janeiro.
// Ex.: anual iniciado em 22/06 → junho, julho, agosto... maio.
// Em caso de cancelamento, preserva competências consumidas até a última competência informada.
// ═══════════════════════════════════════════════════
function pad2V28(n){ return String(Number(n)).padStart(2,'0'); }
function centavosV28(v){ return Math.round((Number(v)||0)*100); }
function reaisV28(c){ return Number((Number(c||0)/100).toFixed(2)); }
function inicioCompetenciaContratoV28(c){ return c?.competenciaInicio || c?.inicio || ''; }
function totalCompetenciasContratoV28(c){ return Math.max(1, mesesContrato(c)); }
function qtdCompetenciasReconhecerV28(c){
  const total = totalCompetenciasContratoV28(c);
  if(c?.status === 'excluido') return 0;
  if(c?.status === 'cancelado' && c?.cancelamento?.ultimaCompetencia){
    return Math.max(0, Math.min(total, mesesUtilizadosAteCompetenciaV26(c, c.cancelamento.ultimaCompetencia)));
  }
  if(c?.status === 'cancelado') return 0;
  return total;
}
function valorCompetenciaParcelaV28(c, parcela){
  const totalC = centavosV28(valorContrato(c));
  const n = totalCompetenciasContratoV28(c);
  const p = Math.max(1, Math.min(n, Number(parcela)||1));
  const baseC = Math.floor(totalC / n);
  // Primeiras competências recebem o valor base; a última ajusta os centavos
  // para o somatório fechar exatamente o valor total do contrato.
  const valorC = p < n ? baseC : (totalC - baseC * (n - 1));
  return reaisV28(valorC);
}
function competenciaContratoMesV28(c, mes, ano){
  const chave = `${ano}_${pad2V28(mes)}`;
  return mesesCompetenciaContrato(c).find(m=>m.chave===chave) || null;
}
function valorCompetenciaContratoMesV28(c, mes, ano){
  return Number(competenciaContratoMesV28(c, mes, ano)?.valor || 0);
}
function totalReconhecidoCompetenciaAteV28(c, mes, ano){
  const idx = idxMesCaixa(mes,ano);
  return mesesCompetenciaContrato(c)
    .filter(x=>idxMesCaixa(x.mes,x.ano)<=idx)
    .reduce((s,x)=>s+Number(x.valor||0),0);
}
function totalReconhecidoCompetenciaAntesV28(c, mes, ano){
  const idx = idxMesCaixa(mes,ano);
  return mesesCompetenciaContrato(c)
    .filter(x=>idxMesCaixa(x.mes,x.ano)<idx)
    .reduce((s,x)=>s+Number(x.valor||0),0);
}

mesesCompetenciaContrato = function(c){
  if(!c || c.status === 'excluido') return [];
  const inicioCompetencia = inicioCompetenciaContratoV28(c);
  const inicio = dataLocal(inicioCompetencia);
  if(!inicio) return [];
  const total = totalCompetenciasContratoV28(c);
  const qtd = qtdCompetenciasReconhecerV28(c);
  const lista = [];
  for(let i=0; i<qtd; i++){
    const d = addMesesCicloV18(inicioCompetencia, i);
    if(!d) continue;
    lista.push({
      ano: d.getFullYear(),
      mes: d.getMonth(),
      dia: d.getDate(),
      data: dataIsoLocalV18(d),
      chave: `${d.getFullYear()}_${pad2V28(d.getMonth())}`,
      parcela: i + 1,
      total,
      valor: valorCompetenciaParcelaV28(c, i + 1)
    });
  }
  return lista;
};

contratoContaCompetenciaMes = function(c, mes, ano){
  return !!competenciaContratoMesV28(c, mes, ano);
};

competenciaResumoContratoMesV18 = function(c, mes, ano){
  const comp = competenciaContratoMesV28(c, mes, ano);
  const fim = (typeof vencEfetivoContratoV26 === 'function' ? vencEfetivoContratoV26(c) : vencAjustadoContrato(c)) || c?.venc;
  if(!comp) return `${fmtData(inicioCompetenciaContratoV28(c))} → ${fmtData(fim)}`;
  return `Competência ${fmtData(comp.data)} · ${comp.parcela}/${comp.total} · ${fmtData(inicioCompetenciaContratoV28(c))} → ${fmtData(fim)}`;
};

receitaMesEsp = function(mes,ano){
  const contratosValor = contratos
    .filter(c=>contratoContaCompetenciaMes(c,mes,ano))
    .reduce((acc,c)=>acc+valorCompetenciaContratoMesV28(c,mes,ano),0);
  const extras = (typeof totalAulasExtrasMes === 'function') ? totalAulasExtrasMes(mes,ano) : 0;
  const cancelamentos = (typeof totalReceitasExtrasCancelamentoMesV26 === 'function') ? totalReceitasExtrasCancelamentoMesV26(mes,ano) : 0;
  return contratosValor + extras + cancelamentos;
};
receitaMensal = function(){ return receitaMesEsp(MES_ATUAL, ANO_ATUAL); };
receitaDoMesSelecionada = function(mes,ano){ return financeiroModo==='caixa' ? receitaCaixaMes(mes,ano) : receitaMesEsp(mes,ano); };

qtdMesesCompetenciaAte = function(c, mes, ano){
  const idx = idxMesCaixa(mes,ano);
  return mesesCompetenciaContrato(c).filter(x=>idxMesCaixa(x.mes,x.ano)<=idx).length;
};
qtdMesesCompetenciaAntes = function(c, mes, ano){
  const idx = idxMesCaixa(mes,ano);
  return mesesCompetenciaContrato(c).filter(x=>idxMesCaixa(x.mes,x.ano)<idx).length;
};

saldoAntecipadoContratoFimMes = function(c, mes, ano){
  if(!c || c.status==='excluido') return 0;
  const pagoAte = Math.min(valorContrato(c), totalPagoContratoAte(c,mes,ano));
  if(pagoAte <= 0) return 0;
  const reconhecidoAte = Math.min(valorContrato(c), totalReconhecidoCompetenciaAteV28(c,mes,ano));
  const liquidado = (typeof totalLiquidadoCancelamentoV26 === 'function') ? totalLiquidadoCancelamentoV26(c,mes,ano) : 0;
  return Math.max(0, pagoAte - reconhecidoAte - liquidado);
};

liberacaoProvisionadaMes = function(mes, ano){
  return contratos.filter(c=>contratoContaCompetenciaMes(c,mes,ano)).reduce((s,c)=>{
    const comp = competenciaContratoMesV28(c,mes,ano);
    const valorComp = Number(comp?.valor || 0);
    const pagoAntes = totalPagoContratoAntesMes(c,mes,ano);
    const reconhecidoAntes = Math.min(valorContrato(c), totalReconhecidoCompetenciaAntesV28(c,mes,ano));
    return s + Math.max(0, Math.min(valorComp, pagoAntes - reconhecidoAntes));
  },0);
};

itensReceitaCompetenciaNFV24 = function(mes, ano){
  const contratosMes = contratos
    .filter(c=>contratoContaCompetenciaMes(c,mes,ano))
    .sort((a,b)=>(a.alunoNome||'').localeCompare(b.alunoNome||'','pt-BR'));
  const itens = contratosMes.map(c=>({
    tipo:'contrato',
    origemId:String(c.id),
    key:chaveNFV24('contrato', c.id, mes, ano),
    alunoId:String(c.alunoId||''),
    alunoNome:c.alunoNome||'—',
    contrato:c,
    descricao:nomeContrato(c),
    detalhe:`${competenciaResumoContratoMesV18(c,mes,ano)}${c.pgto==='Cartão'&&c.valorBruto?` · bruto cartão ${fmtValor(c.valorBruto)} · líquido ${fmtValor(valorContrato(c))}`:''}`,
    valor:valorCompetenciaContratoMesV28(c,mes,ano),
    mes, ano
  }));
  if(typeof aulasExtrasMes === 'function'){
    aulasExtrasMes(mes,ano).sort((a,b)=>(a.alunoNome||'').localeCompare(b.alunoNome||'','pt-BR')).forEach(p=>{
      itens.push({
        tipo:'aula_extra',
        origemId:String(p.id),
        key:chaveNFV24('aula_extra', p.id, mes, ano),
        alunoId:String(p.alunoId||''),
        alunoNome:p.alunoNome||'—',
        descricao:p.descricao||'Aula extra',
        detalhe:`${fmtData(p.data)} · aula extra`,
        valor:Number(p.valor||0),
        pagamento:p,
        mes, ano
      });
    });
  }
  return itens;
};

abrirResumoReceita = function(){
  const mes = MES_ATUAL, ano = ANO_ATUAL;
  const total = receitaDoMesSelecionada(mes, ano);
  const receitaComp = receitaMesEsp(mes, ano);
  const receitaCx = receitaCaixaMes(mes, ano);
  const contratosMes = contratos.filter(c=>contratoContaCompetenciaMes(c,mes,ano)).sort((a,b)=>(a.alunoNome||'').localeCompare(b.alunoNome||'','pt-BR'));
  const pagamentosMes = pagamentos.filter(p=>p.status!=='excluido' && p.data && new Date(p.data)>=dataMesInicio(mes,ano) && new Date(p.data)<=dataMesFim(mes,ano)).sort((a,b)=>new Date(b.data)-new Date(a.data));
  const multas = (typeof receitasExtrasCancelamentoMesV26 === 'function') ? receitasExtrasCancelamentoMesV26(mes,ano) : [];
  const linhas = financeiroModo==='caixa'
    ? pagamentosMes.map(p=>`<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--borda);cursor:pointer" onclick="document.getElementById('modal-receita-overlay').remove();abrirPerfilAluno('${p.alunoId}')"><div style="flex:1"><div style="font-weight:600;color:var(--vermelho);text-decoration:underline;text-underline-offset:2px">${esc(p.alunoNome||'—')}</div><div style="font-size:11px;color:var(--texto-muted)">${fmtData(p.data)} · ${esc(p.descricao||'Pagamento')} · ${p.forma||'—'}${isAulaExtraPagamento(p)?' · aula extra':''}${detalheCartaoTexto(p)}</div></div><div style="text-align:right"><div style="font-weight:700;color:var(--verde)">${fmtValor(p.valor)}</div><div style="font-size:10px;color:var(--texto-muted)">caixa</div></div></div>`).join('')
    : contratosMes.map(c=>{const valorComp=valorCompetenciaContratoMesV28(c,mes,ano); const pct=total>0?(valorComp/total*100).toFixed(1):0; return `<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--borda);cursor:pointer" onclick="document.getElementById('modal-receita-overlay').remove();abrirPerfilAluno('${c.alunoId}')"><div style="flex:1"><div style="font-weight:600;color:var(--vermelho);text-decoration:underline;text-underline-offset:2px">${esc(c.alunoNome||'—')}</div><div style="font-size:11px;color:var(--texto-muted)">${esc(nomeContrato(c))} · ${competenciaResumoContratoMesV18(c,mes,ano)}</div></div><div style="text-align:right"><div style="font-weight:700;color:var(--verde)">${fmtValor(valorComp)}</div><div style="font-size:10px;color:var(--texto-muted)">${pct}% da receita</div></div></div>`;}).join('') + (typeof aulasExtrasMes==='function'?aulasExtrasMes(mes,ano).map(p=>`<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--borda);cursor:pointer" onclick="document.getElementById('modal-receita-overlay').remove();abrirPerfilAluno('${p.alunoId}')"><div style="flex:1"><div style="font-weight:600;color:var(--vermelho);text-decoration:underline;text-underline-offset:2px">${esc(p.alunoNome||'—')}</div><div style="font-size:11px;color:var(--texto-muted)">${fmtData(p.data)} · ${esc(p.descricao||'Aula extra')} · aula extra</div></div><div style="text-align:right"><div style="font-weight:700;color:var(--verde)">${fmtValor(p.valor)}</div><div style="font-size:10px;color:var(--texto-muted)">competência + caixa</div></div></div>`).join(''):'') + multas.map(x=>`<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--borda);background:#f8fafc"><div style="flex:1"><div style="font-weight:600;color:var(--vermelho)">${esc(x.alunoNome||'—')}</div><div style="font-size:11px;color:var(--texto-muted)">${fmtData(x.data)} · ${esc(x.descricao)} · fora da rotina de NF</div></div><div style="text-align:right"><div style="font-weight:700;color:var(--verde)">${fmtValor(x.valor)}</div><div style="font-size:10px;color:var(--texto-muted)">receita extra</div></div></div>`).join('');
  const html = `<div style="position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:400;display:flex;align-items:center;justify-content:center;padding:16px" id="modal-receita-overlay"><div style="background:#fff;border-radius:12px;width:100%;max-width:560px;max-height:85vh;overflow-y:auto;box-shadow:var(--shadow-lg)"><div style="padding:20px 24px;border-bottom:1px solid var(--borda);display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;background:#fff;z-index:1;gap:12px"><div><div style="font-family:'Bebas Neue',sans-serif;font-size:22px">Receita — ${financeiroModo==='competencia'?'Competência':'Caixa'}</div><div style="font-size:12px;color:var(--texto-muted)">${MESES_NOMES[mes]} ${ano} · Comp.: ${fmtValor(receitaComp)} · Caixa: ${fmtValor(receitaCx)}</div><div style="display:flex;gap:6px;margin-top:10px"><button class="btn ${financeiroModo==='competencia'?'btn-primary':'btn-ghost'} btn-sm" onclick="setModoFinanceiro('competencia');document.getElementById('modal-receita-overlay').remove();abrirResumoReceita()">Competência</button><button class="btn ${financeiroModo==='caixa'?'btn-primary':'btn-ghost'} btn-sm" onclick="setModoFinanceiro('caixa');document.getElementById('modal-receita-overlay').remove();abrirResumoReceita()">Caixa</button></div></div><div style="text-align:right;min-width:125px"><div style="font-family:'Bebas Neue',sans-serif;font-size:28px;color:var(--verde)">${fmtValor(total)}</div><button onclick="document.getElementById('modal-receita-overlay').remove()" style="background:none;border:none;cursor:pointer;font-size:13px;color:var(--texto-muted)">✕ Fechar</button></div></div><div style="padding:0 24px 16px">${linhas || `<div class="empty">Nenhuma receita nesta visão.</div>`}<div style="display:flex;justify-content:space-between;padding:12px 0;font-weight:700;font-size:14px;border-top:2px solid var(--borda);margin-top:4px"><span>Total</span><span style="color:var(--verde)">${fmtValor(total)}</span></div></div></div></div>`;
  document.body.insertAdjacentHTML('beforeend', html);
  document.getElementById('modal-receita-overlay').addEventListener('click', function(e){ if(e.target===this) this.remove(); });
};
window.abrirResumoReceita = abrirResumoReceita;



async function init(){
  loading(true);
  ensureCaixaMenu();
  await carregarAlunos();
  await carregarContratos();
  await carregarPagamentos();
  await carregarPessoalV20();
  hidratarAlunosComContratos();
  await loadDespesas(MES_ATUAL, ANO_ATUAL);
  renderDashboard();
  setTimeout(()=>precarregarCaixaEmSegundoPlano(), 600);
}


onAuthStateChanged(auth, (user) => {
  if (user) mostrarApp(user);
  else mostrarLogin();
});

// ═══════════════════════════════════════════════════
// V29 — Ponto de partida NF em julho/2026 + botão de cancelamento visível
// - Até junho/2026: todas as competências são consideradas Emitidas.
// - A partir de julho/2026: contratos mensais, renovações e contratos novos entram como Emitir.
// - Contratos superiores ao mensal iniciados até junho/2026 seguem como Emitidos até a renovação.
// - Reforça a exibição do botão Cancelar/Reembolso no contrato vigente e no histórico de contratos.
// ═══════════════════════════════════════════════════
function idxCompetenciaV29(mes, ano){ return Number(ano) * 12 + Number(mes); }
function competenciaAteJunho2026V29(mes, ano){ return idxCompetenciaV29(mes, ano) <= idxCompetenciaV29(5, 2026); }
function contratoIniciadoAteJunho2026V29(c){ const ini = dataLocal(c?.inicio); return !!ini && ini < new Date(2026, 6, 1); }
function contratoIniciadoEmJulhoOuDepoisV29(c){ const ini = dataLocal(c?.inicio); return !!ini && ini >= new Date(2026, 6, 1); }
function contratoMensalNFV29(c){
  const plano = String(c?.plano || '').toLowerCase();
  const recebimento = String(c?.recebimento || '').toLowerCase();
  return plano === 'mensal' || recebimento === 'mensal';
}
function motivoNFTextoV29(motivo){
  return ({
    ponto_partida_emitida_junho_2026:'Competência anterior ao ponto de partida fiscal: considerada emitida/sem pendência até junho de 2026.',
    mensal_julho_2026:'Mensalidade a partir de julho/2026: emitir nota da competência.',
    renovacao_ou_novo_julho_2026:'Renovação ou contrato novo a partir de julho/2026: emitir nota por competência.',
    nota_integral_ja_emitida:'Contrato superior ao mensal iniciado até junho/2026: notas do contrato já lançadas até a renovação.',
    sem_cobranca:'Sem cobrança real / valor simbólico. Não há pendência de emissão.',
    pendente_emissao:'Pendente de emissão da nota fiscal desta competência.',
    nota_mensal_emitida:'Nota fiscal mensal marcada como emitida.',
    manual:'Status ajustado manualmente.'
  })[motivo] || 'Controle de nota fiscal.';
}
motivoNFTextoV24 = motivoNFTextoV29;

regraPadraoNFContratoV24 = function(c, mes, ano){
  const nome = normalizarNomeNFV24(c?.alunoNome || '');
  if(NF_SEM_COBRANCA_V24.has(nome)) return {statusNF:'emitida', motivoNF:'sem_cobranca'};
  if(competenciaAteJunho2026V29(mes, ano)) return {statusNF:'emitida', motivoNF:'ponto_partida_emitida_junho_2026'};
  if(contratoMensalNFV29(c)) return {statusNF:'a_emitir', motivoNF:'mensal_julho_2026'};
  if(contratoIniciadoEmJulhoOuDepoisV29(c)) return {statusNF:'a_emitir', motivoNF:'renovacao_ou_novo_julho_2026'};
  if(contratoIniciadoAteJunho2026V29(c)) return {statusNF:'emitida', motivoNF:'nota_integral_ja_emitida'};
  return {statusNF:'a_emitir', motivoNF:'pendente_emissao'};
};

obterStatusNFItemV24 = function(item){
  if(competenciaAteJunho2026V29(item.mes, item.ano)){
    if(item.tipo === 'contrato') return {...regraPadraoNFContratoV24(item.contrato, item.mes, item.ano), salvo:false};
    return {statusNF:'emitida', motivoNF:'ponto_partida_emitida_junho_2026', salvo:false};
  }
  const salvo = notasFiscaisCacheV24[item.key];
  if(salvo?.statusNF) return {statusNF:salvo.statusNF, motivoNF:salvo.motivoNF || 'manual', salvo:true, dados:salvo};
  if(item.tipo === 'contrato') return {...regraPadraoNFContratoV24(item.contrato, item.mes, item.ano), salvo:false};
  return {statusNF:'a_emitir', motivoNF:'pendente_emissao', salvo:false};
};

function inserirBotaoCancelamentoContratoV29(alunoId, contratoId, destino){
  if(!destino || destino.querySelector(`[data-cancelamento-v29="${String(contratoId)}"]`)) return;
  const c = contratos.find(x => String(x.id) === String(contratoId));
  if(!c || typeof abrirModalCancelamentoV26 !== 'function') return;
  const cancelado = c.status === 'cancelado' || !!c.cancelamento;
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `btn ${cancelado ? 'btn-ghost' : 'btn-danger'} btn-sm`;
  btn.dataset.cancelamentoV29 = String(contratoId);
  btn.textContent = cancelado ? '📄 Ver cancelamento' : '⛔ Cancelar / Reembolso';
  btn.addEventListener('click', () => abrirModalCancelamentoV26(String(alunoId), String(contratoId)));
  destino.appendChild(btn);
}

function reforcarBotoesCancelamentoV29(alunoId){
  const a = alunos.find(x => String(x.id) === String(alunoId));
  if(!a || typeof abrirModalCancelamentoV26 !== 'function') return;
  const atual = contratoVigenteAluno(alunoId);
  if(atual){
    const boxVigente = [...document.querySelectorAll('.section-box')].find(el=>{
      const t = el.querySelector('.section-title')?.textContent || '';
      return /Contrato\s+(vigente|Atual)/i.test(t);
    });
    const header = boxVigente?.querySelector('.section-header');
    inserirBotaoCancelamentoContratoV29(alunoId, atual.id, header);
  }
  contratosDoAluno(alunoId).forEach(c=>{
    const botoes = [...document.querySelectorAll('button')];
    const btnEditar = botoes.find(b => (b.getAttribute('onclick') || '').includes(`abrirModalContrato('${String(alunoId)}','${String(c.id)}')`));
    const btnPagamento = botoes.find(b => (b.getAttribute('onclick') || '').includes(`abrirModalPagamentoContrato('${String(alunoId)}','${String(c.id)}')`));
    const td = (btnEditar || btnPagamento)?.closest('td');
    inserirBotaoCancelamentoContratoV29(alunoId, c.id, td);
  });
}

const abrirPerfilAlunoBaseV29 = abrirPerfilAluno;
abrirPerfilAluno = async function(id){
  await abrirPerfilAlunoBaseV29(id);
  reforcarBotoesCancelamentoV29(id);
};
window.abrirPerfilAluno = abrirPerfilAluno;


// ═══════════════════════════════════════════════════
// V30 — Correção da regra de NF por ciclo de contrato
// Regra validada:
// - Até junho/2026: tudo considerado ✅ Emitida.
// - A partir de julho/2026: somente contratos de plano mensal, contratos novos e renovações iniciadas em julho/2026 ou depois ficam 🧾 Emitir.
// - Contratos superiores ao mensal iniciados até junho/2026 permanecem ✅ Emitida até a última competência do ciclo atual.
// - A forma de recebimento (ex.: recebimento mensal) NÃO define status fiscal; o critério é o plano/duração do contrato.
// ═══════════════════════════════════════════════════
function planoNormalizadoNFV30(c){
  return String(c?.plano || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .toLowerCase().trim();
}
function contratoPlanoMensalNFV30(c){
  return planoNormalizadoNFV30(c) === 'mensal';
}
function contratoSuperiorAoMensalNFV30(c){
  const p = planoNormalizadoNFV30(c);
  return ['trimestral','semestral','anual'].includes(p);
}
function motivoNFTextoV30(motivo){
  return ({
    ponto_partida_emitida_junho_2026:'Competência anterior ao ponto de partida fiscal: considerada emitida/sem pendência até junho de 2026.',
    mensal_julho_2026:'Plano mensal a partir de julho/2026: emitir nota da competência.',
    renovacao_ou_novo_julho_2026:'Contrato novo ou renovação iniciada a partir de julho/2026: emitir nota por competência.',
    contrato_antigo_superior_mensal_emitido:'Contrato superior ao mensal iniciado até junho/2026: notas do ciclo atual já lançadas até a renovação.',
    nota_integral_ja_emitida:'Contrato superior ao mensal iniciado até junho/2026: notas do ciclo atual já lançadas até a renovação.',
    sem_cobranca:'Sem cobrança real / valor simbólico. Não há pendência de emissão.',
    pendente_emissao:'Pendente de emissão da nota fiscal desta competência.',
    nota_mensal_emitida:'Nota fiscal mensal marcada como emitida.',
    manual:'Status ajustado manualmente.'
  })[motivo] || 'Controle de nota fiscal.';
}
motivoNFTextoV24 = motivoNFTextoV30;

regraPadraoNFContratoV24 = function(c, mes, ano){
  const nome = normalizarNomeNFV24(c?.alunoNome || '');

  // Eliane/sem cobrança nunca deve gerar pendência operacional de NF.
  if(NF_SEM_COBRANCA_V24.has(nome)) return {statusNF:'emitida', motivoNF:'sem_cobranca'};

  // Ponto de partida fiscal aprovado: até junho/2026 tudo já está coberto.
  if(competenciaAteJunho2026V29(mes, ano)) return {statusNF:'emitida', motivoNF:'ponto_partida_emitida_junho_2026'};

  // A partir de julho/2026, plano mensal ativo volta a exigir nota mensal.
  // Importante: não usar c.recebimento aqui. Forma de recebimento não define status fiscal.
  if(contratoPlanoMensalNFV30(c)) return {statusNF:'a_emitir', motivoNF:'mensal_julho_2026'};

  // Contratos/renovações iniciados a partir de julho entram no novo modelo mensal de NF.
  if(contratoIniciadoEmJulhoOuDepoisV29(c)) return {statusNF:'a_emitir', motivoNF:'renovacao_ou_novo_julho_2026'};

  // Contratos superiores ao mensal iniciados até junho já tiveram as notas do ciclo lançadas.
  // Permanecem emitidos enquanto ainda aparecerem na competência; depois somem até eventual renovação.
  if(contratoSuperiorAoMensalNFV30(c) && contratoIniciadoAteJunho2026V29(c)) return {statusNF:'emitida', motivoNF:'contrato_antigo_superior_mensal_emitido'};

  // Fallback conservador: se o contrato não se enquadrar claramente, pedir emissão/revisão operacional.
  return {statusNF:'a_emitir', motivoNF:'pendente_emissao'};
};

obterStatusNFItemV24 = function(item){
  // Até junho/2026, o ponto de partida aprovado prevalece inclusive sobre marcações antigas.
  if(competenciaAteJunho2026V29(item.mes, item.ano)){
    if(item.tipo === 'contrato') return {...regraPadraoNFContratoV24(item.contrato, item.mes, item.ano), salvo:false};
    return {statusNF:'emitida', motivoNF:'ponto_partida_emitida_junho_2026', salvo:false};
  }

  const salvo = notasFiscaisCacheV24[item.key];
  if(salvo?.statusNF) return {statusNF:salvo.statusNF, motivoNF:salvo.motivoNF || 'manual', salvo:true, dados:salvo};

  if(item.tipo === 'contrato') return {...regraPadraoNFContratoV24(item.contrato, item.mes, item.ano), salvo:false};

  // Aulas extras seguem como pendência de emissão a partir de julho, quando existirem.
  return {statusNF:'a_emitir', motivoNF:'pendente_emissao', salvo:false};
};


// ═══════════════════════════════════════════════════
// V31 — Cancelamento e acerto financeiro corrigido
// - Meses utilizados calculados por ciclo/aniversário do contrato, não por mês civil.
// - O resultado do acerto é calculado automaticamente: reembolso, valor a receber ou sem acerto.
// - Fernando ajusta valores e parcelamento final; o tipo de acerto não é escolhido manualmente.
// - Parcelamento sugerido do reembolso segue os meses restantes do contrato, mas é editável.
// - Gera comprovante imprimível/salvável em PDF após o acerto.
// ═══════════════════════════════════════════════════
function instalarEstilosAcertoV31(){
  if(document.getElementById('acerto-v31-style')) return;
  const st=document.createElement('style');
  st.id='acerto-v31-style';
  st.textContent=`
    .acerto-result-v31{border:1px solid var(--borda);border-radius:10px;padding:12px;background:#f9fafb;font-size:13px}
    .acerto-result-v31.reembolso{border-color:#bbf7d0;background:#f0fdf4;color:#14532d}
    .acerto-result-v31.receber{border-color:#fed7aa;background:#fff7ed;color:#7c2d12}
    .acerto-result-v31.sem_acerto{border-color:#e5e7eb;background:#f9fafb;color:#374151}
    .parcelas-v31{width:100%;border-collapse:collapse;font-size:12px;margin-top:8px}
    .parcelas-v31 th,.parcelas-v31 td{border-bottom:1px solid var(--borda);padding:6px 5px;text-align:left}
    .parcelas-v31 th{font-size:10px;text-transform:uppercase;color:var(--texto-muted);letter-spacing:.04em}
    .manual-chip-v31{display:inline-block;border-radius:999px;padding:3px 8px;background:#eef2ff;color:#3730a3;font-size:11px;font-weight:700}
  `;
  document.head.appendChild(st);
}
instalarEstilosAcertoV31();

function dataIsoV31(d){
  if(!(d instanceof Date) || isNaN(d)) return '';
  const y=d.getFullYear(), m=String(d.getMonth()+1).padStart(2,'0'), day=String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
}
function addMesesCicloV31(dataBase, meses){
  const base = dataLocal(dataBase);
  if(!base) return null;
  const y = base.getFullYear();
  const m = base.getMonth() + Number(meses||0);
  const dia = base.getDate();
  const primeiro = new Date(y, m, 1);
  const ultimoDia = new Date(primeiro.getFullYear(), primeiro.getMonth()+1, 0).getDate();
  return new Date(primeiro.getFullYear(), primeiro.getMonth(), Math.min(dia, ultimoDia));
}
function fimCicloConsumidoV31(c, mesesUsados){
  const m = Math.max(0, Number(mesesUsados||0));
  const ini = dataLocal(c?.inicio);
  if(!ini) return '';
  if(m <= 0){ const antes = new Date(ini); antes.setDate(antes.getDate()-1); return dataIsoV31(antes); }
  const prox = addMesesCicloV31(c.inicio, m);
  if(!prox) return '';
  prox.setDate(prox.getDate()-1);
  return dataIsoV31(prox);
}
function competenciaPorMesesUsadosV31(c, mesesUsados){
  const m = Math.max(1, Number(mesesUsados||1));
  const d = addMesesCicloV31(c?.inicio, m-1);
  if(!d) return competenciaPadraoCancelamentoV26(c, new Date().toISOString().split('T')[0]);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
}
function mesesUsadosPorDataCancelamentoV31(c, dataCancelamento){
  const ini = dataLocal(c?.inicio);
  const canc = dataLocal(dataCancelamento);
  const total = Math.max(1, mesesContrato(c));
  if(!ini || !canc) return 1;
  if(canc < ini) return 0;
  let usados = 1;
  for(let i=1; i<total; i++){
    const inicioCiclo = addMesesCicloV31(c.inicio, i);
    if(inicioCiclo && canc >= inicioCiclo) usados = i + 1;
    else break;
  }
  return Math.max(1, Math.min(total, usados));
}

competenciaPadraoCancelamentoV26 = function(c, dataCancelamento){
  const meses = mesesUsadosPorDataCancelamentoV31(c, dataCancelamento);
  return competenciaPorMesesUsadosV31(c, meses);
};
mesesUtilizadosAteCompetenciaV26 = function(c, ym){
  if(c?.cancelamento?.mesesUsados) return Math.max(0, Math.min(mesesContrato(c), Number(c.cancelamento.mesesUsados||0)));
  const ini = dataLocal(c?.inicio);
  if(!ini) return 1;
  const {ano,mes} = parseYMV26(ym);
  const bruto = (ano - ini.getFullYear())*12 + (mes - ini.getMonth()) + 1;
  return Math.max(0, Math.min(mesesContrato(c), bruto));
};
qtdCompetenciasReconhecerV28 = function(c){
  const total = totalCompetenciasContratoV28(c);
  if(c?.status === 'excluido') return 0;
  if(c?.status === 'cancelado' && c?.cancelamento){
    if(c.cancelamento.mesesUsados !== undefined && c.cancelamento.mesesUsados !== null){
      return Math.max(0, Math.min(total, Number(c.cancelamento.mesesUsados||0)));
    }
    if(c.cancelamento.ultimaCompetencia){
      return Math.max(0, Math.min(total, mesesUtilizadosAteCompetenciaV26(c, c.cancelamento.ultimaCompetencia)));
    }
    return 0;
  }
  return total;
};
vencEfetivoContratoV26 = function(c){
  if(c?.status === 'cancelado' && c?.cancelamento){
    return c.cancelamento.fimCicloConsumido || c.cancelamento.vencEfetivo || (c.cancelamento.ultimaCompetencia ? fimCompetenciaV26(c.cancelamento.ultimaCompetencia) : c?.venc || '');
  }
  return vencAjustadoContrato(c) || c?.venc || '';
};

function valorPagoConsideradoPadraoV31(c){
  const pagoReal = Number(totalPagoContrato(c?.id)||0);
  if(pagoReal > 0) return pagoReal;
  if((c?.recebimento||'avista') === 'avista') return valorVistaReferenciaV26(c);
  return 0;
}
function tipoAcertoV31(saldo){
  if(Number(saldo||0) > 0.005) return 'reembolso';
  if(Number(saldo||0) < -0.005) return 'receber';
  return 'sem_acerto';
}
function labelTipoAcertoV31(tipo){
  return ({reembolso:'Reembolso ao aluno', receber:'Valor a receber do aluno', sem_acerto:'Sem acerto financeiro'})[tipo] || 'Acerto financeiro';
}
function sinalTipoAcertoV31(tipo){ return tipo === 'reembolso' ? 1 : (tipo === 'receber' ? -1 : 0); }
function gerarParcelasAcertoV31(valor, qtd, primeiraData){
  const totalCent = Math.round(Math.max(0, Number(valor||0))*100);
  const n = Math.max(0, Math.floor(Number(qtd||0)));
  if(totalCent <= 0 || n <= 0) return [];
  const primeira = dataLocal(primeiraData) || new Date();
  // Regra operacional: parcelas iguais arredondadas para cima e ajuste de centavos na última.
  // Ex.: R$ 1.802,60 em 7 parcelas => 6x R$ 257,52 + 1x R$ 257,48.
  const parcelaCheia = Math.ceil(totalCent / n);
  let restante = totalCent;
  return Array.from({length:n}, (_,i)=>{
    const cents = i === n-1 ? restante : Math.min(parcelaCheia, restante);
    restante -= cents;
    const d = addMesesCicloV31(dataIsoV31(primeira), i) || primeira;
    return {numero:i+1, data:dataIsoV31(d), valor:Number((cents/100).toFixed(2))};
  });
}
function renderParcelasAcertoV31(parcelas){
  if(!parcelas || !parcelas.length) return '<div style="font-size:12px;color:var(--texto-muted);padding-top:6px">Sem parcelas programadas.</div>';
  return `<table class="parcelas-v31"><thead><tr><th>Parcela</th><th>Data prevista</th><th style="text-align:right">Valor</th></tr></thead><tbody>${parcelas.map(p=>`<tr><td>${p.numero}</td><td>${fmtData(p.data)}</td><td style="text-align:right;font-weight:700">${fmtValor(p.valor)}</td></tr>`).join('')}</tbody></table>`;
}
function sugestaoAcertoCancelamentoV31(c, dataCancelamento=null, mesesOverride=null){
  const hoje = new Date().toISOString().split('T')[0];
  const dataCanc = dataCancelamento || hoje;
  const mesesPlano = Math.max(1, mesesContrato(c));
  const mesesUsados = mesesOverride !== null && mesesOverride !== undefined ? Math.max(0, Math.min(mesesPlano, Number(mesesOverride||0))) : mesesUsadosPorDataCancelamentoV31(c, dataCanc);
  const ultimaCompetencia = mesesUsados > 0 ? competenciaPorMesesUsadosV31(c, mesesUsados) : competenciaPorMesesUsadosV31(c, 1);
  const valorTotal = Number(valorContrato(c)||0);
  const valorVista = Number(valorVistaReferenciaV26(c)||0);
  const valorPagoConsiderado = Number(valorPagoConsideradoPadraoV31(c)||0);
  const pct = percentualMultaReembolsoV26(c?.plano, mesesUsados);
  if(c?.plano === 'mensal'){
    return {dataCancelamento:dataCanc, ultimaCompetencia, mesesPlano, mesesUsados:Math.min(1,Math.max(1,mesesUsados||1)), valorTotal, valorVista, valorPagoConsiderado, percentualMulta:0, valorConsumido:valorTotal, multaRetida:0, extrasDescontados:0, totalDevidoCancelamento:valorTotal, saldoAcerto:0, tipoAcerto:'sem_acerto', valorAcertoSugerido:0, valorAcertoAcordado:0, mesesRestantes:0, qtdParcelas:0, dataPrimeiraParcela:dataCanc, parcelasAcerto:[]};
  }
  const mensal = mesesPlano ? valorTotal / mesesPlano : valorTotal;
  const valorConsumido = mensal * mesesUsados;
  const multaRetida = valorTotal * pct / 100;
  const extrasDescontados = 0;
  const totalDevidoCancelamento = valorConsumido + multaRetida + extrasDescontados;
  const saldoAcerto = valorPagoConsiderado - totalDevidoCancelamento;
  const tipo = tipoAcertoV31(saldoAcerto);
  const valorAcertoSugerido = Math.abs(saldoAcerto) < 0.005 ? 0 : Math.abs(saldoAcerto);
  const mesesRestantes = Math.max(0, mesesPlano - mesesUsados);
  const qtdParcelas = tipo === 'reembolso' ? Math.max(1, mesesRestantes) : (tipo === 'receber' ? 1 : 0);
  const dataPrimeiraParcela = dataCanc;
  const parcelasAcerto = gerarParcelasAcertoV31(valorAcertoSugerido, qtdParcelas, dataPrimeiraParcela);
  return {dataCancelamento:dataCanc, ultimaCompetencia, mesesPlano, mesesUsados, valorTotal, valorVista, valorPagoConsiderado, percentualMulta:pct, valorConsumido, multaRetida, extrasDescontados, totalDevidoCancelamento, saldoAcerto, tipoAcerto:tipo, valorAcertoSugerido, valorAcertoAcordado:valorAcertoSugerido, mesesRestantes, qtdParcelas, dataPrimeiraParcela, parcelasAcerto};
}
sugestaoReembolsoV26 = function(c, dataCancelamento=null, ultComp=null){
  const meses = ultComp ? mesesUtilizadosAteCompetenciaV26(c, ultComp) : null;
  const s = sugestaoAcertoCancelamentoV31(c, dataCancelamento, meses);
  return {...s, valorReembolsado: s.tipoAcerto === 'reembolso' ? s.valorAcertoAcordado : 0, valorAReceber: s.tipoAcerto === 'receber' ? s.valorAcertoAcordado : 0};
};

function lerDadosAcertoModalV31(){
  const dataCancelamento = document.getElementById('cr-data-cancelamento')?.value || new Date().toISOString().split('T')[0];
  const mesesPlano = Number(document.getElementById('cr-meses-plano')?.value || 0);
  const mesesUsados = Number(document.getElementById('cr-meses-usados')?.value || 0);
  const valorTotal = readMoneyV26('cr-valor-total');
  const valorVista = readMoneyV26('cr-valor-vista');
  const valorPagoConsiderado = readMoneyV26('cr-valor-pago');
  const valorConsumido = readMoneyV26('cr-valor-consumido');
  const pct = Number(document.getElementById('cr-pct-multa')?.value || 0);
  const multaRetida = readMoneyV26('cr-multa');
  const extrasDescontados = readMoneyV26('cr-extras');
  const totalDevidoCancelamento = valorConsumido + multaRetida + extrasDescontados;
  const saldoAcerto = valorPagoConsiderado - totalDevidoCancelamento;
  const tipo = tipoAcertoV31(saldoAcerto);
  const valorAcertoSugerido = Math.abs(saldoAcerto) < 0.005 ? 0 : Math.abs(saldoAcerto);
  const valorAcertoAcordado = readMoneyV26('cr-valor-acordado');
  const qtdParcelas = Math.max(0, Math.floor(Number(document.getElementById('cr-qtd-parcelas')?.value || 0)));
  const dataPrimeiraParcela = document.getElementById('cr-data-primeira')?.value || dataCancelamento;
  const parcelasAcerto = gerarParcelasAcertoV31(valorAcertoAcordado, qtdParcelas, dataPrimeiraParcela);
  return {dataCancelamento, mesesPlano, mesesUsados, ultimaCompetencia:document.getElementById('cr-ultima-competencia')?.value || '', valorTotal, valorVista, valorPagoConsiderado, valorConsumido, percentualMulta:pct, multaRetida, extrasDescontados, totalDevidoCancelamento, saldoAcerto, tipoAcerto:tipo, valorAcertoSugerido, valorAcertoAcordado, mesesRestantes:Math.max(0, mesesPlano - mesesUsados), qtdParcelas, dataPrimeiraParcela, parcelasAcerto};
}
function atualizarResultadoAcertoV31(sincronizarValorAcordado=true){
  const dadosBase = lerDadosAcertoModalV31();
  const tipo = dadosBase.tipoAcerto;
  const valorSug = dadosBase.valorAcertoSugerido;
  if(sincronizarValorAcordado){
    moneyInputV26('cr-valor-acordado', valorSug);
    const qtd = tipo === 'reembolso' ? Math.max(1, dadosBase.mesesRestantes) : (tipo === 'receber' ? 1 : 0);
    const qEl=document.getElementById('cr-qtd-parcelas'); if(qEl) qEl.value = qtd;
  }
  const dados = lerDadosAcertoModalV31();
  const res=document.getElementById('cr-resultado-acerto');
  const parcelasBox=document.getElementById('cr-parcelas-box');
  const cron=document.getElementById('cr-cronograma');
  const hint=document.getElementById('cr-hint-parcelas');
  const hidden=document.getElementById('cr-tipo-acerto'); if(hidden) hidden.value = tipo;
  if(res){
    const cor = tipo === 'reembolso' ? '#14532d' : (tipo === 'receber' ? '#7c2d12' : '#374151');
    const textoValor = tipo === 'sem_acerto' ? 'R$ 0,00' : fmtValor(valorSug);
    const detalhe = tipo === 'reembolso'
      ? 'Pelo contrato, pelo serviço consumido e pelo valor pago, o Studio tem valor a devolver. Fernando pode ajustar a negociação final abaixo.'
      : (tipo === 'receber'
        ? 'Pelo contrato, pelo serviço consumido e pelo valor pago, existe valor a receber do aluno. Fernando pode ajustar a negociação final abaixo.'
        : 'Pelos valores informados, não há valor financeiro a pagar ou receber.');
    res.className = `acerto-result-v31 ${tipo}`;
    res.innerHTML = `<div style="font-size:11px;text-transform:uppercase;letter-spacing:.08em;font-weight:700;color:${cor}">Resultado calculado</div><div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-top:4px"><strong style="font-size:16px">${labelTipoAcertoV31(tipo)}</strong><strong style="font-size:18px">${textoValor}</strong></div><div style="font-size:12px;margin-top:6px;color:inherit;opacity:.85">${detalhe}</div>`;
  }
  if(parcelasBox) parcelasBox.style.display = tipo === 'sem_acerto' ? 'none' : '';
  if(hint){
    hint.textContent = tipo === 'reembolso'
      ? `Referência contratual: ${dadosBase.mesesRestantes} mês(es) restante(s). Quantidade e valores podem ser editados conforme acordo.`
      : (tipo === 'receber' ? 'Sugestão inicial em parcela única. Fernando pode editar a quantidade e os valores conforme negociação.' : '');
  }
  if(cron) cron.innerHTML = renderParcelasAcertoV31(dados.parcelasAcerto);
  const alerta=document.getElementById('cr-alerta-fechamento');
  if(alerta){
    alerta.innerHTML = `Total devido no cancelamento: <strong>${fmtValor(dados.totalDevidoCancelamento)}</strong> · Valor pago considerado: <strong>${fmtValor(dados.valorPagoConsiderado)}</strong> · Acerto acordado: <strong>${fmtValor(dados.valorAcertoAcordado)}</strong>. Multa/benefícios entram como receita extra fora da rotina de NF; reembolso não é despesa.`;
  }
}
function recalcularPoliticaCancelamentoV31(origem='data'){
  const contratoId = document.getElementById('cr-contrato-id')?.value;
  const c = contratos.find(x=>String(x.id)===String(contratoId));
  if(!c) return;
  const dataCancel = document.getElementById('cr-data-cancelamento')?.value || new Date().toISOString().split('T')[0];
  let meses = origem === 'meses' ? Number(document.getElementById('cr-meses-usados')?.value || 0) : mesesUsadosPorDataCancelamentoV31(c, dataCancel);
  const mesesPlano = Math.max(1, mesesContrato(c));
  meses = Math.max(0, Math.min(mesesPlano, meses));
  const pct = percentualMultaReembolsoV26(c.plano, meses);
  const valorTotal = readMoneyV26('cr-valor-total') || valorContrato(c);
  const mensal = mesesPlano ? valorTotal / mesesPlano : valorTotal;
  const consumido = c.plano === 'mensal' ? valorTotal : mensal * meses;
  const multa = c.plano === 'mensal' ? 0 : valorTotal * pct / 100;
  const mEl=document.getElementById('cr-meses-usados'); if(mEl) mEl.value = meses;
  const compEl=document.getElementById('cr-ultima-competencia'); if(compEl) compEl.value = meses > 0 ? competenciaPorMesesUsadosV31(c, meses) : competenciaPorMesesUsadosV31(c, 1);
  const pEl=document.getElementById('cr-pct-multa'); if(pEl) pEl.value = pct;
  moneyInputV26('cr-valor-consumido', consumido);
  moneyInputV26('cr-multa', multa);
  atualizarResultadoAcertoV31(true);
}
recalcularSugestaoCancelamentoV26 = function(){
  const contratoId = document.getElementById('cr-contrato-id')?.value;
  const c = contratos.find(x=>String(x.id)===String(contratoId));
  if(!c) return;
  const dataCancel = document.getElementById('cr-data-cancelamento')?.value || new Date().toISOString().split('T')[0];
  const s = sugestaoAcertoCancelamentoV31(c, dataCancel, null);
  const setVal=(id,val)=>{ const el=document.getElementById(id); if(el) el.value=val; };
  setVal('cr-meses-plano', s.mesesPlano);
  setVal('cr-meses-usados', s.mesesUsados);
  setVal('cr-ultima-competencia', s.ultimaCompetencia);
  setVal('cr-pct-multa', s.percentualMulta);
  moneyInputV26('cr-valor-total', s.valorTotal);
  moneyInputV26('cr-valor-vista', s.valorVista);
  moneyInputV26('cr-valor-pago', s.valorPagoConsiderado);
  moneyInputV26('cr-valor-consumido', s.valorConsumido);
  moneyInputV26('cr-multa', s.multaRetida);
  moneyInputV26('cr-extras', s.extrasDescontados);
  const dp=document.getElementById('cr-data-primeira'); if(dp) dp.value=s.dataPrimeiraParcela;
  atualizarResultadoAcertoV31(true);
};
atualizarFechamentoCancelamentoV26 = function(){ atualizarResultadoAcertoV31(false); };

window.abrirModalCancelamentoV26 = function(alunoId, contratoId=''){
  const a = alunos.find(x=>String(x.id)===String(alunoId));
  const c = contratos.find(x=>String(x.id)===String(contratoId)) || a?.contratoAtual || contratoVigenteAluno(alunoId);
  if(!a || !c){ alert('Contrato não encontrado.'); return; }
  const existente = c.cancelamento || null;
  const hoje = new Date().toISOString().split('T')[0];
  const sug = sugestaoAcertoCancelamentoV31(c, existente?.dataCancelamento || hoje, existente?.mesesUsados ?? null);
  const dados = existente ? {...sug, ...existente} : sug;
  if(dados.tipoAcerto === undefined){
    const saldo = Number(dados.valorPagoConsiderado||0) - (Number(dados.valorConsumido||0)+Number(dados.multaRetida||0)+Number(dados.extrasDescontados||0));
    dados.tipoAcerto = tipoAcertoV31(saldo);
    dados.valorAcertoSugerido = Math.abs(saldo) < 0.005 ? 0 : Math.abs(saldo);
    dados.valorAcertoAcordado = dados.tipoAcerto === 'reembolso' ? Number(dados.valorReembolsado||0) : (dados.tipoAcerto === 'receber' ? Number(dados.valorAReceber||0) : 0);
  }
  const contas = ['InfinitePay','Banco do Brasil','Aplicação BB','Dinheiro','Outra'];
  const parcelasIniciais = dados.parcelasAcerto || gerarParcelasAcertoV31(dados.valorAcertoAcordado||0, dados.qtdParcelas||0, dados.dataPrimeiraParcela||dados.dataCancelamento||hoje);
  const html = `<div style="position:fixed;inset:0;background:rgba(0,0,0,.58);z-index:520;display:flex;align-items:center;justify-content:center;padding:16px" id="modal-cancelamento-v26">
    <div style="background:#fff;border-radius:12px;width:100%;max-width:860px;max-height:90vh;overflow-y:auto;box-shadow:var(--shadow-lg)">
      <div style="padding:20px 24px;border-bottom:1px solid var(--borda);display:flex;justify-content:space-between;align-items:flex-start;gap:12px">
        <div><div style="font-family:'Bebas Neue',sans-serif;font-size:24px">Cancelamento e acerto financeiro</div><div style="font-size:12px;color:var(--texto-muted)"><strong>${esc(a.nome)}</strong> · ${esc(PLANO_LABEL[c.plano]||c.plano)} · ${fmtData(c.inicio)} → ${fmtData(c.venc)}</div></div>
        <button onclick="document.getElementById('modal-cancelamento-v26').remove()" style="background:none;border:none;font-size:20px;cursor:pointer;color:#999">✕</button>
      </div>
      <div style="padding:14px 24px;background:#fff7ed;border-bottom:1px solid #fed7aa;font-size:12px;color:#92400e"><strong>Regra editável:</strong> o sistema calcula pelo contrato, pelos ciclos consumidos e pelos pagamentos registrados. Fernando ajusta a negociação final antes de salvar e gerar o comprovante.</div>
      <input type="hidden" id="cr-aluno-id" value="${esc(a.id)}"><input type="hidden" id="cr-contrato-id" value="${esc(c.id)}"><input type="hidden" id="cr-tipo-acerto" value="${esc(dados.tipoAcerto||'sem_acerto')}">
      <div style="padding:20px 24px" class="form-grid">
        <div class="form-group"><label class="form-label">Data do cancelamento</label><input class="form-input" type="date" id="cr-data-cancelamento" value="${esc(dados.dataCancelamento||hoje)}"><div class="form-hint">Conta o ciclo pelo dia de aniversário do contrato.</div></div>
        <div class="form-group"><label class="form-label">Última competência consumida</label><input class="form-input" type="month" id="cr-ultima-competencia" value="${esc(dados.ultimaCompetencia||competenciaPorMesesUsadosV31(c,dados.mesesUsados||1))}"></div>
        <div class="form-group"><label class="form-label">Meses do plano</label><input class="form-input" type="number" id="cr-meses-plano" value="${Number(dados.mesesPlano||mesesContrato(c))}" min="1" step="1" readonly></div>
        <div class="form-group"><label class="form-label">Meses utilizados</label><input class="form-input" type="number" id="cr-meses-usados" value="${Number(dados.mesesUsados||0)}" min="0" step="1"><div class="form-hint">Ex.: início 22/06; até 21/07 = 1 mês, em 22/07 = 2 meses.</div></div>
        <div class="form-group"><label class="form-label">Valor total do contrato (R$)</label><input class="form-input" type="number" id="cr-valor-total" value="${Number(dados.valorTotal||0).toFixed(2)}" step="0.01"></div>
        <div class="form-group"><label class="form-label">Valor à vista ref. (R$)</label><input class="form-input" type="number" id="cr-valor-vista" value="${Number(dados.valorVista||0).toFixed(2)}" step="0.01"><div class="form-hint">Referência contratual para plano pago à vista.</div></div>
        <div class="form-group"><label class="form-label">Valor pago considerado (R$)</label><input class="form-input" type="number" id="cr-valor-pago" value="${Number(dados.valorPagoConsiderado||0).toFixed(2)}" step="0.01"><div class="form-hint">Soma dos pagamentos registrados; editável para negociação ou ajuste.</div></div>
        <div class="form-group"><label class="form-label">% multa</label><input class="form-input" type="number" id="cr-pct-multa" value="${Number(dados.percentualMulta||0)}" step="0.01"><div class="form-hint">25%/15% conforme contrato; depois disso, sugestão de 5%.</div></div>
        <div class="form-group"><label class="form-label">Valor consumido (R$)</label><input class="form-input" type="number" id="cr-valor-consumido" value="${Number(dados.valorConsumido||0).toFixed(2)}" step="0.01"></div>
        <div class="form-group"><label class="form-label">Multa aplicada (R$)</label><input class="form-input" type="number" id="cr-multa" value="${Number(dados.multaRetida||0).toFixed(2)}" step="0.01"></div>
        <div class="form-group"><label class="form-label">Extras/benefícios descontados (R$)</label><input class="form-input" type="number" id="cr-extras" value="${Number(dados.extrasDescontados||0).toFixed(2)}" step="0.01"><div class="form-hint">Fisio, nutri, brinde ou outro benefício utilizado.</div></div>
        <div class="form-group"><label class="form-label">Conta de referência</label><select class="form-select" id="cr-conta">${contas.map(ct=>`<option value="${ct}" ${(dados.contaReembolso||dados.contaAcerto||'InfinitePay')===ct?'selected':''}>${ct}</option>`).join('')}</select></div>
        <div class="form-group full"><div id="cr-resultado-acerto" class="acerto-result-v31"></div></div>
        <div class="form-group" id="cr-valor-acordado-box"><label class="form-label">Valor acordado final (R$)</label><input class="form-input" type="number" id="cr-valor-acordado" value="${Number(dados.valorAcertoAcordado||0).toFixed(2)}" step="0.01"><div class="form-hint">Fernando pode negociar valor diferente do sugerido. O comprovante usará este valor.</div></div>
        <div class="form-group" id="cr-parcelas-box"><label class="form-label">Quantidade de parcelas</label><input class="form-input" type="number" id="cr-qtd-parcelas" value="${Number(dados.qtdParcelas||0)}" min="0" step="1"><div class="form-hint" id="cr-hint-parcelas"></div></div>
        <div class="form-group"><label class="form-label">Data da primeira parcela</label><input class="form-input" type="date" id="cr-data-primeira" value="${esc(dados.dataPrimeiraParcela||dados.dataReembolso||dados.dataCancelamento||hoje)}"></div>
        <div class="form-group full"><label class="form-label">Cronograma do acerto</label><div id="cr-cronograma">${renderParcelasAcertoV31(parcelasIniciais)}</div></div>
        <div class="form-group full"><label class="form-label">Observação / negociação final</label><input class="form-input" id="cr-obs" value="${esc(dados.observacao||'') }" placeholder="Ex.: acordo aprovado por Fernando; pagamento único; desconto negociado; multa parcelada..."></div>
      </div>
      <div style="padding:0 24px 14px"><div id="cr-alerta-fechamento" style="font-size:12px;color:var(--texto-muted);background:#f9fafb;border:1px solid var(--borda);border-radius:8px;padding:10px 12px"></div></div>
      <div style="padding:16px 24px 20px;border-top:1px solid var(--borda);display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap">
        <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-ghost" onclick="recalcularSugestaoCancelamentoV26()">Restaurar sugestão automática</button>${existente?`<button class="btn btn-ghost" onclick="gerarComprovanteCancelamentoV31('${String(a.id)}','${String(c.id)}',true)">📄 Gerar comprovante</button>`:''}</div>
        <div style="display:flex;gap:8px"><button class="btn btn-ghost" onclick="document.getElementById('modal-cancelamento-v26').remove()">Fechar</button><button class="btn btn-danger" onclick="confirmarCancelamentoReembolsoV26()">Salvar acerto</button></div>
      </div>
    </div>
  </div>`;
  document.getElementById('modal-cancelamento-v26')?.remove();
  document.body.insertAdjacentHTML('beforeend', html);
  document.getElementById('cr-data-cancelamento')?.addEventListener('input',()=>recalcularPoliticaCancelamentoV31('data'));
  document.getElementById('cr-meses-usados')?.addEventListener('input',()=>recalcularPoliticaCancelamentoV31('meses'));
  ['cr-valor-total'].forEach(id=>document.getElementById(id)?.addEventListener('input',()=>recalcularPoliticaCancelamentoV31('meses')));
  ['cr-valor-vista','cr-valor-pago','cr-valor-consumido','cr-multa','cr-extras'].forEach(id=>document.getElementById(id)?.addEventListener('input',()=>atualizarResultadoAcertoV31(true)));
  document.getElementById('cr-pct-multa')?.addEventListener('input',()=>{
    const valorTotal=readMoneyV26('cr-valor-total');
    const pct=Number(document.getElementById('cr-pct-multa')?.value||0);
    moneyInputV26('cr-multa', valorTotal*pct/100);
    atualizarResultadoAcertoV31(true);
  });
  ['cr-valor-acordado','cr-qtd-parcelas','cr-data-primeira'].forEach(id=>document.getElementById(id)?.addEventListener('input',()=>atualizarResultadoAcertoV31(false)));
  atualizarResultadoAcertoV31(!existente);
};

window.confirmarCancelamentoReembolsoV26 = async function(){
  const alunoId = document.getElementById('cr-aluno-id')?.value;
  const contratoId = document.getElementById('cr-contrato-id')?.value;
  const a = alunos.find(x=>String(x.id)===String(alunoId));
  const c = contratos.find(x=>String(x.id)===String(contratoId));
  if(!a || !c){ alert('Aluno ou contrato não encontrado.'); return; }
  atualizarResultadoAcertoV31(false);
  const dados = lerDadosAcertoModalV31();
  if(!confirm('Salvar o cancelamento e acerto financeiro deste contrato? As receitas futuras serão interrompidas.')) return;
  const cancelamento = {
    status:'ativo',
    dataCancelamento:dados.dataCancelamento,
    ultimaCompetencia:dados.ultimaCompetencia,
    fimCicloConsumido:fimCicloConsumidoV31(c,dados.mesesUsados),
    vencEfetivo:fimCicloConsumidoV31(c,dados.mesesUsados),
    mesesPlano:dados.mesesPlano,
    mesesUsados:dados.mesesUsados,
    mesesRestantes:dados.mesesRestantes,
    percentualMulta:Number(dados.percentualMulta||0),
    valorTotal:Number(dados.valorTotal.toFixed(2)),
    valorVista:Number(dados.valorVista.toFixed(2)),
    valorPagoConsiderado:Number(dados.valorPagoConsiderado.toFixed(2)),
    valorConsumido:Number(dados.valorConsumido.toFixed(2)),
    multaRetida:Number(dados.multaRetida.toFixed(2)),
    extrasDescontados:Number(dados.extrasDescontados.toFixed(2)),
    totalDevidoCancelamento:Number(dados.totalDevidoCancelamento.toFixed(2)),
    saldoAcerto:Number(dados.saldoAcerto.toFixed(2)),
    tipoAcerto:dados.tipoAcerto,
    valorAcertoSugerido:Number(dados.valorAcertoSugerido.toFixed(2)),
    valorAcertoAcordado:Number(dados.valorAcertoAcordado.toFixed(2)),
    valorReembolsado:dados.tipoAcerto==='reembolso' ? Number(dados.valorAcertoAcordado.toFixed(2)) : 0,
    valorAReceber:dados.tipoAcerto==='receber' ? Number(dados.valorAcertoAcordado.toFixed(2)) : 0,
    contaReembolso:document.getElementById('cr-conta')?.value || 'InfinitePay',
    contaAcerto:document.getElementById('cr-conta')?.value || 'InfinitePay',
    qtdParcelas:dados.qtdParcelas,
    dataPrimeiraParcela:dados.dataPrimeiraParcela,
    parcelasAcerto:dados.parcelasAcerto,
    observacao:document.getElementById('cr-obs')?.value.trim() || '',
    atualizadoEm:new Date().toISOString(),
    ts:Date.now()
  };
  const atualizado = {...c, status:'cancelado', cancelamento, vencOriginal:c.vencOriginal||c.venc, atualizadoEm:new Date().toISOString()};
  await salvarContratoDb(atualizado);
  await setDoc(doc(db,'cancelamentos_reembolsos',String(contratoId)), {id:String(contratoId), contratoId:String(contratoId), alunoId:String(alunoId), alunoNome:a.nome, ...cancelamento});
  const hist = {id:`hist_acerto_${contratoId}_${Date.now()}`, alunoId:String(alunoId), alunoNome:a.nome, contratoId:String(contratoId), tipo:'cancelamento_acerto_financeiro', data:cancelamento.dataCancelamento, valor:cancelamento.valorAcertoAcordado, tipoAcerto:cancelamento.tipoAcerto, valorReembolsado:cancelamento.valorReembolsado, valorAReceber:cancelamento.valorAReceber, multaRetida:cancelamento.multaRetida, extrasDescontados:cancelamento.extrasDescontados, descricao:'Cancelamento e acerto financeiro', status:'ativo', ts:Date.now()};
  await setDoc(doc(db,'historico',hist.id), hist);
  await registrarAuditoria('cancelamento_acerto_financeiro', alunoId, a.nome, {}, {contratoId, cancelamento});
  document.getElementById('modal-cancelamento-v26')?.remove();
  hidratarAlunosComContratos();
  toast('Cancelamento e acerto financeiro salvos ✓');
  abrirPerfilAluno(alunoId);
};

function dadosComprovanteAcertoV31(alunoId, contratoId, usarModal=false){
  const a = alunos.find(x=>String(x.id)===String(alunoId));
  const c = contratos.find(x=>String(x.id)===String(contratoId));
  if(!a || !c) return null;
  let canc = c.cancelamento || null;
  if(usarModal && document.getElementById('modal-cancelamento-v26') && String(document.getElementById('cr-contrato-id')?.value)===String(contratoId)){
    const d = lerDadosAcertoModalV31();
    canc = {...canc, ...d, valorReembolsado:d.tipoAcerto==='reembolso'?d.valorAcertoAcordado:0, valorAReceber:d.tipoAcerto==='receber'?d.valorAcertoAcordado:0, observacao:document.getElementById('cr-obs')?.value||''};
  }
  if(!canc) return null;
  return {aluno:a, contrato:c, cancelamento:canc};
}
window.gerarComprovanteCancelamentoV31 = function(alunoId, contratoId, usarModal=false){
  const dados = dadosComprovanteAcertoV31(alunoId, contratoId, usarModal);
  if(!dados){ alert('Acerto não encontrado. Salve o cancelamento antes de gerar o comprovante.'); return; }
  const {aluno:a, contrato:c, cancelamento:canc} = dados;
  const parcelas = canc.parcelasAcerto || gerarParcelasAcertoV31(canc.valorAcertoAcordado||0, canc.qtdParcelas||0, canc.dataPrimeiraParcela||canc.dataCancelamento);
  const tipo = canc.tipoAcerto || (Number(canc.valorReembolsado||0)>0?'reembolso':(Number(canc.valorAReceber||0)>0?'receber':'sem_acerto'));
  const valorFinal = Number(canc.valorAcertoAcordado || canc.valorReembolsado || canc.valorAReceber || 0);
  const parcelasHtml = parcelas.length ? parcelas.map(p=>`<tr><td>${p.numero}</td><td>${fmtData(p.data)}</td><td style="text-align:right">${fmtValor(p.valor)}</td></tr>`).join('') : '<tr><td colspan="3">Sem parcelas programadas.</td></tr>';
  const dataGeracao = new Date().toLocaleDateString('pt-BR');
  const tituloResultado = labelTipoAcertoV31(tipo);
  const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Comprovante de Cancelamento — ${esc(a.nome)}</title><style>@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700&display=swap');*{box-sizing:border-box}body{font-family:Barlow,Arial,sans-serif;font-size:13px;color:#111;background:#fff;padding:32px;max-width:780px;margin:0 auto}.header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #111;padding-bottom:18px;margin-bottom:22px}.logo{font-family:'Bebas Neue';font-size:36px}.logo span{color:#D32F2F}.title{font-family:'Bebas Neue';font-size:25px;color:#D32F2F}.sec{margin:0 0 20px}.sec-title{background:#111;color:#fff;font-family:'Bebas Neue';font-size:16px;padding:8px 10px;border-radius:4px 4px 0 0}table{width:100%;border-collapse:collapse;border:1px solid #eee}td,th{padding:8px 9px;border-bottom:1px solid #eee}th{text-align:left;color:#777;font-size:11px;text-transform:uppercase}.result{border:2px solid ${tipo==='reembolso'?'#16a34a':(tipo==='receber'?'#f97316':'#6b7280')};border-radius:8px;padding:16px 18px;background:${tipo==='reembolso'?'#f0fdf4':(tipo==='receber'?'#fff7ed':'#f9fafb')}}.btn{display:block;margin:0 auto 18px;padding:10px 24px;background:#D32F2F;color:#fff;border:0;border-radius:6px;font-weight:700}.obs{border:1px solid #eee;background:#fafafa;padding:12px;border-radius:8px;min-height:42px}@media print{body{padding:14px}.no-print{display:none}}</style></head><body><button class="btn no-print" onclick="window.print()">🖨️ Imprimir / Salvar PDF</button><div class="header"><div><div class="logo">studio <span>FB</span></div><div style="font-size:10px;color:#999;letter-spacing:3px;text-transform:uppercase">Saúde &amp; Movimento</div></div><div style="text-align:right"><div class="title">Comprovante de Cancelamento</div><div>Acerto financeiro</div><div style="font-size:11px;color:#999">Gerado em ${dataGeracao}</div></div></div><div class="sec"><div class="sec-title">Dados do contrato</div><table><tbody><tr><td>Aluno</td><td><strong>${esc(a.nome)}</strong></td></tr><tr><td>Plano</td><td>${esc(PLANO_LABEL[c.plano]||c.plano)}</td></tr><tr><td>Início</td><td>${fmtData(c.inicio)}</td></tr><tr><td>Cancelamento</td><td>${fmtData(canc.dataCancelamento)}</td></tr><tr><td>Meses utilizados</td><td>${Number(canc.mesesUsados||0)} de ${Number(canc.mesesPlano||mesesContrato(c))}</td></tr><tr><td>Última competência consumida</td><td>${esc(canc.ultimaCompetencia||'—')}</td></tr></tbody></table></div><div class="sec"><div class="sec-title">Cálculo do acerto</div><table><tbody><tr><td>Valor total do contrato</td><td style="text-align:right">${fmtValor(canc.valorTotal||0)}</td></tr><tr><td>Valor à vista de referência</td><td style="text-align:right">${fmtValor(canc.valorVista||0)}</td></tr><tr><td>Valor pago considerado</td><td style="text-align:right">${fmtValor(canc.valorPagoConsiderado||0)}</td></tr><tr><td>Valor consumido</td><td style="text-align:right">${fmtValor(canc.valorConsumido||0)}</td></tr><tr><td>Multa aplicada (${Number(canc.percentualMulta||0)}%)</td><td style="text-align:right">${fmtValor(canc.multaRetida||0)}</td></tr><tr><td>Extras/benefícios descontados</td><td style="text-align:right">${fmtValor(canc.extrasDescontados||0)}</td></tr><tr><td><strong>Total devido no cancelamento</strong></td><td style="text-align:right"><strong>${fmtValor(canc.totalDevidoCancelamento||0)}</strong></td></tr></tbody></table></div><div class="sec"><div class="result"><div style="font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#555;font-weight:700">Resultado acordado</div><div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-top:6px"><strong style="font-size:18px">${tituloResultado}</strong><strong style="font-size:24px">${fmtValor(valorFinal)}</strong></div><div style="font-size:12px;color:#555;margin-top:6px">Este comprovante registra a negociação final salva no sistema.</div></div></div><div class="sec"><div class="sec-title">Programação do acerto</div><table><thead><tr><th>Parcela</th><th>Data prevista</th><th style="text-align:right">Valor</th></tr></thead><tbody>${parcelasHtml}</tbody></table></div><div class="sec"><div class="sec-title">Observação</div><div class="obs">${esc(canc.observacao||'Sem observações adicionais.')}</div></div><div style="font-size:11px;color:#666;border-top:1px solid #eee;padding-top:12px">Reembolso, quando existente, não é classificado como despesa operacional. Multa/benefícios de cancelamento são tratados como receita extra, fora da rotina de emissão mensal de NF.</div></body></html>`;
  const w=window.open('', '_blank');
  if(!w){ alert('O navegador bloqueou a abertura do comprovante. Libere pop-ups para gerar o PDF.'); return; }
  w.document.write(html); w.document.close();
};

const abrirPerfilAlunoBaseV31 = abrirPerfilAluno;
abrirPerfilAluno = function(id){
  abrirPerfilAlunoBaseV31(id);
  setTimeout(()=>{
    const a=alunos.find(x=>String(x.id)===String(id)); if(!a) return;
    (contratosDoAluno(id)||[]).forEach(c=>{
      if(!c.cancelamento) return;
      const box=[...document.querySelectorAll('.resumo-cancelamento-v26')].find(el=>!el.dataset.acertoV31);
      if(!box) return;
      const tipo=c.cancelamento.tipoAcerto || (Number(c.cancelamento.valorReembolsado||0)>0?'reembolso':(Number(c.cancelamento.valorAReceber||0)>0?'receber':'sem_acerto'));
      const valor=Number(c.cancelamento.valorAcertoAcordado || c.cancelamento.valorReembolsado || c.cancelamento.valorAReceber || 0);
      box.dataset.acertoV31='1';
      box.insertAdjacentHTML('beforeend', `<div style="margin-top:8px;padding-top:8px;border-top:1px solid #fecaca">Resultado do acerto: <strong>${esc(labelTipoAcertoV31(tipo))}</strong> · Valor acordado: <strong>${fmtValor(valor)}</strong>${c.cancelamento.qtdParcelas?` · ${Number(c.cancelamento.qtdParcelas)} parcela(s)`:''}</div><div style="margin-top:8px"><button class="btn btn-ghost btn-sm" onclick="gerarComprovanteCancelamentoV31('${String(id)}','${String(c.id)}')">📄 Gerar comprovante PDF</button></div>`);
    });
  },0);
};
window.abrirPerfilAluno = abrirPerfilAluno;
window.openModalAluno = openModalAluno;

// ═══════════════════════════════════════════════════
// V32 — CANCELAMENTO DOCUMENTAL + AUDITORIA FINANCEIRA
// ═══════════════════════════════════════════════════
// Regras operacionais validadas:
// • Competência de contrato vem dos ciclos contratuais, nunca da data do pagamento.
// • Caixa usa a data real de entrada/saída.
// • Cartão entra integralmente no caixa na data em que o Studio recebe o líquido.
// • Despesas permanecem na competência original e só afetam o caixa após baixa explícita.
// • Cancelamento confirmado registra uma fotografia da apuração, mas NÃO lança DRE/caixa.
// • Multa, acordo e reembolso só produzem efeito quando Fernando registra a movimentação.

function arredV32(v){ return Math.round((Number(v||0)+Number.EPSILON)*100)/100; }
function dataNoMesV32(data, mes, ano){
  const d=dataLocal(data);
  return !!d && d.getFullYear()===Number(ano) && d.getMonth()===Number(mes);
}
function ymV32(data){
  const d=dataLocal(data); if(!d) return '';
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
}
function naturezaMovAlunoV32(p){
  if(!p) return 'contrato';
  if(p.tipo==='aula_extra') return 'aula_extra';
  return p.natureza || 'contrato';
}
function naturezaQuitaContratoV32(p){
  return !['aula_extra','multa_cancelamento','acordo_cancelamento','reembolso_cancelamento'].includes(naturezaMovAlunoV32(p));
}
function sinalCaixaAlunoV32(p){ return naturezaMovAlunoV32(p)==='reembolso_cancelamento' ? -1 : 1; }
function valorCaixaAlunoV32(p){ return sinalCaixaAlunoV32(p)*Number(p?.valor||0); }
function labelNaturezaV32(n){
  n=typeof n==='string'?n:naturezaMovAlunoV32(n);
  return ({contrato:'Pagamento do contrato',aula_extra:'Aula extra',multa_cancelamento:'Multa rescisória',acordo_cancelamento:'Pagamento do acordo',reembolso_cancelamento:'Reembolso ao aluno'})[n]||'Movimentação';
}
function badgeNaturezaV32(p){
  const n=naturezaMovAlunoV32(p);
  const d={
    contrato:['Contrato','var(--azul)','var(--azul-light)'],
    aula_extra:['Aula extra','var(--roxo)','var(--roxo-light)'],
    multa_cancelamento:['Multa','var(--verde)','var(--verde-light)'],
    acordo_cancelamento:['Acordo','#0369a1','#e0f2fe'],
    reembolso_cancelamento:['Reembolso','var(--vermelho)','var(--vermelho-light)']
  }[n]||['Movimentação','#6b7280','#f3f4f6'];
  return `<span class="badge" style="color:${d[1]};background:${d[2]};margin-left:6px">${d[0]}</span>`;
}
function hintNaturezaV32(n){
  return ({
    contrato:'Caixa: entrada na data recebida. DRE: não muda; a competência já vem dos ciclos do contrato.',
    multa_cancelamento:'Caixa: entrada na data recebida. DRE: receita de multa no mesmo mês do recebimento.',
    acordo_cancelamento:'Caixa: entrada na data recebida. DRE: não cria nova receita.',
    reembolso_cancelamento:'Caixa: saída na data paga. DRE: não é despesa operacional.'
  })[n]||'';
}

// Pagamentos que quitam o preço original do contrato.
pagamentosDoContrato = function(contratoId){
  return pagamentos
    .filter(p=>String(p.contratoId)===String(contratoId) && p.status!=='excluido' && naturezaQuitaContratoV32(p))
    .sort((a,b)=>(dataLocal(a.data)?.getTime()||0)-(dataLocal(b.data)?.getTime()||0));
};
pagamentosDoAluno = function(alunoId){
  return pagamentos
    .filter(p=>String(p.alunoId)===String(alunoId) && p.status!=='excluido')
    .sort((a,b)=>(dataLocal(b.data)?.getTime()||0)-(dataLocal(a.data)?.getTime()||0));
};
totalPagoContrato = function(contratoId){ return pagamentosDoContrato(contratoId).reduce((s,p)=>s+Number(p.valor||0),0); };
saldoContrato = function(c){ return Math.max(0,valorContrato(c)-totalPagoContrato(c?.id)); };

// Contrato cancelado não volta a ser tratado como vigente.
contratoVigenteAluno = function(alunoId){
  const lista=contratosDoAluno(alunoId).filter(c=>c.status!=='cancelado');
  if(!lista.length) return null;
  const hoje=new Date();
  const vigente=lista.find(c=>{const i=dataLocal(c.inicio),v=dataLocal(vencEfetivoContratoV26(c));return i&&v&&i<=hoje&&v>=hoje;});
  if(vigente) return vigente;
  const futuro=lista.find(c=>dataLocal(c.inicio)>hoje);
  return futuro || lista[lista.length-1] || null;
};
statusContratoHistorico = function(c){
  if(c?.status==='cancelado') return {contrato:'cancelado',label:'Cancelado',cor:'var(--vermelho)',icon:'⛔'};
  if(!c) return {contrato:'nao_renovou',label:'Sem contrato',cor:'#6b7280',icon:'📋'};
  const hoje=new Date(),ini=dataLocal(c.inicio),venc=dataLocal(vencEfetivoContratoV26(c));
  const pago=totalPagoContrato(c.id),total=valorContrato(c),saldo=Math.max(0,total-pago);
  if(ini&&ini>hoje) return {contrato:'futuro',label:'Contrato futuro',cor:'var(--azul)',icon:'⏳'};
  if(venc&&venc<hoje) return saldo>0?{contrato:'inadimplente',label:'Vencido em aberto',cor:'var(--vermelho)',icon:'🔴'}:{contrato:'quitado',label:'Quitado',cor:'var(--verde)',icon:'✅'};
  if(pago>=total&&total>0) return {contrato:'ativo',label:'Vigente e quitado',cor:'var(--verde)',icon:'✅'};
  if(pago>0) return {contrato:'aguardando',label:'Vigente — parcial',cor:'var(--amarelo)',icon:'◐'};
  return {contrato:'aguardando',label:'Vigente — em aberto',cor:'var(--azul)',icon:'⏳'};
};

// Datas financeiras sempre interpretadas como data local.
aulasExtrasMes = function(mes,ano){ return pagamentos.filter(p=>isAulaExtraPagamento(p)&&dataNoMesV32(p.data,mes,ano)); };
totalAulasExtrasMes = function(mes,ano){ return aulasExtrasMes(mes,ano).reduce((s,p)=>s+Number(p.valor||0),0); };
pagamentosCartaoMes = function(mes,ano){ return pagamentos.filter(p=>p.status!=='excluido'&&p.forma==='Cartão'&&dataNoMesV32(p.data,mes,ano)); };
totalTaxaCartaoMes = function(mes,ano){ return pagamentosCartaoMes(mes,ano).reduce((s,p)=>s+valorTaxaCartao(p),0); };
totalBrutoCartaoMes = function(mes,ano){ return pagamentosCartaoMes(mes,ano).reduce((s,p)=>s+num(p.valorBruto||p.valor),0); };
totalLiquidoCartaoMes = function(mes,ano){ return pagamentosCartaoMes(mes,ano).reduce((s,p)=>s+num(p.valor),0); };
function movimentosAlunoCaixaMesV32(mes,ano){
  return pagamentos.filter(p=>p.status!=='excluido'&&p.data&&dataNoMesV32(p.data,mes,ano))
    .sort((a,b)=>(dataLocal(b.data)?.getTime()||0)-(dataLocal(a.data)?.getTime()||0));
}
receitaCaixaMes = function(mes,ano){ return movimentosAlunoCaixaMesV32(mes,ano).reduce((s,p)=>s+valorCaixaAlunoV32(p),0); };
function entradasAlunoV32(mes,ano){ return movimentosAlunoCaixaMesV32(mes,ano).reduce((s,p)=>s+Math.max(0,valorCaixaAlunoV32(p)),0); }
function reembolsosAlunoV32(mes,ano){ return movimentosAlunoCaixaMesV32(mes,ano).reduce((s,p)=>s+Math.max(0,-valorCaixaAlunoV32(p)),0); }
function multasMesV32(mes,ano){ return movimentosAlunoCaixaMesV32(mes,ano).filter(p=>naturezaMovAlunoV32(p)==='multa_cancelamento'); }
function receitaMultasV32(mes,ano){ return multasMesV32(mes,ano).reduce((s,p)=>s+Number(p.valor||0),0); }

// Cancelamento não gera DRE nem liquidação por si só.
receitasExtrasCancelamentoMesV26 = function(){ return []; };
totalReceitasExtrasCancelamentoMesV26 = function(){ return 0; };
totalLiquidadoCancelamentoV26 = function(){ return 0; };

// DRE: ciclos do contrato + aulas extras + multa registrada manualmente.
receitaMesEsp = function(mes,ano){
  const contratosValor=contratos.filter(c=>contratoContaCompetenciaMes(c,mes,ano))
    .reduce((s,c)=>s+Number(valorCompetenciaContratoMesV28(c,mes,ano)||0),0);
  return contratosValor + totalAulasExtrasMes(mes,ano) + receitaMultasV32(mes,ano);
};
receitaMensal = function(){ return receitaMesEsp(MES_ATUAL,ANO_ATUAL); };
receitaDoMesSelecionada = function(mes,ano){ return financeiroModo==='caixa'?receitaCaixaMes(mes,ano):receitaMesEsp(mes,ano); };

// ──────────────────────────────────────────────────
// DESPESAS: competência ≠ caixa
// ──────────────────────────────────────────────────
function hashV32(s){ let h=2166136261; for(const ch of String(s||'')){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);} return (h>>>0).toString(36); }
function refDespV32(d,cat,mes,ano,idx){
  const ym=`${ano}_${String(mes).padStart(2,'0')}`;
  if(d?.__pessoalV20&&d?.funcionarioId) return `pessoal_${d.funcionarioId}_${ym}`;
  if(d?.progId) return `prog_${d.progId}_${ym}`;
  if(d?.id) return `item_${d.id}_${ym}`;
  return `desp_${ym}_${cat}_${idx}_${hashV32(d?.desc||'')}`;
}
function movDespV32(ref){ return (caixaMovs||[]).find(m=>m.status!=='excluido'&&m.tipo==='pagamento_despesa_operacional'&&String(m.despesaRef)===String(ref))||null; }
function movDespesasMesV32(mes,ano){
  return (caixaMovs||[]).filter(m=>m.status!=='excluido'&&m.tipo==='pagamento_despesa_operacional'&&dataNoMesV32(m.data,mes,ano))
    .sort((a,b)=>(dataLocal(b.data)?.getTime()||0)-(dataLocal(a.data)?.getTime()||0));
}
function totalDespesaCaixaV32(mes,ano){ return movDespesasMesV32(mes,ano).reduce((s,m)=>s+Number(m.valor||0),0); }
function catLabelV32(cat){ return ({operacional:'Colaboradores',despesa_op:'Despesas Operacionais',administrativo:'Administrativo',marketing:'Marketing',impostos:'Impostos',pessoal:'Pessoal e Encargos'})[cat]||cat; }
async function itensDespV32(mes,ano){
  const cats=await loadDespesas(mes,ano),itens=[];
  Object.entries(cats||{}).forEach(([cat,lista])=>(lista||[]).forEach((d,idx)=>{
    if(Number(d.valor||0)<=0) return;
    itens.push({cat,idx,d,ref:refDespV32(d,cat,mes,ano,idx),descricao:d.desc||'Despesa',valor:Number(d.valor||0),competencia:`${ano}-${String(mes+1).padStart(2,'0')}`});
  }));
  return itens;
}
window.abrirBaixaDespesaV32 = async function(ref,descricao,valorPadrao,competencia,cat=''){
  await carregarMovCaixa();
  const mov=movDespV32(ref),hoje=new Date().toISOString().split('T')[0];
  const html=`<div class="overlay open" id="modal-baixa-v32" style="z-index:560"><div class="modal" style="max-width:490px"><div class="modal-header"><div><div class="modal-title">${mov?'Editar':'Registrar'} pagamento da despesa</div><div style="font-size:12px;color:var(--texto-muted)">Competência ${esc(competencia)}. A data abaixo determina o caixa.</div></div><button class="modal-close" onclick="document.getElementById('modal-baixa-v32').remove()">✕</button></div><div class="modal-body"><div style="padding:10px 12px;background:#f9fafb;border:1px solid var(--borda);border-radius:8px;margin-bottom:14px"><strong>${esc(descricao)}</strong><div style="font-size:12px;color:var(--texto-muted)">Valor na competência: ${fmtValor(valorPadrao)}</div></div><div class="form-grid" style="grid-template-columns:1fr"><div class="form-group"><label class="form-label">Data em que saiu do caixa</label><input class="form-input" type="date" id="bd-data" value="${esc(mov?.data||hoje)}"></div><div class="form-group"><label class="form-label">Valor efetivamente pago (R$)</label><input class="form-input" type="number" step="0.01" id="bd-valor" value="${Number(mov?.valor??valorPadrao).toFixed(2)}"></div><div class="form-group"><label class="form-label">Conta / forma</label><input class="form-input" id="bd-conta" value="${esc(mov?.conta||'')}" placeholder="Ex.: PIX / Banco do Brasil"></div><div class="form-group"><label class="form-label">Observação</label><input class="form-input" id="bd-obs" value="${esc(mov?.observacao||'')}"></div></div></div><div class="modal-footer">${mov?`<button class="btn btn-danger" onclick="removerBaixaDespesaV32('${esc(ref)}')">Desfazer baixa</button>`:''}<div style="flex:1"></div><button class="btn btn-ghost" onclick="document.getElementById('modal-baixa-v32').remove()">Cancelar</button><button class="btn btn-primary" onclick='salvarBaixaDespesaV32(${JSON.stringify(ref)},${Number(valorPadrao)},${JSON.stringify(competencia)},${JSON.stringify(descricao)},${JSON.stringify(cat)})'>Salvar</button></div></div></div>`;
  document.body.insertAdjacentHTML('beforeend',html);
};
window.salvarBaixaDespesaV32 = async function(ref,valorPadrao,competencia,descricao,cat){
  const data=document.getElementById('bd-data')?.value,valor=Number(document.getElementById('bd-valor')?.value||0);
  if(!data||valor<=0){alert('Informe data e valor pago.');return;}
  const existente=movDespV32(ref),id=existente?.id||`cx_desp_${hashV32(ref)}`;
  const mov={...existente,id,tipo:'pagamento_despesa_operacional',despesaRef:ref,data,valor:arredV32(valor),competencia,descricao,cat,conta:document.getElementById('bd-conta')?.value.trim()||'',observacao:document.getElementById('bd-obs')?.value.trim()||'',status:'ativo',criadoEm:existente?.criadoEm||new Date().toISOString(),atualizadoEm:new Date().toISOString(),ts:existente?.ts||Date.now()};
  await salvarMovCaixa(mov);
  document.getElementById('modal-baixa-v32')?.remove();
  toast('Pagamento da despesa registrado no caixa ✓');
  if(viewAtual==='despesas') renderDespesasView(); else if(viewAtual==='financeiro') renderFinanceiroView(); else if(viewAtual==='caixa') renderCaixaView();
};
window.removerBaixaDespesaV32 = async function(ref){
  const mov=movDespV32(ref); if(!mov||!confirm('Desfazer a baixa de caixa? A despesa continuará na competência.'))return;
  await salvarMovCaixa({...mov,status:'excluido',excluidoEm:new Date().toISOString()});
  document.getElementById('modal-baixa-v32')?.remove(); toast('Baixa removida. A competência foi preservada.'); renderDespesasView();
};
async function inserirConciliacaoV32(){
  const cont=document.getElementById('content'); if(!cont||document.getElementById('conciliacao-v32'))return;
  await carregarMovCaixa();
  const itens=await itensDespV32(despMes,despAno);
  const comp=itens.reduce((s,i)=>s+i.valor,0),baixado=itens.reduce((s,i)=>s+Number(movDespV32(i.ref)?.valor||0),0),qtd=itens.filter(i=>movDespV32(i.ref)).length;
  const rows=itens.map(i=>{const m=movDespV32(i.ref);return `<tr><td><strong>${esc(i.descricao)}</strong><div style="font-size:11px;color:var(--texto-muted)">${esc(catLabelV32(i.cat))}</div></td><td style="font-weight:700">${fmtValor(i.valor)}</td><td>${m?`<span class="badge badge-pago">Pago</span><div style="font-size:11px;color:var(--texto-muted);margin-top:3px">${fmtData(m.data)} · ${fmtValor(m.valor)}</div>`:`<span class="badge badge-pendente">Sem baixa</span>`}</td><td style="text-align:right"><button class="btn ${m?'btn-ghost':'btn-success'} btn-sm" onclick='abrirBaixaDespesaV32(${JSON.stringify(i.ref)},${JSON.stringify(i.descricao)},${i.valor},${JSON.stringify(i.competencia)},${JSON.stringify(i.cat)})'>${m?'✏️ Editar baixa':'💵 Registrar pagamento'}</button></td></tr>`;}).join('');
  cont.insertAdjacentHTML('beforeend',`<div class="section-box" id="conciliacao-v32" style="margin-top:20px"><div class="section-header"><div><div class="section-title">Conciliação de Caixa das Despesas</div><div style="font-size:12px;color:var(--texto-muted)">A despesa continua na competência de ${MESES_NOMES[despMes]} ${despAno}. Só entra no caixa na data de pagamento registrada.</div></div><div style="font-size:12px;text-align:right"><strong>${qtd}/${itens.length}</strong> baixadas<br><span style="color:var(--texto-muted)">Comp. ${fmtValor(comp)} · baixado ${fmtValor(baixado)}</span></div></div><div class="table-wrap"><table><thead><tr><th>Despesa</th><th>Competência</th><th>Caixa</th><th></th></tr></thead><tbody>${rows||'<tr><td colspan="4"><div class="empty">Nenhuma despesa com valor neste mês.</div></td></tr>'}</tbody></table></div></div>`);
}
const renderDespesasBaseV32 = renderDespesasView;
renderDespesasView = async function(){ await renderDespesasBaseV32(); await inserirConciliacaoV32(); };
window.renderDespesasView=renderDespesasView;

// Resultado de caixa usa despesas efetivamente pagas.
const resumoCaixaBaseV32 = resumoCaixaMes;
resumoCaixaMes = async function(mes=cxMes,ano=cxAno){
  await carregarMovCaixa();
  const r=await resumoCaixaBaseV32(mes,ano),despCaixa=totalDespesaCaixaV32(mes,ano);
  return {...r,despCaixa,resCx:Number(r.recCx||0)-despCaixa};
};
window.resumoCaixaMes=resumoCaixaMes;
const resumoCaixaLeveBaseV32 = resumoCaixaMesLeve;
resumoCaixaMesLeve = async function(mes,ano){
  await carregarMovCaixa();
  const r=await resumoCaixaLeveBaseV32(mes,ano),despCaixa=totalDespesaCaixaV32(mes,ano);
  return {...r,despCaixa,resCx:Number(r.recCx||0)-despCaixa};
};

// ──────────────────────────────────────────────────
// PAGAMENTOS / MOVIMENTAÇÕES NO PERFIL DO ALUNO
// ──────────────────────────────────────────────────
function somaNaturezaContratoV32(c,n){ return pagamentos.filter(p=>p.status!=='excluido'&&String(p.contratoId)===String(c?.id)&&naturezaMovAlunoV32(p)===n).reduce((s,p)=>s+Number(p.valor||0),0); }
function sugestaoValorMovV32(c,n){
  if(n==='contrato') return saldoContrato(c);
  const x=c?.cancelamento; if(!x)return 0;
  if(n==='multa_cancelamento') return Math.max(0,Number(x.multaRetida||0)-somaNaturezaContratoV32(c,n));
  if(n==='acordo_cancelamento') return Math.max(0,Number(x.valorAReceber||x.valorAcertoAcordado||0)-somaNaturezaContratoV32(c,n));
  if(n==='reembolso_cancelamento') return Math.max(0,Number(x.valorReembolsado||x.valorAcertoAcordado||0)-somaNaturezaContratoV32(c,n));
  return 0;
}
window.atualizarNaturezaPagamentoV32 = function(forcar=true){
  const n=document.getElementById('pg-natureza')?.value||'contrato',cid=document.getElementById('pg-contrato-id')?.value,c=contratos.find(x=>String(x.id)===String(cid));
  const hint=document.getElementById('pg-natureza-hint'); if(hint)hint.textContent=hintNaturezaV32(n);
  const desc=document.getElementById('pg-desc'); if(desc&&desc.dataset.editando!=='1')desc.value=labelNaturezaV32(n);
  if(forcar&&c){const v=sugestaoValorMovV32(c,n),el=document.getElementById('pg-valor');if(el&&v>0)el.value=v.toFixed(2);}
  const forma=document.getElementById('pg-forma'); if(n==='reembolso_cancelamento'&&forma?.value==='Cartão')forma.value='PIX';
  togglePgCartao();
};
function abrirModalPagamentoV32(alunoId,contratoId=null,pagamentoId=null){
  const a=alunos.find(x=>String(x.id)===String(alunoId)); if(!a)return;
  const lista=contratosDoAluno(alunoId),c=contratoId?contratos.find(x=>String(x.id)===String(contratoId)):(contratoVigenteAluno(alunoId)||lista[lista.length-1]);
  if(!c){alert('Cadastre um contrato antes de lançar movimentação.');return;}
  const p=pagamentoId?pagamentos.find(x=>String(x.id)===String(pagamentoId)):null,n0=naturezaMovAlunoV32(p),x=c.cancelamento;
  const op=[['contrato','Pagamento do contrato / mensalidade']];
  if(x){op.push(['multa_cancelamento','Multa rescisória']);if(Number(x.valorAReceber||0)>0)op.push(['acordo_cancelamento','Pagamento do acordo / saldo']);if(Number(x.valorReembolsado||0)>0)op.push(['reembolso_cancelamento','Reembolso ao aluno']);}
  if(!op.some(o=>o[0]===n0)&&n0!=='aula_extra')op.push([n0,labelNaturezaV32(n0)]);
  const valor=p?.valor??sugestaoValorMovV32(c,n0),forma=p?.forma||c.pgto||'PIX',bruto=p?.valorBruto??valor;
  const html=`<div style="position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:570;display:flex;align-items:center;justify-content:center;padding:16px" id="modal-pagamento-overlay"><div style="background:#fff;border-radius:12px;padding:24px;width:100%;max-width:540px;box-shadow:var(--shadow-lg);max-height:92vh;overflow-y:auto"><div style="font-family:'Bebas Neue',sans-serif;font-size:22px;margin-bottom:4px">${p?'Editar movimentação':'Registrar movimentação'}</div><div style="font-size:12px;color:var(--texto-muted);margin-bottom:16px"><strong>${esc(a.nome)}</strong> · ${esc(nomeContrato(c))}</div><input type="hidden" id="pg-contrato-id" value="${esc(c.id)}"><div class="form-grid" style="grid-template-columns:1fr"><div class="form-group"><label class="form-label">O que este lançamento representa?</label><select class="form-select" id="pg-natureza" onchange="atualizarNaturezaPagamentoV32(true)">${op.map(([v,l])=>`<option value="${v}" ${v===n0?'selected':''}>${l}</option>`).join('')}</select><div class="form-hint" id="pg-natureza-hint">${esc(hintNaturezaV32(n0))}</div></div><div class="form-group"><label class="form-label">Data real da movimentação</label><input class="form-input" type="date" id="pg-data" value="${esc(p?.data||new Date().toISOString().split('T')[0])}"><div class="form-hint">Esta data determina o mês do caixa.</div></div><div class="form-group"><label class="form-label">Forma</label><select class="form-select" id="pg-forma" onchange="togglePgCartao()"><option value="PIX" ${forma==='PIX'?'selected':''}>PIX</option><option value="Cartão" ${forma==='Cartão'?'selected':''}>Cartão</option><option value="Dinheiro" ${forma==='Dinheiro'?'selected':''}>Dinheiro</option></select></div><div class="form-group" id="pg-bruto-group" style="display:none"><label class="form-label">Valor cobrado no cartão (bruto)</label><input class="form-input" type="number" id="pg-valor-bruto" step="0.01" value="${Number(bruto||0)||''}" oninput="calcPgCartao()"></div><div class="form-group"><label class="form-label" id="pg-valor-label">Valor efetivo (R$)</label><input class="form-input" type="number" id="pg-valor" step="0.01" value="${Number(valor||0).toFixed(2)}" oninput="calcPgCartao()"></div><div class="form-group" id="pg-cartao-resumo-group" style="display:none"><label class="form-label">Resumo do cartão</label><div class="form-input" id="pg-cartao-hint" style="background:#fff7ed;color:#92400e;min-height:40px;display:flex;align-items:center"></div></div><div class="form-group" id="pg-parcelas-group" style="display:none"><label class="form-label">Parcelamento do cliente</label><select class="form-select" id="pg-parcelas"><option value="">Não informado</option>${Array.from({length:12},(_,i)=>i+1).map(n=>`<option value="${n}" ${Number(p?.parcelas||c.parcelas)===n?'selected':''}>${n}x</option>`).join('')}</select><div class="form-hint">Mesmo parcelado, o líquido integral entra no caixa nesta data.</div></div><div class="form-group"><label class="form-label">Descrição</label><input class="form-input" id="pg-desc" data-editando="${p?'1':'0'}" value="${esc(p?.descricao||labelNaturezaV32(n0))}"></div></div><div style="padding:10px 12px;margin-top:12px;background:#f9fafb;border:1px solid var(--borda);border-radius:8px;font-size:12px;color:var(--texto-muted)"><strong>Competência x caixa:</strong> pagamentos normais nunca deslocam a competência do contrato. Multa é a única natureza de cancelamento que também cria receita na DRE.</div><div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px"><button class="btn btn-ghost" onclick="document.getElementById('modal-pagamento-overlay').remove()">Cancelar</button><button class="btn btn-primary" onclick="confirmarPagamentoContratoV32('${esc(alunoId)}','${esc(c.id)}','${esc(pagamentoId||'')}')">Salvar</button></div></div></div>`;
  document.body.insertAdjacentHTML('beforeend',html); togglePgCartao(); atualizarNaturezaPagamentoV32(false);
}
abrirModalPagamentoContrato=abrirModalPagamentoV32;
window.abrirModalPagamentoContrato=abrirModalPagamentoContrato;
registrarPagamento=async function(id){abrirModalPagamentoContrato(id);};
window.registrarPagamento=registrarPagamento;
window.confirmarPagamentoContratoV32 = async function(alunoId,contratoId,pagamentoId=''){
  const c=contratos.find(x=>String(x.id)===String(contratoId)),a=alunos.find(x=>String(x.id)===String(alunoId));if(!c||!a)return;
  const data=document.getElementById('pg-data')?.value,valor=Number(document.getElementById('pg-valor')?.value||0),natureza=document.getElementById('pg-natureza')?.value||'contrato';
  if(!data||valor<=0){alert('Informe data e valor.');return;}
  const existente=pagamentoId?pagamentos.find(p=>String(p.id)===String(pagamentoId)):null,forma=document.getElementById('pg-forma')?.value||'PIX';
  const parcelas=forma==='Cartão'?(parseInt(document.getElementById('pg-parcelas')?.value)||null):null,valorBruto=forma==='Cartão'?(Number(document.getElementById('pg-valor-bruto')?.value||0)||null):null;
  if(forma==='Cartão'&&valorBruto&&valorBruto<valor){alert('No cartão, o valor bruto não pode ser menor que o líquido recebido.');return;}
  const id=pagamentoId||`pg_${contratoId}_${Date.now()}`;
  const pg={...existente,id,contratoId:String(contratoId),alunoId:String(alunoId),alunoNome:a.nome,natureza,valor:arredV32(valor),valorLiquido:arredV32(valor),valorBruto,taxaCartaoValor:forma==='Cartão'&&valorBruto?arredV32(valorBruto-valor):null,data,forma,parcelas,descricao:document.getElementById('pg-desc')?.value.trim()||labelNaturezaV32(natureza),direcaoCaixa:natureza==='reembolso_cancelamento'?'saida':'entrada',impactaDRE:natureza==='multa_cancelamento',competenciaDRE:natureza==='multa_cancelamento'?ymV32(data):'',status:'ativo',ts:existente?.ts||Date.now(),criadoEm:existente?.criadoEm||new Date().toISOString(),atualizadoEm:new Date().toISOString()};
  await salvarPagamentoDb(pg); await registrarAuditoria(pagamentoId?'edicao_movimentacao_aluno':'movimentacao_aluno',alunoId,a.nome,existente||{},pg);
  document.getElementById('modal-pagamento-overlay')?.remove(); toast(natureza==='reembolso_cancelamento'?'Reembolso registrado como saída de caixa ✓':'Movimentação salva ✓'); abrirPerfilAluno(alunoId);
};
window.confirmarPagamentoContrato=window.confirmarPagamentoContratoV32;

// Cadastro de aluno: não inventar caixa pelo status inicial "pago".
salvarAluno = async function(){
  anivGarantirCampoNovoAlunoV14(); reajGarantirCamposNovoAlunoV17();
  const nome=document.getElementById('f-nome').value.trim();if(!nome){alert('Informe o nome.');return;}
  const alunoId=gerarId(),dataEntrada=document.getElementById('f-inicio').value||HOJE.toISOString().split('T')[0],nascimento=document.getElementById('f-nascimento')?.value||'',reajusteInicio=document.getElementById('f-reajusteInicio')?.value||'',reajusteFim=document.getElementById('f-reajusteFim')?.value||'';
  const aluno={id:alunoId,nome,whats:document.getElementById('f-whats').value.trim(),nascimento,dataNascimento:nascimento,reajusteInicio,reajusteFim,dataEntrada,frequencia:3,ferias:[],turmas:[],obsAluno:'',statusGeral:'ativo'};
  const plano=document.getElementById('f-plano').value,valor=parseFloat(document.getElementById('f-valor').value)||0,inicio=dataEntrada,venc=document.getElementById('f-venc').value,parcelasVal=document.getElementById('f-parcelas')?.value||'';
  if(!inicio||!venc||valor<=0){alert('Preencha início, vencimento e valor do contrato.');return;}
  const contratoId=`ct_${alunoId}_${Date.now()}`,contrato={id:contratoId,alunoId,alunoNome:nome,nome:'Contrato inicial',plano,valorTotal:valor,inicio,venc,pgto:document.getElementById('f-pgto').value,parcelas:parcelasVal?parseInt(parcelasVal):null,recebimento:document.getElementById('f-recebimento').value,status:'ativo',obs:document.getElementById('f-obs').value.trim(),criadoEm:new Date().toISOString(),ts:Date.now()};
  alunos.push(aluno);contratos.push(contrato);await salvarAlunoDb(aluno);await salvarContratoDb(contrato);await registrarAuditoria('cadastro_aluno',alunoId,nome,{}, {aluno,contrato});
  closeModalAluno();hidratarAlunosComContratos();toast('Aluno e contrato cadastrados. Registre o pagamento separadamente para movimentar o caixa.');render();
};
window.salvarAluno=salvarAluno;

// ──────────────────────────────────────────────────
// CANCELAMENTO: SIMULAÇÃO → CONFIRMAÇÃO DOCUMENTAL
// ──────────────────────────────────────────────────
function calcularCancelamentoV32(c,{dataCancelamento,valorTotal,valorVista,extrasTotal}={}){
  const data=dataCancelamento||new Date().toISOString().split('T')[0],mesesPlano=Math.max(1,mesesContrato(c)),mesesUsados=mesesUsadosPorDataCancelamentoV31(c,data);
  const total=Number((valorTotal ?? valorContrato(c)) || 0),vista=Number((valorVista ?? valorVistaReferenciaV26(c)) || 0),pago=Number(totalPagoContrato(c.id)||0),extras=Number(extrasTotal||0),pct=percentualMultaReembolsoV26(c.plano,mesesUsados),mensal=mesesPlano?total/mesesPlano:total;
  const consumido=c.plano==='mensal'?total:mensal*mesesUsados,multa=c.plano==='mensal'?0:total*pct/100,custo=consumido+multa+extras,reembolsoTeorico=c.plano==='mensal'?0:Math.max(0,vista-custo),saldo=pago-custo;
  let tipo='sem_acerto',reembolso=0,receber=0;
  if(saldo < -0.005){tipo='receber';receber=Math.abs(saldo);} else if(saldo>0.005&&reembolsoTeorico>0.005){tipo='reembolso';reembolso=Math.min(reembolsoTeorico,saldo);}
  return {dataCancelamento:data,ultimaCompetencia:competenciaPorMesesUsadosV31(c,Math.max(1,mesesUsados)),fimCicloConsumido:fimCicloConsumidoV31(c,mesesUsados),mesesPlano,mesesUsados,mesesRestantes:Math.max(0,mesesPlano-mesesUsados),valorTotal:arredV32(total),valorVista:arredV32(vista),valorPagoConsiderado:arredV32(pago),valorMensal:arredV32(mensal),percentualMulta:pct,valorConsumido:arredV32(consumido),multaRetida:arredV32(multa),extrasDescontados:arredV32(extras),totalDevidoCancelamento:arredV32(custo),reembolsoTeorico:arredV32(reembolsoTeorico),saldoFinanceiro:arredV32(saldo),tipoAcerto:tipo,valorReembolsado:arredV32(reembolso),valorAReceber:arredV32(receber),valorAcertoSugerido:arredV32(tipo==='reembolso'?reembolso:tipo==='receber'?receber:0)};
}
function extrasModalV32(){ return [...document.querySelectorAll('#cr-extras-v32 .extra-v32')].map(r=>({descricao:r.querySelector('.extra-desc-v32')?.value.trim()||'Extra/benefício',valor:Number(r.querySelector('.extra-val-v32')?.value||0)})).filter(x=>x.valor>0); }
function totalExtrasModalV32(){return extrasModalV32().reduce((s,x)=>s+x.valor,0);}
window.addExtraCancelamentoV32=function(desc='',valor=''){
  const box=document.getElementById('cr-extras-v32');if(!box)return;
  box.insertAdjacentHTML('beforeend',`<div class="extra-v32" style="display:grid;grid-template-columns:1fr 140px 36px;gap:8px;margin-bottom:8px"><input class="form-input extra-desc-v32" placeholder="Ex.: consulta com fisio" value="${esc(desc)}"><input class="form-input extra-val-v32" type="number" step="0.01" placeholder="0,00" value="${valor!==''?Number(valor).toFixed(2):''}" oninput="recalcularCancelamentoV32(true)"><button type="button" class="btn btn-danger btn-sm" onclick="this.closest('.extra-v32').remove();recalcularCancelamentoV32(true)">✕</button></div>`);
};
window.recalcularCancelamentoV32=function(sincAcordo=true){
  const cid=document.getElementById('cr-contrato-id')?.value,c=contratos.find(x=>String(x.id)===String(cid));if(!c)return;
  const calc=calcularCancelamentoV32(c,{dataCancelamento:document.getElementById('cr-data')?.value,valorTotal:Number(document.getElementById('cr-total')?.value||0),valorVista:Number(document.getElementById('cr-vista')?.value||0),extrasTotal:totalExtrasModalV32()});
  const put=(id,v)=>{const el=document.getElementById(id);if(el)el.value=v;};
  put('cr-meses',calc.mesesUsados);put('cr-mensal',calc.valorMensal.toFixed(2));put('cr-pct',calc.percentualMulta);put('cr-consumido',calc.valorConsumido.toFixed(2));put('cr-multa',calc.multaRetida.toFixed(2));put('cr-pago',calc.valorPagoConsiderado.toFixed(2));put('cr-teorico',calc.reembolsoTeorico.toFixed(2));put('cr-custo',calc.totalDevidoCancelamento.toFixed(2));put('cr-saldo',calc.saldoFinanceiro.toFixed(2));put('cr-tipo',calc.tipoAcerto);
  if(sincAcordo){put('cr-acordado',calc.valorAcertoSugerido.toFixed(2));put('cr-qtd',calc.tipoAcerto==='reembolso'?Math.max(1,calc.mesesRestantes):(calc.tipoAcerto==='receber'?1:0));}
  const lab=calc.tipoAcerto==='reembolso'?'A reembolsar ao aluno':calc.tipoAcerto==='receber'?'A receber do aluno':'Sem valor a acertar',cor=calc.tipoAcerto==='reembolso'?'var(--verde)':calc.tipoAcerto==='receber'?'#b45309':'#6b7280',res=document.getElementById('cr-resultado');
  if(res)res.innerHTML=`<div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:var(--texto-muted)">Resultado da simulação</div><div style="display:flex;justify-content:space-between;gap:12px;margin-top:5px"><strong style="font-size:17px;color:${cor}">${lab}</strong><strong style="font-size:20px;color:${cor}">${fmtValor(calc.valorAcertoSugerido)}</strong></div><div style="font-size:12px;color:var(--texto-muted);margin-top:6px">Reembolso teórico: ${fmtValor(calc.reembolsoTeorico)} · saldo financeiro real: ${calc.saldoFinanceiro<0?'-':''}${fmtValor(Math.abs(calc.saldoFinanceiro))}.</div>`;
  const wrap=document.getElementById('cr-parcelas-wrap');if(wrap)wrap.style.display=calc.tipoAcerto==='sem_acerto'?'none':'';
  atualizarParcelasCancelamentoV32();
};
window.atualizarParcelasCancelamentoV32=function(){
  const valor=Number(document.getElementById('cr-acordado')?.value||0),qtd=Number(document.getElementById('cr-qtd')?.value||0),data=document.getElementById('cr-primeira')?.value||document.getElementById('cr-data')?.value,box=document.getElementById('cr-cronograma');
  if(box)box.innerHTML=renderParcelasAcertoV31(gerarParcelasAcertoV31(valor,qtd,data));
};
function abrirSimulacaoCancelamentoV32(alunoId,contratoId){
  const a=alunos.find(x=>String(x.id)===String(alunoId)),c=contratos.find(x=>String(x.id)===String(contratoId));if(!a||!c){alert('Contrato não encontrado.');return;}
  const hoje=new Date().toISOString().split('T')[0],calc=calcularCancelamentoV32(c,{dataCancelamento:hoje});
  const html=`<div style="position:fixed;inset:0;background:rgba(0,0,0,.58);z-index:580;display:flex;align-items:center;justify-content:center;padding:16px" id="modal-cancelamento-v26"><div style="background:#fff;border-radius:12px;width:100%;max-width:900px;max-height:94vh;overflow-y:auto;box-shadow:var(--shadow-lg)"><div style="padding:20px 24px;border-bottom:1px solid var(--borda);display:flex;justify-content:space-between"><div><div style="font-family:'Bebas Neue',sans-serif;font-size:24px">Simular cancelamento</div><div style="font-size:12px;color:var(--texto-muted)"><strong>${esc(a.nome)}</strong> · ${esc(nomeContrato(c))} · ${fmtData(c.inicio)} → ${fmtData(c.venc)}</div></div><button onclick="document.getElementById('modal-cancelamento-v26').remove()" style="background:none;border:0;font-size:20px;cursor:pointer;color:#999">✕</button></div><div style="padding:12px 24px;background:#eff6ff;border-bottom:1px solid #bfdbfe;color:#1e40af;font-size:12px"><strong>Simulação:</strong> nada será salvo até a confirmação. Confirmar encerra o contrato e registra a apuração, mas não lança DRE nem caixa.</div><input type="hidden" id="cr-aluno-id" value="${esc(a.id)}"><input type="hidden" id="cr-contrato-id" value="${esc(c.id)}"><input type="hidden" id="cr-tipo" value="${calc.tipoAcerto}"><div class="form-grid" style="padding:20px 24px"><div class="form-group"><label class="form-label">Data do cancelamento</label><input class="form-input" type="date" id="cr-data" value="${hoje}" onchange="recalcularCancelamentoV32(true)"><div class="form-hint">O novo mês começa no aniversário mensal do contrato.</div></div><div class="form-group"><label class="form-label">Meses utilizados</label><input class="form-input" id="cr-meses" readonly value="${calc.mesesUsados}"></div><div class="form-group"><label class="form-label">Valor total do contrato</label><input class="form-input" type="number" step="0.01" id="cr-total" value="${calc.valorTotal.toFixed(2)}" oninput="recalcularCancelamentoV32(true)"></div><div class="form-group"><label class="form-label">Valor à vista de referência</label><input class="form-input" type="number" step="0.01" id="cr-vista" value="${calc.valorVista.toFixed(2)}" oninput="recalcularCancelamentoV32(true)"></div><div class="form-group"><label class="form-label">Valor mensal contratual</label><input class="form-input" id="cr-mensal" readonly value="${calc.valorMensal.toFixed(2)}"></div><div class="form-group"><label class="form-label">Valor utilizado</label><input class="form-input" id="cr-consumido" readonly value="${calc.valorConsumido.toFixed(2)}"></div><div class="form-group"><label class="form-label">Multa</label><div style="display:grid;grid-template-columns:90px 1fr;gap:8px"><input class="form-input" id="cr-pct" readonly value="${calc.percentualMulta}"><input class="form-input" id="cr-multa" readonly value="${calc.multaRetida.toFixed(2)}"></div></div><div class="form-group"><label class="form-label">Total efetivamente pago neste contrato</label><input class="form-input" id="cr-pago" readonly value="${calc.valorPagoConsiderado.toFixed(2)}"><div class="form-hint">Soma automática dos pagamentos do contrato. Não é editável aqui.</div></div><div class="form-group full"><label class="form-label">Extras / benefícios utilizados</label><div id="cr-extras-v32"></div><button class="btn btn-ghost btn-sm" type="button" onclick="addExtraCancelamentoV32()">+ Adicionar extra</button></div><div class="form-group"><label class="form-label">Custo contratual apurado</label><input class="form-input" id="cr-custo" readonly value="${calc.totalDevidoCancelamento.toFixed(2)}"></div><div class="form-group"><label class="form-label">Reembolso teórico</label><input class="form-input" id="cr-teorico" readonly value="${calc.reembolsoTeorico.toFixed(2)}"></div><div class="form-group"><label class="form-label">Saldo financeiro real</label><input class="form-input" id="cr-saldo" readonly value="${calc.saldoFinanceiro.toFixed(2)}"></div><div class="form-group full"><div id="cr-resultado" class="acerto-result-v31"></div></div><div class="form-group full" id="cr-parcelas-wrap"><div style="padding:12px;border:1px solid var(--borda);border-radius:8px;background:#f9fafb"><div style="font-size:12px;font-weight:700;margin-bottom:10px">O que ficou acordado</div><div style="display:grid;grid-template-columns:1fr 130px 170px;gap:10px"><div><label class="form-label">Valor acordado</label><input class="form-input" type="number" step="0.01" id="cr-acordado" value="${calc.valorAcertoSugerido.toFixed(2)}" oninput="atualizarParcelasCancelamentoV32()"></div><div><label class="form-label">Parcelas</label><input class="form-input" type="number" min="1" id="cr-qtd" value="${calc.tipoAcerto==='reembolso'?Math.max(1,calc.mesesRestantes):(calc.tipoAcerto==='receber'?1:0)}" oninput="atualizarParcelasCancelamentoV32()"></div><div><label class="form-label">Primeira data prevista</label><input class="form-input" type="date" id="cr-primeira" value="${hoje}" onchange="atualizarParcelasCancelamentoV32()"></div></div><div id="cr-cronograma"></div></div></div><div class="form-group full"><label class="form-label">Observações / decisão tomada</label><input class="form-input" id="cr-obs" placeholder="Ex.: acordo em 3x; aluno ciente..."></div></div><div style="padding:16px 24px 20px;border-top:1px solid var(--borda);display:flex;justify-content:space-between;gap:8px"><button class="btn btn-ghost" onclick="document.getElementById('modal-cancelamento-v26').remove()">Fechar simulação</button><button class="btn btn-danger" onclick="confirmarCancelamentoV32()">Confirmar cancelamento</button></div></div></div>`;
  document.getElementById('modal-cancelamento-v26')?.remove();document.body.insertAdjacentHTML('beforeend',html);recalcularCancelamentoV32(true);
}
function movsPosCancelV32(c){ return pagamentos.filter(p=>p.status!=='excluido'&&String(p.contratoId)===String(c.id)&&['multa_cancelamento','acordo_cancelamento','reembolso_cancelamento'].includes(naturezaMovAlunoV32(p))).sort((a,b)=>(dataLocal(a.data)?.getTime()||0)-(dataLocal(b.data)?.getTime()||0)); }
function abrirDetalheCancelamentoV32(alunoId,contratoId){
  const a=alunos.find(x=>String(x.id)===String(alunoId)),c=contratos.find(x=>String(x.id)===String(contratoId)),x=c?.cancelamento;if(!a||!c||!x){alert('Cancelamento não encontrado.');return;}
  const tipo=x.tipoAcerto||'sem_acerto',valor=Number(x.valorAcertoAcordado||x.valorReembolsado||x.valorAReceber||0),extras=(x.extrasItens||[]).map(e=>`<tr><td>${esc(e.descricao)}</td><td style="text-align:right">${fmtValor(e.valor)}</td></tr>`).join(''),movs=movsPosCancelV32(c).map(p=>{const v=valorCaixaAlunoV32(p);return `<tr><td>${fmtData(p.data)}</td><td>${badgeNaturezaV32(p)} ${esc(p.descricao||labelNaturezaV32(p))}</td><td style="text-align:right;font-weight:700;color:${v<0?'var(--vermelho)':'var(--verde)'}">${v<0?'-':''}${fmtValor(Math.abs(v))}</td></tr>`;}).join('');
  const html=`<div style="position:fixed;inset:0;background:rgba(0,0,0,.58);z-index:580;display:flex;align-items:center;justify-content:center;padding:16px" id="modal-cancelamento-v26"><div style="background:#fff;border-radius:12px;width:100%;max-width:860px;max-height:94vh;overflow-y:auto;box-shadow:var(--shadow-lg)"><div style="padding:20px 24px;border-bottom:1px solid var(--borda);display:flex;justify-content:space-between"><div><div style="font-family:'Bebas Neue',sans-serif;font-size:24px">Detalhes do cancelamento</div><div style="font-size:12px;color:var(--texto-muted)"><strong>${esc(a.nome)}</strong> · ${esc(nomeContrato(c))}</div></div><button onclick="document.getElementById('modal-cancelamento-v26').remove()" style="background:none;border:0;font-size:20px;cursor:pointer;color:#999">✕</button></div><div style="padding:12px 24px;background:#fef2f2;border-bottom:1px solid #fecaca;color:#991b1b;font-size:12px"><strong>Contrato cancelado em ${fmtData(x.dataCancelamento)}.</strong> Esta é a fotografia salva no momento da confirmação. Movimentações posteriores ficam separadas.</div><div style="padding:20px 24px"><div class="section-box" style="box-shadow:none;margin-bottom:16px"><div class="section-header"><div class="section-title">Apuração registrada</div></div><table><tbody><tr><td>Valor total</td><td style="text-align:right">${fmtValor(x.valorTotal||0)}</td></tr><tr><td>Valor à vista</td><td style="text-align:right">${fmtValor(x.valorVista||0)}</td></tr><tr><td>Valor mensal</td><td style="text-align:right">${fmtValor(x.valorMensal||0)}</td></tr><tr><td>Meses utilizados</td><td style="text-align:right">${Number(x.mesesUsados||0)} de ${Number(x.mesesPlano||0)}</td></tr><tr><td>Valor utilizado</td><td style="text-align:right">${fmtValor(x.valorConsumido||0)}</td></tr><tr><td>Multa (${Number(x.percentualMulta||0)}%)</td><td style="text-align:right">${fmtValor(x.multaRetida||0)}</td></tr><tr><td>Extras</td><td style="text-align:right">${fmtValor(x.extrasDescontados||0)}</td></tr><tr><td><strong>Custo contratual</strong></td><td style="text-align:right"><strong>${fmtValor(x.totalDevidoCancelamento||0)}</strong></td></tr><tr><td>Reembolso teórico</td><td style="text-align:right">${fmtValor(x.reembolsoTeorico||0)}</td></tr><tr><td>Valor pago considerado</td><td style="text-align:right">${fmtValor(x.valorPagoConsiderado||0)}</td></tr><tr><td>Saldo financeiro real</td><td style="text-align:right">${x.saldoFinanceiro<0?'-':''}${fmtValor(Math.abs(Number(x.saldoFinanceiro||0)))}</td></tr></tbody></table></div>${extras?`<div class="section-box" style="box-shadow:none;margin-bottom:16px"><div class="section-header"><div class="section-title">Extras utilizados</div></div><table><tbody>${extras}</tbody></table></div>`:''}<div class="acerto-result-v31 ${tipo}" style="margin-bottom:16px"><div style="font-size:11px;text-transform:uppercase;letter-spacing:1px">Resultado acordado</div><div style="display:flex;justify-content:space-between;gap:12px;margin-top:5px"><strong>${esc(labelTipoAcertoV31(tipo))}</strong><strong style="font-size:20px">${fmtValor(valor)}</strong></div><div style="font-size:12px;margin-top:5px">${Number(x.qtdParcelas||0)>1?`${Number(x.qtdParcelas)} parcelas`:'Pagamento único / sem parcelamento'}.</div></div><div class="section-box" style="box-shadow:none;margin-bottom:16px"><div class="section-header"><div><div class="section-title">Movimentações posteriores</div><div style="font-size:12px;color:var(--texto-muted)">Só estas movimentações efetivamente registradas afetam DRE/caixa.</div></div></div><div class="table-wrap"><table><thead><tr><th>Data</th><th>Natureza</th><th style="text-align:right">Caixa</th></tr></thead><tbody>${movs||'<tr><td colspan="3"><div class="empty">Nenhuma movimentação financeira registrada após o cancelamento.</div></td></tr>'}</tbody></table></div></div><div style="font-size:12px;color:var(--texto-muted)"><strong>Observação:</strong> ${esc(x.observacao||'—')}</div></div><div style="padding:16px 24px 20px;border-top:1px solid var(--borda);display:flex;justify-content:flex-end;gap:8px"><button class="btn btn-ghost" onclick="gerarComprovanteCancelamentoV32('${esc(alunoId)}','${esc(contratoId)}')">📄 Comprovante</button><button class="btn btn-primary" onclick="document.getElementById('modal-cancelamento-v26').remove()">Fechar</button></div></div></div>`;
  document.getElementById('modal-cancelamento-v26')?.remove();document.body.insertAdjacentHTML('beforeend',html);
}
window.abrirModalCancelamentoV26=function(alunoId,contratoId=''){
  const a=alunos.find(x=>String(x.id)===String(alunoId)),lista=contratosDoAluno(alunoId),c=contratos.find(x=>String(x.id)===String(contratoId))||a?.contratoAtual||lista[lista.length-1];
  if(!c){alert('Contrato não encontrado.');return;} if(c.status==='cancelado'||c.cancelamento)abrirDetalheCancelamentoV32(alunoId,c.id);else abrirSimulacaoCancelamentoV32(alunoId,c.id);
};
window.confirmarCancelamentoV32=async function(){
  const alunoId=document.getElementById('cr-aluno-id')?.value,contratoId=document.getElementById('cr-contrato-id')?.value,a=alunos.find(x=>String(x.id)===String(alunoId)),c=contratos.find(x=>String(x.id)===String(contratoId));if(!a||!c)return;
  const data=document.getElementById('cr-data')?.value,extrasItens=extrasModalV32(),calc=calcularCancelamentoV32(c,{dataCancelamento:data,valorTotal:Number(document.getElementById('cr-total')?.value||0),valorVista:Number(document.getElementById('cr-vista')?.value||0),extrasTotal:extrasItens.reduce((s,x)=>s+x.valor,0)}),valorAcordado=Math.max(0,Number(document.getElementById('cr-acordado')?.value||0)),qtd=calc.tipoAcerto==='sem_acerto'?0:Math.max(1,Number(document.getElementById('cr-qtd')?.value||1)),primeira=document.getElementById('cr-primeira')?.value||data,parcelas=gerarParcelasAcertoV31(valorAcordado,qtd,primeira);
  if(!confirm(`Confirmar o cancelamento de ${a.nome} em ${fmtData(data)}?\n\n${labelTipoAcertoV31(calc.tipoAcerto)}: ${fmtValor(valorAcordado)}.\n\nNenhum lançamento será criado automaticamente na DRE ou no caixa.`))return;
  const snapshot=pagamentosDoContrato(c.id).map(p=>({id:p.id,data:p.data,valor:Number(p.valor||0),forma:p.forma||'',descricao:p.descricao||''}));
  const cancelamento={status:'confirmado',...calc,extrasItens,valorAcertoAcordado:arredV32(valorAcordado),valorReembolsado:calc.tipoAcerto==='reembolso'?arredV32(valorAcordado):0,valorAReceber:calc.tipoAcerto==='receber'?arredV32(valorAcordado):0,qtdParcelas:qtd,dataPrimeiraParcela:primeira,parcelasAcerto:parcelas,pagamentosSnapshot:snapshot,observacao:document.getElementById('cr-obs')?.value.trim()||'',semLancamentoFinanceiroAutomatico:true,criadoEm:new Date().toISOString(),ts:Date.now()};
  const atualizado={...c,status:'cancelado',cancelamento,vencOriginal:c.vencOriginal||c.venc,atualizadoEm:new Date().toISOString()};await salvarContratoDb(atualizado);await setDoc(doc(db,'cancelamentos_reembolsos',String(contratoId)),{id:String(contratoId),contratoId:String(contratoId),alunoId:String(alunoId),alunoNome:a.nome,...cancelamento});
  const hist={id:`hist_cancel_${contratoId}_${Date.now()}`,alunoId:String(alunoId),alunoNome:a.nome,contratoId:String(contratoId),tipo:'cancelamento_contrato',data,valor:cancelamento.valorAcertoAcordado,tipoAcerto:cancelamento.tipoAcerto,descricao:'Cancelamento de contrato',status:'ativo',ts:Date.now()};await setDoc(doc(db,'historico',hist.id),hist);await registrarAuditoria('cancelamento_contrato',alunoId,a.nome,{}, {contratoId,cancelamento});
  document.getElementById('modal-cancelamento-v26')?.remove();hidratarAlunosComContratos();toast('Contrato cancelado e apuração registrada ✓');abrirPerfilAluno(alunoId);
};
window.confirmarCancelamentoReembolsoV26=window.confirmarCancelamentoV32;
window.gerarComprovanteCancelamentoV32=function(alunoId,contratoId){
  const a=alunos.find(x=>String(x.id)===String(alunoId)),c=contratos.find(x=>String(x.id)===String(contratoId)),x=c?.cancelamento;if(!a||!c||!x)return;
  const tipo=x.tipoAcerto||'sem_acerto',valor=Number(x.valorAcertoAcordado||0),extras=(x.extrasItens||[]).map(e=>`<tr><td>${esc(e.descricao)}</td><td style="text-align:right">${fmtValor(e.valor)}</td></tr>`).join(''),parcelas=(x.parcelasAcerto||[]).map(p=>`<tr><td>${p.numero}</td><td>${fmtData(p.data)}</td><td style="text-align:right">${fmtValor(p.valor)}</td></tr>`).join('');
  const html=`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Cancelamento — ${esc(a.nome)}</title><style>body{font-family:Arial,sans-serif;max-width:760px;margin:auto;padding:32px;color:#111}h1{border-bottom:3px solid #111;padding-bottom:12px}h2{font-size:15px;background:#111;color:#fff;padding:8px;margin:22px 0 0}table{width:100%;border-collapse:collapse;border:1px solid #eee}td,th{padding:8px;border-bottom:1px solid #eee}.resultado{margin-top:20px;border:2px solid #D32F2F;border-radius:8px;padding:15px}.no-print{margin-bottom:18px;padding:10px 20px}@media print{.no-print{display:none}}</style></head><body><button class="no-print" onclick="window.print()">Imprimir / Salvar PDF</button><h1>Studio FB — Registro de Cancelamento</h1><p><strong>Aluno:</strong> ${esc(a.nome)}<br><strong>Contrato:</strong> ${esc(nomeContrato(c))}<br><strong>Início:</strong> ${fmtData(c.inicio)} · <strong>Cancelamento:</strong> ${fmtData(x.dataCancelamento)}</p><h2>Apuração</h2><table><tbody><tr><td>Valor total</td><td style="text-align:right">${fmtValor(x.valorTotal)}</td></tr><tr><td>Valor à vista</td><td style="text-align:right">${fmtValor(x.valorVista)}</td></tr><tr><td>Valor pago considerado</td><td style="text-align:right">${fmtValor(x.valorPagoConsiderado)}</td></tr><tr><td>Meses utilizados</td><td style="text-align:right">${x.mesesUsados}/${x.mesesPlano}</td></tr><tr><td>Valor utilizado</td><td style="text-align:right">${fmtValor(x.valorConsumido)}</td></tr><tr><td>Multa (${x.percentualMulta}%)</td><td style="text-align:right">${fmtValor(x.multaRetida)}</td></tr><tr><td>Extras</td><td style="text-align:right">${fmtValor(x.extrasDescontados)}</td></tr><tr><td><strong>Custo contratual</strong></td><td style="text-align:right"><strong>${fmtValor(x.totalDevidoCancelamento)}</strong></td></tr><tr><td>Reembolso teórico</td><td style="text-align:right">${fmtValor(x.reembolsoTeorico)}</td></tr><tr><td>Saldo financeiro real</td><td style="text-align:right">${x.saldoFinanceiro<0?'-':''}${fmtValor(Math.abs(Number(x.saldoFinanceiro||0)))}</td></tr></tbody></table>${extras?`<h2>Extras utilizados</h2><table>${extras}</table>`:''}<div class="resultado"><strong>${esc(labelTipoAcertoV31(tipo))}</strong><div style="font-size:26px;margin-top:5px">${fmtValor(valor)}</div><div style="font-size:12px;color:#555;margin-top:6px">Este documento registra a apuração e o acordo. Não representa, por si só, lançamento na DRE ou no caixa.</div></div>${parcelas?`<h2>Programação acordada</h2><table><thead><tr><th>Parcela</th><th>Data prevista</th><th style="text-align:right">Valor</th></tr></thead><tbody>${parcelas}</tbody></table>`:''}<p><strong>Observação:</strong> ${esc(x.observacao||'—')}</p></body></html>`;
  const w=window.open('','_blank');if(!w){alert('Libere pop-ups para gerar o comprovante.');return;}w.document.write(html);w.document.close();
};
window.gerarComprovanteCancelamentoV31=window.gerarComprovanteCancelamentoV32;

// Perfil: tornar a natureza das movimentações visível e renomear cancelamento.
function ajustarPerfilV32(id){
  const box=[...document.querySelectorAll('#content .section-box')].find(el=>(el.querySelector('.section-title')?.textContent||'').includes('Pagamentos e Aulas Extras'));
  if(box){
    const tbody=box.querySelector('tbody');
    if(tbody)tbody.innerHTML=pagamentosDoAluno(id).map(p=>{const v=valorCaixaAlunoV32(p),c=contratos.find(x=>String(x.id)===String(p.contratoId));return `<tr><td>${fmtData(p.data)}</td><td><strong>${esc(p.descricao||labelNaturezaV32(p))}</strong>${badgeNaturezaV32(p)}<div style="font-size:11px;color:var(--texto-muted)">${esc(nomeContrato(c||{}))} · ${p.forma||'—'}${detalheCartaoTexto(p)} · caixa ${v<0?'saída':'entrada'}</div></td><td style="font-weight:700;color:${v<0?'var(--vermelho)':'var(--verde)'}">${v<0?'-':''}${fmtValor(Math.abs(v))}</td><td style="white-space:nowrap"><button class="btn btn-ghost btn-sm" onclick="editarPagamento('${id}','${p.id}')">✏️</button><button class="btn btn-danger btn-sm" onclick="excluirPagamento('${id}','${p.id}')">🗑</button></td></tr>`;}).join('')||'<tr><td colspan="4"><div class="empty">Nenhuma movimentação registrada.</div></td></tr>';
    const sh=box.querySelector('.section-header div > div[style*="font-size:12px"]');if(sh)sh.textContent='A natureza escolhida define automaticamente o destino em DRE e/ou caixa.';
  }
  document.querySelectorAll('.btn-cancelamento-v26,[data-cancelamento-v29]').forEach(btn=>{
    const oc=btn.getAttribute('onclick')||'',m=oc.match(/abrirModalCancelamentoV26\('([^']+)','([^']+)'\)/);if(!m)return;const c=contratos.find(x=>String(x.id)===String(m[2]));if(c)btn.textContent=(c.status==='cancelado'||c.cancelamento)?'📄 Detalhar cancelamento':'⛔ Cancelar contrato';
  });
  document.querySelectorAll('.resumo-cancelamento-v26').forEach(el=>{
    const alvo=[...el.querySelectorAll('div')].find(x=>(x.textContent||'').includes('Receita extra de cancelamento'));if(alvo)alvo.innerHTML='<strong>Registro documental:</strong> este cancelamento não criou lançamento automático na DRE nem no caixa.';
  });
}
const abrirPerfilBaseV32=abrirPerfilAluno;
abrirPerfilAluno=async function(id){await abrirPerfilBaseV32(id);setTimeout(()=>ajustarPerfilV32(String(id)),0);};
window.abrirPerfilAluno=abrirPerfilAluno;

// ──────────────────────────────────────────────────
// FINANCEIRO AUDITADO
// ──────────────────────────────────────────────────
renderFinanceiroView = async function(){
  loading(true);await carregarMovCaixa();
  const cats=await loadDespesas(finMes,finAno),despComp=totalDesp(cats),despCx=totalDespesaCaixaV32(finMes,finAno),recComp=receitaMesEsp(finMes,finAno),recCx=receitaCaixaMes(finMes,finAno),rec=financeiroModo==='competencia'?recComp:recCx,desp=financeiroModo==='competencia'?despComp:despCx,res=rec-desp;
  let linhasReceita='';
  if(financeiroModo==='competencia'){
    contratos.filter(c=>contratoContaCompetenciaMes(c,finMes,finAno)).forEach(c=>{const v=valorCompetenciaContratoMesV28(c,finMes,finAno);linhasReceita+=`<tr><td>${esc(c.alunoNome||'—')}</td><td>${esc(nomeContrato(c))}<div style="font-size:11px;color:var(--texto-muted)">${competenciaResumoContratoMesV18(c,finMes,finAno)}</div></td><td style="text-align:right;color:var(--verde);font-weight:700">${fmtValor(v)}</td></tr>`;});
    aulasExtrasMes(finMes,finAno).forEach(p=>linhasReceita+=`<tr><td>${esc(p.alunoNome||'—')}</td><td>Aula extra<div style="font-size:11px;color:var(--texto-muted)">${fmtData(p.data)}</div></td><td style="text-align:right;color:var(--verde);font-weight:700">${fmtValor(p.valor)}</td></tr>`);
    multasMesV32(finMes,finAno).forEach(p=>linhasReceita+=`<tr><td>${esc(p.alunoNome||'—')}</td><td>Multa rescisória<div style="font-size:11px;color:var(--texto-muted)">${fmtData(p.data)} · registrada manualmente</div></td><td style="text-align:right;color:var(--verde);font-weight:700">${fmtValor(p.valor)}</td></tr>`);
  }else{
    movimentosAlunoCaixaMesV32(finMes,finAno).forEach(p=>{const v=valorCaixaAlunoV32(p);linhasReceita+=`<tr><td>${fmtData(p.data)}</td><td><strong>${esc(p.alunoNome||'—')}</strong>${badgeNaturezaV32(p)}<div style="font-size:11px;color:var(--texto-muted)">${esc(p.descricao||labelNaturezaV32(p))} · ${p.forma||'—'}${detalheCartaoTexto(p)}</div></td><td style="text-align:right;font-weight:700;color:${v<0?'var(--vermelho)':'var(--verde)'}">${v<0?'-':''}${fmtValor(Math.abs(v))}</td></tr>`;});
  }
  let linhasDesp='';
  if(financeiroModo==='competencia')Object.entries(cats||{}).forEach(([cat,lista])=>(lista||[]).filter(d=>Number(d.valor)>0).forEach(d=>linhasDesp+=`<tr><td>${esc(d.desc)}<div style="font-size:11px;color:var(--texto-muted)">${esc(catLabelV32(cat))}</div></td><td style="text-align:right;font-weight:700">${fmtValor(d.valor)}</td></tr>`));
  else movDespesasMesV32(finMes,finAno).forEach(m=>linhasDesp+=`<tr><td>${fmtData(m.data)}</td><td>${esc(m.descricao||'Despesa')}<div style="font-size:11px;color:var(--texto-muted)">Competência ${esc(m.competencia||'—')}${m.conta?` · ${esc(m.conta)}`:''}</div></td><td style="text-align:right;font-weight:700;color:var(--vermelho)">-${fmtValor(m.valor)}</td></tr>`);
  const anual=[];for(let m=0;m<12;m++){const r=financeiroModo==='competencia'?receitaMesEsp(m,finAno):receitaCaixaMes(m,finAno),d=financeiroModo==='competencia'?totalDesp(await loadDespesas(m,finAno)):totalDespesaCaixaV32(m,finAno);anual.push({m,r,d,res:r-d});}
  const ar=anual.reduce((s,x)=>s+x.r,0),ad=anual.reduce((s,x)=>s+x.d,0),ares=ar-ad;
  document.getElementById('content').innerHTML=`<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:12px"><div class="mes-selector"><button class="mes-btn" onclick="navegarFin(-1)">◀</button><div class="mes-label">${MESES_NOMES[finMes]} ${finAno}</div><button class="mes-btn" onclick="navegarFin(1)">▶</button></div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn ${financeiroModo==='competencia'?'btn-primary':'btn-ghost'} btn-sm" onclick="setModoFinanceiro('competencia')">Competência</button><button class="btn ${financeiroModo==='caixa'?'btn-primary':'btn-ghost'} btn-sm" onclick="setModoFinanceiro('caixa')">Caixa</button><button class="btn btn-ghost btn-sm" onclick="setView('despesas')">✏️ Despesas / baixas</button><button class="btn btn-primary btn-sm" onclick="imprimirDRE()">🖨️ Imprimir</button></div></div><div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:12px 16px;font-size:13px;margin-bottom:20px"><strong>${financeiroModo==='competencia'?'Competência':'Caixa realizado'}.</strong> ${financeiroModo==='competencia'?'A receita de contrato segue os ciclos contratuais, mesmo se o pagamento ocorrer em outro mês.':'Somente dinheiro efetivamente recebido ou pago entra nesta visão.'} Comp.: <strong>${fmtValor(recComp)}</strong> · Caixa alunos líquido: <strong>${recCx<0?'-':''}${fmtValor(Math.abs(recCx))}</strong>.</div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px"><div class="card" style="border-top:3px solid var(--verde)"><div class="card-label">${financeiroModo==='competencia'?'Receita DRE':'Caixa líquido — alunos'}</div><div class="card-value" style="font-size:24px;color:${rec>=0?'var(--verde)':'var(--vermelho)'}">${rec<0?'-':''}${fmtValor(Math.abs(rec))}</div><div class="card-sub">${financeiroModo==='caixa'?`Entradas ${fmtValor(entradasAlunoV32(finMes,finAno))} · reembolsos ${fmtValor(reembolsosAlunoV32(finMes,finAno))}`:'ciclos + aulas extras + multas registradas'}</div></div><div class="card" style="border-top:3px solid var(--vermelho)"><div class="card-label">${financeiroModo==='competencia'?'Despesas DRE':'Despesas pagas no caixa'}</div><div class="card-value" style="font-size:24px;color:var(--vermelho)">${fmtValor(desp)}</div><div class="card-sub">${financeiroModo==='caixa'?`Competência do mês: ${fmtValor(despComp)}`:'competência do mês'}</div></div><div class="card" style="border-top:3px solid ${res>=0?'var(--verde)':'var(--vermelho)'}"><div class="card-label">Resultado</div><div class="card-value" style="font-size:24px;color:${res>=0?'var(--verde)':'var(--vermelho)'}">${res<0?'-':''}${fmtValor(Math.abs(res))}</div><div class="card-sub">${financeiroModo==='competencia'?'resultado por competência':'caixa líquido realizado'}</div></div></div><div class="section-box" style="margin-bottom:24px"><div class="section-header"><div class="section-title">${financeiroModo==='competencia'?'Receitas reconhecidas':'Movimentações de alunos — Caixa'}</div></div><div class="table-wrap"><table><thead><tr>${financeiroModo==='competencia'?'<th>Aluno</th><th>Natureza / competência</th><th style="text-align:right">Valor</th>':'<th>Data</th><th>Aluno / natureza</th><th style="text-align:right">Entrada / saída</th>'}</tr></thead><tbody>${linhasReceita||'<tr><td colspan="3"><div class="empty">Nenhum registro.</div></td></tr>'}</tbody></table></div></div><div class="section-box" style="margin-bottom:24px"><div class="section-header"><div class="section-title">${financeiroModo==='competencia'?'Despesas por competência':'Despesas efetivamente pagas'}</div></div><div class="table-wrap"><table><thead><tr>${financeiroModo==='competencia'?'<th>Despesa</th><th style="text-align:right">Valor</th>':'<th>Data</th><th>Despesa</th><th style="text-align:right">Saída</th>'}</tr></thead><tbody>${linhasDesp||`<tr><td colspan="${financeiroModo==='competencia'?2:3}"><div class="empty">Nenhum registro.</div></td></tr>`}</tbody></table></div></div><div class="section-box"><div class="section-header"><div><div class="section-title">${financeiroModo==='competencia'?'Projeção anual — Competência':'Caixa realizado anual'} — ${finAno}</div><div style="font-size:12px;color:var(--texto-muted)">${financeiroModo==='caixa'?'Não projeta pagamentos futuros: mostra apenas o que já foi registrado.':'Competências contratuais do ano.'}</div></div><div style="font-size:12px;color:var(--texto-muted)">Rec: <strong style="color:var(--verde)">${fmtValor(ar)}</strong> · Desp: <strong style="color:var(--vermelho)">${fmtValor(ad)}</strong> · Res: <strong style="color:${ares>=0?'var(--verde)':'var(--vermelho)'}">${ares<0?'-':''}${fmtValor(Math.abs(ares))}</strong></div></div><div class="table-wrap"><table><thead><tr><th>Mês</th><th>Receita / entradas</th><th>Despesas</th><th>Resultado</th></tr></thead><tbody>${anual.map(x=>`<tr><td><strong>${MESES_ABREV[x.m]}</strong></td><td style="color:${x.r>=0?'var(--verde)':'var(--vermelho)'}">${x.r<0?'-':''}${fmtValor(Math.abs(x.r))}</td><td style="color:var(--vermelho)">${fmtValor(x.d)}</td><td style="font-weight:700;color:${x.res>=0?'var(--verde)':'var(--vermelho)'}">${x.res<0?'-':''}${fmtValor(Math.abs(x.res))}</td></tr>`).join('')}</tbody></table></div></div>`;
};
window.renderFinanceiroView=renderFinanceiroView;

// Dashboard: em Caixa, substituir despesas por baixas reais.
const renderDashboardBaseV32=renderDashboard;
renderDashboard=async function(){
  await renderDashboardBaseV32();if(financeiroModo!=='caixa')return;await carregarMovCaixa();
  const rec=receitaCaixaMes(MES_ATUAL,ANO_ATUAL),desp=totalDespesaCaixaV32(MES_ATUAL,ANO_ATUAL),res=rec-desp,cards=[...document.querySelectorAll('#content .card')];
  const cDesp=cards.find(c=>(c.querySelector('.card-label')?.textContent||'').includes('Total Despesas')),cRes=cards.find(c=>(c.querySelector('.card-label')?.textContent||'').includes('Resultado do Mês'));
  if(cDesp){cDesp.querySelector('.card-label').textContent='Despesas pagas no caixa ↗';cDesp.querySelector('.card-value').textContent=fmtValor(desp);const s=cDesp.querySelector('.card-sub');if(s)s.textContent='somente baixas efetivamente pagas';}
  if(cRes){const v=cRes.querySelector('.card-value');if(v){v.textContent=(res<0?'-':'')+fmtValor(Math.abs(res));v.style.color=res>=0?'var(--verde)':'var(--vermelho)';}const s=cRes.querySelector('.card-sub');if(s)s.textContent='caixa líquido realizado';}
};
window.renderDashboard=renderDashboard;

// Caixa: corrigir subtítulo da despesa no card de resultado de caixa.
const renderCaixaBaseV32=renderCaixaView;
renderCaixaView=async function(){
  await renderCaixaBaseV32();if(caixaVisao!=='mensal')return;const resumo=await resumoCaixaMes(cxMes,cxAno),card=[...document.querySelectorAll('#content .card')].find(c=>(c.querySelector('.card-label')?.textContent||'').includes('Resultado de caixa'));
  if(card){const sub=card.querySelector('.card-sub');if(sub)sub.textContent=`Recebimentos líquidos ${fmtValor(resumo.recCx)} − despesas pagas ${fmtValor(resumo.despCaixa||0)}`;}
};
window.renderCaixaView=renderCaixaView;

// Impressão respeita a visão selecionada.
imprimirDRE=async function(){
  await carregarMovCaixa();const cats=await loadDespesas(finMes,finAno),modo=financeiroModo,rec=modo==='competencia'?receitaMesEsp(finMes,finAno):receitaCaixaMes(finMes,finAno),desp=modo==='competencia'?totalDesp(cats):totalDespesaCaixaV32(finMes,finAno),res=rec-desp;
  let lr='',ld='';
  if(modo==='competencia'){
    contratos.filter(c=>contratoContaCompetenciaMes(c,finMes,finAno)).forEach(c=>lr+=`<tr><td>${esc(c.alunoNome||'—')}<div class="sub">${esc(nomeContrato(c))} · ${competenciaResumoContratoMesV18(c,finMes,finAno)}</div></td><td class="num">${fmtValor(valorCompetenciaContratoMesV28(c,finMes,finAno))}</td></tr>`);
    aulasExtrasMes(finMes,finAno).forEach(p=>lr+=`<tr><td>${esc(p.alunoNome||'—')} — Aula extra<div class="sub">${fmtData(p.data)}</div></td><td class="num">${fmtValor(p.valor)}</td></tr>`);multasMesV32(finMes,finAno).forEach(p=>lr+=`<tr><td>${esc(p.alunoNome||'—')} — Multa rescisória<div class="sub">${fmtData(p.data)}</div></td><td class="num">${fmtValor(p.valor)}</td></tr>`);
    Object.entries(cats||{}).forEach(([cat,lista])=>(lista||[]).filter(d=>Number(d.valor)>0).forEach(d=>ld+=`<tr><td>${esc(d.desc)}<div class="sub">${esc(catLabelV32(cat))}</div></td><td class="num">${fmtValor(d.valor)}</td></tr>`));
  }else{
    movimentosAlunoCaixaMesV32(finMes,finAno).forEach(p=>{const v=valorCaixaAlunoV32(p);lr+=`<tr><td>${esc(p.alunoNome||'—')} — ${esc(labelNaturezaV32(p))}<div class="sub">${fmtData(p.data)} · ${esc(p.descricao||'')}</div></td><td class="num" style="color:${v<0?'#D32F2F':'#2e7d32'}">${v<0?'-':''}${fmtValor(Math.abs(v))}</td></tr>`;});
    movDespesasMesV32(finMes,finAno).forEach(m=>ld+=`<tr><td>${esc(m.descricao||'Despesa')}<div class="sub">${fmtData(m.data)} · competência ${esc(m.competencia||'—')}</div></td><td class="num">${fmtValor(m.valor)}</td></tr>`);
  }
  const titulo=modo==='competencia'?'DRE — Regime de Competência':'Resumo de Caixa Realizado',html=`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${titulo}</title><style>body{font-family:Arial,sans-serif;max-width:780px;margin:auto;padding:30px;color:#111}h1{border-bottom:3px solid #111;padding-bottom:12px}h2{font-size:15px;background:#111;color:#fff;padding:8px;margin:22px 0 0}table{width:100%;border-collapse:collapse;border:1px solid #eee}td,th{padding:8px;border-bottom:1px solid #eee}.num{text-align:right;font-weight:700}.sub{font-size:11px;color:#777;margin-top:2px}.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:18px 0}.card{border:1px solid #ddd;border-radius:7px;padding:12px}.no-print{padding:10px 20px}@media print{.no-print{display:none}}</style></head><body><button class="no-print" onclick="window.print()">Imprimir / Salvar PDF</button><h1>Studio FB — ${titulo}</h1><div>${MESES_NOMES[finMes]} de ${finAno}</div><div class="cards"><div class="card"><small>${modo==='competencia'?'Receita':'Alunos líquido'}</small><div style="font-size:21px;color:#2e7d32">${rec<0?'-':''}${fmtValor(Math.abs(rec))}</div></div><div class="card"><small>${modo==='competencia'?'Despesas':'Despesas pagas'}</small><div style="font-size:21px;color:#D32F2F">${fmtValor(desp)}</div></div><div class="card"><small>Resultado</small><div style="font-size:21px;color:${res>=0?'#2e7d32':'#D32F2F'}">${res<0?'-':''}${fmtValor(Math.abs(res))}</div></div></div><h2>${modo==='competencia'?'Receitas reconhecidas':'Movimentações de alunos'}</h2><table><tbody>${lr||'<tr><td>Nenhum registro.</td><td class="num">R$ 0,00</td></tr>'}</tbody></table><h2>${modo==='competencia'?'Despesas por competência':'Despesas efetivamente pagas'}</h2><table><tbody>${ld||'<tr><td>Nenhum registro.</td><td class="num">R$ 0,00</td></tr>'}</tbody></table><p style="font-size:11px;color:#666;margin-top:18px">${modo==='competencia'?'Pagamentos atrasados ou antecipados não deslocam a competência do contrato.':'A visão de caixa usa somente datas reais de recebimento, reembolso e pagamento de despesas.'}</p></body></html>`;
  const w=window.open('','_blank');if(!w){alert('Libere pop-ups para imprimir.');return;}w.document.write(html);w.document.close();
};
window.imprimirDRE=imprimirDRE;

// V32.1 — preserva o controle de Notas Fiscais na visão por competência.
const renderFinanceiroCoreV321 = renderFinanceiroView;
renderFinanceiroView = async function(){
  await carregarNotasFiscaisV24();
  await renderFinanceiroCoreV321();
  if(financeiroModo==='competencia'){
    const box=[...document.querySelectorAll('#content .section-box')].find(el=>(el.querySelector('.section-title')?.textContent||'').includes('Receitas reconhecidas'));
    if(box){
      box.querySelector('.section-title').textContent='Receita — Competência';
      aplicarNotaFiscalFinanceiroV24();
      const multas=multasMesV32(finMes,finAno);
      if(multas.length){
        const receitaBox=[...document.querySelectorAll('#content .section-box')].find(el=>{const t=el.querySelector('.section-title')?.textContent||'';return t.includes('Receita')&&t.includes('Competência');});
        receitaBox?.insertAdjacentHTML('afterend',`<div class="section-box" style="margin-bottom:24px;border-left:3px solid var(--verde)"><div class="section-header"><div><div class="section-title">Receitas extraordinárias registradas</div><div style="font-size:12px;color:var(--texto-muted)">Multas entram na DRE somente quando Fernando registra o recebimento.</div></div></div><div class="table-wrap"><table><thead><tr><th>Data</th><th>Aluno / natureza</th><th style="text-align:right">Valor</th></tr></thead><tbody>${multas.map(p=>`<tr><td>${fmtData(p.data)}</td><td><strong>${esc(p.alunoNome||'—')}</strong>${badgeNaturezaV32(p)}<div style="font-size:11px;color:var(--texto-muted)">${esc(p.descricao||'Multa rescisória')}</div></td><td style="text-align:right;font-weight:700;color:var(--verde)">${fmtValor(p.valor)}</td></tr>`).join('')}</tbody></table></div></div>`);
      }
    }
  }
};
window.renderFinanceiroView=renderFinanceiroView;

// V32.2 — renomeia corretamente os botões criados dinamicamente pela camada V29.
const abrirPerfilBaseV322=abrirPerfilAluno;
abrirPerfilAluno=async function(id){
  await abrirPerfilBaseV322(id);
  setTimeout(()=>{
    document.querySelectorAll('[data-cancelamento-v29]').forEach(btn=>{
      const c=contratos.find(x=>String(x.id)===String(btn.dataset.cancelamentoV29));
      if(c)btn.textContent=(c.status==='cancelado'||c.cancelamento)?'📄 Detalhar cancelamento':'⛔ Cancelar contrato';
    });
  },0);
};
window.abrirPerfilAluno=abrirPerfilAluno;

// ═══════════════════════════════════════════════════
// V33 — VALORES CONTRATUAIS SEPARADOS
// Cada contrato passa a guardar:
// - valorTotal: base da competência mensal e da multa;
// - valorVistaReferencia: base máxima contratual do reembolso.
// O cancelamento apenas lê estes valores do contrato.
// ═══════════════════════════════════════════════════

const VERSAO_CONTRATO_V33 = '33.0';

function temValorVistaPersistidoV33(c){
  return Number(c?.valorVistaReferencia ?? c?.valorVista ?? 0) > 0;
}

function sugestaoValorVistaV33(plano, frequencia, valorTotal){
  const total = Number(valorTotal || 0);
  if(plano === 'mensal') return total;
  const f = Math.max(1, Math.min(5, Number(frequencia || 3)));
  return Number(VALORES_AVISTA_REEMBOLSO_V26?.[f]?.[plano] || total || 0);
}

function valorVistaContratoV33(c){
  const salvo = Number(c?.valorVistaReferencia ?? c?.valorVista ?? 0);
  if(salvo > 0) return salvo;
  const aluno = alunos.find(a=>String(a.id)===String(c?.alunoId));
  return sugestaoValorVistaV33(c?.plano, aluno?.frequencia || c?.frequencia || 3, valorContrato(c));
}

// Sobrescreve a referência usada em toda a apuração de cancelamento.
valorVistaReferenciaV26 = function(c){
  return valorVistaContratoV33(c);
};

// Garante que qualquer contrato salvo pelo sistema persista o valor à vista.
// O valor vem do formulário de contrato ou do cadastro inicial do aluno.
const salvarContratoDbBaseV33 = salvarContratoDb;
salvarContratoDb = async function(c){
  if(!c) return;
  const campoContrato = document.getElementById('ct-valor-vista');
  const campoInicial  = document.getElementById('f-valor-vista');
  let vistaInformada = Number(c.valorVistaReferencia ?? c.valorVista ?? 0);

  if(campoContrato && Number(campoContrato.value) > 0){
    vistaInformada = Number(campoContrato.value);
  } else if(campoInicial && Number(campoInicial.value) > 0){
    vistaInformada = Number(campoInicial.value);
  } else if(c.plano === 'mensal'){
    vistaInformada = valorContrato(c);
  }

  if(vistaInformada > 0){
    c.valorVistaReferencia = arredV32(vistaInformada);
  }

  return salvarContratoDbBaseV33(c);
};

// ──────────────────────────────────────────────────
// CADASTRO INICIAL DO ALUNO
// Acrescenta "Valor à vista de referência" sem alterar o restante do modal.
// ──────────────────────────────────────────────────
function garantirValorVistaNovoAlunoV33(idAluno=null){
  const valorEl = document.getElementById('f-valor');
  if(!valorEl) return;

  let group = document.getElementById('f-valor-vista-group-v33');
  if(!group){
    group = document.createElement('div');
    group.className = 'form-group';
    group.id = 'f-valor-vista-group-v33';
    group.innerHTML = `
      <label class="form-label">Valor à vista de referência (R$)</label>
      <input class="form-input" id="f-valor-vista" type="number" step="0.01" placeholder="0,00">
      <div class="form-hint">
        Usado somente como base máxima do cálculo de cancelamento/reembolso.
        Não substitui o valor total do contrato.
        <button type="button" id="f-sugerir-vista-v33" style="background:none;border:0;padding:0;margin-left:4px;color:var(--vermelho);font:inherit;font-weight:700;cursor:pointer">Sugerir pela tabela</button>
      </div>`;
    valorEl.closest('.form-group')?.insertAdjacentElement('afterend', group);
  }

  const vistaEl = document.getElementById('f-valor-vista');
  const planoEl = document.getElementById('f-plano');
  const aluno = idAluno ? alunos.find(a=>String(a.id)===String(idAluno)) : null;
  const contrato = idAluno ? (contratoVigenteAluno(idAluno) || contratosDoAluno(idAluno).slice(-1)[0]) : null;

  const sugerir = ()=>{
    const total = Number(valorEl.value || 0);
    const plano = planoEl?.value || 'mensal';
    const freq = aluno?.frequencia || 3;
    vistaEl.value = sugestaoValorVistaV33(plano, freq, total).toFixed(2);
    vistaEl.dataset.manual = '0';
  };

  if(contrato && temValorVistaPersistidoV33(contrato)){
    vistaEl.value = valorVistaContratoV33(contrato).toFixed(2);
    vistaEl.dataset.manual = '1';
  } else {
    sugerir();
  }

  if(!vistaEl.dataset.listenerV33){
    vistaEl.addEventListener('input', ()=>{ vistaEl.dataset.manual='1'; });
    document.getElementById('f-sugerir-vista-v33')?.addEventListener('click', sugerir);
    planoEl?.addEventListener('change', ()=>{ if(vistaEl.dataset.manual!=='1') sugerir(); });
    valorEl.addEventListener('input', ()=>{ if(vistaEl.dataset.manual!=='1') sugerir(); });
    vistaEl.dataset.listenerV33='1';
  }
}

const openModalAlunoBaseV33 = openModalAluno;
openModalAluno = function(id){
  openModalAlunoBaseV33(id);
  garantirValorVistaNovoAlunoV33(id || null);
};
window.openModalAluno = openModalAluno;

const autoPreencherPlanoBaseV33 = window.autoPreencherPlano;
window.autoPreencherPlano = function(){
  autoPreencherPlanoBaseV33?.();
  const vistaEl=document.getElementById('f-valor-vista');
  if(vistaEl && vistaEl.dataset.manual!=='1'){
    const total=Number(document.getElementById('f-valor')?.value||0);
    const plano=document.getElementById('f-plano')?.value||'mensal';
    vistaEl.value=sugestaoValorVistaV33(plano,3,total).toFixed(2);
  }
};

const salvarAlunoBaseV33 = salvarAluno;
salvarAluno = async function(){
  garantirValorVistaNovoAlunoV33(editandoId || null);
  const total = Number(document.getElementById('f-valor')?.value || 0);
  const vista = Number(document.getElementById('f-valor-vista')?.value || 0);
  const plano = document.getElementById('f-plano')?.value || 'mensal';

  if(total <= 0){
    alert('Informe o valor total do contrato.');
    return;
  }
  if(plano !== 'mensal' && vista <= 0){
    alert('Informe o valor à vista de referência do contrato.');
    document.getElementById('f-valor-vista')?.focus();
    return;
  }
  if(vista > total && plano !== 'mensal'){
    if(!confirm('O valor à vista está maior que o valor total do contrato. Deseja salvar assim mesmo?')) return;
  }

  await salvarAlunoBaseV33();
};
window.salvarAluno = salvarAluno;

// ──────────────────────────────────────────────────
// NOVO CONTRATO / RENOVAÇÃO / EDIÇÃO
// Injeta o segundo valor no modal já existente.
// ──────────────────────────────────────────────────
function configurarValorVistaContratoV33(alunoId, contratoId=null){
  const totalEl = document.getElementById('ct-valor');
  const planoEl = document.getElementById('ct-plano');
  if(!totalEl || !planoEl) return;

  const totalGroup = totalEl.closest('.form-group');
  const label = totalGroup?.querySelector('.form-label');
  if(label) label.textContent = 'Valor total do contrato (R$)';
  const hint = totalGroup?.querySelector('.form-hint');
  if(hint) hint.innerHTML = 'Base da competência mensal e da multa rescisória.';

  let group = document.getElementById('ct-valor-vista-group-v33');
  if(!group){
    group=document.createElement('div');
    group.className='form-group';
    group.id='ct-valor-vista-group-v33';
    group.innerHTML=`
      <label class="form-label">Valor à vista de referência (R$)</label>
      <input class="form-input" type="number" id="ct-valor-vista" step="0.01" placeholder="0,00">
      <div class="form-hint">
        Base máxima para eventual reembolso.
        <button type="button" id="ct-sugerir-vista-v33" style="background:none;border:0;padding:0;margin-left:4px;color:var(--vermelho);font:inherit;font-weight:700;cursor:pointer">Sugerir pela tabela</button>
      </div>`;
    totalGroup?.insertAdjacentElement('afterend',group);
  }

  const vistaEl=document.getElementById('ct-valor-vista');
  const aluno=alunos.find(a=>String(a.id)===String(alunoId));
  const contrato=contratoId ? contratos.find(c=>String(c.id)===String(contratoId)) : null;

  const sugerir=()=>{
    const total=Number(totalEl.value||0);
    const plano=planoEl.value||'mensal';
    vistaEl.value=sugestaoValorVistaV33(plano,aluno?.frequencia||3,total).toFixed(2);
    vistaEl.dataset.manual='0';
  };

  if(contrato && temValorVistaPersistidoV33(contrato)){
    vistaEl.value=valorVistaContratoV33(contrato).toFixed(2);
    vistaEl.dataset.manual='1';
  }else{
    sugerir();
    if(contrato && contrato.plano!=='mensal'){
      const aviso=document.createElement('div');
      aviso.id='ct-aviso-legado-v33';
      aviso.style.cssText='grid-column:1/-1;background:#fffbeb;border:1px solid #fde68a;color:#92400e;border-radius:7px;padding:10px 12px;font-size:12px';
      aviso.innerHTML='<strong>Contrato antigo:</strong> este contrato ainda não tinha o valor à vista salvo separadamente. Revise os dois valores antes de salvar.';
      group.insertAdjacentElement('afterend',aviso);
    }
  }

  if(!vistaEl.dataset.listenerV33){
    vistaEl.addEventListener('input',()=>{vistaEl.dataset.manual='1';});
    document.getElementById('ct-sugerir-vista-v33')?.addEventListener('click',sugerir);
    planoEl.addEventListener('change',()=>{if(vistaEl.dataset.manual!=='1')sugerir();});
    totalEl.addEventListener('input',()=>{if(vistaEl.dataset.manual!=='1')sugerir();});
    vistaEl.dataset.listenerV33='1';
  }

  calcContratoMensalidade();
}

const abrirModalContratoBaseV33 = abrirModalContrato;
abrirModalContrato = function(alunoId, contratoId=null){
  abrirModalContratoBaseV33(alunoId, contratoId);
  configurarValorVistaContratoV33(alunoId, contratoId);
};
window.abrirModalContrato = abrirModalContrato;
renovar = function(id){ abrirModalContrato(id); };
window.renovar = renovar;

const confirmarSalvarContratoBaseV33 = window.confirmarSalvarContrato;
window.confirmarSalvarContrato = async function(alunoId, contratoId){
  const plano=document.getElementById('ct-plano')?.value||'mensal';
  const total=Number(document.getElementById('ct-valor')?.value||0);
  const vista=Number(document.getElementById('ct-valor-vista')?.value||0);

  if(total<=0){
    alert('Informe o valor total do contrato.');
    return;
  }
  if(plano!=='mensal' && vista<=0){
    alert('Informe o valor à vista de referência.');
    document.getElementById('ct-valor-vista')?.focus();
    return;
  }
  if(vista>total && plano!=='mensal'){
    if(!confirm('O valor à vista está maior que o valor total do contrato. Deseja salvar assim mesmo?')) return;
  }

  await confirmarSalvarContratoBaseV33(alunoId, contratoId);
};

// ──────────────────────────────────────────────────
// CANCELAMENTO
// Valores ficam bloqueados: agora vêm do contrato.
// Contrato legado sem valor à vista precisa ser revisado antes.
// ──────────────────────────────────────────────────
const abrirCancelamentoBaseV33 = window.abrirModalCancelamentoV26;
window.abrirModalCancelamentoV26 = function(alunoId, contratoId=''){
  const a=alunos.find(x=>String(x.id)===String(alunoId));
  const c=contratos.find(x=>String(x.id)===String(contratoId))
    || a?.contratoAtual
    || contratoVigenteAluno(alunoId);

  if(!c){
    alert('Contrato não encontrado.');
    return;
  }

  if(c.status!=='cancelado' && c.plano!=='mensal' && !temValorVistaPersistidoV33(c)){
    alert(
      'Este é um contrato antigo e ainda não possui o Valor à vista de referência salvo separadamente.\n\n' +
      'Antes de simular o cancelamento, revise o contrato e informe:\n' +
      '• Valor total do contrato\n' +
      '• Valor à vista de referência'
    );
    abrirModalContrato(alunoId,c.id);
    return;
  }

  abrirCancelamentoBaseV33(alunoId, contratoId || c.id);

  // Na simulação, os dois valores são somente leitura.
  setTimeout(()=>{
    const total=document.getElementById('cr-total');
    const vista=document.getElementById('cr-vista');
    if(total){
      total.readOnly=true;
      total.title='Valor salvo no contrato. Para alterar, edite o contrato.';
      const g=total.closest('.form-group');
      const h=g?.querySelector('.form-hint') || document.createElement('div');
      if(!g?.querySelector('.form-hint')){
        h.className='form-hint'; g?.appendChild(h);
      }
      h.textContent='Vem do contrato e é a base da competência mensal e da multa.';
    }
    if(vista){
      vista.readOnly=true;
      vista.title='Valor salvo no contrato. Para alterar, edite o contrato.';
      const g=vista.closest('.form-group');
      const h=g?.querySelector('.form-hint') || document.createElement('div');
      if(!g?.querySelector('.form-hint')){
        h.className='form-hint'; g?.appendChild(h);
      }
      h.textContent='Vem do contrato e é a base máxima do reembolso.';
    }
  },0);
};

// Perfil: mostra os dois valores também no cabeçalho da área de contratos.
const abrirPerfilAlunoBaseV33 = abrirPerfilAluno;
abrirPerfilAluno = async function(id){
  await abrirPerfilAlunoBaseV33(id);

  setTimeout(()=>{
    document.querySelectorAll('[data-cancelamento-v29]').forEach(btn=>{
      const cid=btn.dataset.cancelamentoV29;
      const c=contratos.find(x=>String(x.id)===String(cid));
      if(!c) return;
      const cel=btn.closest('td');
      if(!cel || cel.querySelector('.valores-contrato-v33')) return;
      const info=document.createElement('div');
      info.className='valores-contrato-v33';
      info.style.cssText='font-size:10.5px;color:var(--texto-muted);margin-top:6px;line-height:1.35';
      const vista=temValorVistaPersistidoV33(c) ? fmtValor(valorVistaContratoV33(c)) : 'não cadastrado';
      info.innerHTML=`Total: <strong>${fmtValor(valorContrato(c))}</strong><br>À vista ref.: <strong>${vista}</strong>`;
      cel.appendChild(info);
    });
  },0);
};
window.abrirPerfilAluno = abrirPerfilAluno;

// ═══════════════════════════════════════════════════
// V34 — BRUTO x LÍQUIDO + COMPETÊNCIA LÍQUIDA
// + impressão da simulação
// + mensagens do sistema em modal próprio
// ═══════════════════════════════════════════════════
const VERSAO_CONTRATO_V34 = '34.0';

// ──────────────────────────────────────────────────
// MODAIS DE MENSAGEM DO SISTEMA
// ──────────────────────────────────────────────────
function fecharModalSistemaV34(valor){
  const el=document.getElementById('modal-sistema-v34');
  if(el)el.remove();
  const fn=window.__resolveModalSistemaV34;
  window.__resolveModalSistemaV34=null;
  if(fn)fn(valor);
}
function modalSistemaV34({titulo='Studio FB',mensagem='',tipo='info',confirmacao=false,rotuloConfirmar='Confirmar',rotuloCancelar='Cancelar'}={}){
  document.getElementById('modal-sistema-v34')?.remove();
  if(window.__resolveModalSistemaV34){
    window.__resolveModalSistemaV34(false);
    window.__resolveModalSistemaV34=null;
  }
  const cfg={
    info:{cor:'#1d4ed8',bg:'#eff6ff',borda:'#bfdbfe',icone:'ℹ️'},
    sucesso:{cor:'#166534',bg:'#f0fdf4',borda:'#bbf7d0',icone:'✓'},
    alerta:{cor:'#92400e',bg:'#fffbeb',borda:'#fde68a',icone:'!'},
    perigo:{cor:'#991b1b',bg:'#fef2f2',borda:'#fecaca',icone:'!'}
  }[tipo]||{cor:'#1d4ed8',bg:'#eff6ff',borda:'#bfdbfe',icone:'ℹ️'};

  return new Promise(resolve=>{
    window.__resolveModalSistemaV34=resolve;
    const linhas=String(mensagem??'').split('\n').map(x=>`<div>${esc(x)||'&nbsp;'}</div>`).join('');
    const html=`<div id="modal-sistema-v34" style="position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:2000;display:flex;align-items:center;justify-content:center;padding:16px">
      <div style="background:#fff;border-radius:12px;width:100%;max-width:500px;box-shadow:var(--shadow-lg);overflow:hidden">
        <div style="padding:18px 20px;border-bottom:1px solid var(--borda);display:flex;align-items:center;gap:10px">
          <div style="width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:${cfg.bg};color:${cfg.cor};font-weight:800">${cfg.icone}</div>
          <div style="font-family:'Bebas Neue',sans-serif;font-size:22px">${esc(titulo)}</div>
        </div>
        <div style="padding:20px;color:var(--texto);font-size:13px;line-height:1.55">${linhas}</div>
        <div style="padding:14px 20px;border-top:1px solid var(--borda);display:flex;justify-content:flex-end;gap:8px;background:#fafafa">
          ${confirmacao?`<button class="btn btn-ghost" onclick="fecharModalSistemaV34(false)">${esc(rotuloCancelar)}</button>`:''}
          <button class="btn ${tipo==='perigo'?'btn-danger':'btn-primary'}" onclick="fecharModalSistemaV34(true)">${esc(confirmacao?rotuloConfirmar:'OK')}</button>
        </div>
      </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend',html);
  });
}
window.fecharModalSistemaV34=fecharModalSistemaV34;
window.mensagemSistemaV34=(mensagem,titulo='Studio FB',tipo='info')=>modalSistemaV34({titulo,mensagem,tipo});
window.confirmarSistemaV34=(mensagem,titulo='Confirmar',tipo='alerta',rotuloConfirmar='Confirmar')=>modalSistemaV34({titulo,mensagem,tipo,confirmacao:true,rotuloConfirmar});

// Todos os alertas simples do sistema passam a usar modal visual.
// As rotinas antigas continuam podendo chamar alert(...), mas não exibem caixa nativa do navegador.
window.alert = function(mensagem){
  modalSistemaV34({titulo:'Studio FB',mensagem:String(mensagem??''),tipo:'alerta'});
};

// ──────────────────────────────────────────────────
// VALORES DO CONTRATO
// ──────────────────────────────────────────────────
function valorTotalBrutoContratoV34(c){
  const explicito=Number(c?.valorTotalBruto||0);
  if(explicito>0)return explicito;

  // V33 já passou a guardar valorTotal como bruto e valorVistaReferencia como líquido.
  if(Number(c?.valorVistaReferencia||0)>0 && Number(c?.valorTotal||0)>0){
    return Number(c.valorTotal);
  }

  // Contratos legados da fase em que valorTotal era líquido e valorBruto era o cobrado.
  if(Number(c?.valorBruto||0)>Number(c?.valorTotal||0)){
    return Number(c.valorBruto);
  }
  return Number(c?.valorTotal ?? c?.valor ?? 0);
}
function valorLiquidoContratoV34(c){
  const explicito=Number(c?.valorLiquidoContrato||0);
  if(explicito>0)return explicito;

  const vista=Number(c?.valorVistaReferencia ?? c?.valorVista ?? 0);
  if(vista>0)return vista;

  // Legado: valorTotal era o líquido e valorBruto era apenas informativo.
  if(Number(c?.valorBruto||0)>Number(c?.valorTotal||0) && Number(c?.valorTotal||0)>0){
    return Number(c.valorTotal);
  }
  return Number(c?.valorTotal ?? c?.valor ?? 0);
}
function competenciaMensalLiquidaV34(c){
  return mesesContrato(c)>0 ? valorLiquidoContratoV34(c)/mesesContrato(c) : 0;
}
function mensalCancelamentoBrutoV34(c){
  return mesesContrato(c)>0 ? valorTotalBrutoContratoV34(c)/mesesContrato(c) : 0;
}
window.valorTotalBrutoContratoV34=valorTotalBrutoContratoV34;
window.valorLiquidoContratoV34=valorLiquidoContratoV34;

// Valor à vista usado no cancelamento = valor líquido efetivo do contrato.
valorVistaReferenciaV26 = function(c){ return valorLiquidoContratoV34(c); };

// A competência da DRE passa a ser distribuída sobre o VALOR LÍQUIDO.
// A data do pagamento continua sem deslocar o mês de competência.
valorCompetenciaParcelaV28 = function(c, parcela){
  const totalC=centavosV28(valorLiquidoContratoV34(c));
  const n=totalCompetenciasContratoV28(c);
  const p=Math.max(1,Math.min(n,Number(parcela)||1));
  const baseC=Math.floor(totalC/n);
  const valorC=p<n?baseC:(totalC-baseC*(n-1));
  return reaisV28(valorC);
};

// Saldo a cobrar do aluno compara BRUTO do contrato com BRUTO já cobrado/pago.
// Cancelamento continua usando totalPagoContrato(), que é líquido efetivamente recebido.
function totalPagoBrutoContratoV34(contratoId){
  return pagamentosDoContrato(contratoId).reduce((s,p)=>{
    const v=(p.forma==='Cartão' && Number(p.valorBruto||0)>0) ? Number(p.valorBruto) : Number(p.valor||0);
    return s+v;
  },0);
}
function totalPagoLiquidoContratoV34(contratoId){
  return pagamentosDoContrato(contratoId).reduce((s,p)=>s+Number(p.valor||0),0);
}
function saldoBrutoContratoV34(c){
  return Math.max(0,valorTotalBrutoContratoV34(c)-totalPagoBrutoContratoV34(c?.id));
}
function saldoLiquidoContratoV34(c){
  return Math.max(0,valorLiquidoContratoV34(c)-totalPagoLiquidoContratoV34(c?.id));
}
saldoContrato = function(c){ return saldoBrutoContratoV34(c); };

// Persistência: sempre grava os campos explícitos V34.
const salvarContratoDbBaseV34=salvarContratoDb;
salvarContratoDb=async function(c){
  if(!c)return;
  const campoTotal=document.getElementById('ct-valor')||document.getElementById('f-valor');
  const campoLiquido=document.getElementById('ct-valor-vista')||document.getElementById('f-valor-vista');

  const total=Number(c.valorTotalBruto||c.valorTotal||campoTotal?.value||0);
  const liquido=Number(c.valorLiquidoContrato||c.valorVistaReferencia||campoLiquido?.value||total||0);

  if(total>0){
    c.valorTotal=arredV32(total);
    c.valorTotalBruto=arredV32(total);
  }
  if(liquido>0){
    c.valorLiquidoContrato=arredV32(liquido);
    c.valorVistaReferencia=arredV32(liquido);
  }
  return salvarContratoDbBaseV34(c);
};

// ──────────────────────────────────────────────────
// NOVO CONTRATO / RENOVAÇÃO / EDIÇÃO
// ──────────────────────────────────────────────────
function abrirModalContratoV34(alunoId,contratoId=null){
  const a=alunos.find(x=>String(x.id)===String(alunoId));if(!a)return;
  const atual=contratoId?contratos.find(c=>String(c.id)===String(contratoId)):contratoVigenteAluno(alunoId);

  const baseInicio=atual?.venc?(()=>{
    const d=dataLocal(atual.venc);
    if(!d)return a.dataEntrada||new Date().toISOString().split('T')[0];
    d.setDate(d.getDate()+1);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  })():(a.dataEntrada||new Date().toISOString().split('T')[0]);

  const plano=atual?.plano||'mensal';
  const c=contratoId?atual:{
    plano,
    valorTotal:atual?valorTotalBrutoContratoV34(atual):400,
    valorTotalBruto:atual?valorTotalBrutoContratoV34(atual):400,
    valorLiquidoContrato:atual?valorLiquidoContratoV34(atual):400,
    valorVistaReferencia:atual?valorLiquidoContratoV34(atual):400,
    valorBruto:atual?.valorBruto||null,
    inicio:baseInicio,
    venc:addMeses(baseInicio,PLANO_MESES[plano]||1),
    pgto:atual?.pgto||'PIX',
    recebimento:atual?.recebimento||'mensal',
    parcelas:atual?.parcelas||null,
    obs:''
  };
  if(!c)return;

  const brutoContrato=valorTotalBrutoContratoV34(c)||0;
  const liquido=valorLiquidoContratoV34(c)||brutoContrato;
  const brutoCartao=Number(c.valorBruto||0)||brutoContrato;
  const titulo=contratoId?'Editar Contrato':'Novo Contrato / Renovação';

  const html=`<div style="position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:500;display:flex;align-items:center;justify-content:center;padding:16px" id="modal-contrato-overlay">
    <div style="background:#fff;border-radius:12px;width:100%;max-width:650px;box-shadow:var(--shadow-lg);max-height:92vh;overflow-y:auto">
      <div style="padding:20px 24px 0;display:flex;align-items:center;justify-content:space-between">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:23px">${titulo}</div>
        <button onclick="document.getElementById('modal-contrato-overlay').remove()" style="background:none;border:none;font-size:20px;cursor:pointer;color:#999">✕</button>
      </div>
      <div style="padding:8px 24px 14px;font-size:13px;color:var(--texto-muted);border-bottom:1px solid var(--borda)"><strong>${esc(a.nome)}</strong></div>

      <div style="padding:14px 24px;background:#eff6ff;border-bottom:1px solid #bfdbfe;color:#1e40af;font-size:12px">
        <strong>Como os valores funcionam:</strong> o valor total/bruto é a base da multa e do cálculo de cancelamento.
        O valor líquido é o que efetivamente fica para o Studio e é a base da competência da DRE.
      </div>

      <div style="padding:20px 24px" class="form-grid">
        <div class="form-group"><label class="form-label">Nome do contrato</label><input class="form-input" id="ct-nome" value="${esc(c?.nome&&c.nome!=='Contrato inicial'?c.nome:'')}" placeholder="Ex.: Anual 2026"></div>
        <div class="form-group"><label class="form-label">Plano</label><select class="form-select" id="ct-plano" onchange="calcContratoVenc();calcContratoV34()">${Object.entries(PLANO_LABEL).map(([v,l])=>`<option value="${v}" ${c.plano===v?'selected':''}>${l}</option>`).join('')}</select></div>

        <div class="form-group">
          <label class="form-label">Valor total do contrato — bruto (R$)</label>
          <input class="form-input" type="number" id="ct-valor" value="${Number(brutoContrato).toFixed(2)}" step="0.01" oninput="alterarTotalContratoV34()">
          <div class="form-hint">Valor nominal contratado. Base da multa e do valor mensal usado no cancelamento.</div>
        </div>

        <div class="form-group">
          <label class="form-label">Valor líquido / à vista de referência (R$)</label>
          <input class="form-input" type="number" id="ct-valor-vista" value="${Number(liquido).toFixed(2)}" step="0.01" oninput="this.dataset.manual='1';calcContratoV34();calcCtCartaoV34()">
          <div class="form-hint">
            Valor que efetivamente fica para o Studio. Base da competência e do reembolso.
            <button type="button" style="background:none;border:0;padding:0;color:var(--vermelho);font:inherit;font-weight:700;cursor:pointer" onclick="igualarLiquidoAoTotalV34()">Usar mesmo valor do bruto</button>
          </div>
        </div>

        <div class="form-group"><label class="form-label">Forma prevista</label><select class="form-select" id="ct-pgto" onchange="toggleCtCartaoV34()"><option value="PIX" ${c.pgto==='PIX'?'selected':''}>PIX</option><option value="Cartão" ${c.pgto==='Cartão'?'selected':''}>Cartão</option><option value="Dinheiro" ${c.pgto==='Dinheiro'?'selected':''}>Dinheiro</option></select></div>

        <div class="form-group" id="ct-bruto-group" style="display:none">
          <label class="form-label">Valor cobrado no cartão — bruto (R$)</label>
          <input class="form-input" type="number" id="ct-valor-bruto" data-auto="${Math.abs(brutoCartao-brutoContrato)<0.01?'1':'0'}" value="${Number(brutoCartao).toFixed(2)}" step="0.01" oninput="this.dataset.auto='0';calcCtCartaoV34()">
          <div class="form-hint">
            Normalmente é igual ao valor total do contrato.
            <button type="button" style="background:none;border:0;padding:0;color:var(--vermelho);font:inherit;font-weight:700;cursor:pointer" onclick="igualarBrutoCartaoAoContratoV34()">Usar valor do contrato</button>
          </div>
        </div>

        <div class="form-group" id="ct-cartao-resumo-group" style="display:none">
          <label class="form-label">Resumo do cartão</label>
          <div class="form-input" id="ct-cartao-hint" style="background:#fff7ed;color:#92400e;min-height:44px;height:auto;display:flex;align-items:center;line-height:1.4"></div>
        </div>

        <div class="form-group" id="ct-parcelas-group" style="display:none"><label class="form-label">Parcelamento no cartão</label><select class="form-select" id="ct-parcelas"><option value="">Não informado</option>${Array.from({length:12},(_,i)=>i+1).map(n=>`<option value="${n}" ${Number(c.parcelas)===n?'selected':''}>${n}x</option>`).join('')}</select><div class="form-hint">Fernando recebe o líquido integral na data registrada, mesmo que o cliente parcele.</div></div>

        <div class="form-group full">
          <div id="ct-resumo-valores-v34" style="background:#f9fafb;border:1px solid var(--borda);border-radius:8px;padding:12px;font-size:12px"></div>
        </div>

        <div class="form-group"><label class="form-label">Início</label><input class="form-input" type="date" id="ct-inicio" value="${c.inicio||''}" onchange="calcContratoVenc()"></div>
        <div class="form-group"><label class="form-label">Vencimento</label><input class="form-input" type="date" id="ct-venc" value="${c.venc||''}"><div class="form-hint">Editável manualmente</div></div>
        <div class="form-group"><label class="form-label">Recebimento</label><select class="form-select" id="ct-receb"><option value="mensal" ${c.recebimento==='mensal'?'selected':''}>Mensal/recorrente</option><option value="avista" ${c.recebimento==='avista'?'selected':''}>À vista ou negociado</option></select></div>
        <div class="form-group full"><label class="form-label">Observações</label><input class="form-input" id="ct-obs" value="${esc(c.obs||'')}"></div>
      </div>

      <div style="padding:16px 24px 20px;border-top:1px solid var(--borda);display:flex;justify-content:flex-end;gap:8px">
        <button class="btn btn-ghost" onclick="document.getElementById('modal-contrato-overlay').remove()">Cancelar</button>
        <button class="btn btn-primary" onclick="confirmarSalvarContratoV34('${esc(alunoId)}','${esc(contratoId||'')}')">Salvar contrato</button>
      </div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend',html);
  calcContratoV34();
  toggleCtCartaoV34();
}
window.abrirModalContrato=abrirModalContratoV34;
abrirModalContrato=abrirModalContratoV34;
window.renovar=function(id){abrirModalContratoV34(id);};

window.alterarTotalContratoV34=function(){
  const total=document.getElementById('ct-valor');
  const card=document.getElementById('ct-valor-bruto');
  if(card?.dataset.auto==='1')card.value=Number(total?.value||0).toFixed(2);
  calcContratoV34();
  calcCtCartaoV34();
};
window.igualarBrutoCartaoAoContratoV34=function(){
  const total=Number(document.getElementById('ct-valor')?.value||0);
  const card=document.getElementById('ct-valor-bruto');
  if(card){card.value=total.toFixed(2);card.dataset.auto='1';}
  calcCtCartaoV34();
};
window.igualarLiquidoAoTotalV34=function(){
  const total=Number(document.getElementById('ct-valor')?.value||0);
  const liq=document.getElementById('ct-valor-vista');
  if(liq){liq.value=total.toFixed(2);liq.dataset.manual='1';}
  calcContratoV34();calcCtCartaoV34();
};
window.calcContratoV34=function(){
  const total=Number(document.getElementById('ct-valor')?.value||0);
  const liq=Number(document.getElementById('ct-valor-vista')?.value||0);
  const plano=document.getElementById('ct-plano')?.value||'mensal';
  const meses=PLANO_MESES[plano]||1;
  const box=document.getElementById('ct-resumo-valores-v34');
  if(box){
    box.innerHTML=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div><div style="font-size:10px;text-transform:uppercase;color:var(--texto-muted)">Mensal contratual bruto</div><strong>${fmtValor(total/meses)}</strong><div style="font-size:10.5px;color:var(--texto-muted)">usado na apuração de cancelamento</div></div>
      <div><div style="font-size:10px;text-transform:uppercase;color:var(--texto-muted)">Competência líquida mensal</div><strong style="color:var(--verde)">${fmtValor(liq/meses)}</strong><div style="font-size:10.5px;color:var(--texto-muted)">valor reconhecido na DRE por ciclo</div></div>
    </div>`;
  }
};
window.calcContratoMensalidade=window.calcContratoV34;
window.toggleCtCartaoV34=function(){
  const forma=document.getElementById('ct-pgto')?.value;
  ['ct-bruto-group','ct-cartao-resumo-group','ct-parcelas-group'].forEach(id=>{
    const el=document.getElementById(id);if(el)el.style.display=forma==='Cartão'?'':'none';
  });
  if(forma==='Cartão'){
    const card=document.getElementById('ct-valor-bruto');
    if(card && !card.value){
      card.value=Number(document.getElementById('ct-valor')?.value||0).toFixed(2);
      card.dataset.auto='1';
    }
    calcCtCartaoV34();
  }
};
window.toggleCtCartao=window.toggleCtCartaoV34;
window.calcCtCartaoV34=function(){
  const total=Number(document.getElementById('ct-valor')?.value||0);
  const bruto=Number(document.getElementById('ct-valor-bruto')?.value||0);
  const liquido=Number(document.getElementById('ct-valor-vista')?.value||0);
  const taxa=Math.max(0,bruto-liquido);
  const hint=document.getElementById('ct-cartao-hint');
  if(hint){
    const dif=Math.abs(bruto-total)>0.009;
    hint.innerHTML=bruto>0&&liquido>0
      ? `<div><strong>Cartão:</strong> ${fmtValor(bruto)} bruto → ${fmtValor(liquido)} líquido · diferença/taxa ${fmtValor(taxa)}${dif?`<div style="margin-top:4px;color:#b45309">⚠ O bruto do cartão está diferente do valor total do contrato (${fmtValor(total)}). Isso é permitido porque o campo é editável.</div>`:''}</div>`
      :'Informe o bruto cobrado e o líquido recebido.';
  }
};
window.calcCtCartao=window.calcCtCartaoV34;

window.confirmarSalvarContratoV34=async function(alunoId,contratoId=''){
  const a=alunos.find(x=>String(x.id)===String(alunoId));if(!a)return;
  const existente=contratoId?contratos.find(c=>String(c.id)===String(contratoId)):null;
  const plano=document.getElementById('ct-plano')?.value||'mensal';
  const total=Number(document.getElementById('ct-valor')?.value||0);
  const liquido=Number(document.getElementById('ct-valor-vista')?.value||0);
  const inicio=document.getElementById('ct-inicio')?.value;
  const venc=document.getElementById('ct-venc')?.value;
  const forma=document.getElementById('ct-pgto')?.value||'PIX';

  if(!inicio||!venc||total<=0||liquido<=0){
    await mensagemSistemaV34('Preencha início, vencimento, valor total bruto e valor líquido do contrato.','Dados incompletos','alerta');
    return;
  }

  let brutoCartao=null;
  if(forma==='Cartão'){
    brutoCartao=Number(document.getElementById('ct-valor-bruto')?.value||0);
    if(brutoCartao<=0){
      await mensagemSistemaV34('Informe o valor bruto cobrado no cartão.','Cartão','alerta');
      return;
    }
    if(brutoCartao<liquido){
      await mensagemSistemaV34('O valor bruto cobrado no cartão não pode ser menor que o valor líquido recebido.','Confira os valores','perigo');
      return;
    }
  }

  if(liquido>total){
    const ok=await confirmarSistemaV34(
      `O valor líquido (${fmtValor(liquido)}) está maior que o valor total/bruto do contrato (${fmtValor(total)}).\n\nIsso é incomum. Deseja salvar mesmo assim?`,
      'Valor líquido maior que o bruto',
      'alerta',
      'Salvar mesmo assim'
    );
    if(!ok)return;
  }

  const id=contratoId||`ct_${alunoId}_${Date.now()}`;
  const parcelas=forma==='Cartão'?(parseInt(document.getElementById('ct-parcelas')?.value)||null):null;
  const c={
    ...(existente||{}),
    id,
    alunoId:String(alunoId),
    alunoNome:a.nome,
    nome:document.getElementById('ct-nome')?.value.trim()||'',
    plano,
    valorTotal:arredV32(total),
    valorTotalBruto:arredV32(total),
    valorLiquidoContrato:arredV32(liquido),
    valorVistaReferencia:arredV32(liquido),
    valorBruto:forma==='Cartão'?arredV32(brutoCartao):null,
    taxaCartaoValor:forma==='Cartão'?arredV32(Math.max(0,brutoCartao-liquido)):null,
    inicio,venc,pgto:forma,
    recebimento:document.getElementById('ct-receb')?.value||'mensal',
    parcelas,
    status:existente?.status||'ativo',
    obs:document.getElementById('ct-obs')?.value.trim()||'',
    criadoEm:existente?.criadoEm||new Date().toISOString(),
    ts:existente?.ts||Date.now(),
    atualizadoEm:new Date().toISOString()
  };
  await salvarContratoDb(c);
  await registrarAuditoria(contratoId?'edicao_contrato':'renovacao_contrato',alunoId,a.nome,existente||{},c);
  document.getElementById('modal-contrato-overlay')?.remove();
  toast(contratoId?'Contrato atualizado ✓':'Novo contrato cadastrado ✓');
  abrirPerfilAluno(alunoId);
};

// ──────────────────────────────────────────────────
// CADASTRO INICIAL: rótulos coerentes com V34
// ──────────────────────────────────────────────────
const openModalAlunoBaseV34=openModalAluno;
openModalAluno=function(id){
  openModalAlunoBaseV34(id);
  setTimeout(()=>{
    const total=document.getElementById('f-valor');
    const vista=document.getElementById('f-valor-vista');
    if(total){
      const g=total.closest('.form-group');
      const l=g?.querySelector('.form-label');
      if(l)l.textContent='Valor total do contrato — bruto (R$)';
    }
    if(vista){
      const g=vista.closest('.form-group');
      const l=g?.querySelector('.form-label');
      if(l)l.textContent='Valor líquido / à vista de referência (R$)';
      const h=g?.querySelector('.form-hint');
      if(h)h.innerHTML='Valor que efetivamente fica para o Studio. Base da competência e do reembolso.';
    }
  },0);
};
window.openModalAluno=openModalAluno;

// ──────────────────────────────────────────────────
// PAGAMENTO: sugestão separada para bruto e líquido
// ──────────────────────────────────────────────────
const sugestaoValorMovBaseV34=sugestaoValorMovV32;
sugestaoValorMovV32=function(c,n){
  if(n==='contrato')return saldoLiquidoContratoV34(c);
  return sugestaoValorMovBaseV34(c,n);
};
const abrirModalPagamentoBaseV34=abrirModalPagamentoContrato;
abrirModalPagamentoContrato=function(alunoId,contratoId=null,pagamentoId=null){
  abrirModalPagamentoBaseV34(alunoId,contratoId,pagamentoId);
  setTimeout(()=>{
    const cid=document.getElementById('pg-contrato-id')?.value;
    const c=contratos.find(x=>String(x.id)===String(cid));
    const p=pagamentoId?pagamentos.find(x=>String(x.id)===String(pagamentoId)):null;
    const label=document.getElementById('pg-valor-label');
    if(label)label.textContent='Valor líquido efetivamente recebido (R$)';
    const bruto=document.getElementById('pg-valor-bruto');
    const grupo=bruto?.closest('.form-group');
    const lab=grupo?.querySelector('.form-label');
    if(lab)lab.textContent='Valor cobrado do aluno no cartão — bruto';
    if(c&&!p&&bruto){
      bruto.value=saldoBrutoContratoV34(c).toFixed(2);
      calcPgCartao?.();
    }
  },0);
};
window.abrirModalPagamentoContrato=abrirModalPagamentoContrato;
registrarPagamento=async function(id){abrirModalPagamentoContrato(id);};
window.registrarPagamento=registrarPagamento;

// ──────────────────────────────────────────────────
// CANCELAMENTO: rótulos + impressão da SIMULAÇÃO
// ──────────────────────────────────────────────────
const abrirCancelamentoBaseV34=window.abrirModalCancelamentoV26;
window.abrirModalCancelamentoV26=function(alunoId,contratoId=''){
  abrirCancelamentoBaseV34(alunoId,contratoId);
  setTimeout(()=>{
    const modal=document.getElementById('modal-cancelamento-v26');
    if(!modal)return;

    const total=document.getElementById('cr-total');
    const vista=document.getElementById('cr-vista');

    if(total){
      const g=total.closest('.form-group');
      const l=g?.querySelector('.form-label');
      if(l)l.textContent='Valor total do contrato — bruto';
      const h=g?.querySelector('.form-hint')||document.createElement('div');
      if(!g?.querySelector('.form-hint')){h.className='form-hint';g?.appendChild(h);}
      h.textContent='Base do valor mensal contratual e da multa rescisória.';
    }
    if(vista){
      const g=vista.closest('.form-group');
      const l=g?.querySelector('.form-label');
      if(l)l.textContent='Valor líquido / à vista de referência';
      const h=g?.querySelector('.form-hint')||document.createElement('div');
      if(!g?.querySelector('.form-hint')){h.className='form-hint';g?.appendChild(h);}
      h.textContent='Base máxima do reembolso e base total da competência da DRE.';
    }

    if(!document.getElementById('cr-comp-liquida-v34') && vista){
      const cid=document.getElementById('cr-contrato-id')?.value;
      const c=contratos.find(x=>String(x.id)===String(cid));
      if(c){
        const group=document.createElement('div');
        group.className='form-group';
        group.id='cr-comp-liquida-v34';
        group.innerHTML=`<label class="form-label">Competência líquida mensal</label><input class="form-input" readonly value="${competenciaMensalLiquidaV34(c).toFixed(2)}"><div class="form-hint">Informativo: valor líquido ÷ meses do plano. Não altera a fórmula contratual de cancelamento.</div>`;
        vista.closest('.form-group')?.insertAdjacentElement('afterend',group);
      }
    }

    const footer=[...modal.querySelectorAll('div')].find(el=>{
      const style=el.getAttribute('style')||'';
      return style.includes('border-top') && el.querySelector('.btn-danger');
    });
    if(footer&&!footer.querySelector('#btn-imprimir-simulacao-v34')){
      const btn=document.createElement('button');
      btn.className='btn btn-ghost';
      btn.id='btn-imprimir-simulacao-v34';
      btn.innerHTML='🖨️ Imprimir simulação';
      btn.onclick=()=>imprimirSimulacaoCancelamentoV34();
      const fechar=footer.querySelector('.btn-ghost');
      fechar?.insertAdjacentElement('afterend',btn);
    }
  },10);
};

window.imprimirSimulacaoCancelamentoV34=function(){
  const alunoId=document.getElementById('cr-aluno-id')?.value;
  const contratoId=document.getElementById('cr-contrato-id')?.value;
  const a=alunos.find(x=>String(x.id)===String(alunoId));
  const c=contratos.find(x=>String(x.id)===String(contratoId));
  if(!a||!c){
    mensagemSistemaV34('Não foi possível identificar o aluno ou o contrato da simulação.','Impressão','alerta');
    return;
  }

  const extras=extrasModalV32();
  const calc=calcularCancelamentoV32(c,{
    dataCancelamento:document.getElementById('cr-data')?.value,
    valorTotal:Number(document.getElementById('cr-total')?.value||0),
    valorVista:Number(document.getElementById('cr-vista')?.value||0),
    extrasTotal:extras.reduce((s,x)=>s+x.valor,0)
  });
  const valorAcordado=Math.max(0,Number(document.getElementById('cr-acordado')?.value||0));
  const qtd=calc.tipoAcerto==='sem_acerto'?0:Math.max(1,Number(document.getElementById('cr-qtd')?.value||1));
  const primeira=document.getElementById('cr-primeira')?.value||calc.dataCancelamento;
  const parcelas=gerarParcelasAcertoV31(valorAcordado,qtd,primeira);
  const obs=document.getElementById('cr-obs')?.value.trim()||'—';
  const tipoLabel=calc.tipoAcerto==='reembolso'?'A reembolsar ao aluno':calc.tipoAcerto==='receber'?'A receber do aluno':'Sem valor a acertar';

  const extrasRows=extras.map(e=>`<tr><td>${esc(e.descricao)}</td><td class="num">${fmtValor(e.valor)}</td></tr>`).join('');
  const parcelasRows=parcelas.map(p=>`<tr><td>${p.numero}/${parcelas.length}</td><td>${fmtData(p.data)}</td><td class="num">${fmtValor(p.valor)}</td></tr>`).join('');

  const html=`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Simulação de Cancelamento — ${esc(a.nome)}</title>
  <style>
    body{font-family:Arial,sans-serif;max-width:800px;margin:auto;padding:30px;color:#111}
    .topo{display:flex;justify-content:space-between;gap:20px;border-bottom:3px solid #111;padding-bottom:15px}
    h1{font-size:25px;margin:0}.tag{display:inline-block;background:#fffbeb;border:1px solid #f59e0b;color:#92400e;padding:6px 10px;border-radius:5px;font-weight:700;font-size:12px}
    h2{font-size:14px;background:#111;color:#fff;padding:8px 10px;margin:22px 0 0}
    table{width:100%;border-collapse:collapse;border:1px solid #eee}td,th{padding:8px;border-bottom:1px solid #eee}.num{text-align:right;font-weight:700}
    .resultado{margin-top:20px;border:2px solid #D32F2F;border-radius:8px;padding:16px;display:flex;justify-content:space-between;align-items:center}
    .nota{font-size:11px;color:#666;margin-top:15px;line-height:1.5}.btn{padding:10px 18px;background:#D32F2F;color:white;border:0;border-radius:6px;font-weight:700;margin-bottom:18px}
    @media print{.no-print{display:none}body{padding:12px}}
  </style></head><body>
  <button class="btn no-print" onclick="window.print()">🖨️ Imprimir / Salvar PDF</button>
  <div class="topo"><div><h1>Studio FB — Simulação de Cancelamento</h1><div style="margin-top:6px">${esc(a.nome)} · ${esc(nomeContrato(c))}</div></div><div class="tag">SIMULAÇÃO — NÃO CONFIRMADA</div></div>

  <h2>Contrato e bases</h2><table><tbody>
    <tr><td>Início do contrato</td><td class="num">${fmtData(c.inicio)}</td></tr>
    <tr><td>Data simulada de cancelamento</td><td class="num">${fmtData(calc.dataCancelamento)}</td></tr>
    <tr><td>Valor total do contrato — bruto</td><td class="num">${fmtValor(calc.valorTotal)}</td></tr>
    <tr><td>Valor líquido / à vista de referência</td><td class="num">${fmtValor(calc.valorVista)}</td></tr>
    <tr><td>Competência líquida mensal</td><td class="num">${fmtValor(calc.valorVista/Math.max(1,calc.mesesPlano))}</td></tr>
    <tr><td>Valor mensal contratual bruto</td><td class="num">${fmtValor(calc.valorMensal)}</td></tr>
  </tbody></table>

  <h2>Apuração do cancelamento</h2><table><tbody>
    <tr><td>Meses utilizados</td><td class="num">${calc.mesesUsados} de ${calc.mesesPlano}</td></tr>
    <tr><td>Valor utilizado</td><td class="num">${fmtValor(calc.valorConsumido)}</td></tr>
    <tr><td>Multa rescisória (${calc.percentualMulta}%)</td><td class="num">${fmtValor(calc.multaRetida)}</td></tr>
    <tr><td>Extras / benefícios utilizados</td><td class="num">${fmtValor(calc.extrasDescontados)}</td></tr>
    <tr><td><strong>Custo contratual apurado</strong></td><td class="num"><strong>${fmtValor(calc.totalDevidoCancelamento)}</strong></td></tr>
    <tr><td>Reembolso teórico</td><td class="num">${fmtValor(calc.reembolsoTeorico)}</td></tr>
    <tr><td>Total líquido efetivamente pago neste contrato</td><td class="num">${fmtValor(calc.valorPagoConsiderado)}</td></tr>
    <tr><td>Saldo financeiro real</td><td class="num">${calc.saldoFinanceiro<0?'-':''}${fmtValor(Math.abs(calc.saldoFinanceiro))}</td></tr>
  </tbody></table>

  ${extrasRows?`<h2>Extras utilizados</h2><table><tbody>${extrasRows}</tbody></table>`:''}

  <div class="resultado"><div><strong>${tipoLabel}</strong><div style="font-size:11px;color:#666;margin-top:4px">Resultado calculado da simulação</div></div><div style="font-size:25px;font-weight:800">${fmtValor(calc.valorAcertoSugerido)}</div></div>

  ${parcelasRows?`<h2>Acordo simulado</h2><table><thead><tr><th>Parcela</th><th>Data prevista</th><th class="num">Valor</th></tr></thead><tbody>${parcelasRows}</tbody></table>`:''}
  <p><strong>Valor acordado informado na simulação:</strong> ${fmtValor(valorAcordado)}</p>
  <p><strong>Observações:</strong> ${esc(obs)}</p>
  <div class="nota"><strong>Importante:</strong> esta impressão é apenas uma simulação. O contrato permanece ativo até a confirmação do cancelamento no sistema. A simulação não cria lançamento na DRE nem no caixa.</div>
  </body></html>`;

  const w=window.open('','_blank');
  if(!w){
    mensagemSistemaV34('O navegador bloqueou a janela de impressão. Libere pop-ups para o Studio FB e tente novamente.','Impressão bloqueada','alerta');
    return;
  }
  w.document.write(html);w.document.close();
};

// Confirmação do cancelamento com modal do próprio sistema.
window.confirmarCancelamentoV32=async function(){
  const alunoId=document.getElementById('cr-aluno-id')?.value;
  const contratoId=document.getElementById('cr-contrato-id')?.value;
  const a=alunos.find(x=>String(x.id)===String(alunoId));
  const c=contratos.find(x=>String(x.id)===String(contratoId));
  if(!a||!c)return;

  const data=document.getElementById('cr-data')?.value;
  const extrasItens=extrasModalV32();
  const calc=calcularCancelamentoV32(c,{
    dataCancelamento:data,
    valorTotal:Number(document.getElementById('cr-total')?.value||0),
    valorVista:Number(document.getElementById('cr-vista')?.value||0),
    extrasTotal:extrasItens.reduce((s,x)=>s+x.valor,0)
  });
  const valorAcordado=Math.max(0,Number(document.getElementById('cr-acordado')?.value||0));
  const qtd=calc.tipoAcerto==='sem_acerto'?0:Math.max(1,Number(document.getElementById('cr-qtd')?.value||1));
  const primeira=document.getElementById('cr-primeira')?.value||data;
  const parcelas=gerarParcelasAcertoV31(valorAcordado,qtd,primeira);

  const ok=await confirmarSistemaV34(
    `Aluno: ${a.nome}\nData do cancelamento: ${fmtData(data)}\nResultado: ${labelTipoAcertoV31(calc.tipoAcerto)} — ${fmtValor(valorAcordado)}\n\nO contrato será encerrado e a apuração ficará registrada. Nenhum lançamento será criado automaticamente na DRE ou no caixa.`,
    'Confirmar cancelamento',
    'perigo',
    'Confirmar cancelamento'
  );
  if(!ok)return;

  const snapshot=pagamentosDoContrato(c.id).map(p=>({
    id:p.id,data:p.data,valor:Number(p.valor||0),valorBruto:Number(p.valorBruto||0),
    forma:p.forma||'',descricao:p.descricao||''
  }));
  const cancelamento={
    status:'confirmado',...calc,extrasItens,
    valorAcertoAcordado:arredV32(valorAcordado),
    valorReembolsado:calc.tipoAcerto==='reembolso'?arredV32(valorAcordado):0,
    valorAReceber:calc.tipoAcerto==='receber'?arredV32(valorAcordado):0,
    qtdParcelas:qtd,dataPrimeiraParcela:primeira,parcelasAcerto:parcelas,
    pagamentosSnapshot:snapshot,
    observacao:document.getElementById('cr-obs')?.value.trim()||'',
    semLancamentoFinanceiroAutomatico:true,
    criadoEm:new Date().toISOString(),ts:Date.now()
  };
  const atualizado={...c,status:'cancelado',cancelamento,vencOriginal:c.vencOriginal||c.venc,atualizadoEm:new Date().toISOString()};
  await salvarContratoDb(atualizado);
  await setDoc(doc(db,'cancelamentos_reembolsos',String(contratoId)),{
    id:String(contratoId),contratoId:String(contratoId),alunoId:String(alunoId),alunoNome:a.nome,...cancelamento
  });
  const hist={
    id:`hist_cancel_${contratoId}_${Date.now()}`,alunoId:String(alunoId),alunoNome:a.nome,
    contratoId:String(contratoId),tipo:'cancelamento_contrato',data,
    valor:cancelamento.valorAcertoAcordado,tipoAcerto:cancelamento.tipoAcerto,
    descricao:'Cancelamento de contrato',status:'ativo',ts:Date.now()
  };
  await setDoc(doc(db,'historico',hist.id),hist);
  await registrarAuditoria('cancelamento_contrato',alunoId,a.nome,{}, {contratoId,cancelamento});

  document.getElementById('modal-cancelamento-v26')?.remove();
  hidratarAlunosComContratos();
  toast('Contrato cancelado e apuração registrada ✓');
  abrirPerfilAluno(alunoId);
};
window.confirmarCancelamentoReembolsoV26=window.confirmarCancelamentoV32;

// ──────────────────────────────────────────────────
// PERFIL: explicitar bruto, líquido e saldo
// ──────────────────────────────────────────────────
const abrirPerfilBaseV34=abrirPerfilAluno;
abrirPerfilAluno=async function(id){
  await abrirPerfilBaseV34(id);
  setTimeout(()=>{
    document.querySelectorAll('.valores-contrato-v33').forEach(el=>el.remove());
    document.querySelectorAll('[data-cancelamento-v29],.btn-cancelamento-v26').forEach(btn=>{
      const oc=btn.getAttribute('onclick')||'';
      const m=oc.match(/abrirModalCancelamentoV26\('([^']+)','([^']+)'\)/);
      const cid=m?.[2]||btn.dataset.cancelamentoV29;
      const c=contratos.find(x=>String(x.id)===String(cid));
      const td=btn.closest('td');
      if(!c||!td||td.querySelector('.valores-contrato-v34'))return;
      const info=document.createElement('div');
      info.className='valores-contrato-v34';
      info.style.cssText='font-size:10.5px;color:var(--texto-muted);margin-top:6px;line-height:1.4';
      info.innerHTML=`Bruto contrato: <strong>${fmtValor(valorTotalBrutoContratoV34(c))}</strong><br>Líquido / base DRE: <strong>${fmtValor(valorLiquidoContratoV34(c))}</strong>`;
      td.appendChild(info);
    });
  },0);
};
window.abrirPerfilAluno=abrirPerfilAluno;

// ═══════════════════════════════════════════════════
// V35 — FINANCEIRO / DRE AUDITÁVEL
// 1) vínculo pagamento → contrato explícito e sugerido pela data
// 2) receita avulsa sem aluno
// 3) fonte única para receita de competência e caixa
// 4) auditoria de integridade e rastreabilidade
// 5) desativa migração automática de "Contrato inicial"
// ═══════════════════════════════════════════════════
const VERSAO_FINANCEIRO_V35 = '35.0';
let receitasAvulsasV35 = [];

// ──────────────────────────────────────────────────
// CONTRATOS: NÃO CRIAR MAIS CONTRATO AUTOMATICAMENTE
// ──────────────────────────────────────────────────
carregarContratos = async function(){
  try{
    const snap = await getDocs(collection(db,'contratos'));
    contratos = snap.docs.map(d=>({id:d.id,...d.data()}));
  }catch(e){
    contratos = [];
    console.warn('Erro ao carregar contratos',e);
  }
  return contratos;
};

// Reforço de integridade: contrato arquivado nunca gera competência.
const contratoContaCompetenciaMesBaseV35 = contratoContaCompetenciaMes;
contratoContaCompetenciaMes = function(c,mes,ano){
  if(!c || c.status==='excluido') return false;
  return !!contratoContaCompetenciaMesBaseV35(c,mes,ano);
};

// ──────────────────────────────────────────────────
// RECEITAS AVULSAS
// ──────────────────────────────────────────────────
async function carregarReceitasAvulsasV35(forcar=false){
  if(receitasAvulsasV35.length && !forcar) return receitasAvulsasV35;
  try{
    const snap=await getDocs(collection(db,'receitas_avulsas'));
    receitasAvulsasV35=snap.docs.map(d=>({id:d.id,...d.data()}));
  }catch(e){
    console.warn('Não foi possível carregar receitas avulsas:',e);
    receitasAvulsasV35=[];
  }
  return receitasAvulsasV35;
}
async function salvarReceitaAvulsaV35(r){
  receitasAvulsasV35=receitasAvulsasV35.filter(x=>String(x.id)!==String(r.id)).concat(r);
  await setDoc(doc(db,'receitas_avulsas',String(r.id)),r);
}
function receitaAvulsaAtivaV35(r){ return !!r && r.status!=='excluido'; }
function receitaAvulsaCompMesV35(r,mes,ano){
  return receitaAvulsaAtivaV35(r) && String(r.competencia||'')===`${ano}-${String(Number(mes)+1).padStart(2,'0')}`;
}
function receitasAvulsasCompetenciaMesV35(mes,ano){
  return receitasAvulsasV35.filter(r=>receitaAvulsaCompMesV35(r,mes,ano));
}
function receitasAvulsasCaixaMesV35(mes,ano){
  return receitasAvulsasV35.filter(r=>receitaAvulsaAtivaV35(r)&&r.recebido===true&&r.dataRecebimento&&dataNoMesV32(r.dataRecebimento,mes,ano));
}
function categoriaReceitaAvulsaV35(cat){
  return ({
    servico_avulso:'Serviço / avaliação avulsa',
    venda_produto:'Venda de produto',
    receita_operacional:'Outra receita operacional',
    receita_nao_operacional:'Receita não operacional',
    outras:'Outras receitas'
  })[cat]||cat||'Outras receitas';
}

// ──────────────────────────────────────────────────
// FONTE ÚNICA DE RECEITAS — COMPETÊNCIA
// ──────────────────────────────────────────────────
function linhasReceitaCompetenciaV35(mes,ano){
  const linhas=[];

  contratos
    .filter(c=>c.status!=='excluido'&&contratoContaCompetenciaMes(c,mes,ano))
    .forEach(c=>{
      const comp=competenciaContratoMesV28(c,mes,ano);
      linhas.push({
        tipo:'contrato',
        origemId:String(c.id),
        alunoId:String(c.alunoId||''),
        alunoNome:c.alunoNome||'—',
        descricao:nomeContrato(c),
        detalhe:competenciaResumoContratoMesV18(c,mes,ano),
        valor:Number(valorCompetenciaContratoMesV28(c,mes,ano)||0),
        contrato:c,
        competencia:comp?.data||`${ano}-${String(mes+1).padStart(2,'0')}-01`,
        mes,ano
      });
    });

  aulasExtrasMes(mes,ano).forEach(p=>{
    linhas.push({
      tipo:'aula_extra',
      origemId:String(p.id),
      alunoId:String(p.alunoId||''),
      alunoNome:p.alunoNome||'—',
      descricao:p.descricao||'Aula extra',
      detalhe:`${fmtData(p.data)} · aula extra`,
      valor:Number(p.valor||0),
      pagamento:p,
      contratoId:String(p.contratoId||''),
      competencia:p.data,
      mes,ano
    });
  });

  multasMesV32(mes,ano).forEach(p=>{
    linhas.push({
      tipo:'multa_cancelamento',
      origemId:String(p.id),
      alunoId:String(p.alunoId||''),
      alunoNome:p.alunoNome||'—',
      descricao:p.descricao||'Multa rescisória',
      detalhe:`${fmtData(p.data)} · multa registrada`,
      valor:Number(p.valor||0),
      pagamento:p,
      contratoId:String(p.contratoId||''),
      competencia:p.competenciaDRE||ymV32(p.data),
      mes,ano
    });
  });

  receitasAvulsasCompetenciaMesV35(mes,ano).forEach(r=>{
    linhas.push({
      tipo:'receita_avulsa',
      origemId:String(r.id),
      alunoId:'',
      alunoNome:'Receita avulsa',
      descricao:r.descricao||categoriaReceitaAvulsaV35(r.categoria),
      detalhe:`${categoriaReceitaAvulsaV35(r.categoria)} · competência ${r.competencia}`,
      valor:Number(r.valor||0),
      receitaAvulsa:r,
      competencia:r.competencia,
      mes,ano
    });
  });

  return linhas.filter(l=>Number(l.valor||0)!==0);
}

// FONTE ÚNICA DE RECEITAS — CAIXA
function linhasReceitaCaixaV35(mes,ano){
  const linhas=[];
  movimentosAlunoCaixaMesV32(mes,ano).forEach(p=>{
    const v=valorCaixaAlunoV32(p);
    linhas.push({
      tipo:'movimento_aluno',
      subtipo:naturezaMovAlunoV32(p),
      origemId:String(p.id),
      alunoId:String(p.alunoId||''),
      alunoNome:p.alunoNome||'—',
      descricao:p.descricao||labelNaturezaV32(p),
      detalhe:`${fmtData(p.data)} · ${p.forma||'—'}${detalheCartaoTexto(p)}`,
      valor:Number(v||0),
      pagamento:p,
      contratoId:String(p.contratoId||''),
      data:p.data
    });
  });
  receitasAvulsasCaixaMesV35(mes,ano).forEach(r=>{
    linhas.push({
      tipo:'receita_avulsa',
      origemId:String(r.id),
      alunoId:'',
      alunoNome:'Receita avulsa',
      descricao:r.descricao||categoriaReceitaAvulsaV35(r.categoria),
      detalhe:`${fmtData(r.dataRecebimento)} · ${r.forma||'—'} · ${categoriaReceitaAvulsaV35(r.categoria)}`,
      valor:Number(r.valor||0),
      receitaAvulsa:r,
      data:r.dataRecebimento
    });
  });
  return linhas.filter(l=>Number(l.valor||0)!==0);
}

// Todos os painéis passam a usar as mesmas composições.
receitaMesEsp = function(mes,ano){
  return linhasReceitaCompetenciaV35(mes,ano).reduce((s,l)=>s+Number(l.valor||0),0);
};
receitaCaixaMes = function(mes,ano){
  return linhasReceitaCaixaV35(mes,ano).reduce((s,l)=>s+Number(l.valor||0),0);
};
receitaMensal = function(){ return receitaMesEsp(MES_ATUAL,ANO_ATUAL); };
receitaDoMesSelecionada = function(mes,ano){
  return financeiroModo==='caixa'?receitaCaixaMes(mes,ano):receitaMesEsp(mes,ano);
};

// Mantém os cards auxiliares corretos sem confundir "alunos" com receitas avulsas.
function entradasReceitaCaixaV35(mes,ano){
  return linhasReceitaCaixaV35(mes,ano).reduce((s,l)=>s+Math.max(0,Number(l.valor||0)),0);
}
function saidasReceitaCaixaV35(mes,ano){
  return linhasReceitaCaixaV35(mes,ano).reduce((s,l)=>s+Math.max(0,-Number(l.valor||0)),0);
}

// ──────────────────────────────────────────────────
// NOTA FISCAL: usa a mesma composição da DRE
// ──────────────────────────────────────────────────
itensReceitaCompetenciaNFV24 = function(mes,ano){
  return linhasReceitaCompetenciaV35(mes,ano).map(l=>{
    const tipoNF=l.tipo==='multa_cancelamento'?'multa_cancelamento':l.tipo;
    return {
      tipo:tipoNF,
      origemId:l.origemId,
      key:chaveNFV24(tipoNF,l.origemId,mes,ano),
      alunoId:l.alunoId||'',
      alunoNome:l.alunoNome||'—',
      contrato:l.contrato,
      descricao:l.descricao,
      detalhe:l.detalhe,
      valor:Number(l.valor||0),
      pagamento:l.pagamento,
      receitaAvulsa:l.receitaAvulsa,
      mes,ano
    };
  });
};

// ──────────────────────────────────────────────────
// RECEITA AVULSA — MODAL / CRUD
// ──────────────────────────────────────────────────
window.abrirModalReceitaAvulsaV35 = function(id=''){
  const r=id?receitasAvulsasV35.find(x=>String(x.id)===String(id)):null;
  const comp=r?.competencia||`${finAno}-${String(finMes+1).padStart(2,'0')}`;
  const hoje=new Date().toISOString().split('T')[0];
  const recebido=r?!!r.recebido:true;
  const html=`<div style="position:fixed;inset:0;background:rgba(0,0,0,.58);z-index:700;display:flex;align-items:center;justify-content:center;padding:16px" id="modal-receita-avulsa-v35">
    <div style="background:#fff;border-radius:12px;width:100%;max-width:560px;box-shadow:var(--shadow-lg);overflow:hidden">
      <div style="padding:18px 22px;border-bottom:1px solid var(--borda);display:flex;justify-content:space-between;align-items:center">
        <div><div style="font-family:'Bebas Neue',sans-serif;font-size:23px">${r?'Editar':'Nova'} receita avulsa</div><div style="font-size:12px;color:var(--texto-muted)">Não depende de aluno nem de contrato.</div></div>
        <button class="modal-close" onclick="document.getElementById('modal-receita-avulsa-v35').remove()">✕</button>
      </div>
      <div style="padding:20px 22px">
        <div class="form-grid" style="grid-template-columns:1fr 1fr">
          <div class="form-group full"><label class="form-label">Descrição</label><input class="form-input" id="ra-desc-v35" value="${esc(r?.descricao||'')}" placeholder="Ex.: Avaliação externa"></div>
          <div class="form-group"><label class="form-label">Categoria</label><select class="form-select" id="ra-cat-v35">
            ${[
              ['servico_avulso','Serviço / avaliação avulsa'],
              ['venda_produto','Venda de produto'],
              ['receita_operacional','Outra receita operacional'],
              ['receita_nao_operacional','Receita não operacional'],
              ['outras','Outras receitas']
            ].map(([v,l])=>`<option value="${v}" ${(r?.categoria||'servico_avulso')===v?'selected':''}>${l}</option>`).join('')}
          </select></div>
          <div class="form-group"><label class="form-label">Valor líquido da receita (R$)</label><input class="form-input" type="number" step="0.01" id="ra-valor-v35" value="${Number(r?.valor||0)>0?Number(r.valor).toFixed(2):''}" placeholder="0,00"></div>
          <div class="form-group"><label class="form-label">Competência da DRE</label><input class="form-input" type="month" id="ra-comp-v35" value="${esc(comp)}"><div class="form-hint">Define em qual mês a receita pertence à DRE.</div></div>
          <div class="form-group"><label class="form-label">Recebimento</label><label style="display:flex;align-items:center;gap:8px;height:38px"><input type="checkbox" id="ra-recebido-v35" ${recebido?'checked':''} onchange="toggleReceitaAvulsaRecebidaV35()"> Dinheiro já entrou no caixa</label></div>
          <div class="form-group" id="ra-data-group-v35"><label class="form-label">Data real do recebimento</label><input class="form-input" type="date" id="ra-data-v35" value="${esc(r?.dataRecebimento||hoje)}"><div class="form-hint">Define o mês do caixa.</div></div>
          <div class="form-group" id="ra-forma-group-v35"><label class="form-label">Forma / conta</label><select class="form-select" id="ra-forma-v35"><option value="PIX" ${(r?.forma||'PIX')==='PIX'?'selected':''}>PIX</option><option value="Cartão" ${r?.forma==='Cartão'?'selected':''}>Cartão</option><option value="Dinheiro" ${r?.forma==='Dinheiro'?'selected':''}>Dinheiro</option><option value="Transferência" ${r?.forma==='Transferência'?'selected':''}>Transferência</option><option value="Outra" ${r?.forma==='Outra'?'selected':''}>Outra</option></select></div>
          <div class="form-group full"><label class="form-label">Observação</label><input class="form-input" id="ra-obs-v35" value="${esc(r?.observacao||'')}"></div>
        </div>
        <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:11px 12px;font-size:12px;color:#1e40af;margin-top:10px">
          <strong>Regra:</strong> competência e caixa são independentes. Ex.: competência julho + recebimento 05/08 → DRE em julho e caixa em agosto.
        </div>
      </div>
      <div style="padding:14px 22px;border-top:1px solid var(--borda);display:flex;gap:8px;justify-content:flex-end;background:#fafafa">
        ${r?`<button class="btn btn-danger" style="margin-right:auto" onclick="excluirReceitaAvulsaV35('${esc(r.id)}')">Excluir</button>`:''}
        <button class="btn btn-ghost" onclick="document.getElementById('modal-receita-avulsa-v35').remove()">Cancelar</button>
        <button class="btn btn-primary" onclick="salvarReceitaAvulsaFormV35('${esc(r?.id||'')}')">Salvar receita</button>
      </div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend',html);
  toggleReceitaAvulsaRecebidaV35();
};
window.toggleReceitaAvulsaRecebidaV35=function(){
  const on=!!document.getElementById('ra-recebido-v35')?.checked;
  const d=document.getElementById('ra-data-group-v35'),f=document.getElementById('ra-forma-group-v35');
  if(d)d.style.display=on?'':'none';
  if(f)f.style.display=on?'':'none';
};
window.salvarReceitaAvulsaFormV35=async function(id=''){
  const descricao=document.getElementById('ra-desc-v35')?.value.trim();
  const valor=Number(document.getElementById('ra-valor-v35')?.value||0);
  const competencia=document.getElementById('ra-comp-v35')?.value;
  const recebido=!!document.getElementById('ra-recebido-v35')?.checked;
  const dataRecebimento=recebido?document.getElementById('ra-data-v35')?.value:'';
  if(!descricao||valor<=0||!competencia){
    await mensagemSistemaV34('Informe descrição, valor e competência da receita.','Receita avulsa','alerta');
    return;
  }
  if(recebido&&!dataRecebimento){
    await mensagemSistemaV34('Informe a data real do recebimento.','Receita avulsa','alerta');
    return;
  }
  const anterior=id?receitasAvulsasV35.find(x=>String(x.id)===String(id)):null;
  const rid=id||`ra_${Date.now()}`;
  const r={
    ...(anterior||{}),
    id:rid,
    descricao,
    categoria:document.getElementById('ra-cat-v35')?.value||'outras',
    valor:arredV32(valor),
    competencia,
    recebido,
    dataRecebimento:recebido?dataRecebimento:'',
    forma:recebido?(document.getElementById('ra-forma-v35')?.value||'PIX'):'',
    observacao:document.getElementById('ra-obs-v35')?.value.trim()||'',
    status:'ativo',
    origem:'lancamento_manual_financeiro',
    criadoEm:anterior?.criadoEm||new Date().toISOString(),
    atualizadoEm:new Date().toISOString(),
    ts:anterior?.ts||Date.now()
  };
  try{
    await salvarReceitaAvulsaV35(r);
    await registrarAuditoria(id?'edicao_receita_avulsa':'receita_avulsa','financeiro','Financeiro',anterior||{},r);
    document.getElementById('modal-receita-avulsa-v35')?.remove();
    toast('Receita avulsa salva ✓');
    renderFinanceiroView();
  }catch(e){
    console.error(e);
    await mensagemSistemaV34('Não foi possível salvar a receita avulsa no banco.','Erro ao salvar','perigo');
  }
};
window.excluirReceitaAvulsaV35=async function(id){
  const r=receitasAvulsasV35.find(x=>String(x.id)===String(id));if(!r)return;
  const ok=await confirmarSistemaV34(
    `Excluir "${r.descricao}"?\n\nEla será removida tanto da competência quanto do caixa, se houver recebimento registrado.`,
    'Excluir receita avulsa','perigo','Excluir'
  );
  if(!ok)return;
  const novo={...r,status:'excluido',excluidoEm:new Date().toISOString(),atualizadoEm:new Date().toISOString()};
  await salvarReceitaAvulsaV35(novo);
  await registrarAuditoria('exclusao_receita_avulsa','financeiro','Financeiro',r,novo);
  document.getElementById('modal-receita-avulsa-v35')?.remove();
  toast('Receita avulsa excluída ✓');
  renderFinanceiroView();
};

// ──────────────────────────────────────────────────
// PAGAMENTO → CONTRATO: VISÍVEL + SUGESTÃO PELA DATA
// ──────────────────────────────────────────────────
function fimContratoParaVinculoV35(c){
  if(c?.status==='cancelado'&&c?.cancelamento?.dataCancelamento) return c.cancelamento.dataCancelamento;
  return c?.vencOriginal||c?.venc||'';
}
function contratoCobreDataV35(c,data){
  if(!c||c.status==='excluido'||!data)return false;
  const d=dataLocal(data),i=dataLocal(c.inicio),f=dataLocal(fimContratoParaVinculoV35(c));
  return !!(d&&i&&f&&d>=i&&d<=f);
}
function contratosDaDataV35(alunoId,data){
  return contratos
    .filter(c=>String(c.alunoId)===String(alunoId)&&c.status!=='excluido'&&contratoCobreDataV35(c,data))
    .sort((a,b)=>(dataLocal(a.inicio)?.getTime()||0)-(dataLocal(b.inicio)?.getTime()||0));
}
function statusCurtoContratoV35(c){
  if(c.status==='cancelado')return 'Cancelado';
  const s=statusContratoHistorico(c);
  return s?.label||'Contrato';
}
function contratoLabelSelectV35(c){
  return `${nomeContrato(c)} · ${fmtData(c.inicio)} → ${fmtData(fimContratoParaVinculoV35(c))} · ${statusCurtoContratoV35(c)}`;
}
function opcoesNaturezaContratoV35(c,selecionada='contrato'){
  const op=[['contrato','Pagamento do contrato / mensalidade']];
  const x=c?.cancelamento;
  if(x){
    op.push(['multa_cancelamento','Multa rescisória']);
    if(Number(x.valorAReceber||0)>0)op.push(['acordo_cancelamento','Pagamento do acordo / saldo']);
    if(Number(x.valorReembolsado||0)>0)op.push(['reembolso_cancelamento','Reembolso ao aluno']);
  }
  if(!op.some(o=>o[0]===selecionada)&&selecionada!=='aula_extra') op.push([selecionada,labelNaturezaV32(selecionada)]);
  return op;
}
function valorSugeridoNaturezaV35(c,n){
  if(!c)return 0;
  if(n==='contrato')return saldoLiquidoContratoV34(c);
  return sugestaoValorMovV32(c,n);
}
function brutoSugeridoPagamentoV35(c,n){
  if(!c)return 0;
  if(n==='contrato')return saldoBrutoContratoV34(c);
  return valorSugeridoNaturezaV35(c,n);
}
window.atualizarSugestaoContratoPorDataV35=function(){
  const alunoId=document.getElementById('pg-aluno-id-v35')?.value;
  const data=document.getElementById('pg-data')?.value;
  const atual=document.getElementById('pg-contrato-id')?.value;
  const box=document.getElementById('pg-sugestao-contrato-v35');
  if(!box)return;
  const candidatos=contratosDaDataV35(alunoId,data);
  if(candidatos.length===1){
    const s=candidatos[0];
    if(String(s.id)===String(atual)){
      box.style.background='#f0fdf4';box.style.borderColor='#bbf7d0';box.style.color='#166534';
      box.innerHTML=`✓ O contrato selecionado corresponde à data informada: <strong>${esc(nomeContrato(s))}</strong>.`;
    }else{
      box.style.background='#fffbeb';box.style.borderColor='#fde68a';box.style.color='#92400e';
      box.innerHTML=`Contrato sugerido para ${fmtData(data)}: <strong>${esc(nomeContrato(s))}</strong>. <button type="button" class="btn btn-ghost btn-sm" style="margin-left:6px" onclick="usarContratoSugeridoV35('${esc(s.id)}')">Usar sugerido</button><div style="font-size:11px;margin-top:4px">O sistema não troca o vínculo silenciosamente.</div>`;
    }
  }else if(candidatos.length>1){
    box.style.background='#fef2f2';box.style.borderColor='#fecaca';box.style.color='#991b1b';
    box.innerHTML=`⚠ Existem <strong>${candidatos.length} contratos sobrepostos</strong> nesta data. Escolha manualmente o contrato correto. Isso também aparecerá na Auditoria Financeira.`;
  }else{
    box.style.background='#f9fafb';box.style.borderColor='var(--borda)';box.style.color='var(--texto-muted)';
    box.innerHTML='Nenhum contrato cobre exatamente essa data. O vínculo selecionado será mantido e poderá ser confirmado no salvamento.';
  }
};
window.usarContratoSugeridoV35=function(id){
  const sel=document.getElementById('pg-contrato-id');if(!sel)return;
  sel.value=String(id);
  atualizarContratoPagamentoV35(true);
};
window.atualizarContratoPagamentoV35=function(forcarValor=true){
  const sel=document.getElementById('pg-contrato-id'),cid=sel?.value,c=contratos.find(x=>String(x.id)===String(cid));
  if(!c)return;
  const resumo=document.getElementById('pg-contrato-resumo-v35');
  if(resumo)resumo.innerHTML=`<strong>${esc(nomeContrato(c))}</strong><div style="font-size:11px;margin-top:3px">${fmtData(c.inicio)} → ${fmtData(fimContratoParaVinculoV35(c))} · ${esc(statusCurtoContratoV35(c))}</div><div style="font-size:11px;margin-top:3px">Bruto contrato ${fmtValor(valorTotalBrutoContratoV34(c))} · líquido/base DRE ${fmtValor(valorLiquidoContratoV34(c))}</div>`;
  const nat=document.getElementById('pg-natureza');
  const atual=nat?.value||'contrato';
  const op=opcoesNaturezaContratoV35(c,atual);
  if(nat){
    nat.innerHTML=op.map(([v,l])=>`<option value="${v}" ${v===atual?'selected':''}>${l}</option>`).join('');
    if(!op.some(o=>o[0]===atual))nat.value='contrato';
  }
  if(forcarValor){
    const n=nat?.value||'contrato';
    const v=valorSugeridoNaturezaV35(c,n);
    const el=document.getElementById('pg-valor');
    if(el&&v>0)el.value=Number(v).toFixed(2);
    const bruto=document.getElementById('pg-valor-bruto');
    if(bruto)bruto.value=Number(brutoSugeridoPagamentoV35(c,n)||v||0).toFixed(2);
  }
  atualizarNaturezaPagamentoV35(false);
  atualizarSugestaoContratoPorDataV35();
};
window.atualizarNaturezaPagamentoV35=function(forcar=true){
  const cid=document.getElementById('pg-contrato-id')?.value,c=contratos.find(x=>String(x.id)===String(cid));
  const n=document.getElementById('pg-natureza')?.value||'contrato';
  const hint=document.getElementById('pg-natureza-hint');if(hint)hint.textContent=hintNaturezaV32(n);
  const desc=document.getElementById('pg-desc');if(desc&&desc.dataset.editando!=='1')desc.value=labelNaturezaV32(n);
  if(forcar&&c){
    const v=valorSugeridoNaturezaV35(c,n),el=document.getElementById('pg-valor');
    if(el&&v>0)el.value=Number(v).toFixed(2);
    const bruto=document.getElementById('pg-valor-bruto');
    if(bruto)bruto.value=Number(brutoSugeridoPagamentoV35(c,n)||v||0).toFixed(2);
  }
  const forma=document.getElementById('pg-forma');
  if(n==='reembolso_cancelamento'&&forma?.value==='Cartão')forma.value='PIX';
  togglePgCartao();
};
window.abrirModalPagamentoContrato=function(alunoId,contratoId=null,pagamentoId=null){
  const a=alunos.find(x=>String(x.id)===String(alunoId));if(!a)return;
  const lista=contratos
    .filter(c=>String(c.alunoId)===String(alunoId)&&c.status!=='excluido')
    .sort((a,b)=>(dataLocal(b.inicio)?.getTime()||0)-(dataLocal(a.inicio)?.getTime()||0));
  if(!lista.length){mensagemSistemaV34('Cadastre um contrato antes de lançar movimentação.','Sem contrato','alerta');return;}
  const p=pagamentoId?pagamentos.find(x=>String(x.id)===String(pagamentoId)):null;
  const dataInicial=p?.data||new Date().toISOString().split('T')[0];
  const porData=contratosDaDataV35(alunoId,dataInicial);
  const c=(p?lista.find(x=>String(x.id)===String(p.contratoId)):null)
    || (contratoId?lista.find(x=>String(x.id)===String(contratoId)):null)
    || (porData.length===1?porData[0]:null)
    || contratoVigenteAluno(alunoId)
    || lista[0];
  const n0=naturezaMovAlunoV32(p);
  const op=opcoesNaturezaContratoV35(c,n0);
  const valor=p?.valor??valorSugeridoNaturezaV35(c,n0);
  const forma=p?.forma||c.pgto||'PIX';
  const bruto=p?.valorBruto??brutoSugeridoPagamentoV35(c,n0)??valor;
  const html=`<div style="position:fixed;inset:0;background:rgba(0,0,0,.58);z-index:710;display:flex;align-items:center;justify-content:center;padding:16px" id="modal-pagamento-overlay">
    <div style="background:#fff;border-radius:12px;width:100%;max-width:610px;box-shadow:var(--shadow-lg);max-height:94vh;overflow-y:auto">
      <div style="padding:19px 22px;border-bottom:1px solid var(--borda);display:flex;justify-content:space-between">
        <div><div style="font-family:'Bebas Neue',sans-serif;font-size:23px">${p?'Editar movimentação':'Registrar movimentação'}</div><div style="font-size:12px;color:var(--texto-muted)"><strong>${esc(a.nome)}</strong></div></div>
        <button class="modal-close" onclick="document.getElementById('modal-pagamento-overlay').remove()">✕</button>
      </div>
      <div style="padding:20px 22px">
        <input type="hidden" id="pg-aluno-id-v35" value="${esc(alunoId)}">
        <div class="form-grid" style="grid-template-columns:1fr">
          <div class="form-group">
            <label class="form-label">Contrato de referência</label>
            <select class="form-select" id="pg-contrato-id" onchange="atualizarContratoPagamentoV35(true)">
              ${lista.map(ct=>`<option value="${esc(ct.id)}" ${String(ct.id)===String(c.id)?'selected':''}>${esc(contratoLabelSelectV35(ct))}</option>`).join('')}
            </select>
            <div id="pg-contrato-resumo-v35" style="margin-top:7px;padding:9px 10px;background:#f9fafb;border:1px solid var(--borda);border-radius:7px;font-size:12px"></div>
          </div>
          <div class="form-group">
            <label class="form-label">Data real da movimentação</label>
            <input class="form-input" type="date" id="pg-data" value="${esc(dataInicial)}" onchange="atualizarSugestaoContratoPorDataV35()">
            <div class="form-hint">A data determina o caixa. Para pagamento normal, ela também é usada para sugerir o contrato correto.</div>
            <div id="pg-sugestao-contrato-v35" style="margin-top:7px;padding:9px 10px;border:1px solid var(--borda);border-radius:7px;font-size:12px"></div>
          </div>
          <div class="form-group">
            <label class="form-label">O que este lançamento representa?</label>
            <select class="form-select" id="pg-natureza" onchange="atualizarNaturezaPagamentoV35(true)">
              ${op.map(([v,l])=>`<option value="${v}" ${v===n0?'selected':''}>${l}</option>`).join('')}
            </select>
            <div class="form-hint" id="pg-natureza-hint">${esc(hintNaturezaV32(n0))}</div>
          </div>
          <div class="form-group"><label class="form-label">Forma</label><select class="form-select" id="pg-forma" onchange="togglePgCartao()"><option value="PIX" ${forma==='PIX'?'selected':''}>PIX</option><option value="Cartão" ${forma==='Cartão'?'selected':''}>Cartão</option><option value="Dinheiro" ${forma==='Dinheiro'?'selected':''}>Dinheiro</option></select></div>
          <div class="form-group" id="pg-bruto-group" style="display:none"><label class="form-label">Valor cobrado do aluno no cartão — bruto</label><input class="form-input" type="number" id="pg-valor-bruto" step="0.01" value="${Number(bruto||0)>0?Number(bruto).toFixed(2):''}" oninput="calcPgCartao()"></div>
          <div class="form-group"><label class="form-label" id="pg-valor-label">Valor líquido efetivamente recebido (R$)</label><input class="form-input" type="number" id="pg-valor" step="0.01" value="${Number(valor||0).toFixed(2)}" oninput="calcPgCartao()"></div>
          <div class="form-group" id="pg-cartao-resumo-group" style="display:none"><label class="form-label">Resumo do cartão</label><div class="form-input" id="pg-cartao-hint" style="background:#fff7ed;color:#92400e;min-height:40px;display:flex;align-items:center"></div></div>
          <div class="form-group" id="pg-parcelas-group" style="display:none"><label class="form-label">Parcelamento do cliente</label><select class="form-select" id="pg-parcelas"><option value="">Não informado</option>${Array.from({length:12},(_,i)=>i+1).map(n=>`<option value="${n}" ${Number(p?.parcelas||c.parcelas)===n?'selected':''}>${n}x</option>`).join('')}</select><div class="form-hint">O líquido integral entra no caixa na data registrada.</div></div>
          <div class="form-group"><label class="form-label">Descrição</label><input class="form-input" id="pg-desc" data-editando="${p?'1':'0'}" value="${esc(p?.descricao||labelNaturezaV32(n0))}"></div>
        </div>
        <div style="padding:10px 12px;margin-top:12px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;font-size:12px;color:#1e40af"><strong>Regra financeira:</strong> pagamento normal do contrato gera caixa, mas não cria uma segunda receita na DRE. A competência continua vindo exclusivamente do contrato.</div>
      </div>
      <div style="padding:14px 22px;border-top:1px solid var(--borda);display:flex;justify-content:flex-end;gap:8px;background:#fafafa">
        <button class="btn btn-ghost" onclick="document.getElementById('modal-pagamento-overlay').remove()">Cancelar</button>
        <button class="btn btn-primary" onclick="confirmarPagamentoContratoV35('${esc(alunoId)}','${esc(pagamentoId||'')}')">Salvar</button>
      </div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend',html);
  togglePgCartao();
  atualizarContratoPagamentoV35(false);
};
abrirModalPagamentoContrato=window.abrirModalPagamentoContrato;
registrarPagamento=async function(id){abrirModalPagamentoContrato(id);};
window.registrarPagamento=registrarPagamento;

window.confirmarPagamentoContratoV35=async function(alunoId,pagamentoId=''){
  const contratoId=document.getElementById('pg-contrato-id')?.value;
  const c=contratos.find(x=>String(x.id)===String(contratoId)),a=alunos.find(x=>String(x.id)===String(alunoId));
  if(!c||!a)return;
  const data=document.getElementById('pg-data')?.value;
  const valor=Number(document.getElementById('pg-valor')?.value||0);
  const natureza=document.getElementById('pg-natureza')?.value||'contrato';
  if(!data||valor<=0){
    await mensagemSistemaV34('Informe data e valor.','Movimentação','alerta');return;
  }

  if(natureza==='contrato'&&!contratoCobreDataV35(c,data)){
    const candidatos=contratosDaDataV35(alunoId,data);
    let texto=`A data ${fmtData(data)} não pertence ao período do contrato selecionado:\n${nomeContrato(c)}.`;
    if(candidatos.length===1)texto+=`\n\nContrato sugerido para a data: ${nomeContrato(candidatos[0])}.`;
    texto+='\n\nDeseja manter o vínculo escolhido mesmo assim?';
    const ok=await confirmarSistemaV34(texto,'Data fora do contrato','alerta','Manter vínculo');
    if(!ok)return;
  }

  const existente=pagamentoId?pagamentos.find(p=>String(p.id)===String(pagamentoId)):null;
  const forma=document.getElementById('pg-forma')?.value||'PIX';
  const parcelas=forma==='Cartão'?(parseInt(document.getElementById('pg-parcelas')?.value)||null):null;
  const valorBruto=forma==='Cartão'?(Number(document.getElementById('pg-valor-bruto')?.value||0)||null):null;
  if(forma==='Cartão'&&valorBruto&&valorBruto<valor){
    await mensagemSistemaV34('No cartão, o valor bruto não pode ser menor que o líquido recebido.','Confira o cartão','perigo');return;
  }
  const id=pagamentoId||`pg_${contratoId}_${Date.now()}`;
  const pg={
    ...(existente||{}),
    id,
    contratoId:String(contratoId),
    alunoId:String(alunoId),
    alunoNome:a.nome,
    natureza,
    valor:arredV32(valor),
    valorLiquido:arredV32(valor),
    valorBruto,
    taxaCartaoValor:forma==='Cartão'&&valorBruto?arredV32(valorBruto-valor):null,
    data,forma,parcelas,
    descricao:document.getElementById('pg-desc')?.value.trim()||labelNaturezaV32(natureza),
    direcaoCaixa:natureza==='reembolso_cancelamento'?'saida':'entrada',
    impactaDRE:natureza==='multa_cancelamento',
    competenciaDRE:natureza==='multa_cancelamento'?ymV32(data):'',
    status:'ativo',
    ts:existente?.ts||Date.now(),
    criadoEm:existente?.criadoEm||new Date().toISOString(),
    atualizadoEm:new Date().toISOString()
  };
  await salvarPagamentoDb(pg);
  await registrarAuditoria(pagamentoId?'edicao_movimentacao_aluno':'movimentacao_aluno',alunoId,a.nome,existente||{},pg);
  document.getElementById('modal-pagamento-overlay')?.remove();
  toast(natureza==='reembolso_cancelamento'?'Reembolso registrado como saída de caixa ✓':'Movimentação salva ✓');
  abrirPerfilAluno(alunoId);
};
window.confirmarPagamentoContrato=window.confirmarPagamentoContratoV35;
window.confirmarPagamentoContratoV32=window.confirmarPagamentoContratoV35;

// ──────────────────────────────────────────────────
// RASTREABILIDADE DA RECEITA
// ──────────────────────────────────────────────────
function linhaReceitaPorOrigemV35(tipo,id,mes,ano,modo='competencia'){
  const lista=modo==='caixa'?linhasReceitaCaixaV35(mes,ano):linhasReceitaCompetenciaV35(mes,ano);
  return lista.find(l=>String(l.origemId)===String(id)&&(l.tipo===tipo||l.subtipo===tipo))||lista.find(l=>String(l.origemId)===String(id));
}
window.rastrearReceitaV35=function(tipo,id,mes,ano,modo='competencia'){
  const l=linhaReceitaPorOrigemV35(tipo,id,Number(mes),Number(ano),modo);
  if(!l){mensagemSistemaV34('A origem dessa linha não foi encontrada. Atualize o Financeiro e tente novamente.','Rastreamento','alerta');return;}
  let corpo='';
  if(l.tipo==='contrato'){
    const c=l.contrato;
    corpo=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:12px">
      <div><strong>Aluno</strong><br>${esc(c.alunoNome||'—')}</div>
      <div><strong>Status</strong><br>${esc(c.status||'ativo')}</div>
      <div><strong>Contrato ID</strong><br><code>${esc(c.id)}</code></div>
      <div><strong>Plano</strong><br>${esc(PLANO_LABEL[c.plano]||c.plano||'—')}</div>
      <div><strong>Período</strong><br>${fmtData(c.inicio)} → ${fmtData(fimContratoParaVinculoV35(c))}</div>
      <div><strong>Competência</strong><br>${esc(l.detalhe)}</div>
      <div><strong>Valor bruto contrato</strong><br>${fmtValor(valorTotalBrutoContratoV34(c))}</div>
      <div><strong>Valor líquido/base DRE</strong><br>${fmtValor(valorLiquidoContratoV34(c))}</div>
      <div><strong>Valor desta competência</strong><br>${fmtValor(l.valor)}</div>
      <div><strong>Origem</strong><br>${esc(c.origem||'cadastro do contrato')}</div>
    </div>`;
  }else if(l.receitaAvulsa){
    const r=l.receitaAvulsa;
    corpo=`<div style="font-size:12px;line-height:1.7"><strong>Receita avulsa ID:</strong> <code>${esc(r.id)}</code><br><strong>Descrição:</strong> ${esc(r.descricao)}<br><strong>Categoria:</strong> ${esc(categoriaReceitaAvulsaV35(r.categoria))}<br><strong>Competência:</strong> ${esc(r.competencia)}<br><strong>Valor:</strong> ${fmtValor(r.valor)}<br><strong>Recebida:</strong> ${r.recebido?'Sim':'Não'}${r.recebido?`<br><strong>Data do caixa:</strong> ${fmtData(r.dataRecebimento)} · ${esc(r.forma||'—')}`:''}</div>`;
  }else if(l.pagamento){
    const p=l.pagamento,c=contratos.find(x=>String(x.id)===String(p.contratoId));
    corpo=`<div style="font-size:12px;line-height:1.7"><strong>Movimento ID:</strong> <code>${esc(p.id)}</code><br><strong>Aluno:</strong> ${esc(p.alunoNome||'—')}<br><strong>Natureza:</strong> ${esc(labelNaturezaV32(p))}<br><strong>Contrato ID:</strong> <code>${esc(p.contratoId||'—')}</code><br><strong>Contrato:</strong> ${esc(c?nomeContrato(c):'Não encontrado')}<br><strong>Data:</strong> ${fmtData(p.data)}<br><strong>Valor líquido:</strong> ${fmtValor(p.valor)}${p.valorBruto?`<br><strong>Bruto:</strong> ${fmtValor(p.valorBruto)}`:''}</div>`;
  }
  const html=`<div style="position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:720;display:flex;align-items:center;justify-content:center;padding:16px" id="modal-rastreio-v35"><div style="background:#fff;border-radius:12px;max-width:650px;width:100%;box-shadow:var(--shadow-lg)"><div style="padding:18px 22px;border-bottom:1px solid var(--borda);display:flex;justify-content:space-between"><div><div style="font-family:'Bebas Neue',sans-serif;font-size:23px">Rastrear composição</div><div style="font-size:12px;color:var(--texto-muted)">Cada centavo da DRE/caixa deve ter uma origem identificável.</div></div><button class="modal-close" onclick="document.getElementById('modal-rastreio-v35').remove()">✕</button></div><div style="padding:20px 22px">${corpo}</div><div style="padding:14px 22px;border-top:1px solid var(--borda);text-align:right"><button class="btn btn-primary" onclick="document.getElementById('modal-rastreio-v35').remove()">Fechar</button></div></div></div>`;
  document.body.insertAdjacentHTML('beforeend',html);
};

// ──────────────────────────────────────────────────
// AUDITORIA FINANCEIRA
// ──────────────────────────────────────────────────
function intervaloContratoAuditoriaV35(c){
  const i=dataLocal(c?.inicio);
  const f=dataLocal(fimContratoParaVinculoV35(c));
  return {i,f};
}
function contratosSobrepostosV35(a,b){
  const A=intervaloContratoAuditoriaV35(a),B=intervaloContratoAuditoriaV35(b);
  return !!(A.i&&A.f&&B.i&&B.f&&A.i<=B.f&&B.i<=A.f);
}
function auditoriaFinanceiraV35(){
  const problemas=[];
  const validos=contratos.filter(c=>c.status!=='excluido');
  const pagos=pagamentos.filter(p=>p.status!=='excluido');

  validos.filter(c=>c.origem==='migracao_campos_antigos').forEach(c=>{
    problemas.push({nivel:'alerta',tipo:'contrato_legado',titulo:'Contrato criado por migração antiga ainda ativo',detalhe:`${c.alunoNome||'—'} · ${nomeContrato(c)} · ID ${c.id}`,alunoId:c.alunoId,origemId:c.id});
  });

  const porAluno={};
  validos.forEach(c=>(porAluno[String(c.alunoId||'')]=porAluno[String(c.alunoId||'')]||[]).push(c));
  Object.values(porAluno).forEach(lista=>{
    lista.sort((a,b)=>(dataLocal(a.inicio)?.getTime()||0)-(dataLocal(b.inicio)?.getTime()||0));
    for(let i=0;i<lista.length;i++){
      for(let j=i+1;j<lista.length;j++){
        const a=lista[i],b=lista[j];
        if(!contratosSobrepostosV35(a,b))continue;
        const exato=String(a.inicio)===String(b.inicio)&&String(fimContratoParaVinculoV35(a))===String(fimContratoParaVinculoV35(b))&&String(a.plano)===String(b.plano)&&Math.abs(valorLiquidoContratoV34(a)-valorLiquidoContratoV34(b))<0.01;
        problemas.push({
          nivel:exato?'erro':'alerta',
          tipo:exato?'contrato_duplicado':'contrato_sobreposto',
          titulo:exato?'Possível contrato duplicado':'Contratos com períodos sobrepostos',
          detalhe:`${a.alunoNome||b.alunoNome||'—'} · ${nomeContrato(a)} [${a.id}] × ${nomeContrato(b)} [${b.id}]`,
          alunoId:a.alunoId,origemId:a.id,origemId2:b.id
        });
      }
    }
  });

  const mapaContrato=new Map(contratos.map(c=>[String(c.id),c]));
  pagos.forEach(p=>{
    if(!p.contratoId){
      problemas.push({nivel:'erro',tipo:'pagamento_sem_contrato',titulo:'Movimentação sem contratoId',detalhe:`${p.alunoNome||'—'} · ${fmtData(p.data)} · ${fmtValor(p.valor)} · ID ${p.id}`,alunoId:p.alunoId,origemId:p.id});
      return;
    }
    const c=mapaContrato.get(String(p.contratoId));
    if(!c){
      problemas.push({nivel:'erro',tipo:'pagamento_orfao',titulo:'Movimentação aponta para contrato inexistente',detalhe:`${p.alunoNome||'—'} · pagamento ${p.id} → contrato ${p.contratoId}`,alunoId:p.alunoId,origemId:p.id});
    }else{
      if(c.status==='excluido'){
        problemas.push({nivel:'alerta',tipo:'pagamento_contrato_excluido',titulo:'Movimentação vinculada a contrato arquivado',detalhe:`${p.alunoNome||'—'} · ${fmtData(p.data)} · contrato ${c.id}`,alunoId:p.alunoId,origemId:p.id});
      }
      if(String(c.alunoId)!==String(p.alunoId)){
        problemas.push({nivel:'erro',tipo:'pagamento_aluno_divergente',titulo:'Aluno da movimentação diverge do contrato',detalhe:`Pagamento ${p.id}: aluno ${p.alunoId} · contrato ${c.id}: aluno ${c.alunoId}`,alunoId:p.alunoId,origemId:p.id});
      }
    }
  });

  const dupPg=new Map();
  pagos.forEach(p=>{
    const chave=[p.alunoId,p.contratoId,p.data,arredV32(Number(p.valor||0)),naturezaMovAlunoV32(p)].join('|');
    if(!dupPg.has(chave))dupPg.set(chave,[]);
    dupPg.get(chave).push(p);
  });
  dupPg.forEach(lista=>{
    if(lista.length>1)problemas.push({nivel:'alerta',tipo:'pagamento_duplicado',titulo:'Possível movimentação duplicada',detalhe:`${lista[0].alunoNome||'—'} · ${fmtData(lista[0].data)} · ${fmtValor(lista[0].valor)} · IDs ${lista.map(x=>x.id).join(', ')}`,alunoId:lista[0].alunoId,origemId:lista[0].id});
  });

  receitasAvulsasV35.filter(receitaAvulsaAtivaV35).forEach(r=>{
    if(!r.competencia||Number(r.valor||0)<=0)problemas.push({nivel:'erro',tipo:'receita_avulsa_invalida',titulo:'Receita avulsa incompleta',detalhe:`${r.descricao||r.id} · ID ${r.id}`,origemId:r.id});
    if(r.recebido&&!r.dataRecebimento)problemas.push({nivel:'erro',tipo:'receita_avulsa_sem_data',titulo:'Receita recebida sem data de caixa',detalhe:`${r.descricao||r.id} · ID ${r.id}`,origemId:r.id});
  });

  // Garantia verificável: nenhum contrato excluído pode gerar linha no mês atual selecionado.
  contratos.filter(c=>c.status==='excluido').forEach(c=>{
    if(contratoContaCompetenciaMes(c,finMes,finAno)){
      problemas.push({nivel:'erro',tipo:'competencia_contrato_excluido',titulo:'Contrato arquivado ainda impactando a DRE',detalhe:`${c.alunoNome||'—'} · ${c.id} · ${MESES_NOMES[finMes]} ${finAno}`,alunoId:c.alunoId,origemId:c.id});
    }
  });

  return {
    contratosValidos:validos.length,
    contratosArquivados:contratos.filter(c=>c.status==='excluido').length,
    pagamentosAtivos:pagos.length,
    receitasAvulsasAtivas:receitasAvulsasV35.filter(receitaAvulsaAtivaV35).length,
    problemas,
    erros:problemas.filter(p=>p.nivel==='erro').length,
    alertas:problemas.filter(p=>p.nivel==='alerta').length
  };
}
function htmlAuditoriaFinanceiraV35(){
  const a=auditoriaFinanceiraV35();
  const cor=a.erros?'var(--vermelho)':a.alertas?'#b45309':'var(--verde)';
  const titulo=a.erros?`${a.erros} erro(s) e ${a.alertas} alerta(s)`:a.alertas?`${a.alertas} alerta(s)`:'Nenhuma inconsistência detectada';
  const rows=a.problemas.map(p=>`<tr><td><span class="badge" style="color:${p.nivel==='erro'?'var(--vermelho)':'#92400e'};background:${p.nivel==='erro'?'#fef2f2':'#fffbeb'}">${p.nivel==='erro'?'ERRO':'ALERTA'}</span></td><td><strong>${esc(p.titulo)}</strong><div style="font-size:11px;color:var(--texto-muted);margin-top:3px">${esc(p.detalhe)}</div></td><td style="text-align:right">${p.alunoId?`<button class="btn btn-ghost btn-sm" onclick="abrirPerfilAluno('${esc(p.alunoId)}')">Ver aluno</button>`:''}</td></tr>`).join('');
  return `<div class="section-box" id="auditoria-financeira-v35" style="margin-top:24px;border-top:3px solid ${cor}">
    <div class="section-header"><div><div class="section-title">Auditoria Financeira</div><div style="font-size:12px;color:var(--texto-muted)">Verifica contratos sobrepostos/duplicados, movimentos órfãos e dados que podem contaminar DRE ou caixa.</div></div><div style="text-align:right;font-size:12px"><strong style="color:${cor}">${esc(titulo)}</strong><div style="color:var(--texto-muted);margin-top:3px">${a.contratosValidos} contratos · ${a.pagamentosAtivos} movimentos · ${a.receitasAvulsasAtivas} receitas avulsas</div></div></div>
    ${a.problemas.length?`<div class="table-wrap"><table><thead><tr><th>Nível</th><th>Inconsistência</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>`:`<div style="padding:18px;color:var(--verde);font-weight:700">✓ Nenhuma inconsistência estrutural encontrada nos dados carregados.</div>`}
  </div>`;
}

// ──────────────────────────────────────────────────
// FINANCEIRO — DRE / CAIXA AUDITÁVEIS
// ──────────────────────────────────────────────────
renderFinanceiroView=async function(){
  loading(true);
  await Promise.all([carregarMovCaixa(),carregarReceitasAvulsasV35(),carregarNotasFiscaisV24()]);
  const cats=await loadDespesas(finMes,finAno);
  const despComp=totalDesp(cats),despCx=totalDespesaCaixaV32(finMes,finAno);
  const linhasComp=linhasReceitaCompetenciaV35(finMes,finAno),linhasCx=linhasReceitaCaixaV35(finMes,finAno);
  const recComp=linhasComp.reduce((s,l)=>s+Number(l.valor||0),0),recCx=linhasCx.reduce((s,l)=>s+Number(l.valor||0),0);
  const rec=financeiroModo==='competencia'?recComp:recCx,desp=financeiroModo==='competencia'?despComp:despCx,res=rec-desp;

  let linhasReceita='';
  if(financeiroModo==='competencia'){
    linhasReceita=linhasComp.map(l=>{
      const nfItem={
        tipo:l.tipo,origemId:l.origemId,key:chaveNFV24(l.tipo,l.origemId,finMes,finAno),
        alunoId:l.alunoId||'',alunoNome:l.alunoNome||'—',contrato:l.contrato,
        descricao:l.descricao,detalhe:l.detalhe,valor:l.valor,pagamento:l.pagamento,receitaAvulsa:l.receitaAvulsa,mes:finMes,ano:finAno
      };
      return `<tr>
        <td><strong>${esc(l.alunoNome||'—')}</strong><div style="font-size:10px;color:var(--texto-muted);margin-top:3px">${esc(l.tipo)}</div></td>
        <td>${esc(l.descricao)}<div style="font-size:11px;color:var(--texto-muted)">${esc(l.detalhe||'')}</div><div style="font-size:10px;color:#9ca3af;margin-top:3px">Origem: ${esc(l.tipo)} · ${esc(l.origemId)}</div></td>
        <td style="text-align:right;color:var(--verde);font-weight:700">${fmtValor(l.valor)}</td>
        <td style="text-align:center">${chipNFV24(nfItem)}</td>
        <td style="text-align:right;white-space:nowrap"><button class="btn btn-ghost btn-sm" onclick="rastrearReceitaV35('${esc(l.tipo)}','${esc(l.origemId)}',${finMes},${finAno},'competencia')">🔎 Rastrear</button>${l.tipo==='receita_avulsa'?` <button class="btn btn-ghost btn-sm" onclick="abrirModalReceitaAvulsaV35('${esc(l.origemId)}')">✏️</button>`:''}</td>
      </tr>`;
    }).join('');
  }else{
    linhasReceita=linhasCx.map(l=>`<tr>
      <td>${fmtData(l.data)}</td>
      <td><strong>${esc(l.alunoNome||'—')}</strong><div style="font-size:12px">${esc(l.descricao)}</div><div style="font-size:11px;color:var(--texto-muted)">${esc(l.detalhe||'')}</div><div style="font-size:10px;color:#9ca3af;margin-top:3px">Origem: ${esc(l.tipo)} · ${esc(l.origemId)}</div></td>
      <td style="text-align:right;font-weight:700;color:${Number(l.valor)<0?'var(--vermelho)':'var(--verde)'}">${Number(l.valor)<0?'-':''}${fmtValor(Math.abs(Number(l.valor)))}</td>
      <td style="text-align:right;white-space:nowrap"><button class="btn btn-ghost btn-sm" onclick="rastrearReceitaV35('${esc(l.tipo)}','${esc(l.origemId)}',${finMes},${finAno},'caixa')">🔎 Rastrear</button>${l.tipo==='receita_avulsa'?` <button class="btn btn-ghost btn-sm" onclick="abrirModalReceitaAvulsaV35('${esc(l.origemId)}')">✏️</button>`:''}</td>
    </tr>`).join('');
  }

  let linhasDesp='';
  if(financeiroModo==='competencia'){
    Object.entries(cats||{}).forEach(([cat,lista])=>(lista||[]).filter(d=>Number(d.valor)>0).forEach(d=>{
      linhasDesp+=`<tr><td>${esc(d.desc)}<div style="font-size:11px;color:var(--texto-muted)">${esc(catLabelV32(cat))}</div></td><td style="text-align:right;font-weight:700">${fmtValor(d.valor)}</td></tr>`;
    }));
  }else{
    movDespesasMesV32(finMes,finAno).forEach(m=>{
      linhasDesp+=`<tr><td>${fmtData(m.data)}</td><td>${esc(m.descricao||'Despesa')}<div style="font-size:11px;color:var(--texto-muted)">Competência ${esc(m.competencia||'—')}${m.conta?` · ${esc(m.conta)}`:''}</div></td><td style="text-align:right;font-weight:700;color:var(--vermelho)">-${fmtValor(m.valor)}</td></tr>`;
    });
  }

  const anual=[];
  for(let m=0;m<12;m++){
    const r=financeiroModo==='competencia'?receitaMesEsp(m,finAno):receitaCaixaMes(m,finAno);
    const d=financeiroModo==='competencia'?totalDesp(await loadDespesas(m,finAno)):totalDespesaCaixaV32(m,finAno);
    anual.push({m,r,d,res:r-d});
  }
  const ar=anual.reduce((s,x)=>s+x.r,0),ad=anual.reduce((s,x)=>s+x.d,0),ares=ar-ad;
  const nfResumo=financeiroModo==='competencia'?resumoNotasFiscaisV24():null;

  document.getElementById('content').innerHTML=`
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:12px">
      <div class="mes-selector"><button class="mes-btn" onclick="navegarFin(-1)">◀</button><div class="mes-label">${MESES_NOMES[finMes]} ${finAno}</div><button class="mes-btn" onclick="navegarFin(1)">▶</button></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn ${financeiroModo==='competencia'?'btn-primary':'btn-ghost'} btn-sm" onclick="setModoFinanceiro('competencia')">Competência</button>
        <button class="btn ${financeiroModo==='caixa'?'btn-primary':'btn-ghost'} btn-sm" onclick="setModoFinanceiro('caixa')">Caixa</button>
        <button class="btn btn-success btn-sm" onclick="abrirModalReceitaAvulsaV35()">+ Receita avulsa</button>
        <button class="btn btn-ghost btn-sm" onclick="setView('despesas')">✏️ Despesas / baixas</button>
        <button class="btn btn-primary btn-sm" onclick="imprimirDREV35()">🖨️ Imprimir</button>
      </div>
    </div>

    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:12px 16px;font-size:13px;margin-bottom:20px">
      <strong>${financeiroModo==='competencia'?'DRE por competência':'Caixa realizado'}.</strong>
      ${financeiroModo==='competencia'
        ?'Contrato gera competência pelo valor líquido do ciclo. Pagamento normal não gera segunda receita.'
        :'Entram apenas recebimentos e saídas efetivamente registrados por data real.'}
      Competência: <strong>${fmtValor(recComp)}</strong> · Caixa líquido: <strong>${recCx<0?'-':''}${fmtValor(Math.abs(recCx))}</strong>.
    </div>

    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px">
      <div class="card" style="border-top:3px solid var(--verde)"><div class="card-label">${financeiroModo==='competencia'?'Receita DRE':'Entradas / saídas de receita'}</div><div class="card-value" style="font-size:24px;color:${rec>=0?'var(--verde)':'var(--vermelho)'}">${rec<0?'-':''}${fmtValor(Math.abs(rec))}</div><div class="card-sub">${financeiroModo==='competencia'?`${linhasComp.length} linha(s) com origem rastreável`:`Entradas ${fmtValor(entradasReceitaCaixaV35(finMes,finAno))} · saídas ${fmtValor(saidasReceitaCaixaV35(finMes,finAno))}`}</div></div>
      <div class="card" style="border-top:3px solid var(--vermelho)"><div class="card-label">${financeiroModo==='competencia'?'Despesas DRE':'Despesas pagas no caixa'}</div><div class="card-value" style="font-size:24px;color:var(--vermelho)">${fmtValor(desp)}</div><div class="card-sub">${financeiroModo==='caixa'?`Competência do mês: ${fmtValor(despComp)}`:'competência cadastrada em Despesas'}</div></div>
      <div class="card" style="border-top:3px solid ${res>=0?'var(--verde)':'var(--vermelho)'}"><div class="card-label">Resultado</div><div class="card-value" style="font-size:24px;color:${res>=0?'var(--verde)':'var(--vermelho)'}">${res<0?'-':''}${fmtValor(Math.abs(res))}</div><div class="card-sub">${financeiroModo==='competencia'?'resultado DRE':'caixa líquido realizado'}</div></div>
    </div>

    ${financeiroModo==='competencia'&&nfResumo?`<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:18px">
      <div class="card" style="border-top:3px solid #b45309"><div class="card-label">Notas fiscais a emitir</div><div class="card-value" style="font-size:21px;color:#b45309">${fmtValor(nfResumo.valEmitir)}</div><div class="card-sub">${nfResumo.qtdEmitir} receita(s)</div></div>
      <div class="card" style="border-top:3px solid var(--verde)"><div class="card-label">NF sem pendência</div><div class="card-value" style="font-size:21px;color:var(--verde)">${fmtValor(nfResumo.valEmitida)}</div><div class="card-sub">${nfResumo.qtdEmitida} receita(s)</div></div>
    </div>`:''}

    <div class="section-box" style="margin-bottom:24px">
      <div class="section-header"><div><div class="section-title">${financeiroModo==='competencia'?'Receita — Competência':'Receitas / movimentos — Caixa'}</div><div style="font-size:12px;color:var(--texto-muted)">Cada linha mostra o ID da origem e pode ser rastreada.</div></div></div>
      <div class="table-wrap"><table>
        <thead><tr>${financeiroModo==='competencia'
          ?'<th>Aluno / origem</th><th>Natureza / competência</th><th style="text-align:right">Valor</th><th style="text-align:center">NF</th><th></th>'
          :'<th>Data</th><th>Origem / natureza</th><th style="text-align:right">Entrada / saída</th><th></th>'}</tr></thead>
        <tbody>${linhasReceita||`<tr><td colspan="${financeiroModo==='competencia'?5:4}"><div class="empty">Nenhuma receita neste mês.</div></td></tr>`}</tbody>
      </table></div>
    </div>

    <div class="section-box" style="margin-bottom:24px">
      <div class="section-header"><div><div class="section-title">${financeiroModo==='competencia'?'Despesas por competência':'Despesas efetivamente pagas'}</div><div style="font-size:12px;color:var(--texto-muted)">${financeiroModo==='competencia'?'Origem: página Despesas.':'Origem: baixas reais das despesas.'}</div></div></div>
      <div class="table-wrap"><table><thead><tr>${financeiroModo==='competencia'?'<th>Despesa</th><th style="text-align:right">Valor</th>':'<th>Data</th><th>Despesa</th><th style="text-align:right">Saída</th>'}</tr></thead><tbody>${linhasDesp||`<tr><td colspan="${financeiroModo==='competencia'?2:3}"><div class="empty">Nenhuma despesa.</div></td></tr>`}</tbody></table></div>
    </div>

    <div class="section-box">
      <div class="section-header"><div><div class="section-title">${financeiroModo==='competencia'?'DRE anual — Competência':'Caixa realizado anual'} — ${finAno}</div><div style="font-size:12px;color:var(--texto-muted)">${financeiroModo==='competencia'?'Somente origens válidas de competência.':'Não projeta pagamentos futuros.'}</div></div><div style="font-size:12px;color:var(--texto-muted)">Rec: <strong style="color:var(--verde)">${fmtValor(ar)}</strong> · Desp: <strong style="color:var(--vermelho)">${fmtValor(ad)}</strong> · Res: <strong style="color:${ares>=0?'var(--verde)':'var(--vermelho)'}">${ares<0?'-':''}${fmtValor(Math.abs(ares))}</strong></div></div>
      <div class="table-wrap"><table><thead><tr><th>Mês</th><th>Receita / entradas</th><th>Despesas</th><th>Resultado</th></tr></thead><tbody>${anual.map(x=>`<tr><td><strong>${MESES_ABREV[x.m]}</strong></td><td style="color:${x.r>=0?'var(--verde)':'var(--vermelho)'}">${x.r<0?'-':''}${fmtValor(Math.abs(x.r))}</td><td style="color:var(--vermelho)">${fmtValor(x.d)}</td><td style="font-weight:700;color:${x.res>=0?'var(--verde)':'var(--vermelho)'}">${x.res<0?'-':''}${fmtValor(Math.abs(x.res))}</td></tr>`).join('')}</tbody></table></div>
    </div>

    ${htmlAuditoriaFinanceiraV35()}
  `;
};
window.renderFinanceiroView=renderFinanceiroView;

// ──────────────────────────────────────────────────
// IMPRESSÃO DRE / CAIXA V35
// ──────────────────────────────────────────────────
window.imprimirDREV35=async function(){
  await carregarReceitasAvulsasV35();
  const cats=await loadDespesas(finMes,finAno),modo=financeiroModo;
  const linhas=modo==='competencia'?linhasReceitaCompetenciaV35(finMes,finAno):linhasReceitaCaixaV35(finMes,finAno);
  const rec=linhas.reduce((s,l)=>s+Number(l.valor||0),0);
  const desp=modo==='competencia'?totalDesp(cats):totalDespesaCaixaV32(finMes,finAno);
  const res=rec-desp;
  let lr='';
  linhas.forEach(l=>{
    lr+=`<tr><td>${esc(l.alunoNome||'—')} — ${esc(l.descricao)}<div class="sub">${esc(l.detalhe||'')} · origem ${esc(l.tipo)} / ${esc(l.origemId)}</div></td><td class="num" style="color:${Number(l.valor)<0?'#D32F2F':'#2e7d32'}">${Number(l.valor)<0?'-':''}${fmtValor(Math.abs(Number(l.valor)))}</td></tr>`;
  });
  let ld='';
  if(modo==='competencia')Object.entries(cats||{}).forEach(([cat,lista])=>(lista||[]).filter(d=>Number(d.valor)>0).forEach(d=>ld+=`<tr><td>${esc(d.desc)}<div class="sub">${esc(catLabelV32(cat))}</div></td><td class="num">${fmtValor(d.valor)}</td></tr>`));
  else movDespesasMesV32(finMes,finAno).forEach(m=>ld+=`<tr><td>${esc(m.descricao||'Despesa')}<div class="sub">${fmtData(m.data)} · competência ${esc(m.competencia||'—')}</div></td><td class="num">${fmtValor(m.valor)}</td></tr>`);

  const titulo=modo==='competencia'?'DRE — Regime de Competência':'Resumo de Caixa Realizado';
  const html=`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${titulo}</title><style>body{font-family:Arial,sans-serif;max-width:800px;margin:auto;padding:30px;color:#111}h1{border-bottom:3px solid #111;padding-bottom:12px}h2{font-size:15px;background:#111;color:#fff;padding:8px;margin:22px 0 0}table{width:100%;border-collapse:collapse;border:1px solid #eee}td,th{padding:8px;border-bottom:1px solid #eee}.num{text-align:right;font-weight:700}.sub{font-size:10px;color:#777;margin-top:3px}.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:18px 0}.card{border:1px solid #ddd;border-radius:7px;padding:12px}.no-print{padding:10px 20px}@media print{.no-print{display:none}}</style></head><body><button class="no-print" onclick="window.print()">Imprimir / Salvar PDF</button><h1>Studio FB — ${titulo}</h1><div>${MESES_NOMES[finMes]} de ${finAno}</div><div class="cards"><div class="card"><small>Receita</small><div style="font-size:21px;color:#2e7d32">${rec<0?'-':''}${fmtValor(Math.abs(rec))}</div></div><div class="card"><small>Despesas</small><div style="font-size:21px;color:#D32F2F">${fmtValor(desp)}</div></div><div class="card"><small>Resultado</small><div style="font-size:21px;color:${res>=0?'#2e7d32':'#D32F2F'}">${res<0?'-':''}${fmtValor(Math.abs(res))}</div></div></div><h2>Receitas com origem</h2><table><tbody>${lr||'<tr><td>Nenhum registro.</td><td class="num">R$ 0,00</td></tr>'}</tbody></table><h2>Despesas</h2><table><tbody>${ld||'<tr><td>Nenhum registro.</td><td class="num">R$ 0,00</td></tr>'}</tbody></table><p style="font-size:11px;color:#666;margin-top:18px">${modo==='competencia'?'Pagamento normal não duplica receita: a competência contratual nasce somente do contrato.':'Caixa contém apenas datas reais de entradas e saídas registradas.'}</p></body></html>`;
  const w=window.open('','_blank');
  if(!w){mensagemSistemaV34('Libere pop-ups para imprimir.','Impressão bloqueada','alerta');return;}
  w.document.write(html);w.document.close();
};
imprimirDRE=window.imprimirDREV35;

// ──────────────────────────────────────────────────
// DASHBOARD / CAIXA: receita avulsa entra nos totais
// ──────────────────────────────────────────────────
const renderDashboardBaseV35=renderDashboard;
renderDashboard=async function(){
  await carregarReceitasAvulsasV35();
  return renderDashboardBaseV35();
};
window.renderDashboard=renderDashboard;

const renderCaixaBaseV35=renderCaixaView;
renderCaixaView=async function(){
  await carregarReceitasAvulsasV35();
  await renderCaixaBaseV35();
  if(caixaVisao==='mensal'){
    const box=[...document.querySelectorAll('#content .section-box')].find(el=>(el.querySelector('.section-title')?.textContent||'').toLowerCase().includes('receb'));
    const av=receitasAvulsasCaixaMesV35(cxMes,cxAno);
    if(box&&av.length&&!box.querySelector('.receitas-avulsas-caixa-v35')){
      box.insertAdjacentHTML('beforeend',`<div class="receitas-avulsas-caixa-v35" style="padding:12px 16px;border-top:1px solid var(--borda);font-size:12px"><strong>Receitas avulsas recebidas:</strong> ${av.map(r=>`${esc(r.descricao)} (${fmtValor(r.valor)} em ${fmtData(r.dataRecebimento)})`).join(' · ')}</div>`);
    }
  }
};
window.renderCaixaView=renderCaixaView;

// ──────────────────────────────────────────────────
// INICIALIZAÇÃO: CARREGA RECEITAS AVULSAS ANTES DO DASHBOARD
// ──────────────────────────────────────────────────
init=async function(){
  loading(true);
  ensureCaixaMenu();
  await carregarAlunos();
  await carregarContratos();
  await carregarPagamentos();
  await carregarReceitasAvulsasV35();
  await carregarPessoalV20();
  hidratarAlunosComContratos();
  await loadDespesas(MES_ATUAL,ANO_ATUAL);
  renderDashboard();
  setTimeout(()=>precarregarCaixaEmSegundoPlano(),600);
};

// ──────────────────────────────────────────────────
// PERFIL: mostra o ID do contrato para conferência
// ──────────────────────────────────────────────────
const abrirPerfilBaseV35=abrirPerfilAluno;
abrirPerfilAluno=async function(id){
  await abrirPerfilBaseV35(id);
  setTimeout(()=>{
    document.querySelectorAll('[data-cancelamento-v29],.btn-cancelamento-v26').forEach(btn=>{
      const cid=btn.dataset.cancelamentoV29||((btn.getAttribute('onclick')||'').match(/abrirModalCancelamentoV26\('[^']+','([^']+)'\)/)||[])[1];
      const c=contratos.find(x=>String(x.id)===String(cid));
      const td=btn.closest('td');
      if(c&&td&&!td.querySelector('.contrato-id-v35')){
        const el=document.createElement('div');
        el.className='contrato-id-v35';
        el.style.cssText='font-size:9.5px;color:#9ca3af;margin-top:4px';
        el.textContent=`ID: ${c.id}`;
        td.appendChild(el);
      }
    });
  },0);
};
window.abrirPerfilAluno=abrirPerfilAluno;

// ═══════════════════════════════════════════════════
// V36 — EXCLUSÃO REAL ≠ CANCELAMENTO
//
// CANCELADO:
// - contrato existiu;
// - mantém competências válidas até o cancelamento;
// - movimentos posteriores só entram quando registrados.
//
// EXCLUÍDO:
// - preservado apenas para auditoria;
// - zero DRE;
// - zero caixa;
// - zero saldo/provisão;
// - movimentos vinculados são desconsiderados.
// ═══════════════════════════════════════════════════
const VERSAO_INTEGRIDADE_V36 = '36.0';

function contratoExcluidoV36(c){
  return !!c && c.status === 'excluido';
}
function contratoPorIdV36(id){
  return contratos.find(c=>String(c.id)===String(id)) || null;
}
function pagamentoFinanceiroValidoV36(p){
  if(!p || p.status==='excluido') return false;
  if(!p.contratoId) return true;
  const c=contratoPorIdV36(p.contratoId);
  // Movimento órfão continua visível/auditável. Somente contrato explicitamente
  // excluído invalida automaticamente o movimento financeiro.
  if(c && contratoExcluidoV36(c)) return false;
  return true;
}

// ──────────────────────────────────────────────────
// FILTRO CENTRAL: CONTRATO EXCLUÍDO NÃO PARTICIPA
// ──────────────────────────────────────────────────
pagamentosDoContrato = function(contratoId){
  const c=contratoPorIdV36(contratoId);
  if(c && contratoExcluidoV36(c)) return [];
  return pagamentos
    .filter(p=>String(p.contratoId)===String(contratoId) && pagamentoFinanceiroValidoV36(p) && naturezaQuitaContratoV32(p))
    .sort((a,b)=>(dataLocal(a.data)?.getTime()||0)-(dataLocal(b.data)?.getTime()||0));
};
pagamentosDoAluno = function(alunoId){
  return pagamentos
    .filter(p=>String(p.alunoId)===String(alunoId) && pagamentoFinanceiroValidoV36(p))
    .sort((a,b)=>(dataLocal(b.data)?.getTime()||0)-(dataLocal(a.data)?.getTime()||0));
};
totalPagoContrato = function(contratoId){
  return pagamentosDoContrato(contratoId).reduce((s,p)=>s+Number(p.valor||0),0);
};
aulasExtrasMes = function(mes,ano){
  return pagamentos.filter(p=>pagamentoFinanceiroValidoV36(p) && isAulaExtraPagamento(p) && dataNoMesV32(p.data,mes,ano));
};
pagamentosCartaoMes = function(mes,ano){
  return pagamentos.filter(p=>pagamentoFinanceiroValidoV36(p) && p.forma==='Cartão' && dataNoMesV32(p.data,mes,ano));
};
movimentosAlunoCaixaMesV32 = function(mes,ano){
  return pagamentos
    .filter(p=>pagamentoFinanceiroValidoV36(p) && p.data && dataNoMesV32(p.data,mes,ano))
    .filter(p=>['contrato','multa_cancelamento','acordo_cancelamento','reembolso_cancelamento'].includes(naturezaMovAlunoV32(p)));
};
multasMesV32 = function(mes,ano){
  return movimentosAlunoCaixaMesV32(mes,ano).filter(p=>naturezaMovAlunoV32(p)==='multa_cancelamento');
};
somaNaturezaContratoV32 = function(c,n){
  if(!c || contratoExcluidoV36(c)) return 0;
  return pagamentos
    .filter(p=>pagamentoFinanceiroValidoV36(p) && String(p.contratoId)===String(c.id) && naturezaMovAlunoV32(p)===n)
    .reduce((s,p)=>s+Number(p.valor||0),0);
};
movsPosCancelV32 = function(c){
  if(!c || contratoExcluidoV36(c)) return [];
  return pagamentos
    .filter(p=>pagamentoFinanceiroValidoV36(p) && String(p.contratoId)===String(c.id) && ['multa_cancelamento','acordo_cancelamento','reembolso_cancelamento'].includes(naturezaMovAlunoV32(p)))
    .sort((a,b)=>(dataLocal(a.data)?.getTime()||0)-(dataLocal(b.data)?.getTime()||0));
};

// Saldo bruto/líquido também zera para contrato excluído.
const saldoBrutoContratoBaseV36 = saldoBrutoContratoV34;
saldoBrutoContratoV34 = function(c){
  if(!c || contratoExcluidoV36(c)) return 0;
  return saldoBrutoContratoBaseV36(c);
};
const saldoLiquidoContratoBaseV36 = saldoLiquidoContratoV34;
saldoLiquidoContratoV34 = function(c){
  if(!c || contratoExcluidoV36(c)) return 0;
  return saldoLiquidoContratoBaseV36(c);
};
saldoContrato = function(c){
  if(!c || contratoExcluidoV36(c)) return 0;
  return saldoBrutoContratoV34(c);
};

// Competência: reforço final.
const contratoContaCompetenciaMesBaseV36 = contratoContaCompetenciaMes;
contratoContaCompetenciaMes = function(c,mes,ano){
  if(!c || contratoExcluidoV36(c)) return false;
  return !!contratoContaCompetenciaMesBaseV36(c,mes,ano);
};

// ──────────────────────────────────────────────────
// EXCLUSÃO: GRAVA NO FIREBASE E NEUTRALIZA MOVIMENTOS
// ──────────────────────────────────────────────────
async function excluirContratoV36(alunoId,contratoId){
  const c=contratoPorIdV36(contratoId);
  if(!c){
    await mensagemSistemaV34('Contrato não encontrado. Atualize a página e tente novamente.','Excluir contrato','alerta');
    return;
  }
  if(c.status==='cancelado'){
    await mensagemSistemaV34(
      'Este contrato está CANCELADO, não excluído.\n\nCancelamento preserva as competências reais do período em que o contrato existiu. Se o cancelamento foi feito por engano, trate o caso pela auditoria antes de apagar qualquer histórico.',
      'Contrato cancelado',
      'alerta'
    );
    return;
  }
  if(c.status==='excluido'){
    await mensagemSistemaV34('Este contrato já está marcado como excluído e não participa dos cálculos financeiros.','Contrato já excluído','info');
    return;
  }

  const vinculados=pagamentos.filter(p=>String(p.contratoId)===String(contratoId) && p.status!=='excluido');
  const ok=await confirmarSistemaV34(
    `Excluir definitivamente este contrato dos cálculos?\n\n${c.alunoNome||'Aluno'} — ${nomeContrato(c)}\n${fmtData(c.inicio)} → ${fmtData(c.vencOriginal||c.venc)}\n\nConsequências:\n• zero impacto na DRE;\n• zero impacto no caixa;\n• zero saldo/provisão;\n• ${vinculados.length} movimentação(ões) vinculada(s) também será(ão) desconsiderada(s);\n• os registros continuam preservados para auditoria.\n\nIsso é diferente de cancelar um contrato real.`,
    'Excluir contrato',
    'perigo',
    'Excluir dos cálculos'
  );
  if(!ok)return;

  const agora=new Date().toISOString();
  const antes={...c};
  const novoContrato={
    ...c,
    status:'excluido',
    excluidoEm:agora,
    motivoExclusao:'exclusao_manual_contrato',
    financeiroDesconsiderado:true,
    atualizadoEm:agora
  };

  try{
    const batch=writeBatch(db);
    batch.set(doc(db,'contratos',String(contratoId)),novoContrato);

    const idsMov=[];
    vinculados.forEach(p=>{
      const novoPg={
        ...p,
        statusAnteriorExclusaoContrato:p.status||'ativo',
        status:'excluido',
        excluidoEm:agora,
        excluidoPorContrato:true,
        contratoExcluidoId:String(contratoId),
        atualizadoEm:agora
      };
      batch.set(doc(db,'pagamentos',String(p.id)),novoPg);
      idsMov.push(String(p.id));
    });

    await batch.commit();

    contratos=contratos.map(x=>String(x.id)===String(contratoId)?novoContrato:x);
    pagamentos=pagamentos.map(p=>{
      if(String(p.contratoId)!==String(contratoId) || p.status==='excluido') return p;
      return {
        ...p,
        statusAnteriorExclusaoContrato:p.status||'ativo',
        status:'excluido',
        excluidoEm:agora,
        excluidoPorContrato:true,
        contratoExcluidoId:String(contratoId),
        atualizadoEm:agora
      };
    });
    hidratarAlunosComContratos();

    await registrarAuditoria(
      'exclusao_contrato',
      String(alunoId||c.alunoId||''),
      c.alunoNome||'Contrato',
      antes,
      {
        status:'excluido',
        financeiroDesconsiderado:true,
        pagamentosDesconsiderados:idsMov,
        quantidadePagamentosDesconsiderados:idsMov.length
      }
    );

    document.getElementById('modal-rastreio-v35')?.remove();
    document.getElementById('modal-sistema-v34')?.remove();

    toast(`Contrato excluído dos cálculos${idsMov.length?` · ${idsMov.length} movimento(s) desconsiderado(s)`:''} ✓`);

    if(viewAtual==='financeiro') await renderFinanceiroView();
    else if(viewAtual==='caixa') await renderCaixaView();
    else if(viewAtual==='dashboard') await renderDashboard();
    else if(alunoId && alunos.some(a=>String(a.id)===String(alunoId))) await abrirPerfilAluno(alunoId);
    else render();
  }catch(e){
    console.error('Falha ao excluir contrato V36:',e);
    await mensagemSistemaV34(
      'Não foi possível concluir a exclusão no Firebase. Nenhuma exclusão parcial deve ser considerada válida. Atualize a página e confira o status antes de tentar novamente.',
      'Erro ao excluir contrato',
      'perigo'
    );
  }
}
window.excluirContratoV36=excluirContratoV36;
excluirContrato=excluirContratoV36;
window.excluirContrato=excluirContratoV36;

// ──────────────────────────────────────────────────
// RASTREAR: MOSTRA IDs + AÇÃO DE EXCLUSÃO
// ──────────────────────────────────────────────────
const rastrearReceitaBaseV36=window.rastrearReceitaV35;
window.rastrearReceitaV35=function(tipo,id,mes,ano,modo='competencia'){
  rastrearReceitaBaseV36(tipo,id,mes,ano,modo);
  setTimeout(()=>{
    const modal=document.getElementById('modal-rastreio-v35');
    if(!modal)return;
    const l=linhaReceitaPorOrigemV35(tipo,id,Number(mes),Number(ano),modo);
    if(!l || l.tipo!=='contrato' || !l.contrato)return;
    const c=l.contrato;

    const corpo=modal.querySelector('div[style*="padding:20px 22px"]');
    if(corpo && !corpo.querySelector('.ids-v36')){
      corpo.insertAdjacentHTML('afterbegin',`
        <div class="ids-v36" style="background:#f9fafb;border:1px solid var(--borda);border-radius:7px;padding:10px 12px;margin-bottom:14px;font-size:11px">
          <strong>Aluno ID:</strong> <code>${esc(String(c.alunoId||'—'))}</code><br>
          <strong>Contrato ID:</strong> <code>${esc(String(c.id||'—'))}</code>
        </div>`);
    }

    const footer=modal.querySelector('div[style*="border-top"]');
    if(footer && !footer.querySelector('.btn-excluir-rastreio-v36') && c.status!=='excluido'){
      footer.style.display='flex';
      footer.style.justifyContent='space-between';
      footer.style.alignItems='center';
      const btn=document.createElement('button');
      btn.className='btn btn-danger btn-excluir-rastreio-v36';
      btn.textContent='🗑 Excluir este contrato';
      btn.onclick=()=>excluirContratoV36(c.alunoId,c.id);
      footer.insertBefore(btn,footer.firstChild);
    }
  },0);
};

// ──────────────────────────────────────────────────
// AUDITORIA V36: CONTRATO ÓRFÃO E INÍCIO INCONSISTENTE
// ──────────────────────────────────────────────────
const auditoriaFinanceiraBaseV36=auditoriaFinanceiraV35;
auditoriaFinanceiraV35=function(){
  const base=auditoriaFinanceiraBaseV36();
  const problemas=[...base.problemas];
  const alunosMap=new Map(alunos.map(a=>[String(a.id),a]));

  contratos.filter(c=>c.status!=='excluido').forEach(c=>{
    const a=alunosMap.get(String(c.alunoId||''));
    if(!a){
      problemas.push({
        nivel:'erro',
        tipo:'contrato_orfao',
        titulo:'Contrato ativo sem aluno correspondente',
        detalhe:`${c.alunoNome||'—'} · contrato ${c.id} · alunoId ${c.alunoId||'—'} · ${fmtData(c.inicio)} → ${fmtData(c.vencOriginal||c.venc)}`,
        alunoId:'',
        origemId:c.id,
        contratoId:c.id,
        contratoAlunoId:c.alunoId
      });
      return;
    }

    if(a.dataEntrada && c.inicio){
      const entrada=dataLocal(a.dataEntrada),ini=dataLocal(c.inicio);
      if(entrada&&ini&&ini<entrada){
        problemas.push({
          nivel:'alerta',
          tipo:'contrato_antes_entrada',
          titulo:'Contrato começa antes da entrada cadastrada do aluno',
          detalhe:`${a.nome} · entrada ${fmtData(a.dataEntrada)} · contrato ${c.id} inicia ${fmtData(c.inicio)}`,
          alunoId:a.id,
          origemId:c.id,
          contratoId:c.id,
          contratoAlunoId:c.alunoId
        });
      }
    }
  });

  return {
    ...base,
    problemas,
    erros:problemas.filter(p=>p.nivel==='erro').length,
    alertas:problemas.filter(p=>p.nivel==='alerta').length
  };
};

htmlAuditoriaFinanceiraV35=function(){
  const a=auditoriaFinanceiraV35();
  const cor=a.erros?'var(--vermelho)':a.alertas?'#b45309':'var(--verde)';
  const titulo=a.erros?`${a.erros} erro(s) e ${a.alertas} alerta(s)`:a.alertas?`${a.alertas} alerta(s)`:'Nenhuma inconsistência detectada';

  const rows=a.problemas.map(p=>{
    const cid=p.contratoId||(['contrato_orfao','contrato_antes_entrada','contrato_legado','contrato_duplicado','contrato_sobreposto'].includes(p.tipo)?p.origemId:'');
    const contrato=cid?contratoPorIdV36(cid):null;
    const podeExcluir=!!contrato && contrato.status!=='excluido' && contrato.status!=='cancelado';
    return `<tr>
      <td><span class="badge" style="color:${p.nivel==='erro'?'var(--vermelho)':'#92400e'};background:${p.nivel==='erro'?'#fef2f2':'#fffbeb'}">${p.nivel==='erro'?'ERRO':'ALERTA'}</span></td>
      <td><strong>${esc(p.titulo)}</strong><div style="font-size:11px;color:var(--texto-muted);margin-top:3px">${esc(p.detalhe)}</div></td>
      <td style="text-align:right;white-space:nowrap">
        ${p.alunoId&&alunos.some(x=>String(x.id)===String(p.alunoId))?`<button class="btn btn-ghost btn-sm" onclick="abrirPerfilAluno('${esc(p.alunoId)}')">Ver aluno</button>`:''}
        ${podeExcluir?`<button class="btn btn-danger btn-sm" onclick="excluirContratoV36('${esc(String(contrato.alunoId||''))}','${esc(String(contrato.id))}')">Excluir contrato</button>`:''}
      </td>
    </tr>`;
  }).join('');

  return `<div class="section-box" id="auditoria-financeira-v35" style="margin-top:24px;border-top:3px solid ${cor}">
    <div class="section-header">
      <div>
        <div class="section-title">Auditoria Financeira</div>
        <div style="font-size:12px;color:var(--texto-muted)">Excluído = fora de todos os cálculos. Cancelado = histórico real preservado até a data de cancelamento.</div>
      </div>
      <div style="text-align:right;font-size:12px">
        <strong style="color:${cor}">${esc(titulo)}</strong>
        <div style="color:var(--texto-muted);margin-top:3px">${a.contratosValidos} contratos válidos · ${a.contratosArquivados} excluído(s) · ${a.pagamentosAtivos} movimentos carregados</div>
      </div>
    </div>
    ${a.problemas.length
      ?`<div class="table-wrap"><table><thead><tr><th>Nível</th><th>Inconsistência</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>`
      :`<div style="padding:18px;color:var(--verde);font-weight:700">✓ Nenhuma inconsistência estrutural encontrada nos dados carregados.</div>`}
  </div>`;
};

// ──────────────────────────────────────────────────
// PERFIL: TEXTO DA EXCLUSÃO DEIXA A DIFERENÇA CLARA
// ──────────────────────────────────────────────────
const abrirPerfilAlunoBaseV36=abrirPerfilAluno;
abrirPerfilAluno=async function(id){
  await abrirPerfilAlunoBaseV36(id);
  setTimeout(()=>{
    document.querySelectorAll('button[onclick^="excluirContrato"]').forEach(btn=>{
      btn.title='Excluir: remove totalmente este contrato de DRE, caixa e saldos. Não confundir com cancelar.';
    });
  },0);
};
window.abrirPerfilAluno=abrirPerfilAluno;

// ──────────────────────────────────────────────────
// TESTE DE INTEGRIDADE EM TEMPO REAL
// ──────────────────────────────────────────────────
function validarContratoExcluidoV36(contratoId){
  const c=contratoPorIdV36(contratoId);
  if(!c || c.status!=='excluido') return {ok:false,motivo:'contrato_nao_excluido'};
  const compAno=Number(String(c.inicio||'').slice(0,4))||ANO_ATUAL;
  const compMes=Math.max(0,(Number(String(c.inicio||'').slice(5,7))||1)-1);
  const conta=contratoContaCompetenciaMes(c,compMes,compAno);
  const movs=pagamentos.filter(p=>String(p.contratoId)===String(contratoId)&&pagamentoFinanceiroValidoV36(p));
  return {
    ok:!conta&&movs.length===0,
    contaCompetencia:conta,
    movimentosFinanceirosValidos:movs.length
  };
}
window.validarContratoExcluidoV36=validarContratoExcluidoV36;

// ═══════════════════════════════════════════════════════════════════════════════
// V37 — TESOURARIA ESCRITURAL / CAIXA 2.0
// Marco confiável: DRE agosto/2026. Escrituração física: posição de 31/08/2026
// e movimentos a partir de 01/09/2026.
//
// Três dimensões separadas:
// 1) onde está o dinheiro (conta/subconta física);
// 2) para que está destinado (caixinha gerencial);
// 3) o que é só sugestão e o que já foi executado.
// ═══════════════════════════════════════════════════════════════════════════════
const VERSAO_TESOURARIA_V37 = '37.0';
const TES_DATA_ABERTURA_V37 = '2026-08-31';
const TES_INICIO_ESCRITURACAO_V37 = '2026-09-01';
const TES_MARCO_DRE_V37 = '2026-08';

const TES_CONTAS_V37 = [
  {id:'infinite_corrente', instituicao:'InfinitePay', nome:'InfinitePay — Corrente', tipo:'corrente', icon:'🏦'},
  {id:'infinite_investimento', instituicao:'InfinitePay', nome:'InfinitePay — Investimento', tipo:'investimento', icon:'📈'},
  {id:'tesouraria_corrente', instituicao:'Banco de Tesouraria', nome:'Banco de Tesouraria — Corrente', tipo:'corrente', icon:'🏛️'},
  {id:'tesouraria_investimento', instituicao:'Banco de Tesouraria', nome:'Banco de Tesouraria — Investimento', tipo:'investimento', icon:'📊'},
  {id:'especie', instituicao:'Espécie', nome:'Dinheiro em espécie', tipo:'especie', icon:'💵'}
];

const TES_CAIXAS_V37 = [
  {id:'antecipados',nome:'Pagamentos antecipados',icon:'🔒',desc:'Saldo líquido já recebido que ainda corresponde a serviços futuros.',local:'infinite_investimento',especial:'antecipados'},
  {id:'trabalhista',nome:'Provisão trabalhista',icon:'👷',desc:'Necessidade gerada no módulo Colaboradores e protegida quando a aplicação é executada.',local:'infinite_investimento',especial:'trabalhista'},
  {id:'capital_giro',nome:'Capital de giro',icon:'🔁',desc:'Liquidez operacional para sustentar o funcionamento do estúdio.',local:'infinite_corrente',pct:20},
  {id:'reserva',nome:'Reserva de emergência',icon:'🛡️',desc:'Proteção para eventos inesperados e queda de receita.',local:'tesouraria_investimento',pct:30},
  {id:'manutencao',nome:'Manutenção',icon:'🧰',desc:'Verba mensal fixa que acumula a diferença entre orçamento e gasto real.',local:'tesouraria_investimento',especial:'manutencao'},
  {id:'investimento_futuro',nome:'Investimentos futuros',icon:'🚀',desc:'Equipamentos, melhorias, expansão e projetos futuros.',local:'tesouraria_investimento',pct:20},
  {id:'lucro',nome:'Lucro a distribuir',icon:'💰',desc:'Resultado destinado ao sócio depois das proteções e decisões gerenciais.',local:'infinite_corrente',pct:15}
];

let tesConfigV37 = null;
let tesMovsV37 = [];
let tesOpsV37 = [];
let tesConcsV37 = [];
let tesFechosV37 = [];
let tesStatusV37 = [];
let tesPerfilV37 = null;

function configPadraoTesV37(){
  return {
    id:'principal',
    versao:37,
    dataAbertura:TES_DATA_ABERTURA_V37,
    inicioEscrituracao:TES_INICIO_ESCRITURACAO_V37,
    marcoDRE:TES_MARCO_DRE_V37,
    abertura:{
      infinite_corrente:7106.95,
      infinite_investimento:0,
      tesouraria_corrente:0,
      tesouraria_investimento:0,
      especie:912.00
    },
    caixas:TES_CAIXAS_V37.map(x=>({...x})),
    manutencaoMensal:0,
    criadoEm:new Date().toISOString(),
    atualizadoEm:new Date().toISOString()
  };
}
function contaTesV37(id){return TES_CONTAS_V37.find(x=>x.id===id)||{id,nome:id||'Pendente',instituicao:'Pendente',tipo:'pendente',icon:'⚠️'};}
function caixasCfgTesV37(){return (tesConfigV37?.caixas||TES_CAIXAS_V37).map(x=>({...x}));}
function caixaTesV37(id){return caixasCfgTesV37().find(x=>x.id===id)||TES_CAIXAS_V37.find(x=>x.id===id)||{id,nome:id||'Livre',icon:'📦',local:'infinite_corrente'};}
function contaLocalCaixaV37(id){return caixaTesV37(id)?.local||'infinite_corrente';}
function dataValidaTesV37(s){const d=dataLocal(s);return d&&d>=dataLocal(TES_INICIO_ESCRITURACAO_V37);}
function ateDataTesV37(data,asOf){const d=dataLocal(data),a=dataLocal(asOf);return !!(d&&a&&d<=a);}
function dataFimMesV37(mes,ano){const d=new Date(ano,mes+1,0);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function chaveMesV37(mes,ano){return `${ano}-${String(mes+1).padStart(2,'0')}`;}
function mesFechoIdV37(mes,ano){return `mes_${ano}_${String(mes+1).padStart(2,'0')}`;}
function moedaAssinadaV37(v){return `${Number(v)<0?'-':''}${fmtValor(Math.abs(Number(v||0)))}`;}

async function carregarTesourariaV37(forcar=false){
  if(tesConfigV37&&!forcar) return;
  try{
    const [cfgSnap,movSnap,opSnap,concSnap,fechoSnap,statusSnap]=await Promise.all([
      getDoc(doc(db,'tesouraria_config','principal')),
      getDocs(collection(db,'tesouraria_movimentos')),
      getDocs(collection(db,'tesouraria_operacoes')),
      getDocs(collection(db,'tesouraria_conciliacoes')),
      getDocs(collection(db,'tesouraria_fechamentos')),
      getDocs(collection(db,'tesouraria_status'))
    ]);
    if(cfgSnap.exists()) tesConfigV37={id:cfgSnap.id,...cfgSnap.data()};
    else{
      tesConfigV37=configPadraoTesV37();
      await setDoc(doc(db,'tesouraria_config','principal'),tesConfigV37);
    }
    tesMovsV37=movSnap.docs.map(d=>({id:d.id,...d.data()}));
    tesOpsV37=opSnap.docs.map(d=>({id:d.id,...d.data()}));
    tesConcsV37=concSnap.docs.map(d=>({id:d.id,...d.data()}));
    tesFechosV37=fechoSnap.docs.map(d=>({id:d.id,...d.data()}));
    tesStatusV37=statusSnap.docs.map(d=>({id:d.id,...d.data()}));
  }catch(e){
    console.error('Erro ao carregar Tesouraria V37',e);
    tesConfigV37=tesConfigV37||configPadraoTesV37();
  }
}
async function salvarTesConfigV37(){
  tesConfigV37={...(tesConfigV37||configPadraoTesV37()),atualizadoEm:new Date().toISOString()};
  await setDoc(doc(db,'tesouraria_config','principal'),tesConfigV37);
}
async function salvarTesMovV37(m){
  tesMovsV37=tesMovsV37.filter(x=>String(x.id)!==String(m.id)).concat(m);
  await setDoc(doc(db,'tesouraria_movimentos',String(m.id)),m);
}
async function salvarTesOpV37(o){
  tesOpsV37=tesOpsV37.filter(x=>String(x.id)!==String(o.id)).concat(o);
  await setDoc(doc(db,'tesouraria_operacoes',String(o.id)),o);
}
async function salvarTesConcV37(c){
  tesConcsV37=tesConcsV37.filter(x=>String(x.id)!==String(c.id)).concat(c);
  await setDoc(doc(db,'tesouraria_conciliacoes',String(c.id)),c);
}
async function salvarTesStatusV37(s){
  tesStatusV37=tesStatusV37.filter(x=>String(x.id)!==String(s.id)).concat(s);
  await setDoc(doc(db,'tesouraria_status',String(s.id)),s);
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTAS NOS LANÇAMENTOS OPERACIONAIS
// ─────────────────────────────────────────────────────────────────────────────
function normalizarContaCaixaV37(raw,forma=''){
  const s=String(raw||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  if(['infinite_corrente','infinitepay','infinite pay','infinite'].includes(s))return'infinite_corrente';
  if(['infinite_investimento','infinite investimento'].includes(s))return'infinite_investimento';
  if(['tesouraria_corrente','banco de tesouraria','itau','itaú'].includes(s))return'tesouraria_corrente';
  if(['tesouraria_investimento','banco de tesouraria investimento','itau investimento','itaú investimento'].includes(s))return'tesouraria_investimento';
  if(['especie','espécie','dinheiro'].includes(s))return'especie';
  if(String(forma||'').toLowerCase()==='dinheiro')return'especie';
  if(forma)return'infinite_corrente';
  return'';
}
function optionsContaFisicaV37(valor='',permitirPendente=true){
  const op=TES_CONTAS_V37.filter(c=>c.tipo!=='investimento').map(c=>`<option value="${c.id}" ${valor===c.id?'selected':''}>${esc(c.nome)}</option>`).join('');
  return `${op}${permitirPendente?`<option value="" ${!valor?'selected':''}>⚠ Pendente de conciliação</option>`:''}`;
}
function optionsOrigemGerencialV37(valor=''){
  return `<option value="" ${!valor?'selected':''}>Livre / não usar caixinha</option>`+caixasCfgTesV37().map(c=>`<option value="${c.id}" ${valor===c.id?'selected':''}>${c.icon} ${esc(c.nome)}</option>`).join('');
}

// Acrescenta a conta física no lançamento de aluno.
const abrirModalPagamentoBaseV37=abrirModalPagamentoContrato;
abrirModalPagamentoContrato=function(alunoId,contratoId=null,pagamentoId=null){
  abrirModalPagamentoBaseV37(alunoId,contratoId,pagamentoId);
  setTimeout(()=>{
    const modal=document.getElementById('modal-pagamento-overlay');if(!modal)return;
    const p=pagamentoId?pagamentos.find(x=>String(x.id)===String(pagamentoId)):null;
    const forma=document.getElementById('pg-forma');
    const valorConta=p?.contaCaixa||normalizarContaCaixaV37(p?.conta||'',p?.forma||forma?.value||'PIX')||((forma?.value||'PIX')==='Dinheiro'?'especie':'infinite_corrente');
    if(!document.getElementById('pg-conta-caixa-v37')){
      const grp=document.createElement('div');grp.className='form-group';
      grp.innerHTML=`<label class="form-label">Conta física do caixa</label><select class="form-select" id="pg-conta-caixa-v37">${optionsContaFisicaV37(valorConta)}</select><div class="form-hint">Define onde o dinheiro realmente entrou/saiu. Não altera a competência da DRE.</div>`;
      forma?.closest('.form-group')?.insertAdjacentElement('afterend',grp);
      const ger=document.createElement('div');ger.className='form-group';
      ger.innerHTML=`<label class="form-label">Origem gerencial se for saída</label><select class="form-select" id="pg-origem-gerencial-v37">${optionsOrigemGerencialV37(p?.destinacaoGerencial||'')}</select><div class="form-hint">Ex.: reembolso pago usando Antecipados. Entradas ignoram este campo.</div>`;
      grp.insertAdjacentElement('afterend',ger);
    }
    forma?.addEventListener('change',()=>{const c=document.getElementById('pg-conta-caixa-v37');if(c&&forma.value==='Dinheiro')c.value='especie';});
  },0);
};
window.abrirModalPagamentoContrato=abrirModalPagamentoContrato;
registrarPagamento=async function(id){abrirModalPagamentoContrato(id);};window.registrarPagamento=registrarPagamento;

const salvarPagamentoDbBaseV37=salvarPagamentoDb;
salvarPagamentoDb=async function(p){
  const contaEl=document.getElementById('pg-conta-caixa-v37');
  const gerEl=document.getElementById('pg-origem-gerencial-v37');
  if(contaEl)p.contaCaixa=contaEl.value||'';
  if(gerEl)p.destinacaoGerencial=gerEl.value||'';
  if(!p.contaCaixa)p.contaCaixa=normalizarContaCaixaV37(p.conta||'',p.forma||'');
  return salvarPagamentoDbBaseV37(p);
};

// Receitas avulsas também passam a dizer onde o dinheiro entrou.
const abrirReceitaAvulsaBaseV37=window.abrirModalReceitaAvulsaV35;
window.abrirModalReceitaAvulsaV35=function(id=''){
  abrirReceitaAvulsaBaseV37(id);
  setTimeout(()=>{
    const modal=document.getElementById('modal-receita-avulsa-v35');if(!modal)return;
    const r=id?receitasAvulsasV35.find(x=>String(x.id)===String(id)):null;
    const forma=document.getElementById('ra-forma-v35');
    if(forma&&!document.getElementById('ra-conta-caixa-v37')){
      const valor=r?.contaCaixa||normalizarContaCaixaV37('',r?.forma||forma.value)||'infinite_corrente';
      const g=document.createElement('div');g.className='form-group';
      g.innerHTML=`<label class="form-label">Conta física do recebimento</label><select class="form-select" id="ra-conta-caixa-v37">${optionsContaFisicaV37(valor)}</select><div class="form-hint">Usada somente quando a receita estiver marcada como recebida.</div>`;
      forma.closest('.form-group')?.insertAdjacentElement('afterend',g);
    }
  },0);
};
const salvarReceitaAvulsaBaseV37=salvarReceitaAvulsaV35;
salvarReceitaAvulsaV35=async function(r){
  const el=document.getElementById('ra-conta-caixa-v37');
  if(el)r.contaCaixa=el.value||'';
  if(r.recebido&&!r.contaCaixa)r.contaCaixa=normalizarContaCaixaV37('',r.forma||'')||'infinite_corrente';
  return salvarReceitaAvulsaBaseV37(r);
};

// Baixa de despesas: conta física + caixinha que financiou gerencialmente a saída.
const abrirBaixaDespesaBaseV37=window.abrirBaixaDespesaV32;
window.abrirBaixaDespesaV32=async function(ref,descricao,valorPadrao,competencia,cat=''){
  await abrirBaixaDespesaBaseV37(ref,descricao,valorPadrao,competencia,cat);
  const mov=movDespV32(ref);
  const antigo=document.getElementById('bd-conta');
  if(antigo){
    const valor=mov?.contaCaixa||normalizarContaCaixaV37(mov?.conta||'',mov?.forma||'')||'infinite_corrente';
    const sel=document.createElement('select');sel.className='form-select';sel.id='bd-conta';sel.innerHTML=optionsContaFisicaV37(valor);antigo.replaceWith(sel);
    const g=sel.closest('.form-group');const lab=g?.querySelector('.form-label');if(lab)lab.textContent='Conta física de saída';
    const h=document.createElement('div');h.className='form-hint';h.textContent='O saldo desta conta será reduzido na data informada.';g?.appendChild(h);
    const ger=document.createElement('div');ger.className='form-group';
    ger.innerHTML=`<label class="form-label">Caixinha / origem gerencial</label><select class="form-select" id="bd-origem-gerencial-v37">${optionsOrigemGerencialV37(mov?.destinacaoGerencial||'')}</select><div class="form-hint">Ex.: compra de equipamento paga da corrente, mas financiada por Investimentos futuros.</div>`;
    g?.insertAdjacentElement('afterend',ger);
  }
};
const salvarMovCaixaBaseV37=salvarMovCaixa;
salvarMovCaixa=async function(m){
  if(m?.tipo==='pagamento_despesa_operacional'){
    const conta=document.getElementById('bd-conta');const ger=document.getElementById('bd-origem-gerencial-v37');
    if(conta){m.conta=conta.value||'';m.contaCaixa=conta.value||'';}
    if(ger)m.destinacaoGerencial=ger.value||'';
    if(!m.contaCaixa)m.contaCaixa=normalizarContaCaixaV37(m.conta||'',m.forma||'');
  }
  return salvarMovCaixaBaseV37(m);
};

// ─────────────────────────────────────────────────────────────────────────────
// ESCRITURAÇÃO FÍSICA
// ─────────────────────────────────────────────────────────────────────────────
function lancamentosFisicosV37(asOf='2099-12-31'){
  const out=[];
  pagamentos.filter(p=>pagamentoFinanceiroValidoV36(p)&&dataValidaTesV37(p.data)&&ateDataTesV37(p.data,asOf)).forEach(p=>{
    const valor=Number(valorCaixaAlunoV32(p)||0);if(!valor)return;
    const conta=p.contaCaixa||normalizarContaCaixaV37(p.conta||'',p.forma||'');
    out.push({id:`pg:${p.id}`,data:p.data,conta,valor,descricao:p.descricao||labelNaturezaV32(p),origem:'pagamento',origemId:p.id,alunoNome:p.alunoNome||'',inferida:!p.contaCaixa,destinacaoGerencial:p.destinacaoGerencial||''});
  });
  receitasAvulsasV35.filter(r=>receitaAvulsaAtivaV35(r)&&r.recebido&&dataValidaTesV37(r.dataRecebimento)&&ateDataTesV37(r.dataRecebimento,asOf)).forEach(r=>{
    const conta=r.contaCaixa||normalizarContaCaixaV37('',r.forma||'');
    out.push({id:`ra:${r.id}`,data:r.dataRecebimento,conta,valor:Number(r.valor||0),descricao:r.descricao||'Receita avulsa',origem:'receita_avulsa',origemId:r.id,inferida:!r.contaCaixa});
  });
  (caixaMovs||[]).filter(m=>m.status!=='excluido'&&m.tipo==='pagamento_despesa_operacional'&&dataValidaTesV37(m.data)&&ateDataTesV37(m.data,asOf)).forEach(m=>{
    const conta=m.contaCaixa||normalizarContaCaixaV37(m.conta||'',m.forma||'');
    out.push({id:`desp:${m.id}`,data:m.data,conta,valor:-Math.abs(Number(m.valor||0)),descricao:m.descricao||'Despesa',origem:'despesa',origemId:m.id,inferida:!m.contaCaixa,destinacaoGerencial:m.destinacaoGerencial||''});
  });
  tesMovsV37.filter(m=>m.status!=='excluido'&&m.executado!==false&&dataValidaTesV37(m.data)&&ateDataTesV37(m.data,asOf)).forEach(m=>{
    if(m.tipo==='transferencia_interna'){
      out.push({id:`tes:${m.id}:o`,data:m.data,conta:m.origemConta,valor:-Math.abs(Number(m.valor||0)),descricao:m.descricao||'Transferência interna',origem:'transferencia',origemId:m.id});
      out.push({id:`tes:${m.id}:d`,data:m.data,conta:m.destinoConta,valor:Math.abs(Number(m.valor||0)),descricao:m.descricao||'Transferência interna',origem:'transferencia',origemId:m.id});
    }else if(m.tipo==='entrada_manual'){
      out.push({id:`tes:${m.id}`,data:m.data,conta:m.destinoConta,valor:Math.abs(Number(m.valor||0)),descricao:m.descricao||'Entrada manual',origem:'ajuste',origemId:m.id});
    }else if(m.tipo==='saida_manual'){
      out.push({id:`tes:${m.id}`,data:m.data,conta:m.origemConta,valor:-Math.abs(Number(m.valor||0)),descricao:m.descricao||'Saída manual',origem:'ajuste',origemId:m.id,destinacaoGerencial:m.destinacaoGerencial||''});
    }
  });
  return out.sort((a,b)=>(dataLocal(a.data)?.getTime()||0)-(dataLocal(b.data)?.getTime()||0));
}
function saldosFisicosV37(asOf='2099-12-31'){
  const saldos={};TES_CONTAS_V37.forEach(c=>saldos[c.id]=Number(tesConfigV37?.abertura?.[c.id]||0));
  if(dataLocal(asOf)<dataLocal(TES_DATA_ABERTURA_V37))TES_CONTAS_V37.forEach(c=>saldos[c.id]=0);
  lancamentosFisicosV37(asOf).forEach(l=>{if(l.conta)saldos[l.conta]=Number(saldos[l.conta]||0)+Number(l.valor||0);});
  return saldos;
}
function totalFisicoV37(asOf='2099-12-31'){const s=saldosFisicosV37(asOf);return Object.values(s).reduce((a,b)=>a+Number(b||0),0);}
function lancamentosContaV37(conta,asOf='2099-12-31'){return lancamentosFisicosV37(asOf).filter(l=>l.conta===conta).sort((a,b)=>(dataLocal(b.data)?.getTime()||0)-(dataLocal(a.data)?.getTime()||0));}
function movimentosPendentesContaV37(asOf='2099-12-31'){return lancamentosFisicosV37(asOf).filter(l=>!l.conta);}

// ─────────────────────────────────────────────────────────────────────────────
// DESTINAÇÕES GERENCIAIS / NECESSIDADES
// ─────────────────────────────────────────────────────────────────────────────
function deltaGerencialAutomaticaV37(asOf='2099-12-31'){
  const deltas=[];
  lancamentosFisicosV37(asOf).filter(l=>Number(l.valor)<0&&l.destinacaoGerencial).forEach(l=>deltas.push({data:l.data,caixaId:l.destinacaoGerencial,valor:-Math.abs(Number(l.valor||0)),descricao:l.descricao,origem:l.origem,origemId:l.origemId}));
  return deltas;
}
function deltasGerenciaisV37(asOf='2099-12-31',excluirMesFechamento=''){
  const arr=[...deltaGerencialAutomaticaV37(asOf)];
  tesOpsV37.filter(o=>o.status!=='excluido'&&dataValidaTesV37(o.data)&&ateDataTesV37(o.data,asOf)&&(!excluirMesFechamento||o.mesRef!==excluirMesFechamento)).forEach(o=>{
    if(o.tipo==='alocacao'||o.tipo==='ajuste_fechamento')arr.push({data:o.data,caixaId:o.destinoCaixa||o.caixaId,valor:Number(o.valor||0),descricao:o.descricao||'Alocação',origem:'operacao',origemId:o.id});
    else if(o.tipo==='consumo')arr.push({data:o.data,caixaId:o.origemCaixa||o.caixaId,valor:-Math.abs(Number(o.valor||0)),descricao:o.descricao||'Consumo',origem:'operacao',origemId:o.id});
    else if(o.tipo==='reclassificacao'){
      arr.push({data:o.data,caixaId:o.origemCaixa,valor:-Math.abs(Number(o.valor||0)),descricao:o.descricao||'Reclassificação',origem:'operacao',origemId:o.id});
      arr.push({data:o.data,caixaId:o.destinoCaixa,valor:Math.abs(Number(o.valor||0)),descricao:o.descricao||'Reclassificação',origem:'operacao',origemId:o.id});
    }
  });
  return arr;
}
function saldosGerenciaisV37(asOf='2099-12-31',excluirMesFechamento=''){
  const s={};caixasCfgTesV37().forEach(c=>s[c.id]=0);
  deltasGerenciaisV37(asOf,excluirMesFechamento).forEach(d=>{if(d.caixaId)s[d.caixaId]=Number(s[d.caixaId]||0)+Number(d.valor||0);});
  return s;
}
function saldoCaixinhaV37(id,asOf='2099-12-31'){return Number(saldosGerenciaisV37(asOf)[id]||0);}
function historicoCaixinhaV37(id,asOf='2099-12-31'){return deltasGerenciaisV37(asOf).filter(x=>x.caixaId===id).sort((a,b)=>(dataLocal(b.data)?.getTime()||0)-(dataLocal(a.data)?.getTime()||0));}

function pagosLiquidosContratoAteV37(c,asOf){
  return pagamentos.filter(p=>pagamentoFinanceiroValidoV36(p)&&String(p.contratoId)===String(c.id)&&naturezaQuitaContratoV32(p)&&p.data&&ateDataTesV37(p.data,asOf)).reduce((s,p)=>s+Number(p.valor||0),0);
}
function reconhecidoContratoAteV37(c,asOf){
  return mesesCompetenciaContrato(c).filter(x=>x.data&&ateDataTesV37(x.data,asOf)).reduce((s,x)=>s+Number(x.valor||0),0);
}
function provisaoAntecipadosNecessariaV37(asOf){
  const itens=[];
  contratos.filter(c=>c.status!=='excluido').forEach(c=>{
    if(c.status==='cancelado'&&c.cancelamento?.dataCancelamento&&ateDataTesV37(c.cancelamento.dataCancelamento,asOf))return;
    if(c.inicio&&!ateDataTesV37(c.inicio,asOf))return;
    const pago=pagosLiquidosContratoAteV37(c,asOf);if(pago<=0)return;
    const reconhecido=reconhecidoContratoAteV37(c,asOf);
    const futuro=Math.max(0,pago-reconhecido);
    if(futuro>0.004)itens.push({contratoId:c.id,alunoId:c.alunoId,alunoNome:c.alunoNome||'—',contrato:nomeContrato(c),pago,reconhecido,necessario:futuro});
  });
  return {itens,total:itens.reduce((s,x)=>s+x.necessario,0)};
}
function gastoGerencialMesV37(caixaId,mes,ano){
  return lancamentosFisicosV37(dataFimMesV37(mes,ano)).filter(l=>l.destinacaoGerencial===caixaId&&Number(l.valor)<0&&dataNoMesV32(l.data,mes,ano)).reduce((s,l)=>s+Math.abs(Number(l.valor||0)),0);
}
function manutencaoNecessariaV37(asOf){
  const fim=dataLocal(asOf),ini=dataLocal(TES_INICIO_ESCRITURACAO_V37);if(!fim||fim<ini)return 0;
  const mensal=Number(tesConfigV37?.manutencaoMensal||0);
  let meses=0,gastos=0;
  let y=ini.getFullYear(),m=ini.getMonth();
  while(y<fim.getFullYear()||(y===fim.getFullYear()&&m<=fim.getMonth())){
    meses++;gastos+=gastoGerencialMesV37('manutencao',m,y);m++;if(m>11){m=0;y++;}
  }
  return Math.max(0,mensal*meses-gastos);
}
function trabalhistaNecessariaV37(asOf){
  const fim=dataLocal(asOf),ini=dataLocal(TES_INICIO_ESCRITURACAO_V37);if(!fim||fim<ini)return 0;
  let total=0,y=ini.getFullYear(),m=ini.getMonth();
  while(y<fim.getFullYear()||(y===fim.getFullYear()&&m<=fim.getMonth())){
    try{total+=Number(totalProvisoesPessoalMesV20(m,y)||0);}catch(e){}
    m++;if(m>11){m=0;y++;}
  }
  total-=deltasGerenciaisV37(asOf).filter(d=>d.caixaId==='trabalhista'&&d.valor<0).reduce((s,d)=>s+Math.abs(Number(d.valor||0)),0);
  return Math.max(0,total);
}
function necessidadeCaixinhaV37(id,asOf){
  if(id==='antecipados')return provisaoAntecipadosNecessariaV37(asOf).total;
  if(id==='trabalhista')return trabalhistaNecessariaV37(asOf);
  if(id==='manutencao')return manutencaoNecessariaV37(asOf);
  return null;
}

// Equalização = posição física necessária para refletir as caixinhas protegidas.
function equalizacaoV37(asOf='2099-12-31'){
  const fis=saldosFisicosV37(asOf),ger=saldosGerenciaisV37(asOf),targets={};
  TES_CONTAS_V37.forEach(c=>targets[c.id]=0);
  caixasCfgTesV37().forEach(c=>{if(c.local&&contaTesV37(c.local).tipo==='investimento')targets[c.local]+=Math.max(0,Number(ger[c.id]||0));});
  const sugestoes=[];
  [['infinite_corrente','infinite_investimento'],['tesouraria_corrente','tesouraria_investimento']].forEach(([corr,inv])=>{
    const dif=Number(targets[inv]||0)-Number(fis[inv]||0);
    if(Math.abs(dif)<0.005)return;
    if(dif>0)sugestoes.push({origem:corr,destino:inv,valor:dif,motivo:'Aplicar saldo líquido das caixinhas hospedadas nesta posição'});
    else sugestoes.push({origem:inv,destino:corr,valor:Math.abs(dif),motivo:'Restituir à corrente o saldo consumido/liberado das caixinhas'});
  });
  return {fisico:fis,gerencial:ger,targetInvestimento:targets,sugestoes};
}

// ─────────────────────────────────────────────────────────────────────────────
// CONCILIAÇÃO BANCÁRIA
// ─────────────────────────────────────────────────────────────────────────────
function ultimaConciliacaoV37(asOf='2099-12-31'){
  return tesConcsV37.filter(c=>c.status!=='excluido'&&c.data&&ateDataTesV37(c.data,asOf)).sort((a,b)=>(dataLocal(b.data)?.getTime()||0)-(dataLocal(a.data)?.getTime()||0)||Number(b.ts||0)-Number(a.ts||0))[0]||null;
}
function conciliacaoResumoV37(asOf){
  const fis=saldosFisicosV37(asOf),conc=ultimaConciliacaoV37(asOf),linhas=TES_CONTAS_V37.map(c=>{
    const real=conc&&conc.saldos?Number(conc.saldos[c.id]||0):null;
    return {conta:c,calculado:Number(fis[c.id]||0),real,dif:real===null?null:real-Number(fis[c.id]||0)};
  });
  return {conc,linhas,difTotal:linhas.reduce((s,l)=>s+(l.dif===null?0:l.dif),0),todasInformadas:!!conc&&linhas.every(l=>l.real!==null)};
}
window.abrirConciliacaoV37=async function(data=null){
  await carregarTesourariaV37();await carregarMovCaixa();
  const hoje=data||new Date().toISOString().split('T')[0];const fis=saldosFisicosV37(hoje);const ant=ultimaConciliacaoV37(hoje);
  const rows=TES_CONTAS_V37.map(c=>`<div class="form-group"><label class="form-label">${c.icon} ${esc(c.nome)}</label><input class="form-input" type="number" step="0.01" id="conc-${c.id}" value="${Number(ant?.data===hoje?ant?.saldos?.[c.id]:fis[c.id]||0).toFixed(2)}"><div class="form-hint">Sistema nesta data: ${fmtValor(fis[c.id]||0)}</div></div>`).join('');
  document.body.insertAdjacentHTML('beforeend',`<div class="overlay open" id="modal-conc-v37" style="z-index:850"><div class="modal" style="max-width:650px"><div class="modal-header"><div><div class="modal-title">Conciliação física das contas</div><div style="font-size:12px;color:var(--texto-muted)">Informe exatamente o saldo que aparece nas instituições / espécie.</div></div><button class="modal-close" onclick="document.getElementById('modal-conc-v37').remove()">✕</button></div><div class="modal-body"><div class="form-group"><label class="form-label">Data da posição</label><input class="form-input" type="date" id="conc-data-v37" value="${esc(hoje)}"></div><div class="form-grid" style="grid-template-columns:1fr 1fr">${rows}</div><div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:10px 12px;font-size:12px;color:#1e40af">Conciliação não cria receita nem despesa. Se houver diferença, ela permanece visível até o lançamento faltante ser identificado.</div></div><div class="modal-footer"><button class="btn btn-ghost" onclick="document.getElementById('modal-conc-v37').remove()">Cancelar</button><button class="btn btn-primary" onclick="salvarConciliacaoV37()">Salvar conciliação</button></div></div></div>`);
};
window.salvarConciliacaoV37=async function(){
  const data=document.getElementById('conc-data-v37')?.value;if(!data)return;
  const saldos={};TES_CONTAS_V37.forEach(c=>saldos[c.id]=Number(document.getElementById(`conc-${c.id}`)?.value||0));
  const id=`conc_${data}_${Date.now()}`,c={id,data,saldos,status:'ativo',criadoEm:new Date().toISOString(),ts:Date.now()};
  await salvarTesConcV37(c);document.getElementById('modal-conc-v37')?.remove();toast('Conciliação registrada ✓');renderCaixaView();
};

// ─────────────────────────────────────────────────────────────────────────────
// OPERAÇÕES GERENCIAIS / TRANSFERÊNCIAS FÍSICAS
// ─────────────────────────────────────────────────────────────────────────────
window.abrirOperacaoGerencialV37=function(caixaId=''){
  const hoje=new Date().toISOString().split('T')[0];
  document.body.insertAdjacentHTML('beforeend',`<div class="overlay open" id="modal-opger-v37" style="z-index:850"><div class="modal" style="max-width:560px"><div class="modal-header"><div><div class="modal-title">Registrar decisão gerencial</div><div style="font-size:12px;color:var(--texto-muted)">Isto altera a destinação, não o saldo bancário físico.</div></div><button class="modal-close" onclick="document.getElementById('modal-opger-v37').remove()">✕</button></div><div class="modal-body"><div class="form-grid" style="grid-template-columns:1fr"><div class="form-group"><label class="form-label">Tipo</label><select class="form-select" id="opg-tipo-v37" onchange="toggleOpGerV37()"><option value="alocacao">Destinar / provisionar</option><option value="consumo">Consumir / liberar caixinha</option><option value="reclassificacao">Reclassificar entre caixinhas</option></select></div><div class="form-group" id="opg-origem-g-v37"><label class="form-label">Origem</label><select class="form-select" id="opg-origem-v37">${caixasCfgTesV37().map(c=>`<option value="${c.id}" ${caixaId===c.id?'selected':''}>${c.icon} ${esc(c.nome)}</option>`).join('')}</select></div><div class="form-group"><label class="form-label" id="opg-destino-label-v37">Destino</label><select class="form-select" id="opg-destino-v37">${caixasCfgTesV37().map(c=>`<option value="${c.id}" ${caixaId===c.id?'selected':''}>${c.icon} ${esc(c.nome)}</option>`).join('')}</select></div><div class="form-group"><label class="form-label">Valor (R$)</label><input class="form-input" type="number" step="0.01" id="opg-valor-v37"></div><div class="form-group"><label class="form-label">Data</label><input class="form-input" type="date" id="opg-data-v37" value="${hoje}"></div><div class="form-group"><label class="form-label">Descrição</label><input class="form-input" id="opg-desc-v37" placeholder="Ex.: reforço de reserva"></div></div></div><div class="modal-footer"><button class="btn btn-ghost" onclick="document.getElementById('modal-opger-v37').remove()">Cancelar</button><button class="btn btn-primary" onclick="salvarOperacaoGerencialV37()">Registrar decisão</button></div></div></div>`);toggleOpGerV37();
};
window.toggleOpGerV37=function(){
  const t=document.getElementById('opg-tipo-v37')?.value,g=document.getElementById('opg-origem-g-v37'),l=document.getElementById('opg-destino-label-v37');
  if(g)g.style.display=t==='alocacao'?'none':'';if(l)l.textContent=t==='consumo'?'Caixinha consumida':'Destino';
};
window.salvarOperacaoGerencialV37=async function(){
  const tipo=document.getElementById('opg-tipo-v37')?.value,valor=Number(document.getElementById('opg-valor-v37')?.value||0),data=document.getElementById('opg-data-v37')?.value;if(valor<=0||!data)return mensagemSistemaV34('Informe valor e data.','Operação gerencial','alerta');
  const origem=document.getElementById('opg-origem-v37')?.value,destino=document.getElementById('opg-destino-v37')?.value;
  const id=`opg_${Date.now()}`,o={id,tipo,data,valor:arredV32(valor),origemCaixa:tipo==='alocacao'?'':(tipo==='consumo'?destino:origem),destinoCaixa:tipo==='consumo'?'':destino,descricao:document.getElementById('opg-desc-v37')?.value.trim()||'Decisão gerencial',status:'ativo',criadoEm:new Date().toISOString(),ts:Date.now()};
  await salvarTesOpV37(o);document.getElementById('modal-opger-v37')?.remove();toast('Decisão gerencial registrada ✓');renderCaixaView();
};

window.abrirTransferenciaTesV37=function(origem='',destino='',valor=0,descricao=''){
  const hoje=new Date().toISOString().split('T')[0];
  const opts=TES_CONTAS_V37.map(c=>`<option value="${c.id}">${esc(c.nome)}</option>`).join('');
  document.body.insertAdjacentHTML('beforeend',`<div class="overlay open" id="modal-transf-v37" style="z-index:850"><div class="modal" style="max-width:540px"><div class="modal-header"><div><div class="modal-title">Registrar transferência interna</div><div style="font-size:12px;color:var(--texto-muted)">Altera a posição física, mas não a DRE nem o caixa total.</div></div><button class="modal-close" onclick="document.getElementById('modal-transf-v37').remove()">✕</button></div><div class="modal-body"><div class="form-grid" style="grid-template-columns:1fr"><div class="form-group"><label class="form-label">Origem</label><select class="form-select" id="tr-origem-v37">${opts}</select></div><div class="form-group"><label class="form-label">Destino</label><select class="form-select" id="tr-destino-v37">${opts}</select></div><div class="form-group"><label class="form-label">Valor</label><input class="form-input" type="number" step="0.01" id="tr-valor-v37" value="${Number(valor||0)>0?Number(valor).toFixed(2):''}"></div><div class="form-group"><label class="form-label">Data real</label><input class="form-input" type="date" id="tr-data-v37" value="${hoje}"></div><div class="form-group"><label class="form-label">Descrição</label><input class="form-input" id="tr-desc-v37" value="${esc(descricao||'Equalização / transferência interna')}"></div></div></div><div class="modal-footer"><button class="btn btn-ghost" onclick="document.getElementById('modal-transf-v37').remove()">Cancelar</button><button class="btn btn-primary" onclick="salvarTransferenciaTesV37()">Marcar como executada</button></div></div></div>`);
  if(origem)document.getElementById('tr-origem-v37').value=origem;if(destino)document.getElementById('tr-destino-v37').value=destino;
};
window.salvarTransferenciaTesV37=async function(){
  const origem=document.getElementById('tr-origem-v37')?.value,destino=document.getElementById('tr-destino-v37')?.value,valor=Number(document.getElementById('tr-valor-v37')?.value||0),data=document.getElementById('tr-data-v37')?.value;if(!origem||!destino||origem===destino||valor<=0||!data)return mensagemSistemaV34('Informe origem, destino diferentes, valor e data.','Transferência','alerta');
  const id=`tes_tr_${Date.now()}`,m={id,tipo:'transferencia_interna',origemConta:origem,destinoConta:destino,valor:arredV32(valor),data,descricao:document.getElementById('tr-desc-v37')?.value.trim()||'Transferência interna',executado:true,status:'ativo',criadoEm:new Date().toISOString(),ts:Date.now()};
  await salvarTesMovV37(m);document.getElementById('modal-transf-v37')?.remove();toast('Transferência executada registrada ✓');renderCaixaView();
};

// ─────────────────────────────────────────────────────────────────────────────
// DISTRIBUIÇÃO DO MÊS / RECOMENDAÇÃO CONFIGURÁVEL
// ─────────────────────────────────────────────────────────────────────────────
function sugestoesDistribuicaoV37(mes,ano){
  const fim=dataFimMesV37(mes,ano),ref=chaveMesV37(mes,ano),gerBase=saldosGerenciaisV37(fim,ref),resDre=receitaMesEsp(mes,ano)-totalDespCacheSeguroV37(mes,ano);
  const auto={};['antecipados','trabalhista','manutencao'].forEach(id=>{auto[id]=Number((necessidadeCaixinhaV37(id,fim)-Number(gerBase[id]||0)).toFixed(2));});
  let restante=Math.max(0,Number(resDre||0));['antecipados','trabalhista','manutencao'].forEach(id=>{if(auto[id]>0)restante=Math.max(0,restante-auto[id]);});
  const disc={};caixasCfgTesV37().filter(c=>Number(c.pct||0)>0).forEach(c=>disc[c.id]=Number((restante*Number(c.pct||0)/100).toFixed(2)));
  return {fim,ref,gerBase,resDre,auto,disc,restante};
}
function totalDespCacheSeguroV37(mes,ano){
  try{if(mes===despMes&&ano===despAno&&despesasCache)return totalDesp(despesasCache);}catch(e){}
  // fallback síncrono para o mês atual carregado; modal abre após load no render.
  try{return Number(totalDespAtualV37?.[`${ano}-${mes}`]||0);}catch(e){return 0;}
}
let totalDespAtualV37={};
window.abrirDistribuicaoV37=async function(){
  await carregarTesourariaV37();const cats=await loadDespesas(cxMes,cxAno);totalDespAtualV37[`${cxAno}-${cxMes}`]=totalDesp(cats);
  const s=sugestoesDistribuicaoV37(cxMes,cxAno);const fim=s.fim;
  const rows=caixasCfgTesV37().map(c=>{
    const nec=necessidadeCaixinhaV37(c.id,fim);const atual=Number(s.gerBase[c.id]||0);let sug=0;
    if(['antecipados','trabalhista','manutencao'].includes(c.id))sug=Number(s.auto[c.id]||0);else sug=Number(s.disc[c.id]||0);
    return `<tr><td><strong>${c.icon} ${esc(c.nome)}</strong><div style="font-size:10.5px;color:var(--texto-muted)">Hospedagem: ${esc(contaTesV37(c.local).nome)}</div></td><td style="text-align:right">${nec===null?'—':fmtValor(nec)}</td><td style="text-align:right">${fmtValor(atual)}</td><td style="width:150px"><input class="form-input" type="number" step="0.01" id="dist-${c.id}" value="${Number(sug).toFixed(2)}"></td></tr>`;
  }).join('');
  document.body.insertAdjacentHTML('beforeend',`<div class="overlay open" id="modal-dist-v37" style="z-index:850"><div class="modal" style="max-width:820px"><div class="modal-header"><div><div class="modal-title">Distribuição gerencial — ${MESES_NOMES[cxMes]} ${cxAno}</div><div style="font-size:12px;color:var(--texto-muted)">Sugestão editável. Salvar a decisão NÃO movimenta dinheiro fisicamente.</div></div><button class="modal-close" onclick="document.getElementById('modal-dist-v37').remove()">✕</button></div><div class="modal-body"><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:14px"><div class="card"><div class="card-label">Resultado DRE</div><div class="card-value" style="font-size:22px">${moedaAssinadaV37(s.resDre)}</div></div><div class="card"><div class="card-label">Antecipados necessários</div><div class="card-value" style="font-size:22px">${fmtValor(necessidadeCaixinhaV37('antecipados',fim))}</div></div><div class="card"><div class="card-label">Regra</div><div style="font-size:12px;margin-top:8px">Prioriza proteções, mas Fernando pode editar qualquer ajuste.</div></div></div><div class="table-wrap"><table><thead><tr><th>Destinação</th><th style="text-align:right">Necessário</th><th style="text-align:right">Saldo antes</th><th>Ajuste do mês</th></tr></thead><tbody>${rows}</tbody></table></div><div style="margin-top:12px;background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:10px 12px;font-size:12px;color:#92400e"><strong>Valores negativos</strong> liberam/consomem a caixinha. Valores positivos aumentam a destinação. Depois de salvar, o Caixa calcula a equalização física líquida necessária.</div></div><div class="modal-footer"><button class="btn btn-ghost" onclick="document.getElementById('modal-dist-v37').remove()">Cancelar</button><button class="btn btn-primary" onclick="salvarDistribuicaoV37()">Salvar decisão</button></div></div></div>`);
};
window.salvarDistribuicaoV37=async function(){
  const mesRef=chaveMesV37(cxMes,cxAno),data=dataFimMesV37(cxMes,cxAno),agora=new Date().toISOString();
  const batch=writeBatch(db);tesOpsV37.filter(o=>o.status!=='excluido'&&o.tipo==='ajuste_fechamento'&&o.mesRef===mesRef).forEach(o=>{const n={...o,status:'excluido',excluidoEm:agora};batch.set(doc(db,'tesouraria_operacoes',o.id),n);tesOpsV37=tesOpsV37.map(x=>x.id===o.id?n:x);});
  caixasCfgTesV37().forEach((c,i)=>{const valor=Number(document.getElementById(`dist-${c.id}`)?.value||0);if(Math.abs(valor)<0.005)return;const id=`opfech_${mesRef}_${c.id}_${Date.now()}_${i}`,o={id,tipo:'ajuste_fechamento',mesRef,data,valor:arredV32(valor),destinoCaixa:c.id,descricao:`Ajuste de fechamento — ${MESES_NOMES[cxMes]} ${cxAno}`,status:'ativo',criadoEm:agora,ts:Date.now()+i};batch.set(doc(db,'tesouraria_operacoes',id),o);tesOpsV37.push(o);});
  await batch.commit();document.getElementById('modal-dist-v37')?.remove();toast('Distribuição salva. Agora confira a equalização física. ✓');renderCaixaView();
};

// ─────────────────────────────────────────────────────────────────────────────
// FECHAMENTO VERSIONADO / REABERTURA
// ─────────────────────────────────────────────────────────────────────────────
function statusMesTesV37(mes,ano){return tesStatusV37.find(s=>s.id===mesFechoIdV37(mes,ano))||{id:mesFechoIdV37(mes,ano),status:'aberto',versao:0};}
async function fecharMesTesV37(){
  await carregarTesourariaV37();const fim=dataFimMesV37(cxMes,cxAno),conc=conciliacaoResumoV37(fim),eq=equalizacaoV37(fim),st=statusMesTesV37(cxMes,cxAno);
  const difAbs=conc.linhas.reduce((s,l)=>s+(l.dif===null?999999:Math.abs(l.dif)),0);
  if(!conc.conc||conc.conc.data!==fim||difAbs>0.01){await mensagemSistemaV34(`Para fechar ${MESES_NOMES[cxMes]} é necessário registrar uma conciliação na data ${fmtData(fim)} com diferença zero em todas as posições.`,`Conciliação pendente`,'alerta');return;}
  if(eq.sugestoes.some(x=>x.valor>0.01)){await mensagemSistemaV34('Ainda existem equalizações físicas sugeridas. Execute as transferências ou ajuste a distribuição antes de fechar o mês.','Equalização pendente','alerta');return;}
  const cats=await loadDespesas(cxMes,cxAno),receita=receitaMesEsp(cxMes,cxAno),despesa=totalDesp(cats),resultado=receita-despesa,versao=Number(st.versao||0)+1,ger=saldosGerenciaisV37(fim),fis=saldosFisicosV37(fim),nec={antecipados:necessidadeCaixinhaV37('antecipados',fim),trabalhista:necessidadeCaixinhaV37('trabalhista',fim),manutencao:necessidadeCaixinhaV37('manutencao',fim)};
  const ok=await confirmarSistemaV34(`Fechar ${MESES_NOMES[cxMes]} ${cxAno} — V${versao}?\n\nDRE: ${fmtValor(receita)} - ${fmtValor(despesa)} = ${moedaAssinadaV37(resultado)}\nCaixa físico: ${fmtValor(Object.values(fis).reduce((s,v)=>s+v,0))}\n\nA fotografia será preservada. Alterações retroativas exigirão reabertura.`,`Fechar mês`,'alerta','Fechar mês');if(!ok)return;
  const id=`fecho_${cxAno}_${String(cxMes+1).padStart(2,'0')}_v${versao}`,f={id,mes:cxMes,ano:cxAno,mesRef:chaveMesV37(cxMes,cxAno),versao,status:'fechado',fechadoEm:new Date().toISOString(),dre:{receita,despesa,resultado},saldosFisicos:fis,saldosGerenciais:ger,necessidades:nec,conciliacaoId:conc.conc.id,ts:Date.now()};
  await setDoc(doc(db,'tesouraria_fechamentos',id),f);tesFechosV37.push(f);const ns={id:mesFechoIdV37(cxMes,cxAno),mes:cxMes,ano:cxAno,status:'fechado',versao,ultimoFechamentoId:id,fechadoEm:f.fechadoEm,atualizadoEm:f.fechadoEm};await salvarTesStatusV37(ns);toast(`Mês fechado — V${versao} ✓`);renderCaixaView();
}
window.fecharMesTesV37=fecharMesTesV37;
window.reabrirMesTesV37=async function(){
  const st=statusMesTesV37(cxMes,cxAno);if(st.status!=='fechado')return;
  document.body.insertAdjacentHTML('beforeend',`<div class="overlay open" id="modal-reabrir-v37" style="z-index:850"><div class="modal" style="max-width:520px"><div class="modal-header"><div><div class="modal-title">Reabrir ${MESES_NOMES[cxMes]} ${cxAno}</div><div style="font-size:12px;color:var(--texto-muted)">O fechamento V${Number(st.versao||0)} será preservado.</div></div><button class="modal-close" onclick="document.getElementById('modal-reabrir-v37').remove()">✕</button></div><div class="modal-body"><div class="form-group"><label class="form-label">Motivo da reabertura</label><textarea class="form-input" style="min-height:90px" id="reab-motivo-v37" placeholder="Ex.: despesa esquecida, pagamento na conta errada..."></textarea></div><div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:10px 12px;font-size:12px;color:#991b1b">Depois de reabrir, será obrigatório revisar DRE, conciliação, proteções, distribuição e equalização antes do próximo fechamento.</div></div><div class="modal-footer"><button class="btn btn-ghost" onclick="document.getElementById('modal-reabrir-v37').remove()">Cancelar</button><button class="btn btn-danger" onclick="confirmarReaberturaV37()">Reabrir mês</button></div></div></div>`);
};
window.confirmarReaberturaV37=async function(){
  const motivo=document.getElementById('reab-motivo-v37')?.value.trim();if(!motivo)return mensagemSistemaV34('Informe o motivo da reabertura.','Reabertura','alerta');const st=statusMesTesV37(cxMes,cxAno),agora=new Date().toISOString();await salvarTesStatusV37({...st,status:'correcao',motivoReabertura:motivo,reabertoEm:agora,atualizadoEm:agora});document.getElementById('modal-reabrir-v37')?.remove();toast('Mês reaberto e marcado como Em correção.');renderCaixaView();
};

// ─────────────────────────────────────────────────────────────────────────────
// PERFIS — CONTAS E CAIXINHAS
// ─────────────────────────────────────────────────────────────────────────────
window.abrirPerfilContaV37=async function(id){tesPerfilV37={tipo:'conta',id};await renderPerfilContaV37(id);};
async function renderPerfilContaV37(id){
  await carregarTesourariaV37();await carregarMovCaixa();const c=contaTesV37(id),fim=dataFimMesV37(cxMes,cxAno),fis=saldosFisicosV37(fim),lanc=lancamentosContaV37(id,fim),conc=ultimaConciliacaoV37(fim),real=conc?.saldos?.[id],dif=real===undefined?null:Number(real)-Number(fis[id]||0);
  const rows=lanc.map(l=>`<tr><td>${fmtData(l.data)}</td><td><strong>${esc(l.descricao)}</strong><div style="font-size:10.5px;color:var(--texto-muted)">${esc(l.origem)}${l.alunoNome?` · ${esc(l.alunoNome)}`:''}${l.inferida?' · conta inferida':''}</div></td><td style="text-align:right;font-weight:700;color:${l.valor>=0?'var(--verde)':'var(--vermelho)'}">${l.valor>=0?'+':'-'}${fmtValor(Math.abs(l.valor))}</td></tr>`).join('');
  const ger=caixasCfgTesV37().filter(x=>x.local===id).map(x=>`<tr><td>${x.icon} ${esc(x.nome)}</td><td style="text-align:right">${fmtValor(saldoCaixinhaV37(x.id,fim))}</td></tr>`).join('');
  document.getElementById('content').innerHTML=`<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px"><div><button class="btn btn-ghost btn-sm" onclick="tesPerfilV37=null;renderCaixaView()">← Voltar ao Caixa</button><h2 style="margin:12px 0 0;font-family:'Bebas Neue';font-size:30px">${c.icon} ${esc(c.nome)}</h2></div><div style="display:flex;gap:8px"><button class="btn btn-ghost btn-sm" onclick="abrirConciliacaoV37('${fim}')">Conciliar</button><button class="btn btn-primary btn-sm" onclick="abrirTransferenciaTesV37('${id}')">Transferência</button></div></div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:20px"><div class="card"><div class="card-label">Saldo calculado</div><div class="card-value" style="font-size:26px">${fmtValor(fis[id]||0)}</div></div><div class="card"><div class="card-label">Saldo real informado</div><div class="card-value" style="font-size:26px">${real===undefined?'—':fmtValor(real)}</div><div class="card-sub">${conc?`posição ${fmtData(conc.data)}`:'sem conciliação'}</div></div><div class="card" style="border-top:3px solid ${dif===null?'var(--borda)':Math.abs(dif)<0.01?'var(--verde)':'var(--vermelho)'}"><div class="card-label">Diferença</div><div class="card-value" style="font-size:26px;color:${dif===null?'var(--texto-muted)':Math.abs(dif)<0.01?'var(--verde)':'var(--vermelho)'}">${dif===null?'—':moedaAssinadaV37(dif)}</div></div></div><div class="section-box" style="margin-bottom:18px"><div class="section-header"><div><div class="section-title">Composição gerencial hospedada aqui</div><div style="font-size:12px;color:var(--texto-muted)">Caixinhas são classificação gerencial; não são novas contas bancárias.</div></div></div><div class="table-wrap"><table><thead><tr><th>Caixinha</th><th style="text-align:right">Saldo gerencial</th></tr></thead><tbody>${ger||'<tr><td colspan="2"><div class="empty">Nenhuma caixinha configurada nesta posição.</div></td></tr>'}</tbody></table></div></div><div class="section-box"><div class="section-header"><div><div class="section-title">Movimentações físicas</div><div style="font-size:12px;color:var(--texto-muted)">Abertura em 31/08 + escrituração a partir de setembro.</div></div></div><div class="table-wrap"><table><thead><tr><th>Data</th><th>Movimento</th><th style="text-align:right">Valor</th></tr></thead><tbody>${rows||'<tr><td colspan="3"><div class="empty">Nenhuma movimentação depois da abertura.</div></td></tr>'}</tbody></table></div></div>`;loading(false);
}

window.abrirPerfilCaixinhaV37=async function(id){tesPerfilV37={tipo:'caixa',id};await renderPerfilCaixinhaV37(id);};
async function renderPerfilCaixinhaV37(id){
  await carregarTesourariaV37();await carregarMovCaixa();const c=caixaTesV37(id),fim=dataFimMesV37(cxMes,cxAno),saldo=saldoCaixinhaV37(id,fim),nec=necessidadeCaixinhaV37(id,fim),mov=historicoCaixinhaV37(id,fim),rows=mov.map(x=>`<tr><td>${fmtData(x.data)}</td><td>${esc(x.descricao||'Movimentação')}<div style="font-size:10px;color:var(--texto-muted)">${esc(x.origem||'')}</div></td><td style="text-align:right;font-weight:700;color:${x.valor>=0?'var(--verde)':'var(--vermelho)'}">${x.valor>=0?'+':'-'}${fmtValor(Math.abs(x.valor))}</td></tr>`).join('');
  let especial='';
  if(id==='antecipados'){
    const p=provisaoAntecipadosNecessariaV37(fim);especial=`<div class="section-box" style="margin-bottom:18px"><div class="section-header"><div><div class="section-title">Contratos que compõem o necessário</div><div style="font-size:12px;color:var(--texto-muted)">Líquido recebido menos competências líquidas já prestadas.</div></div></div><div class="table-wrap"><table><thead><tr><th>Aluno</th><th>Contrato</th><th style="text-align:right">Recebido</th><th style="text-align:right">Prestado</th><th style="text-align:right">Futuro</th></tr></thead><tbody>${p.itens.map(x=>`<tr><td>${esc(x.alunoNome)}</td><td>${esc(x.contrato)}</td><td style="text-align:right">${fmtValor(x.pago)}</td><td style="text-align:right">${fmtValor(x.reconhecido)}</td><td style="text-align:right;font-weight:700">${fmtValor(x.necessario)}</td></tr>`).join('')||'<tr><td colspan="5"><div class="empty">Nenhum serviço futuro já recebido.</div></td></tr>'}</tbody></table></div></div>`;
  }
  if(id==='manutencao'){
    const mensal=Number(tesConfigV37?.manutencaoMensal||0),gasto=gastoGerencialMesV37('manutencao',cxMes,cxAno),movMes=mensal-gasto;
    especial=`<div class="section-box" style="margin-bottom:18px"><div class="section-header"><div><div class="section-title">Regra especial de manutenção</div><div style="font-size:12px;color:var(--texto-muted)">Orçamento mensal - gasto real = movimento sugerido da provisão.</div></div><button class="btn btn-ghost btn-sm" onclick="editarManutencaoMensalV37()">Editar orçamento</button></div><div style="padding:16px 24px;display:grid;grid-template-columns:repeat(4,1fr);gap:12px"><div><div class="card-label">Orçamento mensal</div><div style="font-family:'Bebas Neue';font-size:25px">${fmtValor(mensal)}</div></div><div><div class="card-label">Orçamento anual</div><div style="font-family:'Bebas Neue';font-size:25px">${fmtValor(mensal*12)}</div></div><div><div class="card-label">Gasto no mês</div><div style="font-family:'Bebas Neue';font-size:25px;color:var(--vermelho)">${fmtValor(gasto)}</div></div><div><div class="card-label">Movimento do mês</div><div style="font-family:'Bebas Neue';font-size:25px;color:${movMes>=0?'var(--verde)':'var(--vermelho)'}">${moedaAssinadaV37(movMes)}</div></div></div></div>`;
  }
  document.getElementById('content').innerHTML=`<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px"><div><button class="btn btn-ghost btn-sm" onclick="tesPerfilV37=null;renderCaixaView()">← Voltar ao Caixa</button><h2 style="margin:12px 0 0;font-family:'Bebas Neue';font-size:30px">${c.icon} ${esc(c.nome)}</h2><div style="font-size:12px;color:var(--texto-muted);max-width:720px">${esc(c.desc||'')}</div></div><button class="btn btn-primary btn-sm" onclick="abrirOperacaoGerencialV37('${id}')">+ Decisão gerencial</button></div><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px"><div class="card"><div class="card-label">Saldo gerencial</div><div class="card-value" style="font-size:26px">${moedaAssinadaV37(saldo)}</div></div><div class="card"><div class="card-label">Necessário / alvo</div><div class="card-value" style="font-size:26px">${nec===null?'—':fmtValor(nec)}</div></div><div class="card"><div class="card-label">Diferença</div><div class="card-value" style="font-size:26px;color:${nec===null?'var(--texto-muted)':saldo>=nec?'var(--verde)':'var(--vermelho)'}">${nec===null?'—':moedaAssinadaV37(saldo-nec)}</div></div><div class="card"><div class="card-label">Hospedagem</div><div style="font-weight:700;margin-top:8px">${esc(contaTesV37(c.local).nome)}</div></div></div>${especial}<div class="section-box"><div class="section-header"><div><div class="section-title">Movimentações da caixinha</div><div style="font-size:12px;color:var(--texto-muted)">Inclui decisões e gastos reais atribuídos a esta origem gerencial.</div></div></div><div class="table-wrap"><table><thead><tr><th>Data</th><th>Movimento</th><th style="text-align:right">Valor</th></tr></thead><tbody>${rows||'<tr><td colspan="3"><div class="empty">Nenhuma movimentação.</div></td></tr>'}</tbody></table></div></div>`;loading(false);
}
window.editarManutencaoMensalV37=async function(){
  const atual=Number(tesConfigV37?.manutencaoMensal||0);document.body.insertAdjacentHTML('beforeend',`<div class="overlay open" id="modal-man-v37" style="z-index:850"><div class="modal" style="max-width:430px"><div class="modal-header"><div class="modal-title">Orçamento mensal de manutenção</div><button class="modal-close" onclick="document.getElementById('modal-man-v37').remove()">✕</button></div><div class="modal-body"><div class="form-group"><label class="form-label">Valor mensal</label><input class="form-input" type="number" step="0.01" id="man-mensal-v37" value="${atual.toFixed(2)}"></div><div class="form-hint">O anual é mensal × 12. No fechamento, sobra acumula; excesso consome o acumulado.</div></div><div class="modal-footer"><button class="btn btn-primary" onclick="salvarManutencaoMensalV37()">Salvar</button></div></div></div>`);
};
window.salvarManutencaoMensalV37=async function(){const v=Number(document.getElementById('man-mensal-v37')?.value||0);if(v<0)return;tesConfigV37.manutencaoMensal=arredV32(v);await salvarTesConfigV37();document.getElementById('modal-man-v37')?.remove();toast('Orçamento de manutenção atualizado ✓');renderPerfilCaixinhaV37('manutencao');};

// Configuração de onde cada caixinha fica hospedada.
window.abrirConfigTesV37=function(){
  const rows=caixasCfgTesV37().map(c=>`<tr><td>${c.icon} ${esc(c.nome)}</td><td><select class="form-select" id="cfgtes-${c.id}">${TES_CONTAS_V37.filter(x=>x.tipo!=='especie').map(x=>`<option value="${x.id}" ${c.local===x.id?'selected':''}>${esc(x.nome)}</option>`).join('')}</select></td></tr>`).join('');
  document.body.insertAdjacentHTML('beforeend',`<div class="overlay open" id="modal-cfgtes-v37" style="z-index:850"><div class="modal" style="max-width:650px"><div class="modal-header"><div><div class="modal-title">Hospedagem das caixinhas</div><div style="font-size:12px;color:var(--texto-muted)">Define onde o dinheiro deveria estar fisicamente quando protegido.</div></div><button class="modal-close" onclick="document.getElementById('modal-cfgtes-v37').remove()">✕</button></div><div class="modal-body"><div class="table-wrap"><table><thead><tr><th>Caixinha</th><th>Local padrão</th></tr></thead><tbody>${rows}</tbody></table></div></div><div class="modal-footer"><button class="btn btn-primary" onclick="salvarConfigTesV37()">Salvar configuração</button></div></div></div>`);
};
window.salvarConfigTesV37=async function(){tesConfigV37.caixas=caixasCfgTesV37().map(c=>({...c,local:document.getElementById(`cfgtes-${c.id}`)?.value||c.local}));await salvarTesConfigV37();document.getElementById('modal-cfgtes-v37')?.remove();toast('Configuração atualizada ✓');renderCaixaView();};

// ─────────────────────────────────────────────────────────────────────────────
// VISÃO GERAL DO CAIXA
// ─────────────────────────────────────────────────────────────────────────────
renderCaixaView=async function(){
  loading(true);ensureCaixaMenu();await carregarTesourariaV37();await carregarMovCaixa();await carregarReceitasAvulsasV35();await carregarPessoalV20();
  if(tesPerfilV37){if(tesPerfilV37.tipo==='conta')return renderPerfilContaV37(tesPerfilV37.id);if(tesPerfilV37.tipo==='caixa')return renderPerfilCaixinhaV37(tesPerfilV37.id);}
  const fim=dataFimMesV37(cxMes,cxAno),fis=saldosFisicosV37(fim),ger=saldosGerenciaisV37(fim),totalFis=Object.values(fis).reduce((s,v)=>s+Number(v||0),0),totalGer=Object.values(ger).reduce((s,v)=>s+Number(v||0),0),livre=totalFis-totalGer,conc=conciliacaoResumoV37(fim),eq=equalizacaoV37(fim),st=statusMesTesV37(cxMes,cxAno),prov=provisaoAntecipadosNecessariaV37(fim),despCats=await loadDespesas(cxMes,cxAno),dreRec=receitaMesEsp(cxMes,cxAno),dreDesp=totalDesp(despCats),dreRes=dreRec-dreDesp;
  const contaCards=TES_CONTAS_V37.filter(c=>c.tipo!=='investimento').map(c=>{
    const inv=c.id==='infinite_corrente'?'infinite_investimento':c.id==='tesouraria_corrente'?'tesouraria_investimento':null;const total=Number(fis[c.id]||0)+(inv?Number(fis[inv]||0):0);
    return `<div class="card" style="cursor:pointer;border-top:3px solid var(--azul)" onclick="abrirPerfilContaV37('${c.id}')"><div style="display:flex;justify-content:space-between;gap:10px"><div><div class="card-label">${c.icon} ${esc(c.instituicao)}</div><div class="card-value" style="font-size:24px">${fmtValor(total)}</div></div><span style="color:var(--texto-muted)">→</span></div>${inv?`<div class="card-sub">Corrente ${fmtValor(fis[c.id]||0)} · Invest. ${fmtValor(fis[inv]||0)}</div>`:`<div class="card-sub">Disponível em espécie</div>`}</div>`;
  }).join('');
  const caixaCards=caixasCfgTesV37().map(c=>{const saldo=Number(ger[c.id]||0),nec=necessidadeCaixinhaV37(c.id,fim),dif=nec===null?null:saldo-nec;return `<div class="card" style="cursor:pointer;border-top:3px solid ${dif!==null&&dif<-.01?'var(--vermelho)':'var(--borda)'}" onclick="abrirPerfilCaixinhaV37('${c.id}')"><div style="display:flex;justify-content:space-between"><div class="card-label">${c.icon} ${esc(c.nome)}</div><span style="color:var(--texto-muted)">→</span></div><div class="card-value" style="font-size:21px">${moedaAssinadaV37(saldo)}</div><div class="card-sub">${nec===null?`Hospedado: ${esc(contaTesV37(c.local).instituicao)}`:`Necessário ${fmtValor(nec)} · ${dif>=0?'coberto':'falta '+fmtValor(Math.abs(dif))}`}</div></div>`;}).join('');
  const concRows=conc.linhas.map(l=>`<tr><td>${l.conta.icon} ${esc(l.conta.nome)}</td><td style="text-align:right">${fmtValor(l.calculado)}</td><td style="text-align:right">${l.real===null?'—':fmtValor(l.real)}</td><td style="text-align:right;font-weight:700;color:${l.dif===null?'var(--texto-muted)':Math.abs(l.dif)<.01?'var(--verde)':'var(--vermelho)'}">${l.dif===null?'—':moedaAssinadaV37(l.dif)}</td></tr>`).join('');
  const eqRows=eq.sugestoes.map(s=>`<tr><td>${esc(contaTesV37(s.origem).nome)}</td><td>→ ${esc(contaTesV37(s.destino).nome)}<div style="font-size:10.5px;color:var(--texto-muted)">${esc(s.motivo)}</div></td><td style="text-align:right;font-weight:700">${fmtValor(s.valor)}</td><td style="text-align:right"><button class="btn btn-primary btn-sm" onclick="abrirTransferenciaTesV37('${s.origem}','${s.destino}',${Number(s.valor)},'Equalização de ${MESES_NOMES[cxMes]} ${cxAno}')">Executar</button></td></tr>`).join('');
  const statusHtml=st.status==='fechado'?`<span class="badge badge-pago">FECHADO · V${Number(st.versao||0)}</span>`:st.status==='correcao'?'<span class="badge badge-pendente">EM CORREÇÃO</span>':'<span class="badge" style="background:#eff6ff;color:#1d4ed8">ABERTO</span>';
  const marco=cxMes===7&&cxAno===2026?`<span class="badge badge-pago" style="margin-left:6px">MARCO DRE CONFIÁVEL</span>`:'';
  document.getElementById('content').innerHTML=`
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;flex-wrap:wrap;gap:12px"><div><div class="mes-selector"><button class="mes-btn" onclick="cxMes--;if(cxMes<0){cxMes=11;cxAno--}renderCaixaView()">◀</button><div class="mes-label">${MESES_NOMES[cxMes]} ${cxAno}</div><button class="mes-btn" onclick="cxMes++;if(cxMes>11){cxMes=0;cxAno++}renderCaixaView()">▶</button></div><div style="margin-top:7px">${statusHtml}${marco}</div></div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-ghost btn-sm" onclick="abrirConfigTesV37()">⚙ Configurar</button><button class="btn btn-ghost btn-sm" onclick="abrirConciliacaoV37('${fim}')">✓ Conciliar contas</button><button class="btn btn-primary btn-sm" onclick="abrirDistribuicaoV37()">Distribuir / revisar</button><button class="btn btn-ghost btn-sm" onclick="abrirOperacaoGerencialV37()">+ Operação gerencial</button>${st.status==='fechado'?`<button class="btn btn-danger btn-sm" onclick="reabrirMesTesV37()">Reabrir</button>`:`<button class="btn btn-success btn-sm" onclick="fecharMesTesV37()">Fechar mês</button>`}</div></div>
    <div style="background:#f8fafc;border:1px solid var(--borda);border-radius:10px;padding:13px 16px;margin-bottom:18px;font-size:12px;display:flex;justify-content:space-between;gap:15px;flex-wrap:wrap"><div><strong>Escrituração física:</strong> abertura em 31/08/2026. Setembro em diante é reconstruído por entradas, saídas e transferências reais.</div><div><strong>Sugestão ≠ transação.</strong> Equalização só muda o saldo quando Fernando marcar a transferência como executada.</div></div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px"><div class="card" style="border-top:3px solid var(--verde)"><div class="card-label">Resultado DRE</div><div class="card-value" style="font-size:25px;color:${dreRes>=0?'var(--verde)':'var(--vermelho)'}">${moedaAssinadaV37(dreRes)}</div><div class="card-sub">Competência: rec. ${fmtValor(dreRec)} · desp. ${fmtValor(dreDesp)}</div></div><div class="card"><div class="card-label">Caixa físico total</div><div class="card-value" style="font-size:25px">${fmtValor(totalFis)}</div><div class="card-sub">Contas + espécie</div></div><div class="card" style="border-top:3px solid #92400e"><div class="card-label">Antecipados necessários</div><div class="card-value" style="font-size:25px;color:#92400e">${fmtValor(prov.total)}</div><div class="card-sub">Protegido ${fmtValor(ger.antecipados||0)} · falta ${fmtValor(Math.max(0,prov.total-Number(ger.antecipados||0)))}</div></div><div class="card" style="border-top:3px solid ${livre>=0?'var(--azul)':'var(--vermelho)'}"><div class="card-label">Caixa livre gerencial</div><div class="card-value" style="font-size:25px;color:${livre>=0?'var(--azul)':'var(--vermelho)'}">${moedaAssinadaV37(livre)}</div><div class="card-sub">Físico menos destinações registradas</div></div></div>
    <div class="section-box" style="margin-bottom:20px"><div class="section-header"><div><div class="section-title">Contas físicas</div><div style="font-size:12px;color:var(--texto-muted)">Clique para abrir o perfil, extrato e conciliação da conta.</div></div></div><div style="padding:16px 24px;display:grid;grid-template-columns:repeat(3,1fr);gap:14px">${contaCards}</div></div>
    <div class="section-box" style="margin-bottom:20px"><div class="section-header"><div><div class="section-title">Destinações / caixinhas</div><div style="font-size:12px;color:var(--texto-muted)">Clique para ver perfil, necessidade, composição e movimentações.</div></div></div><div style="padding:16px 24px;display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px">${caixaCards}</div></div>
    <div class="section-box" style="margin-bottom:20px"><div class="section-header"><div><div class="section-title">Conciliação bancária / física</div><div style="font-size:12px;color:var(--texto-muted)">Sistema x saldo real informado. Isto é diferente da equalização das caixinhas.</div></div><div>${conc.conc?`Última: <strong>${fmtData(conc.conc.data)}</strong>`:'<span style="color:var(--vermelho)">Sem conciliação</span>'}</div></div><div class="table-wrap"><table><thead><tr><th>Posição</th><th style="text-align:right">Sistema</th><th style="text-align:right">Real</th><th style="text-align:right">Diferença</th></tr></thead><tbody>${concRows}</tbody></table></div></div>
    <div class="section-box"><div class="section-header"><div><div class="section-title">Equalização das destinações</div><div style="font-size:12px;color:var(--texto-muted)">Compensa aplicações e usos do mês e sugere somente a transferência física líquida necessária.</div></div></div><div class="table-wrap"><table><thead><tr><th>Origem</th><th>Destino / motivo</th><th style="text-align:right">Valor</th><th></th></tr></thead><tbody>${eqRows||'<tr><td colspan="4"><div class="empty" style="color:var(--verde)">✓ Nenhuma transferência física necessária para equalizar as posições.</div></td></tr>'}</tbody></table></div></div>`;
  loading(false);
};
window.renderCaixaView=renderCaixaView;

// ─────────────────────────────────────────────────────────────────────────────
// PDF / IMPRESSÃO INSTITUCIONAL
// ─────────────────────────────────────────────────────────────────────────────
function estiloImpressaoStudioV37(){return `<style>@page{size:A4;margin:13mm}*{box-sizing:border-box}body{font-family:Arial,Helvetica,sans-serif;color:#161616;margin:0;font-size:11px;line-height:1.4}.brand{border-top:7px solid #c62828;padding:18px 0 14px;border-bottom:1px solid #ddd;display:flex;justify-content:space-between;align-items:flex-end}.brand h1{font-size:25px;letter-spacing:.5px;margin:0}.brand .sub{color:#777;font-size:10px;text-transform:uppercase;letter-spacing:1px}.periodo{font-size:14px;font-weight:700}.kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin:17px 0}.kpi{border:1px solid #ddd;border-radius:8px;padding:11px}.kpi small{display:block;color:#777;text-transform:uppercase;font-size:8.5px;letter-spacing:.7px}.kpi strong{display:block;font-size:19px;margin-top:4px}.sec{margin-top:18px}.sec-title{background:#181818;color:#fff;padding:7px 9px;font-size:11px;text-transform:uppercase;letter-spacing:.8px;border-left:5px solid #c62828}table{width:100%;border-collapse:collapse}th{font-size:8.5px;color:#666;text-transform:uppercase;letter-spacing:.4px;text-align:left;background:#f5f5f5}th,td{padding:6px 7px;border-bottom:1px solid #e8e8e8;vertical-align:top}.num{text-align:right;font-weight:700;white-space:nowrap}.muted{font-size:8.8px;color:#777;margin-top:2px}.total td{font-weight:700;border-top:2px solid #222}.foot{margin-top:20px;border-top:1px solid #ddd;padding-top:8px;color:#777;font-size:8.5px;display:flex;justify-content:space-between}.no-print{margin-bottom:12px;background:#c62828;color:#fff;border:0;border-radius:5px;padding:8px 14px;font-weight:700}@media print{.no-print{display:none}.sec{break-inside:avoid}.page-break{break-before:page}}</style>`;}
window.imprimirDREV35=async function(){
  await carregarReceitasAvulsasV35();const cats=await loadDespesas(finMes,finAno),modo=financeiroModo,linhas=modo==='competencia'?linhasReceitaCompetenciaV35(finMes,finAno):linhasReceitaCaixaV35(finMes,finAno),rec=linhas.reduce((s,l)=>s+Number(l.valor||0),0),desp=modo==='competencia'?totalDesp(cats):totalDespesaCaixaV32(finMes,finAno),res=rec-desp;
  const lr=linhas.map(l=>`<tr><td><strong>${esc(l.alunoNome||'—')}</strong><div class="muted">${esc(l.descricao||'')} · ${esc(l.detalhe||'')}</div><div class="muted">Origem: ${esc(l.tipo)} / ${esc(l.origemId)}</div></td><td class="num">${moedaAssinadaV37(l.valor)}</td></tr>`).join('');let ld='';Object.entries(cats||{}).forEach(([cat,lista])=>(lista||[]).filter(d=>Number(d.valor)>0).forEach(d=>ld+=`<tr><td><strong>${esc(d.desc)}</strong><div class="muted">${esc(catLabelV32(cat))}</div></td><td class="num">${fmtValor(d.valor)}</td></tr>`));
  const titulo=modo==='competencia'?'DRE — Regime de Competência':'Resumo de Caixa Realizado',marco=finMes===7&&finAno===2026?' · Marco confiável':'';
  const html=`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Studio FB — ${titulo}</title>${estiloImpressaoStudioV37()}</head><body><button class="no-print" onclick="window.print()">Imprimir / Salvar PDF</button><div class="brand"><div><div class="sub">STUDIO FB · GESTÃO FINANCEIRA</div><h1>${titulo}</h1></div><div class="periodo">${MESES_NOMES[finMes]} ${finAno}${marco}</div></div><div class="kpis"><div class="kpi"><small>Receita</small><strong>${fmtValor(rec)}</strong></div><div class="kpi"><small>Despesas</small><strong>${fmtValor(desp)}</strong></div><div class="kpi"><small>Resultado</small><strong style="color:${res>=0?'#1b7f45':'#c62828'}">${moedaAssinadaV37(res)}</strong></div></div><div class="sec"><div class="sec-title">Receitas com origem rastreável</div><table><thead><tr><th>Origem / competência</th><th class="num">Valor</th></tr></thead><tbody>${lr||'<tr><td>Nenhuma receita.</td><td class="num">R$ 0,00</td></tr>'}<tr class="total"><td>Total de receitas</td><td class="num">${fmtValor(rec)}</td></tr></tbody></table></div><div class="sec"><div class="sec-title">Despesas</div><table><thead><tr><th>Despesa / categoria</th><th class="num">Valor</th></tr></thead><tbody>${ld||'<tr><td>Nenhuma despesa.</td><td class="num">R$ 0,00</td></tr>'}<tr class="total"><td>Total de despesas</td><td class="num">${fmtValor(desp)}</td></tr></tbody></table></div><div class="foot"><span>Studio FB · Documento gerencial gerado pelo sistema</span><span>${new Date().toLocaleString('pt-BR')}</span></div></body></html>`;
  const w=window.open('','_blank');if(!w)return mensagemSistemaV34('Libere pop-ups para imprimir.','Impressão bloqueada','alerta');w.document.write(html);w.document.close();
};
imprimirDRE=window.imprimirDREV35;

// Simulação de cancelamento recebe a mesma linguagem institucional.
const imprimirSimulacaoBaseV37=window.imprimirSimulacaoCancelamentoV34;
window.imprimirSimulacaoCancelamentoV34=function(){
  const alunoId=document.getElementById('cr-aluno-id')?.value,contratoId=document.getElementById('cr-contrato-id')?.value,a=alunos.find(x=>String(x.id)===String(alunoId)),c=contratos.find(x=>String(x.id)===String(contratoId));if(!a||!c)return imprimirSimulacaoBaseV37();
  const extras=extrasModalV32(),calc=calcularCancelamentoV32(c,{dataCancelamento:document.getElementById('cr-data')?.value,valorTotal:Number(document.getElementById('cr-total')?.value||0),valorVista:Number(document.getElementById('cr-vista')?.value||0),extrasTotal:extras.reduce((s,x)=>s+x.valor,0)}),valorAcordado=Math.max(0,Number(document.getElementById('cr-acordado')?.value||0)),tipo=calc.tipoAcerto==='reembolso'?'A reembolsar ao aluno':calc.tipoAcerto==='receber'?'A receber do aluno':'Sem acerto financeiro';
  const rows=[['Valor total do contrato - bruto',calc.valorTotal],['Valor líquido / à vista',calc.valorVista],['Valor mensal contratual',calc.valorMensal],['Valor utilizado',calc.valorConsumido],[`Multa (${calc.percentualMulta}%)`,calc.multaRetida],['Extras',calc.extrasDescontados],['Custo contratual',calc.totalDevidoCancelamento],['Reembolso teórico',calc.reembolsoTeorico],['Total pago considerado',calc.valorPagoConsiderado]].map(([l,v])=>`<tr><td>${esc(l)}</td><td class="num">${fmtValor(v)}</td></tr>`).join('');
  const html=`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Simulação de Cancelamento</title>${estiloImpressaoStudioV37()}</head><body><button class="no-print" onclick="window.print()">Imprimir / Salvar PDF</button><div class="brand"><div><div class="sub">STUDIO FB · CONTRATOS</div><h1>Simulação de Cancelamento</h1></div><div class="periodo">NÃO CONFIRMADA</div></div><div style="margin:15px 0;padding:11px;border:1px solid #ddd;border-radius:8px"><strong>${esc(a.nome)}</strong><div class="muted">${esc(nomeContrato(c))} · cancelamento simulado em ${fmtData(calc.dataCancelamento)}</div></div><div class="sec"><div class="sec-title">Apuração contratual</div><table><tbody>${rows}</tbody></table></div><div class="kpis"><div class="kpi"><small>Meses utilizados</small><strong>${calc.mesesUsados}/${calc.mesesPlano}</strong></div><div class="kpi"><small>Resultado calculado</small><strong>${esc(tipo)}</strong></div><div class="kpi"><small>Valor acordado simulado</small><strong>${fmtValor(valorAcordado)}</strong></div></div><div class="foot"><span>Simulação sem efeito no contrato, DRE ou caixa</span><span>${new Date().toLocaleString('pt-BR')}</span></div></body></html>`;const w=window.open('','_blank');if(!w)return mensagemSistemaV34('Libere pop-ups para imprimir.','Impressão bloqueada','alerta');w.document.write(html);w.document.close();
};

// ─────────────────────────────────────────────────────────────────────────────
// FINANCEIRO: sinalização de agosto como marco confiável
// ─────────────────────────────────────────────────────────────────────────────
const renderFinanceiroBaseV37=renderFinanceiroView;
renderFinanceiroView=async function(){await renderFinanceiroBaseV37();if(finMes===7&&finAno===2026){const c=document.getElementById('content');if(c&&!document.getElementById('marco-dre-v37'))c.insertAdjacentHTML('afterbegin','<div id="marco-dre-v37" style="margin-bottom:14px;background:#f0fdf4;border:1px solid #bbf7d0;color:#166534;border-radius:8px;padding:10px 13px;font-size:12px"><strong>✓ Agosto/2026 é o primeiro mês marcado como DRE confiável.</strong> A tesouraria física passa a ser escriturada a partir da posição de 31/08/2026.</div>');}}
window.renderFinanceiroView=renderFinanceiroView;

// Inicialização V37: prepara Tesouraria sem interferir na abertura do dashboard.
const initBaseV37=init;
init=async function(){await initBaseV37();setTimeout(()=>carregarTesourariaV37().catch(console.error),800);};

// V37.1 — Perfil de conta em nível de instituição (corrente + investimento).
function idsInstituicaoTesV371(id){
  if(id==='infinite_corrente'||id==='infinite_investimento')return['infinite_corrente','infinite_investimento'];
  if(id==='tesouraria_corrente'||id==='tesouraria_investimento')return['tesouraria_corrente','tesouraria_investimento'];
  return['especie'];
}
renderPerfilContaV37=async function(id){
  await carregarTesourariaV37();await carregarMovCaixa();
  const ids=idsInstituicaoTesV371(id),base=contaTesV37(ids[0]),fim=dataFimMesV37(cxMes,cxAno),fis=saldosFisicosV37(fim),conc=ultimaConciliacaoV37(fim);
  const total=ids.reduce((s,x)=>s+Number(fis[x]||0),0),realTotal=conc?ids.reduce((s,x)=>s+Number(conc.saldos?.[x]||0),0):null,dif=realTotal===null?null:realTotal-total;
  const posCards=ids.map(x=>{const c=contaTesV37(x),real=conc?Number(conc.saldos?.[x]||0):null,df=real===null?null:real-Number(fis[x]||0);return `<div class="card" style="border-top:3px solid ${df===null?'var(--borda)':Math.abs(df)<.01?'var(--verde)':'var(--vermelho)'}"><div class="card-label">${c.icon} ${esc(c.tipo==='especie'?'Espécie':c.tipo==='corrente'?'Corrente':'Investimento')}</div><div class="card-value" style="font-size:24px">${fmtValor(fis[x]||0)}</div><div class="card-sub">Real: ${real===null?'—':fmtValor(real)} · Dif.: ${df===null?'—':moedaAssinadaV37(df)}</div></div>`;}).join('');
  const lanc=lancamentosFisicosV37(fim).filter(l=>ids.includes(l.conta)).sort((a,b)=>(dataLocal(b.data)?.getTime()||0)-(dataLocal(a.data)?.getTime()||0));
  const rows=lanc.map(l=>`<tr><td>${fmtData(l.data)}</td><td>${esc(contaTesV37(l.conta).tipo==='investimento'?'Investimento':contaTesV37(l.conta).tipo==='corrente'?'Corrente':'Espécie')}</td><td><strong>${esc(l.descricao)}</strong><div style="font-size:10.5px;color:var(--texto-muted)">${esc(l.origem)}${l.alunoNome?` · ${esc(l.alunoNome)}`:''}${l.inferida?' · conta inferida':''}</div></td><td style="text-align:right;font-weight:700;color:${l.valor>=0?'var(--verde)':'var(--vermelho)'}">${l.valor>=0?'+':'-'}${fmtValor(Math.abs(l.valor))}</td></tr>`).join('');
  const ger=caixasCfgTesV37().filter(x=>ids.includes(x.local)).map(x=>`<tr><td>${x.icon} ${esc(x.nome)}</td><td>${esc(contaTesV37(x.local).tipo==='investimento'?'Investimento':'Corrente')}</td><td style="text-align:right">${moedaAssinadaV37(saldoCaixinhaV37(x.id,fim))}</td></tr>`).join('');
  document.getElementById('content').innerHTML=`<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;flex-wrap:wrap;gap:10px"><div><button class="btn btn-ghost btn-sm" onclick="tesPerfilV37=null;renderCaixaView()">← Voltar ao Caixa</button><h2 style="margin:12px 0 0;font-family:'Bebas Neue';font-size:30px">${base.icon} ${esc(base.instituicao)}</h2><div style="font-size:12px;color:var(--texto-muted)">${ids.length>1?'Visão consolidada de corrente e investimento.':'Controle do dinheiro físico em espécie.'}</div></div><div style="display:flex;gap:8px"><button class="btn btn-ghost btn-sm" onclick="abrirConciliacaoV37('${fim}')">Conciliar</button>${ids.length>1?`<button class="btn btn-primary btn-sm" onclick="abrirTransferenciaTesV37('${ids[0]}','${ids[1]}')">Transferência / aplicação</button>`:''}</div></div><div style="display:grid;grid-template-columns:${ids.length>1?'repeat(4,1fr)':'repeat(3,1fr)'};gap:14px;margin-bottom:20px"><div class="card" style="border-top:3px solid var(--azul)"><div class="card-label">Saldo total ${esc(base.instituicao)}</div><div class="card-value" style="font-size:26px">${fmtValor(total)}</div></div>${posCards}<div class="card" style="border-top:3px solid ${dif===null?'var(--borda)':Math.abs(dif)<.01?'var(--verde)':'var(--vermelho)'}"><div class="card-label">Diferença total</div><div class="card-value" style="font-size:26px;color:${dif===null?'var(--texto-muted)':Math.abs(dif)<.01?'var(--verde)':'var(--vermelho)'}">${dif===null?'—':moedaAssinadaV37(dif)}</div></div></div><div class="section-box" style="margin-bottom:18px"><div class="section-header"><div><div class="section-title">Composição gerencial hospedada na instituição</div><div style="font-size:12px;color:var(--texto-muted)">Mostra quais destinações estão na corrente ou no investimento.</div></div></div><div class="table-wrap"><table><thead><tr><th>Caixinha</th><th>Posição</th><th style="text-align:right">Saldo gerencial</th></tr></thead><tbody>${ger||'<tr><td colspan="3"><div class="empty">Nenhuma caixinha hospedada aqui.</div></td></tr>'}</tbody></table></div></div><div class="section-box"><div class="section-header"><div><div class="section-title">Extrato escritural</div><div style="font-size:12px;color:var(--texto-muted)">Entradas, saídas, aplicações, resgates e transferências reais.</div></div></div><div class="table-wrap"><table><thead><tr><th>Data</th><th>Posição</th><th>Movimento</th><th style="text-align:right">Valor</th></tr></thead><tbody>${rows||'<tr><td colspan="4"><div class="empty">Nenhuma movimentação depois da abertura.</div></td></tr>'}</tbody></table></div></div>`;
  loading(false);
};

