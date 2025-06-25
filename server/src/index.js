import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

// 加载环境变量
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 健康检查
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Jilicharm backend running' });
});

// DeepSeek API 代理
app.post('/api/analyze', async (req, res) => {
  try {
    const { date, time, location } = req.body;
    const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL;
    const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

    console.log('Request received:', { date, time, location });
    console.log('API Config:', { 
      hasBaseUrl: !!DEEPSEEK_BASE_URL, 
      hasApiKey: !!DEEPSEEK_API_KEY 
    });

    if (!DEEPSEEK_BASE_URL || !DEEPSEEK_API_KEY) {
      console.error('Missing API configuration');
      return res.status(500).json({ 
        error: 'Server configuration error',
        details: 'DeepSeek API configuration is missing'
      });
    }

    if (!date || !time || !location) {
      console.error('Missing required fields');
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: { date, time, location }
      });
    }

    const payload = {
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: "You are a professional BaZi (Four Pillars of Destiny) and Feng Shui consultant. Analyze the user's birth info and return a JSON object with five elements analysis, dominant element, favorable elements, lucky colors, recommendations, and encouragement."
        },
        {
          role: 'user',
          content: `Birth date: ${date}\nBirth time: ${time}\nBirth location: ${location}`
        }
      ],
      temperature: 0.2
    };

    console.log('Sending request to DeepSeek API...');
    const response = await axios.post(
      `${DEEPSEEK_BASE_URL}/v1/chat/completions`,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 20000
      }
    );

    console.log('DeepSeek API response received');
    res.json(response.data);
  } catch (error) {
    console.error('Error in /api/analyze:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });

    if (axios.isAxiosError(error)) {
      return res.status(error.response?.status || 500).json({
        error: 'DeepSeek API error',
        details: {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data
        }
      });
    }

    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 