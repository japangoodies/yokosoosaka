"""Find users 01 and 88."""
from dbfread import DBF

table = DBF(r"D:\winvqp93\USERS.DBF", encoding='cp1252', char_decode_errors='ignore')
targets = set(["01", "1", "88", "MANAGER", "CASHIER", "MGR"])
for rec in table:
    uid = str(rec.get("USERID", "")).strip()
    if uid in targets:
        print("=== MATCH ===")
        for k, v in rec.items():
            print(f"  {k}={v}")
        print()
