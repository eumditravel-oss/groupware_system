// Board View Module (Global Namespace Version)

let activeBoardType = 'all'; // 'all', 'notice', 'collab'
let activePostDetailId = null;

function formatRelativeTime(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / (60 * 1000));
  const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

  if (diffMins < 1) return '방금 전';
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function renderBoardSubPanel(searchQuery = '') {
  const { state } = window.WorksState;
  const listContainer = document.getElementById('subPanelList');
  const titleContainer = document.getElementById('subPanelTitle');
  
  titleContainer.textContent = '게시판';

  let html = `
    <div style="padding: 10px 20px 4px 20px; font-size: 0.75rem; font-weight: 700; color: var(--text-light); text-transform: uppercase;">게시판 분류</div>
    
    <div class="list-item ${activeBoardType === 'all' ? 'active' : ''}" data-board-type="all">
      <div class="list-item-content">
        <div class="list-item-header">
          <span class="list-item-title"><i data-lucide="layout" style="width:14px; height:14px; margin-right:8px; vertical-align:middle;"></i>전체 게시판</span>
          <span class="list-badge">${state.posts.length}</span>
        </div>
      </div>
    </div>
    
    <div class="list-item ${activeBoardType === 'notice' ? 'active' : ''}" data-board-type="notice">
      <div class="list-item-content">
        <div class="list-item-header">
          <span class="list-item-title"><i data-lucide="megaphone" style="width:14px; height:14px; margin-right:8px; vertical-align:middle;"></i>사내 공지사항</span>
        </div>
      </div>
    </div>
    
    <div class="list-item ${activeBoardType === 'collab' ? 'active' : ''}" data-board-type="collab">
      <div class="list-item-content">
        <div class="list-item-header">
          <span class="list-item-title"><i data-lucide="share-2" style="width:14px; height:14px; margin-right:8px; vertical-align:middle;"></i>업무 공유 게시판</span>
        </div>
      </div>
    </div>
  `;
  
  listContainer.innerHTML = html;
  lucide.createIcons();

  listContainer.querySelectorAll('[data-board-type]').forEach(item => {
    item.addEventListener('click', () => {
      activeBoardType = item.getAttribute('data-board-type');
      renderBoardSubPanel(searchQuery);
      renderBoardWorkspace(searchQuery);
    });
  });
}

function renderBoardWorkspace(searchQuery = '') {
  const workspaceContainer = document.getElementById('viewBodyContainer');
  const headerTitle = document.getElementById('viewHeaderTitle');
  const headerSubtitle = document.getElementById('viewHeaderSubtitle');
  const headerActions = document.getElementById('viewHeaderActionsContainer');
  const { state } = window.WorksState;

  headerTitle.textContent = activeBoardType === 'all' 
    ? '전체 사내 게시판' 
    : (activeBoardType === 'notice' ? '사내 공지사항' : '업무 공유 게시판');
    
  headerSubtitle.textContent = '부서 간 정보 교류 및 공식 공지사항 공유 채널';

  headerActions.innerHTML = `
    <button class="btn btn-primary" id="openBoardModalBtn">
      <i data-lucide="plus"></i> 글 쓰기
    </button>
  `;
  lucide.createIcons();

  let filteredPosts = state.posts;
  if (activeBoardType === 'notice') {
    filteredPosts = filteredPosts.filter(p => p.title.includes('📢') || p.title.includes('공지'));
  } else if (activeBoardType === 'collab') {
    filteredPosts = filteredPosts.filter(p => !p.title.includes('📢') && !p.title.includes('공지'));
  }

  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase().trim();
    filteredPosts = filteredPosts.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.content.toLowerCase().includes(q)
    );
  }

  workspaceContainer.innerHTML = `
    <div class="board-container" id="boardPostsContainer">
      <!-- Rendered post cards -->
    </div>
  `;

  renderPostCards(filteredPosts);
  setupBoardPostActions();
}

