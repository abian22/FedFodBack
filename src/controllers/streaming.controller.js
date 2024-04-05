const ffmpeg = require('fluent-ffmpeg');

const obtenerVideo = (req, res) => {
  ffmpeg('/dev/video0')
    .inputFormat('video4linux2')
    .outputOptions('-vf', 'format=yuv420p')
    .format('mpegts')
    .pipe(res, { end: true });
};

module.exports = {
  obtenerVideo,
};
