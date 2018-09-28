import React, { Fragment } from 'react';
import { Layout, message } from 'antd';
import DocumentTitle from 'react-document-title';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import { connect } from 'dva';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import { enquireScreen, unenquireScreen } from 'enquire-js';
import { formatMessage } from 'umi/locale';
import SiderMenu from '@/components/SiderMenu';
import Authorized from '@/utils/Authorized';
import Header from './Header';
import Footer from './Footer';
import GlobalFooter from '../components/GlobalFooter';
import { getAuthority } from '@/utils/authority';

import G from '@/global';
import Exception403 from '../pages/Exception/403';
import Context from './MenuContext';
import { getUserInfo, setUserInfo } from '@/utils/authority';

const { Content } = Layout;

const CTOKEN = 'EJ3lZjIAqUanJPqOPFlf8fC9AMCKbBp9amrr9FS69am82h';

// Conversion router to menu.
function formatter(data, parentPath = '', parentAuthority, parentName) {
  return data.map(item => {
    let locale = 'menu';
    if (parentName && item.name) {
      locale = `${parentName}.${item.name}`;
    } else if (item.name) {
      locale = `menu.${item.name}`;
    } else if (parentName) {
      locale = parentName;
    }
    const result = {
      ...item,
      locale,
      authority: item.authority || parentAuthority,
    };
    if (item.routes) {
      const children = formatter(item.routes, `${parentPath}${item.path}/`, item.authority, locale);
      // Reduce memory usage
      result.children = children;
    }
    delete result.routes;
    return result;
  });
}

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};

class BasicLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.getPageTitle = memoizeOne(this.getPageTitle);
    this.getBreadcrumbNameMap = memoizeOne(this.getBreadcrumbNameMap, isEqual);
    this.breadcrumbNameMap = this.getBreadcrumbNameMap();
    this.matchParamsPath = memoizeOne(this.matchParamsPath, isEqual);
    message.config({
      top: 100,
      duration: 2,
      maxCount: 3,
    });
  }

  state = {
    rendering: true,
    isMobile: false,
  };

  componentWillMount() {
    const userInfo = getUserInfo();
    const { dispatch } = this.props;
    const user = JSON.parse(userInfo);
    const index = window.location.href.indexOf('ctoken');
    const payload = {
      token: window.location.href.substr(index + 7),
      name: 'guest',
      nickName: '优客工场',
      avatar: `${G.picUrl}urwork_head.png`,
    };
    if (index > -1 && payload.token === CTOKEN) {
      setUserInfo({ ...payload, autoLogin: true });
      dispatch({
        type: 'user/saveUser',
        payload,
      });
      dispatch({
        type: 'user/changeLoginStatus',
        payload,
      });
      return;
    }
    if (user && user.token) {
      dispatch({
        type: 'user/saveUser',
        payload: user,
      });
    } else {
      dispatch({
        type: 'login/logoutWithoutToken',
      });
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    this.renderRef = requestAnimationFrame(() => {
      this.setState({
        rendering: false,
      });
    });
    this.enquireHandler = enquireScreen(mobile => {
      const { isMobile } = this.state;
      if (isMobile !== mobile) {
        this.setState({
          isMobile: mobile,
        });
      }
    });
  }

  componentDidUpdate(preProps) {
    // After changing to phone mode,
    // if collapsed is true, you need to click twice to display
    this.breadcrumbNameMap = this.getBreadcrumbNameMap();
    const { isMobile } = this.state;
    const { collapsed } = this.props;
    if (isMobile && !preProps.isMobile && !collapsed) {
      this.handleMenuCollapse(false);
    }
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.renderRef);
    unenquireScreen(this.enquireHandler);
  }

  getContext() {
    const { location } = this.props;
    return {
      location,
      breadcrumbNameMap: this.breadcrumbNameMap,
    };
  }

  getMenuData() {
    const {
      route: { routes },
    } = this.props;
    return formatter(routes);
  }

  /**
   * 获取面包屑映射
   * @param {Object} menuData 菜单配置
   */
  getBreadcrumbNameMap() {
    const routerMap = {};
    const mergeMenuAndRouter = data => {
      data.forEach(menuItem => {
        if (menuItem.children) {
          mergeMenuAndRouter(menuItem.children);
        }
        // Reduce memory usage
        routerMap[menuItem.path] = menuItem;
      });
    };
    mergeMenuAndRouter(this.getMenuData());
    return routerMap;
  }

  matchParamsPath = pathname => {
    const pathKey = Object.keys(this.breadcrumbNameMap).find(key =>
      pathToRegexp(key).test(pathname)
    );
    return this.breadcrumbNameMap[pathKey];
  };

  getPageTitle = pathname => {
    const currRouterData = this.matchParamsPath(pathname);

    if (!currRouterData) {
      return 'Smart Space';
    }
    const message = formatMessage({
      id: currRouterData.locale || currRouterData.name,
      defaultMessage: currRouterData.name,
    });
    return `${message}`;
  };

  getLayoutStyle = () => {
    const { isMobile } = this.state;
    const { fixSiderbar, collapsed, layout } = this.props;
    if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
      return {
        paddingLeft: collapsed ? '80px' : '256px',
      };
    }
    return null;
  };

  getContentStyle = () => {
    const { fixedHeader } = this.props;
    return {
      margin: '24px 24px 0',
      paddingTop: fixedHeader ? 64 : 0,
    };
  };

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  render() {
    const Authority = getAuthority();
    let color = 'light'
    if (Authority[0] === 'admin') {
      color = 'dark'
    }
    // this.props.navTheme = color;
    const myProps = { ...this.props, navTheme: color };
    const {
      currentUser,
      navTheme,
      layout: PropsLayout,
      children,
      location: { pathname },
    } = myProps;
    const { isMobile } = this.state;
    const isTop = PropsLayout === 'topmenu';
    const menuData = this.getMenuData();
    const routerConfig = this.matchParamsPath(pathname);
    const layout = (
      <Layout>
        {isTop && !isMobile ? null : (
          <SiderMenu
            logo={`${G.picUrl}logoGreen.png`}
            Authorized={Authorized}
            theme={navTheme}
            onCollapse={this.handleMenuCollapse}
            menuData={menuData}
            isMobile={isMobile}
            {...myProps}
          />
        )}
        <Layout
          style={{
            ...this.getLayoutStyle(),
            minHeight: '100vh',
          }}
        >
          <Header
            currentUser={currentUser}
            menuData={menuData}
            handleMenuCollapse={this.handleMenuCollapse}
            logo={`${G.picUrl}logoGreen.png`}
            isMobile={isMobile}
            {...this.props}
          />
          <Content style={{ margin: '24px 24px 0', height: '100%', position: 'relative' }}>
            <Authorized authority={routerConfig.authority} noMatch={<Exception403 />}>
              {children}
            </Authorized>
          </Content>

          <Footer style={{ padding: 0 }}>
            <GlobalFooter copyright={<Fragment>Copyright©2018 9AM Inc.</Fragment>} />
          </Footer>
        </Layout>
      </Layout>
    );
    return (
      <React.Fragment>
        <DocumentTitle title={this.getPageTitle(pathname)}>
          <ContainerQuery query={query}>
            {params => (
              <Context.Provider value={this.getContext()}>
                <div className={classNames(params)}>{layout}</div>
              </Context.Provider>
            )}
          </ContainerQuery>
        </DocumentTitle>
      </React.Fragment>
    );
  }
}

export default connect(({ user, global, setting }) => ({
  currentUser: user.user,
  collapsed: global.collapsed,
  layout: setting.layout,
  ...setting,
}))(BasicLayout);
