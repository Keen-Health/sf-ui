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
        console.log("eventValue" + e.detail.value)
        const value = e.detail.value;
        value === "freshQuote" ? this.handleNavigate() : "";
    }

    handleNavigate() {
        const config = {
            type: 'standard__webPage',
            attributes: {
                url: 'https://choosekeen--ravked.sandbox.my.site.com/SOAForm?recordId=' + this.recordId
            },
            state: {
                recordId: this.recordId
            }
            // sbx: https://choosekeen--agrinfo.sandbox.my.site.com/Event/s/eventspage?eventId='+this.eventId+'%3DownerId%3D'+this.userId
            // prod: https://choosekeen.force.com/Event/s/eventspage?eventId='+this.eventId+'%3DownerId%3D'+this.userId
        };
        this[NavigationMixin.Navigate](config);
    }

}

