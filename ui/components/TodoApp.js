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
    this.toggleDone = t => {
      t.done = !t.done
      this.props.store.todos.save(t)
      setTimeout(() => {
        this.clear()
      })
    }
    this.save = () => {
      this.props.store.todos.save(this.state.newtask)
      this.clear()
    }
    this.clear = () => {
      this.state.newtask = {}
      this.props.store.todos.selected = null
      this.setState(this.state)
    }
    this.edit = t => {
      this.props.store.todos.selected = t
      this.state.newtask = t
      this.setState(this.state)
    }
    this.delete = t => {
      this.props.store.todos.delete(t)
      setTimeout(() => {
        this.clear()
      })
    }
  }
  componentDidMount() {
    this.props.store.todos.load()
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
              <button className={`pt-button pt-intent-primary pt-icon-${store.selected ? 'floppy-disk' : 'add'}`} onClick={store.selected ? this.save : this.add}>{store.selected ? 'Save' : 'Add'} Task</button>
              <button className='pt-button pt-icon-cross' onClick={this.clear}>Clear</button>
            </div>
          </div>
          {
            store.tasks.length > 0 && (
              <div className='todo-list flex-column'>
                {
                  store.tasks.map(t => {
                    return (
                      <div className={`flex-row flex-center-align todo-item pt-interactive ${store.selected === t ? 'pt-card pt-elevation-3' : 'pt-card pt-elevation-0'} ${t.done ? 'done' : ''}`} key={t.id} onClick={this.edit.bind(this, t)}>
                        <div className='flex-column fill'>
                          <b className='flex-row flex-center-align todo-title'>
                            <span className='pt-icon pt-icon-tag'/>
                            <span style={{textDecoration: `${t.done ? 'line-through' : 'none'}`}}>{t.title}</span>
                          </b>
                          <div className='description fill' style={{textDecoration: `${t.done ? 'line-through' : 'none'}`}}>{t.description}</div>
                        </div>
                        <div className='pt-button-group pt-minimal'>
                          <button className={`pt-button ${t.done ? 'pt-intent-success pt-icon-tick' : 'pt-intent-danger pt-icon-circle'}`} onClick={this.toggleDone.bind(this, t)}/>
                          <button className='pt-button pt-intent-danger pt-icon-remove' onClick={this.delete.bind(this, t)}/>
                        </div>
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
