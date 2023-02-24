window.addEventListener("load", () => {
  "use strict";
  // select all inputs
  let inputs = document.querySelectorAll("input");
  //select all small tags
  let smalls = document.querySelectorAll("small");
  // select submit button
  let submit = document.getElementById("registerbutton");
  submit.addEventListener("click", check);
  // add event on all inputs except the submit
  // removing the error message after writing new value
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("keydown", () => {
      smalls[i].style.display = "none";
    });
  }
  // pattern of email format
  let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  function check(event) {
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].value.trim() == "") {
        smalls[i].innerText = "Please, Enter Data";
        smalls[i].style.display = "inline";
        event.preventDefault();
      } else {
        if (
          inputs[i].getAttribute("type") == "text" &&
          inputs[i].getAttribute("id") != "address"
        ) {
          if (!/[a-zA-Z]/.test(inputs[i].value)) {
            smalls[i].innerText =
              "Please, Enter Name without numbers or special characters";
            smalls[i].style.display = "inline";
            event.preventDefault();
          }
        } else if (inputs[i].getAttribute("type") == "email") {
          if (!mailformat.test(inputs[i].value)) {
            smalls[i].innerText =
              "Please, Enter a valid email, EX: myname@mail.com";
            smalls[i].style.display = "inline";
            event.preventDefault();
          }
        } else if (inputs[i].getAttribute("type") == "number") {
          if (inputs[i].value < 22 || inputs[i].value > 60) {
            smalls[i].innerText = "Please, Enter a valid age between 22 and 60";
            smalls[i].style.display = "inline";
            event.preventDefault();
          }
        }
      }
    }
    // create an object holding all values of the input
    let employee = { id: "" },
      flag = 0;
    // iserting the values of inputs in the object
    for (let i = 0; i < inputs.length; i++) {
      switch (inputs[i].getAttribute("id")) {
        case "first":
          if (inputs[i].value == "") flag = 1;
          employee["firstName"] = inputs[i].value;
          break;
        case "last":
          if (inputs[i].value == "") flag = 1;
          employee["lastName"] = inputs[i].value;
          break;
        case "email":
          if (inputs[i].value == "") flag = 1;
          employee["email"] = inputs[i].value;
          break;
        case "age":
          if (inputs[i].value == "") flag = 1;
          employee["age"] = inputs[i].value;
          break;
        case "address":
          if (inputs[i].value == "") flag = 1;
          employee["address"] = inputs[i].value;
          break;
      }
    }
    employee.role="";
    // calling check exist of email function
    if (flag == 0) checkEmail(employee);
  }
}); // end of load function

// checkEmail function
async function checkEmail(employee) {
  // check function
  const existance = await chechExistanceInEmployees(employee);
  // getting the length of the return value
  const existLength = await existance.json();

  // check function
  const existance1 = await chechExistanceInPending(employee);
  // getting the length of the return value
  const existLength1 = await existance1.json();
  // calling the postData, to save the employee data
  if (existLength.length == 0 && existLength1.length == 0) {
    employee.userName = generateRandomUsername(employee.firstName);
    employee.password = generateRandomPassword();
    console.log(employee);
    postData(employee);
    alert("Congratlations your Data have been sent, Wait for the E-mail")
  }
}

// check the email existance in pending
async function chechExistanceInPending(employee) {
  const existance = await fetch(
    `http://localhost:3000/pending?email=${employee.email}`
  );
  return existance;
}
// check the email existance in employyes
async function chechExistanceInEmployees(employee) {
  const existance = await fetch(
    `http://localhost:3000/employees?email=${employee.email}`
  );
  return existance;
}
// Posting the values
async function postData(employee) {
  const object = employee;
  const response = await fetch("http://localhost:3000/pending", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(object),
  });
  const responseText = await response.text();
  console.log(responseText); // logs 'OK'
}
// generating user name
function generateRandomUsername(name) {
  let chars = "0123456789!@-_ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let usernameLength = 4;
  let username = name.substring(0, 4);
  for (let i = 0; i <= usernameLength; i++) {
    let randomNumber = Math.floor(Math.random() * chars.length);
    username += chars.substring(randomNumber, randomNumber + 1);
  }
  return username;
}
// generating password
function generateRandomPassword() {
  let chars =
    "0123456789abcdefghijklmnopqrstuvwxyz!@$%-_ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  let passwordLength = 12;
  let password = "";
  for (let i = 0; i <= passwordLength; i++) {
    var randomNumber = Math.floor(Math.random() * chars.length);
    password += chars.substring(randomNumber, randomNumber + 1);
  }

  return password;
}

window.onbeforeunload = function (e) {
  e.preventDefault();
  alert("you can't navigate from one page to another");
};
window.history.forward();
function noBack() {
  window.history.forward();
}