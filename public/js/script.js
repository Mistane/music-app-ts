import authFetch from "./authFetch.js";

const formRegister = document.querySelector("#form-register");
if (formRegister) {
  formRegister.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fullNameField = formRegister.querySelector("#fullName");
    const emailField = formRegister.querySelector("#email");
    const passwordField = formRegister.querySelector("#password");
    const displayMessageField = formRegister.querySelector("[msg-display]");

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName: fullNameField.value,
        email: emailField.value,
        password: passwordField.value,
      }),
    };

    const res = await fetch("/users/register", options);
    const data = await res.json();

    if (!res.ok) {
      displayMessageField.style.color = "red";
      displayMessageField.innerText = data.error;
    } else {
      displayMessageField.style.color = "green";
      displayMessageField.innerText = "Dang ki tai khoan thanh cong";
      fullNameField.value = "";
      emailField.value = "";
      passwordField.value = "";
    }

    console.log(data.msg);
  });
}

const formLogin = document.querySelector("#form-login");
if (formLogin) {
  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();
    const emailField = formLogin.querySelector("#email");
    const passwordField = formLogin.querySelector("#password");
    const displayMessageField = formLogin.querySelector("[msg-display]");

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailField.value,
        password: passwordField.value,
      }),
    };

    const res = await fetch("/users/login", options);
    const data = await res.json();

    if (!res.ok) {
      displayMessageField.style.color = "red";
      displayMessageField.innerText = data.error;
    } else {
      console.log(data);
      localStorage.setItem("token", data.accessToken);
      window.location.href = "/topics";
    }
  });
}

// -----------------------------------------------------------
const btn = document.querySelector("[test-btn]");
if (btn) {
  btn.addEventListener("click", async (e) => {
    const token = localStorage.getItem("token");
    const data = await authFetch("/test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `bearer ${token}`,
      },
    });
    console.log("Data tra ve khi fetch: " + data);
  });
}
