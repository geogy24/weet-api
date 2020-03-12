module.exports = {
  '/users/session': {
    post: {
      tags: ['Session'],
      description: 'Log in an user',
      operationId: 'sessionUser',
      parameters: [],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Session'
            }
          }
        },
        required: true
      },
      responses: {
        200: {
          description: 'Logged in'
        },
        400: {
          description: 'User not found'
        },
        422: {
          description: 'Password invalid'
        }
      }
    }
  },
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
          description: 'Multiple validation errors on database'
        },
        422: {
          description: 'Multiple validation errors'
        }
      }
    }
  }
};
