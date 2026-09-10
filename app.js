const SUPABASE_URL = "https://baeflgfufqguqszmqjys.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_p5GVlyDkYfKWf4ikWnODYg_kHu_dtzN";
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const CHILD_ALLOWANCE = 105000;
const FUTURE_REHAB2_START = "2026-10-01";
const FIXED_LIKE_CATEGORIES = new Set([
  "보험", "통신", "차량", "주거/공과금", "개인회생/채무", "교회/헌금", "자녀용돈/적립", "생활/렌탈", "채무"
]);

const DEFAULT_RECURRING = [
  {item_type:"expense",name:"삼성생명보험 · 희윤 실비",amount:44818,category:"보험",person_name:"민정",account_name:"민정 2115",due_day:null,is_variable:false,memo:"자동이체"},
  {item_type:"expense",name:"코웨이 정수기",amount:25900,category:"생활/렌탈",person_name:"민정",account_name:"민정 2115",due_day:null,is_variable:false,memo:"자동이체"},
  {item_type:"expense",name:"쿠팡와우 월회비",amount:7890,category:"생활/렌탈",person_name:"민정",account_name:"민정 2115",due_day:null,is_variable:false,memo:"자동이체"},
  {item_type:"expense",name:"현대해상보험 · 민정 실비",amount:76630,category:"보험",person_name:"민정",account_name:"민정 2115",due_day:null,is_variable:false,memo:"자동이체"},
  {item_type:"expense",name:"DB손해보험 · 민정 운전자",amount:10290,category:"보험",person_name:"민정",account_name:"민정 2115",due_day:null,is_variable:false,memo:"자동이체"},
  {item_type:"expense",name:"DB손해보험 · 민정 치과",amount:27320,category:"보험",person_name:"민정",account_name:"민정 2115",due_day:null,is_variable:false,memo:"자동이체"},
  {item_type:"expense",name:"DB손해보험 · 희윤 치과",amount:37490,category:"보험",person_name:"민정",account_name:"민정 2115",due_day:null,is_variable:false,memo:"자동이체"},
  {item_type:"expense",name:"LG유플러스 · 민정폰",amount:104020,category:"통신",person_name:"민정",account_name:"민정 2115",due_day:null,is_variable:false,memo:"자동이체"},
  {item_type:"expense",name:"LG유플러스 · 희윤폰",amount:29000,category:"통신",person_name:"민정",account_name:"민정 2115",due_day:null,is_variable:false,memo:"자동이체"},
  {item_type:"expense",name:"하나캐피탈 · 카니발 리스",amount:739970,category:"차량",person_name:"민정",account_name:"민정 2115",due_day:null,is_variable:false,memo:"자동이체"},
  {item_type:"expense",name:"관사 관리비",amount:265470,category:"주거/공과금",person_name:"민정",account_name:"민정 2115",due_day:null,is_variable:true,memo:"월별 금액 확인"},
  {item_type:"expense",name:"GS 도시가스",amount:40090,category:"주거/공과금",person_name:"민정",account_name:"민정 2115",due_day:null,is_variable:true,memo:"직접납부"},
  {item_type:"expense",name:"희윤 구몬",amount:83000,category:"자녀교육",person_name:"민정",account_name:"민정 2115",due_day:null,is_variable:false,memo:"자동이체"},
  {item_type:"transfer",name:"희윤 용돈",amount:30000,category:"자녀용돈/적립",person_name:"민정",account_name:"민정 7777",due_day:null,is_variable:false,memo:"9월 지급완료 · 현금 15,000 + 계좌 15,000"},
  {item_type:"expense",name:"개인회생 2",amount:600000,category:"개인회생/채무",person_name:"민정",account_name:"월급통장",due_day:10,is_variable:false,memo:"2026년 10월부터 실제 납부"},
  {item_type:"expense",name:"DB손해보험 · 남편 운전자",amount:10400,category:"보험",person_name:"남편",account_name:"남편 고정비 통장",due_day:null,is_variable:false,memo:"고정"},
  {item_type:"expense",name:"신용위원회 대출",amount:140000,category:"채무",person_name:"남편",account_name:"남편 고정비 통장",due_day:null,is_variable:false,memo:"고정"},
  {item_type:"expense",name:"삼성생명보험 · 태평 실비",amount:10083,category:"보험",person_name:"남편",account_name:"남편 고정비 통장",due_day:null,is_variable:false,memo:"고정"},
  {item_type:"expense",name:"현대해상보험 · 세훈 실비",amount:51040,category:"보험",person_name:"남편",account_name:"남편 고정비 통장",due_day:null,is_variable:false,memo:"고정"},
  {item_type:"expense",name:"LG유플러스 · 인터넷",amount:25000,category:"통신",person_name:"남편",account_name:"남편 고정비 통장",due_day:null,is_variable:false,memo:"고정"},
  {item_type:"expense",name:"LG유플러스 · 세훈폰",amount:40380,category:"통신",person_name:"남편",account_name:"남편 고정비 통장",due_day:null,is_variable:false,memo:"고정"},
  {item_type:"expense",name:"개인회생 1",amount:1022000,category:"개인회생/채무",person_name:"남편",account_name:"월급통장",due_day:10,is_variable:false,memo:"세훈 고정비 · 매월"},
  {item_type:"expense",name:"십일조",amount:600000,category:"교회/헌금",person_name:"남편",account_name:"월급통장",due_day:10,is_variable:true,memo:"급여에 따라 매달 변경"},
  {item_type:"income",name:"태평 아동수당",amount:105000,category:"아동수당",person_name:"민정",account_name:"민정 2115",due_day:25,is_variable:false,memo:"24~25일 입금 예정"}
];

