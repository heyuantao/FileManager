import React from "react";
import {Router,Route,hashHistory,IndexRedirect} from "react-router";
import {connect} from "react-redux";
//import * as NavActionCreator from "./common/store/NavActionCreator";
import LoginPage from "./login_page";
import HomePage from "./home_page";
import App from "./app";

class AppLayout extends React.Component{
    handleOnEnter(next,replace){
        {/*
        const location = next.location;
        if(location.action==="POP") {
            if (location.pathname.includes("/help")) {
                this.props.changeNav(fromJS(["help"]));
                return;
            }
            if (location.pathname.includes("/query")) {
                this.props.changeNav(fromJS(["query"]));
                return;
            }
            if (location.pathname.includes("/login")) {
                this.props.changeNav(fromJS(["login"]));
                return;
            }
            if (location.pathname.includes("/registration")) {
                this.props.changeNav(fromJS(["login"]));
                return;
            }
        }
        */}
    }
    render(){
        return(
            <Router history={hashHistory} >
                <Route path="/" component={App}>

                    <IndexRedirect to="/home" ></IndexRedirect>
                    <Route path="/login" component={LoginPage} onEnter={(s,r)=>(this.handleOnEnter(s,r))}></Route>
                    <Route path="/home" component={HomePage} onEnter={(s,r)=>(this.handleOnEnter(s,r))}></Route>
                    <Route path="/*" component={HomePage} onEnter={(s,r)=>(this.handleOnEnter(s,r))}></Route>
                    {/*
                    <Route path="/help" component={HelpPage} onEnter={(s,r)=>(this.handleOnEnter(s,r))}></Route>
                    <Route path="/query" component={QueryPage} onEnter={(s,r)=>(this.handleOnEnter(s,r))} ></Route>


                    <Route path="/registration" component={RegistrationPage} onEnter={(s,r)=>(this.handleOnEnter(s,r))}></Route>
                    <Route path="/forgetpassword" component={ForgetPasswordPage} onEnter={(s,r)=>(this.handleOnEnter(s,r))}></Route>
                    <Route path="/resetpassword/:token" component={ResetPasswordPage} onEnter={(s,r)=>(this.handleOnEnter(s,r))}></Route>

                    <Route path="/activeaccount/:token" component={ActiveAccountPage} onEnter={(s,r)=>(this.handleOnEnter(s,r))}></Route>


                    */}
                </Route>
            </Router>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
    }
}

export default connect(null,mapDispatchToProps)(AppLayout)
