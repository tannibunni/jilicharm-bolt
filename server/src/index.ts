import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 打印当前工作目录和 .env 文件路径
console.log('Current working directory:', process.cwd());
const envPath = path.resolve(process.cwd(), '.env');
console.log('Looking for .env file at:', envPath);

// 加载环境变量
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('Error loading .env file:', result.error);
} else {
  console.log('Successfully loaded .env file');
}

const app = express();
const port = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// DeepSeek API 配置
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL;
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

// 打印环境变量（不显示完整 API key）
console.log('Environment variables loaded:', {
  DEEPSEEK_BASE_URL,
  DEEPSEEK_API_KEY: DEEPSEEK_API_KEY ? '***' + DEEPSEEK_API_KEY.slice(-4) : undefined
});

// 检查必要的环境变量
if (!DEEPSEEK_API_KEY) {
  console.error('Error: DEEPSEEK_API_KEY is not set in environment variables');
  console.error('Please check your .env file in the project root directory');
  process.exit(1);
}

if (!DEEPSEEK_BASE_URL) {
  console.error('Error: DEEPSEEK_BASE_URL is not set in environment variables');
  console.error('Please check your .env file in the project root directory');
  process.exit(1);
}

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    config: {
      hasDeepSeekBaseUrl: !!DEEPSEEK_BASE_URL,
      hasDeepSeekApiKey: !!DEEPSEEK_API_KEY
    }
  });
});

// 根路径端点
app.get('/', (req, res) => {
  res.json({
    name: 'Feng Shui Analysis API',
    version: '1.0.0',
    endpoints: {
      '/': 'API information',
      '/health': 'Health check',
      '/api/analyze': 'Analyze birth information'
    },
    status: 'running'
  });
});

// DeepSeek API 代理端点
app.post('/api/analyze', async (req, res) => {
  try {
    const { date, time, location } = req.body;

    // Debug: print request data
    console.log('Received request:', { date, time, location });

    if (!date || !time || !location) {
      console.error('Missing required fields:', { date, time, location });
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
          content: `You are a professional BaZi (Four Pillars of Destiny) and Feng Shui consultant. Analyze the user's birth info and return ONLY a valid JSON object with English fields, structured exactly as shown below. Do NOT include any explanation, markdown, code block, or any text before or after the JSON. Output ONLY the JSON object, nothing else. If you add any text or code block formatting, you will be penalized.\n\n{\n  "elements": { "wood": 2, "fire": 3, "earth": 1, "metal": 0, "water": 4 },\n  "dominantElement": "fire",\n  "favorableElements": ["water", "wood"],\n  "luckyColors": ["blue", "green"],\n  "recommendations": ["Put a water fountain in the north corner.", "Wear metal accessories.", "Add wood elements in the east.", "Avoid strong fire elements"],\n  "encouragement": "Let your creativity flow like water."\n}`
        },
        {
          role: 'user',
          content: `Birth Date: ${date}\nBirth Time: ${time}\nBirth Location: ${location}`
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
      message: error instanceof Error ? error.message : 'Unknown error',
      response: error instanceof Error && 'response' in error ? (error as any).response?.data : undefined,
      status: error instanceof Error && 'response' in error ? (error as any).response?.status : undefined
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
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log('Environment check:', {
    hasDeepSeekBaseUrl: !!DEEPSEEK_BASE_URL,
    hasDeepSeekApiKey: !!DEEPSEEK_API_KEY
  });
}); 