import { LightningElement, api } from 'lwc';
import { NavigationMixin } from "lightning/navigation";

export default class CreateSOAFormCmp extends NavigationMixin(LightningElement) {
    @api recordId;
    fromHomePage = true;

    connectedCallback() {
        this.fromHomePage = this.recordId == undefined ? true : false;
    }

    onGenerateSOA() {
        this.handleNavigate();
    }

    onGenerateSOASelect(e) {
        const value = e.detail.value;
        value === "newForm" ? this.handleNavigate() : "";
    }

    handleNavigate() {
        var compDefinition = {
          
            attributes: {
                
        
                recordId: this.recordId,
             
            }
        };
        // Base64 encode the compDefinition JS object
        var encodedCompDef = btoa(JSON.stringify(compDefinition));
        // this[NavigationMixin.Navigate]({
        //     type: 'standard__webPage',
        //     attributes: {
        //         url: '/one/one.app#' + encodedCompDef,
        //         // url : 'https://choosekeen.force.com/soa?formid='+encodedCompDef
           
        //     }
        // }).then(generatedUrl => {
        //     window.open(generatedUrl, "_blank");
        // });
        window.open('https://choosekeen--ravked--c.sandbox.vf.force.com/apex/SOAFormPage?recordId='+ this.recordId)

        // this[NavigationMixin.Navigate]({
        //     type: 'standard__webPage',
        //     attributes: {
        //         url: '/apex/SOAFormPage?recordId='+ this.recordId,
        //     }
        // }) 

       
        };


        // const config = {
        //     type: 'standard__webPage',
        //     attributes: {
        //         url: 'https://choosekeen--ravked.sandbox.my.site.com/SOAForm?recordId=' + this.recordId
        //     },
        //     state: {
        //         recordId: this.recordId
        //     }
        //     // sbx: https://choosekeen--agrinfo.sandbox.my.site.com/Event/s/eventspage?eventId='+this.eventId+'%3DownerId%3D'+this.userId
        //     // prod: https://choosekeen.force.com/Event/s/eventspage?eventId='+this.eventId+'%3DownerId%3D'+this.userId
        // };
        // this[NavigationMixin.Navigate](config);
    }
 

 
  