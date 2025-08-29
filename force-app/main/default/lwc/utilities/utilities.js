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
        showToast(context, 'Error!', message, undefined, 'error');
    }
}

/**
 * Capitalize the first letter in a string/word capitalizeString('test') => Test .
 * @param {str} string or word to capitalize.
 * @return {string} capitalized string.
 */
const capitalizeString = (str) => {
    if (typeof str !== 'string' || str.length === 0) {
        return '';
    }
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Show Toast Notifications using ShowToastEvent.
 * @param {context} object: represents where the function will be executed. normally "this" = lwc.
 * @param {title} string: notification title.
 * @param {message} string: main message to display in the notification.
 * @param {messageData} Array: used to include dynamic details to a message.
 * @return {string} capitalized string.
 */
const showToast = (context, title, message, messageData, variant) => {
    const toast = new ShowToastEvent({
        title,
        message,
        messageData,
        variant
    });
    context.dispatchEvent(toast);
}

/**
 * List all reusable functionalities
 */
export {
    errorNotificationMessages,
    capitalizeString,
    showToast,
}