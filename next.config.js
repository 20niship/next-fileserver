/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['mdx', 'md', 'jsx', 'js', 'tsx', 'ts'],
  env: {
    // ServeするDirectory設定
    TRASH_DIR: "./storage/trash",
    SRC_DIR: "./storage/src",
    ExpireTime: 0,

    // needLogin : 閲覧、編集両方にLoginが必要
    // needLoginToEdit : 編集のみLoginが必要
    NEED_LOGIN_TO_VIEW: true,
    NEED_LOGIN_TO_EDIT: false,

    // Login時の認証情報
    USERNAME: "user",
    PASSWORD: "pass",

    // backup関連
    BACKUP: true,
    BACKUP_TIME: "0 1 * * *",
    BACKUP_DIR: "./storage/backup",

    // アップロード関連
    UPLOAD_FILE_MAX_SIZE: 10,
    UPLOAD_MAX_CHUNK_SIZE: 5000,
  },
  reactStrictMode: true,
  swcMinify: false,

  typescript: {
    //ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
