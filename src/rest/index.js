const Router = require('@koa/router');
const installNoteRouter = require('./_notes');
const installHealthRouter = require('./_health');
// const installPlaceRouter = require('./_places');
// const installUserRouter = require('./_user');

/**
 * Install all routes in the given Koa application.
 *
 * @param {Koa} app - The Koa application.
 */
module.exports = (app) => {
	const router = new Router({
		prefix: '/api',
	});

	installNoteRouter(router);
	//installPlaceRouter(router);
	installHealthRouter(router);
//	installUserRouter(router);

	app.use(router.routes()).use(router.allowedMethods());
};