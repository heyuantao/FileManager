import React from "react";
import {Router,Route,hashHistory,IndexRedirect} from "react-router";
import App from "./app";
import FileManagePage from "./filemanage_page";
import PasswordResetPage from "./passwordreset_page";

export default class AppLayout extends React.Component{
    handleOnEnter(next,replace){
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
                    <Route path="/filemanage" component={FileManagePage} onEnter={(s,r)=>(this.handleOnEnter(s,r))}></Route>
                    <Route path="/resetpassword" component={PasswordResetPage} onEnter={(s,r)=>(this.handleOnEnter(s,r))}></Route>
                    <Route path="/*" component={FileManagePage} onEnter={(s,r)=>(this.handleOnEnter(s,r))}></Route>
                    {/*
                    <Route path="/personal" component={PersonalPage} onEnter={this.handleOnEnter}></Route>
                    */}
                </Route>
            </Router>
        );
    }
}

