import React , { Component } from 'react';
var firebase = require('firebase');


var config = {
    apiKey: "AIzaSyAFlHPwaUjFID83hoZihkXaV6T68oV5C44",
    authDomain: "fir-login-29097.firebaseapp.com",
    databaseURL: "https://fir-login-29097.firebaseio.com",
    projectId: "fir-login-29097",
    storageBucket: "fir-login-29097.appspot.com",
    messagingSenderId: "845144640993"
  };
  firebase.initializeApp(config);

export default class Authen extends Component {
  login(event){
    const email = this.refs.email.value;
    const password = this.refs.password.value;
    //console.log(email, password);

    const auth = firebase.auth();

    const promise = auth.signInWithEmailAndPassword(email, password);

    promise
    .then(user =>{
      var lout = document.getElementById("logout");
      var ver = document.getElementById("verify");

      var err = "GOOD TO SEE YOU AGAIN, " + user.email;
      if(!user.emailVerified){
      ver.classList.remove("hide");}
      lout.classList.remove("hide");
      console.log(user);
      this.setState({err: err});
    });

    promise.catch(e => {
      var err = e.message;
      console.log(err);
      this.setState({err: err});
    });
  }
  signup(){
    const email = this.refs.email.value;
    const password = this.refs.password.value;
    //console.log(email, password);

    const auth = firebase.auth();

    const promise = auth.createUserWithEmailAndPassword(email, password);

    promise
    .then(user => {
      var err ="Welcome " + user.email;
      var ver = document.getElementById("verify");
      if(!user.emailVerified){
      ver.classList.remove("hide");}
      firebase.database().ref('users/'+user.uid).set({
        email : user.email,
      });
      console.log(user);
      this.setState({err: err});
    });
    promise
    .catch(e => {
      var err = e.message;
      console.log(err);
      this.setState({err: err});
    });
  }

  logout(){
    firebase.auth().signOut();
    var lout = document.getElementById("logout");
    var err = "";
    lout.classList.add("hide");
    this.setState({err: err});
  }
  verify(){
    var ver = document.getElementById("verify");
    const authe = firebase.auth().currentUser;
    const promise = authe.sendEmailVerification();

    promise
    .then(user =>{
      var err = 'Email Sent';
      this.setState({err: err});
      ver.classList.add("hide");
  });

    promise
    .catch(e => {
      var err = e.message;
      console.log(err);
      this.setState({err: err});
  });

  }

  google(){
    //console.log("i am in google method");

    var provider = new firebase.auth.GoogleAuthProvider();
    const promise = firebase.auth().signInWithPopup(provider);

    promise.then( result =>{
      var user = result.user;
      console.log(result);
      firebase.database().ref('users/'+user.uid).set({
        email: user.email,
        name: user.displayName,
      });
    });
    promise.catch(e => {
      var msg = e.message;
      console.log(msg);
    });




  }

  constructor(props){
    super(props);

    this.state = {
      err: ''
    };
    this.login = this.login.bind(this);
    this.signup = this.signup.bind(this);
    this.logout = this.logout.bind(this);
    this.verify = this.verify.bind(this);
    this.google = this.google.bind(this);
  }
  render(){
    return(
      <div>
        <input id="email" type="email" ref="email" placeholder="Enter your email"  /><br />
        <input id="pass" type="password" ref="password" placeholder="Enter your password"  /><br />
        <p>{this.state.err}</p>
        <button onClick={this.login}>Log In</button>
        <button onClick={this.signup}>Sign Up</button>
        <button onClick={this.logout} className="hide" id="logout">Log Out</button><br />
        <button onClick={this.verify} className="hide" id="verify">Verify Email</button><br />
        <button onClick={this.google}  id="google" className="google">Sign In With Google</button>
      </div>
    );
  }
}
