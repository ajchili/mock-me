import { createUseStyles } from "react-jss";

export const useStyles = createUseStyles({
  container: {
    display: "flex",
    width: "100%",
    height: "100%",
    flexDirection: "column",
  },
  editor: {
    flex: 1,
  },
});
