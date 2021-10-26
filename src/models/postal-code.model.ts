import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class PostalCode extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'number',
    required: true,
  })
  code: number;

  @property({
    type: 'string',
  })
  state?: string;

  @property({
    type: 'string',
  })
  city?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<PostalCode>) {
    super(data);
  }
}

export interface PostalCodeRelations {
  // describe navigational properties here
}

export type PostalCodeWithRelations = PostalCode & PostalCodeRelations;
