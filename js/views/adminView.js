// CONCOST Admin Panel View Module - js/views/adminView.js

let activeAdminTab = 'users'; // 'users' or 'api'

function renderAdminSubPanel(searchQuery = '') {
  const listContainer = document.getElementById('subPanelList');
  const titleContainer = document.getElementById('subPanelTitle');
  
  if (!listContainer || !titleContainer) return;
  titleContainer.textContent = '관리자 설정';
  
  const currentUser = window.WorksState.state.currentUser;
  const isKeyViewer = currentUser && currentUser.email === 'yjw@con-cost.com';
  
  let html = `
    <div style="padding: 10px 20px 4px 20px; font-size: 0.75rem; font-weight: 700; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.5px;">설정 메뉴</div>
    
    <div class="list-item ${activeAdminTab === 'users' ? 'active' : ''}" id="admin-menu-users">
      <div class="list-item-content">
        <span class="list-item-title" style="display: flex; align-items: center; gap: 8px;">
          <i data-lucide="users" style="width: 16px; height: 16px;"></i> 사용자 권한 관리
        </span>
      </div>
    </div>
  `;
  
  if (isKeyViewer) {
    html += `
      <div class="list-item ${activeAdminTab === 'api' ? 'active' : ''}" id="admin-menu-api">
        <div class="list-item-content">
          <span class="list-item-title" style="display: flex; align-items: center; gap: 8px;">
            <i data-lucide="key-round" style="width: 16px; height: 16px;"></i> Gemini API 설정
          </span>
        </div>
      </div>
    `;
  }
  
  listContainer.innerHTML = html;
  lucide.createIcons();
  
  // Bind menu clicks
  const usersBtn = document.getElementById('admin-menu-users');
  const apiBtn = document.getElementById('admin-menu-api');
  
  if (usersBtn) {
    usersBtn.addEventListener('click', () => {
      activeAdminTab = 'users';
      renderAdminSubPanel(searchQuery);
      renderAdminWorkspace();
    });
  }
  if (apiBtn && isKeyViewer) {
    apiBtn.addEventListener('click', () => {
      activeAdminTab = 'api';
      renderAdminSubPanel(searchQuery);
      renderAdminWorkspace();
    });
  }
}

function renderAdminWorkspace() {
  const workspaceContainer = document.getElementById('viewBodyContainer');
  const headerTitle = document.getElementById('viewHeaderTitle');
  const headerSubtitle = document.getElementById('viewHeaderSubtitle');
  const headerActions = document.getElementById('viewHeaderActionsContainer');
  
  if (!workspaceContainer || !headerTitle || !headerSubtitle || !headerActions) return;
  
  headerActions.innerHTML = ''; // Clear action buttons
  
  const currentUser = window.WorksState.state.currentUser;
  const isKeyViewer = currentUser && currentUser.email === 'yjw@con-cost.com';
  
  if (activeAdminTab === 'api' && !isKeyViewer) {
    activeAdminTab = 'users';
  }
  
  if (activeAdminTab === 'users') {
    headerTitle.textContent = '사용자 권한 관리';
    headerSubtitle.textContent = '임직원 로그인 계정 등록 및 등급(권한) 설정';
    renderUsersTab(workspaceContainer);
  } else {
    headerTitle.textContent = 'Gemini API 설정';
    headerSubtitle.textContent = '사내 메신저 자동 번역 및 AI 챗봇의 전역 API 연동 설정';
    renderApiTab(workspaceContainer);
  }
}

