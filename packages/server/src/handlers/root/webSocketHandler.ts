import type { WebsocketHandler } from "@fastify/websocket";
import type {
  EditorType,
  EditorValueMessage,
  ChangeEditorValueMessage,
  Message,
  Participant,
  RegisterMessage,
  GetEditorValueMessage,
} from "@mock-me/messages";
import { EditorManager } from "../../editorManager.js";

export const editorManagers: Record<EditorType, EditorManager> = {
  response: new EditorManager(),
  prompt: new EditorManager({
    pollingRate: 10000,
  }),
  notes: new EditorManager({
    initialValue: "# Interviewer Notes",
    pollingRate: 1000,
  }),
};

export const handler: WebsocketHandler = (socket) => {
  let participant: Participant;

  const register = (message: RegisterMessage) => {
    participant = message.data.participant;

    for (const editorType of Object.keys(editorManagers) as EditorType[]) {
      if (participant === "candidate" && editorType === "notes") {
        return;
      }

      editorManagers[editorType].on("onChange", () => {
        socket.send(
          JSON.stringify({
            type: "EDITOR_VALUE",
            data: {
              editorType,
              value: editorManagers[editorType].value,
            },
          } as EditorValueMessage)
        );
      });
    }
  };

  const sendEditorValue = (message: GetEditorValueMessage) => {
    if (message.data.editorType === "notes" && participant === "candidate") {
      return;
    }

    socket.send(
      JSON.stringify({
        type: "EDITOR_VALUE",
        data: {
          editorType: message.data.editorType,
          value: editorManagers[message.data.editorType].value,
        },
      } as EditorValueMessage)
    );
  };

  const handleEditorValueChange = (message: ChangeEditorValueMessage) => {
    if (message.data.editorType === "notes" && participant === "candidate") {
      return;
    }

    editorManagers[message.data.editorType].enqueueChanges(
      message.data.changes
    );
  };

  socket.on("message", (message: Buffer) => {
    const decodedMessage = Buffer.from(message).toString("utf-8");

    try {
      const maybeValidMessage = JSON.parse(decodedMessage);

      if (!("type" in maybeValidMessage)) {
        return;
      }

      const slightlyMoreValidMessage = maybeValidMessage as Message;

      // If participant is not registered, do not process messages unless they are REGISTER messages
      if (
        participant === undefined &&
        slightlyMoreValidMessage.type !== "REGISTER"
      ) {
        return;
      }

      switch (slightlyMoreValidMessage.type) {
        case "REGISTER":
          register(slightlyMoreValidMessage);
          break;
        case "GET_EDITOR_VALUE":
          sendEditorValue(slightlyMoreValidMessage);
          break;
        case "CHANGE_EDITOR_VALUE":
          handleEditorValueChange(slightlyMoreValidMessage);
          break;
        default:
          // TODO: Add metrics for un-recognized message types
          return;
      }
    } catch (e) {
      // TODO: Handle error
      console.error(e);
    }
  });
};
