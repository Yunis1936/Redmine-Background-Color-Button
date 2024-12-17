// ==UserScript==
// @name         Redmine Background Color Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Добавляет кнопку для выделения текста с фоном в редакторы Redmine.
// @author       Ты
// @match        https://redmine.lachestry.tech/*
// @match        https://redmine.rigla.ru/*
// @icon         https://www.redmine.org/favicon.ico
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    function addBackgroundColorButton(toolbar, textarea) {
        if (!toolbar || !textarea) {
            return;
        }

        // Проверка на наличие кнопки
        if (toolbar.querySelector('.jstb_bgcolor')) {
            return;
        }

        const bgColorButton = document.createElement('button');
        bgColorButton.type = 'button';
        bgColorButton.className = 'jstb_bgcolor';
        bgColorButton.title = 'Добавить фон';

        // Стили кнопки
        Object.assign(bgColorButton.style, {
            marginRight: '2px',
            width: '24px',   // Размер кнопки
            height: '24px',
            padding: '0',
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: '#ddd',
            backgroundColor: 'transparent',
            backgroundImage: 'url("https://cdn-icons-png.flaticon.com/256/10337/10337041.png")', // URL иконки кнопки
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            cursor: 'pointer',
            opacity: '1',
        });

        // Логика кнопки
        bgColorButton.addEventListener('click', function () {
            const selectionStart = textarea.selectionStart;
            const selectionEnd = textarea.selectionEnd;

            const selectedText = textarea.value.substring(selectionStart, selectionEnd).trim();
            if (!selectedText) {
                alert('Пожалуйста, выделите текст для изменения фона.');
                return;
            }

            const bgColor = prompt(
                'Введите цвет для фона (например, yellow, #f0f0f0):',
                'yellow'
            );
            if (!bgColor) return;

            const wrappedText = `%{background-color:${bgColor}}${selectedText}%`;

            textarea.value =
                textarea.value.substring(0, selectionStart) +
                wrappedText +
                textarea.value.substring(selectionEnd);

            textarea.setSelectionRange(
                selectionStart,
                selectionStart + wrappedText.length
            );
            textarea.focus();
        });

        toolbar.appendChild(bgColorButton);
    }

    function initBackgroundColorButton() {
        const descriptionToolbar = document.querySelector('.jstElements');
        const descriptionTextarea = document.querySelector('#issue_description');
        if (descriptionToolbar && descriptionTextarea) {
            addBackgroundColorButton(descriptionToolbar, descriptionTextarea);
        }

        const commentToolbar = document.querySelectorAll('.jstElements')[1];
        const commentTextarea = document.querySelector('#issue_notes');
        if (commentToolbar && commentTextarea) {
            addBackgroundColorButton(commentToolbar, commentTextarea);
        }
    }

    // Наблюдатель за изменениями DOM
    const observer = new MutationObserver(initBackgroundColorButton);
    observer.observe(document.body, { childList: true, subtree: true });
})();
