const config = require('config');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('@koa/router');
const koaCors = require('@koa/cors');

const {
	getLogger
} = require('./core/logging');
const noteService = require('./service/note');
//environment configuratie
const NODE_ENV = config.get('env');
const LOG_LEVEL = config.get('log.level');
const LOG_DISABLED = config.get('log.disabled');
const CORS_ORIGINS = config.get('cors.origins');
const CORS_MAX_AGE = config.get('cors.maxAge');

const port = config.get('port');
const host = config.get('host');


const app = new Koa();
const logger = getLogger();

console.log(`NODE_ENV=${NODE_ENV}`);
console.log(`log level= ${LOG_LEVEL}, log disabled= ${LOG_DISABLED}`);
/**
 * REST (REST API beschikbaar stellen)/GaphQL
 * SERVICE (business logica)
 * REPOSITORY (queries opbouwen & uitvoeren)
 * DATA (connectie met detabank onderhouden)
 * DATABANK (MySQL)
 * 
 */
app.use(koaCors({
	origin: (ctx) => {
		if (CORS_ORIGINS.indexOf(ctx.request.header.origin) != -1) {
			return ctx.request.header.origin;
		}
		return CORS_ORIGINS[0];
	},
	allowHeaders: ['Accept', 'Content-Tyoe', 'Authorization'],
	maxAge: CORS_MAX_AGE,

}));
app.use(bodyParser());

const router = new Router();

router.get('/api/notes', async (ctx) => {
	ctx.body = await noteService.getAll();
});
router.get('/api/notes/:id', async (ctx) => {
	ctx.body = await noteService.getById(ctx.params.id);
});
router.put('/api/notes/:id', async (ctx) => {
	ctx.body = await noteService.updateById(ctx.params.id, {
		...ctx.request.body,
		date: new Date(ctx.request.body.date)
	});
});
router.delete('/api/notes/:id', async (ctx) => {
	await noteService.deleteById(ctx.params.id, );
	ctx.status = 204;
});

router.post('/api/notes', async (ctx) => {
	const newNote = await noteService.create({
		...ctx.request.body,
		date: new Date(ctx.request.body.date)
	});
	ctx.body = newNote;
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(port);
logger.info(`Server listening on http://${host}:${port}`);