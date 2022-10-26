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
        this.v = this.input.verticalAxis;
        this.h = this.input.horizontalAxis;

        this.moveDirection = new Vector3.Zero()

    }

    updateCamera(){

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
        this.camera.position =new Vector3(0.7, 1.35, -4)


        this.scene.activeCamera = this.camera;
        return this.camera;
    }
}

export default PlayerController;
