import * as vscode from "vscode";
import { generateNonce } from "../helper/common.helper";
import { AppConfig } from "../model/app-config.model";

export class WebviewWrapper {
  /**
   * Track the current panel. Only allow a single panel to exist at a time.
   */
  public static currentPanel: WebviewWrapper | undefined;

  public static readonly viewType = 'webview';

  private readonly _panel: vscode.WebviewPanel;
  private readonly _appConfig: AppConfig;
  private readonly _extensionUri: vscode.Uri;
  private readonly _activeColorTheme: vscode.ColorTheme;
  private readonly _viewPath: string;
  private readonly _context: vscode.ExtensionContext
  private _disposables: vscode.Disposable[] = [];

  public static createOrShow(appConfig:AppConfig, panelTitle: string , activeColorTheme: vscode.ColorTheme, viewPath: string, context: vscode.ExtensionContext, extensionUri: vscode.Uri) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    // If we already have a panel, show it.
    if (WebviewWrapper.currentPanel) {
      WebviewWrapper.currentPanel._panel.reveal(column);
      WebviewWrapper.currentPanel._update(viewPath);
      return WebviewWrapper.currentPanel._panel;
    }

    // Otherwise, create a new panel.
    const panel = vscode.window.createWebviewPanel(
      WebviewWrapper.viewType,
      panelTitle,
      column || vscode.ViewColumn.One,
      {
        localResourceRoots: [context.extensionUri],
        enableScripts: true,
        retainContextWhenHidden: true
      }
    );

    WebviewWrapper.currentPanel = new WebviewWrapper(appConfig, activeColorTheme, viewPath, context, panel, extensionUri);
    return panel;
  }

  public static vsPanel() {
    return WebviewWrapper.currentPanel?._panel;
  }

  public static kill() {
    WebviewWrapper.currentPanel?.dispose();
    WebviewWrapper.currentPanel = undefined;
  }

  public static revive(appConfig: AppConfig, activeColorTheme: vscode.ColorTheme, viewPath: string, context: vscode.ExtensionContext, panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    WebviewWrapper.currentPanel = new WebviewWrapper(appConfig, activeColorTheme, viewPath, context, panel, extensionUri);
  }

  private constructor(appConfig: AppConfig, activeColorTheme: vscode.ColorTheme, viewPath: string, context: vscode.ExtensionContext, panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel;
    this._appConfig = appConfig;
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
    WebviewWrapper.currentPanel = undefined;

    // Clean up our resources
    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  private _update(viewPath: string) {
    const webview = this._panel.webview;

    this._panel.webview.html = this._getHtmlForWebview(this._appConfig, this._activeColorTheme, viewPath, this._context , webview);
  }

  private _getHtmlForWebview(appConfig: AppConfig, activeColorTheme: vscode.ColorTheme, viewPath: string, context: vscode.ExtensionContext, webview: vscode.Webview) {
    // // And the uri we use to load this script in the webview   
    if(!appConfig.apiBaseUrl) {
      appConfig.apiBaseUrl = vscode.workspace.getConfiguration().get('askguru.baseUrl') as string;
    }
    if(!appConfig.appAuthUrl) {
      appConfig.appAuthUrl = vscode.workspace.getConfiguration().get('askguru.appAuthUrl') as string;
    }
    const nonce = generateNonce(); 
    const cssBundle = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, "view", viewPath, "dist", "index.css"));  
    const jsFile = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, "view", viewPath, "dist", "index.js"));
    const themeColor = activeColorTheme.kind === vscode.ColorThemeKind.Dark ? "theme-dark" : "theme-light";
    const hljsThemedCss = activeColorTheme.kind === vscode.ColorThemeKind.Dark ? 'https://unpkg.com/@highlightjs/cdn-assets@11.7.0/styles/atom-one-dark.min.css' : 'https://unpkg.com/@highlightjs/cdn-assets@11.7.0/styles/atom-one-light.min.css'
    return `
      <!doctype html>
      <html>
  
        <head>
          <meta charset='utf8'>
          <meta name='viewport' content='width=device-width'>
          <meta http-equiv="Content-Security-Policy" content="default-src 'self';frame-src https://giphy.com/; connect-src ${appConfig.apiBaseUrl}; img-src * 'self' data: vscode-resource: https:; script-src  vscode-resource: https://unpkg.com/ 'nonce-${nonce}'; style-src vscode-resource: https://unpkg.com/  https://fonts.cdnfonts.com/ 'unsafe-inline'; font-src https://fonts.cdnfonts.com/ " />
          <title> AskGuru View </title>
          <link rel="stylesheet" href="https://unpkg.com/@stackoverflow/stacks-editor/dist/styles.css">  
          <link href="https://fonts.cdnfonts.com/css/roboto" rel="stylesheet">                      
          <link rel='stylesheet' href='${cssBundle}'>
  
          <script defer src='${jsFile}' nonce="${nonce}"></script>
          <link rel="stylesheet" href='${hljsThemedCss}'>
          <script nonce="${nonce}" src="https://unpkg.com/@highlightjs/cdn-assets@11.7.0/highlight.min.js"></script>
          
        </head>
  
        <body class=${themeColor}>
          <div id="app"></div>
        </body>
  
      </html>`;
  }
}
