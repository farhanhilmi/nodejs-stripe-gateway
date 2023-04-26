import { responseData } from '../utils/responses.js';
import config from '../config/index.js';

// import userServices from '../services/index.js';
export class UsersController {
    constructor() {
        // SubscribeMessage(subscribeEvents, 'Loan');
    }

    async getUser(req, res, next) {
        try {
            // const { userId, roles } = JSON.parse(req.header('user'));
            // const data = await this.authService.getUserData({ userId, roles });
            const data = await requestLoan({ userId, roles }, payload);
            // Publish to message broker (Loans service)

            res.status(200).json(responseData({}));
        } catch (error) {
            next(error);
        }
    }
}
