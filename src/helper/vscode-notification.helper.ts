import * as vscode from 'vscode';
import { ActionableButtons } from '../model/actionable-button.model';


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

function windowMessage(panel: vscode.WebviewPanel) {
    panel.webview.onDidReceiveMessage(message => {
      if (message.type === 'info') {
        showInfoMessage(message);
      }
      else if (message.type === 'error') {
        showErrorMessage(message);
      }
      else if (message.type === 'actionableError') {
        showActionalbleErrorMessage(message.actionableButtons);
      }
    });
  }
  
function showInfoMessage(message:any) {
    vscode.window.showInformationMessage(message.value);
}

function showErrorMessage(message:any) {
    vscode.window.showErrorMessage(message.value);
}

function showActionalbleErrorMessage(actionableButtons: ActionableButtons) {
    let buttonNames = actionableButtons.actions.map(actionableButton => actionableButton.buttonName);
    vscode.window
    .showErrorMessage(actionableButtons.message, ...buttonNames)
    .then(selection => {
        let selectedButton = actionableButtons.actions.find(actionableButton => actionableButton.buttonName === selection);
        if(selectedButton) {
        if( selectedButton.actionType === 'link') {
            vscode.env.openExternal(vscode.Uri.parse(selectedButton.link!));
        }
        }
    });
}

export { 
    windowProgress, 
    changeWindowTitle, 
    showWindowProgress,
    windowMessage,
    showActionalbleErrorMessage
};