function setVisibilityofPatienten() {
	document.getElementById("patienten1").style.display = "block";
  document.getElementById("termine1").style.display = "none";
	document.getElementById("aerzte1").style.display = "none";	

  document.getElementById("PatientenButton").style.fontWeight = "bold";
  document.getElementById("TermineButton").style.fontWeight = "normal";
  document.getElementById("AerzteButton").style.fontWeight = "normal";

  document.getElementById("patienthome").style.display = "block";
  document.getElementById("editPatient").style.display = "none";
  document.getElementById("addnewpatient").style.display = "none";

}

function setVisibilityofTermine() {
	document.getElementById("patienten1").style.display = "none";
  document.getElementById("termine1").style.display = "block";
	document.getElementById("aerzte1").style.display = "none";	

  document.getElementById("PatientenButton").style.fontWeight = "normal";
  document.getElementById("TermineButton").style.fontWeight = "bold";
  document.getElementById("AerzteButton").style.fontWeight = "normal";
}

function setVisibilityofAerzte() {
  document.getElementById("patienten1").style.display = "none";
  document.getElementById("termine1").style.display = "none";
	document.getElementById("aerzte1").style.display = "block";	

  document.getElementById("PatientenButton").style.fontWeight = "normal";
  document.getElementById("TermineButton").style.fontWeight = "normal";
  document.getElementById("AerzteButton").style.fontWeight = "bold";
}

function loadPatientTable() {
  var xhttp = new XMLHttpRequest();
  console.log("Getting Data");

  xhttp.onreadystatechange = function() {	  
    if (this.readyState == 4 && this.status == 200) {
      patientData = JSON.parse(this.responseText);
      console.log(patientData);

      var table = "";
      table += '<tr>' + '<th>' + 'Id' + '</th>' + '<th>' + 'Titel' + '</th>'  + '<th>' + 'Vorname' + '</th>'  + '<th>' + 'Nachname' + '</th>' + '<th>' + 'Svnr' + '</th>' + '<th>' + 'Geburtsdatum' + '</th>' + '<th>' + 'Geschlecht' + '</th>' + '<th>' + '</th>' + '<th>' + '</th>' +'</tr>';
    
      for (i = 0; i < patientData.length; i++) { 
        table += "<tr>";
        for(p = 0; p < patientData[i].length; p++) {
          if(p == 5) {
            table += "<td>" +
            new Date(patientData[i][p]).toLocaleDateString() + 
            "</td>";
          }
          else{
            table += "<td>" +
            patientData[i][p] + 
            "</td>";
          }
          
        }
        table += "<td> <button onclick='editPatient("+ patientData[i][0] +")'>Bearbeiten</button> </td>"
        table += "<td> <button onclick='showTerminePatient(" + patientData[i][0] + ")'>Termine</button> </td>"

        table += "</tr>";
      }

      document.getElementById("patiententable").innerHTML = table;
    }
  };

  xhttp.open("GET", "http://127.0.0.1:5000/patient", true);
  xhttp.send();
  xhttp
}
  
async function newPatient() {
  await fetch('http://127.0.0.1:5000/patient/', {
    method: 'Post',
  body: JSON.stringify({
    titel: document.getElementById('titel').value,
    geburtsdatum: document.getElementById('gebdat').value,
    geschlecht: document.getElementById('geschlecht').value,
    nachname: document.getElementById('nachname').value,
    svnr: document.getElementById('svnr').value,
    vorname: document.getElementById('vorname').value
    }),
    headers: {
    "Content-type": "application/json; charset=UTF-8"
    }
  })
  .then(response => response.json())
  .then(json => console.log(json))

  document.getElementById("patienthome").style.display = "block";
  document.getElementById("addnewpatient").style.display = "none";

  loadPatientTable.call();
}

function togglePatientVisibility(){
    document.getElementById("patienthome").style.display = "none";
    document.getElementById("addnewpatient").style.display = "block";
}

