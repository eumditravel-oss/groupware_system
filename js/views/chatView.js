// Chat View Module (Global Namespace Version)

let isBotTyping = false;

function formatTime(isoString) {
  const date = new Date(isoString);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? '오후' : '오전';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${ampm} ${hours}:${minutes}`;
}

function renderChatSubPanel(searchQuery = '') {
  const { state, markChatAsRead, switchActiveChat } = window.WorksState;
  const listContainer = document.getElementById('subPanelList');
  const titleContainer = document.getElementById('subPanelTitle');
  
  titleContainer.textContent = '메시지';
  
  let html = '';
  html += `
    <div style="padding: 10px 20px 4px 20px; font-size: 0.75rem; font-weight: 700; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.5px; display: flex; justify-content: space-between; align-items: center;">
      <span>채널</span>
      <button id="btnCreateChannel" style="background: none; border: none; color: var(--primary-color); cursor: pointer; display: flex; align-items: center; padding: 2px;" title="단체방 추가">
        <i data-lucide="plus-circle" style="width: 16px; height: 16px;"></i>
      </button>
    </div>
  `;
  
  state.channels.forEach(channel => {
    // Only display custom channel if current user is in members list
    if (channel.members && !channel.members.includes(state.currentUser.id)) {
      return;
    }

    if (searchQuery.trim() !== '' && !channel.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return;
    }

    const isActive = state.activeChatId === channel.id ? 'active' : '';
    const channelMsgs = state.chats.filter(m => m.channelId === channel.id);
    const lastMsg = channelMsgs[channelMsgs.length - 1];
    const lastContent = lastMsg ? (lastMsg.attachment ? '📁 파일 첨부' : lastMsg.content) : '대화 기록이 없습니다.';
    const lastTime = lastMsg ? formatTime(lastMsg.timestamp) : '';
    
    const unreadCount = channelMsgs.filter(m => !m.readBy.includes(state.currentUser.id)).length;
    const badgeHtml = unreadCount > 0 ? `<span class="list-badge">${unreadCount}</span>` : '';

    html += `
      <div class="list-item ${isActive}" data-chat-id="${channel.id}">
        <div class="list-item-content">
          <div class="list-item-header">
            <span class="list-item-title"># ${channel.name}</span>
            <span class="list-item-time">${lastTime}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
            <span class="list-item-preview">${lastContent}</span>
            ${badgeHtml}
          </div>
        </div>
      </div>
    `;
  });

  html += `<div style="padding: 20px 20px 4px 20px; font-size: 0.75rem; font-weight: 700; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.5px;">1:1 대화</div>`;
  
  state.users.forEach(otherUser => {
    if (otherUser.id === state.currentUser.id) return;
    
    if (searchQuery.trim() !== '' && !otherUser.name.toLowerCase().includes(searchQuery.toLowerCase()) && !otherUser.dept.toLowerCase().includes(searchQuery.toLowerCase())) {
      return;
    }

    const dmId = `dm-${Math.min(state.currentUser.id, otherUser.id)}-${Math.max(state.currentUser.id, otherUser.id)}`;
    const isActive = state.activeChatId === dmId ? 'active' : '';

    const dmMsgs = state.chats.filter(m => m.channelId === dmId);
    const lastMsg = dmMsgs[dmMsgs.length - 1];
    const lastContent = lastMsg ? (lastMsg.attachment ? '📁 파일 첨부' : lastMsg.content) : '대화방이 개설되었습니다.';
    const lastTime = lastMsg ? formatTime(lastMsg.timestamp) : '';
    
    const unreadCount = dmMsgs.filter(m => !m.readBy.includes(state.currentUser.id)).length;
    const badgeHtml = unreadCount > 0 ? `<span class="list-badge">${unreadCount}</span>` : '';

    const statusLabels = {
      online: '온라인',
      busy: '다른 용무 중',
      away: '자리 비움',
      offline: '오프라인'
    };

    html += `
      <div class="list-item ${isActive}" data-chat-id="${dmId}">
        <div style="position: relative;">
          <div class="profile-avatar" style="width: 32px; height: 32px; font-size: 0.75rem; background-color: ${otherUser.avatarColor || 'var(--primary-color)'};">
            ${otherUser.name.slice(-2)}
          </div>
          <span class="status-indicator ${otherUser.status}" style="width: 8px; height: 8px; border-width: 1px;" title="${statusLabels[otherUser.status]}"></span>
        </div>
        <div class="list-item-content">
          <div class="list-item-header">
            <span class="list-item-title">${otherUser.name} ${otherUser.role}</span>
            <span class="list-item-time">${lastTime}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
            <span class="list-item-preview">${lastContent}</span>
            ${badgeHtml}
          </div>
        </div>
      </div>
    `;
  });

  listContainer.innerHTML = html;
  lucide.createIcons();

  const createChanBtn = document.getElementById('btnCreateChannel');
  if (createChanBtn) {
    createChanBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openCreateChannelModal();
    });
  }

  listContainer.querySelectorAll('[data-chat-id]').forEach(item => {
    item.addEventListener('click', () => {
      const chatId = item.getAttribute('data-chat-id');
      switchActiveChat(chatId);
      markChatAsRead(chatId, state.currentUser.id);
      
      renderChatSubPanel(searchQuery);
      renderChatWorkspace();
      
      window.dispatchEvent(new CustomEvent('statechanged'));
    });
  });
}

function renderChatWorkspace() {
  const { state, markChatAsRead, switchUser } = window.WorksState;
  const workspaceContainer = document.getElementById('viewBodyContainer');
  const headerTitle = document.getElementById('viewHeaderTitle');
  const headerSubtitle = document.getElementById('viewHeaderSubtitle');
  const headerActions = document.getElementById('viewHeaderActionsContainer');

  markChatAsRead(state.activeChatId, state.currentUser.id);

  let identityOptions = '';
  state.users.forEach(u => {
    if (u.isBot) return;
    const isMe = u.id === state.currentUser.id ? 'selected' : '';
    identityOptions += `<option value="${u.id}" ${isMe}>${u.name} ${u.role} (${u.dept})</option>`;
  });

  const isDM = state.activeChatId.startsWith('dm-');
  const channel = state.channels.find(c => c.id === state.activeChatId);
  const showInviteBtn = isDM || (channel && channel.id !== 'announcements');

  headerActions.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px;">
      ${showInviteBtn ? `
        <button class="btn btn-secondary" id="inviteChatMembersBtn" style="padding: 6px 12px; font-size: 0.8rem; display: flex; align-items: center; gap: 6px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-panel); cursor: pointer; color: var(--text-main); font-weight: 500;">
          <i data-lucide="user-plus" style="width: 14px; height: 14px;"></i>
          <span>초대하기</span>
        </button>
      ` : ''}
      <div class="identity-select-wrapper">
        <span>내 가상 ID:</span>
        <select class="identity-select" id="identitySwitcher">
          ${identityOptions}
        </select>
      </div>
    </div>
  `;

  lucide.createIcons();

  if (showInviteBtn) {
    document.getElementById('inviteChatMembersBtn').addEventListener('click', () => {
      openInviteMembersModal();
    });
  }

  document.getElementById('identitySwitcher').addEventListener('change', (e) => {
    const userId = Number(e.target.value);
    switchUser(userId);
    markChatAsRead(state.activeChatId, state.currentUser.id);
    
    // Safety check: if user is not a member of the current custom channel, redirect to announcements
    const updatedChannel = window.WorksState.state.channels.find(c => c.id === window.WorksState.state.activeChatId);
    if (updatedChannel && updatedChannel.members && !updatedChannel.members.includes(userId)) {
      window.WorksState.switchActiveChat('announcements');
    }
    
    window.dispatchEvent(new CustomEvent('statechanged'));
  });

  let chatTitle = '';
  let chatSubtitle = '';

  if (isDM) {
    const ids = state.activeChatId.split('-');
    const otherUserId = Number(ids[1]) === state.currentUser.id ? Number(ids[2]) : Number(ids[1]);
    const otherUser = state.users.find(u => u.id === otherUserId);
    
    if (otherUser) {
      chatTitle = `${otherUser.name} ${otherUser.role}`;
      chatSubtitle = `${otherUser.dept} • ${otherUser.statusMsg || ''}`;
    } else {
      chatTitle = '1:1 대화방';
      chatSubtitle = '사용자 정보 없음';
    }
  } else {
    if (channel) {
      chatTitle = `# ${channel.name}`;
      const memberCount = channel.members ? channel.members.length : state.users.filter(u => !u.isBot).length;
      chatSubtitle = `그룹 대화방 • 멤버 ${memberCount}명`;
    }
  }

  headerTitle.textContent = chatTitle;
  headerSubtitle.textContent = chatSubtitle;

  workspaceContainer.innerHTML = `
    <div class="chat-workspace">
      <div class="chat-message-list" id="chatMessageList">
        <!-- Rendered messages -->
      </div>
      
      <div class="chat-input-area">
        <div class="chat-input-actions">
          <button class="chat-action-btn" id="attachFileBtn" title="파일 첨부">
            <i data-lucide="paperclip"></i>
          </button>
          <button class="chat-action-btn" id="emojiBtn" title="이모티콘">
            <i data-lucide="smile"></i>
          </button>
          <button class="chat-action-btn" id="announceBtn" title="공지 등록">
            <i data-lucide="megaphone"></i>
          </button>
          <input type="file" id="chatFileInput" style="display: none;">
        </div>
        
        <div class="chat-input-row">
          <textarea class="chat-textarea" id="chatMessageInput" placeholder="메시지를 입력하세요 (전송: Enter, 줄바꿈: Shift + Enter)"></textarea>
          <button class="send-msg-btn" id="sendMsgBtn">
            <i data-lucide="send"></i>
          </button>
        </div>
      </div>
    </div>
  `;

  lucide.createIcons();

  renderMessages();
  setupChatInputs();
}

