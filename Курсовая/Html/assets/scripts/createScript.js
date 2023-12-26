let countStars = 0;

function paintStar(id){  
    countStars = id;
    for(let i = id*1+1; i <= 5; i++){
        document.getElementById("star" + i).src = "images/emptyStar.png";
    }
    for(let i = 1; i <= id; i++){
        document.getElementById("star" + i).src = "images/fullStar.png";
    }
}

function showWindow(){
    document.getElementById("window").style.display = "block";
}

function addAddress(){
    let city = document.getElementById("city").value;
    let street = document.getElementById("street").value;
    let houseNumber = document.getElementById("numberHouse").value;
    let address = "г." + city + ", ул." + street + ", д." + houseNumber;
    document.getElementById("address").innerText = address;
    document.getElementById("window").style.display = "none";
}

function addAddressWithFlat(){
    let city = document.getElementById("city").value;
    let street = document.getElementById("street").value;
    let houseNumber = document.getElementById("numberHouse").value;
    let houseFlat = document.getElementById("numberFlat").value;
    let address = "г. " + city + ", ул. " + street + ", д. " + houseNumber + ", кв. " + houseFlat;
    document.getElementById("address").innerText = address;
    document.getElementById("window").style.display = "none";
}

function closeWindow(){
    document.getElementById("window").style.display = "none";
}

function createFeedback(){
    let arrayAddress = document.getElementById("address").innerText.split(',');
    let city = arrayAddress[0].split('.')[1];
    let street = arrayAddress[1].split('.')[1];
    let numberHouse = arrayAddress[2].split('.')[1];
    let entrance = document.getElementById("entrance").value;
    let floor = document.getElementById("floor").value;
    let doorNumber = document.getElementById("doorPhone").value;
    let flat = document.getElementById("flat").value;
    let jsonAddress = JSON.stringify({
        city: city,
        street: street,
        numberHouse: numberHouse,
        entrance: entrance,
        floor: floor,
        doorNumber: doorNumber,
        flat: flat
    });
    fetch("http://192.168.0.107:8080/createAddress",{ 
        method: "POST",
        body: jsonAddress,
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then((response) => {return response.json()})
    .then((data) => {
        let jsonCLient = JSON.stringify({
            name: document.getElementById("name").value,
            idAddress: data.idAddress,
            rating: countStars
        })
    
        fetch("http://192.168.0.107:8080/createClient",{ 
            method: "POST",
            body: jsonCLient,
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then((response) => {return response.json()})
        .then((data) => {
            let jsonFeedback = JSON.stringify({
                idClient: data.idClient,
                idUser: JSON.parse(localStorage.getItem("user")).idUser,
                textFeetback: document.getElementById("comment").value,
                countStars: countStars
            })

            console.log(jsonFeedback);

            fetch("http://192.168.0.107:8080/createFeedback",{ 
                method: "POST",
                body: jsonFeedback,
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }   
            })
            .then((response) => {return response.status})
            .then((data) => {
                if(data == 200){
                    window.location.href = "myFeedback.html"
                }
                else{
                    alert(data);
                }
            })
        })
    })
}