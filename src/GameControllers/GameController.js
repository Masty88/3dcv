import {
    FreeCamera,
    Vector3,
    HemisphericLight,
    MeshBuilder,
    StandardMaterial,
    Color3,
    ArcRotateCamera, AmmoJSPlugin, PhysicsImpostor, Quaternion, Scene, SceneOptimizer
} from "@babylonjs/core"
import * as ammo  from 'ammo.js';
import GameObject from "@/GameControllers/GameObject";
import EnvironnementController from "@/GameControllers/EnvironnementController";
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import PlayerController from "@/GameControllers/PlayerController";
import InputController from "@/GameControllers/InputController";
import PlayerLoader from "@/GameControllers/PlayerLoader";
import PhysicWorldController from "@/GameControllers/PhysicWorldController";
import MaterialController from "@/GameControllers/MaterialController";
import SceneOptimization from "@/GameControllers/SceneOptimizer";

class GameController{

    constructor(scene,engine,canvas) {
        GameObject.GameController = this;
        GameObject.Scene = scene;
        GameObject.Engine= engine;
        GameObject.Canvas= canvas;
        //this.activatePhysics(scene).then(r => this.setUpGame(scene))
        this.activatePhysics(scene,engine).then(r => this.setUpGame(scene))
    }

    async activatePhysics(scene,engine){
        //GameObject.Engine.displayLoadingUI()

        const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
        camera.setTarget(Vector3.Zero());
        camera.inputs.removeByType("FreeCameraKeyboardMoveInput");
        camera.attachControl(true)
        //Physics engine
        this.Ammo = await ammo()
        const worldMin = this.Ammo.btVector3(-1000,-1000,-1000);
        const worldMax = this.Ammo.btVector3(1000,1000,1000);
        scene.enablePhysics(new Vector3(0,-9.81,0),new AmmoJSPlugin(true, this.Ammo));
        scene.getPhysicsEngine().setTimeStep(1 / 60)
        scene.getPhysicsEngine().setSubTimeStep(3);
        // scene.getPhysicsEngine().getPhysicsPlugin().setFixedTimeStep(1/300);
    }

    async setUpGame(scene,canvas){

        GameObject.Engine.displayLoadingUI()

        new HemisphericLight("light", Vector3.Up(), scene);

        this.environnemet= new EnvironnementController(this.Ammo);
        await this.environnemet.load();


        this.playerAsset= new PlayerLoader(this.Ammo)
        await this.playerAsset.loadPlayer()

        this.physicWorld = new PhysicWorldController(this.playerAsset);
        await this.physicWorld.objectController()

        this.input= new InputController();
        this.player= new PlayerController(this.input,this.playerAsset,this.Ammo);
        this.player.activatePlayerCamera();

        this.effectLayer = new MaterialController();
        this.sceneOptimizer = new SceneOptimization(this.playerAsset)

        await scene.debugLayer.show();

        GameObject.Engine.hideLoadingUI()

    }
}

export default GameController
