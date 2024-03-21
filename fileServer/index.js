const fsPromises = require('fs/promises');
const http = require('http');
const path = require('path');
const url = require('url');
const mime = require('mime-types');

const port = 3000;

const server = http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(url.parse(req.url).pathname);
    const basePath = path.join(__dirname, 'public');
    const entityPath = path.join(basePath, pathname);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    if (!entityPath.startsWith(basePath)) {
      res.statusCode = 403;
      res.end('Forbidden');
      return;
    }
    try {
      const filesList = await fsPromises.readdir(entityPath);
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify(filesList));
    } catch (err) {
      if (err.code !== 'ENODIR') {
        const fileData = await fsPromises.readFile(entityPath);
        res.setHeader(
          'Content-Type',
          mime.contentType(
            path.extname(entityPath) || 'application/octet-stream'
          )
        );
        res.end(fileData);
        return;
      }
      throw new Error(err);
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      res.statusCode = 404;
      res.end('No such file or directory');
      return;
    }
    if (err instanceof URIError) {
      res.statusCode = 400;
      res.end('Bad request');
      return;
    }
    res.statusCode = 500;
    res.end(err.message);
  }
});
server.listen(port, () => {
  console.log(`server started at port ${port}`);
});
