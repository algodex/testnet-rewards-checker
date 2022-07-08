import * as React from 'react'
import Container from '@mui/material/Container'
// import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Head from 'next/head'
import Link from '@/components/Nav/Link'
import {useTranslation} from 'next-i18next'
import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import {defaults} from '../next-i18next.config'
import Box from '@mui/material/Box'
import { useState, useEffect, useMemo, useRef } from 'react'
import debounce from 'lodash.debounce'
import calculateRewards from './calculate-wallet-rewards'

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(
        locale,
        [...defaults, 'index']
      )),
    },
  }
}
export default function Home() {
  const { t } = useTranslation('index')
  const [wallet, setWallet] = useState('XDASDSA')
  const [eligibility, setEligibility] = useState('not eligible')
  const walletField = useRef(null)

  const handleWalletChange = async () => {
    console.log('here')
    const val = walletField.current.value
    const rewards = await calculateRewards(val)
    setWallet(rewards)
  }

  useEffect(() => {
    if (wallet.length == 4) {
      setEligibility(true)
    } else {
      setEligibility(false)
    }
  }, [wallet])

  const debouncedEventHandler = useMemo(
    () => debounce(handleWalletChange, 100)
    ,[])

  return (
    <>
      <Head>
        <title>{t('title')}</title>
        <meta name="description" content={t('description')} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          {/*<Typography variant="h4" component="h1" gutterBottom>
            {t('heading')}
  </Typography> */}
          <Typography variant="body1">
            {t('body')}
          </Typography>
          <TextField id="standard-basic" label="Wallet Address" inputRef={walletField}
            variant="standard" onChange={debouncedEventHandler} />
          <Box sx={{ my: 4 }}>
            <Typography variant="body1">
              Your wallet {wallet} is { eligibility ? 'eligible' : 'ineligible' } for rewards.
              
            </Typography>
          </Box>
        </Box>
      </Container>
    </>
  )
}
