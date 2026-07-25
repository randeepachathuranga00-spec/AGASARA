/* ===========================================================
   app.js — main Giftly ERP application
   =========================================================== */
(function(){

const ICONS = {
  dashboard: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="9" rx="1.5" stroke="currentColor" stroke-width="1.8"/><rect x="14" y="3" width="7" height="5" rx="1.5" stroke="currentColor" stroke-width="1.8"/><rect x="14" y="12" width="7" height="9" rx="1.5" stroke="currentColor" stroke-width="1.8"/><rect x="3" y="16" width="7" height="5" rx="1.5" stroke="currentColor" stroke-width="1.8"/></svg>',
  sales: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 6h2l1.6 9.2A2 2 0 0 0 8.55 17H18a2 2 0 0 0 1.94-1.52L21.5 9H6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="21" r="1.4" fill="currentColor"/><circle cx="18" cy="21" r="1.4" fill="currentColor"/></svg>',
  inventory: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 8l9-5 9 5-9 5-9-5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M3 8v8l9 5 9-5V8" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 13v8" stroke="currentColor" stroke-width="1.8"/></svg>',
  accounting: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="16" height="18" rx="1.5" stroke="currentColor" stroke-width="1.8"/><path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  crm: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.4" stroke="currentColor" stroke-width="1.8"/><path d="M4.5 20c1.3-3.8 4.2-5.8 7.5-5.8s6.2 2 7.5 5.8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  hr: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="3" stroke="currentColor" stroke-width="1.8"/><path d="M3 20c.9-3.4 3-5.2 6-5.2s5.1 1.8 6 5.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M16 4.2a3 3 0 0 1 0 5.8M21 20c-.5-2.2-1.6-3.7-3.2-4.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  purchasing: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 4h2l1.2 12.4A2 2 0 0 0 9.2 18H18a2 2 0 0 0 1.96-1.6L21 9H6.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 3v5M17 3v5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  settings: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/><path d="M19.4 13.5a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V20a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H4a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.56-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H10a1.7 1.7 0 0 0 1-1.55V4a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V10a1.7 1.7 0 0 0 1.55 1H20a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" stroke="currentColor" stroke-width="1.5"/></svg>',
  administration: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  promotions: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 12l-8 8-9-9V4h7l10 8Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="7.5" cy="7.5" r="1.3" fill="currentColor"/></svg>'
};

// role: null = everyone, 'admin' = admin only
const MODULES = [
  {id:'dashboard', label:'Dashboard', sub:"Today's snapshot of your shop", role:null},
  {id:'sales', label:'Sales & POS', sub:'Ring up sales and track revenue', role:null},
  {id:'inventory', label:'Inventory', sub:'Stock levels, costing and barcodes', role:null},
  {id:'crm', label:'Customers', sub:'Everyone who shops with you, gift cards & credit', role:null},
  {id:'purchasing', label:'Purchasing', sub:'Suppliers, procurement and returns', role:null},
  {id:'promotions', label:'Promotions', sub:'Discount codes and offers', role:'admin'},
  {id:'accounting', label:'Accounting', sub:'Income, expenses and your bottom line', role:'admin'},
  {id:'hr', label:'HR & Payroll', sub:'Your team, attendance and pay', role:'admin'},
  {id:'administration', label:'Administration', sub:'Staff accounts and access', role:'admin'},
  {id:'settings', label:'Settings', sub:'Shop details, locations, tax & data backup', role:'admin'}
];

let state = { active:'dashboard', tab:{}, filters:{}, loaded:false,
  locations: [], currentLocationId: null,
  products: [], inventory: [], sales: [], customers: [], employees: [], suppliers: [],
  purchases: [], transactions: [], attendance: [], giftCards: [], promotions: [], supplierReturns: [],
  settings: {shopName:'Giftly ERP', vatPercent:0, nbtPercent:0, taxEnabled:false} };

function uid(){ return Math.random().toString(36).slice(2,9); }
function money(n){ return 'Rs. ' + (Number(n)||0).toLocaleString('en-LK',{minimumFractionDigits:2,maximumFractionDigits:2}); }
function todayStr(){ const d=new Date(); return d.toISOString().slice(0,10); }
function fmtDate(s){ if(!s) return ''; const d=new Date(s); return d.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}); }
function esc(s){ return (s||'').toString().replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function marginPct(cost, price){ if(!price) return 0; return ((price - cost) / price) * 100; }
function marginClass(pct){ if(pct < 10) return 'loss'; if(pct < 30) return 'tight'; return 'good'; }
function randomCode(prefix, len){ const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let s=prefix||''; for(let i=0;i<(len||8);i++) s+=chars[Math.floor(Math.random()*chars.length)]; return s; }

const STORE_MAP = {
  products:'giftly_products', customers:'giftly_customers', suppliers:'giftly_suppliers', employees:'giftly_employees',
  sales:'giftly_sales', purchases:'giftly_purchases', transactions:'giftly_transactions', attendance:'giftly_attendance',
  settings:'giftly_settings', locations:'giftly_locations', inventory:'giftly_inventory', giftCards:'giftly_giftcards',
  promotions:'giftly_promotions', supplierReturns:'giftly_supplier_returns'
};

function storeGet(key, fallback){
  try{ const raw = localStorage.getItem(STORE_MAP[key]); return raw ? JSON.parse(raw) : fallback; }
  catch(e){ return fallback; }
}
function persist(key){ try{ localStorage.setItem(STORE_MAP[key], JSON.stringify(state[key])); }catch(e){ console.error('save failed', key, e); } }

/* ---------------- Per-location inventory helpers ---------------- */
function levelFor(productId, locationId){
  locationId = locationId || state.currentLocationId;
  let lvl = state.inventory.find(i => i.productId===productId && i.locationId===locationId);
  if(!lvl){ lvl = {productId, locationId, stock:0, reorder:5}; state.inventory.push(lvl); }
  return lvl;
}
function stockOf(productId, locationId){ return levelFor(productId, locationId).stock; }
function adjustStock(productId, locationId, delta){ levelFor(productId, locationId).stock += delta; persist('inventory'); }
function currentLocation(){ return state.locations.find(l=>l.id===state.currentLocationId) || state.locations[0]; }
function lowStockProducts(locationId){
  locationId = locationId || state.currentLocationId;
  return state.products.filter(p=>{ const lvl = levelFor(p.id, locationId); return lvl.stock <= lvl.reorder; });
}

function loadAll(){
  const seedLocations = [{id:'loc-main', name:'Main Store'}];
  const seedProducts = [
    {id:'p1', name:'Scented Candle Gift Set', sku:'GC-001', barcode:'200000000011', category:'Candles', price:2500, cost:1400, taxable:true},
    {id:'p2', name:'Ceramic Mug (Personalised)', sku:'GC-002', barcode:'200000000028', category:'Mugs', price:1800, cost:900, taxable:true},
    {id:'p3', name:'Gift Wrap Kit', sku:'GC-003', barcode:'200000000035', category:'Wrapping', price:950, cost:400, taxable:true},
    {id:'p4', name:'Wooden Photo Frame', sku:'GC-004', barcode:'200000000042', category:'Frames', price:3200, cost:1800, taxable:true},
    {id:'p5', name:'Greeting Card Pack', sku:'GC-005', barcode:'200000000059', category:'Cards', price:450, cost:180, taxable:true}
  ];
  const seedInventory = [
    {productId:'p1', locationId:'loc-main', stock:24, reorder:10},
    {productId:'p2', locationId:'loc-main', stock:5, reorder:10},
    {productId:'p3', locationId:'loc-main', stock:40, reorder:15},
    {productId:'p4', locationId:'loc-main', stock:12, reorder:8},
    {productId:'p5', locationId:'loc-main', stock:60, reorder:20}
  ];
  const seedCustomers = [
    {id:uid(), name:'Nadeesha Perera', phone:'077 123 4567', email:'nadeesha@example.com', notes:'Prefers candle sets', storeCredit:0},
    {id:uid(), name:'Kasun Fernando', phone:'071 987 6543', email:'', notes:'Corporate gifting, buys in bulk', storeCredit:0}
  ];
  const seedSuppliers = [
    {id:uid(), name:'Lanka Craft Supplies', phone:'011 234 5678', email:'sales@lankacraft.lk', leadTimeDays:5},
    {id:uid(), name:'ColomboPack Wholesale', phone:'011 876 5432', email:'orders@colombopack.lk', leadTimeDays:3}
  ];
  const seedEmployees = [
    {id:uid(), name:'Randeepa', role:'Owner / Manager', basic:75000},
    {id:uid(), name:'Sales Associate', role:'Sales Associate', basic:42000}
  ];

  state.locations  = storeGet('locations', seedLocations);
  state.products   = storeGet('products', seedProducts);
  state.inventory  = storeGet('inventory', seedInventory);
  state.customers  = storeGet('customers', seedCustomers);
  state.suppliers  = storeGet('suppliers', seedSuppliers);
  state.employees  = storeGet('employees', seedEmployees);
  state.sales      = storeGet('sales', []);
  state.purchases  = storeGet('purchases', []);
  state.transactions = storeGet('transactions', []);
  state.attendance = storeGet('attendance', []);
  state.giftCards  = storeGet('giftCards', []);
  state.promotions = storeGet('promotions', []);
  state.supplierReturns = storeGet('supplierReturns', []);
  state.settings   = storeGet('settings', {shopName:'Giftly ERP', vatPercent:0, nbtPercent:0, taxEnabled:false});
  state.currentLocationId = localStorage.getItem('giftly_current_location') || (state.locations[0] && state.locations[0].id);
  state.loaded = true;
}

/* ================= SHELL ================= */
function visibleModules(){
  const isAdmin = GSAuth.isAdmin();
  return MODULES.filter(m => m.role === null || (m.role === 'admin' && isAdmin));
}

function renderShell(){
  const nav = document.getElementById('gs-nav');
  const mods = visibleModules();
  if(!mods.find(m=>m.id===state.active)) state.active = 'dashboard';
  nav.innerHTML = mods.map(m => (m.id==='promotions' ? '<div class="gs-nav-divider"></div>' : '') + `
    <div class="gs-nav-item ${state.active===m.id?'active':''}" data-nav="${m.id}">
      ${ICONS[m.id]}<span>${m.label}</span>
    </div>`).join('');
  nav.querySelectorAll('[data-nav]').forEach(el=>{
    el.addEventListener('click', ()=>{ state.active = el.dataset.nav; renderShell(); renderContent(); });
  });
  const mod = MODULES.find(m=>m.id===state.active);
  document.getElementById('gs-title').textContent = mod.label;
  document.getElementById('gs-subtitle').textContent = mod.sub;
  renderTopbarExtras();
  document.getElementById('gs-brand-name').textContent = state.settings.shopName || 'Giftly ERP';
  document.getElementById('gs-brand-initial').textContent = (state.settings.shopName||'G').trim().charAt(0).toUpperCase();

  const me = GSAuth.currentUser();
  const userBox = document.getElementById('gs-user-box');
  if(me){
    userBox.innerHTML = `<div class="who"><b>${esc(me.name)}</b><span>${esc(me.role)}</span></div><button class="gs-logout-btn" id="gs-logout">Sign out</button>`;
    document.getElementById('gs-logout').addEventListener('click', ()=> GSAuth.logout());
  }
}

function renderTopbarExtras(){
  const topbar = document.querySelector('.gs-topbar');
  let extras = document.getElementById('gs-topbar-extras');
  if(extras) extras.remove();
  extras = document.createElement('div');
  extras.id = 'gs-topbar-extras';
  extras.className = 'gs-topbar-extras';
  const low = lowStockProducts();
  extras.innerHTML = `
    <select class="gs-search" id="gs-location-switch" title="Current working location">
      ${state.locations.map(l=>`<option value="${l.id}" ${l.id===state.currentLocationId?'selected':''}>${esc(l.name)}</option>`).join('')}
    </select>
    <div class="gs-bell-wrap">
      <button class="gs-bell-btn" id="gs-bell">🔔${low.length ? `<span class="gs-bell-badge">${low.length}</span>` : ''}</button>
      <div class="gs-bell-dropdown" id="gs-bell-dropdown" style="display:none;">
        <div class="gs-bell-head">Low stock at ${esc(currentLocation()?currentLocation().name:'')}</div>
        ${ low.length ? low.map(p=>{ const lvl = levelFor(p.id); return `<div class="gs-bell-row"><span>${esc(p.name)}</span><span class="gs-badge low">${lvl.stock} / ${lvl.reorder}</span></div>`; }).join('') : '<div class="gs-bell-row gs-hint">All stocked well here.</div>' }
      </div>
    </div>
    <div class="gs-date">${new Date().toLocaleDateString('en-GB',{weekday:'long', day:'2-digit', month:'long', year:'numeric'})}</div>
  `;
  topbar.appendChild(extras);
  document.getElementById('gs-location-switch').addEventListener('change', e=>{
    state.currentLocationId = e.target.value;
    localStorage.setItem('giftly_current_location', state.currentLocationId);
    renderShell(); renderContent();
  });
  const bellBtn = document.getElementById('gs-bell');
  const dd = document.getElementById('gs-bell-dropdown');
  bellBtn.addEventListener('click', (e)=>{ e.stopPropagation(); dd.style.display = dd.style.display==='none' ? 'block' : 'none'; });
  document.addEventListener('click', ()=>{ if(dd) dd.style.display='none'; }, {once:true});
}

function renderContent(){
  const c = document.getElementById('gs-content');
  if(!state.loaded){ c.innerHTML = '<div class="gs-loading">Loading your shop data…</div>'; return; }
  const mod = MODULES.find(m=>m.id===state.active);
  if(mod.role === 'admin' && !GSAuth.isAdmin()){
    c.innerHTML = `<div class="gs-role-locked"><b>Administrators only</b>Your account doesn't have access to this section.</div>`;
    return;
  }
  const renderers = { dashboard: renderDashboard, sales: renderSales, inventory: renderInventory, accounting: renderAccounting, crm: renderCRM, hr: renderHR, purchasing: renderPurchasing, settings: renderSettings, administration: renderAdministration, promotions: renderPromotions };
  c.innerHTML = '';
  renderers[state.active](c);
}

function renderAdministration(c){
  GSAuth.renderAdminPanel(c, () => { renderShell(); renderContent(); });
}

function activeSales(){ return state.sales.filter(s=>s.status !== 'Refunded'); }
function totalRevenue(){ return activeSales().reduce((s,x)=>s+x.total,0); }
function totalExpenses(){ return state.transactions.filter(t=>t.type==='expense').reduce((s,x)=>s+x.amount,0); }
function totalCOGS(){
  let cogs=0;
  activeSales().forEach(s=> s.items.forEach(it=>{
    const p = state.products.find(pp=>pp.id===it.productId);
    if(p) cogs += (p.cost||0)*it.qty;
  }));
  return cogs;
}
function loyaltyPoints(customerId){
  const spent = activeSales().filter(s=>s.customerId===customerId).reduce((s,x)=>s+x.total,0);
  return Math.floor(spent/100);
}
function taxRatePct(){ return state.settings.taxEnabled ? (Number(state.settings.vatPercent||0) + Number(state.settings.nbtPercent||0)) : 0; }

/* ================= DASHBOARD ================= */
function renderDashboard(c){
  const revenue = totalRevenue();
  const expenses = totalExpenses();
  const cogs = totalCOGS();
  const netProfit = revenue - cogs - expenses;
  const low = lowStockProducts();
  const recentSales = [...activeSales()].sort((a,b)=> b.date.localeCompare(a.date)).slice(0,5);

  const qtyByProduct = {};
  activeSales().forEach(s=> s.items.forEach(it=>{ qtyByProduct[it.productId] = (qtyByProduct[it.productId]||0) + it.qty; }));
  const topProducts = Object.entries(qtyByProduct).sort((a,b)=>b[1]-a[1]).slice(0,5)
    .map(([pid,qty])=>({ product: state.products.find(p=>p.id===pid), qty }));
  const maxQty = topProducts.length ? topProducts[0].qty : 1;

  c.innerHTML = `
    <div class="gs-stats">
      <div class="gs-stat"><div class="lbl">Revenue</div><div class="val">${money(revenue)}</div><div class="sub">${activeSales().length} sale${activeSales().length===1?'':'s'} recorded</div></div>
      ${GSAuth.isAdmin() ? `<div class="gs-stat"><div class="lbl">Net profit</div><div class="val">${money(netProfit)}</div><div class="sub ${netProfit<0?'warn':''}">after cost of goods & expenses</div></div>` : ''}
      <div class="gs-stat"><div class="lbl">Customers</div><div class="val">${state.customers.length}</div><div class="sub">in your CRM</div></div>
      <div class="gs-stat"><div class="lbl">Low stock (${esc(currentLocation()?currentLocation().name:'')})</div><div class="val">${low.length}</div><div class="sub ${low.length?'warn':''}">${low.length? 'need reordering':'all stocked well'}</div></div>
    </div>

    <div class="gs-panel">
      <div class="gs-panel-head"><h3>Top selling products</h3></div>
      <div class="gs-panel-body">
        ${ topProducts.length ? topProducts.map(t=>`
          <div style="margin-bottom:10px;">
            <div style="display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:4px;">
              <span>${t.product ? esc(t.product.name) : 'Deleted product'}</span><span style="color:var(--ink-soft)">${t.qty} sold</span>
            </div>
            <div style="background:#F0EBDA;border-radius:6px;height:8px;overflow:hidden;">
              <div style="background:var(--gold);height:100%;width:${(t.qty/maxQty*100).toFixed(0)}%;"></div>
            </div>
          </div>`).join('') : `<div class="gs-empty"><b>No sales yet</b>Record your first sale in Sales & POS to see it here.</div>` }
      </div>
    </div>

    <div class="gs-panel">
      <div class="gs-panel-head"><h3>Recent sales</h3></div>
      <div class="gs-panel-body" style="padding:0;">
        ${ recentSales.length ? `<table class="gs-table"><thead><tr><th>Date</th><th>Customer</th><th>Items</th><th>Payment</th><th>Total</th></tr></thead><tbody>
          ${recentSales.map(s=>{
            const cust = state.customers.find(cu=>cu.id===s.customerId);
            return `<tr><td>${fmtDate(s.date)}</td><td>${cust?esc(cust.name):'Walk-in'}</td><td>${s.items.length}</td><td>${s.paymentMethod||'Cash'}</td><td>${money(s.total)}</td></tr>`;
          }).join('')}
        </tbody></table>` : `<div class="gs-empty" style="padding-top:0;"></div>` }
      </div>
    </div>

    ${ low.length ? `<div class="gs-panel">
      <div class="gs-panel-head"><h3>Reorder soon</h3><button class="gs-btn gs-btn-gold gs-btn-sm" id="dash-reorder">Go to Purchasing</button></div>
      <div class="gs-panel-body" style="padding:0;">
        <table class="gs-table"><thead><tr><th>Product</th><th>In stock</th><th>Reorder level</th></tr></thead><tbody>
          ${low.map(p=>{ const lvl=levelFor(p.id); return `<tr><td>${esc(p.name)}</td><td><span class="gs-badge low">${lvl.stock}</span></td><td>${lvl.reorder}</td></tr>`; }).join('')}
        </tbody></table>
      </div>
    </div>` : '' }
  `;
  const btn = document.getElementById('dash-reorder');
  if(btn) btn.addEventListener('click', ()=>{ state.active='purchasing'; renderShell(); renderContent(); });
}

/* ================= SALES & POS ================= */
let posCart = [];
let posGiftCard = null; // {code, amount}
let posStoreCreditAmt = 0;
let posPromo = null; // {code, discountAmt}

function renderSales(c){
  const q = (state.filters.sales||'').toLowerCase();
  let list = [...state.sales].sort((a,b)=> b.date.localeCompare(a.date));
  if(q){
    list = list.filter(s=>{
      const cust = state.customers.find(cu=>cu.id===s.customerId);
      return (cust && cust.name.toLowerCase().includes(q)) || s.date.includes(q) || (!cust && 'walk-in'.includes(q));
    });
  }
  c.innerHTML = `
    <div style="display:grid;grid-template-columns:1.3fr 1fr;gap:18px;align-items:start;">
      <div class="gs-panel">
        <div class="gs-panel-head"><h3>New sale</h3><button class="gs-btn gs-btn-gold gs-btn-sm" id="pos-scan">📷 Scan barcode</button></div>
        <div class="gs-panel-body">
          <div class="gs-field">
            <label>Product</label>
            <select id="pos-product">
              <option value="">Select a product…</option>
              ${state.products.map(p=>`<option value="${p.id}">${esc(p.name)} — ${money(p.price)} (${stockOf(p.id)} in stock)</option>`).join('')}
            </select>
          </div>
          <div style="display:flex;gap:10px;align-items:end;">
            <div class="gs-field" style="flex:1;"><label>Quantity</label><input type="number" id="pos-qty" min="1" value="1"></div>
            <button class="gs-btn gs-btn-gold" id="pos-add" style="height:38px;">Add to cart</button>
          </div>
          <div class="gs-hint">Shortcuts: <b>F2</b> focus product · <b>Enter</b> in quantity adds to cart · <b>F9</b> complete sale · <b>Esc</b> closes dialogs</div>
          <div id="pos-cart" style="margin-top:14px;"></div>

          <div class="gs-form-grid" style="margin-top:12px;">
            <div class="gs-field"><label>Customer (optional)</label>
              <select id="pos-customer"><option value="">Walk-in customer</option>
                ${state.customers.map(cu=>`<option value="${cu.id}">${esc(cu.name)}${cu.storeCredit?` (credit ${money(cu.storeCredit)})`:''}</option>`).join('')}
              </select>
            </div>
            <div class="gs-field"><label>Discount (Rs., optional)</label><input type="number" id="pos-discount" min="0" value="0"></div>
          </div>

          <div class="gs-field">
            <label>Promo code (optional)</label>
            <div style="display:flex;gap:8px;">
              <input id="pos-promo" placeholder="e.g. SAVE10" style="flex:1;">
              <button class="gs-btn gs-btn-ghost gs-btn-sm" id="pos-promo-apply">Apply</button>
            </div>
            <div id="pos-promo-status" class="gs-hint"></div>
          </div>

          <div class="gs-field">
            <label>Gift card (optional)</label>
            <div style="display:flex;gap:8px;">
              <input id="pos-giftcard" placeholder="Gift card code">
              <button class="gs-btn gs-btn-ghost gs-btn-sm" id="pos-giftcard-apply">Apply</button>
            </div>
            <div id="pos-giftcard-status" class="gs-hint"></div>
          </div>

          <div class="gs-field" id="pos-storecredit-wrap" style="display:none;">
            <label>Use store credit (Rs.)</label>
            <input type="number" id="pos-storecredit" min="0" value="0">
          </div>

          <div class="gs-field">
            <label>Payment method</label>
            <div class="gs-radio-row">
              <label><input type="radio" name="pos-pay" value="Cash" checked> Cash</label>
              <label><input type="radio" name="pos-pay" value="Card"> Card</label>
              <label><input type="radio" name="pos-pay" value="Bank Transfer"> Bank Transfer</label>
              <label><input type="radio" name="pos-pay" value="Layaway"> Layaway</label>
            </div>
          </div>
          <div class="gs-field" id="pos-deposit-wrap" style="display:none;">
            <label>Deposit amount now (Rs.)</label>
            <input type="number" id="pos-deposit" min="0" value="0">
          </div>

          <div id="pos-summary" class="gs-hint" style="margin-bottom:8px;"></div>
          <button class="gs-btn gs-btn-primary" id="pos-checkout" style="width:100%;margin-top:6px;padding:11px;">Complete sale</button>
        </div>
      </div>
      <div class="gs-panel">
        <div class="gs-panel-head"><h3>Sales history</h3>
          <input class="gs-search" id="sales-search" placeholder="Search customer or date…" value="${esc(state.filters.sales||'')}">
        </div>
        <div class="gs-panel-body" style="padding:0;">
          ${ list.length ? `<table class="gs-table"><thead><tr><th>Date</th><th>Customer</th><th>Pay</th><th>Total</th><th>Status</th><th></th></tr></thead><tbody>
            ${list.map(s=>{
              const cust = state.customers.find(cu=>cu.id===s.customerId);
              const refunded = s.status === 'Refunded';
              const layaway = s.status === 'Layaway';
              return `<tr><td>${fmtDate(s.date)}</td><td>${cust?esc(cust.name):'Walk-in'}</td><td>${s.paymentMethod||'Cash'}</td><td>${money(s.total)}</td>
                <td><span class="gs-badge ${refunded?'low':(layaway?'gold':'ok')}">${refunded?'Refunded':(layaway?'Layaway due '+money(s.balanceDue):'Completed')}</span></td>
                <td class="gs-row-actions">
                  <button class="gs-btn gs-btn-ghost gs-btn-sm" data-view-sale="${s.id}">Receipt</button>
                  ${layaway ? `<button class="gs-btn gs-btn-gold gs-btn-sm" data-pay-layaway="${s.id}">Add payment</button>` : ''}
                  ${!refunded ? `<button class="gs-btn gs-btn-danger gs-btn-sm" data-refund-sale="${s.id}">Refund</button>` : ''}
                </td></tr>`;
            }).join('')}
          </tbody></table>` : `<div class="gs-empty"><b>${q?'No matching sales':'No sales yet'}</b>${q?'Try a different search.':'Ring up your first sale on the left.'}</div>` }
        </div>
      </div>
    </div>
  `;
  posGiftCard = null; posPromo = null; posStoreCreditAmt = 0;
  renderCart();

  document.getElementById('sales-search').addEventListener('input', e=>{ state.filters.sales = e.target.value; renderSales(c); });

  document.getElementById('pos-scan').addEventListener('click', ()=>{
    GSBarcode.openScanModal('Scan a product to add to cart', (code)=>{
      const product = state.products.find(p => p.barcode === code);
      if(!product){ alert(`No product matches barcode "${code}". Add it from Inventory first.`); return; }
      addToCart(product.id, 1);
    });
  });

  document.getElementById('pos-add').addEventListener('click', ()=>{
    const pid = document.getElementById('pos-product').value;
    const qty = parseInt(document.getElementById('pos-qty').value) || 1;
    if(!pid){ alert('Choose a product first.'); return; }
    addToCart(pid, qty);
  });
  document.getElementById('pos-qty').addEventListener('keydown', e=>{
    if(e.key === 'Enter'){ e.preventDefault(); document.getElementById('pos-add').click(); }
  });

  document.getElementById('pos-customer').addEventListener('change', e=>{
    const cust = state.customers.find(cu=>cu.id===e.target.value);
    document.getElementById('pos-storecredit-wrap').style.display = (cust && cust.storeCredit>0) ? 'block' : 'none';
    updateSummary();
  });
  document.getElementById('pos-discount').addEventListener('input', updateSummary);
  document.getElementById('pos-storecredit').addEventListener('input', ()=>{ posStoreCreditAmt = parseFloat(document.getElementById('pos-storecredit').value)||0; updateSummary(); });
  document.querySelectorAll('input[name="pos-pay"]').forEach(r=> r.addEventListener('change', ()=>{
    document.getElementById('pos-deposit-wrap').style.display = r.checked && r.value==='Layaway' ? 'block' : 'none';
    updateSummary();
  }));
  document.getElementById('pos-deposit').addEventListener('input', updateSummary);

  document.getElementById('pos-promo-apply').addEventListener('click', ()=>{
    const code = document.getElementById('pos-promo').value.trim().toUpperCase();
    const statusEl = document.getElementById('pos-promo-status');
    const promo = state.promotions.find(p=>p.code.toUpperCase()===code && p.active);
    const subtotal = posCart.reduce((s,l)=>s+l.qty*l.price,0);
    if(!promo){ statusEl.textContent = 'No active promo with that code.'; posPromo=null; updateSummary(); return; }
    if(promo.expiry && todayStr() > promo.expiry){ statusEl.textContent = 'That promo code has expired.'; posPromo=null; updateSummary(); return; }
    if(promo.minSpend && subtotal < promo.minSpend){ statusEl.textContent = `Needs a minimum spend of ${money(promo.minSpend)}.`; posPromo=null; updateSummary(); return; }
    const discountAmt = promo.type==='percent' ? subtotal*(promo.value/100) : Math.min(promo.value, subtotal);
    posPromo = { code: promo.code, discountAmt };
    document.getElementById('pos-discount').value = discountAmt.toFixed(2);
    statusEl.textContent = `Applied: ${promo.code} (−${money(discountAmt)})`;
    updateSummary();
  });

  document.getElementById('pos-giftcard-apply').addEventListener('click', ()=>{
    const code = document.getElementById('pos-giftcard').value.trim().toUpperCase();
    const statusEl = document.getElementById('pos-giftcard-status');
    const card = state.giftCards.find(g=>g.code.toUpperCase()===code);
    if(!card){ statusEl.textContent = 'No gift card with that code.'; posGiftCard=null; updateSummary(); return; }
    if(!card.active || card.balance<=0){ statusEl.textContent = 'This gift card has no remaining balance.'; posGiftCard=null; updateSummary(); return; }
    posGiftCard = { code: card.code, balance: card.balance };
    statusEl.textContent = `Applied: ${card.code} (balance ${money(card.balance)})`;
    updateSummary();
  });

  function addToCart(pid, qty){
    const product = state.products.find(p=>p.id===pid);
    if(!product) return;
    const available = stockOf(pid) - cartQtyFor(pid);
    if(qty > available){ alert(`Only ${available} left in stock at ${currentLocation().name}.`); return; }
    const existing = posCart.find(l=>l.productId===pid);
    if(existing) existing.qty += qty; else posCart.push({productId:pid, qty, price:product.price});
    renderCart(); updateSummary();
  }

  function computeTotals(){
    const subtotal = posCart.reduce((s,l)=>s+l.qty*l.price,0);
    const discount = Math.min(parseFloat(document.getElementById('pos-discount')?.value)||0, subtotal);
    const taxableBase = posCart.reduce((s,l)=>{ const p=state.products.find(pp=>pp.id===l.productId); return s + (p && p.taxable!==false ? l.qty*l.price : 0); },0);
    const discountRatio = subtotal>0 ? discount/subtotal : 0;
    const tax = taxableBase * (1-discountRatio) * (taxRatePct()/100);
    const total = Math.max(0, subtotal - discount + tax);
    const giftCardAmt = posGiftCard ? Math.min(posGiftCard.balance, total) : 0;
    const storeCreditAmt = Math.min(posStoreCreditAmt||0, Math.max(0,total-giftCardAmt));
    const remaining = Math.max(0, total - giftCardAmt - storeCreditAmt);
    return { subtotal, discount, tax, total, giftCardAmt, storeCreditAmt, remaining };
  }

  function updateSummary(){
    const t = computeTotals();
    const isLayaway = document.querySelector('input[name="pos-pay"]:checked')?.value === 'Layaway';
    const deposit = isLayaway ? Math.min(parseFloat(document.getElementById('pos-deposit')?.value)||0, t.remaining) : t.remaining;
    const balanceDue = isLayaway ? Math.max(0, t.remaining - deposit) : 0;
    document.getElementById('pos-summary').innerHTML =
      `Subtotal ${money(t.subtotal)} · Discount −${money(t.discount)}` +
      (taxRatePct()>0 ? ` · Tax ${money(t.tax)}` : '') +
      ` · Total <b>${money(t.total)}</b>` +
      (t.giftCardAmt ? ` · Gift card −${money(t.giftCardAmt)}` : '') +
      (t.storeCreditAmt ? ` · Store credit −${money(t.storeCreditAmt)}` : '') +
      (isLayaway ? ` · Deposit now ${money(deposit)} · Balance due ${money(balanceDue)}` : ` · Due now ${money(t.remaining)}`);
  }
  window.__posUpdateSummary = updateSummary;

  document.getElementById('pos-checkout').addEventListener('click', ()=>{
    if(posCart.length===0){ alert('Add at least one item to the cart.'); return; }
    const t = computeTotals();
    const payMethod = document.querySelector('input[name="pos-pay"]:checked').value;
    const custId = document.getElementById('pos-customer').value || null;
    const isLayaway = payMethod === 'Layaway';
    const deposit = isLayaway ? Math.min(parseFloat(document.getElementById('pos-deposit').value)||0, t.remaining) : t.remaining;
    const balanceDue = isLayaway ? Math.max(0, t.remaining - deposit) : 0;
    if(isLayaway && deposit <= 0){ alert('Enter a deposit amount for a layaway sale.'); return; }

    const sale = {
      id:uid(), date: todayStr(), locationId: state.currentLocationId, customerId: custId,
      items: posCart.map(l=>({...l})), subtotal: t.subtotal, discount: t.discount, tax: t.tax, total: t.total,
      promoCode: posPromo ? posPromo.code : null, giftCardCode: posGiftCard ? posGiftCard.code : null, giftCardAmt: t.giftCardAmt,
      storeCreditAmt: t.storeCreditAmt, paymentMethod: payMethod,
      status: isLayaway ? 'Layaway' : 'Completed', depositPaid: isLayaway ? deposit : t.remaining, balanceDue,
      cashier: (GSAuth.currentUser()||{}).name || 'Unknown'
    };
    state.sales.push(sale);
    posCart.forEach(l=> adjustStock(l.productId, state.currentLocationId, -l.qty));
    if(t.giftCardAmt > 0){ const card = state.giftCards.find(g=>g.code===sale.giftCardCode); if(card){ card.balance -= t.giftCardAmt; persist('giftCards'); } }
    if(t.storeCreditAmt > 0 && custId){ const cu = state.customers.find(c=>c.id===custId); if(cu){ cu.storeCredit -= t.storeCreditAmt; persist('customers'); } }
    const cashReceived = isLayaway ? deposit : t.remaining;
    if(cashReceived > 0) state.transactions.push({ id:uid(), date: todayStr(), type:'income', category:'Sales', amount: cashReceived, note:`Sale #${sale.id.slice(0,5)}${isLayaway?' (layaway deposit)':''}`, source:'sale', refId:sale.id });
    persist('sales'); persist('transactions');
    posCart = []; posGiftCard = null; posPromo = null; posStoreCreditAmt = 0;
    renderContent();
    openReceiptModal(sale);
  });
  updateSummary();

  c.querySelectorAll('[data-view-sale]').forEach(btn=> btn.addEventListener('click', ()=> openReceiptModal(state.sales.find(s=>s.id===btn.dataset.viewSale))));
  c.querySelectorAll('[data-pay-layaway]').forEach(btn=> btn.addEventListener('click', ()=> openLayawayPaymentModal(state.sales.find(s=>s.id===btn.dataset.payLayaway))));
  c.querySelectorAll('[data-refund-sale]').forEach(btn=> btn.addEventListener('click', ()=>{
    const sale = state.sales.find(s=>s.id===btn.dataset.refundSale);
    openRefundModal(sale);
  }));
}
function cartQtyFor(pid){ const l = posCart.find(x=>x.productId===pid); return l?l.qty:0; }
function renderCart(){
  const el = document.getElementById('pos-cart');
  if(!el) return;
  if(posCart.length===0){ el.innerHTML = '<div class="gs-hint">Cart is empty — add products above or scan a barcode.</div>'; return; }
  const total = posCart.reduce((s,l)=>s+l.qty*l.price,0);
  el.innerHTML = posCart.map(l=>{
    const p = state.products.find(pp=>pp.id===l.productId);
    return `<div class="gs-cart-line"><span>${p?esc(p.name):'—'} × ${l.qty} <span class="gs-link" data-cart-remove="${l.productId}" style="margin-left:6px;">remove</span></span><span>${money(l.qty*l.price)}</span></div>`;
  }).join('') + `<div class="gs-cart-total"><span>Subtotal</span><span>${money(total)}</span></div>`;
  el.querySelectorAll('[data-cart-remove]').forEach(b=> b.addEventListener('click', ()=>{
    posCart = posCart.filter(l=>l.productId!==b.dataset.cartRemove); renderCart();
    if(window.__posUpdateSummary) window.__posUpdateSummary();
  }));
}
function openLayawayPaymentModal(sale){
  const back = document.createElement('div'); back.className='gs-modal-back';
  back.innerHTML = `<div class="gs-modal">
    <h3>Add layaway payment</h3>
    <div class="gs-hint" style="margin-bottom:10px;">Balance due: <b>${money(sale.balanceDue)}</b></div>
    <div class="gs-field"><label>Payment amount (Rs.)</label><input id="lp-amt" type="number" min="0" max="${sale.balanceDue}" value="${sale.balanceDue}"></div>
    <div class="gs-modal-actions">
      <button class="gs-btn gs-btn-ghost" id="lp-cancel">Cancel</button>
      <button class="gs-btn gs-btn-primary" id="lp-save">Record payment</button>
    </div></div>`;
  document.body.appendChild(back);
  back.addEventListener('click', e=>{ if(e.target===back) back.remove(); });
  back.querySelector('#lp-cancel').addEventListener('click', ()=> back.remove());
  back.querySelector('#lp-save').addEventListener('click', ()=>{
    const amt = Math.min(parseFloat(back.querySelector('#lp-amt').value)||0, sale.balanceDue);
    if(amt<=0){ alert('Enter a valid amount.'); return; }
    sale.balanceDue -= amt; sale.depositPaid += amt;
    if(sale.balanceDue <= 0){ sale.status = 'Completed'; sale.balanceDue = 0; }
    state.transactions.push({id:uid(), date:todayStr(), type:'income', category:'Sales', amount:amt, note:`Layaway payment for sale #${sale.id.slice(0,5)}`, source:'sale', refId:sale.id});
    persist('sales'); persist('transactions'); back.remove(); renderContent();
  });
}
function openRefundModal(sale){
  const cust = state.customers.find(cu=>cu.id===sale.customerId);
  const back = document.createElement('div'); back.className='gs-modal-back';
  back.innerHTML = `<div class="gs-modal">
    <h3>Refund sale</h3>
    <div class="gs-hint" style="margin-bottom:10px;">Refund amount: <b>${money(sale.total)}</b>. Stock will be restored to ${esc(currentLocation()?currentLocation().name:'')}.</div>
    <div class="gs-field">
      <label>Refund method</label>
      <div class="gs-radio-row">
        <label><input type="radio" name="rf-method" value="cash" checked> Cash / original payment</label>
        ${cust ? `<label><input type="radio" name="rf-method" value="credit"> Store credit for ${esc(cust.name)}</label>` : ''}
      </div>
    </div>
    <div class="gs-modal-actions">
      <button class="gs-btn gs-btn-ghost" id="rf-cancel">Cancel</button>
      <button class="gs-btn gs-btn-danger" id="rf-save">Confirm refund</button>
    </div></div>`;
  document.body.appendChild(back);
  back.addEventListener('click', e=>{ if(e.target===back) back.remove(); });
  back.querySelector('#rf-cancel').addEventListener('click', ()=> back.remove());
  back.querySelector('#rf-save').addEventListener('click', ()=>{
    const method = back.querySelector('input[name="rf-method"]:checked').value;
    sale.status = 'Refunded';
    sale.items.forEach(l=> adjustStock(l.productId, sale.locationId || state.currentLocationId, l.qty));
    if(method === 'credit' && cust){
      cust.storeCredit = (cust.storeCredit||0) + sale.total;
      persist('customers');
    } else {
      state.transactions.push({id:uid(), date:todayStr(), type:'expense', category:'Refunds', amount:sale.total, note:`Refund of sale #${sale.id.slice(0,5)}`, source:'refund', refId:sale.id});
      persist('transactions');
    }
    persist('sales'); back.remove(); renderContent();
  });
}
function openReceiptModal(sale){
  const cust = state.customers.find(c=>c.id===sale.customerId);
  const back = document.createElement('div'); back.className='gs-modal-back';
  back.innerHTML = `<div class="gs-modal">
    <h3>Receipt</h3>
    <div class="gs-receipt" id="receipt-print">
      <div class="center"><b>${esc(state.settings.shopName||'Giftly ERP')}</b><br>${esc(currentLocation()?currentLocation().name:'')}</div>
      <hr>
      <div class="line"><span>Date</span><span>${fmtDate(sale.date)}</span></div>
      <div class="line"><span>Customer</span><span>${cust?esc(cust.name):'Walk-in'}</span></div>
      <div class="line"><span>Cashier</span><span>${esc(sale.cashier||'—')}</span></div>
      <div class="line"><span>Payment</span><span>${sale.paymentMethod||'Cash'}</span></div>
      <hr>
      ${sale.items.map(l=>{ const p = state.products.find(pp=>pp.id===l.productId); return `<div class="line"><span>${p?esc(p.name):'—'} × ${l.qty}</span><span>${money(l.qty*l.price)}</span></div>`; }).join('')}
      <hr>
      <div class="line"><span>Subtotal</span><span>${money(sale.subtotal)}</span></div>
      ${sale.discount ? `<div class="line"><span>Discount${sale.promoCode?' ('+esc(sale.promoCode)+')':''}</span><span>-${money(sale.discount)}</span></div>` : ''}
      ${sale.tax ? `<div class="line"><span>Tax</span><span>${money(sale.tax)}</span></div>` : ''}
      ${sale.giftCardAmt ? `<div class="line"><span>Gift card</span><span>-${money(sale.giftCardAmt)}</span></div>` : ''}
      ${sale.storeCreditAmt ? `<div class="line"><span>Store credit</span><span>-${money(sale.storeCreditAmt)}</span></div>` : ''}
      <div class="line" style="font-weight:700;"><span>Total</span><span>${money(sale.total)}</span></div>
      ${sale.status==='Layaway' ? `<div class="line"><span>Paid today</span><span>${money(sale.depositPaid)}</span></div><div class="line" style="font-weight:700;"><span>Balance due</span><span>${money(sale.balanceDue)}</span></div>` : ''}
      ${sale.status==='Refunded' ? `<div class="center" style="color:var(--rose);font-weight:700;margin-top:6px;">REFUNDED</div>` : ''}
    </div>
    <div class="gs-modal-actions">
      <button class="gs-btn gs-btn-ghost" id="rc-close">Close</button>
      <button class="gs-btn gs-btn-primary" id="rc-print">Print</button>
    </div></div>`;
  document.body.appendChild(back);
  back.addEventListener('click', e=>{ if(e.target===back) back.remove(); });
  back.querySelector('#rc-close').addEventListener('click', ()=> back.remove());
  back.querySelector('#rc-print').addEventListener('click', ()=>{
    const w = window.open('', '_blank', 'width=380,height=600');
    w.document.write(`<html><head><title>Receipt</title></head><body style="font-family:monospace;padding:16px;">${document.getElementById('receipt-print').innerHTML}</body></html>`);
    w.document.close(); w.print();
  });
}

/* ================= INVENTORY ================= */
function renderInventory(c){
  const q = (state.filters.inventory||'').toLowerCase();
  const cat = state.filters.invCategory||'';
  const cats = [...new Set(state.products.map(p=>p.category).filter(Boolean))];
  let list = state.products.filter(p=> (!q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || (p.barcode||'').includes(q)) && (!cat || p.category===cat));

  c.innerHTML = `
    <div class="gs-panel">
      <div class="gs-panel-head">
        <h3>All products (${state.products.length}) — ${esc(currentLocation()?currentLocation().name:'')}</h3>
        <div class="gs-panel-head-actions">
          <input class="gs-search" id="inv-search" placeholder="Search name, SKU or barcode…" value="${esc(state.filters.inventory||'')}">
          <select class="gs-search" id="inv-cat"><option value="">All categories</option>${cats.map(cc=>`<option value="${esc(cc)}" ${cat===cc?'selected':''}>${esc(cc)}</option>`).join('')}</select>
          <button class="gs-btn gs-btn-ghost" id="inv-print">🖨 Print report</button>
          <button class="gs-btn gs-btn-gold" id="inv-add">+ Add product</button>
        </div>
      </div>
      <div class="gs-panel-body" style="padding:0;">
        ${ list.length ? `<table class="gs-table"><thead><tr><th>Product</th><th>SKU / Barcode</th><th>Category</th><th>Cost</th><th>Price</th><th>Margin</th><th>Stock</th><th>Status</th><th></th></tr></thead><tbody>
          ${list.map(p=>{
            const lvl = levelFor(p.id);
            const low = lvl.stock <= lvl.reorder;
            const mp = marginPct(p.cost, p.price);
            return `<tr><td>${esc(p.name)}</td><td>${esc(p.sku)}${p.barcode?`<br><span class="gs-hint">${esc(p.barcode)}</span>`:''}</td><td>${esc(p.category)}</td><td>${money(p.cost)}</td><td>${money(p.price)}</td>
              <td><span class="gs-margin-pill ${marginClass(mp)}">${mp.toFixed(0)}%</span></td>
              <td>${lvl.stock}</td>
              <td><span class="gs-badge ${low?'low':'ok'}">${low?'Reorder':'In stock'}</span></td>
              <td class="gs-row-actions">
                <button class="gs-btn gs-btn-ghost gs-btn-sm" data-barcode="${p.id}">Barcode</button>
                <button class="gs-btn gs-btn-ghost gs-btn-sm" data-adjust="${p.id}">Adjust</button>
                <button class="gs-btn gs-btn-ghost gs-btn-sm" data-edit="${p.id}">Edit</button>
                <button class="gs-btn gs-btn-danger gs-btn-sm" data-del="${p.id}">Delete</button>
              </td></tr>`;
          }).join('')}
        </tbody></table>` : `<div class="gs-empty"><b>${q||cat?'No matching products':'No products yet'}</b>${q||cat?'Try a different search or filter.':'Add your first product to start tracking stock.'}</div>` }
      </div>
    </div>
  `;
  document.getElementById('inv-search').addEventListener('input', e=>{ state.filters.inventory = e.target.value; renderInventory(c); });
  document.getElementById('inv-cat').addEventListener('change', e=>{ state.filters.invCategory = e.target.value; renderInventory(c); });
  document.getElementById('inv-add').addEventListener('click', ()=> openProductModal(null));
  document.getElementById('inv-print').addEventListener('click', ()=> printInventoryReport(list));
  c.querySelectorAll('[data-edit]').forEach(b=> b.addEventListener('click', ()=> openProductModal(state.products.find(p=>p.id===b.dataset.edit))));
  c.querySelectorAll('[data-adjust]').forEach(b=> b.addEventListener('click', ()=> openAdjustModal(state.products.find(p=>p.id===b.dataset.adjust))));
  c.querySelectorAll('[data-barcode]').forEach(b=> b.addEventListener('click', ()=>{
    const product = state.products.find(p=>p.id===b.dataset.barcode);
    GSBarcode.openBarcodeModal(product, (val)=>{ product.barcode = val; persist('products'); renderInventory(c); });
  }));
  c.querySelectorAll('[data-del]').forEach(b=> b.addEventListener('click', ()=>{
    if(!confirm('Delete this product?')) return;
    state.products = state.products.filter(p=>p.id!==b.dataset.del);
    state.inventory = state.inventory.filter(i=>i.productId!==b.dataset.del);
    persist('products'); persist('inventory'); renderContent();
  }));
}

function printInventoryReport(list){
  const rows = list.map(p=>{
    const lvl = levelFor(p.id);
    const mp = marginPct(p.cost, p.price);
    return `<tr><td>${esc(p.name)}</td><td>${esc(p.sku)}</td><td>${esc(p.category)}</td><td>${money(p.cost)}</td><td>${money(p.price)}</td><td>${mp.toFixed(0)}%</td><td>${lvl.stock}</td><td>${lvl.reorder}</td></tr>`;
  }).join('');
  const w = window.open('', '_blank', 'width=800,height=900');
  w.document.write(`<html><head><title>Inventory report</title><style>
    body{font-family:Arial,sans-serif;padding:24px;color:#222;}
    h1{font-size:18px;margin-bottom:2px;} .sub{color:#666;font-size:12px;margin-bottom:16px;}
    table{width:100%;border-collapse:collapse;font-size:12px;} th,td{border:1px solid #ccc;padding:6px 8px;text-align:left;}
    th{background:#f2f2f2;}
  </style></head><body>
    <h1>${esc(state.settings.shopName||'Giftly ERP')} — Inventory report</h1>
    <div class="sub">${esc(currentLocation()?currentLocation().name:'')} · ${fmtDate(todayStr())}</div>
    <table><thead><tr><th>Product</th><th>SKU</th><th>Category</th><th>Cost</th><th>Price</th><th>Margin</th><th>Stock</th><th>Reorder</th></tr></thead>
    <tbody>${rows}</tbody></table>
  </body></html>`);
  w.document.close(); w.print();
}

function openAdjustModal(product){
  const lvl = levelFor(product.id);
  const back = document.createElement('div'); back.className='gs-modal-back';
  back.innerHTML = `<div class="gs-modal">
    <h3>Adjust stock — ${esc(product.name)}</h3>
    <div class="gs-hint" style="margin-bottom:10px;">Current stock at ${esc(currentLocation()?currentLocation().name:'')}: <b>${lvl.stock}</b></div>
    <div class="gs-field">
      <label>Adjustment type</label>
      <div class="gs-radio-row">
        <label><input type="radio" name="adj-type" value="add" checked> Add stock</label>
        <label><input type="radio" name="adj-type" value="remove"> Remove stock</label>
      </div>
    </div>
    <div class="gs-field"><label>Quantity</label><input type="number" id="adj-qty" min="1" value="1"></div>
    <div class="gs-field"><label>Reorder level for this location</label><input type="number" id="adj-reorder" min="0" value="${lvl.reorder}"></div>
    <div class="gs-field"><label>Reason</label>
      <select id="adj-reason"><option>Stock recount</option><option>Damaged goods</option><option>Theft / loss</option><option>Returned to supplier</option><option>Other</option></select>
    </div>
    <div class="gs-modal-actions">
      <button class="gs-btn gs-btn-ghost" id="adj-cancel">Cancel</button>
      <button class="gs-btn gs-btn-primary" id="adj-save">Save adjustment</button>
    </div></div>`;
  document.body.appendChild(back);
  back.addEventListener('click', e=>{ if(e.target===back) back.remove(); });
  back.querySelector('#adj-cancel').addEventListener('click', ()=> back.remove());
  back.querySelector('#adj-save').addEventListener('click', ()=>{
    const type = back.querySelector('input[name="adj-type"]:checked').value;
    const qty = parseInt(back.querySelector('#adj-qty').value)||0;
    const reason = back.querySelector('#adj-reason').value;
    if(qty<=0){ alert('Enter a valid quantity.'); return; }
    if(type==='remove' && qty>lvl.stock){ alert('Cannot remove more than current stock.'); return; }
    lvl.stock += (type==='add' ? qty : -qty);
    lvl.reorder = parseInt(back.querySelector('#adj-reorder').value)||0;
    if(type==='remove' && (reason==='Damaged goods' || reason==='Theft / loss')){
      state.transactions.push({id:uid(), date:todayStr(), type:'expense', category:'Stock loss', amount: (product.cost||0)*qty, note:`${reason}: ${product.name} × ${qty}`});
      persist('transactions');
    }
    persist('inventory'); back.remove(); renderContent();
  });
}

function openProductModal(product){
  const isEdit = !!product;
  product = product || {id:uid(), name:'', sku:'', barcode:'', category:'', price:'', cost:'', taxable:true};
  const startStock = isEdit ? levelFor(product.id).stock : 0;
  const startReorder = isEdit ? levelFor(product.id).reorder : 5;
  const back = document.createElement('div'); back.className='gs-modal-back';
  back.innerHTML = `<div class="gs-modal">
    <h3>${isEdit?'Edit product':'Add product'}</h3>
    <div class="gs-form-grid">
      <div class="gs-field full"><label>Product name</label><input id="f-name" value="${esc(product.name)}"></div>
      <div class="gs-field"><label>SKU</label><input id="f-sku" value="${esc(product.sku)}"></div>
      <div class="gs-field"><label>Category</label><input id="f-cat" value="${esc(product.category)}"></div>
      <div class="gs-field full"><label>Barcode</label>
        <div style="display:flex;gap:8px;">
          <input id="f-barcode" value="${esc(product.barcode||'')}" placeholder="Scan, type, or generate" style="flex:1;">
          <button type="button" class="gs-btn gs-btn-ghost gs-btn-sm" id="f-barcode-gen">Generate</button>
          <button type="button" class="gs-btn gs-btn-ghost gs-btn-sm" id="f-barcode-scan">Scan</button>
        </div>
      </div>
      <div class="gs-field"><label>Cost price (Rs.)</label><input id="f-cost" type="number" value="${product.cost}"></div>
      <div class="gs-field"><label>Selling price (Rs.)</label><input id="f-price" type="number" value="${product.price}"></div>
      <div class="gs-field full"><label>Margin</label>
        <div style="display:flex;align-items:center;gap:10px;">
          <input id="f-margin" type="number" step="0.1" placeholder="e.g. 40" style="max-width:120px;"><span style="font-size:12px;color:var(--ink-soft);">% — auto-sets selling price from cost</span>
        </div>
      </div>
      <div class="gs-field"><label>Stock at ${esc(currentLocation()?currentLocation().name:'')}</label><input id="f-stock" type="number" value="${startStock}" ${isEdit?'disabled':''}></div>
      <div class="gs-field"><label>Reorder level (this location)</label><input id="f-reorder" type="number" value="${startReorder}"></div>
      <div class="gs-field full"><label><input type="checkbox" id="f-taxable" ${product.taxable!==false?'checked':''}> Taxable item</label></div>
    </div>
    ${isEdit ? '<div class="gs-hint">Use "Adjust" from the product list to change stock quantity.</div>' : ''}
    <div class="gs-modal-actions">
      <button class="gs-btn gs-btn-ghost" id="f-cancel">Cancel</button>
      <button class="gs-btn gs-btn-primary" id="f-save">Save product</button>
    </div>
  </div>`;
  document.body.appendChild(back);
  back.addEventListener('click', e=>{ if(e.target===back) back.remove(); });
  back.querySelector('#f-cancel').addEventListener('click', ()=> back.remove());
  back.querySelector('#f-barcode-gen').addEventListener('click', ()=>{ back.querySelector('#f-barcode').value = GSBarcode.randomBarcode(); });
  back.querySelector('#f-barcode-scan').addEventListener('click', ()=>{
    GSBarcode.openScanModal('Scan this product\'s barcode', (code)=>{ back.querySelector('#f-barcode').value = code; });
  });
  back.querySelector('#f-margin').addEventListener('input', ()=>{
    const cost = parseFloat(back.querySelector('#f-cost').value)||0;
    const margin = parseFloat(back.querySelector('#f-margin').value);
    if(!isNaN(margin) && margin < 100){
      back.querySelector('#f-price').value = (cost / (1 - margin/100)).toFixed(2);
    }
  });
  back.querySelector('#f-save').addEventListener('click', ()=>{
    const name = back.querySelector('#f-name').value.trim();
    if(!name){ alert('Product name is required.'); return; }
    product.name = name;
    product.sku = back.querySelector('#f-sku').value.trim();
    product.barcode = back.querySelector('#f-barcode').value.trim();
    product.category = back.querySelector('#f-cat').value.trim();
    product.price = parseFloat(back.querySelector('#f-price').value)||0;
    product.cost = parseFloat(back.querySelector('#f-cost').value)||0;
    product.taxable = back.querySelector('#f-taxable').checked;
    if(!isEdit) state.products.push(product);
    const lvl = levelFor(product.id);
    if(!isEdit) lvl.stock = parseInt(back.querySelector('#f-stock').value)||0;
    lvl.reorder = parseInt(back.querySelector('#f-reorder').value)||0;
    persist('products'); persist('inventory'); back.remove(); renderContent();
  });
}

/* ================= ACCOUNTING (admin only) ================= */
function renderAccounting(c){
  const range = state.filters.accRange || 'all';
  const now = new Date();
  function inRange(dateStr){
    if(range==='all') return true;
    const d = new Date(dateStr);
    if(range==='week'){ const wk = new Date(now); wk.setDate(now.getDate()-7); return d>=wk; }
    if(range==='month'){ return d.getMonth()===now.getMonth() && d.getFullYear()===now.getFullYear(); }
    return true;
  }
  const txAll = state.transactions.filter(t=>inRange(t.date));
  const revenue = txAll.filter(t=>t.type==='income').reduce((s,x)=>s+x.amount,0);
  const expenses = txAll.filter(t=>t.type==='expense').reduce((s,x)=>s+x.amount,0);
  const netProfit = revenue - expenses;
  const list = [...txAll].sort((a,b)=> b.date.localeCompare(a.date));

  const byCat = {};
  txAll.filter(t=>t.type==='expense').forEach(t=>{ byCat[t.category] = (byCat[t.category]||0)+t.amount; });
  const catEntries = Object.entries(byCat).sort((a,b)=>b[1]-a[1]);
  const maxCat = catEntries.length ? catEntries[0][1] : 1;

  c.innerHTML = `
    <div class="gs-panel-head" style="border:none;padding:0 0 14px;">
      <div></div>
      <select class="gs-search" id="acc-range">
        <option value="all" ${range==='all'?'selected':''}>All time</option>
        <option value="month" ${range==='month'?'selected':''}>This month</option>
        <option value="week" ${range==='week'?'selected':''}>Last 7 days</option>
      </select>
    </div>
    <div class="gs-stats">
      <div class="gs-stat"><div class="lbl">Income</div><div class="val" style="color:var(--green)">${money(revenue)}</div></div>
      <div class="gs-stat"><div class="lbl">Expenses</div><div class="val" style="color:var(--rose)">${money(expenses)}</div></div>
      <div class="gs-stat"><div class="lbl">Net profit</div><div class="val">${money(netProfit)}</div></div>
    </div>

    ${ catEntries.length ? `<div class="gs-panel"><div class="gs-panel-head"><h3>Expense breakdown</h3></div><div class="gs-panel-body">
      ${catEntries.map(([cat,amt])=>`
        <div style="margin-bottom:10px;">
          <div style="display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:4px;"><span>${esc(cat)}</span><span style="color:var(--ink-soft)">${money(amt)}</span></div>
          <div style="background:#F0EBDA;border-radius:6px;height:8px;overflow:hidden;"><div style="background:var(--rose);height:100%;width:${(amt/maxCat*100).toFixed(0)}%;"></div></div>
        </div>`).join('')}
    </div></div>` : '' }

    <div class="gs-panel">
      <div class="gs-panel-head"><h3>Transactions</h3>
        <div class="gs-panel-head-actions">
          <button class="gs-btn gs-btn-ghost" id="tx-export">Export CSV</button>
          <button class="gs-btn gs-btn-gold" id="tx-add">+ Add expense</button>
        </div>
      </div>
      <div class="gs-panel-body" style="padding:0;">
        ${ list.length ? `<table class="gs-table"><thead><tr><th>Date</th><th>Category</th><th>Note</th><th>Type</th><th>Amount</th><th></th></tr></thead><tbody>
          ${list.map(t=>`<tr><td>${fmtDate(t.date)}</td><td>${esc(t.category)}</td><td>${esc(t.note||'')}</td>
            <td><span class="gs-badge ${t.type==='income'?'ok':'low'}">${t.type}</span></td>
            <td>${money(t.amount)}</td>
            <td class="gs-row-actions">${t.source ? '' : `<button class="gs-btn gs-btn-danger gs-btn-sm" data-del-tx="${t.id}">Delete</button>`}</td></tr>`).join('')}
        </tbody></table>` : `<div class="gs-empty"><b>No transactions yet</b>Sales you record automatically appear here.</div>` }
      </div>
    </div>
  `;
  document.getElementById('acc-range').addEventListener('change', e=>{ state.filters.accRange = e.target.value; renderAccounting(c); });
  document.getElementById('tx-export').addEventListener('click', ()=>{
    let csv = 'Date,Category,Note,Type,Amount\n';
    list.forEach(t=>{ csv += `${t.date},"${(t.category||'').replace(/"/g,'')}","${(t.note||'').replace(/"/g,'')}",${t.type},${t.amount}\n`; });
    const blob = new Blob([csv], {type:'text/csv'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'giftly-transactions.csv'; a.click();
  });
  document.getElementById('tx-add').addEventListener('click', ()=>{
    const back = document.createElement('div'); back.className='gs-modal-back';
    back.innerHTML = `<div class="gs-modal">
      <h3>Add expense</h3>
      <div class="gs-field"><label>Category</label><input id="tx-cat" placeholder="e.g. Rent, Utilities, Packaging"></div>
      <div class="gs-field"><label>Amount (Rs.)</label><input id="tx-amt" type="number"></div>
      <div class="gs-field"><label>Note (optional)</label><input id="tx-note"></div>
      <div class="gs-modal-actions">
        <button class="gs-btn gs-btn-ghost" id="tx-cancel">Cancel</button>
        <button class="gs-btn gs-btn-primary" id="tx-save">Save</button>
      </div></div>`;
    document.body.appendChild(back);
    back.addEventListener('click', e=>{ if(e.target===back) back.remove(); });
    back.querySelector('#tx-cancel').addEventListener('click', ()=> back.remove());
    back.querySelector('#tx-save').addEventListener('click', ()=>{
      const cat = back.querySelector('#tx-cat').value.trim();
      const amt = parseFloat(back.querySelector('#tx-amt').value)||0;
      if(!cat || amt<=0){ alert('Enter a category and amount.'); return; }
      state.transactions.push({id:uid(), date:todayStr(), type:'expense', category:cat, amount:amt, note:back.querySelector('#tx-note').value.trim()});
      persist('transactions'); back.remove(); renderContent();
    });
  });
  c.querySelectorAll('[data-del-tx]').forEach(b=> b.addEventListener('click', ()=>{
    state.transactions = state.transactions.filter(t=>t.id!==b.dataset.delTx);
    persist('transactions'); renderContent();
  }));
}

/* ================= CRM (customers + gift cards) ================= */
function renderCRM(c){
  const tabs = ['Customers','Gift Cards'];
  const activeTab = state.tab.crm || 'Customers';
  c.innerHTML = `<div class="gs-panel">
    <div class="gs-tabs">${tabs.map(t=>`<div class="gs-tab ${activeTab===t?'active':''}" data-crmtab="${t}">${t}</div>`).join('')}</div>
    <div id="crm-inner"></div>
  </div>`;
  c.querySelectorAll('[data-crmtab]').forEach(t=> t.addEventListener('click', ()=>{ state.tab.crm = t.dataset.crmtab; renderCRM(c); }));
  const inner = document.getElementById('crm-inner');
  if(activeTab === 'Customers') renderCustomersList(inner); else renderGiftCardsList(inner);
}
function renderCustomersList(inner){
  const q = (state.filters.crm||'').toLowerCase();
  const list = state.customers.filter(cu=> !q || cu.name.toLowerCase().includes(q) || (cu.phone||'').includes(q));
  inner.innerHTML = `
    <div class="gs-panel-head">
      <input class="gs-search" id="crm-search" placeholder="Search name or phone…" value="${esc(state.filters.crm||'')}">
      <button class="gs-btn gs-btn-gold" id="cu-add">+ Add customer</button>
    </div>
    <div class="gs-panel-body" style="padding:0;">
      ${ list.length ? `<table class="gs-table"><thead><tr><th>Name</th><th>Phone</th><th>Purchases</th><th>Total spent</th><th>Store credit</th><th>Loyalty pts</th><th></th></tr></thead><tbody>
        ${list.map(cu=>{
          const sales = activeSales().filter(s=>s.customerId===cu.id);
          const spent = sales.reduce((s,x)=>s+x.total,0);
          return `<tr><td><span class="gs-link" data-view-cu="${cu.id}">${esc(cu.name)}</span></td><td>${esc(cu.phone||'—')}</td><td>${sales.length}</td><td>${money(spent)}</td><td>${money(cu.storeCredit||0)}</td><td>${loyaltyPoints(cu.id)}</td>
            <td class="gs-row-actions">
              <button class="gs-btn gs-btn-ghost gs-btn-sm" data-edit-cu="${cu.id}">Edit</button>
              <button class="gs-btn gs-btn-danger gs-btn-sm" data-del-cu="${cu.id}">Delete</button>
            </td></tr>`;
        }).join('')}
      </tbody></table>` : `<div class="gs-empty"><b>${q?'No matching customers':'No customers yet'}</b>${q?'Try a different search.':'Add customers to track their purchase history.'}</div>` }
    </div>
  `;
  document.getElementById('crm-search').addEventListener('input', e=>{ state.filters.crm = e.target.value; renderContent(); });
  document.getElementById('cu-add').addEventListener('click', ()=> openCustomerModal(null));
  inner.querySelectorAll('[data-view-cu]').forEach(el=> el.addEventListener('click', ()=> openCustomerHistoryModal(state.customers.find(cu=>cu.id===el.dataset.viewCu))));
  inner.querySelectorAll('[data-edit-cu]').forEach(b=> b.addEventListener('click', ()=> openCustomerModal(state.customers.find(cu=>cu.id===b.dataset.editCu))));
  inner.querySelectorAll('[data-del-cu]').forEach(b=> b.addEventListener('click', ()=>{
    if(!confirm('Delete this customer?')) return;
    state.customers = state.customers.filter(cu=>cu.id!==b.dataset.delCu);
    persist('customers'); renderContent();
  }));
}
function renderGiftCardsList(inner){
  inner.innerHTML = `
    <div class="gs-panel-head">
      <div></div>
      <button class="gs-btn gs-btn-gold" id="gc-add">+ Issue gift card</button>
    </div>
    <div class="gs-panel-body" style="padding:0;">
      ${ state.giftCards.length ? `<table class="gs-table"><thead><tr><th>Code</th><th>Issued</th><th>Initial value</th><th>Balance</th><th>Status</th></tr></thead><tbody>
        ${[...state.giftCards].sort((a,b)=>b.issuedDate.localeCompare(a.issuedDate)).map(g=>`<tr><td><b>${esc(g.code)}</b></td><td>${fmtDate(g.issuedDate)}</td><td>${money(g.initialAmount)}</td><td>${money(g.balance)}</td><td><span class="gs-badge ${g.balance>0?'ok':'neutral'}">${g.balance>0?'Active':'Used up'}</span></td></tr>`).join('')}
      </tbody></table>` : `<div class="gs-empty"><b>No gift cards issued yet</b>Issue one for customers to use at checkout.</div>` }
    </div>
  `;
  document.getElementById('gc-add').addEventListener('click', ()=>{
    const back = document.createElement('div'); back.className='gs-modal-back';
    const code = randomCode('GC-', 8);
    back.innerHTML = `<div class="gs-modal">
      <h3>Issue gift card</h3>
      <div class="gs-field"><label>Code</label><input id="gc-code" value="${code}"></div>
      <div class="gs-field"><label>Value (Rs.)</label><input id="gc-amt" type="number" min="1" value="1000"></div>
      <div class="gs-hint" style="margin-bottom:10px;">This records the sale as income under "Gift Cards."</div>
      <div class="gs-modal-actions">
        <button class="gs-btn gs-btn-ghost" id="gc-cancel">Cancel</button>
        <button class="gs-btn gs-btn-primary" id="gc-save">Issue card</button>
      </div></div>`;
    document.body.appendChild(back);
    back.addEventListener('click', e=>{ if(e.target===back) back.remove(); });
    back.querySelector('#gc-cancel').addEventListener('click', ()=> back.remove());
    back.querySelector('#gc-save').addEventListener('click', ()=>{
      const codeVal = back.querySelector('#gc-code').value.trim().toUpperCase();
      const amt = parseFloat(back.querySelector('#gc-amt').value)||0;
      if(!codeVal || amt<=0){ alert('Enter a code and value.'); return; }
      if(state.giftCards.some(g=>g.code===codeVal)){ alert('That code is already in use.'); return; }
      state.giftCards.push({id:uid(), code:codeVal, initialAmount:amt, balance:amt, issuedDate:todayStr(), active:true});
      state.transactions.push({id:uid(), date:todayStr(), type:'income', category:'Gift Cards', amount:amt, note:`Gift card issued: ${codeVal}`});
      persist('giftCards'); persist('transactions'); back.remove(); renderContent();
    });
  });
}
function openCustomerHistoryModal(cu){
  const sales = activeSales().filter(s=>s.customerId===cu.id).sort((a,b)=>b.date.localeCompare(a.date));
  const spent = sales.reduce((s,x)=>s+x.total,0);
  const back = document.createElement('div'); back.className='gs-modal-back';
  back.innerHTML = `<div class="gs-modal">
    <h3>${esc(cu.name)}</h3>
    <div class="gs-hint" style="margin-bottom:10px;">${esc(cu.phone||'')} ${cu.email?'· '+esc(cu.email):''}</div>
    <div class="gs-stats" style="grid-template-columns:1fr 1fr 1fr;margin-bottom:14px;">
      <div class="gs-stat"><div class="lbl">Total spent</div><div class="val" style="font-size:18px;">${money(spent)}</div></div>
      <div class="gs-stat"><div class="lbl">Store credit</div><div class="val" style="font-size:18px;">${money(cu.storeCredit||0)}</div></div>
      <div class="gs-stat"><div class="lbl">Loyalty points</div><div class="val" style="font-size:18px;">${loyaltyPoints(cu.id)}</div></div>
    </div>
    ${ sales.length ? sales.map(s=>`<div class="gs-cart-line"><span>${fmtDate(s.date)} · ${s.items.length} item(s)</span><span>${money(s.total)}</span></div>`).join('') : '<div class="gs-hint">No purchases yet.</div>' }
    <div class="gs-modal-actions"><button class="gs-btn gs-btn-ghost" id="ch-close">Close</button></div>
  </div>`;
  document.body.appendChild(back);
  back.addEventListener('click', e=>{ if(e.target===back) back.remove(); });
  back.querySelector('#ch-close').addEventListener('click', ()=> back.remove());
}
function openCustomerModal(customer){
  const isEdit = !!customer;
  customer = customer || {id:uid(), name:'', phone:'', email:'', notes:'', storeCredit:0};
  const back = document.createElement('div'); back.className='gs-modal-back';
  back.innerHTML = `<div class="gs-modal">
    <h3>${isEdit?'Edit customer':'Add customer'}</h3>
    <div class="gs-field"><label>Name</label><input id="cu-name" value="${esc(customer.name)}"></div>
    <div class="gs-field"><label>Phone</label><input id="cu-phone" value="${esc(customer.phone)}"></div>
    <div class="gs-field"><label>Email</label><input id="cu-email" value="${esc(customer.email)}"></div>
    <div class="gs-field"><label>Store credit (Rs.)</label><input id="cu-credit" type="number" value="${customer.storeCredit||0}"></div>
    <div class="gs-field"><label>Notes</label><textarea id="cu-notes" rows="2">${esc(customer.notes||'')}</textarea></div>
    <div class="gs-modal-actions">
      <button class="gs-btn gs-btn-ghost" id="cu-cancel">Cancel</button>
      <button class="gs-btn gs-btn-primary" id="cu-save">Save</button>
    </div></div>`;
  document.body.appendChild(back);
  back.addEventListener('click', e=>{ if(e.target===back) back.remove(); });
  back.querySelector('#cu-cancel').addEventListener('click', ()=> back.remove());
  back.querySelector('#cu-save').addEventListener('click', ()=>{
    const name = back.querySelector('#cu-name').value.trim();
    if(!name){ alert('Name is required.'); return; }
    customer.name = name;
    customer.phone = back.querySelector('#cu-phone').value.trim();
    customer.email = back.querySelector('#cu-email').value.trim();
    customer.storeCredit = parseFloat(back.querySelector('#cu-credit').value)||0;
    customer.notes = back.querySelector('#cu-notes').value.trim();
    if(!isEdit) state.customers.push(customer);
    persist('customers'); back.remove(); renderContent();
  });
}

/* ================= HR & PAYROLL (admin only) ================= */
function renderHR(c){
  const tabs = ['Team & Payroll','Attendance'];
  const activeTab = state.tab.hr || 'Team & Payroll';
  c.innerHTML = `<div class="gs-panel">
    <div class="gs-tabs">${tabs.map(t=>`<div class="gs-tab ${activeTab===t?'active':''}" data-htab="${t}">${t}</div>`).join('')}</div>
    <div id="hr-inner"></div>
  </div>`;
  c.querySelectorAll('[data-htab]').forEach(t=> t.addEventListener('click', ()=>{ state.tab.hr = t.dataset.htab; renderHR(c); }));
  const inner = document.getElementById('hr-inner');
  if(activeTab==='Team & Payroll') renderTeamPayroll(inner); else renderAttendance(inner);
}
function renderTeamPayroll(inner){
  inner.innerHTML = `
    <div style="padding:14px 18px;display:flex;justify-content:flex-end;">
      <button class="gs-btn gs-btn-gold" id="hr-add">+ Add employee</button>
    </div>
    ${ state.employees.length ? `<table class="gs-table"><thead><tr><th>Name</th><th>Role</th><th>Basic salary</th><th>Net pay</th><th></th></tr></thead><tbody>
      ${state.employees.map(e=>{
        const net = e.basic - e.basic*0.08;
        return `<tr><td>${esc(e.name)}</td><td>${esc(e.role)}</td><td>${money(e.basic)}</td><td>${money(net)}</td>
          <td class="gs-row-actions">
            <button class="gs-btn gs-btn-ghost gs-btn-sm" data-payslip="${e.id}">Payslip</button>
            <button class="gs-btn gs-btn-ghost gs-btn-sm" data-edit-emp="${e.id}">Edit</button>
            <button class="gs-btn gs-btn-danger gs-btn-sm" data-del-emp="${e.id}">Delete</button>
          </td></tr>`;
      }).join('')}
    </tbody></table>
    <div class="gs-hint" style="padding:10px 18px 14px;">Employer cost includes 12% EPF + 3% ETF employer contributions, standard for Sri Lanka.</div>` : `<div class="gs-empty"><b>No employees yet</b>Add your team to calculate payroll.</div>` }
  `;
  document.getElementById('hr-add').addEventListener('click', ()=> openEmployeeModal(null));
  inner.querySelectorAll('[data-edit-emp]').forEach(b=> b.addEventListener('click', ()=> openEmployeeModal(state.employees.find(e=>e.id===b.dataset.editEmp))));
  inner.querySelectorAll('[data-payslip]').forEach(b=> b.addEventListener('click', ()=> openPayslipModal(state.employees.find(e=>e.id===b.dataset.payslip))));
  inner.querySelectorAll('[data-del-emp]').forEach(b=> b.addEventListener('click', ()=>{
    if(!confirm('Remove this employee?')) return;
    state.employees = state.employees.filter(e=>e.id!==b.dataset.delEmp);
    persist('employees'); renderContent();
  }));
}
function openPayslipModal(e){
  const epfEmp = e.basic*0.08, epfEmployer = e.basic*0.12, etfEmployer = e.basic*0.03;
  const net = e.basic - epfEmp, employerCost = e.basic + epfEmployer + etfEmployer;
  const back = document.createElement('div'); back.className='gs-modal-back';
  back.innerHTML = `<div class="gs-modal">
    <h3>Payslip — ${esc(e.name)}</h3>
    <div class="gs-receipt" id="payslip-print">
      <div class="center"><b>${esc(state.settings.shopName||'Giftly ERP')}</b><br>Payslip for ${new Date().toLocaleDateString('en-GB',{month:'long', year:'numeric'})}</div>
      <hr>
      <div class="line"><span>Employee</span><span>${esc(e.name)}</span></div>
      <div class="line"><span>Role</span><span>${esc(e.role)}</span></div>
      <hr>
      <div class="line"><span>Basic salary</span><span>${money(e.basic)}</span></div>
      <div class="line"><span>EPF (employee 8%)</span><span>-${money(epfEmp)}</span></div>
      <div class="line" style="font-weight:700;"><span>Net pay</span><span>${money(net)}</span></div>
      <hr>
      <div class="line"><span>EPF (employer 12%)</span><span>${money(epfEmployer)}</span></div>
      <div class="line"><span>ETF (employer 3%)</span><span>${money(etfEmployer)}</span></div>
      <div class="line" style="font-weight:700;"><span>Total employer cost</span><span>${money(employerCost)}</span></div>
    </div>
    <div class="gs-modal-actions">
      <button class="gs-btn gs-btn-ghost" id="ps-close">Close</button>
      <button class="gs-btn gs-btn-primary" id="ps-print">Print</button>
    </div></div>`;
  document.body.appendChild(back);
  back.addEventListener('click', ev=>{ if(ev.target===back) back.remove(); });
  back.querySelector('#ps-close').addEventListener('click', ()=> back.remove());
  back.querySelector('#ps-print').addEventListener('click', ()=>{
    const w = window.open('', '_blank', 'width=380,height=600');
    w.document.write(`<html><head><title>Payslip</title></head><body style="font-family:monospace;padding:16px;">${document.getElementById('payslip-print').innerHTML}</body></html>`);
    w.document.close(); w.print();
  });
}
function renderAttendance(inner){
  const today = todayStr();
  inner.innerHTML = `
    <div class="gs-panel-body">
      <div class="gs-hint" style="margin-bottom:10px;">Mark today's attendance (${fmtDate(today)}):</div>
      ${ state.employees.length ? state.employees.map(e=>{
        const rec = state.attendance.find(a=>a.employeeId===e.id && a.date===today);
        const status = rec ? rec.status : null;
        return `<div style="display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid #F0EBDA;">
          <span style="font-size:13px;">${esc(e.name)}</span>
          <div class="gs-att-grid">
            <button class="gs-att-btn ${status==='Present'?'active-present':''}" data-att="${e.id}|Present">Present</button>
            <button class="gs-att-btn ${status==='Absent'?'active-absent':''}" data-att="${e.id}|Absent">Absent</button>
            <button class="gs-att-btn ${status==='Leave'?'active-leave':''}" data-att="${e.id}|Leave">Leave</button>
          </div>
        </div>`;
      }).join('') : '<div class="gs-empty"><b>No employees yet</b>Add your team on the Team & Payroll tab.</div>' }
    </div>
  `;
  inner.querySelectorAll('[data-att]').forEach(b=> b.addEventListener('click', ()=>{
    const [empId, status] = b.dataset.att.split('|');
    const existing = state.attendance.find(a=>a.employeeId===empId && a.date===today);
    if(existing) existing.status = status; else state.attendance.push({id:uid(), employeeId:empId, date:today, status});
    persist('attendance'); renderAttendance(inner);
  }));
}
function openEmployeeModal(emp){
  const isEdit = !!emp;
  emp = emp || {id:uid(), name:'', role:'', basic:''};
  const back = document.createElement('div'); back.className='gs-modal-back';
  back.innerHTML = `<div class="gs-modal">
    <h3>${isEdit?'Edit employee':'Add employee'}</h3>
    <div class="gs-field"><label>Name</label><input id="emp-name" value="${esc(emp.name)}"></div>
    <div class="gs-field"><label>Role</label><input id="emp-role" value="${esc(emp.role)}"></div>
    <div class="gs-field"><label>Basic salary (Rs./month)</label><input id="emp-basic" type="number" value="${emp.basic}"></div>
    <div class="gs-modal-actions">
      <button class="gs-btn gs-btn-ghost" id="emp-cancel">Cancel</button>
      <button class="gs-btn gs-btn-primary" id="emp-save">Save</button>
    </div></div>`;
  document.body.appendChild(back);
  back.addEventListener('click', e=>{ if(e.target===back) back.remove(); });
  back.querySelector('#emp-cancel').addEventListener('click', ()=> back.remove());
  back.querySelector('#emp-save').addEventListener('click', ()=>{
    const name = back.querySelector('#emp-name').value.trim();
    if(!name){ alert('Name is required.'); return; }
    emp.name = name;
    emp.role = back.querySelector('#emp-role').value.trim();
    emp.basic = parseFloat(back.querySelector('#emp-basic').value)||0;
    if(!isEdit) state.employees.push(emp);
    persist('employees'); back.remove(); renderContent();
  });
}

/* ================= PURCHASING / PROCUREMENT ================= */
function renderPurchasing(c){
  const tabs = ['Purchase Orders','Suppliers','Returns to Supplier'];
  const activeTab = state.tab.purchasing || 'Purchase Orders';
  c.innerHTML = `
    <div class="gs-panel">
      <div class="gs-tabs">${tabs.map(t=>`<div class="gs-tab ${activeTab===t?'active':''}" data-ptab="${t}">${t}</div>`).join('')}</div>
      <div class="gs-panel-body" style="padding:0;" id="purchasing-inner"></div>
    </div>
  `;
  c.querySelectorAll('[data-ptab]').forEach(t=> t.addEventListener('click', ()=>{ state.tab.purchasing = t.dataset.ptab; renderPurchasing(c); }));
  const inner = document.getElementById('purchasing-inner');
  if(activeTab === 'Purchase Orders') renderPOList(inner);
  else if(activeTab === 'Suppliers') renderSuppliersList(inner);
  else renderSupplierReturns(inner);
}

function renderPOList(inner){
  inner.innerHTML = `
    <div style="padding:14px 18px;display:flex;justify-content:flex-end;">
      <button class="gs-btn gs-btn-gold" id="po-add">+ New purchase order</button>
    </div>
    ${ state.purchases.length ? `<table class="gs-table"><thead><tr><th>Date</th><th>Supplier</th><th>Location</th><th>Items</th><th>Cost total</th><th>Status</th><th>Payment</th><th></th></tr></thead><tbody>
      ${[...state.purchases].sort((a,b)=>b.date.localeCompare(a.date)).map(po=>{
        const sup = state.suppliers.find(s=>s.id===po.supplierId);
        const loc = state.locations.find(l=>l.id===po.locationId);
        const paid = po.paymentStatus==='Paid';
        const fullyReceived = po.status==='Received';
        return `<tr><td>${fmtDate(po.date)}</td><td>${sup?esc(sup.name):'—'}</td><td>${loc?esc(loc.name):'—'}</td><td>${po.items.length}</td><td>${money(po.total)}</td>
          <td><span class="gs-badge ${fullyReceived?'ok':(po.status==='Partially Received'?'gold':'neutral')}">${po.status||'Ordered'}</span></td>
          <td><span class="gs-badge ${paid?'ok':'low'}">${po.paymentStatus||'Unpaid'}</span></td>
          <td class="gs-row-actions">
            ${!fullyReceived ? `<button class="gs-btn gs-btn-gold gs-btn-sm" data-receive="${po.id}">Receive stock</button>` : ''}
            ${!paid ? `<button class="gs-btn gs-btn-ghost gs-btn-sm" data-mark-paid="${po.id}">Mark paid</button>` : ''}
            <button class="gs-btn gs-btn-danger gs-btn-sm" data-del-po="${po.id}">Delete</button>
          </td></tr>`;
      }).join('')}
    </tbody></table>` : `<div class="gs-empty"><b>No purchase orders yet</b>Create one to restock inventory from a supplier.</div>` }
  `;
  document.getElementById('po-add').addEventListener('click', openPOModal);
  inner.querySelectorAll('[data-receive]').forEach(b=> b.addEventListener('click', ()=> openReceiveModal(state.purchases.find(p=>p.id===b.dataset.receive))));
  inner.querySelectorAll('[data-mark-paid]').forEach(b=> b.addEventListener('click', ()=>{
    const po = state.purchases.find(p=>p.id===b.dataset.markPaid);
    po.paymentStatus = 'Paid';
    state.transactions.push({id:uid(), date:todayStr(), type:'expense', category:'Purchasing', amount:po.total, note:`PO payment #${po.id.slice(0,5)}`, source:'purchase', refId:po.id});
    persist('purchases'); persist('transactions'); renderContent();
  }));
  inner.querySelectorAll('[data-del-po]').forEach(b=> b.addEventListener('click', ()=>{
    if(!confirm('Delete this purchase order?')) return;
    state.purchases = state.purchases.filter(po=>po.id!==b.dataset.delPo);
    persist('purchases'); renderContent();
  }));
}

function openReceiveModal(po){
  const sup = state.suppliers.find(s=>s.id===po.supplierId);
  const back = document.createElement('div'); back.className='gs-modal-back';
  back.innerHTML = `<div class="gs-modal wide">
    <h3>Receive stock — ${sup?esc(sup.name):''}</h3>
    <div class="gs-hint" style="margin-bottom:10px;">Enter how many units actually arrived for each line. Partial quantities are fine — remaining units stay "Ordered" for next time.</div>
    <table class="gs-table"><thead><tr><th>Product</th><th>Ordered</th><th>Already received</th><th>Receiving now</th></tr></thead><tbody>
      ${po.items.map((l,idx)=>{
        const p = state.products.find(pp=>pp.id===l.productId);
        const remaining = l.qty - (l.receivedQty||0);
        return `<tr><td>${p?esc(p.name):'—'}</td><td>${l.qty}</td><td>${l.receivedQty||0}</td><td><input type="number" class="gs-rcv-qty" data-idx="${idx}" min="0" max="${remaining}" value="${remaining}" style="width:80px;"></td></tr>`;
      }).join('')}
    </tbody></table>
    <div class="gs-modal-actions">
      <button class="gs-btn gs-btn-ghost" id="rcv-cancel">Cancel</button>
      <button class="gs-btn gs-btn-primary" id="rcv-save">Confirm receipt</button>
    </div></div>`;
  document.body.appendChild(back);
  back.addEventListener('click', e=>{ if(e.target===back) back.remove(); });
  back.querySelector('#rcv-cancel').addEventListener('click', ()=> back.remove());
  back.querySelector('#rcv-save').addEventListener('click', ()=>{
    let anyReceived = false, allComplete = true;
    back.querySelectorAll('.gs-rcv-qty').forEach(input=>{
      const idx = parseInt(input.dataset.idx);
      const line = po.items[idx];
      const remaining = line.qty - (line.receivedQty||0);
      const qtyNow = Math.min(remaining, Math.max(0, parseInt(input.value)||0));
      if(qtyNow > 0){
        adjustStock(line.productId, po.locationId, qtyNow);
        const p = state.products.find(pp=>pp.id===line.productId);
        if(p){ p.cost = line.cost; }
        line.receivedQty = (line.receivedQty||0) + qtyNow;
        anyReceived = true;
      }
      if(line.receivedQty < line.qty) allComplete = false;
    });
    if(!anyReceived){ alert('Enter at least one quantity to receive.'); return; }
    po.status = allComplete ? 'Received' : 'Partially Received';
    persist('purchases'); persist('products'); back.remove(); renderContent();
  });
}

let poCart = [];
function openPOModal(){
  poCart = [];
  const back = document.createElement('div'); back.className='gs-modal-back';
  back.innerHTML = `<div class="gs-modal">
    <h3>New purchase order</h3>
    <div class="gs-form-grid">
      <div class="gs-field"><label>Supplier</label>
        <select id="po-supplier"><option value="">Select supplier…</option>
          ${state.suppliers.map(s=>`<option value="${s.id}">${esc(s.name)}${s.leadTimeDays?` (${s.leadTimeDays}d lead time)`:''}</option>`).join('')}
        </select>
      </div>
      <div class="gs-field"><label>Receiving location</label>
        <select id="po-location">${state.locations.map(l=>`<option value="${l.id}" ${l.id===state.currentLocationId?'selected':''}>${esc(l.name)}</option>`).join('')}</select>
      </div>
    </div>
    <div class="gs-field"><label>Product</label>
      <select id="po-product"><option value="">Select product…</option>
        ${state.products.map(p=>`<option value="${p.id}">${esc(p.name)} (current cost ${money(p.cost)})</option>`).join('')}
      </select>
    </div>
    <div style="display:flex;gap:10px;align-items:end;">
      <div class="gs-field" style="flex:1;"><label>Quantity</label><input type="number" id="po-qty" min="1" value="1"></div>
      <div class="gs-field" style="flex:1;"><label>Unit cost (Rs.)</label><input type="number" id="po-cost" min="0" step="0.01"></div>
      <button class="gs-btn gs-btn-ghost" id="po-add-line" style="height:38px;">Add item</button>
    </div>
    <div id="po-lines" style="margin:10px 0;"></div>
    <div class="gs-field">
      <label>Payment status</label>
      <div class="gs-radio-row">
        <label><input type="radio" name="po-pay" value="Unpaid" checked> Unpaid</label>
        <label><input type="radio" name="po-pay" value="Paid"> Paid now</label>
      </div>
    </div>
    <div class="gs-hint">Stock is only added once you "Receive stock" on the order — partial deliveries are supported.</div>
    <div class="gs-modal-actions">
      <button class="gs-btn gs-btn-ghost" id="po-cancel">Cancel</button>
      <button class="gs-btn gs-btn-primary" id="po-save">Save purchase order</button>
    </div></div>`;
  document.body.appendChild(back);

  back.querySelector('#po-product').addEventListener('change', e=>{
    const p = state.products.find(pp=>pp.id===e.target.value);
    if(p) back.querySelector('#po-cost').value = p.cost;
  });

  const renderLines = ()=>{
    const el = back.querySelector('#po-lines');
    if(poCart.length===0){ el.innerHTML = '<div class="gs-hint">No items added yet.</div>'; return; }
    const total = poCart.reduce((s,l)=>s+l.qty*l.cost,0);
    el.innerHTML = poCart.map(l=>{
      const p = state.products.find(pp=>pp.id===l.productId);
      return `<div class="gs-cart-line"><span>${p?esc(p.name):'—'} × ${l.qty} @ ${money(l.cost)}</span><span>${money(l.qty*l.cost)}</span></div>`;
    }).join('') + `<div class="gs-cart-total"><span>Total</span><span>${money(total)}</span></div>`;
  };
  back.addEventListener('click', e=>{ if(e.target===back) back.remove(); });
  back.querySelector('#po-cancel').addEventListener('click', ()=> back.remove());
  back.querySelector('#po-add-line').addEventListener('click', ()=>{
    const pid = back.querySelector('#po-product').value;
    const qty = parseInt(back.querySelector('#po-qty').value)||1;
    const cost = parseFloat(back.querySelector('#po-cost').value);
    const p = state.products.find(pp=>pp.id===pid);
    if(!p){ alert('Choose a product.'); return; }
    const unitCost = isNaN(cost) ? p.cost : cost;
    const existing = poCart.find(l=>l.productId===pid);
    if(existing){ existing.qty += qty; existing.cost = unitCost; } else poCart.push({productId:pid, qty, cost:unitCost, receivedQty:0});
    renderLines();
  });
  back.querySelector('#po-save').addEventListener('click', ()=>{
    const supId = back.querySelector('#po-supplier').value;
    const locId = back.querySelector('#po-location').value;
    if(!supId){ alert('Select a supplier.'); return; }
    if(poCart.length===0){ alert('Add at least one item.'); return; }
    const total = poCart.reduce((s,l)=>s+l.qty*l.cost,0);
    const payStatus = back.querySelector('input[name="po-pay"]:checked').value;
    const po = { id:uid(), date:todayStr(), supplierId:supId, locationId:locId, items:poCart.map(l=>({...l})), total, status:'Ordered', paymentStatus:payStatus };
    state.purchases.push(po);
    if(payStatus === 'Paid'){
      state.transactions.push({id:uid(), date:todayStr(), type:'expense', category:'Purchasing', amount:total, note:`PO payment #${po.id.slice(0,5)}`, source:'purchase', refId:po.id});
      persist('transactions');
    }
    persist('purchases'); back.remove(); renderContent();
  });
  renderLines();
}

function renderSuppliersList(inner){
  inner.innerHTML = `
    <div style="padding:14px 18px;display:flex;justify-content:flex-end;">
      <button class="gs-btn gs-btn-gold" id="sup-add">+ Add supplier</button>
    </div>
    ${ state.suppliers.length ? `<table class="gs-table"><thead><tr><th>Supplier</th><th>Phone</th><th>Email</th><th>Lead time</th><th>Orders</th><th></th></tr></thead><tbody>
      ${state.suppliers.map(s=>{
        const orders = state.purchases.filter(po=>po.supplierId===s.id);
        return `<tr><td>${esc(s.name)}</td><td>${esc(s.phone||'—')}</td><td>${esc(s.email||'—')}</td><td>${s.leadTimeDays?s.leadTimeDays+' days':'—'}</td><td>${orders.length}</td>
          <td class="gs-row-actions">
            <button class="gs-btn gs-btn-ghost gs-btn-sm" data-edit-sup="${s.id}">Edit</button>
            <button class="gs-btn gs-btn-danger gs-btn-sm" data-del-sup="${s.id}">Delete</button>
          </td></tr>`;
      }).join('')}
    </tbody></table>` : `<div class="gs-empty"><b>No suppliers yet</b>Add a supplier to start creating purchase orders.</div>` }
  `;
  document.getElementById('sup-add').addEventListener('click', ()=> openSupplierModal(null));
  inner.querySelectorAll('[data-edit-sup]').forEach(b=> b.addEventListener('click', ()=> openSupplierModal(state.suppliers.find(s=>s.id===b.dataset.editSup))));
  inner.querySelectorAll('[data-del-sup]').forEach(b=> b.addEventListener('click', ()=>{
    if(!confirm('Delete this supplier?')) return;
    state.suppliers = state.suppliers.filter(s=>s.id!==b.dataset.delSup);
    persist('suppliers'); renderContent();
  }));
}
function openSupplierModal(supplier){
  const isEdit = !!supplier;
  supplier = supplier || {id:uid(), name:'', phone:'', email:'', leadTimeDays:''};
  const back = document.createElement('div'); back.className='gs-modal-back';
  back.innerHTML = `<div class="gs-modal">
    <h3>${isEdit?'Edit supplier':'Add supplier'}</h3>
    <div class="gs-field"><label>Supplier name</label><input id="sup-name" value="${esc(supplier.name)}"></div>
    <div class="gs-field"><label>Phone</label><input id="sup-phone" value="${esc(supplier.phone)}"></div>
    <div class="gs-field"><label>Email</label><input id="sup-email" value="${esc(supplier.email)}"></div>
    <div class="gs-field"><label>Typical lead time (days)</label><input id="sup-lead" type="number" value="${supplier.leadTimeDays||''}"></div>
    <div class="gs-modal-actions">
      <button class="gs-btn gs-btn-ghost" id="sup-cancel">Cancel</button>
      <button class="gs-btn gs-btn-primary" id="sup-save">Save</button>
    </div></div>`;
  document.body.appendChild(back);
  back.addEventListener('click', e=>{ if(e.target===back) back.remove(); });
  back.querySelector('#sup-cancel').addEventListener('click', ()=> back.remove());
  back.querySelector('#sup-save').addEventListener('click', ()=>{
    const name = back.querySelector('#sup-name').value.trim();
    if(!name){ alert('Supplier name is required.'); return; }
    supplier.name = name;
    supplier.phone = back.querySelector('#sup-phone').value.trim();
    supplier.email = back.querySelector('#sup-email').value.trim();
    supplier.leadTimeDays = parseInt(back.querySelector('#sup-lead').value)||0;
    if(!isEdit) state.suppliers.push(supplier);
    persist('suppliers'); back.remove(); renderContent();
  });
}
function renderSupplierReturns(inner){
  inner.innerHTML = `
    <div style="padding:14px 18px;display:flex;justify-content:flex-end;">
      <button class="gs-btn gs-btn-gold" id="sr-add">+ New return</button>
    </div>
    ${ state.supplierReturns.length ? `<table class="gs-table"><thead><tr><th>Date</th><th>Supplier</th><th>Product</th><th>Qty</th><th>Reason</th><th>Status</th><th></th></tr></thead><tbody>
      ${[...state.supplierReturns].sort((a,b)=>b.date.localeCompare(a.date)).map(r=>{
        const sup = state.suppliers.find(s=>s.id===r.supplierId);
        const p = state.products.find(pp=>pp.id===r.productId);
        return `<tr><td>${fmtDate(r.date)}</td><td>${sup?esc(sup.name):'—'}</td><td>${p?esc(p.name):'—'}</td><td>${r.qty}</td><td>${esc(r.reason)}</td>
          <td><span class="gs-badge ${r.refunded?'ok':'neutral'}">${r.refunded?'Refunded':'Pending'}</span></td>
          <td class="gs-row-actions">${!r.refunded && r.expectedRefund ? `<button class="gs-btn gs-btn-ghost gs-btn-sm" data-mark-refunded="${r.id}">Mark refunded</button>` : ''}</td></tr>`;
      }).join('')}
    </tbody></table>` : `<div class="gs-empty"><b>No supplier returns yet</b>Log damaged or unwanted stock sent back to a supplier here.</div>` }
  `;
  document.getElementById('sr-add').addEventListener('click', ()=>{
    const back = document.createElement('div'); back.className='gs-modal-back';
    back.innerHTML = `<div class="gs-modal">
      <h3>Return stock to supplier</h3>
      <div class="gs-field"><label>Supplier</label><select id="sr-supplier"><option value="">Select…</option>${state.suppliers.map(s=>`<option value="${s.id}">${esc(s.name)}</option>`).join('')}</select></div>
      <div class="gs-field"><label>Product</label><select id="sr-product"><option value="">Select…</option>${state.products.map(p=>`<option value="${p.id}">${esc(p.name)} (${stockOf(p.id)} in stock)</option>`).join('')}</select></div>
      <div class="gs-field"><label>Quantity</label><input type="number" id="sr-qty" min="1" value="1"></div>
      <div class="gs-field"><label>Reason</label><select id="sr-reason"><option>Damaged on arrival</option><option>Wrong item shipped</option><option>Overstock</option><option>Other</option></select></div>
      <div class="gs-field"><label>Expected refund amount (Rs., optional)</label><input type="number" id="sr-refund" min="0"></div>
      <div class="gs-modal-actions">
        <button class="gs-btn gs-btn-ghost" id="sr-cancel">Cancel</button>
        <button class="gs-btn gs-btn-primary" id="sr-save">Log return</button>
      </div></div>`;
    document.body.appendChild(back);
    back.addEventListener('click', e=>{ if(e.target===back) back.remove(); });
    back.querySelector('#sr-cancel').addEventListener('click', ()=> back.remove());
    back.querySelector('#sr-save').addEventListener('click', ()=>{
      const supId = back.querySelector('#sr-supplier').value;
      const pid = back.querySelector('#sr-product').value;
      const qty = parseInt(back.querySelector('#sr-qty').value)||0;
      if(!supId || !pid || qty<=0){ alert('Fill in supplier, product and quantity.'); return; }
      if(qty > stockOf(pid)){ alert('Cannot return more than current stock.'); return; }
      const refundAmt = parseFloat(back.querySelector('#sr-refund').value)||0;
      adjustStock(pid, state.currentLocationId, -qty);
      state.supplierReturns.push({id:uid(), date:todayStr(), supplierId:supId, productId:pid, qty, reason:back.querySelector('#sr-reason').value, expectedRefund:refundAmt, refunded:false});
      persist('supplierReturns'); back.remove(); renderContent();
    });
  });
  inner.querySelectorAll('[data-mark-refunded]').forEach(b=> b.addEventListener('click', ()=>{
    const r = state.supplierReturns.find(x=>x.id===b.dataset.markRefunded);
    r.refunded = true;
    state.transactions.push({id:uid(), date:todayStr(), type:'income', category:'Supplier Returns', amount:r.expectedRefund, note:`Refund for return #${r.id.slice(0,5)}`});
    persist('supplierReturns'); persist('transactions'); renderContent();
  }));
}

/* ================= PROMOTIONS (admin only) ================= */
function renderPromotions(c){
  c.innerHTML = `
    <div class="gs-panel">
      <div class="gs-panel-head"><h3>Discount codes (${state.promotions.length})</h3><button class="gs-btn gs-btn-gold" id="promo-add">+ New promo code</button></div>
      <div class="gs-panel-body" style="padding:0;">
        ${ state.promotions.length ? `<table class="gs-table"><thead><tr><th>Code</th><th>Type</th><th>Value</th><th>Min spend</th><th>Expiry</th><th>Status</th><th></th></tr></thead><tbody>
          ${state.promotions.map(p=>`<tr><td><b>${esc(p.code)}</b></td><td>${p.type==='percent'?'Percent':'Fixed amount'}</td><td>${p.type==='percent'?p.value+'%':money(p.value)}</td><td>${p.minSpend?money(p.minSpend):'—'}</td><td>${p.expiry?fmtDate(p.expiry):'No expiry'}</td>
            <td><span class="gs-badge ${p.active?'ok':'neutral'}">${p.active?'Active':'Disabled'}</span></td>
            <td class="gs-row-actions">
              <button class="gs-btn gs-btn-ghost gs-btn-sm" data-toggle-promo="${p.id}">${p.active?'Disable':'Enable'}</button>
              <button class="gs-btn gs-btn-danger gs-btn-sm" data-del-promo="${p.id}">Delete</button>
            </td></tr>`).join('')}
        </tbody></table>` : `<div class="gs-empty"><b>No promo codes yet</b>Create one for customers to use at checkout.</div>` }
      </div>
    </div>
  `;
  document.getElementById('promo-add').addEventListener('click', ()=>{
    const back = document.createElement('div'); back.className='gs-modal-back';
    back.innerHTML = `<div class="gs-modal">
      <h3>New promo code</h3>
      <div class="gs-field"><label>Code</label><input id="pr-code" placeholder="e.g. SAVE10" value="${randomCode('',6)}"></div>
      <div class="gs-field"><label>Type</label>
        <div class="gs-radio-row"><label><input type="radio" name="pr-type" value="percent" checked> Percent off</label><label><input type="radio" name="pr-type" value="fixed"> Fixed amount off</label></div>
      </div>
      <div class="gs-field"><label>Value</label><input id="pr-value" type="number" min="0" value="10"></div>
      <div class="gs-field"><label>Minimum spend (Rs., optional)</label><input id="pr-min" type="number" min="0"></div>
      <div class="gs-field"><label>Expiry date (optional)</label><input id="pr-expiry" type="date"></div>
      <div class="gs-modal-actions">
        <button class="gs-btn gs-btn-ghost" id="pr-cancel">Cancel</button>
        <button class="gs-btn gs-btn-primary" id="pr-save">Save</button>
      </div></div>`;
    document.body.appendChild(back);
    back.addEventListener('click', e=>{ if(e.target===back) back.remove(); });
    back.querySelector('#pr-cancel').addEventListener('click', ()=> back.remove());
    back.querySelector('#pr-save').addEventListener('click', ()=>{
      const code = back.querySelector('#pr-code').value.trim().toUpperCase();
      if(!code){ alert('Enter a code.'); return; }
      if(state.promotions.some(p=>p.code===code)){ alert('That code already exists.'); return; }
      state.promotions.push({
        id:uid(), code, type: back.querySelector('input[name="pr-type"]:checked').value,
        value: parseFloat(back.querySelector('#pr-value').value)||0,
        minSpend: parseFloat(back.querySelector('#pr-min').value)||0,
        expiry: back.querySelector('#pr-expiry').value || null, active:true
      });
      persist('promotions'); back.remove(); renderContent();
    });
  });
  c.querySelectorAll('[data-toggle-promo]').forEach(b=> b.addEventListener('click', ()=>{
    const p = state.promotions.find(x=>x.id===b.dataset.togglePromo); p.active = !p.active; persist('promotions'); renderContent();
  }));
  c.querySelectorAll('[data-del-promo]').forEach(b=> b.addEventListener('click', ()=>{
    if(!confirm('Delete this promo code?')) return;
    state.promotions = state.promotions.filter(p=>p.id!==b.dataset.delPromo);
    persist('promotions'); renderContent();
  }));
}

/* ================= SETTINGS (admin only) ================= */
function renderSettings(c){
  const tabs = ['General','Locations','Tax','Data'];
  const activeTab = state.tab.settings || 'General';
  c.innerHTML = `<div class="gs-tabs" style="padding-left:0;border-bottom:none;margin-bottom:14px;">${tabs.map(t=>`<div class="gs-tab ${activeTab===t?'active':''}" data-stab="${t}">${t}</div>`).join('')}</div><div id="settings-inner"></div>`;
  c.querySelectorAll('[data-stab]').forEach(t=> t.addEventListener('click', ()=>{ state.tab.settings = t.dataset.stab; renderSettings(c); }));
  const inner = document.getElementById('settings-inner');
  if(activeTab==='General') renderGeneralSettings(inner);
  else if(activeTab==='Locations') renderLocationSettings(inner);
  else if(activeTab==='Tax') renderTaxSettings(inner);
  else renderDataSettings(inner);
}
function renderGeneralSettings(inner){
  inner.innerHTML = `
    <div class="gs-panel">
      <div class="gs-panel-head"><h3>Shop details</h3></div>
      <div class="gs-panel-body">
        <div class="gs-field"><label>Shop name</label><input id="st-name" value="${esc(state.settings.shopName||'')}"></div>
        <button class="gs-btn gs-btn-primary" id="st-save">Save</button>
      </div>
    </div>`;
  document.getElementById('st-save').addEventListener('click', ()=>{
    state.settings.shopName = document.getElementById('st-name').value.trim() || 'Giftly ERP';
    persist('settings'); renderShell(); alert('Saved.');
  });
}
function renderLocationSettings(inner){
  inner.innerHTML = `
    <div class="gs-panel">
      <div class="gs-panel-head"><h3>Locations / branches (${state.locations.length})</h3><button class="gs-btn gs-btn-gold" id="loc-add">+ Add location</button></div>
      <div class="gs-panel-body" style="padding:0;">
        <table class="gs-table"><thead><tr><th>Name</th><th>Products tracked</th><th></th></tr></thead><tbody>
          ${state.locations.map(l=>{
            const count = state.inventory.filter(i=>i.locationId===l.id && i.stock>0).length;
            return `<tr><td>${esc(l.name)}</td><td>${count}</td><td class="gs-row-actions">
              <button class="gs-btn gs-btn-ghost gs-btn-sm" data-edit-loc="${l.id}">Rename</button>
              ${state.locations.length>1 ? `<button class="gs-btn gs-btn-danger gs-btn-sm" data-del-loc="${l.id}">Delete</button>` : ''}
            </td></tr>`;
          }).join('')}
        </tbody></table>
      </div>
    </div>
    <div class="gs-hint">Each location keeps its own stock counts and reorder levels for every product. Switch between locations using the dropdown at the top right of the screen.</div>
  `;
  document.getElementById('loc-add').addEventListener('click', ()=>{
    const name = prompt('New location name (e.g. "Kandy Branch"):');
    if(!name) return;
    state.locations.push({id:'loc-'+uid(), name: name.trim()});
    persist('locations'); renderContent();
  });
  inner.querySelectorAll('[data-edit-loc]').forEach(b=> b.addEventListener('click', ()=>{
    const loc = state.locations.find(l=>l.id===b.dataset.editLoc);
    const name = prompt('Rename location:', loc.name);
    if(!name) return;
    loc.name = name.trim(); persist('locations'); renderShell(); renderContent();
  }));
  inner.querySelectorAll('[data-del-loc]').forEach(b=> b.addEventListener('click', ()=>{
    if(!confirm('Delete this location? Its stock records will be removed.')) return;
    const locId = b.dataset.delLoc;
    state.locations = state.locations.filter(l=>l.id!==locId);
    state.inventory = state.inventory.filter(i=>i.locationId!==locId);
    if(state.currentLocationId === locId){ state.currentLocationId = state.locations[0].id; localStorage.setItem('giftly_current_location', state.currentLocationId); }
    persist('locations'); persist('inventory'); renderShell(); renderContent();
  }));
}
function renderTaxSettings(inner){
  inner.innerHTML = `
    <div class="gs-panel">
      <div class="gs-panel-head"><h3>Tax on sales</h3></div>
      <div class="gs-panel-body">
        <div class="gs-field"><label><input type="checkbox" id="tx-enabled" ${state.settings.taxEnabled?'checked':''}> Apply tax to sales and receipts</label></div>
        <div class="gs-form-grid">
          <div class="gs-field"><label>VAT %</label><input id="tx-vat" type="number" step="0.1" value="${state.settings.vatPercent||0}"></div>
          <div class="gs-field"><label>NBT %</label><input id="tx-nbt" type="number" step="0.1" value="${state.settings.nbtPercent||0}"></div>
        </div>
        <div class="gs-hint" style="margin-bottom:10px;">Tax only applies to products marked "Taxable" in Inventory. Set both to 0 if you don't collect tax.</div>
        <button class="gs-btn gs-btn-primary" id="tx-save">Save</button>
      </div>
    </div>`;
  document.getElementById('tx-save').addEventListener('click', ()=>{
    state.settings.taxEnabled = document.getElementById('tx-enabled').checked;
    state.settings.vatPercent = parseFloat(document.getElementById('tx-vat').value)||0;
    state.settings.nbtPercent = parseFloat(document.getElementById('tx-nbt').value)||0;
    persist('settings'); alert('Saved.');
  });
}
function renderDataSettings(inner){
  inner.innerHTML = `
    <div class="gs-panel">
      <div class="gs-panel-head"><h3>Data</h3></div>
      <div class="gs-panel-body">
        <div class="gs-hint" style="margin-bottom:10px;">All data is stored in this browser's local storage on this device only.</div>
        <div class="gs-row-actions">
          <button class="gs-btn gs-btn-ghost" id="st-export">Export all data (JSON)</button>
          <button class="gs-btn gs-btn-danger" id="st-reset">Reset all data</button>
        </div>
      </div>
    </div>`;
  document.getElementById('st-export').addEventListener('click', ()=>{
    const dump = {};
    Object.keys(STORE_MAP).forEach(k => dump[k] = state[k]);
    const blob = new Blob([JSON.stringify(dump, null, 2)], {type:'application/json'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'giftly-backup.json'; a.click();
  });
  document.getElementById('st-reset').addEventListener('click', ()=>{
    if(!confirm('This will erase all products, sales, customers and records on this device. Continue?')) return;
    Object.values(STORE_MAP).forEach(k => localStorage.removeItem(k));
    localStorage.removeItem('giftly_current_location');
    location.reload();
  });
}

/* ================= GLOBAL KEYBOARD SHORTCUTS ================= */
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape'){
    const back = document.querySelector('.gs-modal-back');
    if(back){ back.remove(); return; }
  }
  if(state.active !== 'sales') return;
  if(e.key === 'F2'){ const el = document.getElementById('pos-product'); if(el){ e.preventDefault(); el.focus(); } }
  if(e.key === 'F9'){ const btn = document.getElementById('pos-checkout'); if(btn){ e.preventDefault(); btn.click(); } }
});

/* ================= PWA registration ================= */
if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('sw.js').catch(()=>{ /* not available over file:// — fine */ });
  });
}

/* ================= BOOTSTRAP ================= */
function startApp(){
  document.getElementById('gs-app').style.display = 'flex';
  loadAll();
  renderShell();
  renderContent();
}

document.addEventListener('DOMContentLoaded', () => {
  const settingsPreview = storeGet('settings', {shopName:'Giftly ERP'});
  const me = GSAuth.currentUser();
  if(me){
    startApp();
  } else {
    GSAuth.renderLoginScreen(settingsPreview.shopName, () => startApp());
  }
});

})();
