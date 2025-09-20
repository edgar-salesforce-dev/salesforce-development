public class BaseComponentsController {
    @AuraEnabled
    public static List<SObject> getRecords(String objects) {
        switch on objects {
            when 'Accounts' {
                return [SELECT Id, Name, Industry, Phone FROM Account LIMIT 5];
            }
            when 'Contacts' {
                return [SELECT Id, Name, Email, Phone FROM Contact LIMIT 5];
            }
            when 'Opportunities' {
                return [SELECT Id, Name, StageName, Amount FROM Opportunity LIMIT 5];
                
            }
            when else {
                return new List<SObject>();
            }
        }
    }
}