import type { eventWithTime } from "@rrweb/types";
import _Player from "./Player.svelte";
import Recorder from "./utils/Recorder";
type PlayerProps = {
  events: eventWithTime[];
};
type DownloadProps = {
  target: HTMLElement;
  isFullScreen: boolean;
};
class Player extends _Player {
  static _recorder: any;
  static _downloadConfig: DownloadProps;
  constructor(options: {
    target: Element;
    props: PlayerProps;
    // for compatibility
    data?: PlayerProps;
    downloadConfig?: DownloadProps;
  }) {
    super({
      target: options.target,
      props: options.data || options.props,
    });
    Player._downloadConfig = options.downloadConfig;
    this.init(options.downloadConfig);
  }
  init(downloadConfig) {
    const target =
      downloadConfig?.target || document.querySelector(".rr-player");
    const isFullScreen = downloadConfig?.isFullScreen || false;
    const recorder = new Recorder({ selector: target, isFullScreen });
    Player._recorder = recorder;
  }
}
export default Player;
