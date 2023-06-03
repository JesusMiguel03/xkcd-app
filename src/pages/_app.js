import '@/styles/globals.css'
import { I18NProvider } from 'context/i18n'

export default function App({ Component, pageProps }) {
  return (
    <I18NProvider>
      <Component {...pageProps} />
    </I18NProvider>
  )
}
