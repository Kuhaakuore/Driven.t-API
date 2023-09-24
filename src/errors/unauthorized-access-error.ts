import { ApplicationError } from '@/protocols';

export function unauthorizedAccessError(): ApplicationError {
  return {
    name: 'UnauthorizedAccessError',
    message: 'You are not authorized to access this ticket',
  };
}
