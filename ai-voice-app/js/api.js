// 接口基础地址
const BASE_URL = 'http://localhost:8000';

// 语音识别接口
async function recognizeVoice(audioBlob) {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');
    
    try {
        const response = await fetch(`${BASE_URL}/api/voice-recognition`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) throw new Error('接口请求失败');
        return await response.json();
    } catch (err) {
        console.error('语音识别接口报错:', err);
        alert('语音识别失败，请重试');
        return null;
    }
}

// 执行操作接口（比如点外卖）
async function execOperation(text) {
    try {
        const response = await fetch(`${BASE_URL}/api/exec-operation`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        
        if (!response.ok) throw new Error('操作执行失败');
        return await response.json();
    } catch (err) {
        console.error('操作执行接口报错:', err);
        alert('操作执行失败，请重试');
        return null;
    }
}