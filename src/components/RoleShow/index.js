// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import React, { Component } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Checkbox } from 'antd';
import styles from './index.less';
import G from '@/global';

const managerList = ['spaceState', 'spaceUsage']
export default class RoleShow extends Component {

  // 校验是不是管理员可见
  checkName(name) {
    if (managerList.indexOf(name) > -1) {
      return <Checkbox defaultChecked disabled />
    } else {
      return ''
    }
  }

  render() {
    const { data } = this.props;
    return (
      <div className={styles.box}>
        {
          data && data.length > 0 ?
            data.map((item) => {
              return <div className={styles.minBox} key={item.path}>
                <div className={`${styles.title} ${G._.isEmpty(item.children) ? '' : styles.bgGreen}`}>
                  <div className={styles.titleList}><FormattedMessage id={item.locale} /></div>
                  <div className={styles.titleManager}>{G._.isEmpty(item.children) ? <Checkbox defaultChecked disabled /> : ""}</div>
                  <div className={styles.titleManagerSpace}></div>
                </div>
                {
                  item.children && item.children.length > 0 ?
                    item.children.map((lItem) => {
                      return <div className={styles.title} key={lItem.path}>
                        <div className={styles.contentList}><FormattedMessage id={lItem.locale} /></div>
                        <div className={styles.titleManager}><Checkbox defaultChecked disabled /></div>
                        <div className={styles.titleManagerSpace}>{this.checkName(lItem.name)}</div>
                      </div>
                    })
                    :
                    ''
                }
              </div>
            })
            :
            '暂无数据'
        }
      </div>
    );
  }
}
