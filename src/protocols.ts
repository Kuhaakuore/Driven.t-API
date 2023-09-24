import { Ticket } from '@prisma/client';

export type ApplicationError = {
  name: string;
  message: string;
};

export type RequestError = {
  status: number;
  data: object | null;
  statusText: string;
  name: string;
  message: string;
};

export type ViaCEPAddressError = {
  error: boolean;
};

export type AddressEnrollment = {
  logradouro: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
};

export type TicketTypeId = {
  ticketTypeId: number;
};

export type TicketId = {
  ticketId: number;
};

export type CreateTicketData = Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>;

export type CEP = {
  cep: string;
};
