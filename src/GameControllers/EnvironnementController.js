import GameObject from "@/GameControllers/GameObject";
import {
    AmmoJSPlugin,
    Color3,
    Mesh,
    MeshBuilder,
    PhysicsImpostor, PhysicsViewer, PolygonMeshBuilder,
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
        // this.createStairs()
    }

     async load(){
         // const ground= MeshBuilder.CreateBox("ground",{width:50, height:4, depth: 50},this.scene);


         // const box = MeshBuilder.CreateBox("obstacle_phy" , {width: 5,height: 3,depth: 5},this.scene);
         // box.position = new Vector3(0,10,15);
         // let boxMat= new StandardMaterial("box", this.scene);
         // boxMat.diffuseColor = new Color3(7,9,0)
         // box.material = boxMat;
         // box.isPickable = true;
         //
         // box.forceSharedVertices();
         // box.increaseVertices(5);
         //
         //
         //
         // const box2 = MeshBuilder.CreateBox("obstacle", {width: 1,height: 1, depth:1},this.scene);
         // box2.position = new Vector3(4.94,1,14.67);
         // box2.checkCollisions= false;
         // box2.isPickable = false;
         //
         // const box3 = MeshBuilder.CreateBox("obstacle", {width: 2,height: 2, depth:2},this.scene);
         // box3.position = new Vector3(4.94,1,14.67);
         // box3.checkCollisions= false;
         // box3.isPickable = false;
         //
         // this.box2Collisionactivator = MeshBuilder.CreateBox("act", {width: 0.5,height: 0.5, depth:0.5},this.scene);
         // this.box2Collisionactivator.parent= box2;
         // this.box2Collisionactivator.checkCollisions = true;
         // this.box2Collisionactivator.isPickable = false;
         //
         // box2.physicsImpostor = new PhysicsImpostor(box2, PhysicsImpostor.BoxImpostor,{mass: 0.1, restitution: 0, friction: 0}, this.scene);
         // box3.physicsImpostor = new PhysicsImpostor(box3, PhysicsImpostor.BoxImpostor,{mass: 1, restitution: 0, friction: 0.1}, this.scene);
         // box.physicsImpostor = new PhysicsImpostor(box, PhysicsImpostor.SoftbodyImpostor,
         //     {
         //         mass: 5,
         //         friction: 0.2,
         //         restitution: 10,
         //         pressure: 6500,
         //         velocityIterations: 20,
         //         positionIterations: 20,
         //         stiffness: 1,
         //         damping: 0.05
         //     }, this.scene);

         // const ground= MeshBuilder.CreateBox("ground",{width: 80, depth: 80},this.scene);
         this.ground= MeshBuilder.CreateBox("groundBaby",{width:200, height: .1, depth:200},this.scene);
         this.ground.physicsImpostor = new PhysicsImpostor(this.ground, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0, friction: 0.1 }, this.scene);
         this.ground.isVisible = true;



        // groundMaterial.diffuseColor = Color3.FromHexString("#00b894")
        // ground.material= groundMaterial;
         const assets=  await this.loadAssets();

         // assets.allMeshes.forEach(mesh=>{
        //     mesh.checkCollisions=true;
        // })
    }
     createStairs() {
     this.ramp= MeshBuilder.CreateBox("stair",{size:5, sideOrientation:2});
     this.ramp.position = new Vector3(2.97,1.05, 3.01);
     this.ramp.rotation.z = 0.41;
     this.ramp.scaling = new Vector3(1.29,0.01,1.61)
     this.ramp.isPickable = true;
     this.ramp.checkCollisions = false;
     this.ramp.isVisible = true;
     this.ramp.physicsImpostor = new PhysicsImpostor(this.ramp,PhysicsImpostor.BoxImpostor,{mass:0, friction:0})
     let boxes =[];
     for(let i=0; i<= 4; i++){
         let box =  MeshBuilder.CreateBox("obstacle"+ i, {width: 2,height: 1 + i, depth:8},this.scene);
         box.position = new Vector3(3 + i,0,3);
         box.checkCollisions = true;
         box.isPickable = false;
         boxes.push(box)
     }
         let stair= Mesh.MergeMeshes(boxes, true)
         // stair.physicsImpostor = new PhysicsImpostor(stair,PhysicsImpostor.BoxImpostor,{mass:0})
    }

     async loadAssets(){
        const result= await SceneLoader.ImportMeshAsync('',"/assets/","factory.babylon",this.scene);
        console.log(result)
        // let env= result.meshes[0];

        // this.groundMesh = result.meshes[1];
        // this.groundMesh.isVisible = false;

        this.leftWall = result.meshes[0];
        let leftWallSize =this.getParentSize(this.leftWall);
         var physicsViewer = new PhysicsViewer(this.scene);
        // this.leftWallImpostor= MeshBuilder.CreateBox("left_wall",{width: leftWallSize.x,height:leftWallSize.y,depth:leftWallSize.z }, this.scene);
        // console.log(this.leftWall.getAbsolutePosition())
        // this.leftWallImpostor.position = this.leftWall.position;
        // this.leftWallImpostor.position.y = 1;
        // this.leftWallImpostor.position.z = this.leftWall.position.z;
        // this.leftWallImpostor.isVisible = true;
        this.leftWall.physicsImpostor = new PhysicsImpostor(this.leftWall,PhysicsImpostor.MeshImpostor,{mass:0, friction:0.1, restitution:0}, this.scene);
         physicsViewer.showImpostor(this.leftWall.physicsImpostor, this.leftWall);

        // return{
        //     ground: this.groundMesh,
        //     env
        // }
    }

    getParentSize (parent) {
        const sizes = parent.getHierarchyBoundingVectors()
        const size = {
            x: sizes.max.x - sizes.min.x,
            y: sizes.max.y -sizes.min.y ,
            z: sizes.max.z - sizes.min.z
        }
        return size
    }
}

export default EnvironnementController
