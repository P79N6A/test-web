import React, { Component } from 'react';
import { Modal, Button, Input, Form } from 'antd';
import G from '@/global';

const FormItem = Form.Item;

class EquipModal extends Component {
  componentWillReceiveProps(nextProps) {
    const { visible, editValue } = nextProps;
    if (this.visible !== visible && !G._.isEqual(this.editValue, editValue)) {
      this.visible = visible;
      this.editValue = editValue;
      if (visible && !G._.isEmpty(editValue)) {
        nextProps.form.setFieldsValue({
          remark: editValue.remark,
        });
      } else {
        nextProps.form.setFieldsValue({
          remark: '',
        });
      }
    }
  }

  okHandle = () => {
    const { form, handleOk, editValue } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleOk({ ...fieldsValue, remark: fieldsValue.remark || '' }, editValue.id);
    });
  };

  render() {
    const { visible, loading, handleCancel, form } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <Modal
        visible={visible}
        title="备注"
        onOk={this.okHandle}
        onCancel={handleCancel}
        footer={[
          <Button key="back" size='small' onClick={handleCancel}>
            取消
          </Button>,
          <Button key="submit" size='small' type="primary" loading={loading} onClick={this.okHandle}>
            保存
          </Button>,
        ]}
      >
        <FormItem {...formItemLayout} label="备注">
          {getFieldDecorator('remark', {
            rules: [
              {
                max: 100,
                message: '最大长度100',
              },
            ],
          })(<Input placeholder="请输入备注信息" />)}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create()(EquipModal);
