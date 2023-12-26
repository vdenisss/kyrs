function register(){
    window.location.href = "register.html";
}

function registerNewUser(){
    let dataEmail = document.getElementById("email").value;
    let dataPassword = document.getElementById("password").value;
    let dataJson = JSON.stringify({
            email: dataEmail,
            password: dataPassword,
            idRole: 1
    })
    fetch("http://192.168.0.107:8080/createUser",{ 
        method: "POST",
        body: dataJson,
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .catch(error => alert(error.name + " " +  error.message))
    window.location.href = "login.html"
}

function login(){
    let dataEmail = document.getElementById("email").value;
    let dataPassword = document.getElementById("password").value;
    let dataJson = JSON.stringify({
        email: dataEmail,
        password: dataPassword
    })

    let isAuth = false;

    fetch("http://192.168.0.107:8080/loginUser",{ 
        method: "POST",
        body: dataJson,
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })

    .then((response) => {
        if(response.status == 200){
            isAuth = true;
            return response.json();
        }
        else{
            alert("Неправильные данные");
        }
    })
    .then((data) => {
        if(isAuth == true){
            localStorage.setItem("user", JSON.stringify({
                idUser: data.idUser,
                name: data.name,
                lastName: data.lastName,
                email: data.email,
                password: data.password,
                phoneNumber: data.phoneNumber,
                idRole: data.idRole
            }));
            window.location.href = "profile.html";
        }
    })
}

function dataProfile(){
    let user = JSON.parse(localStorage.getItem("user"));

    document.getElementById("nameUser").innerText = user.name;
    fetch("http://192.168.0.107:8080/getNameRole",{ 
        method: "POST",
        body: JSON.stringify({idRole: user.idRole}),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then((response) => {return response.text()})
    .then((data) => {
        document.getElementById("roleUser").innerText = data;
        if(data == "Модератор"){
            document.getElementById("updateProfile").style.display = "none";
            document.getElementById("createFeedback").style.display = "none";
            document.getElementById("feedbacks").innerText = "Все отзывы";
        }
    })
}

function updateProfile(){
    window.location.href = "updateProfile.html"
}

function dataUpdateProfile(){
    let user = JSON.parse(localStorage.getItem("user"));
    document.getElementById("name").value = user.name;
    document.getElementById("lastName").value = user.lastName;
    document.getElementById("phoneNumber").value = user.phoneNumber;
}

function save(){
    let user = JSON.parse(localStorage.getItem("user"));
    user.name = document.getElementById("name").value;
    user.lastName = document.getElementById("lastName").value;
    user.phoneNumber = document.getElementById("phoneNumber").value;

    fetch("http://192.168.0.107:8080/updateUser",{ 
        method: "POST",
        body: JSON.stringify(user),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then((response) => {return response.json()})
    .then((data) => {
        localStorage.setItem("user", JSON.stringify(data));

    })
}

function dataMyFeedback(){
    let user = JSON.parse(localStorage.getItem("user"));
    console.log(user.idUser);
    fetch("http://192.168.0.107:8080/getUserFeedback",{ 
        method: "POST",
        body: JSON.stringify({
            idUser: user.idUser
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then((response) => {return response.json()})
    .then((data) => {
        var count = Object.keys(data).length;

        var divTable = document.getElementById("divFeedback");
        for(let i = 0; i < count; i++){
            var button = document.createElement('button');
            button.className = "feedback";
            button.addEventListener('click', function(){
                localStorage.setItem("feetback", JSON.stringify(data[i]));
                window.location.href = "feedback.html"
            });
                var divIcon = document.createElement('div');
                    divIcon.className = "icon";
                    var img = document.createElement('img');
                        img.src = "images/chat.png";
                var divData = document.createElement('div');
                    divData.className = "data";
                    var name = document.createElement('div');
                        name.className = "name";
                        name.innerText = data[i].name;
                    var address = document.createElement('div');
                        address.className = "address";
                        var street = document.createElement('div');
                            street.className = "street";
                            street.innerText = "ул. " + data[i].street;
                        var numberHouse = document.createElement('div');
                            numberHouse.className = "numberHouse";
                            numberHouse.innerText = ", д. " + data[i].numberHouse;
                        var numberApps = document.createElement('div');
                            numberApps.className = "numberApps";
                            numberApps.innerText = ", кв. " + data[i].flat;
                        address.appendChild(street);
                        address.appendChild(numberHouse);
                        address.appendChild(numberApps);
                    divData.appendChild(name);
                    divData.appendChild(address);
                    divIcon.appendChild(img);
                var divStars = document.createElement('div')
                    divStars.className = "stars";
                    for(let j = 0; j < data[i].rating; j++){
                        var star = document.createElement('img');
                            star.className = "star";
                            star.src = "images/fullStar.png";
                        divStars.appendChild(star);
                    }
                button.appendChild(divIcon);
                button.appendChild(divData);
                button.appendChild(divStars);
         divTable.appendChild(button);
        }
    })
}

function dataFeedback(){
    var data = JSON.parse(localStorage.getItem("feetback"));
    //localStorage.removeItem("feetback");
    document.getElementById("addressValue").innerText = "г. " + data.city + ", ул. " + data.street + ", д. " + data.numberHouse;
    document.getElementById("entrance").innerText = data.entrance;
    document.getElementById("doorNumber").innerText = data.doorNumber;
    document.getElementById("floor").innerText = data.floor;
    document.getElementById("flat").innerText = data.flat;
    document.getElementById("nameClient").innerText = data.name;
    document.getElementById("comment").innerText = data.comment;

    var stars = document.getElementById("stars");
    for(let i = 0; i < data.rating; i++){
        var star = document.createElement('img');
            star.className = "star";
            star.src = "images/fullStar.png";

        stars.appendChild(star);
    }
}

/*function feedback(data){
    localStorage.setItem("feetback", data);
    console.log(data);
    window.location.href = "feedback.html"
}*/

var countStar = 0;

function paintStarUpdate(id){  
    countStar = id;
    console.log(countStar);
    for(let i = id*1+1; i <= 5; i++){
        document.getElementById("star" + i).src = "images/emptyStar.png";
    }
    for(let i = 1; i <= id; i++){
        document.getElementById("star" + i).src = "images/fullStar.png";
    }
}


function dataUpdateFeetback(){
    var data = JSON.parse(localStorage.getItem("feetback"));
    countStar = data.rating;
    console.log(data);
    
    document.getElementById("nameClient").value = data.name;
    document.getElementById("address").innerText = "г. " + data.city + ", ул. " + data.street + ", д. " + data.numberHouse;
    document.getElementById("entrance").value = data.entrance;
    document.getElementById("floor").value = data.floor;
    document.getElementById("doorNumber").value = data.doorNumber;
    document.getElementById("flat").value = data.flat;
    document.getElementById("comment").innerText = data.comment;

    for(let i = 1; i <= 5; i++){
        if(i <= data.rating){
            document.getElementById("star" + i).src = "images/fullStar.png";
        }
        else{
            document.getElementById("star" + i).src = "images/emptyStar.png";
        }
    }
}

function showWindowUpdate(){
    document.getElementById("window").style.display = "block";
    let arrayAddress = document.getElementById("address").innerText.split(',');
    let city = arrayAddress[0].split('.')[1];
    let street = arrayAddress[1].split('.')[1];
    let numberHouse = arrayAddress[2].split('.')[1];
    document.getElementById("city").value = city;
    document.getElementById("street").value = street;
    document.getElementById("numberHouse").value = numberHouse;
}

function updateDataFeetBack(){
    var dataLocal = JSON.parse(localStorage.getItem("feetback"));
    let arrayAddress = document.getElementById("address").innerText.split(',');
    let city = arrayAddress[0].split('.')[1];
    let street = arrayAddress[1].split('.')[1];
    let numberHouse = arrayAddress[2].split('.')[1];
    let entrance = document.getElementById("entrance").value;
    let floor = document.getElementById("floor").value;
    let doorNumber = document.getElementById("doorNumber").value;
    let flat = document.getElementById("flat").value;
    let name = document.getElementById("nameClient").value;
    let comment = document.getElementById("comment").value;
    let jsonAddress = JSON.stringify({
        idAddress: dataLocal.idAddress,
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
            idClient: dataLocal.idClient,
            name: name,
            idAddress: data.idAddress,
            rating: countStar
        })
        console.log(countStar);
    
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
                idFeetback: dataLocal.idFeetback,
                idClient: data.idClient,
                idUser: JSON.parse(localStorage.getItem("user")).idUser,
                textFeetback: comment,
                countStars: countStar
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
                    var fullFeedback = JSON.stringify({
                        city: city,
                        comment: comment,
                        doorNumber: doorNumber,
                        entrance: entrance,
                        flat: flat,
                        floor: floor,
                        idAddress: dataLocal.idAddress,
                        idClient: dataLocal.idClient,
                        idFeetback: dataLocal.idFeetback,
                        name: name,
                        numberHouse: numberHouse,
                        rating: countStar,
                        street: street,
                    })
                    localStorage.setItem("feetback", fullFeedback);
                    window.location.href = "feedback.html";
                }
                else{
                    alert(data);
                }
            })
        })
    })
}

function deleteFeedback(){
    var feetback = JSON.parse(localStorage.getItem("feetback"));
    fetch("http://192.168.0.107:8080/deleteFeedback",{ 
            method: "POST",
            body: JSON.stringify({idFeetback: feetback.idFeetback}),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }   
    })
    localStorage.removeItem("feetback");
    window.location.href = "myFeedback.html";
}

function createFeedback(){
    window.location.href = "createFeedback.html"
}

function exitProfile(){
    localStorage.removeItem("user");
    window.location.href = "login.html"
}

function create(){
    window.location.href = "profile.html"
}

function profile(){
    window.location.href = "profile.html"
}

function myFeedback(){
    localStorage.removeItem("feetback");
    window.location.href = "myFeedback.html"
}

function updateFeedback(){
    window.location.href = "updateFeedback.html"
}

function findFeedback(){
    window.location.href = "findFeedback.html"
}

function someoneFeedback(){
    window.location.href = "someoneFeetback.html"
}