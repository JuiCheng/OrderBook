// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'
import { aliases, fa } from 'vuetify/iconsets/fa'
export default createVuetify({
  icons: {
    defaultSet: 'fa',
    aliases,
    sets: {
      fa
    }
  },
  theme: {
    themes: {
      light: {
        dark: false,
        colors: {
          Background_color: '#131B29',
          Default_text_color: '#F0F4F8',
          Quote_table_head_text_color: '#8698aa',
          Buy_quote_price_text_color: '#00b15d',
          Sell_quote_price_text_color: '#FF5B5A',
          Quote_row_hover_background_color: '#1E3059',
          Buy_quote_accumulative_total_size_bar_color: 'rgba(16, 186, 104, 0.12)',
          Sell_quote_accumulative_total_size_bar_color: 'rgba(255, 90, 90, 0.12)',
          Animation_flash_green_background_color: 'rgba(0, 177, 93, 0.5)',
          Animation_flash_red_background_color: 'rgba(255, 91, 90, 0.5)'
        }
      }
    }
  }
})
