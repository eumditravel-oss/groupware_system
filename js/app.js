// Core App Shell & Router (Global Namespace Version) - app.js

// DOM Elements
const navItems = document.querySelectorAll('.nav-item');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeIcon = document.getElementById('themeIcon');
const profileTriggerBtn = document.getElementById('profileTriggerBtn');
const activeUserAvatar = document.getElementById('activeUserAvatar');
const activeUserStatus = document.getElementById('activeUserStatus');
const profileSwitchMenu = document.getElementById('profileSwitchMenu');
const profileMenuList = document.getElementById('profileMenuList');
const subPanelSearchInput = document.getElementById('subPanelSearchInput');

// Auth Check Helpers
function checkAuthentication() {
  const { state } = window.WorksState;
  const loginPage = document.getElementById('loginPage');
  const appContainer = document.querySelector('.app-container');
  
  if (!state.isLoggedIn) {
    if (loginPage) loginPage.style.display = 'flex';
    if (appContainer) appContainer.style.display = 'none';
    setupLoginListeners();
    if (window.lucide) {
      window.lucide.createIcons();
    }
    return false;
  } else {
    if (loginPage) loginPage.style.display = 'none';
    if (appContainer) appContainer.style.display = 'flex';
    
    // Redirect if on admin view but not admin role
    if (state.currentUser?.grade !== 'Admin' && state.currentView === 'admin') {
      state.currentView = 'chat';
      window.WorksState.saveState();
    }
    
    // Manage admin tab visibility
    const navAdmin = document.getElementById('nav-admin');
    if (navAdmin) {
      navAdmin.style.display = state.currentUser?.grade === 'Admin' ? 'flex' : 'none';
    }
    return true;
  }
}

