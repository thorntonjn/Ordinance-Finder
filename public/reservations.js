

var Reservation = Backbone.Model.extend({
  url: '',
  defaults: {
    id:"INVAlID"
  },
  initialize: function (options) {
//    alert("initialized now read temple and reservation");
    // read relationship
  }

})

var ReservationViewCollapsed = Backbone.View.extend( {
  el: $('body'), // el attaches to existing element
  events: {
//    'click button#add': 'addItem'
  },
  initialize: function(options){
    _.bindAll(this, 
      'render', 
      'getTempleListStatus', 
      'getDateAndPlaceString'); // every function that uses 'this' as the current object should be in here

    this.render();
  },
  render: function(){
    var B = this.model.get('b'),
        C = this.model.get('c'),
        I = this.model.get('i'),
        E = this.model.get('e'),
        SP = this.model.get('sp'),
        SS = this.model.get('ss'),
        statusB = B.status,
        dateAndPlaceB = this.getDateAndPlaceString(B),
        statusC = C.status,
        dateAndPlaceC = this.getDateAndPlaceString(C),
        statusI = I.status,
        dateAndPlaceI = this.getDateAndPlaceString(I),
        statusE = E.status,
        dateAndPlaceE = this.getDateAndPlaceString(E),
        statusSP = this.getTempleListStatus(SP),
        statusSS = this.getTempleListStatus(SS),
        $baptism = $('<span class="ordIcon ' + statusB + ' collapsed-b" title="Baptism ' + statusB + dateAndPlaceB + '">B</span>'),
        $confirmation = $('<span class="ordIcon ' + statusC + ' collapsed-c" title="Confirmation ' + statusC + dateAndPlaceC + '">C</span>'),
        $initiatory = $('<span class="ordIcon ' + statusI + ' collapsed-i" title="Initiatory ' + statusI + dateAndPlaceI + '">I</span>'),
        $endowment = $('<span class="ordIcon ' + statusE + ' collapsed-e" title="Endowment ' + statusE + dateAndPlaceE + '">E</span>'),
        $sealingToParent = $('<span class="ordIcon ' + statusSP + ' collapsed-sp" title="Sealing to Parents ' + statusSP + '">SP</span>'),
        $sealingToSpouse = $('<span class="ordIcon ' + statusSS + ' collapsed-ss" title="Sealing to Spouse ' + statusSS + '">SS</span>');

    $(this.el)
        .empty()
        .append($baptism)
        .append($confirmation)
        .append($initiatory)
        .append($endowment)
        .append($sealingToParent)
        .append($sealingToSpouse);
  },


  getTempleListStatus : function (ords) {
    var status = "NotAvailable";
    var i = 0;
    if (ords) {
      if (ords.length) {
        for (i=0; i < ords.length; i++) {

          if (status === "NotAvailable" || ords[i].status === "Ready") {
            status = ords[i].status;
          }
          if (status === "Ready") {
            break;
          }
        }
      } else if (ords && ords.status){
        status = ords.status;
      }
    }
    return status;
  },

  getDateAndPlaceString : function (o) {
    var dateAndPlace = "";
    if (o.date && o.temple) {
      dateAndPlace = " at " + o.temple + " on " + o.date.normalized;
    } else if (o.date) {
      dateAndPlace = " on " + (o.date.normalized || o.date.original) ;
    } else if (o.temple) {
      dateAndPlace = " at " + o.temple;
    }
    return dateAndPlace;
  }
});


