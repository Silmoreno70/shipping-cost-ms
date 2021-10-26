import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Coupon} from '../models';
import {CouponRepository} from '../repositories';

export class CouponControllerController {
  constructor(
    @repository(CouponRepository)
    public couponRepository: CouponRepository,
  ) { }

  @post('/coupons')
  @response(200, {
    description: 'Coupon model instance',
    content: {'application/json': {schema: getModelSchemaRef(Coupon)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Coupon, {
            title: 'NewCoupon',
            exclude: ['id'],
          }),
        },
      },
    })
    coupon: Omit<Coupon, 'id'>,
  ): Promise<Coupon> {
    return this.couponRepository.create(coupon);
  }

  @get('/coupons/count')
  @response(200, {
    description: 'Coupon model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Coupon) where?: Where<Coupon>,
  ): Promise<Count> {
    return this.couponRepository.count(where);
  }

  @get('/coupons')
  @response(200, {
    description: 'Array of Coupon model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Coupon, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Coupon) filter?: Filter<Coupon>,
  ): Promise<Coupon[]> {
    return this.couponRepository.find(filter);
  }

  @patch('/coupons')
  @response(200, {
    description: 'Coupon PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Coupon, {partial: true}),
        },
      },
    })
    coupon: Coupon,
    @param.where(Coupon) where?: Where<Coupon>,
  ): Promise<Count> {
    return this.couponRepository.updateAll(coupon, where);
  }

  @get('/coupons/{id}')
  @response(200, {
    description: 'Coupon model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Coupon, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Coupon, {exclude: 'where'}) filter?: FilterExcludingWhere<Coupon>
  ): Promise<Coupon> {
    return this.couponRepository.findById(id, filter);
  }

  @patch('/coupons/{id}')
  @response(204, {
    description: 'Coupon PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Coupon, {partial: true}),
        },
      },
    })
    coupon: Coupon,
  ): Promise<void> {
    await this.couponRepository.updateById(id, coupon);
  }

  @put('/coupons/{id}')
  @response(204, {
    description: 'Coupon PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() coupon: Coupon,
  ): Promise<void> {
    await this.couponRepository.replaceById(id, coupon);
  }

  @del('/coupons/{id}')
  @response(204, {
    description: 'Coupon DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.couponRepository.deleteById(id);
  }
}
