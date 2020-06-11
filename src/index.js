const base64url = require('base64url');

function md5(text) {
  return require('crypto')
    .createHash('md5')
    .update(text)
    .digest('hex');
}

function getTime() {
  return new Date().getTime();
}

/**
 *
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
 * 解码jwtToken（无须密钥）
 * @param {string} token jwtToken
 * @param {boolean} complete 是否返回完整的jwt构造对象，可以查看过期时间。默认false。
 * @returns {object<{  payload, expires, signature }>}
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
  const { p: payload, e: expires, s: signature } = decode(token, true);
  if (expires < getTime()) {
    return false;
  }
  const rightSignature = md5(JSON.stringify({ payload, expires, secret }));
  return rightSignature === signature;
}

const jwt = {
  sign,
  decode,
  verify,
  md5,
};

module.exports = jwt;
