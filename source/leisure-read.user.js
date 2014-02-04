// ==UserScript==
// @name           Leisure Read
// @description    Removes the 'X minute read' countdown so you can enjoy articles at your own pace
// @namespace      http://patik.com/code/user-scripts/
// @include        *
// @version        1.0.0
// @lastupdated    2014-02-04
// @run-at         document-end
// ==/UserScript==

(function _leisure_read() {
    var regex = /^Estimated\s(reading)?\stime|\d+\s*min(ute)?s?\s*(read|left|remain(ing)?)?$/i,

        /**
         * Walks the DOM looking for text nodes
         * From http://stackoverflow.com/a/5904945/348995
         *
         * @param   {Element}  node  Node to search within
         */
        walk = function _walk(node) {
            var child, next;

            switch (node.nodeType) {
                case 1:  // Element
                case 9:  // Document
                case 11: // Document fragment
                    child = node.firstChild;
                    while (child) {
                        next = child.nextSibling;
                        walk(child);
                        child = next;
                    }
                    break;

                case 3: // Text node
                    if (node.parentElement.nodeName !== 'script') {
                        cleanseText(node);
                    }
                    break;
            }
        },

        /**
         * Replaces text matching a regular expression with a non-breaking space
         *
         * @param   {Element}  textNode  Text node
         */
        cleanseText = function _cleanseText(textNode) {
            var text = textNode.nodeValue.trim();

            text = text.replace(regex, '&nbsp;');

            textNode.nodeValue = text;
        };

    // Check for specific offenders that can be targetted more efficiently
    switch (window.location.host) {
        case "medium.com":
        case "fisteggplant.com":
            document.querySelector('.metabar-text').innerHTML = '&nbsp;';
            break;
        case "instapaper.com":
            document.querySelector('.meta_read_time').innerHTML = '&nbsp;';
            break;
        default:
            // Fall back to manually crawling the entire page
            walk(document.body);
            break;
    }
}());
