// Submit button
const submitBtn = document.getElementById("submitBtn");
const nameInput = document.getElementById("nameInput");
const deptInput = document.getElementById("deptInput");

submitBtn.addEventListener("click", function() {

    // Get values
    const name = nameInput.value.trim();
    const dept = deptInput.value.trim();

    // Check if empty
    if (name === "" || dept === "") {
        alert("Please fill in all fields!");
        return;
    }

    // Get current time and date
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const date = now.toLocaleDateString();

    // Create attendance record
    const record = {
        name: name,
        department: dept,
        time: time,
        date: date
    };

    // Save to localStorage
    const existing = JSON.parse(localStorage.getItem("attendance")) || [];
    existing.push(record);
    localStorage.setItem("attendance", JSON.stringify(existing));

    nameInput.value = "";
    deptInput.value = "";

    // Success message
    alert("Attendance submitted successfully! 🙏");
});