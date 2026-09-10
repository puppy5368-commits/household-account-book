const SUPABASE_URL = "https://baeflgfufqguqszmqjys.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_p5GVlyDkYfKWf4ikWnODYg_kHu_dtzN";
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const CHILD_ALLOWANCE = 105000;
const FIXED_LIKE_CATEGORIES = new Set([
  "보험", "통신", "차량", "주거/공과금", "개인회생/채무", "교회/헌금", "자녀용돈/적립"
]);

const DEFAULT_RECURRING = [
  {item_type:"expense",name:"삼성생명보험 · 희윤 실비",amount:44818,category:"보험",person_name:"민정",account_name:"민정 2115",due_day:null,is_variable:false,memo:"자동이체"},
  {item_type:"expense",name:"코웨이 정수기",amount:25900,category:"생활/렌탈",person_name:"민정",account_name:"민정 2115",due_day:null,is_variable:false,memo:"자동이체"},
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
  {item_type:"transfer",name:"희윤 용돈통장 · 카뱅1349",amount:30000,category:"자녀용돈/적립",person_name:"민정",account_name:"민정 7777",due_day:null,is_variable:false,memo:"매월 적립 · 생활가능액에서는 제외"},
  {item_type:"expense",name:"DB손해보험 · 남편 운전자",amount:10400,category:"보험",person_name:"남편",account_name:"남편 고정비 통장",due_day:null,is_variable:false,memo:"고정"},
  {item_type:"expense",name:"신용위원회 대출",amount:140000,category:"채무",person_name:"남편",account_name:"남편 고정비 통장",due_day:null,is_variable:false,memo:"고정"},
  {item_type:"expense",name:"삼성생명보험 · 태평 실비",amount:10083,category:"보험",person_name:"남편",account_name:"남편 고정비 통장",due_day:null,is_variable:false,memo:"고정"},
  {item_type:"expense",name:"현대해상보험 · 세훈 실비",amount:51040,category:"보험",person_name:"남편",account_name:"남편 고정비 통장",due_day:null,is_variable:false,memo:"고정"},
  {item_type:"expense",name:"LG유플러스 · 인터넷",amount:25000,category:"통신",person_name:"남편",account_name:"남편 고정비 통장",due_day:null,is_variable:false,memo:"고정"},
  {item_type:"expense",name:"LG유플러스 · 세훈폰",amount:40380,category:"통신",person_name:"남편",account_name:"남편 고정비 통장",due_day:null,is_variable:false,memo:"고정"},
  {item_type:"expense",name:"개인회생",amount:2044000,category:"개인회생/채무",person_name:"남편",account_name:"월급통장",due_day:10,is_variable:false,memo:"월급통장 직접지출"},
  {item_type:"expense",name:"십일조",amount:600000,category:"교회/헌금",person_name:"남편",account_name:"월급통장",due_day:10,is_variable:true,memo:"급여에 따라 매달 변경"},
  {item_type:"income",name:"태평 아동수당",amount:105000,category:"아동수당",person_name:"민정",account_name:"민정 2115",due_day:25,is_variable:false,memo:"24~25일 입금 예정"}
];

const DEFAULT_TRANSACTIONS = [
  {tx_date:"2026-09-10",tx_type:"income",amount:5889900,description:"재정단 급여",category:"급여",person_name:"남편",account_name:"월급통장",memo:"9월 월급"},
  {tx_date:"2026-09-10",tx_type:"expense",amount:600000,description:"십일조",category:"교회/헌금",person_name:"남편",account_name:"월급통장",memo:"매달 변동"},
  {tx_date:"2026-09-10",tx_type:"expense",amount:1022000,description:"개인회생 1",category:"개인회생/채무",person_name:"남편",account_name:"월급통장",memo:"고정"},
  {tx_date:"2026-09-10",tx_type:"expense",amount:1022000,description:"개인회생 2",category:"개인회생/채무",person_name:"남편",account_name:"월급통장",memo:"고정"},
  {tx_date:"2026-09-10",tx_type:"transfer",amount:2700000,description:"민정 7777로 이체",category:"계좌이동",person_name:"민정",account_name:"월급통장",memo:"생활비 + 고정비 준비"},
  {tx_date:"2026-09-10",tx_type:"transfer",amount:300000,description:"남편 고정비 통장으로 이체",category:"계좌이동",person_name:"남편",account_name:"월급통장",memo:"고정비 준비"},
  {tx_date:"2026-09-10",tx_type:"expense",amount:9100,description:"쿠팡 누룽지팝 4개",category:"식비/간식",person_name:"남편",account_name:"카드/기타",memo:""}
];

