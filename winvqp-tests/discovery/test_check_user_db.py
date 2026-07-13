"""Read USERS.DBF and extract ALL users."""
import os
from dbfread import DBF

dbf_path = r"D:\winvqp93\USERS.DBF"
if not os.path.exists(dbf_path):
    print(f"ERROR: {dbf_path} not found!")
    exit(1)

table = DBF(dbf_path, encoding='cp1252', char_decode_errors='ignore')
print(f"Fields: {[f.name for f in table.fields]}")

count = 0
for rec in table:
    count += 1
    uid = str(rec.get('USERID', '')).strip()
    name = str(rec.get('NAME', '')).strip()
    pwd = str(rec.get('PASSWORD', '')).strip()
    lvl = str(rec.get('PRVLEVEL', ''))
    cashier = str(rec.get('CASHIER', ''))
    
    print(f"\n[{count}] USERID='{uid}' NAME='{name}' PASSWORD='{pwd}'")
    print(f"    PRVLEVEL={lvl} CASHIER={cashier}")
    
    for fname, fval in rec.items():
        sv = str(fval).strip()
        if sv and fname not in ('USERID', 'NAME', 'PASSWORD'):
            print(f"    {fname}={sv}")

print(f"\nTotal: {count} users")
