import { useEffect, useState } from "react";
import axios from "axios";
import Option from "./Option";

export default function Question({ questionId, testId, markAttempted }) {
    const [question, setQuestion] = useState(null);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        async function fetchQuestion() {
            try {
                const token = localStorage.getItem("usertoken");
                const res = await axios.post("http://localhost:3000/liveQuestion", {
                    questionId,
                    testId
                }, {
                    headers: { token }
                });

                setQuestion(res.data.question);
                setSelected(res.data.userAnswer);
            } catch (err) {
                console.error("Failed to fetch question", err);
            }
        }

        fetchQuestion();
    }, [questionId, testId]);

    async function handleOptionSelect(optionId) {
        try {
            const token = localStorage.getItem("usertoken");
            await axios.post("http://localhost:3000/studentResponse", {
                testId,
                questionId,
                optionId
            }, {
                headers: { token }
            });

            setSelected(optionId);
            markAttempted(questionId);
        } catch (err) {
            console.error("Failed to save response", err);
        }
    }

    if (!question) return <p style={{ color: "#888", textAlign: "center" }}>Loading...</p>;

    return (
        <div style={{
            padding: "20px",
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "10px",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
            marginBottom: "20px"
        }}>
            <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#333", marginBottom: "16px" }}>
                {question.questionText}
            </h2>
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "10px"
            }}>
                {question.options.map((opt) => (
                    <Option
                        key={opt._id}
                        option={opt}
                        onSelect={() => handleOptionSelect(opt._id)}
                        selected={opt._id === selected}
                    />
                ))}
            </div>
        </div>
    );
}
