import React from 'react';
import {Switch, Route} from 'react-router';
import {connect} from 'react-redux';

// content components
import SettingsContainer from './SettingsContainer';
import Login from '../authentication/Login';

const ConnectedSwitch = connect(state => ({
    location: state.routing.location
}))(Switch);

const AppContent = ({location, error}) => (
    <div className="all-wrapper">
        <div className="main-content">
            <ConnectedSwitch>
                <Route path='/login' component={Login}/>
                <Route path='/' component={SettingsContainer}/>
                
            </ConnectedSwitch>
        </div>
    </div>
);

const ApplicationContainer = () => (
    <div className="component-app">
        <AppContent/>
    </div>
);


/*
const ApplicationContainer = () => (
    <div className="component-app">
        <HeaderContainer/>
        <AppContent/>
    </div>
);
*/
const mapStateToProps = state => ({
    message: "state.messageReducer.haveMessage"
});

export default connect(mapStateToProps)(ApplicationContainer);