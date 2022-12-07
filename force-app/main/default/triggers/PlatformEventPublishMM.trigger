trigger PlatformEventPublishMM on MemberMedication__c(after insert) {
    
    If(trigger.isAfter){
    
        List<newRelatedListRecordCreated__e> publishEvents = new List<newRelatedListRecordCreated__e>();
       
        for(MemberMedication__c a : Trigger.new){
            newRelatedListRecordCreated__e eve = new newRelatedListRecordCreated__e();
            eve.recordId__c= a.Id;
           
            publishEvents.add(eve);            
        }
        if(publishEvents.size()>0){
            EventBus.publish(publishEvents);
        }
        
    }
    
}