function renderMessages() {
  const { state } = window.WorksState;
  const msgList = document.getElementById('chatMessageList');
  if (!msgList) return;

  const activeChatMsgs = state.chats.filter(m => m.channelId === state.activeChatId);

  if (activeChatMsgs.length === 0) {
    msgList.innerHTML = `
      <div style="margin: auto; text-align: center; color: var(--text-light); padding: 40px;">
        <i data-lucide="message-square" style="width: 48px; height: 48px; margin-bottom: 12px; opacity: 0.5;"></i>
        <p>새로운 대화를 시작해 보세요.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  let html = '';
  activeChatMsgs.forEach(msg => {
    const sender = state.users.find(u => u.id === msg.senderId) || { name: '알수없음', role: '', dept: '', avatarColor: '#94a3b8' };
    const isMe = msg.senderId === state.currentUser.id;
    const initials = sender.name.slice(-2);
    
    let unreadCount = 0;
    if (state.activeChatId.startsWith('dm-')) {
      const ids = state.activeChatId.split('-');
      const otherUserId = Number(ids[1]) === state.currentUser.id ? Number(ids[2]) : Number(ids[1]);
      unreadCount = msg.readBy.includes(otherUserId) ? 0 : 1;
    } else {
      const groupUsers = state.users.filter(u => !u.isBot);
      const totalGroupMembers = groupUsers.length;
      const readMembers = msg.readBy.filter(id => groupUsers.some(u => u.id === id)).length;
      unreadCount = totalGroupMembers - readMembers;
    }
    
    const unreadHtml = unreadCount > 0 ? `<span class="message-read-receipt">${unreadCount}</span>` : '';

    let attachHtml = '';
    if (msg.attachment) {
      attachHtml = `
        <div style="margin-top: 8px; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); background-color: var(--bg-panel); display: flex; align-items: center; gap: 10px; max-width: 300px; cursor: pointer;" title="다운로드 시뮬레이션">
          <i data-lucide="file-text" style="color: var(--primary-color); width: 24px; height: 24px;"></i>
          <div style="flex: 1; min-width: 0; font-size: 0.8rem;">
            <div style="font-weight: 600; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; color: var(--text-main);">${msg.attachment.name}</div>
            <div style="color: var(--text-muted); font-size: 0.7rem;">${msg.attachment.size}</div>
          </div>
          <i data-lucide="download" style="width: 14px; height: 14px; color: var(--text-muted);"></i>
        </div>
      `;
    }

    // Translation HTML rendering
    let translationHtml = '';
    if (msg.translation) {
      const isMyMessage = isMe;
      const themeColor = isMyMessage ? 'var(--text-my-message)' : 'var(--primary-color)';
      const dashBorderColor = isMyMessage ? 'var(--border-my-message-dash)' : 'rgba(0,0,0,0.15)';
      
      translationHtml = `
        <div class="message-translation" style="margin-top: 8px; padding-top: 8px; border-top: 1px dashed ${dashBorderColor}; font-size: 0.85em; opacity: 0.95; white-space: pre-wrap;">
          <div style="display: flex; align-items: center; gap: 4px; color: ${themeColor}; font-weight: 600; margin-bottom: 2px;">
            <i data-lucide="globe" style="width: 12px; height: 12px;"></i>
            <span>번역 (Translation)</span>
          </div>
          <div>${msg.translation}</div>
        </div>
      `;
    } else if (msg.translationPending) {
      translationHtml = `
        <div class="message-translation-pending" style="margin-top: 6px; font-size: 0.75rem; opacity: 0.7; display: flex; align-items: center; gap: 6px;">
          <span class="translation-spinner" style="display: inline-block; width: 10px; height: 10px; border: 2px solid currentColor; border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite;"></span>
          <span>번역 중...</span>
        </div>
      `;
    } else if (window.GeminiService && window.GeminiService.hasApiKey() && msg.content && !msg.attachment && !msg.content.startsWith('📢 [공지')) {
      translationHtml = `
        <div>
          <button class="translate-bubble-btn" data-translate-msg-id="${msg.id}">
            <i data-lucide="globe" style="width: 11px; height: 11px;"></i>
            <span>번역하기</span>
          </button>
        </div>
      `;
    }

    html += `
      <div class="message-bubble-wrapper ${isMe ? 'my-message' : 'other-message'}">
        ${!isMe ? `
          <div class="message-avatar" style="background-color: ${sender.avatarColor || 'var(--primary-color)'};">
            ${initials}
          </div>
        ` : ''}
        
        <div class="message-content-box">
          ${!isMe ? `
            <div class="message-meta-name">
              ${sender.name} ${sender.role} <span class="message-meta-dept">${sender.dept}</span>
            </div>
          ` : ''}
          
          <div style="display: flex; gap: 6px; flex-direction: ${isMe ? 'row-reverse' : 'row'}; align-items: flex-end;">
            <div class="message-bubble">
              <div>${msg.content}</div>
              ${attachHtml}
              ${translationHtml}
            </div>
            
            <div class="message-side-info">
              ${unreadHtml}
              <span>${formatTime(msg.timestamp)}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  if (isBotTyping) {
    html += `
      <div class="message-bubble-wrapper other-message">
        <div class="message-avatar" style="background-color: #10b981;">
          AI
        </div>
        <div class="message-content-box">
          <div class="message-meta-name">
            CONCOST 봇 <span class="message-meta-dept">시스템</span>
          </div>
          <div class="typing-indicator">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
          </div>
        </div>
      </div>
    `;
  }

  msgList.innerHTML = html;
  lucide.createIcons();
  
  // Bind manual translation click listeners
  msgList.querySelectorAll('[data-translate-msg-id]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const msgId = btn.getAttribute('data-translate-msg-id');
      const targetMsg = state.chats.find(m => m.id === msgId);
      if (targetMsg) {
        targetMsg.translationPending = true;
        renderMessages();
        window.GeminiService.translateText(targetMsg.content)
          .then(translatedText => {
            targetMsg.translation = translatedText;
            targetMsg.translationPending = false;
            window.WorksState.saveState();
            renderMessages();
          })
          .catch(err => {
            console.error('Manual translation failed:', err);
            targetMsg.translationPending = false;
            targetMsg.translationError = true;
            window.WorksState.saveState();
            renderMessages();
          });
      }
    });
  });

  msgList.scrollTop = msgList.scrollHeight;
}

