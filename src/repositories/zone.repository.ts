import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Zone, ZoneRelations} from '../models';

export class ZoneRepository extends DefaultCrudRepository<
  Zone,
  typeof Zone.prototype.id,
  ZoneRelations
> {
  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
  ) {
    super(Zone, dataSource);
  }
}
