import {LightningElement,api,wire,track} from 'lwc';
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';
//import MEMBER_PLAN_DETAIL_OBJECT from '@salesforce/schema/MemberPlanDetail__c';
import NAME_FIELD from '@salesforce/schema/MemberPlanDetail__c.Name';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { NavigationMixin } from 'lightning/navigation';
import { encodeDefaultFieldValues } from 'lightning/pageReferenceUtils';
import { subscribe, unsubscribe, onError, setDebugFlag, isEmpEnabled } from 'lightning/empApi';
export default class customRelatedListCmp extends NavigationMixin(LightningElement) {

    @api tableColumns;
    @api tableData;
    @api fieldList;
    @api objectApiName;
    @api titleName;
    @api formName;
    @api recordId;
    @api parentAccountId;
    @api showCreatePlan;
    @track showTable = true;
    @track plans;
    @track empty;
    
    subscription = {};
    @api channelNamePlans = '/event/newRelatedListRecordCreated__e';

    connectedCallback(){
        console.log('====>' + this.tableColumns);
        console.log('====>' + this.tableData);

        this.registerErrorListener();
        this.handleSubscribe();
       
    }

    handleSubscribe() {
        // Callback invoked whenever a new event message is received
        const thisReference = this;
        const messageCallback = function(response) {
            console.log('New message received 1: ', JSON.stringify(response));
            console.log('New message received 2: ', response);
            
            var obj = JSON.parse(JSON.stringify(response));
            console.log('New message received 4: ', obj.data.payload.recordId__c);
            console.log('New message received 5: ', this.channelNamePlans);

           thisReference.dispatchEvent(new CustomEvent('saving', { detail :  null}));
           

            // Response contains the payload of the new message received
        };

        // Invoke subscribe method of empApi. Pass reference to messageCallback
        subscribe(this.channelNamePlans, -1, messageCallback).then(response => {
            // Response contains the subscription information on subscribe call
            console.log('Subscription request sent to: ', JSON.stringify(response.channel));
            this.subscription = response;
        });
    }

    /* In case you want to unsubscribe use this
    // Handles unsubscribe button click
    handleUnsubscribe() {

        // Invoke unsubscribe method of empApi
        unsubscribe(this.subscription, response => {
            console.log('unsubscribe() response: ', JSON.stringify(response));
            // Response is true for successful unsubscribe
        });
    }
    */
   
    registerErrorListener() {
        // Invoke onError empApi method
        onError(error => {
            console.log('Received error from server: ', JSON.stringify(error));
            // Error contains the server-side error
        });
    }

    handleSuccess(event) {
 
        this.dispatchEvent(new CustomEvent('saving', { detail : event.detail.id }));
       
        this.showTable = true;
        const evt = new ShowToastEvent({
            title: 'Success',
            message: 'The record has been created',
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);

    }

    showForm(event) {
    //this.dispatchEvent(new CustomEvent('close'));
    this.handleNavigation();

    }

    
    handleNavigation() {
    
        //4. Object will be having filenames and values 
    const defaultValues = encodeDefaultFieldValues({
        KeenMember__c: this.parentAccountId,
        Account__c: this.parentAccountId,
        Keen_member__c: this.parentAccountId,
        Keen_leads_and_members__c: this.parentAccountId
        
    });

    console.log(defaultValues);
            
            //5. Invoke navigate by passing the config object
    this[NavigationMixin.Navigate]({
        type: 'standard__objectPage',
        attributes: {
            objectApiName: this.objectApiName,
            actionName: 'new'
        },
        state: {
            defaultFieldValues: defaultValues,
            navigationLocation: 'RELATED_LIST'
        }
    });
}

    handleClose() {

        this.dispatchEvent(new CustomEvent('close'));
        this.dispatchEvent(new CustomEvent('saving'));
     

    }
    handlePlanClick(event) {
        this.showCreatePlan = true;

    }
    renderedCallback() {

        refreshApex(this.tableData);
        if (this.tableData.data == undefined) this.empty = true;
        else if (this.tableData.data.length === 0) this.empty = true;
        if (this.showTable == false)
        if(this.template.querySelector('[data-id="KeenMember__c"]') !=  null){
            this.template.querySelector('[data-id="KeenMember__c"]').value = this.parentAccountId;
        }
            if(this.template.querySelector('[data-id="Keen_member__c"]') !=  null){
                this.template.querySelector('[data-id="Keen_member__c"]').value = this.parentAccountId;
            }
            if(this.template.querySelector('[data-id="Account__c"]') !=  null){
                this.template.querySelector('[data-id="Account__c"]').value = this.parentAccountId;
            }
            if(this.template.querySelector('[data-id="Keen_leads_and_members__c"]') !=  null){
                this.template.querySelector('[data-id="Keen_leads_and_members__c"]').value = this.parentAccountId;
            }

            
    }

}