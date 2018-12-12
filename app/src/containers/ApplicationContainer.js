import React from 'react';
import {Switch, Route} from 'react-router';
import {connect} from 'react-redux';

// content components
import CmsContainer from './CmsContainer';
import Login from '../authentication/Login';
import Registration from '../authentication/Registration';

const ConnectedSwitch = connect(state => ({
    location: state.routing.location
}))(Switch);

const AppContent = ({location, error}) => (
    <div className="all-wrapper">
        <div className="main-content">
            <ConnectedSwitch>
                <Route exact path="/login" component={Login}/>
                <Route exact path="/register" component={Registration}/>
                <Route path='/' component={CmsContainer}/>
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