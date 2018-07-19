import util from 'util';

import { Scanner, ConfigOptions } from './scanner';

import { Video, Status } from '../objects/video';

export default class ReplyScanner extends Scanner {
    constructor(options: ConfigOptions) {
        super(options);

        console.log(`starting reply scanner at ${options.scanInterval}ms interval`);
    }

    start() {
        Video.findUnpostedMirrored()
            .then(videos => {
                videos.forEach(vid => {
                    console.log(`attempting reply for ${vid.redditPostId}`);

                    vid.reply(util.format("#Here's a [mirror of this video](https://amirror.link/%s)", vid.redditPostId))
                        .then(() => {
                            console.log(`posted reply`);
                            vid.update({
                                status: Status.PostedLocalMirror
                            });
                        })
                        .catch(err => {
                            // FIXME: this needs to check to see if we are rate limited
                            console.error(`failed replying to message: ${err}`);
                        });
                });
            })
            .catch(err => {
                console.log(`failed finding mirrored videos: ${err}`);
            });
    }
}
