import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function QuestionViewer({ questionId,testId }) {
    const [question, setQuestion] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/");
            return;
        }

        const fetchQuestion = async () => {
            try {
                const res = await axios.post("http://localhost:3000/getQuestion", {
                    questionId
                }, {
                    headers: { token }
                });

                console.log("Fetched question from backend:", res.data);
                setQuestion(res.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching question:", err);
                setError("Failed to load question.");
            }
        };

        if (questionId) fetchQuestion();
    }, [questionId, navigate]);

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this question?");
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("token");

            await axios.post("http://localhost:3000/deleteQuestion", {
                questionId,
                testId
            }, {
                headers: { token }
            });

            alert("Question deleted successfully");
            window.location.reload(); 
        } catch (err) {
            console.error("Delete error:", err);
            alert("Failed to delete question");
        }
    };

    if (error) {
        return <div style={{ padding: "20px", color: "red" }}>{error}</div>;
    }

    if (!question) {
        return <div style={{ padding: "20px" }}>Loading...</div>;
    }

    return (
        <div style={container}>
            <h2 style={header}>Question Details</h2>

            <div style={infoBox}>
                <strong>Marks:</strong> <span>{question.marks}</span>
            </div>

            <div style={infoBox}>
                <strong>Question:</strong> <span>{question.questionText}</span>
            </div>

            {question.options && question.options.length > 0 && (
                <div style={{ marginTop: "20px" }}>
                    <strong>Options:</strong>
                    <ul style={optionList}>
                        {question.options.map((opt, idx) => (
                            <li key={opt._id} style={optionStyle}>
                                {opt.text}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <button onClick={handleDelete} >
                Delete Question
            </button>
        </div>
    );
}

// Style objects
const container = {
    padding: "20px",
    maxWidth: "700px",
    margin: "auto",
    border: "1px solid #ccc",
    borderRadius: "10px"
};

const header = {
    marginBottom: "20px"
};

const infoBox = {
    padding: "10px",
    marginBottom: "10px",
    backgroundColor: "#f7f7f7",
    borderRadius: "6px",
    display: "flex",
    justifyContent: "space-between"
};

const optionList = {
    paddingLeft: "20px",
    marginTop: "10px"
};

const optionStyle = {
    marginBottom: "6px",
    backgroundColor: "#eaeaea",
    padding: "6px 10px",
    borderRadius: "5px"
};
