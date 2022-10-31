import GameObject from "./GameObject";
import {
    ActionManager,
    ExecuteCodeAction,
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
            this.horizontalAxis = -1;
        } else if (this.inputMap["ArrowRight"]) {
            this.horizontalAxis = 1;
        } else {
            this.horizontalAxis = 0;
        }

        if (this.inputMap["ArrowUp"]) {
            this.verticalAxis = 1;
        } else if (this.inputMap["ArrowDown"]) {
            this.verticalAxis = -1;
        } else {
            this.verticalAxis = 0;
        }
    }
}

export default InputController;
