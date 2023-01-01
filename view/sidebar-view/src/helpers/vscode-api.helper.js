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

function vscodeInfo(infoText) {
  vscode.postMessage({
    type: "onInfo",
    value: infoText
  });
}

export { vscodeProgress, vscodeWindowTitle, vscodeInfo }