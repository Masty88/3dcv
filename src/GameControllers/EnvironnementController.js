import GameObject from "@/GameControllers/GameObject";
import {
    AmmoJSPlugin,
    Color3, GlowLayer, HingeJoint,
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
         const glow = new GlowLayer("glow", this.scene);
          const ground= MeshBuilder.CreateBox("ground",{width: 150, height: 0.2, depth:150},this.scene);
          let groundMat= new StandardMaterial("groundMat", this.scene);
          groundMat.diffuseColor = Color3.FromHexString("836363FF");
          ground.material = groundMat;
          ground.physicsImpostor = new PhysicsImpostor(ground, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0, friction:0.1}, this.scene);
          ground.isVisible = false;

          const city=  await this.loadAssets();
          console.log(city)
          city.assets.forEach((mesh)=>{
              if(mesh.name.includes("impostor") ){
                  mesh.isVisible = false;
                  mesh.physicsImpostor = new PhysicsImpostor(mesh, PhysicsImpostor.BoxImpostor,{mass: 0,restitution:0.1,friction:0})
              }
          })


          this.createJointPortal()
          this.sleepImpostor()
          // physicsViewer.showImpostor(assets.result.meshes[1].physicsImpostor, assets.result.meshes[1]);

    }


     async loadAssets(){
         const result= await SceneLoader.ImportMeshAsync('',"/assets/","factory.glb",this.scene);
         console.log(result)
         let resultParent = result.meshes[0]
         let assets = resultParent.getChildMeshes(false);
         assets.forEach((asset)=>{
             asset.setParent(null)
         })
         resultParent.dispose();
         return{
             assets
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
