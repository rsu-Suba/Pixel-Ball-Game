const canvas = document.getElementById("maincanvas");
const back_panel = document.getElementById("back-panel");
const top_page = document.getElementById("top-page");
const pause_page = document.getElementById("pause-page");
const gameover_page = document.getElementById("gameover");
const gameover_hiscore = document.getElementById("hiScore");
const gameover_score = document.getElementById("getScore");
const gameover_hiscore_getscore = document.getElementById("hiScore-getScore");
const startButton = document.getElementById("start-button");
const scoreSpan = document.getElementById("scoretext");
const hiScoreSpan = document.getElementById("hiscoretext");
const nextball = document.getElementById("nextball");
const windowwidth = window.innerWidth;
const WIDTH = windowwidth * 0.85;
const HEIGHT = (WIDTH / 16) * 27;
const Engine = Matter.Engine;
const Render = Matter.Render;
const Runner = Matter.Runner;
const Bodies = Matter.Bodies;
const Composite = Matter.Composite;
const Events = Matter.Events;
const World = Matter.World;
const framecolor = "#f3d583";
const framepanelcolor = "rgba(255, 245, 225, 0.3)";
const gameover_face = ["(ᐢ'v'ᐡ)", "( ^)o(^ )b", "乁( ˙ ω˙乁)", "✌︎('ω'✌︎ )"];
const points = [1, 3, 6, 10, 15, 21, 36, 45, 55, 66, 78];
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
let deviceType = 0;
let score = 0;
let hiscore = 0;
let gravityMode = 0;
let clickint = 0;
let mode = 0;
let ballnum = 0;
let isTouchnow = 0;
let isGameStartMenu = 0;
let canDrop = true;
let isGamestart = false;
let isGameover = false;
let nextangle = Math.floor(Math.random() * 360);
let nextBallSize = getNextBallSize();
let nextBallSizecache = getNextBallSize();
let deviceOrientation = window.orientation;
let size = ballsize[nextBallSize];
let cachesize = ballsize[nextBallSize];
let balls = [];
let ball;
let os;

nextball.src = `./BallTexs/${nextBallSizecache}.png`;

for (let i = 0; i < 11; i++) {
   let path = `./BallTexs/${i}.png`;
   document.getElementById("preloadimg").src = path;
}
document.getElementById("preloadimg").style = "display: none;";

