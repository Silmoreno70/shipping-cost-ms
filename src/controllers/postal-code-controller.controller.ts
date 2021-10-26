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
import {PostalCode} from '../models';
import {PostalCodeRepository} from '../repositories';

export class PostalCodeControllerController {
  constructor(
    @repository(PostalCodeRepository)
    public postalCodeRepository : PostalCodeRepository,
  ) {}

  @post('/postal-codes')
  @response(200, {
    description: 'PostalCode model instance',
    content: {'application/json': {schema: getModelSchemaRef(PostalCode)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PostalCode, {
            title: 'NewPostalCode',
            exclude: ['id'],
          }),
        },
      },
    })
    postalCode: Omit<PostalCode, 'id'>,
  ): Promise<PostalCode> {
    return this.postalCodeRepository.create(postalCode);
  }

  @get('/postal-codes/count')
  @response(200, {
    description: 'PostalCode model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(PostalCode) where?: Where<PostalCode>,
  ): Promise<Count> {
    return this.postalCodeRepository.count(where);
  }

  @get('/postal-codes')
  @response(200, {
    description: 'Array of PostalCode model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(PostalCode, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(PostalCode) filter?: Filter<PostalCode>,
  ): Promise<PostalCode[]> {
    return this.postalCodeRepository.find(filter);
  }

  @patch('/postal-codes')
  @response(200, {
    description: 'PostalCode PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PostalCode, {partial: true}),
        },
      },
    })
    postalCode: PostalCode,
    @param.where(PostalCode) where?: Where<PostalCode>,
  ): Promise<Count> {
    return this.postalCodeRepository.updateAll(postalCode, where);
  }

  @get('/postal-codes/{id}')
  @response(200, {
    description: 'PostalCode model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(PostalCode, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(PostalCode, {exclude: 'where'}) filter?: FilterExcludingWhere<PostalCode>
  ): Promise<PostalCode> {
    return this.postalCodeRepository.findById(id, filter);
  }

  @patch('/postal-codes/{id}')
  @response(204, {
    description: 'PostalCode PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PostalCode, {partial: true}),
        },
      },
    })
    postalCode: PostalCode,
  ): Promise<void> {
    await this.postalCodeRepository.updateById(id, postalCode);
  }

  @put('/postal-codes/{id}')
  @response(204, {
    description: 'PostalCode PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() postalCode: PostalCode,
  ): Promise<void> {
    await this.postalCodeRepository.replaceById(id, postalCode);
  }

  @del('/postal-codes/{id}')
  @response(204, {
    description: 'PostalCode DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.postalCodeRepository.deleteById(id);
  }
}
