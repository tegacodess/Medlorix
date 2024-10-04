function sendMail() {
  var params = {
    from_name : document.getElementById("name").value,
    email : document.getElementById("email").value,
    subject : document.getElementById("subject").value,
    number : document.getElementById("phone").value,
    message : document.getElementById("message").value
  };
  
  const serviceID = "service_62g2flb";
  const templateID = "template_f3lyioo";
  
  emailjs
    .send(serviceID, templateID, params)
    .then((res)  => {
      document.getElementById("name").value = "";
      document.getElementById("email").value = "";
      document.getElementById("subject").value = "";
      document.getElementById("phone").value = "";
      document.getElementById("message").value = "";
      console.log(res);
      alert("Your message sent successfully!!!");
    })
    .catch((err) => console.log(err));
};
