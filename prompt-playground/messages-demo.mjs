const messages = [
  { role: 'system', content: '你是一位设备管理专家，熟悉建筑各类设备的操作和维护' }, 
  { role: 'user',   content: '你好，我是园区设备管理的负责人' },
  { role: 'assistant', content: '你们园区共 3 台电梯，其中 2 台是 2015 年进口的磁悬浮电梯。' }, 
  { role: 'user',      content: '那我这 3 台电梯今年该怎么排维保计划？' },   
];

// 以 ES Module 方式运行，因此可用 import.meta.url 定位脚本自身路径
import { readFile } from 'node:fs/promises'; // 从 Node 内置模块导入异步读文件函数



// 相对「本脚本文件」解析上一级目录里的 .env，而不是相对当前工作目录
const envUrl = new URL('../.env', import.meta.url);
// 以 UTF-8 文本读出整个 .env 文件内容
const envText = await readFile(envUrl, 'utf8');

// 用来存放从 .env 里解析出的键值对
const env = {};
// 按行拆分 .env 文本，逐行解析 KEY=VALUE
for (const rawLine of envText.split(/\r?\n/)) {
  // 去掉行首尾空白
  const line = rawLine.trim();
  // 跳过空行和以 # 开头的注释行
  if (!line || line.startsWith('#')) continue;
  // 找到第一个等号，把键和值分开
  const eq = line.indexOf('=');
  // 没有等号的行不是合法配置，直接跳过
  if (eq === -1) continue;
  // 等号左边是键名，去掉首尾空格
  const key = line.slice(0, eq).trim();
  // 等号右边是值，去掉首尾空格，并去掉成对的单引号或双引号
  const value = line.slice(eq + 1).trim().replace(/^(['"])(.*)\1$/, '$2');
  // 把解析结果放进对象，后面用 env.DEEPSEEK_API_KEY 取出
  env[key] = value;
}

// 取出 DeepSeek API 密钥
const apiKey = env.DEEPSEEK_API_KEY;
// 没有配置密钥时立刻报错退出，避免发出无效请求
if (!apiKey) {
  throw new Error('未在上一级目录的 .env 中找到 DEEPSEEK_API_KEY');
}

console.log('实际发送:', JSON.stringify(messages, null, 2));
// 使用 Node 自带的 fetch 向 DeepSeek Chat Completions 接口发 POST
const response = await fetch('https://api.deepseek.com/chat/completions', {
  method: 'POST', // HTTP 方法为 POST
  headers: {
    'Content-Type': 'application/json', // 请求体是 JSON
    Authorization: `Bearer ${apiKey}`, // 按官方要求用 Bearer Token 鉴权
  },
  body: JSON.stringify({
    model: 'deepseek-v4-flash', // 指定使用 deepseek-v4-flash 模型
    messages: messages,
  }),
});

// 把响应体解析成 JSON 对象
const data = await response.json();
// 若 HTTP 状态不是 2xx，把接口返回的错误信息打印出来并退出
if (!response.ok) {
  throw new Error(`请求失败 ${response.status}: ${JSON.stringify(data)}`);
}

// 打印模型回复的正文内容
console.log(data.choices[0].message.content);
// 打印本次请求消耗的 prompt / completion / total token 数量
console.log('prompt_tokens:', data.usage.prompt_tokens);
console.log('completion_tokens:', data.usage.completion_tokens);
console.log('total_tokens:', data.usage.total_tokens);
console.log('本次用量全貌:', data.usage);
