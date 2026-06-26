const roles = [
    "🐺 Sói",
    "🐺 Sói",
    "👨 Dân Làng",
    "👨 Dân Làng",
    "👨 Dân Làng",
    "🔮 Tiên Tri",
    "🛡️ Bảo Vệ",
    "🧪 Phù Thủy",
    "🏹 Thợ Săn",
    "❤️ Cupid",
    "👶 Đứa Trẻ",
    "👴 Già Làng",
    "🦊 Cáo",
    "😈 Kẻ Phản Bội",
    "👮 Cảnh sát Trưởng",
    "🧙 Pháp Sư"
];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

function assignRoles(players) {

    const pool = shuffle([...roles]);

    const result = {};

    players.forEach((id, index) => {

        result[id] = pool[index] || "👨 Dân Làng";

    });

    return result;

}

module.exports = {
    assignRoles
};
