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
        //this.getAnimationGroup();
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
        if(this.input.inputMap["ArrowUp"] || this.input.inputMap["W"] || this.input.inputMap["w"]){
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
            this.isAnimating= true}


        else if(this.grounded){
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
    getPhysic(){
        this.xform = this.player.ghostObject.getWorldTransform();
        this.walkDirection = new this.Ammo.btVector3(0.0, 0.0, 0.0);
        this.angle = 0.01
        // this.orn = this.player.ghostObject.getWorldTransform().getBasis();
        //this.orn.setEulerZYX(Math.PI/2,0,0);
    }

    updateFromControl(){
        let contacts = this.player.ghostObject.getNumOverlappingObjects();
        this.player.controllerK.onGround=()=>{console.log(" ground")}
        // console.log(contacts)
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
                // this.orn = this.player.ghostObject.getWorldTransform().getBasis();
                // this.orn.setEulerZYX(0,this.angle,0);
                const q = this.getQuartenionFromAxisAngle([0, 1, 0], this.angle);
                this.player.ghostObject.getWorldTransform().setRotation(q)
            }
        if(this.input.horizontal < 0){
            this.angle += 0.02;
             // const orn = this.player.ghostObject.getWorldTransform().getBasis();
             // orn.setEulerZYX(0,this.angle,0);
            const q = this.getQuartenionFromAxisAngle([0, 1, 0], this.angle);
            this.player.ghostObject.getWorldTransform().setRotation(q)
        }
            if (this.input.jumpKeyDown) {
                this.player.controllerK.jump();
            }
            if (this.input.vertical === 0) {
                this.walkDirection = new this.Ammo.btVector3(0, 0, 0);
            }

            this.player.controllerK.setWalkDirection(this.walkDirection);
            this.update();
        // })
    }

    update(){
        this.t = this.player.controllerK.getGhostObject().getWorldTransform();
        this.p = this.t.getOrigin();
        let r = this.t.getRotation();
        this.pos = new Vector3(this.t.getOrigin().x(), this.t.getOrigin().y() - 0.4 , this.t.getOrigin().z())
        this.player.body.position = this.pos
        if (!this.player.body.rotationQuaternion) {
            this.player.body.rotationQuaternion = Quaternion.FromEulerAngles(this.player.body.rotation.x,this.player.body.rotation.y , this.player.body.rotation.z);
        }
        this.player.body.rotationQuaternion.set(r.w(), r.x(), r.y(), r.z())
        // this.orn.setEulerZYX(this.r.z(),this.r.y(),this.r.x())
       // this.player.body.rotationQuaternion.y= r.y();
        //console.log(this.player.body.rotationQuaternion)
    }

    getQuartenionFromAxisAngle(axis, angle) {
        this.q = new this.Ammo.btQuaternion();
        this.halfAngle = angle * 0.5 ;
        let s = Math.sin(this.halfAngle);
        this.q.setValue(Math.cos(this.halfAngle), axis[0] * s, axis[1] * s, axis[2] * s);
        return this.q;
    }



    beforeRenderUpdate(){
        //this.playerCollision()
       //this.animatePlayer();
        this.updateFromControl();
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
