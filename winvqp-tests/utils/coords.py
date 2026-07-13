"""Screen coordinate definitions for WINVQP93 at 1920x1080."""

# Login field click positions (right of labels)
MANAGER_CODE_FIELD = (620, 337)
PASSWORD_FIELD = (620, 393)

# Number pad (login screen, right side panel above QWERTY keyboard)
# 3 columns: left ~1460, center ~1520, right ~1580
NUMPAD = {
    "7": (1460, 230),
    "8": (1520, 230),
    "9": (1580, 230),
    "4": (1460, 327),
    "5": (1520, 327),
    "6": (1580, 327),
    "1": (1460, 424),
    "2": (1520, 424),
    "3": (1580, 424),
    "0": (1520, 521),
}

# QWERTY keyboard
QWERTY_ROW1 = {
    "Q": (221, 610), "W": (355, 610), "E": (490, 610), "R": (625, 610),
    "T": (758, 610), "Y": (892, 610), "U": (1027, 610), "I": (1162, 610),
    "O": (1294, 610), "P": (1431, 610),
}
QWERTY_ROW2 = {
    "A": (220, 690), "S": (355, 690), "D": (489, 690), "F": (625, 690),
    "G": (758, 690), "H": (892, 690), "J": (1026, 690), "K": (1162, 690),
    "L": (1297, 690),
}
QWERTY_ROW3 = {
    "Z": (220, 771), "X": (355, 771), "C": (490, 771), "V": (622, 771),
    "B": (758, 771), "N": (892, 771), "M": (1027, 771),
}

SPECIAL_KEYS = {
    "BACKSPACE": (1632, 611),
    "-": (1430, 692),
    "+": (1564, 691),
    "=": (1699, 691),
    ",": (1160, 780),
    ".": (1296, 778),
    "/": (1431, 772),
    "?": (1564, 768),
    "SPACE": (760, 852),
    "DEL": (1430, 854),
    "<": (1564, 853),
    "=>": (1700, 853),
}

ALL_KEYS = {}
ALL_KEYS.update(NUMPAD)
ALL_KEYS.update(QWERTY_ROW1)
ALL_KEYS.update(QWERTY_ROW2)
ALL_KEYS.update(QWERTY_ROW3)
ALL_KEYS.update(SPECIAL_KEYS)

LOGIN_HEADING = (228, 194)

STATUS_BAR = (31, 1063)
STATUS_BAR_REGION = (0, 1050, 1920, 30)
