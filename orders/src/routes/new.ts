import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from '@sprockets/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { Order } from '../models/order';
import { Ticket } from '../models/ticket';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const ORDER_EXPIRATION_SECONDS = 15 * 60;

router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Ticket Id must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // Find the ticket the user is trying to order in the database.
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    // const isReserved = await ticket.isReserved();
    // if (isReserved) {
    //   throw new BadRequestError('Ticket is already reserved');
    // }

    // Ensure that the ticket is not already reserved
    // Run a query for all orders and try to find a order that has an associated ticket
    // which is same as the ticket we are looking for *and* check that the order is not cancelled.
    // If we find a order, that means that the ticket has been reserved
    const existingOrder = await Order.findOne({
      ticket: this,
      status: {
        $in: [
          OrderStatus.Created,
          OrderStatus.Complete,
          OrderStatus.AwaitingPayment,
        ],
      },
    });
    if (existingOrder) {
      throw new BadRequestError('Ticket is already reserved');
    }

    // Set an expiration time for the order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + ORDER_EXPIRATION_SECONDS);

    // build and save the order

    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });
    await order.save();

    // publish an event that the order has been created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: ticket.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price.toString(),
      },
    });

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