var ReservationViewExpanded = Backbone.View.extend( {
  el: $('body'), // el attaches to existing element
  events: {
  },
  initialize: function(options){
    _.bindAll(this,
        'render',
        'getDateAndPlaceString',
        'createExpandedBCIEOrdinance',
        'createExpandedSPOrdinance',
        'createExpandedSSOrdinance'); // every function that uses 'this' as the current object should be in here

    this.render();
  },
  render: function(){
    $(this.el).empty();

      var B = this.model.get('b') || {},
          C = this.model.get('c') || {} ,
          I = this.model.get('i') || {},
          E = this.model.get('e') || {},
          statusB = B.status || "Not Available",
          dateB = B.date || "",
          placeB = B.temple || "",
          dateAndPlaceB = this.getDateAndPlaceString(B),
          statusC = C.status || "Not Available",
          dateC = C.date || "",
          placeC = C.temple || "",
          dateAndPlaceC = this.getDateAndPlaceString(C),
          statusI = I.status || "Not Available",
          dateI = I.date || "",
          placeI = I.temple || "",
          dateAndPlaceI = this.getDateAndPlaceString(I),
          statusE = E.status || "Not Available",
          dateE = E.date || "",
          placeE = E.temple || "",
          dateAndPlaceE = this.getDateAndPlaceString(E),
          baptism = this.createExpandedBCIEOrdinance("baptism", "Baptism", statusB, dateAndPlaceB, dateB, placeB),
          confirmation = this.createExpandedBCIEOrdinance("confirmation", "Confirmation", statusC, dateAndPlaceC, dateC, placeC),
          initiatory = this.createExpandedBCIEOrdinance("initiatory", "Initiatory", statusI, dateAndPlaceI, dateI, placeI),
          endowment = this.createExpandedBCIEOrdinance("endowment", "Endowment", statusE, dateAndPlaceE, dateE, placeE),
          sealingToParents = this.model.get('sp'),
          sealingToSpouse = this.model.get('ss');

      $(this.el)
          .append(baptism)
          .append(confirmation)
          .append(initiatory)
          .append(endowment);

      if (sealingToParents && sealingToParents.length){
        for ( i = 0; i < sealingToParents.length; i++) {
          $(this.el).append(this.createExpandedSPOrdinance(sealingToParents[i]));
        }
      } else {
        $(this.el).append(this.createExpandedSPOrdinance(null));
      }

      if (sealingToSpouse && sealingToSpouse.length){
        for ( i = 0; i < sealingToSpouse.length; i++) {
          $(this.el).append(this.createExpandedSSOrdinance(sealingToSpouse[i]));
        }
      } else {
        $(this.el).append(this.createExpandedSSOrdinance(null))
      }
  },

  getDateAndPlaceString : function (o) {
    var dateAndPlace = "";
    if (o.date && o.temple) {
      dateAndPlace = " at " + o.temple + " on " + o.date.normalized;
    } else if (o.date) {
      dateAndPlace = " on " + (o.date.normalized || o.date.original) ;
    } else if (o.temple) {
      dateAndPlace = " at " + o.temple;
    }
    return dateAndPlace;
  },

  createExpandedBCIEOrdinance : function(ord1, ord2, status, dateAndPlace, date, place) {
    return $('<div class="templeOrdinanceBCIE ' + status + ' clearfix ' + ord1 + '">' +
        '<div class="largeOrdIcon ordIcon" title="' + ord2 + ' ' + status + dateAndPlace + ' .">B</div>' +
        '<span id="' + ord1 + 'OrdLabel" class="ordLabel">' + ord2 + '</span>' +
        '<div id="' + ord1 + 'OrdState" class="ordState">' +
        '<div id="' + ord1 + 'OrdStatus" class="ordStatus">' + status + '</div>' +
        '<div id="' + ord1 + 'OrdCompletedDate" class="ordCompletedDate">' + date + '</div>' +
        '<div id="' + ord1 + 'OrdCompletedPlace" class="ordCompletedPlace">' + place + '</div></div></div>');
  },

  getParentName : function (sp, role) {
    var parentName = "",
        parentIndex = undefined;

    if (sp && sp.parent && sp.parent[0] && sp.parent[0]["@"].role === role) {
      parentIndex = 0;
    } else if (sp && sp.parent && sp.parent[1] && sp.parent[1]["@"].role === role) {
      parentIndex = 1;
    }

    if (parentIndex !== undefined) {
      if (sp.parent[parentIndex].qualification && sp.parent[parentIndex].qualification.name ) {
        parentName = sp.parent[parentIndex].qualification.name.fullText;
      }
    }
    return parentName;
  },

  getParentId : function (sp, role) {
    var parentId = "",
        parentIndex = undefined;

    if (sp && sp.parent && sp.parent[0] && sp.parent[0]["@"].role === role) {
      parentIndex = 0;
    } else if (sp && sp.parent && sp.parent[1] && sp.parent[1]["@"].role === role) {
      parentIndex = 1;
    }

    if (parentIndex !== undefined) {
      if (sp.parent[parentIndex]["@"]) {
        parentId = sp.parent[parentIndex]["@"].ref;
      }
    }
    return parentId;
  },

  getSpouseName : function (ss) {
    var spouseName = "";

    if (ss && ss.spouse && ss.spouse.qualification && ss.spouse.qualification.name ) {
      spouseName = ss.spouse.qualification.name.fullText;
    }
    return spouseName;
  },

  getSpouseId : function (ss) {
    var spouseId = "";

    if (ss && ss.spouse ) {
      spouseId = ss.spouse["@"].ref;
    }
    return spouseId;
  },

  createExpandedSPOrdinance : function( sp) {
    var ord1 = "sp", ord2 = "Sealing to Parents", status = sp ? sp.status : "NotAvailable",
        dateAndPlace = sp ? this.getDateAndPlaceString(sp) : "",
        date = sp ? (sp.date ? sp.date.normalized || sp.date.original : "") : "",
        place = sp ? (sp.temple ? sp.temple : "") : "",
        fatherName = this.getParentName(sp, "Father"),
        fatherId = this.getParentId(sp, "Father"),
        motherName = this.getParentName(sp, "Mother"),
        motherId = this.getParentId(sp, "Mother"),
        $spOrdinance =
            $('<div class="templeOrdinanceSP ' + status + ' clearfix ' + ord1 + '"> &nbsp;' +
                ' <div class="largeOrdIcon ordIcon" title="' + ord2 + ' ' + status + dateAndPlace + ' .">SP</div>' +
                ' <span id="' + ord1 + 'OrdLabel" class="ordLabel">' + ord2 + '</span>' +
                ' <div id="' + ord1 + 'OrdState" class="ordState">' +
                '   <div id="' + ord1 + 'OrdStatus" class="ordStatus">' + status + '</div>' +
                '   <div id="' + ord1 + 'OrdCompletedDate" class="ordCompletedDate">' + date + '</div>' +
                '   <div id="' + ord1 + 'OrdCompletedPlace" class="ordCompletedPlace">' + place + '</div>'+
                ' </div>' +
                '</div>'),
        $spParentNames =
            $('<div class="spParentNames" style="display: block; ">' +
                ' <div>' +
                '   <div class="spHusbandToWifeLine"></div>' +
                '   <div><a class="person" href="#"><span class="father male fatherName"></span></a></div>' +
                '   <div><a class="person" href="#"><span class="mother female motherName"></span></a></div>' +
                ' </div>' +
                '</div>');

    if (fatherId !== "" || fatherName !== "" || motherId !== "" || motherName !== "" ) {
      $spParentNames.html(
          ' <div>' +
              '   <div class="spHusbandToWifeLine"></div>' +
              '   <div><a class="person" href="https://new.familysearch.org/en/action/hourglassiconicview?bookid=p.' + fatherId + '&amp;svfs=1" target=_blank><span class="father male fatherName" title="' + fatherName +'">' + fatherName +'</span><span><img border="0" alt="This link will exit this site and take you to the FamilySearch website to view the selected ancestors details and allow you to reserve the temple ordinances." src="external_link_icon.gif"></span></a></div>' +
              '   <div><a class="person" href="https://new.familysearch.org/en/action/hourglassiconicview?bookid=p.' + motherId + '&amp;svfs=1" target=_blank><span class="mother female motherName" title="' + motherName +'">' + motherName +'</span><span><img border="0" alt="This link will exit this site and take you to the FamilySearch website to view the selected ancestors details and allow you to reserve the temple ordinances." src="external_link_icon.gif"></span></a></div>' +
              ' </div>');
    }
    $spOrdinance.append($spParentNames);
    return $spOrdinance;
  },

  createExpandedSSOrdinance : function( ss) {
    var ord1 = "ss",
        ord2 = "Sealing to Spouse",
        status = ss ? ss.status : "NotAvailable",
        dateAndPlace = ss ? this.getDateAndPlaceString(ss) : "",
        date = ss ? (ss.date ? ss.date.normalized || ss.date.original : "") : "",
        place = ss ? (ss.temple ? ss.temple : "") : "",
        spouseName = this.getSpouseName(ss),
        spouseId = this.getSpouseId(ss),
        $ssOrdinance =
            $('<div class="templeOrdinanceSS ' + status + ' clearfix ' + ord1 + '"> &nbsp;' +
                ' <div class="largeOrdIcon ordIcon" title="' + ord2 + ' ' + status + dateAndPlace + ' .">SS</div>' +
                ' <span id="' + ord1 + 'OrdLabel" class="ordLabel">' + ord2 + '</span>' +
                ' <div id="' + ord1 + 'OrdState" class="ordState">' +
                '   <div id="' + ord1 + 'OrdStatus" class="ordStatus">' + status + '</div>' +
                '   <div id="' + ord1 + 'OrdCompletedDate" class="ordCompletedDate">' + date + '</div>' +
                '   <div id="' + ord1 + 'OrdCompletedPlace" class="ordCompletedPlace">' + place + '</div>' +
                ' </div>' +
                '</div>'),
        $ssSpouseNames =
            $(' <div class="ssSpouseNames spouseNames" style="display: block; ">' +
                '     <div>' +
                '       <a class="person" href="#"><span class="spouse unknown spouseName" ></span></a>' +
                '     </div>' +
                ' </div>');

    if (spouseId !== "" || spouseName !== "") {
      $ssSpouseNames.html(
          '<div>' +
              ' <div>' +
              '   <a class="person" href="https://new.familysearch.org/en/action/hourglassiconicview?bookid=p.' + spouseId + '&amp;svfs=1" target=_blank><span class="spouse unknown spouseName" title="' + spouseName +'">' + spouseName +'</span><span><img border="0" alt="This link will exit this site and take you to the FamilySearch website to view the selected ancestors details and allow you to reserve the temple ordinances." src="external_link_icon.gif"></span></a>' +
              ' </div>' +
              '</div>');
    }
    $ssOrdinance.append($ssSpouseNames);
    return $ssOrdinance;
  }


});

