import { ApplicationError } from '@/protocols';

export function cannotBookRoom(message: string): ApplicationError {
  return {
    name: 'CannotBookRoom',
    message,
  };
}
