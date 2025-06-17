
let globalPodaci = [];
let k1_preuzmiDrzave = () => {
    //https://wrd-fit.info/ -> Ispit20240713 -> GetNovePonude

    let url = `https://wrd-fit.info/Ispit20240713/GetNovePonude`
    destinacije.innerHTML = '';//brisemo destinacije
    fetch(url)
        .then(r => {
            if (r.status !== 200) {
                //greska
                return;
            }
            r.json().then(t => {

                let b = 0;
                globalPodaci = t.podaci //setujemo globalnu varijablu

                for (const x of t.podaci) {
                    destinacije.innerHTML += `
                    <div class="destination-card">
                    <img class="destination-img" src="${x.imageUrl}"/>
                    <h2 class="destination-name">${x.drzava}</h2>
                    <div class="destination-date">${x.naredniPolazak.zaDana} | Slobodno mjesta: ${x.naredniPolazak.brojSlobodnihMjesta}</div>
                    <div class="destination-description">
                    ${x.opisPonude}
                    </div>
                    ${prikaziGradovePonude(x)}
                    <button class="destination-button" onclick="k2_odaberiDestinaciju(${b})">K2 Odaberi destinaciju</button>
                  </div>
                    `
                    b++;
                }
            })
        })
}
let prikaziGradovePonude=(x)=>{
    let s ="<table>";
    
    for (const g of x.boravakGradovi) {
        s += `<tr>
        <td>${g.nazivGrada}</td>
        <td>${g.hotelNaziv}</td>
        <td>${g.brojNocenja} dana</td>
            
        </tr>`
    }
    s+= "</table>"
    return s;
}

let k2_odaberiDestinaciju=(rbDrzave)=>{

    let destinacijObj = globalPodaci[rbDrzave];
    drzavaText.value=destinacijObj.drzava;

    let s = "";
    let rbPolaska=0;
    for (const o of destinacijObj.planiranaPutovanja) {
        s += `
        <tr>
            <td>ID ${o.putovanjeId}</td>
            <td>${o.datumPolaska}</td>
            <td>${o.datumPovratka}</td>
            <td>${o.slobodnaMjestaCount}</td>
            <td>${o.brojDana}</td>
            <td>${o.cijenaPoOsobi} €</td>
            <td><button onclick='K3_odaberiPutovanje(${rbDrzave}, ${rbPolaska}, ${o.putovanjeId})'>K3 Odaberi putovanje</button></td>
        </tr>`
        rbPolaska++;
    }
    putovanjaTabela.innerHTML = s;
}

function Pretrazi()
{
    let filterText = document.getElementById("searchPlace").value;
    let Pretrazeni = globalPodaci.filter(x=>
        x.drzava.includes(filterText) || x.opisPonude.includes(filterText) || x.boravakGradovi.some(grad => grad.nazivGrada.includes(filterText))
    );

    if(Pretrazeni.length === 0)
    {
        Pretrazeni = globalPodaci;
    }

    destinacije.innerHTML = '';
    let b = 0;

    for (const x of Pretrazeni) {
        destinacije.innerHTML += `
        <div class="destination-card">
        <img class="destination-img" src="${x.imageUrl}"/>
        <h2 class="destination-name">${x.drzava}</h2>
        <div class="destination-date">${x.naredniPolazak.zaDana} | Slobodno mjesta: ${x.naredniPolazak.brojSlobodnihMjesta}</div>
        <div class="destination-description">
        ${x.opisPonude}
        </div>
        ${prikaziGradovePonude(x)}
        <button class="destination-button" onclick="k2_odaberiDestinaciju(${b})">K2 Odaberi destinaciju</button>
      </div>
        `
        b++;
    }

}


let odabraniID = 0;
let K3_odaberiPutovanje=(rbDrzave, rbPolaska, putovanjeid)=>{

    odabraniID = putovanjeid;

    let destinacija = globalPodaci[rbDrzave];
    let putovanje = destinacija.planiranaPutovanja[rbPolaska];

    let test = document.getElementById("searchPlace").value;
    if(test.length === 0)
    {
        drzavaText.value = destinacija.drzava;
    }
    else
    {
        drzavaText.value = searchPlace.value;
    }
    

    datumPolaska.value = putovanje.datumPolaska;
    cijenaPoGostu.value = putovanje.cijenaPoOsobi;
    ukupnaCijena.value = (putovanje.cijenaPoOsobi * brojGostiju.value);
/*Implementacija*/
/*
B. Nakon odabira putovanja upišu sljedeće vrijednosti u odgovarajuće texboxove. 
    -	naziv države
    -	datum polaska 
    -	cijenu po osobi 
*/

/* C-	Nakon „Odaberi putovanje“ (K3_odaberiPutovanje) potrebno je generisati karticu za svaki od gradova koji se nalaze unutar odabrane ponude, a kartica treba sadržavati:
    a.	Naziv grada
    b.	Propeler čije okretanje putem animacije određuje brzinu vjetra u odabranog gradu
    c.	Termometar čija boja odgovara trenutnoj temperaturi u odabranom gradu
*/
    // Funkciji generisiPromjenuGradova proslijediti gradove koji se nalaze u sklopu odabrane ponude i na osnovu njih izračunati brzinu vjetra i temperaturu
    //generisiPromjenuGradova();
}

