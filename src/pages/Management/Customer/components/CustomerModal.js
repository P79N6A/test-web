import React, { Component } from 'react';
import { formatMessage, FormattedMessage, getLocale } from 'umi/locale';
import { Form, Input, Row, Col, Button, message } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import G from '@/global'
import styles from './../NewCustomer.less'

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ ManagementCustomer }) => ({
  ManagementCustomer,
}))
class NewCustomer extends Component {
  state = {
    title: formatMessage({ id: 'menu.management.newCustomer' }),
  };

  componentDidMount() {
    const { ManagementCustomer } = this.props;
    const { editValue } = ManagementCustomer;
    const { form } = this.props;
    if (editValue !== '') {
      form.setFieldsValue({
        account: editValue.company.account,
        password: '******',
        email: editValue.company.email,
        companyName: editValue.companyName,
        customerName: editValue.customerName,
        contacts: editValue.company.contacts,
        telephone: editValue.company.telephone,
        address: editValue.company.address,
        website: editValue.company.website,
        industry: editValue.company.industry,
        contractNo: editValue.company.contractNo,
        remark: editValue.company.remark,
      });
      this.setState({ title: formatMessage({ id: 'customer.operate.edit-customer' }) });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'ManagementCustomer/setEditValue',
      payload: '',
    });
  }

  // 时间选择器
  onChange() { }

  // 上传成功或者失败的回调
  release(res) {
    if (res.status === 'success') {
      message.success(res.message || formatMessage({ id: 'customer.operate.add-success' }));
      setTimeout(() => {
        this.goBack();
      }, 2000);
    } else {
      message.error(G.errorLists[res.code][`message_${getLocale()}`] || 'error');
    }
  }

  // 编辑成功或者失败的回调
  releases(res) {
    if (res.status === 'success') {
      message.success(res.message || formatMessage({ id: 'customer.operate.successfully-modified' }));
      setTimeout(() => {
        this.goBack();
      }, 2000);
    } else {
      message.error(G.errorLists[res.code][`message_${getLocale()}`] || 'error');
    }
  }
  // 添加
  handleCommit() {
    const { form, dispatch, ManagementCustomer } = this.props;
    const { editValue } = ManagementCustomer;
    form.validateFields(err => {
      if (err) return;
      if (editValue !== '') {
        const all = form.getFieldsValue();
        delete all.password;
        delete all.account;
        delete all.companyName;
        // 编辑
        dispatch({
          type: 'ManagementCustomer/editCustomer',
          payload: {
            companyId: editValue.companyId,
            ...all,
            callback: this.releases.bind(this),
          },
        });
      } else {
        // 添加
        dispatch({
          type: 'ManagementCustomer/addCustomer',
          payload: {
            ...form.getFieldsValue(),
            callback: this.release.bind(this),
          },
        });
      }
    });
  }

  // 返回上一页
  goBack() {
    const { dispatch } = this.props;
    dispatch({
      type: 'ManagementCustomer/setEditValue',
      payload: '',
    });
    this.props.dispatch(routerRedux.push('/management/customer'))
  }

  render() {
    const { form, ManagementCustomer } = this.props;
    const { title } = this.state;
    const { getFieldDecorator } = form;
    const { editValue } = ManagementCustomer;
    const leftImg = { xs: 24, sm: 12, md: 12, lg: 12, xl: 12, xxl: 12 };
    return (
      <div>
        <h3>{title}</h3>
        <br />
        <Form style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '4px' }}>
          <Row gutter={24}>
            <p className={styles.addTitle}><FormattedMessage id="customer.operate.message" /></p>
            <Col {...leftImg}>
              <FormItem label={formatMessage({ id: "customer.list.name" })}>
                {getFieldDecorator('customerName', {
                  rules:
                    editValue === ''
                      ? [
                        { required: true, message: formatMessage({ id: "customer.operate.input-message" }) },
                        {
                          max: 50,
                          message: formatMessage({ id: 'test.max.long.fifty' }),
                        },
                      ]
                      : [],
                })(<Input placeholder={formatMessage({ id: "customer.operate.input-message" })} />)}
              </FormItem>
            </Col>
            <Col {...leftImg}>
              <FormItem label={formatMessage({ id: 'customer.operate.company-name' })}>
                {getFieldDecorator('companyName', {
                  rules:
                    editValue === ''
                      ? [
                        { required: true, message: formatMessage({ id: 'customer.operate.company-name-message' }) },
                        {
                          max: 50,
                          message: formatMessage({ id: 'test.max.long.fifty' }),
                        },
                      ]
                      : [],
                })(<Input placeholder={formatMessage({ id: 'customer.operate.company-name-message' })} disabled={editValue !== ''} />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <p className={styles.addTitle}><FormattedMessage id="customer.operate.account-message" /></p>
            <Col {...leftImg}>
              <FormItem label={formatMessage({ id: 'customer.list.account-number' })}>
                {getFieldDecorator('account', {
                  rules:
                    editValue === ''
                      ? [
                        { required: true, message: formatMessage({ id: 'customer.operate.account-number-text' }) },
                        {
                          max: 20,
                          message: formatMessage({ id: 'test.max.long.twenty' }),
                        },
                        {
                          pattern: G.accountCheck,
                          message: formatMessage({ id: 'customer.operate.account-number-message' }),
                        },
                      ]
                      : [],
                })(<Input placeholder={formatMessage({ id: 'customer.operate.account-number-text' })} disabled={editValue !== ''} />)}
              </FormItem>
            </Col>
            <Col {...leftImg}>
              <FormItem label={formatMessage({ id: 'customer.operate.password' })}>
                {getFieldDecorator('password', {
                  rules:
                    editValue === ''
                      ? [
                        { required: true, message: formatMessage({ id: 'customer.operate.password-text' }) },
                        {
                          min: 8,
                          message: formatMessage({ id: 'test.min.long.eight' }),
                        },
                        {
                          max: 20,
                          message: formatMessage({ id: 'test.max.long.twenty' }),
                        },
                        {
                          pattern: G.passCheck,
                          message: formatMessage({ id: 'customer.operate.password-message' }),
                        },
                      ]
                      : [],
                })(<Input placeholder={formatMessage({ id: 'customer.operate.password-text' })} disabled={editValue !== ''} />)}
              </FormItem>
            </Col>
            <Col {...leftImg}>
              <FormItem label={formatMessage({ id: 'app.settings.basic.email' })}>
                {getFieldDecorator('email', {
                  rules: [
                    { required: true, message: formatMessage({ id: 'app.settings.basic.email-message' }) },
                    {
                      max: 50,
                      message: formatMessage({ id: 'test.max.long.fifty' }),
                    },
                    {
                      pattern: G.emailCheck,
                      message: formatMessage({ id: 'customer.operate.email-message' }),
                    },
                  ],
                })(<Input placeholder={formatMessage({ id: 'customer.operate.email' })} />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <p className={styles.addTitle}><FormattedMessage id="customer.operate.set-message" /></p>
            <Col {...leftImg}>
              <FormItem label={formatMessage({ id: 'customer.operate.administrator-name' })}>
                {getFieldDecorator('contacts', {
                  rules: [
                    { required: true, message: formatMessage({ id: 'customer.operate.administrator-name-text' }) },
                    {
                      max: 20,
                      message: formatMessage({ id: 'test.max.long.twenty' }),
                    },
                  ],
                })(<Input placeholder={formatMessage({ id: "customer.operate.connect-name" })} />)}
              </FormItem>
            </Col>
            <Col {...leftImg}>
              <FormItem label={formatMessage({ id: 'customer.operate.administrator-mobile' })}>
                {getFieldDecorator('telephone', {
                  rules: [
                    { required: true, message: formatMessage({ id: 'customer.operate.administrator-mobile-text' }) },
                    {
                      max: 11,
                      message: formatMessage({ id: 'test.max.long.eleven' }),
                    },
                    {
                      pattern: G.phoneCheck,
                      message: formatMessage({ id: 'customer.operate.administrator-mobile-message' }),
                    },
                  ],
                })(<Input placeholder={formatMessage({ id: "customer.operate.connect-mobile" })} />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <p className={styles.addTitle}><FormattedMessage id="all.other" /></p>
            <Col {...leftImg}>
              <FormItem label={formatMessage({ id: 'customer.operate.detailed-address' })}>
                {getFieldDecorator('address', {
                  rules: [
                    {
                      max: 100,
                      message: formatMessage({ id: 'test.max.long.one.hundred' }),
                    },
                  ],
                })(<Input placeholder={formatMessage({ id: "customer.operate.address-text" })} />)}
              </FormItem>
            </Col>
            <Col {...leftImg}>
              <FormItem label={formatMessage({ id: 'customer.operate.website-link' })}>
                {getFieldDecorator('website', {
                  rules: [
                    {
                      max: 100,
                      message: formatMessage({ id: 'test.max.long.one.hundred' }),
                    },
                  ],
                })(<Input placeholder={formatMessage({ id: 'customer.operate.website-link' })} />)}
              </FormItem>
            </Col>
            <Col {...leftImg}>
              <FormItem label={formatMessage({ id: 'customer.operate.industry' })}>
                {getFieldDecorator('industry', {
                  rules: [
                    {
                      max: 20,
                      message: formatMessage({ id: 'test.max.long.twenty' }),
                    },
                  ],
                })(<Input placeholder={formatMessage({ id: 'customer.operate.industry-message' })} />)}
              </FormItem>
            </Col>
            <Col {...leftImg}>
              <FormItem label={formatMessage({ id: 'customer.operate.contract-no' })}>
                {getFieldDecorator('contractNo', {
                  rules: [
                    {
                      max: 100,
                      message: formatMessage({ id: 'test.max.long.one.hundred' }),
                    },
                  ],
                })(<Input placeholder={formatMessage({ id: 'customer.operate.contract-no-text' })} />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col>
              <FormItem label={formatMessage({ id: 'all.remarks' })}>
                {getFieldDecorator('remark', {
                  rules: [
                    {
                      max: 100,
                      message: formatMessage({ id: 'test.max.long.one.hundred' }),
                    },
                  ],
                })(<TextArea rows={5} placeholder={formatMessage({ id: 'customer.operate.remarks-message' })} />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit" size='small' onClick={this.handleCommit.bind(this)}>
                <FormattedMessage id='all.save' />
              </Button>
              <Button style={{ marginLeft: 8 }} size='small' onClick={this.goBack.bind(this)}>
                <FormattedMessage id='all.cancel' />
              </Button>
            </Col>
          </Row>
        </Form>
      </div >
    );
  }
}

export default Form.create()(NewCustomer);
