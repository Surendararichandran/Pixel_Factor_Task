import sqlite3

def select_sql(data, db_name, tbl_name, as_dict=False):
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()

    query = f"SELECT * FROM {tbl_name} "
    conditions = []
    params = []

    if isinstance(data, str) and data.lower() == "all":
        result = handleStarFromSQL(cursor=cursor, query=query, as_dict=as_dict)
        conn.close()
        return result if result else None

    elif isinstance(data, dict) and data:
        for col_name, col_value in data.items():
            conditions.append(f"{col_name} LIKE ?")
            params.append(f"%{col_value}%")

        query += " WHERE " + " AND ".join(conditions)
        cursor.execute(query, params)
        result = cursor.fetchall()

        if not result:
            conn.close()
            return None

        if as_dict:
            result = jobs_tuple_to_dict(cursor.description, result)

        conn.close()
        return result

    conn.close()
    return None  # If data is invalid (not "all" or non-empty dict)

def handleStarFromSQL(cursor, query, as_dict):
    cursor.execute(query)
    result = cursor.fetchall()
    if not result:
        return None
    return jobs_tuple_to_dict(cursor.description, result) if as_dict else result

def select_specific(db_name: str, tbl_name: str, data: dict):
    try:
        conn = sqlite3.connect(db_name)
        cursor = conn.cursor()
        query = f"SELECT * FROM {tbl_name}"

        conditions = []
        params = []

        if data:
            for col_name, col_value in data.items():
                conditions.append(f"{col_name} = ?")
                params.append(col_value)
            query += " WHERE " + " AND ".join(conditions)

        cursor.execute(query, params)
        return cursor.fetchone()

    except sqlite3.Error as db_error:
        print(f"dbError: {db_error}")
        raise Exception(f"Error: {db_error}")

    finally:
        conn.close()

def alter_table(db_name: str, tbl_name: str, column_name: str, column_type: str):
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()

    cursor.execute(f"PRAGMA table_info({tbl_name})")
    columns = [row[1] for row in cursor.fetchall()]

    if column_name not in columns:
        alter_query = f"ALTER TABLE {tbl_name} ADD COLUMN {column_name} {column_type}"
        cursor.execute(alter_query)
        print(f"Column '{column_name}' added to table '{tbl_name}'.")

    conn.commit()
    conn.close()

def jobs_tuple_to_dict(description, result):
    columns = [desc[0] for desc in description]
    return [dict(zip(columns, row)) for row in result]