var Reservations = Backbone.Collection.extend({
  model:Reservation,
  defaults:{
    persons:[],
    personIdMap:{}
  },
  initialize: function (models, options) {
    var self = this;
    _.bindAll(this, 'getTempleReservation', 'fixupReservationData'); // every function that uses 'this' as the current object should be in here
    this.reservationQ = options.reservationQ;
    this.persons = options.persons;
    this.persons.on('add', function (person){
      self.getTempleReservation(person.id,
          function (reservation) {
            self.add(reservation);
          });
    });
  },

  getTempleReservation :function(id, callback) {
    var self = this,
        reservationCB =
            function(reservationResponse) {
              var reservationData = JSON.parse(reservationResponse.responseText);
              callback(self.fixupReservationData(reservationData && reservationData.persons ? reservationData.persons.person : {}, id));
            },
        ajaxParams = {
          type: "GET",
          url:"/reservation/v1/person/" + id + "/?view=rollup&view=ordinances&view=reservations&spouses=all&parents=all&sessionId=" + userInfo.sessionId,
          dataType:"json",
          complete: reservationCB,
          data:null,
          contentType:"application/json",
          cache:false
        };

    this.reservationQ.addRequest({ajaxParams:ajaxParams});

  },

  fixupReservationData : function (inReservation, id) {
    var q = inReservation ? inReservation.qualification : null,
        event = q && q.events ? q.events.event : null;
        eventType = event && event['@'] ? event['@'].type : "",
        eventDate = event && event.date && event.date.normalized ? event.date.normalized : event && event.date && event.date.original ? event.date.original : "",
        eventPlace = event && event.place && event.place.normalized ? event.place.normalized["#"] : event && event.place && event.place.original ? event.place.original : "",
        gender = q ? q.gender: "";
        name = q && q.name && q.name.fullText ? q.name.fullText : "",
        getParent = function (o, role) {
          var parent;
          if (o.parents && o.parents.length) {
            for (var i = 0; i < o.parents.length; i++ ){
              parent = o.parents[i];
              if (parent['@'].role = role) {
                return parent;
              }
            }
          }
          return null;
        },
        mother = function () {

        },
        getOrdinance = function (inOrdinance) {
          var status = inOrdinance && inOrdinance['@'] ? inOrdinance['@'].status : "INVALID",
              temple = inOrdinance && inOrdinance.temple && inOrdinance.temple['@'] ? inOrdinance.temple['@'].code : "",
              date = inOrdinance && inOrdinance.date && inOrdinance.date.normalized ? inOrdinance.date.normalized : inOrdinance && inOrdinance.date && inOrdinance.date.original ? inOrdinance.date.original : "",
              spouse = inOrdinance ? inOrdinance.spouse:undefined,
              spouseId = spouse ? spouse['@'].id : "",
              ssq = spouse ? spouse.qualification : undefined,
              spouseName = ssq && ssq.name ? ssq.name.fullText : undefined,
              spouseGender = ssq ? ssq.gender: undefined,
              father = getParent(inOrdinance, "Father"),
              fatherId = father ? father['@'].id : "",
              spq_father = father ? father.qualification : undefined,
              fatherName = spq_father && spq_father.name ? spq_father.name.fullText : undefined,
              fatherGender = spq_father && spq_father.gender,
              mother = getParent(inOrdinance, "Mother"),
              motherId = mother ? mother['@'].id : "",
              spq_mother = mother ? mother.qualification : undefined,
              motherName = spq_mother && spq_mother.name ? spq_mother.name.fullText : undefined,
              motherGender = spq_mother && spq_mother.gender,
              outOrdinance = {
                status:status,
                spouseId:spouseId,
                spouseName:spouseName,
                spouseGender:spouseGender,
                fatherId:fatherId,
                fatherName:fatherName,
                fatherGender:fatherGender,
                motherId:motherId,
                motherName:motherName,
                motherGender:motherGender,
                temple:temple,
                date:date
              };
          return outOrdinance;
        },
        outReservation = {
          id:id,
          name: name,
          gender:gender,
          status : inReservation && inReservation['@'] ? inReservation['@'].status : "INVALID",
          eventType:eventType,
          eventDate:eventDate,
          eventPlace:eventPlace,
          b:getOrdinance(inReservation.baptism),
          c:getOrdinance(inReservation.confirmation),
          i:getOrdinance(inReservation.initiatory),
          e:getOrdinance(inReservation.endowment),
          sp:[],
          ss:[]
        };

    // fix up Need More Information Status
    if (outReservation.status === "Need More Information") {
      outReservation.status = "NeedMoreInformation";
    }

    if (inReservation.sealingToParents) {
      if (inReservation.sealingToParents.length) {
        for (i = 0; i < inReservation.sealingToParents.length; i++) {
          outReservation.sp.push(getOrdinance(inReservation.sealingToParents[i]));
        }
      } else {
        outReservation.sp.push(getOrdinance(inReservation.sealingToParents));
      }
    }

    if (inReservation.sealingToSpouse) {
      if (inReservation.sealingToSpouse.length > 0) {
        for (i = 0; i < inReservation.sealingToSpouse.length; i++) {
          outReservation.ss.push(getOrdinance(inReservation.sealingToSpouse[i]));
        }
      } else {
        outReservation.ss.push(getOrdinance(inReservation.sealingToSpouse));
      }
    }

    return outReservation;
  }

});
