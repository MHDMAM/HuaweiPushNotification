const HttpClient = require('../utils/api-request.js').HttpClient;
const ENDPOINT = "https://login.cloud.huawei.com/oauth2/v2/token";

module.exports = class AuthClient {
  /**
   * Authorization constructor:
   * @param {appConfig} config HTTP request to be sent.
   *        authUrl:    Optional Huawie oauth2 url, Default use ENDPOINT
   *        appSecret:  App secret from Huawei developer console
   *        appId:      App ID from Huawei developer console
   *
   */
  constructor(appConfig) {
    this._config = appConfig;
    this._httpClient = new HttpClient();
  }

  get httpClient() {
    return this._httpClient;
  }

  async refreshToken() {
    let config = this._config;
    let option = {
      uri: config.authUrl ? config.authUrl : ENDPOINT,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      form: {
        grant_type: "client_credentials",
        client_secret: config.appSecret,
        client_id: config.appId
      },
      method: 'POST',
      json: true,
    }

    return this._httpClient.sendWithRetry(option).then(resp => {
      this._token_type = resp.token_type;
      this._token = resp.access_token;
      this._expiry = resp.expires_in;
      return {
        token: this._token,
        expiry: this._expiry
      };
    });
  }

}