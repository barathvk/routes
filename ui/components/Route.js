import { inject, observer } from 'mobx-react'
import Dropdown from './util/Dropdown'
import Form from 'react-json-editor'
import { Intent } from '@blueprintjs/core'
const methods = ['GET', 'POST', 'PUT', 'DELETE']
import Monaco from 'react-monaco-editor'
const contentTypes = ['application/json', 'text/plain']
@inject('store') @observer
export default class Route extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      params: {},
      schema: this.props.route.schema
    }
    this.saveSchema = () => {
      const route = _.first(this.props.store.schema.routes.filter(f => f === this.props.route))
      route.schema = this.state.schema
      this.props.store.load()
    }
    this.remove = () => {
      this.props.store.remove(this.props.route)
    }
    this.setPath = e => {
      const route = _.first(this.props.store.schema.routes.filter(f => f === this.props.route))
      route.path = e.target.value
      this.props.store.load()
    }
    this.setMethod = m => {
      const route = _.first(this.props.store.schema.routes.filter(f => f === this.props.route))
      route.method = m
      if (m === 'GET') route.contentType = ''
      else if (!route.contentType) route.contentType = 'application/json'
      this.props.store.load()
    }
    this.setContentType = m => {
      const route = _.first(this.props.store.schema.routes.filter(f => f === this.props.route))
      route.contentType = m
      this.props.store.load()
    }
    this.run = () => {
      const route = _.first(this.props.store.schema.routes.filter(f => f === this.props.route))
      let path = route.path
      _.keys(this.state.params).map(p => {
        path = path.replace(`:${p}`, this.state.params[p])
      })
      if (this.state.params.query) path += `?${this.state.params.query}`
      const data = this.refs.dataForm && this.refs.dataForm.state.output ? this.refs.dataForm.state.output : route.method !== 'GET' ? {} : null
      this.props.store.run(`${route.method} ${path}`, data)
    }
    this.setParam = (e, f) => {
      this.state.params[e] = f.target.value
    }
    this.setSchema = e => {
      try {
        const schema = JSON.parse(e)
        this.state.schema = schema
        this.setState(this.state)
      }
      catch (err) {}
    }
    this.onOpenRunner = () => {
      setTimeout(() => {
        this.load()
      }, 300)
    }
    this.load = () => {
      const e = this.refs.editor
      if (e && e.editor) {
        const options = {
          selectOnLineNumbers: true,
          roundedSelection: false,
          readOnly: false,
          disabled: true,
          theme: 'vs',
          cursorStyle: 'line',
          automaticLayout: true,
          tabSize: 2,
          insertSpaces: true,
          fontSize: 11,
          detectIndentation: false,
          cursorBlinking: 'smooth'
        }
        e.editor.updateOptions(options)
        e.editor.setValue(this.state.schema ? JSON.stringify(this.state.schema, null, 2) : null)
      }
    }
  }
  render() {
    const parts = this.props.route.path.split('/').filter(p => p !== '')
    const html = parts.length > 0 ? `/${parts.map(p => p.indexOf(':') === 0 ? `<span class='highlight-param'>${p}</span>` : p).join('/')}` : this.props.route.path
    let parsed
    try {
      parsed = this.props.store.router.parse(`${this.props.route.method} ${this.props.route.path}`)
      if (this.props.route.method !== 'GET' && this.props.route.contentType === 'application/json' && !parsed.schema) parsed.schema = {
        type: 'object',
        properties: {}
      }
    }
    catch (err) {
      this.props.store.Toast.show({message: err.message, intent: Intent.DANGER})
    }
    return (
      <a className='flex-row flex-center-align route'>
        <span className='pt-tag animated slideInLeft'>{this.props.route.method}</span>
        <span className='fill truncate animated fadeInDown' dangerouslySetInnerHTML={{__html: html}}/>
        {
          this.props.route.method !== 'GET' && (
            <span className={`pt-tag animated fadeInDown pt-intent-${this.props.route.contentType === 'application/json' ? 'success' : 'warning'}`}>{this.props.route.contentType === 'application/json' ? 'JSON' : 'TEXT'}</span>
          )
        }
        <div className='route-menu flex-row flex-center-align animated slideInRight'>
          <Dropdown icon='cog' onClose={this.saveSchema} onOpen={this.onOpenRunner}>
            <h4 className='flex-row flex-center'><span className='pt-icon-standard pt-icon-cog'/>Settings</h4>
            <div className='flex-row flex-center-align'>
              <label className='flex-1 pt-label space-right'>Path</label>
              <input className='pt-input flex-4' placeholder='Path' defaultValue={this.props.route.path} onChange={this.setPath}/>
            </div>
            <div className='flex-row flex-center-align'>
              <label className='pt-label space-right'>Method</label>
              <div className='pt-button-group fill pt-fill'>
                {
                  methods.map((m, i) => {
                    return (
                      <button className={`pt-button ${this.props.route.method === m ? 'pt-intent-primary' : ''}`} key={i} onClick={this.setMethod.bind(this, m)}>{m}</button>
                    )
                  })
                }
              </div>
            </div>
            {
              this.props.route.method !== 'GET' && (
                <div className='flex-row flex-center-align'>
                  <label className='pt-label space-right'>Content Type</label>
                  <div className='pt-button-group fill pt-fill'>
                    {
                      contentTypes.map((m, i) => {
                        return (
                          <button className={`pt-button ${this.props.route.contentType === m ? 'pt-intent-primary' : ''}`} key={i} onClick={this.setContentType.bind(this, m)}>{m}</button>
                        )
                      })
                    }
                  </div>
                </div>
              )
            }
            {
              this.props.route.method !== 'GET' && this.props.route.contentType === 'application/json' && parsed.schema && (
                <div className='flex-column fill data-editor'>
                  <div className='header flex-row flex-center'>Schema</div>
                  <Monaco
                    width='100%'
                    height={400}
                    language='json'
                    fontSize={11}
                    defaultValue=''
                    tabSize={2}
                    onChange={this.setSchema}
                    ref='editor'
                  />
                </div>
              )
            }
          </Dropdown>
          <Dropdown icon='play'>
            <h4 className='flex-row flex-center'>Run</h4>
            <div className='flex-column'>
              <div className='fill flex-column data-wrapper'>
                <b className='flex-row flex-center data-header'>Parameters</b>
                <div className='fill flex-column params'>
                  {
                    parsed && parsed.params && Object.prototype.toString.call(parsed.params) !== '[object Array]' && _.keys(parsed.params).map((p, i) => {
                      return (
                        <div className='flex-row flex-center-align run' key={i}>
                          <label className='flex-1 pt-label space-right'>{p}</label>
                          <input className='pt-input flex-6' onChange={this.setParam.bind(this, p)}/>
                        </div>
                      )
                    })
                  }
                  <div className='flex-row flex-center-align run'>
                    <label className='flex-1 pt-label space-right'>query</label>
                    <input className='pt-input flex-6' onChange={this.setParam.bind(this, 'query')}/>
                  </div>
                </div>
              </div>
              {
                parsed && parsed.schema && (
                  <div className='fill flex-column data-wrapper'>
                    <b className='flex-row flex-center data-header'>Data</b>
                    <Form schema={parsed.schema} ref='dataForm'/>
                  </div>
                )
              }
              <div className='flex-row flex-center'>
                <div className='flex-1'/>
                <div className='flex-row flex-center flex-6 pt-button-group pt-minimal'>
                  <button className='pt-button pt-intent-success pt-icon-play pt-popover-dismiss' onClick={this.run}>Run</button>
                  <button className='pt-button pt-icon-cross pt-popover-dismiss'>Cancel</button>
                </div>
              </div>
            </div>
          </Dropdown>
          <Dropdown intent='danger' icon='remove' disabled={this.props.route.path === '/' && this.props.route.method === 'GET'}>
            <h4 className='flex-row flex-center'>Are you sure?</h4>
            <div className='pt-button-group pt-minimal'>
              <button className='pt-button pt-intent-danger pt-icon-remove pt-popover-dismiss' onClick={this.remove}>Delete</button>
              <button className='pt-button pt-icon-cross pt-popover-dismiss'>Cancel</button>
            </div>
          </Dropdown>
        </div>
      </a>
    )
  }
}
