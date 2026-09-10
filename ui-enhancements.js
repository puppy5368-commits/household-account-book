(() => {
  const style = document.createElement('style');
  style.textContent = `
    .ui-hidden,.salary-obligation-panel{display:none!important}
    .summary-grid-main{grid-template-columns:repeat(3,1fr)}
    .summary-expand{padding:0;overflow:hidden}
    .summary-expand>summary{list-style:none;cursor:pointer;padding:18px;display:flex;align-items:center;justify-content:space-between;gap:10px;-webkit-tap-highlight-color:transparent}
    .summary-expand>summary::-webkit-details-marker{display:none}
    .summary-expand>summary strong{display:block;margin-top:10px;font-size:24px;letter-spacing:-.5px}
    .summary-arrow{font-size:22px;color:var(--muted);transition:transform .2s ease}
    .summary-expand[open]>summary .summary-arrow{transform:rotate(180deg)}
    .all-fixed-breakdown{border-top:1px solid var(--line);padding:10px 14px 14px;background:#fbfbfd;display:grid;gap:8px}
    .fixed-break-details{background:#fff;border:1px solid var(--line);border-radius:14px;overflow:hidden}
    .fixed-break-details>summary{list-style:none;cursor:pointer;padding:13px 14px;display:flex;align-items:center;justify-content:space-between;gap:12px;-webkit-tap-highlight-color:transparent}
    .fixed-break-details>summary::-webkit-details-marker{display:none}
    .fixed-break-summary-left{display:flex;align-items:center;gap:8px;min-width:0}
    .fixed-break-summary-left strong{font-size:14px!important;line-height:1.35}
    .fixed-break-amount{font-weight:800;color:var(--accent);white-space:nowrap;font-size:14px!important}
    .fixed-break-chevron{color:var(--muted);transition:transform .2s ease;font-size:18px}
    .fixed-break-details[open] .fixed-break-chevron{transform:rotate(180deg)}
    .fixed-break-body{border-top:1px solid var(--line);padding:3px 14px 7px}
    .fixed-break-body .fixed-item{padding:9px 0!important;gap:10px}
    .fixed-break-body .fixed-item strong{font-size:13px!important;line-height:1.35!important;font-weight:700}
    .fixed-break-body .fixed-item>strong:last-child{font-size:13px!important;white-space:nowrap}
    .fixed-break-body .fixed-item p,.fixed-break-body .fixed-item span,.fixed-break-body .fixed-item small{font-size:11px!important;line-height:1.4!important}
    @media(max-width:620px){
      .summary-grid-main{grid-template-columns:1fr 1fr}
      .summary-expand{grid-column:span 1}
      .summary-expand>summary{padding:15px}
      .summary-expand>summary strong{font-size:20px}
      .all-fixed-breakdown{padding:9px 10px 11px;gap:7px}
      .fixed-break-details>summary{padding:11px 12px}
      .fixed-break-summary-left strong,.fixed-break-amount{font-size:13px!important}
      .fixed-break-body{padding:2px 12px 6px}
      .fixed-break-body .fixed-item{padding:8px 0!important}
      .fixed-break-body .fixed-item strong,.fixed-break-body .fixed-item>strong:last-child{font-size:12px!important}
      .fixed-break-body .fixed-item p,.fixed-break-body .fixed-item span,.fixed-break-body .fixed-item small{font-size:10.5px!important}
    }
  `;
  document.head.appendChild(style);

  const all = document.querySelector('#allFixedBreakdown');
  const detailsCard = document.querySelector('.summary-expand');
  const min = document.querySelector('#minFixed');
  const husband = document.querySelector('#husbandFixed');
  const salary = document.querySelector('#salaryFixed');
  const minTotal = document.querySelector('#minFixedTotal');
  const husbandTotal = document.querySelector('#husbandFixedTotal');
  const salaryTotal = document.querySelector('#salaryFixedTotal');

  if (!all || !min || !husband || !salary) return;

  const section = (title, total, html) => `
    <details class="fixed-break-details">
      <summary>
        <div class="fixed-break-summary-left"><strong>${title}</strong></div>
        <div class="fixed-break-summary-left"><span class="fixed-break-amount">${total || ''}</span><span class="fixed-break-chevron">⌄</span></div>
      </summary>
      <div class="fixed-break-body fixed-list">${html || '<p class="sub">내역 없음</p>'}</div>
    </details>`;

  const sync = () => {
    all.innerHTML =
      section('민정 고정비', minTotal?.textContent, min.innerHTML) +
      section('세훈 고정비', husbandTotal?.textContent, husband.innerHTML) +
      section('고정의무', salaryTotal?.textContent, salary.innerHTML);
  };

  [min, husband, salary, minTotal, husbandTotal, salaryTotal].filter(Boolean).forEach(el => {
    new MutationObserver(sync).observe(el, {subtree:true, childList:true, characterData:true});
  });

  detailsCard?.addEventListener('toggle', () => { if (detailsCard.open) sync(); });
  setTimeout(sync, 600);
})();