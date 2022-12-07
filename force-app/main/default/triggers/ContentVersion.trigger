trigger ContentVersion on ContentVersion (before delete, after insert) 
{
    if(trigger.isDelete){
        Profile pf=[Select id,Name from Profile where id=: UserInfo.getProfileId()];
        for(ContentVersion cv : trigger.new){
            If(pf.Name=='KeenAdvisor'){
                cv.addError('You can not delete this record. Please contact your Admin !');
            }
        }   
    }
    if(trigger.isInsert){
        string test101;
        string test118;
        string test117;
        string test116;
        string test115;
        string test114;
        string test1113;
        string test112;
        string test111;
        string test10;
        string test19;
        string test18;
        string test17;
        string test16;
        string test15;
        string test14;
        string test13;
        string test12;
        string test11; 
    }     
}