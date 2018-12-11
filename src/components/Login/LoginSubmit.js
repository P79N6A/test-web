import React from 'react';
import classNames from 'classnames';
import { Button, Form } from 'antd';
import styles from './index.less';

const FormItem = Form.Item;

const LoginSubmit = ({ className, ...rest }) => {
  let clsString = classNames(styles.submit, className);
  if (rest.path === '/admin_user/login' || rest.path === '/spacex-user/login') {
    clsString = classNames(styles.submits, className);
  }

  return (
    <FormItem>
      <Button size="large" className={clsString} type="primary" htmlType="submit" {...rest} />
    </FormItem>
  );
};

export default LoginSubmit;
