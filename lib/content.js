(function(window, document) {

    // var selectionTimeout,
    //     selectionSpan,
    //     selectionIcon,
    //     overlay,
    //     style,
    //     css                    = "{{CSS}}",
    //     styleNeedsToBeInjected = !/CSS/.test(css);
    //
    // injectCSS();

    // document.addEventListener("selectionchange", function() {
    //
    //     cleanUp();
    //
    //     clearTimeout(selectionTimeout);
    //
    //     selectionTimeout = setTimeout(function() {
    //         markSelection();
    //     }, 250);
    //
    // });

    // document.addEventListener("mouseover", function(e) {
    //     var img = e.target;
    //     if (!(img.localName = "img" && img.naturalWidth > 50 && img.naturalHeight > 50 && /^http/.test(img.src))) {
    //         return;
    //     }
    //
    //     if (img.parentNode.className == "draaft-img-container") {
    //         return;
    //     }
    //
    //     var container = document.createElement("span");
    //     container.className = "draaft-img-container";
    //
    //     img.parentNode.insertBefore(container, img);
    //     img.parentNode.removeChild(img);
    //
    //
    //     var span = document.createElement("span");
    //     span.className = "draaft-icon draaft-btn";
    //
    //     span.addEventListener("click", function() {
    //         cleanUp();
    //         bookmarkSelection(null, img.src, "image");
    //     });
    //
    //     container.appendChild(span);
    //     container.appendChild(img);
    //
    //
    //     var mouseOutEvent = "mouseout";
    //     img.addEventListener(mouseOutEvent, mouseOutListener);
    //
    //     function cleanUp() {
    //         img.removeEventListener(mouseOutEvent, mouseOutListener);
    //
    //         container.removeChild(span);
    //         container.parentNode.insertBefore(img, container);
    //         container.parentNode.removeChild(container);
    //     }
    //
    //     function mouseOutListener(e) {
    //         if (e.relatedTarget == span) {
    //             return;
    //         }
    //
    //         cleanUp();
    //     }
    //
    // });

    // function cleanUp() {
    //     if (selectionSpan) {
    //         selectionSpan.className = "";
    //     }
    //
    //     if (selectionIcon && selectionIcon.parentNode) {
    //
    //         if (selectionIcon.parentNode.parentNode) {
    //             selectionIcon.parentNode.parentNode.classList.remove("draaft-selection");
    //         }
    //
    //         selectionIcon.parentNode.removeChild(selectionIcon);
    //     }
    //
    //     selectionSpan = null;
    //     selectionIcon = null;
    // }
    //
    // function markSelection() {
    //
    //     var selection = document.getSelection();
    //
    //     if (!selection || selection.isCollapsed) {
    //         return;
    //     }
    //
    //     var range = selection.getRangeAt(0);
    //     if (!(range && range.endContainer)) {
    //         return;
    //     }
    //
    //     var container = range.commonAncestorContainer;
    //     if (container.nodeType != 1) {
    //         container = container.parentNode;
    //     }
    //
    //     container.classList.add("draaft-selection");
    //
    //     var iconContainer = document.createElement("span");
    //     iconContainer.style.position = "relative";
    //
    //     var newRange = range.cloneRange();
    //     newRange.setStart(range.endContainer, range.endOffset);
    //     newRange.insertNode(iconContainer); // using 'range' here instead of newRange unselects or causes flicker on chrome/webkit
    //
    //     selectionIcon = document.createElement("span");
    //     selectionIcon.className = "draaft-icon draaft-btn";
    //     selectionIcon.addEventListener("mousedown", function() {
    //         bookmarkSelection(selection.toString(), undefined, "text")
    //     });
    //
    //     iconContainer.appendChild(selectionIcon);
    //
    //
    // }
    //
    // function injectCSS() {
    //     if (styleNeedsToBeInjected && !style) {
    //         style = document.createElement('style');
    //         style.setAttribute('type', 'text/css');
    //
    //         if ('textContent' in style) {
    //             style.textContent = css;
    //         } else {
    //             style.styleSheet.cssText = css;
    //         }
    //
    //         document.getElementsByTagName('head')[0].appendChild(style);
    //
    //     }
    //
    // }
    //
    // function bookmarkSelection(quote, href, type) {
    //
    //     quote = quote || "";
    //     href = href || location.href;
    //
    //     overlay = document.createElement('div');
    //     overlay.id = "draaft-overlay";
    //     overlay.onclick = cleanUpIFrame;
    //
    //     var encodeURIComponent = window.encodeURIComponent;
    //     var link = "https://alpha.draaft.co/bookmark?url=" + encodeURIComponent(href) +
    //         "&quote=" + encodeURIComponent(quote) + "&type=" + type;
    //
    //     var author = extractAuthor();
    //
    //     if (author) {
    //         link += "&author=" + encodeURIComponent(author);
    //     }
    //
    //     if (!/http/.test(location.protocol)) {
    //         return window.open(link, "draaft", "location=no,menubar=no,resizable=yes,titlebar=yes,toolbar=no,width=480,height=640");
    //     }
    //
    //     var iframe = document.createElement('iframe');
    //     iframe.onload = function() {
    //         overlay.className = "loaded";
    //     };
    //     iframe.onerror = function() {
    //         cleanUpIFrame();
    //     };
    //
    //     iframe.src = link;
    //
    //     var loader = document.createElement("div");
    //     loader.className = "loader draaft-icon";
    //
    //     overlay.appendChild(iframe);
    //     overlay.appendChild(loader);
    //     document.body.appendChild(overlay);
    //
    // }
    //
    // function extractAuthor() {
    //     var element = document.querySelector("meta[property='author']"),
    //         content;
    //
    //     if (element && (content = element.getAttribute("content"))) {
    //         return content;
    //     }
    //
    //     var nodes = document.querySelectorAll("script[type='application/ld+json']");
    //     for (var i = 0; i < nodes.length; i++) {
    //         var s = nodes[i];
    //         if (s && s.innerText) {
    //             try {
    //                 var data = JSON.parse(s.innerText);
    //                 if (data && /@person/i.test(data.type) && data.name) {
    //                     return data.name;
    //                 }
    //             } catch (e) {
    //             }
    //         }
    //     }
    //
    //
    // }
    //
    // function cleanUpIFrame() {
    //     document.body.removeChild(overlay);
    // }

})(window, document);
