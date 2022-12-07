@IsTest public without sharing class PTCFormControllerTest {
    @IsTest 
    public static void method1() {
        Account ac = new Account(firstname = 'test', lastname = 'testt', accountSource = 'CommunityEvent');
        string accJSON =  JSON.serialize(ac);
        //string accJSON = '{\"AccountSource\" : \'CommunityEvent\'}'; //,\"Status__c\" : \'Keen Lead\', \"Permission_to_contact__c\" : \'true\', \"FirstName\": \'test\',\"LastName\" : \'test2\', \"Phone\" : \'999888777\', \"PersonEmail\" : \'test@t.co\', \"ZipCode__c\" : \'87988\', \"BestDatetimeToCall__c\" : \'testasd\'}
        PTCFormController.createAccount(accJSON );
    }
}