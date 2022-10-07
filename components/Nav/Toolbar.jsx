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

import React from 'react'
import PropTypes from 'prop-types'
import {useTranslation} from 'next-i18next'

// MUI Components
import MUIToolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Typography from '@mui/material/Typography'

// Custom Language Selector
import LocaleNavMenu from '@/components/Nav/LocaleNavMenu'

/**
 * Toolbar
 * @param title
 * @param height
 * @param isMobile
 * @param onClick
 * @param rest
 * @returns {JSX.Element}
 * @constructor
 */
function Toolbar({title, height, isMobile, onClick, ...rest}) {
  const { t } = useTranslation('toolbar')
  return (
    <MUIToolbar sx={{height}} {...rest}>
      {/* TODO: Make Menu Collapsable*/}
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        sx={{ mr: 2 }}
        onClick={()=>{alert('TODO: Make Menu Collapse')}}
      >
        <MenuIcon />
      </IconButton>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        {title || t('title')}
      </Typography>
    {/*  <LocaleNavMenu isMobile={isMobile} onClick={onClick}/> */}
    </MUIToolbar>
  )
}

Toolbar.propTypes = {
  /**
   * onClick
   */
  onClick: PropTypes.func.isRequired,
  /**
   * height
   */
  height: PropTypes.number,
  /**
   * isMobile
   */
  isMobile: PropTypes.bool
}

Toolbar.defaultProps = {
  onClick: console.log
}
export default Toolbar
