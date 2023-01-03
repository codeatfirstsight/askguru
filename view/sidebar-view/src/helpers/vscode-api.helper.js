const vscode = acquireVsCodeApi();

function vscodeProgress(action, title, hasError) {
  vscode.postMessage({
    command: "progress",
    action: action,
    title: title,
    error: hasError,
    errorMessage:
      "An error occured fetching results. Check your internet connection."
  });
}

function vscodeWindowTitle(title) {
  vscode.postMessage({
    command: "titleChange",
    title: `QaBox: ${title}`
  });
}

function postMessage(type, value) {
  vscode.postMessage({
    type: type,
    value: value
  });
}

export { vscodeProgress, vscodeWindowTitle, postMessage }