const DEFAULT_TRANSACTIONS = [
  {tx_date:"2026-09-10",tx_type:"income",amount:5889900,description:"재정단 급여",category:"급여",person_name:"남편",account_name:"월급통장",memo:"9월 월급"},
  {tx_date:"2026-09-10",tx_type:"expense",amount:600000,description:"십일조",category:"교회/헌금",person_name:"남편",account_name:"월급통장",memo:"9월 실제 납부"},
  {tx_date:"2026-09-10",tx_type:"expense",amount:1022000,description:"개인회생 1 · 9월분",category:"개인회생/채무",person_name:"남편",account_name:"월급통장",memo:"9월분 납부"},
  {tx_date:"2026-09-10",tx_type:"expense",amount:1022000,description:"개인회생 1 · 8월 미납분",category:"개인회생/채무",person_name:"남편",account_name:"월급통장",memo:"8월 미납분을 9월에 납부"},
  {tx_date:"2026-09-10",tx_type:"transfer",amount:2700000,description:"민정 7777로 이체",category:"계좌이동",person_name:"민정",account_name:"월급통장",memo:"생활비 + 고정비 준비"},
  {tx_date:"2026-09-10",tx_type:"transfer",amount:300000,description:"남편 고정비 통장으로 이체",category:"계좌이동",person_name:"남편",account_name:"월급통장",memo:"고정비 준비"},
  {tx_date:"2026-09-10",tx_type:"expense",amount:9100,description:"쿠팡 누룽지팝 4개",category:"식비/간식",person_name:"남편",account_name:"카드/기타",memo:""},
  {tx_date:"2026-09-10",tx_type:"transfer",amount:1400000,description:"7777 → 2115 고정비통장",category:"계좌이동",person_name:"민정",account_name:"민정 7777",memo:"2115 이체 전 잔액 2,530원 · 이체 직후 기준 1,402,530원"},
  {tx_date:"2026-09-10",tx_type:"transfer",amount:15000,description:"희윤 용돈 · 계좌 지급",category:"자녀용돈/적립",person_name:"민정",account_name:"민정 7777",memo:"9월 총 용돈 30,000원 지급완료 · 현금 15,000원은 기존 현금에서 지급"},
  {tx_date:"2026-09-10",tx_type:"expense",amount:100000,description:"가족회비",category:"가족회비",person_name:"민정",account_name:"민정 7777",memo:""}
];

