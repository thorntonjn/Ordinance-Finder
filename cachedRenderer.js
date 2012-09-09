var fs = require('fs');
var http = require('http');
var DEV_MODE = true;

// Let's encapsulate all the nasty bits!
function cachedRenderer(file, render, refresh) {
    var cachedData = null;
    function cache() {

        fs.readFile(file, function(e, data) {
            if (e) {
                throw e;
            }
            cachedData = render(data);
        });

        // Watch the file if, needed and re-render + cache it whenever it changes
         // you may also move cachedRenderer into a different file and then use a global config option instead of the refresh parameter
        if (refresh) {
            fs.watchFile(file, {'persistent': true, 'interval': 100}, function() {
                cache();
            });
            refresh = false;
        }
    }

    // simple getter
    this.getData = function() {
        return cachedData;
    }

    // initial cache
    cache();
}


// How to use. 
// var ham = new cachedRenderer('foo.haml',

//     // supply your custom render function here
//     function(data) {
//         return 'RENDER' + data + 'RENDER';
//     },
//     DEV_MODE
// );

// // start server
// http.createServer(function(req, res) {
//     res.writeHead(200);
//     res.end(ham.getData());

// }).listen(8000);
