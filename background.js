function modifyCookies(cookieNames) {
  return new Promise((resolve) => {
    let modified = false;
    chrome.cookies.getAll({ domain: 'bilibili.com' }, function(cookies) {
      let promises = [];
      for (let cookie of cookies) {
        if (cookieNames.includes(cookie.name)) {
          let newCookie = {
            url: `https://bilibili.com`,
            name: cookie.name,
            value: cookie.value,
            domain: 'bilibili.com',
            path: cookie.path,
            secure: true,
			//Partitioned: true,
            httpOnly: cookie.httpOnly,
            sameSite: "no_restriction",
            expirationDate: cookie.expirationDate
          };

          let promise = new Promise((resolve) => {
            chrome.cookies.set(newCookie, () => {
              if (chrome.runtime.lastError) {
                console.error(`Error setting cookie:`, chrome.runtime.lastError);
              } else {
                console.log(`Cookie ${newCookie.name} set successfully.`);
                modified = true;
              }
              resolve();
            });
          });
          promises.push(promise);
        }
      }

      // Wait for all cookie set operations to complete
      Promise.all(promises).then(() => {
        resolve(modified);
      });
    });
  });
}

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'modifyCookies') {
    modifyCookies(['bili_jct', 'DedeUserID', 'DedeUserID__ckMd5', 'SESSDATA']).then((success) => {
      sendResponse({ success: success });
    });
    return true; // Indicate that the response will be sent asynchronously
  }
});
