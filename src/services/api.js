import axios from "axios";

const hostname = "https://9d97-2804-7f7-e285-997c-9dc0-dad9-594a-ddd2.ngrok.io";

export const getAuthMethods = async () => {
  try {
    const response = await axios.get(`${hostname}/api/v4/remote-auth-idps`, {
      params: {
        device_token: "testtoken",
        lang: "pt-BR",
        relay_to: "pocsaml://auth/saml",
      },
    });
    if (response.status === 200 && Array.isArray(response.data)) {
      const authMethods = response.data.map((el) => {
        if (el._id && el.short_name && el.auth_url && el.direct_sso_url) {
          return {
            id: el._id,
            title: el.short_name,
            url: el.auth_url,
            directUrl: el.direct_sso_url,
          };
        }
        throw new Error(`Invalid auth method`);
      });
      return authMethods;
    }
    throw new Error(`Error finding the authentication methods`);
  } catch (error) {
    console.log(`[getAuthMethods/error]: ${error.message}`);
  }
};

export const getUserInfo = async (token = "") => {
  try {
    const response = await axios.get(`${hostname}/api/v4/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(`[getUserInfo]`, response.data);
  } catch (error) {
    console.log(`[getUserInfo/error]: ${error.message}`);
  }
};
