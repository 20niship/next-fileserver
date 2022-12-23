import {
  AppBar,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";

export default function Header() {
  const logout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: "{}"
      })
      location.href = "/";
    } catch (e) {
      console.error("AAAAAA")
    }
  }
  return (
    <AppBar component="header" position="static">
      <Toolbar>
        <Typography variant="h6" component="h1" sx={{ m: 0, flexGrow: 1, display: { xs: 'flex' } }}>
          <a href="/view" style={{color:"white", textDecoration:"none"}}>WebDav</a>
        </Typography>
        <Button onClick={logout} variant="outlined" sx={{ color: "white" }}>Logout</Button>
        <Button href="/trash" variant="outlined" sx={{ color: "white" }}>Trash</Button>
      </Toolbar>
    </AppBar>
  )
}




