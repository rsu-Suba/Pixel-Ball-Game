const canvas = document.getElementById("maincanvas");
const windowwidth = window.innerWidth;
const WIDTH = windowwidth * 0.85;
const HEIGHT = (WIDTH / 16) * 27;
const consoletext = document.getElementById("console");
let deviceType = 0;

for (let i = 0; i < 11; i++){
   let path = `./BallTexs/${i}.png`
   document.getElementById("preloadimg").src = path;
}

document.getElementById("preloadimg").style = "display: none;";

const Engine = Matter.Engine;
const Render = Matter.Render;
const Runner = Matter.Runner;
const Bodies = Matter.Bodies;
const Composite = Matter.Composite;
const Events = Matter.Events;
const World = Matter.World;

let canDrop = true;
let ballsize = [
   Math.floor(WIDTH / (550 / 18)),
   Math.floor(WIDTH / (550 / 24)),
   Math.floor(WIDTH / (550 / 34)),
   Math.floor(WIDTH / (550 / 39)),
   Math.floor(WIDTH / (550 / 49)),
   Math.floor(WIDTH / (550 / 63)),
   Math.floor(WIDTH / (550 / 81)),
   Math.floor(WIDTH / (550 / 90)),
   Math.floor(WIDTH / (550 / 100)),
   Math.floor(WIDTH / (550 / 124)),
   Math.floor(WIDTH / (550 / 148)),
];
let points = [
   1,
   3,
   6,
   10,
   15,
   21,
   36,
   45,
   55,
   66,
   78
];
let score = 0;

const scoreSpan = document.getElementById("scoretext");
const nextball = document.getElementById("nextball");
const gameoverdiv = document.getElementById("gameover");
scoreSpan.innerHTML = `0`;
gameoverdiv.style = "display: none;";

const engine = Engine.create();
const render = Render.create({
   canvas: canvas,
   element: document.body,
   engine: engine,
   options: {
      width: WIDTH,
      height: HEIGHT,
      hasBounds: true,
      wireframes: false,
      background: "transparent",
   },
});

const framecolor = "#f3d583";
const framepanelcolor = "rgba(255, 245, 225, 0.3)";

