export enum OrderStatus {
  // When the order has been created, but the ticket has not been reserved
  Created = 'created',

  // If the ticket has already been reserved or the user cancels the request or the order expires before payment
  Cancelled = 'cancelled',

  // The order has successfully reserved the ticket but is awaiting payment
  AwaitingPayment = 'awaiting:payment',

  // Ticket has been reserver and the payment has been done successfully
  Complete = 'complete',
}
