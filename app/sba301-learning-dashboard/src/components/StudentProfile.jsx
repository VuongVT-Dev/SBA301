import { student } from "../data/dashboardData";

function StudentProfile() {
    return (
        <section className="card">
            <h2>Student Profile</h2>
            <table className="profile-table">
                <tbody>
                    <tr>
                        <td className="label">Name</td>
                        <td>{student.name}</td>
                    </tr>
                    <tr>
                        <td className="label">Student ID</td>
                        <td>{student.studentId}</td>
                    </tr>
                    <tr>
                        <td className="label">Group</td>
                        <td>{student.group}</td>
                    </tr>
                    <tr>
                        <td className="label">Role</td>
                        <td>Learner / {student.role}</td>
                    </tr>
                </tbody>
            </table>
        </section>
    );
}

export default StudentProfile;