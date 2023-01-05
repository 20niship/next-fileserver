export const session_settings = {
  cookieName: "myapp_cookiename",
  password:process.env.SESSION_PASSWORD,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
}

