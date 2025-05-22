from flask import jsonify
def server_response(status_code=200,msg="Ok",response_data=None):
    if response_data is not None and not isinstance(response_data, dict):
        raise TypeError("response_data must be a dict or None")
    if response_data is None:
        response_data = {}
    response_dict = {
        "data": response_data if response_data is not None else False,
        "message": msg
    }
    
    return jsonify(response_dict), status_code
