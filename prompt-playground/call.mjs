// 以 ES Module 方式运行，因此可用 import.meta.url 定位脚本自身路径
import { readFile } from 'node:fs/promises'; // 从 Node 内置模块导入异步读文件函数

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

// 使用 Node 自带的 fetch 向 DeepSeek Chat Completions 接口发 POST
const response = await fetch('https://api.deepseek.com/chat/completions', {
  method: 'POST', // HTTP 方法为 POST
  headers: {
    'Content-Type': 'application/json', // 请求体是 JSON
    Authorization: `Bearer ${apiKey}`, // 按官方要求用 Bearer Token 鉴权
  },
  body: JSON.stringify({
    model: 'deepseek-v4-flash', // 指定使用 deepseek-v4-flash 模型
    messages: [
      { role: 'system', content: systemContent }, // 系统角色消息
      { role: 'user', content: userContent }, // 用户角色消息
    ],
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
