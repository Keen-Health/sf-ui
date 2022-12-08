import { LightningElement,api } from 'lwc';
import { NavigationMixin } from "lightning/navigation";

export default class CreatePTCForm extends NavigationMixin(LightningElement) {
    
    @api eventId;
    @api userId;

    handleEventSelection(event){
        this.eventId = event.detail;
        
    }

    handleUserSelection(event){
        this.userId = event.detail;
        
    }

    handleNavigate() {
        const config = {
            type: 'standard__webPage',
            attributes: {
                url: 'https://choosekeen.force.com/Event/s/eventspage?eventId='+this.eventId+'%3DownerId%3D'+this.userId
            }
            // sbx: https://choosekeen--agrinfo.sandbox.my.site.com/Event/s/eventspage?eventId='+this.eventId+'%3DownerId%3D'+this.userId
            // prod: https://choosekeen.force.com/Event/s/eventspage?eventId='+this.eventId+'%3DownerId%3D'+this.userId
        };
        this[NavigationMixin.Navigate](config);
      }
}