function editPatient(id) {
  console.log("Editing Patient of id: " + id)
  document.getElementById("patienthome").style.display = "none";
  document.getElementById("editPatient").style.display = "block";

  var xhttp = new XMLHttpRequest();

  
  
  xhttp.onreadystatechange = function() {	  
    if (this.readyState == 4 && this.status == 200) {
      patientData = JSON.parse(this.responseText);

      document.getElementById('editvorname').value = patientData[0][2];
      document.getElementById('edittitel').value = patientData[0][1];
      document.getElementById('editnachname').value = patientData[0][3];
      document.getElementById('editsvnr').value = patientData[0][4];
      document.getElementById('editgeschlecht').value = patientData[0][6];
      let date = new Date(patientData[0][5]).toISOString().substring(0,10);
      document.getElementById('editgebdat').value = date;

    }
  };

  xhttp.open("GET", "http://127.0.0.1:5000/patient/" + id, true);
  xhttp.send();

  document.getElementById("editbutton").setAttribute("onclick", "editPatientToDatabase(" + id + ")")
  document.getElementById("deletebutton").setAttribute("onclick", "showDeleteConfirmPatient(" + id + ")")
}

function showDeleteConfirmPatient(id) {
  document.getElementById("dialog-confirmPatient").style.display = "block";

  $( function() {
    $( "#dialog-confirmPatient" ).dialog({
      resizable: false,
      height: "auto",
      width: 400,
      modal: true,
      buttons: {
        Löschen: function() {
          deletePatientFromDatabase(id);
          $( this ).dialog( "close" );
        },
        Cancel: function() {
          $( this ).dialog( "close" );
        }
      }
    });
  } );
}

async function editPatientToDatabase(id) {
  console.log("ID is:" + id);

  var date = new Date(document.getElementById('editgebdat').value);

  date.setHours(date.getHours() + 2);

  await fetch('http://127.0.0.1:5000/patient/' + id, {
    method: 'PUT',
  body: JSON.stringify({
    id: id,
    titel: document.getElementById('edittitel').value,
    geburtsdatum: date,
    geschlecht: document.getElementById('editgeschlecht').value,
    nachname: document.getElementById('editnachname').value,
    svnr: document.getElementById('editsvnr').value,
    vorname: document.getElementById('editvorname').value
    }),
    headers: {
    "Content-type": "application/json; charset=UTF-8"
    }
  })
  .then(response => response.json())
  .then(json => console.log(json))

  document.getElementById("patienthome").style.display = "block";
  document.getElementById("editPatient").style.display = "none";

  loadPatientTable.call();

}

async function deletePatientFromDatabase(id) {

  const response = await fetch("http://127.0.0.1:5000/patient/" + id, {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json'
    }
  });
  
  document.getElementById("patienthome").style.display = "block";
  document.getElementById("editPatient").style.display = "none";

  loadPatientTable.call();
}

function loadArztTable() {
  var xhttp = new XMLHttpRequest();
  console.log("Getting Data");
  document.getElementById("aerzte1").style.display = "block";
  document.getElementById("arzttermine").style.display = "none";
  
  xhttp.onreadystatechange = function() {	  
    if (this.readyState == 4 && this.status == 200) {
      arztData = JSON.parse(this.responseText);
      console.log(arztData);

      var table = "";
      table += '<tr>' + '<th>' + 'Titel' + '</th>'  + '<th>' + 'Vorname' + '</th>'  + '<th>' + 'Nachname' + '</th>' + '<th>' + 'Fach' + '</th>' + '<th>' + 'Telefon' + '</th>' + '<th>' + 'Email' + '</th>' + '<th>' + 'Str.' + '</th>' + '<th>' + 'Plz' + '</th>' + '<th>' + 'Ort' + '</th>' + '<th>' + '</th>' + '<th>' + '</th>' +'</tr>';
    
      for (i = 0; i < arztData.length; i++) { 
        table += "<tr>";
        for(p = 1; p < arztData[i].length; p++) {
          table += "<td>" +
          arztData[i][p] + 
          "</td>"; 
        }
        table += "<td> <button onclick='editArzt("+ arztData[i][0] +")'>Bearbeiten</button> </td>"
        table += "<td> <button onclick='showTermine(" + arztData[i][0] + ")'>Termine</button> </td>"

        table += "</tr>";
      }

      document.getElementById("arzttable").innerHTML = table;
    }
  };

  xhttp.open("GET", "http://127.0.0.1:5000/arzt", true);
  xhttp.send();
}

