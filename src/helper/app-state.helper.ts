import * as vscode from "vscode";

export class AppState {
  static globalState: vscode.Memento;

  static setState(key: string, value: string) {
    return this.globalState.update(key, value);
  }

  static getState(key: string): string | undefined {
    return this.globalState.get(key);
  }

  static findState<T>(key: string): T {
    return this.globalState.get(key) as T;
  }

  static clearState(key: string) {
    if(this.globalState.get(key)) {
      this.globalState.update(key, undefined);
    }
  }
}