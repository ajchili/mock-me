import { EventEmitter } from "node:events";
import type { ChangeEditorValueMessage } from "@mock-me/messages";

export interface EditorManagerProps {
  initialValue?: string;
  /**
   * Rate at which changes for an editor are processed in milliseconds.
   *
   * @default 100
   */
  pollingRate?: number;
}

function validatePollingRate(pollingRate: number) {
  if (pollingRate < 100) {
    throw new Error("Invalid polling rate, must be at least 100ms!");
  }
}

export class EditorManager extends EventEmitter {
  private _value: string;
  // TODO: Get types figured out
  private changeQueue: any[] = [];

  constructor({
    initialValue = [
      "function helloWorld() {",
      '\tconsole.log("Hello, world!");',
      "};",
    ].join("\n"),
    pollingRate = 100,
  }: EditorManagerProps = {}) {
    super();
    this._value = initialValue;
    validatePollingRate(pollingRate);

    setInterval(this.processChanges.bind(this), pollingRate);
  }

  get value(): string {
    return this._value;
  }

  set value(value: string) {
    this._value = value;
    this.emit("onChange");
  }

  enqueueChanges(changes: ChangeEditorValueMessage["data"]["changes"]) {
    this.emit("onModelContentChange", changes);
    this.changeQueue.push(...changes);
  }

  processChanges() {
    const changesToProcess = this.changeQueue.splice(
      0,
      this.changeQueue.length
    );

    for (const change of changesToProcess) {
      this.processChange(change);
    }

    if (changesToProcess.length > 0) {
      this.emit("onChange");
    }
  }

  processChange(change: ChangeEditorValueMessage["data"]["changes"][number]) {
    const { text: newText, rangeOffset, rangeLength } = change;

    const before = this._value.substring(0, rangeOffset);
    const after = this._value.substring(rangeOffset + rangeLength);

    this._value = `${before}${newText}${after}`;
  }
}
