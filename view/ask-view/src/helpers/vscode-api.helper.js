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

export { vscodeProgress }