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
  const [rewards, setRewards] = useState('')
  const [hasError, setError] = useState(false)
  const walletField = useRef(null)
  const walletRegEx = /[A-Z2-7]{58}/
  const handleWalletChange = async () => {
    const wallet = walletField.current.value
    if (!wallet.match(walletRegEx)) {
      setError(true)
      return
    } else {
      setError(false)
    }
    const rewards = await calculateRewards(wallet)
    console.debug({rewards});
    const months = rewards.months?.join(', ')
    const days = rewards.days?.join(', ')
    const trades = rewards.walletToTradeData[wallet] || 0
    const orders = rewards.walletToOrderCount[wallet] || 0
    const {tierA, tierB, tierBPlus} = rewards
    const calcRewards = ( {tierA, tierB, tierBPlus}) => {
      if (tierA) {
        return 12000
      }
      if (tierBPlus) {
        return 8500
      }
      if (tierB) {
        return 3000
      }
      return 0
    } 
    const rewardsAmount = calcRewards({tierA, tierB, tierBPlus});
    if (!trades && !orders) {
      setRewards(`${wallet} not found in system!`);
    } else {
      setRewards(
        `
        Testnet Rewards Results:

          Months: ${months}
          Days: ${'\u00A0'} ${days}
          Taker Trades: ${trades}
          Maker Orders: ${orders}

          Tier A ${'\u00A0'}Eligible: ${tierA}
          Tier B+ Eligible: ${tierBPlus}
          Tier B ${'\u00A0'}Eligible: ${tierB}

          Rewards (ALGX): ${rewardsAmount}

          This is not counting Testnet liquidity rewards which will be distributed via the rewards app.
          `
      )
    }
  }

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
            variant="standard" onChange={debouncedEventHandler} sx={{width: 400}}
            error={hasError} />
          <Box sx={{ my: 1 }}>
            ** DATABASE MAINTENANCE ONGOING **
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line', 
              fontFamily: 'monospace'}}>
              {rewards}
            </Typography>
          </Box>
        </Box>
      </Container>
    </>
  )
}
