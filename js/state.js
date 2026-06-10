// Naver Works Messenger State Management (Global Namespace Version)

const STORAGE_KEY = 'CONCOST_WORKS_STATE';

const DEFAULT_USERS = [
  { id: 1, name: '김민준', role: '대리', dept: '개발팀', status: 'online', statusMsg: '오늘도 화이팅! 💻', email: 'mj.kim@work.com', phone: '010-1234-5678', avatarColor: '#00c73c', grade: 'Employee', password: '1234', empNo: 'CC-099' },
  { id: 2, name: '이서연', role: '과장', dept: '마케팅팀', status: 'online', statusMsg: '회의 중입니다.', email: 'sy.lee@work.com', phone: '010-2345-6789', avatarColor: '#3b82f6', grade: 'Employee', password: '1234', empNo: 'CC-098' },
  { id: 3, name: '박지훈', role: '팀장', dept: '개발팀', status: 'busy', statusMsg: '급한 건은 전화 주세요.', email: 'jh.park@work.com', phone: '010-3456-7890', avatarColor: '#f59e0b', grade: 'Admin', password: '1234', empNo: 'CC-097' },
  { id: 4, name: '정우진', role: '사원', dept: '인사팀', status: 'away', statusMsg: '자리 비움 (문서 작업)', email: 'wj.jung@work.com', phone: '010-4567-8901', avatarColor: '#8b5cf6', grade: 'Employee', password: '1234', empNo: 'CC-096' },
  { id: 5, name: '최수아', role: '차장', dept: '영업팀', status: 'offline', statusMsg: '외근 중 (복귀 예정)', email: 'sa.choi@work.com', phone: '010-5678-9012', avatarColor: '#ec4899', grade: 'Employee', password: '1234', empNo: 'CC-095' },
  { id: 6, name: 'CONCOST 봇', role: 'AI', dept: '시스템', status: 'online', statusMsg: '언제든 물어보세요! 🤖', email: 'bot@concost.com', phone: '02-000-0000', avatarColor: '#10b981', isBot: true, grade: 'Employee', password: '' },
  { id: 7, name: '게스트', role: '방문객', dept: '협력사', status: 'online', statusMsg: '방문 중', email: 'guest@work.com', phone: '010-9999-9999', avatarColor: '#64748b', grade: 'Guest', password: '1234', empNo: 'CC-093' },
  { id: 8, name: '유종욱', role: '실장', dept: '개발팀', status: 'online', statusMsg: '마감검토 총괄', email: 'yjw@con-cost.com', phone: '010-1111-2222', avatarColor: '#8b5cf6', grade: 'Admin', password: 'dbwhddnr1!', empNo: 'CC-094' },
  { id: 9, name: '박용진', role: '수석', dept: '개발팀', status: 'online', statusMsg: '시스템 아키텍처', email: 'yjpark@con-cost.com', phone: '010-3333-4444', avatarColor: '#ec4899', grade: 'Admin', password: 'qkrdydwls1!', empNo: 'EMP-2018-001' }
];

const DEFAULT_CHANNELS = [
  { id: 'announcements', name: '공지사항', isGroup: true, icon: 'megaphone' },
  { id: 'dev-team', name: '개발팀 소통방', isGroup: true, icon: 'code' },
  { id: 'marketing-team', name: '마케팅 아이디어', isGroup: true, icon: 'lightbulb' }
];

const getInitialChats = () => {
  const now = new Date();
  const getPastTime = (minutesAgo) => new Date(now.getTime() - minutesAgo * 60 * 1000).toISOString();

  return [
    { id: 'm1', channelId: 'announcements', senderId: 3, content: '금일 오후 5시 주간 전체 회의가 진행됩니다. 각 팀별 마감 진척 상황을 준비해 주시기 바랍니다.', timestamp: getPastTime(180), readBy: [1, 2, 3, 4, 5] },
    { id: 'm2', channelId: 'announcements', senderId: 3, content: '안건: 2분기 마감 검토 시스템 고도화 및 일정 조율', timestamp: getPastTime(179), readBy: [1, 2, 3, 4, 5] },
    { id: 'm3', channelId: 'announcements', senderId: 4, content: '개발팀 김민준 대리님, 마감 검토 시스템 시안이 공유되었습니다.', timestamp: getPastTime(120), readBy: [1, 2, 3, 4] },
    { id: 'm4', channelId: 'dev-team', senderId: 3, content: '민준 씨, 이번 마감검토 시스템 UI 설계 다 되었나요?', timestamp: getPastTime(60), readBy: [1, 3] },
    { id: 'm5', channelId: 'dev-team', senderId: 1, content: '네, 팀장님! 네이버웍스 스타일의 깔끔하고 모던한 UI로 컴포넌트 분할까지 마쳤습니다.', timestamp: getPastTime(55), readBy: [1, 3] },
    { id: 'm6', channelId: 'dev-team', senderId: 1, content: 'Dark/Light 모드와 캘린더, 할 일 연동까지 완료해 두었습니다. 시안 확인 부탁드립니다.', timestamp: getPastTime(54), readBy: [1, 3] },
    { id: 'm7', channelId: 'dev-team', senderId: 3, content: '좋네요. 화면 전환 부드럽게 되고 반응형 레이아웃 잘 적용되었는지 크로스 브라우징 테스트도 신경 써 주세요.', timestamp: getPastTime(45), readBy: [1, 3] },
    { id: 'm8', channelId: 'marketing-team', senderId: 2, content: '이번 신규 프로모션 관련 시안 공유합니다. 피드백 언제든 편하게 주세요.', timestamp: getPastTime(200), readBy: [2, 4] }
  ];
};

