import * as bodyParser from 'body-parser';
import express from 'express';
import helmet from 'helmet';
import * as httpContext from 'express-http-context';
import morgan from 'morgan';
import * as mung from 'express-mung';
import * as uuid from 'uuid';
import { indexRoute } from './routes/index-route';
import { MimeUtils, MimeType } from './utils/mime-utils';
import commonConfig from './config/common-config';

const app = express();
initPreMiddlewares();
routes();
initPostMiddlewares();

function initPreMiddlewares() {
    initMorganMiddleware();
    app.use(httpContext.middleware);
    app.use((req, res, next) => {
        httpContext.set(commonConfig.request.httpContext, uuid.v1());
        next();
    });
    app.use(bodyParser.json({ limit: commonConfig.bodyParserLimit }));
    app.use(bodyParser.urlencoded({ limit: commonConfig.bodyParserLimit, extended: true }));
    app.use(helmet);
}

function routes() {
    app.use(indexRoute.router);
}

/**
 * Fonction qui initialise le Middleware Morgan.
 */
function initMorganMiddleware() {
    morgan.token('reqHeaders', (req: express.Request) => JSON.stringify(req.headers));

    morgan.token('reqBody', (req: express.Request) => JSON.stringify(req.body));

    morgan.token('resBody', () => undefined);

    app.use(
        mung.jsonAsync(
            async (json) =>
                Promise.resolve(json).then((json) => {
                    morgan.token('resBody', () => JSON.stringify(json));

                    return json;
                }),
            { mungError: true }
        )
    );

    // Log 2xx and 3xx to console without payloads.
    app.use(
        morgan(
            '"date": "[:date[iso]]", "method": ":method", "endpoint": ":url", "status": ":status", "res_time": ":response-time ms", "res_length": ":res[content-length] bytes"',
            {
                skip(req: any, res: any) {
                    return res.statusCode >= 400;
                },
            }
        )
    );

    // Log 4xx and 5xx responses to console with both payloads when response Content-Type contains 'application/json'.
    app.use(
        morgan(
            '"date": "[:date[iso]]", "method": ":method", "endpoint": ":url", "status": ":status", "res_time": ":response-time ms", "res_length": ":res[content-length] bytes",' +
                '"req_body": ":reqBody", "res_body": ":resBody"',
            {
                skip(req: any, res: any) {
                    return res.statusCode < 400 || MimeUtils.checkResponseContentType(res, MimeType.JSON) === false;
                },
            }
        )
    );

    // Log 4xx and 5xx responses to console with only request payload when response Content-Type does not contain 'application/json'.
    app.use(
        morgan(
            '"date": "[:date[iso]]", "method": ":method", "endpoint": ":url", "status": ":status", "res_time": ":response-time ms", "res_length": ":res[content-length] bytes", "req_body": ":reqBody"',
            {
                skip(req: any, res: any) {
                    return res.statusCode < 400 || MimeUtils.checkResponseContentType(res, MimeType.JSON) === true;
                },
            }
        )
    );
}

function initPostMiddlewares() {}

export default app;
