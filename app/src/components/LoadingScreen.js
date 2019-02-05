import React, { Component } from 'react'
import { Spin } from 'antd'

class LoadingScreen extends Component {
    render() {
        return (
            <div className="bg-LoadingScreen">
                <div className="centered-spinner">
                    <Spin />
                </div>
            </div>);
    }
}

export default LoadingScreen;
