import React, { useState, useRef } from "react";
import useStore from "../../store/store";
import { useNavigate } from "react-router-dom";
import { SERVER_URI } from "../../uri/uril";


const Verification = ({ length }) => {
    const [code, setCode] = useState(Array(length).fill(""));
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const inputsRef = useRef([]);
    const token = useStore((state) => state.token);

    const navigate = useNavigate();

    const verifyUrl = `${SERVER_URI}/activateAccount`;

    const handleChange = (e, idx) => {
        const val = e.target.value;
        if (/^[0-9]?$/.test(val)) {
            const newCode = [...code];
            newCode[idx] = val;
            setCode(newCode);

            if (val && idx < length - 1) {
                inputsRef.current[idx + 1].focus();
            }

            if (newCode.every((num) => num !== "")) {
                handleVerify(newCode.join(""));
            }
        }
    };

    const handleKeyDown = (e, idx) => {
        if (e.key === "Backspace" && code[idx] === "" && idx > 0) {
            inputsRef.current[idx - 1].focus();
        }
    };

    // Function to verify code with server
    const handleVerify = async (enteredCode) => {
        setLoading(true);
        setMessage("");
        try {
            const response = await fetch(verifyUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token: token,
                    code: enteredCode
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("✅ Verification successful!");
                navigate("/login", { replace: true });
            } else {
                setMessage(`❌ Verification failed: ${data.message}`);
                setCode(Array(length).fill(""));
                inputsRef.current[0].focus();
            }
        } catch (error) {
            setMessage("❌ Network error. Please try again.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen justify-center items-center space-y-4">
            <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold text-center text-black mb-6">
                    Enter Verification Code
                </h2>
                <div className="flex justify-center space-x-3">
                    {code.map((num, idx) => (
                        <input
                            key={idx}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={num}
                            ref={(el) => (inputsRef.current[idx] = el)}
                            onChange={(e) => handleChange(e, idx)}
                            onKeyDown={(e) => handleKeyDown(e, idx)}
                            className="w-12 h-12 text-center text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                            aria-label={`Digit ${idx + 1}`}
                            disabled={loading}
                        />
                    ))}
                </div>
            </div>
            {loading && <p className="text-gray-500">Verifying...</p>}
            {message && <p className="text-sm text-center">{message}</p>}
        </div>
    );
};

export default Verification;
