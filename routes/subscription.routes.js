import {Router} from 'express';
import authorize from '../middleware/auth.middleware.js';
import { createSubscription, getUserSubscriptions } from '../controllers/subscription.controller.js';

const subscriptionRouter = Router();

subscriptionRouter.get('/', (req, res)=>{
    res.send({title: "GETS all subscriptions"})
});

subscriptionRouter.get('/:id', (req, res)=>{
    res.send({title: "GETS a single subscription"})
});

subscriptionRouter.post('/', authorize, createSubscription);

subscriptionRouter.put('/:id', authorize, (req, res)=>{
    res.send({title: "UPDATES a single subscription"})
});

subscriptionRouter.delete('/:id', authorize, (req, res)=>{
    res.send({title: "DELETES a single subscription"})
});

subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);

subscriptionRouter.put('/:id/cancel', authorize, (req, res)=>{
    res.send({title: "CANCEL a single subscription"})
});

subscriptionRouter.get('/upcoming-renewals', (req, res)=>{
    res.send({title: "GETS all upcoming renewals"})
});

export default subscriptionRouter;
