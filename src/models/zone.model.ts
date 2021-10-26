import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Zone extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'array',
    itemType: 'string',
    required: true,
  })
  states: string[];

  @property({
    type: 'object',
    required: true,
  })
  priceKilos: object;

  @property({
    type: 'array',
    itemType: 'number',
    required: true,
  })
  shippingTime: number[];

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Zone>) {
    super(data);
  }
}

export interface ZoneRelations {
  // describe navigational properties here
}

export type ZoneWithRelations = Zone & ZoneRelations;
