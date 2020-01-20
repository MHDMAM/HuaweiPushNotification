# HuaweiPushNotification
Huawei Push Notification Library 

This library provide:
- pre-checking of request body before calling Huawei service.
- auto renew auth token, just before it expired.

## A Quick Overview


```js
const HPN = require('HuaweiPushNotification').HuaweiPushNotification;
let hpn = new HPN(HpnConfig);
```

### HpnConfig required: 
`appSecret`: Huawei' app secret token.

`appId`: Huawei' app id.

`authUrl`: auth uri if you're in organization that have DMZ to call external-facing services, optional, default uri will used if this value is null

`messagingUrl`: push service uri if you're in organization that have DMZ to call external-facing services, optional, default uri will used if this value is null


### TODO: 
- Enhance this readme.
- Create npm package.
