import type * as monaco from "monaco-editor";

export type Participant = "candidate" | "interviewer";
export type EditorType = "response" | "notes" | "prompt";

export type Message =
  | RegisterMessage
  | EditorValueMessage
  | GetEditorValueMessage
  | ChangeEditorValueMessage
  | ModelContentChangedMessage;

export interface RegisterMessage {
  type: "REGISTER";
  data: {
    participant: Participant;
  };
}

export interface GetEditorValueMessage {
  type: "GET_EDITOR_VALUE";
  data: {
    editorType: EditorType;
  };
}

export interface EditorValueMessage {
  type: "EDITOR_VALUE";
  data: {
    editorType: EditorType;
    value: string;
  };
}

export interface ModelContentChangedMessage {
  type: "MODEL_CONTENT_CHANGED";
  data: {
    editorType: EditorType;
    changes: monaco.editor.IModelContentChangedEvent["changes"];
  };
}

export interface ChangeEditorValueMessage {
  type: "CHANGE_EDITOR_VALUE";
  data: {
    editorType: EditorType;
    changes: monaco.editor.IModelContentChangedEvent["changes"];
  };
}
