import { inject, observer } from 'mobx-react'
import Data from './Data'
import Routes from './Routes'
import Visualization from './Visualization'
@inject('store') @observer
export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <div className='fill flex-row'>
        <div className='flex-column left-sidebar'>
          <Routes/>
          <Data/>
        </div>
        <Visualization/>
      </div>
    )
  }
}
