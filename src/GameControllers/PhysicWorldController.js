import GameObject from "@/GameControllers/GameObject";
import {
    HingeJoint, Mesh,
    MeshBuilder,
    PhysicsImpostor,
    PhysicsViewer,
    Quaternion, SceneLoader,
    TransformNode,
    Vector3
} from "@babylonjs/core";

class PhysicWorldController extends GameObject{
    constructor(player) {
        super();
        this.Z0 = true;
        this.player = player
        // this.getPlayerZone()
    }


    async objectController(){
        this.phyAssets = await this.loadAsset()
        // const physicsRoot = new Mesh("physicsRoot", this.scene);

        // this.createJointPortal()
        this.phyAssets.phyObjects.meshes.forEach((mesh)=>{
            if(mesh.name.includes("parent") && mesh.name.includes("cube")){
                mesh.isVisible = false;
                mesh.setParent(null);
                mesh.physicsImpostor = new PhysicsImpostor(mesh,PhysicsImpostor.BoxImpostor,{mass:10, friction:20});
                if(mesh.name === "box_parent_cube.002_Z1"){
                    for(let i = 0; i < 6; i++){
                        this.box = mesh.clone("box_entry")
                        if(i < 4){
                            this.box.position = new Vector3(mesh.position.x + (Math.random() * 6), mesh.position.y, mesh.position.z + (Math.random() * 4))
                            this.box.rotationQuaternion = Quaternion.FromEulerAngles(1 + (Math.random() * 6),0,0 )
                        }else{
                            this.box.position = new Vector3(mesh.position.x + 1, mesh.position.y + 4, mesh.position.z + 1)
                        }
                    }
                }
            }
            if(mesh.name.includes("portal")){
                mesh.setParent(this.leftDoor);
                mesh.position = new Vector3(-5,-2.2,0)
            }
            if(mesh.name.includes("parent") && mesh.name.includes("cylinder")){
                mesh.isVisible = false;
                mesh.setParent(null);
                mesh.physicsImpostor = new PhysicsImpostor(mesh,PhysicsImpostor.CylinderImpostor,{mass:10, friction:20});
            }

        })

        // this.createPhysicContainer = this.createPhysicObject(this.phyAssets.containerMeshes.meshes,this.scene,0.2)

        // Import GLTF with colliders
        this.newMeshes =  this.phyAssets.containerMeshes.meshes
        this.barrelPhysicsRoot = this.makePhysicsObject(this.newMeshes, this.scene, 0.5);

        this.createBouncingSpheres()
        //this.updateImpostor()
        // this.leftDoor.position = new Vector3(-39.74,0,5.64)
    }

    async loadAsset(){
        const phyObjects = await SceneLoader.ImportMeshAsync('',"/assets/","physic_object.glb",this.scene);
        const containerMeshes = await SceneLoader.ImportMeshAsync("", "/assets/", "hit_box.glb", this.scene);
        return{
            phyObjects,
            containerMeshes
        }
    }

    makePhysicsObject (newMeshes, scene, scaling){
        // Create physics root and position it to be the center of mass for the imported mesh
        var physicsRoot = new Mesh("physicsRoot", scene);
        physicsRoot.position.y = 1;

        // For all children labeled box (representing colliders), make them invisible and add them as a child of the root object
        newMeshes.forEach((m, i)=>{
            if(m.name.indexOf("box") != -1){
                m.isVisible = false;
                physicsRoot.addChild(m);
            }
        })

        // Add all root nodes within the loaded gltf to the physics root
        newMeshes.forEach((m, i)=>{
            if(m.parent == null){
                physicsRoot.addChild(m);
            }
        })

        // Make every collider into a physics impostor
        physicsRoot.getChildMeshes().forEach((m)=>{
            if(m.name.indexOf("box") != -1){
                m.scaling.x = Math.abs(m.scaling.x);
                m.scaling.y = Math.abs(m.scaling.y);
                m.scaling.z = Math.abs(m.scaling.z);
                m.physicsImpostor = new PhysicsImpostor(m, PhysicsImpostor.BoxImpostor, { mass: 1, friction: 0.7 }, scene);
            }
        })

        // Scale the root object and turn it into a physics impsotor
        physicsRoot.scaling.scaleInPlace(scaling);
        physicsRoot.physicsImpostor = new PhysicsImpostor(physicsRoot, PhysicsImpostor.NoImpostor, { mass: 3 }, scene);

        return physicsRoot;
    }

