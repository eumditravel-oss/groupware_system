// Calendar View Module (Global Namespace Version)

let currentDate = new Date();
let calendarFilter = 'all'; // 'all', 'mine', 'company'

function renderCalendarSubPanel(searchQuery = '') {
  const { state } = window.WorksState;
  const listContainer = document.getElementById('subPanelList');
  const titleContainer = document.getElementById('subPanelTitle');
  
  titleContainer.textContent = '캘린더';

  let html = `
    <div style="padding: 10px 20px 4px 20px; font-size: 0.75rem; font-weight: 700; color: var(--text-light); text-transform: uppercase;">내 캘린더</div>
    
    <div class="list-item ${calendarFilter === 'mine' ? 'active' : ''}" data-calendar-filter="mine">
      <div class="list-item-content">
        <div class="list-item-header">
          <span class="list-item-title"><span style="display:inline-block; width: 8px; height: 8px; border-radius:50%; background-color:#3b82f6; margin-right:8px;"></span>내 일정</span>
        </div>
      </div>
    </div>
    
    <div style="padding: 20px 20px 4px 20px; font-size: 0.75rem; font-weight: 700; color: var(--text-light); text-transform: uppercase;">회사 캘린더</div>
    
    <div class="list-item ${calendarFilter === 'all' ? 'active' : ''}" data-calendar-filter="all">
      <div class="list-item-content">
        <div class="list-item-header">
          <span class="list-item-title"><span style="display:inline-block; width: 8px; height: 8px; border-radius:50%; background-color:#10b981; margin-right:8px;"></span>전사 일정 및 회의</span>
        </div>
      </div>
    </div>
  `;
  
  listContainer.innerHTML = html;
  lucide.createIcons();

  listContainer.querySelectorAll('[data-calendar-filter]').forEach(item => {
    item.addEventListener('click', () => {
      calendarFilter = item.getAttribute('data-calendar-filter');
      renderCalendarSubPanel(searchQuery);
      renderCalendarWorkspace(searchQuery);
    });
  });
}

function renderCalendarWorkspace(searchQuery = '') {
  const workspaceContainer = document.getElementById('viewBodyContainer');
  const headerTitle = document.getElementById('viewHeaderTitle');
  const headerSubtitle = document.getElementById('viewHeaderSubtitle');
  const headerActions = document.getElementById('viewHeaderActionsContainer');

  headerTitle.textContent = '일정 관리';
  headerSubtitle.textContent = '부서 회의 및 마감 스케줄 일정';

  headerActions.innerHTML = `
    <button class="btn btn-primary" id="openEventModalBtn">
      <i data-lucide="calendar-plus"></i> 일정 등록
    </button>
  `;
  lucide.createIcons();

  workspaceContainer.innerHTML = `
    <div class="calendar-view-container">
      <div class="calendar-bar">
        <div class="calendar-nav">
          <button class="calendar-nav-btn" id="prevMonthBtn" title="이전 달"><i data-lucide="chevron-left"></i></button>
          <button class="calendar-nav-btn" id="todayBtn" title="오늘">오늘</button>
          <button class="calendar-nav-btn" id="nextMonthBtn" title="다음 달"><i data-lucide="chevron-right"></i></button>
        </div>
        <div class="calendar-title" id="calendarMonthTitle">2026년 06월</div>
        <div style="width: 100px;"></div>
      </div>
      
      <div class="calendar-grid" id="calendarGrid">
        <!-- Calendar days and dates rendered here -->
      </div>
    </div>
  `;

  lucide.createIcons();

  drawGrid(searchQuery);
  setupCalendarActions();
}

function drawGrid(searchQuery = '') {
  const { state } = window.WorksState;
  const grid = document.getElementById('calendarGrid');
  const monthTitle = document.getElementById('calendarMonthTitle');
  if (!grid) return;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  monthTitle.textContent = `${year}년 ${(month + 1).toString().padStart(2, '0')}월`;
  grid.innerHTML = '';

  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  dayNames.forEach(name => {
    grid.innerHTML += `<div class="calendar-day-header">${name}</div>`;
  });

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  const totalDays = lastDay.getDate();
  const startDayIndex = firstDay.getDay();

  const prevMonthLast = new Date(year, month, 0).getDate();
  const today = new Date();
  
  let cellHtml = '';

  for (let i = startDayIndex - 1; i >= 0; i--) {
    const dayVal = prevMonthLast - i;
    const paddingDate = new Date(year, month - 1, dayVal);
    cellHtml += renderDayCell(paddingDate, false, searchQuery);
  }

  for (let d = 1; d <= totalDays; d++) {
    const dayVal = new Date(year, month, d);
    const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
    cellHtml += renderDayCell(dayVal, true, searchQuery, isToday);
  }

  const remainingCells = 42 - (startDayIndex + totalDays);
  for (let n = 1; n <= remainingCells; n++) {
    const paddingDate = new Date(year, month + 1, n);
    cellHtml += renderDayCell(paddingDate, false, searchQuery);
  }

  grid.innerHTML += cellHtml;

  grid.querySelectorAll('.calendar-event-badge').forEach(badge => {
    badge.addEventListener('click', (e) => {
      e.stopPropagation();
      const evId = badge.getAttribute('data-event-id');
      const ev = state.events.find(event => event.id === evId);
      if (ev) {
        const participantsNames = ev.participants
          .map(id => state.users.find(u => u.id === id))
          .filter(Boolean)
          .map(u => `${u.name} ${u.role}`)
          .join(', ');
          
        alert(`📅 일정 상세 정보:\n\n제목: ${ev.title}\n기간: ${ev.start} ~ ${ev.end}\n참석자: ${participantsNames}\n설명: ${ev.description || '없음'}`);
      }
    });
  });

  grid.querySelectorAll('.calendar-day-cell').forEach(cell => {
    cell.addEventListener('click', () => {
      const dateStr = cell.getAttribute('data-date');
      openEventModal(dateStr);
    });
  });
}

