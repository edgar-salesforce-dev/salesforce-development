@IsTest
public with sharing class AccountServiceTest {
    @IsTest
    static void getRelatedContacts(){
        List<Account> testAccounts = TestDataFactory.createAccounts(2);
        TestDataFactory.createContacts(testAccounts, 10);

        String fields = 'FirstName,LastName,Email,Phone';
        Test.startTest();
        List<Contact> contacts = AccountService.getRelatedContacts(testAccounts[0].Id, fields);
        Test.stopTest();

        Assert.areEqual(6, contacts.size());
        Assert.areEqual('test0@test.com', contacts[0].Email);
    }
    @IsTest
    static void getRelatedContactsEmpty(){
        List<Account> testAccounts = TestDataFactory.createAccounts(2);

        String fields = 'FirstName,LastName,Email,Phone';
        Test.startTest();
        try {
            List<Contact> contacts = AccountService.getRelatedContacts(testAccounts[0].Id, fields);
            Test.stopTest();
        } catch(Exception ex){
            Assert.isNotNull(ex.getMessage());
        }
    }
}