let sessionUser = null;
let membership = null;
let householdId = null;
let transactions = [];
let recurringItems = [];
let pollTimer = null;

const $ = (sel) => document.querySelector(sel);
const won = (n) => `${new Intl.NumberFormat("ko-KR").format(Math.round(Number(n)||0))}원`;
const localISODate = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,"0");
  const day = String(d.getDate()).padStart(2,"0");
  return `${y}-${m}-${day}`;
};
const monthBounds = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = d.getMonth();
  const start = `${y}-${String(m+1).padStart(2,"0")}-01`;
  const last = new Date(y,m+1,0).getDate();
  const end = `${y}-${String(m+1).padStart(2,"0")}-${String(last).padStart(2,"0")}`;
  return {start,end,y,m:m+1};
};

function showAuth(message="") {
  $("#authScreen").classList.remove("hidden");
  $("#app").classList.add("hidden");
  $("#loginMessage").textContent = message;
}
function showApp() {
  $("#authScreen").classList.add("hidden");
  $("#app").classList.remove("hidden");
}
function setEntryMessage(msg, isError=false) {
  const el = $("#entryMessage");
  el.textContent = msg;
  el.classList.toggle("error", isError);
}

async function login(email,password) {
  const { data, error } = await db.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.session;
}

async function loadMembership() {
  const { data, error } = await db
    .from("household_members")
    .select("household_id, display_name, role")
    .eq("user_id", sessionUser.id)
    .single();
  if (error) throw new Error("이 계정이 우리집 가계부 구성원으로 연결되지 않았어요.");
  membership = data;
  householdId = data.household_id;
  $("#currentUser").textContent = `${data.display_name} · ${data.role === "owner" ? "관리자" : "가족"}`;
  $("#person").value = data.display_name === "민정" ? "민정" : "남편";
}

async function seedIfNeeded() {
  if (membership.role !== "owner") return;

  const { count: recurringCount, error: rcErr } = await db
    .from("recurring_items")
    .select("id", {count:"exact", head:true})
    .eq("household_id", householdId);
  if (rcErr) throw rcErr;
  if (recurringCount === 0) {
    const rows = DEFAULT_RECURRING.map(x => ({...x, household_id: householdId, active:true}));
    const { error } = await db.from("recurring_items").insert(rows);
    if (error) throw error;
  }

  const { count: txCount, error: txcErr } = await db
    .from("transactions")
    .select("id", {count:"exact", head:true})
    .eq("household_id", householdId);
  if (txcErr) throw txcErr;
  if (txCount === 0) {
    const rows = DEFAULT_TRANSACTIONS.map(x => ({...x, household_id: householdId}));
    const { error } = await db.from("transactions").insert(rows);
    if (error) throw error;
  }
}

async function loadData() {
  if (!householdId) return;
  const {start,end,m} = monthBounds();
  $("#monthTitle").textContent = `${m}월 가계부`;

  const [txRes, recRes] = await Promise.all([
    db.from("transactions").select("*").eq("household_id",householdId).gte("tx_date",start).lte("tx_date",end).order("tx_date",{ascending:false}).order("created_at",{ascending:false}),
    db.from("recurring_items").select("*").eq("household_id",householdId).eq("active",true).order("person_name",{ascending:true}).order("amount",{ascending:false})
  ]);
  if (txRes.error) throw txRes.error;
  if (recRes.error) throw recRes.error;
  transactions = txRes.data || [];
  recurringItems = recRes.data || [];
  render();
}

function isLivingExpense(tx) {
  if (tx.tx_type !== "expense") return false;
  if (FIXED_LIKE_CATEGORIES.has(tx.category)) return false;
  if (tx.category === "자녀교육" && /구몬/.test(tx.description||"")) return false;
  return true;
}

function plannedExpenseAmount() {
  return recurringItems
    .filter(x => x.item_type === "expense")
    .reduce((s,x)=>s+Number(x.amount),0);
}
function plannedTransferReserve() {
  return recurringItems
    .filter(x => x.item_type === "transfer")
    .reduce((s,x)=>s+Number(x.amount),0);
}
function allowanceAlreadyReceived() {
  return transactions.some(x => x.tx_type === "income" && (x.category === "아동수당" || /아동수당/.test(x.description||"")));
}

