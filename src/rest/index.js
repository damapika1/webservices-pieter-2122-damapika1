const Router = require('@koa/router');

const installNoteRouter = require('./_note');
const installHealthRouter = require('./_health');
const installUserRouter = require('./_user');
const installPinRouter = require('./_pin');

module.exports = (app) => {
  const router = new Router({
    prefix: '/api',
  });

  installNoteRouter(router);
  installPinRouter(router);
  installHealthRouter(router);
  installUserRouter(router);

  app.use(router.routes()).use(router.allowedMethods());
};