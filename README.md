ordinanceFinder
==========

Find work needing to be done for your ancestors using familysearch.org API.
<table style="text-align:left">
  <thead>
    <tr>
         <th> Authenticate Via                                                                                                             <th> Credits
    </tr>
  </thead>
  <tbody>
    <tr> <td> Password                                                                                                                     <td>
    <tr> <td>  FamilySearch.org OAuth      <td> <a href="https://github.com/rocketlabsdev">Tim Shadel</a>
    <tr> <td>    EveryAuth  <td> <a href="https://github.com/rocketlabsdev">Brian Noguchi</a>
  </tbody>
</table>


## Installation
    $ npm install

## Quick Start
cd into base directory
node server.js
select go button
enter familysearch.org credentials

Ordinances are displayed by Ancestor
A summary of the Ancestor is first displayed with name, lifespan

Next a relationship path is shown from logged in person to ancestor

The temple ordinances are shown last.
Their status is shown along with other information such as spouse and parents

Ancestors are displayed on the left side according to overall status
READY - At least one ordinance is available to be reserved
Needs More information - The ancestor requires more genealogical research to be performed
Reserved - This ancestors ordinances are currently reserved by someone who is in process of completing them at the temple.
Completed - These individuals temple work has been completed.
Unknown - The status for these ancestors can not be determined.


The right side displays ancestors by ready ordinance type.
Baptism
Confirmation
Initiatory
Endowment
Sealing To Parent
Sealing To Spouse

The application refers one to new.familysearch.org to follow the standard proceedure for reserving ordinances.

#####
Known issues
API issues causing parsing errors

### Author
Joel Thornton

### Credits

Thanks to the following contributors for the following modules:

- [Tim Shadel](https://github.com/timshadel) for contributing
  - familySearch authentication
- [Brian Noguchi](https://github.com/bnoguchi/everyauth)

