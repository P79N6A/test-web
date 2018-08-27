import React, { Component } from 'react';
import { Modal, Button, Input, Form, Icon, Upload } from 'antd';
import G from '../../../gobal';

const FormItem = Form.Item;

class EquipModal extends Component {
  state = {
    imageUrl: '',
    avatarLoading: false,
  };

  componentWillReceiveProps(nextProps) {
    const { visible, editValue } = nextProps;
    if (this.visible !== visible && !G._.isEqual(this.editValue, editValue)) {
      this.visible = visible;
      this.editValue = editValue;
      if (visible && !G._.isEmpty(editValue)) {
        nextProps.form.setFieldsValue({
          mark: editValue.mark,
        });
      } else {
        nextProps.form.setFieldsValue({
          mark: '',
        });
      }
    }
  }

  //
  okHandle = () => {
    const { form, handleOk } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleOk(fieldsValue);
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
          <Button key="back" onClick={handleCancel}>
            取消
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={this.okHandle}>
            保存
          </Button>,
        ]}
      >
        <FormItem {...formItemLayout} label="备注">
          {getFieldDecorator('mark', {
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
