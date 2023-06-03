import Link from 'next/link'
import Image from 'next/image'
import Layout from 'components/PageLayout'
import { search } from 'services/search'
import { useI18N } from 'context/i18n'

export default function Component({ query, results }) {
  const { t } = useI18N()

  return (
    <Layout title={t('SEARCH_TITLE', query)}>
      <h1 className='p-4 mb-4 rounded-md bg-gray-100'>
        {t('SEARCH_QUERY', results.length, query)}
      </h1>
      {results.map((result) => {
        return (
          <Link
            href={`/comic/${result.id}`}
            key={result.id}
            className='flex flex-row content-center justify-start border p-4 bg-slate-300 hover:bg-slate-50'
          >
            <Image
              width='50'
              height='50'
              src={result.img}
              alt={result.alt}
              className='rounded-full'
            />
            <div className='m-auto'>
              <h2 className='text-center'>{result.title}</h2>
            </div>
          </Link>
        )
      })}
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const { query } = context
  const { q = '' } = query

  const { results } = await search({ query: q })

  return {
    props: {
      query: q,
      results,
    },
  }
}
