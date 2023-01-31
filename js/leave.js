// select elements
// localStorage.clear();
let userName = document.querySelector("#empName");
let tbody = document.querySelector(".table-body");
let confirmButton = document.querySelector("#comfirm-btn");
let withPermission = document.querySelector(".check-box");
let small = document.querySelector(".error-text");
let arrData;
let leaving = 0,
  early = 0,
  permission = 0;
// removing the small after writing in the input feild
userName.addEventListener("keydown", () => {
  small.style.display = "none";
});

confirmButton.addEventListener("click", () => {
  if (userName.value.trim().length == "") {
    small.style.display = "inline";
    return;
  }

  // check if the entered user is an employee
  checkEmployee(userName.value);

  userName.value = null;
});

async function checkEmployee(userName) {
  const existance = await chechExistanceInEmployees(userName);
  console.log(existance);
  let array = await existance.json();
  let arrayLength = array.length;
  console.log(y);
  if (arrayLength != 0) {
    let data = {
      id: "",
      name: userName,
      leaving: getCurrentTime(),
    };
    drawTableRow(data);
    saveData(data);
  }
}

// check the email existance in employees
async function chechExistanceInEmployees(userName) {
  const existance = await fetch(
    `http://localhost:3000/employees?userName=${userName}`
  );
  return existance;
}

// check the email existance in attendance
async function chechExistanceInAttendance(userName) {
  const existance = await fetch(
    `http://localhost:3000/attedance?userName=${userName}`
  );
  return existance;
}

// Posting the values
async function patchData(employee) {
  const object = employee;
  const response = await fetch("http://localhost:3000/attendance", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(object),
  });
  const responseText = await response.text();
  console.log(responseText); // logs 'OK'
}

window.addEventListener("load", function () {
  bindDataSource();
  drawTable();
});
function bindDataSource() {
  let empData = localStorage.getItem("arrData");

  if (empData != null) {
    arrData = JSON.parse(empData);
  } else {
    arrData = [];
  }
}
function saveData(data) {
  bindDataSource();
  arrData.push(data);
  localStorage.setItem("arrData", JSON.stringify(arrData));
}

function drawTable() {
  for (let i = 0; i < arrData.length; i++) {
    drawTableRow(arrData[i]);
  }
}
function drawTableRow(data) {
  let createdtr = document.createElement("tr");
  createdtr.appendChild((td1 = document.createElement("td")));
  createdtr.appendChild((td2 = document.createElement("td")));
  createdtr.appendChild((td3 = document.createElement("td")));
  td1.innerHTML = data.name;
  td2.innerHTML = data.time;
  td3.innerHTML = data.date;
  tbody.appendChild(createdtr);
}

function getCurrentDate() {
  let date = new Date();
  let year = date.getFullYear();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  return day + "/" + month + "/" + year;
}

function getCurrentTime() {
  let date = new Date();
  let hrs = date.getHours();
  let mins = date.getMinutes();
  if (hrs < 17) {
    early=1;
    if(withPermission.checked){
      permission = 1;
    }
  }
  return hrs + ":" + mins;
}
