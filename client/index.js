import React from 'react'
import { render } from 'react-dom'
import { Router, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import configureStore from '../shared/utils/configureStore'
import routes from '../shared/routes/routing'

let state = null;
if (window.$REDUX_STATE) {
	state = window.$REDUX_STATE
}

const store = configureStore(state)

render(
	<Provider store={store}>
		<Router history={browserHistory} routes={routes} />
	</Provider>,
	document.querySelector('#universal-app')
)
