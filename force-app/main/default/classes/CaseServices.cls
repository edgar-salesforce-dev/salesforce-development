public with sharing class CaseServices {
    @AuraEnabled(cacheable=true)
    public static List<Case> getNotClosedCases(){
        List<Case> cases;
        try {
            cases = [
                SELECT Id, CaseNumber, Status, Type, CreatedDate, ClosedDate, 
                    AccountId, Account.Name, 
                    ContactId, Contact.Name,
                    Priority, Origin, Reason, Product__c
                FROM Case
                WHERE Status != 'Closed'
            ];
            if(cases.isEmpty()){
                throw new CaseServicesException('Cases Not Found');
            } else {
                return cases;
            }
        } catch(CaseServicesException ex){
            return cases;
        }
    }

    class CaseServicesException extends Exception {}
}