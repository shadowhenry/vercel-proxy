const micro = require('micro');
const fetch = require('node-fetch');

const baseUrl = 'https://start.boldvoice.com';

const server = micro(async (req, res) => {
  try {
    const url = baseUrl + req.url;
    const response = await fetch(url);
    const contentType = response.headers.get('Content-Type') || '';
    res.setHeader('Content-Type', contentType);
    res.statusCode = response.status;
    res.end(await response.text());
  } catch (error) {
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
});

module.exports = server;