function setupLoginListeners() {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const findPasswordForm = document.getElementById('findPasswordForm');
  
  const loginContainer = document.getElementById('loginFormContainer');
  const signupContainer = document.getElementById('signupFormContainer');
  const forgotContainer = document.getElementById('findPasswordFormContainer');
  
  const toSignupBtn = document.getElementById('toSignupLink');
  const toLoginFromSignupBtn = document.getElementById('toLoginFromSignupLink');
  const toForgotBtn = document.getElementById('toForgotLink');
  const toLoginFromForgotBtn = document.getElementById('toLoginFromForgotLink');
  
  const loginErrorMsg = document.getElementById('loginErrorMessage');
  const signupErrorMsg = document.getElementById('signupErrorMessage');
  const signupSuccessMsg = document.getElementById('signupSuccessMessage');
  const forgotErrorMsg = document.getElementById('findPasswordErrorMessage');
  const forgotSuccessMsg = document.getElementById('findPasswordSuccessMessage');
  
  const demoGrid = document.getElementById('loginDemoGrid');

  // Form toggling
  if (toSignupBtn && loginContainer && signupContainer) {
    toSignupBtn.addEventListener('click', (e) => {
      e.preventDefault();
      loginContainer.style.display = 'none';
      signupContainer.style.display = 'block';
      if (signupErrorMsg) signupErrorMsg.style.display = 'none';
      if (signupSuccessMsg) signupSuccessMsg.style.display = 'none';
    });
  }

  if (toLoginFromSignupBtn && loginContainer && signupContainer) {
    toLoginFromSignupBtn.addEventListener('click', (e) => {
      e.preventDefault();
      signupContainer.style.display = 'none';
      loginContainer.style.display = 'block';
    });
  }

  if (toForgotBtn && loginContainer && forgotContainer) {
    toForgotBtn.addEventListener('click', (e) => {
      e.preventDefault();
      loginContainer.style.display = 'none';
      forgotContainer.style.display = 'block';
      if (forgotErrorMsg) forgotErrorMsg.style.display = 'none';
      if (forgotSuccessMsg) forgotSuccessMsg.style.display = 'none';
    });
  }

  if (toLoginFromForgotBtn && loginContainer && forgotContainer) {
    toLoginFromForgotBtn.addEventListener('click', (e) => {
      e.preventDefault();
      forgotContainer.style.display = 'none';
      loginContainer.style.display = 'block';
    });
  }

  // Form Submissions
  if (loginForm) {
    if (!loginForm.dataset.listenerBound) {
      loginForm.dataset.listenerBound = 'true';
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const pass = document.getElementById('loginPassword').value.trim();
        
        const user = window.WorksState.login(email, pass);
        if (user) {
          if (loginErrorMsg) loginErrorMsg.style.display = 'none';
          window.location.reload();
        } else {
          if (loginErrorMsg) loginErrorMsg.style.display = 'block';
        }
      });
    }
  }

  if (signupForm) {
    if (!signupForm.dataset.listenerBound) {
      signupForm.dataset.listenerBound = 'true';
      signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('signupName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value.trim();
        const passwordConfirm = document.getElementById('signupPasswordConfirm').value.trim();
        const dept = document.getElementById('signupDept').value;
        const role = document.getElementById('signupRole').value;
        
        if (signupErrorMsg) signupErrorMsg.style.display = 'none';
        if (signupSuccessMsg) signupSuccessMsg.style.display = 'none';
        
        if (password !== passwordConfirm) {
          if (signupErrorMsg) {
            signupErrorMsg.textContent = '비밀번호가 일치하지 않습니다.';
            signupErrorMsg.style.display = 'block';
          }
          return;
        }
        
        try {
          // 1. Register locally in WorksState
          const newUser = window.WorksState.registerUser(name, email, password, dept, role);
          
          // 2. Call backend secure email API
          const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'welcome',
              email: email,
              data: {
                name: newUser.name,
                empNo: newUser.empNo,
                dept: newUser.dept,
                role: newUser.role
              }
            })
          });
          
          const result = await response.json();
          console.log('Welcome email API response:', result);
          
          if (signupSuccessMsg) {
            signupSuccessMsg.style.display = 'block';
          }
          
          // Clear inputs
          signupForm.reset();
          
          // Automatically switch back to login after 2s
          setTimeout(() => {
            if (signupContainer && loginContainer) {
              signupContainer.style.display = 'none';
              loginContainer.style.display = 'block';
              
              const loginEmailInput = document.getElementById('loginEmail');
              if (loginEmailInput) {
                loginEmailInput.value = email;
              }
            }
          }, 2000);
          
        } catch (err) {
          console.error(err);
          if (signupErrorMsg) {
            signupErrorMsg.textContent = err.message || '가입 도중 에러가 발생했습니다.';
            signupErrorMsg.style.display = 'block';
          }
        }
      });
    }
  }

  if (findPasswordForm) {
    if (!findPasswordForm.dataset.listenerBound) {
      findPasswordForm.dataset.listenerBound = 'true';
      findPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('findPasswordEmail').value.trim();
        
        if (forgotErrorMsg) forgotErrorMsg.style.display = 'none';
        if (forgotSuccessMsg) forgotSuccessMsg.style.display = 'none';
        
        // Find user in WorksState
        const { state } = window.WorksState;
        const user = state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (!user) {
          if (forgotErrorMsg) {
            forgotErrorMsg.textContent = '해당 이메일로 등록된 사원 정보가 없습니다.';
            forgotErrorMsg.style.display = 'block';
          }
          return;
        }
        
        // Generate a random temporary password (8 chars)
        const tempPassword = Math.random().toString(36).substring(2, 10);
        
        try {
          // Update password locally
          user.password = tempPassword;
          window.WorksState.saveState();
          
          // Call backend API
          const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'resetPassword',
              email: email,
              data: {
                name: user.name,
                tempPassword: tempPassword
              }
            })
          });
          
          const result = await response.json();
          console.log('Reset password email API response:', result);
          
          if (forgotSuccessMsg) {
            forgotSuccessMsg.style.display = 'block';
          }
          
          // Clear input
          findPasswordForm.reset();
          
        } catch (err) {
          console.error(err);
          if (forgotErrorMsg) {
            forgotErrorMsg.textContent = '메일 발송에 실패했습니다. 관리자에게 문의하십시오.';
            forgotErrorMsg.style.display = 'block';
          }
        }
      });
    }
  }

  if (demoGrid) {
    const { state } = window.WorksState;
    const humanUsers = state.users.filter(u => !u.isBot);
    
    // Pick 6 representative users to display in the grid (prioritizing admins and guest)
    const demoUsers = [];
    
    const yjwUser = humanUsers.find(u => u.email === 'yjw@con-cost.com');
    const yjparkUser = humanUsers.find(u => u.email === 'yjpark@con-cost.com');
    
    if (yjwUser) demoUsers.push(yjwUser);
    if (yjparkUser) demoUsers.push(yjparkUser);
    
    // Add other human users to fill up to 6 slots
    for (const u of humanUsers) {
      if (demoUsers.length >= 6) break;
      if (!demoUsers.some(du => du.id === u.id)) {
        demoUsers.push(u);
      }
    }
    
    let gridHtml = '';
    demoUsers.forEach(u => {
      const gradeLabels = { Admin: '관리자', Employee: '사원', Guest: '게스트' };
      const gradeLabel = gradeLabels[u.grade] || '사원';
      const initials = u.name.slice(-2);
      
      gridHtml += `
        <div class="demo-user-card" data-email="${u.email}" data-password="${u.password}">
          <div class="demo-user-avatar" style="background-color: ${u.avatarColor || 'var(--primary-color)'};">
            ${initials}
          </div>
          <div class="demo-user-info">
            <span class="demo-user-name">${u.name} ${u.role}</span>
            <span class="demo-user-role">${u.dept} (${gradeLabel})</span>
          </div>
        </div>
      `;
    });
    
    demoGrid.innerHTML = gridHtml;
    
    // Bind click events on each demo card to autofill and submit
    demoGrid.querySelectorAll('.demo-user-card').forEach(card => {
      card.addEventListener('click', () => {
        const email = card.getAttribute('data-email');
        const password = card.getAttribute('data-password');
        
        const emailInput = document.getElementById('loginEmail');
        const passwordInput = document.getElementById('loginPassword');
        
        if (emailInput && passwordInput) {
          emailInput.value = email;
          passwordInput.value = password;
          
          // Submit form instantly
          if (loginForm) {
            loginForm.dispatchEvent(new Event('submit'));
          }
        }
      });
    });
  }
}

