import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function CreateTest() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    async function create() {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Authentication token missing. Please log in.");
            navigate("/");
            return;
        }

        if (title.trim() === "") {
            alert("Title is required.");
            return;
        }

        try {
            const res = await axios.post(
                "http://localhost:3000/createtest",
                {
                    title: title.trim(),
                    description: description.trim(),
                },
                {
                    headers: {
                        token: token,
                    },
                }
            );

            alert(res.data.msg);
            console.log("Test ID:", res.data.testid);
            navigate("/admin/home");

        } catch (err) {
            if (err.response) {
                const status = err.response.status;
                const msg = err.response.data.msg || "Unknown error";

                if (status === 400) {
                    alert("❗ Bad Request: " + msg);
                } else if (status === 401) {
                    alert("⛔ Unauthorized: " + msg);
                    localStorage.removeItem("token");
                    navigate("/");
                } else if (status === 403) {
                    alert("🚫 Forbidden: " + msg);
                    localStorage.removeItem("token");
                    navigate("/");
                } else {
                    alert("⚠️ Server error: " + msg);
                }

            } else if (err.request) {
                alert("❌ Network error. Please check your internet.");
            } else {
                alert("⚠️ Error: " + err.message);
            }

            console.error("Error in create test frontend:", err);
        }
    }

    function adminhome(){
        navigate("/admin/home");
    }

    return (
        <div>
            <h2>Create Test</h2>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter test title"
            />
            <br />
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter test description"
            ></textarea>
            <br />
            <button onClick={adminhome}>Cancel Test</button>
            <button onClick={create}>Create Test</button>
        </div>
    );
}
