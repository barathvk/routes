import { inject, observer } from 'mobx-react'
@inject('store') @observer
export default class Visualization extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    const store = this.props.store
    return (
      <div className='fill flex-column viz flex-center'>
        <h1>Visualization</h1>
      </div>
    )
  }
}
