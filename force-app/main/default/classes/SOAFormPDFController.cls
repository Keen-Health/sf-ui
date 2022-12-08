public with sharing class SOAFormPDFController {
    public String inputJson = 'hello world';
  
   public String jsonRes { get;set; }   
  
   
    public static void sendVFData(String jsonRes){
            jsonRes = 'hello world';
            
        }
    // @AuraEnabled
    //     public static void sendVFData(String inputJson) {
    //         // PageReference pageReference = new PageReference('/apex/SOAPdfGenerate');
    //         PageReference pageReference =  page.SOAPdfGenerate;
    //         pageReference.getParameters().put('jsonRes', inputJson);
      
    //         String pageAsString = pageReference.getContent().toString();
    //     }

   
    // public String jsonRes { get;set; }   
    // @AuraEnabled
    // public static void sendVFData(String jsonStr){
    //     Map < String, Object > jsonRes = new Map<String, Object>();
    //     jsonRes = ( Map<String, Object>)JSON.deserializeUntyped( jsonStr );

    // }

    
    @AuraEnabled
    public static void savePDFToSF(String accoundId){
        Account acc = [ SELECT Id,Name,OwnerId 
                        FROM Account 
                        WHERE Id=:accoundId ];
        PageReference pref = page.SOAPdfGenerate;
        pref.getParameters().put('id',acc.Id);
        pref.setRedirect(true);
        Blob bdata = pref.getContent();
        //Create Document
         ContentVersion cv = new ContentVersion();
         cv.ContentLocation = 'S'; 
         cv.Title = 'Scope of Appointment ' +  acc.Name;
         cv.PathOnClient =  acc.Name +'.pdf';
         cv.VersionData = Blob.valueOf('Content of pdf');
         cv.Origin = 'H';
         cv.OwnerId = acc.OwnerId;
         cv.VersionData = bdata;
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