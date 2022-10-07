/* 
 * Algodex Service 
 * Copyright (C) 2022 Algodex VASP (BVI) Corp.
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import Head from 'next/head'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Link from '@/components/Nav/Link'
import {useTranslation} from 'next-i18next'
import {defaults} from 'next-i18next.config'

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(
        locale,
        [...defaults, 'favorites']
      )),
    },
  }
}

export default function Home() {
  const { t } = useTranslation('favorites')
  return (
    <>
      <Head>
        <title>{t('title')}</title>
        <meta name="description" content={t('description')} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {t('heading')}
          </Typography>
          <Link href="/" color="secondary">
            {t('home-page-link')}
          </Link>
          <Typography variant="body1">
            {t('body')}
          </Typography>
        </Box>
      </Container>
    </>
  )
}
