const { pool } = require("../config/db");


const searchSchemes = async(message)=>{


    const keywords = message
        .toLowerCase()
        .replace(/[^\w\s]/gi,"")
        .split(" ");


    const query = `

    SELECT 
        id,
        scheme_name,
        department,
        state,
        description,

        ts_rank(
            to_tsvector(
                'english',
                scheme_name || ' ' || description || ' ' || department
            ),
            plainto_tsquery('english',$1)
        ) AS rank


    FROM schemes


    WHERE
    to_tsvector(
        'english',
        scheme_name || ' ' || description || ' ' || department
    )
    @@ plainto_tsquery('english',$1)


    OR

    scheme_name ILIKE ANY($2)
    

    ORDER BY rank DESC

    LIMIT 5;


    `;



    const patterns =
        keywords.map(k=>`%${k}%`);



    const result = await pool.query(
        query,
        [
            message,
            patterns
        ]
    );


    return result.rows;


};



module.exports={
    searchSchemes
};