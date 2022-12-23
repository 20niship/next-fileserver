import { GetServerSideProps } from 'next'

export const getServerSideProps = async () => {
  return {
    redirect: {
      statusCode: 302, // ステータスコード指定
      destination: '/view', // リダイレクト先
    },
  }
}

export default function Home(){
  return (<></>)

}


