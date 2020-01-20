const Auth = require('./auth/index.js');
const Messaging = require('./messaging/index.js').Messaging;
const RetryTokenRefresh = 3;

function validateHpnConfig(config) {
  if (!config)
    throw new Error("Huawei Push Notification config is required!");

  if (!config.appSecret)
    throw new Error("appSecret is required!");

  if (!config.appId)
    throw new Error("appId is required!");
}

module.exports.HuaweiPushNotification = class HuaweiPushNotification {
  constructor(HpnConfig) {
    this._config = HpnConfig;

    validateHpnConfig(this._config);

    this._auth = new Auth({
      authUrl: this._config.authUrl,
      appSecret: this._config.appSecret,
      appId: this._config.appId
    });

    this._message = new Messaging({
      messagingUrl: this._config.messagingUrl,
      appId: this._config.appId
    });
    this.refreshToken = this.refreshToken.bind(this);
    this.refreshToken();
  }

  refreshToken() {
    this._WaitForToken = new Promise(async (resolve, reject) => {
      let that = this;
      try {
        that._tokenData = await that._auth.refreshToken();
        /** refresh token 2 mins before expiry. **/
        setTimeout(that.refreshToken, (that._expiry - 120) * 1000);
        that._message.refreshToken(that._tokenData.token);
        that._refreshTokenFail = 0;
        resolve();
      } catch (err) {
        if (that._refreshTokenFail > RetryTokenRefresh)
          throw new Error(err);
        /** refresh after 1 second. **/
        setTimeout(this.refreshToken, 1000);
        that._refreshTokenFail++;
      }
    })
  }

  sendMessage(message) {
    return this._WaitForToken.then(() => {
      return this._message.send(message);
    })
  }

}