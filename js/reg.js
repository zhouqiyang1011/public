/**
 * 验证账号
 */
const loginIdValidator = new Validator('txtLoginId', async (val) => {
  if (val.trim() === '') {
    return '请输入账号';
  }
  const res = await request({url: `/api/user/exists?loginId=${val}`})
  if (res.data) {
    return '该账号已存在';
  }
})
/**
 * 验证昵称
 */
const nicknameValidator = new Validator('txtNickname', async (val) => {
  if (val.trim() === '') {
    return '请输入昵称';
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
/**
 * 确认密码
 */
const confirmPwdValidator = new Validator('txtLoginPwdConfirm', async (val) => {
  if (val.trim() === '') {
    return '请输入确认密码';
  }
  if (val !== loginPwdValidator.formItem.value) {
    return '两次密码输入不一致';
  }
})
const form = $('.user-form')
form.onsubmit = async (e) => {
  e.preventDefault();
  const reg = await Validator.validate(loginIdValidator, nicknameValidator, loginPwdValidator, confirmPwdValidator)
  if (!reg) return;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  request({
    url: '/api/user/reg',
    method: 'POST',
    data
  }).then(() => {
    if (confirm('注册成功，跳转到登录页?')) {
      location.href = './login.html';
    }
  })
}