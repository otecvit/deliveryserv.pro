import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Tooltip, Icon, Badge } from 'antd'

class HeaderStatus extends Component {
    
    render() {
        const IconFont = Icon.createFromIconfontCN({
            scriptUrl: this.props.optionapp[0].scriptIconUrl,
          });

        return (
            <Fragment>
                <Badge status="success"><IconFont type="icon-user" style={{ fontSize: "20px" }}/></Badge>
                <Tooltip placement="bottomRight" title={this.props.optionapp[0].statusCloud ? "Соединение установлено" : "Проверьте подключение к сети"}>
                    <Badge status={this.props.optionapp[0].statusCloud ? "success" : "error" }>
                        <IconFont type="icon-cloudcomputing" style={{ fontSize: "20px", marginLeft: "6px" }}/>
                    </Badge>
                </Tooltip>
            </Fragment>
            );
    }

}

export default connect (
    state => ({
      optionapp: state.optionapp,
    })
  )(HeaderStatus);