    createBouncingSpheres(){
        for(let i = 0; i <3;i++){
            this.bounceSphere = MeshBuilder.CreateSphere("bounce",{diameter:0.2}, this.scene);
            // this.bounceSphere.setParent(this.scene.getTransformNodeByName("bouncig_position"))
            this.bounceSphere.physicsImpostor = new PhysicsImpostor(this.bounceSphere, PhysicsImpostor.SphereImpostor,{ignoreParent: true, mass:1,restitution:0.7,friction:0.1})
            this.bounceSphere.position = this.scene.getTransformNodeByName("bouncig_position").position;
        }
      // return this.bounceSphere

    }

    createJointPortal(){
        this.rightPivot = MeshBuilder.CreateCylinder("rightPivot", {diameter:0.2, height: 3.2}, this.scene);
        this.rightPivot.position = new Vector3(-40.1,2.13,5.65)
        this.rightPivot.physicsImpostor = new PhysicsImpostor(this.rightPivot, PhysicsImpostor.SphereImpostor, { mass: 0, friction:1}, this.scene);
        this.rightPivot.isVisible = false

        this.leftDoor = MeshBuilder.CreateBox("leftDoor", {height: 3.5, width: 10, depth:0.2}, this.scene);
        this.leftDoor.position = new Vector3(this.rightPivot.position.x,0,this.rightPivot.position.z)
        // this.leftDoor.physicsImpostor.setAngularVelocity(new Vector3(0,90,0))
        this.leftDoor.rotationQuaternion = Quaternion.FromEulerAngles(0,1.6,0)
        this.leftDoor.physicsImpostor = new PhysicsImpostor(this.leftDoor, PhysicsImpostor.BoxImpostor, { mass: 4000, friction:5}, this.scene);
        this.leftDoor.isVisible = false;


        this.jointLeft = new HingeJoint({
            mainPivot: new Vector3(0, 0, 0),
            connectedPivot: new Vector3(-5,0,0),
            mainAxis: new Vector3(0, 1, 0),
            connectedAxis: new Vector3(0, 1, 0),
            nativeParams:{
            }
        })

        this.rightPivot.physicsImpostor.addJoint(this.leftDoor.physicsImpostor, this.jointLeft)

        this.stopImpostor = new TransformNode("stop",this.scene);
        this.stopImpostor.position = new Vector3(-33.64, 1, 8.05)
        this.stop = MeshBuilder.CreateBox("stop", {height: 1, width: 1, depth:1}, this.scene);
        this.stop.isVisible = false;
        this.stop.position = this.stopImpostor.position
    }

    getPlayerZone(){
        if(this.player.body.intersectsMesh(this.scene.getMeshByName("Zone1"))){
            console.log("inter")
            this.Z1 = true
            this.Z2 = false
            this.Z0 = false
        }
        if(this.player.body.intersectsMesh(this.scene.getMeshByName("Zone2"))){
            this.Z1 = false
            this.Z2 = true
            this.Z0 = false
        }
       this.setStaticImpostor()
    }

    setStaticImpostor(){
        console.log("set")
        if(this.Z0){
            console.log("you are in Z0")
            console.log(this.Z0)
            this.scene.skeletons.forEach((skel)=>{
                skel.prepare()
            })
            this.scene.meshes.forEach((mesh)=>{
                mesh.alwaysSelectAsActiveMesh = true
                this.scene.freezeActiveMeshes(null,
                    ()=>{console.log("succes")},
                    (err)=>{console.log(err)})
                if(mesh.physicsImpostor){
                    mesh.physicsImpostor.sleep()
                }
            })
        }
      if(this.Z1){
            console.log("you are in Z1")
            this.scene.meshes.forEach((mesh)=>{
                if(mesh.physicsImpostor && mesh.name.includes("Z1")){
                    mesh.physicsImpostor.wakeUp()
                    this.scene.unfreezeActiveMeshes()
                }
            })
        }
    }

    updateImpostor(){
        this.beforeLoop = ()=>{
            // if( this.leftDoor.intersectsPoint(this.stopImpostor.position)){
            //     this.jointLeft.physicsJoint.setLimit(-Math.PI/2,Math.PI/4, .9, .01, 10);
            //     this.leftDoor.physicsImpostor.setMass(0);
            // }
            this.getPlayerZone()
            // if()
        }
    }

}

export  default PhysicWorldController;
