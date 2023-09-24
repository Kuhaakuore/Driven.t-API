import { Ticket } from '@prisma/client';
import Joi from 'joi';

export const createTicketSchema = Joi.object<Ticket>({
  ticketTypeId: Joi.number().required(),
});
