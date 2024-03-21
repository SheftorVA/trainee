const fs = require('fs');
const http = require('http');
const path = require('path');
const url = require('url');

const port = 3000;

const server = http.createServer((req, res) => {
  const defaultURL = url.parse(req.url);

  let basePath = path.join(__dirname, 'static');

  fs.stat(path.join(basePath, defaultURL.pathname), (err, stats) => {
    if (err) {
      res.statusCode = 404;
      res.end('No such file or directory');
    } else if (stats.isFile()) {
      const filePath = path.join(basePath, defaultURL.pathname);
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.statusCode = 500;
          res.end('Error of reading file');
        } else {
          if (path.extname(filePath) === '')
            res.setHeader('Content-Type', 'application/octet-stream');
          else if (path.extname(filePath) === '.html')
            res.setHeader('Content-Type', 'text/html');
          else if (path.extname(filePath) === '.txt')
            res.setHeader('Content-Type', 'text/plain');
          else if (path.extname(filePath) === '.png')
            res.setHeader('Content-Type', 'image/png');
          else if (path.extname(filePath) === '.jpg')
            res.setHeader('Content-Type', 'image/jpg');
          else if (path.extname(filePath) === '.jpeg')
            res.setHeader('Content-Type', 'image/jpeg');
          else if (path.extname(filePath) === '.json')
            res.setHeader('Content-Type', 'application/json');
          res.write(data);
          res.end();
        }
      });
    } else {
      fs.readdir(
        path.join(__dirname, 'static', defaultURL.pathname),
        (err, files) => {
          res.setHeader('Content-Type', 'application/json');
          if (err) {
            res.statusCode = 500;
            res.end('Reading directory error');
          } else {
            res.end(JSON.stringify(files));
          }
        }
      );
    }
  });
});

server.listen(port, () => {
  console.log(`server started at port ${port}`);
});
