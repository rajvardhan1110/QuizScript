export default function QuestionPanel({ questions, onSelect, selectedIndex,testId }) {
    return (
        <div style={{
            width: "20%",
            padding: "10px",
            borderRight: "1px solid gray",
            height: "80vh",
            overflowY: "auto"
        }}>
            <h4>Questions</h4>
            {questions.map((qId, index) => (
                <div
                    key={qId}
                    onClick={() => onSelect(qId, index)}
                    style={{
                        padding: "10px",
                        marginBottom: "5px",
                        backgroundColor: selectedIndex === index ? "#d0f0ff" : "#f2f2f2",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        cursor: "pointer",
                        textAlign: "center"
                    }}
                >
                    Q{index + 1}
                </div>
            ))}

            {/* Add Question Button */}
            <div
                onClick={() => onSelect("add", null)}
                style={{
                    padding: "10px",
                    marginTop: "10px",
                    backgroundColor: "#e0ffe0",
                    border: "1px dashed green",
                    borderRadius: "5px",
                    cursor: "pointer",
                    textAlign: "center"
                }}
            >
                + Add Question
            </div>
            
        </div>
    );
}
