import GameObject from "@/GameControllers/GameObject";
import {
    AmmoJSPlugin,
    Color3, HingeJoint,
    Mesh,
    MeshBuilder,
    PhysicsImpostor, PhysicsViewer, PolygonMeshBuilder, Quaternion,
    SceneLoader,
    StandardMaterial, TransformNode,
    Vector2,
    Vector3
} from "@babylonjs/core";
import "@babylonjs/loaders"
import ammo from "ammo.js";


class EnvironnementController extends GameObject{
    constructor(ammo) {
        super();
        this.Ammo = ammo;
        // this.createStairs()
    }

      async load(){

        //  this.ground  = new this.Ammo.btRigidBody();
          const ground= MeshBuilder.CreateBox("ground",{width: 150, height: 0.2, depth:150},this.scene);
          let groundMat= new StandardMaterial("groundMat", this.scene);
          groundMat.diffuseColor = Color3.FromHexString("836363FF");
          ground.material = groundMat;
          ground.physicsImpostor = new PhysicsImpostor(ground, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0, friction:0.1}, this.scene);
          ground.isVisible = false;

          // const box = MeshBuilder.CreateBox("obstacle", {width: 2,height: 2, depth:2},this.scene);
          // box.position = new Vector3(0,1,14.67);
          // box.isPickable = true;
          // box.physicsImpostor = new PhysicsImpostor(box, PhysicsImpostor.BoxImpostor,{mass: 0.1, friction:1 , restitution:0,}, this.scene);
          //
          //
          // const box2 = MeshBuilder.CreateBox("obstacle", {width: 2,height: 2, depth:2},this.scene);
          // box2.position = new Vector3(5,1,14.67);
          // box2.isPickable = true;
          // box2.physicsImpostor = new PhysicsImpostor(box2, PhysicsImpostor.BoxImpostor,{mass: 1, friction:0.1 , restitution:0,}, this.scene);
          // var physicsViewer = new PhysicsViewer(this.scene);

          const assets=  await this.loadAssets();
          assets.result.meshes.forEach((mesh)=>{
              // if(mesh.name.includes("root") ){
              //     mesh.physicsImpostor = new PhysicsImpostor(mesh, PhysicsImpostor.MeshImpostor,{mass: 0,restitution:0.1,friction:0})
              // }
              // if(mesh.name.includes("impostor") ){
              //     mesh.isVisible = false;
              //     mesh.physicsImpostor = new PhysicsImpostor(mesh, PhysicsImpostor.BoxImpostor,{mass: 0,restitution:0.1,friction:0})
              // }
              if(mesh.name.includes("text") ){
                  mesh.isVisible = true;
                  mesh.physicsImpostor = new PhysicsImpostor(mesh, PhysicsImpostor.BoxImpostor,{mass: 0.1,restitution:0.1,friction:0})
              }
          })

          this.createJointPortal()
          this.sleepImpostor()

          // physicsViewer.showImpostor(assets.result.meshes[1].physicsImpostor, assets.result.meshes[1]);

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
         let box =  MeshBuilder.CreateBox("obstacle"+ i, {width: 2,height: 0.1 + i, depth:8},this.scene);
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

     async loadAssets(){
         const result= await SceneLoader.ImportMeshAsync('',"/assets/","factory.glb",this.scene);
         console.log(result)
         return{
             result
         }
     }

     createJointPortal(){
         this.rightPivot = MeshBuilder.CreateCylinder("rightPivot", {diameter:1, height: 2}, this.scene);
         this.rightPivot.position = new Vector3(10,2,20)
         this.rightPivot.physicsImpostor = new PhysicsImpostor(this.rightPivot, PhysicsImpostor.SphereImpostor, { mass: 0, friction:2}, this.scene);

         this.leftDoor = MeshBuilder.CreateBox("leftDoor", {height: 3.5, width: 8, depth:0.2}, this.scene);
         this.leftDoor.position = new Vector3(10,0,20)
         // this.leftDoor.physicsImpostor.setAngularVelocity(new Vector3(0,90,0))
         this.leftDoor.rotationQuaternion = Quaternion.FromEulerAngles(0,1.5,0)
         this.leftDoor.physicsImpostor = new PhysicsImpostor(this.leftDoor, PhysicsImpostor.BoxImpostor, { mass: 20, friction:1}, this.scene);


         this.jointLeft = new HingeJoint({
             mainPivot: new Vector3(0, 0, 0),
             connectedPivot: new Vector3(-4,0,0),
             mainAxis: new Vector3(0, 1, 0),
             connectedAxis: new Vector3(0, 1, 0),
             nativeParams:{
             }
         })

         this.rightPivot.physicsImpostor.addJoint(this.leftDoor.physicsImpostor, this.jointLeft)


         this.stopImpostor = new TransformNode("stop",this.scene);
         this.stopImpostor.position = new Vector3(14.89, 1, 25.18)
         this.stop = MeshBuilder.CreateBox("stop", {height: 1, width: 1, depth:1}, this.scene);
         this.stop.position = this.stopImpostor.position
     }

     sleepImpostor(){
        this.beforeLoop = ()=>{
            if( this.leftDoor.intersectsPoint(this.stopImpostor.position)){
                this.jointLeft.physicsJoint.setLimit(-Math.PI/2,Math.PI/4, .9, .01, 10);
                this.leftDoor.physicsImpostor.setMass(0);
            }

            // if()
        }
     }
}

export default EnvironnementController
