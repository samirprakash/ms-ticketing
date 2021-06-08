import express from 'express';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('/api/tickets', (req, res) => {
  const tickets = Ticket.find({});
  res.status(200).send(tickets);
});

export { router as indexTicketRouter };
