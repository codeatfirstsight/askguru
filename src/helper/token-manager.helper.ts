import * as vscode from "vscode";

const KEY = "askguruAccessToken";

export class TokenManager {
  static globalState: vscode.Memento;

  static setToken(token: string) {
    return this.globalState.update(KEY, token);
  }

  static clearToken() {
    this.globalState.update(KEY, undefined);
  }

  static getToken(): string | undefined {
    return this.globalState.get(KEY);
  }
}