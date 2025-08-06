const Document = require('../models/document');

exports.createDoc = async (req, res) => {
  const { title } = req.body;
  try {
    const doc = new Document({ title, content: '', owner: req.user.id, collaborators: [req.user.id], versions: [] });
    await doc.save();
    res.json(doc);
  } catch { res.status(500).send('Server error'); }
};

exports.getDocs = async (req, res) => {
  try {
    const docs = await Document.find({ collaborators: req.user.id });
    res.json(docs);
  } catch { res.status(500).send('Error'); }
};

exports.updateDoc = async (req, res) => {
  const { docId } = req.params;
  const { content } = req.body;
  try {
    let doc = await Document.findById(docId);
    if (!doc) return res.status(404).json({ msg: 'Document not found' });
    doc.content = content;
    doc.versions.push({ content });
    await doc.save();
    res.json(doc);
  } catch { res.status(500).send('Error'); }
};

exports.revertVersion = async (req, res) => {
  const { docId, versionIndex } = req.body;
  try {
    let doc = await Document.findById(docId);
    if (!doc || !doc.versions[versionIndex]) return res.status(404).json({ msg: 'Not found' });
    doc.content = doc.versions[versionIndex].content;
    await doc.save();
    res.json(doc);
  } catch { res.status(500).send('Error'); }
};
