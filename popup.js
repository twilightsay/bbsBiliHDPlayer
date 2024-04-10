document.addEventListener('DOMContentLoaded', function() {
  // 为按钮添加点击事件侦听器
  var button = document.getElementById('triggerButton');
  if (button) {
    button.addEventListener('click', function() {
      chrome.runtime.sendMessage({ action: 'modifyCookies' }, function(response) {
        var message = document.createElement('p');
        message.style.fontSize = '10px';
        message.style.position = 'absolute';
        message.style.bottom = '10px';
        message.style.right = '10px';
        message.style.backgroundColor = 'rgba(0,0,0,0.7)';
        message.style.color = 'white';
        message.style.padding = '5px 10px';
        message.style.borderRadius = '5px';
        message.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        message.style.zIndex = '1000';

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          var currentTab = tabs[0];
          if (currentTab.url.includes('bilibili.com')) {
            if (response && response.success) {
              message.innerText = '修改完成！';
            } else {
              message.innerText = '修改失败：这可能是由于您未登录B站或是B站cookie异常造成。';
            }
          } else {
            message.innerText = '请在bilibili网页执行此操作。';
          }
          document.body.appendChild(message);

          // 设置3秒后自动消失
          setTimeout(function() {
            document.body.removeChild(message);
          }, 3000);
        });
      });
    });
  } else {
    console.error('Button not found');
  }
});