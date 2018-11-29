import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Layout, Tabs, Input, Icon, Table, Menu, Dropdown, Form, Select, message, Popconfirm, Modal } from 'antd'


class Stock extends Component {

    render() {

        return <div>Привет</div>
    }
}
export default connect (
    state => ({
        optionSets: state.optionSets,
        optionapp: state.optionapp,
    }),
    dispatch => ({
        onAdd: (data) => {
            dispatch({ type: 'LOAD_OPTION_SETS_ALL', payload: data});
          },
    })
  )(Stock);

