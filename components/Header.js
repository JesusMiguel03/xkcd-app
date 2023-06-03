import { useI18N } from 'context/i18n'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'

export function Header() {
  const { t } = useI18N()
  const { locale, locales } = useRouter()
  const [results, setResults] = useState([])
  const searchRef = useRef()

  const getValue = () => searchRef.current?.value

  const handleChange = () => {
    const q = getValue()

    if (!q) return

    fetch(`/api/search?q=${q}`)
      .then((res) => res.json())
      .then((searchResults) => {
        setResults(searchResults)
      })
  }

  const restOfLocales = locales.filter((l) => l !== locale)

  return (
    <header className='p-4 flex justify-between items-center bg-gray-100'>
      <h2 className='font-bold border-b px-2 border-blue-300'>
        <Link href='/'>
          pGame<span className='font-light italic'>Studios</span>
        </Link>
      </h2>
      <nav>
        <ul className='flex gap-2'>
          <li>
            <Link
              href='/'
              className='border py-1 px-4 rounded hover:bg-sky-100'
            >
              {t('HOME')}
            </Link>
          </li>

          <li>
            <input
              className='px-4 py-1 text-xs border border-gray-400 rounded-3xl outline-none focus:border-gray-700 bg-gray-100 hover:bg-white focus:bg-white'
              ref={searchRef}
              type='search'
              placeholder='Search...'
              onChange={handleChange}
            />
            <div className='relative z-10'>
              {Boolean(results.length) && (
                <div className='absolute top-0 left-0'>
                  <ul className='z-50 w-full overflow-hidden bg-white border rounded-lg shadow-xl border-gray-50'>
                    <li
                      className='m-0'
                      key='all-results'
                    >
                      <Link href={`/search?q=${getValue()}`}>
                        <a className='block px-2 py-1 overflow-hidden text-sm italic font-semibold text-gray-400 hover:bg-slate-200 text-ellipsis whitespace-nowrap'>
                          Ver {results.length} resultados
                        </a>
                      </Link>
                    </li>

                    {results.map((result) => {
                      return (
                        <li
                          className='m-0'
                          key={result.id}
                        >
                          <Link href={`/comic/${result.id}`}>
                            <a className='block px-2 py-1 overflow-hidden text-sm font-semibold hover:bg-slate-200 text-ellipsis whitespace-nowrap'>
                              {result.title}
                            </a>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </div>
          </li>

          <li>
            <Link
              href='/'
              locale={restOfLocales[0]}
              className='border rounded px-2 py-1 hover:bg-sky-100'
            >
              {restOfLocales[0]}
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
