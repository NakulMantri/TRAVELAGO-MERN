import axios from "axios";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [number, setNumber] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumberError, setPhoneNumberError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordSuggestions, setPasswordSuggestions] = useState([]);
    const [redirect, setRedirect] = useState(false); // redirecting to homepage

    async function registerUser(ev) {
        ev.preventDefault();

        // Phone number validation
        const phoneNumberPattern = /^\d{10}$/;
        if (!phoneNumberPattern.test(number)) {
            setPhoneNumberError("Phone number should be 10 digits");
            return;
        } else {
            setPhoneNumberError("");
        }

        // Email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setEmailError("Invalid email address");
            return;
        } else {
            setEmailError("");
        }

        // Password validation
        const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
        if (!passwordPattern.test(password)) {
            setPasswordError(
                "Password should be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character (!@#$%^&*)"
            );
            return;
        } else {
            setPasswordError("");
        }

        try {
            const response = await axios.post("/register", {
                name,
                email,
                number,
                password,
            });
            const { data } = response;

            if (data.success) {
                alert("Registration successful :) !!");
                setRedirect(true);
            } else {
                alert("User already exists. Please login or register with a different email");
                setName("");
                setEmail("");
                setNumber("");
                setPassword("");
            }
        } catch (e) {
            alert("Registration failed. Please try again later ;(");
        }
    }

    if (redirect) {
        return <Navigate to={"/"} />;
    }

    function checkPasswordStrength(password) {
        const suggestions = [];

        if (password.length < 8) {
            suggestions.push("Password should be at least 8 characters long");
        }
        if (!/[a-z]/.test(password)) {
            suggestions.push("Include at least one lowercase letter");
        }
        if (!/[A-Z]/.test(password)) {
            suggestions.push("Include at least one uppercase letter");
        }
        if (!/\d/.test(password)) {
            suggestions.push("Include at least one digit");
        }
        if (!/[!@#$%^&*]/.test(password)) {
            suggestions.push("Include at least one special character (!@#$%^&*)");
        }

        return suggestions;
    }

    function handlePasswordChange(ev) {
        const newPassword = ev.target.value;
        setPassword(newPassword);

        const suggestions = checkPasswordStrength(newPassword);
        setPasswordSuggestions(suggestions);
    }

    return (
        <div className="mt-8 grow flex items-center justify-around">
            <div className="-mb-6 shadow-2xl px-8 py-8 max-w-full max-h-full">
                <h2 className="text-center font-extrabold text-3xl mb-2">Welcome to Travelago!</h2>

                <h4 className="text-2xl text-center mb-4 font-semibold">Register</h4>

                <form className="max-w-md mx-auto" onSubmit={registerUser}>
                    <input
                        type="text"
                        placeholder="Ankit Mehra"
                        value={name}
                        onChange={(ev) => setName(ev.target.value)}
                    />

                    <input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(ev) => setEmail(ev.target.value)}
                    />
                    {emailError && <div className="text-red-500 mb-2">{emailError}</div>}

                    <input
                        type="text"
                        placeholder="Phone No."
                        value={number}
                        onChange={(ev) => setNumber(ev.target.value)}
                    />
                    {phoneNumberError && (
                        <div className="text-red-500 mb-2">{phoneNumberError}</div>
                    )}

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                    {passwordError && (
                        <div className="text-red-500 mb-2">{passwordError}</div>
                    )}
                    {passwordSuggestions.length > 0 && (
                        <div className="text-yellow-500 mb-2">
                            <ul>
                                {passwordSuggestions.map((suggestion, index) => (
                                    <li key={index}>{suggestion}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <button className="primary" type="submit">
                        Register
                    </button>
                    <div className="text-center py-2 text-gray-500">
                        Already a member{" "}
                        <Link className="underline text" to={"/login"}>
                            Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
