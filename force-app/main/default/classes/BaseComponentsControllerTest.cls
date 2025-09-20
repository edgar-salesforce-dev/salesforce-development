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
        System.assertEquals(5, accounts.size());
        List<SObject> contacts = BaseComponentsController.getRecords('Contacts');
        System.assertEquals(5, contacts.size());
        List<SObject> opps = BaseComponentsController.getRecords('Opportunities');
        System.assertEquals(5, opps.size());
        List<SObject> othres = BaseComponentsController.getRecords('');
        System.assertEquals(0, othres.size());
    }
}