scoreSpan.innerHTML = score;
gameover_page.style = "display: none;";

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
const ground = Bodies.rectangle(WIDTH / 2, HEIGHT, WIDTH, HEIGHT / 35, {
   render: {
      fillStyle: framecolor,
   },
   isStatic: true,
   collisionFilter: { category: 0b0001 },
   label: "ground",
});
const topground = Bodies.rectangle(WIDTH / 2, HEIGHT / 4, WIDTH, 5, {
   render: {
      fillStyle: "transparent",
   },
   isStatic: true,
   collisionFilter: { category: 0b0100 },
   label: "topground",
});
const left = Bodies.rectangle(
   0,
   HEIGHT / 2 + HEIGHT / 7,
   HEIGHT / 35,
   HEIGHT - HEIGHT / 3.5,
   {
      render: {
         fillStyle: framecolor,
      },
      isStatic: true,
      collisionFilter: { category: 0b0001 },
      label: "wall",
   }
);
const right = Bodies.rectangle(
   WIDTH,
   HEIGHT / 2 + HEIGHT / 7,
   HEIGHT / 35,
   HEIGHT - HEIGHT / 3.5,
   {
      render: {
         fillStyle: framecolor,
      },
      isStatic: true,
      collisionFilter: { category: 0b0001 },
      label: "wall",
   }
);
const fakeleft = Bodies.rectangle(0, HEIGHT / 4.6, HEIGHT / 35, HEIGHT / 7.25, {
   render: {
      fillStyle: "transparent",
   },
   isStatic: true,
   collisionFilter: { category: 0b0001 },
   label: "fakewall",
});
const fakeright = Bodies.rectangle(
   WIDTH,
   HEIGHT / 4.6,
   HEIGHT / 35,
   HEIGHT / 7.25,
   {
      render: {
         fillStyle: "transparent",
      },
      isStatic: true,
      collisionFilter: { category: 0b0001 },
      label: "fakewall",
   }
);
const faketop = Bodies.rectangle(WIDTH / 2, HEIGHT / 7.5, WIDTH, 5, {
   render: {
      fillStyle: "transparent",
   },
   isStatic: true,
   collisionFilter: { category: 0b0001 },
   label: "faketop",
});
const frameleft = Bodies.rectangle(
   HEIGHT / 30,
   HEIGHT / 4,
   HEIGHT / 60,
   HEIGHT / 10,
   {
      render: {
         fillStyle: framecolor,
      },
      isStatic: true,
      collisionFilter: { category: 0b1000 },
      angle: (Math.PI / 180) * 35,
      label: "frameleft",
   }
);
const frameright = Bodies.rectangle(
   WIDTH - HEIGHT / 30,
   HEIGHT / 4,
   HEIGHT / 60,
   HEIGHT / 10,
   {
      render: {
         fillStyle: framecolor,
      },
      isStatic: true,
      collisionFilter: { category: 0b1000 },
      angle: (Math.PI / 180) * -35,
      label: "frameright",
   }
);
const frametop1 = Bodies.rectangle(
   WIDTH / 2,
   HEIGHT / 4.69,
   HEIGHT / 60,
   WIDTH / 1.24,
   {
      render: {
         fillStyle: framecolor,
      },
      isStatic: true,
      collisionFilter: { category: 0b1000 },
      angle: (Math.PI / 180) * 90,
      label: "frametop1",
   }
);
const frametop2 = Bodies.rectangle(
   WIDTH / 2,
   HEIGHT / 3.4,
   HEIGHT / 60,
   WIDTH,
   {
      render: {
         fillStyle: framecolor,
      },
      isStatic: true,
      collisionFilter: { category: 0b1000 },
      angle: (Math.PI / 180) * 90,
      label: "frametop2",
   }
);
const framefront = Bodies.rectangle(
   WIDTH / 2,
   HEIGHT / 1.55,
   HEIGHT / 1.45,
   WIDTH,
   {
      render: {
         fillStyle: framepanelcolor,
      },
      isStatic: true,
      collisionFilter: { category: 0b1000 },
      angle: (Math.PI / 180) * 90,
      label: "framefront",
   }
);
const frameback = Bodies.rectangle(
   WIDTH / 2,
   HEIGHT / 1.8,
   HEIGHT / 1.5,
   WIDTH / 1.24,
   {
      render: {
         fillStyle: framepanelcolor,
      },
      isStatic: true,
      collisionFilter: { category: 0b1000 },
      angle: (Math.PI / 180) * 90,
      label: "frameback",
   }
);
const framepanelleft = Bodies.fromVertices(
   HEIGHT / 29,
   HEIGHT / 1.675,
   [
      { x: 0, y: 0 },
      { x: WIDTH / 11.5, y: -(HEIGHT / 15) },
      { x: 0, y: HEIGHT / 1.4 },
      { x: WIDTH / 11.5, y: HEIGHT / 1.5 - HEIGHT / 15 },
   ],
   {
      render: {
         fillStyle: framepanelcolor,
      },
      isStatic: true,
      collisionFilter: { category: 0b1000 },
      angle: (Math.PI / 180) * 0,
      label: "framepanelleft",
   },
   (flagInternal = false),
   (removeCollinear = 0.01),
   (minimumArea = 10),
   (removeDuplicatePoints = 0.01)
);
const framepanelright = Bodies.fromVertices(
   WIDTH - HEIGHT / 29,
   HEIGHT / 1.675,
   [
      { x: 0, y: 0 },
      { x: WIDTH / 11.5, y: HEIGHT / 15 },
      { x: 0, y: HEIGHT / 1.49 },
      { x: WIDTH / 11.5, y: HEIGHT / 1.4 + HEIGHT / 15 },
   ],
   {
      render: {
         fillStyle: framepanelcolor,
      },
      isStatic: true,
      collisionFilter: { category: 0b1000 },
      angle: (Math.PI / 180) * 0,
      label: "framepanelright",
   },
   (flagInternal = false),
   (removeCollinear = 0.01),
   (minimumArea = 10),
   (removeDuplicatePoints = 0.01)
);
const guide = Bodies.rectangle(
   WIDTH / 2,
   HEIGHT / 2 + HEIGHT / 11.5,
   WIDTH / 120,
   HEIGHT / 1.25,
   {
      render: {
         fillStyle: "#eee",
         strokeStyle: "#999",
         lineWidth: 0.6,
      },
      restitution: 0,
      isStatic: true,
      friction: 0.2,
      collisionFilter: { category: 0b1000 },
      label: "guide",
   }
);
const dropper = Bodies.circle(WIDTH / 2, HEIGHT / 5.5, size, {
   render: {
      sprite: {
         texture: `./BallTexs/${nextBallSize}.png`,
         xScale: size / 300,
         yScale: size / 300,
      },
   },
   restitution: 0,
   friction: 0.2,
   angle: nextangle,
   isStatic: true,
   collisionFilter: { category: 0b0100 },
   label: "dropper",
});
const maincontainer = [
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
   faketop,
   dropper,
];

