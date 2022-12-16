public with sharing class SOAFormPDFController {
    
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