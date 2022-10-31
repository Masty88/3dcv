import GameObject from "@/GameControllers/GameObject";
import {Matrix, Mesh, MeshBuilder, Quaternion, SceneLoader, TransformNode, Vector3} from "@babylonjs/core";

class PlayerLoader extends GameObject{
    constructor() {
        super();
        this.createCollisionMesh();
    }
    createCollisionMesh(){
        this.mesh = MeshBuilder.CreateBox("player_container", {width: 1.5, depth: 1.5, height: 3});
        this.mesh.isVisible = false;
        this.mesh.isPickable = true;
        this.mesh.checkCollisions = true;

        //move origin of box collider to the bottom of the mesh (to match player mesh)
        this.mesh.bakeTransformIntoVertices(Matrix.Translation(0, 1.5, 0))
        //for collisions
        this.mesh.ellipsoid = new Vector3(1, 1.5, 1);
        this.mesh.ellipsoidOffset = new Vector3(0, 1.5, 0);
        // this.mesh.rotationQuaternion = new Quaternion(0, 0, 0, 0); // rotate the player mesh 180 since we want to see the back of the player

        //Camera target
        this.target= new TransformNode("camera_target");
        this.target.parent= this.mesh;
        this.target.position = new Vector3(0,3,-10)

        //Character Parent
        this.character = new TransformNode("character_parent");
        this.character.rotationQuaternion = new Quaternion(0,1,0,0);
        this.character.parent = this.mesh

        this.mesh.position = new Vector3(0,0,0)

    }

    async loadPlayer(){
            const result= await SceneLoader.ImportMeshAsync(null,"/assets/","cat.glb", this.scene)
            const root = result.meshes[0];

            //body is our actual player mesh
            this.body = root;
            this.body.parent = this.character;
            this.body.isPickable = false; //so our raycasts dont hit ourself
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
