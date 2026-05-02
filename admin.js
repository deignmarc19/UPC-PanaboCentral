// Burger Menu
const burgerBtn = document.getElementById("burgerBtn");
const burgerMenu = document.getElementById("burgerMenu");

burgerBtn.addEventListener("click", function() {
    burgerMenu.classList.toggle("open");
    burgerBtn.classList.toggle("active");

    if (burgerMenu.classList.contains("open")) {
        burgerBtn.innerText = "✕";
    } else {
        burgerBtn.innerText = "☰";
    }
});

// Load attendance data from localStorage
function loadData() {
    const data = JSON.parse(localStorage.getItem("attendance")) || [];
    const table = document.getElementById("attendanceTable");
    const totalCount = document.getElementById("totalCount");

    // Clear table first
    table.innerHTML = "";

    // Update counter
    totalCount.innerText = data.length;

    // Add rows
    data.forEach(function(record) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${record.name}</td>
            <td>${record.department}</td>
            <td>${record.time}</td>
            <td>${record.date}</td>
        `;
        table.appendChild(row);
    });
}

// Save as CSV
document.getElementById("saveBtn").addEventListener("click", function() {
    const data = JSON.parse(localStorage.getItem("attendance")) || [];

    let csv = "Name,Department,Time,Date\n";
    data.forEach(function(record) {
        csv += `${record.name},${record.department},${record.time},${record.date}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "attendance.csv";
    a.click();

    burgerMenu.classList.remove("open");
});

// Clear Data
document.getElementById("clearBtn").addEventListener("click", function() {
    const confirm = window.confirm("Are you sure you want to clear all data?");
    if (confirm) {
        localStorage.removeItem("attendance");
        loadData();
        burgerMenu.classList.remove("open");
        alert("Data cleared successfully!");
    }
});

// Load data on page open
loadData();