const mensajeError = document.getElementsByClassName("error")[0]

window.addEventListener("load", async () => {
  try {
      const res = await fetch("https://sistemadeloginbackend.vercel.app/login", {
      method: "GET",
      credentials: "include" // Si se necesita enviar cookies 
    });

    const resJson = await res.json();

    if (resJson.redirect) {
      window.location.href = resJson.redirect;
    }
  } catch (error) {
    console.error("Error", error);
  }
});


document.getElementById("login-form").addEventListener("submit",async (e)=>{
  e.preventDefault();
  const user = e.target[0].value;
  const password = e.target[1].value;
  const res = await fetch("https://sistemadeloginbackend.vercel.app/api/login",{
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
