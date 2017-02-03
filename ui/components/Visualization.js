import { inject, observer } from 'mobx-react'
import Graph from 'react-graph-vis'
import pubsub from 'pubsub-js'
@inject('store') @observer
export default class Visualization extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.toggleTodo = () => {
      this.props.store.toggleTodo()
    }
  }
  componentWillUnmount() {
    if (this.token) pubsub.unsubscribe(this.token)
  }
  componentDidMount() {
    setTimeout(() => {
      const w = ReactDOM.findDOMNode(this).offsetWidth
      const h = ReactDOM.findDOMNode(this).offsetHeight
      this.state.dimensions = {w, h}
      this.setState(this.state)
      this.token = pubsub.subscribe('router', (m, data) => {
        const path = data.path
        const method = data.method
        const nodeid = `${path}_${method}`
        const network = this.refs.graph.Network
        network.unselectAll()
        network.selectNodes([nodeid], true)
      })
    }, 300)
    this.buildNodes = (nodes, edges, parent) => {
      const routes = this.props.store.schema.routes
      const parparts = parent.path.split('/').filter(p => p !== '')
      const children = routes.filter(r => {
        const chparts = r.path.split('/').filter(p => p !== '')
        return chparts.length === parparts.length + 1 && r.path.indexOf(parent.path) === 0
      })
      children.map(ch => {
        if (nodes.filter(n => n.id === ch.path).length === 0) {
          nodes.push({
            id: ch.path,
            label: ch.path,
            group: ch.path,
            widthConstraint: {
              minimum: 170
            }
          })
          const allpath = routes.filter(r => r.path === ch.path)
          allpath.map(p => {
            nodes.push({id: `${p.path}_${p.method}`, label: p.method, shape: 'circle', widthConstraint: {maximum: 40, minimum: 40}, group: p.path, font: '12px Roboto #666666'})
            edges.push({from: p.path, to: `${p.path}_${p.method}`, dashes: true})
          })
          edges.push({from: parent.path, to: ch.path})
          this.buildNodes(nodes, edges, ch)
        }
      })
    }
  }
  render() {
    setTimeout(() => {
      this.refs.graph.Network.fit({
        animation: {
          duration: 300
        }
      })
    }, 500)
    if (this.state.dimensions) {
      const nodes = []
      const edges = []
      const routes = this.props.store.schema.routes
      nodes.push({id: '/', label: 'root', widthConstraint: { minimum: 170 }})
      const allpath = routes.filter(r => r.path === '/')
      allpath.map(p => {
        nodes.push({id: `${p.path}_${p.method}`, label: p.method, shape: 'circle', widthConstraint: {maximum: 40, minimum: 40}, group: p.path, font: '12px Roboto #666666'})
        edges.push({from: '/', to: `${p.path}_${p.method}`, dashes: true})
      })
      const parent = _.first(routes.filter(r => r.path === '/'))
      this.buildNodes(nodes, edges, parent)
      const graph = {
        nodes,
        edges
      }
      const options = {
        layout: {
          hierarchical: {
            nodeSpacing: 200,
            direction: 'UD',
            sortMethod: 'directed',
            parentCentralization: true
          }
        },
        edges: {
          color: '#444444',
          smooth: {
            type: 'cubicBezier',
            forceDirection: 'vertical'
          }
        },
        nodes: {
          color: '#ffb366',
          shape: 'box',
          font: '14px Roboto #444444'
        },
        physics: false
      }
      const style = {
        width: '100%',
        height: this.state.dimensions.h
      }
      const events = {}
      return (
        <div className='fill flex-column viz flex-center' ref='container'>
          <Graph graph={graph} options={options} events={events} style={style} ref='graph'/>
          <div className='pt-button-group show-todo pt-minimal'>
            <button className='pt-button pt-intent-primary pt-icon-endorsed' onClick={this.toggleTodo}>
              {
                this.props.store.showTodo ? 'Close Todo List App' : 'Load Todo List App'
              }
            </button>
            <a href='http://github.com/barathvk/routes.git' target='_BLANK' className='pt-button pt-intent-success pt-icon-git-commit'>Github</a>
          </div>
        </div>
      )
    }
    else return <div/>
  }
}
