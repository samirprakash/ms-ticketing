import { Message } from 'node-nats-streaming';
import Subscriber from './base-subscriber';
import Subjects from './subjects';
import TicketCreatedEvent from './ticket-created-event';

class TickerCreatedSubscriber extends Subscriber<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = 'payment-service';

  onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
    console.log('event data : ', data);
    msg.ack();
  }
}

export default TickerCreatedSubscriber;
