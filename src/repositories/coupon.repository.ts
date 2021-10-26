import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Coupon, CouponRelations} from '../models';

export class CouponRepository extends DefaultCrudRepository<
  Coupon,
  typeof Coupon.prototype.id,
  CouponRelations
> {
  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
  ) {
    super(Coupon, dataSource);
  }
}
