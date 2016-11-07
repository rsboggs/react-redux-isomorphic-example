import { createStore, applyMiddleware, compose } from 'redux';
import createLogger from 'redux-logger';
import combinedReducers from '../reducers';

const logger = createLogger({
  level: 'info',
});

const enhancer = compose(
	applyMiddleware(logger),
)

export default function configureStore( initialState = undefined  ) {

  const store = createStore(combinedReducers, initialState, enhancer);

  if (module.hot) {
	module.hot.accept('../reducers', () => {
	  const nextRootReducer = require('../reducers');
	  store.replaceReducer(nextRootReducer);
	});
  }

  return store;
}
