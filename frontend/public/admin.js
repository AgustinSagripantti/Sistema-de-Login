window.addEventListener("load", async () => {
  try {
      const res = await fetch("https://sistemadeloginbackend.vercel.app/admin", {
      method: "GET",
      credentials: "include" // Si se necesita enviar cookies 
    });
  } catch (error) {
    console.error("Error", error);
  }
});

document.getElementsByClassName("button-input")[0].addEventListener("click",()=>{
  document.cookie ='jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  document.location.href = "/index.html"
})