// Code inserted into the visited page
console.log("1")
const code = (quote, href, type) => [
  `quote = "${encodeURIComponent(quote)}" || "";`,
  `type = "${type}" || '';`,
  `href = "${encodeURIComponent(href)}" || location.href;`,
  "overlay = document.createElement('div');",
  "overlay.id = 'draaft-overlay';",
  "var encodeURIComponent = window.encodeURIComponent;",
  "var link = 'https://alpha.draaft.co/bookmark?url=' + href + '&quote=' + quote + '&type=' + type;",
  "if (!/http/.test(location.protocol)) { window.open(link, 'draaft', 'location=no,menubar=no,resizable=yes,titlebar=yes,toolbar=no,width=480,height=640'); }",
  "var iframe = document.createElement('iframe');",
  "iframe.onload = function() { overlay.className = 'loaded'; };",
  "iframe.onerror = function() { document.body.removeChild(overlay); };",
  "iframe.src = link;",
  "var loader = document.createElement('div');",
  "loader.className = 'loader draaft-icon';",
  "overlay.appendChild(iframe);",
  "overlay.appendChild(loader);",
  "overlay.onclick = function() { if (document.body.hasChildNodes(overlay)) { document.body.removeChild(overlay); } };",
  "document.body.appendChild(overlay);",
].join("\n")

chrome.contextMenus.create({
  title: "Create draaft element from selection",
  contexts: [ "selection" ],

  onclick(info, tab) {
    const url = info.pageUrl
    const text = info.selectionText
    chrome.tabs.executeScript(tab.id, { code: code(text, url, "text") })
  },
})

chrome.contextMenus.create({
  type: "checkbox",
  checked: false,
  title: "Enable",
  contexts: [ "browser_action" ],
  onclick: () => {
    chrome.browserAction.enable()
  },
})
