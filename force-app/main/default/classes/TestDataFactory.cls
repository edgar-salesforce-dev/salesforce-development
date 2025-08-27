public with sharing class TestDataFactory {
    public static List<Account> createAccounts(Integer n){
        List<Account> accs = new List<Account>();
        for(Integer i = 0; i < n; i++){
            Account acc = new Account();
            acc.Name = 'Test Account' + i;
            accs.add(acc);
        }
        insert accs;
        return accs;
    }
    public static List<Contact> createContacts(List<Account> accs, Integer n){
        List<Contact> contacts = new List<Contact>();
        for(Account acc : accs) {
            for(Integer i = 0; i < n; i++){
                Contact ctc = new Contact();
                ctc.FirstName = 'Test' + i;
                ctc.LastName = 'Test' + i;
                ctc.Email = 'test' + i + '@test.com';
                ctc.Phone = '(123) 314-1234';
                ctc.AccountId = acc.Id;

                contacts.add(ctc);
            }
        }
        
        insert contacts;
        return contacts;
    }
}