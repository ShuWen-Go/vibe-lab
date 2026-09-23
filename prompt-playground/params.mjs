// 以 ES Module 方式运行，因此可用 import.meta.url 定位脚本自身路径
import { readFile } from 'node:fs/promises'; // 从 Node 内置模块导入异步读文件函数

const temperature = 0; 
const maxTokens = 4000; 
const useStream = false; 
// 把命令行第一个参数当作 system 提示词；没有传参时给一个默认值
const systemContent = process.argv[2] ?? 'You are a helpful assistant.';
// 把命令行第二个参数当作 user 内容；没有传参时给一个默认值
const userContent = process.argv[3] ?? 'Hello';

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

// 把这次要发送的消息数组显式写出来：打印与发送共用同一份，避免两份副本各自漂移
const messages = [
  { role: 'system', content: systemContent }, // 恢复正常 system
  { role: 'user', content: userContent },
];


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
    temperature: temperature,
    max_tokens: maxTokens,
    stream: useStream,
  }),
});


if (useStream) {
  // 流式：服务端一小块一小块地吐，我们一小块一小块地读、立刻打印
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const piece = decoder.decode(value, { stream: true });
    total += piece.length;
    process.stdout.write(piece);
  }
  console.log('\n--- 流结束，共收到', total, '个字符 ---');
} else {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(`请求失败 ${response.status}: ${JSON.stringify(data)}`);
  }
  console.log(data.choices[0].message.content);
  console.log('finish_reason:', data.choices[0].finish_reason);
  console.log('prompt_tokens:', data.usage.prompt_tokens);
  console.log('completion_tokens:', data.usage.completion_tokens);
  console.log('total_tokens:', data.usage.total_tokens);
  console.log('本次用量全貌:', data.usage);
}
