(() => {
  const MIN_FIXED_ORDER = [
    "삼성생명보험 · 희윤 실비",
    "코웨이 정수기",
    "현대해상보험 · 민정 실비",
    "DB손해보험 · 민정 운전자",
    "DB손해보험 · 민정 치과",
    "DB손해보험 · 희윤 치과",
    "LG유플러스 · 민정폰",
    "LG유플러스 · 희윤폰",
    "하나캐피탈 · 카니발 리스",
    "희윤 구몬",
    "GS 도시가스",
    "관사 관리비",
    "쿠팡와우 월회비"
  ];

  const orderMap = new Map(MIN_FIXED_ORDER.map((name, index) => [name, index]));
  const sortCustom = items => [...items].sort((a, b) => {
    const ai = orderMap.has(a.name) ? orderMap.get(a.name) : 999;
    const bi = orderMap.has(b.name) ? orderMap.get(b.name) : 999;
    if (ai !== bi) return ai - bi;
    return String(a.name || "").localeCompare(String(b.name || ""), "ko");
  });

  window.renderRecurring = function(){
    const groups = {min:[], husband:[], salary:[]};
    recurringItems
      .filter(x => x.item_type !== "income" && recurringAppliesThisMonth(x))
      .forEach(x => groups[recurringGroup(x)].push(x));

    renderRecurringGroup("#minFixed", "#minFixedTotal", sortCustom(groups.min));
    renderRecurringGroup("#husbandFixed", "#husbandFixedTotal", groups.husband);
    renderRecurringGroup("#salaryFixed", "#salaryFixedTotal", groups.salary);
  };

  setTimeout(() => {
    if (typeof renderRecurring === "function") renderRecurring();
  }, 700);
})();