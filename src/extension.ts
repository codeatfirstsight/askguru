import * as vscode from 'vscode';
import { WebviewWrapper } from './view-wrapper/web-view.wrapper';
import { SidebarViewWrapper } from './view-wrapper/sidebar-view.wrapper';
import { TokenManager } from './helper/token-manager.helper';
import { changeWindowTitle, windowMessage, windowProgress } from './helper/vscode-notification.helper';
import { AppConfig } from './model/app-config.model';
import { JsonReader } from './helper/json-reader.helper';
import { AppState } from './helper/app-state.helper';
import axios from 'axios';



export function activate(context: vscode.ExtensionContext) {
  TokenManager.globalState = context.globalState;
  AppState.globalState = context.globalState;
  let appConfig = initAppConfig(context);

  AppState.setState('currentView', 'searchView');

  const searchView = registerView(appConfig, 'askguru.search', "searchView", context);

  const askView = registerView(appConfig, 'askguru.askQuestion', "askView", context);

  const invalidateToken = registerTokenInvalidation(appConfig, 'askguru.invalidateToken', findCurrentView(), context);

  const sidebarView = registerSidebarView(appConfig, "askguru-sidebar",  context);
  
  const uriHandler = registerRedirectionUri(appConfig, findCurrentView(), context);

  workSpaceConfigChangeListener(appConfig, context);
  
  //register all subscriptions into the context
  context.subscriptions.push(sidebarView);
  context.subscriptions.push(searchView);
  context.subscriptions.push(askView);
  context.subscriptions.push(invalidateToken);
	context.subscriptions.push(uriHandler);
}

function initAppConfig(context: vscode.ExtensionContext) {
  let appConfig = JsonReader.read<AppConfig>(context, "config", "app-config.json");
  const appConfigJsonString = AppState.findState("appConfig") as string;
  if(appConfigJsonString) {
    appConfig = JSON.parse(appConfigJsonString);
  }
  return appConfig;
}

