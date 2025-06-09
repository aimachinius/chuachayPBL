// import { addAccount } from "../../../APIs/account.js";

function checkRegister(event) {
    /*
    private int idAccount;
    private String fullName;-
    private String email;-
    private String password;-
    private String phone;-
    private Date dayOfBirth;-
    private String country;-
    private boolean sex;
    private Timestamp createdAt;
    private Role role;
    */
    event.preventDefault(); // Ngăn chặn hành vi mặc định của nút submit
    const userData = {
        idAccount: null,
        fullName: document.querySelector('.input_name').value,
        dayOfBirth: document.querySelector('.input_dob').value,
        sex: document.querySelector('.input_sex').value === 'male',
        country: document.querySelector('.input_country').value,
        phone: document.querySelector('.input_tel').value,
        email: document.querySelector('.input_email').value,
        password: document.querySelector('.input_password').value,
        createdAt: null,
        role: null
    };
    fetch("http://localhost:8080/account/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    })
        .then(response => {
            if (response.ok) {
                window.location.href = "login.html";
            }
            else {
                alert("Thông tin không hợp lệ hoặc tài khoảng đã tồn tại");
                window.location.href = "register.html";
            }
        })
        .catch(error => {
            alert("Không kết nối được đến server");
        });
}
window.addEventListener("DOMContentLoaded", () => {
    const btn = document.querySelector("#btnRegister");
    if (btn) {
        btn.addEventListener("click", checkRegister);
    }
});