import { UserManager, UserManagerSettings, WebStorageStateStore } from "oidc-client-ts";

const userStore = new WebStorageStateStore({
  store: window.localStorage
})

const oidcSettings: UserManagerSettings = {
  authority: "http://localhost:8080/realms/rookie-shop",
  client_id: "rookie-shop-back-office-spa",
  redirect_uri: "http://localhost:5173/callback",
  response_type: "code",
  scope: "openid profile",
  post_logout_redirect_uri: "http://localhost:5173/",
  loadUserInfo: true,
  userStore: userStore,
  automaticSilentRenew: true
};

var userManager = new UserManager(oidcSettings);

export default userManager;