
import PouchDB from 'pouchdb'
import PouchMapReduce from 'pouchdb-mapreduce'
import PouchFind from 'pouchdb-find'
import PouchSearch from 'pouchdb-quick-search'
PouchDB.plugin(PouchMapReduce)
PouchDB.plugin(PouchFind)
PouchDB.plugin(PouchSearch)

const getWalletToDates = (rows, dateType) => {
  const walletToDates = rows.filter(row =>
    row.key !== undefined && row.value !== undefined)
    .filter(row => {
      const type = row.key.split(':')[1]
      return type === dateType
    }).reduce((map, row) => {
      const wallet = row.key.split(':')[0]
      if (map[wallet] === undefined) {
        map[wallet] = new Set()
      }
      map[wallet].add(row.value)
      return map
    }, {})
  return walletToDates
}

const setData = (walletMap, walletToInfo, key) => {
  Object.keys(walletMap).forEach(wallet => {
    const val = walletMap[wallet].size || walletMap[wallet]
    if (walletToInfo[wallet] === undefined) {
      walletToInfo[wallet] = {}
    }
    walletToInfo[wallet][key] = val
  })
}

const getDatabase = (name) => {
  const hostname = window.location.hostname
  const protocol = window.location.protocol
  const port = window.location.port
  const baseUrl = protocol + '//' + hostname +':' + port + '/pouch'
  const options = {
    auth: {
      username: 'dbreader',
      password: 'plaintext_password',
    }
  }
  const db = new PouchDB(`${baseUrl}/${name}`, options)
  return db
}

const isEligibleForTierA = (entry) => {
  const tradeCount = entry.tradeCount || 0
  const orderCount = entry.orderCount || 0
  const dateCount = entry.dateCount || 0
  const monthCount = entry.monthCount || 0
  return orderCount >= 5 && tradeCount >=10
    && monthCount >= 2 && dateCount >= 5
}


const isEligibleForTierB = (entry) => {
  const tradeCount = entry.tradeCount || 0
  const orderCount = entry.orderCount || 0
  const dateCount = entry.dateCount || 0
  return orderCount >= 5 && tradeCount >=10 && dateCount >= 2

}


const isEligibleForTierBPlus = (entry) => {
  const tradeCount = entry.tradeCount || 0
  const orderCount = entry.orderCount || 0
  const dateCount = entry.dateCount || 0
  return (orderCount + tradeCount >=20) && dateCount >= 10
}



const calculateRewards = async (wallet) => {
  const formattedEscrowDB = getDatabase('testnet_formatted_escrow')
  const formattedHistoryDB = getDatabase('testnet_formatted_history')

  const escrowDates =
  await formattedEscrowDB.query('formatted_escrow/distinctDates',
    {reduce: false, keys: [wallet+':date', wallet+':month']} )

  const historyDates =
  await formattedHistoryDB.query('formatted_history/distinctDates',
    {reduce: false, keys: [wallet+':date', wallet+':month']} )

  const accountData = {rows: [...escrowDates.rows, ...historyDates.rows]};

  const tradeData =
    await formattedHistoryDB.query('formatted_history/activityView',
      {reduce: true, group: true, keys: [wallet]} )

  const orderCountData =
    await formattedEscrowDB.query('formatted_escrow/openOrderCount',
      {reduce: true, group: true, keys: [wallet]} )

  const walletToOrderCount = orderCountData.rows.reduce((map, row) => {
    const wallet = row.key
    map[wallet] = row.value
    return map
  }, {})

  const walletToTradeData = tradeData.rows.reduce((map, row) => {
    const wallet = row.key
    map[wallet] = row.value
    return map
  }, {})
  const walletToMonths = getWalletToDates(accountData.rows, 'month')
  const walletToDates = getWalletToDates(accountData.rows, 'date')
  const walletToInfo = {}
  
  // Object.keys(walletToDates).reduce( (map, wallet) => {
  //   const dateCount = walletToDates[wallet].size;
  //   const info = { dateCount };
  //   map[wallet] = info;
  //   return map;
  // }, {});
  setData(walletToMonths, walletToInfo, 'monthCount')
  setData(walletToDates, walletToInfo, 'dateCount')
  setData(walletToTradeData, walletToInfo, 'tradeCount')
  setData(walletToOrderCount, walletToInfo, 'orderCount')

  const entry = walletToInfo[wallet] || {'monthCount':0, 'tradeCount':0,
    'dateCount':0, 'orderCount':0
  }
  const tierA = isEligibleForTierA(entry)
  const tierBPlus = isEligibleForTierBPlus(entry) && !tierA
  const tierB = isEligibleForTierB(entry) && !tierBPlus && !tierA
  const months = Array.from(walletToMonths[wallet] || new Set())
  const days = Array.from(walletToDates[wallet] || new Set())
  return { months, days, walletToTradeData, walletToOrderCount,
    tierA, tierB, tierBPlus }
}

export default calculateRewards