const getInitialMails = () => {
  const now = new Date();
  const getPastTime = (hoursAgo) => new Date(now.getTime() - hoursAgo * 60 * 60 * 1000).toISOString();

  return [
    {
      id: 'e1',
      senderId: 3,
      recipientIds: [1, 2],
      subject: '[공지] 2분기 프로젝트 마감 검토 일정 안내',
      content: `
        <p>안녕하세요, 임직원 여러분.</p>
        <p>개발팀 박지훈 팀장입니다.</p>
        <p>이번 2분기 마감 검토 시스템 런칭 일정 및 검토 회의 일정을 아래와 같이 공유해 드립니다.</p>
        <ul>
          <li>일시: 2026년 6월 15일 (월) 14:00</li>
          <li>장소: 제1회의실 및 네웍스 화상회의</li>
          <li>참석 대상: 개발팀, 마케팅팀, 영업팀 PM</li>
        </ul>
        <p>마감 검토 화면 구성과 기능 명세서를 사전에 확인하시고 피드백을 준비해 주시기 바랍니다.</p>
        <p>감사합니다.</p>
      `,
      timestamp: getPastTime(2),
      isRead: false,
      folder: 'inbox'
    },
    {
      id: 'e2',
      senderId: 2,
      recipientIds: [1],
      subject: '마케팅 대시보드 연동 API 관련 문의의 건',
      content: `
        <p>안녕하세요 민준 대리님, 이서연입니다.</p>
        <p>메인 마감 대시보드 화면에 마케팅 유입 성과 API 데이터를 바인딩하고자 합니다.</p>
        <p>API 엔드포인트와 스키마 명세서 전달 부탁드려도 될까요?</p>
        <p>바쁘시겠지만 확인 부탁드립니다.</p>
      `,
      timestamp: getPastTime(5),
      isRead: true,
      folder: 'inbox'
    },
    {
      id: 'e3',
      senderId: 1,
      recipientIds: [3],
      subject: 'Re: 마감검토 시스템 UI 시안 및 컴포넌트 설계 송부',
      content: `
        <p>팀장님, 요청하신 마감검토 시스템 UI 시안을 송부드립니다.</p>
        <p>주요 특징으로는 네이버웍스 스타일의 단정하고 직관적인 그리드를 차용했으며,</p>
        <p>사용자 피로도 경감을 위한 완벽한 다크모드 대응 및 실시간 채팅을 연동했습니다.</p>
        <p>감사합니다.</p>
      `,
      timestamp: getPastTime(8),
      isRead: true,
      folder: 'sent'
    }
  ];
};

const getInitialEvents = () => {
  const today = new Date();
  const getOffsetDate = (offset) => {
    const d = new Date(today);
    d.setDate(today.getDate() + offset);
    return d.toISOString().split('T')[0];
  };

  return [
    { id: 'ev1', title: '마감검토 기획 회의', description: '개발팀 전체 마감검토 UI 시안 피드백 및 개발 스케줄링', start: getOffsetDate(0), end: getOffsetDate(0), color: '#3b82f6', participants: [1, 3] },
    { id: 'ev2', title: '마케팅 캠페인 중간 공유', description: '온라인 브랜드 캠페인 성과 지표 보고 및 토론', start: getOffsetDate(1), end: getOffsetDate(1), color: '#f59e0b', participants: [2, 5] },
    { id: 'ev3', title: '2분기 정기 실무 마감 회의', description: '전사 부서장 및 실무진 참석 마감 실적 취합 및 공유', start: getOffsetDate(3), end: getOffsetDate(4), color: '#10b981', participants: [1, 2, 3, 5] },
    { id: 'ev4', title: '김민준 대리 휴가', description: '개인 연차 휴가', start: getOffsetDate(-2), end: getOffsetDate(-2), color: '#ec4899', participants: [1] }
  ];
};

