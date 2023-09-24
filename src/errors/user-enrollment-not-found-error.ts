import { ApplicationError } from '@/protocols';

export function userEnrollmentNotFoundError(): ApplicationError {
  return {
    name: 'UserEnrollmentNotFoundError',
    message: 'User doesnt have an enrollment yet',
  };
}
