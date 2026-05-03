import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

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

    // Get today's date
    const now = new Date();
    const today = now.toLocaleDateString();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    try {
        // Check if name already submitted today
        const q = query(
            collection(db, "attendance"),
            where("name", "==", name),
            where("date", "==", today)
        );

        const existing = await getDocs(q);

        if (!existing.empty) {
            alert("⚠️ " + name + " already submitted attendance today!");
            return;
        }

        // Save to Firebase
        await addDoc(collection(db, "attendance"), {
            name: name,
            department: dept,
            time: time,
            date: today
        });

        nameInput.value = "";
        deptInput.value = "";
        alert("Attendance submitted successfully! 🙏");

    } catch (error) {
        alert("Error submitting attendance. Please try again!");
        console.error(error);
    }
});