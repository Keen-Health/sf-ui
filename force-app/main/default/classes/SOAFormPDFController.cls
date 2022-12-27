public with sharing class SOAFormPDFController {



    
    public List<soaWrapper> soaFormList = new List<soaWrapper>();
    List<SOAForm__c> soaFormDataList = new List<SOAForm__c>();
    public static String ID = '';
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
    public static void savePDFToSF(String accoundId){
        Account acc = [ SELECT Id,Name,OwnerId 
                        FROM Account 
                        WHERE Id=:accoundId ];
        PageReference pref = page.SOAPdfGenerate;
        pref.getParameters().put('id',acc.Id);
        pref.setRedirect(true);
        // Blob bdata;
        // if(!test.isRunningTest()){
        //     bdata = pref.getContent();
        // }else{
        //     bdata=blob.valueOf('TestString');
        // }
        Blob bdata;
        try {
            bdata = pref.getContent();
        }  
        //Create Document
         ContentVersion cv = new ContentVersion();
         cv.ContentLocation = 'S'; 
         cv.Title = 'Scope of Appointment for ' +  acc.Name + ' generated on ' + system.now();
         cv.PathOnClient =  acc.Name +'.pdf';
         cv.VersionData = Blob.valueOf('Content of pdf');
         cv.Origin = 'H';
         cv.OwnerId = acc.OwnerId;
         cv.VersionData = bdata;
         cv.DocumentName__c = 'Scope of Appointment';
         cv.Source__c = 'Other';
         cv.IsMajorVersion = true;
         insert cv;
         //Get Content Document Id
         Id conDocId = [SELECT ContentDocumentId FROM ContentVersion WHERE Id =:cv.Id].ContentDocumentId;
         //Create ContentDocumentLink 
         ContentDocumentLink cdl = New ContentDocumentLink();
         cdl.LinkedEntityId = acc.Id;
         cdl.ContentDocumentId = conDocId;
         cdl.shareType = 'V';
         cdl.Visibility = 'AllUsers';
         insert cdl;
     }
     
}