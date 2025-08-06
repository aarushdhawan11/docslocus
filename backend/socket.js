const Document = require('./models/document');

function setupSockets(io) {
  io.on('connection', (socket) => {
    // Join document room
    socket.on('join-doc', (docId) => {
      socket.join(docId);
    });

    // Listen for edits and broadcast immediately to all in room (except sender)
    socket.on('edit-doc', async ({ docId, content }) => {
      // Save edit in DB (optional: only if content changed)
      await Document.findByIdAndUpdate(docId, {
        content,
        $push: { versions: { content } },
      });

      // Broadcast only to others in the same doc room (not sender)
      socket.to(docId).emit('doc-updated', content);
    });
  });
}
module.exports = { setupSockets };
