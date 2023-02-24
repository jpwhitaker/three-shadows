import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import * as THREE from "three";
import { useEffect } from "react";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js"
import GUI from 'lil-gui'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";




function Home() {

  useEffect(() => {
    const gui = new GUI();
    const settings = {
        shadowMapType: "pcfsoft",
        physicallyCorrectLights: false,
        shadowMapSize: 2000,
        shadowRadius: 5,
        bias: 0,
        normalBias: 0,
        move: true
    }
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector("#bg"),
      antialias: true
    });

    scene.background = new THREE.Color(0x4e9fe5);

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.set(10, 2, 0);
    renderer.render(scene, camera);
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.enabled = true;


    scene.add(new THREE.AmbientLight( 0xffffff, 0.5 ));

    // const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    // hemiLight.position.set(0, 20, 0);
    // scene.add(hemiLight);

    // const dirLight = new THREE.DirectionalLight(0xffffff);
    // dirLight.position.set(-3, 10, -10);
    // scene.add(dirLight);

    // const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    // ambientLight.position.set(0, 0, 0);
    // scene.add(ambientLight);

    const controls = new OrbitControls(camera, renderer.domElement);

    const loader = new GLTFLoader();

    let room;
    loader.load("/cube.glb", function (gltf) {
      const room = gltf.scene
      room.position.y = 7.5
      var newMaterial = new THREE.MeshStandardMaterial({color: 0xffffff});

      room.traverse((child) => {
        if (child.isMesh) {
          child.material = newMaterial;
          child.castShadow = true
          child.receiveShadow = true
        }
      });
      scene.add(room);
    });

    if (room) {
      // For example, change the color of the model

    }

    const plane = new THREE.Mesh(new THREE.PlaneGeometry(500, 500, 32), new THREE.MeshPhongMaterial({ color: 0xfab74b}));
    plane.rotation.x = - Math.PI / 2
    plane.receiveShadow = true
    scene.add(plane);


    // const geometry = new THREE.BoxGeometry( 1, 15, 7 );
    // const material = new THREE.MeshPhongMaterial( {color: 0xFFFFFF} );
    // const cube = new THREE.Mesh( geometry, material );
    // cube.position.y = 7.5; 
    // cube.position.z = -4.5; 
    // cube.receiveShadow = true
    // cube.castShadow = true
    // scene.add( cube );

    // const geometry2 = new THREE.BoxGeometry( 1, 15, 7 );
    // const material2 = new THREE.MeshPhongMaterial( {color: 0xFFFFFF} );
    // const cube2 = new THREE.Mesh( geometry2, material2);
    // cube2.position.y = 7.5;
    // cube2.position.z = -4.5; 
    // cube2.position.x = 16; 
    // cube2.receiveShadow = true
    // cube2.castShadow = true
    // scene.add( cube2 );


    // //back wall
    // const geometry3 = new THREE.BoxGeometry( 1, 15, 15 );
    // const material3 = new THREE.MeshPhongMaterial( {color: 0xFFFFFF} );
    // const cube3 = new THREE.Mesh( geometry3, material3);
    // cube3.position.y = 7.5;
    // cube3.position.x = 8;
    // cube3.position.z = -7.5 
    // cube3.rotateY(Math.PI / 2)
    // cube3.receiveShadow = true
    // cube3.castShadow = true
    // scene.add( cube3 );


    // //top
    // const geometry4 = new THREE.BoxGeometry( 1, 7, 17 );
    // const material4 = new THREE.MeshPhongMaterial( {color: 0xFFFFFF} );
    // const cube4 = new THREE.Mesh( geometry4, material4);
    // cube4.position.y = 15.5;
    // cube4.position.x = 8;
    // cube4.position.z = -4.5 
    // cube4.rotateY(Math.PI / 2)
    // cube4.rotateZ(Math.PI / 2)
    // cube4.receiveShadow = true
    // cube4.castShadow = true
    // scene.add( cube4 );


    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.x += 20
    directionalLight.position.y += 20
    directionalLight.position.z += 20
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = settings.shadowMapSize;
    directionalLight.shadow.mapSize.height = settings.shadowMapSize;
    directionalLight.shadow.radius = settings.shadowRadius
    directionalLight.shadow.blurSamples = 50
    const d = 25;
    directionalLight.shadow.camera.near = 0.5
    directionalLight.shadow.camera.far = 60
    directionalLight.shadow.camera.left = - d;
    directionalLight.shadow.camera.right = d;
    directionalLight.shadow.camera.top = d;
    directionalLight.shadow.camera.bottom = - d;
    directionalLight.shadow.bias = settings.bias;
    scene.add(directionalLight);
    scene.add( new THREE.CameraHelper( directionalLight.shadow.camera ) );


    const resizeWindow = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };

    window.addEventListener("resize", resizeWindow);

    function animate() {
      requestAnimationFrame(animate);

      controls.autoRotate = false;
      controls.autoRotateSpeed = 4.0;

      controls.update();

      if(settings.move){
        const time = Date.now() * 0.0005;
        directionalLight.position.x = Math.sin(time * 0.7) * 20;
        directionalLight.position.z = Math.cos(time * 0.7) * 20;
      }

      renderer.render(scene, camera);
    }

    animate();


    gui.add( settings, 'shadowMapType', ["basic", "pcf","pcfsoft", "vsm"])
        .onChange( (value: string) => {
            switch (value) {
              case 'basic':
                renderer.shadowMap.type = THREE.BasicShadowMap;
                break;
              case 'pcf':
                renderer.shadowMap.type = THREE.PCFShadowMap;
                break;
              case 'pcfsoft':
                renderer.shadowMap.type = THREE.PCFSoftShadowMap;
                break;
              case 'vsm':
                renderer.shadowMap.type = THREE.VSMShadowMap;
                break;
              default:
                console.error('Invalid shadow map type');
            }
            console.log(renderer.shadowMap.type)
        } );
    gui.add(settings, "physicallyCorrectLights")
        .onChange( (value: boolean) => {
            renderer.physicallyCorrectLights = settings.physicallyCorrectLights
        })
    gui.add( settings, 'shadowMapSize', 0, 12000, 200 )
        .onChange( (value: number) => {
            directionalLight.shadow.map.dispose(); // important
            directionalLight.shadow.mapSize = new THREE.Vector2(value,value)
        })

    gui.add( settings, 'shadowRadius', 0, 100, 1 )
    .onChange( (value: number) => {
        directionalLight.shadow.radius = value;
        directionalLight.shadow.updateMatrices(directionalLight);
    })
    gui.add( settings, 'bias', -0.002, 0.002, 0.0001 )
    .onChange( (value: number) => {
        directionalLight.shadow.bias = value;
    })

    gui.add( settings, 'normalBias', -10, 10, 0.1 )
    .onChange( (value: number) => {
        directionalLight.shadow.normalBias = value;
    })

    gui.add( settings, "move" )
  }, []);


  return <canvas id="bg"></canvas>;
}

export default Home;