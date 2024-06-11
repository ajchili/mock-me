import { EventEmitter } from "node:events";

export interface EditorManagerProps {
  pollingRate?: number;
}

function validatePollingRate(pollingRate: number) {
  if (pollingRate < 100) {
    throw new Error("Invalid polling rate, must be at least 100ms!");
  }
}

export class EditorManager extends EventEmitter {
  private _value: string = [
    "function helloWorld() {",
    '\tconsole.log("Hello, world!");',
    "};",
  ].join("\n");
  // TODO: Get types figured out
  private changeQueue: any[] = [];

  constructor({ pollingRate = 100 }: EditorManagerProps = {}) {
    super();
    validatePollingRate(pollingRate);

    setInterval(this.processChanges.bind(this), pollingRate);
  }

  get value(): string {
    return this._value;
  }

  enqueueChanges(changes: any[]) {
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

  processChange(change: any) {
    const { text: newText, rangeOffset, rangeLength } = change;

    const before = this._value.substring(0, rangeOffset);
    const after = this._value.substring(rangeOffset + rangeLength);

    this._value = `${before}${newText}${after}`;
  }
}
