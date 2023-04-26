import { Router } from 'express';
import Controller from '../api/index.controller.js';

const Routes = () => {
    const router = Router();
    const controller = new Controller();
    router.get('/', controller.index.bind(controller));
    router.post('/checkout', controller.checkout.bind(controller));
    router.get('/success', controller.successCharge.bind(controller));
    router.get('/cancel', controller.cancelCharge.bind(controller));

    return router;
};

export default Routes;
