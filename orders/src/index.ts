import { currentUser, errorHandler, NotFoundError } from '@sprockets/common';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import express from 'express';
import 'express-async-errors';
import mongoose from 'mongoose';
import { TicketCreatedSubscriber } from './events/subscribers/ticket-created-subscriber';
import { TicketUpdatedSubscriber } from './events/subscribers/ticket-updated-subscriber';
import { natsWrapper } from './nats-wrapper';
import { indexOrderRouter } from './routes';
import { deleteOrderRouter } from './routes/delete';
import { newOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';

const app = express();
app.set('trust proxy', true);

app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);
app.use(currentUser);

app.use(indexOrderRouter);
app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(deleteOrderRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY ENV Var not defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI ENV Var not defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL ENV Var not defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID ENV Var not defined');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID ENV Var not defined');
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed');
      process.exit(0);
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new TicketCreatedSubscriber(natsWrapper.client).subscribe();
    new TicketUpdatedSubscriber(natsWrapper.client).subscribe();

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('connected to mongo database : tickets');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('listening on port: 3000');
  });
};

start();
