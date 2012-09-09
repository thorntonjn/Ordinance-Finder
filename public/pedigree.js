/**
 * Created by IntelliJ IDEA.
 * User: thorntonjn
 * Date: 3/2/12
 * Time: 9:45 PM
 * To change this template use File | Settings | File Templates.
 */
// Data - save Persons file for each user on server and keep in MANIFEST for CACHING locally
//        map of Persons -   For each person, keep Name, ID, version, temple read state - ordinances
//        sync up persons when we read them initially. Do a version check on all of them before we re-read them.
//      - save USER stat information in file on server also in MANIFEST for CACHING locally




//var Pedigrees = Backbone.Collection.extend({
//  url: '/familytree/v2/pedigree/',
//  model: Pedigree,
//  initialize:function () {
//    var self = this;
//    this.fetch({data:{ancestors:9,properties:"all", sessionId:userInfo.sessionId},
//      success:function(resp) {
//        self.set("pedigrees", self.fixData(resp));
//      }
//    });
//  },
//  fixData:function (resp) {
//    var pedigree = {};
//    return pedigree;
//  }
//});

var Person = Backbone.Model.extend({
  url: '',
  defaults: {
    birth:"",
    death:"",
    father:null,
    mother:null,
    id:"INVALID",
    living:true,
    name:"UNKNOWN_NAME",
    publicHorizon:""
  },
  initialize: function (options) {
  }

});

var PersonView = Backbone.View.extend ({
  el: $('body'), // el attaches to existing element
  events: {
  },
  initialize: function(options){
    _.bindAll(this, 'render'); // every function that uses 'this' as the current object should be in here

    this.render();
  },
  render: function(){
      var gender = this.model.get('gender') === "Female" ? "female" : "male",
          hlink = "https://new.familysearch.org/en/action/hourglassiconicview?bookid=p." + this.model.get("id") +"&svfs=1";
      var name = this.model.get('name') || "Unknown Name";
      var lifespan = this.model.get('lifespan') || "";

      $(this.el).addClass("gender-" + gender);

      $(this.el).html( $('<a class="person" href=' + hlink + ' target=_blank>' +
          '<span class="personName">' + name + '</span>' +
          '<span class="description"></span>' +
          '<span class="personId">' + this.model.get('id') + '</span>' +
          '<span class="lifeSpan">' + lifespan + '</span>' +
          '<img border="0" alt="This link will exit this site and take you to the FamilySearch website to view the selected ancestors details and allow you to reserve the temple ordinances." src="external_link_icon.gif" target=_blank></a>')
      );
  }
});


