import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Question from "../components/Question";
import QuestionNavigator from "../components/QuestionNavigator";
import Timer from "../components/Timer";

export default function LiveTestPage() {
    const { testId } = useParams();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [testData, setTestData] = useState(null);
    const [attemptedQIDs, setAttemptedQIDs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchTestAndAttempts() {
            try {
                const token = localStorage.getItem("usertoken");
                const headers = { headers: { token } };

                // Fetch test data
                const testRes = await axios.get(`http://localhost:3000/testLive?testId=${testId}`, headers);
                setQuestions(testRes.data.test.questions);
                setTestData(testRes.data.test);

                // Fetch attempted question IDs
                const attemptRes = await axios.get(`http://localhost:3000/question/attempted?testId=${testId}`, headers);
                setAttemptedQIDs(attemptRes.data.attempted || []);
            } catch (err) {
                console.error("Error loading test:", err);
                setError("Failed to load test or attempts.");
            } finally {
                setLoading(false);
            }
        }

        fetchTestAndAttempts();
    }, [testId]);

    function handleChangeQuestion(index) {
        setCurrentQIndex(index);
    }

    function markAttempted(qid) {
        setAttemptedQIDs(prev => (prev.includes(qid) ? prev : [...prev, qid]));
    }

    async function submitTest() {
        try {
            const token = localStorage.getItem("usertoken");
            await axios.post(
                `http://localhost:3000/studentResult`,
                { testId },
                { headers: { token } }
            );
            navigate(`/testInfo/${testId}/summary`,{replace:true});
        } catch (err) {
            console.error("Failed to submit test", err);
            alert("Error submitting test. Please try again.");
        }
    }

    const containerStyle = {
        display: "flex",
        height: "100vh"
    };

    const leftPanelStyle = {
        width: "75%",
        padding: "20px",
        overflowY: "auto"
    };

    const rightPanelStyle = {
        width: "25%",
        padding: "20px",
        borderLeft: "1px solid #ccc",
        overflowY: "auto"
    };

    if (loading) return <div>Loading test...</div>;
    if (error) return <div style={{ color: "red", padding: "20px" }}>{error}</div>;

    return (
        <div style={containerStyle}>
            <div style={leftPanelStyle}>
                <Timer
                    testTime={testData?.testTime}
                    totalTime={testData?.totalTime}
                    onTimeUp={submitTest}
                />
                {questions.length > 0 && currentQIndex >= 0 && currentQIndex < questions.length && (
                    <Question
                        questionId={questions[currentQIndex]}
                        testId={testId}
                        markAttempted={markAttempted}
                    />
                )}
            </div>

            <div style={rightPanelStyle}>
                <QuestionNavigator
                    questions={questions}
                    current={currentQIndex}
                    onJump={handleChangeQuestion}
                    attemptedQIDs={attemptedQIDs}
                    onSubmit={submitTest}
                />
            </div>
        </div>
    );
}