let sessionUser=null, membership=null, householdId=null, transactions=[], recurringItems=[], pollTimer=null;
const $=sel=>document.querySelector(sel);
const won=n=>`${new Intl.NumberFormat("ko-KR").format(Math.round(Number(n)||0))}원`;
const localISODate=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;};
const monthBounds=()=>{const d=new Date(),y=d.getFullYear(),m=d.getMonth(),last=new Date(y,m+1,0).getDate();return {start:`${y}-${String(m+1).padStart(2,"0")}-01`,end:`${y}-${String(m+1).padStart(2,"0")}-${String(last).padStart(2,"0")}`,y,m:m+1};};

function showAuth(message=""){ $("#authScreen").classList.remove("hidden"); $("#app").classList.add("hidden"); $("#loginMessage").textContent=message; }
function showApp(){ $("#authScreen").classList.add("hidden"); $("#app").classList.remove("hidden"); }
function setEntryMessage(msg,isError=false){const el=$("#entryMessage");el.textContent=msg;el.classList.toggle("error",isError);}
async function login(email,password){const {data,error}=await db.auth.signInWithPassword({email,password});if(error)throw error;return data.session;}

async function loadMembership(){
  const {data,error}=await db.from("household_members").select("household_id, display_name, role").eq("user_id",sessionUser.id).single();
  if(error)throw new Error("이 계정이 우리집 가계부 구성원으로 연결되지 않았어요.");
  membership=data; householdId=data.household_id;
  $("#currentUser").textContent=`${data.display_name} · ${data.role==="owner"?"관리자":"가족"}`;
  $("#person").value=data.display_name==="민정"?"민정":"남편";
}

async function seedIfNeeded(){
  if(membership.role!=="owner")return;
  const {count:rc,error:re}=await db.from("recurring_items").select("id",{count:"exact",head:true}).eq("household_id",householdId); if(re)throw re;
  if(rc===0){const {error}=await db.from("recurring_items").insert(DEFAULT_RECURRING.map(x=>({...x,household_id:householdId,active:true})));if(error)throw error;}
  const {count:tc,error:te}=await db.from("transactions").select("id",{count:"exact",head:true}).eq("household_id",householdId);if(te)throw te;
  if(tc===0){const {error}=await db.from("transactions").insert(DEFAULT_TRANSACTIONS.map(x=>({...x,household_id:householdId})));if(error)throw error;}
}

async function migrateSeptember2026(){
  if(membership.role!=="owner")return;
  const {data:recs,error:rErr}=await db.from("recurring_items").select("*").eq("household_id",householdId); if(rErr)throw rErr;
  const oldRehab=(recs||[]).find(x=>x.active&&x.name==="개인회생"&&Number(x.amount)===2044000);
  if(oldRehab){const {error}=await db.from("recurring_items").update({active:false,memo:"2026-09 구조개편으로 종료"}).eq("id",oldRehab.id);if(error)throw error;}
  const ensureRecurring=async item=>{if((recs||[]).some(x=>x.active&&x.name===item.name&&Number(x.amount)===Number(item.amount)))return;const {error}=await db.from("recurring_items").insert({...item,household_id:householdId,active:true});if(error)throw error;};
  await ensureRecurring(DEFAULT_RECURRING.find(x=>x.name==="개인회생 1"));
  await ensureRecurring(DEFAULT_RECURRING.find(x=>x.name==="개인회생 2"));
  await ensureRecurring(DEFAULT_RECURRING.find(x=>x.name==="쿠팡와우 월회비"));
  const oldAllowance=(recs||[]).find(x=>x.active&&x.name==="희윤 용돈통장 · 카뱅1349");
  if(oldAllowance){const {error}=await db.from("recurring_items").update({name:"희윤 용돈",memo:"9월 지급완료 · 현금 15,000 + 계좌 15,000"}).eq("id",oldAllowance.id);if(error)throw error;}

  const {data:txs,error:tErr}=await db.from("transactions").select("*").eq("household_id",householdId).eq("tx_date","2026-09-10");if(tErr)throw tErr;
  const oldCurrent=(txs||[]).find(x=>x.description==="개인회생 1"&&Number(x.amount)===1022000);
  if(oldCurrent){const {error}=await db.from("transactions").update({description:"개인회생 1 · 9월분",memo:"9월분 납부"}).eq("id",oldCurrent.id);if(error)throw error;}
  const oldWrong=(txs||[]).find(x=>x.description==="개인회생 2"&&Number(x.amount)===1022000);
  if(oldWrong){const {error}=await db.from("transactions").update({description:"개인회생 1 · 8월 미납분",memo:"8월 미납분을 9월에 납부"}).eq("id",oldWrong.id);if(error)throw error;}
  const ensureTx=async item=>{if((txs||[]).some(x=>x.tx_type===item.tx_type&&Number(x.amount)===Number(item.amount)&&x.description===item.description))return;const {error}=await db.from("transactions").insert({...item,household_id:householdId});if(error)throw error;};
  for(const name of ["7777 → 2115 고정비통장","희윤 용돈 · 계좌 지급","가족회비"]){await ensureTx(DEFAULT_TRANSACTIONS.find(x=>x.description===name));}
}