function setupChatInputs() {
  const { state } = window.WorksState;
  const textarea = document.getElementById('chatMessageInput');
  const sendBtn = document.getElementById('sendMsgBtn');
  const fileBtn = document.getElementById('attachFileBtn');
  const fileInput = document.getElementById('chatFileInput');
  const announceBtn = document.getElementById('announceBtn');
  const emojiBtn = document.getElementById('emojiBtn');

  if (!textarea) return;

  textarea.addEventListener('input', () => {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  });

  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      triggerSendMessage();
    }
  });

  sendBtn.addEventListener('click', triggerSendMessage);
  fileBtn.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      const fileSizeStr = file.size > 1024 * 1024 
        ? (file.size / (1024 * 1024)).toFixed(1) + ' MB' 
        : (file.size / 1024).toFixed(0) + ' KB';
        
      window.WorksState.addMessage(state.activeChatId, state.currentUser.id, `파일을 업로드했습니다: ${file.name}`, {
        name: file.name,
        size: fileSizeStr,
        type: file.type
      });

      fileInput.value = '';
      renderMessages();
      renderChatSubPanel();
      triggerBotResponse(`파일을 전송하셨네요! ${file.name} (${fileSizeStr}) 파일을 성공적으로 마감검토 대기열에 업로드 완료했습니다.`);
    }
  });

  announceBtn.addEventListener('click', () => {
    const text = prompt('공지사항으로 등록할 메시지를 입력해 주세요:');
    if (text && text.trim() !== '') {
      window.WorksState.addMessage(state.activeChatId, state.currentUser.id, `📢 [공지 등록] ${text}`);
      renderMessages();
      renderChatSubPanel();
    }
  });

  emojiBtn.addEventListener('click', () => {
    const emojis = ['😀', '👍', '🙏', '🎉', '🔥', '💻', '💡', '✅', '❤️', '😱'];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    textarea.value += emoji;
    textarea.focus();
  });
}

