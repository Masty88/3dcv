import GameObject from "@/GameControllers/GameObject";
import {
    Color3,
    FollowCamera, Ray, RayHelper,
    Vector3
} from "@babylonjs/core";

class PlayerController extends GameObject{
    static PLAYER_SPEED= 0.2;
    static JUMP_FORCE = 0.8;
    static CAMERA_SPEED = 10 ;
    static GRAVITY = -2.8;

    gravity = new Vector3();
    lastGroundPos = Vector3.Zero(); // keep track of the last grounded position

    constructor(input,player) {
        super();
        this.input = input;
        this.player = player;
        this.isJumping = false;

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
            // this.camera.rotationOffset = 180;
        }
        // //left
        if(this.horizontal < 0){
            this.player.mesh.rotation.y -= .1;
            this.player.mesh.frontVector = new Vector3(Math.sin(this.player.mesh.rotation.y),0,Math.cos(this.player.mesh.rotation.y));
            // this.camera.rotationOffset = 180;
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

    floorRayCast(offsetx, offsetz, raycastlen){
        let raycastFloorPos = new Vector3(this.player.mesh.position.x + offsetx, this.player.mesh.position.y + 0.5 , this.player.mesh.position.z + offsetz);
        this.ray = new Ray(raycastFloorPos, Vector3.Up().scale(-1), raycastlen);
        let predicate = function (mesh) {
            return mesh.isPickable && mesh.isEnabled();
        }
        let pick = this.scene.pickWithRay(this.ray, predicate);
        if (pick.hit) {
            return pick.pickedPoint;
        } else {
            return Vector3.Zero();
        }

    }


    isGrounded(){
        if(this.floorRayCast(0,0,0.6).equals(Vector3.Zero())){
            console.log("not ground")
            return false
        }else{
            console.log("here")
            return true;
        }
    }

    // updateGroundDetection(){
    //     if(!this.isGrounded()){
    //         this.gravity= this.gravity.addInPlace(Vector3.Up().scale(this.deltaTime * PlayerController.GRAVITY));
    //         console.log(this.gravity)
    //         this.grounded = false;
    //     }
    //
    //     if (this.gravity.y < -PlayerController.JUMP_FORCE) {
    //         this.gravity.y = -PlayerController.JUMP_FORCE;
    //     }
    //
    //     if (this.gravity.y < 0 && this.isJumping) { //todo: play a falling anim if not grounded BUT not on a slope
    //         this.isFalling = true;
    //     }
    //
    //      this.player.mesh.moveWithCollisions(this.move.addInPlace(this.gravity));
    //
    //     if (this.isGrounded()) {
    //         console.log("here")
    //         this.gravity.y = 0;
    //         this.lastGroundPos.copyFrom(this.player.mesh.position);
    //         this.grounded = true;
    //         this.jumpCount = 1;
    //         this.isJumping=false
    //         this.isFalling= false;
    //     }
    //
    //     //Jump detection
    //     if(this.input.jumpKeyDown && this.jumpCount > 0) {
    //         console.log("here")
    //         this.gravity.y = PlayerController.JUMP_FORCE;
    //         this.jumpCount--;
    //         this.isJumping= true;
    //         this.isFalling= false;
    //         this.player.mesh.position.y += PlayerController.JUMP_FORCE;
    //     }
    // }

    beforeRenderUpdate(){
        this.updateFromControl();
        this.isGrounded();
    }

    activatePlayerCamera(){
        this.beforeLoop= ()=>{
            this.beforeRenderUpdate();
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
        this.camera.upperRadiusLimit = 10  ;
        // this.camera.upperRotationOffsetLimit = 5;
        this.camera.lowerHeightOffsetLimit = this.camera.heightOffset;
        this.camera.upperHeightOffsetLimit = this.camera.heightOffset;

        return this.camera;
    }
}

export default PlayerController;