function recurringAppliesThisMonth(item){
  const {y,m}=monthBounds(); const key=`${y}-${String(m).padStart(2,"0")}-01`;
  if(item.name==="개인회생 2"&&key<FUTURE_REHAB2_START)return false;
  return true;
}

async function loadData(){
  if(!householdId)return; const {start,end,m}=monthBounds(); $("#monthTitle").textContent=`${m}월 가계부`;
  const [txRes,recRes]=await Promise.all([
    db.from("transactions").select("*").eq("household_id",householdId).gte("tx_date",start).lte("tx_date",end).order("tx_date",{ascending:false}).order("created_at",{ascending:false}),
    db.from("recurring_items").select("*").eq("household_id",householdId).eq("active",true).order("person_name",{ascending:true}).order("amount",{ascending:false})
  ]);
  if(txRes.error)throw txRes.error;if(recRes.error)throw recRes.error;transactions=txRes.data||[];recurringItems=recRes.data||[];render();
}

function isLivingExpense(tx){if(tx.tx_type!=="expense")return false;if(FIXED_LIKE_CATEGORIES.has(tx.category))return false;if(tx.category==="자녀교육"&&/구몬/.test(tx.description||""))return false;return true;}
function plannedExpenseAmount(){return recurringItems.filter(x=>x.item_type==="expense"&&recurringAppliesThisMonth(x)).reduce((s,x)=>s+Number(x.amount),0);}
function plannedTransferReserve(){return recurringItems.filter(x=>x.item_type==="transfer"&&recurringAppliesThisMonth(x)).reduce((s,x)=>s+Number(x.amount),0);}
function allowanceAlreadyReceived(){return transactions.some(x=>x.tx_type==="income"&&(x.category==="아동수당"||/아동수당/.test(x.description||"")));}
function priorMonthArrearsPaid(){return transactions.filter(x=>x.tx_type==="expense"&&/미납분/.test(`${x.description||""} ${x.memo||""}`)).reduce((s,x)=>s+Number(x.amount),0);}

