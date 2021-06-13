import { Publisher, Subjects, TicketCreatedEvent } from '@sprockets/common';

class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}

export default TicketCreatedPublisher;
