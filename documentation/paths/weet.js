module.exports = {
  '/weets': {
    post: {
      tags: ['Weets'],
      description: 'Create weet',
      operationId: 'createWeet',
      parameters: [
        {
          name: 'authorization',
          in: 'header',
          required: true,
          description: 'authorization token',
          schema: {
            type: 'string'
          }
        }
      ],
      requestBody: {},
      responses: {
        201: {
          description: 'New weet was created'
        },
        400: {
          description: 'Weet third party error'
        }
      }
    },
    get: {
      tags: ['Weets'],
      description: 'List weets',
      operationId: 'listWeets',
      parameters: [
        {
          name: 'authorization',
          in: 'header',
          required: true,
          description: 'authorization token',
          schema: {
            type: 'string'
          }
        },
        {
          name: 'page',
          in: 'query',
          required: false,
          description: 'page',
          schema: {
            type: 'integer'
          }
        },
        {
          name: 'limit',
          in: 'query',
          required: false,
          description: 'limit',
          schema: {
            type: 'integer'
          }
        }
      ],
      responses: {
        200: {
          description: 'List of weets'
        }
      }
    }
  },
  '/weets/:id/rating': {
    post: {
      tags: ['Weets'],
      description: 'Weet rating',
      operationId: 'weetRating',
      parameters: [
        {
          name: 'authorization',
          in: 'header',
          required: true,
          description: 'authorization token',
          schema: {
            type: 'string'
          }
        },
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'weet identification',
          schema: {
            type: 'string'
          }
        }
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Rating'
            }
          }
        },
        required: true
      },
      responses: {
        201: {
          description: 'New weet was created'
        },
        400: {
          description: 'Weet third party error'
        }
      }
    }
  }
};
