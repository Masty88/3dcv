import GameObject from "@/GameControllers/GameObject";
import {Quaternion, SceneLoader, TransformNode, UniversalCamera, Vector3} from "@babylonjs/core";

class PlayerController extends GameObject{
    static PLAYER_SPEED= 0.2;
    static ORIGINAL_TILT = new Vector3(0.5934119456780721, 0, 0);


    constructor(input,player) {
        super();
        this.input = input;
        this.player = player;
        this.setupPlayerCamera()
    }


    updateFromControl(){
        this.deltaTime = this.scene.getEngine().getDeltaTime() / 1000.0;
        this.moveDirection = Vector3.Zero()
        this.v = this.input.verticalAxis;
        this.h = this.input.horizontalAxis;

        //---X AND Z MOVEMENT---//
        let fwd = this.player.target.forward;
        let right= this.player.target.right;
        let correctedVertical = fwd.scaleInPlace(this.v);
        let correctedHorizontal = right.scaleInPlace(this.h);
        //movement based off of camera's view
        let move = correctedHorizontal.addInPlace(correctedVertical);

        this.moveDirection = new Vector3(move.normalize().x, 0, move.normalize().z);

        //clamp the input value so that diagonal movement isn't twice as fast
        let inputMag = Math.abs(this.h) + Math.abs(this.v);
        if (inputMag < 0) {
            this._inputAmt = 0;
        } else if (inputMag > 1) {
            this._inputAmt = 1;
        } else {
            this._inputAmt = inputMag;
        }

        //---ROTATION---//
        //check if there is movement to determine if rotation is needed
        let input = new Vector3(this.input.horizontalAxis, 0, this.input.verticalAxis); //along which axis is the direction
        if (input.length() === 0) {//if there's no input detected, prevent rotation and keep player in same rotation
            return;
        }
        //rotation based on input
        let angle = Math.atan2(this.input.horizontalAxis, this.input.verticalAxis);
        angle += Math.PI;
        this.targ = Quaternion.FromEulerAngles(0, angle, 0);
        this.player.character.rotationQuaternion = Quaternion.Slerp(this.player.character.rotationQuaternion, this.targ, 10 * this.deltaTime);

        this.moveDirection = this.moveDirection.scaleInPlace(this._inputAmt * PlayerController.PLAYER_SPEED);
        this.player.mesh.moveWithCollisions(this.moveDirection.addInPlace(Vector3.Zero().scale(this.deltaTime * 2.8)));
    }

    updateCamera(){
        // console.log(this.camera.rotationQuaternion)
        // this.camera.rotationQuaternion = Quaternion.Slerp(new Quaternion(0,0,0,0), this.targ, 10 * this.deltaTime)
    }

    beforeRenderUpdate(){
        this.updateFromControl();
    }

    activatePlayerCamera(){
        this.beforeLoop= ()=>{
            this.beforeRenderUpdate();
            this.updateCamera();
        }

        return this.camera;
    }

    setupPlayerCamera(){

        this.camera = new UniversalCamera("third_person_camera", Vector3.Zero(), this.scene);
        this.camera.inputs.clear();
        this.camera.minZ = 0;
        this.camera.fov = 0.8;
        this.camera.mouseMin=-35;
        this.camera.mouseMax= 45;
        this.camera.parent = this.player.target;
        this.camera.position =new Vector3(0.7, 1.35, -4);

        this.scene.activeCamera = this.camera;
        return this.camera;
    }
}

export default PlayerController;
