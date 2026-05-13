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

// Request location permission on page load
window.addEventListener("load", function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            () => console.log("Location permission granted!"),
            () => console.log("Location permission denied!")
        );
    }
});

// Get location function
function getLocation() {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            resolve("Location not supported");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
                    );
                    const data = await response.json();
                    const road = data.address.road || 
                        data.address.street || 
                        data.address.neighbourhood || "";
                    const city = data.address.city || 
                        data.address.town || 
                        data.address.municipality || 
                        data.address.village || "";
                    const province = data.address.state || "";
                    const parts = [road, city, province].filter(Boolean);
                    resolve(parts.join(", "));
                } catch {
                    resolve(`${lat.toFixed(4)}, ${lon.toFixed(4)}`);
                }
            },
            () => resolve("Location denied")
        );
    });
}

submitBtn.addEventListener("click", async function() {
    const name = nameInput.value.trim();
    const dept = deptInput.value.trim();

    if (name === "" || dept === "") {
        alert("Please fill in all fields!");
        return;
    }

    const now = new Date();
    const today = now.toLocaleDateString();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    try {
        // Check duplicate
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

        // Disable button while getting location
        submitBtn.disabled = true;
        submitBtn.innerText = "Getting location...";

        // Get location
        const location = await getLocation();

        // Save to Firebase
        await addDoc(collection(db, "attendance"), {
            name: name,
            department: dept,
            time: time,
            date: today,
            location: location
        });

        nameInput.value = "";
        deptInput.value = "";
        submitBtn.disabled = false;
        submitBtn.innerText = "Submit";
        alert("Attendance submitted successfully! 🙏");

    } catch (error) {
        alert("Error submitting attendance. Please try again!");
        submitBtn.disabled = false;
        submitBtn.innerText = "Submit";
        console.error(error);
    }
});
