import { LightningElement,api,track } from 'lwc';
import saveSignature from '@salesforce/apex/SignatureUtils.saveSignature';
let saveType = 'SFFile'; //'SFFile' 'Attachment'
let sCanvas , context; //canvas and it context 2d
let mDown = false;
let currPos = {x:0,y:0};
let prePos = {x:0,y:0};

export default class SignaturePanel extends LightningElement {
    @api recId;
    @api noData = false;
    @track ongoingTouches = [];
    @api id;


    constructor(){
        super();
        //mouse Events
        this.template.addEventListener('mousedown',this.handleMousedown.bind(this));
        this.template.addEventListener('mousemove',this.handleMousemove.bind(this));
        this.template.addEventListener('mouseup',this.handleMouseup.bind(this));
        this.template.addEventListener('mouseout',this.handleMouseend.bind(this));

        this.template.addEventListener("touchstart", function (e) {
            e.preventDefault();
            var touch = e.touches[0];
            
            var mouseEvent = new MouseEvent("mousedown", {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.dispatchEvent(mouseEvent);
            
        }, false);

        this.template.addEventListener("touchend", function (e) {
            var mouseEvent = new MouseEvent("mouseup", {});
            this.dispatchEvent(mouseEvent);
        }, false);

        this.template.addEventListener("touchmove", function (e) {
            e.preventDefault();
            var touch = e.touches[0];
            var mouseEvent = new MouseEvent("mousemove", {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.dispatchEvent(mouseEvent);
        }, false);

    }
  
    renderedCallback(){
        sCanvas = this.template.querySelector('canvas');
        context = sCanvas.getContext('2d'); 
        //this.addEvents();
    }

    @api
    handleSaveSignature(recId){
         
        context.globalCompositeOperation  = "destination-over";
        context.fillStyle  = "#FFF";
        context.fillRect(0,0,sCanvas.width,sCanvas.height);
         
        let imageURL = sCanvas.toDataURL('image/png');
        let imageData = imageURL.replace(/^data:image\/(png|jpg);base64,/, "");

        saveSignature({relatedId:recId,data:imageData,type:saveType})
            .then(result =>{
                this.handleClear();                 
            })
            .catch(error =>{
                
            })
    }

    @api getImageURL(){
        context.globalCompositeOperation  = "destination-over";
        context.fillStyle  = "#FFF";
        context.fillRect(0,0,sCanvas.width,sCanvas.height);
         
        let imageURL = sCanvas.toDataURL('image/png');
        let imageData = imageURL.replace(/^data:image\/(png|jpg);base64,/, "");
        return imageURL;
    }
        
    getPos(evt){
        let cRect = sCanvas.getBoundingClientRect();
        prePos = currPos;
        currPos = {x:(evt.clientX - cRect.left),y:(evt.clientY - cRect.top)};
    }
 
    handleMouseup(evt){
        evt.preventDefault();
        mDown = false;
    }
 
    handleMousemove(evt){
        evt.preventDefault();
        if(mDown){
            this.getPos(evt);
            this.draw();
        }
    }

    handleMousedown(evt){
        evt.preventDefault();
        mDown = true;
        this.getPos(evt);
        
        const selectedEvent = new CustomEvent("progressvaluechange", {
          detail: true
        });
    
        // Dispatches the event.
        this.dispatchEvent(selectedEvent);
    }
 
    handleMouseend(evt){
        evt.preventDefault();
        mDown = false;
    }

    draw(){
        context.beginPath();
        context.moveTo(prePos.x,prePos.y);
        context.lineCap = 'round';//smooth line
        context.lineWidth = 1.6;
        context.strokeStyle = "#0000FF";//blue
        context.lineTo(currPos.x,currPos.y);
        context.closePath();
        context.stroke();
    }
 
    @api
    handleClear(){
        context.clearRect(0,0,sCanvas.width,sCanvas.height);
        const selectedEvent = new CustomEvent("progressvaluechange", {
            detail: false
          });
      
          // Dispatches the event.
          this.dispatchEvent(selectedEvent);
    }
    
}