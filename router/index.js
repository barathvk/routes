const Joi = require('joi-browser')
const Parser = require('./parser')
const _ = require('lodash')
const outdent = require('outdent')
const Validator = require('jsonschema').Validator
class Router {
  constructor(schema) {
    const validator = Joi.object().keys({
      routes: Joi.array().items(
        Joi.object().keys({
          path: Joi.string().required().min(1).regex(/^\/.*/),
          method: Joi.string().required().valid('GET', 'POST', 'PUT', 'DELETE'),
          schema: Joi.object(),
          contentType: Joi.string().valid('application/json', 'text/plain').when('method', {is: 'GET', then: '', otherwise: Joi.required()})
        })
      ).required()
    })
    const result = validator.validate(schema)
    if (result.error) throw result.error
    this.schema = result.value
    this.parser = new Parser()
  }
  parse(url, data) {
    const p = this.parser.parse(url, data)
    const filtered = this.schema.routes.filter(r => {
      if (r.path === p.path) return r.method === p.method
      else if (r.path.indexOf('/:') > -1) {
        const parts = r.path.split('/').filter(part => part !== '')
        const params = p.params
        if (params.length !== parts.length) return false
        const validmap = parts.map((pp, i) => {
          return pp === params[i] || pp.indexOf(':') === 0
        })
        return _.every(validmap) && r.method === p.method
      } else return false
    })
    if (filtered.length > 1) throw new Error(outdent`
    Multiple routes can handle ${url}:
      ${filtered.map(f => f.path).join('\n\t')}
    `)
    const route = _.first(filtered)
    if (!route) throw new Error(`Failed to find route ${url}`)
    if (p.data && p.method !== 'GET')
      if (p.contentType !== route.contentType) throw new Error(`Content type is wrong: expected ${route.contentType}, found ${p.contentType}`)
    const result = _.merge(p, route)
    if (route.path.indexOf('/:') > -1) {
      const parts = route.path.split('/').filter(part => part !== '')
      const params = p.params
      const validparams = {}
      parts.map((pp, i) => {
        if (pp.indexOf(':') === 0)
          validparams[pp.replace(':', '')] = params[i]
      })
      result.params = validparams
    }
    if (result.schema && p.method !== 'GET') {
      const v = new Validator()
      const valid = v.validate(p.data, result.schema)
      if (valid.errors.length > 0) throw new Error(valid.errors[0].stack)
    }
    return result
  }
}
module.exports = Router
