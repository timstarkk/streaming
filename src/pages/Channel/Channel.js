import React from 'react';
import ReactPlayer from 'react-player';
import "./Channel.css";
import { Auth } from 'aws-amplify';
import CommentBox from '../../components/Channel/CommentBox';

const streamUrl = "https://bd71a34288e9.us-east-1.playback.live-video.net/api/video/v1/us-east-1.493218721673.channel.GS9ardy4gu0d.m3u8";

export default function Channel() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    Auth.currentAuthenticatedUser()
    .then(currentUser => setUser(currentUser))
    .catch(err => console.log({ err }))
  }, []);

  return (
    <div className="channel-page">
      <div style={{ display: 'flex', }}>
        <div style={{ width: 900, border: '1px solid tan'}}>
          <ReactPlayer 
            url={streamUrl}
            width="100%"
            height="100%"
            playing
          />
        </div>

        <CommentBox />
      </div>
    </div>
  );
};