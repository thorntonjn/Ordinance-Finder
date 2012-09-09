/**
 * Created by IntelliJ IDEA.
 * User: thorntonjn
 * Date: 3/23/12
 * Time: 10:09 PM
 * To change this template use File | Settings | File Templates.
 */

var readDescendantChildren = function(family, level) {
  var child, i;
  if (family.child && family.child.length > 0) {
    for ( i = 0; i < family.child.length; i++) {
      child = family.child[i];
      var id = child["@"].id;
      if (!isPersonMapped(child)){
        mapPerson(child);
        readDescendants(child["@"].id, level + 1);
      }
    }
  }
}


var readMoreDescendants = function () {
  var i;
  var person;
  var id;
  for (i=0; i < persons.length; i++) {
    person = persons[i];
    if (!persons.haveReadDescendants) {
      id = person["@"].id;
      readDescendants(id, 0);
    }
  }

}


var readDescendants = function(personId, level) {
  if (level === 1) {
    return;
  }
  $(".progressRequest").text("Reading Descendants");
  if (console && console.log) {
    console.log("readPedigree:");
    console.log("http://www.dev.usys.org/familytree/v2/person/" + personId + "?families=all&children=all&properties=all");
    var userInfo = JSON.parse($("p.userinfo").text());
    console.log("userInfo:" + JSON.stringify(userInfo));
  }

  var descendantReadCB = function (resp) {
    if (console && console.log) {
      console.log('responseStatus:', resp.statusText);
    }
    var data = JSON.parse(resp.responseText);
    if (console && console.log) {
      console.log("\ndata:", resp.responseText);
    }
    if (!data.persons) {
      console.log("ERROR");
      return;
    }
    var p = data.persons.person;
    var newPersons = [p];
    var family;
    var i;
    persons.push(p);

//    var filteredPersons = filterPersons(persons);

    console.log("\nPersons Read:" + persons.length);
    $(".progressRequest").text("Reading Temple Ordinance Information");
//    $("div.progress .ancestorsRead").html("Persons Read:" + persons.length + " Lifespan after 1600 " + filteredPersons.length);
    $(".ancestorsRead").html("Persons Read:" + persons.length);

    getTemplePersonStatus(newPersons);

    if (p.families.family.length) {
      for (i= 0; i < p.families.family.length; i++) {
        family = p.families.family[i];
        readDescendantChildren(family, level);
      }
    } else {
      family = p.families.family;
      readDescendantChildren(family, level);
    }

  };

  var personFamiliesAjaxParams = {
    type: "GET",
    url: '/familytree/v2/person/' + personId + '?families=all&children=all&properties=all&sessionId='+userInfo.sessionId,
    complete: descendantReadCB,
    data: null,
    contentType: "application/json",
    cache: false
  };

  enqueueRequest({ajaxParams:personFamiliesAjaxParams, description:("descendant families and children for " + personId) }, "persons");
  p.haveReadDescendants = true;

}
