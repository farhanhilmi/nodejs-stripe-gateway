import { Router } from 'express';
import { UsersController } from '../api/users.js';

const Routes = () => {
    const router = Router();
    const controller = new UsersController();
    router.get('/', controller.getUser.bind(controller));

    return router;
};

export default Routes;
