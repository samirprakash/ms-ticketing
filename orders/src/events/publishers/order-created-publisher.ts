import { OrderCreatedEvent, Publisher, Subjects } from '@sprockets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
