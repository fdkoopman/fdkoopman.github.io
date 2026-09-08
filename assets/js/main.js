(() => {
  function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
  }

  function setupLatencyDemo(root) {
    const teacher = root.querySelector(".teacher-video");
    const student = root.querySelector(".student-video");
    const playBtn = root.querySelector(".sync-play");
    const resetBtn = root.querySelector(".reset-playback");
    const meta = root.querySelector(".latency-meta");

    if (!teacher || !student || !playBtn || !resetBtn || !meta) return;

    const env = root.dataset.env || "task";
    const teacherMs = Number(root.dataset.teacherMs || "0");
    const studentMs = Number(root.dataset.studentMs || "1");

    const ratio = teacherMs > 0 && studentMs > 0 ? teacherMs / studentMs : 1.0;
    const studentRate = 1.0;
    // Browser practical lower bound is around 0.0625.
    const teacherRate = clamp(1.0 / ratio, 0.0625, 1.0);
    const clipped = teacherRate !== 1.0 / ratio;

    meta.textContent =
      `${env}: teacher latency ${teacherMs.toFixed(2)} ms vs student latency ${studentMs.toFixed(2)} ms `
      + `(${ratio.toFixed(1)}x slower). Replay rates: teacher ${teacherRate.toFixed(4)}x, student ${studentRate.toFixed(2)}x`
      + (clipped ? " (teacher rate clipped by browser minimum)." : ".");

    function reset() {
      teacher.pause();
      student.pause();
      teacher.currentTime = 0;
      student.currentTime = 0;
      teacher.playbackRate = teacherRate;
      student.playbackRate = studentRate;
    }

    async function syncPlay() {
      teacher.pause();
      student.pause();
      teacher.currentTime = 0;
      student.currentTime = 0;
      teacher.playbackRate = teacherRate;
      student.playbackRate = studentRate;
      try {
        await Promise.all([teacher.play(), student.play()]);
      } catch (_) {
        // User gesture policies differ by browser; controls remain available.
      }
    }

    playBtn.addEventListener("click", syncPlay);
    resetBtn.addEventListener("click", reset);
    reset();
  }

  function setupHardwareRolloutPlayback() {
    const videos = document.querySelectorAll(".hardware-video-grid video.realworld-speedup");
    videos.forEach((video) => {
      const setRate = () => {
        video.playbackRate = 2.0;
        video.defaultPlaybackRate = 2.0;
      };
      if (video.readyState >= 1) {
        setRate();
      } else {
        video.addEventListener("loadedmetadata", setRate, { once: true });
      }
    });
  }

  function setupSyncDemo(root) {
    const teacher = root.querySelector(".teacher-video");
    const student = root.querySelector(".student-video");
    const playBtn = root.querySelector(".sync-play");
    const resetBtn = root.querySelector(".reset-playback");
    const speed = Number(root.dataset.speed || "2");
    if (!teacher || !student || !playBtn || !resetBtn) return;

    function reset() {
      teacher.pause();
      student.pause();
      teacher.currentTime = 0;
      student.currentTime = 0;
      teacher.playbackRate = speed;
      student.playbackRate = speed;
      teacher.defaultPlaybackRate = speed;
      student.defaultPlaybackRate = speed;
    }

    async function syncPlay() {
      teacher.pause();
      student.pause();
      teacher.currentTime = 0;
      student.currentTime = 0;
      teacher.playbackRate = speed;
      student.playbackRate = speed;
      teacher.defaultPlaybackRate = speed;
      student.defaultPlaybackRate = speed;
      try {
        await teacher.play();
      } catch (_) {
        // Keep manual controls available if autoplay is restricted.
      }
      try {
        await student.play();
      } catch (_) {
        // Keep manual controls available if autoplay is restricted.
      }
    }

    playBtn.addEventListener("click", syncPlay);
    resetBtn.addEventListener("click", reset);
    reset();
  }

  function setupRolloutDemo(root) {
    const videos = Array.from(root.querySelectorAll(".rollout-video"));
    const playBtn = root.querySelector(".rollout-play");
    const resetBtn = root.querySelector(".rollout-reset");
    const speed = Number(root.dataset.speed || "1");
    if (!videos.length || !playBtn || !resetBtn) return;

    function applyRate() {
      videos.forEach((video) => {
        video.playbackRate = speed;
        video.defaultPlaybackRate = speed;
      });
    }

    function reset() {
      videos.forEach((video) => {
        video.pause();
        video.currentTime = 0;
      });
      applyRate();
    }

    async function syncPlay() {
      reset();
      try {
        await Promise.all(videos.map((video) => video.play()));
      } catch (_) {
        // Keep manual controls available if autoplay is restricted.
      }
    }

    playBtn.addEventListener("click", syncPlay);
    resetBtn.addEventListener("click", reset);
    reset();
  }

  document.querySelectorAll(".latency-demo").forEach(setupLatencyDemo);
  document.querySelectorAll(".sync-demo").forEach(setupSyncDemo);
  document.querySelectorAll(".rollout-demo").forEach(setupRolloutDemo);
  setupHardwareRolloutPlayback();
})();
