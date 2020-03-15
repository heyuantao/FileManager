import React from "react";
import {fromJS } from "immutable";
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

export default class App extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            userData: fromJS({}),
        }
    }
    componentDidMount(){
    }
    render(){
        return(
            <div style={{minHeight:"800px"}}>
                {this.props.children}
            </div>
        );
    }
}
