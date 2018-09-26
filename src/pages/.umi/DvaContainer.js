import { Component } from 'react';
import dva from 'dva';
import createLoading from 'dva-loading';

let app = dva({
  history: window.g_history,
  
});

window.g_app = app;
app.use(createLoading());

app.model({ namespace: 'changePass', ...(require('E:/company/item9AM/space-web/src/models/changePass.js').default) });
app.model({ namespace: 'global', ...(require('E:/company/item9AM/space-web/src/models/global.js').default) });
app.model({ namespace: 'home', ...(require('E:/company/item9AM/space-web/src/models/home.js').default) });
app.model({ namespace: 'login', ...(require('E:/company/item9AM/space-web/src/models/login.js').default) });
app.model({ namespace: 'manaCustomer', ...(require('E:/company/item9AM/space-web/src/models/manaCustomer.js').default) });
app.model({ namespace: 'manaEquip', ...(require('E:/company/item9AM/space-web/src/models/manaEquip.js').default) });
app.model({ namespace: 'manaNotice', ...(require('E:/company/item9AM/space-web/src/models/manaNotice.js').default) });
app.model({ namespace: 'manaPerson', ...(require('E:/company/item9AM/space-web/src/models/manaPerson.js').default) });
app.model({ namespace: 'setting', ...(require('E:/company/item9AM/space-web/src/models/setting.js').default) });
app.model({ namespace: 'user', ...(require('E:/company/item9AM/space-web/src/models/user.js').default) });
app.model({ namespace: 'error', ...(require('E:/company/item9AM/space-web/src/pages/Exception/models/error.js').default) });

class DvaContainer extends Component {
  render() {
    app.router(() => this.props.children);
    return app.start()();
  }
}

export default DvaContainer;
