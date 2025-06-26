const button = document.getElementById("login-button")

function open_layout () {
    window.location.href = "../layout.html"
}

button.addEventListener("click", e => {
    open_layout();
})