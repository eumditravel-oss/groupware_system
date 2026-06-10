// Tasks View Module (Global Namespace Version)

let taskFilter = 'all'; // 'all', 'mine', 'due'

function renderTasksSubPanel(searchQuery = '') {
  const { state } = window.WorksState;
  const listContainer = document.getElementById('subPanelList');
  const titleContainer = document.getElementById('subPanelTitle');
  
  titleContainer.textContent = '할 일';

  let html = `
    <div style="padding: 10px 20px 4px 20px; font-size: 0.75rem; font-weight: 700; color: var(--text-light); text-transform: uppercase;">할 일 분류</div>
    
    <div class="list-item ${taskFilter === 'all' ? 'active' : ''}" data-task-filter="all">
      <div class="list-item-content">
        <div class="list-item-header">
          <span class="list-item-title"><i data-lucide="list-todo" style="width:14px; height:14px; margin-right:8px; vertical-align:middle;"></i>전체 할 일</span>
          <span class="list-badge">${state.tasks.length}</span>
        </div>
      </div>
    </div>
    
    <div class="list-item ${taskFilter === 'mine' ? 'active' : ''}" data-task-filter="mine">
      <div class="list-item-content">
        <div class="list-item-header">
          <span class="list-item-title"><i data-lucide="user-check" style="width:14px; height:14px; margin-right:8px; vertical-align:middle;"></i>내 담당 할 일</span>
          <span class="list-badge">${state.tasks.filter(t => t.assigneeId === state.currentUser.id && t.status !== 'completed').length}</span>
        </div>
      </div>
    </div>
  `;
  
  listContainer.innerHTML = html;
  lucide.createIcons();

  listContainer.querySelectorAll('[data-task-filter]').forEach(item => {
    item.addEventListener('click', () => {
      taskFilter = item.getAttribute('data-task-filter');
      renderTasksSubPanel(searchQuery);
      renderTasksWorkspace(searchQuery);
    });
  });
}

function renderTasksWorkspace(searchQuery = '') {
  const workspaceContainer = document.getElementById('viewBodyContainer');
  const headerTitle = document.getElementById('viewHeaderTitle');
  const headerSubtitle = document.getElementById('viewHeaderSubtitle');
  const headerActions = document.getElementById('viewHeaderActionsContainer');

  headerTitle.textContent = '업무 보드 (Kanban)';
  headerSubtitle.textContent = '드래그 앤 드롭으로 업무의 진행 상태를 간편하게 변경할 수 있습니다.';

  headerActions.innerHTML = `
    <button class="btn btn-primary" id="openTaskModalBtn">
      <i data-lucide="plus-circle"></i> 할 일 추가
    </button>
  `;
  lucide.createIcons();

  workspaceContainer.innerHTML = `
    <div class="tasks-container">
      <div class="tasks-board">
        <div class="tasks-column" data-lane-status="todo">
          <div class="tasks-column-header">
            <h4><i data-lucide="circle" style="color: var(--text-light); width: 14px; height: 14px;"></i> 할 일 대기</h4>
            <span class="tasks-count" id="count-todo">0</span>
          </div>
          <div class="tasks-list" id="list-todo"></div>
        </div>
        
        <div class="tasks-column" data-lane-status="in_progress">
          <div class="tasks-column-header">
            <h4><i data-lucide="play-circle" style="color: var(--color-busy); width: 14px; height: 14px;"></i> 진행 중</h4>
            <span class="tasks-count" id="count-in-progress">0</span>
          </div>
          <div class="tasks-list" id="list-in_progress"></div>
        </div>
        
        <div class="tasks-column" data-lane-status="completed">
          <div class="tasks-column-header">
            <h4><i data-lucide="check-circle-2" style="color: var(--color-online); width: 14px; height: 14px;"></i> 완료됨</h4>
            <span class="tasks-count" id="count-completed">0</span>
          </div>
          <div class="tasks-list" id="list-completed"></div>
        </div>
      </div>
    </div>
  `;

  lucide.createIcons();

  renderKanbanCards(searchQuery);
  setupKanbanDragAndDrop();
  setupTaskModalActions();
}