function renderDayCell(dateObj, isCurrentMonth, searchQuery, isToday = false) {
  const { state } = window.WorksState;
  const dateISO = dateObj.toISOString().split('T')[0];
  const dayNum = dateObj.getDate();

  let dayEvents = state.events.filter(ev => dateISO >= ev.start && dateISO <= ev.end);

  if (calendarFilter === 'mine') {
    dayEvents = dayEvents.filter(ev => ev.participants.includes(state.currentUser.id));
  }

  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase().trim();
    dayEvents = dayEvents.filter(ev => 
      ev.title.toLowerCase().includes(q) || 
      (ev.description && ev.description.toLowerCase().includes(q))
    );
  }

  let eventHtml = '';
  dayEvents.forEach(ev => {
    eventHtml += `
      <div class="calendar-event-badge" data-event-id="${ev.id}" style="background-color: ${ev.color || '#3b82f6'};" title="${ev.title}">
        ${ev.title}
      </div>
    `;
  });

  return `
    <div class="calendar-day-cell ${isCurrentMonth ? '' : 'other-month'} ${isToday ? 'today' : ''}" data-date="${dateISO}">
      <span class="calendar-day-num">${dayNum}</span>
      ${eventHtml}
    </div>
  `;
}

function setupCalendarActions() {
  const { state, addCalendarEvent } = window.WorksState;
  const prevBtn = document.getElementById('prevMonthBtn');
  const nextBtn = document.getElementById('nextMonthBtn');
  const todayBtn = document.getElementById('todayBtn');
  const openModalBtn = document.getElementById('openEventModalBtn');
  const closeModalBtn = document.getElementById('closeEventModalBtn');
  const cancelBtn = document.getElementById('cancelEventBtn');
  const form = document.getElementById('eventForm');

  prevBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    drawGrid();
  });

  nextBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    drawGrid();
  });

  todayBtn.addEventListener('click', () => {
    currentDate = new Date();
    drawGrid();
  });

  openModalBtn.addEventListener('click', () => openEventModal());
  closeModalBtn.addEventListener('click', closeEventModal);
  cancelBtn.addEventListener('click', closeEventModal);

  const attendeesContainer = document.getElementById('eventAttendeesContainer');
  let html = '';
  state.users.forEach(u => {
    if (u.isBot) return;
    const isMe = u.id === state.currentUser.id ? 'checked' : '';
    html += `
      <label style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; cursor: pointer;">
        <input type="checkbox" name="attendeeCheckbox" value="${u.id}" ${isMe}>
        ${u.name} ${u.role} (${u.dept})
      </label>
    `;
  });
  attendeesContainer.innerHTML = html;

  form.onsubmit = (e) => {
    e.preventDefault();
    const title = document.getElementById('eventTitle').value;
    const start = document.getElementById('eventStartDate').value;
    const end = document.getElementById('eventEndDate').value;
    const color = document.getElementById('eventColor').value;
    const description = document.getElementById('eventDesc').value;

    const selectedCheckboxes = form.querySelectorAll('input[name="attendeeCheckbox"]:checked');
    const participants = Array.from(selectedCheckboxes).map(cb => Number(cb.value));

    addCalendarEvent(title, description, start, end, color, participants);
    closeEventModal();
    drawGrid();
  };
}

function openEventModal(dateStr = '') {
  const { state } = window.WorksState;
  if (state.currentUser?.grade === 'Guest') {
    alert('게스트 권한은 일정을 등록할 수 없습니다.');
    return;
  }
  const modal = document.getElementById('eventModal');
  const form = document.getElementById('eventForm');
  form.reset();

  const defaultDate = dateStr || new Date().toISOString().split('T')[0];
  document.getElementById('eventStartDate').value = defaultDate;
  document.getElementById('eventEndDate').value = defaultDate;

  form.querySelectorAll('input[name="attendeeCheckbox"]').forEach(cb => {
    cb.checked = Number(cb.value) === state.currentUser?.id;
  });

  modal.classList.add('active');
}

function closeEventModal() {
  const modal = document.getElementById('eventModal');
  modal.classList.remove('active');
}

// Expose globally
window.CalendarView = {
  renderCalendarSubPanel,
  renderCalendarWorkspace
};
