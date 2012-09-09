/**
 * Created with IntelliJ IDEA.
 * User: thorntonjn
 * Date: 8/31/12
 * Time: 7:01 PM
 * To change this template use File | Settings | File Templates.
 */
var Ancestor = Backbone.Model.extend({
  url:'',
  defaults:{
    person:{},
    relationship:{},
    reservation:{}
  },
  initialize:function () {
  }
});


var AncestorView = Backbone.View.extend({
  events:{
    'click a.expandAncestor':'expandView',
    'click a.collapseAncestor':'collapseView'
  },
  initialize:function (options) {
    _.bindAll(this, 'render', 'expandView', 'collapseView'); // every function that uses 'this' as the current object should be in here
    this.model.bind('change', this.render); // collection event binder
    this.render();
  },
  render:function () {
    var person = this.model.get("person"),
        relationship = this.model.get("relationship"),
        reservation = this.model.get("reservation"),
        personEl = $('<div class="gadget personSummaryGadget"></div>'),
        reservationEl = $('<div class="gadget templeOrdinancesGadget loaded">' +
            '<span class="templeOrdinancesCollapsed cf"></span>' +
            '<div class="templeOrdinancesExpanded cf">' +
            '<h4>Temple Ordinances</h4></div></div></div>'),
        reservationCollapsedEl = $('.templeOrdinancesCollapsed', reservationEl),
        reservationExpandedEl = $('.templeOrdinancesExpanded', reservationEl),
        relationshipEl = $('<div class="relationship cf"></div>'),
        ancestorSection = $('<section class="ancestorSection expanded">' +
            '<a href="#" class="expandAncestor">&#43; Show Details </a>' +
            '<a href="#" class="collapseAncestor">&#43; Hide Details </a>' +
            '</section>');

    $(this.el).empty();

    if (person) {
      ancestorSection.append(personEl);
      this.personView = new PersonView({el:personEl, model:person});
    }

    if (relationship) {
      ancestorSection.append(relationshipEl);
      this.relationshipView = new RelationshipView({el:relationshipEl, model:relationship});
    }

    if (reservation) {
      ancestorSection.append(reservationEl);
      this.reservationViewCollapsed = new ReservationViewCollapsed({el:reservationCollapsedEl, model:reservation});
      this.reservationViewExpanded = new ReservationViewExpanded({el:reservationExpandedEl, model:reservation});
    }
    $(this.el).append(ancestorSection);

  },

  expandView:function () {
    if ($('.ancestorSection', this.el).hasClass("collapsed")) {
      $('.ancestorSection', this.el).removeClass("collapsed");
    }
    if (!$('.ancestorSection', this.el).hasClass("expanded")) {
      $('.ancestorSection', this.el).addClass("expanded");
    }
  },

  collapseView:function () {
    if ($('.ancestorSection', this.el).hasClass("expanded")) {
      $('.ancestorSection', this.el).removeClass("expanded");
    }
    if (!$('.ancestorSection', this.el).hasClass("collapsed")) {
      $('.ancestorSection', this.el).addClass("collapsed");
    }
  }
});

var Ancestors = Backbone.Collection.extend({
  model:Ancestor,
  defaults:{
    ancestors:[]
  },
  initialize:function (models, options) {
    var self = this;
    var persons = models.persons;
    var relationships = models.relationships;
    var reservations = models.reservations;
    var handleModelChange = function (change) {
      var id = change.get("id");
      if (id === "INVAlID") {
        throw ("INVAlID");
      }
      var modelIterator = function (model) {
        return model.get("id") === id;
      };
      var person = _.find(persons.models, modelIterator);
      var relationship = _.find(relationships.models, modelIterator);
      var reservation = _.find(reservations.models, modelIterator);
      var original = _.find(self.models, function (ancestor) {
        return (ancestor.get("person").id === id);
      });

      if (original) {
        original.set({person:person, relationship:relationship, reservation:reservation});
      } else {
        var ancestor = new Ancestor({person:person, relationship:relationship, reservation:reservation });
        self.add(ancestor);
      }

    };

    persons.on('add', handleModelChange);
    relationships.on('add', handleModelChange);
    reservations.on('add', handleModelChange);

  }
});

