import { ShowToastEvent } from 'lightning/platformShowToastEvent';

/**
 * Show a list of error messages notifications.
 * @param {messages} array - list of error messages to display.
 * @param {context} object - contains component context (this).
 */
const errorNotificationMessages = (messages, context) => {
    if(messages.length === 0 || context === undefined){
        return undefined;
    }

    for (let message of messages) {
        const notification = new ShowToastEvent({
            title: 'Error',
            message: message,
            variant: 'error',
            mode: 'stick'
        });
        
        context.dispatchEvent(notification);
    }
}

/**
 * List all reusable functionalities
 */
export {
    errorNotificationMessages
}