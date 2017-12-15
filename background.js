chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.selection) {
    chrome.browserAction.setIcon({ path: "icon/128_active.png" })
  } else {
    chrome.browserAction.setIcon({ path: "icon/128.png" })
  }
  sendResponse("jo")
})
