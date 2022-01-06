API_URL = '/api'
async function clapMessage(messageId) {
    const response = await fetch(`${API_URL}/messages/${messageId}/claps`, {
        method: 'POST'
    });

    const data = await response.json()
    return data['count'];
}

async function postMessage(message) {
    const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message)
    });

    if (response.ok) {
        const newMessage = await response.json();
        return newMessage;
    } else {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message);
    }
}

function sortList(ul) {
    var new_ul = ul.cloneNode(false);

    var lis = [];
    for (var i = ul.childNodes.length; i--;) {
        if (ul.childNodes[i].nodeName === 'LI')
            lis.push(ul.childNodes[i]);
    }

    function compare(a, b) {
        clapsA = +a.querySelector('.claps').textContent;
        clapsB = +b.querySelector('.claps').textContent;

        idA = +a.dataset.messageId;
        idB = +b.dataset.messageId;

        if (clapsA > clapsB)
            return -1;

        if (clapsA < clapsB)
            return 1;

        return idA - idB;
    }

    lis.sort(compare);

    for (var i = 0; i < lis.length; i++)
        new_ul.appendChild(lis[i]);
    ul.parentNode.replaceChild(new_ul, ul);
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

    sortList(document.querySelector('ul.messages'))
    init();
}

async function handleCreateSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const message = {
        author: form.querySelector('[name="sender"]').value,
        message: form.querySelector('[name="message"]').value
    };

    const errorNode = document.querySelector('.alert-danger-form');
    errorNode.querySelector('.alert-danger').textContent = '';
    errorNode.style.display = 'none';

    const warningNode = document.querySelector('.alert-warning-form');
    warningNode.querySelector('.alert-warning').textContent = 'Загрузка...';
    warningNode.style.display = 'block';

    const successNode = document.querySelector('.alert-success-form');
    successNode.querySelector('.alert-success').textContent = '';
    successNode.style.display = 'none';

    const fieldset = form.querySelector('fieldset');
    fieldset.disabled = true;

    try {
        const newMessage = await postMessage(message);
        const template = document.querySelector('#message-template')
        const newMessageNode = template.content.firstElementChild.cloneNode(true);
        const messageLink = newMessageNode.querySelector('.message__link');
        messageLink.href = messageLink.href.replace('[MESSAGE_ID]', newMessage.id);


        const messageText = newMessageNode.querySelector('.message__text');
        messageText.textContent = newMessage.message;

        const messageAuthor = newMessageNode.querySelector('.message__author');
        messageAuthor.textContent = newMessage.author;

        const clapFormNode = newMessageNode.querySelector('.claps__form');
        clapFormNode.action = clapFormNode.action.replace('[MESSAGE_ID]', newMessage.id);

        clapFormNode.querySelector('.claps').textContent = newMessage.claps;

        messageItem = newMessageNode.closest('.message');
        messageItem.setAttribute('data-message-id', messageItem.dataset.messageId.replace('[MESSAGE_ID]', newMessage.id));
        document.querySelector('ul.messages').appendChild(newMessageNode);


        warningNode.querySelector('.alert-warning').textContent = '';
        warningNode.style.display = 'none';
        successNode.querySelector('.alert-success').textContent = 'Сообщение отправлено';
        successNode.style.display = 'block';
        form.reset();

    } catch (error) {
        warningNode.querySelector('.alert-warning').textContent = '';
        warningNode.style.display = 'none';
        errorNode.querySelector('.alert-danger').textContent = error.message;
        errorNode.style.display = 'block';
    } finally {
        fieldset.disabled = false;
    }

}

function init() {
    const clapFormNodes = document.querySelector('ul.messages');
    clapFormNodes.addEventListener('submit', handleClapSubmit)

    const createForm = document.querySelector('form.create-form');
    createForm.addEventListener('submit', handleCreateSubmit)
}

init()