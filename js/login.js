let userValue = document.getElementById("user");
let smallUser = document.getElementById("smalluser");
let password = document.getElementById("password");
let smallPassword = document.getElementById("smallpassword");

let login = document.getElementById("loginbutton");
let form = document.querySelector(".form");
// removing the style of the small after typing
userValue.addEventListener('keydown',()=>{smallUser.style.display = "none";});
password.addEventListener('keydown',()=>{smallPassword.style.display = "none";});

form.addEventListener("submit", (e) => {
  e.preventDefault();
});
login.addEventListener("click", async(e)=>{

    e.preventDefault();
    
    let user = await LoadName(userValue.value);
    console.log(user);
    if(user.length!=0){
      if(user[0].password===password.value){
        localStorage.setItem("id",user[0].id);
        localStorage.setItem("userName",user[0].userName);
        localStorage.setItem("email",user[0].email);
        localStorage.setItem("role",user[0].role);
        localStorage.setItem("firstName",user[0].firstName);
        localStorage.setItem("lastName",user[0].lastName);
        if(user[0].role==="employee"){
          window.location.href="employeesProfile.html";
        }else if(user[0].role==="admin"){  
          window.location.href="admin.html";
        }else if(user[0].role==="secuirty"){
          window.location.href="attendance.html";
        }
      }
      else{
        smallPassword.style.display="inline";
        e.preventDefault();
      }
    }else{
      smallUser.style.display="inline";
      e.preventDefault();
    }


});
function reset(){
  user.value = "";
  password.value = "";
  smallUser.style.display="none";
  smallPassword.style.display="none";
}

async function LoadName(employee){
  let response = await fetch(`http://localhost:3000/employees?userName=${employee}`);

  let user = await response.json();
  console.log(user);
  return user;
}














//   // ckeck function
//   function check(eventt) {
//     smallUser.style.display = "none";
//     smallPassword.style.display = "none";
//     if (user.value.trim()=="") {
//       smallUser.style.display = "inline";
//       eventt.preventDefault();
//     } else {
//       smallUser.style.display = "none";
//       flag++;
//     }
//     // check password format
//     if (password.value.trim() == "") {
//       smallPassword.style.display = "inline";
//       eventt.preventDefault();
//     } else {
//       smallPassword.style.display = "none";
//       flag++;
//     }
//     if(flag==2){
//       employee.userName=user.value;
//       employee.password=password.value;
//       if(!(checkExistance(employee))){
//         eventt.preventDefault();
//         alert("Please Enter a vaild data");
//       }
//     }
//   }

// // check the existance 
// async function checkExistance(employee) {
//   const mail = await checkEmail(employee);
//   const mailLen = await mail.json();
  
//   const pass = await checkPassword(employee);
//   const passlen = await pass.json();
//   console.log(mailLen + "  "+ passlen);
//   // if((mailLen.length)!=0 && (passlen.length)!=0){
//   //   console.log(mailLen.userName+"   "+mailLen.userName);
//   //   if(mailLen.userName==mailLen.userName){
//   //     return 1;
//   //   }
//   //   return 0;
    
//   // }
  
// }

// // check the email existance in employees
// async function checkEmail(employee) {
//   const existance = await fetch(
//     `http://localhost:3000/employees?userName=${employee.userName}`
//   );
//   console.log("user: ",existance);
//   return existance;
// }
// // check the password existance in employees
// async function checkPassword(employee) {
//   const existance = await fetch(
//     `http://localhost:3000/pending?password=${employee.password}`
//   );
//   console.log("pass: ",existance);
//   return existance;
// }
