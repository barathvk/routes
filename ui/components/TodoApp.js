import { inject, observer } from 'mobx-react'
@inject('store') @observer
export default class TodoApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    const store = this.props.store
    return (
      <div className='flex-column fill flex-center'>
        <h1>Todo App</h1>
      </div>
    )
  }
}
