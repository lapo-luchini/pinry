/**
 * Bookmarklet for Pinry
 * Descrip: This is trying to be as standalone a script as possible hence
 *          why it has built in helpers and such when the rest of the
 *          scripts make use of helpers.js. In the future i want to remove
 *          all dependencies on jQuery.
 * Authors: Pinry Contributors
 * Updated: Mar 4th, 2013
 * Require: None (dynamically loads jQuery if needed)
 */

(function main() {
    'use strict';

    function closePinry() {
        var el = document.getElementById('pinry-images');
        el.parentNode.removeChild(el);
        el = document.getElementById('pinry-bookmarklet');
        el.parentNode.removeChild(el);
    }

    // Start Helper Functions
    function getFormUrl() {
        var src = document.getElementById('pinry-bookmarklet').src;
        src = src.substr(0, src.indexOf('/static/js'));
        return src + '/pins/pin-form/?pin-image-url=';
    }

    function setCSS(el, css) {
        for (var k in css)
            el.style[k] = css[k];
    }
    // End Helper Functions


    // Start View Functions
    function pageView() {
        var pinryImages = document.createElement('div');
        pinryImages.id = 'pinry-images';
        setCSS(pinryImages, {
            position: 'fixed',
            display: 'block',
            zIndex: 2147483647, // http://www.puidokas.com/max-z-index/
            background: 'rgba(0, 0, 0, 0.7)',
            paddingTop: '70px',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            textAlign: 'center',
            overflowX: 'hidden',
            overflowY: 'auto'
        });
        var pinryBar = document.createElement('div');
        pinryBar.id = 'pinry-bar';
        setCSS(pinryBar, {
            display: 'block',
            background: 'black',
            padding: '15px',
            position: 'absolute',
            zIndex: 9002,
            width: '100%',
            top: 0,
            borderBottom: '1px solid #555',
            color: 'white',
            textAlign: 'center',
            fontSize: '22px'
        });
        pinryBar.textContent = 'Pinry Bookmarklet';
        pinryBar.onclick = closePinry;
        pinryImages.appendChild(pinryBar);
        var pinrySort = document.createElement('div');
        setCSS(pinrySort, {
            display: 'block',
            position: 'absolute',
            top: '15px',
            right: '1em',
            cursor: 'pointer'
        });
        pinrySort.textContent = '\u21D5 Size';
        pinryBar.appendChild(pinrySort);
        document.body.appendChild(pinryImages);
        document.onkeyup = function (e) {
            if (e.keyCode == 27) // ESC key
                closePinry();
        };
        pinrySort.onclick = function (e) {
            e.stopPropagation();
            Array.prototype.slice.call(pinryImages.children).sort(function (a, b) {
                return b.getAttribute('pinryArea') - a.getAttribute('pinryArea');
            }).forEach(function (div) {
                // re-add to parent in sorted order
                pinryImages.appendChild(div);
            });
        };
    }

    function imageView(imageUrl) {
        // Requires that pageView has been created already
        var image = document.createElement('div');
        setCSS(image, {
            backgroundImage: 'url('+imageUrl.replace(/([()])/g, '\\$1')+')',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            display: 'inline-block',
            color: 'blue',
            textShadow: 'yellow 0px 0px 2px, yellow 0px 0px 3px, yellow 0px 0px 4px',
            width: '200px',
            height: '200px',
            margin: '15px',
            cursor: 'pointer',
            border: '1px solid #555'
        });
        image.onclick = function() {
            var popUrl = getFormUrl()+imageUrl;
            window.open(popUrl);
            closePinry();
        };
        document.getElementById('pinry-images').appendChild(image);
        return image;
    }
    // End View Functions


    // Start Active Functions
    var images = {}, // cache URLs to avoid duplicates
        reURL = /url[(]"([^"]+)"[)]/; // match an URL in CSS
    function addImage(img) {
        if (images[img.src])
            return;
        images[img.src] = true;
        var w = img.naturalWidth,
            h = img.naturalHeight;
        if (w > 200 && h > 200) {
            var i = imageView(img.src);
            i.textContent = w + '\u00D7' + h;
            i.setAttribute('pinryArea', w * h);
        }
    }
    function addAllImagesToPageView() {
        // add all explicit IMGs
        var images = document.getElementsByTagName('img');
        for (var i = 0; i < images.length; ++i)
            addImage(images[i]);
        // add all background images
        ['body', 'div', 'td'].forEach(function (tagName) {
             var tags = document.getElementsByTagName(tagName);
             for (var i = 0; i < tags.length; ++i) {
                 var m = reURL.exec(tags[i].style.backgroundImage);
                 if (m) {
                     // load image to know size
                     var img = new Image();
                     img.onload = function () {
                         addImage(this);
                     };
                     img.src = m[1];
                 }
             }
        });
    }
    // End Active Functions


    // Start Init
    pageView(); // Build page before we insert images
    addAllImagesToPageView(); // Add all images on page to our new pageView
    // End Init
})();
