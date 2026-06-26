function getRoles(playerCount) {

    if (playerCount < 5) return [];

    if (playerCount <= 6) {
        return [
            "🐺 Sói",
            "🔮 Tiên tri",
            ...Array(playerCount - 2).fill("👨 Dân")
        ];
    }

    if (playerCount <= 8) {
        return [
            "🐺 Sói",
            "🐺 Sói",
            "🔮 Tiên tri",
            "🛡️ Bảo vệ",
            ...Array(playerCount - 4).fill("👨 Dân")
        ];
    }

    if (playerCount <= 10) {
        return [
            "🐺 Sói",
            "🐺 Sói",
            "🔮 Tiên tri",
            "🛡️ Bảo vệ",
            "🧪 Phù thủy",
            ...Array(playerCount - 5).fill("👨 Dân")
        ];
    }

    return [
        "🐺 Sói",
        "🐺 Sói",
        "🐺 Sói",
        "🔮 Tiên tri",
        "🛡️ Bảo vệ",
        "🧪 Phù thủy",
        "🏹 Thợ săn",
        ...Array(playerCount - 7).fill("👨 Dân")
    ];

}

module.exports = { getRoles };
