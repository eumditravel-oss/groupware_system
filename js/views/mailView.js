// Mail View Module (Global Namespace Version)

let activeFolder = 'inbox'; // 'inbox', 'sent'
let selectedMailId = null;

function renderMailSubPanel(searchQuery = '') {
  const { state } = window.WorksState;
  const listContainer = document.getElementById('subPanelList');
  const titleContainer = document.getElementById('subPanelTitle');
  
  titleContainer.textContent = '메일';
  
  const inboxCount = state.mails.filter(m => m.folder === 'inbox' && m.recipientIds.includes(state.currentUser.id)).length;
  const unreadInboxCount = state.mails.filter(m => m.folder === 'inbox' && m.recipientIds.includes(state.currentUser.id) && !m.isRead).length;
  const sentCount = state.mails.filter(m => m.folder === 'sent' && m.senderId === state.currentUser.id).length;

  let html = `
    <div style="padding: 10px 20px 4px 20px; font-size: 0.75rem; font-weight: 700; color: var(--text-light); text-transform: uppercase;">메일함</div>
    
    <div class="list-item ${activeFolder === 'inbox' ? 'active' : ''}" data-mail-folder="inbox">
      <div class="list-item-content">
        <div class="list-item-header">
          <span class="list-item-title"><i data-lucide="inbox" style="width: 14px; height: 14px; margin-right: 6px; vertical-align: middle;"></i>받은메일함</span>
          <span class="list-badge" style="background-color: var(--primary-color);">${inboxCount}</span>
        </div>
        ${unreadInboxCount > 0 ? `<div style="font-size: 0.75rem; color: var(--primary-color); font-weight: 600;">읽지 않은 메일 ${unreadInboxCount}통</div>` : ''}
      </div>
    </div>
    
    <div class="list-item ${activeFolder === 'sent' ? 'active' : ''}" data-mail-folder="sent">
      <div class="list-item-content">
        <div class="list-item-header">
          <span class="list-item-title"><i data-lucide="send" style="width: 14px; height: 14px; margin-right: 6px; vertical-align: middle;"></i>보낸메일함</span>
          <span class="list-badge" style="background-color: var(--text-muted);">${sentCount}</span>
        </div>
      </div>
    </div>
  `;
  
  listContainer.innerHTML = html;
  lucide.createIcons();

  listContainer.querySelectorAll('[data-mail-folder]').forEach(item => {
    item.addEventListener('click', () => {
      activeFolder = item.getAttribute('data-mail-folder');
      selectedMailId = null;
      renderMailSubPanel(searchQuery);
      renderMailWorkspace(searchQuery);
    });
  });
}

function renderMailWorkspace(searchQuery = '') {
  const { state } = window.WorksState;
  const workspaceContainer = document.getElementById('viewBodyContainer');
  const headerTitle = document.getElementById('viewHeaderTitle');
  const headerSubtitle = document.getElementById('viewHeaderSubtitle');
  const headerActions = document.getElementById('viewHeaderActionsContainer');

  headerTitle.textContent = activeFolder === 'inbox' ? '받은메일함' : '보낸메일함';
  headerSubtitle.textContent = '사내 업무용 공식 메일 시스템';
  
  headerActions.innerHTML = `
    <button class="btn btn-primary" id="openMailComposeBtn">
      <i data-lucide="pencil"></i> 메일 쓰기
    </button>
  `;
  lucide.createIcons();

  let filteredMails = [];
  if (activeFolder === 'inbox') {
    filteredMails = state.mails.filter(m => m.folder === 'inbox' && m.recipientIds.includes(state.currentUser.id));
  } else {
    filteredMails = state.mails.filter(m => m.folder === 'sent' && m.senderId === state.currentUser.id);
  }

  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase().trim();
    filteredMails = filteredMails.filter(m => 
      m.subject.toLowerCase().includes(q) || 
      m.content.toLowerCase().includes(q)
    );
  }

  workspaceContainer.innerHTML = `
    <div class="mail-container">
      <div class="mail-list-panel">
        <div class="mail-list-scroll" id="mailListScroll">
          <!-- Mails list -->
        </div>
      </div>
      
      <div class="mail-detail-panel" id="mailDetailPanel">
        <!-- Rendered dynamically -->
      </div>
    </div>
  `;

  renderMailItems(filteredMails);
  renderMailDetail();
  setupComposeListeners();
}