World.add(engine.world, maincontainer);
Engine.run(engine);
Render.run(render);

Events.on(engine, "collisionStart", function (event) {
   let pairs = event.pairs;
   for (const pair of pairs) {
      const { bodyA, bodyB } = pair;
      if (gravityMode == 0) {
         if (
            bodyA.label === "topground" &&
            (bodyB.label === "Circle Body3" || bodyB.label === "Circle Body4")
         ) {
            gameover();
         }
      } else if (gravityMode == 1) {
         if (
            bodyA.label === "topground" &&
            (bodyB.label === "Circle Body" ||
               bodyB.label === "Circle Body2" ||
               bodyB.label === "Circle Body3" ||
               bodyB.label === "Circle Body4" ||
               bodyB.label === "Circle Body5")
         ) {
            gameover();
         }
      }
      if (bodyA.label === "ground") {
         if (bodyB.label === "Circle Body" || bodyB.label === "Circle Body5") {
            if (bodyB.label === "Circle Body") {
               canDrop = true;
            }
            bodyB.label = "Circle Body2";
         } else if (bodyB.label === "Circle Body3") {
            bodyB.label = "Circle Body4";
         }
         bodyB.collisionFilter.mask = "0b0111";
      } else if (
         bodyA.label === "Circle Body2" ||
         bodyA.label === "Circle Body3" ||
         bodyA.label === "Circle Body4" ||
         bodyA.label === "Circle Body5"
      ) {
         if (bodyB.label === "Circle Body" || bodyB.label === "Circle Body5") {
            if (bodyB.label === "Circle Body") {
               canDrop = true;
            }
            bodyB.label = "Circle Body3";
         } else if (bodyB.label === "Circle Body2") {
            bodyB.label = "Circle Body4";
         }
         bodyB.collisionFilter.mask = "0b0111";
         if (bodyA.circleRadius == bodyB.circleRadius) {
            score += points[ballsize.indexOf(bodyA.circleRadius, 0)];
            if (score > hiscore) {
               hiscore = score;
               hiScoreSpan.innerHTML = `ハイスコア ${hiscore}`;
            }
            scoreSpan.innerText = `${score}`;
            if (bodyA.circleRadius < ballsize[10]) {
               let nextsize = ballsize.indexOf(bodyA.circleRadius, 0) + 1;
               let size = ballsize[nextsize];
               const newX = (bodyA.position.x + bodyB.position.x) / 2;
               const newY =
                  ((bodyA.position.y + bodyB.position.y) / 2) * 0.9985;
               ball = Bodies.circle(newX, newY, size, {
                  render: {
                     sprite: {
                        texture: `./BallTexs/${nextsize}.png`,
                        xScale: size / 300,
                        yScale: size / 300,
                     },
                  },
                  restitution: 0.17,
                  friction: 0.3,
                  angle: Math.random(0, 360),
                  label: "Circle Body5",
                  collisionFilter: { category: 0b0010, mask: 0b0111 },
               });
               World.remove(engine.world, [bodyA, bodyB]);
               balls.push(ball);
               World.add(engine.world, ball);
            }
         }
      }
   }
});

