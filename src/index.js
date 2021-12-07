/**
 * REST (REST API beschikbaar stellen)/GaphQL
 * SERVICE (business logica)
 * REPOSITORY (queries opbouwen & uitvoeren)
 * DATA (connectie met detabank onderhouden)
 * DATABANK (MySQL)
 * 
 */

const config = require('config');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('@koa/router');
const {
	getLogger
} = require('./core/logging');
const noteService = require('./service/note');

const NODE_ENV=config.get('env');
const LOG_LEVEL=config.get('LOG.LOG_LEVEL');
const LOG_DISABLED=config.get('LOG.LOG_DISABLED');
const port= config.get('port');
const host=config.get('host');

const app = new Koa();
const logger = getLogger();

console.log(`NODE_ENV=${NODE_ENV}`);
console.log(`log level= ${LOG_LEVEL}, log disabled= ${LOG_DISABLED}`);

app.use(bodyParser());


const router = new Router();

router.get('/api/notes',async(ctx)=>{
ctx.body= noteService.getAll();
});
router.post('/api/notes',async (ctx)=>{
	const newNote = noteService.create({
	...ctx.request.body,
	date:new Date(ctx.request.body.date)
});
ctx.body=newNote;
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(port);
logger.info(`Server listening on http://${host}:${port}`);