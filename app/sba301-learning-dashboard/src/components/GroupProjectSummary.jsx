import { groupProject } from "../data/dashboardData";

function GroupProjectSummary() {
    return (
        <section className="card">
            <h2>Group Project Summary</h2>
            <table className="profile-table">
                <tbody>
                    <tr>
                        <td className="label">Project</td>
                        <td>{groupProject.name}</td>
                    </tr>
                    <tr>
                        <td className="label">Target Users</td>
                        <td>{groupProject.targetUsers}</td>
                    </tr>
                </tbody>
            </table>
            <p className="features-heading">Core Features</p>
            <ol className="features-list">
                {groupProject.coreFeatures.map((feature) => (
                    <li key={feature}>{feature}</li>
                ))}
            </ol>
        </section>
    );
}

export default GroupProjectSummary;
