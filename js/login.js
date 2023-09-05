/**
 * 验证账号
 */
const loginIdValidator = new Validator('txtLoginId', async (val) => {
  if (val.trim() === '') {
    return '请输入账号';
  }
})
/**
 * 验证密码
 */
const loginPwdValidator = new Validator('txtLoginPwd', async (val) => {
  if (val.trim() === '') {
    return '请输入密码';
  }
})
const form = $('.user-form');
form.onsubmit = async (e) => {
  e.preventDefault();
  const reg = await Validator.validate(loginIdValidator, loginPwdValidator)
  if (!reg) return;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  request({
    url: '/api/user/login',
    method: 'POST',
    data
  }).then(res => {
    if (res.code === 0) {
      if (confirm('登录成功，跳转到首页?')) {
        location.href = './index.html';
      }
    } else {
      loginIdValidator.tips.innerText = '账号或密码错误';
      loginPwdValidator.formItem.value = '';
    }
  })
}