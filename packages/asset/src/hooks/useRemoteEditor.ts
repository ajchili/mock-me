import { useEffect, useReducer } from "react";
import type * as monaco from "monaco-editor";
import { useWebSocket } from "./useWebSocket.js";

export type RemoteEditorType = "candidate" | "interviewer" | "question";

const valueCache: Partial<Record<RemoteEditorType, string>> = {};

interface State {
  value?: string;
  readyState: number;
  changes: monaco.editor.IModelContentChangedEvent[];
}

type Action =
  | SetValueAction
  | SetReadyStateAction
  | SendChangeAction
  | ClearChangesAction;

interface SetValueAction {
  type: "setEditorValue";
  value: string;
}

interface SetReadyStateAction {
  type: "setReadyState";
  readyState: number;
}

interface SendChangeAction {
  type: "sendChange";
  change: monaco.editor.IModelContentChangedEvent;
}

interface ClearChangesAction {
  type: "clearChanges";
}

export interface RemoteEditorValueProps {
  type: RemoteEditorType;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "setEditorValue":
      state = {
        ...state,
        value: action.value,
      };
      break;
    case "setReadyState":
      state = {
        ...state,
        readyState: action.readyState,
      };
      break;
    case "sendChange":
      state = {
        ...state,
        changes: [action.change].concat(state.changes),
      };
      break;
    case "clearChanges":
      state = {
        ...state,
        changes: [],
      };
      break;
  }
  return state;
}

export const useRemoteEditorValue = ({
  type,
}: RemoteEditorValueProps): [State, React.Dispatch<Action>] => {
  const query = new URLSearchParams(window.location.search);
  const webSocket = useWebSocket(`${query.get("endpoint")}:6969`);
  const [state, dispatch] = useReducer(reducer, {
    readyState: webSocket?.readyState || WebSocket.CONNECTING,
    value: valueCache[type],
    changes: [],
  });

  const onOpen = () => {
    dispatch({
      type: "setReadyState",
      readyState: webSocket?.readyState || WebSocket.CONNECTING,
    });
    webSocket.send(
      JSON.stringify({
        type: "getEditorValue",
        data: {
          type,
        },
      })
    );
  };

  const onClose = () => {
    dispatch({
      type: "setReadyState",
      readyState: webSocket?.readyState || WebSocket.CONNECTING,
    });
  };

  const onMessage = (messageEvent: MessageEvent<any>) => {
    const { type: messageType, data } = JSON.parse(messageEvent.data);

    if (messageType !== "editorValue") {
      return;
    } else if (data.type !== type) {
      return;
    }

    dispatch({ type: "setEditorValue", value: data.value });
    valueCache[type] = data.value;
  };

  // Side effect
  useEffect(() => {
    if (state.changes.length === 0) {
      return;
    }

    const changes =
      state.changes.reduce<monaco.editor.IModelContentChangedEvent>(
        (acc, curr) => ({
          ...acc,
          changes: acc.changes.concat(curr.changes),
        }),
        {
          changes: [],
          eol: "",
          isEolChange: false,
          isFlush: false,
          isRedoing: false,
          isUndoing: false,
          versionId: 0,
        }
      );
    dispatch({ type: "clearChanges" });
    webSocket.send(
      JSON.stringify({
        type: "changeModelContent",
        data: {
          type,
          modelContent: changes,
        },
      })
    );
  }, [state.changes]);

  useEffect(() => {
    webSocket?.addEventListener("open", onOpen);
    webSocket?.addEventListener("close", onClose);
    webSocket?.addEventListener("message", onMessage);

    return () => {
      webSocket.removeEventListener("open", onOpen);
      webSocket.removeEventListener("close", onClose);
      webSocket.removeEventListener("message", onMessage);
    };
  }, [webSocket]);

  return [state, dispatch];
};
