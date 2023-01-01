import * as vscode from 'vscode';
import { ExtensionModel } from './extension-model';
import { posix } from 'path';
import { AppWebview } from './webview-panel';
import { Sidebar } from './sidebar';

export function activate(context: vscode.ExtensionContext) {

  let accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzYWxpbHZuYWlyIiwiZ2l2ZW5fbmFtZSI6IlNhbGlsIiwiZmFtaWx5X25hbWUiOiJOYWlyIiwiaWF0IjoxNTE2MjM5MDIyfQ.AOj7Dccg1qmTZ7MxIJBaCWH7w7su-0SkPYSBPnsg9FA";

  // /**
  //  * General stackoverflow question
  //  */
  let searchStackoverflow = vscode.commands.registerCommand('askguru.searchStackoverflow', () => {

    // Search options
    const searchOptions: vscode.InputBoxOptions = {
      placeHolder: 'Search Stackoverflow',
      prompt: '*Required',
    };

    // Show Input
    // vscode.window.showInputBox(searchOptions).then((searchQuery: string | undefined) => {

    //   if (searchQuery) {



    //   }

    // });

    let searchQuery = "";
    // Get language
    const currentLanguageSelection = vscode.workspace.getConfiguration().get('stackoverflow.view.language');
    // Get sort type
    const currentSortTypeSelection = vscode.workspace.getConfiguration().get('stackoverflow.view.sort');
    // Create webview panel
    const stackoverflowPanel = createWebViewPanel(context,`SO: ${searchQuery}`, context.extensionPath);
    // Set webview - svelte - built to ./app/public/*
    stackoverflowPanel.webview.html = AppWebview(context,stackoverflowPanel.webview, stackoverflowPanel);
    // Post search term, read in App.svelte as window.addEventListener("message"
    stackoverflowPanel.webview.postMessage({
      action: 'init',
      query: '',
      language: currentLanguageSelection,
      sortType: currentSortTypeSelection,
      accessToken: accessToken
    });

    // Show progress loader
    windowProgress(stackoverflowPanel);

    // Listen for changes to window title
    changeWindowTitle(stackoverflowPanel);
  });

  // /**
  //  * Top pick stackoverflow articles
  //  */
  // let topPickStackoverflow = vscode.commands.registerCommand('askguru.topPickStackoverflow', () => {

  //   vscode.window.showQuickPick(ExtensionModel.topPickQuickInputItems).then((selectedTopPick: vscode.QuickPickItem | undefined) => {

  //     if (selectedTopPick) {

  //       // Get article selected artical with ID
  //       const selectedArticle: any = ExtensionModel.topPickIds.find((element: any) => {
  //         return element.label === selectedTopPick.label;
  //       });

  //       // Get language
  //       const language: any = ExtensionModel.languages[0];

  //       // Create webview panel
  //       const stackoverflowPanel = createWebViewPanel(`SO: ${selectedTopPick.label}`, context.extensionPath);
  //       // Set webview - svelte built to ./app/public/*
  //       stackoverflowPanel.webview.html = AppWebview(context, stackoverflowPanel.webview, stackoverflowPanel);
  //       // Post article Id to app, read in App.svelte as window.addEventListener("message"
  //       stackoverflowPanel.webview.postMessage({
  //         action: 'topPick',
  //         language: language,
  //         questionId: selectedArticle.id,
  //         label: selectedArticle.label,
  //         gif: selectedArticle.gif,
  //         accessToken: accessToken
  //       });

  //       // Show progress loader
  //       windowProgress(stackoverflowPanel);

  //     }
  //   });
  // });

  context.subscriptions.push(searchStackoverflow);
  // context.subscriptions.push(topPickStackoverflow);

  const sidebar = new Sidebar(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("askguru-sidebar", sidebar)
  );
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
