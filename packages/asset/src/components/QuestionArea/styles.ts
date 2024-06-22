import { createUseStyles } from "react-jss";

export const useStyles = createUseStyles({
  draggableItem: {
    borderBottom: "2px solid red",
    "&:hover": {
      borderBottom: "10px solid red",
      cursor: "ns-resize",
    },
  },
});
