import { learningItems } from "../data/dashboardData";
import { course } from "../data/dashboardData";

function LearningChecklist() {
    return (
        <section className="card">
            <h2>{course.slot} Learning Checklist</h2>
            <ul className="checklist">
                {learningItems.map((item) => (
                    <li key={item}>{item}</li>
                ))}
            </ul>
        </section>
    );
}

export default LearningChecklist;
