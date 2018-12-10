import React, { Component } from 'react'
import { Modal, Button } from 'antd'

class Login extends Component {



    render() {

    return (
        <Modal
          title="Vertically centered modal dialog"
          centered
          visible="true"
          onOk={() => {}}
          onCancel={() => {}}
        >
          <p>some contents...</p>
          <p>some contents...</p>
          <p>some contents...</p>
        </Modal>);
    }
}

export default Login