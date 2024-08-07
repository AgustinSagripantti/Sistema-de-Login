const mensajeError = document.getElementsByClassName("error")[0]

document.getElementById("login-form").addEventListener("submit",async (e)=>{
  e.preventDefault();
  const user = e.target[0].value;
  const password = e.target[1].value;
  const res = await fetch("http://localhost:4000/api/login",{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body: JSON.stringify({
      user,password
    })
  });
  if(!res.ok){ 
    document.getElementById("user").value = "";
    document.getElementById("password").value = "";
    return mensajeError.classList.toggle("escondido",false);
  }
  const resJson = await res.json();
  if(resJson.redirect){
    window.location.href = resJson.redirect;
  }
})
