import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import fragment from './shaders/fragment.glsl';
import vertex from './shaders/vertex.glsl';
import testTexture from './water.jpg';

export default class Sketch {
    constructor(options) {
        this.container = options.domElement;
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.time = 0;


        this.initCamera();
        this.initScene();
        this.initRenderer();
        this.initControls();


        this.resize();
        this.addObjects();
        this.setupResize();
        this.render();
    }

    initCamera() {
        this.camera = new THREE.PerspectiveCamera(70, this.width / this.height, 0.01, 10);
        this.camera.position.z = 1;
    }

    initScene() {
        this.scene = new THREE.Scene();
    }

    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);
    }

    initControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    }

    resize() {
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();


        if (this.material && this.material.uniforms && this.material.uniforms.resolution) {
            this.material.uniforms.resolution.value.set(this.width, this.height);
        }
    }

    setupResize() {
        window.addEventListener('resize', this.resize.bind(this));
    }

    addObjects() {
        const useSphere = true;
        this.geometry = useSphere
            ? new THREE.SphereBufferGeometry(0.5, 160, 160)
            : new THREE.BoxGeometry(0.2, 0.2, 0.2);


        const useShader = true;
        this.material = useShader
            ? new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 1.0 },
                    uTexture: { value: new THREE.TextureLoader().load(testTexture) },
                    resolution: { value: new THREE.Vector2(this.width, this.height) }
                },
                vertexShader: vertex,
                fragmentShader: fragment,
            })
            : new THREE.MeshNormalMaterial();

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.mesh);
    }

    render() {
        this.time += 0.05;

        // Update shader time uniform if exists
        if (this.material.uniforms && this.material.uniforms.time) {
            this.material.uniforms.time.value = this.time;
        }


        this.mesh.rotation.x = this.time / 2000;
        this.mesh.rotation.y = this.time / 1000;

        this.renderer.render(this.scene, this.camera);
        window.requestAnimationFrame(this.render.bind(this));
    }
}


new Sketch({
    domElement: document.getElementById('container')
});