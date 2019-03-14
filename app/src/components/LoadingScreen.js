import React from 'react'
import { Spin } from 'antd'

function LoadingScreen()  {
    return (
        <div className="bg-LoadingScreen">
            <div className="centered-spinner">
                <Spin />
            </div>
        </div>);
}


export default LoadingScreen;
