import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Row, Col, Button, Input, Icon, message } from 'antd';
import G from '@/global';
import styles from './SpaceState.less';
import SpaceSvg from './components/SpaceSvg';
import SpaceTotal from './components/SpaceTotal';

@connect(({ spaceState, getDeskState, loading }) => ({
  spaceState,
  getDeskState,
  loading: loading.effects['spaceState/getSvg'],
}))
export default class SpaceState extends Component {
  state = {
    query: "",
    filter: []
  }
  constructor(props) {
    super(props);
    this.state = {
      offlineCount: 0,
      vacantCount: 0,
      occupiedCount: 0,
      data: [],
    };
    this.setCount = this.setCount.bind(this);
  }

  setCount(data) {
    this.setState(data);
  }

  // 搜索
  onSearch() {
    const { query } = this.state;
    if ((query && (query.length < 5 || query.length > 7) || !query)) {
      message.error('点位编号长度为5至7个字符');
      return;
    }
    const { data } = this.props.spaceState;
    const filter = G._.filter(data, (value) => {
      if (value.htmlId.indexOf(query) > -1) {
        return value
      }
    })
    if (filter.length <= 0) {
      message.error('没有此点位编号');
    }
    this.setState({
      filter,
    })
  }

  // 清空 Input
  emitEmpty = () => {
    this.userNameInput.focus();
    this.setState({ query: '' });
  };

  // 赋值
  onChangeSearchInfo = e => {
    this.setState({ query: e.target.value });
  };

  // 按下回车键搜索
  handelKeydown = e => {
    if (e.keyCode === 13) {
      this.onSearch();
    }
  };

  render() {
    const { offlineCount, vacantCount, occupiedCount } = this.state;
    const { spaceState, dispatch } = this.props;
    const leftText = { xs: 24, sm: 24, md: 8, lg: 8, xl: 8, xxl: 8 };
    const rightSearch = { xs: 24, sm: 24, md: 16, lg: 16, xl: 16, xxl: 16 };
    const { query, filter } = this.state;
    const suffix = query ? <Icon type="close-circle" onClick={this.emitEmpty.bind(this)} /> : null;
    return (
      <div className={styles.box}>
        <Row style={{ padding: '0 10px 10px' }}>
          <Col {...leftText}>
            <p className={styles.statusText}>空间实时状态</p>
          </Col>
          <Col {...rightSearch}>
            <Button
              className={styles.rights}
              size='small'
              icon="search"
              type="primary"
              onClick={this.onSearch.bind(this)}
            >
              <FormattedMessage id="all.search" />
            </Button>
            <Input
              value={query}
              className={styles.widthInput}
              placeholder={"点位编号"}
              suffix={suffix}
              ref={node => {
                this.userNameInput = node;
              }}
              onChange={this.onChangeSearchInfo.bind(this)}
              onKeyUp={this.handelKeydown.bind(this)}
            />
          </Col>
        </Row>
        <div className={styles.container}>
          <SpaceTotal dispatch={dispatch} data={{ offlineCount, vacantCount, occupiedCount }} />
          <SpaceSvg dispatch={dispatch} filter={filter} spaceState={spaceState} setCount={this.setCount} />
        </div>
      </div>
    );
  }
}
