// CON-COST & Viet QS Organization Chart (조직도) View Module - js/views/orgView.js

let currentOrgCompany = 'CON-COST'; // 'CON-COST' or 'Viet QS'

const orgStructures = {
  "CON-COST": {
    title: "㈜컨코스트 조직도",
    root: {
      title: "대표이사",
      employeeId: "VQS-001",
      children: [
        {
          title: "부사장",
          employeeId: "VQS-002",
          children: [
            {
              title: "부서명",
              displayName: "경영지원본부",
              nodeType: "department",
              children: [
                { title: "상무", employeeId: "CC-001" },
                { title: "실장", employeeId: "CC-002" },
                { title: "책임", employeeId: "CC-003" },
                { title: "선임", employeeId: "CC-004" },
                { title: "선임", employeeId: "CC-005" }
              ]
            },
            {
              title: "부서명",
              displayName: "개발 T/F",
              nodeType: "department",
              children: [
                { title: "개발", employeeId: "EMP-2018-001" },
                { title: "개발", employeeId: "VQS-052" },
                { title: "개발", employeeId: "VQS-054" }
              ]
            },
            {
              title: "부서명",
              displayName: "QC팀",
              nodeType: "department",
              children: [
                { title: "실장", employeeId: "CC-008" },
                { title: "실장", employeeId: "CC-009" }
              ]
            },
            {
              title: "부서명",
              displayName: "기술본부",
              nodeType: "department",
              children: [
                {
                  title: "본부장",
                  employeeId: "CC-010",
                  children: [
                    {
                      title: "부서명",
                      displayName: "마감팀",
                      nodeType: "department",
                      children: [
                        {
                          title: "팀장",
                          employeeId: "CC-009",
                          children: [
                            { title: "수석", employeeId: "CC-011" },
                            { title: "수석", employeeId: "CC-012" },
                            { title: "수석", employeeId: "CC-013" },
                            { title: "수석", employeeId: "CC-014" },
                            { title: "수석", employeeId: "CC-015" },
                            { title: "책임", employeeId: "CC-016" },
                            { title: "책임", employeeId: "CC-017" },
                            { title: "책임", employeeId: "CC-018" },
                            { title: "선임", employeeId: "CC-019" },
                            { title: "선임", employeeId: "CC-020" },
                            { title: "선임", employeeId: "CC-021" },
                            { title: "프로", employeeId: "CC-022" }
                          ]
                        }
                      ]
                    },
                    {
                      title: "부서명",
                      displayName: "구조/토목ㆍ조경파트",
                      nodeType: "department",
                      children: [
                        {
                          title: "구조/토목 조정",
                          employeeId: "CC-008",
                          children: [
                            {
                              title: "부서명",
                              displayName: "BIM파트",
                              nodeType: "department",
                              children: [
                                { title: "파트장", employeeId: "CC-029" }
                              ]
                            },
                            {
                              title: "부서명",
                              displayName: "구조팀",
                              nodeType: "department",
                              children: [
                                {
                                  title: "구조 팀장",
                                  employeeId: "CC-023",
                                  children: [
                                    { title: "수석", employeeId: "CC-024" },
                                    {
                                      title: "수석",
                                      employeeId: "CC-025",
                                      children: [
                                        { title: "책임", employeeId: "CC-026" },
                                        { title: "책임", employeeId: "CC-027" },
                                        { title: "프로", employeeId: "CC-028" }
                                      ]
                                    }
                                  ]
                                }
                              ]
                            },
                            {
                              title: "부서명",
                              displayName: "토목ㆍ조경파트",
                              nodeType: "department",
                              children: [
                                { title: "파트장", employeeId: "CC-030" }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              title: "부서명",
              displayName: "클레임센터",
              nodeType: "department",
              children: [
                { title: "센터장", employeeId: "CC-031" },
                { title: "본부장", employeeId: "CC-010" },
                { title: "실장", employeeId: "CC-008" },
                { title: "기술이사", employeeId: "CC-032" },
                { title: "기술이사", employeeId: "CC-033" }
              ]
            },
            {
              title: "부서명",
              displayName: "공사비닷컴",
              nodeType: "department",
              children: []
            }
          ]
        }
      ]
    }
  },
  "Viet QS": {
    title: "Viet QS Organization Chart",
    root: {
      title: "CEO",
      employeeId: "VQS-001",
      children: [
        {
          title: "Executive Vice President",
          employeeId: "VQS-002",
          children: [
            {
              title: "부서명",
              displayName: "Management Support",
              nodeType: "department",
              children: [
                {
                  title: "General Manager",
                  employeeId: "VQS-003",
                  children: [
                    { title: "Staff", employeeId: "VQS-004" },
                    { title: "Staff", employeeId: "VQS-005" }
                  ]
                }
              ]
            },
            {
              title: "Director",
              employeeId: "CC-010",
              children: [
                {
                  title: "부서명",
                  displayName: "Finish",
                  nodeType: "department",
                  children: [
                    {
                      title: "General Manager",
                      employeeId: "CC-009",
                      children: [
                        {
                          title: "부서명",
                          displayName: "Internal 1",
                          nodeType: "department",
                          children: [
                            { title: "Team Leader", employeeId: "VQS-006" },
                            { title: "Asst. Team Leader", employeeId: "VQS-055" },
                            { title: "Staff", employeeId: "VQS-009" },
                            { title: "Staff", employeeId: "VQS-010" }
                          ]
                        },
                        {
                          title: "부서명",
                          displayName: "Internal 2",
                          nodeType: "department",
                          children: [
                            { title: "Team Leader", employeeId: "VQS-007" },
                            { title: "Staff", employeeId: "VQS-013" },
                            { title: "Staff", employeeId: "VQS-014" },
                            { title: "Staff", employeeId: "VQS-015" },
                            { title: "Staff", employeeId: "VQS-016" }
                          ]
                        },
                        {
                          title: "부서명",
                          displayName: "Internal 3",
                          nodeType: "department",
                          children: [
                            { title: "Team Leader", employeeId: "VQS-017" },
                            { title: "Asst. Team Leader", employeeId: "VQS-018" },
                            { title: "Staff", employeeId: "VQS-019" },
                            { title: "Staff", employeeId: "VQS-020" },
                            { title: "Staff", employeeId: "VQS-021" }
                          ]
                        },
                        {
                          title: "부서명",
                          displayName: "Partition&Opening",
                          nodeType: "department",
                          children: [
                            { title: "Team Leader", employeeId: "VQS-022" },
                            { title: "Team Leader", employeeId: "VQS-026" },
                            { title: "Asst. Team Leader", employeeId: "VQS-023" },
                            { title: "Team Leader", employeeId: "VQS-057" },
                            { title: "Staff", employeeId: "VQS-056" },
                            { title: "Staff", employeeId: "VQS-058" },
                            { title: "Staff", employeeId: "VQS-024" },
                            { title: "Staff", employeeId: "VQS-059" },
                            { title: "Staff", employeeId: "VQS-060" }
                          ]
                        },
                        {
                          title: "부서명",
                          displayName: "External",
                          nodeType: "department",
                          children: [
                            { title: "Team Leader", employeeId: "VQS-027" },
                            { title: "Asst. Team Leader", employeeId: "VQS-028" },
                            { title: "Staff", employeeId: "VQS-029" },
                            { title: "Staff", employeeId: "VQS-061" },
                            { title: "Staff", employeeId: "VQS-030" },
                            { title: "Staff", employeeId: "VQS-053" },
                            { title: "Staff", employeeId: "VQS-062" }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  title: "부서명",
                  displayName: "StructureㆍCivil",
                  nodeType: "department",
                  children: [
                    {
                      title: "General Manager",
                      employeeId: "CC-008",
                      children: [
                        {
                          title: "부서명",
                          displayName: "Vertical",
                          nodeType: "department",
                          children: [
                            { title: "Team Leader", employeeId: "VQS-032" },
                            { title: "Team Leader", employeeId: "VQS-033" },
                            { title: "Team Leader", employeeId: "VQS-034" },
                            { title: "Asst. Team Leader", employeeId: "VQS-036" },
                            { title: "Asst. Team Leader", employeeId: "VQS-037" },
                            { title: "Asst. Team Leader", employeeId: "VQS-012" },
                            { title: "Staff", employeeId: "VQS-040" },
                            { title: "Staff", employeeId: "VQS-042" },
                            { title: "Staff", employeeId: "VQS-043" },
                            { title: "Staff", employeeId: "VQS-045" }
                          ]
                        },
                        {
                          title: "부서명",
                          displayName: "Horizontal/Foundation",
                          nodeType: "department",
                          children: [
                            { title: "Team Leader", employeeId: "VQS-035" },
                            { title: "Team Leader", employeeId: "VQS-038" },
                            { title: "Team Leader", employeeId: "VQS-049" },
                            { title: "Team Leader", employeeId: "VQS-025" },
                            { title: "Asst. Team Leader", employeeId: "VQS-050" },
                            { title: "Team Leader", employeeId: "VQS-051" },
                            { title: "Staff", employeeId: "VQS-039" },
                            { title: "Staff", employeeId: "VQS-065" },
                            { title: "신규 조직", employeeId: "VQS-047" },
                            { title: "Staff", employeeId: "VQS-044" },
                            { title: "Staff", employeeId: "VQS-046" }
                          ]
                        },
                        {
                          title: "부서명",
                          displayName: "Civil",
                          nodeType: "department",
                          children: [
                            { title: "Staff", employeeId: "VQS-063" },
                            { title: "Staff", employeeId: "VQS-064" }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              title: "부서명",
              displayName: "Development",
              nodeType: "department",
              children: [
                { title: "Team Leader", employeeId: "VQS-052" },
                { title: "Staff", employeeId: "VQS-054" }
              ]
            }
          ]
        }
      ]
    }
  }
};

function renderOrgSubPanel(searchQuery = '') {
  const listContainer = document.getElementById('subPanelList');
  const titleContainer = document.getElementById('subPanelTitle');
  
  if (!listContainer || !titleContainer) return;
  titleContainer.textContent = '조직도';
  
  const companies = ['CON-COST', 'Viet QS'];
  const companyLabels = {
    'CON-COST': '㈜컨코스트',
    'Viet QS': 'Viet QS (베트남 지사)'
  };
  
  let html = `
    <div style="padding: 10px 20px 4px 20px; font-size: 0.75rem; font-weight: 700; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.5px;">회사 선택</div>
  `;
  
  companies.forEach(comp => {
    const isActive = currentOrgCompany === comp ? 'active' : '';
    html += `
      <div class="list-item ${isActive}" data-company-filter="${comp}">
        <div class="list-item-content">
          <div class="list-item-header">
            <span class="list-item-title">${companyLabels[comp]}</span>
          </div>
        </div>
      </div>
    `;
  });
  
  listContainer.innerHTML = html;
  
  // Bind clicks
  listContainer.querySelectorAll('[data-company-filter]').forEach(item => {
    item.addEventListener('click', () => {
      currentOrgCompany = item.getAttribute('data-company-filter');
      renderOrgSubPanel(searchQuery);
      renderOrgWorkspace(searchQuery);
    });
  });
  
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function renderOrgWorkspace(searchQuery = '') {
  const workspaceContainer = document.getElementById('viewBodyContainer');
  const headerTitle = document.getElementById('viewHeaderTitle');
  const headerSubtitle = document.getElementById('viewHeaderSubtitle');
  const headerActions = document.getElementById('viewHeaderActionsContainer');
  
  if (!workspaceContainer || !headerTitle || !headerSubtitle || !headerActions) return;
  
  headerActions.innerHTML = '';
  
  // Render company logo in the header actions area
  const logoImg = document.createElement('img');
  if (currentOrgCompany === 'CON-COST') {
    logoImg.src = 'images/logo-concost-horizontal.png';
    logoImg.style.height = '28px';
  } else {
    logoImg.src = 'images/logo-vietqs.png';
    logoImg.style.height = '36px';
  }
  logoImg.style.objectFit = 'contain';
  logoImg.style.display = 'block';
  headerActions.appendChild(logoImg);
  
  const activeTree = orgStructures[currentOrgCompany].root;
  const titleText = orgStructures[currentOrgCompany].title;
  headerTitle.textContent = titleText;
  
  // Count stats
  let totalMembersCount = 0;
  const countMembers = (node) => {
    const isDept = node.nodeType === 'department';
    if (!isDept) {
      totalMembersCount++;
    }
    if (node.children) {
      node.children.forEach(countMembers);
    }
  };
  countMembers(activeTree);
  headerSubtitle.textContent = `조직도 표기 구성원: 총 ${totalMembersCount}명`;

  // Render tree container
  let treeHtml = `
    <div class="org-workspace-wrapper">
      <div class="org-tree-container">
        ${renderNodeHtml(activeTree, searchQuery)}
      </div>
    </div>
  `;
  
  workspaceContainer.innerHTML = treeHtml;
  
  // Bind actions
  workspaceContainer.querySelectorAll('[data-action-chat-user]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const userId = Number(btn.getAttribute('data-action-chat-user'));
      const activeUser = window.WorksState.state.currentUser;
      const dmId = `dm-${Math.min(activeUser.id, userId)}-${Math.max(activeUser.id, userId)}`;
      
      window.WorksState.switchActiveChat(dmId);
      window.WorksState.switchView('chat');
      window.dispatchEvent(new CustomEvent('statechanged'));
      
      if (window.AppShell && typeof window.AppShell.navigateTo === 'function') {
        window.AppShell.navigateTo('chat');
      }
    });
  });
  
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function renderNodeHtml(node, searchQuery = '') {
  const { state } = window.WorksState;
  const isDept = node.nodeType === 'department' || node.isDept;
  
  if (isDept) {
    // Check if matches search
    let isMatched = false;
    const title = node.displayName || node.title || '';
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      if (title.toLowerCase().includes(q)) {
        isMatched = true;
      }
    }
    const highlightClass = isMatched ? 'search-highlight' : '';
    
    return `
      <div class="org-dept-card-wrapper">
        <div class="org-dept-title ${highlightClass}" style="cursor: pointer; display: flex; align-items: center; gap: 8px;" onclick="this.parentElement.classList.toggle('collapsed')">
          <i data-lucide="chevron-down" class="org-toggle-icon" style="width: 16px; height: 16px; transition: transform 0.2s; color: var(--text-muted);"></i>
          <i data-lucide="folder" style="width: 14px; height: 14px; color: var(--primary-color);"></i>
          <span>${title}</span>
        </div>
        <div class="org-dept-children">
          ${node.children ? node.children.map(child => renderNodeHtml(child, searchQuery)).join('') : ''}
        </div>
      </div>
    `;
  }
  
  // Resolve employee details
  let name = node.name || '';
  let role = node.role || '';
  let email = node.email || '';
  let avatarColor = '#8b5cf6';
  let status = 'offline';
  let isTargetUser = false;
  let empNo = node.employeeId || '';
  let userId = null;
  
  const user = state.users.find(u => (empNo && u.empNo === empNo) || (node.userId && u.id === node.userId));
  if (user) {
    name = user.name;
    role = user.role;
    email = user.email;
    avatarColor = user.avatarColor || '#3b82f6';
    status = user.status || 'offline';
    isTargetUser = true;
    userId = user.id;
  } else {
    name = node.name || '미등록';
    role = node.title || '';
    email = node.email || '';
  }
  
  // Check search match
  let isMatched = false;
  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase().trim();
    if (
      (node.title && node.title.toLowerCase().includes(q)) ||
      (name && name.toLowerCase().includes(q)) ||
      (role && role.toLowerCase().includes(q)) ||
      (email && email.toLowerCase().includes(q))
    ) {
      isMatched = true;
    }
  }
  const highlightClass = isMatched ? 'search-highlight' : '';
  const initials = name.slice(-2);
  const statusLabels = {
    online: '온라인',
    busy: '다른 용무 중',
    away: '자리 비움',
    offline: '오프라인'
  };
  
  let memberCardHtml = `
    <div class="org-member-card ${highlightClass} ${isTargetUser ? 'active-user-card' : 'placeholder-user-card'}">
      <div style="display: flex; align-items: center; gap: 10px;">
        <div class="org-avatar" style="background-color: ${avatarColor};">
          ${initials}
          <span class="status-indicator ${status}" title="${statusLabels[status] || '오프라인'}"></span>
        </div>
        <div style="flex: 1; min-width: 0;">
          <div class="org-name-row">
            <span class="org-name">${name}</span>
            <span class="org-role-badge">${node.title || role}</span>
          </div>
          <div class="org-email" title="${email}">${email}</div>
        </div>
      </div>
      
      ${isTargetUser && userId !== state.currentUser?.id ? `
        <div class="org-card-actions" style="margin-top: 10px; display: flex; gap: 6px; border-top: 1px solid var(--border-color); padding-top: 8px;">
          <button class="btn btn-primary" style="padding: 4px 8px; font-size: 0.72rem; display: inline-flex; align-items: center; gap: 4px;" data-action-chat-user="${userId}">
            <i data-lucide="message-square" style="width: 11px; height: 11px;"></i> 1:1 대화
          </button>
        </div>
      ` : ''}
    </div>
  `;
  
  if (node.children && node.children.length > 0) {
    return `
      <div class="org-dept-card-wrapper" style="width: 100%;">
        <div style="position: relative; width: 100%;">
          ${memberCardHtml}
          <div class="org-member-toggle" style="position: absolute; right: 12px; top: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 6px; border: 1px solid var(--border-color); background-color: var(--bg-card); z-index: 10;" onclick="this.closest('.org-dept-card-wrapper').classList.toggle('collapsed')">
            <i data-lucide="chevron-down" class="org-toggle-icon" style="width: 14px; height: 14px; transition: transform 0.2s; color: var(--text-muted);"></i>
          </div>
        </div>
        <div class="org-dept-children" style="margin-top: 12px; padding-left: 12px; border-left: 1px dashed var(--border-color);">
          ${node.children.map(child => renderNodeHtml(child, searchQuery)).join('')}
        </div>
      </div>
    `;
  }
  
  return memberCardHtml;
}

// Expose globally
window.OrgView = {
  renderOrgSubPanel,
  renderOrgWorkspace
};
