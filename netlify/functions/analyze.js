const axios = require('axios');

exports.handler = async (event, context) => {
  // 设置CORS头
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Origin, Accept',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // 处理预检请求
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // 解析请求体
    const { date, time, location } = JSON.parse(event.body);

    if (!date || !time || !location) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Missing required fields',
          details: { date, time, location }
        })
      };
    }

    // 调用ChatGPT API
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a professional BaZi (Four Pillars of Destiny) and Feng Shui consultant. Analyze the user's birth info and return ONLY a valid JSON object with English fields, structured exactly as shown below. Do NOT include any explanation, markdown, code block, or any text before or after the JSON. Output ONLY the JSON object, nothing else. If you add any text or code block formatting, you will be penalized.

{
  "elements": { "wood": 2, "fire": 3, "earth": 1, "metal": 0, "water": 4 },
  "dominantElement": "fire",
  "favorableElements": ["water", "wood"],
  "luckyColors": ["blue", "green"],
  "recommendations": ["Put a water fountain in the north corner.", "Wear metal accessories.", "Add wood elements in the east.", "Avoid strong fire elements"],
  "encouragement": "Let your creativity flow like water."
}`
          },
          {
            role: 'user',
            content: `Birth Date: ${date}\nBirth Time: ${time}\nBirth Location: ${location}`
          }
        ],
        temperature: 0.2
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 20000
      }
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response.data)
    };

  } catch (error) {
    console.error('Error in analyze function:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        details: error.message
      })
    };
  }
}; 