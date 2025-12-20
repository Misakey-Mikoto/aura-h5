import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = Number(process.env.PORT || 5178)
const DIST_DIR = path.resolve(__dirname, 'dist')

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
}

function sendFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 404
      res.setHeader('Content-Type', 'text/plain; charset=utf-8')
      res.end('Not Found')
      return
    }

    const ext = path.extname(filePath).toLowerCase()
    res.statusCode = 200
    res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream')

    if (ext !== '.html') {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    } else {
      res.setHeader('Cache-Control', 'no-cache')
    }

    res.end(data)
  })
}

const server = http.createServer((req, res) => {
  if (!req.url) {
    res.statusCode = 400
    res.end('Bad Request')
    return
  }

  const url = new URL(req.url, 'http://localhost')
  const pathname = decodeURIComponent(url.pathname)

  let filePath = path.join(DIST_DIR, pathname)

  if (!filePath.startsWith(DIST_DIR)) {
    res.statusCode = 403
    res.end('Forbidden')
    return
  }

  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isDirectory()) {
      filePath = path.join(filePath, 'index.html')
      sendFile(res, filePath)
      return
    }

    if (!err && stat.isFile()) {
      sendFile(res, filePath)
      return
    }

    sendFile(res, path.join(DIST_DIR, 'index.html'))
  })
})

server.listen(PORT, '127.0.0.1', () => {
  process.stdout.write(`h5-server listening on http://127.0.0.1:${PORT}\n`)
})