var AncestorsView = Backbone.View.extend({
  events:{
    'click a.show-ready':'showReady',
    'click a.hide-ready':'hideReady',
    'click a.show-need-work':'showNeedWork',
    'click a.hide-need-work':'hideNeedWork',
    'click a.show-complete':'showComplete',
    'click a.hide-complete':'hideComplete',
    'click a.show-reserved':'showReserved',
    'click a.hide-reserved':'hideReserved',
    'click a.show-unknown':'showUnknown',
    'click a.hide-unknown':'hideUnknown',
    'click a.show-ready-baptism':'showReadyBaptism',
    'click a.hide-ready-baptism':'hideReadyBaptism',
    'click a.show-ready-confirmation':'showReadyConfirmation',
    'click a.hide-ready-confirmation':'hideReadyConfirmation',
    'click a.show-ready-initiatory':'showReadyInitiatory',
    'click a.hide-ready-initiatory':'hideReadyInitiatory',
    'click a.show-ready-endowment':'showReadyEndowment',
    'click a.hide-ready-endowment':'hideReadyEndowment',
    'click a.show-ready-sealing-to-parents':'showReadySP',
    'click a.hide-ready-sealing-to-parents':'hideReadySP',
    'click a.show-ready-sealing-to-spouse':'showReadySS',
    'click a.hide-ready-sealing-to-spouse':'hideReadySS'

  },

  initialize:function (options) {
    _.bindAll(this, 'render', 'updateItem', 'appendItem', 'updateDashboard', '' +
        'prepareOrdinanceContainers', 'prepareOrdinanceContainer', 'prepareAncestorContainer'); // every function that uses 'this' as the current object should be in here
    this.collection.bind('add', this.appendItem); // collection event binder
    this.render();
  },

  render:function () {
  },

  appendItem:function (ancestor) {
    this.ancestorView = new AncestorView({
      el:this.prepareAncestorContainer(ancestor),
      model:ancestor
    });
    ancestor.bind('change', this.updateItem);
    this.updateDashboard();
  },

  updateItem:function (ancestor) {
    this.prepareAncestorContainer(ancestor);
    var containers = this.prepareOrdinanceContainers(ancestor);
    for (var i = 0; i < containers.length; i++) {
      this.ancestorView = new AncestorView({
        el:containers[i],
        model:ancestor
      });
    }
    this.updateDashboard();
  },

  updateDashboard:function () {
    var ancestors = this.collection,
        ancestorsProcessed = 0,
        readyCount = 0,
        needMoreInformationCount = 0,
        reservedCount = 0,
        completedCount = 0,
        baptismReadyCount = 0,
        confirmationReadyCount = 0,
        initiatoryReadyCount = 0,
        endowmentReadyCount = 0,
        sealingToParentsReadyCount = 0,
        sealingToSpouseReadyCount = 0,
        dashboard = this.options.dashboard;

    ancestors.each(function (ancestor) {
      var person = ancestor.get('person'),
          relationship = ancestor.get('relationship'),
          reservation = ancestor.get('reservation');

      if (reservation && reservation.id) {
        ancestorsProcessed += 1;
        switch (reservation.get('status')) {
          case 'Ready':
            readyCount += 1;
            
            if (reservation.get('b').status === "Ready" ) {
              baptismReadyCount += 1;
            }
            if (reservation.get('c').status === "Ready") {
              confirmationReadyCount += 1;  
            }
            if (reservation.get('i').status === "Ready") {
              initiatoryReadyCount += 1;
            }
            if (reservation.get('e').status === "Ready") {
              endowmentReadyCount += 1;
            }
            sp = reservation.get('sp');
            if (sp && sp.length > 0) {
              for (var i = 0; i < sp.length; i++ ) {
                if (sp[i].status === "Ready") {
                  sealingToParentsReadyCount +=1;
                }
              }
            }
            ss = reservation.get('ss');
            if (ss && ss.length > 0) {
              for (var i = 0; i < ss.length; i++ ) {
                if (ss[i].status === "Ready") {
                  sealingToSpouseReadyCount +=1;
                }
              }
            }
            break;
          case 'Completed':
            completedCount += 1;
            break;
          case 'Reserved':
            reservedCount += 1;
            break;
          case 'NeedMoreInformation':
            needMoreInformationCount += 1;
            break;
          default:
            break;
        }
      }
    });

    dashboard.set({
      ancestorsProcessed:ancestorsProcessed,
      readyCount:readyCount,
      needMoreInformationCount:needMoreInformationCount,
      reservedCount:reservedCount,
      completedCount:completedCount
    });


    $('.label.ready-count', this.el).html(readyCount);
    $('.label.need-work-count', this.el).html(needMoreInformationCount);
    $('.label.reserved-count', this.el).html(reservedCount);
    $('.label.complete-count', this.el).html(completedCount);
    $('.label.unknown-count', this.el).html(this.collection.length - ancestorsProcessed - 1);
    
    $('.label.baptism-ready-count', this.el).html(baptismReadyCount);
    $('.label.confirmation-ready-count', this.el).html(confirmationReadyCount);
    $('.label.initiatory-ready-count', this.el).html(initiatoryReadyCount);
    $('.label.endowment-ready-count', this.el).html(endowmentReadyCount);
    $('.label.sealing-to-parents-ready-count', this.el).html(sealingToParentsReadyCount);
    $('.label.baptism-ready-count', this.el).html(baptismReadyCount);
    $('.label.sealing-to-spouse-ready-count', this.el).html(sealingToSpouseReadyCount);

  },

  getAncestorContainerId:function (ancestor) {
    if (!ancestor.get("person") || !ancestor.get("person").get("id")) {
      throw ("ancestor without person should not happen !");
    }
    return ancestor.get("person").get("id") + "_ANCESTOR";
  },

  getAncestorDivStatus:function ($ancestorDiv) {
    var state = "NONE";

    if ($ancestorDiv.length) {
      if ($ancestorDiv.hasClass("Ready")) {
        state = "Ready";
      } else if ($ancestorDiv.hasClass("Reserved")) {
        state = "Reserved";
      } else if ($ancestorDiv.hasClass("NeedsMoreInformation")) {
        state = "Need More Information";
      } else if ($ancestorDiv.hasClass("Completed")) {
        state = "Completed";
      }
    }
    return state;
  },

  appendAncestorByStatus:function ($ancestorDiv, status) {
    switch (status) {
      case "Ready":
        $ancestorDiv.appendTo(".ancestors-ready .ancestor-section", this.el);
        break;
      case "Reserved":
        $ancestorDiv.appendTo(".ancestors-reserved .ancestor-section", this.el);
        break;
      case "NeedMoreInformation":
        $ancestorDiv.appendTo(".ancestors-need-work .ancestor-section", this.el);
        break;
      case "Completed" :
        $ancestorDiv.appendTo(".ancestors-complete .ancestor-section", this.el);
        break;
      default:
        $ancestorDiv.appendTo(".ancestors-unknown .ancestor-section", this.el);
        break;
    }
  },

  appendAncestorByOrdinanceType:function ($ancestorDiv, ordinanceType) {
    $ancestorDiv.appendTo('.ordinances-ready.' + ordinanceType +  ' .ancestor-section', this.el);
  },

  prepareOrdinanceContainer: function (containers, baseContainerId, ordinance, ordinanceName, index) {
    var containerId = baseContainerId + "_" + ordinanceName + index,
        status = ordinance.status ? ordinance.status : "NotAvailable",
        $ancestorDiv = $("#" + containerId),
        originalStatus = this.getAncestorDivStatus($ancestorDiv),
        newContainer;
    if ($ancestorDiv.length) {
      if (originalStatus !== status) {
        // Status has changed so we need to change its status and move it to the proper container
        $ancestorDiv.removeClass(originalStatus).addClass(status);
        $ancestorDiv = $ancestorDiv.detach();
        this.appendAncestorByOrdinanceType($ancestorDiv, ordinanceName);
      }
    } else {
      if (status === "Ready") {
        // This is a new ancestor object
        $ancestorDiv = $('<div id="' + containerId + '" class="ancestor"></div>')
        this.appendAncestorByOrdinanceType($ancestorDiv, ordinanceName);
        containers.push($ancestorDiv);
      }
    }
  },

  prepareOrdinanceContainers:function (ancestor) {
    var containers = [],
        reservation = ancestor.get("reservation"),
        b = reservation ? reservation.get("b") : null,
        c = reservation ? reservation.get("c") : null,
        i = reservation ? reservation.get("i") : null,
        e = reservation ? reservation.get("e") : null,
        sp = reservation ? reservation.get("sp") : null,
        ss = reservation ? reservation.get('ss') : null,
        containerId = this.getAncestorContainerId(ancestor);

    if (reservation)  {
      if (b) {
        this.prepareOrdinanceContainer(containers, containerId, b, "baptism", "");
      }
      if (c) {
        this.prepareOrdinanceContainer(containers, containerId, c, "confirmation", "");
      }
      if (i) {
        this.prepareOrdinanceContainer(containers, containerId, i, "inititory", "");
      }
      if (e) {
        this.prepareOrdinanceContainer(containers, containerId, e, "endowment", "");
      }

      if (sp && sp.length > 0) {
        for (var i = 0; i < sp.length; i++ ) {
          this.prepareOrdinanceContainer(containers, containerId, sp[i], "sealing-to-parents", i);
        }
      }
      if (ss && ss.length > 0) {
        for (var i = 0; i < ss.length; i++ ) {
          this.prepareOrdinanceContainer(containers, containerId, ss[i], "sealing-to-spouse", i);
        }
      }
    }
    return containers;
  },

  prepareAncestorContainer:function (ancestor) {
    var reservation = ancestor.get("reservation"),
        containerId = this.getAncestorContainerId(ancestor),
        status = reservation ? reservation.get('status') : "NONE",
        $ancestorDiv = $('#' + containerId),
        originalStatus = this.getAncestorDivStatus($ancestorDiv);

    if ($ancestorDiv.length) {
      if (originalStatus !== status) {
        // Status has changed so we need to change its status and move it to the proper container
        $ancestorDiv.removeClass(originalStatus).addClass(status);
        $ancestorDiv = $ancestorDiv.detach();
        this.appendAncestorByStatus($ancestorDiv, status);
      }
    } else {
      // This is a new ancestor object
      $ancestorDiv = $('<div id="' + containerId + '" class="ancestor"></div>')
      this.appendAncestorByStatus($ancestorDiv, status);
    }

    return $ancestorDiv;

  },

  hideAll:function (e) {
    this.hideReady();
    this.hideNeedWork();
    this.hideComplete();
    this.hideReserved();
    this.hideUnknown();
    this.hideReadyBaptism();
    this.hideReadyConfirmation();
    this.hideReadyInitiatory();
    this.hideReadySP();
    this.hideReadySS();
  },

  showBoth:function() {
    $('section.ancestors', this.el).removeClass("hide");
    $('section.ordinances', this.el).removeClass("hide");
  },

  hideLeft:function() {
    $('section.ancestors', this.el).addClass("hide");
  },

  hideRight:function() {
    $('section.ordinances', this.el).addClass("hide");
  },

  showReady:function (e) {
    this.hideAll();
    $('section.ancestors', this.el).addClass("ready");
    $(".ancestors-ready section.ancestor-section").removeClass("hide");
    this.hideRight();
  },

  hideReady:function (e) {
    $('section.ancestors', this.el).removeClass("ready");
    $(".ancestors-ready section.ancestor-section").addClass("hide");
    this.showBoth();
  },

  showNeedWork:function (e) {
    this.hideAll();
    $('section.ancestors', this.el).addClass("need-work");
    $(".ancestors-need-work section.ancestor-section").removeClass("hide");
    this.hideRight();

  },

  hideNeedWork:function (e) {
    $('section.ancestors', this.el).removeClass("need-work");
    $(".ancestors-need-work section.ancestor-section").addClass("hide");
    this.showBoth();
  },

  showComplete:function (e) {
    this.hideAll();
    $('section.ancestors', this.el).addClass("complete");
    $(".ancestors-complete section.ancestor-section").removeClass("hide");
    this.hideRight();
  },

  hideComplete:function (e) {
    $('section.ancestors', this.el).removeClass("complete");
    $(".ancestors-complete section.ancestor-section").addClass("hide");
    this.showBoth();
  },

  showReserved:function (e) {
    this.hideAll();
    $('section.ancestors', this.el).addClass("reserved");
    $(".ancestors-reserved section.ancestor-section").removeClass("hide");
    this.hideRight();
  },

  hideReserved:function (e) {
    $('section.ancestors', this.el).removeClass("reserved");
    $(".ancestors-reserved section.ancestor-section").addClass("hide");
    this.showBoth();
  },

  showUnknown:function (e) {
    this.hideAll();
    $('section.ancestors', this.el).addClass("unknown");
    $(".ancestors-unknown section.ancestor-section").removeClass("hide");
    this.hideRight();
  },

  hideUnknown:function (e) {
    $('section.ancestors', this.el).removeClass("unknown");
    $(".ancestors-unknown section.ancestor-section").addClass("hide");
    this.showBoth();
  },

  showReadyBaptism:function (e) {
    this.hideAll();
    $('section.ordinances', this.el).addClass("ready-baptism");
    $(".ordinances-ready.baptism section.ancestor-section").removeClass("hide");
    this.hideLeft();
  },

  hideReadyBaptism:function (e) {
    $('section.ordinances', this.el).removeClass("ready-baptism");
    $(".ordinances-ready.baptism section.ancestor-section").addClass("hide");
    this.showBoth();
  },

  showReadyConfirmation:function (e) {
    this.hideAll();
    $('section.ordinances', this.el).addClass("ready-confirmation");
    $(".ordinances-ready.confirmation section.ancestor-section").removeClass("hide");
    this.hideLeft();
  },

  hideReadyConfirmation:function (e) {
    $('section.ordinances', this.el).removeClass("ready-confirmation");
    $(".ordinances-ready.confirmation section.ancestor-section").addClass("hide");
    this.showBoth();
  },
  
  showReadyInitiatory:function (e) {
    this.hideAll();
    $('section.ordinances', this.el).addClass("ready-initiatory");
    $(".ordinances-ready.initiatory section.ancestor-section").removeClass("hide");
    this.hideLeft();
  },

  hideReadyInitiatory:function (e) {
    $('section.ordinances', this.el).removeClass("ready-initiatory");
    $(".ordinances-ready.initiatory section.ancestor-section").addClass("hide");
    this.showBoth();
  },
  
  showReadyEndowment:function (e) {
    this.hideAll();
    $('section.ordinances', this.el).addClass("ready-endowment");
    $(".ordinances-ready.endowment section.ancestor-section").removeClass("hide");
    this.hideLeft();
  },

  hideReadyEndowment:function (e) {
    $('section.ordinances', this.el).removeClass("ready-endowment");
    $(".ordinances-ready.endowment section.ancestor-section").addClass("hide");
    this.showBoth();
  },
  
  showReadySP:function (e) {
    this.hideAll();
    $('section.ordinances', this.el).addClass("ready-sealing-to-parents");
    $(".ordinances-ready.sealing-to-parents section.ancestor-section").removeClass("hide");
    this.hideLeft();
  },

  hideReadySP:function (e) {
    $('section.ordinances', this.el).removeClass("ready-sealing-to-parents");
    $(".ordinances-ready.sealing-to-parents section.ancestor-section").addClass("hide");
    this.showBoth();
  },
  
  showReadySS:function (e) {
    this.hideAll();
    $('section.ordinances', this.el).addClass("ready-sealing-to-spouse");
    $(".ordinances-ready.sealing-to-spouse section.ancestor-section").removeClass("hide");
    this.hideLeft();
  },

  hideReadySS:function (e) {
    $('section.ordinances', this.el).removeClass("ready-sealing-to-spouse");
    $(".ordinances-ready.sealing-to-spouse section.ancestor-section").addClass("hide");
    this.showBoth();
  }
  


});