function triggerSendMessage() {
  const { state, addMessage } = window.WorksState;
  const textarea = document.getElementById('chatMessageInput');
  if (!textarea) return;

  const content = textarea.value.trim();
  if (content === '') return;

  addMessage(state.activeChatId, state.currentUser.id, content);
  textarea.value = '';
  textarea.style.height = '48px';

  renderMessages();
  renderChatSubPanel();

  window.dispatchEvent(new CustomEvent('statechanged'));

  const isChattingWithBot = state.activeChatId.includes('-6') || state.activeChatId.split('-').includes('6');
  if (isChattingWithBot) {
    triggerBotResponse(content);
  }
}

function triggerBotResponse(userMsg) {
  const { state, addMessage } = window.WorksState;
  isBotTyping = true;
  renderMessages();

  let reply = '안녕하세요! 네웍스 봇입니다. 🤖 무엇을 도와드릴까요?';
  const q = userMsg.toLowerCase();

  if (q.includes('안녕') || q.includes('하이') || q.includes('hello')) {
    reply = `안녕하세요, ${state.currentUser.name} ${state.currentUser.role}님! 오늘도 힘찬 하루 보내세요. 💪`;
  } else if (q.includes('시간') || q.includes('몇 시')) {
    const now = new Date();
    reply = `현재 시각은 ${now.toLocaleTimeString('ko-KR')} 입니다.`;
  } else if (q.includes('날씨')) {
    reply = '오늘 마감검토를 진행하기 완벽하게 맑고 선선한 날씨입니다! ☀️ (온도: 22°C)';
  } else if (q.includes('마감') || q.includes('검토') || q.includes('정산')) {
    reply = '마감 검토 시스템 2분기 화면이 준비되었습니다. 상단 [할 일]이나 [캘린더] 탭에서 이번 주 정산 및 보고 스케줄을 확인해 주시기 바랍니다. 📋';
  } else if (q.includes('개발')) {
    reply = '개발팀 마감 검토 UI 시안은 김민준 대리님이 열심히 Vanilla CSS와 HTML로 퍼블리싱을 마치셨습니다! 아주 부드럽고 가볍게 작동해요. 🚀';
  } else if (q.includes('농담') || q.includes('유머') || q.includes('심심')) {
    const jokes = [
      '컴퓨터가 왜 피곤해하는지 아시나요? 맥(Mac)이 없어서 그렇대요! 😆',
      '코딩하는 사람들이 가장 좋아하는 우유는 무엇일까요? 바로... "에스프레소 스팀 밀크"! ☕',
      '개발자가 왜 퇴사를 하지 못하는지 아세요? "C"언어가 마음에 들어서랍니다! 💻'
    ];
    reply = jokes[Math.floor(Math.random() * jokes.length)];
  } else {
    reply = `"${userMsg}" 라고 물어보셨군요. 마감검토 포탈 클론에서는 실시간 챗봇 상담 기능이 가동 중입니다. 무엇이든 도와드릴 수 있도록 개발 중입니다! 🛠️`;
  }

  setTimeout(() => {
    isBotTyping = false;
    addMessage(state.activeChatId, 6, reply);
    renderMessages();
    renderChatSubPanel();
    window.dispatchEvent(new CustomEvent('statechanged'));
  }, 1200);
}

