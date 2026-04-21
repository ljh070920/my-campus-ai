// api/chat.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支持 POST 请求' });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: '消息不能为空' });
  }

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { 
            role: 'system', 
            content: '你是吉林铁道职业技术大学的校园AI助手。请友好、准确地回答校园相关问题。' 
          },
          { role: 'user', content: message }
        ],
        stream: false
      })
    });

    const data = await response.json();
    const reply = data.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (error) {
    console.error('DeepSeek API 调用失败:', error);
    res.status(500).json({ error: 'AI 服务暂时不可用' });
  }
}
