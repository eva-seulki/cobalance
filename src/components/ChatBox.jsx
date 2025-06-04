import React, { useState } from 'react';
import { fetchHFResponse } from '../../src/api/useChatGPT';

function ChatBox() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: '안녕하세요! 무엇을 도와드릴까요?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const aiReply = await fetchHFResponse(input, "emotion"); // phase도 선택 가능
      setMessages((msgs) => [...msgs, { role: 'ai', content: aiReply }]);
    } catch (error) {
      setMessages((msgs) => [...msgs, { role: 'ai', content: 'AI 응답에 실패했습니다.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: 600, margin: 'auto' }}>
      <h1>CoBalance AI</h1>
      <div style={{ border: '1px solid #ccc', padding: '1rem', minHeight: 200, overflowY: 'auto' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ margin: '0.5rem 0' }}>
            <strong>{msg.role}:</strong> {msg.content}
          </div>
        ))}
        {loading && <div>AI가 답변을 작성 중입니다...</div>}
      </div>
      <div style={{ marginTop: '1rem' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ width: '80%', padding: '0.5rem' }}
          placeholder="메시지를 입력하세요"
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={loading}
        />
        <button onClick={handleSend} style={{ padding: '0.5rem 1rem', marginLeft: '0.5rem' }} disabled={loading}>
          전송
        </button>
      </div>
    </div>
  );
}

export default ChatBox;
