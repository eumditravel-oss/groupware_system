// Contacts View Module (Global Namespace Version)

let activeFilter = 'all'; // 'all', '개발팀', '마케팅팀', '인사팀', '영업팀'

function renderContactsSubPanel(searchQuery = '') {
  const { state } = window.WorksState;
  const listContainer = document.getElementById('subPanelList');
  const titleContainer = document.getElementById('subPanelTitle');
  
  titleContainer.textContent = '주소록';
  
  const depts = ['all', '개발팀', '마케팅팀', '인사팀', '영업팀'];
  const deptLabels = {
    all: '전체 임직원',
    개발팀: '개발팀',
    마케팅팀: '마케팅팀',
    인사팀: '인사팀',
    영업팀: '영업팀'
  };

  let html = '';
  depts.forEach(dept => {
    const count = dept === 'all' 
      ? state.users.filter(u => !u.isBot).length 
      : state.users.filter(u => u.dept === dept).length;
      
    const isActive = activeFilter === dept ? 'active' : '';
    html += `
      <div class="list-item ${isActive}" data-dept-filter="${dept}">
        <div class="list-item-content">
          <div class="list-item-header">
            <span class="list-item-title">${deptLabels[dept]}</span>
            <span class="list-badge">${count}</span>
          </div>
        </div>
      </div>
    `;
  });
  
  listContainer.innerHTML = html;

  listContainer.querySelectorAll('[data-dept-filter]').forEach(item => {
    item.addEventListener('click', () => {
      activeFilter = item.getAttribute('data-dept-filter');
      renderContactsSubPanel(searchQuery);
      renderContactsWorkspace(searchQuery);
    });
  });
}

function renderContactsWorkspace(searchQuery = '') {
  const { state, switchView, switchActiveChat } = window.WorksState;
  const workspaceContainer = document.getElementById('viewBodyContainer');
  const headerTitle = document.getElementById('viewHeaderTitle');
  const headerSubtitle = document.getElementById('viewHeaderSubtitle');
  const headerActions = document.getElementById('viewHeaderActionsContainer');
  
  headerActions.innerHTML = '';

  const label = activeFilter === 'all' ? '전체 임직원' : activeFilter;
  headerTitle.textContent = `${label} 주소록`;
  
  let filteredUsers = state.users.filter(u => !u.isBot);
  
  if (activeFilter !== 'all') {
    filteredUsers = filteredUsers.filter(u => u.dept === activeFilter);
  }
  
  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase().trim();
    filteredUsers = filteredUsers.filter(u => 
      u.name.toLowerCase().includes(q) || 
      u.dept.toLowerCase().includes(q) || 
      u.role.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  }

  headerSubtitle.textContent = `총 ${filteredUsers.length}명`;

  if (filteredUsers.length === 0) {
    workspaceContainer.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--text-light); gap: 10px; padding: 40px 0;">
        <i data-lucide="users-round" style="width: 48px; height: 48px;"></i>
        <p>검색 결과에 맞는 임직원이 없습니다.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  let html = '<div class="contacts-grid">';
  filteredUsers.forEach(user => {
    const initials = user.name.slice(-2);
    const statusLabels = {
      online: '온라인',
      busy: '다른 용무 중',
      away: '자리 비움',
      offline: '오프라인'
    };

    html += `
      <div class="contact-card">
        <div class="contact-card-avatar" style="background-color: ${user.avatarColor || 'var(--primary-color)'};">
          ${initials}
          <span class="status-indicator ${user.status}" title="${statusLabels[user.status]}"></span>
        </div>
        <div class="contact-card-info">
          <div class="contact-card-name">
            ${user.name} <span class="contact-card-role">${user.role}</span>
          </div>
          <div class="contact-card-dept">${user.dept}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
            <i data-lucide="mail" style="width: 12px; height: 12px;"></i> ${user.email}
          </div>
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
            <i data-lucide="phone" style="width: 12px; height: 12px;"></i> ${user.phone}
          </div>
          <div class="contact-card-actions">
            <button class="btn btn-primary contact-action-btn-sm" data-action-chat="${user.id}">
              <i data-lucide="message-square" style="width: 12px; height: 12px;"></i> 1:1 대화
            </button>
          </div>
        </div>
      </div>
    `;
  });
  html += '</div>';
  workspaceContainer.innerHTML = html;
  
  lucide.createIcons();

  workspaceContainer.querySelectorAll('[data-action-chat]').forEach(btn => {
    btn.addEventListener('click', () => {
      const userId = Number(btn.getAttribute('data-action-chat'));
      const activeUser = state.currentUser;
      const dmId = `dm-${Math.min(activeUser.id, userId)}-${Math.max(activeUser.id, userId)}`;
      
      switchView('chat');
      switchActiveChat(dmId);
      
      window.dispatchEvent(new CustomEvent('statechanged'));
      
      // Also execute routing in app shell
      if (window.AppShell && typeof window.AppShell.navigateTo === 'function') {
        window.AppShell.navigateTo('chat');
      }
    });
  });
}

// Expose globally
window.ContactsView = {
  renderContactsSubPanel,
  renderContactsWorkspace
};
