import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function UserHome() {
    const navigate = useNavigate();
    const [tests, setTests] = useState([]);
    const [error, setError] = useState("");  // Error state

    useEffect(() => {
        const fetchDraftTests = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    setError("Authentication token missing. Please log in.");
                    navigate("/");
                    return;
                }

                const res = await axios.get('http://localhost:3000/draft', {
                    headers: { token }
                });

                setTests(res.data.alltests || []);
                setError(""); // Clear any previous errors

            } catch (err) {
                console.error("Failed to fetch tests:", err);

                if (err.response?.status === 401 || err.response?.status === 403) {
                    localStorage.removeItem("token");
                    setError("Session expired. Please log in again.");
                    navigate("/");
                } else {
                    setError("Failed to load draft tests. Please try again later.");
                }
            }
        };

        fetchDraftTests();
    }, [navigate]);

    function logout() {
        localStorage.removeItem("token");
        navigate("/");
    }

    function CreateTest() {
        navigate("/test/createtest");
    }

    function handleCardClick(test_id){
        console.log(test_id);
        navigate(`/test/${test_id}`);
    }



    return (
        <>
            <div>
                <button onClick={CreateTest}>Create Test</button>
            </div>

            <div>
                <button onClick={logout}>Log out</button>
            </div>

            {error && (
                <div style={{ color: 'red', marginTop: '1rem' }}>
                    <strong>Error:</strong> {error}
                </div>
            )}

            <div>
                <h1>All Draft Tests</h1>
                {tests.length === 0 && !error ? (
                    <p>No draft tests available.</p>
                ) : (
                    tests.map(test => (
                        <div key={test._id}
                            onClick={() => handleCardClick(test._id)}
                        >
                            <h2>{test.title || "No Title"}</h2>
                            <p>{test.description || "No Description"}</p>
                            <p>
                                Start Time:{" "}
                                {test.testTime
                                    ? new Date(test.testTime).toLocaleString()
                                    : "Upcoming"}
                            </p>
                        </div>
                    ))
                )}
            </div>

        </>
    );
}
