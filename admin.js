// Firebase config
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getFirestore, collection, onSnapshot, deleteDoc, getDocs } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBqubO0ZNhDG2ZZheFKg898kb_17T67e5I",
    authDomain: "church-attendance-add52.firebaseapp.com",
    projectId: "church-attendance-add52",
    storageBucket: "church-attendance-add52.firebasestorage.app",
    messagingSenderId: "836701669987",
    appId: "1:836701669987:web:34abe89d45383651ffc656"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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

// Load data in real time
const tableBody = document.getElementById("attendanceTable");
const totalCount = document.getElementById("totalCount");

onSnapshot(collection(db, "attendance"), (snapshot) => {
    tableBody.innerHTML = "";
    totalCount.innerText = snapshot.size;

    snapshot.forEach((doc) => {
        const data = doc.data();
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${data.name}</td>
            <td>${data.department}</td>
            <td>${data.time}</td>
            <td>${data.date}</td>
        `;
        tableBody.appendChild(row);
    });
});

// Save as CSV
document.getElementById("saveBtn").addEventListener("click", async function() {
    const snapshot = await getDocs(collection(db, "attendance"));
    let csv = "Name,Department,Time,Date\n";
    snapshot.forEach((doc) => {
        const d = doc.data();
        csv += `${d.name},${d.department},${d.time},${d.date}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", "attendance.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    burgerMenu.classList.remove("open");
});

// Clear Data
document.getElementById("clearBtn").addEventListener("click", async function() {
    const confirm = window.confirm("Are you sure you want to clear all data?");
    if (confirm) {
        const snapshot = await getDocs(collection(db, "attendance"));
        snapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
        });
        burgerMenu.classList.remove("open");
        alert("Data cleared successfully!");
    }
});
