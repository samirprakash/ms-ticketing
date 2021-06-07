import { errorHandler, NotFoundError } from '@sprockets/common';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import express from 'express';
import 'express-async-errors';
import mongoose from 'mongoose';

const app = express();
app.set('trust proxy', true);

app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);

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

  try {
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