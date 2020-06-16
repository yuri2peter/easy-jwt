const base64url = require('base64url');
const crypto = require('crypto');

function md5(text) {
  return crypto
    .createHash('md5')
    .update(text)
    .digest('hex');
}

function getTime() {
  return new Date().getTime();
}

/**
 * 对称加密
 * @param {*} payload 数据
 * @param {string} secret 密钥，推荐长度不小于16
 * @param {number} expiresIn 有效期，单位秒。如3600表示该token在一小时后过期
 * @returns {string} token
 */
function sign(payload, secret, expiresIn = 600) {
  const expires = getTime() + expiresIn * 1000;
  const signature = md5(JSON.stringify({ payload, expires, secret }));
  const body = {
    p: payload,
    e: expires,
    s: signature,
  };
  return base64url(JSON.stringify(body));
}

/**
 * 非对称加密
 * @param {*} payload 数据
 * @param {string} privateKey 私钥
 * @param {number} expiresIn 有效期，单位秒。如3600表示该token在一小时后过期
 * @returns {string} token
 */
function signRSA(payload, privateKey, expiresIn = 600) {
  const expires = getTime() + expiresIn * 1000;
  const hash = md5(JSON.stringify({ payload, expires }));
  const signature = crypto.privateEncrypt(privateKey, Buffer.from(hash));
  const body = {
    p: payload,
    e: expires,
    s: base64url(signature),
  };
  return base64url(JSON.stringify(body));
}

/**
 * 解码jwtToken（无须密钥）
 * @param {string} token jwtToken
 * @param {boolean} complete 是否返回完整的jwt构造对象，可以查看过期时间。默认false。
 * @returns {any | object<{  payload, expires, signature }>}
 */
function decode(token, complete = false) {
  const bodyStr = base64url.decode(token);
  const body = JSON.parse(bodyStr);
  return complete ? body : body.p;
}

/**
 * 验证jwtToken是否合法
 * @param {string} token jwtToken
 * @param {string} secret 密钥
 * @returns {boolean}
 */
function verify(token, secret) {
  try {
    const { p: payload, e: expires, s: signature } = decode(token, true);
    if (expires < getTime()) {
      return false;
    }
    const rightSignature = md5(JSON.stringify({ payload, expires, secret }));
    return rightSignature === signature;
  } catch (error) {
    return false;
  }
}

/**
 * 验证RSA jwtToken是否合法
 * @param {string} token jwtToken
 * @param {string} publicKey 公钥
 * @returns {boolean}
 */
function verifyRSA(token, publicKey) {
  try {
    const { p: payload, e: expires, s: signature } = decode(token, true);
    if (expires < getTime()) {
      return false;
    }
    const hash = md5(JSON.stringify({ payload, expires }));
    const computedHash = crypto.publicDecrypt(
      publicKey,
      base64url.toBuffer(signature),
    );
    return hash === computedHash.toString();
  } catch (error) {
    return false;
  }
}

const jwt = {
  sign,
  decode,
  verify,
  md5,
  verifyRSA,
  signRSA,
};

module.exports = jwt;
