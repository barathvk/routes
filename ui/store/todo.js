import {observable, action} from 'mobx'
import Router from '../../router'
import { Position, Toaster, Intent } from '@blueprintjs/core'
const schema = require('../js/todoschema.json')
export default class {
  router = new Router(schema)
  Toast = Toaster.create({
    position: Position.TOP
  })
  @observable tasks = []
  @action add(newtask) {
    this.run('PUT /', newtask)
  }
  @action run(command, data) {
    try {
      const parsed = this.router.parse(command, data)
      switch (parsed.method) {
      case 'PUT':
        const data = parsed.data
        if (this.tasks.length === 0) data.id = 0
        else data.id = _.max(this.tasks, 'id') + 1
        this.tasks.push(data)
        break
      default:
        break
      }
    }
    catch (err) {
      this.Toast.show({message: err.message, intent: Intent.DANGER})
    }
  }
}
