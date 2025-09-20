@IsTest
public class BaseComponentsControllerTest {
    @TestSetup
    static void makeData(){
        List<Account> accs = TestDataFactory.createAccounts(10);
        TestDataFactory.createContacts(accs, 5);

        List<Opportunity> opps = new List<Opportunity>();
        for(Account acc : accs){
            Opportunity o = new Opportunity();
            o.Name = 'Opportunity for ' + acc.Name;
            o.AccountId = acc.Id;
            o.StageName = 'Prospecting';
            o.CloseDate = Date.today().addDays(30);
            o.Amount = 2000;

            opps.add(o);
        }
        insert opps;
    }

    @IsTest
    static void testGetRecords(){
        List<SObject> accounts = BaseComponentsController.getRecords('Accounts');
        List<SObject> contacts = BaseComponentsController.getRecords('Contacts');
        List<SObject> opps = BaseComponentsController.getRecords('Opportunities');
        List<SObject> others = BaseComponentsController.getRecords('');

        Assert.areEqual(5, accounts.size());
        Assert.areEqual(5, contacts.size());
        Assert.areEqual(5, opps.size());
        Assert.areEqual(0, others.size());
    }
}