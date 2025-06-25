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
    console.log('Calling ChatGPT API with:', { date, time, location });
    
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a professional BaZi (Four Pillars of Destiny) and Feng Shui consultant. Analyze the user's birth information using traditional Chinese astrology principles and return ONLY a valid JSON object with the following structure. Do NOT include any explanation, markdown, code block, or any text before or after the JSON. Output ONLY the JSON object, nothing else.

The JSON must contain:
- "elements": An object with five elements (wood, fire, earth, metal, water) and their numerical values (0-10)
- "dominantElement": The strongest element from the analysis
- "favorableElements": Array of 1-3 elements that would benefit the person
- "luckyColors": Array of colors that match the favorable elements
- "recommendations": Array of 3-5 practical Feng Shui recommendations
- "encouragement": A personalized encouraging message

Base your analysis on the actual birth date, time, and location provided. Each person should get unique results based on their specific birth information.`
          },
          {
            role: 'user',
            content: `Please analyze my birth information and provide a personalized Feng Shui reading:

Birth Date: ${date}
Birth Time: ${time}
Birth Location: ${location}

Return only the JSON object with my personalized analysis.`
          }
        ],
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 20000
      }
    );

    console.log('ChatGPT API response received');
    console.log('Raw ChatGPT content:', response.data.choices[0].message.content);

    // 确保返回正确的格式，与前端期望的格式一致
    const chatGPTResponse = {
      choices: [
        {
          message: {
            content: response.data.choices[0].message.content
          }
        }
      ]
    };

    console.log('Returning formatted response');
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(chatGPTResponse)
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