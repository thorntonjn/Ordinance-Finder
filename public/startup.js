var userInfo = null;
var useLocalStorage = false;

$(document).ready(function() {
  if (console && console.log) {
    console.log("readPedigree:");
    console.log("http://www.dev.usys.org/familytree/v2/pedigree/?ancestors=9");
    if (localStorage && localStorage.getItem("store-local") === "true") {
      $("#store-local-form input:checkbox").attr('checked', 'checked');
      useLocalStorage = true;
    }

    $("#store-local-form input:checkbox").change(function () {
      var $this = $(this);
      // $this will contain a reference to the checkbox
      if ($this.is(':checked')) {
        // the checkbox was checked
        localStorage.setItem("store-local", true);
        useLocalStorage = true;
      } else {
        // the checkbox was unchecked
        localStorage.setItem("store-local", false);
        useLocalStorage = false;
        localStorage.removeItem("persons");
      }
    });

    if ($("p.userinfo").text()) {
      userInfo = JSON.parse($("p.userinfo").text());
      console.log("userInfo:" + JSON.stringify(userInfo));
      startup(userInfo);
    }
  }
});



var startup = function(userInfo) {
  var pQ=[];
  var rQ=[];
  var tQ=[];
  var personQ = new RequestQueue({q:pQ, smallestInterval:100, interval:100, name:"persons" }),
      relationshipQ = new RequestQueue({q:rQ, smallestInterval:100, interval:100, name:"relationships" }),
      reservationQ = new RequestQueue({q:tQ, smallestInterval:1000, interval:1000, name:"reservations" }),
      pedigree = new Pedigree({id:userInfo.id, session:userInfo.sessionId, personQ:personQ}),
      persons = new Persons([], {pedigree:pedigree}),
      relationships = new Relationships([], {persons:persons, relationshipQ:relationshipQ}),
      reservations = new Reservations([], {persons:persons, reservationQ:reservationQ}),
      dashboard = new DashBoard( {
        name : userInfo.username,
        id : userInfo.id,
        email : userInfo.email,
        sessionid : userInfo.sessionId,
        progress : "Not Started",
        inFlight : 0,
        ancestorsRead : 0,
        ancestorsProcessed : 0,
        personCount : 0,
        readyCount : 0,
        needMoreInformationCount : 0,
        completedCount : 0,
        persons:persons,
        personQ:personQ,
        relationshipQ:relationshipQ,
        reservationQ:reservationQ

      }),
      dashboardView = new DashBoardView({ el: $('.status'), model: dashboard}),
      ancestors = new Ancestors({persons : persons, relationships : relationships, reservations : reservations }),
      ancestorsView = new AncestorsView({ el: $('section.content'), collection: ancestors, dashboard:dashboard});

  // kick everything off with reading the pedigree
  pedigree.readPedigree();

}