// Initialize App
function init() {
  window.WorksState.loadState();
  
  if (!checkAuthentication()) {
    return;
  }
  
  const { state } = window.WorksState;
  
  // Set Theme
  document.documentElement.setAttribute('data-theme', state.theme);
  updateThemeIcon();

  // Set Current User Profiles in Sidebar
  updateUserProfileDisplay();

  // Draw Initial View
  navigateTo(state.currentView);

  // Bind Listeners
  setupGlobalListeners();

  // Initialize Chatbot panel
  initChatbot();

  // Initialize Lucide Icons
  lucide.createIcons();
}

// Global Event Listeners
function setupGlobalListeners() {
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const view = item.getAttribute('data-view');
      navigateTo(view);
    });
  });

  themeToggleBtn.addEventListener('click', () => {
    const theme = window.WorksState.toggleTheme();
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon();
  });

  profileTriggerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    profileSwitchMenu.classList.toggle('active');
    if (profileSwitchMenu.classList.contains('active')) {
      renderUserSwitcherList();
    }
  });

  document.addEventListener('click', () => {
    profileSwitchMenu.classList.remove('active');
  });

  subPanelSearchInput.addEventListener('input', (e) => {
    const query = e.target.value;
    const { state } = window.WorksState;
    renderSubpanelAndWorkspace(state.currentView, query);
  });

  window.addEventListener('statechanged', () => {
    updateGlobalBadges();
    updateUserProfileDisplay();
  });
  
  updateGlobalBadges();
}

