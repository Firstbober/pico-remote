from utils import enum


Command = enum(
    # --- General ---
    POWER=1,
    POWER_ON=2,
    POWER_OFF=3,
    SLEEP=4,
    DISPLAY=5,
    DIMMER=6,
    OPEN_CLOSE = 7,

    # --- Audio / Volume ---
    VOLUME_UP=30,
    VOLUME_DOWN=31,
    MUTE=32,
    TEST_TONE=33,
    BASS_BOOST=34,
    BALANCE_LEFT = 35,
    BALANCE_RIGHT = 36,
    SPEAKER_A_ON = 37,
    SPEAKER_B_ON = 38,
    SPEAKERS_OFF = 39,

    # --- Navigation / Menu ---
    MENU=60,
    UP=61,
    DOWN=62,
    LEFT=63,
    RIGHT=64,
    ENTER=65,
    RETURN=66,
    EXIT=67,
    TITLE_MENU = 68,
    DVD_MENU = 69,

    # --- Transport (DVD/CD/Tape) ---
    PLAY=90,
    PAUSE=91,
    STOP=92,
    RECORD=93,
    REWIND=94,
    FAST_FORWARD=95,
    PREV_TRACK=96,
    NEXT_TRACK=97,
    SLOW_REV=98,
    SLOW_FWD=99,

    # --- Inputs ---
    INPUT_TUNER=120,
    INPUT_CD=121,
    INPUT_PHONO=122,
    INPUT_DVD=123,
    INPUT_TAPE=124,
    INPUT_AUX=125,
    INPUT_VIDEO1=126,
    INPUT_VIDEO2=127,
    INPUT_VIDEO3=128,
    INPUT_TV_VIDEO=129,

    # --- Digits ---
    DIGIT_0=150,
    DIGIT_1=151,
    DIGIT_2=152,
    DIGIT_3=153,
    DIGIT_4=154,
    DIGIT_5=155,
    DIGIT_6=156,
    DIGIT_7=157,
    DIGIT_8=158,
    DIGIT_9=159,

    # --- Tuner Specific ---
    PRESET_UP = 180,
    PRESET_DOWN = 181,
    SCAN_UP = 182,
    SCAN_DOWN = 183,
    TUNING_MODE = 184,
    BAND = 185,
    MEMORY = 186,
    SHIFT = 187,

    # --- Sound Modes ---
    SOUND_FIELD_ON_OFF = 210,
    MODE_2CH = 211,
    MODE_HALL = 212,
    MODE_JAZZ = 213,
    MODE_THEATER = 214,
    MODE_DISCO = 215,
    MODE_CHURCH = 216,
    MODE_STADIUM = 217,
    MODE_DOLBY = 218,
    MODE_CINEMA = 219,
    MODE_MUSIC = 220,
    MODE_AFD = 221,
    MODE_NIGHT = 222,
    MULTI_CH = 223,
    INPUT_MODE_CHANGE = 224,

    # --- EQ / Levels ---
    EQ_ON_OFF = 250,
    EQ_SLOPE = 251,
    EQ_CHANNEL = 252,
    LEVEL_UP = 253,
    LEVEL_DOWN = 254,
    FREQ_UP = 255,
    FREQ_DOWN = 256,
    REAR_LEVEL_UP = 257,
    REAR_LEVEL_DOWN = 258,
    CENTER_LEVEL_UP = 259,
    CENTER_LEVEL_DOWN = 260,
    SUBWOOFER_LEVEL_UP = 261,
    SUBWOOFER_LEVEL_DOWN = 262,

    # --- Additional Audio ---
    AUDIO_CHANGE = 290,

    # --- Additional Transport ---
    STEP_REV=320,
    STEP_FWD=321,
    REPLAY=322,
    REPEAT=323,
    CLEAR=324,

    # --- DVD / Image Features ---
    SUBTITLE = 350,
    ANGLE = 351,
    TIME_TEXT = 352,
    SEARCH_MODE = 353,
    PICTURE_MODE = 354,
    SURROUND_MODE = 355
)
