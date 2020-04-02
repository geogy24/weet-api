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
    }
  }
};
