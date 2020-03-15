import React from "react";
import {Router,Route,hashHistory,IndexRedirect} from "react-router";
import App from "./app";
import FileManagePage from "./filemanage_page";

export default class AppLayout extends React.Component{
    handleOnEnter(){
    }
    render(){
        return(
            <Router history={hashHistory} >
                <Route path="/" component={App}>
                    <IndexRedirect to="/filemanage" ></IndexRedirect>
                    {/*
                    <Route path="/examination/:eid/enrollment" component={ExamEnrollmentPage} onEnter={this.handleOnEnter}></Route>
                    <Route path="/userenrollment" component={EnrollmentPage} onEnter={this.handleOnEnter}></Route>
                    */}
                    <Route path="/filemanage" component={FileManagePage} onEnter={this.handleOnEnter}></Route>

                    {/*
                    <Route path="/account" component={AccountPage} onEnter={this.handleOnEnter}></Route>
                    <Route path="/personal" component={PersonalPage} onEnter={this.handleOnEnter}></Route>
                    */}
                </Route>
            </Router>
        );
    }
}