function renderUsersTab(container) {
  const { state, changeUserGrade, addUser, deleteUser } = window.WorksState;
  
  // Create user rows
  let userRowsHtml = '';
  // Exclude bot from management
  const humanUsers = state.users.filter(u => !u.isBot);
  
  humanUsers.forEach(user => {
    const isMe = user.id === state.currentUser?.id;
    const gradeBadgeClass = `badge-grade ${user.grade ? user.grade.toLowerCase() : 'employee'}`;
    const gradeLabels = { Admin: '관리자', Employee: '일반 사원', Guest: '게스트' };
    const gradeLabel = gradeLabels[user.grade] || '일반 사원';
    
    let deleteBtn = isMe 
      ? `<span style="font-size: 0.75rem; color: var(--text-muted); font-style: italic;">본인 계정</span>`
      : `<button class="btn" style="padding: 4px 8px; font-size: 0.75rem; border-color: #ef4444; color: #ef4444;" data-delete-user-id="${user.id}">삭제</button>`;
      
    userRowsHtml += `
      <tr>
        <td style="font-weight: 600;">${user.name}</td>
        <td>${user.email}</td>
        <td>${user.dept} / ${user.role}</td>
        <td>
          <span class="${gradeBadgeClass}">${gradeLabel}</span>
        </td>
        <td>
          <select class="admin-select" data-user-id="${user.id}" ${isMe ? 'disabled' : ''}>
            <option value="Admin" ${user.grade === 'Admin' ? 'selected' : ''}>관리자 (Admin)</option>
            <option value="Employee" ${user.grade === 'Employee' ? 'selected' : ''}>일반 사원 (Employee)</option>
            <option value="Guest" ${user.grade === 'Guest' ? 'selected' : ''}>게스트 (Guest)</option>
          </select>
        </td>
        <td style="text-align: center;">
          ${deleteBtn}
        </td>
      </tr>
    `;
  });
  
  container.innerHTML = `
    <div class="admin-workspace">
      <!-- User List Card -->
      <div class="admin-card">
        <h4><i data-lucide="users" class="chatbot-icon"></i> 등록된 사용자 목록</h4>
        <div class="admin-table-wrapper">
          <table class="admin-table">
            <thead>
              <tr>
                <th>이름</th>
                <th>이메일(아이디)</th>
                <th>부서 / 직급</th>
                <th>현재 등급</th>
                <th>등급 조정</th>
                <th style="width: 80px; text-align: center;">관리</th>
              </tr>
            </thead>
            <tbody>
              ${userRowsHtml}
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Add User Card -->
      <div class="admin-card">
        <h4><i data-lucide="user-plus" class="chatbot-icon"></i> 새 사용자 등록 (ID 발급)</h4>
        <form id="addUserForm" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 10px;">
          <div class="form-group">
            <label style="font-size: 0.75rem; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 6px;">이름 *</label>
            <input type="text" id="addUserName" class="form-control" placeholder="홍길동" required style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--border-color); font-size: 0.85rem;">
          </div>
          <div class="form-group">
            <label style="font-size: 0.75rem; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 6px;">이메일 (로그인 ID) *</label>
            <input type="email" id="addUserEmail" class="form-control" placeholder="gd.hong@concost.com" required style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--border-color); font-size: 0.85rem;">
          </div>
          <div class="form-group">
            <label style="font-size: 0.75rem; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 6px;">부서 *</label>
            <input type="text" id="addUserDept" class="form-control" placeholder="기획팀" required style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--border-color); font-size: 0.85rem;">
          </div>
          <div class="form-group">
            <label style="font-size: 0.75rem; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 6px;">직급 *</label>
            <input type="text" id="addUserRole" class="form-control" placeholder="사원" required style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--border-color); font-size: 0.85rem;">
          </div>
          <div class="form-group">
            <label style="font-size: 0.75rem; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 6px;">로그인 비밀번호 *</label>
            <input type="password" id="addUserPassword" class="form-control" placeholder="1234" required style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--border-color); font-size: 0.85rem;">
          </div>
          <div class="form-group">
            <label style="font-size: 0.75rem; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 6px;">권한 등급 *</label>
            <select id="addUserGrade" class="admin-select" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--border-color); height: 35px; font-size: 0.85rem;">
              <option value="Employee">일반 사원 (Employee)</option>
              <option value="Admin">관리자 (Admin)</option>
              <option value="Guest">게스트 (Guest)</option>
            </select>
          </div>
          <div style="grid-column: span 2; display: flex; justify-content: flex-end; margin-top: 10px;">
            <button type="submit" class="btn btn-primary" style="padding: 10px 20px;">신규 사용자 등록</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  lucide.createIcons();
  
  // Bind change events to grade selects
  container.querySelectorAll('.admin-select[data-user-id]').forEach(select => {
    select.addEventListener('change', (e) => {
      const userId = Number(e.target.getAttribute('data-user-id'));
      const newGrade = e.target.value;
      
      changeUserGrade(userId, newGrade);
      renderUsersTab(container);
      window.dispatchEvent(new CustomEvent('statechanged'));
    });
  });
  
  // Bind delete buttons
  container.querySelectorAll('[data-delete-user-id]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const userId = Number(btn.getAttribute('data-delete-user-id'));
      console.log('Delete button clicked for user ID:', userId);
      const user = state.users.find(u => u.id === userId);
      if (user && confirm(`${user.name} 계정을 삭제하시겠습니까? 로그인할 수 없게 됩니다.`)) {
        deleteUser(userId);
        renderUsersTab(container);
        window.dispatchEvent(new CustomEvent('statechanged'));
      }
    });
  });
  
  // Bind add user form submit
  const form = document.getElementById('addUserForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('addUserName').value.trim();
      const email = document.getElementById('addUserEmail').value.trim();
      const dept = document.getElementById('addUserDept').value.trim();
      const role = document.getElementById('addUserRole').value.trim();
      const password = document.getElementById('addUserPassword').value.trim();
      const grade = document.getElementById('addUserGrade').value;
      
      try {
        addUser(name, role, dept, email, password, grade);
        alert(`${name} 사원이 등록되었습니다.`);
        renderUsersTab(container);
        window.dispatchEvent(new CustomEvent('statechanged'));
      } catch (err) {
        alert(err.message);
      }
    });
  }
}

function renderApiTab(container) {
  const { setGlobalApiKey, getGlobalApiKey } = window.WorksState;
  const currentKey = getGlobalApiKey();
  
  container.innerHTML = `
    <div class="admin-workspace">
      <div class="admin-card" style="max-width: 600px;">
        <h4><i data-lucide="key" class="chatbot-icon"></i> Gemini API Key 설정 (전역)</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 20px;">
          여기에 입력하신 API Key는 사내의 모든 임직원에게 적용됩니다. 임직원은 개별 API Key 입력 없이도 즉시 실시간 번역과 챗봇 기능을 사용할 수 있습니다.
        </p>
        
        <form id="globalApiKeyForm">
          <div class="form-group" style="margin-bottom: 20px;">
            <label style="font-size: 0.75rem; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 6px;">Gemini API Key</label>
            <input type="password" id="globalApiKeyInput" class="form-control" value="${currentKey}" placeholder="AIzaSy..." style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); font-family: monospace; font-size: 0.9rem;">
          </div>
          
          <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px dashed var(--border-color); padding-top: 20px;">
            <a href="https://aistudio.google.com/" target="_blank" style="display: inline-flex; align-items: center; gap: 4px; font-size: 0.78rem; color: var(--primary-color); text-decoration: none; font-weight: 500;">
              Google AI Studio에서 API 키 받기 <i data-lucide="external-link" style="width: 14px; height: 14px;"></i>
            </a>
            <button type="submit" class="btn btn-primary" style="padding: 10px 24px;">API Key 저장</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  lucide.createIcons();
  
  const form = document.getElementById('globalApiKeyForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('globalApiKeyInput');
      const key = input.value.trim();
      
      setGlobalApiKey(key);
      alert('Gemini API Key가 전역 설정에 성공적으로 저장되었습니다.');
      renderApiTab(container);
      
      // Dispatch state changed event
      window.dispatchEvent(new CustomEvent('statechanged'));
    });
  }
}

// Expose globally
window.AdminView = {
  renderAdminSubPanel,
  renderAdminWorkspace
};
