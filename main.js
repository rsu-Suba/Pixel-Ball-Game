const canvas = document.getElementById("maincanvas");
const WIDTH = 600;
const HEIGHT = (WIDTH / 4) * 5;

const Engine = Matter.Engine;
const Render = Matter.Render;
const Runner = Matter.Runner;
const Bodies = Matter.Bodies;
const Composite = Matter.Composite;
const Events = Matter.Events;
const World = Matter.World;

let objects = [];
let canDrop = true;
let ground;
let balli = 0;
let ballsize = [25, 50, 75, 100, 125, 150, 175, 200];
let score = 0;
let ballcolor = [
   "#bc8cff",
   "#8cffea",
   "#ff8c9c",
   "#c2ff8c",
   "#ffc68c",
   "#ff87fb",
   "#5afab7",  
   "#b50000",
];
const previewSizeSpan = document.getElementById("previewSize");
const scoreSpan = document.getElementById("score");
scoreSpan.innerHTML = `スコア : 0`;

const engine = Engine.create();
const render = Render.create({
   canvas: canvas,
   element: document.body,
   engine: engine,
   options: {
      width: WIDTH,
      height: HEIGHT,
      showAngleIndicator: true,
      showCollisions: true,
      showDebug: false,
      showIds: true,
      showVelocity: true,
      hasBounds: true,
      wireframes: false,
      background: "#efeaff",
   },
});

console.log(canvas.offsetWidth);

ground = Bodies.rectangle(WIDTH / 2, HEIGHT, WIDTH, 30, {
   isStatic: true,
   collisionFilter: {category: 0x0002},
});
const left = Bodies.rectangle(0, HEIGHT / 2 + 40, 25, HEIGHT - 80, {
   isStatic: true,
   collisionFilter: {category: 0x0001},
});
const right = Bodies.rectangle(WIDTH, HEIGHT / 2 + 40, 25, HEIGHT - 80, {
   isStatic: true,
   collisionFilter: {category: 0x0001},
});

World.add(engine.world, [ground, left, right]);
Engine.run(engine);
Render.run(render);

Events.on(engine, "collisionStart", function (event) {
   let pairs = event.pairs;
   for (const pair of pairs) {
      const { bodyA, bodyB } = pair;
      console.log(bodyA.label);
      console.log(bodyB.label);
      if (pair.bodyA === ground) {
         console.log("ground");
         canDrop = true;
      }
      if (bodyA.label === "Circle Body") {
         canDrop = true;
         console.log("ball");
         if (bodyA.circleRadius == bodyB.circleRadius) {
            console.log("drop");
            score += bodyA.circleRadius;
            scoreSpan.innerText = `スコア : ${score}`;
            if (bodyA.circleRadius != 80) {
               let nextsize = ballsize.indexOf(bodyA.circleRadius, 0) + 1;
               console.log(ballsize[nextsize]);
               let size = ballsize[nextsize];
               let color = ballcolor[nextsize];
               const newX = (bodyA.position.x + bodyB.position.x) / 2;
               const newY = (bodyA.position.y + bodyB.position.y) / 2;
               ball = Bodies.circle(newX, newY, size, {
                  render: { fillStyle: color },
                  restitution: 0,
                  friction: 0.2,
                  angle: Math.random(0, 360),
               });
               World.remove(engine.world, [bodyA, bodyB]);
               World.add(engine.world, ball);
            }
         }
      }
   }
});

let ball;
let dropper;
let nextBallSize = getNextBallSize();
let cachesize = ballsize[nextBallSize];
previewSizeSpan.innerText = `次のボール : ${ballsize[nextBallSize]}`;

let color;
let size;
color = ballcolor[nextBallSize];
size = ballsize[nextBallSize];

dropper = Bodies.circle(WIDTH/2, 75, size, {
   render: { fillStyle: color},
   restitution: 0,
   friction: 0.2,
   angle: Math.random(0, 360),
   isStatic: true,
   collisionFilter: {category: 0x0000},
   label: "dropper",
});

World.add(engine.world, dropper);

function handleCanvasClick() {
   console.log(canDrop);
   if (canDrop) {
   Matter.Body.setVelocity(dropper, {x:0, y:0});
   let x = dropper.position.x;
      ball = Bodies.circle(x, 75, size, {
         render: { fillStyle: color },
         restitution: 0,
         friction: 0.2,
         angle: Math.random(0, 360),
         collisionFilter: {category: 0x0004},
      });

      cachesize = ballsize[nextBallSize];
      nextBallSize = getNextBallSize();
      color = ballcolor[nextBallSize];
      size = ballsize[nextBallSize];
      console.log(`color:${color}, size:${size}`)
      Matter.Body.scale(dropper, ballsize[nextBallSize] / cachesize, ballsize[nextBallSize] / cachesize);
      console.log(`Dropper size ${dropper.scale}`);
      dropper.render.fillStyle = color;
      World.add(engine.world, ball);
      
      previewSizeSpan.innerText = `次のボール : ${ballsize[nextBallSize]}`;

      canDrop = false; // 新しいボールが生成されたら一旦落下を無効にする
   }
}

function getNextBallSize() {
   return Math.floor(Math.random() * 3);
}

canvas.addEventListener("click", function (event) {
   handleCanvasClick();
});

document.addEventListener('keypress', keypress_ivent);
document.addEventListener('keyup', keyup_ivent);

function keypress_ivent(e) {
	document.getElementById('output').innerHTML = e.key;
	return false; 
}

function keyup_ivent(e) {
	document.getElementById('output').innerHTML = '';
	return false; 
}

window.onload=function(){
   //マウス移動時のイベントをBODYタグに登録する
   window.addEventListener("mousemove", function(e){
  
     //座標を取得する
     var mX = e.offsetX;  //X座標
     var mY = e.clientY;  //Y座標
  
     //座標を表示する
     scoreSpan.innerHTML = `X:${mX}, Y:${mY}, Ball:${dropper.position.x}`;
     dropper.position.x = mX;
   });
 }