// Expose globally
window.ChatView = {
  renderChatSubPanel,
  renderChatWorkspace
};

// --- Group Chat Creation and Member Invitation Modals Logic ---

function openCreateChannelModal() {
  const { state } = window.WorksState;
  const modal = document.getElementById('channelModal');
  const container = document.getElementById('channelMembersContainer');
  const form = document.getElementById('channelForm');
  
  if (!modal || !container || !form) return;
  
  form.reset();
  
  // Populate checkbox list of users (excluding current user and bots)
  let checkboxesHtml = '';
  state.users.forEach(u => {
    if (u.isBot || u.id === state.currentUser.id) return;
    checkboxesHtml += `
      <label style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: var(--text-main); cursor: pointer; padding: 6px 0; border-bottom: 1px dashed var(--border-color);">
        <input type="checkbox" name="invitedUsers" value="${u.id}" style="width: 16px; height: 16px; border-radius: 4px; cursor: pointer;">
        <span style="font-weight: 500;">${u.name} ${u.role}</span>
        <span style="font-size: 0.75rem; color: var(--text-muted);">(${u.dept})</span>
      </label>
    `;
  });
  container.innerHTML = checkboxesHtml;
  
  modal.classList.add('active');
}

function initChannelModalsOnce() {
  const modal = document.getElementById('channelModal');
  const closeBtn = document.getElementById('closeChannelModalBtn');
  const cancelBtn = document.getElementById('cancelChannelBtn');
  const form = document.getElementById('channelForm');
  
  if (!modal) return;
  
  const closeModal = () => modal.classList.remove('active');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
  
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const { state } = window.WorksState;
      const nameInput = document.getElementById('channelNameInput');
      const channelName = nameInput.value.trim();
      if (!channelName) return;
      
      const checkedBoxes = form.querySelectorAll('input[name="invitedUsers"]:checked');
      const selectedMemberIds = Array.from(checkedBoxes).map(cb => Number(cb.value));
      
      // Always include current user as member
      selectedMemberIds.push(state.currentUser.id);
      
      // Create new channel
      const newChannelId = 'channel-' + Date.now();
      const newChannel = {
        id: newChannelId,
        name: channelName,
        isGroup: true,
        icon: 'users',
        members: selectedMemberIds,
        createdBy: state.currentUser.id
      };
      
      state.channels.push(newChannel);
      
      // Add first notice message to the channel
      const memberNames = selectedMemberIds.map(id => {
        const u = state.users.find(user => user.id === id);
        return u ? `${u.name} ${u.role}` : '';
      }).filter(n => n).join(', ');
      
      window.WorksState.addMessage(newChannelId, state.currentUser.id, `📢 [알림] ${state.currentUser.name}님이 대화방을 개설했습니다. (참여자: ${memberNames})`);
      
      window.WorksState.switchActiveChat(newChannelId);
      window.WorksState.saveState();
      
      closeModal();
      
      // Re-render chat UI
      renderChatSubPanel();
      renderChatWorkspace();
      
      window.dispatchEvent(new CustomEvent('statechanged'));
    });
  }
}

