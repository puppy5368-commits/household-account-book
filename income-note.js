(() => {
  const STORAGE_KEY="household-income-schedule-note";
  const style=document.createElement("style");
  style.textContent=`
    .income-note-wrap{margin-top:16px;padding-top:13px;border-top:1px dashed #d9dee8}
    .income-note-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:7px}
    .income-note-title{font-size:12px;font-weight:800;color:#667085}
    .income-note-edit{border:0;background:#f3f5f8;border-radius:999px;padding:5px 9px;font-size:11px;font-weight:800;color:#667085;cursor:pointer}
    .income-note-text{white-space:pre-wrap;font-size:12px;line-height:1.55;color:#667085;min-height:20px;margin:0}
    .income-note-text.empty{color:#98a2b3}
  `;
  document.head.appendChild(style);

  function mount(){
    const income=document.querySelector("#incomeTotal");
    const card=income?.closest(".summary-card");
    if(!card||card.querySelector(".income-note-wrap"))return;
    const wrap=document.createElement("div");
    wrap.className="income-note-wrap";
    wrap.innerHTML=`<div class="income-note-head"><span class="income-note-title">📝 수입 일정 메모</span><button type="button" class="income-note-edit">수정</button></div><p class="income-note-text"></p>`;
    card.appendChild(wrap);
    render(wrap);
    wrap.querySelector(".income-note-edit").addEventListener("click",()=>edit(wrap));
  }

  function getNote(){try{return localStorage.getItem(STORAGE_KEY)||"";}catch{return "";}}
  function setNote(v){try{localStorage.setItem(STORAGE_KEY,v);}catch{}}
  function render(wrap){const text=wrap.querySelector(".income-note-text"),note=getNote();text.textContent=note||"예: 10월 명절수당 · 12월 성과상여";text.classList.toggle("empty",!note);}
  function edit(wrap){const current=getNote();const value=prompt("앞으로 들어올 수당이나 수입 일정을 자유롭게 적어주세요.\n여러 줄로 적어도 되고, 실제 수입 합계에는 포함되지 않아요.",current);if(value===null)return;setNote(value.trim());render(wrap);}

  const observer=new MutationObserver(mount);observer.observe(document.body,{childList:true,subtree:true});
  mount();
})();