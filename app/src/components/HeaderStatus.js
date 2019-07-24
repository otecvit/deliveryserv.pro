import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Tooltip, Icon, Badge } from 'antd'
import { Detector } from "react-detect-offline"
import { parrentDomain } from '../constans'

class HeaderStatus extends Component {
    
    render() {
        const { owner } = this.props;

        const IconFont = Icon.createFromIconfontCN({
            scriptUrl: this.props.optionapp[0].scriptIconUrl,
          });

          return (
            <Fragment>
                <Tooltip placement="bottomRight" title={owner.blStatusCustomer ? `Подписка активна до ${owner.dEndSubscription[2]}.${owner.dEndSubscription[1]}.${owner.dEndSubscription[0]}` : "Подписка закончилась"}>
                    <Badge status={owner.blStatusCustomer ? "success" : "error"}><IconFont type="icon-user" style={{ fontSize: "20px" }}/></Badge>
                </Tooltip>
                <Detector 
                    polling={{ url: parrentDomain }}
                    render={({ online }) => (
                        <Tooltip placement="bottomRight" title={online ? "Соединение установлено" : "Проверьте подключение к сети"}>
                        <Badge status={online ? "success" : "error"}>
                            <IconFont type="icon-cloudcomputing" style={{ fontSize: "20px", marginLeft: "6px" }}/>
                        </Badge>
                        </Tooltip>
                    )}
                />
            </Fragment>
            );
    }

}

export default connect (
    state => ({
      optionapp: state.optionapp,
      owner: state.owner,
    })
  )(HeaderStatus);