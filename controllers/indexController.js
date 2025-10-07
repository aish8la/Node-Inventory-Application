function indexGet(req, res) {
    res.render('index', { title: 'Fab Inventory' });
};

module.exports = {
    indexGet,
}