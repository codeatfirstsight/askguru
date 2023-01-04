export interface ActionableButtons {
    message: string,
    actions: ActionableButton[]
  }
  
export interface ActionableButton {
    buttonName: string,
    actionType: string,
    link?: string,
    action?: any 
  }