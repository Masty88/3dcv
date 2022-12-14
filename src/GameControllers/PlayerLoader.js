import GameObject from "@/GameControllers/GameObject";
import {Matrix, MeshBuilder, Quaternion, SceneLoader, Vector3} from "@babylonjs/core";

class PlayerLoader extends GameObject{
    constructor() {
        super();
        this.createCollisionMesh();
    }
    createCollisionMesh(){
        this.mesh = MeshBuilder.CreateBox("outer", {width: 1.5, depth: 1.5, height: 3});
        this.mesh.isVisible = true;
        this.mesh.isPickable = true;
        this.mesh.checkCollisions = true;

        //move origin of box collider to the bottom of the mesh (to match player mesh)
        this.mesh.bakeTransformIntoVertices(Matrix.Translation(0, 1.5, 0))
        //for collisions
        this.mesh.ellipsoid = new Vector3(1, 1.5, 1);
        this.mesh.ellipsoidOffset = new Vector3(0, 1.5, 0);
        this.mesh.rotationQuaternion = new Quaternion(0, 1, 0, 0); // rotate the player mesh 180 since we want to see the back of the player
    }

    async loadPlayer(){
            const result= await SceneLoader.ImportMeshAsync(null,"/assets/","cat.glb", this.scene)
            const root = result.meshes[0];

            //body is our actual player mesh
            this.body = root;
            this.body.parent = this.mesh;
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
