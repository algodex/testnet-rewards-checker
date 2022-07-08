
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
  const baseUrl = 'http://localhost:3000/pouch'
  const options = {
    auth: {
      username: 'admin',
      password: 'dex',
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
const calculateRewards = async (wallet) => {
  const formattedEscrowDB = getDatabase('formatted_escrow')
  const formattedHistoryDB = getDatabase('formatted_history')

  const accountData =
  await formattedEscrowDB.query('formatted_escrow/distinctDates',
    {reduce: false, keys: [wallet]} )

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

  return { walletToMonths, walletToDates, walletToTradeData, walletToOrderCount }
}

export default calculateRewards