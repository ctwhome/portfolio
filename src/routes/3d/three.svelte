<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import CameraControls from 'camera-controls';

	CameraControls.install({ THREE: THREE });

	let canvas;
	let cameraControls;

	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
	const cube = new THREE.Mesh(geometry, material);
	let targetPosition = null; // To store the target position for the camera

	onMount(() => {
		const clock = new THREE.Clock();

		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);
		camera.position.z = 5;

		const renderer = new THREE.WebGLRenderer({
			canvas: canvas,
			antialias: true
		});
		renderer.setSize(window.innerWidth, window.innerHeight);
		// renderer.setClearColor(0xaaaaaa);

		// Enable shadows in the renderer
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFShadowMap;

		// Add a directional light
		const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
		directionalLight.position.set(2, 2, 2);
		directionalLight.castShadow = true;
		scene.add(directionalLight);

		// Set shadow properties for the light
		directionalLight.shadow.mapSize.width = 512;
		directionalLight.shadow.mapSize.height = 512;
		directionalLight.shadow.camera.near = 0.5;
		directionalLight.shadow.camera.far = 500;

		// Make the cube cast and receive shadows
		cube.castShadow = true;
		cube.receiveShadow = true;

		// Add a plane to receive shadows
		const planeGeometry = new THREE.PlaneGeometry(5, 5);
		const planeMaterial = new THREE.MeshStandardMaterial({
			color: 0x888888,
			side: THREE.DoubleSide
		});
		const plane = new THREE.Mesh(planeGeometry, planeMaterial);
		plane.rotation.x = -Math.PI / 2;
		plane.position.y = -1;
		plane.receiveShadow = true;
		scene.add(plane);

		// Add a sky with a cloud texture
		// const skyGeometry = new THREE.SphereGeometry(1000, 32, 32);
		// const skyTexture = new THREE.TextureLoader().load('kart_club.webp');
		// const skyMaterial = new THREE.MeshBasicMaterial({ map: skyTexture, side: THREE.BackSide });
		// const sky = new THREE.Mesh(skyGeometry, skyMaterial);
		// scene.add(sky);

		scene.add(cube);

		cameraControls = new CameraControls(camera, canvas);

		// Handle window resize
		window.addEventListener('resize', () => {
			const newWidth = window.innerWidth;
			const newHeight = window.innerHeight;
			camera.aspect = newWidth / newHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(newWidth, newHeight);
		});

		// Animation loop
		function animate() {
			requestAnimationFrame(animate);
			cube.rotation.x += 0.01;
			cube.rotation.y += 0.01;

			const delta = clock.getDelta();
			cameraControls.update(delta);

			renderer.render(scene, camera);
		}

		animate();

		return () => {
			renderer.dispose();
		};
	});
	// Function to change the cube's color
	function changeColor() {
		material.color.set(Math.random() * 0xffffff);
	}
	// function animateCameraTo(position) {
	// }
	function animateCameraTo(position) {
		cameraControls.moveTo(position.x, position.y, position.z);
		cameraControls.setTarget(0, 0, 0, true); // Set target to cube's position
		cameraControls.smoothTime = 0.5; // Set a small smooth time to avoid camera jerk
		cameraControls.dollyTo(5.0, true);
	}
</script>

<button class="btn" on:click={() => animateCameraTo({ x: 5, y: 5, z: 2 })}>Position 1</button>
<button class="btn" on:click={() => animateCameraTo({ x: -5, y: 5, z: -5 })}>Position 2</button>
<button class="btn" on:click={() => animateCameraTo({ x: 0, y: 10, z: 2 })}>Position 3</button>
<button class="btn" on:click={changeColor}>Change Cube Color</button>

<canvas class="w-full h-[400px]" bind:this={canvas} />
