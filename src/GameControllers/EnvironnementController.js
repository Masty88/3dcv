import GameObject from "@/GameControllers/GameObject";
import {Color3, Mesh, MeshBuilder, PhysicsImpostor, SceneLoader, StandardMaterial, Vector3} from "@babylonjs/core";
import "@babylonjs/loaders"


class EnvironnementController extends GameObject{
    constructor() {
        super();
    }

     async load(){
        // const ground= MeshBuilder.CreateGround("ground",{width:50, height:50},this.scene);
         var ground = Mesh.CreateBox("ground", 24, this.scene);
         ground.scaling = new Vector3(1,.02,1);
         ground.isPickable = true;
         ground.checkCollisions = false
         // const ground= MeshBuilder.CreateBox("ground",{width:50, height:50, depth: 10},this.scene);
        // ground.position= Vector3.Zero();
        // ground.physicsImpostor = new PhysicsImpostor(ground, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.2, friction: 0.7 }, this.scene);
        // const box = MeshBuilder.CreateBox("obstacle", {width: 5,height: 5},this.scene);
        // box.physicsImpostor = new PhysicsImpostor(box, PhysicsImpostor.BoxImpostor,{mass: 1, restitution: 0, friction: 1.2}, this.scene);
        // box.position = new Vector3(5,2,2);
        // box.checkCollisions= true;
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
