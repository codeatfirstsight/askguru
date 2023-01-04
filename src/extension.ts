import * as vscode from 'vscode';
import { WebviewWrapper } from './view-wrapper/web-view.wrapper';
import { SidebarViewWrapper } from './view-wrapper/sidebar-view.wrapper';
import { TokenManager } from './helper/token-manager.helper';
import { changeWindowTitle, windowMessage, windowProgress } from './helper/vscode-notification.helper';
import { AppConfig } from './model/app-config.model';
import { JsonReader } from './helper/json-reader.helper';
import { AppState } from './helper/app-state.helper';



export function activate(context: vscode.ExtensionContext) {
  let appConfig = JsonReader.read<AppConfig>(context, "config", "app-config.json");

  TokenManager.globalState = context.globalState;
  AppState.globalState = context.globalState;

  let activeColorTheme: vscode.ColorTheme = vscode.window.activeColorTheme;
  
  AppState.setState('currentView', 'searchView');
  AppState.setState('darkTheme',  (activeColorTheme.kind === vscode.ColorThemeKind.Dark) +"")

  const searchView = registerView(appConfig, 'askguru.search', "searchView",  activeColorTheme, context);

  const askView = registerView(appConfig, 'askguru.askQuestion', "askView",  activeColorTheme, context);

  const invalidateToken = registerTokenInvalidation(appConfig, 'askguru.invalidateToken', findCurrentView(), activeColorTheme, context);

  const sidebarView = registerSidebarView(appConfig, "askguru-sidebar",  context);
  
  const uriHandler = registerRedirectionUri(appConfig, findCurrentView(), activeColorTheme, context);

  workSpaceConfigChangeListener(appConfig, activeColorTheme, context);
  
  //register all subscriptions into the context
  context.subscriptions.push(sidebarView);
  context.subscriptions.push(searchView);
  context.subscriptions.push(askView);
  context.subscriptions.push(invalidateToken);
	context.subscriptions.push(uriHandler);
}

function registerRedirectionUri(appConfig: AppConfig, currentView:string, activeColorTheme: vscode.ColorTheme, context: vscode.ExtensionContext) {
  const handleUri = (uri: vscode.Uri) => {
    currentView = findCurrentView();
    activeColorTheme = vscode.window.activeColorTheme;
		const queryParams = new URLSearchParams(uri.query);
		if (queryParams.has('accessToken') && queryParams.get('accessToken') as string !== '') {
      vscode.window.showInformationMessage("Authenticated successfully, you can now use the application.")
			TokenManager.setToken(queryParams.get('accessToken') as string);
      reloadWindowPanel(appConfig, currentView, activeColorTheme, context);
		}
    else {
      vscode.window.showErrorMessage("Authentication failed please reauthenticate from Ask Guru website.")
    }
	};
  return vscode.window.registerUriHandler({ handleUri });
}

function registerSidebarView(appConfig: AppConfig, command: string, context: vscode.ExtensionContext) {
  const sidebar = new SidebarViewWrapper(appConfig, context.extensionUri);
  return vscode.window.registerWebviewViewProvider(command, sidebar);
}

function registerTokenInvalidation(appConfig: AppConfig, command:string, currentView:string, activeColorTheme: vscode.ColorTheme, context: vscode.ExtensionContext) {
  return vscode.commands.registerCommand(command, () => {
    activeColorTheme = vscode.window.activeColorTheme;
    vscode.window
      .showWarningMessage("Are you sure you want to invalidate the token?", "Yes", "No")
      .then(answer => {
        if (answer === "Yes") {
          TokenManager.clearToken();
          reloadWindowPanel(appConfig, currentView, activeColorTheme, context);
        }
      })
  })
}

function findCurrentView() {
  return AppState.getState('currentView') as string;
}

function darkTheme() {
  return AppState.getState('darkTheme') as string === "true";
}

