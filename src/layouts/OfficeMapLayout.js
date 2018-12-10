import React from 'react';
import DocumentTitle from 'react-document-title';
import { formatMessage } from 'umi/locale';

class OfficeMapLayout extends React.PureComponent {
  render() {
    const { children } = this.props;
    return <DocumentTitle title={formatMessage({ id: 'login.title' })}>{children}</DocumentTitle>;
  }
}

export default OfficeMapLayout;
