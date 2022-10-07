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
import {useTranslation} from 'next-i18next'
import PropTypes from 'prop-types'

// MUI Components
import MUIDrawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'

// Icons
import HomeIcon from '@mui/icons-material/Home'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import MailIcon from '@mui/icons-material/Mail'
import FavoriteIcon from '@mui/icons-material/Favorite'

// Custom MUI Components
import ListItemLink from '@/components/Nav/ListItemLink'


/**
 * Drawer
 * @component
 * @param width
 * @param offset
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function Drawer({width, offset, ...props}){
  const {t} = useTranslation('drawer')
  const { t: common } = useTranslation('common')
  return (
    <MUIDrawer
      variant="permanent"
      sx={{
        width,
        flexShrink: 0,
        ['& .MuiDrawer-paper']: { width, boxSizing: 'border-box' },
      }}
      {...props}
    >
      {/* Add Toolbar for spacing */}
      <Toolbar sx={{height: offset}}/>
      <Box sx={{ overflow: 'auto' }}>
        <List
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              {t('title')}
            </ListSubheader>
          }>
          <ListItemLink to="/" icon={<HomeIcon/>} primary={common('home')}/>
        </List>
        <Divider />

      </Box>
    </MUIDrawer>
  )
}

Drawer.propTypes = {
  /**
   * width
   */
  width: PropTypes.number.isRequired,
  /**
   * offset
   */
  offset: PropTypes.number
}

Drawer.defaultProps = {
  width: 250
}
export default Drawer
