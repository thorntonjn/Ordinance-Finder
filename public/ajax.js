// processQueues that will handle steady stream of request and retry of throttled requests if necessary
var requestQueues = {};
var inflightRequests = [];

var RequestQueue = Backbone.Model.extend({
  model: RequestQueue,
  defaults:{
    inflight : 0,
    processed : 0,
    smallestInterval:100,
    interval:100,
    name:"queue",
    t:null
  },
  initialize:function (config) {
    _.bindAll(this, 'addRequest', 'dequeueRequest', 'processQueue');
    this.q = config.q;
  },

  addRequest:function(request) {
    var q = this.get("q");
    q.push(request);
    if (this.get("t") === null) {
      this.set("t", setTimeout(this.processQueue, this.get('interval')));
    }
  },

  dequeueRequest:function () {
    var req = this.get("q").pop();
    if (req === null) {
      clearTimeout(this.get("t"));
      this.set("t", null);
    }
    return req;
  },

  processQueue : function () {
    var req = this.dequeueRequest();
    if (req) {
      var cb = req.ajaxParams.complete,
        self = this,
        complete = function (resp) {
          var i;
          for (i=0; i < inflightRequests.length; i++ ) {
            if (inflightRequests[i] === req) {
              break;
            }
          }
          if ( i < inflightRequests.length) {
            inflightRequests.splice(i, 1);
            self.set("inflight", self.get("inflight") - 1);
          }
          if (resp.status === 0) {
            // FamilySearch Aborted our request
            cb(resp, req);
            while ((r = self.dequeueRequest())){
              cb({status:0}, r);
            }
          }
          else if (resp.status === 503 ) {
            // since order doesn't matter just put back on queue and let next process cycle execute
            // slow down timer by one second with every failure
            self.addRequest(req);
            self.set("timerInterval", self.get("timerInterval") + 1000);
          } else {
            if (resp.status == 200) {
              // decrease interval with every success until we reach fastest threshhold
              if (self.get("interval") >= (1000 + self.get("smallestInterval"))) {
                self.set("interval", self.get("interval") - 1000);
              }
            }
            cb(resp, req);
            self.set("processed", self.get("processed") + 1);
          }
          self.set("t", setTimeout( self.processQueue, self.get("interval")));
        };

      req.ajaxParams.complete = complete;
      this.set("inflight", this.get("inflight") + 1);
      inflightRequests.push(req);
      $.ajax(req.ajaxParams);
    } else {
      this.set("t", null);
    }

  }

});

//Backbone.sync = function(method, model, options){
//  var key, now, timestamp, refresh;
//  if(method === 'read' && this.constants.isStoredInLocalStorage) {
//    // only override sync if it is a fetch('read') request
//    key = this.getKey();
//    if(key) {
//      now = new Date().getTime();
//      timestamp = $storage.get(key + ":timestamp");
//      refresh = options.forceRefresh;
//      if(refresh || !timestamp || ((now - timestamp) > this.constants.maxRefresh)) {
//        // make a network request and store result in local storage
//        var success = options.success;
//        options.success = function(resp, status, xhr) {
//          // check if this is an add request in which case append to local storage data instead of replace
//          if(options.add && resp.values) {
//            // clone the response
//            var newData = JSON.parse(JSON.stringify(resp));
//            // append values
//            var prevData = $storage.get(key);
//            newData.values = prevData.values.concat(resp.values);
//            // store new data in local storage
//            $storage.set(key, newData);
//          } else {
//            // store resp in local storage
//            $storage.set(key, resp);
//          }
//          var now = new Date().getTime();
//          $storage.set(key + ":timestamp", now);
//          success(resp, status, xhr);
//        };
//        // call normal backbone sync
//        Backbone.sync(method, model, options);
//      } else {
//        // provide data from local storage instead of a network call
//        var data = $storage.get(key);
//        // simulate a normal async network call
//        setTimeout(function(){
//          options.success(data, 'success', null);
//        }, 0);
//      }
//    }
//  } else {
//    Backbone.sync(method, model, options);
//  }
//}




