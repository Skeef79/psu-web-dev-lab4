API_URL = '/api'
async function clapMessage(messageId) {
    const response = await fetch(`${API_URL}/messages/${messageId}/claps`, {
        method: 'POST'
    });

    data = await response.json()
    if (response.ok) {
        return data['count']
    } else {
        //TODO: обработать ошибки
    }
}

async function handleClapSubmit(event) {
    event.preventDefault();

    const clapFormNode = event.target;
    const messageItem = clapFormNode.closest('.message')
    const messageId = messageItem.dataset.messageId

    clapButton = clapFormNode.querySelector('.btn');
    clapButton.disabled = true;
    const new_count = await clapMessage(messageId);
    clapFormNode.querySelector('.claps').textContent = new_count;

    clapButton.disabled = false;

}

function init() {
    const clapFormNode = document.querySelector('.message');
    clapFormNode.addEventListener('submit', handleClapSubmit);
}

init();