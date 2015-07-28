(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelRequestAnimationFrame = window[vendors[x] +
            'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                    callback(currTime + timeToCall);
                },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}())

var layers = [],
    objects = [],

    world = document.getElementById('world'),
    viewport = document.getElementById('viewport'),

    d = 0,
    p = 400,
    worldXAngle = 0,
    worldYAngle = 0;

viewport.style.webkitPerspective = p;
viewport.style.MozPerspective = p;
viewport.style.oPerspective = p;

generate();

//show zoom tip after some time 
if (d == 0) {
    setTimeout(function() {
       document.getElementById('zoomIN').style.opacity = 1;
    }, 2500);
} 

function createCloud() {

    var div = document.createElement('div');
    div.className = 'cloudBase';
    var x = 25 - (Math.random() * 250);
    var y = 25 - (Math.random() * 250);
    var z = 25 - (Math.random() * 50);
    //var t = 'translateX( ' + x + 'px ) translateY( ' + y + 'px ) translateZ( ' + z + 'px )';
    var t = 'translate3d(' + x +'px, ' + y + 'px, ' + z + 'px)';
    div.style.webkitTransform = t;
    div.style.MozTransform = t;
    div.style.oTransform = t;
    world.appendChild(div);

    for (var j = 0; j < 3; j++) {
        var cloud = document.createElement('img');
        cloud.style.opacity = 0;
        var r = Math.random();
        var src = '../img/cloud' + j + '.png';
        (function(img) {
            img.addEventListener('load', function() {
                img.style.opacity = .5;
            })
        })(cloud);
        cloud.setAttribute('src', src);
        cloud.className = 'cloudLayer';

        var x = 256 - (Math.random() * 1);
        var y = 256 - (Math.random() * 1);
        var z = 250 - (Math.random() * 1);
        var a = Math.random() * 360;
        var s = .25 + Math.random();
        x *= .2;
        y *= .2;
        cloud.data = {
            x: x,
            y: y,
            z: z,
            a: a,
            s: s,
            speed: .025 * Math.random()
        };
        //var t = 'translateX( ' + x + 'px ) translateY( ' + y + 'px ) translateZ( ' + z + 'px ) rotateZ( ' + a + 'deg ) scale( ' + s + ' )';
        var t = 'translate3d(' + x +'px, ' + y + 'px, ' + z + 'px) rotateZ( ' + a + 'deg ) scale( ' + s + ' )';
        cloud.style.webkitTransform = t;
        cloud.style.MozTransform = t;
        cloud.style.oTransform = t;

        div.appendChild(cloud);
        layers.push(cloud);
    }

    return div;
}

function createStar() {

    var div = document.createElement('div');
    div.className = 'cloudBase';
    var x = 2200 - (Math.random() * 5150);
    var y = 2200 - (Math.random() * 5200);
    var z = -5 - (Math.random() * 7500);
    //var t = 'translateX( ' + x + 'px ) translateY( ' + y + 'px ) translateZ( ' + z + 'px )';
    var t = 'translate3d(' + x +'px, ' + y + 'px, ' + z + 'px)';
    div.style.webkitTransform = t;
    div.style.MozTransform = t;
    div.style.oTransform = t;
    world.appendChild(div);

    for (var j = 0; j < 1; j++) {
        var cloud = document.createElement('img');
        cloud.style.opacity = 0;
        var r = Math.random();
        var src = '../img/star.png';
        (function(img) {
            img.addEventListener('load', function() {
                img.style.opacity = .7;
            })
        })(cloud);
        cloud.setAttribute('src', src);
        cloud.className = 'cloudLayer';

        var x = 256 - (Math.random() * 100);
        var y = 256 - (Math.random() * 100);
        var z = 500 - (Math.random() * 500);
        var a = Math.random() * 360;
        var s = .25 + Math.random();
        x *= .2;
        y *= .2;
        cloud.data = {
            x: x,
            y: y,
            z: z,
            a: a,
            s: s,
            speed: .01 * Math.random()
        };
        //var t = 'translateX( ' + x + 'px ) translateY( ' + y + 'px ) translateZ( ' + z + 'px ) rotateZ( ' + a + 'deg ) scale( ' + s + ' )';
        var t = 'translate3d(' + x +'px, ' + y + 'px, ' + z + 'px) rotateZ( ' + a + 'deg ) scale( ' + s + ' )';
        cloud.style.webkitTransform = t;
        cloud.style.MozTransform = t;
        cloud.style.oTransform = t;

        div.appendChild(cloud);
        layers.push(cloud);
    }

    return div;
}
window.addEventListener('mousewheel', onContainerMouseWheel);
window.addEventListener('DOMMouseScroll', onContainerMouseWheel);

window.addEventListener('mousemove', function(e) {
    worldYAngle = -(.5 - (e.clientX / window.innerWidth)) * 30;
    worldXAngle = (.5 - (e.clientY / window.innerHeight)) * 30;
    updateView();
});

function generate() {
    objects = [];
    if (world.hasChildNodes()) {
        while (world.childNodes.length >= 1) {
            world.removeChild(world.firstChild);
        }
    }
    for (var j = 0; j < 10; j++) {
        objects.push(createCloud());
    }
    for (var j = 0; j < 100; j++) {
        objects.push(createStar());
    }
}

function updateView() {
    var t = 'translateZ( ' + d + 'px ) rotateX( ' + worldXAngle + 'deg) rotateY( ' + worldYAngle + 'deg)';

    //var t = 'rotateX( ' + worldXAngle + 'deg) rotateY( ' + worldYAngle + 'deg)';
    // to remove nebula element when zoomed out enough

    //remove the zoom tip if the user is already zooming
    if (d != 0) {
        document.getElementById('zoomIN').style.opacity = 0;
    }

    if (d < -250) {
        d = -250;
        introInfo.style.display = "block";
        textBoxBG.style.width = 950 + 'px';
        document.getElementsByClassName('nextBG')[0].style.width = 70 + 'px';

        setTimeout(function() {
            introInfo.style.opacity = 1;
            document.getElementsByClassName('next')[0].style.opacity = 1;
        }, 500);
    } else if (d > -250) {
        introInfo.style.display = "none";
        introInfo.style.opacity = 0;
        textBoxBG.style.width = 0 + 'px';
    }

    world.style.webkitTransform = t;
    world.style.MozTransform = t;
    world.style.oTransform = t;
}

function onContainerMouseWheel(event) {

    event = event ? event : window.event;
    d = d - (event.detail ? event.detail * -5 : event.wheelDelta / 8);
    updateView();

}

function update() {

    for (var j = 0; j < layers.length; j++) {
        var layer = layers[j];
        layer.data.a += layer.data.speed;
        //var t = 'translateX( ' + layer.data.x + 'px ) translateY( ' + layer.data.y + 'px ) translateZ( ' + layer.data.z + 'px ) rotateY( ' + (-worldYAngle) + 'deg ) rotateX( ' + (-worldXAngle) + 'deg ) rotateZ( ' + layer.data.a + 'deg ) scale( ' + layer.data.s + ')';
        var t = 'translate3d(' + layer.data.x +'px, ' + layer.data.y + 'px, ' + layer.data.z + 'px) rotateY( ' + (-worldYAngle) + 'deg ) rotateX( ' + (-worldXAngle) + 'deg ) rotateZ( ' + layer.data.a + 'deg ) scale( ' + layer.data.s + ')';
        layer.style.webkitTransform = t;
        layer.style.MozTransform = t;
        layer.style.oTransform = t;
    }

    requestAnimationFrame(update);

}

update();
