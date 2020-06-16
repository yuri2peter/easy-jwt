# easy-jwt

Generate and parse the URL friendly JWT token.

> easy 系列新作。

## Usage

```javascript
const jwt = require('easy-jwt');

function testSimpleJwt() {
  console.log('\n ------------------- \n Begin simple jwt tests.');
  // Defines a secret
  const secret = 'I am the secret!';
  const payload = 'Hello, world!';
  console.log('payload:', payload);
  // Make a jwt token.
  const token = jwt.sign(payload, secret, 3);
  console.log('token:', token);
  // print: eyJwIjoiSGVsbG8sIHdvcmxkISIsImUiOjE1OTE4NDk3Mzc4OTgsInMiOiI2NDliMjdiMTNlZTAxOGU0YWEyODcxNDY5NTQwMTc5YiJ9

  // Decodes without secret
  const decodedPayload = jwt.decode(token);
  console.log('Decoded Payload:', decodedPayload); // print: Hello, world!
  const decodedBody = jwt.decode(token, true);
  console.log('Decoded Body:\n', decodedBody);
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
}

function testRsaJwt() {
  console.log('\n ------------------- \n Begin RSA jwt tests.');
  // Defines a secret
  const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQDFWnl8fChyKI/Tgo1ILB+IlGr8ZECKnnO8XRDwttBbf5EmG0qV
8gs0aGkh649rb75I+tMu2JSNuVj61CncL/7Ct2kAZ6CZZo1vYgtzhlFnxd4V7Ra+
aIwLZaXT/h3eE+/cFsL4VAJI5wXh4Mq4Vtu7uEjeogAOgXACaIqiFyrk3wIDAQAB
AoGBAKdrunYlqfY2fNUVAqAAdnvaVOxqa+psw4g/d3iNzjJhBRTLwDl2TZUXImEZ
QeEFueqVhoROTa/xVg/r3tshiD/QC71EfmPVBjBQJJIvJUbjtZJ/O+L2WxqzSvqe
wzYaTm6Te3kZeG/cULNMIL+xU7XsUmslbGPAurYmHA1jNKFpAkEA48aUogSv8VFn
R2QuYmilz20LkCzffK2aq2+9iSz1ZjCvo+iuFt71Y3+etWomzcZCuJ5sn0w7lcSx
nqyzCFDspQJBAN3O2VdQF3gua0Q5VHmK9AvsoXLmCfRa1RiKuFOtrtC609RfX4DC
FxDxH09UVu/8Hmdau8t6OFExcBriIYJQwDMCQQCZLjFDDHfuiFo2js8K62mnJ6SB
H0xlIrND2+/RUuTuBov4ZUC+rM7GTUtEodDazhyM4C4Yq0HfJNp25Zm5XALpAkBG
atLpO04YI3R+dkzxQUH1PyyKU6m5X9TjM7cNKcikD4wMkjK5p+S2xjYQc1AeZEYq
vc187dJPRIi4oC3PN1+tAkBuW51/5vBj+zmd73mVcTt28OmSKOX6kU29F0lvEh8I
oHiLOo285vG5ZtmXiY58tAiPVQXa7eU8hPQHTHWa9qp6
-----END RSA PRIVATE KEY-----
  `;
  const publicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDFWnl8fChyKI/Tgo1ILB+IlGr8
ZECKnnO8XRDwttBbf5EmG0qV8gs0aGkh649rb75I+tMu2JSNuVj61CncL/7Ct2kA
Z6CZZo1vYgtzhlFnxd4V7Ra+aIwLZaXT/h3eE+/cFsL4VAJI5wXh4Mq4Vtu7uEje
ogAOgXACaIqiFyrk3wIDAQAB
-----END PUBLIC KEY-----`;

  const payload = 'Hello, world!';
  console.log('payload:', payload);
  // Make a jwt token.
  const token = jwt.signRSA(payload, privateKey, 3);
  console.log('token:', token);
  // print: eyJwIjoiSGVsbG8sIHdvcmxkISIsImUiOjE1OTE4NDk3Mzc4OTgsInMiOiI2NDliMjdiMTNlZTAxOGU0YWEyODcxNDY5NTQwMTc5YiJ9

  // Decodes without secret
  const decodedPayload = jwt.decode(token);
  console.log('Decoded Payload:', decodedPayload); // print: Hello, world!
  const decodedBody = jwt.decode(token, true);
  console.log('Decoded Body:\n', decodedBody);
  // print: { p:'Hello, world!', e:1591849737898 ,s:'649b27b13ee018e4aa2871469540179b' }

  // Verifies
  console.log(
    'Verifies with wrong secret:',
    jwt.verifyRSA(token, 'I am the wrong secret!'),
  );
  // print: Verify with wrong secret: false

  console.log('Verifies immediately:', jwt.verifyRSA(token, publicKey));
  // print: Verify immediately: true

  setTimeout(() => {
    console.log('Verifies after 4s:', jwt.verifyRSA(token, publicKey));
    // print: Verify after 4s: false
  }, 4000);
}

function main() {
  setTimeout(() => {
    testSimpleJwt();
  }, 0);
  setTimeout(() => {
    testRsaJwt();
  }, 5000);
}

main();
```

## API

```javascript
// md5函数
function md5(text)

/**
 * 生成简单加密jwt
 * @param {*} payload 数据
 * @param {string} secret 密钥，推荐长度不小于16
 * @param {number} expiresIn 有效期，单位秒。如3600表示该token在一小时后过期
 * @returns {string} token
 */
function sign(payload, secret, expiresIn = 600)

/**
 * 验证简单加密jwtToken是否合法
 * @param {string} token jwtToken
 * @param {string} secret 密钥
 * @returns {boolean}
 */
function verify(token, secret)

/**
 * 生成RSA加密jwt
 * @param {*} payload 数据
 * @param {string} privateKey 私钥
 * @param {number} expiresIn 有效期，单位秒。如3600表示该token在一小时后过期
 * @returns {string} token
 */
function signRSA(payload, privateKey, expiresIn = 600)

/**
 * 验证RSA jwtToken是否合法
 * @param {string} token jwtToken
 * @param {string} publicKey 公钥
 * @returns {boolean}
 */
function verifyRSA(token, publicKey)

/**
 * 解码jwtToken（无须密钥）
 * @param {string} token jwtToken
 * @param {boolean} complete 是否返回完整的jwt构造对象，可以查看过期时间。默认false。
 * @returns {any | object<{  payload, expires, signature }>}
 */
function decode(token, complete = false)


```
