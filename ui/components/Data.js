import { inject, observer } from 'mobx-react'
import 'highlight.js/styles/gruvbox-dark.css'
import Highlight from 'react-highlight'
@inject('store') @observer
export default class Data extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <div className='flex-column data'>
        <div className='flex-row flex-center-align header'>
          <span className='pt-icon-standard pt-icon-code'/>
          Data
        </div>
        <Highlight className='fill json'>{this.props.store.result ? JSON.stringify(this.props.store.result, null, 2) : null}</Highlight>
      </div>
    )
  }
}
