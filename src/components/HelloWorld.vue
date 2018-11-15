<template>
  <div class="hello">
    <p class="banner"></p>
    <div class="videoBox">
      <video id="my-video" class="video-js vjs-default-skin only-play-button vjs-big-play-centered"
             controls webkit-playsinline playsinline
             x5-playsinline x-webkit-airplay="allow" x5-video-player-fullscreen='false'

             :poster=poster
             data-setup='{}'
      >
        <source :src=src type="application/x-mpegURL"/>
      </video>
    </div>
    <p class="tall"></p>
  </div>
</template>

<script>
import videojs from 'video.js';
import 'videojs-contrib-hls';

window.videojs = videojs || videojs.default;
export default {
  name: 'HelloWorld',
  data() {
    return {
      src: 'http://cdn.video.ghs.net/%E7%AB%96%E8%A7%86%E9%A2%91750-750/213343/213343-2/v.m3u8',
      poster: 'http://wap.ghs.net/public/images/b1/f3/bd/11bcbb10e83c014360b50de65e4fd31071b3018f.jpg',
    };
  },
  mounted() {
    if (!this.player) {
      this.player = videojs(this.$el, {}, function playerReady() {
        window.document.querySelector('.vjs-tech').removeAttribute('z-index');
        window.document
          .querySelector('.vjs-tech')
          .addEventListener('touchstart', () => {
            if (this.paused()) {
              this.play();
            } else {
              this.pause();
            }
          });
      });
    }
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  },
};
</script>

<style lang="scss">
.banner {
  width: 400px;
  height: 40px;
  background-color: red;
  position: fixed;
  z-index: 100;
  margin: 20px auto;
}
.tall {
  height: 1000px;
  width: 1px;
}
.videoBox {
  width: 100%;
  height: 300px;
  overflow: hidden;
  position: relative;
  z-index: 1;
  margin: 100px auto;
}
.video-js {
  width: 70%;
  height: 200px;
  margin: 0 auto;
}

.video-js.vjs-playing .vjs-tech {
  pointer-events: auto;
}

.video-js .vjs-control-bar {
  background: linear-gradient(-180deg, rgba(0, 0, 0, 0.3) 100%, #000 0%);
}

.vjs-paused .vjs-big-play-button,
.vjs-paused.vjs-has-started .vjs-big-play-button {
  display: block;
}

.only-play-button {
  .vjs-big-play-button {
    top: 50%;
    left: 50%;
    margin-top: -1.5em;
    margin-left: -0.75em;
    z-index: 10;
  }

  .vjs-icon-placeholder {
    font-size: 1.63em;
  }

  &.vjs-paused .vjs-big-play-button {
    width: 60px;
    height: 60px;
    font-size: 2.5em;
    line-height: 2.3em;
    -webkit-border-radius: 2.5em;
    -moz-border-radius: 2.5em;
    border-radius: 2.5em;
    background-color: #73859f;
    background-color: rgba(0, 0, 0, 0.4);
    border-width: 0.12em;
    margin-top: -1.25em;
  }

  &.vjs-controls-disabled.vjs-paused .vjs-big-play-button,
  &.vjs-using-native-controls.vjs-paused .vjs-big-play-button,
  &.vjs-error.vjs-paused .vjs-big-play-button {
    display: none;
  }

  .vjs-error-display,
  .vjs-text-track-display {
    display: none;
  }
}
</style>
