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
       this.shape =  new this.Ammo.btCapsuleShape( 0.7,0.1);
       this.ghostObject = new this.Ammo.btPairCachingGhostObject();


        const transform = new this.Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new this.Ammo.btVector3(0, 1, 0));
        transform.setRotation(new this.Ammo.btQuaternion(-1,0, 0 ,0))

        this.ghostObject.setWorldTransform(transform);
        this.ghostObject.setCollisionShape(this.shape);
        this.ghostObject.setCollisionFlags(16)
        this.ghostObject.setActivationState(4);
        this.ghostObject.activate(true);

        this.controllerK = new this.Ammo.btKinematicCharacterController(
            this.ghostObject,
            this.shape,
            0.2,
            1
        );

        this.controllerK.setGravity(10);
        this.controllerK.canJump();
        this.controllerK.setMaxJumpHeight(1.3);
        this.controllerK.setJumpSpeed(8);
        this.controllerK.setUpInterpolate(true);


        const world = this.scene.getPhysicsEngine().getPhysicsPlugin().world;
        world.addCollisionObject(this.ghostObject, 32, -1);
        world.addAction(this.controllerK);
        this.controllerK.setUseGhostSweepTest(false);

    }

    async loadPlayer(){
            const result= await SceneLoader.ImportMeshAsync(null,"/assets/","cat.glb", this.scene)
            const root = result.meshes[0];
            root.scaling = new Vector3(3,3,-3)


            this.body = root;
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
            })
            return {
                   body: this.body,
                    animationGroups: result.animationGroups
            }
    }
}

export default PlayerLoader;
