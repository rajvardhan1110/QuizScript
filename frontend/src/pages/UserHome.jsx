import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function UserHome() {
    const navigate = useNavigate();
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    function logout() {
        if (localStorage.getItem("usertoken")) {
            localStorage.removeItem("usertoken");
        }
        navigate("/");
    }

    useEffect(() => {
        async function fetchTests() {
            try {
                const token = localStorage.getItem("usertoken");
                if (!token) {
                    setError("No token found. Please login.");
                    logout();
                    return;
                }

                const response = await axios.get("http://localhost:3000/allTests", {
                    headers: { token }
                });

                setTests(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching tests:", error);

                setLoading(false);
                if (error.response) {
                    if (error.response.status === 401) {
                        setError("Session expired. Please login again.");
                        logout();
                    } else {
                        setError(error.response.data?.msg || "Server error occurred");
                    }
                } else {
                    setError("Network error. Please try again later.");
                }
            }
        }

        fetchTests();
    }, []);

    const handleCardClick = (testId) => {
        navigate(`/testInfo/${testId}`)
    };

    return (
        <>
            <button onClick={logout}>Log Out</button>
            <h2>Available Tests</h2>

            {loading && <p>Loading tests...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {!loading && !error && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                    {tests.map(test => (
                        <div
                            key={test.testId}
                            onClick={() => handleCardClick(test.testId)}
                            style={{
                                border: "1px solid #ccc",
                                padding: "20px",
                                borderRadius: "10px",
                                width: "250px",
                                backgroundColor: "#f9f9f9",
                                cursor: "pointer",
                                transition: "transform 0.2s",
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
                            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                        >
                            <h3>{test.title}</h3>
                            <p>{test.description}</p>
                            <p><strong>Total Marks:</strong> {test.totalMarks}</p>
                            <p><strong>Date:</strong> {test.date === "upcoming" ? "Upcoming" : new Date(test.date).toLocaleString()}</p>
                            <p><strong>Total Time:</strong> {test.totalTime} minutes</p>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
