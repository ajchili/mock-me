import { useEffect, useReducer, useRef } from "react";
import type * as monaco from "monaco-editor";

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
  type: "setValue";
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
  type: "candidate" | "interviewer" | "question";
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "setValue":
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
  const [state, dispatch] = useReducer(reducer, {
    readyState: WebSocket.CONNECTING,
    changes: [],
  });
  const wsRef = useRef<WebSocket>();

  if (!wsRef.current) {
    const query = new URLSearchParams(window.location.search);
    wsRef.current = new WebSocket(`${query.get("endpoint")}:6969`);
  }

  const onOpen = () => {
    dispatch({
      type: "setReadyState",
      readyState: wsRef.current?.readyState || WebSocket.CONNECTING,
    });
    wsRef.current?.send(
      JSON.stringify({
        type: "register",
        data: {
          type,
        },
      })
    );
  };

  const onClose = () => {
    dispatch({
      type: "setReadyState",
      readyState: wsRef.current?.readyState || WebSocket.CONNECTING,
    });
  };

  const onMessage = (messageEvent: MessageEvent<any>) => {
    const { type: messageType, data } = JSON.parse(messageEvent.data);

    if (messageType !== "editorValue") {
      return;
    } else if (data.type !== type) {
      return;
    }

    dispatch({ type: "setValue", value: data.value });
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
    wsRef.current?.send(
      JSON.stringify({
        type: "changeModelContent",
        data: changes,
      })
    );
  }, [state.changes]);

  useEffect(() => {
    wsRef.current?.addEventListener("open", onOpen);
    wsRef.current?.addEventListener("close", onClose);
    wsRef.current?.addEventListener("message", onMessage);

    return () => {
      wsRef.current?.removeEventListener("open", onOpen);
      wsRef.current?.removeEventListener("close", onClose);
      wsRef.current?.removeEventListener("message", onMessage);
      wsRef.current?.close();
    };
  }, [wsRef.current]);

  return [state, dispatch];
};
