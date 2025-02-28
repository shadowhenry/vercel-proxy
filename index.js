const micro = require('micro');
const fetch = require('node-fetch');

const PROXY_TARGET = 'https://start.boldvoice.com'; // 目标网站

const server = micro(async (req, res) => {
  try {
    // 构建目标 URL
    const targetUrl = new URL(req.url, PROXY_TARGET).toString();

    // 发起请求到目标网站
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        // 转发请求头
        ...req.headers,
        // 可选：移除或修改特定头
        // 'Host': 'AccentOracle.com',
      },
      // 转发请求体
      body: req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH' ? req : undefined,
    });

    // 设置响应头
    res.writeHead(response.status, response.statusText, {
      ...Object.fromEntries(response.headers.entries()),
      // 可选：移除或修改特定头
      // 'Content-Security-Policy': 'default-src \'self\'',
    });

    // 读取响应体并结束响应
    const body = await response.text();
    res.end(body);
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
});

module.exports = server;
