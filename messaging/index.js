const HttpClient = require('../utils/api-request.js').HttpClient;
const {
  validateMessage,
  validateToken
} = require('./validation.js');

const ENDPOINT = "https://push-api.cloud.huawei.com/v1";

module.exports.Messaging = class Messaging {

  constructor(msgConfig) {
    this._config = msgConfig;
    this._httpClient = new HttpClient();
  }

  refreshToken(token) {
    validateToken(token);
    this._token = token;
  }

  async send(message, validationOnly = false, dryRun = true) {
    this._message = message;
    validateMessage(this._message);

    let request = {
      validate_only: validationOnly,
      message: this._message
    };

    let option = {};
    option.uri = this._config.messagingUrl ? this._config.messagingUrl :
      `${ENDPOINT}/${this._config.appId}/messages:send`;
    option.headers = {
      "Content-Type": "application/json;charset=utf-8",
      Authorization: `Bearer ${this._token}`
    };

    option.body = request;
    option.method = 'POST';
    option.json = true;

    if (dryRun) {
      return this._httpClient.sendWithRetry(option).then(res => {
        return res.data || res;
      });
    }
    return this._httpClient.send(option).then(res => {
      return res.data || res;

    });
  }

}