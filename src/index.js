import './polyfill';
import dva from 'dva';
import createHistory from 'history/createHashHistory';
import { createLogger } from 'redux-logger';
import createLoading from 'dva-loading';
import 'moment/locale/zh-cn';
import G from './gobal';
import './rollbar';

import './index.less';

const onAction = [];
// 开发环境启用redux-logger
/* eslint-disable no-undef */
if (G.env === 'api' || G.env === 'dev') {
  onAction.push(createLogger({ collapsed: () => true }));
}
// 1. Initialize
const app = dva({
  history: createHistory(),
  onAction,
});

// 2. Plugins
app.use(createLoading());

// 3. Register global model
app.model(require('./models/global').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');

export default app._store; // eslint-disable-line
