document.addEventListener('DOMContentLoaded', function() {
    const resultsTableBody = document.getElementById('resultsTableBody');

    // Retrieve form data from localStorage
    const formData = JSON.parse(localStorage.getItem('applicationData'));

    if (formData) {
        // Generate dummy data for the table
        const dummyData = [
            { status: 'Pending' },
            { status: 'Approved' },
            { status: 'Declined' },
            { status: 'Pending' }
        ];

        // Populate the table
        dummyData.forEach((row, index) => {
            const tr = document.createElement('tr');
            const currentDate = new Date().toLocaleDateString();
            tr.innerHTML = `
                <td>Dr. ${formData.firstName} ${formData.lastName}</td>
                <td>12345678</td>
                <td>${currentDate}</td>
                <td>${currentDate}</td>
                <td>${row.status}</td>
                <td><button class="bg-blue-500 text-white px-2 py-1 rounded">View</button></td>
            `;
            resultsTableBody.appendChild(tr);
        });

        // Clear the localStorage after using the data (optional)
        // localStorage.removeItem('applicationData');
    } else {
        resultsTableBody.innerHTML = '<tr><td colspan="6">No application data found.</td></tr>';
    }
});