function handleCanvasClick() {
   if (isGameover) {
      return;
   } else {
      let dropsize = ballsize[nextBallSize];
      Matter.Body.setVelocity(dropper, { x: 0, y: 0 });
      let x = dropper.position.x;
      ball = Bodies.circle(x, HEIGHT / 5.3, dropsize, {
         render: {
            sprite: {
               texture: `./BallTexs/${nextBallSize}.png`,
               xScale: dropsize / 300,
               yScale: dropsize / 300,
            },
         },
         restitution: 0.17,
         friction: 0.3,
         angle: nextangle,
         label: "Circle Body",
         collisionFilter: { category: 0b0010, mask: 0b0011 },
      });
      ballnum++;
      nextangle = Math.floor(Math.random() * 360);
      nextBallSize = nextBallSizecache;
      nextBallSizecache = getNextBallSize();
      dropsize = ballsize[nextBallSize];
      cachesize = ballsize[nextBallSize];
      World.add(engine.world, ball);
      balls.push(ball);
      nextball.src = `./BallTexs/${nextBallSizecache}.png`;
      dropper.render.sprite.texture = `./BallTexs/${nextBallSize}.png`;
      (dropper.render.sprite.xScale = cachesize / 300),
         (dropper.render.sprite.yScale = cachesize / 300);
      dropper.angle = nextangle;
   }
}

function move(pos) {
   pos -= (windowwidth - WIDTH) / 2;
   dropper.position.x = pos;
   if (dropper.position.x < ballsize[nextBallSize] + WIDTH / 48) {
      dropper.position.x = ballsize[nextBallSize] + WIDTH / 48;
   }
   if (dropper.position.x > WIDTH - ballsize[nextBallSize] - WIDTH / 48) {
      dropper.position.x = WIDTH - ballsize[nextBallSize] - WIDTH / 48;
   }
   Matter.Body.setPosition(
      guide,
      { x: dropper.position.x, y: HEIGHT / 2 + HEIGHT / 11.75, z: 0 },
      [(updateVelocity = false)]
   );
}

function drop() {
   if (canDrop == true && isGamestart == true) {
      canDrop = false;
      handleCanvasClick();
   }
}

function gameover() {
   if (isGameover == false) {
      isGameover = true;
      gameover_page.classList = "gameover play";
      document.getElementById("gameover-text").classList =
         "top-text-div gameover-text-div";
      document.getElementById("gameover-buttons").classList =
         "top-page-buttons pause-page gameover-buttons";
      document.getElementById("gameover-text-str").innerHTML = `Game Over ${
         gameover_face[Math.floor(Math.random() * 4)]
      }`;
      gameover_page.className = "top-page";
      top_page.className = "play";
      gameover_score.innerHTML = score;
      gameover_hiscore_getscore.innerHTML = hiscore - score + 1;
      isGamestart = false;
      if (score > hiscore) {
         hiscore = score;
         document.cookie = "hiscore=0; max-age=0";
         document.cookie = "hiscore=" + score;
         gameover_hiscore_getscore.innerHTML = `更新`;
      }
      gameover_hiscore.innerHTML = hiscore;
      sleep(1.5, function () {
         document.getElementById("gameover-text").className = "top-text-div";
         document.getElementById("gameover-buttons").classList =
            "top-page-buttons pause-page";
         back_panel_play(1);
         for (let i = 0; i < 3; i++) {
            document.getElementsByClassName("scores-text")[i].style.fontSize =
               "125%";
            document.getElementsByClassName("scores-exp")[i].style.fontSize =
               "55%";
         }
      });
   }
}

