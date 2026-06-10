// Gemini API Integration Service - js/gemini.js

const GEMINI_API_KEY_STORAGE_KEY = 'GEMINI_API_KEY';

function getApiKey() {
  if (window.WorksState && window.WorksState.getGlobalApiKey) {
    return window.WorksState.getGlobalApiKey();
  }
  return '';
}

function setApiKey(key) {
  if (window.WorksState && window.WorksState.setGlobalApiKey) {
    window.WorksState.setGlobalApiKey(key);
  }
}

function hasApiKey() {
  return !!getApiKey();
}

let discoveredModel = null;

async function getBestAvailableModel(apiKey) {
  // Always use gemini-3.1-flash-lite as requested by the user
  discoveredModel = 'gemini-3.1-flash-lite';
  return discoveredModel;
}

async function callGeminiAPI(contents, systemInstructionText = '') {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('Gemini API Key가 등록되지 않았습니다. 우측 AI 챗봇 패널에서 API Key를 입력해 주세요.');
  }
  
  const model = await getBestAvailableModel(apiKey);
  
  // Function to perform request with a specific API version and optional native systemInstruction
  const executeRequest = async (apiVersion, useNativeSystemInstruction = true) => {
    const url = `https://generativelanguage.googleapis.com/${apiVersion}/models/${model}:generateContent?key=${apiKey}`;
    
    const body = {};
    
    if (useNativeSystemInstruction && systemInstructionText) {
      body.systemInstruction = {
        parts: [{ text: systemInstructionText }]
      };
      body.contents = contents;
    } else if (systemInstructionText && contents.length > 0) {
      // Fallback: Deep clone contents and prepend system instruction to the first user message
      const clonedContents = JSON.parse(JSON.stringify(contents));
      const firstUserMsg = clonedContents.find(msg => msg.role === 'user');
      if (firstUserMsg && firstUserMsg.parts && firstUserMsg.parts[0]) {
        firstUserMsg.parts[0].text = `[SYSTEM INSTRUCTION]\n${systemInstructionText}\n[END SYSTEM INSTRUCTION]\n\n${firstUserMsg.parts[0].text}`;
      }
      body.contents = clonedContents;
    } else {
      body.contents = contents;
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData.error?.message || `HTTP 에러! 상태 코드: ${response.status}`;
      return { ok: false, status: response.status, message: errorMsg };
    }
    
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return { ok: false, message: 'Gemini API로부터 빈 응답을 받았습니다.' };
    }
    return { ok: true, text: text.trim() };
  };

  // 1. Attempt using stable v1 version with native system instruction
  let result = await executeRequest('v1', true);
  
  // 2. If it fails because "systemInstruction" field is unknown, retry v1 by prepending the instruction to content
  if (!result.ok && (result.message.includes('systemInstruction') || result.message.includes('system_instruction'))) {
    console.warn('systemInstruction field not supported in v1, retrying with prepended content fallback...');
    result = await executeRequest('v1', false);
  }
  
  // 3. If v1 returns 404 or not found/supported, fallback to v1beta with native system instruction
  if (!result.ok && (result.status === 404 || result.message.includes('not found') || result.message.includes('not supported'))) {
    console.warn('Gemini v1 API failed, attempting v1beta fallback. Error:', result.message);
    result = await executeRequest('v1beta', true);
    
    // 4. If v1beta also fails due to systemInstruction field, retry v1beta by prepending
    if (!result.ok && (result.message.includes('systemInstruction') || result.message.includes('system_instruction'))) {
      console.warn('systemInstruction field not supported in v1beta, retrying with prepended content fallback...');
      result = await executeRequest('v1beta', false);
    }
  }
  
  if (!result.ok) {
    throw new Error(result.message);
  }
  
  return result.text;
}

