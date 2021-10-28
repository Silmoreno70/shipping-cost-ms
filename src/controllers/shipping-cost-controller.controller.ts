// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {post, get, getModelSchemaRef, response, requestBody, param} from '@loopback/rest';
import {PaymentData, Zone} from '../models';
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
    const stateFound = await this.postalCodeRepository.findOne({
      where: {code: data.postalCode},
    });
    const zoneFound = await this.zoneRepository.findOne({
      where: {states: stateFound?.state},
    });
    const couponFound = await this.couponRepository.findOne({
      where: {code: data.coupon},
    });
    let shippingCost = 0;
    const kilos = Math.trunc(data.weight);
    if (data.cost > 10000) {
      shippingCost = 0;
    } else {
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
    }
    if (
      zoneFound?.name === 'Zona 4' &&
      data.cost > 3000 &&
      data.paymentMethod === 'visa'
    ) {
      return {
        shippingCost: 0,
        cost: data.cost,
        total: data.cost,
        estimatedTime: zoneFound?.shippingTime
      };
    }
    if (
      zoneFound?.name === 'Zona 3' &&
      data.cost > 4000 &&
      data.paymentMethod === 'visa'
    ) {
      const cost = data.cost * 0.85;
      return {
        shippingCost,
        cost: cost,
        total: cost,
        estimatedTime: zoneFound?.shippingTime
      };
    }
    if (
      (zoneFound?.name === 'Zona 1' || zoneFound?.name === 'Zone 2') &&
      data.paymentMethod === 'mastercard' &&
      couponFound &&
      couponFound?.name === 'MASTER20'
    ) {
      const cost = data.cost * 0.9;
      return {
        shippingCost,
        cost: cost,
        total: cost + shippingCost,
        estimatedTime: zoneFound?.shippingTime
      };
    }
    if (
      (zoneFound?.name === 'Zona 1' ||
        zoneFound?.name === 'Zona 2' ||
        zoneFound?.name === 'Zona 3') &&
      (data.paymentMethod === 'visa' || data.paymentMethod === 'mastercard') &&
      couponFound &&
      couponFound?.name === 'PERRITOFELI'
    ) {
      const shippingDiscount = shippingCost * 0.85;
      return {
        shippingCost: shippingDiscount,
        cost: data.cost,
        total: data.cost + shippingDiscount,
        estimatedTime: zoneFound?.shippingTime
      };
    }
    if (zoneFound?.name === 'Zona 5' && data.paymentMethod === 'mastercard') {
      return {
        shippingCost,
        cost: data.cost,
        total: data.cost + shippingCost,
        estimatedTime: zoneFound?.shippingTime
      };
    }
    if (
      (zoneFound?.name === 'Zona 4' || zoneFound?.name === 'Zona 5') &&
      couponFound &&
      couponFound?.name === 'NOJADO'
    ) {
      const cost = data.cost * 0.85;
      return {
        shippingCost,
        cost: cost,
        total: cost + shippingCost,
        estimatedTime: zoneFound?.shippingTime
      };
    }
    return {
      shippingCost,
      cost: data.cost,
      total: data.cost + shippingCost,
      estimatedTime: zoneFound?.shippingTime
    };
  }
  @get('/getZone/{postalCode}')
  @response(200, {
    description: 'get zone by postal code',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Zone, {includeRelations: true}),
      },
    },
  })
  async getZone(
    @param.path.string('postalCode') postalCode: string
  ): Promise<Zone | {}> {
    const stateFound = await this.postalCodeRepository.findOne({
      where: {code: postalCode},
    });
    const zoneFound = await this.zoneRepository.findOne({
      where: {states: stateFound?.state},
    });
    if (zoneFound) {
      return zoneFound
    }
    return {}
  }
}
