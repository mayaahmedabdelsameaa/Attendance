let name = document.getElementById("name"),
  email = document.getElementById("userEmail"),
  UserName = document.getElementById("userUserName");

let scrollButton = document.querySelector("#myBtn"),
  cardOneTitle = document.querySelector(".cardOne"),
  cardTwoTitle = document.querySelector(".cardTwo"),
  cardThreeTitle = document.querySelector(".cardThree"),
  cardFourTitle = document.querySelector(".cardFour"),
  cardFiveTitle = document.querySelector(".cardFive"),
  cardSixTitle = document.querySelector(".cardSix"),
  dateValue = document.getElementById("date-input"),
  selectInput = document.getElementById("select"),
  btn = document.getElementById("btn-submit"),
  btnRange = document.getElementById("btn-range"),
  stratDate = document.getElementById("start-date"),
  endDate = document.getElementById("end-date"),
  tbodyOne = document.getElementById("table-attendance"),
  tbodyTwo = document.getElementById("table-attendance-two"),
  logout = document.querySelector(".logout a");;
let searchOption = document.getElementById("searchoption"),
  searchRange = document.getElementById("searchrange"),
  attendanceData = [],
  selectedDate,
  select,
  namesMatched = [],
  lateLength = 0,
  earlyLength = 0,
  attendLength = 0,
  start,
  end,
  rangeNames = [],
  lateRange = 0,
  earlyRange = 0,
  attendRange = 0,
  attendanceDataRange = [];

window.addEventListener("load", () => {
  name.innerHTML = `${localStorage.getItem("firstName")} ${localStorage.getItem(
    "lastName"
  )}`;
  email.innerHTML = localStorage.getItem("email");
  UserName.innerHTML = localStorage.getItem("userName");
  
});

scrollButton.addEventListener("click", () => {
  document.body.scrollTo = 0;
  document.documentElement.scrollTop = 0;
}); // end of scroll to top function

btn.addEventListener("click", async () => {
  selectedDate = dateValue.value;
  selectedDate = new Date(selectedDate);
  selectedDate = selectedDate.toLocaleString();
  selectedDate = selectedDate.split(",");
  selectedDate = selectedDate[0];
  select = selectInput.value;
  switch (select) {
    case "Daily":
      (lateLength = 0),
        (earlyLength = 0),
        (attendLength = 0),
        (namesMatched = []);
      attendanceData = await loadNamesAttendance();
      cardOneTitle.innerText = `${attendLength} Attendance`;
      cardTwoTitle.innerText = `${lateLength} Late`;
      cardThreeTitle.innerText = `${earlyLength} Leaving Early`;
      removeData();
      await DrawTable(attendanceData);
      break;
    case "Weekly":
      (lateLength = 0),
        (earlyLength = 0),
        (attendLength = 0),
        (namesMatched = []);
      attendanceData = await loadNamesAttendanceWeek();
      cardOneTitle.innerText = `${attendLength} Attendance`;
      cardTwoTitle.innerText = `${lateLength} Late`;
      cardThreeTitle.innerText = `${earlyLength} Leaving Early`;
      removeData();
      await DrawTable(attendanceData);
      break;
    case "Monthly":
      (lateLength = 0),
        (earlyLength = 0),
        (attendLength = 0),
        (namesMatched = []);
      attendanceData = await loadNamesAttendanceMonth();
      cardOneTitle.innerText = `${attendLength} Attendance`;
      cardTwoTitle.innerText = `${lateLength} Late`;
      cardThreeTitle.innerText = `${earlyLength} Leaving Early`;
      removeData();
      await DrawTable(attendanceData);
      break;
  }
}); // end of submit function
btnRange.addEventListener("click", async () => {
  start = stratDate.value;
  start = new Date(start);
  start = start.toLocaleString();
  start = start.split(",");
  start = start[0];
  end = endDate.value;
  end = new Date(end);
  end = end.toLocaleString();
  end = end.split(",");
  end = end[0];
  (lateRange = 0), (earlyRange = 0), (attendRange = 0), (rangeNames = []);
  attendanceDataRange = await loadRangeAttendance();
  cardFourTitle.innerText = `${attendRange} Attendance`;
  cardFiveTitle.innerText = `${lateRange} Late`;
  cardSixTitle.innerText = `${earlyRange} Leaving Early`;
  removeDataRange();
  DrawTableRange(attendanceDataRange);
}); // end of submit range function