function toggleArztVisibility(){
  document.getElementById("arzthome").style.display = "none";
  document.getElementById("addnewarzt").style.display = "block";
}

async function newArzt() {
  await fetch('http://127.0.0.1:5000/arzt/', {
   method: 'Post',
  body: JSON.stringify({
    titel: document.getElementById('titel').value,
    vorname: document.getElementById('vorname').value,
    nachname: document.getElementById('nachname').value,
    fachrichtung: document.getElementById('fach').value,
    telefon: document.getElementById('telefon').value,
    email: document.getElementById('mail').value,
    strasse: document.getElementById('strasse').value,
    plz: document.getElementById('plz').value,
    ort: document.getElementById('ort').value
    }),
    headers: {
    "Content-type": "application/json; charset=UTF-8"
    }
  })
  .then(response => response.json())
  .then(json => console.log(json))

  document.getElementById("arzthome").style.display = "block";
  document.getElementById("addnewarzt").style.display = "none";

  loadArztTable.call();
}

function editArzt(id) {
  console.log("Editing Arzt of id: " + id)
  document.getElementById("arzthome").style.display = "none";
  document.getElementById("editArzt").style.display = "block";

  var xhttp = new XMLHttpRequest();

  
  
  xhttp.onreadystatechange = function() {	  
    if (this.readyState == 4 && this.status == 200) {
      arztData = JSON.parse(this.responseText);
      console.log(arztData);

      document.getElementById('editvorname').value = arztData[0][2];
      document.getElementById('edittitel').value = arztData[0][1];
      document.getElementById('editnachname').value = arztData[0][3];
      document.getElementById('editfach').value = arztData[0][4];
      document.getElementById('edittelefon').value = arztData[0][5];
      document.getElementById('editmail').value = arztData[0][6];
      document.getElementById('editstrasse').value = arztData[0][7];
      document.getElementById('editplz').value = arztData[0][8];
      document.getElementById('editort').value = arztData[0][9];

   
    }
  };

  xhttp.open("GET", "http://127.0.0.1:5000/arzt/" + id, true);
  xhttp.send();

  document.getElementById("editArztbutton").setAttribute("onclick", "editArztToDatabase(" + id + ")")
  document.getElementById("deletebutton").setAttribute("onclick", "showDeleteConfirmArzt(" + id + ")")

  
}

function showDeleteConfirmArzt(id) {
  document.getElementById("dialog-confirm").style.display = "block";

  $( function() {
    $( "#dialog-confirm" ).dialog({
      resizable: false,
      height: "auto",
      width: 400,
      modal: true,
      buttons: {
        Löschen: function() {
          deleteArztFromDatabase(id);
          $( this ).dialog( "close" );
        },
        Cancel: function() {
          $( this ).dialog( "close" );
        }
      }
    });
  } );
}

async function editArztToDatabase(id) {
  console.log("ID is:" + id);

  await fetch('http://127.0.0.1:5000/arzt/' + id, {
   method: 'PUT',
  body: JSON.stringify({
    id: id,
    titel: document.getElementById('edittitel').value,
    vorname: document.getElementById('editvorname').value,
    nachname: document.getElementById('editnachname').value,
    fachrichtung: document.getElementById('editfach').value,
    telefon: document.getElementById('edittelefon').value,
    email: document.getElementById('editmail').value,
    strasse: document.getElementById('editstrasse').value,
    plz: document.getElementById('editplz').value,
    ort: document.getElementById('editort').value
    }),
    headers: {
    "Content-type": "application/json; charset=UTF-8"
    }
  })
  .then(response => response.json())
  .then(json => console.log(json))

  document.getElementById("arzthome").style.display = "block";
  document.getElementById("editArzt").style.display = "none";

  loadArztTable.call();
}

async function deleteArztFromDatabase(id) {

  const response = await fetch("http://127.0.0.1:5000/arzt/" + id, {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json'
    }
  });
  
  document.getElementById("arzthome").style.display = "block";
  document.getElementById("editArzt").style.display = "none";
  document.getElementById("dialog-confirm").style.display = "none";

  loadArztTable.call();
}


