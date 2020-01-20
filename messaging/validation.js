const _ = require('lodash');

const PriorityHight = "HIGHT",
  PriorityNormal = "NORMAL",
  PriorityLow = "LOW";

const SytleBigText = 1,
  SytleBigPicture = 2;

const TypeIntent = 1,
  TypeUrl = 2,
  TypeApp = 3,
  TypeRichResource = 4;

const ttlPattern = new RegExp("\\d+|\\d+[sS]|\\d+.\\d{1,9}|\\d+.\\d{1,9}[sS]");
const colorPattern = new RegExp("^#[0-9a-fA-F]{6}$");

exports.validateToken = function validateToken(token) {
  if (!token || _.isNull(token) || _.isUndefined(token)) {
    throw new Error("token must not be null!");
  }
};


exports.validateMessage = function validateMessage(message) {
  if (!message) {
    throw new Error("message must not be null!");
  }
  validateData(message.data);
  validateFieldTarget(message.token, message.topic, message.condition);
  return validateAndroidConfig(message.android);
};

function validateData(data) {
  if (data && _.isObject(data))
    data = JSON.stringify(data);
}

function validateFieldTarget(token, ...params) {
  let count = 0;
  if (token) {
    count++;
  }
  params &&
    params.forEach(pa => {
      if (!_.isEmpty(pa)) {
        count++;
      }
    });
  if (count === 1) {
    return;
  }
  throw new Error("token, topic or condition must be choice one");
}

function validateAndroidConfig(androidConfig) {
  if (!androidConfig) {
    return;
  }
  if (androidConfig.collapse_key < -1 || androidConfig.collapse_key > 100) {
    throw new Error("collapse_key must be in interval [-1 - 100]");
  }

  if (!_.isEmpty(androidConfig.priority) &&
    (androidConfig.priority !== PriorityHight &&
      androidConfig.priority !== PriorityNormal &&
      androidConfig.priority !== PriorityLow)
  ) {
    throw new Error("priority must be 'HIGH', 'LOW' or 'NORMAL'");
  }

  if (!_.isEmpty(androidConfig.ttl) && !ttlPattern.exec(androidConfig.ttl)) {
    throw new Error("malformed ttl");
  }

  // validate android notification
  return validateAndroidNotification(androidConfig.notification);
}


function validateAndroidNotification(notification) {
  if (!notification) {
    return;
  }
  if (_.isEmpty(notification.title)) {
    throw new Error("title must not be empty");
  }

  if (_.isEmpty(notification.body)) {
    throw new Error("body must not be empty");
  }

  switch (notification.style) {
    case SytleBigText:
      if (_.isEmpty(notification.big_title)) {
        throw new Error("big_title must not be empty when style is 1");
      }

      if (_.isEmpty(notification.big_body)) {
        throw new Error("big_body must not be empty when style is 1");
      }
      break;
    case SytleBigPicture:
      if (_.isEmpty(notification.big_picture)) {
        throw new Error("big_picture must not be empty when style is 2");
      }
  }

  if (notification.color && !colorPattern.exec(notification.color)) {
    throw new Error("color must be in the form #RRGGBB");
  }

  // validate click action
  return validateClickAction(notification.click_action);
}

function validateClickAction(clickAction) {
  if (!clickAction) {
    throw new Error("click_action object must not be null");
  }

  switch (clickAction.type) {
    case TypeIntent:
      if (_.isEmpty(clickAction.intent)) {
        throw new Error("intent must not be empty when type is 1");
      }
      break;
    case TypeUrl:
      if (_.isEmpty(clickAction.url)) {
        throw new Error("url must not be empty when type is 2");
      }
      break;
    case TypeApp:
    case TypeRichResource:
      if (_.isEmpty(clickAction.rich_resource)) {
        throw new Error("rich_resource must not be empty when type is 4");
      }
      break;
    default:
      throw new Error("type must be in the interval [1 - 4]");
  }

  return;
}