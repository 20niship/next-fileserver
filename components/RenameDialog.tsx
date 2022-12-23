import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { useRef } from 'react';
import { useRouter } from 'next/router';

export default function RenameDialog(props: any) {
  const router = useRouter();
  const refreshData = () => { router.replace(router.asPath); }
  const handleClose = () => { props.CloseHandler(); };

  const before = props.target.path;
  const nameRef = useRef(props.target.name);

  const rename = async () => {
    const name = nameRef.current.value;
    const body = JSON.stringify({ from: before, to: name });
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    const res = await fetch("/api/rename", { method: "POST", headers, body });
    console.log(res);
    handleClose();
    refreshData();
  }

  return (
    <>
      <Dialog open={true} onClose={handleClose}>
        <DialogTitle>rename {before}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            inputRef={nameRef}
            margin="dense"
            id="name"
            label={before}
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={rename} variant="contained">Ok</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
