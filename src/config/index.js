import dotenv from 'dotenv';

// dotenv.config({
//     path: path.resolve(__dirname, process.env.NODE_ENV + '.env')
//   });

dotenv.config();

const {
    APP_NAME,
    MONGODB_URI,
    PORT,
    STRIPE_SECRET_KEY,
    SECRET_COOKIE,
    STRIPE_ENDPOINT_SECRET,
} = process.env;

const config = {
    app: {
        port: PORT,
        // host: HOST,
        name: APP_NAME,
        secret: SECRET_COOKIE,
    },
    db: {
        uri: MONGODB_URI,
    },
    stripe: {
        secretKey: STRIPE_SECRET_KEY,
        endpointSecret: STRIPE_ENDPOINT_SECRET,
    },
};

export default config;
