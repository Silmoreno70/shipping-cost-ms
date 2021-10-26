import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {PostalCode, PostalCodeRelations} from '../models';

export class PostalCodeRepository extends DefaultCrudRepository<
  PostalCode,
  typeof PostalCode.prototype.id,
  PostalCodeRelations
> {
  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
  ) {
    super(PostalCode, dataSource);
  }
}
