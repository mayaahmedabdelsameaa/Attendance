// select elements
// localStorage.clear();
let userName = document.querySelector("#empName");
let tbody = document.querySelector(".table-body");
let confirmButton = document.querySelector("#comfirm-btn");
let small = document.querySelector(".error-text");
let arrData, user;
let late = 0,
  leaving = "17:00",
  early = 0,
  permission = 0,
  newTime;
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

// check if the entered user is an employee
async function checkEmployee(userName) {
  const existance = await chechExistanceInEmployees(userName);
  let array = await existance.json();
  let arrayLength = array.length;
  const existanceInAttendance = await chechExistanceInAttendance(userName);
  let arrayAttend = await existanceInAttendance.json();
  let arrayAttendLength = arrayAttend.length;
  if (arrayLength != 0) {
    let data = {
      id: "",
      userName: userName,
      time: getCurrentTime(),
      date: getCurrentDate(),
    };
    drawTableRow(data);
    data.late = late;
    data.leaving = leaving;
    data.early = early;
    data.permission = permission;
    saveData(data);
    postData(data);
  } else {
    small.innerText = "Not Employee or Enter a valid data";
    small.style.display = "inline";
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
    `http://localhost:3000/attendance?userName=${userName}`
  );
  return existance;
}

// Posting the values
async function postData(employee) {
  const object = employee;
  const response = await fetch("http://localhost:3000/attendance", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(object),
  });
  const responseText = await response.text();
  console.log(responseText); // logs 'OK'
}

// Patch the values
async function patchData(object, newTime) {
  const response = await fetch(
    `http://localhost:3000/attendance/${object.id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: object.id,
        userName: object.userName,
        time: object.time,
        date: object.date,
        late: object.late,
        leaving: newTime,
        early: 1,
        permission: 0,
      }),
    }
  );
}

window.addEventListener("load", function () {
  bindDataSource();
  drawTable();
});

function bindDataSourceAfterLeave(user, newTime) {
  let empData = localStorage.getItem("arrData");
  console.log(empData);
  empData.forEach((emp) => {
    if (emp.userName == user) {
      emp.leave = newTime;
      emp.early = 1;
    }
  });
} //end bind data

function bindDataSource() {
  let empData = localStorage.getItem("arrData");

  if (empData != null) {
    arrData = JSON.parse(empData);
  } else {
    arrData = [];
  }
} //end bind data
function saveData(data) {
  bindDataSource();
  // bindDataSourceAfterLeave(user,newTime);
  arrData.push(data);
  localStorage.setItem("arrData", JSON.stringify(arrData));
} // end of save data

function drawTable() {
  for (let i = 0; i < arrData.length; i++) {
    drawTableRow(arrData[i]);
  }
} // end of draw table
function drawTableRow(data) {
  let createdtr = document.createElement("tr");
  createdtr.appendChild((td1 = document.createElement("td")));
  createdtr.appendChild((td2 = document.createElement("td")));
  createdtr.appendChild((td3 = document.createElement("td")));
  createdtr.appendChild((td4 = document.createElement("td")));
  td1.innerHTML = data.userName;
  td2.innerHTML = data.time;
  td3.innerHTML = data.date;
  td4.innerHTML = `<input type="checkbox" class="early" onclick="getCurrentTimeForLeave(this)">`;
  tbody.appendChild(createdtr);
} // end of draw row

function getCurrentDate() {
  let date = new Date();
  let year = date.getFullYear();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  return month + "/" + day + "/" + year;
} // end of get current date

function getCurrentTime() {
  let date = new Date();
  let hrs = date.getHours();
  let mins = date.getMinutes();
  if (hrs == 9 || mins > 5) {
    late = 1;
  }
  return hrs + ":" + mins;
} // end of get current time
async function getCurrentTimeForLeave(that) {
  user = that.parentNode.parentNode.childNodes[0].innerText;
  console.log(user);
  let date = new Date();
  let hrs = date.getHours();
  let mins = date.getMinutes();
  newTime = hrs + ":" + mins;
  let existance = await chechExistanceInAttendance(user);
  let array = await existance.json();
  patchData(array[0], newTime);
}
