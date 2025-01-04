export const BasicPostQuery = `SELECT u.fname,u.pic,p.*,
          SUM(CASE WHEN v.vote_type = TRUE THEN 1 ELSE 0 END) as up_votes,
          SUM(CASE WHEN v.vote_type = FALSE THEN 1 ELSE 0 END) as down_votes,
          COUNT(DISTINCT c) AS comments,
          MAX(CASE WHEN v.user_id = $1 THEN CASE WHEN v.vote_type = TRUE THEN 1 ELSE 0 END ELSE NULL END) as voted
          FROM users u
          INNER JOIN posts p ON u.user_id = p.user_id
          LEFT JOIN votes v ON v.post_id = p.post_id
          LEFT JOIN comments c ON c.post_id = p.post_id`;