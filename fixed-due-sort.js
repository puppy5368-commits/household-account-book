(() => {
  const MIN_FIXED_ORDER = [
    "삼성생명보험 · 희윤 실비","코웨이 정수기","현대해상보험 · 민정 실비","DB손해보험 · 민정 운전자","DB손해보험 · 민정 치과","DB손해보험 · 희윤 치과","LG유플러스 · 민정폰","LG유플러스 · 희윤폰","하나캐피탈 · 카니발 리스","희윤 구몬","GS 도시가스","관사 관리비","쿠팡와우 월회비"
  ];
  const EDITABLE_VARIABLES = new Set(["GS 도시가스", "관사 관리비"]);
  const orderMap = new Map(MIN_FIXED_ORDER.map((name,index)=>[name,index]));
  const sortCustom=items=>[...items].sort((a,b)=>{const ai=orderMap.has(a.name)?orderMap.get(a.name):999,bi=orderMap.has(b.name)?orderMap.get(b.name):999;if(ai!==bi)return ai-bi;return String(a.name||"").localeCompare(String(b.name||""),"ko");});

  const style=document.createElement("style");
  style.textContent=`.fixed-amount-edit{border:0;background:#fff4df;color:#8a5a00;border-radius:999px;padding:4px 8px;font-size:10.5px;font-weight:800;cursor:pointer}.fixed-item-side-actions{display:flex;align-items:center;gap:5px;justify-content:flex-end;flex-wrap:wrap}.fixed-pay-btn.is-paid{cursor:pointer!important}`;
  document.head.appendChild(style);

  window.renderRecurring=function(){const groups={min:[],husband:[],salary:[]};recurringItems.filter(x=>x.item_type!=="income"&&recurringAppliesThisMonth(x)).forEach(x=>groups[recurringGroup(x)].push(x));renderRecurringGroup("#minFixed","#minFixedTotal",sortCustom(groups.min));renderRecurringGroup("#husbandFixed","#husbandFixedTotal",groups.husband);renderRecurringGroup("#salaryFixed","#salaryFixedTotal",groups.salary);};

  window.renderRecurringGroup=function(listSel,totalSel,items){
    const total=items.reduce((s,x)=>s+Number(x.amount),0);document.querySelector(totalSel).textContent=won(total);
    document.querySelector(listSel).innerHTML=items.map(x=>{const paid=recurringPaidTransaction(x);const paidLabel=paid?`✓ 출금완료${Number(paid.amount)!==Number(x.amount)?` · ${won(paid.amount)}`:""}`:"○ 예정";const editBtn=EDITABLE_VARIABLES.has(x.name)?`<button type="button" class="fixed-amount-edit" data-edit-fixed-amount="${x.id}">금액 수정</button>`:"";return `<div class="fixed-item"><div class="fixed-item-copy"><strong>${escapeHtml(x.name)}</strong><small>${escapeHtml(x.account_name||"")} · ${x.is_variable?"변동":"고정"}${x.memo?" · "+escapeHtml(x.memo):""}</small></div><div class="fixed-item-side"><strong>${won(x.amount)}</strong><div class="fixed-item-side-actions">${editBtn}<button type="button" class="fixed-pay-btn ${paid?"is-paid":""}" ${paid?`data-undo-paid-recurring="${x.id}"`:`data-paid-recurring="${x.id}"`}>${paidLabel}</button></div></div></div>`;}).join("")||`<p class="sub">등록된 항목이 없어요.</p>`;
  };

  async function editFixedAmount(id){const item=recurringItems.find(x=>String(x.id)===String(id));if(!item||!EDITABLE_VARIABLES.has(item.name))return;const paid=recurringPaidTransaction(item);if(paid&&!confirm(`${item.name}은 현재 출금완료 상태예요.\n청구금액만 수정할까요? 출금 기록 금액은 바뀌지 않아요.`))return;const input=prompt(`${item.name} 이번 달 청구금액을 입력해 주세요.\n명세서 금액을 입력하면 이번 달 고정지출 예상액에 바로 반영돼요.`,String(Number(item.amount)||""));if(input===null)return;const amount=Number(String(input).replace(/[^0-9]/g,""));if(!amount||amount<1)return alert("금액을 다시 확인해 주세요.");if(!confirm(`${item.name}\n이번 달 청구금액을 ${won(amount)}으로 변경할까요?`))return;const {error}=await db.from("recurring_items").update({amount,memo:`이번 달 청구금액 확인 · ${localISODate()}`}).eq("id",item.id).eq("household_id",householdId);if(error)return alert(`금액 변경 실패: ${error.message}`);await loadData();}

  async function undoPaid(id){const item=recurringItems.find(x=>String(x.id)===String(id));if(!item)return;const paid=recurringPaidTransaction(item);if(!paid)return;if(!confirm(`${item.name}\n${won(paid.amount)} 출금완료 기록을 취소할까요?\n실제 지출 기록도 함께 삭제돼요.`))return;const {error}=await db.from("transactions").delete().eq("id",paid.id).eq("household_id",householdId);if(error)return alert(`출금완료 취소 실패: ${error.message}`);await loadData();}

  document.addEventListener("click",e=>{const edit=e.target.closest("[data-edit-fixed-amount]");if(edit){e.preventDefault();e.stopPropagation();return editFixedAmount(edit.dataset.editFixedAmount);}const undo=e.target.closest("[data-undo-paid-recurring]");if(undo){e.preventDefault();e.stopPropagation();return undoPaid(undo.dataset.undoPaidRecurring);}});
  setTimeout(()=>{if(typeof renderRecurring==="function")renderRecurring();},700);
})();