import GameObject from "@/GameControllers/GameObject";
import {
    Color3,
    Matrix,
    Mesh,
    MeshBuilder,
    PhysicsImpostor,
    Quaternion,
    SceneLoader, StandardMaterial, Tools,
    TransformNode,
    Vector3
} from "@babylonjs/core";
import PlayerController from "@/GameControllers/PlayerController";
import ammo from "ammo.js";

class PlayerLoader extends GameObject{
    constructor(ammo) {
        super();
        this.Ammo = ammo
        this.kinematicController();
    }
     kinematicController(){

       //this.shape =  new this.Ammo.btBoxShape(new this.Ammo.btVector3(1, 0.1, 2));
       this.shape =  new this.Ammo.btCapsuleShape( 0.4,0.1);
       this.ghostObject = new this.Ammo.btPairCachingGhostObject();


        const transform = new this.Ammo.btTransform();
        console.log(transform)
        transform.setIdentity();
        transform.setOrigin(new this.Ammo.btVector3(0, 1, 0));
        transform.setRotation(new this.Ammo.btQuaternion(-1,0, 0 ,0))
        // console.log(transform.getRotation(new this.Ammo.btQuaternion(0,-1,0,0)))

        this.ghostObject.setWorldTransform(transform);
        this.ghostObject.setCollisionShape(this.shape);
        this.ghostObject.setCollisionFlags(16)
        this.ghostObject.setActivationState(4);
        this.ghostObject.activate(true);
        console.log(this.ghostObject)

        this.controllerK = new this.Ammo.btKinematicCharacterController(
            this.ghostObject,
            this.shape,
            0.2,
            1
        );

        // console.log(Ammo.btKinematicCharacterController.prototype)
         console.log(this.controllerK)
        this.controllerK.setGravity(10);
        this.controllerK.canJump();
        this.controllerK.setMaxJumpHeight(1.3);
        this.controllerK.setJumpSpeed(8);
        // this.controllerK.setUpInterpolate(true);


        const world = this.scene.getPhysicsEngine().getPhysicsPlugin().world;
        console.log(world)
        world.addCollisionObject(this.ghostObject, 32, 3);
        world.addAction(this.controllerK);
        this.controllerK.setUseGhostSweepTest(false);


         //

         //this.ghostObject.getWorldTransform().setRotation(new this.Ammo.btQuaternion(0, 0, -1, 1))

       //this.body = MeshBuilder.CreateBox("player", { size: 1 }, this.scene);
       //this.body.position.y = 10;

    }

    async loadPlayer(){
            const result= await SceneLoader.ImportMeshAsync(null,"/assets/","cat.glb", this.scene)
            const root = result.meshes[0];
            // root.rotationQuaternion.y =0;
            // root.rotationQuaternion.x =0;
            // root.rotationQuaternion.z =0;
            root.scaling = new Vector3(3,3,-3)

            // body is our actual player mesh
            this.body = root;
            // this.body = MeshBuilder.CreateBox("sphere", { size: 1 }, this.scene);
            //so our raycasts dont hit ourself
            this.body.isPickable = false;


            //GET animations groups
            this.body.idle = result.animationGroups[4];
            this.body.walk_frw = result.animationGroups[0];
            this.body.walk_back = result.animationGroups[5];
            this.body.walk_left = result.animationGroups[6];
            this.body.walk_right = result.animationGroups[7];
            this.body.jumpUp = result.animationGroups[3];
            this.body.attack = result.animationGroups[1];
            this.body.landing= result.animationGroups[2]

            this.body.getChildMeshes().forEach(m => {
                m.isPickable = false;
                m.receiveShadows= true;
                // m.isVisible = false;
            })
            return {
                   body: this.body,
                    animationGroups: result.animationGroups
            }
    }
}

export default PlayerLoader;
