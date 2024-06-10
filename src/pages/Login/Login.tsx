import { useNavigate } from "react-router-dom";
import { useStyles } from "./styles.js";

export const Login = (): JSX.Element => {
  const styles = useStyles();
  const navigate = useNavigate();

  const navigateToInterview = () => {
    navigate("/interview");
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.welcomeCard}>
          Welcome
          <button onClick={navigateToInterview}>I am the Candidate 🧑‍🎓</button>
          <button onClick={navigateToInterview}>I am the Interviewer 🧑‍🏫</button>
        </div>
      </div>
    </div>
  );
};
