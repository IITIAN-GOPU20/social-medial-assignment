const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const router = express.Router();

const postServiceProxy = createProxyMiddleware({
  target: process.env.POST_SERVICE_URL,
  changeOrigin: true,
});

router.use('/', postServiceProxy);

module.exports = router;
