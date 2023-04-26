import { responseData } from '../utils/responses.js';
import config from '../config/index.js';
import createCheckout from '../services/createCheckout.js';

// import userServices from '../services/index.js';
export default class UsersController {
    constructor() {
        // SubscribeMessage(subscribeEvents, 'Loan');
    }

    async index(req, res, next) {
        try {
            res.render('index');
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async checkout(req, res, next) {
        try {
            const session = await createCheckout(req.body);
            res.redirect(303, session.url);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async cancelCharge(req, res, next) {
        try {
            res.render('cancel');
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async successCharge(req, res, next) {
        try {
            res.render('success');
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}