// Navigate to specific view
function navigateTo(viewName) {
  const { state } = window.WorksState;
  let targetView = viewName;
  if (targetView === 'admin' && state.currentUser?.grade !== 'Admin') {
    alert('관리자 권한이 없습니다. 일반 메신저 화면으로 이동합니다.');
    targetView = 'chat';
  }
  
  window.WorksState.switchView(targetView);
  
  navItems.forEach(item => {
    if (item.getAttribute('data-view') === targetView) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  subPanelSearchInput.value = '';

  if (window.BoardView && typeof window.BoardView.closePostDrawer === 'function') {
    window.BoardView.closePostDrawer();
  }

  renderSubpanelAndWorkspace(targetView);
}

function renderSubpanelAndWorkspace(viewName, searchQuery = '') {
  switch (viewName) {
    case 'chat':
      window.ChatView.renderChatSubPanel(searchQuery);
      window.ChatView.renderChatWorkspace();
      break;
    case 'mail':
      window.MailView.renderMailSubPanel(searchQuery);
      window.MailView.renderMailWorkspace(searchQuery);
      break;
    case 'calendar':
      window.CalendarView.renderCalendarSubPanel(searchQuery);
      window.CalendarView.renderCalendarWorkspace(searchQuery);
      break;
    case 'tasks':
      window.TasksView.renderTasksSubPanel(searchQuery);
      window.TasksView.renderTasksWorkspace(searchQuery);
      break;
    case 'contacts':
      window.ContactsView.renderContactsSubPanel(searchQuery);
      window.ContactsView.renderContactsWorkspace(searchQuery);
      break;
    case 'org':
      if (window.OrgView) {
        window.OrgView.renderOrgSubPanel(searchQuery);
        window.OrgView.renderOrgWorkspace(searchQuery);
      }
      break;
    case 'board':
      window.BoardView.renderBoardSubPanel(searchQuery);
      window.BoardView.renderBoardWorkspace(searchQuery);
      break;
    case 'admin':
      if (window.AdminView) {
        window.AdminView.renderAdminSubPanel(searchQuery);
        window.AdminView.renderAdminWorkspace();
      }
      break;
  }
}

// Update badges on Sidebar Navigation Icons
function updateGlobalBadges() {
  const { state } = window.WorksState;
  const chatBadge = document.getElementById('chat-badge');
  const mailBadge = document.getElementById('mail-badge');
  const taskBadge = document.getElementById('task-badge');

  let totalUnreadChats = 0;
  
  state.channels.forEach(ch => {
    const chMsgs = state.chats.filter(m => m.channelId === ch.id);
    totalUnreadChats += chMsgs.filter(m => !m.readBy.includes(state.currentUser.id)).length;
  });
  
  state.users.forEach(u => {
    if (u.id === state.currentUser.id) return;
    const dmId = `dm-${Math.min(state.currentUser.id, u.id)}-${Math.max(state.currentUser.id, u.id)}`;
    const dmMsgs = state.chats.filter(m => m.channelId === dmId);
    totalUnreadChats += dmMsgs.filter(m => !m.readBy.includes(state.currentUser.id)).length;
  });

  if (totalUnreadChats > 0) {
    chatBadge.textContent = totalUnreadChats;
    chatBadge.style.display = 'block';
  } else {
    chatBadge.style.display = 'none';
  }

  const unreadMails = state.mails.filter(m => m.folder === 'inbox' && m.recipientIds.includes(state.currentUser.id) && !m.isRead).length;
  if (unreadMails > 0) {
    mailBadge.textContent = unreadMails;
    mailBadge.style.display = 'block';
  } else {
    mailBadge.style.display = 'none';
  }

  const pendingTasks = state.tasks.filter(t => t.assigneeId === state.currentUser.id && t.status !== 'completed').length;
  if (pendingTasks > 0) {
    taskBadge.textContent = pendingTasks;
    taskBadge.style.display = 'block';
  } else {
    taskBadge.style.display = 'none';
  }
}

// Profiles widget rendering in sidebar
function updateUserProfileDisplay() {
  const { state } = window.WorksState;
  if (!state.currentUser) return;
  activeUserAvatar.textContent = state.currentUser.name.slice(-2);
  activeUserAvatar.style.backgroundColor = state.currentUser.avatarColor || 'var(--primary-color)';
  activeUserStatus.className = `status-indicator ${state.currentUser.status}`;
}

// User switcher menu populator
function renderUserSwitcherList() {
  const { state, logout } = window.WorksState;
  const user = state.currentUser;
  if (!user) return;
  
  const gradeLabels = { Admin: '관리자', Employee: '일반 사원', Guest: '게스트' };
  const gradeLabel = gradeLabels[user.grade] || '일반 사원';
  
  let html = `
    <div style="padding: 12px 16px; border-bottom: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 8px;">
      <div style="display: flex; align-items: center; gap: 10px;">
        <div class="profile-menu-item-avatar" style="width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 50%; color: white; font-weight: 600; font-size: 0.85rem; background-color: ${user.avatarColor || 'var(--primary-color)'};">
          ${user.name.slice(-2)}
        </div>
        <div>
          <div style="font-weight: 700; font-size: 0.85rem; color: var(--text-main); line-height: 1.2;">${user.name} ${user.role}</div>
          <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 2px;">${user.dept}</div>
        </div>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
        <span class="badge-grade ${user.grade ? user.grade.toLowerCase() : 'employee'}" style="font-size: 0.65rem; padding: 2px 6px;">${gradeLabel}</span>
        <button id="logoutBtn" class="btn" style="padding: 4px 8px; font-size: 0.72rem; border-color: #ef4444; color: #ef4444; display: inline-flex; align-items: center; gap: 4px; background: none; cursor: pointer; border-radius: 6px;">
          <i data-lucide="log-out" style="width: 12px; height: 12px;"></i> 로그아웃
        </button>
      </div>
    </div>
  `;
  
  // Show quick switch account list at the bottom for easy evaluation
  html += `
    <div style="padding: 8px 16px 4px 16px; font-size: 0.7rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase;">계정 빠른 전환 (테스트용)</div>
    <div style="max-height: 150px; overflow-y: auto;">
  `;
  
  state.users.forEach(u => {
    if (u.isBot) return;
    const isCurrent = u.id === state.currentUser?.id;
    const initials = u.name.slice(-2);
    const checkIcon = isCurrent ? '<i data-lucide="check" style="width: 14px; height: 14px; color: var(--primary-color); margin-left: auto;"></i>' : '';
    
    html += `
      <div class="profile-menu-item" data-switch-to-user="${u.id}" style="padding: 6px 16px; display: flex; align-items: center; gap: 10px; cursor: pointer;">
        <div class="profile-menu-item-avatar" style="width: 26px; height: 26px; font-size: 0.7rem; display: flex; align-items: center; justify-content: center; border-radius: 50%; color: white; background-color: ${u.avatarColor || 'var(--primary-color)'};">
          ${initials}
        </div>
        <div class="profile-menu-item-info" style="flex: 1;">
          <div class="profile-menu-item-name" style="font-size: 0.8rem; font-weight: 600;">${u.name} ${u.role}</div>
          <div class="profile-menu-item-dept" style="font-size: 0.65rem; color: var(--text-muted);">${u.dept} (${gradeLabels[u.grade] || '사원'})</div>
        </div>
        ${checkIcon}
      </div>
    `;
  });
  
  html += '</div>';
  
  profileMenuList.innerHTML = html;
  lucide.createIcons();
  
  // Bind Logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      logout();
      window.location.reload();
    });
  }
  
  // Bind quick switcher click
  profileMenuList.querySelectorAll('[data-switch-to-user]').forEach(item => {
    item.addEventListener('click', () => {
      const targetUserId = Number(item.getAttribute('data-switch-to-user'));
      window.WorksState.switchUser(targetUserId);
      window.location.reload();
    });
  });
}