var Persons = Backbone.Collection.extend({
  model:Person,
  defaults:{
    persons:[],
    personIdMap:{}
  },
  initialize: function (models, options) {
    var self = this;
    this.pedigree = options.pedigree;
    this.pedigree.on('change', function (pedigree){
      var unfiltered = pedigree.get("persons");
      var me = unfiltered[0];
      var persons = _.filter(unfiltered,
          function(person) {
            var living = person.living,
                date = person.birth ? new Date(person.birth) : null,
                earliestDate = new Date("January 1, 1750");
            return me.id ===  person.id || (!living && (!date || date > earliestDate));
          });
      var publicHorizon =  self.getPublicHorizon(unfiltered);
      for (var i =0; i < persons.length; i++ ) {
        persons[i].publicHorizon =  publicHorizon;
        self.add(persons[i]);
      }
    })
  },
  getPublicHorizon : function (persons) {
    var i, h, id, publicHorizonIds = "",
        publicHorizon = [],
        fillPublicHorizon = function (p, publicHorizon) {
          if (p) {
            if (p.living === false) {
              publicHorizon.push(p);
            } else {
              fillPublicHorizon(p.father, publicHorizon);
              fillPublicHorizon(p.mother, publicHorizon);
            }
          }
        };

    if (persons && persons.length) {
      var position1 = persons[0];
      var position2 = position1.father;
      var position3 = position1.mother;
      var position4 = position2.father;
      var position5 = position2.mother;
      var position6 = position3.father;
      var position7 = position3.mother;
      var position8 = position4.father;
      var position9 = position4.mother;
      var position10 = position5.father;
      var position11 = position5.mother;
      var position12 = position6.father;
      var position13 = position6.mother;
      var position14 = position7.father;
      var position15 = position7.mother;
      var position16 = position8.father;
      var position17 = position8.mother;
      var position18 = position9.father;
      var position19 = position9.mother;
      var position20 = position10.father;
      var position21 = position10.mother;
      var position22 = position11.father;
      var position23 = position11.mother;
      var position24 = position12.father;
      var position25 = position12.mother;
      var position26 = position13.father;
      var position27 = position13.mother;
      var position28 = position14.father;
      var position29 = position14.mother;
      if (position1) {
        position1.position = 1;
      }
      if (position2) {
        position2.position = 2;
      }
      if (position3) {
        position3.position = 3;
      }
      if (position4) {
        position4.position = 4;
      }
      if (position5) {
        position5.position = 5;
      }
      if (position6) {
        position6.position = 6;
      }
      if (position7) {
        position7.position = 7;
      }
      if (position8) {
        position8.position = 8;
      }
      if (position9) {
        position9.position = 9;
      }
      if (position10) {
        position10.position = 10;
      }
      if (position11) {
        position11.position = 11;
      }
      if (position12) {
        position12.position = 12;
      }
      if (position13) {
        position13.position = 13;
      }
      if (position14) {
        position14.position = 14;
      }
      if (position15) {
        position15.position = 15;
      }
      if (position16) {
        position16.position = 16;
      }
      if (position17) {
        position17.position = 17;
      }
      if (position18) {
        position18.position = 18;
      }
      if (position19) {
        position19.position = 19;
      }
      if (position20) {
        position20.position = 20;
      }
      if (position21) {
        position21.position = 21;
      }
      if (position22) {
        position22.position = 22;
      }
      if (position23) {
        position23.position = 23;
      }
      if (position24) {
        position24.position = 24;
      }
      if (position25) {
        position25.position = 25;
      }
      if (position26) {
        position26.position = 26;
      }
      if (position27) {
        position27.position = 27;
      }
      if (position28) {
        position28.position = 28;
      }
      if (position29) {
        position29.position = 29;
      }

      fillPublicHorizon(position1, publicHorizon);

      for (i = 0; i < publicHorizon.length; i++) {
        h = publicHorizon[i];
        id = h.id + "(" + h.position + ")";
        if (publicHorizonIds === "") {
          publicHorizonIds = id;
        } else {
          publicHorizonIds += "!" + id;
        }
      }
    }
    return publicHorizonIds;
  }

});


