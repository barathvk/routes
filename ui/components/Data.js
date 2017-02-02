import { inject, observer } from 'mobx-react'
import Monaco from 'react-monaco-editor'
@inject('store') @observer
export default class Data extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.load = () => {
      const e = this.refs.editor
      if (e && e.editor) {
        const options = {
          selectOnLineNumbers: true,
          roundedSelection: false,
          readOnly: true,
          disabled: true,
          theme: 'vs',
          cursorStyle: 'line',
          automaticLayout: true,
          tabSize: 2,
          insertSpaces: true,
          detectIndentation: false,
          cursorBlinking: 'expand',
          fontSize: 11
        }
        e.editor.updateOptions(options)
        e.editor.setValue(this.props.store.result ? JSON.stringify(this.props.store.result, null, 2) : '')
      }
    }
  }
  render() {
    return (
      <div className='flex-column data'>
        <div className='flex-row flex-center-align header'>
          <span className='pt-icon-standard pt-icon-code'/>
          Results
        </div>
        <Monaco
          width='100%'
          height='100%'
          language='json'
          fontSize={11}
          readOnly={true}
          value={this.props.store.result ? JSON.stringify(this.props.store.result, null, 2) : ''}
          editorDidMount={this.load}
          ref='editor'
        />
      </div>
    )
  }
}