//table for attendance employee Rsnge
async function loadRangeAttendance() {
  const response = await fetch(
    `http://localhost:3000/attendance?userName=${localStorage.getItem(
      "userName"
    )}`
  );
  const names = await response.json();

  names.forEach((emp) => {
    if (emp.late == 1 && emp.date >= start && emp.date <= end) {
      lateRange++;
      console.log("from late ");
    }
    if (emp.early == 1 && emp.date >= start && emp.date <= end) earlyRange++;
    if (emp.date >= start && emp.date <= end) {
      attendRange++;
      rangeNames.push(emp);
    }
  });
  console.log(rangeNames);
  return rangeNames;
}

//table for attendance employee daily
async function loadNamesAttendance() {
  const response = await fetch(
    `http://localhost:3000/attendance?userName=${localStorage.getItem(
      "userName"
    )}`
  );
  const names = await response.json();
  names.forEach((emp) => {
    if (emp.late == 1 && emp.date == selectedDate) lateLength++;
    if (emp.early == 1 && emp.date == selectedDate) earlyLength++;
    if (emp.date == selectedDate) attendLength++;
  });
  for (let i = 0; i < names.length; i++) {
    if (names[i].date == selectedDate) {
      const existance = await chechExistanceInEmployees(names[i].userName);
      const existLength = await existance.json();
      names[i].name = existLength[0].firstName + " " + existLength[0].lastName;
      namesMatched.push(names[i]);
    } else continue;
  }
  return namesMatched;
}

//table for attendance employee for Month
async function loadNamesAttendanceMonth() {
  const response = await fetch(
    `http://localhost:3000/attendance?userName=${localStorage.getItem(
      "userName"
    )}`
  );
  const names = await response.json();
  console.log(names);
  dateArr = selectedDate.split("/");
  names.forEach((emp) => {
    let month = emp.date;
    month = month.split("/");
    if (emp.late == 1 && month[0] == dateArr[0]) lateLength++;
    if (emp.early == 1 && month[0] == dateArr[0]) earlyLength++;
    if (month[0] == dateArr[0]) attendLength++;
  });
  for (let i = 0; i < names.length; i++) {
    const existance = await chechExistanceInEmployees(names[i].userName);
    let month = names[i].date;
    month = month.split("/");
    if (month[0] == dateArr[0]) {
      const existLength = await existance.json();
      names[i].name = existLength[0].firstName + " " + existLength[0].lastName;
      namesMatched.push(names[i]);
    }
  }
  return namesMatched;
}

