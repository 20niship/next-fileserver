// require('dotenv').config();
import fs_ from 'fs';
const fs = fs_.promises;
import fs_extra from 'fs-extra'
import path from 'path';

import { formatDate, formatSize, getMineType, ext_to_filetype } from './util';

// const path = require('path'); 
// const zipdir = require('zip-dir');


const TRASH_DIR = process.env?.TRASH_DIR || "../";
const SRC_DIR = process.env?.SRC_DIR || "../";

function cvt2abs_path(location: string) {
  const SRC_DIR = process.env?.SRC_DIR || "../";
  // const from = path.format({ base: process.env.DIR + req.body.from });
  const fname = SRC_DIR + "/" + location;
  if (fname.slice(-1) === "/")
    return fname.slice(0, -1);
  return fname;
}


const get_media_type = (stat: any, fname: string) => {
  if (!stat) return "";
  if (stat.isDirectory()) return "dir";
  if (stat.isSocket()) return "socket";
  if (stat.isSymbolicLink()) return "link";
  if (stat.isFIFO()) return "fifo";

  const extention = (fname.split(".").pop() || "").toLowerCase();
  return ext_to_filetype(extention);
}

const INFO = (str: string) => { console.log(`\x1b[00m[  INFO   ] ${(new Date()).toISOString()}\t${str}\x1b[0m`) }
const DEBUG = (str: string) => { console.log(`\x1b[32m[  DEBUG  ] ${(new Date()).toISOString()}\t${str}\x1b[0m`) }
const WARN = (str: string) => { console.log(`\x1b[33m[ WARNING ] ${(new Date()).toISOString()}\t${str}\x1b[0m`) }
const ERROR = (str: string) => { console.log(`\x1b[31m[  ERROR  ] ${(new Date()).toISOString()}\t${str}\x1b[0m`) }

export const view = async (location: string, is_trash = false) => {
  const src_dir = is_trash ? TRASH_DIR : SRC_DIR;
  const fname = src_dir + location;
  DEBUG(`VISITED : ${fname}    ${location}`);
  const stat = await fs.stat(fname).catch(_ => { return null; });
  const found = stat != null;
  const filetype = found ? get_media_type(stat, fname) : "";
  const isFile = found ? stat.isFile() : false;
  const isDir = found ? stat.isDirectory() : false;
  const minetype = (found && isFile) ? getMineType(location) : "";
  const isBinary = !(filetype === "text" || filetype === "code")

  if (stat === null) {
    return {
      path: location,
      is_trash,
      found,
      isFile, isDir,
      minetype,
      isBinary,
      child: [],
      filetype,
      size: 0,
      atime: "",
      ctime: "",
      mtime: "",
      birthtime: "",
      ino: "",
      dev: "",
      nlink: "",
      uid: "",
      mode: "",
      blocks: 0,
    }
  }

  let child = [];
  if (filetype === "dir") {
    const names = await fs.readdir(fname).catch(_ => { return [] })
    for (const name of names) {
      const abs_path = `${fname}/${name}`;
      const stat2 = await fs.stat(abs_path).catch(_ => { return null; });
      if (stat2 == null) {
        ERROR("undefined error cannot get stat2!")
        continue;
      }
      let filetype = get_media_type(stat2, abs_path);
      child.push({
        name,
        path: `${location}/${name}`,
        size: formatSize(stat2.size),
        atime: formatDate(stat2.atime),
        ctime: formatDate(stat2.ctime),
        mtime: formatDate(stat2.mtime),
        birthtime: formatDate(stat2.birthtime),
        ino: stat2.ino,
        dev: stat2.dev,
        nlink: stat2.nlink,
        uid: stat2.uid,
        mode: stat2.mode,
        blocks: stat2.blocks,
        filetype,
      })
    }
  }

  const res = {
    path: location,
    is_trash,
    found,
    isFile, isDir,
    minetype,
    isBinary,
    child,
    filetype,
    size: formatSize(stat.size),
    atime: formatDate(stat.atime),
    ctime: formatDate(stat.ctime),
    mtime: formatDate(stat.mtime),
    birthtime: formatDate(stat.birthtime),
    ino: stat.ino,
    dev: stat.dev,
    nlink: stat.nlink,
    uid: stat.uid,
    mode: stat.mode,
    blocks: stat.blocks,
  }
  return res;
}


export async function readfile(location: string) {
  const fname = cvt2abs_path(location);
  const context = await fs.readFile(fname)
  const str = String(context)
  return str;
}

export async function exists(location: string) {
  const fname = cvt2abs_path(location);
  const res = await fs.access(fname).catch(_ => { return false })
  console.log("EXIST = ", res)
  return res;
}

export function create_stream(location: string) {
  const fname = cvt2abs_path(location);
  const ss = fs_.createReadStream(fname);
  return ss;
}

export async function mkdir(location: string) {
  const fname = cvt2abs_path(location);
  const res = await fs_extra.mkdirs(fname);
  console.log("MKDIR RES  =  ", res)
  return res;
}

export async function copy(from: string, to: string) {
  const from_ = cvt2abs_path(from);
  const filename = path.basename(from);
  const to_ = path.join(cvt2abs_path(to), filename);
  const res = await fs_extra.copy(from_, to_);
  console.log("MKDIR RES  =  ", res)
  return res;
}

export async function move(from: string, to: string) {
  const from_ = cvt2abs_path(from);
  const filename = path.basename(from);
  const to_ = path.join(cvt2abs_path(to), filename);
  if (from === to) {
    ERROR("move operation stop: same dir=  " + from + to);
    return;
  }
  const res = await fs_extra.move(from_, to_);
  console.log("MKDIR RES  =  ", res)
  return res;
}

export const rename = async (from: string, to: string) => {
  const from_ = cvt2abs_path(from);
  const to_ = cvt2abs_path(path.join(path.dirname(from), to));
  const res = await fs_extra.move(from_, to_);
  console.log("MKDIR RES  =  ", res)
  return res;
}

export const remove = async (location: string) => {
  try {
    const fname = cvt2abs_path(location);
    console.log("fname = ", fname)
    const trash_name = `${TRASH_DIR}/${(new Date()).toISOString()}-${path.basename(location)}`;
    const res = await fs_extra.move(fname, trash_name);
    console.log("move RES  =  ", res)
    return true;
  } catch (err: any) {
    ERROR("Remove error" + err);
    return false;
  }
}

export const remove_trash = async (location: string) => {
  try {
    const file = path.join(TRASH_DIR, location);
    await fs_extra.remove(file);
  } catch (err: any) {
    ERROR("Remove error" + err);
  }
}

export const remove_all_trash = async () => {
  const files = await fs.readdir(TRASH_DIR)
  for (const file of files) {
    try {
      console.log(file, path.join(TRASH_DIR, file))
      await fs_extra.remove(path.join(TRASH_DIR, file))
    } catch (err: any) {
      ERROR(err);
      return false;
    }
  }
}