function showTermine(id) {
  console.log("Showing Termine of: " + id);

  document.getElementById("aerzte1").style.display = "none";
  document.getElementById("arzttermine").style.display = "block";


  var xhttp = new XMLHttpRequest();

  var arzt = [];
  xhttp.onreadystatechange = function() {	  
    if (this.readyState == 4 && this.status == 200) {
      terminData = JSON.parse(this.responseText);
      console.log(terminData[0]);

      document.getElementById("termineueberschrift").innerHTML = "Die Termine vom Arzt " + terminData[0][1] + " " + terminData[0][3] + " werden angezeigt ";
      document.getElementById("terminbutton").setAttribute("onclick", "showNewTermine(" + id + ")");

      arzt.push(terminData);
     

      console.log("id of termin: " + id)
      

     
      document.getElementById("gebuchteTermine").setAttribute("onclick", "changeRadioButtonUn(" + id + ")");
      document.getElementById("ungebuchteTermine").setAttribute("onclick", "changeRadioButton(" + id +")");
      document.getElementById("backToAerzte").setAttribute("onclick", "loadArztTable()");

      getTerminData(id);
    }
  };
 
  xhttp.open("GET", "http://127.0.0.1:5000/arzt/" + id, true);
  xhttp.send();
  document.getElementById("TerminInputs").innerHTML = "<a>Von: </a> <input id='vonTermin' onchange='getTerminData(" + id  + ")' value='1970-01-01' type='date'> <a>Bis: </a> <input id='bisTermin' onchange='getTerminData(" + id + ")' value='2022-01-01' type='date'>"
}

function getTerminData(id) {
  var xhttpPatient = new XMLHttpRequest();
  var xhttp = new XMLHttpRequest();
  

  let fromDate = new Date(document.getElementById("vonTermin").value);
  let toDate = new Date(document.getElementById("bisTermin").value);
  console.log("Von Termin: " + fromDate)
  console.log("Bis Termin: " + toDate)

  xhttp.open("GET", "http://127.0.0.1:5000/termin/arzt/" + id + "/?from=" + fromDate.toISOString().split('T')[0] +"&to=" + toDate.toISOString().split('T')[0], true);
  xhttpPatient.open("GET", "http://127.0.0.1:5000/patient/", true);
  xhttpPatient.send();
  
  var patientData = [];
  xhttpPatient.onreadystatechange = function() {	  
    if (this.readyState == 4 && this.status == 200) {
      newpatientData = JSON.parse(this.responseText);
      patientData.push(newpatientData);
      console.log("Logging Patient Data for Termine")
      console.log(patientData);
      xhttp.send();
    }
  };

  

  let table = "";
  table += '<tr>' + '<th>' + 'Datum' + '</th>' + '<th>' + 'Von' + '</th>'  + '<th>' + 'Bis' + '</th>' + '<th>' + 'Titel' + '</th>' + '<th>' + 'Vorname' + '</th>' + '<th>' + 'Nachname' + '</th>' + '<th>' + 'SVNR' + '</th>';

  console.log("building Termin Tabelle with id= " + id);

  xhttp.onreadystatechange = function() {	  
    if (this.readyState == 4 && this.status == 200) {
      terminData = JSON.parse(this.responseText);
      var gebuchteTermine = document.getElementById("gebuchteTermine");

      
      if(gebuchteTermine.checked) {
        for (i = 0; i < terminData.length; i++) { 
          table += "<tr>";
          let pid= terminData[i][4];
          if(pid == null) {
            continue;
          }
          for(t = 1; t < terminData[i].length; t++) {
            if(t == 1) {
              table += "<td>" +
              new Date(terminData[i][t]).toLocaleDateString() + 
              "</td>";
    
              let date = new Date(terminData[i][t]);
              date.setHours(date.getHours() + date.getTimezoneOffset() / 60)
              table += "<td>" +
              date.toLocaleTimeString()+
              "</td>";
            }
            else if(t == 2) {
              let date = new Date(terminData[i][t - 1]);
              let dauer = terminData[i][t];
    
              date.setHours(date.getHours() + date.getTimezoneOffset() / 60);
              date.setMinutes(date.getMinutes() + dauer);
    
              table += "<td>" +
              date.toLocaleTimeString()+ 
              "</td>";
            }
            else if(t == 3) {
              for(pi = 0; pi < patientData[0].length; pi++) {
                if(patientData[0][pi][0] == pid) {
                  table += "<td>" +
                    patientData[0][pi][1] 
                  +
                   "</td>"
                   +
                   "<td>" +
                    patientData[0][pi][2]
                  +
                   "</td>"
                   +
                   "<td>" +
                    patientData[0][pi][3]
                  +
                   "</td>"
                  +
                   "<td>" +
                    patientData[0][pi][4]
                  +
                   "</td>"
                }
              }
            }
          }
        }
      }
      else {
        console.log("Adding ungebucht Termine to table: " + terminData.length)
        table = '<tr>' + '<th>' + 'Datum' + '</th>' + '<th>' + 'Von' + '</th>'  + '<th>' + 'Bis' + '</th>' + '<th>' + '</th>';

        for (i = 0; i < terminData.length; i++) { 
          console.log("Number of current Patient: " + i)
          let pid= terminData[i][4];
          if(pid == null) {
            table += "<tr>";
            for(t = 1; t < terminData[i].length; t++) {
              if(t == 1) {
                table += "<td>" +
                new Date(terminData[i][t]).toLocaleDateString() + 
                "</td>";
      
                let date = new Date(terminData[i][t]);
                date.setHours(date.getHours() + date.getTimezoneOffset() / 60)
                table += "<td>" +
                date.toLocaleTimeString()+
                "</td>";
              }
              else if(t == 2) {
                let date = new Date(terminData[i][t - 1]);
                let dauer = terminData[i][t];
      
                date.setHours(date.getHours() + date.getTimezoneOffset() / 60);
                date.setMinutes(date.getMinutes() + dauer);
      
                table += "<td>" +
                date.toLocaleTimeString()+ 
                "</td>";
              }
              else if(t == 3) {
                table += "<td> <button onclick='deleteTermin(" + terminData[i][0] + "," + id + ")'>Löschen</button> </td>"
              }
            }
          }
          
        }
        
      }
      
      table += "</tr>";
      document.getElementById("termintabelle").innerHTML = table;
    }
  };

  

  
}

