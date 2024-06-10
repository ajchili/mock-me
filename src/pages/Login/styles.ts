import { createUseStyles } from "react-jss";

export const useStyles = createUseStyles({
  page: {
    display: "flex",
    width: "100%",
    height: "100vh",
    justifyContent: "center",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    flexShrink: 1,
    justifyContent: "center",
  },
  welcomeCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  },
});
