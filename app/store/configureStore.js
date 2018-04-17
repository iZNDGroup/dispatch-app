import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import rootReducer from "../reducers";
import rootSaga from "../sagas";

const configureStore = onComplete => {
  const preloadedState = {};
  const sagaMiddleware = createSagaMiddleware();
  const enhancer = compose(applyMiddleware(sagaMiddleware));
  const store = createStore(rootReducer, preloadedState, enhancer);
  sagaMiddleware.run(rootSaga);
  onComplete(store);
};

export default configureStore;
