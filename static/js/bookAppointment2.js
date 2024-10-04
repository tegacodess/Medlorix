// Retrieve appointment details from local storage
function getAppointmentDetails() {
    const appointmentDetails = JSON.parse(localStorage.getItem('appointmentDetails'));
    if (!appointmentDetails) {
        console.error('No appointment details found in local storage');
        return null;
    }
    return appointmentDetails;
}

// Populate the form with retrieved details
function populateForm(details) {
    if (!details) return;

    document.getElementById('speciality').value = details.speciality || '';
    // Add more fields as necessary
}

// Handle the booking process
async function bookAppointment(doctorId) {
    const appointmentDetails = getAppointmentDetails();
    if (!appointmentDetails) {
        alert('Please complete the first step of the appointment booking process.');
        return;
    }

    // Combine the details from local storage with the selected doctor
    const finalBookingDetails = {
        ...appointmentDetails,
        doctorId: doctorId
    };

    try {
        const response = await fetch('/book-appointment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(finalBookingDetails),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        alert('Appointment booked successfully!');
        
        // Clear the local storage after successful booking
        localStorage.removeItem('appointmentDetails');
        
        // Optionally, redirect to a confirmation page
        // window.location.href = '/booking-confirmation';
    } catch (error) {
        console.error('Error booking appointment:', error);
        alert('There was an error booking your appointment. Please try again.');
    }
}

// Run when the page loads
document.addEventListener('DOMContentLoaded', function() {
    const details = getAppointmentDetails();
    populateForm(details);

    // Add click event listeners to all "Book Now" buttons
    document.querySelectorAll('.book-now').forEach(button => {
        button.addEventListener('click', function() {
            // Assume each doctor card has a data-doctor-id attribute
            const doctorId = this.closest('.doctor-card').dataset.doctorId;
            bookAppointment(doctorId);
        });
    });
});