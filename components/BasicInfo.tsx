import DeleteIcon from '@mui/icons-material/Delete';
import UploadIcon from '@mui/icons-material/Upload';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import InfoIcon from '@mui/icons-material/Info';
import UpdateIcon from '@mui/icons-material/Update';
import HomeIcon from '@mui/icons-material/Home'

import { Button, IconButton, Input, ButtonGroup, TextField, Dialog, Snackbar, DialogContent, DialogContentText, DialogActions, Typography } from '@mui/material';
import { List, ListItem, ListItemIcon, ListItemText, Tooltip, Stack, Breadcrumbs, Link, DialogTitle, Chip } from "@mui/material";

import { useState, forwardRef } from 'react';
import { useRouter } from 'next/router';
import { mimetype2filetype, icon_from_filetype, formatSize, formatDate } from '../lib/util'
import MuiAlert from '@mui/material/Alert';

const Alert = forwardRef(function Alert(props: any, ref: any) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
})

type Props = {
  path: string,
  is_trash: boolean
}

export default function BasicInfo(props: Props) {
  const router = useRouter();
  const refreshData = () => { router.replace(router.asPath); }

  const path = props.path;
  const [stackOpen, setStackOpen] = useState(false);
  const [stackText, setStackText] = useState("");
  const [stackSeverity, setStackSeverity] = useState("success");

  const handleStackOpen = (text: string, severity = "success") => {
    setStackText(text);
    setStackOpen(true);
    setStackSeverity(severity);
  };

  const handleClose = (_: any, reason: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setStackOpen(false);
    setStackSeverity("success");
  };


  const [dirname, setDirname] = useState("");

  const [mkdir_form_open, setMkdirFormOpen] = useState(false);
  const [upload_form_open, setUploadFormOpen] = useState(false);
  const [delete_form_open, setDeleteFormOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileList | null>({} as FileList);

  const mkdirFormClose = () => { setMkdirFormOpen(false); };
  const UploadFormClose = () => { setUploadFormOpen(false); };
  const deleteFormClose = () => { setDeleteFormOpen(false); };

  const api_mkdir = async () => {
    const location = path + "/" + dirname;
    const body = JSON.stringify({ path: location });
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    const res = await fetch("/api/mkdir", { method: "POST", headers, body });
    if (res.ok) {
      handleStackOpen("mkdir success", "success");
    } else {
      handleStackOpen("mkdir Error!", "error");
    }
    refreshData();
    mkdirFormClose();
  }

  const api_delete = async () => {
    const location = path + "/" + dirname;
    const body = JSON.stringify({ path: location });
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    const res = await fetch("/api/remove", { method: "POST", headers, body });
    if (res.ok) {
      handleStackOpen("remove success", "success");
    } else {
      handleStackOpen("remove Error!", "error");
    }
    refreshData();
    deleteFormClose();
  }

  const uploadFile = async () => {
    if (selectedFile == null || selectedFile.length < 1) return;
    const formData = new FormData();
    formData.append('dirname', props.path);
    Array.from(selectedFile).forEach((f) => {
      // formData.append('file', f);
      // https://qiita.com/shimashima0109/items/d4d3f4ace8889456f822
      formData.append('file', f, encodeURIComponent(f.name)) // ★ 変更
    })
    const options = {
      method: 'POST',
      body: formData,
      entials: 'include',
      // headers: {
      //   'Content-Type': 'multipart/form-data;charset=UTF-8',
      // }
    };
    const res = await fetch('/api/upload', options);
    if (res.ok) {
      handleStackOpen("upload success", "success");
      setSelectedFile(null);
      UploadFormClose();
      refreshData();
    } else {
      handleStackOpen("upload Error!", "error");
      refreshData();
    }
  }

  const upload_file_view = () => {
    if (!selectedFile) return <></>
    const files_html = Array.from(selectedFile).map((f: any) => {
      const icon = icon_from_filetype(mimetype2filetype(f.type));
      return (
        <ListItem key={f.name}>
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText primary={f.name} />
          <Chip icon={<InfoIcon />} label={formatSize(f.size)} />
          <Chip icon={<UpdateIcon />} label={formatDate(new Date(f.lastModified))} />
        </ListItem >
      )
    })
    return (
      <>
        <h4>{Array.from(selectedFile).length} file selected</h4>
        <List>
          {files_html}
        </List>
      </>
    )
  }

  const render_title_html = (is_trash: boolean, path: string) => {
    const title_html = [];
    if (!is_trash) title_html.push(<Link href="/view" variant="h5" key="/"><HomeIcon fontSize="large" /></Link>);
    else title_html.push(<Link href="/trash" key="/" ><DeleteIcon /></Link>);
    let t_s = path.split("/")
    let t_d = `${is_trash ? '/trash' : '/view'}/`
    t_s.forEach(tt => {
      if (tt === "") return;
      title_html.push(
        <Link key={tt} underline="hover" variant="h5" color="inherit" href={t_d + tt} >{tt}</Link>
      );
      t_d += (tt + "/");
    });

    return (
      <Breadcrumbs separator="›">
        {title_html}
        <ButtonGroup variant="outlined" aria-label="outlined button group">
          <Tooltip title="Delete"><IconButton onClick={() => { setDeleteFormOpen(true); }}><DeleteIcon /></IconButton></Tooltip>
          <Tooltip title="Upload"><IconButton onClick={() => { setUploadFormOpen(true); }}><UploadIcon /></IconButton></Tooltip>
          <Tooltip title="Folder"><IconButton onClick={() => { setMkdirFormOpen(true); }}><CreateNewFolderIcon /></IconButton></Tooltip>
        </ButtonGroup>
      </Breadcrumbs>
    );
  }

  return (
    <>
      <Stack spacing={2}>
        {render_title_html(props.is_trash, props.path)}
      </Stack>

      <Dialog open={mkdir_form_open} onClose={mkdirFormClose} sx={{ m: 2 }}>
        <DialogTitle>フォルダを作成</DialogTitle>
        <DialogContent>
          <TextField autoFocus value={dirname} onChange={(e: any) => { setDirname(e.target.value) }}
            margin="dense" label="フォルダ名" fullWidth variant="standard" />
        </DialogContent>
        <DialogActions>
          <Button onClick={mkdirFormClose}>Cancel</Button>
          <Button onClick={api_mkdir} variant="contained">Ok</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={delete_form_open} onClose={deleteFormClose}>
        <DialogTitle>削除</DialogTitle>
        <DialogContentText sx={{ m: 3 }}><Typography variant="h5" component="span">{props.path}{' '}</Typography>を削除</DialogContentText>
        <DialogActions>
          <Button onClick={deleteFormClose}>Cancel</Button>
          <Button onClick={api_delete} variant="contained">Ok</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={upload_form_open} onClose={UploadFormClose}>
        <DialogTitle>Upload Files</DialogTitle>
        <DialogContentText>ここにファイルをドラッグアンドドロップしてください</DialogContentText>
        <DialogContent>
          <Input type="file" inputProps={{ multiple: true }} onChange={(e) => { setSelectedFile((e.target as HTMLInputElement).files) }} />
          <div>{upload_file_view()}</div>
        </DialogContent>
        <DialogActions>
          <Button onClick={UploadFormClose}>Cancel</Button>
          <Button onClick={uploadFile} variant="contained">Upload</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={stackOpen} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={stackSeverity} sx={{ width: '100%' }}>
          {stackText}
        </Alert>
      </Snackbar>
    </>
  )

}
