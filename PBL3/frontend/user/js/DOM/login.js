
function checkLogin() {
    const loginData = {
        email: document.getElementById("username").value,
        password: document.getElementById("password").value
    }
    fetch("http://localhost:8080/account/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
    })
        .then(response => {
            if (response.ok) {
                // sessionStorage.setItem("username", response.email);
                alert("Đăng nhập thành công");
                window.location.href = "timChuyenBay.html";
            }
            else {
                alert("Sai thông tin đăng nhập");
                window.location.href = "login.html";
            }
        })
        .catch(error => {
            alert("Không kết nối được đến server");
        })
}
window.addEventListener("DOMContentLoaded", () => {
    const btn = document.querySelector("#btnLogin");
    if (btn) {
        btn.addEventListener("click", checkLogin);
    }
});
