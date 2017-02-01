const assert = require('assert')
const schemas = require('./resources/schemas')
const Router = require('../router')
describe('With Router', () => {
  describe('Router validation', () => {
    it('should read the schema', () => {
      const router = new Router(schemas.valid)
      assert.deepEqual(router.schema, schemas.valid)
    })
    it('should fail on empty schema', () => {
      assert.throws(() => { new Router(schemas.empty) }, /child "routes" fails because \["routes" is required\]/)
    })
    it('should fail on bad verb', () => {
      const router = new Router(schemas.valid)
      assert.throws(() => { router.parse('SOMETHING /') }, /A valid HTTP method is expected before the URL/)
    })
  })
  describe('Root URL', () => {
    it('should parse root URL', () => {
      const router = new Router(schemas.valid)
      const route = router.parse('GET /')
      const expected = {
        query: {},
        method: 'GET',
        url: '/',
        path: '/',
        qs: undefined,
        params: []
      }
      assert.deepEqual(route, expected)
    })
    it('should fail if URL is not found', () => {
      const router = new Router(schemas.valid)
      assert.throws(() => { router.parse('GET /some/unknown/route') }, /Failed to find route GET \/some\/unknown\/route/)
      assert.throws(() => { router.parse('GET /unknown') }, /Failed to find route GET \/unknown/)
      assert.throws(() => { router.parse('POST /hello') }, /Failed to find route POST \/hello/)
      assert.throws(() => { router.parse('POST /unknown') }, /Failed to find route POST \/unknown/)
      assert.throws(() => { router.parse('POST /hello/world') }, /Failed to find route POST \/hello\/world/)
    })
    describe('GET requests', () => {
      it('should get a single parameter url', () => {
        const router = new Router(schemas.valid)
        const route = router.parse('GET /hello')
        const expected = {
          query: {},
          method: 'GET',
          url: '/hello',
          path: '/hello',
          qs: undefined,
          params: ['hello']
        }
        assert.deepEqual(route, expected)
      })
      it('should handle a path parameter', () => {
        const router = new Router(schemas.valid)
        const route = router.parse('GET /hello/world')
        const expected = {
          query: {},
          method: 'GET',
          url: '/hello/world',
          path: '/hello/:message',
          qs: undefined,
          params: { message: 'world' }
        }
        assert.deepEqual(route, expected)
      })
      it('should handle a multiple parameters', () => {
        const router = new Router(schemas.valid)
        const route = router.parse('GET /hello/something/world')
        const expected = {
          query: {},
          method: 'GET',
          url: '/hello/something/world',
          path: '/hello/:type/:message',
          qs: undefined,
          params: { message: 'world', type: 'something' }
        }
        assert.deepEqual(route, expected)
      })
      it('should handle non contiguous parameters', () => {
        const router = new Router(schemas.valid)
        const route = router.parse('GET /non/contiguous/parameters')
        const expected = {
          query: {},
          method: 'GET',
          url: '/non/contiguous/parameters',
          path: '/:non/contiguous/:parameters',
          qs: undefined,
          params: { non: 'non', parameters: 'parameters' }
        }
        assert.deepEqual(route, expected)
      })
      it('should fail on multiple handlers', () => {
        const router = new Router(schemas.multipleHandlers)
        assert.throws(() => { router.parse('GET /') }, /Error: Multiple routes can handle GET/)
        assert.throws(() => { router.parse('GET /hello') }, /Error: Multiple routes can handle GET/)
      })
    })
    describe('POST requests', () => {
      it('Should process POST requests', () => {
        const router = new Router(schemas.valid)
        const route = router.parse('POST /')
        const expected = {
          query: {},
          contentType: 'application/json',
          method: 'POST',
          url: '/',
          path: '/',
          qs: undefined,
          schema: {},
          params: []
        }
        assert.deepEqual(route, expected)
      })
      it('should fail on no POST schema', () => {
        assert.throws(() => { new Router(schemas.noSchema) }, /child "routes" fails because/)
      })
      it('Should process POST requests with JSON data', () => {
        const router = new Router(schemas.valid)
        const route = router.parse('POST /data', { hello: 'world' })
        const expected = {
          query: {},
          method: 'POST',
          url: '/data',
          path: '/data',
          qs: undefined,
          params: ['data'],
          contentType: 'application/json',
          schema: {
            type: 'object',
            properties: {
              hello: {
                type: 'string',
                required: true
              }
            }
          },
          data: {
            hello: 'world'
          }
        }
        assert.deepEqual(route, expected)
      })
      it('Should reject POST requests with invalid JSON data', () => {
        const router = new Router(schemas.valid)
        assert.throws(() => { router.parse('POST /data', { he: 'world' }) }, /instance\.hello is required/)
      })
      it('Should process POST requests with text data', () => {
        const router = new Router(schemas.valid)
        const route = router.parse('POST /text', 'Hello World')
        const expected = {
          query: {},
          method: 'POST',
          url: '/text',
          path: '/text',
          qs: undefined,
          params: ['text'],
          schema: {},
          contentType: 'text/plain',
          data: 'Hello World'
        }
        assert.deepEqual(route, expected)
      })
    })
  })
})