function renderPostCards(posts) {
  const { state, incrementPostViews } = window.WorksState;
  const container = document.getElementById('boardPostsContainer');
  if (!container) return;

  if (posts.length === 0) {
    container.innerHTML = `
      <div style="padding: 40px; text-align: center; color: var(--text-light);">
        <i data-lucide="layout-list" style="width: 48px; height: 48px; margin-bottom: 10px; opacity: 0.5;"></i>
        <p>게시글이 없습니다.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  let html = '';
  posts.forEach(post => {
    const author = state.users.find(u => u.id === post.authorId) || { name: '알수없음', role: '', dept: '', avatarColor: '#94a3b8' };
    const initials = author.name.slice(-2);
    const timeStr = formatRelativeTime(post.timestamp);
    const commentCount = post.comments.length;

    html += `
      <div class="board-post-card" data-post-id="${post.id}">
        <div class="board-post-header">
          <div class="board-post-meta">
            <div class="board-post-author-avatar" style="background-color: ${author.avatarColor || 'var(--primary-color)'};">
              ${initials}
            </div>
            <div>
              <strong>${author.name} ${author.role}</strong>
              <span style="margin: 0 4px; color: var(--text-light);">•</span>
              <span>${author.dept}</span>
            </div>
          </div>
          <span style="font-size: 0.8rem; color: var(--text-muted);">${timeStr}</span>
        </div>
        
        <h4 class="board-post-title">${post.title}</h4>
        <div class="board-post-content">${post.content}</div>
        
        <div class="board-post-footer">
          <span style="display: flex; align-items: center; gap: 4px;"><i data-lucide="eye" style="width:14px; height:14px;"></i> 조회수 ${post.views}</span>
          <span style="display: flex; align-items: center; gap: 4px;"><i data-lucide="message-square" style="width:14px; height:14px;"></i> 댓글 ${commentCount}</span>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  lucide.createIcons();

  container.querySelectorAll('[data-post-id]').forEach(card => {
    card.addEventListener('click', () => {
      const postId = card.getAttribute('data-post-id');
      incrementPostViews(postId);
      openPostDrawer(postId);
      renderBoardSubPanel();
      renderPostCards(posts);
    });
  });
}

function openPostDrawer(postId) {
  activePostDetailId = postId;
  const { state } = window.WorksState;
  const drawer = document.getElementById('postDetailDrawer');
  const post = state.posts.find(p => p.id === postId);
  
  if (!post || !drawer) return;

  const author = state.users.find(u => u.id === post.authorId) || { name: '알수없음', role: '', dept: '', avatarColor: '#94a3b8' };
  const initials = author.name.slice(-2);
  const dateStr = new Date(post.timestamp).toLocaleString('ko-KR');

  const drawerBody = document.getElementById('postDrawerBody');
  drawerBody.innerHTML = `
    <div class="post-detail-title">${post.title}</div>
    <div class="post-detail-meta">
      <div class="board-post-author-avatar" style="background-color: ${author.avatarColor || 'var(--primary-color)'};">
        ${initials}
      </div>
      <div>
        <div><strong>${author.name} ${author.role}</strong> (${author.dept})</div>
        <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">게시일: ${dateStr} • 조회수 ${post.views}</div>
      </div>
    </div>
    <div class="post-detail-body">${post.content}</div>
  `;

  renderComments();
  
  drawer.style.display = 'flex';
  document.getElementById('commentText').focus();
}

function renderComments() {
  const { state } = window.WorksState;
  const commentContainer = document.getElementById('postDrawerComments');
  const post = state.posts.find(p => p.id === activePostDetailId);
  if (!post || !commentContainer) return;

  const titleHeader = document.getElementById('drawerPostHeader');
  titleHeader.textContent = `댓글 (${post.comments.length})`;

  if (post.comments.length === 0) {
    commentContainer.innerHTML = `
      <div style="text-align: center; color: var(--text-light); font-size: 0.8rem; padding: 20px 0;">
        첫 번째 댓글을 달아주세요!
      </div>
    `;
    return;
  }

  let html = '';
  post.comments.forEach(comment => {
    const author = state.users.find(u => u.id === comment.authorId) || { name: '알수없음', role: '', avatarColor: '#94a3b8' };
    const initials = author.name.slice(-2);
    const timeStr = formatRelativeTime(comment.timestamp);

    html += `
      <div class="comment-item">
        <div class="comment-avatar" style="background-color: ${author.avatarColor || 'var(--primary-color)'};">
          ${initials}
        </div>
        <div class="comment-box">
          <div class="comment-meta">
            <span>${author.name} ${author.role}</span>
            <span style="font-weight: 400; color: var(--text-light);">${timeStr}</span>
          </div>
          <div class="comment-content">${comment.content}</div>
        </div>
      </div>
    `;
  });

  commentContainer.innerHTML = html;
}

function closePostDrawer() {
  const drawer = document.getElementById('postDetailDrawer');
  if (drawer) {
    drawer.style.display = 'none';
    activePostDetailId = null;
  }
}

function setupBoardPostActions() {
  const { state, addPost, addComment } = window.WorksState;
  const openModalBtn = document.getElementById('openBoardModalBtn');
  const closeModalBtn = document.getElementById('closeBoardModalBtn');
  const cancelBtn = document.getElementById('cancelBoardPostBtn');
  const modal = document.getElementById('boardModal');
  const form = document.getElementById('boardForm');

  const closeDrawerBtn = document.getElementById('closePostDrawerBtn');
  const commentForm = document.getElementById('commentForm');

  if (!openModalBtn) return;

  openModalBtn.addEventListener('click', () => {
    if (state.currentUser?.grade === 'Guest') {
      alert('게스트 권한은 게시글을 작성할 수 없습니다.');
      return;
    }
    form.reset();
    modal.classList.add('active');
  });

  const closeModal = () => {
    modal.classList.remove('active');
  };

  closeModalBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);

  form.onsubmit = (e) => {
    e.preventDefault();
    if (state.currentUser?.grade === 'Guest') {
      alert('게스트 권한은 게시글을 작성할 수 없습니다.');
      return;
    }
    const title = document.getElementById('boardPostTitle').value;
    const content = document.getElementById('boardPostContent').value;

    addPost(title, content);
    closeModal();
    
    renderBoardSubPanel();
    renderBoardWorkspace();
  };

  closeDrawerBtn.addEventListener('click', closePostDrawer);

  commentForm.onsubmit = (e) => {
    e.preventDefault();
    if (state.currentUser?.grade === 'Guest') {
      alert('게스트 권한은 댓글을 작성할 수 없습니다.');
      return;
    }
    const textInput = document.getElementById('commentText');
    const text = textInput.value.trim();
    
    if (text === '' || !activePostDetailId) return;

    addComment(activePostDetailId, text);
    textInput.value = '';

    renderComments();
    
    let filteredPosts = state.posts;
    if (activeBoardType === 'notice') {
      filteredPosts = filteredPosts.filter(p => p.title.includes('📢') || p.title.includes('공지'));
    } else if (activeBoardType === 'collab') {
      filteredPosts = filteredPosts.filter(p => !p.title.includes('📢') && !p.title.includes('공지'));
    }
    renderPostCards(filteredPosts);
  };
}

// Expose globally
window.BoardView = {
  renderBoardSubPanel,
  renderBoardWorkspace,
  closePostDrawer
};
