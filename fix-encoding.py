from pathlib import Path

ROOT = Path(__file__).resolve().parent

REPLACEMENTS = {
    'â€™': '’',
    'â€˜': '‘',
    'â€œ': '“',
    'â€': '”',
    'â€‘': '‑',
    'â€“': '–',
    'â€”': '—',
    'Â©': '©',
    'Â ': ' ',
    'Ã¡': 'á',
    'Ã©': 'é',
    'Ã­': 'í',
    'Ã³': 'ó',
    'Ãº': 'ú',
    'Ã±': 'ñ',
    'Ã¼': 'ü',
    'Ã': 'Á',
    'Ã‰': 'É',
    'Ã': 'Í',
    'Ã“': 'Ó',
    'Ãš': 'Ú',
    'Ãœ': 'Ü',
    'Ã‘': 'Ñ',
    'Ã€': 'À',
    'Ãˆ': 'È',
    'ÃŒ': 'Ì',
    'Ã’': 'Ò',
    'Ã™': 'Ù',
    'Ã¢': 'â',
    'Ãª': 'ê',
    'Ã®': 'î',
    'Ã´': 'ô',
    'Ãµ': 'õ',
    'Ã§': 'ç',
    'ÃŸ': 'ß',
    'Ã¥': 'å',
    'Ã¦': 'æ',
    'Ã¸': 'ø',
    'Ã…': 'Å',
    'Ã‡': 'Ç',
    'Ã—': '×',
    'Ã ': 'à',
    'â€': '"',
}


def clean_file(path: Path) -> bool:
    try:
        text = path.read_text(encoding='utf-8')
    except UnicodeDecodeError:
        text = path.read_text(encoding='cp1252')

    original = text
    for bad, good in REPLACEMENTS.items():
        text = text.replace(bad, good)

    if text != original:
        path.write_text(text, encoding='utf-8')
        return True
    return False


if __name__ == '__main__':
    changed = 0
    for file in sorted(ROOT.rglob('*.html')):
        if clean_file(file):
            changed += 1
    print(f'Fixed mojibake in {changed} HTML files.')
