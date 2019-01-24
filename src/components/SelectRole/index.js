// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import React, { Component, Fragment } from 'react';
import { Checkbox, Row, Col } from 'antd';
import G from '@/global';
import styles from './index.less'

export default class SelectRole extends Component {

  onChange(type, e) {
    const { obPermission } = this.props;
    obPermission(type, e.target.value, e.target.checked);
  }

  render() {
    const { data } = this.props;
    return (
      <div>
        {
          data && data.length > 0 ?
            data.map((item) => {
              return (
                <Row key={item.serviceId}>
                  <Col className={styles.box} span={7}>
                    <Checkbox onChange={this.onChange.bind(this, 'parent')} checked={item.choose} value={item.serviceId}>{item.name}</Checkbox>
                  </Col>
                  {
                    G._.isEmpty(item.children) ? '' :
                      item.children.map((itemChildren) => {
                        return (
                          <Col className={styles.box} key={itemChildren.serviceId} span={4}>
                            <Checkbox onChange={this.onChange.bind(this, 'child')} checked={itemChildren.choose} value={itemChildren.serviceId}>{itemChildren.name}</Checkbox>
                          </Col>
                        )
                      })
                  }
                </Row>
              )
            })
            :
            ''
        }
      </div>
    );
  }
}