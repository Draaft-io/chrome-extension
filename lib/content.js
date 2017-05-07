(function(window, document) {

    var selectionTimeout,
        selectionSpan,
        selectionIcon,
        overlay,
        style,
        quote,
        css                    = "{{CSS}}",
        styleNeedsToBeInjected = !/CSS/.test(css);

    injectCSS();

    document.addEventListener("selectionchange", function() {

        cleanUp();

        clearTimeout(selectionTimeout);

        selectionTimeout = setTimeout(function() {
            markSelection();
        }, 250);

    });

    function cleanUp() {
        if (selectionSpan) {
            selectionSpan.className = "";
        }

        if (selectionIcon && selectionIcon.parentNode) {
            selectionIcon.parentNode.removeChild(selectionIcon);
        }

        selectionSpan = null;
        selectionIcon = null;
    }

    function markSelection() {

        var selection = document.getSelection();

        if (!selection || selection.isCollapsed) {
            return;
        }

        var range = selection.getRangeAt(0);
        if (!range) {
            return;
        }

        quote = selection.toString();
        var selectionContents = range.extractContents();

        selectionSpan = document.createElement("span");
        selectionSpan.appendChild(selectionContents);
        selectionSpan.className = "draaft-selection";

        range.insertNode(selectionSpan);

        selectionIcon = document.createElement("span");
        selectionIcon.className = "draaft-icon";
        selectionIcon.addEventListener("click", bookmarkSelection);

        selectionSpan.appendChild(selectionIcon);

    }

    function injectCSS() {
        if (styleNeedsToBeInjected && !style) {
            style = document.createElement('style');
            style.setAttribute('type', 'text/css');

            if ('textContent' in style) {
                style.textContent = css;
            } else {
                style.styleSheet.cssText = css;
            }

            document.getElementsByTagName('head')[0].appendChild(style);

        }

    }

    function bookmarkSelection() {
        overlay = document.createElement('div');
        overlay.id = "draaft-overlay";
        overlay.onclick = cleanUpIFrame;

        var encodeURIComponent = window.encodeURIComponent;
        var link = "https://alpha.draaft.co/bookmark?url=" + encodeURIComponent(location.href) +
            "&quote=" + encodeURIComponent(quote);

        var author = extractAuthor();

        if (author) {
            link += "&author=" + encodeURIComponent(author);
        }

        if (!/http/.test(location.protocol)) {
            return window.open(link, "draaft", "location=no,menubar=no,resizable=yes,titlebar=yes,toolbar=no,width=480,height=640");
        }

        var iframe = document.createElement('iframe');
        iframe.onload = function() {
            overlay.className = "loaded";
        };
        iframe.onerror = function() {
            cleanUpIFrame();
        };

        iframe.src = link;

        var loader = document.createElement("div");
        loader.className = "loader draaft-icon";

        overlay.appendChild(iframe);
        overlay.appendChild(loader);
        document.body.appendChild(overlay);

    }

    function extractAuthor() {
        var element = document.querySelector("meta[property='author']"),
            content;

        if (element && (content = element.getAttribute("content"))) {
            return content;
        }

        var nodes = document.querySelectorAll("script[type='application/ld+json']");
        for (var i = 0; i < nodes.length; i++) {
            var s = nodes[i];
            if (s && s.innerText) {
                try {
                    var data = JSON.parse(s.innerText);
                    if (data && /@person/i.test(data.type) && data.name) {
                        return data.name;
                    }
                } catch (e) {
                }
            }
        }


    }

    function cleanUpIFrame() {
        document.body.removeChild(overlay);
    }

})(window, document);