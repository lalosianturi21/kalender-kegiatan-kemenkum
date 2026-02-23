const scenes = [
    { id: "scene-web", duration: sceneWebDuration },
    { id: "scene-video1", isVideo: true },
];

let sceneIndex = 0;
let videoIndex = 0;
let idleTimer = null;

const video = document.getElementById("videoPlayer");


// =======================
// DETEKSI KLIK
// =======================
function handleClick() {

    // ✅ hanya bereaksi kalau sedang di video
    if (scenes[sceneIndex].isVideo) {
        video.pause();
        video.currentTime = 0;
        sceneIndex = 0;
        videoIndex = 0;
        showScene(sceneIndex);
    }

    // ❌ TIDAK ADA resetIdleTimer di sini
}

window.addEventListener("click", handleClick, true);


// =======================
// TIMER IDLE → PINDAH VIDEO
// =======================
function startIdleTimer() {
    if (idleTimer) clearTimeout(idleTimer);

    const duration = scenes[sceneIndex].duration;
    if (duration) {
        idleTimer = setTimeout(nextScene, duration);
    }
}


// =======================
// SHOW SCENE
// =======================
function showScene(index) {

    document.getElementById("scene-web").classList.add("scene-hidden");
    document.getElementById("scene-video1").classList.add("scene-hidden");

    const scene = scenes[index];
    document.getElementById(scene.id).classList.remove("scene-hidden");

    if (idleTimer) clearTimeout(idleTimer);

    if (scene.isVideo) {
        playVideo();
    } else {
        // ✅ timer mulai hanya saat masuk scene-web
        startIdleTimer();
    }
}


// =======================
// PLAY VIDEO
// =======================
function playVideo() {
    if (!videoList || videoList.length === 0) {
        nextScene();
        return;
    }

    video.src = videoList[videoIndex];
    video.currentTime = 0;
    video.load();
    video.play();

    video.onended = () => {
        videoIndex++;

        if (videoIndex >= videoList.length) {
            videoIndex = 0;
            nextScene();
        } else {
            playVideo();
        }
    };
}


// =======================
// NEXT SCENE
// =======================
function nextScene() {
    if (idleTimer) clearTimeout(idleTimer);
    sceneIndex = (sceneIndex + 1) % scenes.length;
    showScene(sceneIndex);
}


// =======================
// START
// =======================
showScene(0);