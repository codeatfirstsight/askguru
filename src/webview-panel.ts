import { WebviewPanel } from 'vscode';
import { Uri } from 'vscode';
import { posix } from 'path';
import * as vscode from 'vscode';

export function AppWebview(context: vscode.ExtensionContext, webview: vscode.Webview, panel: WebviewPanel) {
  const contextPath = context.extensionPath;
  panel.iconPath = Uri.file(posix.join(contextPath, 'src', 'images', 'logo-sml.png'));
  
  // const cssBundle: Uri = Uri.file(posix.join(contextPath, 'app', 'public', 'bundle.css')).with({ scheme: 'vscode-resource' });
  // const jsFile: Uri = Uri.file(posix.join(contextPath, 'app', 'public', 'bundle.js')).with({ scheme: 'vscode-resource' });
  // console.log(jsFile)
  const cssBundle = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, "view", "show-view", "dist", "index.css"));
  const jsFile = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, "view", "show-view", "dist", "index.js"));
  return `
    <!doctype html>
    <html>

      <head>
        <meta charset='utf8'>
        <meta name='viewport' content='width=device-width'>
        <meta http-equiv="Content-Security-Policy" content="default-src 'self';frame-src https://giphy.com/; connect-src http://localhost:8088; img-src * 'self' data: vscode-resource: https:; script-src vscode-resource: https://unpkg.com/; style-src vscode-resource: https://unpkg.com/ 'unsafe-inline';" />
        <title> Stack Overflow View </title>
        <link rel="stylesheet" href="https://unpkg.com/@stackoverflow/stacks-editor/dist/styles.css">
        <link rel='stylesheet' href='${cssBundle}'>

        <script defer src='${jsFile}'></script>
        <link rel="stylesheet"
          href="https://unpkg.com/@highlightjs/cdn-assets@11.7.0/styles/default.min.css">
        <script src="https://unpkg.com/@highlightjs/cdn-assets@11.7.0/highlight.min.js"></script>
        
      </head>

      <body>
        <div id="app"></div>
      </body>

    </html>`;
}