const getInitialTasks = () => {
  const today = new Date();
  const getOffsetDate = (offset) => {
    const d = new Date(today);
    d.setDate(today.getDate() + offset);
    return d.toISOString().split('T')[0];
  };

  return [
    { id: 't1', title: '마감검토 시스템 와이어프레임 설계', assigneeId: 1, priority: 'high', dueDate: getOffsetDate(-1), status: 'completed' },
    { id: 't2', title: '메시지/채팅 UI 컴포넌트 마크업', assigneeId: 1, priority: 'high', dueDate: getOffsetDate(1), status: 'in_progress' },
    { id: 't3', title: '일정 및 캘린더 드래그 기능 보완', assigneeId: 1, priority: 'medium', dueDate: getOffsetDate(3), status: 'todo' },
    { id: 't4', title: '전사 주소록 정보 최신화 업데이트', assigneeId: 4, priority: 'low', dueDate: getOffsetDate(2), status: 'todo' },
    { id: 't5', title: '마감 피드백 게시판 글 작성 및 테스트', assigneeId: 2, priority: 'medium', dueDate: getOffsetDate(0), status: 'in_progress' }
  ];
};

const getInitialPosts = () => {
  const now = new Date();
  const getPastTime = (daysAgo) => new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000).toISOString();

  return [
    {
      id: 'p1',
      title: '📢 2026년 하반기 복지제도 개선안 안내',
      content: `안녕하세요. 인사팀 정우진입니다. \n임직원 여러분의 피드백을 수렴하여 하반기부터 도서 구매비 월 5만원 확대 및 유연 근무제 코어타임 조정이 시행될 예정입니다. \n자세한 가이드는 사내 인트라넷을 참고해 주시기 바랍니다.`,
      authorId: 4,
      views: 42,
      timestamp: getPastTime(3),
      comments: [
        { id: 'c1', authorId: 1, content: '도서 구매비 확대 환영합니다! 감사합니다.', timestamp: getPastTime(2.8) },
        { id: 'c2', authorId: 2, content: '유연 근무 코어타임 단축 덕분에 육아 병행하기 훨씬 수월해질 것 같네요. 감사합니다.', timestamp: getPastTime(2.5) }
      ]
    },
    {
      id: 'p2',
      title: '🚀 마감검토 시스템 모바일 반응형 시안 릴리즈',
      content: `안녕하십니까, 개발팀 김민준입니다. \n마감검토 시스템의 모바일 최적화 뷰가 드디어 완성되었습니다. \n태블릿이나 모바일 네이버웍스 앱 내 웹뷰에서도 깨짐 없이 대시보드와 채팅방을 확인하실 수 있습니다. \n불편하신 점은 개발팀 소통방에 공유 부탁드립니다.`,
      authorId: 1,
      views: 18,
      timestamp: getPastTime(1),
      comments: []
    }
  ];
};

// Global State Object
const state = {
  currentUser: null,
  isLoggedIn: false,
  globalGeminiApiKey: '',
  users: DEFAULT_USERS,
  channels: DEFAULT_CHANNELS,
  chats: [],
  mails: [],
  events: [],
  tasks: [],
  posts: [],
  theme: 'light',
  currentView: 'chat',
  activeChatId: 'announcements',
  deletedUserEmails: [],
  deletedEmpNos: []
};

