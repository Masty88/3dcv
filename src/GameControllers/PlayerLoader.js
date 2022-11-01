import GameObject from "@/GameControllers/GameObject";
import {
    Matrix,
    Mesh,
    MeshBuilder,
    PhysicsImpostor,
    Quaternion,
    SceneLoader,
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
        this.mesh.ellipsoid = new Vector3(2.8, 1.5, 2.8);
        this.mesh.ellipsoidOffset = new Vector3(0, 1.5, 0);

        // this.mesh.onCollide=(m)=>{
        //     console.log("collision")
        //     if(m.physicsImpostor){
        //         console.log("impulse")
        //         console.log(PlayerController.PLAYER_SPEED * 10)
        //         m.physicsImpostor.applyForce(new Vector3(0,1,1).scale(5), m.getAbsolutePosition().add(Vector3.Zero()))
        //     }
        // }


        //Character Parent
        this.character = new TransformNode("character_parent");
        this.character.parent = this.mesh;
        this.character.isPickable = false;

        this.mesh.position = new Vector3(0,0,0)

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
