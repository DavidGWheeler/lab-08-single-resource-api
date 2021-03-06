'use strict';

const http = require('http');
const Router = require('./lib/router');
const storage = require('./lib/storage');
const FishingLure = require('./model/fishingLure');
const debug = require('debug')('http:server');
const PORT = process.env.PORT || 3070;

const router = new Router();
const server = module.exports = http.createServer(router.route());

router.get('/api/lure', function(req, res) {
  debug('#GET /api/lure');
  if(req.url.query.id) {
    storage.fetchItem('lure', req.url.query.id)
  .then(lure => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(lure));
    res.end();
  })
  .catch(err => {
    console.error(err);
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.write('bad request');
    res.end();
  });
    return;
  }

  res.writeHead(400, {'Content-Type': 'text/plain'});
  res.write('bad request');
  res.end();
});

router.put('/api/lure', function(req, res) {
  debug('#PUT /api/lure');

  if(req.url.query.id) {
    storage.fetchItem('lure', req.url.query.id)
    .then(item => {
      if(req.body.name) item.name = req.body.name;
      if(req.body.name) item.type = req.body.type;
      if(req.body.targets) item.targets = req.body.targets;
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.write('lure updated!');
      res.end();
    })
    .catch(err => {
      console.error(err);
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.write('not found');
      res.end();
    });
    return;
  }
});

router.post('/api/lure', function(req, res) {
  debug('#POST /api/lure');
  console.log('Here is my body', req.body);
  console.log('FUNCTION here: ', storage.createItem);
  try {
    let lure = new FishingLure(req.body.name, req.body.type, req.body.targets, req.body.water);
    storage.createItem('lure', lure);
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write(JSON.stringify(lure));
    res.end();
  } catch(e) {
    console.error(e);
    res.writeHead(400, {'Content-Type': 'textplain'});
    res.write('bad request');
    res.end();
  }

  router.delete('/api/fishingLure', function(req, res) {
    debug('#DELETE /api/fishingLure');
    if (req.url.query.id) {
      storage.deleteItem('fishingLure', req.url.query.id)
        .then(() => {
          res.writeHead(204);
          res.end();
        })
        .catch (err => {
          console.error(err);
          res.writeHead(404, {'Content-Type': 'text/plain'});
          res.write('not found, cannot delete');
          res.end();
        });
      return;
    }
    res.writeHead(400, {'Content-Type': 'text/plain'});
    res.write('bad request');
    res.end();
  });
});

server.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