//register the extension redirect URI vscode://codeatfirstsight.askguru (we can hit this URL from browser and the control will come in below handler)
function registerRedirectionUri(appConfig: AppConfig, currentView:string, context: vscode.ExtensionContext) {
  const handleUri = (uri: vscode.Uri) => {
    currentView = findCurrentView();
		const queryParams = new URLSearchParams(uri.query);
		if (queryParams.has('accessToken') && queryParams.get('accessToken') as string !== '') {
      const accessToken = queryParams.get('accessToken') as string;
      if (queryParams.has('appConfigUrl') && queryParams.get('appConfigUrl') as string !== '') {
        const appConfigUrl = queryParams.get('appConfigUrl') as string;
        var headers = {
          withCredentials: true,
          headers: {
              Authorization: `Bearer ${accessToken}`,
          },
        };

        axios
        .get(appConfigUrl, headers)
        .then((response : any) => {
            if (response.status === 200) {
              appConfig= response.data;
              const userName = queryParams.get('userName')  as string;
              AppState.setState("userName", userName);
              AppState.setState("appConfig", JSON.stringify(appConfig));
              vscode.window.showInformationMessage(`Hi ${userName}, welcome to the Ask Guru.`)
              TokenManager.setToken(accessToken);
              reloadWindowPanel(appConfig, currentView, context);
            }
        });
      }
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

function registerTokenInvalidation(appConfig: AppConfig, command:string, currentView:string, context: vscode.ExtensionContext) {
  return vscode.commands.registerCommand(command, () => {
    vscode.window
      .showWarningMessage("Are you sure you want to invalidate the token?", "Yes", "No")
      .then(answer => {
        if (answer === "Yes") {
          TokenManager.clearToken();
          AppState.clearState("userName");
          AppState.clearState("appConfig");
          reloadWindowPanel(appConfig, currentView, context);
        }
      })
  })
}

function findCurrentView() {
  return AppState.findState<string>('currentView');
}

function registerView(appConfig: AppConfig, command:string, view:string, context: vscode.ExtensionContext) {
  return vscode.commands.registerCommand(command, () => {
    let currentView = findCurrentView();
    if(view === "searchView") {
      if(WebviewWrapper.currentPanel && view === currentView) {
        return;
      }
      else {
        currentView = "searchView";
        initSearchView(appConfig, context);
      }
    }
    if(view === "askView") {
      if(WebviewWrapper.currentPanel && view === currentView) {
        return;
      }
      else {
        currentView = "askView";
        initAskView(appConfig, context);
      }
    }
    AppState.setState('currentView', currentView);
  });
}

// listen to the workspace config changes
// as of now color theme changes is subscribed
function workSpaceConfigChangeListener(appConfig: AppConfig, context: vscode.ExtensionContext) {
  vscode.workspace.onDidChangeConfiguration(event => {
    onChangeWorkspaceColorTheme(event, appConfig, context);
  });
}

function onChangeWorkspaceColorTheme(event:vscode.ConfigurationChangeEvent, appConfig: AppConfig, context: vscode.ExtensionContext) {
  let currentView = findCurrentView();
  let affected = event.affectsConfiguration("workbench.colorTheme");
  if(affected) {
    reloadWindowPanel(appConfig, currentView, context);
  }
}

function reloadWindowPanel(appConfig: AppConfig, currentView: string, context: vscode.ExtensionContext) {
  if(currentView === "askView") {
    initAskView(appConfig, context);
  }
  else if(currentView === "searchView") {
    initSearchView(appConfig, context);
  }
}

function initSearchView(appConfig: AppConfig, context: vscode.ExtensionContext) {
  WebviewWrapper.kill();
  initSearchPanel(appConfig, context);
}

function initAskView(appConfig: AppConfig, context: vscode.ExtensionContext) {
  WebviewWrapper.kill();
  initAskPanel(appConfig, context);
}

function initSearchPanel(appConfig: AppConfig, context: vscode.ExtensionContext) {
  let activeColorTheme = vscode.window.activeColorTheme;

  const searchPanel = WebviewWrapper.createOrShow(appConfig, `Search`, activeColorTheme, "search-view", context, context.extensionUri);
  // Post search term, read in App.svelte as window.addEventListener("message"

  // Show progress loader
  windowProgress(searchPanel);

  // Listen for changes to window title
  changeWindowTitle(searchPanel);

  // Listen for window messages
  windowMessage(searchPanel);

  //listen for svelte onMount
  windowPanelSvelteLifecycleListener(searchPanel, appConfig);
}

function initAskPanel(appConfig: AppConfig, context: vscode.ExtensionContext) {
  let activeColorTheme = vscode.window.activeColorTheme;
  const askPanel = WebviewWrapper.createOrShow(appConfig, `Ask Question`, activeColorTheme, "ask-view", context, context.extensionUri);

  // Show progress loader
  windowProgress(askPanel);

  // Listen for changes to window title
  changeWindowTitle(askPanel);

   // Listen for window messages
  windowMessage(askPanel);

  //listen for svelte onMount
  windowPanelSvelteLifecycleListener(askPanel, appConfig);
}


// listen for the svelete app lifecycle hooks then fire the message events
// so that there is no loss of of messages
function windowPanelSvelteLifecycleListener(panel: vscode.WebviewPanel, appConfig: AppConfig) {
  panel.webview.onDidReceiveMessage((data) => {
    switch (data.type) {
        case "onMount": {
          sendMessageEvent(panel, data.value, appConfig);
        }
    }
  });
}

//send message event to the webview (svelte apps)
function sendMessageEvent(panel: vscode.WebviewPanel, viewName:string, appConfig: AppConfig) {
  const currentLanguageSelection = vscode.workspace.getConfiguration().get('askguru.view.language');
  // Get sort type
  const currentSortTypeSelection = vscode.workspace.getConfiguration().get('askguru.view.sort');
  if(viewName === "askView") {
    panel.webview.postMessage({
      action: 'ask',
      language: currentLanguageSelection,
      accessToken: TokenManager.getToken(),
      userName: AppState.findState("userName"),
      appConfig: appConfig
    });
  }
  else if(viewName === "searchView") {
    panel.webview.postMessage({
      action: 'init',
      language: currentLanguageSelection,
      sortType: currentSortTypeSelection,
      accessToken: TokenManager.getToken(),
      userName: AppState.findState("userName"),
      appConfig: appConfig
    });
  }
}



export function deactivate() { }
