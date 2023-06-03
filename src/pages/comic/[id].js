import Layout from 'components/PageLayout'
import Head from 'next/head'
import Image from 'next/image'
import { readFile, stat } from 'fs/promises'
import Link from 'next/link'
import fs from 'fs/promises'
import { basename } from 'path'

export default function Comic({
  img,
  alt,
  title,
  width,
  height,
  nextId,
  prevId,
  hasNext,
  hasPrevious,
}) {
  return (
    <Layout>
      <Head>
        <title>xkcd - Comics for developers</title>
        <meta
          name='description'
          content='Comics for developers'
        />
        <link
          rel='icon'
          href='/favicon.ico'
        />
      </Head>

      <section className='max-w-lg mx-auto'>
        <h1 className='font-bold text-center py-4'>{title}</h1>
        <div className='max-w-sm m-4 mx-auto'>
          <Image
            src={img}
            alt={alt}
            width={width}
            height={height}
          />
        </div>
        <p className='p-2 my-4 border rounded-sm text-justify'>{alt}</p>
        <div className='flex justify-between'>
          {hasPrevious && (
            <Link
              href='/comic/[id]'
              as={`/comic/${prevId}`}
              className='bg-gray-300 rounded-sm px-4 py-1 hover:bg-gray-200 hover:font-bold'
            >
              ⬅ Previous
            </Link>
          )}
          {hasNext && (
            <Link
              href='/comic/[id]'
              as={`/comic/${nextId}`}
              className='bg-gray-300 rounded-sm px-4 py-1 hover:bg-gray-200 hover:font-bold'
            >
              Next ➡
            </Link>
          )}
        </div>
      </section>
    </Layout>
  )
}

export async function getStaticPaths({ locales }) {
  const files = await fs.readdir('./comics')
  let paths = []

  locales.forEach((locale) => {
    paths = paths.concat(
      files.map((file) => {
        const id = basename(file, '.json')
        return { params: { id: id }, locale }
      })
    )
  })

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const { id } = params
  const content = await readFile(`./comics/${id}.json`, 'utf8')
  const comic = JSON.parse(content)

  const idNumber = +id
  const prevId = idNumber - 1
  const nextId = idNumber + 1

  const [prevResult, nextResult] = await Promise.allSettled([
    stat(`./comics/${prevId}.json`),
    stat(`./comics/${nextId}.json`),
  ])

  const hasPrevious = prevResult.status === 'fulfilled'
  const hasNext = nextResult.status === 'fulfilled'

  return {
    props: {
      ...comic,
      hasPrevious,
      hasNext,
      prevId,
      nextId,
    },
  }
}
