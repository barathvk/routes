module.exports = {
  valid: {
    routes: [
      {
        path: '/',
        method: 'GET'
      },
      {
        path: '/',
        method: 'POST',
        schema: {},
        contentType: 'application/json'
      },
      {
        path: '/text',
        method: 'POST',
        schema: {},
        contentType: 'text/plain'
      },
      {
        path: '/data',
        method: 'POST',
        contentType: 'application/json',
        schema: {
          type: 'object',
          properties: {
            hello: {
              type: 'string',
              required: true
            }
          }
        }
      },
      {
        path: '/hello',
        method: 'GET'
      },
      {
        path: '/hello/:message',
        method: 'GET'
      },
      {
        path: '/hello/:type/:message',
        method: 'GET'
      },
      {
        path: '/:non/contiguous/:parameters',
        method: 'GET'
      }
    ]
  },
  empty: {},
  multipleHandlers: {
    routes: [
      {
        path: '/',
        method: 'GET'
      },
      {
        path: '/',
        method: 'GET'
      },
      {
        path: '/:hello',
        method: 'GET'
      },
      {
        path: '/:goodbye',
        method: 'GET'
      }
    ]
  },
  noSchema: {
    routes: [
      {
        path: '/noschema',
        method: 'POST',
        contentType: 'application/json'
      }
    ]
  },
  noRouteArg: {
    routes: [
      {
        path: '/',
        method: 'GET'
      }
    ]
  }
}
