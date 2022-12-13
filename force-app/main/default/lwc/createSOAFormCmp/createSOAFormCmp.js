import { LightningElement,api } from 'lwc';
import { NavigationMixin } from "lightning/navigation";

import getAccountInfo from '@salesforce/apex/GenerateQuoteController.getKeenMembersData';
import getAgentData from '@salesforce/apex/GenerateQuoteController.getAgentData';
import getPickListValues from '@salesforce/apex/PickListController.getPickListValues';
export default class CreateSOAFormCmp extends NavigationMixin(LightningElement) {
   @api recordId;
   memberInfo;
   agentInfo;
   carrierList;
   stateList;
   fromHomePage = true;

    onGenerateSOA() {
    //  this.getAutoPopulateData();  
     this.fromHomePage  = this.recordId == undefined ? true : false;  
     console.log("---> FROM HOME PAGE" +   this.fromHomePage);
        this.navigatetoForm();
        // this.handleNavigate();
    }
 

    // getAutoPopulateData() {
    //     getAgentData().then(agentData=>{
    //         console.log("agentData: " + JSON.stringify(agentData));
    //         this.agentInfo = agentData;
    //         getPickListValues({objectName: 'Account', selectedField: 'Carrier_list__c'}).then(carrierList=>{
    //             console.log("Carrier_list__c" + JSON.stringify(carrierList) + carrierList);
    //             this.carrierList =  carrierList;
    //             getPickListValues({objectName: 'Account', selectedField: 'StatePicklist__c'}).then(stateList=>{
    //                 this.stateList = stateList;
    //             if(this.recordId != undefined){
    //                 getAccountInfo({ accountId: this.recordId }).then(memberData => {
    //                     let keenMemberAccData = JSON.parse(JSON.stringify(memberData.keenMemberAccountMap));
    //                     for (var key in keenMemberAccData) {
    //                         this.memberInfo = keenMemberAccData[key];
    //                     }
    //                     this.fromHomePage = false;
    //                     console.log("this.memberInfo in Create" + JSON.stringify(this.memberInfo))
    //                     this.navigatetoForm();
    //                 })
    //             }else{
    //                 this.fromHomePage = true;
    //                 this.navigatetoForm();
    //             }
    //         })})
           
    //     })
        
    // }

  

    navigatetoForm(){
        var compDefinition = {
            componentDef: "c:sOAFormCmp",
            attributes: {
                fromHomePage: this.fromHomePage,
                // memberInfo: this.memberInfo,
                // agentInfo: this.agentInfo,
                recordId: this.recordId,
                // carrierList: this.carrierList,
                // stateList: this.stateList
            }
        };
        // Base64 encode the compDefinition JS object
        var encodedCompDef = btoa(JSON.stringify(compDefinition));
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: '/one/one.app#' + encodedCompDef,
                // url : 'https://choosekeen.force.com/soa?formid='+encodedCompDef
           
            }
        }).then(generatedUrl => {
            window.open(generatedUrl, "_blank");
        });

        console.log("navigatetoForm---->")
    }

    handleNavigate() {
        const config = {
            type: 'standard__webPage',
            attributes: {
                url: encodeURI('https://choosekeen--ravked.sandbox.my.site.com/SOAForm?recordId=' + this.recordId)
            },
            state:{
                recordId : this.recordId
            }
            // sbx: https://choosekeen--agrinfo.sandbox.my.site.com/Event/s/eventspage?eventId='+this.eventId+'%3DownerId%3D'+this.userId
            // prod: https://choosekeen.force.com/Event/s/eventspage?eventId='+this.eventId+'%3DownerId%3D'+this.userId
        };
        this[NavigationMixin.Navigate](config);
      }   
        
    }