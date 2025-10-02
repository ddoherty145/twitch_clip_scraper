# Configuration file for channel highlights scraper

# Popular Gaming Channels
GAMING_CHANNELS = [
    "willneff",
    "fuslie",
    "disguisedtoast", 
    "quarterjade",
    "sydeon",
    "carolinekwan",
    "samwitch",
    "peterpark",
    "drxx",
    "kkatamina",
    "captainsparklez",
    "sykkuno",
    "abe",
    "yoojin",
    "valkyrae",
    "blau",
    "xchocobars",
    "itsryanhiga",
    "ellum",
    "kyacolosseum"

]

# Just Chatting / Variety Channels
VARIETY_CHANNELS = [
    "qtcinderella",
    "extraemily",
    "hasanabi",
    "mizkif",
    "sodapoppin",
    "cinna",
    "nmplol",
    "agent00",
    "39daph",
    "emiru",
    "misterarther",
    "kaicenat"
]

# Competitive Gaming
ESPORTS_CHANNELS = [
    "shroud",
    "s1mple",
    "tarik",
    "stewie2k",
    "scream",
    "tenz",
    "sinatraa",
    "aceu"
]

# Music & Creative
CREATIVE_CHANNELS = [
    "loserfruit",
    "39daph",
    "quarterjade",
    "kkatamina",
    "fuslie",
    "valkyrae"  # Note: might not be on Twitch
]

# Spanish Speaking
SPANISH_CHANNELS = [
    "elrubius",
    "auronplay",
    "ibai",
    "elspreen",
    "rivers_gg"
]

# You can create custom channel lists
CUSTOM_CHANNELS = [
    # Add your preferred channels here
]

# Default configuration
DEFAULT_CONFIG = {
    "channels": GAMING_CHANNELS[:5],  # Top 5 gaming channels
    "days_back": 7,
    "clips_per_channel": 15,
    "separate_sheets": True
}

# Preset configurations
PRESETS = {
    "gaming": {
        "channels": GAMING_CHANNELS[:20],
        "days_back": 1,
        "clips_per_channel": 30,
        "separate_sheets": True
    },
    "variety": {
        "channels": VARIETY_CHANNELS[:12],
        "days_back": 1,
        "clips_per_channel": 30,
        "separate_sheets": True
    },
    "esports": {
        "channels": ESPORTS_CHANNELS,
        "days_back": 1,
        "clips_per_channel": 15,
        "separate_sheets": True
    },
    "weekly_report": {
        "channels": GAMING_CHANNELS[:10],
        "days_back": 1,
        "clips_per_channel": 25,
        "separate_sheets": True
    }
}

def get_preset(preset_name):
    """Get a preset configuration"""
    return PRESETS.get(preset_name, DEFAULT_CONFIG)

def list_presets():
    """List available presets"""
    print("Available presets:")
    for name, config in PRESETS.items():
        print(f"  {name}: {len(config['channels'])} channels, {config['days_back']} days")