const ground = Bodies.rectangle(WIDTH / 2, HEIGHT, WIDTH, HEIGHT / 35, {
   render: {
      fillStyle: framecolor,
   },
   isStatic: true,
   collisionFilter: { category: 0b0001 },
   label: "ground",
});
const topground = Bodies.rectangle(WIDTH / 2, HEIGHT / 3.5, WIDTH, 5, {
   render: {
      fillStyle: "transparent",
   },
   isStatic: true,
   collisionFilter: { category: 0b0100 },
   label: "topground",
});
const left = Bodies.rectangle(0, HEIGHT / 2 + HEIGHT / 7, HEIGHT / 35, HEIGHT - HEIGHT / 3.5, {
   render: {
      fillStyle: framecolor,
   },
   isStatic: true,
   collisionFilter: { category: 0b0001 },
   label: "wall",
});
const right = Bodies.rectangle(WIDTH, HEIGHT / 2 + HEIGHT / 7, HEIGHT / 35, HEIGHT - HEIGHT / 3.5, {
   render: {
      fillStyle: framecolor,
   },
   isStatic: true,
   collisionFilter: { category: 0b0001 },
   label: "wall",
});
const fakeleft = Bodies.rectangle(0, HEIGHT / 4.6, HEIGHT / 35, HEIGHT / 7.25, {
   render: {
      fillStyle: "transparent",
   },
   isStatic: true,
   collisionFilter: { category: 0b0001 },
   label: "fakewall",
});
const fakeright = Bodies.rectangle(WIDTH, HEIGHT / 4.6, HEIGHT / 35, HEIGHT / 7.25, {
   render: {
      fillStyle: "transparent",
   },
   isStatic: true,
   collisionFilter: { category: 0b0001 },
   label: "fakewall",
});
const frameleft = Bodies.rectangle(HEIGHT / 30, HEIGHT / 4, HEIGHT / 60, HEIGHT / 10, {
   render: {
      fillStyle: framecolor,
   },
   isStatic: true,
   collisionFilter: { category: 0b1000 },
   angle: (Math.PI / 180) * 35,
   label: "frameleft",
});
const frameright = Bodies.rectangle(WIDTH - (HEIGHT / 30), HEIGHT / 4, HEIGHT / 60, HEIGHT / 10, {
   render: {
      fillStyle: framecolor,
   },
   isStatic: true,
   collisionFilter: { category: 0b1000 },
   angle: (Math.PI / 180) * -35,
   label: "frameright",
});
const frametop1 = Bodies.rectangle(WIDTH / 2, HEIGHT / 4.69, HEIGHT / 60, WIDTH / 1.24, {
   render: {
      fillStyle: framecolor,
   },
   isStatic: true,
   collisionFilter: { category: 0b1000 },
   angle: (Math.PI / 180) * 90,
   label: "frametop1",
});
const frametop2 = Bodies.rectangle(WIDTH / 2, HEIGHT / 3.4, HEIGHT / 60, WIDTH, {
   render: {
      fillStyle: framecolor,
   },
   isStatic: true,
   collisionFilter: { category: 0b1000 },
   angle: (Math.PI / 180) * 90,
   label: "frametop2",
});
const framefront = Bodies.rectangle(WIDTH / 2, HEIGHT / 1.55, HEIGHT / 1.45, WIDTH, {
   render: {
      fillStyle: framepanelcolor,
   },
   isStatic: true,
   collisionFilter: { category: 0b1000 },
   angle: (Math.PI / 180) * 90,
   label: "framefront",
});
const frameback = Bodies.rectangle(WIDTH / 2, HEIGHT / 1.8, HEIGHT / 1.5, WIDTH / 1.24, {
   render: {
      fillStyle: framepanelcolor,
   },
   isStatic: true,
   collisionFilter: { category: 0b1000 },
   angle: (Math.PI / 180) * 90,
   label: "frameback",
});
const framepanelleft = Bodies.fromVertices(HEIGHT / 29, HEIGHT / 1.675,[
   {x:0,y:0},
   {x:WIDTH / 11.5,y:-(HEIGHT / 15)},
   {x:0,y:HEIGHT / 1.4},
   {x:WIDTH / 11.5,y:(HEIGHT / 1.5) - (HEIGHT / 15)}], 
   {
      render: {
         fillStyle: framepanelcolor,
      },
      isStatic: true,
      collisionFilter: { category: 0b1000 },
      angle: (Math.PI / 180) * 0,
      label: "framepanelleft",
   },
   flagInternal=false,
   removeCollinear=0.01,
   minimumArea=10,
   removeDuplicatePoints=0.01
);
const framepanelright = Bodies.fromVertices(WIDTH - (HEIGHT / 29), HEIGHT / 1.675,[
   {x:0,y:0},
   {x:WIDTH / 11.5,y:HEIGHT / 15},
   {x:0,y:HEIGHT / 1.49},
   {x:WIDTH / 11.5,y:(HEIGHT / 1.4) + (HEIGHT / 15)}], 
   {
      render: {
         fillStyle: framepanelcolor,
      },
      isStatic: true,
      collisionFilter: { category: 0b1000 },
      angle: (Math.PI / 180) * 0,
      label: "framepanelright",
   },
   flagInternal=false,
   removeCollinear=0.01,
   minimumArea=10,
   removeDuplicatePoints=0.01
);
const guide = Bodies.rectangle(WIDTH / 2, HEIGHT / 2 + HEIGHT / 11.5, WIDTH / 120, HEIGHT / 1.25,{
   render: {
      fillStyle: "#eee",
      strokeStyle: "#999",
      lineWidth: 0.6,
   },
   restitution: 0,
   isStatic: true,
   friction: 0.2,
   collisionFilter: { category: 0b1000},
   label: "guide",
})

