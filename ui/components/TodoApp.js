import { inject, observer } from 'mobx-react'
@inject('store') @observer
export default class TodoApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      newtask: {}
    }
    this.setNewTaskProp = (e, f) => {
      this.state.newtask[e] = f.target.value
      this.setState(this.state)
    }
    this.add = () => {
      this.props.store.todos.add(this.state.newtask)
      this.state.newtask = {}
      this.setState(this.state)
    }
    this.clear = () => {
      this.state.newtask = {}
      this.setState(this.state)
    }
    this.edit = t => {
      console.log(t)
    }
  }
  render() {
    const store = this.props.store.todos
    return (
      <div className='flex-column fill'>
        <span className='header flex-row flex-center-align'><span className='pt-icon-standard pt-icon-endorsed'/>Todo App</span>
        <div className='fill flex-column todo-app'>
          <div className='add-todo flex-column'>
            <div className='flex-row flex-center-align pt-input-group'>
              <span className='pt-icon pt-icon-tag'/>
              <input type='text' placeholder='Task title' className='pt-input' value={this.state.newtask.title || ''} onChange={this.setNewTaskProp.bind(this, 'title')}/>
            </div>
            <textarea rows={2} type='text' placeholder='Description' className='pt-input' value={this.state.newtask.description || ''} onChange={this.setNewTaskProp.bind(this, 'description')}/>
            <div className='pt-button-group pt-fill pt-minimal'>
              <button className='pt-button pt-intent-primary pt-icon-add' onClick={this.add}>Add Task</button>
              <button className='pt-button pt-icon-cross' onClick={this.clear}>Clear</button>
            </div>
          </div>
          {
            store.tasks.length > 0 && (
              <div className='todo-list flex-column'>
                {
                  store.tasks.map(t => {
                    return (
                      <div className='flex-column todo-item pt-card pt-elevation-0 pt-interactive' key={t.id} onClick={this.edit.bind(this, t)}>
                        <b className='flex-row flex-center-align todo-title'>
                          <span className='pt-icon pt-icon-tag'/>
                          <span>{t.title}</span>
                        </b>
                        <div className='description fill'>{t.description}</div>
                      </div>
                    )
                  })
                }
              </div>
            )
          }
        </div>
      </div>
    )
  }
}
