import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import session from 'express-session';

import flash from 'connect-flash';
import config from './config/index.js';
import Routes from './routes/index.js';
import stripe from './config/stripe.js';
// import Routes from './routes/index.js';

export default async () => {
    const app = express();
    app.use(cors({ origin: '*' }));
    // app.use(
    //     express.json({
    //         limit: '5mb',
    //         verify: (req, res, buf) => {
    //             var url = req.originalUrl;
    //             if (url.startsWith('/webhook')) {
    //                 req.rawBody = buf.toString();
    //             }
    //             // req.rawBody = buf.toString();
    //         },
    //     }),
    // );
    app.use(
        morgan(':method :url :status :res[content-length] - :response-time ms'),
    );
    morgan.token('param', function (req, res, param) {
        return req.params[param];
    });
    app.use(cors({ origin: ['http://localhost:8000'] }));

    // app.use((req, res, next) => {
    //     if (req.originalUrl === '/webhook') {
    //         next();
    //     } else {
    //         express.json()(req, res, next);
    //     }
    // });
    app.use(
        express.json({
            verify: (req, res, buf) => {
                req.rawBody = buf.toString();
            },
        }),
    );

    const endpointSecret = config.stripe.endpointSecret;
    app.post(
        '/webhook',
        // express.raw({ type: 'application/json' }),
        (request, response) => {
            const sig = request.headers['stripe-signature'];

            let event;

            // Verify webhook signature and extract the event.
            // See https://stripe.com/docs/webhooks/signatures for more information.
            try {
                console.log('sig', sig);
                event = stripe.webhooks.constructEvent(
                    request.rawBody,
                    sig,
                    endpointSecret,
                );
            } catch (err) {
                console.log('ERROR STRIPE WEBHOOK', err.message);
                return response
                    .status(400)
                    .send(`Webhook Error: ${err.message}`);
            }

            if (event.type === 'checkout.session.completed') {
                const session = event.data.object;
                const connectedAccountId = event.account;
                handleCompletedCheckoutSession(connectedAccountId, session);
            }

            response.json({ received: true });
        },
    );

    const handleCompletedCheckoutSession = (connectedAccountId, session) => {
        // Fulfill the purchase.
        console.log('Payment was successful.');
        console.log('Connected account ID: ' + connectedAccountId);
        // console.log(JSON.stringify(session));
        console.log(session);
    };

    // Set Cookie Parser, sessions, flash
    app.use(cookieParser(config.app.secret));
    app.use(
        session({
            secret: 'something',
            cookie: { maxAge: 60000 },
            resave: true,
            saveUninitialized: true,
        }),
    );
    app.use(flash());

    app.set('view engine', 'ejs');
    app.set('views', './src/views');

    // app.use(Routes());
    const __dirname = dirname(fileURLToPath(import.meta.url));

    app.use(express.urlencoded({ extended: false }));
    app.use(express.static(join(__dirname, 'public')));

    app.use(function (req, res, next) {
        res.locals.message = req.flash();
        next();
    });

    app.use(Routes());

    // // API ENDPOINT NOT FOUND
    // app.use((req, res, next) => {
    //     const error = new Error("API endpoint doesn't exist!");
    //     error.statusCode = 404;
    //     error.status = 'Not Found';
    //     next(error);
    // });

    // // error handler middleware
    // app.use((error, req, res, _) => {
    //     console.log('error', error);
    //     const message = !error.statusCode
    //         ? 'Internal Server Error'
    //         : error.message;
    //     res.status(error.statusCode || 500).json({
    //         status: !error.statusCode ? 'Internal Server Error' : error.status,
    //         data: [],
    //         message,
    //     });
    // });

    return app;
};
