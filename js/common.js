function $(selector) {
  return document.querySelectorAll(selector).length > 1 ? document.querySelectorAll(selector) : document.querySelector(selector);
}
/**
 * 发起请求
 * @param {Object} options 配置对象，eg：{url(必须), method(非必须), 'Content-Type'(非必须), data(非必须)}
 * @returns Promise
 */
async function request(options) {
  const BASE_URL = 'https://study.duyiedu.com';
  const token = localStorage.getItem('token');
  const headers = {}
  const method = options.method ? options.method.toUpperCase() : 'GET';
  if (token) {
    headers.authorization = `Bearer ${token}`;
  }
  if (method === 'POST') {
    headers['Content-Type'] = options['Content-Type'] || 'application/json';
  }
  const resq = await fetch(BASE_URL + options.url, {
    headers,
    method,
    body: method === 'POST' ? JSON.stringify(options.data) : null
  })
  if (resq.status !== 200) {
    alert(resq.statusText);
    return;
  }
  const res = await resq.json();
  if (res.code === 0) {
    const token = resq.headers.get('authorization');
    if (token) {
      localStorage.setItem('token', token);
    }
    return res;
  } else if (res.code === 401) {
    if (confirm(res.msg)) {
      location.href = './login.html';
    }
  } else {
    alert(res.msg);
    return res;
  }
}
/**
 * 验证表单
 */
class Validator {
  /**
   * 构造器
   * @param {String} id 需要校验的表单的id
   * @param {Function} callback 验证规则函数
   */
  constructor(id, callback) {
    this.formItem = $(`#${id}`);
    this.tips = this.formItem.nextElementSibling;
    this.callback = callback;
    this.formItem.onblur = () => {
      this.validateItem();
    }
  }
  /**
   * 验证规则函数
   * @returns 验证结果，true或false
   */
  async validateItem () {
    const err = await this.callback(this.formItem.value);
    if (err) {
      this.tips.innerText = err;
      return false;
    } else {
      this.tips.innerText = '';
      return true;
    }
  }
  /**
   * @param {...*} validators 需要校验的表单的集合
   * 静态方法：批量验证表单
   */
  static async validate(...validators) {
    const proms = validators.map(v => v.validateItem());
    const res = await Promise.all(proms); // 返回proms状态的数组集合
    return res.every(v => v); // 全部为真，即校验都通过时返回true
  }
}
/**
 * 格式化时间
 * @param {Number} time 需要格式化的时间
 */
function formatTime(time) {
  const date = new Date(time);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  const second = date.getSeconds().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}