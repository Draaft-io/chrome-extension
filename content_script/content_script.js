const domSel = require("dom-selection")

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.method === "getSelection") {
    const data = domSel.getHTML()
    sendResponse({ data })
  } else {
    sendResponse({})
  }
})

document.onselectionchange = () => {
  if (domSel.getHTML() && domSel.getHTML().length > 0) {
    chrome.runtime.sendMessage({ selection: true })
  } else {
    chrome.runtime.sendMessage({ selection: false })
  }
}
