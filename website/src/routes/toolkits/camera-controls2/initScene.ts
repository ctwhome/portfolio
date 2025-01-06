import * as THREE from 'three';
import CameraControls from 'camera-controls';

export const scene: THREE.Scene | null = new THREE.Scene();
export const camera: THREE.PerspectiveCamera | null = null;
export let renderer: THREE.WebGLRenderer | null = null;
export let cameraControls = null;
const clock = new THREE.Clock();

CameraControls.install({ THREE: THREE });

export function initScene(canvas: HTMLCanvasElement) {
	const size = new THREE.Vector2();

	renderer = new THREE.WebGLRenderer({
		antialias: true,
		canvas: canvas
	});
	renderer.getSize(size);

	// camera = new THREE.PerspectiveCamera(cameraFovDegrees, size.x / size.y, cameraNear, cameraFar);
	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 400, 0.1, 1000);
	camera.position.set(0, -2, 1.7);
	cameraControls = new CameraControls(camera, canvas);

	resize();
	// animate();
	window.addEventListener('resize', resize);

	const geometry = new THREE.BoxGeometry();
	const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
	const cube = new THREE.Mesh(geometry, material);
	scene.add(cube);
	//
	// Add a grid to the scene to help visualize camera movement.
	//
	const gridHelper = new THREE.GridHelper(50, 50);
	gridHelper.position.y = -1;
	scene.add(gridHelper);

	//
	// Add an axes helper to the scene to help with debugging.
	//
	const axesHelper = new THREE.AxesHelper(5);
	scene.add(axesHelper);
}

export function setCameraView(position: number[], up: number[]) {
	camera.position.set(...position);
	camera.up.set(...up);
	camera.lookAt(0, 0, 0);
	animate();
}

function animate(time?: number) {
	const delta = clock.getDelta();
	const updated = cameraControls.update(delta);

	requestAnimationFrame(animate);
	if (updated) {
		renderer.render(scene, camera);
	}
	renderer.render(scene, camera);
}

const resize = () => {
	renderer.setSize(window.innerWidth, 400);
	camera.aspect = window.innerWidth / 400;
	camera.updateProjectionMatrix();
};
