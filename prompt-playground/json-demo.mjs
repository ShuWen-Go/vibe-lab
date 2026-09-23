// 以 ES Module 方式运行，因此可用 import.meta.url 定位脚本自身路径
import { readFile } from 'node:fs/promises'; // 从 Node 内置模块导入异步读文件函数

// 读取素材：仓库根目录的 README.md（脚本在 prompt-playground\，所以是 ../）
const article = await readFile(new URL('../README.md', import.meta.url), 'utf8');

const round = 3;                    // ← 一次只改这一个数字
const instr1 = `只说"帮我提取信息和要点"`;
const instr2 = `你是信息提取器。从用户给出的文字里提取信息，只输出一个 JSON 对象。

【只输出 JSON】
- 不要任何开场白、说明文字或结尾总结
- 不要用小标题、加粗、列表符号等 markdown 排版
- 不要用代码块标记把 JSON 包起来
- 输出的第一个字符必须是 {，最后一个字符必须是 }

【字段规范】必须包含且只包含这 4 个字段：
- summary：字符串。用一句话概括全文主旨，不超过 60 字。
- points：字符串数组。3 到 6 条关键信息，每条不超过 30 字。
- quotes：字符串数组。从原文原样摘录最有代表性的话，不要改写；没有就给空数组。
- todos：字符串数组。原文提到的下一步要做的事；没有就给空数组。

【书写要求】
- 键名和字符串值都用半角双引号
- 字符串内部不要换行；要分条就拆成数组元素`;


const instruction = round === 1 ? instr1 : instr2;
const messages = [{ role: 'system', content: instruction }];

if (round === 3) {                  // ③ 的 few-shot：唯一区别就是这两条
  messages.push(
    { role: 'user', content: '示例输入：《今天把阳台的绿萝挪到了窗边。顺手记了个坑：浇太多水根会烂。下一步想买个花架。》' },
    { role: 'assistant', content: '{"summary":"把绿萝挪到窗边并记录了浇水教训，计划添置花架","points":["绿萝从阳台挪到窗边","浇水过量会导致烂根","计划买花架"],"quotes":["浇太多水根会烂"],"todos":["买个花架"]}' },
  );
}

messages.push({ role: 'user', content: `请从下面这段文字中提取信息：\n\n${article}` });
console.log('脚本:', process.argv[1], '| round =', round, '| 条数:', messages.length, '| roles:', messages.map((m) => m.role).join(','));


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
    model: 'deepseek-v4-flash',
    messages,                        // 用上面拼好的 messages 数组
    temperature: 0,                  // 结构化输出：压掉随机性
    max_tokens: 4000,                // reasoning 会吃掉大半额度，给足
    stream: false,

  }),
});

// 把响应体解析成 JSON 对象
const data = await response.json();
// 若 HTTP 状态不是 2xx，把接口返回的错误信息打印出来并退出
if (!response.ok) {
  throw new Error(`请求失败 ${response.status}: ${JSON.stringify(data)}`);
}

const content = data.choices[0].message.content;
console.log(content);

function checkJson(raw) {
  let t = raw.trim();
  const fenced = /^```/.test(t);
  t = t.replace(/^```(?:json)?\s*/i, '').replace(/```$/, '').trim();
  try { JSON.parse(t); return fenced ? '⚠️ 合法，但被代码围栏包住' : '✅ 合法 JSON'; }
  catch (e) { return '❌ 非法：' + e.message; }
}

console.log('校验结果:', checkJson(content));
console.log('finish_reason:', data.choices[0].finish_reason);
console.log('开头 60 字:', content.slice(0, 60));
try {
  const srcFlat = article.replace(/\s/g, '');
  const parsed = JSON.parse(content);
  console.log('points 条数:', parsed.points.length, '| quotes 条数:', parsed.quotes.length);
  for (const q of parsed.quotes) {
    console.log(srcFlat.includes(q.replace(/\s/g, '')) ? '  ✅ 照录：' + q : '  ❌ 改写：' + q);
  }
} catch {
  console.log('跳过字段校验（JSON 不合法）');
}


// 打印本次请求消耗的 prompt / completion / total token 数量
console.log('prompt_tokens:', data.usage.prompt_tokens);
console.log('completion_tokens:', data.usage.completion_tokens);
console.log('reasoning_tokens:', data.usage.completion_tokens_details?.reasoning_tokens ?? 0);
console.log('total_tokens:', data.usage.total_tokens);
