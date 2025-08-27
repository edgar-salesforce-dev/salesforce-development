public with sharing class AccountService {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getRelatedContacts(String accountId, String fields){
        List<Contact> contacts = new List<Contact>();
        try {
            String query = 'SELECT Id, ' + fields + ' FROM Contact WHERE AccountId = : accountId LIMIT 6';

            contacts = (List<Contact>) Database.query(query);

            if(contacts.isEmpty()){
                throw new AccountServiceException('Contacts Not Found');
            } else {
                return contacts;
            }
        } catch(Exception ex) {
            throw new AuraHandledException(ex.getMessage());
        }
    }

    public class AccountServiceException extends Exception {}
}