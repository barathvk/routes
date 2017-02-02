import { inject, observer } from 'mobx-react'
import 'brace'
import AceEditor from 'react-ace'
import 'brace/mode/json'
import 'brace/theme/github'
@inject('store') @observer
export default class Schema extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <div className='flex-column data'>
        <div className='flex-row flex-center-align header'>
          <span className='pt-icon-standard pt-icon-code'/>
          Schema
        </div>
        <AceEditor mode='json' theme='github' editorProps={{$blockScrolling: true}} value={JSON.stringify(this.props.store.schema, null, 2)} className='fill' height='100%' width='100%' readOnly/>
      </div>
    )
  }
}