function osdetect() {
   if (
      navigator.userAgent.indexOf("iPhone") > 0 ||
      navigator.userAgent.indexOf("iPad") > 0 ||
      navigator.userAgent.indexOf("iPod") > 0
   ) {
      os = "iphone";
   } else if (navigator.userAgent.indexOf("Android") > 0) {
      os = "android";
   } else {
      os = "pc";
   }
   if (navigator.cookieEnabled) {
      document.getElementById("canthiscore").style.opacity = 0;
      document.getElementById("scoreDelete").style.opacity = 1;
      hiscore = converter(document.cookie).hiscore;
      if (hiscore === undefined) {
         hiscore = 0;
      }
      hiScoreSpan.innerHTML = `ハイスコア ${hiscore}`;
   }
}

function start() {
   isGameStartMenu = 1;
   back_panel_play(0);
   top_page.className = "play";
   engine.gravity.x = 0;
   engine.gravity.y = 1;
   ground.label = "ground";
   left.label = "wall";
   right.label = "wall";
   gravityMode = 0;
   document.getElementById("deletehiscore").style.opacity = 0;
   document.getElementById("datatext").innerHTML = "";
}

function rot() {
   isGamestart = false;
   isGameStartMenu = 1;
   back_panel_play(0);
   top_page.className = "play";
   ground.label = "ground";
   left.label = "ground";
   right.label = "ground";
   gravityMode = 1;
   if (os == "iphone") {
      if (typeof DeviceOrientationEvent !== "function") {
         document.getElementById("datatext").innerHTML =
            "ジャイロ機能は使えません";
      }
      if (typeof DeviceOrientationEvent.requestPermission !== "function") {
         document.getElementById("datatext").innerHTML =
            "ジャイロ機能は使えません";
      }
      DeviceOrientationEvent.requestPermission().then(function (
         permissionStateOrien
      ) {
         if (permissionStateOrien === "granted") {
            DeviceMotionEvent.requestPermission().then(function (
               permissionStateMotion
            ) {
               if (permissionStateMotion === "granted") {
                  document.getElementById("datatext").innerHTML = "";
                  isGamestart = true;
               }
            });
         } else {
            document.getElementById(
               "datatext"
            ).innerHTML = `ジャイロ機能は使えません`;
         }
      });
   } else {
   }
   document.getElementById("deletehiscore").style.opacity = 0;
}

function pause(pausemode) {
   switch (pausemode) {
      case 0:
         pause_page.className = "top-page";
         back_panel_play(1);
         isGamestart = false;
         isGameStartMenu = 0;
         break;
      case 1:
         pause_page.className = "play";
         back_panel_play(0);
         isGameStartMenu = 1;
         break;
      case 2:
         restart(0);
         break;
      case 3:
         restart(1);
         break;
      case 4:
         restart(2);
         break;
   }
}

function restart(mode) {
   isGameStartMenu = 0;
   switch (mode) {
      case 0:
         pause_page.className = "play";
         top_page.className = "top-page";
         if (score >= hiscore) {
            document.cookie = "hiscore=0; max-age=0";
            document.cookie = "hiscore=" + score;
         }
         isGamestart = false;
         isGameStartMenu = 0;
         break;
      case 1:
         top_page.className = "play";
         gameover_page.className = "play";
         for (let i = 0; i < 3; i++) {
            document.getElementsByClassName("scores-text")[i].style.fontSize =
               "0%";
            document.getElementsByClassName("scores-exp")[i].style.fontSize =
               "0%";
         }
         back_panel_play(0);
         isGameover = false;
         isGameStartMenu = 1;
         break;
      case 2:
         gameover_page.className = "play";
         top_page.className = "top-page";
         isGameover = false;
         isGamestart = false;
         isGameStartMenu = 0;
         break;
   }
   World.remove(engine.world, balls);
   ballnum = 0;
   score = 0;
   scoreSpan.innerText = `${score}`;
   if (navigator.cookieEnabled) {
      document.getElementById("canthiscore").style.opacity = 0;
      hiscore = converter(document.cookie).hiscore;
      if (hiscore === undefined) {
         hiscore = 0;
      }
      hiScoreSpan.innerHTML = `ハイスコア ${hiscore}`;
   }
}

