import GameObject from "@/GameControllers/GameObject";
import {Color3, Mesh, MeshBuilder, PhysicsImpostor, SceneLoader, StandardMaterial, Vector3} from "@babylonjs/core";
import "@babylonjs/loaders"


class EnvironnementController extends GameObject{
    constructor() {
        super();
    }

     async load(){
         const ground= MeshBuilder.CreateBox("ground",{width:50, height:4, depth: 50},this.scene);
         ground.scaling = new Vector3(1,.02,1);
         ground.position= Vector3.Zero();
         ground.physicsImpostor = new PhysicsImpostor(ground, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.2, friction: 0.7 }, this.scene);
         ground.isPickable = true;
         ground.checkCollisions = true;
        const box = MeshBuilder.CreateBox("obstacle", {width: 5,height: 5},this.scene);
        box.physicsImpostor = new PhysicsImpostor(box, PhysicsImpostor.BoxImpostor,{mass: 10, restitution: 0, friction: 1.2}, this.scene);
        box.position = new Vector3(5,2,2);
        box.checkCollisions= true;
        box.isPickable = false;

         // // Create player debug ellipsoid shape
         // var ellipsoid = MeshBuilder.CreateCylinder("debug", {diameter: (box.ellipsoid.x *2), height: (box.ellipsoid.y * 2), subdivisions: 24});
         // ellipsoid.position.copyFrom(box.position);
         // ellipsoid.position.addInPlace(box.ellipsoidOffset);
         // ellipsoid.isPickable = false
         //
         // // Set ellipsoid debug shape material
         // var debugmat = new StandardMaterial("debugmat");
         // debugmat.diffuseColor = new Color3(0, 1, 0);
         // debugmat.wireframe = true;
         // ellipsoid.material = debugmat;
         // ellipsoid.parent= box;
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
