import {
    Color3,
    Engine,
    FreeCamera,
    HemisphericLight,
    MeshBuilder,
    Scene, SceneLoader,
    StandardMaterial,
    Vector3
} from "@babylonjs/core";
import "@babylonjs/loaders/glTF"
import GameController from "@/GameControllers/GameController";


const createScene = (canvas) => {
    const engine = new Engine(canvas,true);
    engine.adaptToDeviceRatio= true;
    const scene = new Scene(engine);
    if(scene.isReady()){
        let game= new GameController(scene,engine,canvas);
    }

    engine.runRenderLoop(() => {
        scene.render();
    });

    const resize = () => {
        scene.getEngine().resize();
    };
    if (window) {
        window.addEventListener("resize", resize);
    }
    return () => {
        scene.getEngine().dispose();
        if (window) {
            window.removeEventListener("resize", resize);
        }
    };

};

export { createScene };
