import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function TestSummaryPage() {
    const { testId } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [summaryData, setSummaryData] = useState(null);

    useEffect(() => {
        async function fetchSummary() {
            const token = localStorage.getItem("usertoken");
            if (!token) {
                setError("User not authenticated. Please login again.");
                setLoading(false);
                return;
            }

            if (!testId || testId.length !== 24) {
                setError("Invalid test ID.");
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get(`http://localhost:3000/summary?testId=${testId}`, {
                    headers: { token },
                });

                if (res.data && res.data.show) {
                    setSummaryData(res.data);
                } else {
                    setError("Invalid summary response from server.");
                }
            } catch (err) {
                console.error("Summary fetch error:", err);
                if (err.response?.data?.msg) {
                    setError(`Error: ${err.response.data.msg}`);
                } else {
                    setError("Server error. Please try again later.");
                }
            } finally {
                setLoading(false);
            }
        }

        fetchSummary();
    }, [testId]);

    if (loading) return <p style={{ padding: "20px" }}>Loading test summary...</p>;
    if (error) return <p style={{ padding: "20px", color: "red" }}>{error}</p>;
    if (!summaryData) return <p style={{ padding: "20px", color: "red" }}>Summary data not available.</p>;

    const { show, questions = [], resultData } = summaryData;

    function getOptionStyle(option, question) {
        const qid = question._id;

        if (show === "reviewOnly") {
            if (option._id === question.correctAnswer) {
                return { backgroundColor: "#c8e6c9" }; // green
            }
            return {};
        }

        if (show === "fullReview") {
            const resp = resultData?.response?.find(r => r.questionId === qid);
            const isSelected = resp?.optionId === option._id;
            const isCorrect = question.correctAnswer === option._id;

            if (isSelected && isCorrect) {
                return { backgroundColor: "#c8e6c9" }; // green
            } else if (isSelected && !isCorrect) {
                return { backgroundColor: "#ffcdd2" }; // red
            } else if (!isSelected && isCorrect) {
                return { backgroundColor: "#dcedc8" }; // light green
            }
        }

        return {};
    }

    function renderQuestions() {
        if (!questions || questions.length === 0) {
            return <p>No questions found.</p>;
        }

        return questions.map((q, idx) => (
            <div key={q._id} style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "15px",
                marginBottom: "20px"
            }}>
                <h4>Q{idx + 1}. {q.questionText}</h4>
                <div style={{ marginTop: "10px" }}>
                    {q.options.map((opt) => (
                        <div key={opt._id} style={{
                            padding: "10px",
                            margin: "5px 0",
                            borderRadius: "5px",
                            ...getOptionStyle(opt, q)
                        }}>
                            {opt.text}
                        </div>
                    ))}
                </div>
            </div>
        ));
    }

    function renderContent() {
        const title = summaryData?.testName || resultData?.testName;
        const marks = summaryData?.TotalMarks || resultData?.TotalMarks;

        return (
            <div>
                <div style={{ marginBottom: "20px", padding: "10px 15px", borderRadius: "8px", background: "#f1f8e9" }}>
                    <h2>📘 {title}</h2>
                    {marks !== undefined && <h4>Total Marks: {marks}</h4>}
                </div>

                {(() => {
                    switch (show) {
                        case "notSubmittedNoReview":
                            return (
                                <div style={{ padding: "20px", background: "#fff3cd", borderRadius: "8px", color: "#856404" }}>
                                    <h2>❌ Test not submitted.</h2>
                                    <p>The test time is over. You can no longer attempt or view this test.</p>
                                </div>
                            );

                        case "reviewOnly":
                            return (
                                <div>
                                    <div style={{ padding: "20px", background: "#fff8e1", borderRadius: "8px", color: "#795548" }}>
                                        <h2>⚠️ Test not submitted.</h2>
                                        <p>You didn’t submit the test, but review is allowed.</p>
                                    </div>
                                    <h3 style={{ marginTop: "20px" }}>Test Questions</h3>
                                    {renderQuestions()}
                                </div>
                            );

                        case "submittedNoResult":
                            return (
                                <div style={{ padding: "20px", background: "#e3f2fd", borderRadius: "8px", color: "#0d47a1" }}>
                                    <h2>✅ Test submitted.</h2>
                                    <p>The result is not published yet. Please check back later.</p>
                                </div>
                            );

                        case "fullReview":
                            return (
                                <div>
                                    <div style={{ padding: "20px", background: "#d0f0c0", borderRadius: "8px", color: "#33691e" }}>
                                        <h2>✅ Test submitted and reviewed.</h2>
                                        <h3>
                                            Your Total Score: {resultData?.score ?? 0}
                                            {resultData?.TotalMarks ? ` / ${resultData.TotalMarks}` : ""}
                                        </h3>
                                    </div>
                                    <h3 style={{ marginTop: "20px" }}>Your Responses</h3>
                                    {renderQuestions()}
                                </div>
                            );

                        default:
                            return <p>Unknown summary case.</p>;
                    }
                })()}
            </div>
        );
    }

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
            <h1>📝 Test Summary</h1>
            {renderContent()}
        </div>
    );
}
