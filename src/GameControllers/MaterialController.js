import GameObject from "@/GameControllers/GameObject";
import {Color3, GlowLayer, Scene, StandardMaterial, Texture} from "@babylonjs/core";

class MaterialController extends GameObject{
    constructor(environnement, physics) {
        super();
        this.environnemet = environnement;
        this.physics = physics;
        this.setGlow();
    }

    setGlow() {
        const glow = new GlowLayer("glow", this.scene);
        glow.intensity = 0.8;
        // this.environnemet.city.result.meshes.forEach((mesh)=>{
        //     if(mesh.name.includes("glow")){
        //         console.log(mesh.name)
        //         glow.addIncludedOnlyMesh(mesh)
        //     }
        // })
        // this.physics.phyAssets.phyObjects.meshes.forEach((mesh)=>{
        //     if(mesh.name.includes("glow")){
        //         console.log(mesh.name)
        //         glow.addIncludedOnlyMesh(mesh)
        //     }
        // })
        //this.setEmission();
        this.setMeshToGlow()
        this.setMaterial()
        // Fog
        this.scene.fogMode = Scene.FOGMODE_EXP;
        //BABYLON.Scene.FOGMODE_NONE;
        //BABYLON.Scene.FOGMODE_EXP;
        //BABYLON.Scene.FOGMODE_EXP2;
        //BABYLON.Scene.FOGMODE_LINEAR;

        this.scene.fogColor = new Color3(0.9, 0.9, 0.85);
        this.scene.fogDensity = 0.002;
    }

    setEmission(){
        if(this.scene.getMaterialByName("glow_text")){
            this.glowText = this.scene.getMaterialByName("glow_text");
            this.glowText.emissiveColor = new Color3(0.769,0.663,0.110);
        }
        if(this.scene.getMaterialByName("glowing_danger")){
            this.glowDanger = this.scene.getMaterialByName("glowing_danger");
            this.glowText.emissiveColor = new Color3(0.769,0.663,0.110);
        }
    }

    setMeshToGlow(){
        this.glowingMesh = this.scene.meshes.forEach((mesh)=>{
            if(mesh.name.includes("glowing")){
                this.glowText = this.scene.getMaterialByName("glow_text");
                mesh.material = this.glowText;
                this.glowText.emissiveColor = new Color3(0.769,0.663,0.110);
            }
            if(mesh.name.includes("danger_light")){
                this.glowDanger = this.scene.getMaterialByName("glowing_danger");
                this.glowDanger.emissiveColor = new Color3(0.769,0.663,0.110);
                // this.glowDanger.emissiveColor = new Color3(0.925,0.208,0.125);
                // this.glowDanger.em
            }
        })
    }

    setMaterial(){
        this.pivot = this.scene.getMeshByName("rightPivot");
        if(this.pivot){
            this.pivotMaterial = new StandardMaterial("rustMat", this.scene)
            this.pivotMaterial.diffuseTexture = new Texture("/textures/rust.jpg")
            this.pivot.material = this.pivotMaterial
        }
    }
}

export default MaterialController;
