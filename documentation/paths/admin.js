module.exports = {
  '/admin/users': {
    post: {
      tags: ['CRUD operations'],
      description: 'Create administrator',
      operationId: 'createAdministrator',
      parameters: [],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Admin'
            }
          }
        },
        required: true
      },
      responses: {
        201: {
          description: 'New administrator was created'
        },
        204: {
          description: 'Existent user now is administrator'
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