function changeRadioButtonUn(id) {
  document.getElementById("gebuchteTermine").checked = true;
  document.getElementById("ungebuchteTermine").checked = false;
  console.log("Changed Radio Button, Calling getTerminData")
  getTerminData(id);
}

function changeRadioButton(id) {
  document.getElementById("gebuchteTermine").checked = false;
  document.getElementById("ungebuchteTermine").checked = true;
  console.log("Changed Radio Button 2, Calling getTerminData")

  getTerminData(id);

}

async function deleteTermin(tid, aid) {
    const response = await fetch("http://127.0.0.1:5000/termin/" + tid, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json'
      }
    });
  getTerminData(aid);
}


function showNewTermine(aid) {
  document.getElementById("newTermine").style.display = "block";
	document.getElementById("arzttermine").style.display = "none";

  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {	  
    if (this.readyState == 4 && this.status == 200) {
      arztData = JSON.parse(this.responseText);
      document.getElementById("newtermineueberschrift").innerHTML = "Neuer Terminslot für Arzt " + arztData[0][1] + " " + arztData[0][3];
      document.getElementById("newTerminButton").setAttribute("onclick", "newTerminSlot(" + aid +")");
      document.getElementById("backToTable").setAttribute("onclick", "showAerzteTable(" + aid +")");
    }
  };

  xhttp.open("GET", "http://127.0.0.1:5000/arzt/" + aid, true);
  xhttp.send();
}

