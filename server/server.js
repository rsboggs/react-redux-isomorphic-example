import express from 'express'
import path from 'path'
import { renderToString } from 'react-dom/server'
import React from 'react'
import { Router, RouterContext, match } from 'react-router'
import { applyMiddleware, createStore } from 'redux'
import { Provider } from 'react-redux'
import routes from '../shared/routes/routing'
import combinedReducers from '../shared/reducers'
import fetchComponentData from '../shared/utils/fetchComponentData'

const finalCreateStore = applyMiddleware()( createStore )

const app = express()

app.use('/assets', express.static(path.join(__dirname, '../client/assets')))

// Initialize webpack HMR
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const config = require('../webpack.config')
const compiler = webpack(config)
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))
app.use(webpackHotMiddleware(compiler))

// Server side rendering
app.use((req, res, next) => {

	const store = finalCreateStore(combinedReducers)

	// react-router
	match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {

		if (error)
			return res.status(500).send( error.message )

		if (redirectLocation)
			return res.redirect( 302, redirectLocation.pathname + redirectLocation.search )

		if (renderProps == null) {
			// return next('err msg: route not found') // yield control to next middleware to handle the request
			return res.status(404).send( 'Not found' )
		}

		// this is where universal rendering happens,
		// fetchComponentData() will trigger actions listed in static "needs" props in each container component
		// and wait for all of them to complete before continuing rendering the page,
		// hence ensuring all data needed was fetched before proceeding
		//
		// renderProps: contains all necessary data, e.g: routes, router, history, components...
		fetchComponentData(store.dispatch, renderProps.components, renderProps.params)

		.then(() => {

			const initView = renderToString((
				<Provider store={store}>
				  <RouterContext {...renderProps} />
				</Provider>
			))

			let state = JSON.stringify(store.getState())

			let page = renderFullPage(initView, state)

			return page

		})

		.then(page => res.status(200).send(page))

		.catch(err => res.end(err.message))
	})
})


function renderFullPage(html, initialState) {
  return `
	<!doctype html>
	<html lang="utf-8">
	  <head>
		<title>Universal Javascript App</title>
		<link rel="shortcut icon" type="image/png" href="assets/images/react.png">
	  </head>
	  <body>
	  <div id="universal-app">${html}</div>
		<script>window.$REDUX_STATE = ${initialState}</script>
		<script src="/static/bundle.js"></script>
	  </body>
	</html>
	`
}

// example of handling 404 pages
app.get('*', function(req, res) {
	res.status(404).send('Server.js > 404 - Page Not Found')
})

// global error catcher, need four arguments
app.use((err, req, res, next) => {
  console.error("Error on request %s %s", req.method, req.url)
  console.error(err.stack)
  res.status(500).send("Server error")
})

process.on('uncaughtException', evt => {
  console.log( 'uncaughtException: ', evt )
})

var $PORT = process.env.PORT || 3000

app.listen($PORT, function(){
	console.log('Listening on port ', $PORT)
})
