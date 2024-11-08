<script lang="ts">
  import 'vidstack/bundle'
  import 'vidstack/player/styles/default/theme.css'
  import 'vidstack/player/styles/default/layouts/video.css'
  import 'vidstack/player'
  import 'vidstack/player/layouts/default'
  import 'vidstack/player/ui'

  export let URL
  export let TITLE
</script>

<media-player title={TITLE} src={{ src: URL, type: "video/mp4" }} autoplay>
  <media-provider></media-provider>
  <media-video-layout></media-video-layout>
</media-player>
