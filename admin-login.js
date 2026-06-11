import { auth } from "./firebase-config.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const loginBtn = document.getElementById("loginBtn");
const errorText = document.getElementById("error");

if (loginBtn && errorText) {
    loginBtn.addEventListener("click", async () => {

        errorText.textContent = "";

        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");
        const email = emailInput ? emailInput.value.trim() : "";
        const password = passwordInput ? passwordInput.value : "";

        if (!email || !password) {
            errorText.textContent = "Please enter email and password";
            return;
        }

        try {

            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            window.location.href = "admin-dashboard.html";

        } catch (error) {

            console.error(error);

            errorText.textContent =
                "Invalid email or password";

        }

    });
}
