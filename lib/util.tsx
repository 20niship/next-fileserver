import path from 'path';

import FolderIcon from '@mui/icons-material/Folder';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import MovieIcon from '@mui/icons-material/Movie';
import AudioIcon from '@mui/icons-material/AudioFile';
import LinkIcon from '@mui/icons-material/Link';
import CodeIcon from '@mui/icons-material/Code';
import FileIcon from '@mui/icons-material/InsertDriveFile';

export const ext_to_filetype = (extension: string) => {
  const filetypes: { [key: string]: string[] } = {
    "text": ["txt", "md", "ini", "license"],
    "pdf": ["pdf"],
    "office": ["docs", "excel", "pptx"],
    "code": ["cpp", "hpp", "cxx", "hxx", "c", "h",
      "html", "css", "js", "json", "ts", "ejs",
      "Dockerfile", "yml", "yaml", "cnf", "conf", "toml", "xml", "env",
      "py", "rb", "go", "cu", "Makefile",
      "gitkeep", "gitignore", "sh", "cfg"
    ],
    "image": ["jpg", "gif", "png", "jpeg", "ico"],
    "movie": ["mov", "mp4", "mkv"],
    "audio": ["wav", "mp3", "ogg"],
    "app": ["apk", "exe", "deb", "appimage"],
    "os": ["iso"],

    // spftwares
    "blender": ["blend", "blend1"],
    "adobe": ["aep", "ps"],
  }
  for (let i in filetypes)
    if (filetypes[i].indexOf(extension) >= 0) { return i }
  return "";
}


export const icon_from_filetype = (filetype: string) => {
  switch (filetype) {
    case "dir": return <FolderIcon />
    case "movie": return <MovieIcon />
    case "audio": return <AudioIcon />
    case "link": return <LinkIcon />
    case "image": return <ImageIcon />
    case "pdf": return <PictureAsPdfIcon />
    case "zip": return <FolderZipIcon />
    case "code": return <CodeIcon />
    default:
      return <FileIcon />
  }
}

export const mimetype2filetype = (mimetype: string) => {
  switch (mimetype) {
    case "image/jpg":
    case "image/jpeg":
    case "image/png":
    case "image/gif":
      return "image";

    case "text/html":
    case "text/css":
      return "code";


    case "audio/wav":
    case "audio/mp3":
      return "audio";

    case "video/mp4":
    case "video/mkv":
      return "movie";

    case "application/pdf":
      return "pdf";

    default:
      return ""
  }
}

export const getMineType = (fname: string) => {
  const extention = path.extname(fname);
  const mimeTypes: { [key: string]: string } = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.jpeg': 'image/jpg',
    '.gif': 'image/gif',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.mkv': 'video/mkv',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.svg': 'application/image/svg+xml'
  };
  return (extention in mimeTypes) ? mimeTypes[extention] : "";
}

export const formatDate = (dt: Date) => {
  try {
    var y = dt.getFullYear();
    var m = ('00' + (dt.getMonth() + 1)).slice(-2);
    var d = ('00' + dt.getDate()).slice(-2);
    return (y + '-' + m + '-' + d);
  } catch {
    console.error("Unknown datetime -->", dt)
    return "0000-00-00"
  }
}


export const formatSize = (size: number) => {
  var i = Math.floor(Math.log(size) / Math.log(1024));
  return (size / Math.pow(1024, i)).toFixed(2) + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
}
