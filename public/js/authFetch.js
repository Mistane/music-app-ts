const tryAuthFetch = async (url, options = {}) => {
  const res = await fetch(url, options);
  console.log(options);
  if (res.status === 401 || res.status === 403) {
    console.log("uh oh het han token roi");
    const response = await fetch("/users/token/refresh", { method: "post" });
    if (response.status === 401 || response.status === 403) {
      console.log("REFRESH TOKEN HET HAN");
      return { error: "REQUIRE_LOGIN" };
    } else {
      const data = await response.json();
      const newAccessToken = data.accessToken;
      localStorage.setItem("token", newAccessToken);
      console.log("ACCESS TOKEN MOI : " + newAccessToken);
      return tryAuthFetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${newAccessToken}`,
        },
      });
    }
  }

  return await res.json();
};

const authFetch = async (url, options) => {
  const data = await tryAuthFetch(url, options);
  return data;
};

export default authFetch;
