import { WebviewPanel } from 'vscode';
import { Uri } from 'vscode';
import { posix } from 'path';
import * as vscode from 'vscode';

export function AppPageHtml(context: vscode.ExtensionContext, webview: vscode.Webview, panel: WebviewPanel) {
  const contextPath = context.extensionPath;
  panel.iconPath = Uri.file(posix.join(contextPath, 'src', 'images', 'logo-sml.png'));
  
  // const cssBundle: Uri = Uri.file(posix.join(contextPath, 'app', 'public', 'bundle.css')).with({ scheme: 'vscode-resource' });
  // const jsFile: Uri = Uri.file(posix.join(contextPath, 'app', 'public', 'bundle.js')).with({ scheme: 'vscode-resource' });
  // console.log(jsFile)
  const cssBundle = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'app', 'dist', 'bundle.css'));
  const jsFile = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'app', 'dist', 'bundle.js'));
  console.log(jsFile)

  return `
    <!doctype html>
    <html>

      <head>
        <meta charset='utf8'>
        <meta name='viewport' content='width=device-width'>
        <meta http-equiv="Content-Security-Policy" content="default-src 'self';frame-src https://giphy.com/; connect-src https://api.stackexchange.com/2.2/; img-src * 'self' data: vscode-resource: https:; script-src vscode-resource:; style-src vscode-resource: 'unsafe-inline';" />
        <title> Stack Overflow View </title>

        
        <link rel='stylesheet' href='${cssBundle}'>

        <script defer src='${jsFile}'></script>
        
        
      </head>

      <body>
        <h1>Testing...</h1>
        <div id="app"></div>
      </body>

    </html>`;
}
