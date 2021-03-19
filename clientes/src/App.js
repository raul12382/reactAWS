import React from 'react';
import Form from './components/form';
import Api_Facial from "./apiFacial/index";
import "bootstrap/dist/css/bootstrap.min.css";
import { Col } from "antd"
import 'antd/dist/antd.css'
//import Session from "./session/session";
//mport Autocapture from './AutoCaptura/autocapturecamera';

import { 
  BrowserRouter as Router, Route,
} from "react-router-dom";

function App() {
  return (
  /*  <Router>
    <Api_Facial/>
    <Route path="/Form" exact component={Form}/>
    </Router> */
    <Col xs={24}>
      <div  style={{backgroundColor:'#03324B'}}>
      <Router>
       <Api_Facial/>
      <Route path="/Form" exact component={Form}/>
    </Router> 
      </div>
      {/* <footer className="bg-light text-center text-lg-start">
      <div className="text-center p-3" style={{backgroundColor: '#03324B'}}>
        © 2020 Copyright:
        <a className="text-white" href="https://mdbootstrap.com/">MDBootstrap.com</a>
      </div>
      </footer> */}
    </Col>
  );
}

export default App;
