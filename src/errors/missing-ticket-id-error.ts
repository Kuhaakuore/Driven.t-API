import { ApplicationError } from '@/protocols';

export function missingTicketIdError(): ApplicationError {
  return {
    name: 'MissingTicketIdError',
    message: `The ticket id is missing`,
  };
}
