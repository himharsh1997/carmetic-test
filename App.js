import {Card} from 'react-bootstrap';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FacebookLoginButton } from "react-social-login-buttons";
import * as queryString from 'query-string'
import ReactDOM from 'react-dom';
import React from 'react';
import axios from 'axios';
import queryString from 'query-string';

// Class contain config of our app
class AppConfig {
  static FB_APPID = process.env.FB_APPID;
  static FB_APP_SECRET = process.env.FB_APP_SECRET;
  static FB_DEFAULT_REDIRECT_URI = 'https://auth-app-test-01.herokuapp.com/';
  static FB_SCOPE = ['email'];
  static RESP_CODE = 'code';
  static DEFAULT_AUTH_TYPE  = 'rerequest',
  static DEFAULT_FB_DISPLAY = 'popup';
  static FB_DIALOG_URI = 'https://www.facebook.com/v4.0/dialog/oauth';
  static FB_ACCESS_TOKEN_URI = 'https://graph.facebook.com/v4.0/oauth/access_token';
  static HTTP_GET = 'get';
}


// Class to provide FB utility function 
export class FBUtils {

    /**
     * Function to get redirect url to facebook on url
     * this will also contain redirect url back to page
     */
    getLoginUrl(){
        const stringifiedParams = queryString.stringify({
          client_id: AppConfig.FB_APPID,
          redirect_uri: AppConfig.FB_DEFAULT_REDIRECT_URI,
          scope: AppConfig.FB_SCOPE.join(','), // comma seperated string
          response_type: AppConfig.RESP_CODE,
          auth_type: AppConfig.DEFAULT_AUTH_TYPE,
          display: AppConfig.DEFAULT_FB_DISPLAY,
        });
        return `${AppConfig.FB_DIALOG_URI}?${stringifiedParams}`;
    }

    // Async Function will get access token from code get after facebook login success and redirect back to our page
    async getAccessTokenFromCode(code) {
        const { data } = await axios({
          url: AppConfig.FB_ACCESS_TOKEN_URI,
          method: AppConfig.HTTP_GET,
          params: {
            client_id: AppConfig.FB_APPID,
            client_secret: AppConfig.FB_APP_SECRET,
            redirect_uri: AppConfig.FB_DEFAULT_REDIRECT_URI,
            code,
          },
        });
        return data.access_token;
      }
}

const fbUtils = new FBUtils();

// UI Component class
class UIComponent {

// Build Basic component ui for access token not empty
  accessTokenUI(accessToken){
     return `<p style='font-size: 14px;'>My access token: ${accessToken}</p>`
  }
  
  It return common error component ui
  defaultErrorUI(){
    return `<p style='font-size: 25px;'>Something went wrong while getting token</p>`
  }

}

// This class will render component and wholle flow of fb login to get code and then get token from code
class App extends React.Component{

// Initilise component with ui component class
constructor(){
   this.uiComponent = new UIComponent();
}

  // On component mount we will check code in url parm
  // fetch token from fb code
  async componentDidMount(){
    const searchStr  = window.location.search
    const urlParams = queryString.parse(searchStr);
    if(urlParams.code)
     {
       const accessToken = await fbUtils.getAccessTokenFromCode(urlParams.code);
       if(accessToken){
            document.getElementById('my-login-card').innerHTML = this.uiComponent.accessTokenUI(accessToken);
       } else {
        document.getElementById('my-login-card').innerHTML = this.uiComponent.defaultErrorUI();
       }
     }

  }
  
  //This function return app component to get render in dom
  render(){
    return (
      <div className="App">
      <Card id='my-login-card' className="text-center mt-1" bg={'light'}
        key={6} text={ 'dark' } >
       <Card.Text><b>Auth Test Login </b></Card.Text>
       <Card.Body id='my-login-card'>
        <a href={fbUtils.getLoginUrl()}><FacebookLoginButton ></FacebookLoginButton></a>
       </Card.Body>
         </Card>
      </div>
    );
  }
  
}

export default App;

// Function to report web details like performance
const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};


// Below is the code of bootstrap react dom taking root
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
