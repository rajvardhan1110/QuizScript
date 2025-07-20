import { useParams } from "react-router-dom";

export default function TestSummary() {
    const { testId } = useParams();

    return (
        <div>
            <h2>Summary for Test ID: {testId}</h2>
        </div>
    );
}
