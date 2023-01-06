public with sharing class SOAFormListController {
    @AuraEnabled
    public static List<SOAForm__c> fetchSoaRecordList(String accountId){
        List<SOAForm__c> soaFormData = new List<SOAForm__c>();
        List<Account> acc = [SELECT Id,(SELECT Id, Completed_Date__c, Signatures_Status__c, CreatedDate  FROM SOAForm__r ORDER BY CreatedDate  ASC) 
                             FROM Account WHERE Id=: accountId];
        for(Account ac:acc){
           for(SOAForm__c soaFormRec: ac.SOAForm__r){
                soaFormData.add(soaFormRec);
            }
        }
        return soaFormData;
    }
}
