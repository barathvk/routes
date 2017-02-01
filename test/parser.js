const assert = require('assert')
const Parser = require('../router/parser')
const parser = new Parser()
describe('With Parser', () => {
  describe('Root URL', () => {
    describe('GET requests', () => {
      it('should match with method in uppercase', () => {
        const p = parser.parse('GET /')
        const expected = {
          query: {},
          method: 'GET',
          url: '/',
          path: '/',
          qs: undefined,
          params: []
        }
        assert.deepEqual(p, expected)
      })
      it('should match with method in lowercase', () => {
        const p = parser.parse('get /')
        const expected = {
          query: {},
          method: 'GET',
          url: '/',
          path: '/',
          qs: undefined,
          params: []
        }
        assert.deepEqual(p, expected)
      })
      it('should fail with no method', () => {
        assert.throws(() => { parser.parse('/') }, /A valid HTTP method is expected before the URL/)
      })
      it('should fail with no url', () => {
        assert.throws(() => { parser.parse('GET') }, /The input URL is invalid/)
      })
      it('should fail with no input', () => {
        assert.throws(() => { parser.parse('') }, /An input is required in the form {METHOD} {URL}/)
      })
    })
  })
  describe('Paths', () => {
    describe('GET requests', () => {
      it('should parse a single path param', () => {
        const p = parser.parse('get /hello')
        const expected = {
          query: {},
          method: 'GET',
          url: '/hello',
          path: '/hello',
          qs: undefined,
          params: ['hello']
        }
        assert.deepEqual(p, expected)
      })
      it('should handle a query parameter', () => {
        const p = parser.parse('get /hello?message=world')
        const expected = {
          method: 'GET',
          url: '/hello?message=world',
          path: '/hello',
          qs: 'message=world',
          query: {
            message: 'world'
          },
          params: ['hello']
        }
        assert.deepEqual(p, expected)
      })
      it('should handle multiple query parameters', () => {
        const p = parser.parse('get /hello?message=world&result=ok')
        const expected = {
          method: 'GET',
          url: '/hello?message=world&result=ok',
          path: '/hello',
          qs: 'message=world&result=ok',
          query: {
            message: 'world',
            result: 'ok'
          },
          params: ['hello']
        }
        assert.deepEqual(p, expected)
      })
      it('should parse a trailing slash', () => {
        const p = parser.parse('get /hello/')
        const expected = {
          query: {},
          method: 'GET',
          url: '/hello',
          path: '/hello',
          qs: undefined,
          params: ['hello']
        }
        assert(p, expected)
      })
      it('should parse multiple params', () => {
        const p = parser.parse('get /hello/world')
        const expected = {
          query: {},
          method: 'GET',
          url: '/hello/world',
          path: '/hello/world',
          qs: undefined,
          params: ['hello', 'world']
        }
        assert.deepEqual(p, expected)
      })
      it('should not accept data', () => {
        assert.throws(() => { parser.parse('GET /hello', { hello: 'world' }) }, /GET method does not allow data to be passed/)
        assert.throws(() => { parser.parse('GET /hello', '{"hello": "world"}') }, /GET method does not allow data to be passed/)
      })
    })
    describe('POST requests', () => {
      it('should parse POST requests', () => {
        const p = parser.parse('post /hello')
        const expected = {
          query: {},
          method: 'POST',
          url: '/hello',
          path: '/hello',
          qs: undefined,
          params: ['hello']
        }
        assert.deepEqual(p, expected)
      })
      it('should parse plain text data', () => {
        const p = parser.parse('post /hello', 'Hello World')
        const expected = {
          query: {},
          method: 'POST',
          url: '/hello',
          path: '/hello',
          qs: undefined,
          params: ['hello'],
          contentType: 'text/plain',
          data: 'Hello World'
        }
        assert.deepEqual(p, expected)
      })
      it('should parse JSON data', () => {
        const p = parser.parse('post /hello', '{"hello": "world"}')
        const expected = {
          query: {},
          method: 'POST',
          url: '/hello',
          path: '/hello',
          qs: undefined,
          params: ['hello'],
          contentType: 'application/json',
          data: {
            hello: 'world'
          }
        }
        assert.deepEqual(p, expected)
      })
      it('should accept object JSON data', () => {
        const p = parser.parse('post /hello', { hello: 'world' })
        const expected = {
          query: {},
          method: 'POST',
          url: '/hello',
          path: '/hello',
          qs: undefined,
          params: ['hello'],
          contentType: 'application/json',
          data: {
            hello: 'world'
          }
        }
        assert.deepEqual(p, expected)
      })
    })
    describe('PUT requests', () => {
      it('should parse PUT requests', () => {
        const p = parser.parse('put /hello')
        const expected = {
          query: {},
          method: 'PUT',
          url: '/hello',
          path: '/hello',
          qs: undefined,
          params: ['hello']
        }
        assert.deepEqual(p, expected)
      })
    })
    describe('DELETE requests', () => {
      it('should parse DELETE requests', () => {
        const p = parser.parse('delete /hello')
        const expected = {
          query: {},
          method: 'DELETE',
          url: '/hello',
          path: '/hello',
          qs: undefined,
          params: ['hello']
        }
        assert.deepEqual(p, expected)
      })
    })
  })
})
