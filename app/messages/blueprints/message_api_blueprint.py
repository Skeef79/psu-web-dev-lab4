from flask import Blueprint, request, jsonify
from app.messages.services.message_service import get_all_messages, get_message_by_id, increment_messsage_claps_by_id, create_message

message_api_blueprint = Blueprint(
    'messages_api', __name__, url_prefix='/api/messages')


@message_api_blueprint.get('')
def api_get_messages():
    messages = get_all_messages()
    return jsonify([vars(msg) for msg in messages]), 200


@message_api_blueprint.post('')
def api_post_message():
    json_data = request.get_json()

    author = json_data['author'] if json_data and 'author' in json_data else None
    message = json_data['message'] if json_data and 'message' in json_data else None

    added_message, error = create_message(author=author, message=message)

    if error:
        return jsonify({'message': error}), 422

    print(vars(added_message))
    return jsonify(vars(added_message)), 201


@message_api_blueprint.get('/<int:message_id>')
def api_get_message(message_id):
    message = get_message_by_id(message_id)
    if not message:
        return "", 404

    return jsonify(vars(message)), 200


@message_api_blueprint.post('/<int:message_id>/claps')
def api_post_clap_message(message_id):
    claps = increment_messsage_claps_by_id(message_id=message_id)
    if not claps:
        return "", 404

    return jsonify({'count': claps}), 201
