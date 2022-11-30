import GameObject from "@/GameControllers/GameObject";
import {
    AnimationEvent,
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
    static PLAYER_SPEED= 0.01;
    static MAX_SPEED= 10;
    static JUMP_FORCE = 0.8;
    static CAMERA_SPEED = 10 ;
    static GRAVITY = -2.8;
    static ORIGINAL_TILT = new Vector3(0.5934119456780721, 0, 0);

    gravity = new Vector3();
    lastGroundPos = Vector3.Zero(); // keep track of the last grounded position

    constructor(input,player,ammo) {
        super();
        this.input = input;
        this.player = player;
        this.isJumping = false
        this.Ammo = ammo;
        this.getAnimationGroup();
        this.setupPlayerCamera();
        this.getPhysic()
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
        if(this.input.jumpKeyDown === false){
            if(this.input.inputMap["ArrowUp"] || this.input.inputMap["W"] || this.input.inputMap["w"] ){
                this.currentAnimation= this.walk_frw;
                this.isAnimating= true}

            else if(this.input.inputMap["ArrowDown"] || this.input.inputMap["W"] || this.input.inputMap["w"]){
                this.currentAnimation= this.walk_back;
                this.isAnimating= true}

            else if(this.input.inputMap["ArrowLeft"] || this.input.inputMap["W"] || this.input.inputMap["w"]){
                this.currentAnimation= this.walk_left;
                this.isAnimating= true}

            else if(this.input.inputMap["ArrowRight"] || this.input.inputMap["W"] || this.input.inputMap["w"]){
                this.currentAnimation= this.walk_right;
                this.isAnimating= true
            }
            else if(this.input.vertical === 0 ){
                this.currentAnimation= this.idle;
                this.isIdle=true
                this.isAnimating= false;
            }
        }

        if(this.input.jumpKeyDown || this.isJumping){
            this.currentAnimation= this.jump;
            // this.jump.onAnimationEndObservable.add(()=>{
                // console.log("end")
            // })
        }

        if(this.currentAnimation != null && this.prevAnimation !== this.currentAnimation) {
            this.prevAnimation.stop();
            this.currentAnimation.play(this.currentAnimation.loopAnimation);
            this.prevAnimation = this.currentAnimation;
        }
    }

    //Update position from control
    getPhysic(){
        this.xform = this.player.ghostObject.getWorldTransform();
        this.walkDirection = new this.Ammo.btVector3(0.0, 0.0, 0.0);
        this.angle = 0.01
    }

    updateFromControl(){
        let contacts = this.player.ghostObject.getNumOverlappingObjects();
        this.player.controllerK.onGround(()=>{console.log("ground")})
            if (this.input.vertical >0) {
                const forward = this.xform.getBasis().getRow(2);
                this.walkDirection = new this.Ammo.btVector3(
                    forward.x(),
                    forward.y(),
                    forward.z()
                ).op_mul(-PlayerController.PLAYER_SPEED);
            }
            if (this.input.vertical < 0) {
                const forward = this.xform.getBasis().getRow(2);
                this.walkDirection = new this.Ammo.btVector3(
                    forward.x(),
                    forward.y(),
                    forward.z()
                ).op_mul(PlayerController.PLAYER_SPEED);
            }
            if(this.input.horizontal >0){
                this.angle -= 0.02;
                const q = this.getQuartenionFromAxisAngle([0, 1, 0], this.angle);
                this.player.ghostObject.getWorldTransform().setRotation(q)
            }
            if(this.input.horizontal < 0){
                this.angle += 0.02;
                const q = this.getQuartenionFromAxisAngle([0, 1, 0], this.angle);
                this.player.ghostObject.getWorldTransform().setRotation(q)
            }

            if (this.input.jumpKeyDown) {
                let event = new AnimationEvent(28.73,()=>{
                    this.player.controllerK.jump(),
                    true
                })
                console.log(this.jump.targetedAnimations[0].animation)
                this.jump.targetedAnimations[0].animation.addEvent(event)
                // this.currentAnimation.goToFrame(28.730)
                // console.log(this.currentAnimation)

            }
            if ((this.input.vertical === 0) || this.input.jumpKeyDown) {
                this.walkDirection = new this.Ammo.btVector3(0, 0, 0);
            }
            this.player.controllerK.setWalkDirection(this.walkDirection);
            this.update();
    }

    update(){
        this.t = this.player.controllerK.getGhostObject().getWorldTransform();
        this.p = this.t.getOrigin();
        let r = this.t.getRotation();
        this.pos = new Vector3(this.t.getOrigin().x(), this.t.getOrigin().y() - 0.7 , this.t.getOrigin().z())
        this.player.body.position = this.pos
        if (!this.player.body.rotationQuaternion) {
            this.player.body.rotationQuaternion = Quaternion.FromEulerAngles(this.player.body.rotation.x,this.player.body.rotation.y , this.player.body.rotation.z);
        }
        this.player.body.rotationQuaternion.set(r.w(), r.x(), r.y(), r.z())
    }

    getQuartenionFromAxisAngle(axis, angle) {
        this.q = new this.Ammo.btQuaternion();
        this.halfAngle = angle * 0.5 ;
        let s = Math.sin(this.halfAngle);
        this.q.setValue(Math.cos(this.halfAngle), axis[0] * s, axis[1] * s, axis[2] * s);
        return this.q;
    }


    beforeRenderUpdate(){
        this.animatePlayer();
        this.updateFromControl();
        if(this.player.body.position.y > 0.5){
            this.isJumping = true;
        }else{
            this.isJumping = false
        }
        //this.updateGroundDetection();
    }
    //
    activatePlayerCamera(){
        this.beforeLoop= ()=>{
            this.beforeRenderUpdate();
        }
        return this.camera;
    }

    setupPlayerCamera(){

        // Follow camera
        this.camera = new FollowCamera("third_person",new Vector3(10,0,8), this.scene);
        this.camera.heightOffset= 7;
        this.camera.rotationOffset = 180;
        this.camera.cameraAcceleration = .1;
        this.camera.maxCameraSpeed = 1;
        this.camera.lockedTarget = (this.player.body);
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

        this.scene.activeCamera = this.camera;
        return this.camera;
    }
}

export default PlayerController;
