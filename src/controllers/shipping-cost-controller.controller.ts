// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {post, get, getModelSchemaRef, response, requestBody, param} from '@loopback/rest';
import * as Sentry from '@sentry/node';
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
    /* const stateFound = await this.postalCodeRepository.findOne({
      where: {code: data.postalCode},
    }); */
    let zoneFound: Zone | undefined = undefined
    let shippingCost = 0;
    try {
      zoneFound = await this.zoneRepository.findById(data.idZone);
      if (zoneFound) {
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
      } else {
        return {
          error: 'No se encontró la zona'
        }
      }
    } catch (error) {
      Sentry.captureException(error)
    }
    if (zoneFound) {
      shippingCost = (shippingCost) - (shippingCost * (data.discount / 100))
      return {
        shippingCost: shippingCost.toFixed(2),
        shippingTime: zoneFound?.shippingTime
      }
    }
    return {
      error: 'No se encontró la zona'
    }
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
    @param.path.number('postalCode') postalCode: number
  ): Promise<Zone | {}> {
    const stateFound = await this.postalCodeRepository.findOne({
      where: {
        code: postalCode
      }
    }
    )
    const zoneFound = await this.zoneRepository.findOne({
      where: {states: stateFound?.state},
    });
    if (zoneFound && postalCode) {
      return {
        name: zoneFound.name,
        id: zoneFound.id,
        shippingTime: zoneFound.shippingTime
      }
    }
    return {
      error: 'No se encontró la zona'
    }
  }
}
