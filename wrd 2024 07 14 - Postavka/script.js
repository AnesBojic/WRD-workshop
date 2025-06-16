
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


let K3_odaberiPutovanje=(rbDrzave, rbPolaska, putovanjeid)=>{



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