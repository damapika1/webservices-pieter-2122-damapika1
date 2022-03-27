const config = require('config');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('@koa/router');
const koaCors = require('@koa/cors');
const {
	initializeLogger,
	getLogger
} = require('./core/logging');
const noteService = require('./service/note');
const {
	initializeData,shutdownData
} = require('./data');
//const { loggers } = require('winston');
const installRest = require('./rest');

const NODE_ENV = config.get('env');
const LOG_LEVEL = config.get('log.level');
const LOG_DISABLED = config.get('log.disabled');
const CORS_ORIGINS = config.get('cors.origins');
const CORS_MAX_AGE = config.get('cors.maxAge');
const port = config.get('port');
const host = config.get('host');
module.exports=async function createServer(){
  initializeLogger({
		level: LOG_LEVEL,
		disabled: LOG_DISABLED,
		isProduction: NODE_ENV === 'production',
		defaultMeta: {
			NODE_ENV
		},
	});


	await initializeData();

	const app = new Koa();

	app.use(koaCors({
		origin: (ctx) => {
			if (CORS_ORIGINS.indexOf(ctx.request.header.origin) != -1) {
				return ctx.request.header.origin;
			}
			return CORS_ORIGINS[0];
		},
		allowHeaders: ['Accept', 'Content-Type', 'Authorization'],
		maxAge: CORS_MAX_AGE,

	}));
  const logger= getLogger();
	app.use(bodyParser());
	installRest(app);
  return{
    getApp(){
      return app;
    },
    async start(){
      return new Promise((resolve)=>{
        
	app.listen(port);
	logger.info(`Server listening on http://${host}:${port}`);
  resolve();
      })
    },
    async stop(){
      app.removeAllListeners();
      await shutdownData();
      logger.info('Goodbye');
    }
  };
}