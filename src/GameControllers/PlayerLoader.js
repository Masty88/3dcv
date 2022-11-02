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

class PlayerLoader extends GameObject{
    constructor() {
        super();
        this.createCollisionMesh();
    }
    createCollisionMesh(){
        this.mesh = MeshBuilder.CreateBox("player_container", {width: 1.2, depth: 4.9, height: 3});
        this.mesh.isVisible = true;
        this.mesh.isPickable = false;
        this.mesh.checkCollisions = true;

        //move origin of box collider to the bottom of the mesh (to match player mesh)
        this.mesh.bakeTransformIntoVertices(Matrix.Translation(0, 1.5, 0))
        //for collisions
        this.mesh.ellipsoid = this.mesh.ellipsoid = new Vector3(1, 1.5, 2.9);
        this.mesh.ellipsoidOffset = new Vector3(0, 1.5, 0);

        // this.physicbody = this.mesh.clone("phsycbody",this.mesh,true,false)
        // this.physicbody.isVisible = false;
        // this.physicbody.isPickable = false;
        this.mesh.physicsImpostor = new PhysicsImpostor(this.mesh, PhysicsImpostor.BoxImpostor,{mass: 1, restitution: 0, friction: 0.1}, this.scene);

        // Create player debug ellipsoid shape
        // const ellipsoid = MeshBuilder.CreateSphere("debug", {diameterX: (this.mesh.ellipsoid.x * 2), diameterY: (this.mesh.ellipsoid.y * 2), diameterZ: (this.mesh.ellipsoid.z * 2), segments: 16}, this.scene);
        // ellipsoid.position.addInPlace(this.mesh.ellipsoidOffset);
        // ellipsoid.isPickable = false

        // Set ellipsoid debug shape material
        // var debugmat = new StandardMaterial("debugmat");
        // debugmat.diffuseColor = new Color3(0, 1, 0);
        // debugmat.wireframe = true;
        // ellipsoid.material = debugmat;
        // ellipsoid.parent= this.mesh;

         const yaw = Tools.ToRadians(0);
         const pitch =  Tools.ToRadians(0);
         const roll = Tools.ToRadians(0);
         this.yprQuaternion = Quaternion.RotationYawPitchRoll(yaw, pitch, roll);

        // parent.rotate(new BABYLON.Vector3(0, 0.5, 0), BABYLON.Tools.ToRadians(90));
        this.mesh.rotationQuaternion = this.yprQuaternion;




        //Character Parent
        this.character = new TransformNode("character_parent");
        this.character.parent = this.mesh;
        this.character.isPickable = false;

        this.mesh.position = new Vector3(0,0,0)
        // this.mesh.rotationQuaternion = new Quaternion(0, 1, 0, 0); // rotate the player mesh 180 since we want to see the back of the player

    }

    async loadPlayer(){
            const result= await SceneLoader.ImportMeshAsync(null,"/assets/","cat.glb", this.scene)
            const root = result.meshes[0];

            //body is our actual player mesh
            this.body = root;
            this.body.parent = this.mesh;
            //so our raycasts dont hit ourself
            this.body.isPickable = false;

            //GET animations groups
            this.body.idle = result.animationGroups[0];
            this.body.walk_frw = result.animationGroups[1];

            this.body.getChildMeshes().forEach(m => {
                m.isPickable = false;
                m.receiveShadows= true;
            })
            return {
                    mesh: this.mesh,
                    animationGroups: result.animationGroups
            }
    }
}

export default PlayerLoader;