async function newTerminSlot(aid) {
  let datum = new Date(document.getElementById("datumfield").value);
  let beginn = document.getElementById("beginnfield").value;
  let dauer = document.getElementById("dauerfield").value;

  datum.setHours(beginn.slice(0 , 2));
  datum.setMinutes(beginn.slice(3,5));
  
  let end = new Date(datum);
  console.log("end date: " + end);
  let endMinutes = +dauer + +end.getMinutes();
  console.log("dauer: " + endMinutes);

  end.setMinutes(endMinutes);


  console.log("2. Adding new Terminslot with: " + datum)
  var xhttpValidation = new XMLHttpRequest();
  //set end 1 day higher to get Data, then set it back to original state
  end.setDate(end.getDate() + 1);
  xhttpValidation.open("GET", "http://127.0.0.1:5000/termin/arzt/" + aid + "/?from=" + datum.toISOString().split('T')[0] +"&to=" + end.toISOString().split('T')[0], true);
  end.setDate(end.getDate() - 1);
  console.log("2. Adding new Terminslot with: " + end)
  xhttpValidation.onreadystatechange = function() {	  
    if (this.readyState == 4 && this.status == 200) {
      window['moment-range'].extendMoment(moment);

      let termine = JSON.parse(this.responseText);
      let inputrange = moment.range(datum, end);
      let terminoverlap = false;
      console.log("Cheking the Validation: " + termine);

      for(i = 0; i < termine.length; i++) {
        let validbeginndatum = new Date(termine[i][1]);
        //Adjust for Timezone (-2h)
        console.log("termine: " + validbeginndatum);

        validbeginndatum.setMinutes(validbeginndatum.getMinutes() + validbeginndatum.getTimezoneOffset());
        let validenddatum = new Date(validbeginndatum);
        validenddatum.setMinutes(validbeginndatum.getMinutes() + termine[i][2]);
        console.log("TimeOffset: " + validbeginndatum.getTimezoneOffset());

        let terminerange = moment.range(validbeginndatum, validenddatum);

        console.log(inputrange.overlaps(terminerange));
        if(inputrange.overlaps(terminerange)) {
          

          console.log("There is an overlap valid: " + terminerange.toString());
          console.log("There is an overlap input: " + inputrange.toString());

          document.getElementById("dialog").setAttribute.display = "block";
          document.getElementById("dialog").innerHTML = "<p>Zu dieser Zeit ist schon ein anderer Termin gebucht <br> Datum: " + validbeginndatum.toLocaleDateString() + "<br> Beginn: " + validbeginndatum.toLocaleTimeString() + "<br> Ende: " + validenddatum.toLocaleTimeString() +  "</p>";
          terminoverlap = true;
          $( function() {
            $( "#dialog" ).dialog();
          } );
          break;
        }
      }

      if(!terminoverlap) {
        //adjust for Timezone
        datum.setHours(datum.getHours() - datum.getTimezoneOffset()/60);
        xhttp.send(JSON.stringify({           
          "beginn":datum.toISOString(),
          "dauer":dauer,
        }));
        document.getElementById("newTermine").style.display = "none";
	      document.getElementById("arzttermine").style.display = "block";
      }
      
    }
  };
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "http://127.0.0.1:5000/termin/arzt/" + aid, true);
  xhttpValidation.send();

  

  xhttp.onreadystatechange = function() {	  
    if (this.readyState == 4 && this.status == 200) {
      console.log("Saved Slot into Database");
      getTerminData(aid);
    }
  };
}

function showAerzteTable(aid) {
  document.getElementById("newTermine").style.display = "none";
	document.getElementById("arzttermine").style.display = "block";
}

function showPatientTabelle() {
  document.getElementById("patienthome").style.display = "block";
  document.getElementById("patienttermine").style.display = "none";
}

function showTerminePatient(pid) {
  console.log("Showing Termine of Patient: " + pid);
  document.getElementById("patienthome").style.display = "none";
  document.getElementById("patienttermine").style.display = "block";

  var xhttp = new XMLHttpRequest();

  var patient = [];
  xhttp.onreadystatechange = function() {	  
    if (this.readyState == 4 && this.status == 200) {
      terminData = JSON.parse(this.responseText);
      console.log(terminData[0]);

      document.getElementById("termineueberschrift").innerHTML = "Die Termine vom Patient " + terminData[0][2] + " " + terminData[0][3] + " werden angezeigt ";
      document.getElementById("Patientterminbutton").setAttribute("onclick", "showTerminSlots(" + pid + ", true)");

      patient.push(terminData);
     

      console.log("id of termin: " + pid)
      getPatientTerminData(pid);
    }
  };
 
  xhttp.open("GET", "http://127.0.0.1:5000/patient/" + pid, true);
  xhttp.send();
  document.getElementById("TerminInputs").innerHTML = "<a>Von: </a> <input id='vonTermin' onchange='getPatientTerminData(" + pid  + ")' value='1970-01-01' type='date'> <a>Bis: </a> <input id='bisTermin' onchange='getPatientTerminData(" + pid + ")' value='2022-01-01' type='date'>"
}

