import { Terminal } from '/xterm.js';
import { FitAddon } from '/xterm-addon-fit.js';

window.addEventListener('load', () => {
  const uuidMatch = window.location.pathname.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
  const instanceId = uuidMatch ? uuidMatch[0] : null;
  let ws, xterm;
  const fitAddon = new FitAddon();
  const displayedMessages = new Set();

  const consoleContainer = document.getElementById('console-output');
  if (consoleContainer) {
    ws = new WebSocket('ws://' + location.host + '/api/instances/' + instanceId + '/websocket');
    xterm = new Terminal({
      fontFamily: '"Fira Code", monospace',
      fontSize: 14,
      lineHeight: 1,
      theme: {
        background: '#f3f3f3',
        foreground: '#000',
        cursor: '#000',
        selectionBackground: 'blueviolet',
        selectionForeground: '#fff',
      },
      cursorBlink: true,
      disableStdin: false,
    });
    xterm.loadAddon(fitAddon);
    xterm.open(consoleContainer);
    xterm.attachCustomKeyEventHandler(() => false);

    fitAddon.fit();

    window.addEventListener('resize', () => fitAddon.fit());

    ws.onopen = (event) => {
      ws.send('console log');
    };

    ws.onmessage = (event) => {
      const messages = JSON.parse(event.data);
      messages.forEach((message) => {
        const messageId = message.id || message.timestamp || message.logMessage;
        if (!displayedMessages.has(messageId)) {
          xterm.write(message.logMessage);
          displayedMessages.add(messageId);
        }
      });
    };

    setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send('console log');
      }
    }, 1000);

    ws.onerror = (event) => {
      console.error('[ERROR]', event);
    };
  }
});
