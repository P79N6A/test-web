import React, { Fragment } from 'react';
import { Layout } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
import G from '@/gobal';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      links={[
        {
          key: '9AM',
          title: (
            <span>
              <img
                src={`${G.picUrl}favicon.png`}
                alt="pic"
                align="absmiddle"
                style={{ width: '20px', height: '20px' }}
              />{' '}
              9AM
            </span>
          ),
          href: '#',
          blankTarget: true,
        },
        {
          key: 'OfficeWell',
          title: (
            <span>
              <img
                src={`${G.picUrl}officewell.png`}
                alt="pic"
                align="absmiddle"
                style={{ width: '20px', height: '20px' }}
              />{' '}
              OfficeWell
            </span>
          ),
          href: '#',
          blankTarget: true,
        },
      ]}
      copyright={<Fragment>Copyright©2018 9AM Inc.</Fragment>}
    />
  </Footer>
);
export default FooterView;
