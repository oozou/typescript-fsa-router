import { Store, AnyAction, Dispatch, MiddlewareAPI } from 'redux';
import { History, Location, Action } from 'history';
import * as Debug from 'debug';

const debug = Debug('router');

export interface ILocationChangeActionParams {
  pathname: string;
  search: string;
  hash: string;
  state?: object;
}

export const startListener = <S>(history: History, store: Store<S>, locationChangeAction: (payload: ILocationChangeActionParams) => AnyAction ) => {
  debug('init listener');

  store.dispatch(locationChangeAction({
    pathname: history.location.pathname,
    search: history.location.search,
    hash: history.location.hash,
    state: history.location.state,
  }));

  history.listen((location: Location, action: Action) => {
    debug('dispatch location change', location, action);
    
    store.dispatch(locationChangeAction({
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      state: location.state,
    }));
  });
}

export const routerMiddleware = <S>(history: History) => (api: MiddlewareAPI<S>) => (next: any) => (action: any) => {
  debug('middleware', action);
  
  switch (action.type) {
    case 'ROUTER/PUSH':
      debug('push', action.payload)
      history.push(action.payload.url, { cacheId: action.payload.cacheId });
      break;
    case 'ROUTER/REPLACE':
      debug('replace', action.payload)
      history.replace(action.payload.url, { cacheId: action.payload.cacheId });
      break;
    case 'ROUTER/GO':
      debug('go', action.payload)
      history.go(action.payload);
      break;
    case 'ROUTER/GO_BACK':
      debug('go back')
      history.goBack();
      break;
    case 'ROUTER/GO_FORWARD':
      debug('go forward')
      history.goForward();
      break;
    default:
      return next(action);
  }
};
