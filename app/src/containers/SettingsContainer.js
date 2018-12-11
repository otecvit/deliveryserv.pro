import React, {Component} from "react";
import { Redirect } from 'react-router';
import {
    Route,
    Link
} from 'react-router-dom'

class SettingsWrapper extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loadingStatus: false,
          };
    }

    render() {
        const { loadingStatus } = this.state;

        if (!loadingStatus)
        {
          return <Redirect to="/login"/>
        }
        
        return (
            <div>
                <ul className="content-menu">
                    <li className="content-menu__item active"><Link to={`/`}>Рабочий стол</Link></li>
                    <li className="content-menu__item active"><Link to={`/invoices`}>Счета</Link></li>
                    <li className="content-menu__item"><Link to={`/meters`}>Показания счётчиков</Link></li>
                    <li className="content-menu__item"><Link to={`/login`}>выход</Link></li>
                </ul>
                <Route exact path={`/`} render={() => <h2>робочий стол</h2>}/>
                <Route path={`/invoices`} render={() => <h2>Invoices</h2>}/>
                <Route path={`/meters`} render={() => <h2>Meters</h2>}/>
            </div>
        )
    }
}

export default SettingsWrapper;