const vscode = acquireVsCodeApi();

function showProgress(action, title, hasError, errorMessage) {
  vscode.postMessage({
    command: "progress",
    action: action,
    title: title,
    error: hasError,
    errorMessage: errorMessage ? errorMessage : "An error occured fetching results. Check your internet connection."
  });
}

function changeWindowTitle(title) {
  vscode.postMessage({
    command: "titleChange",
    title: `${title}`
  });
}

function showInfoMessage(message) {
  vscode.postMessage({
    type: "info",
    value: message
  });
}

function showErrorMessage(message) {
  vscode.postMessage({
    type: "error",
    value: message
  });
}

function showLaunchLoginPageAuthErrorMessage(message, apiUrl) {
  vscode.postMessage({
    type: "actionableError",
    actionableButtons: {
      message,
      actions : [
        {
          buttonName : "Authenticate",
          actionType: "link",
          link: apiUrl
        }
      ]
    }
  });
}

function postMessage(type, value) {
  vscode.postMessage({
    type: type,
    value: value
  });
}

export { showProgress, changeWindowTitle, showInfoMessage, showErrorMessage, postMessage, showLaunchLoginPageAuthErrorMessage }