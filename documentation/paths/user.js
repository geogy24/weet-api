module.exports = {
  '/users': {
    post: {
      tags: ['CRUD operations'],
      description: 'Create user',
      operationId: 'createUser',
      parameters: [],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/User'
            }
          }
        },
        required: true
      },
      responses: {
        201: {
          description: 'New user was created'
        },
        400: {
          description: 'Multiple validation errors'
        },
        422: {
          description: 'Multiple validation errors'
        },
        500: {
          description: "Multiple client's parameter errors"
        }
      }
    }
  }
};
