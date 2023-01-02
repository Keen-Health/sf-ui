public with sharing class SOAFormPDFController {
    public static String ID = '';

    //  system.debug('>>>>>>> ID is: '+ ID);
    
    public List<soaWrapper> soaFormList = new List<soaWrapper>();
    List<SOAForm__c> soaFormDataList = new List<SOAForm__c>();
    // public static String ID = '';
    public List<soaWrapper> getSoaData(){
        system.debug('>>>>>>> ID is: '+ ID);
        soaFormDataList = [SELECT ID,Beneficiary_first_name__c,
                                   Beneficiary_last_name__c
                                   FROM SOAForm__c WHERE Id='a0s8B00000010QiQAI'];
        soaFormList.add(new soaWrapper(soaFormDataList[0].Beneficiary_first_name__c,soaFormDataList[0].Beneficiary_last_name__c)); 
        return soaFormList;  
    }      
    public class soaWrapper{
       public String beneficiaryFirstName {get; set;}
       public String beneficiaryLastName {get; set;}
       public soaWrapper(String beneficiaryFirstName, String beneficiaryLastName){
            this.beneficiaryFirstName = beneficiaryFirstName;
            this.beneficiaryLastName = beneficiaryLastName;
        }
    }

    @AuraEnabled
    public static void fetchSOAForminputData(String soaRecordId){
        ID = soaRecordId;
        SOAForm__c soaFormData = [SELECT ID,Beneficiary_first_name__c, Beneficiary_last_name__c FROM SOAForm__c WHERE Id=: soaRecordId];
    //    beneficiaryFirstName = soaFormData.Beneficiary_first_name__c;
    }

    
   
}