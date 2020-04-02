module.exports = {
  '/users/session': {
    post: {
      tags: ['Sessions'],
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
      tags: ['Users'],
      description: 'Create an user',
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
    },
    get: {
      tags: ['Users'],
      description: 'List users',
      operationId: 'listUsers',
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
          description: 'List of users'
        }
      }
    }
  }
};
