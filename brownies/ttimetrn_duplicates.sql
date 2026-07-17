WITH cte AS (
    SELECT *,
        ROW_NUMBER() OVER (
            PARTITION BY tt_userid, tt_date, tt_time, tt_inout
            ORDER BY (SELECT NULL)
        ) AS rn
    FROM ttimetrn
)
DELETE FROM cte WHERE rn > 1
