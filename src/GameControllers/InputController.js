import GameObject from "./GameObject";
import {
    ActionManager,
    ExecuteCodeAction, PointerEventTypes,
    Scalar,
} from "@babylonjs/core";

class InputController extends GameObject{

    constructor() {
        super();
        this.scene.actionManager= new ActionManager(this.scene);
        this.inputMap={};
        this.scene.actionManager.registerAction(
            new ExecuteCodeAction(ActionManager.OnKeyDownTrigger,(event)=>{
                this.inputMap[event.sourceEvent.key]= event.sourceEvent.type == "keydown";
            }));
        this.scene.actionManager.registerAction(
            new ExecuteCodeAction(ActionManager.OnKeyUpTrigger,(event)=>{
                this.inputMap[event.sourceEvent.key]=event.sourceEvent.type == "keydown";
            }));
        this.scene.onBeforeRenderObservable.add(()=>{
            this.updateFromKeyboard();
        })
    }


    updateFromKeyboard(){
        if (this.inputMap["ArrowLeft"]) {
            //this.horizontal = Scalar.Lerp(this.horizontal, -1, 0.2);
            this.horizontal = -1;

        } else if (this.inputMap["ArrowRight"]) {
            //this.horizontal = Scalar.Lerp(this.horizontal, 1, 0.2);
            this.horizontal = 1;
        } else {
            this.horizontalAxis = 0;
            this.horizontal = 0;
        }

        if (this.inputMap["ArrowUp"]) {
            // this.vertical = Scalar.Lerp(this.vertical, 1, 0.2);
            this.vertical = 1;
        } else if (this.inputMap["ArrowDown"]) {
            //this.vertical = Scalar.Lerp(this.vertical, -1, 0.2);
            this.vertical = -1;
        } else {
            this.verticalAxis = 0;
            this.vertical = 0;
        }

        //Jump Checks (SPACE)
        if (this.inputMap[" "]) {
            this.jumpKeyDown = true;
            console.log("jump")
        } else {
            this.jumpKeyDown = false;
        }
    }
}

export default InputController;
