import { Publisher, Subjects, TicketUpdatedEvent } from '@sprockets/common';

class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}

export default TicketUpdatedPublisher;