let generisiPromjenuGradova=(boravakGradovi)=>{
    vrijemeGradova.innerHTML = '';
    for (const o of boravakGradovi) {
        fetch(`http://api.openweathermap.org/data/2.5/weather?q=${o.nazivGrada}&appid=917b026a997320574cd4315b9bf4c73a`)
        .then(
           (response)=>{
                response.text().then((body)=>{

                    // Funkciji proslijediti potrebne parametre kako bi se generisali gradovi iz preuzetih podataka
                    //generisiGradove();
                })
           }
        )
    }

}
let generisiGradove = ()=>{
    vrijemeGradova.innerHTML += `<div class="city-card">
    <h2 class="city-name">//Naziv Grada/h2>
    <div class="city-card-right">
      <div class="wind-vel">
        <span>Brzina vjetra:</span>
        <div class="propeller">
          /*Dodati svg propelera za svaki od gradova*/
        </div>
      </div>
      <div class="temp">
        <span>Temperatura:</span>
        /*Dodati svg termometra za svaki od gradova*/
      </div>
    </div>
  </div>`
}
let getTempColor=(temp)=>{
    if(temp >= 40)
        return 'red';
    if(temp < 40 && temp >= 30){
        return 'rgb(235, 100, 52)'
    }
    if(temp < 30 && temp >=20)
        return 'rgb(235, 134, 52)'
    if(temp < 20 && temp >=10)
        return 'rgb(235, 211, 52)'
    if(temp < 10 && temp >=0)
        return 'rgb(52, 235, 116)'
    if(temp < 0)
        return 'rgb(52, 58, 235)'
}   
let setRotaciju=(vel, id)=>{
    document.getElementById('propeller-'+id).style.animationDuration = `${10 / vel}s`;
}
let setTemperaturu=(color, id)=>{
    document.getElementById('path1933-9-9-'+id).style.fill = color;
}

let ErrorBackgroundColor = "#FE7D7D";
let OkBackgroundColor = "#DFF6D8";

let posalji = () => {
    //https://wrd-fit.info/ -> Ispit20240713 -> Dodaj


    let jsObjekat = new Object();

    let ID = odabraniID.toString();
    let country = drzavaText.value;
    let mob = phone.value;
    let datumP = datumPolaska.value;
    let price = ukupnaCijena.value;
    let gosti = [];
    for(let i=0; i<brojGostiju.value; i++)
    {
        let gost = document.getElementById(`gostiInput${i+1}`).value;
        gosti.push(gost);
    }
    let indeks = brojIndeksa.value;
    let mail = email.value;
    let pasos = datumVazenjaPasosa.value;

    jsObjekat = {
        "putovanjeID": ID,
        "drzava": country,
        "mobitel": mob,
        "datumPolaska": datumP,
        "cijenaUkupno": price,
        "gostiPutovanja": gosti,
        "brojIndeksa": indeks,
        "email": mail,
        "datumVazenjaPasosa": pasos
      }

    let jsonString = JSON.stringify(jsObjekat);

    console.log(jsObjekat);

    let url = "https://wrd-fit.info/Ispit20240713/Dodaj";

    //fetch tipa "POST" i saljemo "jsonString"
    fetch(url, {
        method: "POST",
        body: jsonString,
        headers: {
            "Content-Type": "application/json",
        }
    })
        .then(r => {
            if (r.status != 200) {
                alert("Greška")
                return;
            }

            r.json().then(t => {
                
                if (t.idRezervacije != null && Number(ukupnaCijena.value)>0)
                {
                    dialogSuccess(`Idi na placanje rezervacije broj ${t.idRezervacije} - iznos ${ukupnaCijena.value} EUR`, ()=>{
                        window.location = `https://www.paypal.com/cgi-bin/webscr?business=adil.joldic@yahoo.com&cmd=_xclick&currency_code=EUR&amount=${ukupnaCijena.value}&item_name=Dummy invoice`
                    });
                }
            })

        })
}


let promjenaBrojaGostiju = () => {

    gosti.innerHTML =``;

    for(let i=0; i<brojGostiju.value; i++)
    {

        if(brojGostiju.value == 1)
        {
            gosti.innerHTML =``;

            gosti.innerHTML +=`<label for="gostiInput1">Ime gosta</label>
            <input type="text" id="gostiInput1">`;
            return;
        }

        gosti.innerHTML +=`<label for="gostiInput${i+1}">Ime gosta ${i+1}</label>
          <input type="text" id="gostiInput${i+1}">`;

           ukupnaCijena.value = cijenaPoGostu.value * brojGostiju.value;
    }

}


let provjeriTelefon=()=> {
    let r = /^\+[0-9]{3}-[0-9]{2}-[0-9]{3}-[0-9]{3}$/;
    if (!r.test(phone.value)) {
       phone.style.backgroundColor=ErrorBackgroundColor;
    }
    else {
        phone.style.backgroundColor=OkBackgroundColor;
    }
}

let provjeriBrojIndeksa=()=>{

}
let provjeriEmail=()=>{

}

let provjeriDatumPasos = ()=>{

}
k1_preuzmiDrzave();