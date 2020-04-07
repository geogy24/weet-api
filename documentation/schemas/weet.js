module.exports = {
  id: {
    type: 'integer',
    example: 7
  },
  content: {
    type: 'string',
    example: 'new weet'
  },
  Weet: {
    type: 'object',
    properties: {
      id: {
        $ref: '#/components/schemas/id'
      },
      content: {
        $ref: '#/components/schemas/content'
      },
      user: {
        $ref: '#/components/schemas/User'
      }
    }
  },
  Weets: {
    type: 'object',
    properties: {
      weets: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/weet'
        }
      }
    }
  }
};
