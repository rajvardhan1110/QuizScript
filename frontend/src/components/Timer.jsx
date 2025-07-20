import { useEffect, useState } from "react";

export default function Timer({ testTime, totalTime, onTimeUp }) {
    const [timeLeft, setTimeLeft] = useState(null);

    useEffect(() => {
        if (!testTime || !totalTime) return;

        const endTime = new Date(new Date(testTime).getTime() + totalTime * 60000);

        const interval = setInterval(() => {
            const now = new Date();
            const diff = endTime - now;

            if (diff <= 0) {
                clearInterval(interval);
                setTimeLeft("Time up");
                if (onTimeUp) onTimeUp();
            } else {
                const minutes = Math.floor(diff / 60000);
                const seconds = Math.floor((diff % 60000) / 1000);
                setTimeLeft(`${minutes}m ${seconds}s`);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [testTime, totalTime, onTimeUp]);

    const timerStyle = {
        marginBottom: "16px",
        textAlign: "right",
        fontSize: "20px",
        fontWeight: "bold",
        color: "red"
    };

    return (
        <div style={timerStyle}>
            {timeLeft || "Loading timer..."}
        </div>
    );
}
