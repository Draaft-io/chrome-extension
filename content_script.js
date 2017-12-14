chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.method === "getSelection") {
    sendResponse({ data: window.getSelection().toString() })
  } else {
    sendResponse({})
  }
})
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.method === "getSelection") {
//     sendResponse({ data: window.getSelection().toString() })
//   } else {
//     sendResponse({})
//   }
// })

// // Code inserted into the visited page
// const code = (quote, href, type) => [
//   "var selection = window.getSelection()",
//   "var range = selection.getRangeAt(0)",
//   "var allWithinRangeParent = range.commonAncestorContainer.getElementsByTagName('*')",
//   "var allSelected = []",
//   "var nodes = []",
//   "for (let i = 0, el; el = allWithinRangeParent[i]; i += 1) { if (selection.containsNode(el, true)) { allSelected.push(el) } }",
//   "for (var el of allSelected) { let test = false; for (var el2 of allSelected) { if (el2.contains(el) && el !== el2) { test = true } }; if (!test) nodes.push(el) }",
//   "var html = nodes.map(node => node.outerHTML).join('')",
//   "console.log(html)",
//   "quote = encodeURIComponent(html) || '';",
//   `type = "${type}" || '';`,
//   `href = "${encodeURIComponent(href)}" || location.href;`,
//   "overlay = document.createElement('div');",
//   "overlay.id = 'draaft-overlay';",
//   "var encodeURIComponent = window.encodeURIComponent;",
//   "var link = 'https://beta.draaft.co/bookmark?url=' + href + '&quote=' + quote + '&type=' + type;",
//   "if (!/http/.test(location.protocol)) { window.open(link, 'draaft', 'location=no,menubar=no,resizable=yes,titlebar=yes,toolbar=no,width=480,height=640'); }",
//   "var iframe = document.createElement('iframe');",
//   "iframe.onload = function() { overlay.className = 'loaded'; };",
//   "iframe.onerror = function() { document.body.removeChild(overlay); };",
//   "iframe.src = link;",
//   "var loader = document.createElement('div');",
//   "loader.className = 'loader draaft-icon';",
//   "overlay.appendChild(iframe);",
//   "overlay.appendChild(loader);",
//   "overlay.onclick = function() { if (document.body.hasChildNodes(overlay)) { document.body.removeChild(overlay); } };",
//   "document.body.appendChild(overlay);",
// ].join("\n")
//
// chrome.contextMenus.create({
//   title: "Create draaft element from selection",
//   contexts: [ "selection" ],
//
//   onclick(info, tab) {
//     const url = info.pageUrl
//     const text = info.selectionText
//     chrome.tabs.executeScript(tab.id, { code: code(text, url, "text") })
//   },
// })
//
// chrome.contextMenus.create({
//   type: "checkbox",
//   checked: false,
//   title: "Enable",
//   contexts: [ "browser_action" ],
//   onclick: () => {
//     chrome.browserAction.enable()
//   },
// })
