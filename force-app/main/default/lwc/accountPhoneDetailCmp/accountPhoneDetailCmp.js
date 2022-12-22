import { LightningElement, api, track } from 'lwc';
export default class accountPhoneDetailCmp extends LightningElement {
    @api primaryContactField = "PrimaryContactFieldName__c";
    fields = ['Account.PrimaryContactFieldName__c'];
    @api fieldListPhone = ["PersonAssistantPhone","PersonHomePhone","PersonMobilePhone","PersonOtherPhone"]; 
    @api isModalOpen;
    @api primaryContact;
    @api getIdFromParent;
    @api objectApiName = "Account";
    @api phoneDetail;
    @api readOnly;
    @track isLoading = false;
  
    constructor() {
      super();
      this.showModal = false;
    }
      
    handlePrimaryPhnSelection(event) {
      this.primariContactField = event.target.value;
      const boxes = this.template.querySelectorAll('lightning-input');
      boxes.forEach(box => box.checked = event.target.value === box.name);
    }

    submitPhoneDetail(event) {
      let tempPhone = JSON.parse(JSON.stringify(this.phoneDetail));
      event.preventDefault();       // stop the form from submitting
      const fields = event.detail.fields;
      
      if(this.primariContactField != undefined) {
        if(this.template.querySelector("lightning-input-field[data-my-id="+this.primariContactField+"]").value != null){
          fields['Phone'] = this.template.querySelector("lightning-input-field[data-my-id="+this.primariContactField+"]").value.value;
        } else {
          fields['Phone'] = "";
        }
        fields['PrimaryContactFieldName__c'] = this.primariContactField;
      } else {
        const boxes = this.template.querySelectorAll('lightning-input');
        boxes.forEach(function(box) {
            if(box.checked) {
              tempPhone['PrimaryContactFieldName__c'] = box.name;
            }
        });

        fields['Phone'] = tempPhone['Phone'];
        fields['PrimaryContactFieldName__c'] = tempPhone['PrimaryContactFieldName__c'];
      }

      const selectEvent = new CustomEvent('selection', {
        detail: fields
      });

      // Fire the custom event
      this.dispatchEvent(selectEvent);
      this.dispatchEvent(new CustomEvent('close'));
    }

    handleSuccess(event) {
      this.dispatchEvent(new CustomEvent('close'));
    }

    handleClose(event) {
      this.dispatchEvent(new CustomEvent('close'));
    }

    renderedCallback() {
      if(this.primaryContact == undefined && this.phoneDetail != undefined) {
        this.primaryContact = this.phoneDetail['PrimaryContactFieldName__c'];
      }

      if(!this.readOnly && this.primaryContact != undefined && this.primaryContact != '' ) {
        this.template.querySelector("lightning-input[data-id="+ this.primaryContact +"]").checked = true;
      } else if(this.readOnly) {
        this.template.querySelector("lightning-input[data-id="+this.phoneDetail['PrimaryContactFieldName__c']+"]").checked = true;
      }

      if(this.phoneDetail != undefined) {
        this.template.querySelector("lightning-input-field[data-my-id=PersonAssistantPhone]").value = this.phoneDetail['PersonAssistantPhone'];
        this.template.querySelector("lightning-input-field[data-my-id=PersonHomePhone]").value = this.phoneDetail['PersonHomePhone'];
        
        this.template.querySelector("lightning-input-field[data-my-id=PersonMobilePhone]").value = this.phoneDetail['PersonMobilePhone'];
        this.template.querySelector("lightning-input-field[data-my-id=PersonOtherPhone]").value = this.phoneDetail['PersonOtherPhone'];
      }
    }
}