let maincontainer = [
   framepanelleft,
   framepanelright,
   framefront,
   frameback,
   frameleft,
   frameright,
   frametop1,
   guide,
   frametop2,
   ground,
   topground,
   left,
   right,
   fakeleft,
   fakeright,
];

/*
for (let i = 0; i < 11; i++){
   let ballsample1 = Bodies.circle(WIDTH / 2, 300, ballsize[i], {
      render: {
      sprite: {
      texture: `./BallTexs/${i}.png`,
      xScale: ballsize[i] / 300,
      yScale: ballsize[i] / 300,
      }},
      restitution: 0,
      friction: 0.2,
      angle: 0,
      collisionFilter: { category: 0x0010 , mask: 0x0011},
   });
   World.add(engine.world, ballsample1);
}
*/

World.add(engine.world, maincontainer);
Engine.run(engine);
Render.run(render);


Events.on(engine, "collisionStart", function (event) {
   let pairs = event.pairs;
   for (const pair of pairs) {
      const { bodyA, bodyB } = pair;
      console.log(`You: ${bodyA.label}`);
      console.log(`Me: ${bodyB.label}`);
      //bodyA→相手
      //bodyB→自分
      if (bodyA.label === "topground" && (bodyB.label === "Circle Body4" || bodyB.label === "Circle Body3")){
         console.log("gameover1");
         gameover();
      }
      //Circle Body = Nothing
      //Circle Body2 = ground
      //Circle Body3 = ball
      //Circle Body4 = ground & ball
      if (bodyA.label === "ground") {
         if (bodyB.label === "Circle Body"){
            bodyB.label = "Circle Body2";
            bodyB.collisionFilter.mask = "0b0011";
            canDrop = true;
         }
         else if (bodyB.label === "Circle Body3"){
            bodyB.label = "Circle Body4";
            bodyB.collisionFilter.mask = "0b0111";
            canDrop = true;
         }
      }
      else if (bodyA.label === "Circle Body2" || bodyA.label === "Circle Body3" || bodyA.label === "Circle Body4"){
         if (bodyB.label === "Circle Body"){
            bodyB.label = "Circle Body3";
            bodyB.collisionFilter.mask = "0b0111";
            canDrop = true;
         }
         else if (bodyB.label === "Circle Body2"){
            bodyB.label = "Circle Body4";
            bodyB.collisionFilter.mask = "0b0111";
            canDrop = true;
         }
         if (bodyA.circleRadius == bodyB.circleRadius) {
            score += points[ballsize.indexOf(bodyA.circleRadius, 0)];
            scoreSpan.innerText = `${score}`;
            if (bodyA.circleRadius < Math.floor(WIDTH / 550 * 148)) {
               let nextsize = ballsize.indexOf(bodyA.circleRadius, 0) + 1;
               let size = ballsize[nextsize];
               const newX = (bodyA.position.x + bodyB.position.x) / 2;
               const newY = ((bodyA.position.y + bodyB.position.y) / 2) * 0.9985;
               ball = Bodies.circle(newX, newY, size, {
                  render: {
                     sprite: {
                        texture: `./BallTexs/${nextsize}.png`,
                        xScale: size / 300,
                        yScale: size / 300
                     }
                  },
                  restitution: 0.17,
                  friction: 0.3,
                  angle: Math.floor(Math.random() * 360),
                  label: "Circle Body",
                  collisionFilter: { category: 0b0010 , mask: 0b0111},
               });
               World.remove(engine.world, [bodyA, bodyB]);
               World.add(engine.world, ball);
            }
         }
      }
   }
});

let ball;
let nextangle = Math.floor(Math.random() * 360);
let nextBallSize = getNextBallSize();
let nextBallSizecache = getNextBallSize();
let cachesize = ballsize[nextBallSize];
nextball.src = `./BallTexs/${nextBallSizecache}.png`;
let isGameover = false;

let size = ballsize[nextBallSize];

