import { randomBytes } from 'crypto';
import nats from 'node-nats-streaming';
import TickerCreatedSubscriber from './events/ticket-created-subscriber';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('subscriber connected to NATS');

  stan.on('close', () => {
    console.log('NATS connection closed');
    process.exit(0);
  });

  new TickerCreatedSubscriber(stan).subscribe();
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
