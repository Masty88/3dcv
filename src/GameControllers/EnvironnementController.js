import GameObject from "@/GameControllers/GameObject";
import {
    AmmoJSPlugin,
    Color3,
    Mesh,
    MeshBuilder,
    PhysicsImpostor, PolygonMeshBuilder,
    SceneLoader,
    StandardMaterial,
    Vector2,
    Vector3
} from "@babylonjs/core";
import "@babylonjs/loaders"
import ammo from "ammo.js";


class EnvironnementController extends GameObject{
    constructor(ammo) {
        super();
        this.Ammo = ammo;
        this.createStairs()
    }

      load(){

        //  this.ground  = new this.Ammo.btRigidBody();
          const ground= MeshBuilder.CreateBox("ground",{width: 40, height: 0.2, depth:40},this.scene);
          let groundMat= new StandardMaterial("groundMat", this.scene);
          groundMat.diffuseColor = Color3.FromHexString("836363FF");
          ground.material = groundMat;
          ground.physicsImpostor = new PhysicsImpostor(ground, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0, friction:0.1}, this.scene);

         const box = MeshBuilder.CreateBox("obstacle", {width: 2,height: 2, depth:2},this.scene);
         box.position = new Vector3(0,1,14.67);
         box.isPickable = true;
         box.physicsImpostor = new PhysicsImpostor(box, PhysicsImpostor.BoxImpostor,{mass: 0.1, friction:1 , restitution:0,}, this.scene);


          this.boxShape = new this.Ammo.btBoxShape(10,10,10);
          const box2 = MeshBuilder.CreateBox("obstacle", {width: 2,height: 2, depth:2},this.scene);
          box2.position = new Vector3(5,1,14.67);
          box2.isPickable = true;
          box2.physicsImpostor = new PhysicsImpostor(box2, PhysicsImpostor.BoxImpostor,{mass: 100, friction:0.1 , restitution:0,}, this.scene);
          console.log(box.physicsImpostor)
    }
     createStairs() {
     // this.ramp= MeshBuilder.CreateBox("stair",{size:5, sideOrientation:2});
     // this.ramp.position = new Vector3(2.97,1.05, 3.01);
     // this.ramp.rotation.z = 0.41;
     // this.ramp.scaling = new Vector3(1.29,0.01,1.61)
     // this.ramp.isPickable = true;
     // this.ramp.checkCollisions = false;
     // this.ramp.isVisible = false;
     // this.ramp.physicsImpostor = new PhysicsImpostor(this.ramp,PhysicsImpostor.BoxImpostor,{mass:0, friction:0})
     let boxes =[];
     for(let i=0; i<= 4; i++){
         let box =  MeshBuilder.CreateBox("obstacle"+ i, {width: 2,height: 1 + i, depth:8},this.scene);
         box.position = new Vector3(3 + i,0,3);
         box.checkCollisions = true;
         box.isPickable = false;
         boxes.push(box)
         box.physicsImpostor= new PhysicsImpostor(box,PhysicsImpostor.BoxImpostor,{mass:0}, this.scene)
     }
         // let stair= Mesh.MergeMeshes(boxes, true)
         // stair.checkCollisions = true;
        // stair.physicsImpostor = new PhysicsImpostor(stair,PhysicsImpostor.BoxImpostor,{mass:0})
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
