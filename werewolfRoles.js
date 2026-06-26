function getRoles(count) {

    let roles = [];

    if (count == 5) {
        roles = [
            "🐺 Sói",
            "🔮 Tiên tri",
            "👨 Dân",
            "👨 Dân",
            "👨 Dân"
        ];
    }

    else if (count == 6) {
        roles = [
            "🐺 Sói",
            "🐺 Sói",
            "🔮 Tiên tri",
            "👨 Dân",
            "👨 Dân",
            "👨 Dân"
        ];
    }

    else if (count == 7) {
        roles = [
            "🐺 Sói",
            "🐺 Sói",
            "🔮 Tiên tri",
            "🛡️ Bảo vệ",
            "👨 Dân",
            "👨 Dân",
            "👨 Dân"
        ];
    }

    else {

        roles = [];

        while (roles.length < count) {
            roles.push("👨 Dân");
        }

        roles[0] = "🐺 Sói";
        roles[1] = "🐺 Sói";
        roles[2] = "🔮 Tiên tri";
        roles[3] = "🛡️ Bảo vệ";

    }

    return roles;

}

module.exports = { getRoles };
