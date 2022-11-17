import {
    FreeCamera,
    Vector3,
    HemisphericLight,
    MeshBuilder,
    StandardMaterial,
    Color3,
    ArcRotateCamera, AmmoJSPlugin
} from "@babylonjs/core"
import ammo  from 'ammo.js';
import GameObject from "@/GameControllers/GameObject";
import EnvironnementController from "@/GameControllers/EnvironnementController";
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import PlayerController from "@/GameControllers/PlayerController";
import InputController from "@/GameControllers/InputController";
import PlayerLoader from "@/GameControllers/PlayerLoader";

class GameController{

    constructor(scene,engine,canvas) {
        GameObject.GameController = this;
        GameObject.Scene = scene;
        GameObject.Engine= engine;
        GameObject.Canvas= canvas;
        this.activatePhysics(scene).then(r => this.setUpGame(scene))
    }

    async activatePhysics(scene){
        GameObject.Engine.displayLoadingUI()

        const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
        camera.setTarget(Vector3.Zero());
        // camera.inputs.removeByType("FreeCameraKeyboardMoveInput");
        camera.attachControl(true)

        //Physics engine
        const Ammo = await ammo()
        scene.enablePhysics(new Vector3(0,-9.81,0),new AmmoJSPlugin(true, Ammo));
        // scene.enablePhysics(null, new AmmoJSPlugin(true));
        scene.getPhysicsEngine().setTimeStep(1 / 60)
         scene.getPhysicsEngine().setSubTimeStep(1);

    }

    async setUpGame(scene,canvas){

        GameObject.Engine.displayLoadingUI()

        new HemisphericLight("light", Vector3.Up(), scene);


        this.environnemet= new EnvironnementController();
        await this.environnemet.load();

        this.playerAsset= new PlayerLoader()
        await this.playerAsset.loadPlayer()

        this.input= new InputController();
        this.player= new PlayerController(this.input,this.playerAsset);
        this.player.activatePlayerCamera();

        await scene.debugLayer.show();

        GameObject.Engine.hideLoadingUI()

    }
}

export default GameController
