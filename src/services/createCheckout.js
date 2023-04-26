import stripe from '../config/stripe.js';

const getLineItems = (payload) => {
    try {
        return {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: payload.name,
                },
                unit_amount: payload.price * 100,
            },
            quantity: payload.quantity,
        };
        // const lineItems = payload.map((item) => {
        //     return {
        //         price_data: {
        //             currency: 'usd',
        //             product_data: {
        //                 name: item.name,
        //             },
        //             unit_amount: item.price * 100,
        //         },
        //         quantity: item.quantity,
        //     };
        // });
        // return lineItems;
    } catch (error) {
        throw error;
    }
};

export default async (payload) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [getLineItems(payload)],
            mode: 'payment',
            success_url: 'http://localhost:8000/success',
            cancel_url: 'http://localhost:8000/cancel',
            consent_collection: {
                terms_of_service: 'required',
            },
        });
        console.log('session', session);
        return session;
    } catch (error) {
        throw error;
    }
};
