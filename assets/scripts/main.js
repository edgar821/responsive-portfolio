var firebaseConfig = {
    apiKey: "AIzaSyCK-tDS7TudvH1Rci4wZqp1-PSPGYNhkJI",
    authDomain: "portfolio-e44b3.firebaseapp.com",
    databaseURL: "https://portfolio-e44b3.firebaseio.com",
    projectId: "portfolio-e44b3",
    storageBucket: "portfolio-e44b3.appspot.com",
    messagingSenderId: "500299153154",
    appId: "1:500299153154:web:6fbd2f793dda5342994c1b"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const messages = database.ref("messages");

let sendButton = document.getElementById("send");
let currentCount = 0;

database.ref().on("value", (snapshot) => {
    if (snapshot.child("msgCount").exists()) {
        currentCount = parseInt(snapshot.val().msgCount);
    }
    else {
        database.ref().set({msgCount: currentCount});
    }
});

let submitMessage = () => {
    let nameInput = document.getElementById("name-input").value.trim();
    let emailInput = document.getElementById("email-input").value.trim();
    let messageInput = document.getElementById("msg-input").value.trim();

    let updatedCount = currentCount + 1;
    let msgId = "M-" + updatedCount;
    let newMsg = messages.child(msgId);
    newMsg.set({
        name: nameInput,
        email: emailInput,
        message: messageInput
    } , (error) => {
        if (error) {
            console.log(error)
        } else {
            document.getElementById("confirmation").classList.remove("conf-hidden");
            document.getElementById("confirmation").classList.add("conf-visible");
        }
    });

    database.ref().update({msgCount: updatedCount});
}

let sendEmail = (name, email, message) => {
    let httpRequest = new XMLHttpRequest();

    httpRequest.onreadystatechange = (res) => {
        console.log(res);
    };

    let mailContents = {
        message: message,
        name: name,
        email: email
    }

    httpRequest.open('POST', 'https://us-central1-portfolio-e44b3.cloudfunctions.net/sendMailToHost', true);
    httpRequest.send(mailContents);
}

sendButton.addEventListener("click", submitMessage)

let cursor = document.querySelector("#cursor");
let visible = true;

const flickerFunc = () => {
	if (!visible){
		cursor.classList.add("cursor-visible");
		cursor.classList.remove("cursor-hidden");
		visible = true;
	} else {
		cursor.classList.add("cursor-hidden");
		cursor.classList.remove("cursor-visible");
		visible = false;
	}
}

let flickerInterval = setInterval(flickerFunc, 500)