async function translateText(text) {
  if (!text || text.trim() === '') return '';
  
  const prompt = `Translate the following text based on these rules:
1. If the input text is in Korean, translate it into Vietnamese. Output ONLY the translated Vietnamese text. Do not add any label.
2. If the input text is in Vietnamese, translate it into Korean. Output ONLY the translated Korean text. Do not add any label.
3. If the input text is in English, translate it into BOTH Korean and Vietnamese. You MUST output BOTH translations formatted exactly like this:
한국어: [Korean translation]
베트남어: [Vietnamese translation]

Do not add any explanations, notes, greetings, or meta-text.

Text to translate:
${text}`;

  const contents = [
    {
      role: 'user',
      parts: [{ text: prompt }]
    }
  ];
  
  try {
    return await callGeminiAPI(contents, "You are a professional, accurate translation assistant. You translate Korean to Vietnamese, Vietnamese to Korean, and English to both Korean and Vietnamese. No explanation or meta-talk.");
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
}

function getSystemContext() {
  const state = window.WorksState?.state;
  if (!state) return '시스템 데이터를 로드할 수 없습니다.';
  
  const currentUser = state.currentUser || { name: '알 수 없음', role: '', dept: '' };
  
  // Format simple lists to save tokens and avoid JSON clutter
  const usersSummary = state.users.map(u => `- ${u.name} ${u.role} (${u.dept}): ${u.statusMsg || '상태 메시지 없음'} [이메일: ${u.email}, 전화: ${u.phone}]`).join('\n');
  
  const tasksSummary = state.tasks.map(t => {
    const assignee = state.users.find(u => u.id === t.assigneeId)?.name || '알 수 없음';
    return `- [상태: ${t.status}] ${t.title} (담당자: ${assignee}, 우선순위: ${t.priority}, 기한: ${t.dueDate})`;
  }).join('\n');
  
  const eventsSummary = state.events.map(e => {
    const participants = e.participants.map(pId => state.users.find(u => u.id === pId)?.name || '알 수 없음').join(', ');
    return `- 일정명: ${e.title} (${e.start} ~ ${e.end}, 참석자: ${participants}, 내용: ${e.description || '없음'})`;
  }).join('\n');
  
  const postsSummary = state.posts.map(p => {
    const author = state.users.find(u => u.id === p.authorId)?.name || '알 수 없음';
    return `- [게시물] 제목: ${p.title} (작성자: ${author}) 내용: ${p.content}`;
  }).join('\n');
  
  const mailsSummary = state.mails.map(m => {
    const sender = state.users.find(u => u.id === m.senderId)?.name || '알 수 없음';
    return `- [메일] 발신자: ${sender}, 제목: ${m.subject}, 보관함: ${m.folder}`;
  }).join('\n');

  return `당신은 네이버웍스 스타일의 "CC" 포탈 내부의 똑똑한 "CC AI 비서"(챗봇)입니다.
현재 접속한 사용자와 포탈 내 데이터를 기반으로 사용자의 질문에 친절하고 정확하게 답변해 주세요.
반드시 한국어로 자연스럽고 정중하게 답변해야 합니다.

[현재 접속한 사용자 정보]
이름/직급: ${currentUser.name} ${currentUser.role}
부서: ${currentUser.dept}
이메일: ${currentUser.email}

[사내 주소록 / 임직원 목록]
${usersSummary}

[등록된 할 일 (Tasks)]
${tasksSummary}

[캘린더 일정 (Calendar Events)]
${eventsSummary}

[게시판 공지사항 (Board Posts)]
${postsSummary}

[최근 메일 목록 (Mails)]
${mailsSummary}

[지침]
1. 사용자가 "오늘 내 할 일", "일정", "메일", "동료 정보" 등을 물어보면 위 목록에서 현재 사용자에 해당하는 정보를 정확히 찾아내어 보기 좋게 정리해서 알려주세요.
2. 만약 포탈 외적인 일반 지식이나 질문을 하면, 기본적으로 비서로서 답변해주되 "CC AI 비서로서 알려드립니다" 등으로 답변에 도움을 줍니다.
3. 답변을 할 때는 마크다운 형식을 적극 활용하여 가독성 있게 표현해 주세요.
4. 사용자 이름이나 호칭은 항상 정중하게 존댓말로 응대하세요.
`;
}

async function askChatbot(question, chatHistory = []) {
  if (!question || question.trim() === '') return '';
  
  const systemPrompt = getSystemContext();
  
  // Format history for Gemini API
  // Gemini expects:
  // 1. Roles: 'user' and 'model'
  // 2. Strict alternating order (user -> model -> user -> model...)
  // 3. Must start with a 'user' message.
  const formattedContents = [];
  
  // Filter history to start from the first user message (skipping initial bot greeting)
  const firstUserIndex = chatHistory.findIndex(msg => msg.isUser);
  const validHistory = firstUserIndex !== -1 ? chatHistory.slice(firstUserIndex) : [];
  
  // Take last 6 messages to keep context window reasonable
  let historySlice = validHistory.slice(-6);
  
  // Ensure the slice starts with a 'user' message
  if (historySlice.length > 0 && !historySlice[0].isUser) {
    historySlice.shift();
  }
  
  // Ensure the slice ends with a 'model' message so appending the new question alternates correctly
  if (historySlice.length > 0 && historySlice[historySlice.length - 1].isUser) {
    historySlice.pop();
  }
  
  historySlice.forEach(msg => {
    formattedContents.push({
      role: msg.isUser ? 'user' : 'model',
      parts: [{ text: msg.text }]
    });
  });
  
  // Add the new user question
  formattedContents.push({
    role: 'user',
    parts: [{ text: question }]
  });
  
  try {
    return await callGeminiAPI(formattedContents, systemPrompt);
  } catch (error) {
    console.error('Chatbot error:', error);
    throw error;
  }
}

// Expose services globally
window.GeminiService = {
  getApiKey,
  setApiKey,
  hasApiKey,
  translateText,
  askChatbot,
  getSystemContext
};
