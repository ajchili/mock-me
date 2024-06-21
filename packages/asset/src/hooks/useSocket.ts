import { useContext, useEffect, useReducer, useState } from "react";
import type { Message } from "@mock-me/messages";
import { SocketContext } from "../providers/socketProvider.js";

interface State {
  messages: Message[];
}

type Action = AddMessageAction | ClearMessagesAction;

type AddMessageAction = {
  type: "ADD_MESSAGE";
  message: Message;
};

type ClearMessagesAction = {
  type: "CLEAR_MESSAGES";
};

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "ADD_MESSAGE":
      state = {
        messages: state.messages.concat(action.message),
      };
      break;
    case "CLEAR_MESSAGES":
      state = {
        messages: [],
      };
      break;
  }

  return state;
};

export const useSocket = () => {
  const socket = useContext(SocketContext);
  const [connected, setConnected] = useState<boolean>(false);
  const [state, dispatch] = useReducer(reducer, { messages: [] });

  const onOpen = () => {
    setConnected(true);
  };

  const onClose = () => {
    setConnected(false);
  };

  if (socket === undefined) {
    throw new Error("useSocket failure, socket is undefined!");
  }

  const sendMessage = (message: Message) => {
    if (!connected) {
      dispatch({ type: "ADD_MESSAGE", message });
      return;
    }

    socket.send(JSON.stringify(message));
  };

  useEffect(() => {
    socket.addEventListener("open", onOpen);
    socket.addEventListener("close", onClose);

    return () => {
      socket.removeEventListener("open", onOpen);
      socket.removeEventListener("close", onClose);
    };
  }, []);

  useEffect(() => {
    const _connected = socket.readyState === WebSocket.OPEN;

    if (_connected && state.messages.length > 0) {
      for (const message of state.messages) {
        sendMessage(message);
      }
      dispatch({ type: "CLEAR_MESSAGES" });
    }

    setConnected(_connected);
  }, [socket.readyState, state.messages]);

  return {
    connected,
    sendMessage,
    socket,
  };
};
