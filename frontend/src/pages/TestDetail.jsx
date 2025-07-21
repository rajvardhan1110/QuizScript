import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import QuestionPanel from "../components/QuestionPanel";
import QuestionViewer from "../components/QuestionViewer";
import AddQuestion from "../components/AddQuestion";
import DeleteTestButton from "../components/DeleteTestButton";
import UpdateTestPage from "../components/UpdateTestPage";
import { toggleTestPhase } from "../api/finaliseTest";



export default function TestDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [testInfoVisible, setTestInfoVisible] = useState(true);
    const [questionsVisible, setQuestionsVisible] = useState(false);
    const [updateVisible, setUpdateVisible] = useState(false);

    const [selectedQuestionId, setSelectedQuestionId] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);


    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [testTime, setTestTime] = useState("");
    const [totalTime, setTotalTime] = useState(0);
    const [testTimeRaw, setTestTimeRaw] = useState(null);
    const [totalMark, setTotalMark] = useState(0);
    const [phase, setPhase] = useState("");
    const [publishResult, setPublishResult] = useState(false);
    const [allQuestions, setAllQuestions] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTestData = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    setError("Authentication token missing. Please log in.");
                    navigate("/");
                    return;
                }

                // 1. Fetch questions
                const questionsRes = await axios.post("http://localhost:3000/allquestions", {
                    testId: id
                }, {
                    headers: { token }
                });
                setAllQuestions(questionsRes.data.questions || []);

                // 2. Fetch test admin info
                const infoRes = await axios.post("http://localhost:3000/adminTestInfo", {
                    testId: id
                }, {
                    headers: { token }
                });

                const test = infoRes.data.test;
                setTitle(test.title || "");
                setDescription(test.description || "");
                setTestTime(test.testTime ? new Date(test.testTime).toLocaleString() : "Not Set");
                setTestTimeRaw(test.testTime ? new Date(test.testTime) : null);
                setTotalTime(test.totalTime || 0);
                setTotalMark(test.totalMarks || '-');
                setPhase(test.examTakerPhase);
                setPublishResult(test.publishResult);
                setError("");

            } catch (err) {
                console.error("Error fetching test data:", err);

                if (err.response?.status === 401 || err.response?.status === 403) {
                    localStorage.removeItem("token");
                    setError("Session expired. Please log in again.");
                    navigate("/");
                } else {
                    setError("Failed to load test data.");
                }
            }
        };

        fetchTestData();
    }, [id, navigate]);

    function backButton() {
        navigate("/admin/home", { replace: true });
    }

    function showTestInfo() {
        setTestInfoVisible(true);
        setQuestionsVisible(false);
        setUpdateVisible(false);
    }

    function showQuestions() {
        setTestInfoVisible(false);
        setQuestionsVisible(true);
        setUpdateVisible(false);
    }

    function showUpdate() {
        setUpdateVisible(true);
        setTestInfoVisible(false);
        setQuestionsVisible(false);
    }

    function handleCardClick(questionId, index) {
        setSelectedQuestionId(questionId);
        setSelectedIndex(index);
    }

    async function handleTogglePhase() {
        try {
            const data = await toggleTestPhase(id);
            setPhase(data.test.examTakerPhase);
            alert(data.msg);
        } catch (err) {
            console.error("Error updating phase:", err);
            if (err.message === "Authentication token missing. Please log in.") {
                setError(err.message);
                navigate("/");
            } else {
                setError("Failed to update test phase.");
            }
        }
    }

    async function handleTogglePublishResult() {
        try {
            const token = localStorage.getItem("usertoken");
            if (!token) throw new Error("Authentication token missing. Please log in.");

            const res = await axios.post(
                "http://localhost:3000/togglePublishResult",
                { testId: id },
                { headers: { token } }
            );

            alert(res.data.msg);
            setPublishResult(res.data.test.publishResult);
        } catch (err) {
            console.error("Error toggling result publish:", err);
            setError(err?.response?.data?.msg || "Failed to toggle result publish status.");
        }
    }



    return (
        <div>
            <h2>Test Details</h2>

            <div>
                <button onClick={backButton}>back</button>
                <button onClick={showTestInfo}>Test Info</button>
                <button onClick={showQuestions}>Questions</button>
                <button onClick={showUpdate}>Update Test</button>
            </div>

            {error && <div style={{ color: "red" }}>{error}</div>}

            {testInfoVisible && (
                <div>
                    <div>
                        <h3>Title: {title}</h3>
                        <p>Description: {description}</p>
                        <p>Test Time: {testTime}</p>
                        <p>Total Time: {totalTime} mins</p>
                        <p>Total Marks: {totalMark}</p>
                        <p>Phase: {phase}</p>
                        <p>Publish Result: {publishResult ? "✅ Published" : "❌ Not Published"}</p>
                    </div>

                    <DeleteTestButton testId={id} />

                    {phase === "draft" ? (
                        <button onClick={handleTogglePhase}>Finalize Test</button>
                    ) : (
                        <button onClick={handleTogglePhase}>Convert to Draft</button>
                    )}

                    {testTimeRaw && new Date(testTimeRaw.getTime() + totalTime * 60000) <= new Date() && (
                        <button onClick={handleTogglePublishResult}>
                            {publishResult ? "Unpublish Result" : "Publish Result"}
                        </button>
                    )}

                </div>

            )}

            {questionsVisible && (
                <div style={{ display: "flex" }}>
                    <QuestionPanel
                        questions={allQuestions}
                        onSelect={handleCardClick}
                        selectedIndex={selectedIndex}
                        testId={id}
                    />
                    {selectedQuestionId === "add" ? (
                        <AddQuestion testId={id} onCancel={() => setSelectedQuestionId(null)} />
                    ) : (
                        <QuestionViewer questionId={selectedQuestionId} testId={id} />
                    )}
                </div>
            )}

            {updateVisible && (
                <UpdateTestPage
                    testId={id} title={title} description={description} testTime={testTime} totalTime={totalTime}
                ></UpdateTestPage>
            )

            }



        </div>
    );
}
