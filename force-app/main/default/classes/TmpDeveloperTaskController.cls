public with sharing class TmpDeveloperTaskController {
    @AuraEnabled(cacheable=true)
    public static List<Developer_Task__c> retrieveAllDeveloperTask(){
        List<Developer_Task__c> devTasks = [SELECT Id, Name, Title__c, Description__c, Due_Date__c, Status__c, Resolution__c, Owner__c, Owner__r.Name FROM Developer_Task__c ORDER BY Due_Date__c DESC];

        return devTasks;
    }
}