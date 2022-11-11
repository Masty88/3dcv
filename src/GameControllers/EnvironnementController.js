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
    constructor() {
        super();
        this.createStairs()
    }

     async load(){
         // const ground= MeshBuilder.CreateBox("ground",{width:50, height:4, depth: 50},this.scene);


         const box = MeshBuilder.CreateBox("obstacle_phy" , {width: 5,height: 3,depth: 5},this.scene);
         box.position = new Vector3(0,10,0);
         let boxMat= new StandardMaterial("box", this.scene);
         boxMat.diffuseColor = new Color3(7,9,0)
         box.material = boxMat;
         box.isPickable = true;

         box.forceSharedVertices();
         box.increaseVertices(5);


         this.mesh = MeshBuilder.CreateSphere("player_container", {diameter:2}, this.scene);
         this.mesh.position =new Vector3(3,30,0)


         const box2 = MeshBuilder.CreateBox("obstacle", {width: 4,height: 3, depth:4},this.scene);
         box2.position = new Vector3(4.94,10,14.67);
         box2.checkCollisions= false;
         box2.isPickable = true;

         this.box2Collisionactivator = MeshBuilder.CreateBox("obstacle act", {width: 4,height: 3, depth:4},this.scene);
         this.box2Collisionactivator.parent= box2;
         this.box2Collisionactivator.checkCollisions = true;

         box2.physicsImpostor = new PhysicsImpostor(box2, PhysicsImpostor.BoxImpostor,{mass: 20, restitution: .1, friction: 0.7}, this.scene);
         box.physicsImpostor = new PhysicsImpostor(box, PhysicsImpostor.SoftbodyImpostor,
             {
                 mass: 15,
                 friction: 0.2,
                 restitution: 10,
                 pressure: 8500,
                 velocityIterations: 20,
                 positionIterations: 20,
                 stiffness: 1,
                 damping: 0.05
             }, this.scene);
         this.mesh.physicsImpostor = new PhysicsImpostor(this.mesh, PhysicsImpostor.SphereImpostor,{mass: 2, restitution: 0, friction: 0.1}, this.scene);

         // const ground= MeshBuilder.CreateBox("ground",{width: 80, depth: 80, height:1},this.scene);
         const ground= MeshBuilder.CreateGround("ground",{width: 80, height:80},this.scene);
         //  ground.scaling = new Vector3(1,1,1);
         // ground.position= Vector3.Zero();
         // ground.isPickable = true;
         let groundMat= new StandardMaterial("groundMat", this.scene);
         groundMat.diffuseColor = Color3.FromHexString("836363FF")
         ground.material = groundMat;
         ground.physicsImpostor = new PhysicsImpostor(ground, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0, friction: 0.7 }, this.scene);




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
     createStairs() {
     this.ramp= MeshBuilder.CreateBox("ramp",{size:5, sideOrientation:2});
     this.ramp.position = new Vector3(3.2,1, 3.14);
     this.ramp.rotation.z = 13;
     this.ramp.scaling = new Vector3(1.29,0.06,1.61)
     this.ramp.isPickable = true;
     this.ramp.checkCollisions = false;
     this.ramp.isVisible = true
     // this.ramp.physicsImpostor = new PhysicsImpostor(this.ramp,PhysicsImpostor.BoxImpostor,{mass:0, friction:0})
     let boxes =[];
     for(let i=0; i<= 4; i++){
         let box =  MeshBuilder.CreateBox("obstacle"+ i, {width: 2,height: 1 + i, depth:8},this.scene);
         box.position = new Vector3(3+i,0,3);
         box.checkCollisions = true;
         box.isPickable = true;
         boxes.push(box)
     }
         let stair= Mesh.MergeMeshes(boxes, true)
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
