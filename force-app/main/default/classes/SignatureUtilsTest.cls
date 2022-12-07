@IsTest public with sharing class SignatureUtilsTest {
    @IsTest 
    public static void method1() {
        Account ac = new Account(firstname = 'test', lastname = 'testt', accountSource = 'CommunityEvent');
        insert ac;
    	SignatureUtils.saveSignature(ac.Id , 'test', 'SFFile');
        SignatureUtils.saveAttachment(ac.Id , 'test');
        SignatureUtils.saveSFFile(ac.Id, 'test');
    }
}