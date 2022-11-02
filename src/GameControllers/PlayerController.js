import GameObject from "@/GameControllers/GameObject";
import {
    ArcFollowCamera, ArcRotateCamera,
    Color3,
    FollowCamera, FramingBehavior, Quaternion, Ray, RayHelper, Tools, TransformNode, UniversalCamera,
    Vector3
} from "@babylonjs/core";

class PlayerController extends GameObject{
    static PLAYER_SPEED= 0.2;
    static JUMP_FORCE = 0.8;
    static CAMERA_SPEED = 10 ;
    static GRAVITY = -2.8;
    static ORIGINAL_TILT = new Vector3(0.5934119456780721, 0, 0);

    gravity = new Vector3();
    lastGroundPos = Vector3.Zero(); // keep track of the last grounded position

    constructor(input,player) {
        super();
        this.input = input;
        this.player = player;
        this.isJumping = false;
        // this.getAnimationGroup();
        this.setupPlayerCamera();
    }

    //Animations

    getAnimationGroup(){
        this.idle= this.player.body.idle;
        this.walk_frw= this.player.body.walk_frw;
        console.log(this.walk_frw)
        this.setUpAnimations();
    }

    setUpAnimations(){
        this.scene.stopAnimation();
        this.idle.loopAnimation = true;
        this.walk_frw.loopAnimation = true;
        this.currentAnimation= this.idle;
        this.prevAnimation= this.walk_frw;
    }

    animatePlayer(){
        if(!this.isFalling && !this.isJumping &&
            (this.input.inputMap["ArrowUp"]   ||
             this.input.inputMap["ArrowDown"] ||
             this.input.inputMap["ArrowLeft"] ||
             this.input.inputMap["ArrowRight"]
            )){
            console.log("here")
            console.log(this.prevAnimation.name,this.currentAnimation.name )
            this.currentAnimation= this.walk_frw;
            this.isAnimating= true
            }
        else if(!this.isFalling && this.grounded){
            this.currentAnimation= this.idle;
            this.isIdle=true
            this.isAnimating= false;
        }

        if(this.currentAnimation != null && this.prevAnimation !== this.currentAnimation) {

            this.prevAnimation.stop();
            this.currentAnimation.play(this.currentAnimation.loopAnimation);
            this.prevAnimation = this.currentAnimation;
        }
    }

    //Update position from control

