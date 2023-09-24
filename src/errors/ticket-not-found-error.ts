import { ApplicationError } from '@/protocols';

export function ticketNotFoundError(): ApplicationError {
  return {
    name: 'TicketNotFoundError',
    message: "User doesn't have any tickets yet.",
  };
}