function renderSummary(){
  const income=transactions.filter(x=>x.tx_type==="income").reduce((s,x)=>s+Number(x.amount),0);
  const transfers=transactions.filter(x=>x.tx_type==="transfer").reduce((s,x)=>s+Number(x.amount),0);
  const livingSpent=transactions.filter(isLivingExpense).reduce((s,x)=>s+Number(x.amount),0);
  const plannedObligations=plannedExpenseAmount()+plannedTransferReserve();
  const arrears=priorMonthArrearsPaid();
  const livingAvailable=Math.max(0,income-plannedObligations-arrears);
  const remaining=income-plannedObligations-arrears-livingSpent;
  const allowancePending=allowanceAlreadyReceived()?0:CHILD_ALLOWANCE, afterAllowance=remaining+allowancePending;
  $("#incomeTotal").textContent=won(income);$("#plannedFixedTotal").textContent=won(plannedObligations);$("#livingExpenseTotal").textContent=won(livingSpent);$("#transferTotal").textContent=won(transfers);$("#remainingMoney").textContent=won(remaining);$("#remainingAfterAllowance").textContent=won(afterAllowance);
  $("#remainingFormula").textContent=`수입 ${won(income)} − 9월 고정·예약 ${won(plannedObligations)} − 이전달 미납납부 ${won(arrears)} − 생활지출 ${won(livingSpent)}`;
  const reserve=1200000, free=remaining-reserve, freeAfter=afterAllowance-reserve;
  if($("#freeCashAfterReserve"))$("#freeCashAfterReserve").textContent=won(free);
  if($("#freeCashAfterAllowance"))$("#freeCashAfterAllowance").textContent=`아동수당 반영 시 ${won(freeAfter)}`;
  const usedPct=livingAvailable>0?Math.min(100,livingSpent/livingAvailable*100):0;$("#livingPercent").textContent=`${usedPct.toFixed(1)}% 사용`;$("#livingProgressBar").style.width=`${usedPct}%`;$("#livingProgressText").textContent=`생활 가능액 ${won(livingAvailable)} 중 ${won(livingSpent)} 사용 · ${won(Math.max(0,livingAvailable-livingSpent))} 남음`;
}

