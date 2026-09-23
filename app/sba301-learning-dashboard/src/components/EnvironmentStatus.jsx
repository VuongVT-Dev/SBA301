import { environmentTools } from "../data/dashboardData";

function EnvironmentStatus() {
    return (
        <section className="card">
            <h2>Environment Status</h2>
            <table className="env-table">
                <tbody>
                    {environmentTools.map((tool) => (
                        <tr key={tool.name}>
                            <td className="env-name">{tool.name}</td>
                            <td className="env-status">
                                <span className={`badge badge-${tool.status.toLowerCase()}`}>
                                    {tool.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}

export default EnvironmentStatus;
