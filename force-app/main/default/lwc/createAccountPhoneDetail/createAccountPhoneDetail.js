import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
export default class createAccountPhoneDetailCmp extends LightningElement {
    @api primaryContactField = "PrimaryContactFieldName__c";
    fields = ['Account.PrimaryContactFieldName__c'];
    @api fieldListPhone = ["PersonAssistantPhone","PersonHomePhone","PersonMobilePhone","PersonOtherPhone"]; 
    @api isModalOpen;
    @api primaryContact;
    @api getIdFromParent;
    @api objectApiName = "Account";
    @api phoneDetail;
    @api readOnly;

    constructor() {
        super();
        this.showModal = false;
        console.log('getIdFromParent==>' + this.getIdFromParent);
        
      
    }
      
    handlePrimaryPhnSelection(event){

        console.log('===>');
        this.primariContactField = event.target.value;
        const boxes = this.template.querySelectorAll('lightning-input');

        boxes.forEach(box => box.checked = event.target.value === box.name);

        }
      submitPhoneDetail(event) {

         let tempPhone ;
        //= JSON.parse(JSON.stringify(this.phoneDetail));
          console.log('----->' + this.primariContactField);
            event.preventDefault();       // stop the form from submitting
            const fields = event.detail.fields;
            
            if(this.primariContactField != undefined){
             
            fields['Phone'] = this.template.querySelector("lightning-input-field[data-my-id="+this.primariContactField+"]").value;
            fields['PrimaryContactFieldName__c'] = this.primariContactField;
            }
            else{

            const boxes = this.template.querySelectorAll('lightning-input');
            boxes.forEach(function(box){
                if(box.checked){
                  tempPhone = box.name;
                }
            });

            fields['Phone'] = fields[tempPhone];
           // tempPhone['PrimaryContactFieldName__c'] = tempPhone['PrimaryContactFieldName__c'] == null ? 'PersonHomePhone' : tempPhone['PrimaryContactFieldName__c'];
            fields['PrimaryContactFieldName__c'] = tempPhone;
            
            }

            const selectEvent = new CustomEvent('selection', {
              detail: fields
          });
          // Fire the custom event
          this.dispatchEvent(selectEvent);
          this.dispatchEvent(new CustomEvent('close'));
          //  this.template.querySelector('lightning-record-edit-form').submit(fields);
            
        }

        handleSuccess(event) {
   
    
            this.dispatchEvent(new CustomEvent('close'));

        }

        handleClose() {
            this.dispatchEvent(new CustomEvent('close'));
        }

        renderedCallback(){

          if(this.phoneDetail != undefined) {
          //console.log('rendered==>' + this.template.querySelectorAll('input["radio"]'));
          if(this.primaryContact == undefined && this.phoneDetail['PrimaryContactFieldName__c'] != null){
            this.primaryContact = this.phoneDetail['PrimaryContactFieldName__c'];
            
        
        }

        
            if(this.primaryContact != undefined && this.primaryContact != ''){
            this.template.querySelector("lightning-input[data-id="+ this.primaryContact +"]").checked = true;
          }
          if(this.phoneDetail != undefined){
            this.template.querySelector("lightning-input-field[data-my-id=PersonAssistantPhone]").value = this.phoneDetail['PersonAssistantPhone'];
            this.template.querySelector("lightning-input-field[data-my-id=PersonHomePhone]").value = this.phoneDetail['PersonHomePhone'];
           
            this.template.querySelector("lightning-input-field[data-my-id=PersonMobilePhone]").value = this.phoneDetail['PersonMobilePhone'];
            this.template.querySelector("lightning-input-field[data-my-id=PersonOtherPhone]").value = this.phoneDetail['PersonOtherPhone'];
            //this.template.querySelector("lightning-input-field[data-my-id=Phone]").value = this.phoneDetail['Phone'];
           // this.template.querySelector("lightning-input-field[data-my-id="+this.phoneDetail['PrimaryContactFieldName__c']+"]").value= this.phoneDetail['PrimaryContactFieldName__c'];
        }
          
        
         
         // debugger;
         console.log('getIdFromParent==>' + this.primaryContact);
      }
        }
}