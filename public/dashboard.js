/**
 * Created with IntelliJ IDEA.
 * User: thorntonjn
 * Date: 8/31/12
 * Time: 7:01 PM
 * To change this template use File | Settings | File Templates.
 */
var DashBoard = Backbone.Model.extend({
  url: '/familytree/v2/pedigree/',
//  success: function(model, data) {
//    alert("Pedigree init");
//    events.trigger('status:add', data.text);
//  },
  defaults : {
    name : "",
    id : "",
    email : "",
    session : "",

    progressRequest : "Not Started", // "Not Started", "Reading Persons", "Reading Relationships", "Reading Temple Ordinances", "Finished"

    personsQueued:0,
    personsInFlight:0,
    personsProcessed:0,
    personsRead:0,

    relationshipsQueued:0,
    relationshipsInFlight:0,
    relationshipsRead:0,

    templesQueued:0,
    templesInFlight:0,
    templesRead:0,

    ancestorsProcessed : 0,

    readyCount : 0,
    needMoreInformationCount : 0,
    reservedCount: 0,
    completedCount : 0
  },

  initialize:function (config){
    var self=this, persons = config.persons,
        personQ = config.personQ,
        relationshipQ = config.relationshipQ,
        reservationQ = config.reservationQ,
        getSetChange = function () {
          var personsQueued = personQ.get("q").length,
              personsInFlight = personQ.get("inFlight"),
              personsProcessed = personQ.get("processed"),
              personsRead = persons.length,
              relationshipsQueued = relationshipQ.get("q").length,
              relationshipsInFlight = relationshipQ.get("inFlight"),
              relationshipsRead = relationshipQ.get("processed"),
              templesQueued = reservationQ.get("q").length,
              templesInFlight = reservationQ.get("inFlight"),
              templesRead = reservationQ.get("processed");
          return {  personsQueued:personsQueued,
            personsInFlight:personsInFlight,
            personsProcessed:personsProcessed,
            personsRead:personsRead,
            relationshipsQueued:relationshipsQueued,
            relationshipsInFlight:relationshipsInFlight,
            relationshipsRead:relationshipsRead,
            templesQueued:templesQueued,
            templesInFlight:templesInFlight,
            templesRead:templesRead};

        };
    persons.on('add', function (change) {
      self.set({personRead: change.collection.length});
      console.log('add');
    })

    personQ.on('change', function (change) {
      self.set(getSetChange());
    })

    relationshipQ.on('change', function (change) {
      self.set(getSetChange());
    }),

        reservationQ.on('change', function (change) {
          self.set(getSetChange());
        })

  }

});

var DashBoardView = Backbone.View.extend( {
  events:{
    'click a.hello' : 'addStatus',
    'click div.auth': 'logOut'

  },

  initialize : function () {
    _.bindAll(this, 'render', 'unrender', 'addStatus');
    this.model.bind('change', this.render);
    this.model.bind('remove', this.unrender);
  },

  addStatus: function(e) {
    e.preventDefault();
    this.pedigree.get();
    readPedigree(null);
  },

  render: function () {
    $(this.el).removeClass("hide");
    $("span.progressRequest", this.el).text(this.model.get("progress"));
    $("span.personsQueued", this.el).text(this.model.get("personQ").get("q").length);
    $("span.personsInFlight", this.el).text(this.model.get("personQ").get("inflight"));
    $("span.personsProcessed", this.el).text(this.model.get("personQ").get("processed"));
    $("span.personsRead", this.el).text(this.model.get("personsRead"));

    $(".relationshipsQueued", this.el).text(this.model.get("relationshipQ").get("q").length);
    $(".relationshipsInFlight", this.el).text(this.model.get("relationshipQ").get("inflight"));
    $(".relationshipsRead", this.el).text(this.model.get("relationshipQ").get("processed"));

    $(".templesQueued", this.el).text(this.model.get("reservationQ").get("q").length);
    $(".templesInFlight", this.el).text(this.model.get("reservationQ").get("inflight"));
    $(".templesRead", this.el).text(this.model.get("reservationQ").get("processed"));

    $(".ancestorsProcessed", this.el).text(this.model.get("ancestorsProcessed"));

    $(".ready", this.el).text(this.model.get("readyCount"));
    $(".needMoreInformation", this.el).text(this.model.get("needMoreInformationCount"));
    $(".reserved", this.el).text(this.model.get("reservedCount"));
    $(".completed", this.el).text(this.model.get("completedCount"));
    return this;
  },

  unrender: function () {
    $(this.el).addClass("hide");
    alert("unrender");
  },

  logOut : function (e) {
    window.location.href = "./logout";
  }

});