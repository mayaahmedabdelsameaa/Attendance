let menu_btn = document.querySelector("#menu-btn");
let sidebar = document.querySelector("#sidebar");
let container = document.querySelector(".my-container");
let table = document.querySelector(".table-striped");
let logout = document.querySelector(".logout a");
let scrollButton = document.querySelector("#myBtn");

var pendingData = [];
var employeeData = [];
menu_btn.addEventListener("click", () => {
  sidebar.classList.toggle("active-nav");
  container.classList.toggle("active-cont");
});



window.onload = async function () {
  pendingData = await loadNamesPending();
  employeeData = await loadNamesEmployee();
  await canvesColor();
  await drawCanves();
  await bindDataPending();
  await bindDataEmployee();
  let name = document.getElementById("name"),
      email = document.getElementById("userEmail"),
      UserName = document.getElementById("userUserName");
  name.innerHTML=`${localStorage.getItem("firstName")} ${localStorage.getItem("lastName")}`;
  email.innerHTML = localStorage.getItem("email");
  UserName.innerHTML = localStorage.getItem("userName");
};// end of load function


scrollButton.addEventListener("click",()=>{
  document.body.scrollTo=0;
  document.documentElement.scrollTop=0;
});// end of scroll to top function 


// chart circel for absent and present in month
let xValues = ["Absent", "Present"];
let yValues = [40, 60];
let barColors = ["#234099", "#6b79fd"];

new Chart("myChart", {
  type: "pie",
  data: {
    labels: xValues,
    datasets: [
      {
        backgroundColor: barColors,
        data: yValues,
      },
    ],
  },
  options: {
    title: {
      display: true,
      text: "Absent and present for month",
    },
  },
});

//table for pending employee

async function loadNamesPending() {
  const response = await fetch("http://localhost:3000/pending");
  const names = await response.json();
  return names;
}
function canvesColor() {
  CanvasJS.addColorSet("colors", [
    "#234099",
    "#6b79fd",
    "#234099",
    "#6b79fd",
    "#234099",
    "#6b79fd",
    "#234099",
  ]);
}
function drawCanves() {
  let chart = new CanvasJS.Chart("Container", {
    animationEnabled: true,
    colorSet: "colors",
    title: {
      text: "",
    },

    toolTip: {
      shared: true,
    },
    legend: {
      cursor: "pointer",
      itemclick: toggleDataSeries,
    },
    data: [
      {
        type: "column",
        name: "Present",
        legendText: "Present",
        backgroundColor: "#6b79fd",
        showInLegend: true,
        dataPoints: [
          { label: "January", y: 266.21 },
          { label: "February ", y: 302.25 },
          { label: "March  ", y: 157.2 },
          { label: "April", y: 148.77 },
          { label: "June", y: 101.5 },
          { label: "July", y: 97.8 },
          { label: "August", y: 85.8 },
          { label: "September ", y: 80.8 },
          { label: "October", y: 70.8 },
          { label: "November", y: 78.3 },
          { label: "December", y: 66.3 },
        ],
      },
      {
        type: "column",
        name: "Absent ",
        legendText: "Absent",
        axisYType: "secondary",
        showInLegend: true,
        dataPoints: [
          { label: "January", y: 10.46 },
          { label: "February", y: 2.27 },
          { label: "March ", y: 3.99 },
          { label: "April", y: 4.45 },
          { label: "June", y: 2.92 },
          { label: "July", y: 3.1 },
          { label: "August", y: 4.4 },
          { label: "September", y: 6.45 },
          { label: "October", y: 8.2 },
          { label: "November", y: 2.2 },
          { label: "December", y: 3.2 },
        ],
      },
    ],
  });
  chart.render();
  function toggleDataSeries(e) {
    if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
      e.dataSeries.visible = false;
    } else {
      e.dataSeries.visible = true;
    }
    chart.render();
  }
}

function bindDataPending() {
  var table = $("#pending-table").DataTable({
    data: pendingData,
    columns: [
      { data: "firstName" },
      { data: "lastName" },
      { data: "age" },
      { data: "email" },
      { data: "userName" },
      { data: "address" },
      { data: "" ,
        defaultContent: `<select class='select'><option value='admin'>Admin</option><option value='employee'>Employee</option><option value='security'>Security</option> </select>`,
      },
      {
        data: "Approve",
        defaultContent: "<button class='btn-approve'>Approve</button>",
      },
      {
        data: "Disapprove",
        defaultContent: "<button class='btn-disapprove'>Disapprove</button>",
      },
    ],
  });
  $("#pending-table tbody").on("click", ".btn-approve", function () {
    rowData = table.row($(this).parents("tr")).data();
    rowData.role = document.querySelector(".select").value;
    console.log(rowData);
    let RemoveId = rowData.id;
    rowData.id="";
    postEmp(rowData);
    RemoveFromPending(RemoveId);
    sendResetPasswordEmail(rowData.email, rowData.userName, rowData.password);
  });
  $("#pending-table tbody").on("click", ".btn-disapprove", async function () {
    rowDataLeave = table.row($(this).parents("tr")).data();
    console.log(rowDataLeave);
    let RemoveId = rowDataLeave.id;
    rowDataLeave.id = "";
    await RemoveFromPending(RemoveId);
  });
}// end pending function 

//post employee for database
async function postEmp(data) {
  const rowData = data;
  const response = await fetch("http://localhost:3000/employees", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
// load employee data
async function loadNamesEmployee() {
  const response = await fetch("http://localhost:3000/employees");
  const names = await response.json();
  return names;
}
// delete from pending
async function RemoveFromPending(Id) {
  const response = await fetch(`http://localhost:3000/pending/${Id}`,{
  method:"DELETE"
  });
}

function bindDataEmployee() {
  $("#table-employee").DataTable({
    data: employeeData,
    columns: [
      { data: "firstName" },
      { data: "lastName" },
      { data: "email" },
      { data: "address" },
      { data: "role" },
    ],
  });
}


function sendResetPasswordEmail(email,userName,Password) {
  Email.send({
    SecureToken: "7d499b9e-7101-425b-923c-c8fe6fcaeac9",
    To: email,
    From: "techwavesolutionjs@gmail.com",
    Subject: "Password Reset Instructions",
    Body: `userName: ${userName}, Password: ${Password}`,
  }).then(
    message => alert(message)
  );
}// end of email function 

// logout 
logout.addEventListener('click', ()=>{
  console.log("done ")
})

// window.onbeforeunload = function (e) {
//   e.preventDefault();
//   alert("you can't navigate from one page to another");
// };
window.history.forward();
function noBack() {
  window.history.forward();
}