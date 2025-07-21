import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { register } from "../api/register";
import { unregister } from "../api/unregister";

export default function TestInfo() {
    const { testId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [phase, setPhase] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [testTime, setTestTime] = useState(null);
    const [totalTime, setTotalTime] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [totalMarks, setTotalMarks] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState(null);
    const [countdown, setCountdown] = useState("");

    useEffect(() => {
        const fetchTestInfo = async () => {
            try {
                const token = localStorage.getItem("usertoken");

                if (!token) {
                    navigate('/', { replace: true });
                }

                const response = await axios.get(
                    `http://localhost:3000/testInfo?testId=${testId}`,
                    {
                        headers: { token }
                    }
                );

                const data = response.data;

                if (data.msg === "Test is not available") {
                    setError("Test not found.");
                } else if (data.msg === "over") {
                    setPhase("over");
                    navigate(`/testInfo/${testId}/summary`, { replace: true });
                } else {
                    // console.log(data);
                    setPhase(data.phase);
                    setIsRegistered(data.isRegistered);
                    setTitle(data.title || "");
                    setDescription(data.description || "");
                    setTotalMarks(data.totalMarks || "not set");
                    if (data.testTime) setTestTime(new Date(data.testTime));
                    if (data.totalTime) setTotalTime(data.totalTime);

                    if (data.phase === "running" && data.isRegistered) {
                        try {
                            const token = localStorage.getItem("usertoken");
                            if(!token){
                                navigate('/',{replace:true});
                            }
                            const res = await axios.get("http://localhost:3000/test-submission-check", {
                                params: { testId },
                                headers: {
                                    token
                                }
                            });

                            if (res.data.submitted) {
                                navigate(`/testInfo/${testId}/summary`, { replace: true });
                            } else {
                                navigate(`/testInfo/${testId}/live`, { replace: true });
                            }
                        } catch (error) {
                            console.error("Error checking test submission:", error);
                            alert("Something went wrong while checking your submission status. Please try again later.");
                        }
                    }
                }
            } catch (err) {
                console.error(err);
                setError("Error fetching test info.");
            } finally {
                setLoading(false);
            }
        };

        fetchTestInfo();
    }, [testId, navigate]);

    // Countdown timer
    useEffect(() => {
        if (phase !== "upcoming" || !testTime) return;

        const interval = setInterval(() => {
            const now = new Date();
            const diff = testTime.getTime() - now.getTime();

            if (diff <= 0) {
                clearInterval(interval);
                window.location.reload(); // Reload page to get new test phase
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setCountdown(
                `${String(hours).padStart(2, '0')} Hours : ${String(minutes).padStart(2, '0')} Minutes : ${String(seconds).padStart(2, '0')} Seconds`
            );
        }, 1000);

        return () => clearInterval(interval);
    }, [testTime, phase]);

    const handleToggleRegistration = async () => {
        setActionLoading(true);
        setActionError(null);
        try {
            if (isRegistered) {
                const res = await unregister(testId);
                if (res.msg === "Unregistered successfully") {
                    alert(res.msg);
                    setIsRegistered(false);
                } else {
                    throw new Error(res.msg || "Unregistration failed");
                }
            } else {
                const res = await register(testId);
                if (res.msg === "Registered successfully") {
                    alert(res.msg);
                    setIsRegistered(true);
                } else {
                    throw new Error(res.msg || "Registration failed");
                }
            }
        } catch (err) {
            console.error("Toggle error:", err);
            if (err.response?.data?.msg) {
                setActionError(err.response.data.msg);
            } else {
                setActionError(err.message || "Something went wrong.");
            }
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <div>Loading test info...</div>;
    if (error) return <div style={{ color: "red" }}>{error}</div>;

    return (
        <div style={{ padding: "20px" }}>
            <h2>{title}</h2>
            <p><strong>Description:</strong> {description}</p>
            <p><strong>Total Marks:</strong> {totalMarks}</p>

            {phase === "upcoming" && (
                <>
                    {testTime && (
                        <p><strong>Start Time:</strong> {testTime.toLocaleString()}</p>
                    )}
                    {totalTime && (
                        <p><strong>Duration:</strong> {totalTime} minutes</p>
                    )}
                    <p>Status: <strong>{isRegistered ? "Registered" : "Not Registered"}</strong></p>

                    {testTime && (
                        <p><strong>Time Remaining:</strong> {countdown}</p>
                    )}

                    {actionError && (
                        <div style={{ color: "red", marginBottom: "10px" }}>{actionError}</div>
                    )}

                    <button
                        onClick={handleToggleRegistration}
                        disabled={actionLoading}
                        style={{
                            backgroundColor: isRegistered ? "#ff6961" : "#4CAF50",
                            color: "white",
                            padding: "10px 20px",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer"
                        }}
                    >
                        {actionLoading
                            ? (isRegistered ? "Unregistering..." : "Registering...")
                            : (isRegistered ? "Unregister" : "Register")}
                    </button>
                </>
            )}
        </div>
    );
}
