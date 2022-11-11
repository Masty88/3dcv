import GameObject from "@/GameControllers/GameObject";
import {
    ArcFollowCamera,
    ArcRotateCamera, BaseCameraPointersInput,
    Color3,
    FollowCamera, FollowCameraInputsManager, FollowCameraPointersInput,
    FramingBehavior,
    PointerDragBehavior, PointerEventTypes,
    Quaternion,
    Ray,
    RayHelper,
    Tools,
    TransformNode,
    UniversalCamera,
    Vector3
} from "@babylonjs/core";

class PlayerController extends GameObject{
    static PLAYER_SPEED= 0.2;
    static MAX_SPEED= 10;
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
        this.angle = 0
        this.getAnimationGroup();
        this.setupPlayerCamera();
    }

    //Animations

    getAnimationGroup(){
        this.idle= this.player.body.idle;

        this.walk_frw= this.player.body.walk_frw;
        this.walk_back = this.player.body.walk_back;
        this.walk_left = this.player.body.walk_left;
        this.walk_right = this.player.body.walk_right;

        this.jump = this.player.body.jumpUp;
        this.landing = this.player.body.landing;
        this.setUpAnimations();
    }

    setUpAnimations(){
        this.scene.stopAnimation();
        this.idle.loopAnimation = true;

        this.walk_frw.loopAnimation = true;
        this.walk_back.loopAnimation = true;
        this.walk_left.loopAnimation = true;
        this.walk_right.loopAnimation = true;

        this.jump.loopAnimation= true;

        this.currentAnimation= this.idle;
        this.prevAnimation= this.landing;
    }

    animatePlayer(){
        if(!this.isFalling && !this.isJumping &&
            this.input.inputMap["ArrowUp"] || this.input.inputMap["W"] || this.input.inputMap["w"]){
            this.currentAnimation= this.walk_frw;
            this.isAnimating= true}

        else if(!this.isFalling && !this.isJumping &&
            this.input.inputMap["ArrowDown"] || this.input.inputMap["W"] || this.input.inputMap["w"]){
            this.currentAnimation= this.walk_back;
            this.isAnimating= true}

        else if(!this.isFalling && !this.isJumping &&
            this.input.inputMap["ArrowLeft"] || this.input.inputMap["W"] || this.input.inputMap["w"]){
            this.currentAnimation= this.walk_left;
            this.isAnimating= true}

        else if(!this.isFalling && !this.isJumping &&
            this.input.inputMap["ArrowRight"] || this.input.inputMap["W"] || this.input.inputMap["w"]){
            this.currentAnimation= this.walk_right;
            this.isAnimating= true}


        else if(!this.isFalling && this.grounded){
            this.currentAnimation= this.idle;
            this.isIdle=true
            this.isAnimating= false;
        }

        if(this.jumpKeyDown){
            this.currentAnimation= this.jump;
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

        this.player.mesh.frontVector = new Vector3(0,0,1)
        this.horizontal = this.input.horizontalAxis;
        this.vertical = this.input.verticalAxis;
        this.eulerRotation = this.player.mesh.rotationQuaternion.toEulerAngles()

        //right
        if(this.horizontal > 0){
            this.player.mesh.frontVector = new Vector3(Math.sin(this.eulerRotation.y),0,Math.cos(this.eulerRotation.y));
            var axis2 = new Vector3(0, -1, 0);
            this.angle -= 0.05;
            this.player.mesh.rotationQuaternion= Quaternion.RotationAxis(axis2, this.angle);
        }
        //left
        if(this.horizontal < 0){
            // this.player.mesh.physicsImpostor.setAngularVelocity(new Vector3(0, -2 , 0));
            this.player.mesh.frontVector = new Vector3(Math.sin(this.eulerRotation.y),0,Math.cos(this.eulerRotation.y));
            var axis = new Vector3(0, -1, 0);
            this.angle += 0.02;
            this.player.mesh.rotationQuaternion= Quaternion.RotationAxis(axis, this.angle);
        }
        //up
        if(this.vertical > 0){
            this.player.mesh.frontVector = new Vector3(Math.sin(this.eulerRotation.y),0,Math.cos(this.eulerRotation.y));
            this.player.mesh.frwVectore = this.getForwardVector(this.player.mesh);
            // let velocity = this.player.mesh.physicsImpostor.getLinearVelocity();
            // console.log(velocity)
            // if (Math.abs(velocity.length()) < PlayerController.MAX_SPEED) {
                // this.player.mesh.physicsImpostor.setLinearVelocity(velocity.add(this.player.mesh.frontVector.multiplyByFloats(PlayerController.PLAYER_SPEED,PlayerController.PLAYER_SPEED,PlayerController.PLAYER_SPEED)));
            // }
            this.player.mesh.moveWithCollisions(this.player.mesh.frontVector.multiplyByFloats(PlayerController.PLAYER_SPEED,PlayerController.PLAYER_SPEED,PlayerController.PLAYER_SPEED));
        }
        // //down
        if(this.vertical < 0){
            this.player.mesh.frontVector = new Vector3(Math.sin(this.eulerRotation.y),0,Math.cos(this.eulerRotation.y));
            this.player.mesh.moveWithCollisions(this.player.mesh.frontVector.multiplyByFloats(-PlayerController.PLAYER_SPEED,PlayerController.PLAYER_SPEED,-PlayerController.PLAYER_SPEED));
        }

        // if(this.vertical === 0){
            // this.player.mesh.physicsImpostor.setLinearVelocity(Vector3.Zero())
            // this.player.mesh.physicsImpostor.setAngularVelocity(Vector3.Zero())
        // }

    }

    getForwardVector(mesh) {
        mesh.computeWorldMatrix(true);
        this.forward_local = new Vector3(0, 0, 1);
        this.worldMatrix = mesh.getWorldMatrix();
        return Vector3.TransformNormal(this.forward_local, this.worldMatrix);
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
        if(this.floorRayCast(0,0,0.8).equals(Vector3.Zero())){
            return false
        }else{
            return true;
        }
    }

    updateGroundDetection(){
        if(!this.isGrounded()){
            this.gravity = this.gravity.addInPlace(Vector3.Up().scale(this.deltaTime * PlayerController.GRAVITY));
            this.grounded = false;
        }

        if (this.gravity.y < -PlayerController.JUMP_FORCE) {
            this.gravity.y = -PlayerController.JUMP_FORCE;
        }

        // if (this.gravity.y < 0 && this.isJumping) { //todo: play a falling anim if not grounded BUT not on a slope
        //     this.isFalling = true;
        // }

          // this.player.mesh.moveWithCollisions(this.moveDirection.addInPlace(this.gravity));
          // this.player.body.onAnimationEnd = ()=>{
              this.player.mesh.moveWithCollisions(Vector3.Zero().addInPlace(this.gravity));
          // }

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
            this.isJumping = true;
        }
    }

    playerCollision(){

        // this.obstacle = this.scene.getMeshByName("obstacle")
        // this.obstacle.moveWithCollisions(Vector3.Zero())
        this.player.mesh.onCollide=(m)=>{
            if(m.name.includes("act")){
                console.log(m.parent)
                m.parent.physicsImpostor.applyImpulse(this.player.mesh.frontVector.scale(5), m.parent.getAbsolutePosition())
                // console.log(m.getAbsolutePosition().add(this.player.mesh.position));
                // console.log(this.player.mesh.frontVector.scale(100));
        //         // m.physicsImpostor.applyImpulse(this.player.mesh.frontVector, m.getAbsolutePosition().add(this.player.mesh.position))
        //         m.physicsImpostor.applyForce(this.player.mesh.frontVector.scale(5000000), m.getAbsolutePosition().add(this.player.mesh.frontVector))
            }
        }
    }


    beforeRenderUpdate(){
        this.playerCollision()
        this.animatePlayer();
        this.updateFromControl();
        this.updateGroundDetection();
    }

    activatePlayerCamera(){
        this.beforeLoop= ()=>{
            this.beforeRenderUpdate();
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
        this.camera.attachControl( true)

        this.camera.inputs.removeByType("FollowCameraKeyboardMoveInput");
        // this.camera.inputs.add(new FollowCameraPointersInput())
        // console.log(BaseCameraPointersInput.prototype.onButtonUp(()=>console.log("test")))

        //LIMITS
        // this.camera.lowerRadiusLimit = 10;
        this.camera.upperRadiusLimit = 29;
        // // this.camera.upperRotationOffsetLimit = 5;
        // this.camera.lowerHeightOffsetLimit = this.camera.heightOffset;
        // this.camera.upperHeightOffsetLimit = this.camera.heightOffset;

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
