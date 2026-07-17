SET NOCOUNT ON;
SELECT CONVERT(varchar, tt_date, 101)
FROM (
    SELECT DISTINCT tt_date
    FROM ttimetrn
    GROUP BY tt_userid, tt_date, tt_time, tt_inout
    HAVING COUNT(*) > 1
) d
ORDER BY tt_date
