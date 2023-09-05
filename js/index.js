(async function () {
  const res = await request({url: '/api/user/profile'});
  const userInfo = res.data;
  const doms = {
    nickname: $('#nickname'),
    loginId: $('#loginId'),
    chatContainer: $('.chat-container'),
    msgContainer: $('.msg-container'),
    txtMsg: $('#txtMsg'),
    close: $('.close')
  }
  setUserInfo();
  function setUserInfo() {
    doms.nickname.innerText = userInfo.nickname;
    doms.loginId.innerText = userInfo.loginId;
  }
  doms.close.onclick = () => {
    if (confirm('确认退出吗？')) {
      localStorage.removeItem('token');
      location.href = './login.html';
    }
  }
  getHistory();
  /**
   * 获取历史记录
   */
  async function getHistory() {
    const res = await request({url: '/api/chat/history'});
    console.log(res);
    if (res.data.length === 0) {
      doms.chatContainer.innerHTML = '暂无数据~';
    } else{
      for (const item of res.data) {
        addItem(item);
      }
    }
  }
  /**
   * 添加一条聊天
   * @param {Object} msgInfo 聊天信息
   */
  function addItem(msgInfo) {
    const isMe = !!msgInfo.from
    const html = `<div class="chat-item ${isMe ? 'me' : ''}">
      <img class="chat-avatar" src="${isMe ? './asset/avatar.png' : './asset/robot-avatar.jpg'}" />
      <div class="chat-content">${msgInfo.content}</div>
      <div class="chat-date">${formatTime(msgInfo.createdAt)}</div>
    </div>`;
    doms.chatContainer.insertAdjacentHTML('beforeend', html);
    doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
  }
  /**
   * 发送消息事件
   */
  doms.msgContainer.onsubmit = function (e) {
    e.preventDefault();
    sendChat();
  };
  async function sendChat() {
    const content = doms.txtMsg.value.trim();
    if (!content) return;
    addItem({
      from: userInfo.loginId,
      to: null,
      createdAt: Date.now(),
      content,
    });
    doms.txtMsg.value = '';
    const resp = await request({
      url: '/api/chat',
      method: 'POST',
      data: { content }
    })
    addItem({
      from: null,
      to: userInfo.loginId,
      ...resp.data,
    });
  }
})()