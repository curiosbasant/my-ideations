import type { LucideProps } from 'lucide-react'

export * from 'lucide-react'

export const DiscordIcon = (props: LucideProps) => (
  <svg
    role='img'
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='currentColor'
    stroke='currentColor'
    strokeWidth='1'
    strokeLinecap='round'
    strokeLinejoin='round'
    className='lucide lucide-discord'
    {...props}>
    <title>Discord Icon</title>
    <path d='M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z' />
  </svg>
)

export const GithubIcon = (props: LucideProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='currentColor'
    stroke='currentColor'
    strokeWidth='1'
    strokeLinecap='round'
    strokeLinejoin='round'
    className='lucide lucide-github'
    {...props}>
    <title>GitHub</title>
    <path d='M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12' />
  </svg>
)
export const GoogleIcon = (props: LucideProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='currentColor'
    stroke='currentColor'
    strokeWidth='1'
    strokeLinecap='round'
    strokeLinejoin='round'
    className='lucide lucide-google'
    {...props}>
    <title>Google Icon</title>
    <path d='M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z' />
  </svg>
)

export default function Icon(props: { name: IconName }) {
  return <span className='font-icon'>{props.name}</span>
}

export type IconName =
  // Action
  | '3d_rotation'
  | 'accessibility'
  | 'accessibility_new'
  | 'accessible'
  | 'accessible_forward'
  | 'account_balance'
  | 'account_balance_wallet'
  | 'account_box'
  | 'account_circle'
  | 'add_shopping_cart'
  | 'alarm'
  | 'alarm_add'
  | 'alarm_off'
  | 'alarm_on'
  | 'all_out'
  | 'android'
  | 'announcement'
  | 'arrow_right_alt'
  | 'aspect_ratio'
  | 'assessment'
  | 'assignment'
  | 'assignment_ind'
  | 'assignment_late'
  | 'assignment_return'
  | 'assignment_returned'
  | 'assignment_turned_in'
  | 'autorenew'
  | 'backup'
  | 'book'
  | 'bookmark'
  | 'bookmark_border'
  | 'bug_report'
  | 'build'
  | 'cached'
  | 'calendar_today'
  | 'calendar_view_day'
  | 'camera_enhance'
  | 'card_giftcard'
  | 'card_membership'
  | 'card_travel'
  | 'change_history'
  | 'check_circle'
  | 'check_circle_outline'
  | 'chrome_reader_mode'
  | 'class'
  | 'code'
  | 'commute'
  | 'compare_arrows'
  | 'contact_support'
  | 'copyright'
  | 'credit_card'
  | 'dashboard'
  | 'date_range'
  | 'delete'
  | 'delete_forever'
  | 'delete_outline'
  | 'description'
  | 'dns'
  | 'done'
  | 'done_all'
  | 'done_outline'
  | 'donut_large'
  | 'donut_small'
  | 'drag_indicator'
  | 'eject'
  | 'euro_symbol'
  | 'event'
  | 'event_seat'
  | 'exit_to_app'
  | 'explore'
  | 'extension'
  | 'face'
  | 'favorite'
  | 'favorite_border'
  | 'feedback'
  | 'find_in_page'
  | 'find_replace'
  | 'fingerprint'
  | 'flight_land'
  | 'flight_takeoff'
  | 'flip_to_back'
  | 'flip_to_front'
  | 'g_translate'
  | 'gavel'
  | 'get_app'
  | 'gif'
  | 'grade'
  | 'group_work'
  | 'help'
  | 'help_outline'
  | 'highlight_off'
  | 'history'
  | 'home'
  | 'horizontal_split'
  | 'hourglass_empty'
  | 'hourglass_full'
  | 'http'
  | 'https'
  | 'important_devices'
  | 'info'
  | 'input'
  | 'invert_colors'
  | 'label'
  | 'label_important'
  | 'language'
  | 'launch'
  | 'line_style'
  | 'line_weight'
  | 'list'
  | 'lock'
  | 'lock_open'
  | 'loyalty'
  | 'markunread_mailbox'
  | 'maximize'
  | 'minimize'
  | 'motorcycle'
  | 'note_add'
  | 'offline_bolt'
  | 'offline_pin'
  | 'opacity'
  | 'open_in_browser'
  | 'open_in_new'
  | 'open_with'
  | 'pageview'
  | 'pan_tool'
  | 'payment'
  | 'perm_camera_mic'
  | 'perm_contact_calendar'
  | 'perm_data_setting'
  | 'perm_device_information'
  | 'perm_identity'
  | 'perm_media'
  | 'perm_phone_msg'
  | 'perm_scan_wifi'
  | 'pets'
  | 'picture_in_picture'
  | 'picture_in_picture_alt'
  | 'play_for_work'
  | 'polymer'
  | 'power_settings_new'
  | 'pregnant_woman'
  | 'print'
  | 'query_builder'
  | 'question_answer'
  | 'receipt'
  | 'record_voice_over'
  | 'redeem'
  | 'remove_shopping_cart'
  | 'reorder'
  | 'report_problem'
  | 'restore'
  | 'restore_from_trash'
  | 'restore_page'
  | 'room'
  | 'rounded_corner'
  | 'rowing'
  | 'schedule'
  | 'search'
  | 'settings'
  | 'settings_applications'
  | 'settings_backup_restore'
  | 'settings_bluetooth'
  | 'settings_brightness'
  | 'settings_cell'
  | 'settings_ethernet'
  | 'settings_input_antenna'
  | 'settings_input_component'
  | 'settings_input_composite'
  | 'settings_input_hdmi'
  | 'settings_input_svideo'
  | 'settings_overscan'
  | 'settings_phone'
  | 'settings_power'
  | 'settings_remote'
  | 'settings_voice'
  | 'shop'
  | 'shop_two'
  | 'shopping_basket'
  | 'shopping_cart'
  | 'speaker_notes'
  | 'speaker_notes_off'
  | 'spellcheck'
  | 'stars'
  | 'store'
  | 'subject'
  | 'supervised_user_circle'
  | 'supervisor_account'
  | 'swap_horiz'
  | 'swap_horizontal_circle'
  | 'swap_vert'
  | 'swap_vertical_circle'
  | 'tab'
  | 'tab_unselected'
  | 'text_rotate_up'
  | 'text_rotate_vertical'
  | 'text_rotation_down'
  | 'text_rotation_none'
  | 'theaters'
  | 'thumb_down'
  | 'thumb_up'
  | 'thumbs_up_down'
  | 'timeline'
  | 'toc'
  | 'today'
  | 'toll'
  | 'touch_app'
  | 'track_changes'
  | 'translate'
  | 'trending_down'
  | 'trending_flat'
  | 'trending_up'
  | 'turned_in'
  | 'turned_in_not'
  | 'update'
  | 'verified_user'
  | 'vertical_split'
  | 'view_agenda'
  | 'view_array'
  | 'view_carousel'
  | 'view_column'
  | 'view_day'
  | 'view_headline'
  | 'view_list'
  | 'view_module'
  | 'view_quilt'
  | 'view_stream'
  | 'view_week'
  | 'visibility'
  | 'visibility_off'
  | 'voice_over_off'
  | 'watch_later'
  | 'work'
  | 'work_off'
  | 'work_outline'
  | 'youtube_searched_for'
  | 'zoom_in'
  | 'zoom_out'

  // Communication
  | 'alternate_email'
  | 'business'
  | 'call'
  | 'call_end'
  | 'call_made'
  | 'call_merge'
  | 'call_missed'
  | 'call_missed_outgoing'
  | 'call_received'
  | 'call_split'
  | 'cancel_presentation'
  | 'cell_wifi'
  | 'chat'
  | 'chat_bubble'
  | 'chat_bubble_outline'
  | 'clear_all'
  | 'comment'
  | 'contact_mail'
  | 'contact_phone'
  | 'contacts'
  | 'dialer_sip'
  | 'dialpad'
  | 'domain_disabled'
  | 'email'
  | 'forum'
  | 'import_contacts'
  | 'import_export'
  | 'invert_colors_off'
  | 'list_alt'
  | 'live_help'
  | 'location_off'
  | 'location_on'
  | 'mail_outline'
  | 'message'
  | 'mobile_screen_share'
  | 'no_sim'
  | 'pause_presentation'
  | 'phone'
  | 'phonelink_erase'
  | 'phonelink_lock'
  | 'phonelink_ring'
  | 'phonelink_setup'
  | 'portable_wifi_off'
  | 'present_to_all'
  | 'ring_volume'
  | 'rss_feed'
  | 'screen_share'
  | 'sentiment_satisfied_alt'
  | 'speaker_phone'
  | 'stay_current_landscape'
  | 'stay_current_portrait'
  | 'stay_primary_landscape'
  | 'stay_primary_portrait'
  | 'stop_screen_share'
  | 'swap_calls'
  | 'textsms'
  | 'unsubscribe'
  | 'voicemail'
  | 'vpn_key'

  // AV
  | '4k'
  | 'add_to_queue'
  | 'airplay'
  | 'album'
  | 'art_track'
  | 'av_timer'
  | 'branding_watermark'
  | 'call_to_action'
  | 'closed_caption'
  | 'control_camera'
  | 'equalizer'
  | 'explicit'
  | 'fast_forward'
  | 'fast_rewind'
  | 'featured_play_list'
  | 'featured_video'
  | 'fiber_dvr'
  | 'fiber_manual_record'
  | 'fiber_new'
  | 'fiber_pin'
  | 'fiber_smart_record'
  | 'forward_10'
  | 'forward_30'
  | 'forward_5'
  | 'games'
  | 'hd'
  | 'hearing'
  | 'high_quality'
  | 'library_add'
  | 'library_books'
  | 'library_music'
  | 'loop'
  | 'mic'
  | 'mic_none'
  | 'mic_off'
  | 'missed_video_call'
  | 'movie'
  | 'music_video'
  | 'new_releases'
  | 'not_interested'
  | 'note'
  | 'pause'
  | 'pause_circle_filled'
  | 'pause_circle_outline'
  | 'play_arrow'
  | 'play_circle_filled'
  | 'play_circle_outline'
  | 'playlist_add'
  | 'playlist_add_check'
  | 'playlist_play'
  | 'queue'
  | 'queue_music'
  | 'queue_play_next'
  | 'radio'
  | 'recent_actors'
  | 'remove_from_queue'
  | 'repeat'
  | 'repeat_one'
  | 'replay'
  | 'replay_10'
  | 'replay_30'
  | 'replay_5'
  | 'shuffle'
  | 'skip_next'
  | 'skip_previous'
  | 'slow_motion_video'
  | 'snooze'
  | 'sort_by_alpha'
  | 'stop'
  | 'subscriptions'
  | 'subtitles'
  | 'surround_sound'
  | 'video_call'
  | 'video_label'
  | 'video_library'
  | 'videocam'
  | 'videocam_off'
  | 'volume_down'
  | 'volume_mute'
  | 'volume_off'
  | 'volume_up'

  // Connection
  | 'add'
  | 'add_box'
  | 'add_circle'
  | 'add_circle_outline'
  | 'archive'
  | 'backspace'
  | 'ballot'
  | 'block'
  | 'clear'
  | 'create'
  | 'delete_sweep'
  | 'drafts'
  | 'file_copy'
  | 'filter_list'
  | 'flag'
  | 'font_download'
  | 'forward'
  | 'gesture'
  | 'how_to_reg'
  | 'how_to_vote'
  | 'inbox'
  | 'link'
  | 'link_off'
  | 'low_priority'
  | 'mail'
  | 'markunread'
  | 'move_to_inbox'
  | 'next_week'
  | 'outlined_flag'
  | 'redo'
  | 'remove'
  | 'remove_circle'
  | 'remove_circle_outline'
  | 'reply'
  | 'reply_all'
  | 'report'
  | 'report_off'
  | 'save'
  | 'save_alt'
  | 'select_all'
  | 'send'
  | 'sort'
  | 'text_format'
  | 'unarchive'
  | 'undo'
  | 'waves'
  | 'weekend'
  | 'where_to_vote'

  // Device
  | 'access_alarm'
  | 'access_alarms'
  | 'access_time'
  | 'add_alarm'
  | 'add_to_home_screen'
  | 'airplanemode_active'
  | 'airplanemode_inactive'
  | 'battery_alert'
  | 'battery_charging_full'
  | 'battery_full'
  | 'battery_std'
  | 'battery_unknown'
  | 'bluetooth'
  | 'bluetooth_connected'
  | 'bluetooth_disabled'
  | 'bluetooth_searching'
  | 'brightness_auto'
  | 'brightness_high'
  | 'brightness_low'
  | 'brightness_medium'
  | 'data_usage'
  | 'developer_mode'
  | 'devices'
  | 'dvr'
  | 'gps_fixed'
  | 'gps_not_fixed'
  | 'gps_off'
  | 'graphic_eq'
  | 'location_disabled'
  | 'location_searching'
  | 'mobile_friendly'
  | 'mobile_off'
  | 'network_cell'
  | 'network_wifi'
  | 'nfc'
  | 'screen_lock_landscape'
  | 'screen_lock_portrait'
  | 'screen_lock_rotation'
  | 'screen_rotation'
  | 'sd_storage'
  | 'settings_system_daydream'
  | 'signal_cellular_4_bar'
  | 'signal_cellular_alt'
  | 'signal_cellular_connected_no_internet_4_bar'
  | 'signal_cellular_no_sim'
  | 'signal_cellular_null'
  | 'signal_cellular_off'
  | 'signal_wifi_4_bar'
  | 'signal_wifi_4_bar_lock'
  | 'signal_wifi_off'
  | 'storage'
  | 'usb'
  | 'wallpaper'
  | 'widgets'
  | 'wifi_lock'
  | 'wifi_tethering'

  // Editor
  | 'add_comment'
  | 'attach_file'
  | 'attach_money'
  | 'bar_chart'
  | 'border_all'
  | 'border_bottom'
  | 'border_clear'
  | 'border_color'
  | 'border_horizontal'
  | 'border_inner'
  | 'border_left'
  | 'border_outer'
  | 'border_right'
  | 'border_style'
  | 'border_top'
  | 'border_vertical'
  | 'bubble_chart'
  | 'drag_handle'
  | 'format_align_center'
  | 'format_align_justify'
  | 'format_align_left'
  | 'format_align_right'
  | 'format_bold'
  | 'format_clear'
  | 'format_color_fill'
  | 'format_color_reset'
  | 'format_color_text'
  | 'format_indent_decrease'
  | 'format_indent_increase'
  | 'format_italic'
  | 'format_line_spacing'
  | 'format_list_bulleted'
  | 'format_list_numbered'
  | 'format_list_numbered_rtl'
  | 'format_paint'
  | 'format_quote'
  | 'format_shapes'
  | 'format_size'
  | 'format_strikethrough'
  | 'format_textdirection_l_to_r'
  | 'format_textdirection_r_to_l'
  | 'format_underlined'
  | 'functions'
  | 'highlight'
  | 'insert_chart'
  | 'insert_chart_outlined'
  | 'insert_comment'
  | 'insert_drive_file'
  | 'insert_emoticon'
  | 'insert_invitation'
  | 'insert_link'
  | 'insert_photo'
  | 'linear_scale'
  | 'merge_type'
  | 'mode_comment'
  | 'monetization_on'
  | 'money_off'
  | 'multiline_chart'
  | 'notes'
  | 'pie_chart'
  | 'publish'
  | 'scatter_plot'
  | 'score'
  | 'short_text'
  | 'show_chart'
  | 'space_bar'
  | 'strikethrough_s'
  | 'table_chart'
  | 'text_fields'
  | 'title'
  | 'vertical_align_bottom'
  | 'vertical_align_center'
  | 'vertical_align_top'
  | 'wrap_text'

  // File
  | 'attachment'
  | 'cloud'
  | 'cloud_circle'
  | 'cloud_done'
  | 'cloud_download'
  | 'cloud_off'
  | 'cloud_queue'
  | 'cloud_upload'
  | 'create_new_folder'
  | 'folder'
  | 'folder_open'
  | 'folder_shared'

  // Hardware
  | 'cast'
  | 'cast_connected'
  | 'computer'
  | 'desktop_mac'
  | 'desktop_windows'
  | 'developer_board'
  | 'device_hub'
  | 'device_unknown'
  | 'devices_other'
  | 'dock'
  | 'gamepad'
  | 'headset'
  | 'headset_mic'
  | 'keyboard'
  | 'keyboard_arrow_down'
  | 'keyboard_arrow_left'
  | 'keyboard_arrow_right'
  | 'keyboard_arrow_up'
  | 'keyboard_backspace'
  | 'keyboard_capslock'
  | 'keyboard_hide'
  | 'keyboard_return'
  | 'keyboard_tab'
  | 'keyboard_voice'
  | 'laptop'
  | 'laptop_chromebook'
  | 'laptop_mac'
  | 'laptop_windows'
  | 'memory'
  | 'mouse'
  | 'phone_android'
  | 'phone_iphone'
  | 'phonelink'
  | 'phonelink_off'
  | 'power_input'
  | 'router'
  | 'scanner'
  | 'security'
  | 'sim_card'
  | 'smartphone'
  | 'speaker'
  | 'speaker_group'
  | 'tablet'
  | 'tablet_android'
  | 'tablet_mac'
  | 'toys'
  | 'tv'
  | 'videogame_asset'
  | 'watch'

  // Images
  | 'add_a_photo'
  | 'add_photo_alternate'
  | 'add_to_photos'
  | 'adjust'
  | 'assistant'
  | 'assistant_photo'
  | 'audiotrack'
  | 'blur_circular'
  | 'blur_linear'
  | 'blur_off'
  | 'blur_on'
  | 'brightness_1'
  | 'brightness_2'
  | 'brightness_3'
  | 'brightness_4'
  | 'brightness_5'
  | 'brightness_6'
  | 'brightness_7'
  | 'broken_image'
  | 'brush'
  | 'burst_mode'
  | 'camera'
  | 'camera_alt'
  | 'camera_front'
  | 'camera_rear'
  | 'camera_roll'
  | 'center_focus_strong'
  | 'center_focus_weak'
  | 'collections'
  | 'collections_bookmark'
  | 'color_lens'
  | 'colorize'
  | 'compare'
  | 'control_point'
  | 'control_point_duplicate'
  | 'crop'
  | 'crop_16_9'
  | 'crop_3_2'
  | 'crop_5_4'
  | 'crop_7_5'
  | 'crop_din'
  | 'crop_free'
  | 'crop_landscape'
  | 'crop_original'
  | 'crop_portrait'
  | 'crop_rotate'
  | 'crop_square'
  | 'dehaze'
  | 'details'
  | 'edit'
  | 'exposure'
  | 'exposure_neg_1'
  | 'exposure_neg_2'
  | 'exposure_plus_1'
  | 'exposure_plus_2'
  | 'exposure_zero'
  | 'filter'
  | 'filter_1'
  | 'filter_2'
  | 'filter_3'
  | 'filter_4'
  | 'filter_5'
  | 'filter_6'
  | 'filter_7'
  | 'filter_8'
  | 'filter_9'
  | 'filter_9_plus'
  | 'filter_b_and_w'
  | 'filter_center_focus'
  | 'filter_drama'
  | 'filter_frames'
  | 'filter_hdr'
  | 'filter_none'
  | 'filter_tilt_shift'
  | 'filter_vintage'
  | 'flare'
  | 'flash_auto'
  | 'flash_off'
  | 'flash_on'
  | 'flip'
  | 'gradient'
  | 'grain'
  | 'grid_off'
  | 'grid_on'
  | 'hdr_off'
  | 'hdr_on'
  | 'hdr_strong'
  | 'hdr_weak'
  | 'healing'
  | 'image'
  | 'image_aspect_ratio'
  | 'image_search'
  | 'iso'
  | 'landscape'
  | 'leak_add'
  | 'leak_remove'
  | 'lens'
  | 'linked_camera'
  | 'looks'
  | 'looks_3'
  | 'looks_4'
  | 'looks_5'
  | 'looks_6'
  | 'looks_one'
  | 'looks_two'
  | 'loupe'
  | 'monochrome_photos'
  | 'movie_creation'
  | 'movie_filter'
  | 'music_note'
  | 'music_off'
  | 'nature'
  | 'nature_people'
  | 'navigate_before'
  | 'navigate_next'
  | 'palette'
  | 'panorama'
  | 'panorama_fish_eye'
  | 'panorama_horizontal'
  | 'panorama_vertical'
  | 'panorama_wide_angle'
  | 'photo'
  | 'photo_album'
  | 'photo_camera'
  | 'photo_filter'
  | 'photo_library'
  | 'photo_size_select_actual'
  | 'photo_size_select_large'
  | 'photo_size_select_small'
  | 'picture_as_pdf'
  | 'portrait'
  | 'remove_red_eye'
  | 'rotate_90_degrees_ccw'
  | 'rotate_left'
  | 'rotate_right'
  | 'shutter_speed'
  | 'slideshow'
  | 'straighten'
  | 'style'
  | 'switch_camera'
  | 'switch_video'
  | 'tag_faces'
  | 'texture'
  | 'timelapse'
  | 'timer'
  | 'timer_10'
  | 'timer_3'
  | 'timer_off'
  | 'tonality'
  | 'transform'
  | 'tune'
  | 'view_comfy'
  | 'view_compact'
  | 'vignette'
  | 'wb_auto'
  | 'wb_cloudy'
  | 'wb_incandescent'
  | 'wb_iridescent'
  | 'wb_sunny'

  // Maps
  | '360'
  | 'add_location'
  | 'atm'
  | 'beenhere'
  | 'category'
  | 'compass_calibration'
  | 'departure_board'
  | 'directions'
  | 'directions_bike'
  | 'directions_boat'
  | 'directions_bus'
  | 'directions_car'
  | 'directions_railway'
  | 'directions_run'
  | 'directions_subway'
  | 'directions_transit'
  | 'directions_walk'
  | 'edit_attributes'
  | 'edit_location'
  | 'ev_station'
  | 'fastfood'
  | 'flight'
  | 'hotel'
  | 'layers'
  | 'layers_clear'
  | 'local_activity'
  | 'local_airport'
  | 'local_atm'
  | 'local_bar'
  | 'local_cafe'
  | 'local_car_wash'
  | 'local_convenience_store'
  | 'local_dining'
  | 'local_drink'
  | 'local_florist'
  | 'local_gas_station'
  | 'local_grocery_store'
  | 'local_hospital'
  | 'local_hotel'
  | 'local_laundry_service'
  | 'local_library'
  | 'local_mall'
  | 'local_movies'
  | 'local_offer'
  | 'local_parking'
  | 'local_pharmacy'
  | 'local_phone'
  | 'local_pizza'
  | 'local_play'
  | 'local_post_office'
  | 'local_printshop'
  | 'local_see'
  | 'local_shipping'
  | 'local_taxi'
  | 'map'
  | 'money'
  | 'my_location'
  | 'navigation'
  | 'near_me'
  | 'not_listed_location'
  | 'person_pin'
  | 'person_pin_circle'
  | 'pin_drop'
  | 'place'
  | 'rate_review'
  | 'restaurant'
  | 'restaurant_menu'
  | 'satellite'
  | 'store_mall_directory'
  | 'streetview'
  | 'subway'
  | 'terrain'
  | 'traffic'
  | 'train'
  | 'tram'
  | 'transfer_within_a_station'
  | 'transit_enterexit'
  | 'trip_origin'
  | 'zoom_out_map'

  // Navigation
  | 'apps'
  | 'arrow_back'
  | 'arrow_back_ios'
  | 'arrow_downward'
  | 'arrow_drop_down'
  | 'arrow_drop_down_circle'
  | 'arrow_drop_up'
  | 'arrow_forward'
  | 'arrow_forward_ios'
  | 'arrow_left'
  | 'arrow_right'
  | 'arrow_upward'
  | 'cancel'
  | 'check'
  | 'chevron_left'
  | 'chevron_right'
  | 'close'
  | 'expand_less'
  | 'expand_more'
  | 'first_page'
  | 'fullscreen'
  | 'fullscreen_exit'
  | 'last_page'
  | 'menu'
  | 'more_horiz'
  | 'more_vert'
  | 'refresh'
  | 'subdirectory_arrow_left'
  | 'subdirectory_arrow_right'
  | 'unfold_less'
  | 'unfold_more'

  // Notification
  | 'adb'
  | 'airline_seat_flat'
  | 'airline_seat_flat_angled'
  | 'airline_seat_individual_suite'
  | 'airline_seat_legroom_extra'
  | 'airline_seat_legroom_normal'
  | 'airline_seat_legroom_reduced'
  | 'airline_seat_recline_extra'
  | 'airline_seat_recline_normal'
  | 'bluetooth_audio'
  | 'confirmation_number'
  | 'disc_full'
  | 'drive_eta'
  | 'enhanced_encryption'
  | 'event_available'
  | 'event_busy'
  | 'event_note'
  | 'folder_special'
  | 'live_tv'
  | 'mms'
  | 'more'
  | 'network_check'
  | 'network_locked'
  | 'no_encryption'
  | 'ondemand_video'
  | 'personal_video'
  | 'phone_bluetooth_speaker'
  | 'phone_callback'
  | 'phone_forwarded'
  | 'phone_in_talk'
  | 'phone_locked'
  | 'phone_missed'
  | 'phone_paused'
  | 'power'
  | 'power_off'
  | 'priority_high'
  | 'sd_card'
  | 'sms'
  | 'sms_failed'
  | 'sync'
  | 'sync_disabled'
  | 'sync_problem'
  | 'system_update'
  | 'tap_and_play'
  | 'time_to_leave'
  | 'tv_off'
  | 'vibration'
  | 'voice_chat'
  | 'vpn_lock'
  | 'wc'
  | 'wifi'
  | 'wifi_off'

  // Places
  | 'ac_unit'
  | 'airport_shuttle'
  | 'all_inclusive'
  | 'beach_access'
  | 'business_center'
  | 'casino'
  | 'child_care'
  | 'child_friendly'
  | 'fitness_center'
  | 'free_breakfast'
  | 'golf_course'
  | 'hot_tub'
  | 'kitchen'
  | 'meeting_room'
  | 'no_meeting_room'
  | 'pool'
  | 'room_service'
  | 'rv_hookup'
  | 'smoke_free'
  | 'smoking_rooms'
  | 'spa'

  // Toggle
  | 'check_box'
  | 'check_box_outline_blank'
  | 'indeterminate_check_box'
  | 'radio_button_checked'
  | 'radio_button_unchecked'
  | 'star'
  | 'star_border'
  | 'star_half'

  // Warning
  | 'add_alert'
  | 'error'
  | 'error_outline'
  | 'notification_important'
  | 'warning'

  // Social
  | 'cake'
  | 'domain'
  | 'group'
  | 'group_add'
  | 'location_city'
  | 'mood'
  | 'mood_bad'
  | 'notifications'
  | 'notifications_active'
  | 'notifications_none'
  | 'notifications_off'
  | 'notifications_paused'
  | 'pages'
  | 'party_mode'
  | 'people'
  | 'people_outline'
  | 'person'
  | 'person_add'
  | 'person_outline'
  | 'plus_one'
  | 'poll'
  | 'public'
  | 'school'
  | 'sentiment_dissatisfied'
  | 'sentiment_satisfied'
  | 'sentiment_very_dissatisfied'
  | 'sentiment_very_satisfied'
  | 'share'
  | 'thumb_down_alt'
  | 'thumb_up_alt'
  | 'whatshot'
