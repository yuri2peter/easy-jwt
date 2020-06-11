# easy-jwt

Generate and parse the URL friendly JWT token.

> easy 系列新作。

## Usage

```javascript
const jwt = require('easy-jwt');

// Defines a secret
const secret = 'I am the secret!';

// Make a jwt token.
const token = jwt.sign('Hello, world!', secret, 3); // expired after 3s
console.log(token);
// print: eyJwIjoiSGVsbG8sIHdvcmxkISIsImUiOjE1OTE4NDk3Mzc4OTgsInMiOiI2NDliMjdiMTNlZTAxOGU0YWEyODcxNDY5NTQwMTc5YiJ9

// Decodes without secret
const payload = jwt.decode(token);
const body = jwt.decode(token, true);
console.log(payload);
// print: Hello, world!
console.log(body);
// print: { p:'Hello, world!', e:1591849737898 ,s:'649b27b13ee018e4aa2871469540179b' }

// Verifies
console.log(
  'Verifies with wrong secret:',
  jwt.verify(token, 'I am the wrong secret!'),
);
// print: Verify with wrong secret: false

console.log('Verifies immediately:', jwt.verify(token, secret));
// print: Verify immediately: true

setTimeout(() => {
  console.log('Verifies after 4s:', jwt.verify(token, secret));
  // print: Verify after 4s: false
}, 4000);
```

## API

```javascript
// md5函数
function md5(text)

/**
 *
 * @param {*} payload 数据
 * @param {string} secret 密钥，推荐长度不小于16
 * @param {number} expiresIn 有效期，单位秒。如3600表示该token在一小时后过期
 * @returns {string} token
 */
function sign(payload, secret, expiresIn = 600)

/**
 * 解码jwtToken（无须密钥）
 * @param {string} token jwtToken
 * @param {boolean} complete 是否返回完整的jwt构造对象，可以查看过期时间。默认false。
 * @returns {object<{  payload, expires, signature }>}
 */
function decode(token, complete = false)

/**
 * 验证jwtToken是否合法
 * @param {string} token jwtToken
 * @param {string} secret 密钥
 * @returns {boolean}
 */
function verify(token, secret)
```
