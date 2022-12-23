import styles from '../styles/Directory.module.css'

import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import CopyIcon from '@mui/icons-material/ContentCopy';
import MoveIcon from '@mui/icons-material/DriveFileMove';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';

import MoveEditDialog from './MoveCopyDialog';
import RenameDialog from './RenameDialog';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { icon_from_filetype } from '../lib/util'

export default function BasicInfo(props: any) {
  const router = useRouter();
  const refreshData = () => { router.replace(router.asPath); }

  const child = props.child || [];

  const [movecopy_form_open, setMoveCopyFormOpen] = useState(false);
  const [movecopy_operation, setMoveCopyOperation] = useState("Copy");
  const [rename_form_open, setRenameFormOpen] = useState(false);
  const [target_child, setTargetChild] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any, child : any) => {
    setAnchorEl(event.currentTarget);
    setTargetChild(child);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const OpenMoveForm = () => {
    handleClose();
    setMoveCopyOperation("Move");
    setMoveCopyFormOpen(true);
  };

  const OpenCopyForm = () => {
    handleClose();
    setMoveCopyOperation("Copy");
    setMoveCopyFormOpen(true);
  };

  const OpenRenameForm = () => {
    handleClose();
    setRenameFormOpen(true);
  };

  const remove = async (path: string) => {
    const body = JSON.stringify({ path });
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    const res = await fetch("/api/remove", { method: "POST", headers, body });
    refreshData();
  }

  const html = child.map((c: any, i: any) => {
    return (
      <tr className="dir-list" key={i}>
        <td className="dir-list-checkbx">
          <input type="checkbox" id="file-select-chbox<%- i %>" name="<%- r.location %>" />
        </td>
        <td >
          <Link style={{ display: "flex", padding: "10px" }} color="inherit" underline="none" href={"/view/" + c.path} >
            {icon_from_filetype(c.filetype)}
            {c.name}
          </Link>
        </td>
        <td >
          <IconButton
            aria-label="more"
            aria-controls={open ? 'long-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={(e) => handleClick(e, c) }
          >
            <MoreHorizIcon />
          </IconButton>
        </td>

        <td onClick={() => { remove(c.path) }}> <DeleteIcon /></td >
        <td>{c.size}</td>
        <td >{c.ctime}</td>
        <td >{c.mtime}</td>
        <td ><Link href={'/api/media' + c.path}><DownloadIcon /></Link></td>
      </tr >
    )
  })

  return (
    <>
      <table className={styles.table} cellSpacing="0" cellPadding="0">
        <thead>
          <tr><td><input type="checkbox" id="file-select-chbox-all" name="file-select-chbox-all" /></td>
            <td className="sort dir-list-fname" data-sort="dir-list-name">Name</td>
            <td className="dir-list-htd">Menu</td>
            <td className="dir-list-htd">remove</td>
            <td className="sort dir-list-size dir-list-htd" data-sort="dir-list-size">Size</td>
            <td className="sort dir-list-ctime dir-list-htd" data-sort="dir-list-ctime">Created</td>
            <td className="sort dir-list-mtime dir-list-htd" data-sort="dir-list-mtime">Modified</td>
            <td className="dir-list-download dir-list-htd" data-sort="td_userid"></td>
          </tr>
        </thead>
        <tbody className="list">
          {html}
        </tbody>
      </table>

      {
        movecopy_form_open && <MoveEditDialog {...props} operation={movecopy_operation} CloseHandler={() => setMoveCopyFormOpen(false)} target={target_child} />
      }

      {
        rename_form_open && <RenameDialog {...props} CloseHandler={() => setRenameFormOpen(false)} target={target_child} />
      }

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>
          <ListItemIcon><DownloadIcon fontSize="small" /></ListItemIcon>
          <Typography variant="inherit">Download</Typography>
        </MenuItem>

        <MenuItem onClick={handleClose}>
          <ListItemIcon><DeleteIcon fontSize="small" /></ListItemIcon>
          <Typography variant="inherit">Delete</Typography>
        </MenuItem>

        <MenuItem onClick={OpenCopyForm}>
          <ListItemIcon><CopyIcon fontSize="small" /></ListItemIcon>
          <Typography variant="inherit">Copy</Typography>
        </MenuItem>

        <MenuItem onClick={OpenMoveForm}>
          <ListItemIcon><MoveIcon fontSize="small" /></ListItemIcon>
          <Typography variant="inherit">Move</Typography>
        </MenuItem>

        <MenuItem onClick={OpenRenameForm}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          <Typography variant="inherit">Rename</Typography>
        </MenuItem>

        <MenuItem onClick={handleClose}>
          <ListItemIcon><CancelIcon fontSize="small" /></ListItemIcon>
          <Typography variant="inherit">Cancel</Typography>
        </MenuItem>
      </Menu>
    </>
  );
}
