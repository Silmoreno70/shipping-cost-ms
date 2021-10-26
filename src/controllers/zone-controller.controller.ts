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
import {Zone} from '../models';
import {ZoneRepository} from '../repositories';

export class ZoneControllerController {
  constructor(
    @repository(ZoneRepository)
    public zoneRepository : ZoneRepository,
  ) {}

  @post('/zones')
  @response(200, {
    description: 'Zone model instance',
    content: {'application/json': {schema: getModelSchemaRef(Zone)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Zone, {
            title: 'NewZone',
            exclude: ['id'],
          }),
        },
      },
    })
    zone: Omit<Zone, 'id'>,
  ): Promise<Zone> {
    return this.zoneRepository.create(zone);
  }

  @get('/zones/count')
  @response(200, {
    description: 'Zone model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Zone) where?: Where<Zone>,
  ): Promise<Count> {
    return this.zoneRepository.count(where);
  }

  @get('/zones')
  @response(200, {
    description: 'Array of Zone model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Zone, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Zone) filter?: Filter<Zone>,
  ): Promise<Zone[]> {
    return this.zoneRepository.find(filter);
  }

  @patch('/zones')
  @response(200, {
    description: 'Zone PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Zone, {partial: true}),
        },
      },
    })
    zone: Zone,
    @param.where(Zone) where?: Where<Zone>,
  ): Promise<Count> {
    return this.zoneRepository.updateAll(zone, where);
  }

  @get('/zones/{id}')
  @response(200, {
    description: 'Zone model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Zone, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Zone, {exclude: 'where'}) filter?: FilterExcludingWhere<Zone>
  ): Promise<Zone> {
    return this.zoneRepository.findById(id, filter);
  }

  @patch('/zones/{id}')
  @response(204, {
    description: 'Zone PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Zone, {partial: true}),
        },
      },
    })
    zone: Zone,
  ): Promise<void> {
    await this.zoneRepository.updateById(id, zone);
  }

  @put('/zones/{id}')
  @response(204, {
    description: 'Zone PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() zone: Zone,
  ): Promise<void> {
    await this.zoneRepository.replaceById(id, zone);
  }

  @del('/zones/{id}')
  @response(204, {
    description: 'Zone DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.zoneRepository.deleteById(id);
  }
}