// State persistence functions
function loadState() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      const parsed = JSON.parse(data);
      Object.assign(state, parsed);
      if (state.chats) {
        state.chats = state.chats.filter(c => c.content && !c.content.includes('onerror=') && !c.content.includes('<img'));
      }
    } catch (e) {
      console.error('Failed to load state from localStorage, using seed data.', e);
      initSeedData();
    }
  } else {
    initSeedData();
  }

  // Sync core employee database
  mergeSeededEmployees();


  // Upgrade path: Ensure newly requested admins exist and have correct passwords/grades in loaded state (runs once-only)
  const upgradeKey = 'CONCOST_ADMIN_UPGRADE_V3';
  if (!localStorage.getItem(upgradeKey)) {
    const targetAdmins = [
      { id: 8, name: '유종욱', role: '실장', dept: '개발팀', status: 'online', statusMsg: '마감검토 총괄', email: 'yjw@con-cost.com', phone: '010-1111-2222', avatarColor: '#8b5cf6', grade: 'Admin', password: 'dbwhddnr1!' },
      { id: 9, name: '박용진', role: '수석', dept: '개발팀', status: 'online', statusMsg: '시스템 아키텍처', email: 'yjpark@con-cost.com', phone: '010-3333-4444', avatarColor: '#ec4899', grade: 'Admin', password: 'qkrdydwls1!' }
    ];

    let stateChanged = false;
    targetAdmins.forEach(admin => {
      const existingIndex = state.users.findIndex(u => u.email.toLowerCase() === admin.email.toLowerCase());
      if (existingIndex === -1) {
        state.users.push(admin);
        stateChanged = true;
      } else {
        const existingUser = state.users[existingIndex];
        if (existingUser.password !== admin.password || existingUser.grade !== admin.grade || existingUser.role !== admin.role || existingUser.name !== admin.name) {
          existingUser.password = admin.password;
          existingUser.grade = admin.grade;
          existingUser.role = admin.role;
          existingUser.name = admin.name;
          stateChanged = true;
        }
      }
    });

    if (stateChanged) {
      saveState();
    }
    localStorage.setItem(upgradeKey, 'true');
  }

  if (!state.isLoggedIn) {
    state.currentUser = null;
  } else {
    state.currentUser = state.users.find(u => u.id === state.currentUser?.id) || null;
    if (!state.currentUser) {
      state.isLoggedIn = false;
    }
  }
  return state;
}

