import { ApplicationError } from '@/protocols';

export function invalidTicketIdError(): ApplicationError {
  return {
    name: 'InvalidTicketIdError',
    message: 'Invalid ticket id value!',
  };
}
