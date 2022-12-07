trigger PlatformEventPublish on MemberPlanDetail__c(after insert, after delete) {
    
    If(trigger.isAfter){
    
        List<newRelatedListRecordCreated__e> publishEvents = new List<newRelatedListRecordCreated__e>();
        if(trigger.isInsert){
            for(MemberPlanDetail__c a : Trigger.new){
                newRelatedListRecordCreated__e eve = new newRelatedListRecordCreated__e();
                eve.recordId__c= a.Id;
               
                publishEvents.add(eve);            
            }
        }
        
        if(trigger.isDelete){
            for(MemberPlanDetail__c a : Trigger.old){
                newRelatedListRecordCreated__e eve = new newRelatedListRecordCreated__e();
                //eve.recordId__c= a.Id;
               
                publishEvents.add(eve);            
            }
        }
        
        if(publishEvents.size()>0){
            EventBus.publish(publishEvents);
        }        
    }
    
}