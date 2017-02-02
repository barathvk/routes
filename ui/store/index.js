import mobx, { observable, action } from 'mobx'
import Router from '../../router'
import { Position, Toaster, Intent } from '@blueprintjs/core'
import ls from 'store'
export default class {
  Toast = Toaster.create({
    position: Position.TOP
  })
  @observable backup
  @observable router
  @observable showTodo
  @observable result
  @observable schema = ls.get('schema') || {
    routes: [
      {
        path: '/',
        method: 'GET',
        contentType: ''
      },
      {
        path: '/hello/:id',
        method: 'POST',
        contentType: 'application/json',
        schema: {
          type: 'object',
          title: 'Data',
          properties: {
            name: {
              title: 'name',
              type: 'string',
              required: true
            }
          }
        }
      }
    ]
  }
  @action load() {
    try {
      this.router = new Router(mobx.toJS(this.schema))
      if (!this.showTodo) ls.set('schema', this.schema)
    }
    catch (err) {
      this.schema = _.clone(mobx.toJS(this.backup))
      this.Toast.show({message: err.message, intent: Intent.DANGER})
      this.load()
    }
  }
  @action run(command, data) {
    try {
      this.result = this.router.parse(command, data)
    }
    catch (err) {
      this.Toast.show({message: err.message, intent: Intent.DANGER})
    }
  }
  @action remove(route) {
    this.backup = this.schema
    if (this.url === route.path && this.methd === route.method) this.result = null
    _.remove(this.schema.routes, route)
    this.load()
  }
  @action add(route) {
    const exists = _.first(this.schema.routes.filter(r => route.method === r.method && route.path === r.path))
    if (!exists) {
      this.backup = _.clone(mobx.toJS(this.schema))
      this.schema.routes.push(route)
      this.load()
    }
    else this.Toast.show({message: 'This route has already been defined', intent: Intent.DANGER})
  }
}
