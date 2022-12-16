public with sharing class SOAFormPDFController {
    // public String inputJson = 'hello world';
  
    // public String jsonRes { get;set; }
    // // public Boolean jsonData = true;
  
   
    // public static void sendVFData(String jsonRes){
    //         jsonRes = 'hello world';
            
    //     }

 
//     public Boolean getInputJson(){
//         jsonData = false;
//     return jsonData;
     
// }
    // @AuraEnabled
    //     public static void sendVFData(String inputJson) {
    //         // PageReference pageReference = new PageReference('/apex/SOAPdfGenerate');
    //         PageReference pageReference =  page.SOAPdfGenerate;
    //         pageReference.getParameters().put('jsonRes', inputJson);
      
    //         String pageAsString = pageReference.getContent().toString();
    //     }

   
    // public String jsonRes { get;set; }   

    // public static void sendVFData(String jsonStr){
    //     Map < String, Object > jsonRes = new Map<String, Object>();
    //     jsonRes = ( Map<String, Object>)JSON.deserializeUntyped( jsonStr );

    // }

    public SOAFormPDFController result {get; set;}
    public String firstName {get; set;}
    public String LastName {get; set;}
    public String inputJson ='';
    public static SOAFormPDFController deserialize(String Json){
   // String json = '{"firstName":"Test","LastName":"Lead"}';
    return (SOAFormPDFController) System.JSON.deserialize(json, SOAFormPDFController.class);
}
public void getResult(String json){
    result = SOAFormPDFController.deserialize(json);
    system.debug('Result is: '+ result);
}
@AuraEnabled
public static void getData(String json){
    SOAFormPDFController js = new SOAFormPDFController();
    js.inputJson = json;
    js.getResult(json);
}


    
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