function openInviteMembersModal() {
  const { state } = window.WorksState;
  const modal = document.getElementById('inviteModal');
  const container = document.getElementById('inviteMembersContainer');
  const form = document.getElementById('inviteForm');
  
  if (!modal || !container || !form) return;
  
  form.reset();
  
  const isDM = state.activeChatId.startsWith('dm-');
  let currentMembers = [];
  
  if (isDM) {
    const ids = state.activeChatId.split('-');
    const otherUserId = Number(ids[1]) === state.currentUser.id ? Number(ids[2]) : Number(ids[1]);
    currentMembers = [state.currentUser.id, otherUserId];
  } else {
    const channel = state.channels.find(c => c.id === state.activeChatId);
    currentMembers = channel.members || state.users.map(u => u.id);
  }
  
  const inviteGroupNameGroup = document.getElementById('inviteGroupNameGroup');
  const inviteGroupNameInput = document.getElementById('inviteGroupNameInput');
  if (inviteGroupNameGroup && inviteGroupNameInput) {
    if (isDM) {
      inviteGroupNameGroup.style.display = 'block';
      inviteGroupNameInput.setAttribute('required', 'required');
      inviteGroupNameInput.value = '';
    } else {
      inviteGroupNameGroup.style.display = 'none';
      inviteGroupNameInput.removeAttribute('required');
      inviteGroupNameInput.value = '';
    }
  }
  window._inviteGroupNameManuallyEdited = false;
  
  // Populate checkbox list of users not already in the room
  let checkboxesHtml = '';
  state.users.forEach(u => {
    if (u.isBot || currentMembers.includes(u.id)) return;
    checkboxesHtml += `
      <label style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: var(--text-main); cursor: pointer; padding: 6px 0; border-bottom: 1px dashed var(--border-color);">
        <input type="checkbox" name="invitedMembers" value="${u.id}" style="width: 16px; height: 16px; border-radius: 4px; cursor: pointer;">
        <span style="font-weight: 500;">${u.name} ${u.role}</span>
        <span style="font-size: 0.75rem; color: var(--text-muted);">(${u.dept})</span>
      </label>
    `;
  });
  
  if (checkboxesHtml === '') {
    container.innerHTML = `<div style="text-align: center; color: var(--text-muted); font-size: 0.85rem; padding: 20px 0;">초대 가능한 다른 임직원이 없습니다.</div>`;
  } else {
    container.innerHTML = checkboxesHtml;
  }
  
  modal.classList.add('active');
}