function getPatientTerminData(pid) {
  var xhttpArzt = new XMLHttpRequest();
  var xhttp = new XMLHttpRequest();
  

  let fromDate = new Date(document.getElementById("vonTermin").value);
  let toDate = new Date(document.getElementById("bisTermin").value);
  console.log("Von Termin: " + fromDate)
  console.log("Bis Termin: " + toDate)

  xhttp.open("GET", "http://127.0.0.1:5000/termin/patient/" + pid + "/?from=" + fromDate.toISOString().split('T')[0] +"&to=" + toDate.toISOString().split('T')[0], true);
  xhttpArzt.open("GET", "http://127.0.0.1:5000/arzt/", true);
  xhttpArzt.send();
  
  var arztData = [];
  xhttpArzt.onreadystatechange = function() {	  
    if (this.readyState == 4 && this.status == 200) {
      newArztData = JSON.parse(this.responseText);
      arztData.push(newArztData);
      console.log("Logging Arzt Data for Termine")
      console.log(arztData);
      xhttp.send();
    }
  };

  

  let table = "";
  table += '<tr>' + '<th>' + 'Datum' + '</th>' + '<th>' + 'Zeit' + '</th>'  + '<th>' + 'Arzt' + '</th>' + '<th>' + 'Fachrichtung' + '</th>';

  console.log("building Termin Tabelle with id= " + pid);

  xhttp.onreadystatechange = function() {	  
    if (this.readyState == 4 && this.status == 200) {
      terminData = JSON.parse(this.responseText);

      
     
      for (i = 0; i < terminData.length; i++) {  
        console.log(terminData[i]);
        let tpid= terminData[i][4];
        if(tpid == null) {
          continue;
        }
        table += "<tr>";
        for(t = 1; t < terminData[i].length; t++) {
          if(t == 1) {
            table += "<td>" +
            new Date(terminData[i][t]).toLocaleDateString() + 
            "</td>";
  
            let date = new Date(terminData[i][t]);
            date.setHours(date.getHours() + date.getTimezoneOffset() / 60)
            table += "<td>" +
            date.toLocaleTimeString()
            + " - ";
          }
          else if(t == 2) {
            let date = new Date(terminData[i][t - 1]);
            let dauer = terminData[i][t];
            console.log(dauer / 60);
  
            date.setHours(date.getHours() + date.getTimezoneOffset() / 60);
            date.setMinutes(date.getMinutes() + dauer);
  
            table +=
            date.toLocaleTimeString()+ 
            "</td>";
          }
          else if(t == 3) {
            let aid= terminData[i][3];

            for(pi = 0; pi < arztData[0].length; pi++) {
              console.log("Trying to fin Arzt: " + aid)
              if(arztData[0][pi][0] == aid) {
                console.log(arztData[0][pi]);
                table += "<td>" +
                arztData[0][pi][1]  + " " + arztData[0][pi][3]  
                +
                  "</td>"
                  +
                  "<td>" +
                  arztData[0][pi][4]
                +
                  "</td>";
              }
            }
          }
        }
      }
      
      table += "</tr>";
      document.getElementById("termintabelle").innerHTML = table;
    }
  };
}

