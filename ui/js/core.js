import '../css/style.sass'
import ReactDOM from 'react-dom'
import App from '../components/App'
import Store from '../store'
import { Provider } from 'mobx-react'
import WebFont from 'webfontloader'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
WebFont.load({
  google: {
    families: ['Roboto:200,300,400,600']
  },
  active: () => {
    const store = new Store()
    ReactDOM.render(
      <Provider store={store}>
        <Router history={browserHistory}>
          <Route path='/' component={App}/>
        </Router>
      </Provider>
      , document.getElementById('main')
    )
  }
})
