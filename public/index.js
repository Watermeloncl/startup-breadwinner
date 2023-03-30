async function login() {
  const username = document.querySelector('#playerName').value;
  const password = document.querySelector('#playerPassword').value;

  if(username != "" && password != "") {
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

    if (response.status == 200) {
      localStorage.setItem("username", username);
      window.location.href = 'home.html';
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

  if(username != "" && password != "") {
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
      window.location.href = "home.html";
    } else {
      const errMsg = document.querySelector('#errorMessage');
      errMsg.style.setProperty("display", "flex");
      errMsg.textContent = body.msg;
    }
  }
}

function keyPressed(e) {
  if(e.code == "NumpadEnter" || e.code == "Enter") {
    if(document.activeElement.id == "playerName" || document.activeElement.id == "playerPassword") {
      login();
    }
	}
}

document.addEventListener("keydown", e => keyPressed(e));