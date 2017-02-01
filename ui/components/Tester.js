import { inject, observer } from 'mobx-react'
@inject('store') @observer
export default class Tester extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    const store = this.props.store
    return (
      <div className='fill flex-column'>
        <h1>Tester</h1>
      </div>
    )
  }
}
