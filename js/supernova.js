var container, scene, camera, renderer, controls, stats, sprite, nebMaterial;
var mouseX = 0;
mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

//show zoom tip after some time 
setTimeout(function() {
    document.getElementById('zoomIN').style.opacity = 1;
}, 1000);

function init() {
    // SCENE
    scene = new THREE.Scene();
    // CAMERA
    var SCREEN_WIDTH = window.innerWidth,
        SCREEN_HEIGHT = window.innerHeight;
    var VIEW_ANGLE = 45,
        ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
        NEAR = 0.01,
        FAR = 20000;
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    scene.add(camera);
    camera.position.set(0, 0, 600);
    camera.lookAt(scene.position);

    // RENDERER
    if (Detector.webgl)
        renderer = new THREE.WebGLRenderer({
            antialias: true
        });
    else
        renderer = new THREE.CanvasRenderer();
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    container = document.getElementById('ThreeJS');
    container.appendChild(renderer.domElement);

    // var light = new THREE.PointLight(0xffffff);
    // light.position.set(0,250,0);
    //scene.add(light);

    //EVENTS
    THREEx.WindowResize(renderer, camera);
    THREEx.FullScreen.bindKey({
        charCode: 'm'.charCodeAt(0)
    });

    // CONTROLS
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.damping = 0.9;
    controls.addEventListener('change', render)


    for (var j = 0; j < 10; j++) {
        createObjects();
    }

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    // document.addEventListener( 'touchstart', onDocumentTouchStart, false );
    // document.addEventListener( 'touchmove', onDocumentTouchMove, false );
}

function createObjects() {
    //loop to create nebula
    for (var j = 0; j < 3; j++) {
        //set initial random position
        var x = (Math.random() - 0.5) * 250;
        var y = (Math.random() - 0.5) * 250;
        var z = (Math.random() - 0.5) * 100;

        //set initial random scaling
        var r = Math.random() - 0.5
        var xs = 900 * r;
        var ys = 900 * r;
        var zs = 200 * r;
        //compress distance between clouds
        x *= .2;
        y *= .2;

        var nebTexture = THREE.ImageUtils.loadTexture('img/cloud' + j + '.png');
        var nebMaterial = new THREE.SpriteMaterial({
            map: nebTexture,
            useScreenCoordinates: false,
            name: 'clouds',
            depthWrite: false,
            depthTest: false
        });
        var sprite = new THREE.Sprite(nebMaterial);

        sprite.position.set(x, y, z);
        sprite.scale.set(xs, ys, zs); // imageWidth, imageHeight
        sprite.material.opacity = 0.5;
        sprite.position.multiplyScalar(4)

        scene.add(sprite);
    }
    // loop to create background of 3D stars
    for (var j = 0; j < 30; j++) {
        //set initial random position
        var x = (Math.random() - 0.5) * 2300;
        var y = (Math.random() - 0.5) * 2300;
        var z = (Math.random() - 0.5) * -3800;

        var a = Math.random() * 360;
        var s = .25 + Math.random();

        var starTexture = THREE.ImageUtils.loadTexture('img/star.png');
        var starMaterial = new THREE.SpriteMaterial({
            map: starTexture,
            useScreenCoordinates: false
        });
        var sprite2 = new THREE.Sprite(starMaterial);

        sprite2.position.set(x, y, z);
        sprite2.scale.set(80, 80); // imageWidth, imageHeight
        sprite2.material.opacity = 0.75;
        scene.add(sprite2);
    }
}


function onDocumentMouseMove(event) {

    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;

}

function onDocumentTouchStart(event) {

    if (event.touches.length === 1) {

        event.preventDefault();

        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY;
    }

}

function onDocumentTouchMove(event) {

    if (event.touches.length === 1) {

        event.preventDefault();

        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY;

    }

}

function animate() {

    var d = camera.position.z;
    var info = document.getElementById('introInfo');
    var infoBox = document.getElementById('textBoxBG');

    //remove the zoom tip if the user is already zooming
    if (d != 600) {
        document.getElementById('zoomIN').style.opacity = 0;
    }
    if (d > 800) {
        info.style.display = "block";
        infoBox.style.width = 950 + 'px';
        document.getElementsByClassName('nextBG')[0].style.width = 70 + 'px';

        setTimeout(function() {
            info.style.opacity = 1;
            document.getElementsByClassName('next')[0].style.opacity = 1;
        }, 500);
    } else if (d < 800) {
        info.style.display = "none";
        info.style.opacity = 0;
        infoBox.style.width = 0 + 'px';
    }

    requestAnimationFrame(animate);
    render();
    update();
}

function update() {
    // How far you can orbit vertically, upper and lower limits.
    // Range is 0 to Math.PI radians.
    controls.minPolarAngle = 0; // radians
    controls.maxPolarAngle = Math.PI; // radians

    // How far you can orbit horizontally, upper and lower limits.
    // If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
    controls.minAzimuthAngle = 0; // radians
    controls.maxAzimuthAngle = Math.PI; // radians

    controls.minDistance = 200;
    controls.maxDistance = 1500;

    controls.update();
    //stats.update();
}

function render() {
    var time = Date.now() * 0.00005;
    var j = 0;

    for (i = 0; i < scene.children.length - 1; i++) {
        if (scene.__objects[i].material.name == 'clouds' && j < 15) {
            scene.__objects[i].rotation += 0.001 * ((Math.random() * -1 * i / 300) / 2);
            j += 1;
        } else if (scene.__objects[i].material.name == 'clouds') {
            scene.__objects[i].rotation += 0.001 * ((Math.random() * i / 300) / 2);
        }

    }
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}
