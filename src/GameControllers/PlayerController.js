import GameObject from "@/GameControllers/GameObject";
import {
    ArcRotateCamera, FollowCamera,
    Quaternion,
    SceneLoader,
    Tools,
    TransformNode,
    UniversalCamera,
    Vector3
} from "@babylonjs/core";

class PlayerController extends GameObject{
    static PLAYER_SPEED= 0.2;
    static CAMERA_SPEED = 10 ;

    constructor(input,player) {
        super();
        this.input = input;
        this.player = player;
        this.setupPlayerCamera()
    }


    updateFromControl(){
        this.player.mesh.frontVector = new Vector3(0,0,1)
        this.horizontal = this.input.horizontalAxis;
        this.vertical = this.input.verticalAxis;
        //right
        if(this.horizontal > 0){
            this.player.mesh.rotation.y += .1;
            this.player.mesh.frontVector = new Vector3(Math.sin(this.player.mesh.rotation.y),0,Math.cos(this.player.mesh.rotation.y));
            this.camera.rotationOffset = 180;
        }
        // //left
        if(this.horizontal < 0){
            this.player.mesh.rotation.y -= .1;
            this.player.mesh.frontVector = new Vector3(Math.sin(this.player.mesh.rotation.y),0,Math.cos(this.player.mesh.rotation.y));
            this.camera.rotationOffset = 180;
        }
        //up
        if(this.vertical > 0){
            this.player.mesh.frontVector = new Vector3(Math.sin(this.player.mesh.rotation.y),0,Math.cos(this.player.mesh.rotation.y));
            this.player.mesh.moveWithCollisions(this.player.mesh.frontVector.multiplyByFloats(PlayerController.PLAYER_SPEED,PlayerController.PLAYER_SPEED,PlayerController.PLAYER_SPEED));
        }
        // //down
        if(this.vertical < 0){
            this.player.mesh.frontVector = new Vector3(Math.sin(this.player.mesh.rotation.y),0,Math.cos(this.player.mesh.rotation.y));
            this.player.mesh.moveWithCollisions(this.player.mesh.frontVector.multiplyByFloats(-PlayerController.PLAYER_SPEED,-PlayerController.PLAYER_SPEED,-PlayerController.PLAYER_SPEED));
        }

    }

    updateCamera(){
        // console.log(this.input.mouseX)
        // this.player.target.rotation = Vector3.Lerp(this.player.target.rotation,new Vector3(Tools.ToRadians(this.input.mouseY),Tools.ToRadians(this.input.mouseX),0),PlayerController.CAMERA_SPEED * this.deltaTime)
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
        this.camera = new FollowCamera("third_person",new Vector3(10,0,10), this.scene);
        this.camera.heightOffset= 7;
        this.camera.rotationOffset = 180;
        this.camera.cameraAcceleration = .1;
        this.camera.maxCameraSpeed = 1;
        this.camera.lockedTarget = (this.player.character);
        this.scene.activeCamera = this.camera;
        this.camera.attachControl( false)
        this.camera.inputs.removeByType("FollowCameraKeyboardMoveInput");
        //LIMITS
        this.camera.lowerRadiusLimit = 10;
        this.camera.upperRadiusLimit = 10
        ;
        // this.camera.upperRotationOffsetLimit = 5;
        this.camera.lowerHeightOffsetLimit = this.camera.heightOffset;
        this.camera.upperHeightOffsetLimit = this.camera.heightOffset;

        return this.camera;
    }
}

export default PlayerController;
