/* eslint-disable @typescript-eslint/no-require-imports */

const { existsSync, readFileSync } = require("fs");
const { createServer } = require("http");
const { join } = require("path");
const next = require("next");

function loadProductionEnv() {
    const envPath = join(__dirname, ".env.production");

    if (!existsSync(envPath)) {
        return;
    }

    const envFile = readFileSync(envPath, "utf8");

    for (const line of envFile.split(/\r?\n/)) {
        const trimmedLine = line.trim();

        if (!trimmedLine || trimmedLine.startsWith("#")) {
            continue;
        }

        const separatorIndex = trimmedLine.indexOf("=");

        if (separatorIndex === -1) {
            continue;
        }

        const key = trimmedLine.slice(0, separatorIndex).trim();
        let value = trimmedLine.slice(separatorIndex + 1).trim();

        if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
        ) {
            value = value.slice(1, -1);
        }

        if (key && process.env[key] === undefined) {
            process.env[key] = value;
        }
    }
}

loadProductionEnv();

const dev = process.env.NODE_ENV !== "production";
const hostname = "127.0.0.1";
const port = Number(process.env.PORT || 3000);
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    createServer((request, response) => {
        handle(request, response);
    }).listen(port, hostname, () => {
        console.log(`The Cave is running on http://${hostname}:${port}`);
    });
});
