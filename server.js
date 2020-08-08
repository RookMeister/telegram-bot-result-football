'use strict'
require('dotenv').config();
const http = require('http')

const ip = process.env.IP || 'localhost'
const port = process.env.PORT || 8080
const url = `https://telegram.me/${process.env.CHANNEL}`

const server = http.createServer((request, response) => {
  response.writeHead(200, {'Content-Type': 'text/html'})
  response.end(`Этот бот помогает узнать результаты матчей и другую статистику <a href = '${url}'>${url}</a>`)
})

server.listen(port)

console.log(`Server listening at http://${ip}:${port}/`)