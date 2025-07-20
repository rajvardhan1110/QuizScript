import { useState } from "react";

export default function Option({ option, onSelect, selected }) {
    const [loading, setLoading] = useState(false);

    async function handleClick() {
        if (loading) return;
        setLoading(true);
        await onSelect();
        setLoading(false);
    }

    const buttonStyle = {
        padding: "12px",
        borderRadius: "8px",
        width: "100%",
        textAlign: "left",
        backgroundColor: selected ? "#a5d6a7" : "#f0f0f0", // green if selected
        border: "1px solid #ccc",
        opacity: loading ? 0.6 : 1,
        cursor: loading ? "not-allowed" : "pointer",
        fontSize: "16px",
        transition: "background-color 0.2s ease",
    };

    return (
        <button style={buttonStyle} onClick={handleClick} disabled={loading}>
            {option.text}
        </button>
    );
}
