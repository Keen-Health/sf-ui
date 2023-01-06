import { LightningElement, api } from 'lwc';
import { NavigationMixin } from "lightning/navigation";
import fetchSoaRecordList from '@salesforce/apex/SOAFormListController.fetchSoaRecordList'

export default class CreateSOAFormCmp extends NavigationMixin(LightningElement) {
    @api recordId;

    fromHomePage = true;
    lastFormId = "";
    recordListData = [];
    recordListColumn = [
        // {
        //     label: 'Name', fieldName: 'nameUrl', type: 'url',
        //     typeAttributes: { label: { fieldName: 'Full_Name__c' }, target: '_blank' }
        // },

        {
            label: 'Created Date', fieldName: 'CreatedDate', type: 'date',
            typeAttributes: {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
            }
        },
        { label: 'Created By', fieldName: 'Name' },
        { label: 'Signature Status', fieldName: 'Signatures_Status__c', type: 'text' },
        {
            label: 'Completed Date', fieldName: 'Completed_Date__c', type: 'date',
            typeAttributes: {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
            }
        },
        { label: 'File', fieldName: '', type: 'text' },

    ];

    connectedCallback() {
        this.fromHomePage = this.recordId == undefined ? true : false;
        console.log("recordId--->" + this.recordId);
        fetchSoaRecordList({ accountId: this.recordId }).then((listData) => {
            // this.lastFormId = listData[-1].Id;

            const tableData = JSON.parse(JSON.stringify(listData));
            tableData.forEach(item => {
                if(item.Completed_Date__c == "1900-01-01T00:00:00.000Z"){
                    item["Completed_Date__c"] = "";
                }
                console.log(item.Completed_Date__c);
            })
            this.recordListTable(tableData);
            console.log("--->ListOfSOA Records Success::" + JSON.stringify(listData));
            // console.log("LastID --->" + listData[-1]);
        }).catch((error) => {
            console.log("--->ListOfSOA Records Error::" + JSON.stringify(error));
        });
    }

    recordListTable(tableData) {
        
        tableData.forEach(item => {
            // item['nameUrl'] = '/lightning/r/Account/' + item['Id'] + '/view';
            this.recordListData = tableData;
        });
    }

    onGenerateSOA() {
        this.openNewForm();
    }

    onGenerateSOASelect(e) {
        const value = e.detail.value;
        value === "newForm" ? this.openNewForm() : this.openLastForm();
    }

    openLastForm() {
        window.open('https://choosekeen--ravked--c.sandbox.vf.force.com/apex/SOAFormPage?recordId=' + this.recordId + '&soaId=' + this.lastFormId);
    }

    openNewForm() {
        var compDefinition = {

            attributes: {


                recordId: this.recordId,

            }
        };
        // Base64 encode the compDefinition JS object
        var encodedCompDef = btoa(JSON.stringify(compDefinition));

        window.open('https://choosekeen--ravked--c.sandbox.vf.force.com/apex/SOAFormPage?recordId=' + this.recordId)

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