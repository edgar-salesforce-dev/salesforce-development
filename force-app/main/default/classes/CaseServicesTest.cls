@IsTest
public with sharing class CaseServicesTest {
    @IsTest
    static void getNotClosedCases(){
        List<Account> accs = TestDataFactory.createAccounts(1);
        List<Contact> contacts = TestDataFactory.createContacts(accs, 2);
        TestDataFactory.createCases(contacts, 6);
        Test.startTest();
        List<Case> cases = CaseServices.getNotClosedCases();
        Test.stopTest();

        Assert.areEqual(6, cases.size());
    }

    @IsTest
    static void getNotClosedCasesFail(){
        Test.startTest();
        List<Case> cases = CaseServices.getNotClosedCases();
        Test.stopTest();

        Assert.areEqual(0, cases.size());
    }
}