// Firebase config
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

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

// Submit button
const submitBtn = document.getElementById("submitBtn");
const nameInput = document.getElementById("nameInput");
const deptInput = document.getElementById("deptInput");

submitBtn.addEventListener("click", async function() {
    const name = nameInput.value.trim();
    const dept = deptInput.value.trim();

    if (name === "" || dept === "") {
        alert("Please fill in all fields!");
        return;
    }

    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const date = now.toLocaleDateString();

    try {
        await addDoc(collection(db, "attendance"), {
            name: name,
            department: dept,
            time: time,
            date: date
        });

        nameInput.value = "";
        deptInput.value = "";
        alert("Attendance submitted successfully! 🙏");

    } catch (error) {
        alert("Error submitting attendance. Please try again!");
        console.error(error);
    }
});
