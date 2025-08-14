# Projects

## Task Manager Project: TMP

Requirement:

Create a Task Manager application in Salesforce where users can create, view, update, and delete tasks. The backend logic will be handled by Apex and Lightning Web Components (LDS), and the frontend will be built using Lightning Web Components (LWC).

**Features**
1. Task Creation: Users can create tasks with fields like Title, Description, Due Date, and Status.
2. Task List: Display a list of tasks with sorting by Due Date.
3. Task Update/Delete: Allow users to edit or delete existing tasks.
4. Basic Validation: Ensure the Title is not empty and Due Date is not in the past.


**Prerequisits**
1. Create the Custom Object In Salesforce Setup, navigate to `Object Manager > Create > Custom Object.`
    - Create a custom object named Developer Task with API name `Developer_Task__c`.
    - Add the following fields: `Title__c` (Text, Required)
    - `Description__c` (Text Area)
    - `Due_Date__c` (Date)
    - `Status__c` (Picklist: Not Started, In Progress, Completed)
    - `Resolution__c` (Text Area)
    - Ensure the object is accessible to the intended users (for practice is just for admins).

**Components**
- `LWCs`
    - tmpDeveloperTaskManager
        - create a developer task using `Lightning Data Service`
        - Use the retrieve method to retrieve all Developer Tasks on TmpDeveloperTaskController apex class

- `Apex Classes`
    - TmpDeveloperTaskController
        - retrieve developer task, sort by due date.
            - avalable for the LWCs
    - TmpDeveloperTaskControllerTest
        - test retrieve records