function initSeedData() {
  state.chats = getInitialChats();
  state.mails = getInitialMails();
  state.events = getInitialEvents();
  state.tasks = getInitialTasks();
  state.posts = getInitialPosts();
  saveState();
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// State Mutators
function switchUser(userId) {
  const user = state.users.find(u => u.id === userId);
  if (user) {
    state.currentUser = user;
    saveState();
    return true;
  }
  return false;
}

function switchView(viewName) {
  state.currentView = viewName;
  saveState();
}

function switchActiveChat(chatId) {
  state.activeChatId = chatId;
  saveState();
}

function toggleTheme() {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  saveState();
  return state.theme;
}

function addMessage(channelId, senderId, content, attachment = null) {
  const newMsg = {
    id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
    channelId,
    senderId,
    content,
    timestamp: new Date().toISOString(),
    readBy: [senderId],
    reactions: {},
    attachment,
    translation: null,
    translationPending: false,
    translationError: false
  };
  state.chats.push(newMsg);
  saveState();

  // Auto translation has been disabled. Users translate manually using the "번역하기" button.

  return newMsg;
}

function markChatAsRead(channelId, userId) {
  let updated = false;
  state.chats.forEach(m => {
    if (m.channelId === channelId && !m.readBy.includes(userId)) {
      m.readBy.push(userId);
      updated = true;
    }
  });
  if (updated) {
    saveState();
  }
}

function sendMail(recipientIds, subject, content) {
  const newMail = {
    id: 'mail-' + Date.now(),
    senderId: state.currentUser.id,
    recipientIds: recipientIds.map(Number),
    subject,
    content,
    timestamp: new Date().toISOString(),
    isRead: false,
    folder: 'sent'
  };
  state.mails.push(newMail);

  recipientIds.forEach(recId => {
    state.mails.push({
      ...newMail,
      id: 'mail-' + Date.now() + '-' + recId,
      folder: 'inbox',
      isRead: false
    });
  });

  saveState();
  return newMail;
}

function addCalendarEvent(title, description, start, end, color, participants) {
  const newEvent = {
    id: 'ev-' + Date.now(),
    title,
    description,
    start,
    end,
    color,
    participants: participants.map(Number)
  };
  state.events.push(newEvent);
  saveState();
  return newEvent;
}

function addTask(title, assigneeId, priority, dueDate) {
  const newTask = {
    id: 'task-' + Date.now(),
    title,
    assigneeId: Number(assigneeId),
    priority,
    dueDate,
    status: 'todo'
  };
  state.tasks.push(newTask);
  saveState();
  return newTask;
}

function updateTaskStatus(taskId, status) {
  const task = state.tasks.find(t => t.id === taskId);
  if (task) {
    task.status = status;
    saveState();
    return true;
  }
  return false;
}

function deleteTask(taskId) {
  state.tasks = state.tasks.filter(t => t.id !== taskId);
  saveState();
}

function addPost(title, content) {
  const newPost = {
    id: 'post-' + Date.now(),
    title,
    content,
    authorId: state.currentUser.id,
    views: 0,
    timestamp: new Date().toISOString(),
    comments: []
  };
  state.posts.unshift(newPost);
  saveState();
  return newPost;
}

function addComment(postId, content) {
  const post = state.posts.find(p => p.id === postId);
  if (post) {
    const newComment = {
      id: 'com-' + Date.now(),
      authorId: state.currentUser.id,
      content,
      timestamp: new Date().toISOString()
    };
    post.comments.push(newComment);
    saveState();
    return newComment;
  }
  return null;
}

function incrementPostViews(postId) {
  const post = state.posts.find(p => p.id === postId);
  if (post) {
    post.views++;
    saveState();
  }
}

function login(email, password) {
  const user = state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (user && user.password === password) {
    state.isLoggedIn = true;
    state.currentUser = user;
    saveState();
    return user;
  }
  return null;
}

function logout() {
  state.isLoggedIn = false;
  state.currentUser = null;
  saveState();
}

function changeUserGrade(userId, newGrade) {
  const user = state.users.find(u => u.id === Number(userId));
  if (user) {
    user.grade = newGrade;
    saveState();
    return true;
  }
  return false;
}

function addUser(name, role, dept, email, password, grade) {
  const exists = state.users.some(u => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    throw new Error('이미 등록된 이메일입니다.');
  }
  
  const colors = ['#00c73c', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b', '#10b981'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  
  const newUser = {
    id: Date.now(),
    name,
    role,
    dept,
    status: 'offline',
    statusMsg: '신규 등록 사용자',
    email,
    phone: '010-0000-0000',
    avatarColor: randomColor,
    grade,
    password
  };
  state.users.push(newUser);
  saveState();
  return newUser;
}

function registerUser(name, email, password, dept, role) {
  const exists = state.users.some(u => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    throw new Error('이미 가입된 이메일입니다.');
  }
  
  const colors = ['#f16800', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b', '#10b981'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  
  // Calculate next CC- number
  const ccUsers = state.users.filter(u => u.empNo && u.empNo.startsWith('CC-'));
  let nextNum = 100;
  if (ccUsers.length > 0) {
    const nums = ccUsers.map(u => parseInt(u.empNo.split('-')[1], 10)).filter(n => !isNaN(n));
    if (nums.length > 0) {
      nextNum = Math.max(...nums) + 1;
    }
  }
  const empNo = `CC-${String(nextNum).padStart(3, '0')}`;

  const newUser = {
    id: Date.now(),
    empNo,
    name,
    role,
    dept,
    status: 'offline',
    statusMsg: '신규 등록 사원 🚀',
    email,
    phone: '010-0000-0000',
    avatarColor: randomColor,
    grade: 'Employee',
    password
  };
  
  state.users.push(newUser);
  saveState();
  return newUser;
}

function deleteUser(userId) {
  const user = state.users.find(u => u.id === Number(userId));
  if (user) {
    if (user.empNo) {
      if (!state.deletedEmpNos) state.deletedEmpNos = [];
      if (!state.deletedEmpNos.includes(user.empNo)) {
        state.deletedEmpNos.push(user.empNo);
      }
    } else {
      if (!state.deletedUserEmails) state.deletedUserEmails = [];
      if (!state.deletedUserEmails.includes(user.email.toLowerCase())) {
        state.deletedUserEmails.push(user.email.toLowerCase());
      }
    }
  }
  state.users = state.users.filter(u => u.id !== Number(userId));
  saveState();
}

const orgEmployeeSeed = [
  ["CC-001", "이서진", "CON-COST", "경영지원본부", "상무", "상무", "", ""],
  ["CC-002", "강동균", "CON-COST", "경영지원본부", "실장", "실장", "", ""],
  ["CC-003", "김영은", "CON-COST", "경영지원본부", "책임", "책임", "", ""],
  ["CC-004", "김태영", "CON-COST", "경영지원본부", "선임", "선임", "", ""],
  ["CC-005", "현예은", "CON-COST", "경영지원본부", "선임", "선임", "", ""],
  ["CC-008", "장범선", "CON-COST", "QC", "실장", "실장", "", ""],
  ["CC-009", "조한빈", "CON-COST", "QC", "실장", "실장", "", ""],
  ["CC-010", "최영배", "CON-COST", "기술본부", "본부장", "본부장", "", ""],
  ["CC-011", "김재현", "CON-COST", "마감", "수석", "수석", "", ""],
  ["CC-012", "성대용", "CON-COST", "마감", "수석", "수석", "", ""],
  ["CC-013", "양한규", "CON-COST", "마감", "수석", "수석", "", ""],
  ["CC-014", "원종수", "CON-COST", "마감", "수석", "수석", "", ""],
  ["CC-015", "송영길", "CON-COST", "마감", "수석", "수석", "", ""],
  ["CC-016", "이은지", "CON-COST", "마감", "책임", "책임", "", ""],
  ["CC-017", "남은주", "CON-COST", "마감", "책임", "책임", "", ""],
  ["CC-018", "송치영", "CON-COST", "마감", "책임", "책임", "", ""],
  ["CC-019", "임승주", "CON-COST", "마감", "선임", "선임", "", ""],
  ["CC-020", "박가림", "CON-COST", "마감", "선임", "선임", "", ""],
  ["CC-021", "임창열", "CON-COST", "마감", "선임", "선임", "", ""],
  ["CC-022", "김수겸", "CON-COST", "마감", "프로", "프로", "", ""],
  ["CC-023", "신동현", "CON-COST", "구조/토목 조경", "팀장", "팀장", "", ""],
  ["CC-024", "김채원", "CON-COST", "구조/토목 조경", "수석", "수석", "", ""],
  ["CC-025", "이정철", "CON-COST", "구조/토목 조경", "수석", "수석", "", ""],
  ["CC-026", "박소현", "CON-COST", "구조/토목 조경", "책임", "책임", "", ""],
  ["CC-027", "서화원", "CON-COST", "구조/토목 조경", "책임", "책임", "", ""],
  ["CC-028", "양진혁", "CON-COST", "구조/토목 조경", "프로", "프로", "", ""],
  ["CC-029", "이성희", "CON-COST", "BIM파트", "파트장", "파트장", "", ""],
  ["CC-030", "오승균", "CON-COST", "토목·조경파트", "파트장", "파트장", "", ""],
  ["CC-031", "이경훈", "CON-COST", "클레임센터", "센터장", "센터장", "", ""],
  ["CC-032", "김현수", "CON-COST", "클레임센터", "기술이사", "기술이사", "", ""],
  ["CC-033", "우상진", "CON-COST", "클레임센터", "기술이사", "기술이사", "", ""],
  ["VQS-001", "Hyun Dong Myung", "Viet QS", "경영진", "CEO", "CEO", "현동명", "Hyun Dong Myung"],
  ["VQS-002", "Lee Won Hee", "Viet QS", "경영진", "Executive Vice President", "Executive Vice President", "이원희", "Lee Won Hee"],
  ["VQS-003", "Lan Phuong", "Viet QS", "Management Support", "General Manager", "General Manager", "프엉", "Lan Phuong"],
  ["VQS-004", "Thanh Tuyen", "Viet QS", "Management Support", "Staff", "Staff", "뚜엔", "Thanh Tuyen"],
  ["VQS-005", "Yen Phuong", "Viet QS", "Management Support", "Staff", "Staff", "프엉", "Yen Phuong"],
  ["VQS-006", "Van Dung", "Viet QS", "Internal 1", "Team Leader", "Team Leader", "융", "Van Dung"],
  ["VQS-007", "Huyen Thu", "Viet QS", "Internal 1", "Team Leader", "Team Leader", "투", "Huyen Thu"],
  ["VQS-009", "Dong Phuong", "Viet QS", "Internal 1", "Staff", "Staff", "동 프엉", "Dong Phuong"],
  ["VQS-010", "Quang Truong", "Viet QS", "Internal 1", "Staff", "Staff", "쯔엉", "Quang Truong"],
  ["VQS-012", "Thanh Xuan", "Viet QS", "Internal 2", "Asst. Team Leader", "Asst. Team Leader", "수언", "Thanh Xuan"],
  ["VQS-013", "Kha Ai", "Viet QS", "Internal 2", "Staff", "Staff", "카 아이", "Kha Ai"],
  ["VQS-014", "Van Da", "Viet QS", "Internal 2", "Staff", "Staff", "따", "Van Da"],
  ["VQS-015", "Kim Tuyen", "Viet QS", "Internal 2", "Staff", "Staff", "김 뚜엔", "Kim Tuyen"],
  ["VQS-016", "Phuoc Nguyen", "Viet QS", "Internal 2", "Staff", "Staff", "응우옌", "Phuoc Nguyen"],
  ["VQS-017", "Dinh Phi", "Viet QS", "Internal 3", "Team Leader", "Team Leader", "피", "Dinh Phi"],
  ["VQS-018", "Minh Triet", "Viet QS", "Internal 3", "Asst. Team Leader", "Asst. Team Leader", "찌앳", "Minh Triet"],
  ["VQS-019", "Doan Nhut", "Viet QS", "Internal 3", "Staff", "Staff", "민느엇", "Doan Nhut"],
  ["VQS-020", "Minh Hai", "Viet QS", "Internal 3", "Staff", "Staff", "하이", "Minh Hai"],
  ["VQS-021", "Minh Kiet", "Viet QS", "Internal 3", "Staff", "Staff", "끼엣", "Minh Kiet"],
  ["VQS-022", "Van Tung", "Viet QS", "Partition&Opening", "Team Leader", "Team Leader", "뚱", "Van Tung"],
  ["VQS-023", "Minh Luan", "Viet QS", "Partition&Opening", "Asst. Team Leader", "Asst. Team Leader", "루언", "Minh Luan"],
  ["VQS-024", "Tan Phat", "Viet QS", "Partition&Opening", "Staff", "Staff", "팓", "Tan Phat"],
  ["VQS-025", "Kim Thoa", "Viet QS", "Partition&Opening", "Team Leader", "Team Leader", "김 톼", "Kim Thoa"],
  ["VQS-026", "Thi Thao", "Viet QS", "Partition&Opening", "Team Leader", "Team Leader", "타오", "Thi Thao"],
  ["VQS-027", "Nhut Duy", "Viet QS", "External", "Team Leader", "Team Leader", "유이", "Nhut Duy"],
  ["VQS-028", "Kieu Duyen", "Viet QS", "External", "Asst. Team Leader", "Asst. Team Leader", "유엔", "Kieu Duyen"],
  ["VQS-029", "Quoc Bao", "Viet QS", "External", "Staff", "Staff", "빠오", "Quoc Bao"],
  ["VQS-030", "Ngoc Anh", "Viet QS", "External", "Staff", "Staff", "응옥 안", "Ngoc Anh"],
  ["VQS-032", "Anh Tuan", "Viet QS", "Vertical", "Team Leader", "Team Leader", "뚜언", "Anh Tuan"],
  ["VQS-033", "Danh Xuan", "Viet QS", "Vertical", "Team Leader", "Team Leader", "짠 수언", "Danh Xuan"],
  ["VQS-034", "Van Toan", "Viet QS", "Vertical", "Team Leader", "Team Leader", "또안", "Van Toan"],
  ["VQS-035", "Thien Ngan", "Viet QS", "Vertical", "Team Leader", "Team Leader", "티엔 응언", "Thien Ngan"],
  ["VQS-036", "Huu Chau", "Viet QS", "Vertical", "Asst. Team Leader", "Asst. Team Leader", "쩌우", "Huu Chau"],
  ["VQS-037", "Minh Tu", "Viet QS", "Vertical", "Asst. Team Leader", "Asst. Team Leader", "뚜", "Minh Tu"],
  ["VQS-038", "Thanh Phong", "Viet QS", "Vertical", "Team Leader", "Team Leader", "퐁", "Thanh Phong"],
  ["VQS-039", "Dinh Nam", "Viet QS", "Vertical", "Asst. Team Leader", "Asst. Team Leader", "남", "Dinh Nam"],
  ["VQS-040", "Cam Tu", "Viet QS", "Vertical", "Staff", "Staff", "깜 뚜", "Cam Tu"],
  ["VQS-042", "Quoc Hung", "Viet QS", "Vertical", "Staff", "Staff", "흥", "Quoc Hung"],
  ["VQS-043", "Khanh Duy", "Viet QS", "Vertical", "Staff", "Staff", "칸 유이", "Khanh Duy"],
  ["VQS-044", "Ngoc Thoa", "Viet QS", "Vertical", "Staff", "Staff", "옥 톼", "Ngoc Thoa"],
  ["VQS-045", "Thu Thuy", "Viet QS", "Vertical", "Staff", "Staff", "투 튀", "Thu Thuy"],
  ["VQS-046", "Quoc Huy", "Viet QS", "Vertical", "Staff", "Staff", "휘", "Quoc Huy"],
  ["VQS-047", "Ngoc Mai", "Viet QS", "Vertical", "Staff", "Staff", "마이", "Ngoc Mai"],
  ["VQS-049", "Huu Thai", "Viet QS", "Horizon / Foundation", "Team Leader", "Team Leader", "휴 타이", "Huu Thai"],
  ["VQS-050", "Nhut Cuong", "Viet QS", "Horizon / Foundation", "Asst. Team Leader", "Asst. Team Leader", "늣끄엉", "Nhut Cuong"],
  ["VQS-051", "Sy Dan", "Viet QS", "Horizon / Foundation", "Team Leader", "Team Leader", "단", "Sy Dan"],
  ["VQS-052", "Thanh Phuong", "Viet QS", "Development", "Team Leader", "Team Leader", "탄 프엉", "Thanh Phuong"],
  ["VQS-053", "Dinh Van", "Viet QS", "External", "Staff", "Staff", "딘 반", "Dinh Van"],
  ["VQS-054", "Manh Cuong", "Viet QS", "Development", "Staff", "Staff", "끄엉", "Manh Cuong"],
  ["VQS-055", "Phuong Loan", "Viet QS", "Internal 1", "Asst. Team Leader", "Asst. Team Leader", "로안", "Phuong Loan"],
  ["VQS-056", "Thi Anh", "Viet QS", "Partition&Opening", "Staff", "Staff", "티 안", "Thi Anh"],
  ["VQS-057", "Thuy Tram", "Viet QS", "Partition&Opening", "Team Leader", "Team Leader", "짬", "Thuy Tram"],
  ["VQS-058", "Trong Nguyen", "Viet QS", "Partition&Opening", "Staff", "Staff", "응우옌", "Trong Nguyen"],
  ["VQS-059", "Hong Ngan", "Viet QS", "Partition&Opening", "Staff", "Staff", "홍 응언", "Hong Ngan"],
  ["VQS-060", "Minh Chau", "Viet QS", "Partition&Opening", "Staff", "Staff", "민 쩌우", "Minh Chau"],
  ["VQS-061", "Quynh Giao", "Viet QS", "External", "Staff", "Staff", "자오", "Quynh Giao"],
  ["VQS-062", "Minh Tuyen", "Viet QS", "External", "Staff", "Staff", "민 뚜엔", "Minh Tuyen"],
  ["VQS-063", "Quang Tri", "Viet QS", "Civil", "Staff", "Staff", "찌", "Quang Tri"],
  ["VQS-064", "Trung Dan", "Viet QS", "Civil", "Staff", "Staff", "쫑 단", "Trung Dan"],
  ["VQS-065", "Ngoc Bich", "Viet QS", "Horizon / Foundation", "Staff", "Staff", "빗", "Ngoc Bich"]
];

function mergeSeededEmployees() {
  const deletedEmpNos = state.deletedEmpNos || [];
  const deletedUserEmails = state.deletedUserEmails || [];

  orgEmployeeSeed.forEach(row => {
    const [empNo, name, company, dept, grade, position, koreanName, localName] = row;
    
    // Skip if employee has been explicitly deleted by administrator
    if (deletedEmpNos.includes(empNo)) return;
    
    const email = `${empNo.toLowerCase().replace(/-/g, '_')}@${company === 'Viet QS' ? 'vietqs.local' : 'con-cost.local'}`;
    if (deletedUserEmails.includes(email.toLowerCase())) return;
    
    const exists = state.users.find(u => 
      (u.empNo && u.empNo === empNo) || 
      u.email.toLowerCase() === email.toLowerCase() ||
      (u.name === name && u.dept === dept)
    );
    
    if (!exists) {
      const parts = empNo.split('-');
      let numId = 0;
      if (parts[0] === 'CC') {
        numId = 1000 + parseInt(parts[1], 10);
      } else if (parts[0] === 'VQS') {
        numId = 2000 + parseInt(parts[1], 10);
      } else if (parts[0] === 'EMP') {
        numId = 3000 + parseInt(parts[2], 10);
      } else {
        numId = Date.now() + Math.floor(Math.random() * 1000);
      }
      
      const colors = ['#00c73c', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b', '#10b981'];
      const randomColor = colors[numId % colors.length];
      
      state.users.push({
        id: numId,
        empNo: empNo,
        name: name,
        role: position || grade,
        dept: dept,
        status: 'offline',
        statusMsg: '상태 메시지가 없습니다.',
        email: email,
        phone: company === 'Viet QS' ? '090-000-0000' : '010-0000-0000',
        avatarColor: randomColor,
        grade: 'Employee',
        password: '1234',
        company: company,
        koreanName: koreanName || '',
        localName: localName || ''
      });
    } else {
      if (!exists.empNo) {
        exists.empNo = empNo;
      }
      if (koreanName && !exists.koreanName) exists.koreanName = koreanName;
      if (localName && !exists.localName) exists.localName = localName;
    }
  });
}

function setGlobalApiKey(key) {
  state.globalGeminiApiKey = key.trim();
  saveState();
}

function getGlobalApiKey() {
  return state.globalGeminiApiKey || '';
}

// Expose state and functions globally
window.WorksState = {
  state,
  loadState,
  saveState,
  switchUser,
  switchView,
  switchActiveChat,
  toggleTheme,
  addMessage,
  markChatAsRead,
  sendMail,
  addCalendarEvent,
  addTask,
  updateTaskStatus,
  deleteTask,
  addPost,
  addComment,
  incrementPostViews,
  login,
  logout,
  registerUser,
  changeUserGrade,
  addUser,
  deleteUser,
  setGlobalApiKey,
  getGlobalApiKey
};
