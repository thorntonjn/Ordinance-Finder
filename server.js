var express = require('express')
  , everyauth = require('./index')
  , conf = require('./conf')
  , routes = require('./routes')
  , restler = require('./node_modules/restler')
  , sys = require('util')
  , fs   = require('fs')
  , http = require('http');


everyauth.debug = true;

var usersById = {};
var nextUserId = 0;

function addUser (source, sourceUser) {
  var user;
  if (arguments.length === 1) { // password-based
    user = sourceUser = source;
    user.id = ++nextUserId;
    return usersById[nextUserId] = user;
  } else { // non-password-based
    user = usersById[++nextUserId] = {id: nextUserId};
    user[source] = sourceUser;
  }
  return user;
}

var usersByFamilySearchName = {};

everyauth.everymodule
  .findUserById( function (id, callback) {
    callback(null, usersById[id]);
  });

var apiReference = "http://www.dev.usys.org";
var reference = "http://www.dev.usys.org";
var staging = "https://ftbeta.familysearch.org";
var production = "https://new.familysearch.org"
var apiProduction = "https://api.familysearch.org"
var devkey;

reference = staging;
apiReference = staging;
devkey = unescape(conf.familysearch.developerKey);

reference = production;
apiReference = apiProduction;
devkey = unescape(conf.familysearch.productionKey);


everyauth.familysearch
  .developerKey(devkey)
  .userAgent(conf.familysearch.userAgent)
  .referenceHost(reference)
  .findOrCreateUser( function (sess, accessToken, accessSecret, fsUser) {
    return usersByFamilySearchName[fsUser.name] ||
              (usersByFamilySearchName[fsUser.name] = addUser('familysearch', fsUser));
  })
 .redirectPath('/');

everyauth
  .password
    .loginWith('email')
    .getLoginPath('/login')
    .postLoginPath('/login')
    .loginView('login.jade')
    .loginLocals( function (req, res, done) {
      setTimeout( function () {
        done(null, {
          title: 'Async login'
        });
      }, 200);
    })
    .authenticate( function (login, password) {
      var errors = [];
      if (!login) errors.push('Missing login');
      if (!password) errors.push('Missing password');
      if (errors.length) return errors;
      var user = usersByLogin[login];
      if (!user) return ['Login failed'];
      if (user.password !== password) return ['Login failed'];
      return user;
    })

    .getRegisterPath('/register')
    .postRegisterPath('/register')
    .registerView('register.jade')
    .registerLocals( function (req, res, done) {
      setTimeout( function () {
        done(null, {
          title: 'Async Register'
        });
      }, 200);
    })
    .validateRegistration( function (newUserAttrs, errors) {
      var login = newUserAttrs.login;
      if (usersByLogin[login]) errors.push('Login already taken');
      return errors;
    })
    .registerUser( function (newUserAttrs) {
      var login = newUserAttrs[this.loginKey()];
      return usersByLogin[login] = addUser(newUserAttrs);
    })

    .loginSuccessRedirect('/')
    .registerSuccessRedirect('/');

var app = express.createServer(
    express.bodyParser()
  , express.static(__dirname + "/public")
  , express.favicon()
  , express.cookieParser()
  , express.session({ secret: 'htuayreve'})
  , everyauth.middleware()
);

app.configure( function () {
  app.set('view engine', 'jade');
});


routes(app, restler, everyauth, usersById);


/*
 ** Peteris Krumins (peter@catonmat.net)
 ** http://www.catonmat.net  --  good coders code, great reuse
 **
 ** A simple proxy server written in node.js.
 **
 */

//var http = require('http');
//var sys  = require('sys');
//var fs   = require('fs');

//var blacklist = ["www.aol.com"];
//var iplist    = ["www.dev.usys.org", "127.0.0.1"];
//
//fs.watchFile('./blacklist', function(c,p) { update_blacklist(); });
//fs.watchFile('./iplist', function(c,p) { update_iplist(); });
//
//function update_blacklist() {
//  fs.stat('./blacklist', function(err, stats) {
//    if (!err) {
//      sys.log("Updating blacklist.");
//      var fileStr = fs.readFileSync('./blacklist');
//      blacklist = fileStr.split('\n')
//          .filter(function(rx) { return rx.length })
//          .map(function(rx) { return RegExp(rx) });
//    }
//  });
//}
//
//function update_iplist() {
//  fs.stat('./iplist', function(err, stats) {
//    if (!err) {
//      sys.log("Updating iplist.");
//      var fileStr = fs.readFileSync('./iplist');
//      iplist = fileStr.split('\n')
//          .filter(function(rx) { return rx.length });
//    }
//  });
//}
//
//function ip_allowed(ip) {
//  for (i in iplist) {
//    if (iplist[i] == ip) {
//      return true;
//    }
//  }
//  return false;
//}
//
//function host_allowed(host) {
//  for (i in blacklist) {
//    if (blacklist[i] == host) {
//      return false;
//    }
//  }
//  return true;
//}
//
//function deny(response, msg) {
//  response.writeHead(401);
//  response.write(msg);
//  response.end();
//}

