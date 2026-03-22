// ========== 新增代码 1：定义录音指示器元素（文件最顶部） ==========
const recordingIndicator = document.getElementById('recordingIndicator');

// 核心DOM元素
const recordButton = document.getElementById('recordButton');
const chatContainer = document.getElementById('chatContainer');
const statusText = document.getElementById('statusText');

// 录音状态
let isRecording = false;
let mediaRecorder = null;
let audioChunks = [];

// 适配移动端/PC端的按住/松手事件
recordButton.addEventListener('touchstart', startRecording);
recordButton.addEventListener('touchend', stopRecording);
recordButton.addEventListener('touchcancel', stopRecording);
recordButton.addEventListener('mousedown', startRecording);
recordButton.addEventListener('mouseup', stopRecording);
recordButton.addEventListener('mouseleave', stopRecording);

// 开始录音
async function startRecording() {
    if (isRecording) return;
    
    isRecording = true;
    recordButton.classList.add('recording');
    recordButton.innerHTML = `
        <svg class="record-icon" viewBox="0 0 24 24">
            <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" fill="currentColor"/>
        </svg>
        <span>正在录音...</span>
    `;
    statusText.textContent = '🎙️ 正在录音，请说话...';

    // ========== 新增代码 2：显示声波动画（这里） ==========
    recordingIndicator.classList.add('active');

    // 真实项目中启用麦克风录音（需HTTPS/本地环境）
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];
        
        mediaRecorder.ondataavailable = (e) => {
            audioChunks.push(e.data);
        };
        
        mediaRecorder.start();
    } catch (err) {
        console.error('录音权限获取失败:', err);
        statusText.textContent = '❌ 请允许麦克风权限';
        stopRecording();
    }
}

// 停止录音
function stopRecording() {
    if (!isRecording) return;
    
    isRecording = false;
    recordButton.classList.remove('recording');
    recordButton.innerHTML = `
        <svg class="record-icon" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.42 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" fill="currentColor"/>
        </svg>
        <span>按住说话</span>
    `;
    statusText.textContent = '🔍 正在识别语音...';

    // ========== 新增代码 3：隐藏声波动画（这里） ==========
    recordingIndicator.classList.remove('active');

    // 停止录音并处理音频数据
    if (mediaRecorder) {
        mediaRecorder.stop();
        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            
            // 调用语音识别接口
            const recognizeResult = await recognizeVoice(audioBlob);
            if (!recognizeResult) {
                statusText.textContent = '❌ 识别失败，请重试';
                return;
            }
            
            // 添加用户消息气泡
            addMessageBubble(recognizeResult.text, 'user');
            statusText.textContent = '✅ 语音识别完成，正在执行操作...';
            
            // 调用执行操作接口
            const execResult = await execOperation(recognizeResult.text);
            if (execResult) {
                addMessageBubble(execResult.message, 'ai');
                statusText.textContent = '✅ 操作执行完成';
            } else {
                statusText.textContent = '❌ 操作执行失败';
            }
            
            // 停止所有音频流
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
        };
    }
}

// 添加消息气泡到聊天区域
function addMessageBubble(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = `${type}-bubble message-bubble`;
    bubbleDiv.textContent = text;
    
    messageDiv.appendChild(bubbleDiv);
    chatContainer.appendChild(messageDiv);
    
    // 自动滚动到底部
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// 适配移动端滚动
chatContainer.addEventListener('touchmove', (e) => {
    e.preventDefault();
}, { passive: false });