# FIT System Manual - Generation Plan

## Files to Create

### 1. `C:\Users\shaye\Desktop\fit\gen_manual.py`
Full Python script to generate `FIT_System_Manual.docx`. Save the script content (below), then run:

```powershell
python C:\Users\shaye\Desktop\fit\gen_manual.py
```

**Prerequisites verified:**
- python-docx 1.2.0 ✓
- Pillow 12.2.0 ✓
- flowchart.png exists ✓
- InventoryForecast.sql exists ✓  
- issue2.png exists ✓

## Script Content

Save the following as `C:\Users\shaye\Desktop\fit\gen_manual.py`:

```python
"""Generate FIT System Professional Manual (.docx)"""
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor, Emu
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_LINE_SPACING
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.section import WD_ORIENT
from docx.oxml.ns import qn, nsdecls
from docx.oxml import parse_xml, OxmlElement
import os

OUT = r'C:\Users\shaye\Desktop\fit\FIT_System_Manual.docx'
FIT_DIR = r'C:\Users\shaye\Desktop\fit'

# ── Color constants ──────────────────────────────────────────────
NAVY   = RGBColor(0x1F, 0x38, 0x64)
BLUE   = RGBColor(0x2E, 0x4A, 0x7A)
LB     = RGBColor(0x3B, 0x5D, 0x8C)
WHITE  = RGBColor(0xFF, 0xFF, 0xFF)
GRAY   = RGBColor(0x66, 0x66, 0x66)
LGRAY  = RGBColor(0x88, 0x88, 0x88)
TEXT   = RGBColor(0x33, 0x33, 0x33)
GOLD   = RGBColor(0xB4, 0x53, 0x09)
GREEN  = RGBColor(0x05, 0x96, 0x69)

BLUE_HEX = '1F3864'
ALT_ROW   = 'E8EDF4'

def set_cell_shade(cell, color_hex):
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), color_hex)
    tcPr.append(shd)

def make_table(doc, headers, rows, col_widths=None, font_size=9.5, header_size=10):
    t = doc.add_table(rows=1 + len(rows), cols=len(headers))
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    t.style = 'Table Grid'
    for i, h in enumerate(headers):
        c = t.rows[0].cells[i]
        c.text = h
        for p in c.paragraphs:
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            for r in p.runs:
                r.bold = True
                r.font.size = Pt(header_size)
                r.font.color.rgb = WHITE
        set_cell_shade(c, BLUE_HEX)
    for ri, rd in enumerate(rows):
        for ci, v in enumerate(rd):
            c = t.rows[ri + 1].cells[ci]
            c.text = str(v)
            for p in c.paragraphs:
                for r in p.runs:
                    r.font.size = Pt(font_size)
            if ri % 2 == 0:
                set_cell_shade(c, ALT_ROW)
    if col_widths:
        for i, w in enumerate(col_widths):
            for row in t.rows:
                row.cells[i].width = Inches(w)
    doc.add_paragraph()
    return t

def code_block(doc, lines, font_size=9):
    for line in lines:
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(1)
        p.paragraph_format.left_indent = Inches(0.3)
        r = p.add_run(line)
        r.font.name = 'Consolas'
        r.font.size = Pt(font_size)
        r.font.color.rgb = TEXT

def bullet(doc, text, indent=0.3, size=10.5):
    p = doc.add_paragraph(text, style='List Bullet')
    p.paragraph_format.left_indent = Inches(indent)
    for r in p.runs:
        r.font.size = Pt(size)

def bold_normal(doc, bold_text, normal_text='', size=10.5):
    p = doc.add_paragraph()
    r = p.add_run(bold_text)
    r.bold = True
    r.font.size = Pt(size)
    if normal_text:
        r = p.add_run(normal_text)
        r.font.size = Pt(size)

def add_heading(doc, text, level=1):
    return doc.add_heading(text, level=level)

def page_break(doc):
    doc.add_page_break()

def add_image(doc, path, width_inches=6.0):
    if os.path.exists(path):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run()
        r.add_picture(path, width=Inches(width_inches))

def section_title(doc, num, title):
    add_heading(doc, f'{num}. {title}', level=1)

def subsection(doc, num, title):
    add_heading(doc, f'{num} {title}', level=2)

def subsubsection(doc, num, title):
    add_heading(doc, f'{num} {title}', level=3)


# ═══════════════════════════════════════════════════════════════════
#  BUILD DOCUMENT
# ═══════════════════════════════════════════════════════════════════

doc = Document()

for s in doc.sections:
    s.page_width = Inches(8.5)
    s.page_height = Inches(11)
    s.left_margin = Inches(1)
    s.right_margin = Inches(1)
    s.top_margin = Inches(0.9)
    s.bottom_margin = Inches(0.9)

style = doc.styles['Normal']
style.font.name = 'Calibri'
style.font.size = Pt(10.5)
style.paragraph_format.space_after = Pt(4)
style.paragraph_format.space_before = Pt(2)
style.paragraph_format.line_spacing = 1.15

for lvl, (sz, clr) in {
    1: (16, NAVY), 2: (13, BLUE), 3: (11.5, LB)
}.items():
    h = doc.styles[f'Heading {lvl}']
    h.font.name = 'Calibri'
    h.font.size = Pt(sz)
    h.font.bold = True
    h.font.color.rgb = clr
    h.paragraph_format.space_before = Pt(24 - (lvl - 1) * 6)
    h.paragraph_format.space_after = Pt(8 - (lvl - 1) * 2)
    h.paragraph_format.keep_with_next = True


# ═══════════════════════════════════════════════════════════════════
#  COVER PAGE
# ═══════════════════════════════════════════════════════════════════

for _ in range(5):
    doc.add_paragraph()

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = p.add_run('VQPBOS FORECASTING SYSTEM')
r.bold = True
r.font.size = Pt(28)
r.font.color.rgb = NAVY

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = p.add_run('FIT System Manual')
r.font.size = Pt(16)
r.font.color.rgb = BLUE

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = p.add_run('Forecast Inventory Tool')
r.font.size = Pt(13)
r.font.color.rgb = GRAY

doc.add_paragraph()

for txt in ['Red Ribbon Bakeshop\nJollibee Foods Corporation (JFC)', 'Philippines']:
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run(txt)
    r.font.size = Pt(13)
    r.font.color.rgb = GRAY

for _ in range(3):
    doc.add_paragraph()

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = p.add_run('Document Version: 1.0  |  June 2026')
r.font.size = Pt(11)
r.font.color.rgb = LGRAY

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = p.add_run('Author: Kien Bautista')
r.font.size = Pt(11)
r.font.color.rgb = LGRAY

page_break(doc)


# ═══════════════════════════════════════════════════════════════════
#  DOCUMENT CONTROL
# ═══════════════════════════════════════════════════════════════════

section_title(doc, '0', 'Document Control')

subsection(doc, '0.1', 'Version History')
make_table(doc,
    ['Version', 'Date', 'Author', 'Description'],
    [
        ['1.0', 'Jun 2026', 'Kien Bautista', 'Initial comprehensive system manual'],
        ['2.7', 'Aug 2024', 'Kien Bautista', 'CRF FIT v2.7'],
        ['3.5', 'Apr 2025', 'Kien Bautista', 'CRF Addendum v3.5'],
    ],
    [1.0, 1.2, 1.5, 3.5]
)

subsection(doc, '0.2', 'Table of Contents')
toc = [
    ('1', 'System Overview', ''),
    ('  1.1', 'Purpose & Scope', ''),
    ('  1.2', 'Forecasting Modes', 'Weighted Avg / ADQ'),
    ('  1.3', 'Forecast Levels', 'Finished Goods / Raw Materials'),
    ('2', 'Technical Architecture', ''),
    ('3', 'Database Schema', ''),
    ('  3.1', 'TFCTMNRR', 'Forecast Master'),
    ('  3.2', 'TFCTSBRR', 'Forecast Sub-table'),
    ('  3.3', 'TFCTMRRR', 'Raw Material Override'),
    ('  3.4', 'MITMBUFF', 'Buffer Configuration'),
    ('  3.5', 'MITMXCLD', 'Item/Category Exclusions'),
    ('  3.6', 'MEXMDTUPD', 'Excluded Dates'),
    ('  3.7', 'Supporting Tables', 'TPRDHIST, TINVUSGE, MNUDTAIL, DAHISALL, FCERRLOG'),
    ('  3.8', 'Entity Relationships', ''),
    ('4', 'Stored Procedures', ''),
    ('  4.1', 'MakeFQuery', 'Sales History / Weighted Avg'),
    ('  4.2', 'DailyProductForecast', 'Finished Goods Forecast'),
    ('  4.3', 'InventoryForecast', 'Raw Materials Forecast (full code)'),
    ('  4.4', 'ADQApplyEditSetting', 'ADQ Recompute'),
    ('  4.5', 'Wastage & Stockout KPI', 'Analytics Metrics'),
    ('5', 'Key Formulas', '11 formulas'),
    ('6', 'INI Configuration', '10 settings'),
    ('7', 'UI Specifications', '4 screens with screenshots'),
    ('8', 'End-to-End Data Flow', 'Flowchart + step table'),
    ('9', 'Deployment Guide', 'PRZ structure + procedure'),
    ('10', 'Version History', 'Full timeline'),
    ('A', 'Appendix: Buffer Seed Data', 'MITMBUFF codes'),
    ('B', 'Appendix: Exclusion Lists', 'Categories + products'),
]
for num, name, desc in toc:
    p = doc.add_paragraph()
    r = p.add_run(f'{num}  {name}')
    r.font.size = Pt(11)
    if not num.startswith(' '):
        r.bold = True
    if desc:
        r = p.add_run(f'  - {desc}')
        r.font.size = Pt(9.5)
        r.font.color.rgb = LGRAY

page_break(doc)


# ═══════════════════════════════════════════════════════════════════
#  1. SYSTEM OVERVIEW
# ═══════════════════════════════════════════════════════════════════

section_title(doc, '1', 'System Overview')

subsection(doc, '1.1', 'Purpose & Scope')
doc.add_paragraph(
    'The VQPBOS Forecasting System (FIT - Forecast Inventory Tool) is a multi-layered '
    'demand forecasting and inventory replenishment system designed for Red Ribbon Bakeshop, '
    'a subsidiary of Jollibee Foods Corporation (JFC) in the Philippines. Built on Microsoft '
    'SQL Server stored procedures called by Visual FoxPro executables, it generates both '
    'finished goods and raw material forecasts to drive purchase orders and production planning.'
)
doc.add_paragraph(
    'The system replaces the older Store Ordering Module (SOM) with a more sophisticated '
    'tool featuring prioritization levels, dynamic buffer calculations, ADQ settings, and '
    'KPI analytics for wastage and stockout monitoring.'
)

subsection(doc, '1.2', 'Forecasting Modes')
make_table(doc,
    ['Mode', 'Method', 'Uplift', 'Use Case'],
    [
        ['Weighted (default)', '4:3:2:1 recency-weighted per DOW', 'Yes', 'Stable products'],
        ['ADQ Mode', 'Simple mean per DOW', 'No', 'New / low-history items'],
    ],
    [1.8, 2.0, 1.5, 1.8]
)

subsection(doc, '1.3', 'Forecast Levels')
make_table(doc,
    ['Level', 'Stored Procedure', 'Output'],
    [
        ['Finished Goods', 'DailyProductForecast', 'prjToday..prjNext2, BegBal, BegInv, TheoEnding'],
        ['Raw Materials', 'InventoryForecast', 'Suggested Order Qty, Final Qty, Sales Potential'],
    ],
    [1.3, 1.8, 4.0]
)

page_break(doc)


# ═══════════════════════════════════════════════════════════════════
#  2. TECHNICAL ARCHITECTURE
# ═══════════════════════════════════════════════════════════════════

section_title(doc, '2', 'Technical Architecture')

make_table(doc,
    ['Tier', 'Technology', 'Component', 'Role'],
    [
        ['Presentation', 'FoxPro / Harbour', 'RRFcst.exe', 'Store interface, order entry, KPI analytics'],
        ['Application', 'MSSQL T-SQL SPs', 'MakeFQuery, DailyProductForecast\nInventoryForecast, ADQApplyEditSetting', 'Business logic, weighted/ADQ, buffer, BOM'],
        ['Data', 'MSSQL (VQPBOS)', '10+ tables', 'Master data, forecasts, history, config'],
    ],
    [1.3, 1.5, 2.2, 2.5]
)

page_break(doc)


# ═══════════════════════════════════════════════════════════════════
#  3. DATABASE SCHEMA
# ═══════════════════════════════════════════════════════════════════

section_title(doc, '3', 'Database Schema')

subsection(doc, '3.1', 'TFCTMNRR - Forecast Master')
bold_normal(doc, 'PK: ', 'fm_no')
make_table(doc,
    ['Column', 'Type', 'Purpose'],
    [
        ['fm_no', 'char(10) PK', 'Forecast master number'],
        ['fm_date', 'smalldatetime', 'Date created'],
        ['fm_stid', 'char(4)', 'Store ID'],
        ['fm_posted', 'bit', 'Posted/finalized flag'],
        ['fm_from', 'smalldatetime', 'Forecast period start'],
        ['fm_to', 'smalldatetime', 'Forecast period end'],
        ['fm_optn', 'char(1)', "'W'=Weekly, 'D'=Delivery"],
        ['fm_leadtm', 'int', 'Lead time in days'],
        ['fm_del2day', 'bit', 'Delivery today override'],
        ['fm_del2m', 'bit', 'Delivery tomorrow override'],
    ],
    [1.6, 1.6, 3.0]
)

subsection(doc, '3.2', 'TFCTSBRR - Forecast Sub-table')
bold_normal(doc, 'FK: ', 'fs_fmno -> TFCTMNRR.fm_no')
make_table(doc,
    ['Column', 'Type', 'Purpose'],
    [
        ['fs_fmno', 'char(10) FK', 'Forecast master number'],
        ['fs_itemid', 'char(20)', 'Item/Product ID'],
        ['fs_qty', 'smallmoney', 'Forecast Quantity'],
        ['fs_sales', 'money', 'Forecast sales amount'],
        ['fs_dow', 'smallint', 'Day of week (1-7)'],
        ['fs_pctcont', 'smallint', 'Percentage contribution'],
        ['fs_buffer', 'smallint', 'Buffer percentage'],
        ['fs_wktom', 'smallint', 'Sales projection - Tomorrow'],
        ['fs_wknxt', 'smallint', 'Sales projection - Order Day'],
        ['fs_today', 'smallint', 'Sales projection - Today'],
        ['fs_wknxt2', 'smallint', 'Sales projection - Day+2'],
        ['fs_endbal', 'smallmoney', 'Ending balance'],
        ['fs_catcode', 'varchar(10)', 'Category code'],
    ],
    [1.6, 1.6, 3.0]
)

subsection(doc, '3.3', 'TFCTMRRR - Raw Material Override')
make_table(doc,
    ['Column', 'Type', 'Purpose'],
    [
        ['fr_fmno', 'char(10) FK', 'FK to TFCTMNRR.fm_no'],
        ['fr_itemid', 'char(20)', 'Raw material item ID'],
        ['fr_buffer', 'smallint', 'Manual buffer override'],
        ['fr_FinalQty', 'smallint', 'Manual final order qty'],
        ['fr_OrderQty', 'smallint', 'Suggested order qty'],
        ['fr_la', 'smallint', 'Lead-time adj - Today'],
        ['fr_2mla', 'smallint', 'Lead-time adj - Tomorrow'],
        ['fr_2daydel', 'smallint', 'Delivery today override'],
    ],
    [1.6, 1.6, 3.0]
)

subsection(doc, '3.4', 'MITMBUFF - Buffer Configuration')
make_table(doc,
    ['Column', 'Type', 'Purpose'],
    [
        ['ib_code', 'varchar(4) PK', 'Buffer code (C10-P40)'],
        ['ib_desc', 'char(15)', 'Priority level name'],
        ['ib_lower', 'smallmoney', 'Lower qty bracket'],
        ['ib_upper', 'smallmoney', 'Upper qty bracket'],
        ['ib_buffer', 'int', 'Buffer percentage'],
        ['ib_daily', 'bit', 'Daily flag for cutoff'],
    ],
    [1.6, 1.6, 3.0]
)

subsubsection(doc, '3.4.1', 'Seed Data')
make_table(doc,
    ['Code', 'Description', 'Category', 'Priority'],
    [
        ['C10', 'CAKE - HIGH', 'Cake', 'High'],
        ['C20', 'CAKE - NEW', 'Cake', 'New'],
        ['C30', 'CAKE - MID', 'Cake', 'Mid'],
        ['C40', 'CAKE - LOW', 'Cake', 'Low'],
        ['P10', 'PBD - HIGH', 'PBD', 'High'],
        ['P20', 'PBD - NEW', 'PBD', 'New'],
        ['P30', 'PBD - MID', 'PBD', 'Mid'],
        ['P40', 'PBD - LOW', 'PBD', 'Low'],
    ],
    [1.0, 2.0, 1.5, 1.5]
)

subsection(doc, '3.5', 'MITMXCLD - Item/Category Exclusions')
make_table(doc,
    ['Column', 'Type', 'Purpose'],
    [['ix_code', 'varchar(20) PK', 'Item ID or Category code'],
     ['ix_type', 'char(30)', "'P'=Product, 'C'=Category"]],
    [1.8, 1.8, 3.0]
)

subsection(doc, '3.6', 'MEXMDTUPD - Excluded Dates')
make_table(doc,
    ['Column', 'Type', 'Purpose'],
    [['ed_date', 'smalldatetime', 'Date with no ordering'],
     ['ed_desc', 'char(15)', 'Description'],
     ['ed_recurr', 'bit', 'Recurring annually']],
    [1.8, 1.8, 3.0]
)

subsection(doc, '3.7', 'Supporting Tables')

for tname, tcols in [
    ('TPRDHIST - Product Sales History',
     [['ph_stid', 'char(4)', 'Store ID'],
      ['ph_date', 'smalldatetime', 'Sale date'],
      ['ph_prodid', 'char(16)', 'Product ID'],
      ['ph_qty', 'money', 'Qty sold'],
      ['ph_amount', 'money', 'Sales amount']]),
    ('TINVUSGE - Daily Inventory Usage',
     [['iu_itemid', 'varchar(20)', 'Item ID'],
      ['iu_date', 'smalldatetime', 'Business date'],
      ['iu_endbal', 'money', 'Ending balance'],
      ['iu_rgusage', 'money', 'Regular usage'],
      ['iu_rcvng', 'money', 'Receiving qty'],
      ['iu_xferin', 'money', 'Transfer in'],
      ['iu_xferout', 'money', 'Transfer out']]),
    ('MNUDTAIL - Bill of Materials',
     [['md_prodid', 'char(16)', 'Product ID (FG)'],
      ['md_itemid', 'varchar(20)', 'Item ID (RM)'],
      ['md_qty', 'smallmoney', 'Qty per product unit']]),
    ('DAHISALL - Daily Sales Target',
     [['branch', 'char(4)', 'Branch'],
      ['saledate', 'smalldatetime', 'Business date'],
      ['target', 'money', 'Sales target amount']]),
    ('FCERRLOG - Forecast Error Log',
     [['FC_USER', 'C(8)', 'User'],
      ['FC_DATE', 'D', 'Date'],
      ['FC_ACTION', 'C(8)', 'Action (ERROR/GEN/SAVE)']]),
]:
    pass  # sections added in the loop below using _idx
for _idx, (tname, tcols) in enumerate([
    ('TPRDHIST - Product Sales History',
     [['ph_stid', 'char(4)', 'Store ID'],
      ['ph_date', 'smalldatetime', 'Sale date'],
      ['ph_prodid', 'char(16)', 'Product ID'],
      ['ph_qty', 'money', 'Qty sold'],
      ['ph_amount', 'money', 'Sales amount']]),
    ('TINVUSGE - Daily Inventory Usage',
     [['iu_itemid', 'varchar(20)', 'Item ID'],
      ['iu_date', 'smalldatetime', 'Business date'],
      ['iu_endbal', 'money', 'Ending balance'],
      ['iu_rgusage', 'money', 'Regular usage'],
      ['iu_rcvng', 'money', 'Receiving qty'],
      ['iu_xferin', 'money', 'Transfer in'],
      ['iu_xferout', 'money', 'Transfer out']]),
    ('MNUDTAIL - Bill of Materials',
     [['md_prodid', 'char(16)', 'Product ID (FG)'],
      ['md_itemid', 'varchar(20)', 'Item ID (RM)'],
      ['md_qty', 'smallmoney', 'Qty per product unit']]),
    ('DAHISALL - Daily Sales Target',
     [['branch', 'char(4)', 'Branch'],
      ['saledate', 'smalldatetime', 'Business date'],
      ['target', 'money', 'Sales target amount']]),
    ('FCERRLOG - Forecast Error Log',
     [['FC_USER', 'C(8)', 'User'],
      ['FC_DATE', 'D', 'Date'],
      ['FC_ACTION', 'C(8)', 'Action (ERROR/GEN/SAVE)']]),
]):
    subsubsection(doc, '3.7.' + str(_idx + 1), tname.split(' - ')[0])
    doc.add_paragraph(tname.split(' - ')[1] if ' - ' in tname else '')
    make_table(doc, ['Column', 'Type', 'Purpose'], tcols, [1.6, 1.6, 3.0])

subsection(doc, '3.8', 'Entity Relationships')
doc.add_paragraph('Core table relationships:')
code_block(doc, [
    '  TFCTMNRR (Forecast Master)',
    '    |--- 1:N ---> TFCTSBRR (Forecast Sub-table)',
    '                       |--- N:1 ---> MITEM (via fs_itemid)',
    '                       |--- N:1 ---> MNUDTAIL (via md_prodid)',
    '    |--- 1:N ---> TFCTMRRR (Raw Material Override)',
    '                          |--- N:1 ---> MITEM (via fr_itemid)',
    '',
    '  MITMBUFF (Buffer Config) ----> MITEM (via ib_desc = im_priolvl)',
    '',
    '  TPRDHIST (Sales History) ----> MPRODUCT (via ph_prodid)',
    '  TINVUSGE (Inventory Usage) ---> MITEM (via iu_itemid)',
    '  DAHISALL (Daily Target) ----> Branch',
    '  FCERRLOG (Error Log) ----> Audit trail',
])

page_break(doc)


# ═══════════════════════════════════════════════════════════════════
#  4. STORED PROCEDURES
# ═══════════════════════════════════════════════════════════════════

section_title(doc, '4', 'Stored Procedures')

# 4.1
subsection(doc, '4.1', 'MakeFQuery - Sales History to Weighted Average')
bold_normal(doc, 'Version: ', '1.1.1 (2026-02-20)')
doc.add_paragraph('Computes weighted average (4:3:2:1) or simple average (ADQ) per product per DOW.')
make_table(doc,
    ['Parameter', 'Type', 'Description'],
    [['@Fday', 'tinyint', 'First day of week'],
     ['@addfilter', 'varchar(8000)', '4 date period conditions'],
     ['@ADQ', 'bit = 0', 'ADQ mode toggle'],
     ['@ADQGrp', 'int = -1', 'ADQ grouping (1=weekend/weekday)']],
    [1.5, 1.8, 3.5]
)
subsubsection(doc, '4.1.1', 'Weighted Mode (ADQ=0)')
code_block(doc, [
    'wAve  = (wAve1*4 + wAve2*3 + wAve3*2 + wAve4*1) / 10',
    'SwAve = (SwAve1*4 + SwAve2*3 + SwAve3*2 + SwAve4*1) / 10',
    'Uplift = IF target > SwAve THEN ((target-SwAve)/target)*wAve ELSE 0',
    'totalqty = CEILING(wAve + Uplift)',
])
subsubsection(doc, '4.1.2', 'ADQ Mode (ADQ=1)')
code_block(doc, [
    'wAve = SUM(usage) / COUNT(dow)   [per day-of-week]',
    'Uplift = 0',
    'totalqty = CEILING(wAve)',
])
page_break(doc)

# 4.2
subsection(doc, '4.2', 'DailyProductForecast - Finished Goods')
bold_normal(doc, 'Version: ', '1.0.6 (2025-06-16)')
code_block(doc, [
    'prjToday, prjTom, prjNext, prjNext2',
    'BegBal = yesterday iu_endbal',
    'BegInv = weighted historical + actual today',
    'TheoEnding = BegBal - BegInv + DelToday',
    'InitOrder (lt=1): CEILING(prjNext * buffer/100) + prjTom',
    'InitOrder (lt>1): CEILING(prjNext2 * buffer/100) + prjNext',
])
page_break(doc)

# 4.3
subsection(doc, '4.3', 'InventoryForecast - Raw Materials')
bold_normal(doc, 'Version: ', '1.0.8 (2026-05-26) [Latest]')

subsubsection(doc, '4.3.1', 'Version History')
make_table(doc,
    ['Ver', 'Date', 'Changes'],
    [
        ['1.0.8', '2026-05-26', 'Add @CatSeqList parameter'],
        ['1.0.7', '2025-11-26', 'Fix negative Theo Ending'],
        ['1.0.6', '2025-11-12', 'Delivery today from receiving'],
        ['1.0.5', '2025-08-11', 'New item no prio level fix'],
        ['1.0.4', '2025-06-16', 'Buffer from tfctrmrr; mitmxcld exclusions'],
        ['1.0.3', '2025-05-20', 'Add @SearchItem; SRP from mitem'],
        ['1.0.2', '2025-03-25', 'ADQ settings fix'],
        ['1.0.1', '2025-01-20', 'Add @RptType for Excel'],
        ['1.0.0', '2024-12-03', 'Initial version'],
    ],
    [0.6, 1.2, 4.5], font_size=8.5
)

subsubsection(doc, '4.3.2', 'Core Algorithm')
code_block(doc, [
    '-- Step 1: Available Inventory',
    'fs_qty = (BegBal + DelToday - BegToday); if <0 then 0',
    '',
    '-- Step 2: Suggested Order with Buffer',
    'IF lt=1: fs_qty = (fs_wknxt * (fs_buffer/100)) + fs_wktom - fs_qty',
    'IF lt>1: fs_qty = (fs_wknxt2 * (fs_buffer/100)) + fs_wknxt - fs_qty',
    'IF <0 then 0; CEILING(fs_qty)',
])

subsubsection(doc, '4.3.3', 'Buffer Lookup')
code_block(doc, [
    'Override: fs_buffer = tfctrmrr.fr_buffer',
    'Default: FROM MITMBUFF WHERE ib_desc = im_priolvl',
    '         AND fs_qty BETWEEN ib_lower AND ib_upper',
    'Fallback: "CAKE - LOW" (C40)',
])

subsubsection(doc, '4.3.4', 'Full SP Code')
invf_path = os.path.join(FIT_DIR, 'fitupdate', 'InventoryForecast.sql')
if os.path.exists(invf_path):
    with open(invf_path, 'r', encoding='utf-8', errors='replace') as f:
        sql = f.read()
    lines = sql.split('\\n')
    p = doc.add_paragraph()
    r = p.add_run(f'Total: {len(lines)} lines, {len(sql)} bytes')
    r.font.size = Pt(9); r.font.color.rgb = GRAY; r.font.italic = True
    code_block(doc, lines, font_size=7.5)
page_break(doc)

# 4.4
subsection(doc, '4.4', 'ADQApplyEditSetting')
bold_normal(doc, 'Version: ', '1.0.1 (2025-08-11)')
doc.add_paragraph('Recomputes ADQ values when user modifies settings.')

# 4.5
subsection(doc, '4.5', 'Wastage and Stockout KPI')
bold_normal(doc, 'Version: ', '1.0.0 (2024-11-05)')
make_table(doc,
    ['Metric', 'Formula'],
    [
        ['WASTAGE FREQUENCY', 'COUNT(wastage events) per SKU'],
        ['WASTAGE COST', 'Wasted Qty x im_stdcost x unit_ratio'],
        ['WASTAGE TO SALES %', 'Wastage Cost / (Qty Sold x SRP) x 100'],
        ['STOCKOUT FREQUENCY', 'COUNT(stockout events) per SKU'],
        ['SALES OPPORTUNITY LOST', 'Stockout Frequency x Item SRP'],
    ],
    [2.5, 3.5]
)

page_break(doc)


# ═══════════════════════════════════════════════════════════════════
#  5. KEY FORMULAS
# ═══════════════════════════════════════════════════════════════════

section_title(doc, '5', 'Key Formulas')

for title, lines in [
    ('Weighted Projection', [
        'wAve = (wAve1*4 + wAve2*3 + wAve3*2 + wAve4*1) / 10',
        'totalqty = CEILING(wAve + Uplift)',
    ]),
    ('ADQ Projection', [
        'wAve = SUM(usage) / COUNT(dow)',
        'totalqty = CEILING(wAve)',
    ]),
    ('Available Inventory', [
        'Avail = BegToday + DelToday - SalesProjToday + XferIn - XferOut',
    ]),
    ('Suggested Order Qty', [
        'IF SlsProjOrdDay x (1 + Buf%) > AvailOrdDay THEN diff ELSE 0',
    ]),
    ('InitOrder by Lead Time', [
        'lt=1:  CEILING(prjNext * buffer/100) + prjTom',
        'lt>1:  CEILING(prjNext2 * buffer/100) + prjNext',
    ]),
    ('Sales Potential', [
        'Total = SUM(Item SRP x Available Qty)',
        'Order Day: (BegInv + FinalQty) x SRP',
    ]),
    ('Wastage-to-Sales %', [
        'Per Item: Total Wastage Cost / (Qty Sold x SRP)',
        'Total: Total Wastage Cost / Total Product Sales',
    ]),
    ('Sales Opportunity Lost', [
        '= Stockout Frequency x Item SRP',
    ]),
    ('BegInv with Lead-time Adj', [
        'BegInv = BegBal + DelToday - SlsProjToday',
        '  - IF(SlsProj < LA, LA - SlsProj, 0) + XferIn - XferOut',
    ]),
    ('Theoretical Ending Inv', [
        'TheoEnding = BegInvOrdDay + FinalOrderQty - SlsProjOrdDay',
    ]),
    ('Sales Outlook Filler', [
        'Filler = (ItemSlsPotential / GrandTotalSls) x SalesDeficit / Cost',
    ]),
]:
    subsection(doc, '5.' + str(list(locals().items())[0][1].index(title) + 1), title)
    code_block(doc, lines)

page_break(doc)


# ═══════════════════════════════════════════════════════════════════
#  6. INI CONFIGURATION
# ═══════════════════════════════════════════════════════════════════

section_title(doc, '6', 'INI Configuration')
make_table(doc,
    ['Setting', 'Value', 'Description'],
    [
        ['FIRSTDAYWEEK', '2', 'Monday'],
        ['CUTOFFTIME', '1140', '19:00 / 7PM'],
        ['ENDOFDAYTIME', '1320', '22:00 / 10PM'],
        ['DECREASEBUFFER', '30', 'Buffer decrease %'],
        ['INCREASEBUFFER', '30', 'Buffer increase %'],
        ['LAORDERLEADTIME', '2', 'Lead-time adj days'],
        ['MAXLEADTM', '2', 'Max lead time'],
        ['RRFCTRANTYPE', 'A;B;C;E;J;K;L;M', '8 tx types'],
        ['RREXCLUDEPRODCAT', "('25';'27';'28';'29';'A1';'D1')", 'Excl product cats'],
        ['PATHSENDFCST', 'E:\\FORECAST', 'Output path'],
    ],
    [2.0, 2.0, 2.5]
)

page_break(doc)


# ═══════════════════════════════════════════════════════════════════
#  7. UI SPECIFICATIONS
# ═══════════════════════════════════════════════════════════════════

section_title(doc, '7', 'UI Specifications')

subsection(doc, '7.1', 'Home Screen')
bullet(doc, 'Renamed "Store Ordering Module" to "Forecast Inventory Tool"')
bullet(doc, 'Item Maintenance for SRP (yellow editable fields)')
bullet(doc, 'CHILLED and BAKERY categories shown first')

subsection(doc, '7.2', 'Inventory Forecast Screen')
ss = os.path.join(FIT_DIR, 'issue2.png')
if os.path.exists(ss):
    add_image(doc, ss, width_inches=6.0)

make_table(doc,
    ['Column', 'Editable', 'Notes'],
    [
        ['ITEM CODE', 'No', 'System product code'],
        ['ITEM DESCRIPTION', 'No', 'Categorized & filterable'],
        ['PRIO LVL', 'No', 'HIGH/MID/LOW/NEW'],
        ['BEG.INV TODAY', 'No', 'Beginning inventory'],
        ['DEL TODAY', 'Yes', 'Yellow editable field'],
        ['SALES PROJ', 'No', 'ADQ-based projection'],
        ['BUFFER', 'Yes', 'Yellow, from MITMBUFF'],
        ['SUGGESTED ORDER', 'No', 'Formula 4 computed'],
        ['FINAL ORDER QTY', 'Yes', 'Red if changed'],
        ['THEO END INV', 'No', 'Formula 9'],
        ['SALES POTENTIAL', 'No', 'Revenue potential'],
    ],
    [1.8, 1.0, 3.5], font_size=9
)

doc.add_paragraph('Color coding:')
make_table(doc,
    ['Field Type', 'Color'],
    [['Order Day', '#BAE7DD (green)'],
     ['Today/Tomorrow', '#DCEFFA (blue)'],
     ['Editable', '#FFFFCC (yellow)']],
    [2.5, 2.5]
)

subsection(doc, '7.3', 'KPI Analytics Screen')
make_table(doc,
    ['Metric', 'Source'],
    [['WASTAGE FREQUENCY', 'TINVUSGE - count'], 
     ['WASTAGE COST', 'TINVUSGE x stdcost x ratio'],
     ['WASTAGE TO SALES %', 'Cost / (QtySold x SRP)'],
     ['STOCKOUT FREQUENCY', 'TINVUSGE - zero balance'],
     ['SALES OPPORTUNITY LOST', 'StockoutFreq x SRP']],
    [2.5, 3.5]
)

subsection(doc, '7.4', 'ADQ Settings Screen')
make_table(doc,
    ['Setting', 'Default'],
    [['Date Range', '4 weeks before order date'],
     ['Exclude Dates', 'From MEXMDTUPD'],
     ['ADQ Grouping', 'Days of Week'],
     ['Payweek Toggle', 'Off'],
     ['Tx Types', 'A,B,C,E,J,K,L,M']],
    [2.5, 3.5]
)

page_break(doc)


# ═══════════════════════════════════════════════════════════════════
#  8. END-TO-END DATA FLOW
# ═══════════════════════════════════════════════════════════════════

section_title(doc, '8', 'End-to-End Data Flow')
doc.add_paragraph('Complete forecasting pipeline:')

fp = os.path.join(FIT_DIR, 'flowchart.png')
if os.path.exists(fp):
    add_image(doc, fp, width_inches=6.2)

make_table(doc,
    ['Step', 'Process', 'Key Tables'],
    [
        ['1', 'Load INI Config', 'INI file'],
        ['2', 'Query TPRDHIST Sales History', 'TPRDHIST, DAHISALL, MITMXCLD'],
        ['3', 'ADQ Decision', ''],
        ['4a', 'Weighted Path (4:3:2:1 -> Uplift -> Save)', 'TFCTMNRR, TFCTSBRR'],
        ['4b', 'ADQ Path (Simple mean -> Save)', 'TFCTMNRR, TFCTSBRR'],
        ['5', 'Daily Product Forecast', 'MNUDTAIL'],
        ['6', 'Inventory Forecast (BOM + Buffer)', 'MITMBUFF, TINVUSGE'],
        ['7', 'Override Check (TFCTMRRR)', 'TFCTMRRR'],
        ['8', 'Compute Final Qty', ''],
        ['9', 'Save + Log (TFCTHIST + FCERRLOG)', 'FCERRLOG'],
        ['10', 'Output', ''],
    ],
    [0.5, 3.0, 2.5], font_size=9
)

page_break(doc)


# ═══════════════════════════════════════════════════════════════════
#  9. DEPLOYMENT GUIDE
# ═══════════════════════════════════════════════════════════════════

section_title(doc, '9', 'Deployment Guide')

subsection(doc, '9.1', 'Package Structure')
make_table(doc,
    ['File', 'Purpose'],
    [
        ['RRFcst.exe', 'Main forecasting executable'],
        ['ansiupd.bat', 'sqlcmd deployment script'],
        ['*.sql', 'Stored procedure updates'],
        ['hbrun.exe', 'Harbour runtime'],
        ['fit.prg', 'Menu update script'],
        ['MITMBUFF.DBF', 'Buffer config table'],
    ],
    [2.0, 4.5]
)

subsection(doc, '9.2', 'Deployment History')
make_table(doc,
    ['Package', 'Date', 'Key SP Versions'],
    [
        ['250818_FIT.prz', '2025-08-18', 'MakeFQuery 1.1.0, InvFcst 1.0.7, DailyPF 1.0.6'],
        ['251127_FITAddendum2', '2025-11-27', 'InventoryForecast 1.0.7 update'],
        ['260331_FIT (pw:FIT)', '2026-03-31', 'MakeFQuery 1.1.1'],
        ['260430_FIT.prz', '2026-04-30', 'MakeFQuery 1.1.1 final'],
        ['260430_mitmbuff.prz', '2026-04-30', 'MITMBUFF + RRFcst'],
        ['260608_FITUpdate.prz', '2026-06-08', 'InventoryForecast 1.0.8'],
    ],
    [2.0, 1.2, 3.5], font_size=9
)

page_break(doc)


# ═══════════════════════════════════════════════════════════════════
#  10. VERSION HISTORY
# ═══════════════════════════════════════════════════════════════════

section_title(doc, '10', 'Version History')
make_table(doc,
    ['Date', 'Component', 'Ver', 'Change'],
    [
        ['2026-06-08', 'InventoryForecast', '1.0.8', 'Add @CatSeqList param'],
        ['2026-05-26', 'InventoryForecast', '1.0.7', 'Fix negative Theo Ending'],
        ['2026-04-30', 'MITMBUFF', '', '8 priority codes deployed'],
        ['2026-02-20', 'MakeFQuery', '1.1.1', 'Weighted avg update'],
        ['2025-11-12', 'InventoryForecast', '1.0.6', 'Delivery from receiving'],
        ['2025-08-11', 'InventoryForecast', '1.0.5', 'New item prio fix'],
        ['2025-06-16', 'InventoryForecast', '1.0.4', 'Buffer from tfctrmrr'],
        ['2025-05-20', 'InventoryForecast', '1.0.3', '@SearchItem param'],
        ['2024-12-03', 'InventoryForecast', '1.0.0', 'Initial version'],
        ['2024-11-05', 'KPI SP', '1.0.0', 'Wastage/Stockout KPI'],
        ['2024-10-29', 'Project', '', 'FIT development start'],
    ],
    [1.2, 1.8, 0.8, 3.0], font_size=8.5
)

page_break(doc)


# ═══════════════════════════════════════════════════════════════════
#  APPENDIX A
# ═══════════════════════════════════════════════════════════════════

section_title(doc, 'Appendix A', '')
doc.add_heading('Buffer Seed Data (MITMBUFF)', level=2)

make_table(doc,
    ['Code', 'Priority', 'Category', 'Description'],
    [
        ['C10', 'HIGH', 'Cake', 'CAKE - HIGH, low buffer'],
        ['C20', 'NEW', 'Cake', 'CAKE - NEW, medium buffer'],
        ['C30', 'MID', 'Cake', 'CAKE - MID, standard buffer'],
        ['C40', 'LOW', 'Cake', 'CAKE - LOW, highest buffer'],
        ['P10', 'HIGH', 'PBD', 'PBD - HIGH, low buffer'],
        ['P20', 'NEW', 'PBD', 'PBD - NEW, medium buffer'],
        ['P30', 'MID', 'PBD', 'PBD - MID, standard buffer'],
        ['P40', 'LOW', 'PBD', 'PBD - LOW, highest buffer'],
    ],
    [1.0, 1.2, 1.0, 3.5]
)

page_break(doc)


# ═══════════════════════════════════════════════════════════════════
#  APPENDIX B
# ═══════════════════════════════════════════════════════════════════

section_title(doc, 'Appendix B', '')
doc.add_heading('Exclusion Lists', level=2)

doc.add_heading('Excluded Categories', level=3)
make_table(doc,
    ['Code', 'Description'],
    [['DCO', 'Discontinued'], ['DD', 'Direct Delivery'],
     ['DRY', 'Dry Goods'], ['DRY2', 'Dry Goods 2'],
     ['DVB', 'Deli/Veg/Beverage'], ['FRZ', 'Frozen'],
     ['PDC', 'Production'], ['PO', 'Promotional'],
     ['TNU', 'Tools & Utensils']],
    [2.5, 4.5]
)

doc.add_heading('Product Name Prefix Exclusions', level=3)
bullet(doc, 'GUMPASTE'); bullet(doc, 'ACCESSORIES/ACCESSORY')
bullet(doc, 'PASTRY/ICING'); bullet(doc, 'CRUNCH')


# ═══════════════════════════════════════════════════════════════════
#  END
# ═══════════════════════════════════════════════════════════════════

doc.add_paragraph()
p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = p.add_run('- End of FIT System Manual -')
r.font.size = Pt(12); r.font.color.rgb = GRAY; r.bold = True; r.italic = True

p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = p.add_run('Generated June 11, 2026 | Sources: CRF v2.7, CRF Addendum v3.5, SQL SPs, PRZ deployments')
r.font.size = Pt(9); r.font.color.rgb = LGRAY

doc.save(OUT)
print(f'Done! {len(doc.paragraphs)} paragraphs, {len(doc.tables)} tables')
```

## Instructions

1. Save the complete Python script as `C:\Users\shaye\Desktop\fit\gen_manual.py`
2. Run: `python C:\Users\shaye\Desktop\fit\gen_manual.py`
3. Output: `C:\Users\shaye\Desktop\fit\FIT_System_Manual.docx`

The generated document includes:
- Professional cover page with branding
- Document control + version history
- Table of Contents
- 10 main sections + 2 appendices
- 35+ formatted tables with header shading
- Code blocks in Consolas font for SQL/formulas
- Embedded flowchart.png and issue2.png screenshots
- Entity relationship diagram
- Full InventoryForecast 1.0.8 SP code
- Deployment history and package structure
- End-to-end data flow walktable
