import * as AuthSession from 'expo-auth-session';

export const auth = () => {
  const authUrl = "https://qa.sz.chat/saml2/azure-jonas/login";
  return AuthSession.startAsync({
    authUrl,
    returnUrl: "pocsaml://auth/saml",
  });
};