    updateFromControl(){
        this.deltaTime = this.scene.getEngine().getDeltaTime() / 1000.0;
        // this.moveDirection = Vector3.Zero(); // vector that holds movement information
        // this.h = this.input.horizontal; //x-axis
        // this.v = this.input.vertical; //z-axis
        //
        // // Movement based on Camera
        // let fwd = this._camRoot.forward;
        // let right = this._camRoot.right;
        // let correctedVertical = fwd.scaleInPlace(this.v);
        // let correctedHorizontal = right.scaleInPlace(this.h);
        // // movement based off of camera's view
        // let move = correctedHorizontal.addInPlace(correctedVertical);
        //
        //
        // this.moveDirection = new Vector3(move.normalize().x, 0, move.normalize().z);
        // console.log(this.moveDirection)
        //
        // // clamp the input value so that diagonal movement isn't twice as fast
        // let inputMag = Math.abs(this.h) + Math.abs(this.v);
        // if (inputMag < 0) {
        //     this._inputAmt = 0;
        // } else if (inputMag > 1) {
        //     this._inputAmt = 1;
        // } else {
        //     this._inputAmt = inputMag;
        // }

        //final movement that takes into consideration the inputs
        // this.moveDirection = this.moveDirection.scaleInPlace(this._inputAmt * PlayerController.PLAYER_SPEED);

        // Rotations
        // check if there is movement to determine if rotation is needed
        // let input = new Vector3(this.input.horizontalAxis, 0, this.input.verticalAxis); //along which axis is the direction
        // if (input.length() === 0) {//if there's no input detected, prevent rotation and keep player in same rotation
        //     return;
        // }
        // // rotation based on input & the camera angle
        // let angle = Math.atan2(this.input.horizontalAxis, this.input.verticalAxis);
        // angle *= 2 ;
        // let targ = Quaternion.FromEulerAngles(0, angle, 0);
        // this.player.mesh.rotationQuaternion = Quaternion.Slerp(this.player.mesh.rotationQuaternion, targ, 0.9 * this.deltaTime);

        this.player.mesh.frontVector = new Vector3(0,0,1)
        this.horizontal = this.input.horizontalAxis;
        this.vertical = this.input.verticalAxis;
        //right
        if(this.horizontal > 0){
             this.player.mesh.frontVector = new Vector3(Math.sin(this.player.mesh.rotation.y),0,Math.cos(this.player.mesh.rotation.y));
            this.player.mesh.physicsImpostor.setAngularVelocity(new Vector3(0, -1 , 0));
            // this.camera.rotationOffset = 180;
        }
        // //left
        if(this.horizontal < 0){
            this.player.mesh.frontVector = new Vector3(Math.sin(this.player.mesh.rotation.y),0,Math.cos(this.player.mesh.rotation.y));
            this.player.mesh.physicsImpostor.setAngularVelocity(new Vector3(0, 1 , 0));
            // this.camera.rotationOffset = 180;
        }
        if(this.horizontal === 0){
            this.player.mesh.physicsImpostor.setAngularVelocity(Vector3.Zero());
        }
        //up
        if(this.vertical > 0){
            // let velocity = this.player.mesh.physicsImpostor.getLinearVelocity();
            // if (Math.abs(velocity.length()) < PlayerController.PLAYER_SPEED) {
            //     this.player.mesh.physicsImpostor.setLinearVelocity(new Vector3(0,0,10));
            // }
            console.log(Math.sin(this.player.mesh.rotation.y))
            console.log(Math.sin(this.player.mesh.rotationQuaternion.y))
            this.eulerRotation = this.player.mesh.rotationQuaternion.toEulerAngles()
            console.log(this.eulerRotation.y)
            this.player.mesh.frontVector = new Vector3(Math.sin(this.eulerRotation.y),0,Math.cos(this.eulerRotation.y));
            this.player.mesh.moveWithCollisions(this.player.mesh.frontVector.multiplyByFloats(PlayerController.PLAYER_SPEED,PlayerController.PLAYER_SPEED,PlayerController.PLAYER_SPEED));
        }
        // //down
        if(this.vertical < 0){
            let velocity = this.player.mesh.physicsImpostor.getLinearVelocity();
            // if (Math.abs(velocity.length()) < PlayerController.PLAYER_SPEED) {
                // this.player.mesh.physicsImpostor.setLinearVelocity(new Vector3(0,0,-10));
            // }
            this.player.mesh.frontVector = new Vector3(Math.sin(this.player.mesh.rotation.y),0,Math.cos(this.player.mesh.rotation.y));
            this.player.mesh.moveWithCollisions(this.player.mesh.frontVector.multiplyByFloats(-PlayerController.PLAYER_SPEED,-PlayerController.PLAYER_SPEED,-PlayerController.PLAYER_SPEED));
        }
        if(this.vertical === 0){
            this.player.mesh.physicsImpostor.setLinearVelocity(Vector3.Zero());
        }
    }

