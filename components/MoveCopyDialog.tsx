import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import HomeIcon from '@mui/icons-material/Home';
import Breadcrumbs from '@mui/material/Breadcrumbs';

import { useState } from 'react';
import { icon_from_filetype } from '../lib/util'


export default function MoveCopyDialog(props: any) {
  const [destination, setDestination] = useState(props?.path || []);
  const [child, setChild] = useState(props?.child || []);

  const FormClose = () => { props.CloseHandler(); };
  const FormSend = async () => {
    if (props.operation === "Copy") {
      const target_path = props.target?.path || "";
      const body = JSON.stringify({ from: target_path, to: destination });
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      const res = await fetch("/api/copy", { method: "POST", headers, body });
    } else {
      const target_path = props.target?.path || "";
      const body = JSON.stringify({ from: target_path, to: destination });
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      const res = await fetch("/api/move", { method: "POST", headers, body });
    }
    FormClose();
  }

  const set_destination = async (to: string) => {
    setDestination(to);
    const body = JSON.stringify({ path: to });
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    const res = await fetch("/api/ls", { method: "POST", headers, body });
    if (!res.ok) return;
    const js = await res.json();
    setChild(js.child);
  }

  const render_title_html = (path: string) => {
    const title_html = [];
    title_html.push(<IconButton onClick={() => { set_destination("/"); }}><HomeIcon fontSize="large" /></IconButton>);
    const t_s = path.split("/");
    t_s.map((tt, i) => {
      if (tt === "") return;
      const td = t_s.slice(0, i + 1).join("/");
      title_html.push(
        <Button key={i} color="inherit" onClick={() => { set_destination(td); }}>{tt}</Button>
      );
    });

    return (
      <Breadcrumbs separator="/">
        {title_html}
      </Breadcrumbs>
    );
  }

  const html = child.map((c: any, i: number) => {
    return (
      <ListItem secondaryAction={
        (c.filetype === "dir") ? (<IconButton edge="end" onClick={() => {
          set_destination(c.path)
        }}>
          <KeyboardArrowRightIcon /></IconButton>) : (<></>)
      }
        key={i}
      >
        <ListItemButton onClick={() => { if (c.filetype === "dir") set_destination(c.path); }} >
          {icon_from_filetype(c.filetype)}
          <Typography variant="body1">
            {c.name}
          </Typography>
        </ListItemButton >
      </ListItem >
    )
  })

  return (
    <>
      <Dialog open={true} onClose={FormClose}>
        <DialogContent sx={{ bgcolor: 'info.main' }}>
          <Typography variant="h5">{props?.operation || "Move"} Files</Typography>
        </DialogContent>
        {render_title_html(destination)}
        <Divider />
        <DialogContent>
          <List dense={true}>
            {html}
          </List>
        </DialogContent>
        <DialogActions>
          <DialogContentText>Copy To {destination}</DialogContentText>
          <Divider />
          <Button onClick={FormClose}>Cancel</Button>
          <Button onClick={FormSend} variant="contained">{props.operation}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
