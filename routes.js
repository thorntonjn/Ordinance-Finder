/**
 * Created by IntelliJ IDEA.
 * User: thorntonjn
 * Date: 2/24/12
 * Time: 8:51 PM
 * To change this template use File | Settings | File Templates.
 */
module.exports = function(app, restler, everyauth, usersById){

 console.log(JSON.stringify(everyauth.readability.user));
  // app.get('/login', function(req, res){
  //   res.render('login', {
  //     title: 'Express Login'
  //   });
  // });

app.get('/', function (req, res) {
  res.render('home');
});


app.get("/cache.manifest", function(req, res){
  res.header("Content-Type", "text/cache-manifest");
  res.end("CACHE MANIFEST");
});




//app.get('/pedigree', function(req, res) {
//    console.log("getting https://api.familysearch.org:8080" );
////    console.log("everyauth:" + JSON.stringify(everyauth));
////    console.log("sessionId:" + everyauth.readability.user );
//    console.log("ancestors:" + 9 );
//  console.log("usersByID:" + JSON.stringify(usersById) );
//
//    restler.get("http://www.dev.usys.org/familytree/v2/pedigree/", {
//      ancestors:9,
//      sessionId:everyauth.readability.user
//
//    }).on('complete', function (data) {
//          console.log(data)
//          res.json(data)
//        });

  //other routes..
//});

}

// // NB:- node's http client API has changed since this was written
// // this code is for 0.4.x
// // for 0.6.5+ see http://nodejs.org/docs/v0.6.5/api/http.html#http.request

// var http = require('http');

// var data = JSON.stringify({ 'important': 'data' });
// var cookie = 'something=anything'

// var client = http.createClient(80, 'www.example.com');

// var headers = {
//     'Host': 'www.example.com',
//     'Cookie': cookie,
//     'Content-Type': 'application/json',
//     'Content-Length': Buffer.byteLength(data,'utf8')
// };

// var request = client.request('POST', '/', headers);

// // listening to the response is optional, I suppose
// request.on('response', function(response) {
//   response.on('data', function(chunk) {
//     // do what you do
//   });
//   response.on('end', function() {
//     // do what you do
//   });
// });
// // you'd also want to listen for errors in production

// request.write(data);

// request.end();