function renderSummary() {
  const income = transactions.filter(x=>x.tx_type==="income").reduce((s,x)=>s+Number(x.amount),0);
  const transfers = transactions.filter(x=>x.tx_type==="transfer").reduce((s,x)=>s+Number(x.amount),0);
  const livingSpent = transactions.filter(isLivingExpense).reduce((s,x)=>s+Number(x.amount),0);
  const fixedExpenses = plannedExpenseAmount();
  const reservedTransfers = plannedTransferReserve();
  const plannedObligations = fixedExpenses + reservedTransfers;
  const livingAvailable = Math.max(0, income - plannedObligations);
  const remaining = income - plannedObligations - livingSpent;
  const allowancePending = allowanceAlreadyReceived() ? 0 : CHILD_ALLOWANCE;
  const afterAllowance = remaining + allowancePending;

  $("#incomeTotal").textContent = won(income);
  $("#plannedFixedTotal").textContent = won(plannedObligations);
  $("#livingExpenseTotal").textContent = won(livingSpent);
  $("#transferTotal").textContent = won(transfers);
  $("#remainingMoney").textContent = won(remaining);
  $("#remainingAfterAllowance").textContent = won(afterAllowance);
  $("#remainingFormula").textContent = `수입 ${won(income)} − 고정의무 ${won(plannedObligations)} − 생활지출 ${won(livingSpent)}`;

  const usedPct = livingAvailable > 0 ? Math.min(100, livingSpent/livingAvailable*100) : 0;
  $("#livingPercent").textContent = `${usedPct.toFixed(1)}% 사용`;
  $("#livingProgressBar").style.width = `${usedPct}%`;
  $("#livingProgressText").textContent = `생활 가능액 ${won(livingAvailable)} 중 ${won(livingSpent)} 사용 · ${won(Math.max(0, livingAvailable-livingSpent))} 남음`;
}

function recurringGroup(item) {
  if (item.account_name === "월급통장") return "salary";
  if (item.person_name === "남편") return "husband";
  return "min";
}

function renderRecurring() {
  const groups = {min:[],husband:[],salary:[]};
  recurringItems.filter(x => x.item_type !== "income").forEach(x => groups[recurringGroup(x)].push(x));
  renderRecurringGroup("#minFixed", "#minFixedTotal", groups.min);
  renderRecurringGroup("#husbandFixed", "#husbandFixedTotal", groups.husband);
  renderRecurringGroup("#salaryFixed", "#salaryFixedTotal", groups.salary);
}

function renderRecurringGroup(listSel,totalSel,items) {
  const total = items.reduce((s,x)=>s+Number(x.amount),0);
  $(totalSel).textContent = won(total);
  $(listSel).innerHTML = items.map(x => `
    <div class="fixed-item">
      <div><strong>${escapeHtml(x.name)}</strong><small>${escapeHtml(x.account_name||"")} · ${x.is_variable ? "변동" : "고정"}${x.memo ? " · "+escapeHtml(x.memo) : ""}</small></div>
      <strong>${won(x.amount)}</strong>
    </div>`).join("") || `<p class="sub">등록된 항목이 없어요.</p>`;
}

function renderCategories() {
  const grouped = {};
  transactions.filter(isLivingExpense).forEach(x => grouped[x.category||"기타"]=(grouped[x.category||"기타"]||0)+Number(x.amount));
  const entries = Object.entries(grouped).sort((a,b)=>b[1]-a[1]);
  const max = entries[0]?.[1] || 1;
  $("#categoryBars").innerHTML = entries.length ? entries.map(([cat,amt]) => `
    <div class="bar-row"><div class="bar-head"><span>${escapeHtml(cat)}</span><strong>${won(amt)}</strong></div><div class="bar-track"><div class="bar-fill" style="width:${Math.max(4,amt/max*100)}%"></div></div></div>`).join("") : `<p class="sub">아직 생활지출 기록이 없어요.</p>`;
}

function iconFor(tx) {
  if (tx.tx_type === "income") return "💰";
  if (tx.tx_type === "transfer") return "↔️";
  const map = {"식비/간식":"🥨","외식/카페":"☕","생활용품":"🧻","교회/헌금":"⛪","개인회생/채무":"💳","보험":"🛡️","통신":"📱","차량":"🚙","자녀교육":"📚","주거/공과금":"🏠","의료":"🏥","쇼핑/미용":"🛍️"};
  return map[tx.category] || "🧾";
}

