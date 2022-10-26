import GameObject from "@/GameControllers/GameObject";
import {Color3, MeshBuilder, SceneLoader, StandardMaterial, Vector3} from "@babylonjs/core";
import "@babylonjs/loaders"


class EnvironnementController extends GameObject{
    constructor() {
        super();
    }

     async load(){
        const ground= MeshBuilder.CreateGround("ground",{width:20, height:20},this.scene);
        ground.position= Vector3.Zero()
        const groundMaterial= new StandardMaterial("groundMat", this.scene);
        // groundMaterial.diffuseColor = Color3.FromHexString("#00b894")
        // ground.material= groundMaterial;
        // const assets=  await this.loadAssets();
        // assets.allMeshes.forEach(mesh=>{
        //     mesh.checkCollisions=true;
        // })
    }

    //  async loadAssets(){
    //     const result= await SceneLoader.ImportMeshAsync('',"/assets/","ground.glb",this.scene);
    //     let env= result.meshes[0];
    //     return{
    //         env
    //     }
    // }
}

export default EnvironnementController
