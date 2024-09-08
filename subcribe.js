// Get references to HTML elements
const emailInput = document.getElementById("emailInput");
const subscribeButton = document.getElementById("subscribeButton");
const messageDisplay = document.getElementById("alertMessage");

// Retrieve the stored emails from localStorage or initialize an empty array
let emails = JSON.parse(localStorage.getItem("emails")) || [];

// Event listener for subscribe button
subscribeButton.addEventListener("click", function() {
  const email = emailInput.value.trim();  // Get email from input field and trim any extra spaces

  if (email === "") {
    messageDisplay.textContent = "Please enter a valid email address.";
    messageDisplay.style.color = 'red';
    return;
  }
  // Check if the email already exists in the array
  if (emails.includes(email)) {
    messageDisplay.textContent = "Email already exists!";
    messageDisplay.style.color = 'red';
  } 
  // Add email to the array and update localStorage
  else {
    emails.push(email);
    localStorage.setItem("emails", JSON.stringify(emails));
    messageDisplay.textContent = "Subscribed successfully!";
    messageDisplay.style.color = 'green';
    var params = {
      email : document.getElementById("emailInput").value,
    };
    
    const serviceID = "service_s6b52ap";
    const templateID = "template_4w3fv0c";
    
    emailjs
      .send(serviceID, templateID, params)
      .then((res)  => {
        document.getElementById("emailInput").value = "";
        console.log(res);
      })
      .catch((err) => console.log(err));

  }

  emailInput.value = "";  // Clear the input field after submission

  let storedEmails = JSON.parse(localStorage.getItem("emails")) || [];
  console.log(storedEmails);
});