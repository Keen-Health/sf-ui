import { LightningElement,api,wire,track } from 'lwc';
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';
import MEMBER_PLAN_DETAIL_OBJECT from '@salesforce/schema/MemberPlanDetail__c';
import getMemberPlans from '@salesforce/apex/AccountRelatedListController.getMemberPlans';
import NAME_FIELD from '@salesforce/schema/MemberPlanDetail__c.Name';
import { refreshApex } from '@salesforce/apex';
export default class CreateNewPlanQuick extends LightningElement {
 
    @track  memberPlanColumns = [

    {
        label: 'Name',
        fieldName: 'AccountURL',
        type: 'url',
        typeAttributes: {label: { fieldName: 'memberPlanName' }, target: '_blank'}
    },   
        { label: 'Plan Detail Name', fieldName: 'planDetailListName' },    
        { label: 'Carrier Name', fieldName: 'carrierName' } 
    ];
    @api recordId;
    @api parentAccountId;
    @api objectApiName = MEMBER_PLAN_DETAIL_OBJECT;
    @api fieldList = ["KeenMember__c","PlanDetailList__c","Enrolled_by_Keen__c","Carrier_member_ID__c","HRA_completed__c","HRA_completed_date__c","Effective_date__c","Enrollment_confirmation_number__c","Plan_end_date__c"]; 
    @api showCreatePlan;
    @track showTable = true;
    @track plans;
    @track empty;
   @wire(getMemberPlans, { id: '$parentAccountId' })
     plans;

    handleSuccess(event) {

        refreshApex(this.plans);
        this.dispatchEvent(new CustomEvent('saving'));
        this.showTable = true;

    }

    showForm(event) {

        this.showTable = false;

    }

    handleClose() {
  
        this.dispatchEvent(new CustomEvent('close'));
        this.dispatchEvent(new CustomEvent('saving'));
        
    }
    handlePlanClick(event){
    this.showCreatePlan = true;

    }
    renderedCallback(){
        if(this.plans.data ==  undefined) this.empty = true;
        else if(this.plans.data.length === 0 ) this.empty = true;
        if (this.showTable == false)
        this.template.querySelector('[data-id="KeenMember__c"]').value = this.parentAccountId; 

    }
 
}