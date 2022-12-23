import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useState } from 'react';

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const login_send = async () => {
    const body = JSON.stringify({ username, password })
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body
      })
      if (res.ok) {
        location.href = "/";
      } else {
        setMsg("Username or password is invalid!")
      }
    } catch (e) {
      setMsg("Network Error!")
    }
  };


  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5"> Login Form</Typography>
        <Box sx={{ mt: 3 }}>
          <TextField required fullWidth label="username" autoComplete="username" value={username} onChange={(e: any) => { setUsername(e.target.value) }} />
          <TextField required fullWidth label="password" type="password" autoComplete="password" value={password} onChange={(e: any) => { setPassword(e.target.value) }} />
          <Button fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={login_send}>
            Login
          </Button>
          {
            (msg.length > 0) && <Alert severity="error"><b>{msg}</b></Alert>
          }
        </Box>
      </Box>
    </Container>
  );
}
