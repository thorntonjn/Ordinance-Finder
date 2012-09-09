/**
 * Created by IntelliJ IDEA.
 * User: thorntonjn
 * Date: 3/23/12
 * Time: 10:03 PM
 * To change this template use File | Settings | File Templates.
 */

var Relationship = Backbone.Model.extend({
  url: '',
  defaults: {
    id:"INVAlID"
  },
  initialize: function (options) {
  }

})

var RelationshipView = Backbone.View.extend( {
  el: $('body'), // el attaches to existing element
  events: {
  },
  initialize: function(options){
    _.bindAll(this, 'render', 'fillPersonRelationshipCollapsed', 'fillPersonRelationshipExpanded'); // every function that uses 'this' as the current object should be in here

    this.render();
  },
  render: function(){
    var $personRelationshipCollapsed = $('<div class="relationshipCollapsed cf"></div>'),
        $personRelationshipExpanded = $('<div class="relationshipExpanded cf"></div>');

    $(this.el).empty()
        .append($personRelationshipCollapsed)
        .append($personRelationshipExpanded);

    this.fillPersonRelationshipCollapsed($personRelationshipCollapsed);
    this.fillPersonRelationshipExpanded($personRelationshipExpanded);

  },


  fillPersonRelationshipCollapsed : function ($collapsed) {
    if (this.model.get("hlink")) {
      $collapsed.append(
          $('<a class="person" href=' + this.model.get("hlink") + ' target=_blank><span class="personName">' + this.model.get("ancestorName") + '</span><span class="description">' + this.model.get("description") + '</span>' +
              ' <span class="personId">' + this.model.get("ancestorId") + '</span>' +
              ' <img border="0" alt="This link will exit this site and take you to the FamilySearch website to view the selected ancestors details and allow you to reserve the temple ordinances." src="external_link_icon.gif" target=_blank>' +
              '</a>'));
    }  else {
      $collapsed.append($('<span class="description">' + this.model.get("description") + '</span>'));
    }
//    $addDescendantsLink = $('<a class="button" href="#" personId=' + this.model.get("id") + '>Search Descendants</a>').click(
//        function (e, dom) {
//          var descendantId = $(e.target).attr("personId");
//          readDescendants(descendantId,1);
//          console.log("made it");
//        }
//    );
//    $collapsed.append($addDescendantsLink);
  },

  fillPersonRelationshipExpanded : function ($expanded) {
    var pathText, node, i;
    if (this.model.get("hlink")) {
      $expanded.append(
          $('<a class="person" href=' + this.model.get("hlink") + ' target=_blank><span class="personName">' + this.model.get('ancestorName') + '</span><span class="description">' + this.model.get('description') + '</span>' +
              ' <span class="personId">' + this.model.get('ancestorId') + '</span>' +
              ' <img border="0" alt="This link will exit this site and take you to the FamilySearch website to view the selected ancestors details and allow you to reserve the temple ordinances." src="external_link_icon.gif" target=_blank>' +
              '</a>'));
    }  else {
      $expanded.append($('<span class="description">' + this.model.get('description') + '</span>'));
    }

    if (!this.model.get('path2')) {
      $commonAncestor = $('<div class="commonAncestor">' + this.model.get('ancestorName') || "" + " " + this.model.get('ancestorId') || "" + " " + '</div>');
    }
    else if (this.model.get('path2')[0].id !== this.model.get('ancestorId')) {
      $commonAncestor = $('<div class="commonAncestor">Common Ancestor ' +  this.model.get('path2')[0].id + " " + (this.model.get('path2')[0].gender || "") + '</div>');
    } else if (this.model.get('path2')) {
      $commonAncestor = $('<div class="commonAncestor">' + this.model.get('ancestorName') + " " + this.model.get('path2')[0].id + " " + (this.model.get('path2')[0].gender || "") + '</div>');
    } else {
      $commonAncestor = $('<div class="commonAncestor"></div>');
    }

    $path1 = $('<ul class="pathList"></ul>');

    if (this.model.get('path1') && this.model.get('path1').length > 1) {
      pathText = "";
      for (i = 1; i < this.model.get('path1').length; i++) {
        node = this.model.get('path1')[i];
        pathText = node.id + " " + node.gender || "";
        $path1.append($('<li>'+ pathText + '</li>'));
      }
    }
    if (!this.model.get('path2') || this.model.get('path2')[0].id !== this.model.get('ancestorId')) {
      $path1.append($('<li>' + this.model.get('ancestorName') + '</li>'))
    }

    $path2 = $('<ul class="pathList"></ul>');

    if (this.model.get('path2') && this.model.get('path2').length > 1) {
      pathText = "";
      for (i = 1; i < this.model.get('path2').length; i++) {
        node = this.model.get('path2')[i];
        pathText = node.id + " " + node.gender || "";
        $path2.append($('<li>'+ pathText + '</li>'));
      }
    }
    $path2.append($('<li>' + this.model.get('myName') + '</li>'))

    $paths = $('<div class="paths"></div>')
        .append($path1)
        .append($path2);

    $expanded
        .append($commonAncestor)
        .append($paths);
  }

});

