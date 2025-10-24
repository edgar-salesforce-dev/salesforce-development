/**
 * Description: This class is created for Salesforce Support in general.
 */
public class SalesforceSupportUtility {
    /**
     * Retrieve a List of permissions sets assigned to a username
     * @param {uName} string: username's user that you want to know the permission sets assigned
     * @return List<PermissionSet>: permission sets assigend
     */
    public static PermissionSetsWrapper getPermissionSetsAssigned(String uName) {
        PermissionSetsWrapper result = new PermissionSetsWrapper();
        try {
            List<PermissionSet> psAssigned = [
                SELECT Id, Name, Label
                FROM PermissionSet
                WHERE Id IN (SELECT PermissionSetId FROM PermissionSetAssignment WHERE Assignee.Username =: uName)
            ];

            if (!psAssigned.isEmpty()) {
                result.status = 'Success';
                result.data = psAssigned;
            } else {
                throw new CustomException('Permission Sets have not been assigned to ' + uName);
            }
        } catch (Exception ex) {
            Error error = new Error(ex.getMessage());
            result.status = 'Error';
            result.error = error;
        }        

        return result;
    }
    /**
     * Retrieve a List of permissions sets that grants access to an apex class
     * @param {classname} string: username's user that you want to know the permission sets assigned
     * @return List<PermissionSet>: list of permission sets
     */
    public static PermissionSetsWrapper getPermissionSetsForApexClass(String classname) {
        PermissionSetsWrapper result = new PermissionSetsWrapper();
        try {
            ApexClass apexClassRecord = [SELECT Id FROM ApexClass WHERE Name = :classname LIMIT 1];

            List<SetupEntityAccess> setupEntities = [
                SELECT ParentId
                FROM SetupEntityAccess
                WHERE SetupEntityType = 'ApexClass'
                AND SetupEntityId = :apexClassRecord.Id
            ];

            Set<Id> permSetIds = new Set<Id>();
            for (SetupEntityAccess sea : setupEntities) {
                permSetIds.add(sea.ParentId);
            }

            List<PermissionSet> permissionSets = [
                SELECT Name
                FROM PermissionSet
                WHERE Id IN :permSetIds
            ];

            if (!permissionSets.isEmpty()) {
                result.status = 'Success';
                result.data = permissionSets;
            } else {
                throw new CustomException('There are no PS that grants access to ' + classname + ' Class');
            }
        } catch (Exception ex) {
            Error e = new Error(ex.getMessage());
            result.status = 'Error';
            result.error = e;
        }

        return result;
    }
    /**
     * @description: Use when you need a list of permission sets
     */
    public class PermissionSetsWrapper {
        public List<PermissionSet> data;
        public String status;
        public Error error;
    }
    /**
     * @description: Error wrapper that, for now, includes the message.
     */
    public class Error {
        public String message;
        
        public Error(String message) {
            this.message = message;
        }
    }
    /**
     * @description: Custom Exception to manage errors.
     */
    public class CustomException extends Exception {}
}