//http.createServer(function(request, response) {
//  var ip = request.connection.remoteAddress;
//  if (!ip_allowed(ip)) {
//    msg = "IP " + ip + " is not allowed to use this proxy";
//    deny(response, msg);
//    sys.log(msg);
//    return;
//  }
//
//  if (!host_allowed(request.url)) {
//    msg = "Host " + request.url + " has been denied by proxy configuration";
//    deny(response, msg);
//    sys.log(msg);
//    return;
//  }
//
//  console.log(ip + ": " + request.method + " " + request.url);
//
//
//  http.get({host: "204.9.231.251:" + request.url}, function(res) {
//    console.log("after createClient : " + res.status);
//    request.method = "GET";
//    request.url = "http://www.dev.usys.org"+ request.url;
//    console.log("url : " + request.url);
//
//    console.log("after proxy_request:" + res.method + ":" + res.url + "\n\n" + JSON.stringify(res.headers) );
//    console.log("data:" + JSON.stringify(res.data) );
//
//    console.log("Got response: " + res.statusCode);
//
//    res.on("data", function(chunk) {
//      console.log("BODY: " + chunk);
//    });
//
////    proxy_request.addListener('response', function(proxy_response) {
////      proxy_response.addListener('data', function(chunk) {
////        response.write(chunk, 'binary');
////      });
////      proxy_response.addListener('end', function() {
////        response.end();
////      });
////      response.writeHead(proxy_response.statusCode, proxy_response.headers);
////    });
////    request.addListener('data', function(chunk) {
////      proxy_request.write(chunk, 'binary');
////    });
////    request.addListener('end', function() {
////      proxy_request.end();
////    });  }).on('error', function(e) {
////        console.log("Got error: " + e.message);
//  }).on('error', function(e) {
//        console.log("Got error: " + e.message);
//  });;
//
//
//}).listen(8181);




app.all('/familytree/*', function(req, res) {

  console.log(apiReference + req.url);

  restler.get(apiReference + req.url, {

  }).on('complete', function (data) {
//        console.log(data)
        res.json(data)
      });

});


app.all('/reservation/*', function(req, res) {

  console.log(apiReference + req.url);

  restler.get(apiReference + req.url, {

  }).on('complete', function (data) {
//        console.log(data)
        res.json(data)
      });

});

//app.get("/cache.manifest", function(req, res){
//  res.header("Content-Type", "text/cache-manifest");
//  res.end("CACHE MANIFEST");
//});

//####################################
// start of Logan's code
//var httpProxy = require('http-proxy');
//
//var apiProxy, routingProxy, hostListRegEx = /^\/(?:familytree|identity|reservation|authorities|ct|watch|discussion|sources|links|source-links|temple)\/.*/;
//routingProxy = new httpProxy.RoutingProxy();
//
//apiProxy = function(req, res, next) {
//  if (hostListRegEx.test(req.url)) {
//    console.log("  proxy request: "+req.url);
//
//    return routingProxy.proxyRequest(req, res, {
//      host: "www.dev.usys.org",
//      port: 80
//    });
//  } else {
//    return next();
//  }
//};
//
////Setup Express
//var server = express.createServer();
//server.configure(function(){
//  server.set('views', __dirname + '/views');
//  server.set('view options', { layout: false });
//  server.use(apiProxy);
//  server.use(connect.bodyParser());
//  server.use(express.cookieParser());
//  server.use(express.session({ secret: "shhhhhhhhh!"}));
//  server.use(connect.static(__dirname + '/static'));
//  server.use(everyauth.middleware());
//  server.use(server.router);
//});

// end of Logan's code
//######################################################


everyauth.helpExpress(app);
var port = process.env.PORT || 3000;
app.listen(port);

console.log('Go to http://localhost:3000');
