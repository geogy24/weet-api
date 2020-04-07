module.exports = {
  id: {
    type: 'integer',
    example: 7
  },
  name: {
    type: 'string',
    example: 'Richard'
  },
  surname: {
    type: 'string',
    example: 'Reeds'
  },
  email: {
    type: 'string',
    example: 'tom.engels@wolox.com.ar'
  },
  password: {
    type: 'string',
    example: 'asdf2134'
  },
  administrator: {
    type: 'boolean',
    example: 'true'
  },
  Administrator: {
    type: 'object',
    properties: {
      id: {
        $ref: '#/components/schemas/id'
      },
      name: {
        $ref: '#/components/schemas/name'
      },
      surname: {
        $ref: '#/components/schemas/name'
      },
      email: {
        $ref: '#/components/schemas/email'
      },
      password: {
        $ref: '#/components/schemas/password'
      },
      administrator: {
        $ref: '#/components/schemas/administrator'
      }
    }
  },
  Session: {
    type: 'object',
    properties: {
      email: {
        $ref: '#/components/schemas/email'
      },
      password: {
        $ref: '#/components/schemas/password'
      }
    }
  },
  Administrators: {
    type: 'object',
    properties: {
      users: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Administrator'
        }
      }
    }
  }
};
