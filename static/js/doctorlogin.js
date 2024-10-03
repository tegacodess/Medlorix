  document.getElementById('doctorApplicationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    var formData = new FormData(this);

    fetch('/doctor-login1', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = data.redirect;
        } else {
            console.error('Error:', data.error);
            // Handle error (e.g., show error message to user)
        }
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle network errors
    });
});
  