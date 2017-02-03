import {observable, action} from 'mobx'
import Router from '../../router'
import { Position, Toaster, Intent } from '@blueprintjs/core'
import pubsub from 'pubsub-js'
const schema = require('../js/todoschema.json')
import ls from 'store'
export default class {
  router = new Router(schema)
  Toast = Toaster.create({
    position: Position.TOP
  })
  @observable selected
  @observable tasks = []
  @action load() {
    this.run('GET /')
  }
  @action add(newtask) {
    this.run('PUT /', newtask)
  }
  @action save(task) {
    this.run(`POST /${task.id}`, task)
  }
  @action delete(task) {
    this.run(`DELETE /${task.id}`)
  }
  @action persist() {
    ls.set('tasks', this.tasks)
  }
  @action run(command, data) {
    try {
      const parsed = this.router.parse(command, data)
      pubsub.publish('router', parsed)
      const d = parsed.data
      switch (parsed.method) {
      case 'GET':
        if (parsed.params.length === 0) this.tasks = ls.get('tasks') || []
        break
      case 'PUT':
        if (this.tasks.length === 0) d.id = 0
        else d.id = _.maxBy(this.tasks, 'id').id + 1
        this.tasks.push(d)
        this.persist()
        break
      case 'POST':
        const task = _.first(this.tasks.filter(t => t.id === parsed.params.id))
        this.tasks[this.tasks.indexOf(task)] = d
        this.persist()
        break
      case 'DELETE':
        const taskdel = _.first(this.tasks.filter(t => t.id === parseInt(parsed.params.id)))
        if (taskdel) {
          _.remove(this.tasks, taskdel)
          this.persist()
        }
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
