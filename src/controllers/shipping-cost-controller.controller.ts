// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/core';
import {repository, Where} from '@loopback/repository';
import {post, get, getModelSchemaRef, response, requestBody, param} from '@loopback/rest';
import * as Sentry from '@sentry/node';
import {PaymentData, PostalCode, Zone} from '../models';
import {
  CouponRepository,
  PostalCodeRepository,
  ZoneRepository,
} from '../repositories';

export class ShippingCostController {
  constructor(
    @repository(PostalCodeRepository)
    public postalCodeRepository: PostalCodeRepository,
    @repository(ZoneRepository)
    public zoneRepository: ZoneRepository,
    @repository(CouponRepository)
    public couponRepository: CouponRepository,
  ) { }
  @post('/shipping-cost')
  @response(200, {
    description: 'Get shipping cost',
    content: {'application/json': {schema: getModelSchemaRef(PaymentData)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PaymentData, {
            title: 'ShippingCost',
          }),
        },
      },
    })
    data: PaymentData,
  ): Promise<object> {
    /* const stateFound = await this.postalCodeRepository.findOne({
      where: {code: data.postalCode},
    }); */
    let zoneFound: Zone | undefined = undefined
    let shippingCost = 0;
    try {
      zoneFound = await this.zoneRepository.findById(data.idZone);
      const kilos = Math.trunc(data.weight);
      if (kilos <= 8) {
        shippingCost = (zoneFound?.priceKilos as Record<string, number>)[
          Math.trunc(kilos).toString()
        ];
      } else {
        const extraKilos = kilos - 8;
        shippingCost =
          (zoneFound?.priceKilos as Record<string, number>)['8'] +
          (extraKilos *
            (zoneFound?.priceKilos as Record<string, number>)['extra']);
      }
    } catch (error) {
      Sentry.captureException(error)
    }
    shippingCost = (shippingCost * data.discount) / 100
    return {
      shippingCost,
      shippingTime: zoneFound?.shippingTime
    }
  }
  @get('/getZone')
  @response(200, {
    description: 'get zone by postal code',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Zone, {includeRelations: true}),
      },
    },
  })
  async getZone(
    @param.where(PostalCode) where?: Where<Zone>,
  ): Promise<Zone | {}> {
    let res = {}
    try {
      const stateFound = await this.postalCodeRepository.find({
        where: where,
      });
      const zoneFound = await this.zoneRepository.find({
        where: {states: stateFound[0]?.state},
      });
      if (zoneFound[0]) {
        res = {
          name: zoneFound[0].name,
          id: zoneFound[0].id,
          state: stateFound[0].state
        }
      }
    } catch (error) {
      Sentry.captureException(error)
    }
    return res
  }
}