function renderTransactions() {
  const pf = $("#personFilter").value;
  const tf = $("#typeFilter").value;
  const list = transactions.filter(x => (pf==="all" || x.person_name===pf) && (tf==="all" || x.tx_type===tf));
  $("#transactions").innerHTML = list.length ? list.map(x => `
    <div class="tx">
      <div class="tx-icon">${iconFor(x)}</div>
      <div class="tx-main"><strong>${escapeHtml(x.description)}</strong><small>${x.tx_date} · ${escapeHtml(x.category||"기타")} · ${escapeHtml(x.person_name||"")} · ${escapeHtml(x.account_name||"")}${x.memo ? " · "+escapeHtml(x.memo) : ""}</small></div>
      <div class="tx-amount ${x.tx_type}">${x.tx_type==="expense"?"-":x.tx_type==="income"?"+":"↔ "}${won(x.amount)}</div>
      <div class="tx-actions"><button class="icon-btn" data-delete="${x.id}">삭제</button></div>
    </div>`).join("") : `<p class="sub">조건에 맞는 기록이 없어요.</p>`;

  document.querySelectorAll("[data-delete]").forEach(btn => btn.onclick = async () => {
    if (!confirm("이 기록을 삭제할까요? 부부 화면에서 함께 삭제돼요.")) return;
    const {error} = await db.from("transactions").delete().eq("id",btn.dataset.delete).eq("household_id",householdId);
    if (error) return alert(`삭제 실패: ${error.message}`);
    await loadData();
  });
}

function escapeHtml(value="") {
  return String(value).replace(/[&<>'"]/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;","\"":"&quot;"}[ch]));
}

function render() {
  renderSummary();
  renderRecurring();
  renderCategories();
  renderTransactions();
}

async function startApp(session) {
  sessionUser = session.user;
  await loadMembership();
  await seedIfNeeded();
  await loadData();
  showApp();
  clearInterval(pollTimer);
  pollTimer = setInterval(()=>loadData().catch(console.error),5000);
}

$("#loginForm").addEventListener("submit", async e => {
  e.preventDefault();
  const btn = e.currentTarget.querySelector("button");
  btn.disabled = true;
  $("#loginMessage").textContent = "로그인 중…";
  try {
    const session = await login($("#loginEmail").value.trim(), $("#loginPassword").value);
    await startApp(session);
    $("#loginMessage").textContent = "";
  } catch (err) {
    $("#loginMessage").textContent = `로그인할 수 없어요. 이메일/비밀번호를 확인해 주세요. (${err.message})`;
  } finally {
    btn.disabled = false;
  }
});

$("#logoutBtn").addEventListener("click", async () => {
  clearInterval(pollTimer);
  await db.auth.signOut();
  sessionUser = membership = householdId = null;
  transactions = []; recurringItems = [];
  showAuth("로그아웃했어요.");
});

$("#entryForm").addEventListener("submit", async e => {
  e.preventDefault();
  if (!householdId) return;
  const saveBtn = $("#saveBtn");
  saveBtn.disabled = true;
  setEntryMessage("저장 중…");
  const txType = $("#type").value;
  const row = {
    household_id: householdId,
    tx_date: $("#date").value,
    tx_type: txType,
    amount: Number($("#amount").value),
    description: $("#merchant").value.trim(),
    category: txType === "transfer" ? "계좌이동" : $("#category").value,
    person_name: $("#person").value,
    account_name: $("#account").value,
    memo: $("#memo").value.trim() || null
  };
  try {
    const {error} = await db.from("transactions").insert(row);
    if (error) throw error;
    e.target.reset();
    $("#date").value = localISODate();
    $("#person").value = membership.display_name === "민정" ? "민정" : "남편";
    setEntryMessage("저장했어요. 두 사람 화면에 같이 반영됩니다.");
    await loadData();
  } catch(err) {
    setEntryMessage(`저장 실패: ${err.message}`, true);
  } finally {
    saveBtn.disabled = false;
  }
});

$("#personFilter").addEventListener("change",renderTransactions);
$("#typeFilter").addEventListener("change",renderTransactions);
$("#date").value = localISODate();

(async function boot(){
  try {
    const {data:{session}} = await db.auth.getSession();
    if (session) await startApp(session);
    else showAuth();
  } catch(err) {
    console.error(err);
    showAuth(`초기화 중 오류가 생겼어요: ${err.message}`);
  }
})();