function showPatientTerminTabelle(pid) {
  document.getElementById("backToPatientenTable").style.display = "block";
  document.getElementById("backToPatientenTerminTable").style.display = "none";
  document.getElementById("Patientterminbutton").style.display = "block";
  document.getElementById("arztselection").style.display = "none";

  showTerminePatient(pid);
}
function showTerminSlots(pid, buildSelect) {
  var xhttpArzt = new XMLHttpRequest();
  var xhttp = new XMLHttpRequest(); 
  
  document.getElementById("Patientterminbutton").style.display = "none";
  document.getElementById("arztselection").style.display = "block";
  document.getElementById("arztselection").setAttribute("onchange", "showTerminSlots(" + pid + ", false)");
  document.getElementById("backToPatientenTerminTable").setAttribute("onclick", "showPatientTerminTabelle(" + pid + ")");
  document.getElementById("backToPatientenTable").style.display = "none";
  document.getElementById("backToPatientenTerminTable").style.display = "block";

  let fromDate = new Date(document.getElementById("vonTermin").value);
  let toDate = new Date(document.getElementById("bisTermin").value);
  console.log("Von Termin: " + fromDate)
  console.log("Bis Termin: " + toDate)


  xhttpArzt.open("GET", "http://127.0.0.1:5000/arzt/", true);
  xhttpArzt.send();
  
  var arztData = [];
  xhttpArzt.onreadystatechange = function() {	  
    if (this.readyState == 4 && this.status == 200) {
      newArztData = JSON.parse(this.responseText);
      arztData.push(newArztData);
      console.log("Logging Arzt Data for Termine")
      console.log(arztData);
      select = "<select name='aerzte' id='aerzteselect'>";

      if(buildSelect) {
        for(i = 0; i < arztData[0].length; i++) {
          select += "<option value='" + arztData[0][i][0] + "'>" + arztData[0][i][1]  + " " + arztData[0][i][2]  + " " + arztData[0][i][3] + "</option>"
        }
        select += "</select>";
        console.log(select);
        document.getElementById("arztselection").innerHTML = select;
      }
      
      
      let selectedArztId = document.getElementById("aerzteselect").value;

      xhttp.open("GET", "http://127.0.0.1:5000/termin/arzt/" + selectedArztId + "/?from=" + fromDate.toISOString().split('T')[0] +"&to=" + toDate.toISOString().split('T')[0], true);
      xhttp.send();
    }
  };

  
  

  let table = "";
  table += '<tr>' + '<th>' + 'Datum' + '</th>' + '<th>' + 'Zeit' + '</th>'  + '<th>' + 'Arzt' + '</th>' + '<th>' + 'Fachrichtung' + '</th>' + '<th>' + '</th>';

  console.log("building Termin Tabelle with id= " + pid);

  xhttp.onreadystatechange = function() {	  
    if (this.readyState == 4 && this.status == 200) {
      terminData = JSON.parse(this.responseText);
      console.log(terminData);
      let selectedArztId = document.getElementById("aerzteselect").value;

      for (i = 0; i < terminData.length; i++) { 
        
        console.log(terminData[i]);
        let tpid= terminData[i][4];
        if(tpid != null || terminData[i][3] != selectedArztId) {
          console.log("Skipping Arzt because: " + terminData[i][3])
          continue;
        }
        table += "<tr>";
        console.log("Adding Tablerow")
        for(t = 1; t < terminData[i].length; t++) {
          if(t == 1) {
            table += "<td>" +
            new Date(terminData[i][t]).toLocaleDateString() + 
            "</td>";
  
            let date = new Date(terminData[i][t]);
            date.setHours(date.getHours() + date.getTimezoneOffset() / 60)
            table += "<td>" +
            date.toLocaleTimeString()
            + " - ";
          }
          else if(t == 2) {
            let date = new Date(terminData[i][t - 1]);
            let dauer = terminData[i][t];
            console.log(dauer / 60);
  
            date.setHours(date.getHours() + date.getTimezoneOffset() / 60);
            date.setMinutes(date.getMinutes() + dauer);
  
            table +=
            date.toLocaleTimeString()+ 
            "</td>";
          }
          else if(t == 3) {
            let aid= terminData[i][3];

            for(pi = 0; pi < arztData[0].length; pi++) {
              console.log("Trying to fin Arzt: " + aid)
              if(arztData[0][pi][0] == aid) {
                console.log(arztData[0][pi]);
                table += "<td>" +
                arztData[0][pi][1]  + " " + arztData[0][pi][3]  
                +
                  "</td>"
                  +
                  "<td>" +
                  arztData[0][pi][4]
                +
                  "</td>";
              }
            }

            table += "<td> <button onclick='terminBuchen("+ terminData[i][0] +", " + pid +")'>Buchen</button> </td>"

          }
         
        }
      } 
      

      
      table += "</tr>";
      document.getElementById("termintabelle").innerHTML = table;
    }
  };
}

async function terminBuchen(tid, pid) {
  console.log("Buche Temrin für tid: " + tid);
  const response = await fetch("http://127.0.0.1:5000/termin/" + tid + "/" + pid, {
    method: 'Put',
    headers: {
      'Content-type': 'application/json'
    }
  });
  showTerminSlots(pid, false);
} 