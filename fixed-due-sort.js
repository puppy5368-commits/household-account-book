(() => {
  const style=document.createElement('style');
  style.textContent=`
    .fixed-due-btn{border:0;background:#f3f5f8;color:var(--muted);border-radius:999px;padding:4px 8px;font-size:10.5px;font-weight:800;cursor:pointer;margin-left:4px}
    .fixed-due-btn.has-date{background:#eef4ff;color:var(--accent)}
    .fixed-item-meta{display:flex;align-items:center;gap:4px;flex-wrap:wrap;margin-top:4px}
  `;
  document.head.appendChild(style);

  const originalRenderRecurringGroup=window.renderRecurringGroup;

  function sortByDueDay(items){
    return [...items].sort((a,b)=>{
      const ad=Number(a.due_day)||99, bd=Number(b.due_day)||99;
      if(ad!==bd)return ad-bd;
      return String(a.name||'').localeCompare(String(b.name||''),'ko');
    });
  }

  window.renderRecurring=function(){
    const groups={min:[],husband:[],salary:[]};
    recurringItems.filter(x=>x.item_type!=="income"&&recurringAppliesThisMonth(x)).forEach(x=>groups[recurringGroup(x)].push(x));
    renderRecurringGroup("#minFixed","#minFixedTotal",sortByDueDay(groups.min));
    renderRecurringGroup("#husbandFixed","#husbandFixedTotal",sortByDueDay(groups.husband));
    renderRecurringGroup("#salaryFixed","#salaryFixedTotal",sortByDueDay(groups.salary));
  };

  window.renderRecurringGroup=function(listSel,totalSel,items){
    const total=items.reduce((s,x)=>s+Number(x.amount),0);
    document.querySelector(totalSel).textContent=won(total);
    document.querySelector(listSel).innerHTML=items.map(x=>{
      const paid=recurringPaidTransaction(x);
      const paidLabel=paid?`✓ 출금완료${Number(paid.amount)!==Number(x.amount)?` · ${won(paid.amount)}`:""}`:"○ 예정";
      const dueLabel=x.due_day?`${x.due_day}일`:'날짜 미등록';
      return `<div class="fixed-item"><div class="fixed-item-copy"><strong>${escapeHtml(x.name)}</strong><div class="fixed-item-meta"><small>${escapeHtml(x.account_name||"")} · ${x.is_variable?"변동":"고정"}${x.memo?" · "+escapeHtml(x.memo):""}</small><button type="button" class="fixed-due-btn ${x.due_day?'has-date':''}" data-due-recurring="${x.id}">📅 ${dueLabel}</button></div></div><div class="fixed-item-side"><strong>${won(x.amount)}</strong><button type="button" class="fixed-pay-btn ${paid?"is-paid":""}" data-paid-recurring="${x.id}" ${paid?"disabled":""}>${paidLabel}</button></div></div>`;
    }).join("")||`<p class="sub">등록된 항목이 없어요.</p>`;
  };

  async function editDueDay(id){
    const item=recurringItems.find(x=>String(x.id)===String(id));
    if(!item)return;
    const current=item.due_day?String(item.due_day):'';
    const input=prompt(`${item.name} 출금일을 입력해 주세요.\n예: 10일이면 10`,current);
    if(input===null)return;
    const value=String(input).trim();
    if(value===''){
      const {error}=await db.from('recurring_items').update({due_day:null}).eq('id',item.id).eq('household_id',householdId);
      if(error)return alert(`날짜 저장 실패: ${error.message}`);
      return loadData();
    }
    const day=Number(value.replace(/[^0-9]/g,''));
    if(!Number.isInteger(day)||day<1||day>31)return alert('1~31 사이 날짜를 입력해 주세요.');
    const {error}=await db.from('recurring_items').update({due_day:day}).eq('id',item.id).eq('household_id',householdId);
    if(error)return alert(`날짜 저장 실패: ${error.message}`);
    await loadData();
  }

  document.addEventListener('click',e=>{
    const btn=e.target.closest('[data-due-recurring]');
    if(btn){e.preventDefault();e.stopPropagation();editDueDay(btn.dataset.dueRecurring);}
  });

  setTimeout(()=>{if(typeof renderRecurring==='function')renderRecurring();},700);
})();