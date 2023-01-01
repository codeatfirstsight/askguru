// import { WebviewPanel } from 'vscode';
// import { Uri } from 'vscode';
// import { posix } from 'path';
// import * as vscode from 'vscode';

// export function AppWebview(activeColorTheme: vscode.ColorTheme, viewPath: string, context: vscode.ExtensionContext, webview: vscode.Webview, panel: WebviewPanel) {
//   const contextPath = context.extensionPath;
//   panel.iconPath = Uri.file(posix.join(contextPath, 'src', 'images', 'logo-sml.png'));
  
//   // const cssBundle: Uri = Uri.file(posix.join(contextPath, 'app', 'public', 'bundle.css')).with({ scheme: 'vscode-resource' });
//   // const jsFile: Uri = Uri.file(posix.join(contextPath, 'app', 'public', 'bundle.js')).with({ scheme: 'vscode-resource' });
//   // console.log(jsFile)
//   const cssBundle = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, "view", viewPath, "dist", "index.css"));
//   const jsFile = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, "view", viewPath, "dist", "index.js"));
//   const themeColor = activeColorTheme.kind === vscode.ColorThemeKind.Dark ? "theme-dark" : "theme-light";
//   return `
//     <!doctype html>
//     <html>

//       <head>
//         <meta charset='utf8'>
//         <meta name='viewport' content='width=device-width'>
//         <meta http-equiv="Content-Security-Policy" content="default-src 'self';frame-src https://giphy.com/; connect-src http://localhost:8088; img-src * 'self' data: vscode-resource: https:; script-src vscode-resource: https://unpkg.com/; style-src vscode-resource: https://unpkg.com/ 'unsafe-inline';" />
//         <title> Stack Overflow View </title>
//         <link rel="stylesheet" href="https://unpkg.com/@stackoverflow/stacks-editor/dist/styles.css">
//         <link rel='stylesheet' href='${cssBundle}'>

//         <script defer src='${jsFile}'></script>
//         <link rel="stylesheet"
//           href="https://unpkg.com/@highlightjs/cdn-assets@11.7.0/styles/default.min.css">
//         <script src="https://unpkg.com/@highlightjs/cdn-assets@11.7.0/highlight.min.js"></script>
        
//       </head>

//       <body class=${themeColor}>
//         <div id="app"></div>
//       </body>

//     </html>`;
// }

import * as vscode from "vscode";

export class WebviewPanel {
  /**
   * Track the currently panel. Only allow a single panel to exist at a time.
   */
  public static currentPanel: WebviewPanel | undefined;

  public static readonly viewType = "hello-world";

  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private readonly _activeColorTheme: vscode.ColorTheme;
  private readonly _viewPath: string;
  private readonly _context: vscode.ExtensionContext
  private _disposables: vscode.Disposable[] = [];

  public static createOrShow(panelTitle: string , activeColorTheme: vscode.ColorTheme, viewPath: string, context: vscode.ExtensionContext, extensionUri: vscode.Uri) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    // If we already have a panel, show it.
    if (WebviewPanel.currentPanel) {
      WebviewPanel.currentPanel._panel.reveal(column);
      WebviewPanel.currentPanel._update(viewPath);
      return WebviewPanel.currentPanel._panel;
    }

    // Otherwise, create a new panel.
    const panel = vscode.window.createWebviewPanel(
      WebviewPanel.viewType,
      panelTitle,
      column || vscode.ViewColumn.One,
      {
        localResourceRoots: [context.extensionUri],
        enableScripts: true,
        retainContextWhenHidden: true
      }
    );

    WebviewPanel.currentPanel = new WebviewPanel(activeColorTheme, viewPath, context, panel, extensionUri);
    return panel;
  }

  public static vsPanel() {
    return WebviewPanel.currentPanel?._panel;
  }

  public static kill() {
    WebviewPanel.currentPanel?.dispose();
    WebviewPanel.currentPanel = undefined;
  }

  public static revive(activeColorTheme: vscode.ColorTheme, viewPath: string, context: vscode.ExtensionContext, panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    WebviewPanel.currentPanel = new WebviewPanel(activeColorTheme, viewPath, context, panel, extensionUri);
  }

  private constructor(activeColorTheme: vscode.ColorTheme, viewPath: string, context: vscode.ExtensionContext, panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel;
    this._extensionUri = extensionUri;
    this._activeColorTheme = activeColorTheme;
    this._viewPath = viewPath;
    this._context = context;

    // Set the webview's initial html content
    this._update(viewPath);

    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programatically
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
  }

  public dispose() {
    WebviewPanel.currentPanel = undefined;

    // Clean up our resources
    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  private async _update(viewPath: string) {
    const webview = this._panel.webview;

    this._panel.webview.html = this._getHtmlForWebview(this._activeColorTheme, viewPath, this._context , webview);
    webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case "onInfo": {
          if (!data.value) {
            return;
          }
          vscode.window.showInformationMessage(data.value);
          break;
        }
        case "onError": {
          if (!data.value) {
            return;
          }
          vscode.window.showErrorMessage(data.value);
          break;
        }
      }
    });
  }

  private _getHtmlForWebview(activeColorTheme: vscode.ColorTheme, viewPath: string, context: vscode.ExtensionContext, webview: vscode.Webview) {
    // // And the uri we use to load this script in the webview    
    const cssBundle = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, "view", viewPath, "dist", "index.css"));  
    const jsFile = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, "view", viewPath, "dist", "index.js"));
    const themeColor = activeColorTheme.kind === vscode.ColorThemeKind.Dark ? "theme-dark" : "theme-light";
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
  
        <body class=${themeColor}>
          <div id="app"></div>
        </body>
  
      </html>`;
  }
}