function initInviteModalsOnce() {
  const modal = document.getElementById('inviteModal');
  const closeBtn = document.getElementById('closeInviteModalBtn');
  const cancelBtn = document.getElementById('cancelInviteBtn');
  const form = document.getElementById('inviteForm');
  
  if (!modal) return;
  
  const closeModal = () => modal.classList.remove('active');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
  
  const inviteGroupNameInput = document.getElementById('inviteGroupNameInput');
  if (inviteGroupNameInput) {
    inviteGroupNameInput.addEventListener('input', () => {
      window._inviteGroupNameManuallyEdited = true;
    });
  }
  
  const inviteContainer = document.getElementById('inviteMembersContainer');
  if (inviteContainer) {
    inviteContainer.addEventListener('change', () => {
      if (window._inviteGroupNameManuallyEdited) return;
      const { state } = window.WorksState;
      if (!state.activeChatId || !state.activeChatId.startsWith('dm-')) return;
      const groupNameInput = document.getElementById('inviteGroupNameInput');
      if (!groupNameInput) return;
      
      const checkedBoxes = form.querySelectorAll('input[name="invitedMembers"]:checked');
      const selectedMemberIds = Array.from(checkedBoxes).map(cb => Number(cb.value));
      if (selectedMemberIds.length === 0) {
        groupNameInput.value = '';
        return;
      }
      const ids = state.activeChatId.split('-');
      const otherUserId = Number(ids[1]) === state.currentUser.id ? Number(ids[2]) : Number(ids[1]);
      const originalMembers = [state.currentUser.id, otherUserId];
      const allMembers = [...originalMembers, ...selectedMemberIds];
      
      const memberNames = allMembers.map(id => {
        const u = state.users.find(user => user.id === id);
        return u ? u.name : '';
      }).filter(n => n);
      
      const generatedName = memberNames.slice(0, 3).join(', ') + (memberNames.length > 3 ? ` 외 ${memberNames.length - 3}명` : '');
      groupNameInput.value = generatedName;
    });
  }
  
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const { state } = window.WorksState;
      const checkedBoxes = form.querySelectorAll('input[name="invitedMembers"]:checked');
      const selectedMemberIds = Array.from(checkedBoxes).map(cb => Number(cb.value));
      if (selectedMemberIds.length === 0) {
        closeModal();
        return;
      }
      
      const isDM = state.activeChatId.startsWith('dm-');
      
      if (isDM) {
        // Create new group room out of DM + new participants
        const ids = state.activeChatId.split('-');
        const otherUserId = Number(ids[1]) === state.currentUser.id ? Number(ids[2]) : Number(ids[1]);
        const originalMembers = [state.currentUser.id, otherUserId];
        const allMembers = [...originalMembers, ...selectedMemberIds];
        
        // Generate auto name suggestion from members
        const memberNames = allMembers.map(id => {
          const u = state.users.find(user => user.id === id);
          return u ? u.name : '';
        }).filter(n => n);
        
        const generatedName = memberNames.slice(0, 3).join(', ') + (memberNames.length > 3 ? ` 외 ${memberNames.length - 3}명` : '');
        const groupNameInput = document.getElementById('inviteGroupNameInput');
        const finalName = groupNameInput && groupNameInput.value.trim() ? groupNameInput.value.trim() : generatedName;
        
        const newChannelId = 'channel-' + Date.now();
        const newChannel = {
          id: newChannelId,
          name: finalName,
          isGroup: true,
          icon: 'users',
          members: allMembers,
          createdBy: state.currentUser.id
        };
        
        state.channels.push(newChannel);
        
        // Add welcome warning notice
        const inviteeNamesStr = selectedMemberIds.map(id => {
          const u = state.users.find(user => user.id === id);
          return u ? `${u.name} ${u.role}` : '';
        }).filter(n => n).join(', ');
        
        window.WorksState.addMessage(newChannelId, state.currentUser.id, `📢 [알림] ${state.currentUser.name}님이 1:1 대화 도중 새로운 임직원을 초대하여 단체방을 개설했습니다. (초대된 멤버: ${inviteeNamesStr})`);
        
        window.WorksState.switchActiveChat(newChannelId);
        window.WorksState.saveState();
        
        closeModal();
        
        renderChatSubPanel();
        renderChatWorkspace();
      } else {
        // Add to existing channel members
        const channel = state.channels.find(c => c.id === state.activeChatId);
        if (channel) {
          if (!channel.members) {
            // Public channel initialization fallback
            channel.members = state.users.map(u => u.id);
          }
          
          selectedMemberIds.forEach(id => {
            if (!channel.members.includes(id)) {
              channel.members.push(id);
            }
          });
          
          const inviteeNamesStr = selectedMemberIds.map(id => {
            const u = state.users.find(user => user.id === id);
            return u ? `${u.name} ${u.role}` : '';
          }).filter(n => n).join(', ');
          
          window.WorksState.addMessage(channel.id, state.currentUser.id, `📢 [알림] ${state.currentUser.name}님이 새로운 멤버를 대화방에 초대했습니다. (초대된 멤버: ${inviteeNamesStr})`);
          window.WorksState.saveState();
          
          closeModal();
          renderChatWorkspace();
        }
      }
      
      window.dispatchEvent(new CustomEvent('statechanged'));
    });
  }
}

// Bind modal triggers on DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initChannelModalsOnce();
    initInviteModalsOnce();
  });
} else {
  initChannelModalsOnce();
  initInviteModalsOnce();
}
