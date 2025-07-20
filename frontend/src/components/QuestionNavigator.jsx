import React from "react";

export default function QuestionNavigator({
    questions,
    current,
    onJump,
    attemptedQIDs,
    onSubmit
}) {
    const containerStyle = {
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        marginBottom: "20px"
    };

    const buttonStyle = (index, qid) => ({
        padding: "10px 15px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        cursor: "pointer",
        backgroundColor:
            current === index
                ? "#007bff"
                : attemptedQIDs.includes(qid)
                ? "#28a745"
                : "#f8f9fa",
        color:
            current === index || attemptedQIDs.includes(qid)
                ? "white"
                : "#333",
        fontWeight: current === index ? "bold" : "normal"
    });

    const submitButtonStyle = {
        padding: "10px 20px",
        backgroundColor: "#dc3545",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginTop: "20px",
        width: "100%"
    };

    return (
        <div>
            <h3 style={{ marginBottom: "10px", textAlign: "center" }}>Question Navigator</h3>
            <div style={containerStyle}>
                {questions.map((qid, index) => (
                    <button
                        key={qid}
                        style={buttonStyle(index, qid)}
                        onClick={() => onJump(index)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
            <button onClick={onSubmit} style={submitButtonStyle}>
                Submit Test
            </button>
        </div>
    );
}
