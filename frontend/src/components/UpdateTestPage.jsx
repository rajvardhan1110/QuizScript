import { useEffect, useState } from "react";
import axios from "axios";

export default function UpdateTestPage({ testId, title, description, testTime, totalTime }) {
  const [Title, setTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [TestTime, setTestTime] = useState("");
  const [TotalTime, setTotalTime] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
  setTitle(title || "");
  setDescription(description || "");

  let formattedTime = "";
  if (testTime) {
    const d = new Date(testTime);
    if (!isNaN(d.getTime())) {
      formattedTime = d.toISOString().slice(0, 16);
    }
  }
  setTestTime(formattedTime);

  setTotalTime(totalTime || "");
}, [title, description, testTime, totalTime]);


  const isValidDateTime = (dtString) => {
    const date = new Date(dtString);
    return !isNaN(date.getTime());
  };

  const handleSubmit = async () => {
    setError("");

    const payload = {
      testId,
      title: Title,
      description: Description,
    };

    if (TestTime && isValidDateTime(TestTime)) {
      payload.testTime = new Date(TestTime);
    }

    if (TotalTime) {
      const totalTimeInt = parseInt(TotalTime);
      if (!isNaN(totalTimeInt)) {
        payload.totalTime = totalTimeInt;
      } else {
        setError("Total time must be a number.");
        return;
      }
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch("http://localhost:3000/editTest", payload, {
        headers: {
          token
        },
      });

      alert("Test updated successfully");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Error updating test");
    }
  };

  return (
    <>
      <div>
        <label>Title:</label>
        <input type="text" value={Title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div>
        <label>Description:</label>
        <input type="text" value={Description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div>
        <label>Test Time (Date & Time):</label>
        <input
          type="datetime-local"
          value={TestTime}
          onChange={(e) => setTestTime(e.target.value)}
        />
      </div>

      <div>
        <label>Total Time (minutes):</label>
        <input
          type="number"
          value={TotalTime}
          onChange={(e) => setTotalTime(e.target.value)}
        />
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={handleSubmit}>Update Test</button>
    </>
  );
}
