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

//-------------------audio aplayer----------------------
const apContainer = document.querySelector("#aplayer");
if (apContainer) {
  const dataContainer = document.querySelector(".inner-data");
  const data = JSON.parse(dataContainer.getAttribute("data-song"));
  const dataSinger = JSON.parse(dataContainer.getAttribute("data-singerInfo"));
  console.log(dataSinger);
  const ap = new APlayer({
    container: apContainer,
    autoplay: true,
    loop: "all",
    audio: [
      {
        name: `${data.title}`,
        artist: `${dataSinger.fullName}`,
        url: `${data.audio}`,
        cover: `${data.avatar}`,
      },
    ],
  });
  const avatarSpin = document.querySelector(".inner-avatar");
  ap.on("play", () => {
    avatarSpin.style.animationPlayState = "running";
  });
  ap.on("pause", () => {
    avatarSpin.style.animationPlayState = "paused";
  });
}

//-----------Like feature------------------------------------
const btnLike = document.querySelector(".btn-like");
if (btnLike) {
  btnLike.addEventListener("click", async (e) => {
    const parentElement = btnLike.closest(".inner-action");
    const checkContain = parentElement.classList.contains("yes");
    let type = "yes";
    if (checkContain == true) type = "no";
    console.log(type);
    const songId = btnLike.getAttribute("data-id");
    const res = await authFetch(`/songs/like/${type}/${songId}`);
    if (res.error === "REQUIRE_LOGIN") {
      document
        .querySelectorAll("[msg-display]")
        .forEach((msg) => (msg.innerText = ""));
      const msgDisplay = parentElement.querySelector("[msg-display]");
      msgDisplay.innerText = "Ban can log in de su dung tinh nang";
      console.log("data tra ve : " + res);
    } else {
      const likeField = parentElement.querySelector("span");
      const newLikeCount = res.newLikeCount;
      likeField.textContent = `${newLikeCount} Thích`;
      parentElement.classList.toggle("yes");
    }
  });
}

const btnFavorite = document.querySelector(".btn-favorite");
if (btnFavorite) {
  btnFavorite.addEventListener("click", async (e) => {
    console.log("HELLo");
    const parentElement = btnFavorite.closest(".inner-action");
    const songId = btnFavorite.getAttribute("data-id");
    const checkContain = parentElement.classList.contains("yes");
    let type = "yes";
    if (checkContain == true) type = "no";
    const res = await authFetch(`/songs/favorite/${type}/${songId}`);
    if (res.error === "REQUIRE_LOGIN") {
      document
        .querySelectorAll("[msg-display]")
        .forEach((msg) => (msg.innerText = ""));
      const msgDisplay = parentElement.querySelector("[msg-display]");
      msgDisplay.innerText = "Ban can log in de su dung tinh nang";
      console.log("data tra ve : " + res);
    } else {
      parentElement.classList.toggle("yes");
    }
  });
}
// -----------------------------------------------------------
const btn = document.querySelector("[test-btn]");
if (btn) {
  btn.addEventListener("click", async (e) => {
    const token = localStorage.getItem("token");
    if (!token) window.location.href = "/users/login";
    else {
      const data = await authFetch("/test", {
        headers: {
          "Content-Type": "application/json",
          authorization: `bearer ${token}`,
        },
      });
      if (data.error === "REQUIRE_LOGIN") {
        window.location.href = "/users/login";
      }
      console.log("Data tra ve khi fetch: " + data);
    }
  });
}