function back_panel_play(mode) {
   switch (mode) {
      case 0:
         back_panel.className = "back-panel-play";
         break;
      case 1:
         back_panel.className = "back-panel";
         break;
   }
}

function scoreDelete() {
   document.cookie = "hiscore=0; max-age=0";
   document.getElementById("canthiscore").style.opacity = 0;
   hiscore = converter(document.cookie).hiscore;
   if (hiscore === undefined) {
      hiscore = 0;
   }
   hiScoreSpan.innerHTML = `ハイスコア ${hiscore}`;
   document.getElementById("deletehiscore").style.opacity = 1;
}

function converter(cookie) {
   const obj = {};
   cookie.split(";").map((item) => {
      obj[item.split("=")[0].trim()] = item.split("=")[1];
   });
   return obj;
}

function sleep(waitSec, callbackFunc) {
   var spanedSec = 0;
   var id = setInterval(function () {
      spanedSec++;
      if (spanedSec >= waitSec) {
         clearInterval(id);
         if (callbackFunc) callbackFunc();
      }
   }, 1000);
}

function getNextBallSize() {
   return Math.floor(Math.random() * 4);
}

function windowResized() {
   resizeCanvas(windowWidth, windowHeight);
}

window.addEventListener("mousemove", function (e) {
   let pos = e.clientX;
   move(pos);
});
window.addEventListener("touchmove", function (e) {
   isTouchnow = 1;
   let pos = e.changedTouches[0].clientX;
   move(pos);
});
window.addEventListener("click", function (e) {
   drop();
});
window.addEventListener("touchend", function (e) {
   if (isTouchnow === 1) {
      drop();
   }
   isTouchnow = 0;
});
top_page.addEventListener("transitionend", () => {
   if (isGameStartMenu == 1) {
      isGamestart = true;
   }
});
top_page.addEventListener("webkitTransitionend", () => {
   if (isGameStartMenu == 1) {
      isGamestart = true;
   }
});
pause_page.addEventListener("transitionend", () => {
   if (isGameStartMenu == 1) {
      isGamestart = true;
   }
});
pause_page.addEventListener("webkitTransitionend", () => {
   if (isGameStartMenu == 1) {
      isGamestart = true;
   }
});
gameover_page.addEventListener("transitionend", () => {
   if (isGameStartMenu == 1) {
      isGamestart = true;
   }
});
gameover_page.addEventListener("webkitTransitionend", () => {
   if (isGameStartMenu == 1) {
      isGamestart = true;
   }
});
window.addEventListener("devicemotion", function devicemotionHandler(event) {
   if (gravityMode == 1 && isGamestart == true) {
      let xg;
      let yg;
      let xa;
      let ya;
      if (os == "android") {
         xg = event.accelerationIncludingGravity.x / 30;
         yg = event.accelerationIncludingGravity.y / 30;
         xa = event.acceleration.x / 2.5;
         ya = event.acceleration.y / 2.5;
      } else if (os == "iphone") {
         xg = event.accelerationIncludingGravity.x / 6;
         yg = event.accelerationIncludingGravity.y / 6;
         xa = event.acceleration.x * 2;
         ya = event.acceleration.y * 3;
      }
      switch (deviceOrientation) {
         case 0:
            engine.world.gravity.x = xg + xa;
            engine.world.gravity.y = -yg + ya;
            break;
         case 90:
            engine.world.gravity.x = -yg - xa;
            engine.world.gravity.y = -xg + xa;
            break;
         case -90:
            engine.world.gravity.x = yg + xa;
            engine.world.gravity.y = xg - xa;
            break;
         case 180:
            engine.world.gravity.x = -xg - xa;
            engine.world.gravity.y = yg - xa;
      }
      if (os == "android") {
         engine.world.gravity.x = -engine.world.gravity.x;
         engine.world.gravity.y = -engine.world.gravity.y;
      }
   }
});
