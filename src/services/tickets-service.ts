import { ticketsRepository } from "@/repositories";
import { TicketType } from "@prisma/client";

// async function getAddressFromCEP(cep: string): Promise<AddressEnrollment> {
//   const result = await request.get(`${process.env.VIA_CEP_API}/${cep}/json/`);

//   if (!result.data || result.data.erro) {
//     throw invalidCepError();
//   }

//   const { bairro, localidade, uf, complemento, logradouro } = result.data;
//   const address: AddressEnrollment = {
//     bairro,
//     cidade: localidade,
//     uf,
//     complemento,
//     logradouro,
//   };

//   return address;
// }

async function getTicketsTypes(): Promise<Array<TicketType>> {
  const result = await ticketsRepository.getTicketsTypes();
  return result;
}

export const ticketsService = {
  getTicketsTypes,
};
