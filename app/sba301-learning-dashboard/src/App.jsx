import CourseHeader from "./components/CourseHeader";
import StudentProfile from "./components/StudentProfile";
import EnvironmentStatus from "./components/EnvironmentStatus";
import LearningChecklist from "./components/LearningChecklist";
import GroupProjectSummary from "./components/GroupProjectSummary";
import RenderingMentalModel from "./components/RenderingMentalModel";
import { course } from "./data/dashboardData";

function App() {
  return (
    <div className="app">
      <CourseHeader />
      <main className="dashboard">
        <div className="grid-2col">
          <StudentProfile />
          <EnvironmentStatus />
        </div>
        <div className="grid-2col">
          <LearningChecklist />
          <GroupProjectSummary />
        </div>
        <RenderingMentalModel />
      </main>
      <footer className="app-footer">
        {course.code} • 2026 • Build → Run → Verify → Explain
      </footer>
    </div>
  );
}

export default App;