function renderMailItems(mails) {
  const { state } = window.WorksState;
  const scrollContainer = document.getElementById('mailListScroll');
  if (mails.length === 0) {
    scrollContainer.innerHTML = `
      <div style="padding: 40px; text-align: center; color: var(--text-light);">
        <i data-lucide="mail-open" style="width: 40px; height: 40px; margin-bottom: 10px; opacity: 0.5;"></i>
        <p>메일이 없습니다.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  let html = '';
  mails.forEach(mail => {
    const isUnread = activeFolder === 'inbox' && !mail.isRead;
    const sender = state.users.find(u => u.id === mail.senderId) || { name: '알수없음', role: '' };
    const date = new Date(mail.timestamp);
    const dateStr = `${date.getMonth() + 1}월 ${date.getDate()}일`;
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = mail.content;
    const textSnippet = tempDiv.textContent || tempDiv.innerText || '';

    html += `
      <div class="mail-item ${isUnread ? 'unread' : ''} ${selectedMailId === mail.id ? 'active' : ''}" data-mail-id="${mail.id}">
        <div class="mail-meta-row">
          <span class="mail-sender">${sender.name} ${sender.role}</span>
          <span>${dateStr}</span>
        </div>
        <div class="mail-subject">${mail.subject}</div>
        <div class="mail-snippet">${textSnippet}</div>
      </div>
    `;
  });

  scrollContainer.innerHTML = html;

  scrollContainer.querySelectorAll('[data-mail-id]').forEach(item => {
    item.addEventListener('click', () => {
      const mailId = item.getAttribute('data-mail-id');
      selectedMailId = mailId;

      const mail = state.mails.find(m => m.id === mailId);
      if (mail && activeFolder === 'inbox' && !mail.isRead) {
        mail.isRead = true;
        
        // Save using local storage directly
        const STORAGE_KEY = 'NAVER_WORKS_STATE';
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        
        renderMailSubPanel();
        window.dispatchEvent(new CustomEvent('statechanged'));
      }

      renderMailItems(mails);
      renderMailDetail();
    });
  });
}

function renderMailDetail() {
  const { state } = window.WorksState;
  const detailPanel = document.getElementById('mailDetailPanel');
  if (!detailPanel) return;

  if (!selectedMailId) {
    detailPanel.innerHTML = `
      <div class="mail-detail-empty">
        <i data-lucide="mail" style="color: var(--text-light); opacity: 0.4;"></i>
        <p>확인할 메일을 리스트에서 선택해 주세요.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  const mail = state.mails.find(m => m.id === selectedMailId);
  if (!mail) {
    detailPanel.innerHTML = '<div class="mail-detail-empty"><p>메일 정보를 찾을 수 없습니다.</p></div>';
    return;
  }

  const sender = state.users.find(u => u.id === mail.senderId) || { name: '알수없음', role: '', email: '' };
  
  const recipients = mail.recipientIds
    .map(id => state.users.find(u => u.id === id))
    .filter(Boolean)
    .map(u => `${u.name} ${u.role}(${u.email})`)
    .join(', ');

  const date = new Date(mail.timestamp);
  const formattedDate = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

  detailPanel.innerHTML = `
    <div class="mail-detail-content">
      <div class="mail-detail-header">
        <h4 class="mail-detail-subject">${mail.subject}</h4>
        <div class="mail-detail-info">
          <div class="mail-detail-people">
            <div><strong>보낸사람:</strong> ${sender.name} ${sender.role} (${sender.email})</div>
            <div><strong>받는사람:</strong> ${recipients}</div>
          </div>
          <div style="color: var(--text-muted); font-size: 0.8rem;">${formattedDate}</div>
        </div>
      </div>
      
      <div class="mail-detail-body">
        ${mail.content}
      </div>
    </div>
  `;
}

function setupComposeListeners() {
  const { state, sendMail } = window.WorksState;
  const openBtn = document.getElementById('openMailComposeBtn');
  const closeBtn = document.getElementById('closeMailComposeBtn');
  const cancelBtn = document.getElementById('cancelMailComposeBtn');
  const drawer = document.getElementById('mailComposeDrawer');
  const form = document.getElementById('mailComposeForm');
  const select = document.getElementById('mailRecipientSelect');
  const recipientsContainer = document.getElementById('mailRecipientsContainer');

  if (!openBtn) return;

  let chosenRecipients = [];

  let selectHtml = '<option value="">+ 받는 사람 선택</option>';
  state.users.forEach(u => {
    if (u.id === state.currentUser.id) return;
    selectHtml += `<option value="${u.id}">${u.name} ${u.role} (${u.dept})</option>`;
  });
  select.innerHTML = selectHtml;

  const renderChosenRecipients = () => {
    recipientsContainer.innerHTML = chosenRecipients.map(id => {
      const u = state.users.find(user => user.id === id);
      return u ? `
        <span style="background-color: var(--primary-light); color: var(--primary-color); border: 1px solid var(--primary-color); border-radius: 4px; padding: 2px 8px; font-size: 0.8rem; display: flex; align-items: center; gap: 6px;">
          ${u.name} ${u.role}
          <i data-lucide="x" style="width: 12px; height: 12px; cursor: pointer;" data-remove-recipient="${u.id}"></i>
        </span>
      ` : '';
    }).join('');
    
    lucide.createIcons();

    recipientsContainer.querySelectorAll('[data-remove-recipient]').forEach(icon => {
      icon.addEventListener('click', () => {
        const removeId = Number(icon.getAttribute('data-remove-recipient'));
        chosenRecipients = chosenRecipients.filter(id => id !== removeId);
        renderChosenRecipients();
      });
    });
  };

  select.addEventListener('change', (e) => {
    const val = Number(e.target.value);
    if (val && !chosenRecipients.includes(val)) {
      chosenRecipients.push(val);
      renderChosenRecipients();
    }
    e.target.value = '';
  });

  const openDrawer = () => {
    chosenRecipients = [];
    renderChosenRecipients();
    form.reset();
    drawer.style.display = 'flex';
  };

  const closeDrawer = () => {
    drawer.style.display = 'none';
  };

  openBtn.addEventListener('click', () => {
    if (state.currentUser?.grade === 'Guest') {
      alert('게스트 권한은 메일을 작성할 수 없습니다.');
      return;
    }
    openDrawer();
  });
  closeBtn.addEventListener('click', closeDrawer);
  cancelBtn.addEventListener('click', closeDrawer);

  form.onsubmit = (e) => {
    e.preventDefault();
    if (chosenRecipients.length === 0) {
      alert('받는 사람을 1명 이상 선택해 주세요.');
      return;
    }

    const subject = document.getElementById('mailSubject').value;
    const body = document.getElementById('mailBody').value;
    const htmlBody = body.split('\n').map(line => `<p>${line}</p>`).join('');

    sendMail(chosenRecipients, subject, htmlBody);
    closeDrawer();

    renderMailSubPanel();
    renderMailWorkspace();
    
    window.dispatchEvent(new CustomEvent('statechanged'));
  };
}

// Expose globally
window.MailView = {
  renderMailSubPanel,
  renderMailWorkspace
};
