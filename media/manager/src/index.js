import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import store from "./store"
import AppLayout from "./pages/AppLayout";
import './index.css';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <Provider store={store}>
        <div>
            <AppLayout></AppLayout>
        </div>
    </Provider>, document.getElementById('root'));

