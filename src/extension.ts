import * as vscode from 'vscode';
import { WebviewPanel } from './webview-panel';
import { Sidebar } from './sidebar';

export function activate(context: vscode.ExtensionContext) {
  let activeColorTheme: vscode.ColorTheme = vscode.window.activeColorTheme;
  let accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzYWxpbHZuYWlyIiwiZ2l2ZW5fbmFtZSI6IlNhbGlsIiwiZmFtaWx5X25hbWUiOiJOYWlyIiwiaWF0IjoxNTE2MjM5MDIyfQ.AOj7Dccg1qmTZ7MxIJBaCWH7w7su-0SkPYSBPnsg9FA";
  let currentView = "";
  vscode.workspace.onDidChangeConfiguration(event => {
    let affected = event.affectsConfiguration("workbench.colorTheme");
    if(affected) {
      activeColorTheme = vscode.window.activeColorTheme;
      if(currentView === "askView") {
        reloadAskView(currentView, activeColorTheme, context, accessToken);
      }
    }
  })
  let searchView = vscode.commands.registerCommand('askguru.search', () => {
    if(currentView === "searchView"  && WebviewPanel.currentPanel) {
      return;
    }
    else {
      currentView = "searchView"
      WebviewPanel.kill();
      initSearchPanel(activeColorTheme, context, accessToken);
    }
  });

  let askView = vscode.commands.registerCommand('askguru.askQuestion', () => {
    if(currentView === "askView" && WebviewPanel.currentPanel) {
      return;
    }
    else {
      currentView = "askView"
      WebviewPanel.kill();
      initAskPanel(activeColorTheme, context, accessToken);
    }
  });

  context.subscriptions.push(searchView);
  context.subscriptions.push(askView);

  const sidebar = new Sidebar(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("askguru-sidebar", sidebar)
  );
}

function reloadAskView(currentView:string, activeColorTheme: vscode.ColorTheme, context: vscode.ExtensionContext, accessToken: string) {
  currentView = "askView"
  WebviewPanel.kill();
  initAskPanel(activeColorTheme, context, accessToken);
}

function initSearchPanel(activeColorTheme: vscode.ColorTheme, context: vscode.ExtensionContext, accessToken: string) {

  const currentLanguageSelection = vscode.workspace.getConfiguration().get('askguru.view.language');
  // Get sort type
  const currentSortTypeSelection = vscode.workspace.getConfiguration().get('askguru.view.sort');
  // Create webview panel
  WebviewPanel.kill();
  const searchPanel = WebviewPanel.createOrShow(`Search`, activeColorTheme, "search-view", context, context.extensionUri);
  // Post search term, read in App.svelte as window.addEventListener("message"
  searchPanel.webview.postMessage({
    action: 'init',
    query: '',
    language: currentLanguageSelection,
    sortType: currentSortTypeSelection,
    accessToken: accessToken
  });

  // Show progress loader
  windowProgress(searchPanel);

  // Listen for changes to window title
  changeWindowTitle(searchPanel);
}

function initAskPanel(activeColorTheme: vscode.ColorTheme, context: vscode.ExtensionContext, accessToken: string) {
  const askPanel = WebviewPanel.createOrShow(`Ask Question`, activeColorTheme, "ask-view", context, context.extensionUri);
  // const askPanel = createWebViewPanel(context,`Ask Question`, context.extensionPath);
  // Set webview - svelte - built to ./app/public/*
  // askPanel.webview.html = AppWebview(activeColorTheme, "ask-view", context, askPanel.webview, askPanel);
  // askPanel.webview.html = AppWebview(activeColorTheme, "ask-view", context, askPanel.webview, askPanel);

  const currentLanguageSelection = vscode.workspace.getConfiguration().get('askguru.view.language');
  
  askPanel.webview.postMessage({
    action: 'ask',
    language: currentLanguageSelection,
    accessToken: accessToken
  });

  // Show progress loader
  windowProgress(askPanel);

  // Listen for changes to window title
  changeWindowTitle(askPanel);
}

/**
 * Create vscode webViewPanel - sets default html with connection to /app
 * @param panelTitle string
 * @param path string
 */
function createWebViewPanel(context: vscode.ExtensionContext, panelTitle: string, path: string): vscode.WebviewPanel {
  return vscode.window.createWebviewPanel('webview', panelTitle, vscode.ViewColumn.Beside, {
    localResourceRoots: [context.extensionUri],
    enableScripts: true,
    retainContextWhenHidden: true
  });
}

function windowProgress(panel: vscode.WebviewPanel) {
  panel.webview.onDidReceiveMessage(message => {
    if (message.command === 'progress' && message.action === 'start') {
      showWindowProgress(panel, message.title);
    }
  });
}

function showWindowProgress(panel: vscode.WebviewPanel, title: string) {
  vscode.window.withProgress({
    location: vscode.ProgressLocation.Window,
    title: title
  }, (progress, token) => {

    const progressPromise = new Promise(resolve => {
      panel.webview.onDidReceiveMessage(message => {

        if (message.command === 'progress' && message.action === 'stop') {
          resolve(null);
          if (message.error) {
            vscode.window.showErrorMessage(message.errorMessage);
          }
        }

      });
    });

    return progressPromise;

  });
}

/**
 * Change window title based on user actions in the app
 * @param panel webview panel
 */
function changeWindowTitle(panel: vscode.WebviewPanel) {
  panel.webview.onDidReceiveMessage(message => {
    if (message.command === 'titleChange') {
      panel.title = message.title;
    }
  });
}

export function deactivate() { }