//table for attendance employee week
async function loadNamesAttendanceWeek() {
  const response = await fetch(
    `http://localhost:3000/attendance?userName=${localStorage.getItem(
      "userName"
    )}`
  );
  const names = await response.json();
  console.log(names);
  dateArr = selectedDate.split("/");
  console.log(dateArr);
  if (dateArr[1] > 5) {
    names.forEach((emp) => {
      let day = emp.date;
      day = day.split("/");
      console.log(day);
      if (emp.late == 1 && day[1] >= dateArr[1] - 5 && day[0] == dateArr[0])
        lateLength++;
      if (emp.early == 1 && day[1] >= dateArr[1] - 5 && day[0] == dateArr[0])
        earlyLength++;
      if (
        day[0] == dateArr[0] &&
        (day[1] <= dateArr[1] || day[1] >= dateArr[1] - 5)
      )
        attendLength++;
    });
    for (let i = 0; i < names.length; i++) {
      const existance = await chechExistanceInEmployees(names[i].userName);
      let day = names[i].date;
      day = day.split("/");
      if (day[1] >= dateArr[1] - 5 && day[0] == dateArr[0]) {
        const existLength = await existance.json();
        names[i].name =
          existLength[0].firstName + " " + existLength[0].lastName;
        namesMatched.push(names[i]);
      } else continue;
    }
  } else {
    if (dateArr[1] > 1) {
      if (
        dateArr[0] - 1 == 1 ||
        dateArr[0] - 1 == 3 ||
        dateArr[0] - 1 == 5 ||
        dateArr[0] - 1 == 7 ||
        dateArr[0] - 1 == 9 ||
        dateArr[0] - 1 == 11
      ) {
        names.forEach((emp) => {
          let day = emp.date;
          day = day.split("/");
          if (
            emp.late == 1 &&
            ((day[1] >= dateArr[1] - 1 && day[0] == dateArr[0]) ||
              (day[1] > 31 - 7 + dateArr[1] && day[0] == dateArr[0] - 1))
          )
            lateLength++;
          if (
            emp.early == 1 &&
            ((day[1] >= dateArr[1] - 1 && day[0] == dateArr[0]) ||
              (day[1] > 31 - 7 + dateArr[1] && day[0] == dateArr[0] - 1))
          )
            earlyLength++;
          if (
            (day[1] >= dateArr[1] - 1 && day[0] == dateArr[0]) ||
            (day[1] > 31 - 7 + dateArr[1] && day[0] == dateArr[0] - 1)
          )
            attendLength++;
        });
        for (let i = 0; i < names.length; i++) {
          const existance = await chechExistanceInEmployees(names[i].userName);
          let day = names[i].date;
          day = day.split("/");
          if (
            (day[1] >= dateArr[1] - 1 && day[0] == dateArr[0]) ||
            (day[1] == 31 && day[0] == dateArr[0] - 1) ||
            (day[1] == 30 && day[0] == dateArr[0] - 1)
          ) {
            const existLength = await existance.json();
            names[i].name =
              existLength[0].firstName + " " + existLength[0].lastName;
            namesMatched.push(names[i]);
          } else continue;
        }
      } else
        names.forEach((emp) => {
          let day = emp.date;
          day = day.split("/");
          if (
            emp.late == 1 &&
            ((day[1] >= dateArr[1] - 1 && day[0] == dateArr[0]) ||
              (day[1] > 30 - 7 + dateArr[1] && day[0] == dateArr[0] - 1))
          )
            lateLength++;
          if (
            emp.early == 1 &&
            ((day[1] >= dateArr[1] - 1 && day[0] == dateArr[0]) ||
              (day[1] > 30 - 7 + dateArr[1] && day[0] == dateArr[0] - 1))
          )
            earlyLength++;
          if (
            (day[1] >= dateArr[1] - 1 && day[0] == dateArr[0]) ||
            (day[1] > 30 - 7 + dateArr[1] && day[0] == dateArr[0] - 1)
          )
            attendLength++;
        });
      for (let i = 0; i < names.length; i++) {
        const existance = await chechExistanceInEmployees(names[i].userName);
        let day = names[i].date;
        day = day.split("/");
        if (
          (day[1] >= dateArr[1] - 1 && day[0] == dateArr[0]) ||
          (day[1] > 30 - 7 + dateArr[1] && day[0] == dateArr[0] - 1)
        ) {
          const existLength = await existance.json();
          names[i].name =
            existLength[0].firstName + " " + existLength[0].lastName;
          namesMatched.push(names[i]);
        } else continue;
      }
    } else {
      names.forEach((emp) => {
        let day = emp.date;
        day = day.split("/");
        if (
          emp.late == 1 &&
          ((day[1] == 1 && day[0] == dateArr[0]) ||
            (day[1] <= 6 && day[0] == 12 && dar[2] == dateArr[2] - 1))
        )
          lateLength++;
        if (
          emp.early == 1 &&
          ((day[1] == 1 && day[0] == dateArr[0]) ||
            (day[1] <= 6 && day[0] == 12 && dar[2] == dateArr[2] - 1))
        )
          earlyLength++;
        if (
          (day[1] == 1 && day[0] == dateArr[0]) ||
          (day[1] <= 6 && day[0] == 12 && dar[2] == dateArr[2] - 1)
        )
          attendLength++;
      });
      for (let i = 0; i < names.length; i++) {
        const existance = await chechExistanceInEmployees(names[i].userName);
        let day = names[i].date;
        day = day.split("/");
        if (
          (day[1] == 1 && day[0] == dateArr[0]) ||
          (day[1] <= 6 && day[0] == 12 && dar[2] == dateArr[2] - 1)
        ) {
          const existLength = await existance.json();
          names[i].name =
            existLength[0].firstName + " " + existLength[0].lastName;
          namesMatched.push(names[i]);
        } else continue;
      }
    }
  }

  return namesMatched;
}

