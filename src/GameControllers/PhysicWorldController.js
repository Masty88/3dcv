import GameObject from "@/GameControllers/GameObject";
import {MeshBuilder, PhysicsImpostor, PhysicsViewer, Quaternion, SceneLoader, Vector3} from "@babylonjs/core";

class PhysicWorldController extends GameObject{
    constructor() {
        super();
        this.objectController();
    }


    async objectController(){
        const phyAssets = await this.loadAsset()
        const physicsViewer = new PhysicsViewer()
        console.log(phyAssets)
        phyAssets.phyObjects.meshes.forEach((mesh)=>{
            if(mesh.name.includes("parent") ){
                console.log("here")
                mesh.isVisible = false
                 mesh.setParent(null)
                 // mesh.position = this.scene.getMeshByName("dev_position").position
                 mesh.physicsImpostor = new PhysicsImpostor(mesh,PhysicsImpostor.BoxImpostor,{mass:10, friction:10})
                mesh.checkCollisions = true;
                // physicsViewer.showImpostor(mesh.physicsImpostor, mesh);
                 // mesh.rotationQuaternion = Quaternion.FromEulerAngles(0,0,0)
            }
        })
    }


    async loadAsset(){
        const phyObjects = await SceneLoader.ImportMeshAsync('',"/assets/","physic_object.glb",this.scene);
        return{
            phyObjects
        }
    }

}

export  default PhysicWorldController;
