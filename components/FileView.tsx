import Highlight from 'react-highlight'
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import InfoIcon from '@mui/icons-material/Info';
import UpdateIcon from '@mui/icons-material/Update';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LinkIcon from '@mui/icons-material/Link';
import DownloadIcon from '@mui/icons-material/Download';

import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

import styles from '../styles/FileView.module.css'

type Props = {
  path: string,
  name: string,
  context: any,
  size: number,
  ctime: string,
  mtime: string,
  filetype: any,
  minetype: any,
}

export default function FileView(props: Props) {
  const image_view = (
    <img src={"/api/media/" + props.path} alt={props.name} style={{maxWidth: "800px"}} />
  )

const pdf_view = (
  <>
    <p>PDFファイル</p>
    <p><a className="form-submit-btn" href={"/api/media/" + props.path}>新しいWindowで表示</a></p>
    <embed src={"/api/media/" + props.path} type="application/pdf" width="100%" height="1000px" />
  </>
)

const text_viewer = (
  <>
    <Button onClick={() => {
      navigator.clipboard.writeText(props.context);
    }} >Copy to Clipboard</Button>
    <div className={styles.FileViewer} >
      <Highlight className="code">{props.context}</Highlight>
    </div>
  </>
)

const audio_view = (
  <AudioPlayer autoPlay src={"/api/media" + props.path} onPlay={_ => console.log("onPlay")} />
)

const movie_view = (
  <>
    <video className="video-js" controls playsInline>
      <source src={"/api/media" + props.path} type={props.minetype} /> </video>
  </>
)

const unknown_view = (
  <>
    <p>ファイルを表示できません</p>
    <p> <a className="form-submit-btn" href={"/api/media/" + props.path}>ダウンロード</a></p >
  </>
);

function file_viewer() {
  switch (props.filetype) {
    case "image": return image_view
    case "pdf": return pdf_view;
    case "audio": return audio_view;
    case "movie": return movie_view;
    case "image": return image_view;
    case "text":
    case "code":
      return text_viewer
    default: return unknown_view;
  }
}
return (
  <>
    <link rel="stylesheet" href="/monokai.css" />
    <h2><a href={"/api/media/" + props.path}> {props.name} </a></h2>

    <Chip icon={<InfoIcon />} label={props.size} />
    <Chip icon={<AccessTimeIcon />} label={props.ctime} />
    <Chip icon={<UpdateIcon />} label={props.mtime} />
    <Chip icon={<DownloadIcon />} label="Download" />
    <Chip icon={<LinkIcon />} label="Copy Link" />
    <div className="file-viewer" >
      {file_viewer()}
    </div >
  </>
);
}
