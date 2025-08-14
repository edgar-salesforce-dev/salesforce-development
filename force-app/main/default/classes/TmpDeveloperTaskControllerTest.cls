@IsTest
public with sharing class TmpDeveloperTaskControllerTest {
    @IsTest
    static void retrieveAllTasksTest(){
        List<Developer_Task__c> tasks = new List<Developer_Task__c>();
        for(Integer i = 0; i < 30; i++){
            Developer_Task__c dt = new Developer_Task__c();
            dt.Title__c = 'TMP Test ' + i;
            dt.Description__c = 'Test Description ' + i;
            dt.Due_Date__c = Date.today().addDays(i);
            dt.Status__c = 'Not Started';

            tasks.add(dt);
        }
        insert tasks;

        Test.startTest();
        List<Developer_Task__c> records = TmpDeveloperTaskController.retrieveAllDeveloperTask();
        Test.stopTest();

        Assert.isNotNull(records);
        Assert.areEqual(30, records.size());
    }
}