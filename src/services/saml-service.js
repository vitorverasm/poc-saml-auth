import * as AuthSession from 'expo-auth-session';

export const auth = () => {
  const authUrl = "<saml-auth-url>";
  return AuthSession.startAsync({
    authUrl,
    returnUrl: "pocsaml://auth/saml",
  });
};
