import {Model, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class PaymentData extends Model {

  @property({
    type: 'string',
    required: true,
  })
  idZone: string;

  @property({
    type: 'number',
    required: true,
  })
  weight: number;

  @property({
    type: 'number',
    required: true,
  })
  discount: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<PaymentData>) {
    super(data);
  }
}

export interface PaymentDataRelations {
  // describe navigational properties here
}

export type PaymentDataWithRelations = PaymentData & PaymentDataRelations;
