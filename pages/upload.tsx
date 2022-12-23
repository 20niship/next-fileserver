export default function Upload() {
  return (
    <form action="/api/upload" method="post" encType="multipart/form-data">
      <input type="file" name="file" />
        <button type="submit">送信する</button>
    </form>

  )
}