var mapPersons = function (persons) {
  var i, p, normalizedPersons = [], personIdMap = {};

  var isPersonMapped = function (person) {
    var id = person.id || person["@"].id;
    return person && id && personIdMap[id];
  };

  var mapPerson = function (person) {
    if (person) {

      if (isPersonMapped(person)) {
        updatePerson(person);
      } else {
        personIdMap[person["@"].id] = createPerson(person);
      }
    }
    return personIdMap[person["@"].id];
  };

  var createPerson = function (pIn) {
    var p = {};
    var getParent = function (pIn, gender) {
      if (pIn.parents && pIn.parents.couple && pIn.parents.couple.parent && pIn.parents.couple.parent.length) {
        for (var i = 0; i < pIn.parents.couple.parent.length; i++) {
          if (pIn.parents.couple.parent[i]["@"].gender === gender) {
            return mapPerson(pIn.parents.couple.parent[i]);
          }
        }
      }
    };
    p.id = pIn["@"].id;
    p.name = (pIn.assertions && pIn.assertions.names && pIn.assertions.names.name && pIn.assertions.names.name.value  && pIn.assertions.names.name.value.forms && pIn.assertions.names.name.value.forms.form && pIn.assertions.names.name.value.forms.form.fullText) ? pIn.assertions.names.name.value.forms.form.fullText : "NO NAME";
    p.gender =  (pIn.assertions && pIn.assertions.genders && pIn.assertions.genders.gender && pIn.assertions.genders.gender.value && pIn.assertions.genders.gender.value.type) ?  pIn.assertions.genders.gender.value.type :  "NO GENDER";
    p.father = getParent(pIn, "Male");
    p.mother = getParent(pIn, "Female");
    p.living = (pIn.properties && pIn.properties.living === "true") ? true : false;
    p.birth = (pIn.properties && pIn.properties.lifespan && pIn.properties.lifespan.birth && pIn.properties.lifespan.birth.text) ? pIn.properties.lifespan.birth.text : "";
    p.death = (pIn.properties && pIn.properties.lifespan && pIn.properties.lifespan.death && pIn.properties.lifespan.death.text) ? pIn.properties.lifespan.death.text : "";
    return p;
  }

  var updatePerson = function (pIn) {
    var id = pIn.id || pIn["@"].id;
    var p = personIdMap[id];
    if (p) {
      var getParent = function (pIn, gender) {
        if (pIn.parents && pIn.parents.couple && pIn.parents.couple.parent && pIn.parents.couple.parent.length) {
          for (var i = 0; i < pIn.parents.couple.parent.length; i++) {
            if (pIn.parents.couple.parent[i]["@"].gender === gender) {
              return mapPerson(pIn.parents.couple.parent[i]);
            }
          }
        }
      };
      if (p.name === "NO NAME") {
        p.name = (pIn.assertions && pIn.assertions.names && pIn.assertions.names.name && pIn.assertions.names.name.value  && pIn.assertions.names.name.value.forms && pIn.assertions.names.name.value.forms.form && pIn.assertions.names.name.value.forms.form.fullText) ? pIn.assertions.names.name.value.forms.form.fullText : "No Name";
      }
      if (p.gender === "NO GENDER") {
        p.gender =  (pIn.assertions && pIn.assertions.genders && pIn.assertions.genders.gender && pIn.assertions.genders.gender.value && pIn.assertions.genders.gender.value.type) ?  pIn.assertions.genders.gender.value.type :  "NO GENDER";
      }
      if (!p.father) {
        p.father = getParent(pIn, "Male");
      }
      if (!p.mother) {
        p.mother = getParent(pIn, "Female");
      }
      if (!p.living) {
        p.living = pIn.properties && pIn.properties.living === "true" ? true : false;
      }
      if (p.birth == "") {
        p.birth = (pIn.properties && pIn.properties.lifespan && pIn.properties.lifespan.birth && pIn.properties.lifespan.birth.text) ? pIn.properties.lifespan.birth.text : "";
      }
      if (p.death == "") {
        p.death = (pIn.properties && pIn.properties.lifespan && pIn.properties.lifespan.death && pIn.properties.lifespan.death.text) ? pIn.properties.lifespan.death.text : "";
      }
    }
    return p;
  }

  if (persons && persons.length > 0) {
    for (i = 0; i < persons.length; i++) {
      p = persons[i];
      normalizedPersons.push(mapPerson(p));
    }
  }
  return ({persons:normalizedPersons, personIdMap:personIdMap});
};

var Pedigree = Backbone.Model.extend({
  url: '/familytree/v2/pedigree/',
  model: Pedigree,
  initialize:function (config) {
    _.bindAll(this, 'readPedigree', 'pedigreeCB');
    this.personQ = config.personQ;
  },

  readPedigree: function () {
    if (console && console.log) {
      console.log("readPedigree:");
      console.log("http://www.dev.usys.org/familytree/v2/pedigree/?ancestors=9&properties=all");
      var userInfo = JSON.parse($("p.userinfo").text());
      console.log("userInfo:" + JSON.stringify(userInfo));

    }

    var pedigreeAjaxParams = {
      type: "GET",
      url: '/familytree/v2/pedigree/?ancestors=9&properties=all&sessionId='+userInfo.sessionId,
      dataType: "json",
      complete: this.pedigreeCB,
      data: null,
      contentType: "application/json",
      cache: false

    };

    this.get('personQ').addRequest({ajaxParams:pedigreeAjaxParams, description: "Reading default 9 generations of ancestors"}, "persons");
  },

  pedigreeCB: function (resp) {
    if (console && console.log) {
      console.log('responseStatus:', resp.statusText);
    }
    var data = JSON.parse(resp.responseText);
    if (console && console.log) {
//      console.log("\ndata:", resp.responseText);
    }
    this.set(mapPersons(data.pedigrees.pedigree.persons.person));
  }

});



