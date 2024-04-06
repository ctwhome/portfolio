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
		const camera = new THREE.OrthographicCamera();
		// 75,
		// window.innerWidth / window.innerHeight,
		// 0.1,
		// 1000
		camera.position.set(0, 1, 0); // Position the camera above the plane
		// camera.rotation.x = -Math.PI / 2; // Rotate the camera to face downwards

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

		// Handle window resize
		window.addEventListener('resize', () => {
			const newWidth = window.innerWidth - 18;
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

<div class="absolute -top-28 -left-24 sm:top-0 sm:left-0 pointer-events-none">
	<div class="my-4 mt-28 px-4 flex flex-wrap gap-2 scale-[0.6] sm:scale-100 w-full">
		<button class="btn btn-sm" on:click={() => animateCameraTo({ x: 5, y: 5, z: 2 })}
			>Position 1</button
		>
		<button class="btn btn-sm" on:click={() => animateCameraTo({ x: -5, y: 5, z: -5 })}
			>Position 2</button
		>
		<button class="btn btn-sm" on:click={() => animateCameraTo({ x: 0, y: 10, z: 2 })}
			>Position 3</button
		>
		<button class="btn btn-sm" on:click={changeColor}>Change Cube Color</button>
		<!-- <label
		><input
			type="checkbox"
			on:change={(cameraControls.verticalDragToForward = this.checked)}
		/>vertical drag to move forward</label
	> -->
		<!-- <label> -->
		<!-- <input type="checkbox" bind:checked={cameraControls.dollyToCursor} />dolly to cursor -->
		<!-- </label> -->
		<!-- <br /> -->
		<!-- <label> -->
		<!-- <input type="checkbox" bind:checked={cameraControls.dollyDragInverted} />dolly drag inverted -->
		<!-- </label> -->
		<!-- <br /> -->
		<!-- <br /> -->
		<button
			class="btn btn-sm"
			on:click={() => cameraControls.rotate(45 * THREE.MathUtils.DEG2RAD, 0, true)}
			>rotate theta 45deg</button
		>
		<button
			class="btn btn-sm"
			on:click={() => cameraControls.rotate(-90 * THREE.MathUtils.DEG2RAD, 0, true)}
			>rotate theta -90deg</button
		>
		<button
			class="btn btn-sm"
			on:click={() => cameraControls.rotate(360 * THREE.MathUtils.DEG2RAD, 0, true)}
			>rotate theta 360deg</button
		>
		<button
			class="btn btn-sm"
			on:click={() => cameraControls.rotate(0, 20 * THREE.MathUtils.DEG2RAD, true)}
			>rotate phi 20deg</button
		>

		<button class="btn btn-sm" on:click={() => cameraControls.truck(1, 0, true)}>
			truck( 1, 0 )
		</button>
		<button class="btn btn-sm" on:click={() => cameraControls.truck(0, 1, true)}>
			truck( 0, 1 )
		</button>
		<button class="btn btn-sm" on:click={() => cameraControls.truck(-1, -1, true)}>
			truck( -1, -1 )
		</button>

		<button class="btn btn-sm" on:click={() => cameraControls.dolly(1, true)}>dolly 1</button>
		<button class="btn btn-sm" on:click={() => cameraControls.dolly(-1, true)}>dolly -1</button>

		<button class="btn btn-sm" on:click={() => cameraControls.zoom(camera.zoom / 2, true)}
			>zoom `camera.zoom / 2`</button
		>
		<button class="btn btn-sm" on:click={() => cameraControls.zoom(-camera.zoom / 2, true)}
			>zoom `- camera.zoom / 2`</button
		>

		<button class="btn btn-sm" on:click={() => cameraControls.moveTo(3, 5, 2, true)}>
			move to( 3, 5, 2 )</button
		>
		<!-- <button class="btn btn-sm" on:click={()=> cameraControls.fitToBox(mesh, true)}>fit to the bounding box of the mesh</button -->

		<button class="btn btn-sm" on:click={() => cameraControls.setPosition(-5, 2, 1, true)}
			>move to ( -5, 2, 1 )</button
		>
		<button class="btn btn-sm" on:click={() => cameraControls.setTarget(3, 0, -3, true)}
			>look at ( 3, 0, -3 )</button
		>
		<button class="btn btn-sm" on:click={() => cameraControls.setLookAt(1, 2, 3, 1, 1, 0, true)}
			>move to ( 1, 2, 3 ), look at ( 1, 1, 0 )</button
		>

		<button
			class="btn btn-sm"
			on:click={() =>
				cameraControls.lerpLookAt(-2, 0, 0, 1, 1, 0, 0, 2, 5, -1, 0, 0, Math.random(), true)}
		>
			move between ( -2, 0, 0 ) -> ( 1, 1, 0 ) and ( 0, 2, 5 ) -> ( -1, 0, 0 )
		</button>

		<button class="btn btn-sm" on:click={() => cameraControls.reset(true)}>reset</button>
		<button class="btn btn-sm" on:click={() => cameraControls.saveState()}>saveState</button>

		<button class="btn btn-sm" on:click={() => (cameraControls.enabled = false)}
			>disable mouse/touch controls</button
		>
		<button class="btn btn-sm" on:click={() => (cameraControls.enabled = true)}
			>enable mouse/touch controls</button
		>
	</div>
</div>
<canvas class="w-full h-[400px] -mt-20" bind:this={canvas} />

<style>
	.btn {
		pointer-events: auto;
	}
</style>
