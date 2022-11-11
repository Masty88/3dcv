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
        this.mesh = MeshBuilder.CreateBox("player_container", {width: 2, depth: 3.5, height: 2}, this.scene);
        this.mesh.isVisible = false;
        this.mesh.isPickable = false;
        // this.mesh.material.wireframe = true

        // this.physicBody=MeshBuilder.CreateBox("player_container", {width: 2, depth: 1, height: 2}, this.scene);
        // this.physicBody.position= new Vector3(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z);
        // this.physicBody.position.z = 1.45;
        // this.physicBody.position.y = 0;
        // this.physicBody.bakeTransformIntoVertices(Matrix.Translation(0, 1, 0));
        // this.physicBody.physicsImpostor = new PhysicsImpostor(this.physicBody,PhysicsImpostor.BoxImpostor,{mass:10,friction:0.7});

        //move origin of box collider to the bottom of the mesh (to match player mesh)
        this.mesh.bakeTransformIntoVertices(Matrix.Translation(0, 1, 0))
        //for collisions
        this.mesh.ellipsoid = this.mesh.ellipsoid = new Vector3(2, 1, 1.8);
        this.mesh.ellipsoidOffset = new Vector3(0, 1.5, 0);

         // this.mesh.physicsImpostor = new PhysicsImpostor(this.mesh, PhysicsImpostor.BoxImpostor,{mass: 2, restitution: 1, friction: 0.1}, this.scene);

        // Create player debug ellipsoid shape
        // const ellipsoid = MeshBuilder.CreateSphere("debug", {diameterX: (this.mesh.ellipsoid.x * 2), diameterY: (this.mesh.ellipsoid.y * 2), diameterZ: (this.mesh.ellipsoid.z * 2), segments: 16}, this.scene);
        // ellipsoid.position.addInPlace(this.mesh.ellipsoidOffset);
        // ellipsoid.isPickable = false
        //
        // // Set ellipsoid debug shape material
        // var debugmat = new StandardMaterial("debugmat");
        // debugmat.diffuseColor = new Color3(0, 1, 0);
        // debugmat.wireframe = true;
        // ellipsoid.material = debugmat;
        // ellipsoid.parent= this.mesh;

         this.yaw = Tools.ToRadians(0);
         this.pitch =  Tools.ToRadians(0);
         this.roll = Tools.ToRadians(0);
         this.yprQuaternion = Quaternion.RotationYawPitchRoll(this.yaw, this.pitch, this.roll);


        // parent.rotate(new BABYLON.Vector3(0, 0.5, 0), BABYLON.Tools.ToRadians(90));
        this.mesh.rotationQuaternion = this.yprQuaternion;

        //Character Parent
        this.character = new TransformNode("character_parent");
        this.character.parent = this.mesh;
        this.character.isPickable = false;

        this.mesh.position = new Vector3(-3,0,0)
    }

    async loadPlayer(){
            const result= await SceneLoader.ImportMeshAsync(null,"/assets/","cat.glb", this.scene)
            const root = result.meshes[0];
            root.scaling = new Vector3(7,7,-7)

            //body is our actual player mesh
            this.body = root;
            this.body.parent = this.mesh;
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
                    mesh: this.mesh,
                    animationGroups: result.animationGroups
            }
    }
}

export default PlayerLoader;
