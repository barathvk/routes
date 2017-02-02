import { inject, observer } from 'mobx-react'
import Route from './Route'
import { Popover, PopoverInteractionKind, Position } from '@blueprintjs/core'
const methods = ['GET', 'POST', 'PUT', 'DELETE']
@inject('store') @observer
export default class Routes extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      newRoute: {
        method: 'GET'
      }
    }
    this.setChosenMethod = m => {
      this.state.newRoute.method = m
      this.setState(this.state)
    }
    this.setNewRoutePath = e => {
      this.state.newRoute.path = e.target.value
      this.setState(this.state)
    }
    this.handleKeyDown = e => {
      if (e.keyCode === 13) this.add()
    }
    this.add = () => {
      if (this.state.newRoute.method !== 'GET' && !this.state.newRoute.contentType) this.state.newRoute.contentType = 'application/json'
      this.props.store.add(this.state.newRoute)
      this.state.newRoute = {
        method: 'GET'
      }
      this.setState(this.state)
    }
  }
  render() {
    const store = this.props.store
    const methodPopover = (
      <ul className='pt-menu'>
        {
          methods.filter(m => m !== this.state.newRoute.method).map((m, i) => {
            return (
              <li key={i}>
                <a className='pt-menu-item pt-popover-dismiss' onClick={this.setChosenMethod.bind(this, m)}>{m}</a>
              </li>
            )
          })
        }
      </ul>
    )
    return (
      <div className='flex-column fill routes'>
        <div className='header flex-row flex-center-align'>
          <span className='pt-icon-standard pt-icon-exchange'/>
          Routes
        </div>
        <div className='flex-row flex-center-align route pt-input-group add-route'>
          <Popover content={methodPopover} interactionKind={PopoverInteractionKind.CLICK} position={Position.BOTTOM_LEFT} useSmartPositioning={true}>
            <button className='pt-button pt-intent-primary'>{this.state.newRoute.method}</button>
          </Popover>
          <input type='text' placeholder='Add route' className='fill' value={this.state.newRoute.path || ''} onChange={this.setNewRoutePath} onKeyDown={this.handleKeyDown}/>
          <button className='pt-button pt-minimal pt-intent-primary pt-icon-add' onClick={this.add}/>
        </div>
        {
          store.schema.routes.map((r, i) => {
            return (
              <Route route={r} key={i}/>
            )
          })
        }
      </div>
    )
  }
}
