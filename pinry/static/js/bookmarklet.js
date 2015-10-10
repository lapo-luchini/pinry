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


// Start jQuery Check
if (!window.jQuery) {
    var body = document.getElementsByTagName('body')[0];
    var script = document.createElement('script');
    script.onload = main;
    script.src = '//cdnjs.cloudflare.com/ajax/libs/jquery/1.8.3/jquery.min.js';
    body.appendChild(script);
} else
    jQuery(document).ready(main);
// End jQuery Check

function main() {
    var $ = jQuery;

    function closePinry() {
        $('#pinry-images').add('#pinry-bookmarklet').remove();
    }

    // Start Helper Functions
    function getFormUrl() {
        var hostUrl = $('#pinry-bookmarklet').attr('src').split('/')[2];
        var formUrl = '/pins/pin-form/?pin-image-url=';
        return 'http://'+hostUrl+formUrl;
    }
    // End Helper Functions


    // Start View Functions
    function pageView() {
        var pinryImages = document.createElement('div');
        pinryImages.id = 'pinry-images';
        $(pinryImages).css({
            'position': 'fixed',
            'z-index': '2147483647', // http://www.puidokas.com/max-z-index/
            'background': 'rgba(0, 0, 0, 0.7)',
            'padding-top': '70px',
            'top': '0',
            'bottom': '0',
            'left': '0',
            'right': '0',
            'text-align': 'center',
            'overflow-x': 'hidden',
            'overflow-y': 'auto'
        });
        var pinryBar = document.createElement('div');
        pinryBar.id = 'pinry-bar';
        $(pinryBar).css({
            'background': 'black',
            'padding': '15px',
            'position': 'absolute',
            'z-index': '9002',
            'width': '100%',
            'top': 0,
            'border-bottom': '1px solid #555',
            'color': 'white',
            'text-align': 'center',
            'font-size': '22px'
        });
        $('body').append(pinryImages);
        $('#pinry-images').append(pinryBar);
        $('#pinry-bar').html('Pinry Bookmarklet').click(closePinry);
        $(document).keyup(function (e) {
            if (e.keyCode == 27) // ESC key
                closePinry();
        });
    }

    function imageView(imageUrl) {
        // Requires that pageView has been created already
        var image = $('<div/>');
        image.css({
            'background-image': 'url('+imageUrl.replace(/([()])/g, '\\$1')+')',
            'background-position': 'center center',
            'background-repeat': 'no-repeat',
            'background-size': 'cover',
            'display': 'inline-block',
            'color': 'blue',
            'text-shadow': 'yellow 0px 0px 2px, yellow 0px 0px 3px, yellow 0px 0px 4px',
            'width': '200px',
            'height': '200px',
            'margin': '15px',
            'cursor': 'pointer',
            'border': '1px solid #555'
        });
        image.click(function() {
            var popUrl = getFormUrl()+encodeURIComponent(imageUrl);
            window.open(popUrl);
            closePinry();
        });
        return image.appendTo('#pinry-images');
    }
    // End View Functions


    // Start Active Functions
    function addAllImagesToPageView() {
        var images = $('body').find('img');
        images.each(function() {
            var t = $(this),
                w = this.naturalWidth  || t.width(),
                h = this.naturalHeight || t.height();
            if (w > 200 && h > 200)
                imageView(this.src).text(w + '\u00D7' + h);
        });
        return images;
    }
    // End Active Functions


    // Start Init
    pageView(); // Build page before we insert images
    addAllImagesToPageView(); // Add all images on page to our new pageView
    // End Init
}
