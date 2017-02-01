import { inject, observer } from 'mobx-react'
import { Popover, PopoverInteractionKind, Position } from '@blueprintjs/core'
const methods = ['GET', 'POST', 'PUT', 'DELETE']
@inject('store') @observer
export default class Routes extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      rowToRemove: null,
      chosenMethod: 'GET'
    }
    this.removePopover = (
      <div className='flex-column'>
        <h4 className='flex-row flex-center-align'><span className='pt-icon-standard pt-icon-remove'/>Delete Confirmation</h4>
        <span>Are you sure you want to remove this route?</span>
        <div className='pt-button-group pt-minimal'>
          <button className='pt-intent-danger pt-button pt-icon-remove pt-popover-dismiss' onClick={() => this.remove()}>
            Remove
          </button>
          <button className='pt-button pt-icon-cross pt-popover-dismiss'>
            Cancel
          </button>
        </div>
      </div>
    )
    this.setChosenMethod = m => {
      this.state.chosenMethod = m
      this.setState(this.state)
    }
    this.select = e => {
      this.props.store.select(e)
    }
    this.setRowToAdd = e => {
      this.state.rowToAdd = e.target.value
      this.setState(this.state)
    }
    this.row = (r, i) => {
      return (
        <a className={`route flex-row flex-center-align ${this.props.store.url === r.path ? 'active' : ''}`} key={i} onClick={this.select.bind(this, r)}>
          <span className='pt-tag flex-row flex-center-align'>{r.method}</span>
          <span className='flex-row flex-center-align fill truncate'>{r.path}</span>
          <Popover content={this.removePopover} interactionKind={PopoverInteractionKind.CLICK} position={Position.BOTTOM} useSmartPositioning={true} popoverClassName='pt-popover-content-sizing' popoverDidOpen={
              () => {
                this.state.rowToRemove = r
                this.setState(this.state)
              }
            }
          >
            <button className='pt-button pt-minimal pt-intent-danger pt-icon-remove'/>
          </Popover>
        </a>
      )
    }
    this.remove = () => {
      this.props.store.remove(this.state.rowToRemove)
      this.state.rowToRemove = null
      this.setState(this.state)
    }
    this.add = () => {
      const newobj = {
        path: this.state.rowToAdd,
        method: this.state.chosenMethod
      }
      if (this.state.chosenMethod !== 'GET') newobj.contentType = 'application/json'
      this.props.store.add(newobj)
      this.setState({
        rowToAdd: null,
        chosenMethod: 'GET'
      })
    }
  }
  render() {
    const store = this.props.store
    const methodPopover = (
      <ul className='pt-menu'>
        {
          methods.filter(m => m !== this.state.chosenMethod).map((m, i) => {
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
      <div className='flex-column routes fill'>
        <div className='header flex-row flex-center-align'>
          <span className='pt-icon-standard pt-icon-exchange'/>
          Routes
        </div>
        <div className='flex-row flex-center-align route pt-input-group add-route'>
          <Popover content={methodPopover} interactionKind={PopoverInteractionKind.CLICK} position={Position.BOTTOM_LEFT} useSmartPositioning={true}>
            <button className='pt-button pt-intent-primary'>{this.state.chosenMethod}</button>
          </Popover>
          <input type='text' placeholder='Add route' className='fill' value={this.state.rowToAdd || ''} onChange={this.setRowToAdd}/>
          <button className='pt-button pt-minimal pt-intent-primary pt-icon-add' onClick={this.add}/>
        </div>
        {
          store.schema.routes.map((r, i) => { return this.row(r, i, this) })
        }
      </div>
    )
  }
}
