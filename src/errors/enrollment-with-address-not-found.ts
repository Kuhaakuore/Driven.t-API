import { ApplicationError } from '@/protocols';

export function enrollmentWithAddressNotFound(): ApplicationError {
  return {
    name: 'EnrollmentNotFound',
    message: 'Enrollment does not have an address',
  };
}
