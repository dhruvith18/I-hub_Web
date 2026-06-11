import { db, auth } from "./firebase-config.js";

import {
    collection,
    getDocs,
    query,
    orderBy
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
    onAuthStateChanged,
    signOut
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const tableBody =
    document.getElementById("feedbackTable");

const logoutBtn =
    document.getElementById("logoutBtn");

const chartCanvas =
    document.getElementById("visitorsChart");

let chartInstance = null;

if (!tableBody || !logoutBtn || !chartCanvas) {
    throw new Error("Admin dashboard is missing required page elements.");
}

/* ---------- AUTH CHECK ---------- */

onAuthStateChanged(auth, user => {

    if (!user) {
        window.location.href = "admin-login.html";
        return;
    }

    loadFeedback().catch(error => {
        console.error(error);
        tableBody.innerHTML = "";
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 6;
        cell.textContent = "Could not load feedback. Please try again later.";
        row.appendChild(cell);
        tableBody.appendChild(row);
    });

});

/* ---------- LOAD TABLE ---------- */

async function loadFeedback() {

    tableBody.innerHTML = "";

    const q = query(
        collection(db, "Feedback"),
        orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    const visitorData = [];

    snapshot.forEach(doc => {

        const data = doc.data();

        const row = document.createElement("tr");

        const createdAt =
            data.createdAt && typeof data.createdAt.toDate === "function"
                ? data.createdAt.toDate().toLocaleString()
                : "";

        [
            data.name,
            data.email,
            data.phoneNumber,
            data.visitors,
            data.message,
            createdAt
        ].forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value || "";
            row.appendChild(cell);
        });

        tableBody.appendChild(row);

        visitorData.push(Number(data.visitors) || 0);

    });

    createChart(visitorData);

}

/* ---------- CHART ---------- */

function createChart(data) {

    if (typeof Chart === "undefined") {
        console.error("Chart.js is not loaded.");
        return;
    }

    if(chartInstance){
        chartInstance.destroy();
    }

    chartInstance = new Chart(chartCanvas, {
        type: "bar",

        data: {
            labels: data.map((_, i) => `Entry ${i + 1}`),

            datasets: [{
                label: "Visitors",
                data: data
            }]
        },

        options: {
            responsive: true
        }
    });

}

/* ---------- TABS ---------- */

document.querySelectorAll(".tab-btn")
.forEach(btn => {

    btn.addEventListener("click", () => {

        document
        .querySelectorAll(".tab-btn")
        .forEach(b => b.classList.remove("active"));

        document
        .querySelectorAll(".tab-content")
        .forEach(c => c.classList.remove("active"));

        btn.classList.add("active");

        const tabContent = document.getElementById(btn.dataset.tab);
        if (tabContent) {
            tabContent.classList.add("active");
        }

    });

});

/* ---------- LOGOUT ---------- */

logoutBtn.addEventListener("click", async () => {

    await signOut(auth);

    window.location.href =
        "admin-login.html";

});
