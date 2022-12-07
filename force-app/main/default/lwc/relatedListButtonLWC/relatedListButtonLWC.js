import { LightningElement } from 'lwc';
export default class RelatedListButtonLWC extends LightningElement {
 
        fireEvents() {
        this.dispatchEvent(new CustomEvent('callAura'));
    }
}