function updateThemeIcon() {
  const { state } = window.WorksState;
  if (state.theme === 'dark') {
    themeIcon.setAttribute('data-lucide', 'sun');
  } else {
    themeIcon.setAttribute('data-lucide', 'moon');
  }
  lucide.createIcons();
}

// --- AI Chatbot Panel Controller ---
let chatbotHistory = [
  { text: "안녕하세요! 저는 CC AI 비서입니다. 무엇이든 물어보세요! 🤖\n\n임직원 주소록, 할 일(Tasks), 캘린더 일정, 사내 공지사항, 메일 등 포탈 시스템의 실시간 정보를 바탕으로 답변해 드릴 수 있습니다.", isUser: false }
];
let isChatbotTyping = false;

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function parseMarkdown(text) {
  if (!text) return '';
  let html = text;
  
  // Escape HTML to prevent XSS
  html = escapeHtml(html);
  
  // Code blocks: ```code```
  html = html.replace(/```([\s\S]*?)```/g, '<pre style="background: var(--bg-app); padding: 10px; border-radius: 8px; font-family: monospace; font-size: 0.8rem; overflow-x: auto; margin: 8px 0; border: 1px solid var(--border-color); color: var(--text-main);"><code>$1</code></pre>');
  
  // Inline code: `code`
  html = html.replace(/`([^`]+)`/g, '<code style="background: var(--bg-app); padding: 2px 5px; border-radius: 4px; font-family: monospace; font-size: 0.8rem; border: 1px solid var(--border-color); color: var(--primary-color);">$1</code>');
  
  // Bold: **text**
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong style="font-weight: 700; color: var(--text-main);">$1</strong>');
  
  // Bullet lists: - item or * item
  html = html.replace(/^\s*[-*]\s+(.+)$/gm, '<li style="margin-left: 15px; margin-top: 4px; list-style-type: disc;">$1</li>');
  
  // Newlines to br
  html = html.replace(/\n/g, '<br>');
  
  return html;
}

function renderChatbotMessages() {
  const container = document.getElementById('chatbotMessagesList');
  if (!container) return;
  
  let html = '';
  chatbotHistory.forEach(msg => {
    const isUser = msg.isUser;
    html += `
      <div class="chatbot-msg-bubble-wrapper ${isUser ? 'user' : 'bot'}">
        ${!isUser ? `
          <div class="chatbot-msg-avatar bot" style="background-color: #10b981;">AI</div>
        ` : `
          <div class="chatbot-msg-avatar user" style="background-color: ${window.WorksState.state.currentUser?.avatarColor || 'var(--primary-color)'};">
            ${(window.WorksState.state.currentUser?.name || '나').slice(-2)}
          </div>
        `}
        <div class="chatbot-msg-bubble">
          ${isUser ? escapeHtml(msg.text).replace(/\n/g, '<br>') : parseMarkdown(msg.text)}
        </div>
      </div>
    `;
  });
  
  if (isChatbotTyping) {
    html += `
      <div class="chatbot-msg-bubble-wrapper bot">
        <div class="chatbot-msg-avatar bot" style="background-color: #10b981;">AI</div>
        <div class="chatbot-msg-bubble" style="padding: 10px 14px; display: flex; align-items: center;">
          <div class="typing-indicator" style="background: transparent; padding: 0;">
            <span class="typing-dot" style="background-color: var(--text-muted);"></span>
            <span class="typing-dot" style="background-color: var(--text-muted);"></span>
            <span class="typing-dot" style="background-color: var(--text-muted);"></span>
          </div>
        </div>
      </div>
    `;
  }
  
  container.innerHTML = html;
  container.scrollTop = container.scrollHeight;
  
  // Create icons for newly generated dynamic content if needed
  lucide.createIcons();
}

function updateChatbotUIState() {
  const setupView = document.getElementById('chatbotApiSetup');
  const chatView = document.getElementById('chatbotChatContainer');
  const statusText = document.getElementById('chatbotStatusText');
  
  if (!setupView || !chatView) return;
  
  const hasKey = window.GeminiService && window.GeminiService.hasApiKey();
  if (hasKey) {
    setupView.style.display = 'none';
    chatView.style.display = 'flex';
    if (statusText) statusText.textContent = 'Gemini 3.1 Flash';
  } else {
    setupView.style.display = 'flex';
    chatView.style.display = 'none';
    if (statusText) statusText.textContent = 'Gemini 연결 필요';
  }
}

function initChatbot() {
  const sidebarToggle = document.getElementById('sidebarChatbotToggleBtn');
  const floatingTrigger = document.getElementById('chatbotFloatingTrigger');
  const closeBtn = document.getElementById('closeChatbotBtn');
  const panel = document.getElementById('aiChatbotPanel');
  const sendBtn = document.getElementById('sendChatbotMsgBtn');
  const input = document.getElementById('chatbotInput');
  const suggestions = document.getElementById('chatbotSuggestions');
  
  if (!panel) return;

  // 1. Setup toggle state (default closed for clean floating widget experience)
  const wasOpen = localStorage.getItem('CHATBOT_PANEL_OPEN') === 'true';
  
  if (wasOpen) {
    panel.classList.remove('collapsed');
    if (sidebarToggle) sidebarToggle.classList.add('active');
    if (floatingTrigger) floatingTrigger.classList.add('active');
  } else {
    panel.classList.add('collapsed');
    if (sidebarToggle) sidebarToggle.classList.remove('active');
    if (floatingTrigger) floatingTrigger.classList.remove('active');
  }
  
  // Toggle click
  const togglePanel = () => {
    panel.classList.toggle('collapsed');
    const isOpen = !panel.classList.contains('collapsed');
    localStorage.setItem('CHATBOT_PANEL_OPEN', isOpen);
    if (isOpen) {
      if (sidebarToggle) sidebarToggle.classList.add('active');
      if (floatingTrigger) floatingTrigger.classList.add('active');
      renderChatbotMessages();
    } else {
      if (sidebarToggle) sidebarToggle.classList.remove('active');
      if (floatingTrigger) floatingTrigger.classList.remove('active');
    }
  };
  
  if (sidebarToggle) sidebarToggle.addEventListener('click', togglePanel);
  if (floatingTrigger) floatingTrigger.addEventListener('click', togglePanel);
  if (closeBtn) closeBtn.addEventListener('click', togglePanel);
  
  // Send message function
  const sendMessage = async () => {
    if (!window.GeminiService.hasApiKey()) {
      alert('Gemini API Key가 전역 설정에 저장되지 않았습니다. 관리자에게 문의하세요.');
      return;
    }
    const text = input.value.trim();
    if (!text) return;
    
    input.value = '';
    
    // Add to history
    chatbotHistory.push({ text: text, isUser: true });
    renderChatbotMessages();
    
    // Trigger typing state
    isChatbotTyping = true;
    renderChatbotMessages();
    
    try {
      const reply = await window.GeminiService.askChatbot(text, chatbotHistory);
      chatbotHistory.push({ text: reply, isUser: false });
    } catch (error) {
      console.error(error);
      chatbotHistory.push({ text: `에러가 발생했습니다: ${error.message}\n관리자가 등록한 API Key가 올바른지 확인해 보거나 네트워크 연결을 점검해 주세요.`, isUser: false });
    } finally {
      isChatbotTyping = false;
      renderChatbotMessages();
    }
  };
  
  // Input trigger
  if (sendBtn) sendBtn.addEventListener('click', sendMessage);
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
      }
    });
  }
  
  // Suggestion tags
  if (suggestions) {
    suggestions.querySelectorAll('.suggestion-tag').forEach(tag => {
      tag.addEventListener('click', () => {
        input.value = tag.textContent;
        sendMessage();
      });
    });
  }
  
  // 2. Initial state render
  updateChatbotUIState();
  renderChatbotMessages();
  
  // 3. Re-render chatbot header/avatar on switchUser or state changes
  window.addEventListener('statechanged', () => {
    updateChatbotUIState();
    renderChatbotMessages();
  });
}

// Expose routing globally so other views can link to modules easily
window.AppShell = {
  navigateTo
};

// Start Application
window.addEventListener('DOMContentLoaded', init);
