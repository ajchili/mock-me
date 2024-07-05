import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button/Button.js";

export const Login = (): JSX.Element => {
  const navigate = useNavigate();

  const navigateToCandidate = () => {
    navigate("/candidate");
  };

  const navigateToInterviewer = () => {
    navigate("/interviewer");
  };

  return (
    <div className="w-full h-dvh flex flex-col items-center justify-center gap-4 bg-gradient-to-t from-slate-950 to-slate-800">
      <span className="text-3xl text-white">👉🏽👈🏽 mock me</span>
      <div className="flex gap-4">
        <Button onClick={navigateToCandidate}>I am the Candidate 🧑‍🎓</Button>
        <Button onClick={navigateToInterviewer}>I am the Interviewer 🧑‍🏫</Button>
      </div>
    </div>
  );
};