var Relationships = Backbone.Collection.extend({
  model:Relationship,
  defaults:{
    persons:[],
    personIdMap:{}
  },
  initialize: function (models, options) {
    var self = this;
    _.bindAll(this, 'getRelationship', 'fixupRelationshipData'); // every function that uses 'this' as the current object should be in here
    this.relationshipQ = options.relationshipQ;
    this.persons = options.persons;
    this.persons.on('add', function (person){
      self.getRelationship(person, person.get("publicHorizon"),
          function (relationship) {
            self.add(relationship);
          });
    });
  },

  getRelationship :function(person, publicHorizon, callback) {
    var self = this,
        getRelationshipCB =
            function (relationshipResp) {
              var relationshipData = JSON.parse(relationshipResp.responseText);
              callback(self.fixupRelationshipData(relationshipData && relationshipData.relationships ? relationshipData.relationships.relationship : null, person));
            },
        ajaxParams = {
          type: "GET",
          url: '/familytree/v2/relationship/'+ person.id + ":" + publicHorizon + '?&sessionId='+userInfo.sessionId,
          dataType: "json",
          complete: getRelationshipCB,
          data: null,
          contentType: "application/json",
          cache: false
        };
    this.relationshipQ.addRequest({ajaxParams:ajaxParams});
  },

  fixupRelationshipData : function (inRelationship, person) {
    var myPerson = this.persons && this.persons.models.length > 0 ? this.persons.models[0] : {},
        myName =  myPerson ? myPerson.get('name') : "",
        myId = myPerson ? myPerson.get('id') : "",
        connection = inRelationship && inRelationship.connections ? inRelationship.connections.connection : null,
        ancestorId = connection && connection.ancestor ? connection.ancestor["@"].id : "",
        description = connection && connection.description || "",
        hlink = (ancestorId && ancestorId !== myId) ? "https://new.familysearch.org/en/action/hourglassiconicview?bookid=p." + ancestorId +"&svfs=1" : "",
        ancestorName = person.get('name') || "",
        fixPath = function (path) {
          var fixedPath = null, fixedItem;
          if (path && path.length > 0) {
            fixedPath = [];
            for (var i = 0;i < path.length; i++) {
              fixedItem = {};
              fixedItem.id = path[i]['@'].id;
              fixedItem.gender = path[i].gender;
              fixedPath.push(fixedItem);
            }
          }
          return fixedPath;
        },
        getPath = function (index) {
          var pathPerson = connection && connection.persons && connection.persons.person ? connection.persons.person[index] : null,
              pathObj = pathPerson && pathPerson.paths ? pathPerson.paths.path : null;
          return pathObj ? pathObj.node : null;
        },
        outRelationship = {
          id : person.get('id'),
          description : description ? "(" + description + ")" : "",
          hlink : hlink,
          ancestorId : person.get('id'),
          ancestorName : ancestorName,
          myName : myName,
          path1 : fixPath(getPath(0)),
          path2 : fixPath(getPath(1))
        };

    return outRelationship;
  }

});

