import { Popover, PopoverInteractionKind, Position } from '@blueprintjs/core'
export default class Dropdown extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <Popover content={this.props.children} interactionKind={PopoverInteractionKind.CLICK} position={Position.BOTTOM} useSmartPositioning={true} popoverClassName='pt-popover-content-sizing' popoverWillClose={this.props.onClose}>
        <button className={`pt-button pt-minimal pt-icon-${this.props.icon} ${this.props.intent ? `pt-intent-${this.props.intent}` : ''}`} disabled={this.props.disabled}/>
      </Popover>
    )
  }
}
