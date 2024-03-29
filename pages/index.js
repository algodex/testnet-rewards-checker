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
    console.debug({rewards})
    const months = rewards.months?.join(', ')
    const days = rewards.days?.join(', ')
    const trades = rewards.walletToTradeData[wallet] || 0
    const orders = rewards.walletToOrderCount[wallet] || 0
    const {tierA, tierB, tierBPlus} = rewards
    const calcRewards = ( {tierA, tierB, tierBPlus}) => {
      if (tierA) {
        return 15710.57
      }
      if (tierBPlus) {
        return 8500
      }
      if (tierB) {
        return 3000
      }
      return 0
    } 
    const rewardsAmount = calcRewards({tierA, tierB, tierBPlus})
    if (!trades && !orders) {
      setRewards(`${wallet} not found in system!`)
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
            {/*** DATABASE MAINTENANCE ONGOING ***/}
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