function registerView(appConfig: AppConfig, command:string, view:string, activeColorTheme: vscode.ColorTheme, context: vscode.ExtensionContext) {
  return vscode.commands.registerCommand(command, () => {
    let currentView = findCurrentView();
    activeColorTheme = vscode.window.activeColorTheme;
    if(view === "searchView") {
      if(WebviewWrapper.currentPanel && view === currentView) {
        return;
      }
      else {
        currentView = "searchView";
        initSearchView(appConfig, activeColorTheme, context);
      }
    }
    if(view === "askView") {
      if(WebviewWrapper.currentPanel && view === currentView) {
        return;
      }
      else {
        currentView = "askView";
        initAskView(appConfig, activeColorTheme, context);
      }
    }
    AppState.setState('currentView', currentView);
  });
}

function workSpaceConfigChangeListener(appConfig: AppConfig, activeColorTheme: vscode.ColorTheme, context: vscode.ExtensionContext) {
  vscode.workspace.onDidChangeConfiguration(event => {
    let currentView = findCurrentView();
    let affected = event.affectsConfiguration("workbench.colorTheme");
    if(affected) {
      activeColorTheme = vscode.window.activeColorTheme;
      reloadWindowPanel(appConfig, currentView, activeColorTheme, context);
    }
  });
}

function reloadWindowPanel(appConfig: AppConfig, currentView: string, activeColorTheme: vscode.ColorTheme, context: vscode.ExtensionContext) {
  activeColorTheme = vscode.window.activeColorTheme;
  if(currentView === "askView") {
    initAskView(appConfig, activeColorTheme, context);
  }
  else if(currentView === "searchView") {
    initSearchView(appConfig, activeColorTheme, context);
  }
}

function initSearchView(appConfig: AppConfig, activeColorTheme: vscode.ColorTheme, context: vscode.ExtensionContext) {
  activeColorTheme = vscode.window.activeColorTheme;
  WebviewWrapper.kill();
  initSearchPanel(appConfig, activeColorTheme, context);
}

function initAskView(appConfig: AppConfig, activeColorTheme: vscode.ColorTheme, context: vscode.ExtensionContext) {
  activeColorTheme = vscode.window.activeColorTheme;
  WebviewWrapper.kill();
  initAskPanel(appConfig, activeColorTheme, context);
}

function initSearchPanel(appConfig: AppConfig, activeColorTheme: vscode.ColorTheme, context: vscode.ExtensionContext) {
  activeColorTheme = vscode.window.activeColorTheme;

  const searchPanel = WebviewWrapper.createOrShow(appConfig, `Search`, activeColorTheme, "search-view", context, context.extensionUri);
  // Post search term, read in App.svelte as window.addEventListener("message"

  // Show progress loader
  windowProgress(searchPanel);

  // Listen for changes to window title
  changeWindowTitle(searchPanel);

  // Listen for window messages
  windowMessage(searchPanel);

  //listen for svelte onMount
  windowPanelSvelteLifecycleListener(searchPanel);
}

function initAskPanel(appConfig: AppConfig, activeColorTheme: vscode.ColorTheme, context: vscode.ExtensionContext) {
  activeColorTheme = vscode.window.activeColorTheme;
  const askPanel = WebviewWrapper.createOrShow(appConfig, `Ask Question`, activeColorTheme, "ask-view", context, context.extensionUri);

  // Show progress loader
  windowProgress(askPanel);

  // Listen for changes to window title
  changeWindowTitle(askPanel);

   // Listen for window messages
  windowMessage(askPanel);

  //listen for svelte onMount
  windowPanelSvelteLifecycleListener(askPanel);
}



function windowPanelSvelteLifecycleListener(panel: vscode.WebviewPanel) {
  panel.webview.onDidReceiveMessage((data) => {
    switch (data.type) {
        case "onMount": {
          sendMessageEvent(panel, data.value);
        }
    }
  });
}

function sendMessageEvent(panel: vscode.WebviewPanel, viewName:string) {
  const currentLanguageSelection = vscode.workspace.getConfiguration().get('askguru.view.language');
  // Get sort type
  const currentSortTypeSelection = vscode.workspace.getConfiguration().get('askguru.view.sort');
  if(viewName === "askView") {
    panel.webview.postMessage({
      action: 'ask',
      language: currentLanguageSelection,
      accessToken: TokenManager.getToken()
    });
  }
  else if(viewName === "searchView") {
    panel.webview.postMessage({
      action: 'init',
      language: currentLanguageSelection,
      sortType: currentSortTypeSelection,
      accessToken: TokenManager.getToken()
    });
  }
}



export function deactivate() { }
