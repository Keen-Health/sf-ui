public with sharing class DuplicateAccountCheck {
    
    @AuraEnabled
    public static List<Account> duplicateAccCheck(String firstName, String lastName, Date dob){
        List<Account> accList = [Select Id,FirstName,LastName,DoB__c,status__c,Full_Name__c
                                from Account where (FirstName =: firstName and DoB__c =: dob)
                                or (LastName =: lastName and DoB__c =: dob)];
        system.debug('In dupicate account method:' + accList);
        return accList;
    }
    @AuraEnabled
    public static void updateKeenMemberData(String recordId,String advisorResolution,List<Account> accList){
        Account acc1 = [ select Id,FirstName,
                         LastName,DoB__c,CreatedDate 
                         from Account 
                         where Id =: recordId];
        String oldRecId = '', oldFName = '',oldLName = '', oldDob = '';
        String advisorId = UserInfo.getUserId(); 
        String advisorName = UserInfo.getUserName();
        Account acc = new Account();
        acc.Id = recordId;
        acc.New_record_ID__c = recordId;
        acc.New_record_first_name__c = acc1.FirstName;
        acc.New_record_last_name__c = acc1.LastName;
        acc.New_record_DoB__c = acc1.DoB__c;
        for(Account accountList: accList )
        {
            oldRecId += accountList.Id +'\n';
            oldFName += accountList.FirstName+'\n';
            oldLName += accountList.LastName+'\n';
            oldDob += accountList.DoB__c+'\n';
        }
        acc.Old_record_ID__c = oldRecId;
        acc.Old_record_first_name__c = oldFName;
        acc.Old_record_last_name__c = oldLName;
        acc.Old_record_DoB__c = oldDob;
        acc.Advisor_resolution__c = advisorResolution;
        acc.Advisor_ID__c = advisorId;
        acc.Advisor_name__c = advisorName;
        acc.Trigger_Date__c = system.today();
        update acc;
     } 
}