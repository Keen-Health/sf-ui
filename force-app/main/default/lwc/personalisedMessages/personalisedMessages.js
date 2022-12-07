import { api, LightningElement, track } from "lwc";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class PersonalisedMessages extends LightningElement {
  @api fieldList = [ "Birthday_Message__c","Anniversary_Message__c"];
  @api recordId;
  @api objectApiName = "Account";
  @track showEditField = false;

  handleEdit() {
    this.showEditField = true;
  }

  handleSubmit(event) {
    
  }
  handleSuccess(event) {
    this.showEditField = false;
    const evt = new ShowToastEvent({
        title : 'Success!',
        message : 'The Changes have been successfully saved.',
        variant: 'success',
        mode: 'dismissable'
    });
    this.dispatchEvent(evt);
    
  }




handleError() {
    const evt = new ShowToastEvent({
        title : 'Error!',
        message : 'An error occurred while attempting to save the changes.',
        variant: 'error',
        mode: 'dismissable'
    });
    this.dispatchEvent(evt);
}

onClickCancel(){
    this.showEditField = false;
}
}