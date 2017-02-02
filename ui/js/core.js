import '../css/style.sass'
import ReactDOM from 'react-dom'
import App from '../components/App'
import Store from '../store'
import { Provider } from 'mobx-react'
import { autorun } from 'mobx'
import WebFont from 'webfontloader'
WebFont.load({
  google: {
    families: ['Roboto:400,500,600']
  },
  active: () => {
    const store = new Store()
    store.load()
    ReactDOM.render(
      <Provider store={store}>
        <App/>
      </Provider>
      , document.getElementById('main')
    )
  }
})
