import mobx, { observable, action } from 'mobx'
import Router from '../../router'
import { Position, Toaster, Intent } from '@blueprintjs/core'
const Toast = Toaster.create({
  position: Position.TOP
})
export default class {
  @observable url = '/'
  @observable method = 'GET'
  @observable backup
  @observable schema = {
    routes: [
      {
        path: '/',
        method: 'GET'
      }
    ]
  }
  @observable result
  @action load() {
    try {
      const router = new Router(mobx.toJS(this.schema))
      this.result = router.parse(`${this.method} ${this.url}`)
    }
    catch (err) {
      console.error(err)
      this.schema = _.clone(mobx.toJS(this.backup))
      this.result = null
      Toast.show({message: err.message, intent: Intent.DANGER})
    }
  }
  @action select(r) {
    this.url = r.path
    this.method = r.method
    this.load()
  }
  @action remove(route) {
    this.backup = this.schema
    if (this.url === route.path && this.methd === route.method) this.result = null
    _.remove(this.schema.routes, route)
    this.load()
  }
  @action add(route) {
    this.backup = _.clone(mobx.toJS(this.schema))
    this.schema.routes.push(route)
    this.load()
  }
}
