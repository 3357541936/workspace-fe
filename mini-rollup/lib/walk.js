function walk(ast, {enter, leave}) {
    walk_cbs(ast,null, enter, leave);
}

function walk_cbs(node, parent, enter, leave) {
    if (!node) return null;
    enter && enter(node);

    const children = Object
                                .keys(node)
                                .filter(key => typeof node[key] === 'object');

    children.forEach(key => walk_cbs(node[key], node, enter, leave));

    leave && leave(node);
}

module.exports = walk;
