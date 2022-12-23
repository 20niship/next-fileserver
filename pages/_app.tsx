// import '../styles/globals.css'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import type { AppProps } from 'next/app'
const darkTheme = createTheme({
  palette: {
    mode: "light"
  }
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={darkTheme} >
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