function renderKanbanCards(searchQuery = '') {
  const { state, updateTaskStatus, deleteTask } = window.WorksState;
  const todoContainer = document.getElementById('list-todo');
  const progressContainer = document.getElementById('list-in_progress');
  const completedContainer = document.getElementById('list-completed');

  if (!todoContainer) return;

  todoContainer.innerHTML = '';
  progressContainer.innerHTML = '';
  completedContainer.innerHTML = '';

  let filteredTasks = state.tasks;
  if (taskFilter === 'mine') {
    filteredTasks = filteredTasks.filter(t => t.assigneeId === state.currentUser.id);
  }

  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase().trim();
    filteredTasks = filteredTasks.filter(t => t.title.toLowerCase().includes(q));
  }

  let counts = { todo: 0, in_progress: 0, completed: 0 };

  filteredTasks.forEach(task => {
    counts[task.status]++;
    const assignee = state.users.find(u => u.id === task.assigneeId) || { name: '미정', avatarColor: '#94a3b8' };
    const priorityLabels = { high: '높음', medium: '보통', low: '낮음' };
    
    let nextStatusBtn = '';
    if (task.status === 'todo') {
      nextStatusBtn = `<button class="btn" style="padding: 2px 6px; font-size: 0.7rem; border-color: var(--color-busy); color: var(--color-busy);" data-move-task="${task.id}" data-target-status="in_progress">진행하기 &rarr;</button>`;
    } else if (task.status === 'in_progress') {
      nextStatusBtn = `<button class="btn btn-primary" style="padding: 2px 6px; font-size: 0.7rem; background-color: var(--color-online); border-color: var(--color-online);" data-move-task="${task.id}" data-target-status="completed">완료하기 &check;</button>`;
    }

    const cardHtml = `
      <div class="task-card" draggable="true" data-task-id="${task.id}">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <span class="task-priority-badge ${task.priority}">${priorityLabels[task.priority]}</span>
          <i data-lucide="trash-2" style="width: 14px; height: 14px; cursor: pointer; color: var(--text-light);" data-delete-task="${task.id}" title="할 일 삭제"></i>
        </div>
        <div class="task-card-title">${task.title}</div>
        <div class="task-card-footer">
          <div class="task-card-due">
            <i data-lucide="calendar" style="width: 12px; height: 12px;"></i> ${task.dueDate}
          </div>
          
          <div style="display: flex; align-items: center; gap: 8px;">
            ${nextStatusBtn}
            <div class="task-card-assignee" style="background-color: ${assignee.avatarColor || 'var(--primary-color)'};" title="담당자: ${assignee.name} ${assignee.role || ''}">
              ${assignee.name.slice(-2)}
            </div>
          </div>
        </div>
      </div>
    `;

    if (task.status === 'todo') todoContainer.innerHTML += cardHtml;
    else if (task.status === 'in_progress') progressContainer.innerHTML += cardHtml;
    else if (task.status === 'completed') completedContainer.innerHTML += cardHtml;
  });

  document.getElementById('count-todo').textContent = counts.todo;
  document.getElementById('count-in-progress').textContent = counts.in_progress;
  document.getElementById('count-completed').textContent = counts.completed;

  lucide.createIcons();

  [todoContainer, progressContainer, completedContainer].forEach(container => {
    container.querySelectorAll('[data-delete-task]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (state.currentUser?.grade === 'Guest') {
          alert('게스트 권한은 할 일을 삭제할 수 없습니다.');
          return;
        }
        if (confirm('이 할 일을 삭제하시겠습니까?')) {
          const id = btn.getAttribute('data-delete-task');
          deleteTask(id);
          renderTasksSubPanel();
          renderKanbanCards(searchQuery);
          window.dispatchEvent(new CustomEvent('statechanged'));
        }
      });
    });

    container.querySelectorAll('[data-move-task]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (state.currentUser?.grade === 'Guest') {
          alert('게스트 권한은 할 일 상태를 변경할 수 없습니다.');
          return;
        }
        const id = btn.getAttribute('data-move-task');
        const nextStatus = btn.getAttribute('data-target-status');
        
        updateTaskStatus(id, nextStatus);
        
        if (nextStatus === 'completed') {
          triggerConfetti();
        }

        renderTasksSubPanel();
        renderKanbanCards(searchQuery);
        window.dispatchEvent(new CustomEvent('statechanged'));
      });
    });
  });
}

