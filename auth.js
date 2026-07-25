/* ===========================================================
   auth.js — login, sessions, roles, and staff administration
   Client-side only. Passwords are lightly obscured (not real
   cryptographic hashing) — fine for a single-device shop tool,
   not intended to protect against a determined attacker.
   =========================================================== */
const GSAuth = (function(){

  const USERS_KEY = 'giftly_users';
  const SESSION_KEY = 'giftly_session';

  function hash(pw){
    // Simple obfuscation, NOT secure cryptographic hashing.
    let h = 0;
    for(let i=0;i<pw.length;i++){ h = (h*31 + pw.charCodeAt(i)) | 0; }
    return 'h' + Math.abs(h).toString(36) + btoa(unescape(encodeURIComponent(pw))).slice(0,6);
  }

  function seedUsers(){
    return [
      { id:'u-admin', username:'admin', name:'Randeepa (Owner)', role:'admin', passwordHash: hash('admin123'), active:true },
      { id:'u-cashier', username:'cashier', name:'Sales Associate', role:'cashier', passwordHash: hash('cashier123'), active:true }
    ];
  }

  function loadUsers(){
    try{
      const raw = localStorage.getItem(USERS_KEY);
      if(!raw){ const seeded = seedUsers(); localStorage.setItem(USERS_KEY, JSON.stringify(seeded)); return seeded; }
      return JSON.parse(raw);
    }catch(e){ return seedUsers(); }
  }
  function saveUsers(users){ localStorage.setItem(USERS_KEY, JSON.stringify(users)); }

  function getSession(){
    try{ return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null'); }
    catch(e){ return null; }
  }
  function setSession(user){
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ id:user.id, username:user.username, name:user.name, role:user.role }));
  }
  function clearSession(){ sessionStorage.removeItem(SESSION_KEY); }

  function currentUser(){ return getSession(); }
  function isAdmin(){ const u = getSession(); return !!u && u.role === 'admin'; }

  function attemptLogin(username, password){
    const users = loadUsers();
    const u = users.find(x => x.username.toLowerCase() === username.trim().toLowerCase());
    if(!u) return { ok:false, error:'No account with that username.' };
    if(!u.active) return { ok:false, error:'This account has been deactivated. Ask an admin to reactivate it.' };
    if(u.passwordHash !== hash(password)) return { ok:false, error:'Incorrect password.' };
    setSession(u);
    return { ok:true, user:u };
  }

  function esc(s){ return (s||'').toString().replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  /* ---------------- Login screen ---------------- */
  function renderLoginScreen(shopName, onSuccess){
    const el = document.getElementById('gs-login-screen');
    el.classList.add('active');
    el.innerHTML = `
      <div class="gs-login-card">
        <div class="gs-login-brand">
          <div class="gs-brand-mark">${esc((shopName||'G').charAt(0).toUpperCase())}</div>
          <b>${esc(shopName || 'Giftly ERP')}</b>
        </div>
        <h2>Sign in</h2>
        <div class="gs-login-sub">Use your staff account to continue.</div>
        <div class="gs-login-error" id="li-error"></div>
        <div class="gs-field"><label>Username</label><input id="li-user" autocomplete="username" placeholder="admin"></div>
        <div class="gs-field"><label>Password</label><input id="li-pass" type="password" autocomplete="current-password" placeholder="••••••••"></div>
        <button class="gs-btn gs-btn-primary" id="li-submit" style="width:100%;padding:11px;margin-top:6px;">Sign in</button>
        <div class="gs-login-demo">
          <b>Demo accounts</b><br>
          Admin — username <b>admin</b> / password <b>admin123</b><br>
          Cashier — username <b>cashier</b> / password <b>cashier123</b>
        </div>
      </div>`;

    function submit(){
      const username = document.getElementById('li-user').value;
      const password = document.getElementById('li-pass').value;
      const errEl = document.getElementById('li-error');
      const res = attemptLogin(username, password);
      if(!res.ok){ errEl.textContent = res.error; errEl.classList.add('show'); return; }
      errEl.classList.remove('show');
      el.classList.remove('active');
      onSuccess(res.user);
    }
    document.getElementById('li-submit').addEventListener('click', submit);
    el.querySelectorAll('input').forEach(inp => inp.addEventListener('keydown', e=>{ if(e.key === 'Enter') submit(); }));
    document.getElementById('li-user').focus();
  }

  function logout(){
    clearSession();
    location.reload();
  }

  /* ---------------- Administration panel (admin only) ---------------- */
  function renderAdminPanel(container, rerenderCallback){
    const users = loadUsers();
    const me = currentUser();
    container.innerHTML = `
      <div class="gs-panel">
        <div class="gs-panel-head">
          <h3>Staff accounts (${users.length})</h3>
          <button class="gs-btn gs-btn-gold" id="au-add">+ Add staff account</button>
        </div>
        <div class="gs-panel-body" style="padding:0;">
          <table class="gs-table"><thead><tr><th>Name</th><th>Username</th><th>Role</th><th>Status</th><th></th></tr></thead><tbody>
            ${users.map(u => `
              <tr>
                <td>${esc(u.name)}</td>
                <td>${esc(u.username)}</td>
                <td><span class="gs-badge ${u.role==='admin'?'gold':'neutral'}">${u.role==='admin'?'Administrator':'Cashier'}</span></td>
                <td><span class="gs-badge ${u.active?'ok':'low'}">${u.active?'Active':'Deactivated'}</span></td>
                <td class="gs-row-actions">
                  <button class="gs-btn gs-btn-ghost gs-btn-sm" data-reset="${u.id}">Reset password</button>
                  <button class="gs-btn gs-btn-ghost gs-btn-sm" data-edit="${u.id}">Edit</button>
                  ${u.id !== me.id ? `<button class="gs-btn gs-btn-danger gs-btn-sm" data-toggle="${u.id}">${u.active?'Deactivate':'Reactivate'}</button>` : ''}
                </td>
              </tr>`).join('')}
          </tbody></table>
        </div>
      </div>
      <div class="gs-hint">Administration is only visible to accounts with the Administrator role. Cashiers can use Sales, Inventory, Customers, and Purchasing, but not Accounting, HR, Settings, or Administration.</div>
    `;

    document.getElementById('au-add').addEventListener('click', () => openUserModal(null));
    container.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => openUserModal(users.find(u=>u.id===b.dataset.edit))));
    container.querySelectorAll('[data-reset]').forEach(b => b.addEventListener('click', () => openResetModal(users.find(u=>u.id===b.dataset.reset))));
    container.querySelectorAll('[data-toggle]').forEach(b => b.addEventListener('click', () => {
      const u = users.find(x=>x.id===b.dataset.toggle);
      u.active = !u.active;
      saveUsers(users);
      renderAdminPanel(container, rerenderCallback);
    }));

    function openUserModal(user){
      const isEdit = !!user;
      user = user || { id:'u-'+Math.random().toString(36).slice(2,9), username:'', name:'', role:'cashier', passwordHash: hash('changeme123'), active:true };
      const back = document.createElement('div'); back.className='gs-modal-back';
      back.innerHTML = `<div class="gs-modal">
        <h3>${isEdit?'Edit staff account':'Add staff account'}</h3>
        <div class="gs-field"><label>Full name</label><input id="au-name" value="${esc(user.name)}"></div>
        <div class="gs-field"><label>Username</label><input id="au-username" value="${esc(user.username)}" ${isEdit?'disabled':''}></div>
        <div class="gs-field"><label>Role</label>
          <select id="au-role">
            <option value="cashier" ${user.role==='cashier'?'selected':''}>Cashier — Sales, Inventory, Customers, Purchasing</option>
            <option value="admin" ${user.role==='admin'?'selected':''}>Administrator — full access</option>
          </select>
        </div>
        ${!isEdit ? `<div class="gs-field"><label>Temporary password</label><input id="au-pass" type="text" value="changeme123"></div>` : ''}
        <div class="gs-modal-actions">
          <button class="gs-btn gs-btn-ghost" id="au-cancel">Cancel</button>
          <button class="gs-btn gs-btn-primary" id="au-save">Save</button>
        </div></div>`;
      document.body.appendChild(back);
      back.addEventListener('click', e=>{ if(e.target===back) back.remove(); });
      back.querySelector('#au-cancel').addEventListener('click', ()=> back.remove());
      back.querySelector('#au-save').addEventListener('click', ()=>{
        const name = back.querySelector('#au-name').value.trim();
        const username = back.querySelector('#au-username').value.trim();
        if(!name || !username){ alert('Name and username are required.'); return; }
        if(!isEdit && users.some(u=>u.username.toLowerCase()===username.toLowerCase())){ alert('That username is already taken.'); return; }
        user.name = name;
        user.username = username;
        user.role = back.querySelector('#au-role').value;
        if(!isEdit){
          const passField = back.querySelector('#au-pass');
          user.passwordHash = hash(passField.value || 'changeme123');
          users.push(user);
        }
        saveUsers(users);
        back.remove();
        renderAdminPanel(container, rerenderCallback);
        if(rerenderCallback) rerenderCallback();
      });
    }

    function openResetModal(user){
      const back = document.createElement('div'); back.className='gs-modal-back';
      back.innerHTML = `<div class="gs-modal">
        <h3>Reset password — ${esc(user.name)}</h3>
        <div class="gs-field"><label>New password</label><input id="au-newpass" type="text" value=""></div>
        <div class="gs-modal-actions">
          <button class="gs-btn gs-btn-ghost" id="au-rcancel">Cancel</button>
          <button class="gs-btn gs-btn-primary" id="au-rsave">Save new password</button>
        </div></div>`;
      document.body.appendChild(back);
      back.addEventListener('click', e=>{ if(e.target===back) back.remove(); });
      back.querySelector('#au-rcancel').addEventListener('click', ()=> back.remove());
      back.querySelector('#au-rsave').addEventListener('click', ()=>{
        const pw = back.querySelector('#au-newpass').value;
        if(!pw || pw.length < 4){ alert('Password must be at least 4 characters.'); return; }
        user.passwordHash = hash(pw);
        saveUsers(users);
        back.remove();
        alert(`Password updated for ${user.name}.`);
      });
    }
  }

  return { loadUsers, saveUsers, currentUser, isAdmin, attemptLogin, renderLoginScreen, logout, renderAdminPanel };
})();
