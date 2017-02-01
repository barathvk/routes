import { inject, observer } from 'mobx-react'
@inject('store') @observer
export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    const store = this.props.store
    return (
      <div>
        <h1>{store.message}</h1>
      </div>
    )
  }
}