function setupKanbanDragAndDrop() {
  const { state, updateTaskStatus } = window.WorksState;
  const cards = document.querySelectorAll('.task-card');
  const lists = document.querySelectorAll('.tasks-list');

  cards.forEach(card => {
    card.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', card.getAttribute('data-task-id'));
      card.style.opacity = '0.5';
    });

    card.addEventListener('dragend', () => {
      card.style.opacity = '1';
    });
  });

  lists.forEach(list => {
    const laneStatus = list.parentElement.getAttribute('data-lane-status');
    
    list.addEventListener('dragover', (e) => {
      e.preventDefault();
      list.classList.add('drag-over');
    });

    list.addEventListener('dragleave', () => {
      list.classList.remove('drag-over');
    });

    list.addEventListener('drop', (e) => {
      e.preventDefault();
      list.classList.remove('drag-over');
      
      if (state.currentUser?.grade === 'Guest') {
        alert('게스트 권한은 할 일을 이동할 수 없습니다.');
        return;
      }
      
      const taskId = e.dataTransfer.getData('text/plain');
      const task = state.tasks.find(t => t.id === taskId);
      
      if (task && task.status !== laneStatus) {
        updateTaskStatus(taskId, laneStatus);
        
        if (laneStatus === 'completed') {
          triggerConfetti();
        }

        renderTasksSubPanel();
        renderKanbanCards();
        window.dispatchEvent(new CustomEvent('statechanged'));
      }
    });
  });
}

function triggerConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });
  }
}

function setupTaskModalActions() {
  const { state, addTask } = window.WorksState;
  const openBtn = document.getElementById('openTaskModalBtn');
  const closeBtn = document.getElementById('closeTaskModalBtn');
  const cancelBtn = document.getElementById('cancelTaskBtn');
  const modal = document.getElementById('taskModal');
  const form = document.getElementById('taskForm');
  const assigneeSelect = document.getElementById('taskAssignee');

  if (!openBtn) return;

  let assigneeHtml = '';
  state.users.forEach(u => {
    if (u.isBot) return;
    const isMe = u.id === state.currentUser?.id ? 'selected' : '';
    assigneeHtml += `<option value="${u.id}" ${isMe}>${u.name} ${u.role} (${u.dept})</option>`;
  });
  assigneeSelect.innerHTML = assigneeHtml;

  openBtn.addEventListener('click', () => {
    if (state.currentUser?.grade === 'Guest') {
      alert('게스트 권한은 할 일을 추가할 수 없습니다.');
      return;
    }
    form.reset();
    document.getElementById('taskDueDate').value = new Date().toISOString().split('T')[0];
    assigneeSelect.value = state.currentUser?.id;
    modal.classList.add('active');
  });

  const closeModal = () => {
    modal.classList.remove('active');
  };

  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);

  form.onsubmit = (e) => {
    e.preventDefault();
    const title = document.getElementById('taskTitle').value;
    const assigneeId = document.getElementById('taskAssignee').value;
    const priority = document.getElementById('taskPriority').value;
    const dueDate = document.getElementById('taskDueDate').value;

    addTask(title, assigneeId, priority, dueDate);
    closeModal();
    
    renderTasksSubPanel();
    renderKanbanCards();
    window.dispatchEvent(new CustomEvent('statechanged'));
  };
}

// Expose globally
window.TasksView = {
  renderTasksSubPanel,
  renderTasksWorkspace
};