function recurringGroup(item){if(item.name==="십일조")return "salary";if(item.person_name==="남편")return "husband";return "min";}
function renderRecurring(){const groups={min:[],husband:[],salary:[]};recurringItems.filter(x=>x.item_type!=="income"&&recurringAppliesThisMonth(x)).forEach(x=>groups[recurringGroup(x)].push(x));renderRecurringGroup("#minFixed","#minFixedTotal",groups.min);renderRecurringGroup("#husbandFixed","#husbandFixedTotal",groups.husband);renderRecurringGroup("#salaryFixed","#salaryFixedTotal",groups.salary);}
function renderRecurringGroup(listSel,totalSel,items){const total=items.reduce((s,x)=>s+Number(x.amount),0);$(totalSel).textContent=won(total);$(listSel).innerHTML=items.map(x=>`<div class="fixed-item"><div><strong>${escapeHtml(x.name)}</strong><small>${escapeHtml(x.account_name||"")} · ${x.is_variable?"변동":"고정"}${x.memo?" · "+escapeHtml(x.memo):""}</small></div><strong>${won(x.amount)}</strong></div>`).join("")||`<p class="sub">등록된 항목이 없어요.</p>`;}
function renderCategories(){const grouped={};transactions.filter(isLivingExpense).forEach(x=>grouped[x.category||"기타"]=(grouped[x.category||"기타"]||0)+Number(x.amount));const entries=Object.entries(grouped).sort((a,b)=>b[1]-a[1]),max=entries[0]?.[1]||1;$("#categoryBars").innerHTML=entries.length?entries.map(([cat,amt])=>`<div class="bar-row"><div class="bar-head"><span>${escapeHtml(cat)}</span><strong>${won(amt)}</strong></div><div class="bar-track"><div class="bar-fill" style="width:${Math.max(4,amt/max*100)}%"></div></div></div>`).join(""):`<p class="sub">아직 생활지출 기록이 없어요.</p>`;}
function iconFor(tx){if(tx.tx_type==="income")return "💰";if(tx.tx_type==="transfer")return "↔️";const map={"식비/간식":"🥨","외식/카페":"☕","생활용품":"🧻","교회/헌금":"⛪","개인회생/채무":"💳","보험":"🛡️","통신":"📱","차량":"🚙","자녀교육":"📚","주거/공과금":"🏠","의료":"🏥","쇼핑/미용":"🛍️","가족회비":"👨‍👩‍👧‍👦"};return map[tx.category]||"🧾";}
function renderTransactions(){const pf=$("#personFilter").value,tf=$("#typeFilter").value,list=transactions.filter(x=>(pf==="all"||x.person_name===pf)&&(tf==="all"||x.tx_type===tf));$("#transactions").innerHTML=list.length?list.map(x=>`<div class="tx"><div class="tx-icon">${iconFor(x)}</div><div class="tx-main"><strong>${escapeHtml(x.description)}</strong><small>${x.tx_date} · ${escapeHtml(x.category||"기타")} · ${escapeHtml(x.person_name||"")} · ${escapeHtml(x.account_name||"")}${x.memo?" · "+escapeHtml(x.memo):""}</small></div><div class="tx-amount ${x.tx_type}">${x.tx_type==="expense"?"-":x.tx_type==="income"?"+":"↔ "}${won(x.amount)}</div><div class="tx-actions"><button class="icon-btn" data-delete="${x.id}">삭제</button></div></div>`).join(""):`<p class="sub">조건에 맞는 기록이 없어요.</p>`;document.querySelectorAll("[data-delete]").forEach(btn=>btn.onclick=async()=>{if(!confirm("이 기록을 삭제할까요? 부부 화면에서 함께 삭제돼요."))return;const {error}=await db.from("transactions").delete().eq("id",btn.dataset.delete).eq("household_id",householdId);if(error)return alert(`삭제 실패: ${error.message}`);await loadData();});}
function escapeHtml(value=""){return String(value).replace(/[&<>'"]/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;","\"":"&quot;"}[ch]));}
function render(){renderSummary();renderRecurring();renderCategories();renderTransactions();}

async function startApp(session){sessionUser=session.user;await loadMembership();await seedIfNeeded();await migrateSeptember2026();await loadData();showApp();clearInterval(pollTimer);pollTimer=setInterval(()=>loadData().catch(console.error),5000);}
$("#loginForm").addEventListener("submit",async e=>{e.preventDefault();const btn=e.currentTarget.querySelector("button");btn.disabled=true;$("#loginMessage").textContent="로그인 중…";try{const session=await login($("#loginEmail").value.trim(),$("#loginPassword").value);await startApp(session);$("#loginMessage").textContent="";}catch(err){$("#loginMessage").textContent=`로그인할 수 없어요. 이메일/비밀번호를 확인해 주세요. (${err.message})`;}finally{btn.disabled=false;}});
$("#logoutBtn").addEventListener("click",async()=>{clearInterval(pollTimer);await db.auth.signOut();sessionUser=membership=householdId=null;transactions=[];recurringItems=[];showAuth("로그아웃했어요.");});
$("#entryForm").addEventListener("submit",async e=>{e.preventDefault();if(!householdId)return;const saveBtn=$("#saveBtn");saveBtn.disabled=true;setEntryMessage("저장 중…");const txType=$("#type").value,row={household_id:householdId,tx_date:$("#date").value,tx_type:txType,amount:Number($("#amount").value),description:$("#merchant").value.trim(),category:txType==="transfer"?"계좌이동":$("#category").value,person_name:$("#person").value,account_name:$("#account").value,memo:$("#memo").value.trim()||null};try{const {error}=await db.from("transactions").insert(row);if(error)throw error;e.target.reset();$("#date").value=localISODate();$("#person").value=membership.display_name==="민정"?"민정":"남편";setEntryMessage("저장했어요. 두 사람 화면에 같이 반영됩니다.");await loadData();}catch(err){setEntryMessage(`저장 실패: ${err.message}`,true);}finally{saveBtn.disabled=false;}});
$("#personFilter").addEventListener("change",renderTransactions);$("#typeFilter").addEventListener("change",renderTransactions);$("#date").value=localISODate();
(async function boot(){try{const {data:{session}}=await db.auth.getSession();if(session)await startApp(session);else showAuth();}catch(err){console.error(err);showAuth(`초기화 중 오류가 생겼어요: ${err.message}`);}})();