const dropper = Bodies.circle(WIDTH / 2, HEIGHT / 5.5, size, {
   render: {
      sprite: {
         texture: `./BallTexs/${nextBallSize}.png`,
         xScale: size / 300,
         yScale: size / 300
      }
   },
   restitution: 0,
   friction: 0.2,
   angle: nextangle,
   isStatic: true,
   collisionFilter: { category: 0b0100 },
   label: "dropper",
});

World.add(engine.world, dropper);

let clickint = 0;
let mode = 0;

function handleCanvasClick() {
   if (isGameover){
      return
   }
   else {
      clickint++;
      if (clickint == 4){
         mode = Math.floor(Math.random() * 4);
         if (mode == 0){
            engine.gravity.x = -0.85;
            engine.gravity.y = 0.5;
            ground.label = "wall";
            left.label = "ground";
            right.label = "wall";
         }
         else if (mode == 1){
            engine.gravity.x = 0.85;
            engine.gravity.y = 0.5;
            ground.label = "wall";
            left.label = "wall";
            right.label = "ground";
         }
         else if (mode == (2 || 3)) {
            engine.gravity.x = 0;
            engine.gravity.y = 1;
            ground.label = "ground";
            left.label = "wall";
            right.label = "wall";
         }
         clickint = 0;
      }
      let dropsize = ballsize[nextBallSize];
      Matter.Body.setVelocity(dropper, { x: 0, y: 0 });
      let x = dropper.position.x;
      ball = Bodies.circle(x, HEIGHT / 5.3, dropsize, {
         render: {
            sprite: {
               texture: `./BallTexs/${nextBallSize}.png`,
               xScale: dropsize / 300,
               yScale: dropsize / 300
            }
         },
         restitution: 0.17,
         friction: 0.3,
         angle: nextangle,
         collisionFilter: { category: 0b0010 , mask: 0b0011},
      });
      nextangle = Math.floor(Math.random() * 360);
      nextBallSize = nextBallSizecache;
      nextBallSizecache = getNextBallSize();
      dropsize = ballsize[nextBallSize];
      cachesize = ballsize[nextBallSize];
      World.add(engine.world, ball);
      nextball.src = `./BallTexs/${nextBallSizecache}.png`;
      dropper.render.sprite.texture = `./BallTexs/${nextBallSize}.png`;
      dropper.render.sprite.xScale = cachesize / 300,
      dropper.render.sprite.yScale = cachesize / 300;
      dropper.angle = nextangle;
   }
}

function getNextBallSize() {
   return Math.floor(Math.random() * 4);
}

let isTouchnow = 0;

window.addEventListener("mousemove", function (e) {
   let pos = e.clientX;
   move(pos);
});
window.addEventListener("touchmove", function (e) {
   isTouchnow = 1;
   let pos = e.changedTouches[0].clientX;
   move(pos)
});
window.addEventListener("click", function (e) {
   drop();
});
window.addEventListener("touchend", function (e) {
   if (isTouchnow === 1){
      drop();
   }
   isTouchnow = 0;
});
window.addEventListener("touchtart", function (e){
   if (isTouchnow === 0){
      drop();
   }
});


function move(pos){
   pos -= (windowwidth - WIDTH) / 2;
   dropper.position.x = pos;
   if (dropper.position.x < ballsize[nextBallSize] + WIDTH / 48){
      dropper.position.x = ballsize[nextBallSize] + WIDTH / 48;
   }
   if (dropper.position.x > WIDTH - ballsize[nextBallSize] - WIDTH / 48){
      dropper.position.x = WIDTH - ballsize[nextBallSize] - WIDTH / 48;
   }
   Matter.Body.setPosition(guide, {x:dropper.position.x, y:HEIGHT / 2 + HEIGHT / 11.75, z:0}, [updateVelocity=false]);
}

function drop(){
   if (canDrop == true) {
      canDrop = false;
      handleCanvasClick();
   }
}

function gameover(){
   gameoverdiv.style = "display: block;";
   isGameover = true;
   console.log("gameover2");
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}