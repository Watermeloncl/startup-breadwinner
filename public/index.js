function login() {
    localStorage.setItem("userName", document.querySelector("#playerName").value);
    window.location.href = "home.html";
}

function keyPressed(e) {
  if(e.code == "NumpadEnter" || e.code == "Enter") {
    if(document.activeElement.id == "playerName") {
      login();
    }
	}
}

document.addEventListener("keydown", e => keyPressed(e));