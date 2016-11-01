
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
    bust: function(cacheBuster){
        return stream(function(fileContents){
            //fileContents = fileContents.replace(/\.css/g, ".css?cache="+cacheBuster);
            //fileContents = fileContents.replace(/\.js/g, ".js?cache="+cacheBuster);
            fileContents = fileContents.replace(/\.jpeg/g, ".jpeg?cache="+cacheBuster);
            fileContents = fileContents.replace(/\.jpg/g, ".jpg?cache="+cacheBuster);
            fileContents = fileContents.replace(/\.png/g, ".png?cache="+cacheBuster);
            fileContents = fileContents.replace(/\.gif/g, ".gif?cache="+cacheBuster);
            return fileContents;
        });
    }
};

module.exports._stream = stream;