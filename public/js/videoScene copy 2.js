const scenes = [
    { id: "scene-web", duration: 15*60000 },
    { id: "scene-video1", isVideo: true },
];

let sceneIndex = 0;
let videoIndex = 0;
let idleTimer = null;

const video = document.getElementById("videoPlayer");

// =======================
// DETEKSI KLIK SAJA
// =======================
function handleClick() {
    // jika sedang di scene video → balik ke kalender
    if (scenes[sceneIndex].isVideo) {
    video.pause();
    video.currentTime = 0;
    sceneIndex = 0;
    videoIndex = 0; // ← tambahkan ini
    showScene(sceneIndex);
    return;
}


    // jika di scene web → reset timer
    resetIdleTimer();
}

window.addEventListener("click", handleClick, true);

// =======================

function resetIdleTimer() {
    if (!scenes[sceneIndex].isVideo) {
        if (idleTimer) clearTimeout(idleTimer);
        idleTimer = setTimeout(nextScene, scenes[sceneIndex].duration);
    }
}

function showScene(index) {
    document.getElementById("scene-web").classList.add("scene-hidden");
    document.getElementById("scene-video1").classList.add("scene-hidden");

    const scene = scenes[index];
    document.getElementById(scene.id).classList.remove("scene-hidden");

    if (idleTimer) clearTimeout(idleTimer);

    if (scene.isVideo) {
        playVideo();
    } else {
        resetIdleTimer();
    }
}

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

function nextScene() {
    if (idleTimer) clearTimeout(idleTimer);
    sceneIndex = (sceneIndex + 1) % scenes.length;
    showScene(sceneIndex);
}

// mulai
showScene(0);
