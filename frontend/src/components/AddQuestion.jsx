import { useState } from "react";
import axios from "axios";

export default function AddQuestion({ testId, onCancel }) {
    const [questionText, setQuestionText] = useState("");
    const [options, setOptions] = useState(["", ""]);
    const [correctAnswerText, setCorrectAnswerText] = useState("");
    const [marks, setMarks] = useState(1);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleOptionChange = (index, value) => {
        const updatedOptions = [...options];
        updatedOptions[index] = value;
        setOptions(updatedOptions);
    };

    const addOption = () => {
        if (options.length >= 6) {
            alert("Maximum 6 options allowed.");
            return;
        }
        setOptions([...options, ""]);
    };

    const removeOption = (index) => {
        const updatedOptions = options.filter((_, i) => i !== index);
        setOptions(updatedOptions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Login required");
            return;
        }

        // Local validation
        if (!questionText.trim() || !correctAnswerText.trim()) {
            setError("Question and correct answer are required.");
            return;
        }

        if (options.some(opt => !opt.trim())) {
            setError("All option fields must be filled.");
            return;
        }

        const matchingOption = options.find(opt => opt.trim() === correctAnswerText.trim());
        if (!matchingOption) {
            setError("Correct answer text must match one of the options.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:3000/createQuestion", {
                testId,
                questionText,
                options: options.map(text => ({ text: text.trim() })),
                correctAnswerText: correctAnswerText.trim(),
                marks: Number(marks)
            }, {
                headers: { token }
            });

            console.log("Backend response:", response.data);

            setSuccessMessage(response.data.msg || "Question added successfully!");
            alert(response.data.msg || "Question added successfully!");
            onCancel();
            window.location.reload();
        } catch (err) {
            console.error("Error in submission:", err);
            setError(err.response?.data?.error || "Failed to add question");
        }
    };

    return (
        <div>
            <h2>Add New Question</h2>

            {error && (
                <div style={{ color: "red", fontWeight: "bold", marginBottom: "10px" }}>
                    Error: {error}
                </div>
            )}

            {successMessage && (
                <div style={{ color: "green", fontWeight: "bold", marginBottom: "10px" }}>
                    {successMessage}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Question:</label><br />
                    <textarea
                        value={questionText}
                        onChange={(e) => {
                            setQuestionText(e.target.value);
                            setError("");
                        }}
                        rows={3}
                        required
                    />
                </div>

                <div>
                    <label>Options:</label><br />
                    {options.map((opt, index) => (
                        <div key={index}>
                            {index + 1}.{" "}
                            <input
                                type="text"
                                value={opt}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                required
                            />
                            {options.length > 2 && (
                                <button type="button" onClick={() => removeOption(index)}>Remove</button>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={addOption}>+ Add Option</button>
                </div>

                <div>
                    <label>Correct Answer Text:</label><br />
                    <input
                        type="text"
                        value={correctAnswerText}
                        onChange={(e) => {
                            setCorrectAnswerText(e.target.value);
                            setError("");
                        }}
                        required
                    />
                </div>

                <div>
                    <label>Marks:</label><br />
                    <input
                        type="number"
                        value={marks}
                        onChange={(e) => setMarks(e.target.value)}
                        min="1"
                        required
                    />
                </div>

                <div>
                    <button type="submit">Add Question</button>
                    <button type="button" onClick={onCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
}
