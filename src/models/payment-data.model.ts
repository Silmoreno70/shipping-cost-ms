import {Model, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class PaymentData extends Model {
  @property({
    type: 'number',
    required: true,
  })
  cost: number;

  @property({
    type: 'number',
    required: true,
  })
  postalCode: number;

  @property({
    type: 'string',
  })
  coupon?: string;

  @property({
    type: 'number',
    required: true,
  })
  weight: number;

  @property({
    type: 'string',
    required: true,
  })
  paymentMethod: string;

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
