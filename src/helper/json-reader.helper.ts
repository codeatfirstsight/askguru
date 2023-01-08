import * as vscode from "vscode";

export class JsonReader {
    static read<T>(context: vscode.ExtensionContext, ...pathSegments: string[]): T {
        const uri = vscode.Uri.joinPath(context.extensionUri, ...pathSegments);
        let jsonObject = require(uri.fsPath);
        return jsonObject;
    }
}