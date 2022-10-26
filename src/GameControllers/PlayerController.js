import GameObject from "@/GameControllers/GameObject";
import {Quaternion, SceneLoader, TransformNode, UniversalCamera, Vector3} from "@babylonjs/core";

class PlayerController extends GameObject{
    static PLAYER_SPEED= 0.2;
    static ORIGINAL_TILT = new Vector3(0.5934119456780721, 0, 0);


    constructor(input,player) {
        super();
        this.input = input;
        this.player = player;
        console.log(this.player)
        this.setupPlayerCamera()
    }


    updateFromControl(){
        this.deltaTime = this.scene.getEngine().getDeltaTime() / 1000.0;
        this.moveDirection = Vector3.Zero(); // vector that holds movement information
        this.h = this.input.horizontal; //x-axis
        this.v = this.input.vertical; //z-axis
        console.log(this.v)

        //Movement based on Camera
        let fwd = this.camRoot.forward;
        let right = this.camRoot.right;
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

        this.moveDirection = this.moveDirection.scaleInPlace(this._inputAmt * PlayerController.PLAYER_SPEED);


        //Rotations
        //check if there is movement to determine if rotation is needed
        let input = new Vector3(this.input.horizontalAxis, 0, this.input.verticalAxis); //along which axis is the direction
        if (input.length() === 0) {//if there's no input detected, prevent rotation and keep player in same rotation
            return;
        }
        //rotation based on input & the camera angle
        let angle = Math.atan2(this.input.horizontalAxis, this.input.verticalAxis);
        angle += this.camRoot.rotation.y;
        this.targ = Quaternion.FromEulerAngles(0, angle, 0);
        this.player.mesh.rotationQuaternion = Quaternion.Slerp(this.player.mesh.rotationQuaternion, this.targ, 10 * this.deltaTime);
        this.player.mesh.moveWithCollisions(this.moveDirection.addInPlace(Vector3.Zero().scale(this.deltaTime * 2.8)));
    }

    updateCamera(){

        let centerPlayer= this.player.mesh.position.y +2;
        this.camRoot.position = Vector3.Lerp(this.camRoot.position, new Vector3(this.player.mesh.position.x, centerPlayer, this.player.mesh.position.z), 0.4);
        // // if(this.input.horizontal>0 || this.input.horizontal>0){
        //     this.camRoot.rotationQuaternion= Quaternion.Slerp(this.player.mesh.rotationQuaternion, this.targ, 10 * this.deltaTime)
        // // }

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
        this.camRoot= new TransformNode("cameraRoot");
        this.camRoot.position= Vector3.Zero();
        this.camRoot.rotation = new Vector3(0,Math.PI,0);

        //rotations along the x-axis (up/down tilting)
        let yTilt= new TransformNode("yTilt")
        yTilt.rotation= PlayerController.ORIGINAL_TILT;
        this.yTilt= yTilt;
        yTilt.parent= this.camRoot;

        //our actual camera that's pointing at our root's position
        this.camera = new UniversalCamera("cam", new Vector3(0, 0, -30), this.scene);
        this.camera.lockedTarget = this.camRoot.position;
        this.camera.fov = 0.47350045992678597;
        this.camera.parent = yTilt;

        this.scene.activeCamera = this.camera;
        return this.camera;
    }
}

export default PlayerController;