// check the email existance in employees
async function chechExistanceInEmployees(userName) {
  const existance = await fetch(
    `http://localhost:3000/employees?userName=${userName}`
  );
  return existance;
}

function removeData() {
  tbodyOne.innerHTML = "";
}
function removeDataRange() {
  tbodyTwo.innerHTML = "";
}
function DrawTable(attendanceData) {
  for (let i = 0; i < attendanceData.length; i++) {
    let row = document.createElement("tr"),
      tdName = document.createElement("td"),
      tduser = document.createElement("td"),
      tdArrival = document.createElement("td"),
      tdLate = document.createElement("td"),
      tdDate = document.createElement("td"),
      tdLeave = document.createElement("td"),
      tdEarly = document.createElement("td");
      let attendTime = attendanceData[i].time;
      attendTime = attendTime.split(":");
      let hours = Number(attendTime[0])-9, min =Number(attendTime[1])-5;
      let ltime= attendanceData[i].leaving,lhours,lmin;
      ltime = ltime.split(":");
      if(ltime[1]>0){
        lmin= 60-ltime[1];
        if(ltime[0]<10){
          lhours=16-ltime[0]
        }else{
          lhours=16-ltime[0];
        }
      }else{
        lhours=17-ltime[0];
        lmin=0;
      }
    (tdName.innerText = attendanceData[i].name),
      (tduser.innerText = attendanceData[i].userName),
      (tdArrival.innerText = attendanceData[i].time),
      (tdLate.innerText = (hours+":"+min)),
      (tdDate.innerText = attendanceData[i].date),
      (tdLeave.innerText = attendanceData[i].leaving),
      (tdEarly.innerText = (lhours+":"+lmin));
    row.appendChild(tdName),
      row.appendChild(tduser),
      row.appendChild(tdArrival),
      row.appendChild(tdLate),
      row.appendChild(tdDate),
      row.appendChild(tdLeave),
      row.appendChild(tdEarly);
    tbodyOne.appendChild(row);
  }
} // end attendance table options
function DrawTableRange(attendanceDataRange) {
  for (let i = 0; i < attendanceDataRange.length; i++) {
    let row = document.createElement("tr"),
      tduser = document.createElement("td"),
      tdArrival = document.createElement("td"),
      tdLate = document.createElement("td"),
      tdDate = document.createElement("td"),
      tdLeave = document.createElement("td"),
      tdEarly = document.createElement("td");
      let attendTime = attendanceDataRange[i].time;
      attendTime = attendTime.split(":");
      let hours = Number(attendTime[0])-9, min =Number(attendTime[1])-5;
      let ltime= attendanceDataRange[i].leaving,lhours,lmin;
      ltime = ltime.split(":");
      if(ltime[1]>0){
        lmin= 60-ltime[1];
        if(ltime[0]<10){
          lhours=16-ltime[0]
        }else{
          lhours=16-ltime[0];
        }
      }else{
        lhours=17-ltime[0];
        lmin=0;
      }
    (tduser.innerText = attendanceDataRange[i].userName),
      (tdArrival.innerText = attendanceDataRange[i].time),
      (tdLate.innerText = (hours+":"+min)),
      (tdDate.innerText = attendanceDataRange[i].date),
      (tdLeave.innerText = attendanceDataRange[i].leaving),
      (tdEarly.innerText = (lhours+":"+lmin));
    row.appendChild(tduser),
      row.appendChild(tdArrival),
      row.appendChild(tdLate),
      row.appendChild(tdDate),
      row.appendChild(tdLeave),
      row.appendChild(tdEarly);
    tbodyTwo.appendChild(row);
  }
} // end attendance attendance table range

// logout 
logout.addEventListener('click', ()=>{
  console.log("done ")
})

// window.onbeforeunload = function (e) {
//   window.location.href="employeeProfile.html";
//   // e.preventDeafult();
// };

window.history.forward();
function noBack() {
  window.location.href="home.html";
}