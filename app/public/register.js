const mensajeError = document.getElementsByClassName("error")[0];

document.getElementById("register-form").addEventListener("submit",async(e)=>{
  e.preventDefault();
  console.log(e.target[0].value,)
  const res = await fetch("http://localhost:4000/api/register",{
    method:"POST",
    headers:{
      "Content-Type" : "application/json"
    },
    body: JSON.stringify({
      user: e.target[0].value,
      email: e.target[1].value,
      password: e.target[2].value
    })
  });
  if(!res.ok){
    document.getElementById("user").value = "";
    document.getElementById("mail").value = "";
    document.getElementById("password").value = "";
    return mensajeError.classList.toggle("escondido",false);
  } 
  const resJson = await res.json();
  if(resJson.redirect){
    window.location.href = resJson.redirect;
  }
})