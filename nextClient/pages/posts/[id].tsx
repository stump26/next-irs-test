import * as React from 'react'
import type { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/dist/client/router'
import Identicon from 'identicon.js'
import { hashGeneratorHelper } from '../../src/utils/hashGeneratorHelper'
import Post from '../../src/components/Post'

interface Props {
  id: string
  identicon: string
}

const Posts = ({ id, identicon }: Props) => {
  const router = useRouter()

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Post identicon={identicon} id={id} />
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = params.id as string

  const identicon: string = new Identicon(id, { size: 200 }).toString()

  // await new Promise(res => setTimeout(res, 1000))

  return {
    props: {
      id,
      identicon,
    },
    revalidate: 60,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const hashs: string[] = hashGeneratorHelper({ length: 15, count: 1000 })

  const paths = hashs.map(hash => {
    return { params: { id: hash } }
  })

  return {
    paths,
    fallback: true,
  }
}

export default Posts
