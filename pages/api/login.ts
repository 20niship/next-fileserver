import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { session_settings } from "@/lib/session"

const username = process.env?.USERNAME || "";
const password = process.env?.PASSWORD || "";

console.log("user settings : ", username, password)

export default withIronSessionApiRoute(
  async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
      res.status(405).send("method not allowed")
      return;
    }

    const username_ = req.body?.username || "";
    const password_ = req.body?.password || "";
    console.log("login api : ", username_, password_);

    if (username === username_ && password === password_ && username_.length > 0 && password_.length > 0) {
      (req.session as any).user = {
        username: "hoge",
        logined: true
      };
      await req.session.save();
      res.send({ ok: true });
    }
    res.status(535).send("authentication failed")
    return;

  },
  session_settings
);


