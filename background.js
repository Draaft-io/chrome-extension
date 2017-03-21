chrome.contextMenus.create({
    title: "Create draaft: %s",
    contexts: ["selection"],

    onclick: function(info, tab) {
        window.open('http://alpha.draaft.co/bookmark?text=' + encodeURIComponent(info.selectionText || '') + '&url=' + encodeURIComponent(info.pageUrl));
    }
});