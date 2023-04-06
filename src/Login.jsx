import React from 'react';

export function Login() {
  return (
    <main>
      <div id="indexTopMenu" className="topMenu">
        <div id="indexMainTitle" className="mainTitle">Breadwinner!</div>
        <div id="formContainer">
          <input type="text" id="playerName" className="loginInputs" placeholder="Your name here" maxlength="15" />
          <input type="text" id="playerPassword" className="loginInputs" placeholder="Password" maxlength="15" />
          <div id="authButtons">
            <button id="loginButton" type="submit" className="loginButtons" onclick="login()">Login</button>
            <button id="registerButton" type="submit" className="loginButtons" onclick="register()">Register</button>
          </div>
        </div>
        <div>
        </div>
      </div>
      <div id="errorMessage">User already exists!</div>
    </main>
  );
}