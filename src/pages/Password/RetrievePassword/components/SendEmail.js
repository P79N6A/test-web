import React, { Component } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Form, Input, Row, Col, Button } from 'antd';
import G from '@/global'
import styles from '../index.less'

const FormItem = Form.Item;


class SendEmail extends Component {

  // 发送邮箱
  checkEmail() {
    const { dispatch, form, sendEmails } = this.props;
    form.validateFields(err => {
      if (err) return;
      dispatch({
        type: 'RetrievePassword/emailSave',
        payload: {
          ...form.getFieldsValue(),
        },
      });
      // 添加
      sendEmails({ ...form.getFieldsValue() });
    })
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div className={styles.emailBox}>
        <div className={styles.emailContent}>
          <h3><FormattedMessage id="reset.password" /></h3>
          <p><FormattedMessage id="reset.password.null" /></p>
          <Row className={styles.lageBox}>
            <Col span={24}>
              <Form>
                <FormItem label={formatMessage({ id: "reset.password.email-address" })} labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
                  {getFieldDecorator('email', {
                    rules: [
                      { required: true, message: formatMessage({ id: "reset.password.email-input" }) },
                      {
                        max: 50,
                        message: formatMessage({ id: 'test.max.long.fifty' }),
                      },
                      {
                        pattern: G.emailCheck,
                        message: formatMessage({ id: 'customer.operate.email-message' }),
                      },
                    ],
                  })(<Input placeholder={formatMessage({ id: "reset.password.email-input" })} />)}
                </FormItem>
              </Form>
            </Col>
            <Col span={24} style={{ textAlign: 'center', paddingTop: '10px' }}>
              <Button
                style={{ marginRight: 24 }}
                size='small'
                onClick={() => {
                  history.back(-1);
                }}
              >
                <FormattedMessage id='all.cancel' />
              </Button>
              <Button type="primary" size='small' htmlType="submit" onClick={this.checkEmail.bind(this)}>
                <FormattedMessage id="reset.password.send" />
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
export default Form.create()(SendEmail);
