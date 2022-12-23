export interface ChildFileType{
  name: string,
  path: string,
  size: string,
  atime: string,
  ctime: string,
  mtime: string,
  birthtime: string,
  ino: number,
  dev: number,
  nlink: number,
  uid: number,
  mode: number,
  blocks: number,
  filetype: string
}

export interface FileData {
  path: string,
  is_trash: boolean,
  found: boolean,
  isFile: boolean,
  isDir: boolean,
  minetype: string,
  size: string,
  atime: string,
  ctime: string,
  mtime: string,
  birthtime: string,
  ino: number,
  dev: number,
  nlink: number,
  uid: number,
  mode: number,
  blocks: number,
  filetype: string
};

