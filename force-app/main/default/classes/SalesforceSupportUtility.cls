/**
 * Description: This class is created for Salesforce Support in general.
 */
public class SalesforceSupportUtility {
    /**
     * Retrieve a List of permissions sets assigned to a username
     * @param {uName} string: username's user that you want to know the permission sets assigned
     * @return List<PermissionSet>: permission sets assigend
     */
    public static List<PermissionSet> getPermissionSetsAssigned(String uName) {
        List<PermissionSet> psAssigned = [
            SELECT Id, Name, Label
            FROM PermissionSet
            WHERE Id IN (SELECT PermissionSetId FROM PermissionSetAssignment WHERE Assignee.Username =: uName)
        ];

        return psAssigned;
    }
}