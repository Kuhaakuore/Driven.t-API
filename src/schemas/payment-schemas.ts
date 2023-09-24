import { TicketPaymentData } from '@/protocols';
import Joi from 'joi';

export const ticketPaymentSchema = Joi.object<TicketPaymentData>({
  ticketId: Joi.number().required(),
  cardData: Joi.object({
    issuer: Joi.string().trim().required(),
    number: Joi.number().required(),
    name: Joi.string().trim().required(),
    expirationDate: Joi.date().required(),
    cvv: Joi.number().required(),
  }).required(),
});