    //Check ground with ray

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
            return false
        }else{
            return true;
        }
    }

    updateGroundDetection(){
        if(!this.isGrounded()){
            console.log("not")
            this.gravity = this.gravity.addInPlace(Vector3.Up().scale(this.deltaTime * PlayerController.GRAVITY));
            this.grounded = false;
        }

        if (this.gravity.y < -PlayerController.JUMP_FORCE) {
            this.gravity.y = -PlayerController.JUMP_FORCE;
        }

          // this.player.mesh.moveWithCollisions(this.moveDirection.addInPlace(this.gravity));
          this.player.mesh.moveWithCollisions(Vector3.Zero().addInPlace(this.gravity));
        //
        if (this.isGrounded()) {
            this.gravity.y = 0;
            this.lastGroundPos.copyFrom(this.player.mesh.position);
            this.grounded = true;
            this.jumpCount = 1;
            this.isJumping=false
            this.isFalling= false;
        }

        //Jump detection
        if(this.input.jumpKeyDown && this.jumpCount > 0) {
            this.gravity.y = PlayerController.JUMP_FORCE;
            this.jumpCount--;
        }
    }

    playerCollision(){

        this.player.mesh.onCollide=(m)=>{
            console.log("collide")
            if(m.physicsImpostor){
                m.physicsImpostor.applyImpulse(this.moveDirection.scaleInPlace(2), m.getAbsolutePosition().addInPlace(new Vector3(0,1.5,0)))
            }
        }
    }

    updateCamera(){
        //TODO find a good rotation
        // if (this.input.verticalAxis > 0) { //rotates to the right
        //     this._camRoot.rotation = Vector3.Lerp(this._camRoot.rotation, new Vector3(this._camRoot.rotation.x, Math.PI /  2, this._camRoot.rotation.z), 0.1);
        // } else if (this.input.verticalAxis < 0) { //rotates to the left
        //     this._camRoot.rotation = Vector3.Lerp(this._camRoot.rotation, new Vector3(this._camRoot.rotation.x, -Math.PI/2, this._camRoot.rotation.z), 0.1);
        // }
        let centerPlayer = this.player.mesh.position.y + 2;
        this._camRoot.position = Vector3.Lerp(this._camRoot.position, new Vector3(this.player.mesh.position.x , centerPlayer, this.player.mesh.position.z ), 0.4);
    }

    beforeRenderUpdate(){
        // this.playerCollision()
        // this.animatePlayer();
        this.updateFromControl();
        this.updateGroundDetection();
    }

    activatePlayerCamera(){
        this.beforeLoop= ()=>{
            this.beforeRenderUpdate();
            // this.updateCamera()
        }
        return this.camera;
    }

    setupPlayerCamera(){

        //Universal Camera
        // this.camera = new ArcRotateCamera("arc", 0, Math.PI,5,new Vector3(0,7,0), this.scene)
        // this.camera.setPosition(new Vector3(0,12,-15))
        // this.camera.lockedTarget = this.player.character;
        // this.camera.setTarget(this.player.mesh, true, true, true);
        // this.camera.useFramingBehavior = true;
        // this.camera.framingBehavior.framingTime = 10;
        // this.scene.activeCamera = this.camera;


        // Follow camera
        this.camera = new FollowCamera("third_person",new Vector3(10,0,8), this.scene);
        this.camera.heightOffset= 7;
        this.camera.rotationOffset = 180;
        this.camera.cameraAcceleration = .1;
        this.camera.maxCameraSpeed = 1;
        this.camera.lockedTarget = (this.player.character);
        this.scene.activeCamera = this.camera;
        this.camera.attachControl( false)
        this.camera.inputs.removeByType("FollowCameraKeyboardMoveInput");


        //LIMITS
        // this.camera.lowerRadiusLimit = 10;
        this.camera.upperRadiusLimit = 29;
        // // this.camera.upperRotationOffsetLimit = 5;
        this.camera.lowerHeightOffsetLimit = this.camera.heightOffset;
        this.camera.upperHeightOffsetLimit = this.camera.heightOffset;

        //root camera parent that handles positioning of the camera to follow the player
        // this._camRoot = new TransformNode("root");
        // this._camRoot.position = new Vector3(0, 0, 0); //initialized at (0,0,0)
        // //to face the player from behind (180 degrees)
        // this._camRoot.rotation = new Vector3(0, Math.PI, 0);
        //
        // //rotations along the x-axis (up/down tilting)
        // let yTilt = new TransformNode("ytilt");
        // //adjustments to camera view to point down at our player
        // yTilt.rotation = new Vector3(0, 0, 0);
        // yTilt.parent = this._camRoot;
        // this.yTilt= yTilt
        //     //our actual camera that's pointing at our root's position
        //     this.camera=new ArcRotateCamera("Camera", 0, Math.PI/2,1, Vector3.Zero(), this.scene)
        //     this.camera.position=new Vector3(0, 2, -15)
        //     this.camera.inputs.removeByType("ArcRotateCameraKeyboardMoveInput")
        //     this.camera.lockedTarget = this._camRoot.position;
        //     this.camera.attachControl(this.engine.getRenderingCanvas(),true)
        //     this.camera.upperRadiusLimit=35;
        //     this.camera.lowerRadiusLimit=10;
        //     this.camera.upperBetaLimit=1.5;
        //     this.camera.fov = 0.35;
        //
        // this.camera.parent = yTilt;
        this.scene.activeCamera = this.camera;



        return this.camera;
    }
}

export default PlayerController;
