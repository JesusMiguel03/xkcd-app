import Image from 'next/image'
import Link from 'next/link'
import Layout from 'components/PageLayout'
import fs from 'fs/promises'
import { useI18N } from 'context/i18n'

export default function Home({ latestComics }) {
  const { t } = useI18N()

  return (
    <Layout title='Home'>
      <div className='w-48 mx-auto mt-4 mb-8 py-2 bg-gray-100'>
        <h2 className='text-xl text-center font-bold'>{t('LATEST_COMICS')}</h2>
      </div>
      <section className='grid grid-cols-1 gap-2 max-w-md m-auto sm:grid-cols-2 md:grid-cols-3'>
        {latestComics.map((comic) => {
          return (
            <Link
              href={`/comic/${comic.id}`}
              key={comic.id}
              className='mb-4 pb-4 m-auto'
            >
              <h3 className='font-bold text-sm text-center'>{comic.title}</h3>
              <Image
                width='300'
                height='500'
                src={comic.img}
                alt={comic.alt}
                className='mx-auto'
              />
            </Link>
          )
        })}
      </section>
    </Layout>
  )
}

export async function getStaticProps(context) {
  const files = await fs.readdir('./comics')
  const latestComicsFiles = files.slice(-8, files.length)

  const promisesReadFiles = latestComicsFiles.map(async (file) => {
    const content = await fs.readFile(`./comics/${file}`, 'utf8')
    return JSON.parse(content)
  })

  const latestComics = await Promise.all(promisesReadFiles)

  return {
    props: {
      latestComics,
    },
  }
}
