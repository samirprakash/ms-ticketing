import Publisher from './base-publisher';
import Subjects from './subjects';
import TicketCreatedEvent from './ticket-created-event';

class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}

export default TicketCreatedPublisher;
