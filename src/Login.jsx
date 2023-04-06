import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const navigate = useNavigate();

  async function login() {
    const username = document.querySelector('#playerName').value;
    const password = document.querySelector('#playerPassword').value;
  
    if(username !== "" && password !== "") {
      const errMsg = document.querySelector('#errorMessage');
      errMsg.style.setProperty("display", "flex");
      errMsg.textContent = "Loading...";
  
      const response = await fetch(`/api/auth/login`, {
        method: 'post',
        body: JSON.stringify({ username: username, password: password }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
  
      console.log("hello world!");
      const body = await response.json();
      console.log("response status: " + response.status);
  
      if (response.status === 200) {
        localStorage.setItem("username", username);
        navigate('/home');
      } else {
        const errMsg = document.querySelector('#errorMessage');
        errMsg.style.setProperty("display", "flex");
        errMsg.textContent = body.msg;
      }
    }
  }
  
  async function register() {
    const username = document.querySelector('#playerName').value;
    const password = document.querySelector('#playerPassword').value;
  
    if(username !== "" && password !== "") {
      const errMsg = document.querySelector('#errorMessage');
      errMsg.style.setProperty("display", "flex");
      errMsg.textContent = "Loading...";
  
      const response = await fetch(`/api/auth/createUser`, {
        method: 'post',
        body: JSON.stringify({ username: username, password: password }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        }
      });
  
      const body = await response.json();
  
      if(response?.status === 201) {
        localStorage.setItem("username", username);
        navigate('/home');
      } else {
        const errMsg = document.querySelector('#errorMessage');
        errMsg.style.setProperty("display", "flex");
        errMsg.textContent = body.msg;
      }
    }
  }
  
  function keyPressed(e) {
    if(e.code === "NumpadEnter" || e.code === "Enter") {
      if(document.activeElement.id === "playerName" || document.activeElement.id === "playerPassword") {
        login();
      }
    }
  }
  
  document.addEventListener("keydown", e => keyPressed(e));

  return (
    <main>
      <div id="indexTopMenu" className="topMenu">
        <div id="indexMainTitle" className="mainTitle">Breadwinner!</div>
        <div id="formContainer">
          <input type="text" id="playerName" className="loginInputs" placeholder="Your name here" maxLength="15" />
          <input type="text" id="playerPassword" className="loginInputs" placeholder="Password" maxLength="15" />
          <div id="authButtons">
            <button id="loginButton" type="submit" className="loginButtons" onClick={login}>Login</button>
            <button id="registerButton" type="submit" className="loginButtons" onClick={register}>Register</button>
          </div>
        </div>
        <div>
        </div>
      </div>
      <div id="errorMessage">User already exists!</div>
    </main>
  );
}