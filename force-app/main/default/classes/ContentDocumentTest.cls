@isTest
public class ContentDocumentTest{

    public static testMethod void contentDocumentTest(){
        
        /*
        Profile prof=[Select id,Name from Profile where name = 'KeenAdvisor'];
        
        User user = new User();
        user.firstName = 'test1dsa';
        user.lastName = 'test2dasd';
        user.Alias = 'Tcode';
        user.LocaleSidKey = 'en_US';
        user.TimeZoneSidKey = 'GMT';
        user.profileId = prof.id;
        user.LanguageLocaleKey = 'en_US';
        user.EmailEncodingKey = 'UTF-8';
        user.username = 'tesddddt@test.com';
        user.email = 'testddd@test.com';
        insert user;
        
        system.runAs(user){*/
            ContentVersion cv = new ContentVersion();
            cv.Title = 'Test Document';
            cv.PathOnClient = 'TestDocument.pdf';
            cv.VersionData = Blob.valueOf('Test Content');
            cv.IsMajorVersion = true;
            cv.DocumentName__c = 'test';
            cv.Source__c = 'test';
            Insert cv;
            //Get Content Version
            /*List<ContentVersion> cvList = [SELECT Id, Title, ContentDocumentId FROM ContentVersion WHERE Id = :cv.Id];
            System.assertEquals(cvList.size(), 1);
            
            //Get Content Documents
            List<ContentDocument> cdList = [SELECT Id, Title, LatestPublishedVersionId FROM ContentDocument];
            //System.assertEquals(cdList.size(), 1);
            
            Database.delete(cdList,false);
        }*/
    } 
}