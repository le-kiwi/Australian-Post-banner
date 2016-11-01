
var es = require('event-stream'),
    gutil = require('gulp-util');


var stream = function(injectMethod){
    return es.map(function (file, cb) {
        try {
            file.contents = new Buffer( injectMethod( String(file.contents) ));
        } catch (err) {
            return cb(new gutil.PluginError('gulp-cachekill', err));
        }
        cb(null, file);
    });
};

module.exports = {
    google: function(){
        return stream(function(swiffyHTML){
            swiffyHTML = swiffyHTML.replace('<title>Swiffy Output</title>', '<title>Swiffy Banner Output</title><script>var clickTag = "";</script>');
            swiffyHTML = swiffyHTML.replace('stage.start();', 'stage.start(); document.getElementById("swiffycontainer").onclick = function(){window.open(clickTag, "_blank");}');
            return swiffyHTML;
        });
    },

    sizmek: function(){
        return stream(function(swiffyHTML){
            swiffyHTML = swiffyHTML.replace('<title>Swiffy Output</title>', '<title>Swiffy Banner Output</title><script type="application/javascript" src="https://secure-ds.serving-sys.com/BurstingScript/EBLoader.js"></script>');
            swiffyHTML = swiffyHTML.replace('stage.start();', "function checkInit() {if (!EB.isInitialized()) {EB.addEventListener(EBG.EventName.EB_INITIALIZED, startAnimation);} else {startAnimation()}} function startAnimation(){stage.start(); document.getElementById('swiffycontainer').onclick = function(){EB.clickthrough()}} checkInit();");
            return swiffyHTML;
        });
    }

};

module.exports._stream = stream;

